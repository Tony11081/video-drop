import sys, subprocess, pathlib, io
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).parent.resolve(); OUT = ROOT / "out"; FPS = 30
MODE = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--force-color-profile=srgb", "--font-render-hinting=none"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    pg.goto((ROOT / "reel.html").as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
    total = pg.evaluate("TOTAL")
    if MODE == "sheet":
        from PIL import Image
        times = [float(x) for x in sys.argv[2:]]
        w, h = 270, 480; cols = min(8, len(times)); rows = (len(times) + cols - 1) // cols
        sheet = Image.new("RGB", (w * cols, h * rows), "white")
        for i, t in enumerate(times):
            pg.evaluate(f"seek({t})")
            im = Image.open(io.BytesIO(pg.screenshot(type="jpeg", quality=92))).convert("RGB")
            sheet.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
        sheet.save(OUT / "sheet.jpg", quality=88)
    else:
        tmp = OUT / "picture.tmp.mp4"
        ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(tmp)], stdin=subprocess.PIPE)
        n = round(total * FPS)
        for f in range(n):
            pg.evaluate(f"seek({f / FPS})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
            if f % 150 == 0: print(f, n, flush=True)
        ff.stdin.close(); rc = ff.wait()
        if rc == 0: tmp.rename(OUT / "picture.mp4")
        print("done", rc)
    b.close()
