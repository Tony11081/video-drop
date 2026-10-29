#!/usr/bin/env python3
"""科普治愈模板渲染。
  python3 render.py <look> frames [t1 t2 ...]   抽几帧出联系表 out/<look>-frames.png
  python3 render.py <look> video               出无声样片 out/<look>-demo.mp4（1080×1920 30fps）
  python3 render.py all frames|video           五套一起
look: notes / blueprint / dawn / ink / poster
"""
import sys, os, subprocess, pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
LOOKS = ['notes', 'blueprint', 'dawn', 'ink', 'poster']
FPS = 30

def open_page(pw, look):
    b = pw.chromium.launch(); p = b.new_page(viewport={'width': 1080, 'height': 1920})
    p.on('pageerror', lambda e: (print('PAGEERR', e), sys.exit(1)))
    p.goto(f'file://{HERE}/template.html?look={look}')
    p.evaluate('document.fonts.ready')
    return b, p

def frames(look, times):
    with sync_playwright() as pw:
        b, p = open_page(pw, look); paths = []
        for t in times:
            p.evaluate(f'seek({int(t * FPS)})'); p.evaluate('renderFrame()')
            f = OUT / f'{look}-{t:05.2f}.jpg'; p.locator('#c').screenshot(path=str(f), type='jpeg', quality=88); paths.append(f)
        b.close()
    sheet = OUT / f'{look}-frames.png'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + sum([['-i', str(x)] for x in paths], []) + ['-filter_complex', f'hstack={len(paths)},scale=iw/3:-1', str(sheet)], check=True)
    for x in paths: x.unlink()
    print('frames ->', sheet)

def video(look):
    out = OUT / f'{look}-demo.mp4'
    with sync_playwright() as pw:
        b, p = open_page(pw, look); n = p.evaluate('TOTAL')
        ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out)], stdin=subprocess.PIPE)
        for i in range(n):
            p.evaluate('renderFrame()'); ff.stdin.write(p.locator('#c').screenshot(type='jpeg', quality=90))
        ff.stdin.close(); ff.wait(); b.close()
    print('video ->', out, n, 'frames')

if __name__ == '__main__':
    look, mode = sys.argv[1], sys.argv[2]
    looks = LOOKS if look == 'all' else [look]
    for lk in looks:
        if mode == 'frames': frames(lk, [float(x) for x in sys.argv[3:]] or [1.5, 4.0, 6.2, 8.5])
        else: video(lk)
