#!/usr/bin/env python3
"""渲染驱动：无头 Chromium（SwiftShader）+ 本地服务器收帧。

用法：
  python3 render.py m001 stills 0,2.5,6.2        # 指定时刻的静帧 → out/m001/still_*.png + 联系表
  python3 render.py m001 keys                     # 节拍表里 keyframes 列出的时刻
  python3 render.py m001 preview [scale]          # 低清预览（每帧 1 个子帧，默认 0.4 倍）→ out/m001/preview.mp4
  python3 render.py m001 video [from] [to]        # 全分辨率成片画面（按节拍表子帧数）→ out/m001/picture.mp4
                                                  #   可分段：from/to 为帧号，输出 part_from_to.mp4
"""
import asyncio, json, os, subprocess, sys, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from urllib.parse import urlparse, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
ep, mode = sys.argv[1], sys.argv[2]
cue = json.load(open(os.path.join(HERE, 'episodes', ep + '.json'), encoding='utf-8'))
OUT = os.path.join(HERE, 'out', ep); os.makedirs(OUT, exist_ok=True)
W0, H0, FPS = cue['width'], cue['height'], cue['fps']
NFRAMES = int(round(cue['duration'] * FPS))

scale = 1.0
if mode == 'preview': scale = float(sys.argv[3]) if len(sys.argv) > 3 else 0.4
if mode in ('stills', 'keys') and len(sys.argv) > 4: scale = float(sys.argv[4])
W, H = int(round(W0 * scale / 2) * 2), int(round(H0 * scale / 2) * 2)

sink = {'fn': None}

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
    def do_POST(self):
        q = parse_qs(urlparse(self.path).query); i = int(q['i'][0])
        n = int(self.headers['Content-Length']); data = self.rfile.read(n)
        sink['fn'](i, data)
        self.send_response(200); self.end_headers(); self.wfile.write(b'ok')

srv = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=HERE))
PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

def flip(data):
    row = W * 4
    return b''.join(data[(H - 1 - y) * row:(H - y) * row] for y in range(H))

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-watchdog'])
        pg = await b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
        await pg.goto(f'http://127.0.0.1:{PORT}/index.html?ep={ep}&w={W}&h={H}')
        try:
            await pg.wait_for_function('window.ready === true', timeout=600000)
        except Exception:
            print('\n'.join(errs[:30])); raise
        print('build ms', await pg.evaluate('window.buildMs'), 'size', W, H, flush=True)
        for e in errs[:12]: print('console:', e[:300])

        if mode in ('stills', 'keys'):
            from PIL import Image
            times = [float(x) for x in sys.argv[3].split(',')] if mode == 'stills' else cue['keyframes']
            shots = []
            def save(i, data):
                img = Image.frombytes('RGBA', (W, H), flip(data)).convert('RGB')
                path = os.path.join(OUT, f'still_{i:04d}.png'); img.save(path); shots.append((i, path))
            sink['fn'] = save
            for t in times:
                i = int(round(t * FPS))
                r = await pg.evaluate(f'renderAndSend({i})')
                print(f'frame {i} t={i/FPS:.2f} {r["ms"]:.0f} ms sub={r["sub"]}', flush=True)
            # 联系表
            cols = 4; th = 480; tw = int(th * W / H)
            rows = (len(shots) + cols - 1) // cols
            sheet = Image.new('RGB', (cols * tw, rows * (th + 34)), (24, 24, 24))
            from PIL import ImageDraw
            d = ImageDraw.Draw(sheet)
            for k, (i, path) in enumerate(sorted(shots)):
                im = Image.open(path).resize((tw, th), Image.LANCZOS)
                x, y = (k % cols) * tw, (k // cols) * (th + 34)
                sheet.paste(im, (x, y + 34)); d.text((x + 8, y + 8), f'{i/FPS:.2f}s  f{i}', fill=(255, 255, 255))
            sheet.save(os.path.join(OUT, 'contact.png')); print('contact', os.path.join(OUT, 'contact.png'))
        else:
            a = int(sys.argv[3]) if mode == 'video' and len(sys.argv) > 3 else 0
            z = int(sys.argv[4]) if mode == 'video' and len(sys.argv) > 4 else NFRAMES
            name = 'preview.mp4' if mode == 'preview' else ('picture.mp4' if (a, z) == (0, NFRAMES) else f'part_{a:04d}_{z:04d}.mp4')
            out = os.path.join(OUT, name)
            ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                                   '-vf', 'vflip', '-c:v', 'libx264', '-preset', 'medium' if mode == 'video' else 'veryfast', '-crf', '14' if mode == 'video' else '22',
                                   '-pix_fmt', 'yuv420p', '-r', str(FPS), out], stdin=subprocess.PIPE)
            def push(i, data): ff.stdin.write(data)
            sink['fn'] = push
            t0 = time.time()
            for i in range(a, z):
                r = await pg.evaluate(f'renderAndSend({i}, {1 if mode == "preview" else 0})')
                if i % 10 == 0 or i == z - 1:
                    el = time.time() - t0; done = i - a + 1
                    print(f'frame {i}/{z} {r["ms"]:.0f} ms sub={r["sub"]} elapsed {el/60:.1f} min eta {(el/done)*(z-a-done)/60:.1f} min', flush=True)
            ff.stdin.close(); ff.wait(); print('wrote', out)
        for e in errs[12:40]: print('console:', e[:300])
        await b.close()

asyncio.run(main())
srv.shutdown()
