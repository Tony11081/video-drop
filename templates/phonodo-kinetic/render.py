#!/usr/bin/env python3
"""python3 render.py keys            -> out/keys.jpg contact sheet
   python3 render.py video [i ...]   -> out/scene-N.mp4 per scene, then out/picture.mp4"""
import sys, os, subprocess, io
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

H = Path(__file__).parent; OUT = H / 'out'; OUT.mkdir(exist_ok=True)
FPS = 30; SPB = 0.5
CUTS = [0, 4, 8, 16, 24, 32, 40, 44, 52]  # beats
KEYS = [0.4, 2.6, 3.5, 6.6, 7.6, 9.5, 12.8, 14.3, 19.4, 21.5, 23.3, 27.6, 31.4, 33.4, 36.4, 40.3, 41.8, 46.0, 49.5]

def main():
    mode = sys.argv[1]
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto((H / 'index.html').as_uri()); pg.evaluate('document.fonts.ready')
        if mode == 'keys':
            ims = []
            for b in KEYS:
                pg.evaluate(f'render({b * SPB})')
                ims.append(Image.open(io.BytesIO(pg.screenshot(type='jpeg', quality=85))).resize((270, 480)))
            cols = 7; rows = -(-len(ims) // cols)
            sheet = Image.new('RGB', (cols * 274, rows * 484), 'black')
            for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * 274, (i // cols) * 484))
            sheet.save(OUT / 'keys.jpg', quality=85); print('keys', len(ims)); return
        which = [int(x) for x in sys.argv[2:]] or list(range(len(CUTS) - 1))
        for i in which:
            f0, f1 = round(CUTS[i] * SPB * FPS), round(CUTS[i + 1] * SPB * FPS)
            tmp = OUT / f'scene-{i}.tmp.mp4'
            ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                                   '-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', str(tmp)], stdin=subprocess.PIPE)
            for f in range(f0, f1):
                pg.evaluate(f'render({f / FPS})')
                ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
            ff.stdin.close()
            if ff.wait() == 0: os.replace(tmp, OUT / f'scene-{i}.mp4'); print('scene', i, f1 - f0, flush=True)
        br.close()
    lst = OUT / 'list.txt'; lst.write_text(''.join(f"file 'scene-{i}.mp4'\n" for i in range(len(CUTS) - 1)))
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(OUT / 'picture.mp4')])
    print('picture.mp4')

main()
