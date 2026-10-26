"""Render a Policy Brief episode.
   python3 render.py ep002 sheet 1.5 8 20 ...   -> out/ep002/sheet.jpg (and frame.png when one time)
   python3 render.py ep002 video                 -> out/ep002/picture.mp4 + timing.json (silent, voice timeline)
   python3 render.py ep002 timing                -> out/ep002/timing.json only
"""
import sys, subprocess, pathlib, json, io
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).parent.resolve()
EP, MODE = sys.argv[1], sys.argv[2]
URL = (ROOT / "template.html").as_uri() + "?ep=" + EP
OUT = ROOT / "out" / EP
OUT.mkdir(parents=True, exist_ok=True)


def page_ctx(p):
    b = p.chromium.launch(args=["--force-color-profile=srgb", "--font-render-hinting=none"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL)
    try:
        pg.wait_for_function("window.TOTAL > 0", timeout=15000)
    except Exception:
        raise SystemExit("page failed: " + "; ".join(errs))
    pg.evaluate("document.fonts.ready")
    pg.wait_for_timeout(400)
    return b, pg


def write_timing(pg):
    d = pg.evaluate("({total: TOTAL, speed: EP.speed, at: VOICE_AT, sfx: SFX, events: EVENTS, scenes: SCENES, follow: FOLLOW_AT, overlays: OVERLAYS, caps: CAPS})")
    (OUT / "timing.json").write_text(json.dumps(d, ensure_ascii=False, indent=1))
    return d


def sheet(times):
    from PIL import Image
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        write_timing(pg)
        shots = []
        for t in times:
            pg.evaluate(f"seek({t})")
            shots.append(Image.open(io.BytesIO(pg.screenshot(type="png"))).convert("RGB"))
        b.close()
    w, h = 360, 640
    cols = min(6, len(shots)); rows = (len(shots) + cols - 1) // cols
    out = Image.new("RGB", (w * cols, h * rows), "white")
    for i, im in enumerate(shots):
        out.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
    out.save(OUT / "sheet.jpg", quality=88)
    if len(shots) == 1:
        shots[0].save(OUT / "frame.png")


def video(fps=30):
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        d = write_timing(pg)
        if MODE == "timing":
            b.close(); return
        n = int(d["total"] * fps)
        ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                               str(OUT / "picture.mp4")], stdin=subprocess.PIPE)
        for f in range(n):
            pg.evaluate(f"seek({f / fps})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=93))
            if f % 300 == 0:
                print(f"{EP} {f}/{n}", flush=True)
        ff.stdin.close(); ff.wait(); b.close()
    print(EP, "done", round(d["total"], 2), flush=True)


if __name__ == "__main__":
    if MODE == "sheet":
        sheet([float(x) for x in sys.argv[3:]])
    elif MODE == "auto":
        with sync_playwright() as p:
            b, pg = page_ctx(p)
            sc = pg.evaluate("SCENES"); b.close()
        sheet([round(a + 0.85 * (e - a), 2) for a, e, _ in sc])
    else:
        video()
