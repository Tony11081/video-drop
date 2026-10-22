"""Render the Policy Brief template.
   python3 render.py sheet t1 t2 ...   -> sheet.jpg contact sheet of those voice-times
   python3 render.py video [fps]       -> out/picture.mp4 (silent, voice timeline)
"""
import sys, subprocess, pathlib, json
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).parent.resolve()
URL = (ROOT / "template.html").as_uri()


def page_ctx(p):
    b = p.chromium.launch(args=["--force-color-profile=srgb", "--font-render-hinting=none"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    pg.goto(URL)
    pg.wait_for_function("window.TOTAL > 0")
    pg.evaluate("document.fonts.ready")
    pg.wait_for_timeout(400)
    return b, pg


def sheet(times):
    from PIL import Image
    import io
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        shots = []
        for t in times:
            pg.evaluate(f"seek({t})")
            shots.append(Image.open(io.BytesIO(pg.screenshot(type="png"))).convert("RGB"))
        b.close()
    w = 360; h = 640; cols = min(6, len(shots)); rows = (len(shots) + cols - 1) // cols
    out = Image.new("RGB", (w * cols, h * rows), "white")
    for i, im in enumerate(shots):
        out.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
    out.save(ROOT / "sheet.jpg", quality=88)
    if len(shots) == 1:
        shots[0].save(ROOT / "frame.png")


def video(fps=30):
    out = ROOT / "out"; out.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        total = pg.evaluate("TOTAL"); at = pg.evaluate("VOICE_AT")
        (out / "timing.json").write_text(json.dumps({"total": total, "at": at, "sfx": pg.evaluate("SFX")}))
        if len(sys.argv) > 3 and sys.argv[3] == "timing":
            b.close(); return
        n = int(total * fps)
        ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                               str(out / "picture.mp4")], stdin=subprocess.PIPE)
        for f in range(n):
            pg.evaluate(f"seek({f / fps})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=95))
            if f % 300 == 0:
                print(f"{f}/{n}", flush=True)
        ff.stdin.close(); ff.wait(); b.close()
    print("done", total)


if __name__ == "__main__":
    if sys.argv[1] == "sheet":
        sheet([float(x) for x in sys.argv[2:]])
    else:
        video(int(sys.argv[2]) if len(sys.argv) > 2 else 30)
