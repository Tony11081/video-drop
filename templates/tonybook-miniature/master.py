#!/usr/bin/env python3
"""母带 + 合成成片 + 实测：
- 混音按 ffmpeg ebur128 实测调到 −14 LUFS，前瞻真峰值限幅；
- 与 picture.mp4 合成 video.mp4（H.264 原样复制 + AAC 48 kHz 立体声）；
- 在 video.mp4 上重测响度与 AAC 解码后的 true peak，超标就压低天花板重做。
用法：python3 master.py m001 [picture.mp4 路径]
"""
import json, os, re, subprocess, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
ep = sys.argv[1]; OUT = os.path.join(HERE, 'out', ep)
cue = json.load(open(os.path.join(HERE, 'episodes', ep + '.json'), encoding='utf-8'))
pic = sys.argv[2] if len(sys.argv) > 2 else os.path.join(OUT, 'picture.mp4')
SR = 48000; TARGET = -14.0

def loud(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); P = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
    return I, P

def limiter(x, ceil_db):
    ceil = 10 ** (ceil_db / 20)
    up = signal.resample_poly(x, 4, 1, axis=1)
    pk = np.max(np.abs(up), axis=0).reshape(-1, 4).max(axis=1)[: x.shape[1]]
    g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    la = int(0.003 * SR)  # 3 ms 前瞻
    # 用滑动最小值实现前瞻
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(g, size=2 * la + 1, mode='nearest')
    # 释放：单极点平滑（只在放开时平滑，压下立即）
    rel = np.exp(-1 / (0.06 * SR)); out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else g[i] + (cur - g[i]) * rel
        out[i] = cur
    att = signal.lfilter([1 - np.exp(-1 / (0.0015 * SR))], [1, -np.exp(-1 / (0.0015 * SR))], out)
    att = np.minimum(att, out)  # 平滑但不超过所需增益
    return x * att

sr, music = wavfile.read(os.path.join(OUT, 'music.wav')); _, sfx = wavfile.read(os.path.join(OUT, 'sfx.wav'))
music = music.T.astype(np.float64); sfx = sfx.T.astype(np.float64)
mix = music + sfx
tmp = os.path.join(OUT, '_tmp.wav')
wavfile.write(tmp, SR, mix.T.astype(np.float32)); I0, _ = loud(tmp)
gain = 10 ** ((TARGET - I0) / 20)
ceil = -2.0
for attempt in range(6):
    m = limiter(mix * gain, ceil)
    wavfile.write(tmp, SR, m.T.astype(np.float32)); I, P = loud(tmp)
    gain *= 10 ** ((TARGET - I) / 20)  # 限幅会吃掉一点响度，补回
    m = limiter(mix * gain, ceil)
    master = os.path.join(OUT, 'master.wav'); wavfile.write(master, SR, m.T.astype(np.float32))
    video = os.path.join(OUT, 'video.mp4')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', pic, '-i', master, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', video], check=True)
    Iv, Pv = loud(video)
    print(f'attempt {attempt}: ceiling {ceil:.1f} dBFS → video.mp4 I={Iv:.2f} LUFS, true peak (after AAC)={Pv:.2f} dBTP')
    if Pv <= -1.0 and abs(Iv - TARGET) <= 0.5: break
    if Pv > -1.0: ceil -= (Pv + 1.0) + 0.3
    gain *= 10 ** ((TARGET - Iv) / 20)
# 按同样增益导出两条分轨，单独测
wavfile.write(os.path.join(OUT, 'stem_sfx.wav'), SR, (sfx * gain).T.astype(np.float32))
wavfile.write(os.path.join(OUT, 'stem_music.wav'), SR, (music * gain).T.astype(np.float32))
Is, _ = loud(os.path.join(OUT, 'stem_sfx.wav')); Im, _ = loud(os.path.join(OUT, 'stem_music.wav'))
os.remove(tmp)
json.dump({'video_I': Iv, 'video_TP_after_aac': Pv, 'sfx_stem_I': Is, 'music_stem_I': Im, 'ceiling': ceil}, open(os.path.join(OUT, 'loudness.json'), 'w'), indent=1)
print(f'sfx stem {Is:.1f} LUFS, music stem {Im:.1f} LUFS')
