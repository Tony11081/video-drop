"""Render an episode in the No.63 Policy Desk look.
   python3 render.py ep029 sheet 1.5 8 20 ...   -> out/ep029/sheet.jpg (and frame.png when one time)
   python3 render.py ep029 auto                  -> one frame per scene (contact sheet)
   python3 render.py ep029 video                 -> out/ep029/picture.mp4 + timing.json (silent, voice timeline)
   python3 render.py ep029 timing                -> out/ep029/timing.json only
Episode configs: episodes/epNNN.js here, else ../policy-brief/episodes/epNNN.js (same schema).
`video` renders two halves in parallel (two-core box) and joins them without re-encoding.
"""
import sys, subprocess, pathlib, json, io, os
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).parent.resolve()
EP, MODE = sys.argv[1], sys.argv[2]
DIR = "episodes" if (ROOT / "episodes" / f"{EP}.js").exists() else "../policy-brief/episodes"
URL = (ROOT / "template.html").as_uri() + f"?ep={EP}&dir={DIR}"
OUT = ROOT / "out" / EP
OUT.mkdir(parents=True, exist_ok=True)
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p"]


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


def part(f0, f1, dst):
    """frames [f0, f1) -> dst (written under a temporary name, renamed when ffmpeg exits 0)"""
    tmp = dst.with_name(dst.stem + ".tmp.mp4")
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               *ENC, str(tmp)], stdin=subprocess.PIPE)
        for f in range(f0, f1):
            pg.evaluate(f"seek({f / FPS})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=93))
            if (f - f0) % 300 == 0:
                print(f"{EP} {f}/{f1}", flush=True)
        ff.stdin.close(); rc = ff.wait(); b.close()
    if rc != 0:
        raise SystemExit(f"ffmpeg failed on {dst.name}")
    tmp.rename(dst)


def video():
    with sync_playwright() as p:
        b, pg = page_ctx(p)
        d = write_timing(pg); b.close()
    if MODE == "timing":
        return
    n = int(d["total"] * FPS); mid = n // 2
    parts = [OUT / "part0.mp4", OUT / "part1.mp4"]
    for q in parts:
        q.unlink(missing_ok=True)
    procs = [subprocess.Popen([sys.executable, __file__, EP, "part", str(a), str(e), str(q)])
             for (a, e), q in zip([(0, mid), (mid, n)], parts)]
    if any(pr.wait() != 0 for pr in procs):
        raise SystemExit("a part failed")
    lst = OUT / "parts.txt"
    lst.write_text("".join(f"file '{q.name}'\n" for q in parts))
    tmp = OUT / "picture.tmp.mp4"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", "-movflags", "+faststart", str(tmp)], check=True)
    tmp.rename(OUT / "picture.mp4")
    for q in parts + [lst]:
        q.unlink()
    print(EP, "done", round(d["total"], 2), flush=True)


if __name__ == "__main__":
    if MODE == "sheet":
        sheet([float(x) for x in sys.argv[3:]])
    elif MODE == "auto":
        with sync_playwright() as p:
            b, pg = page_ctx(p)
            sc = pg.evaluate("SCENES"); b.close()
        sheet([round(a + 0.85 * (e - a), 2) for a, e, _ in sc])
    elif MODE == "part":
        part(int(sys.argv[3]), int(sys.argv[4]), pathlib.Path(sys.argv[5]))
    else:
        video()
