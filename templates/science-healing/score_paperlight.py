"""纸光样片配乐（20 s）：铺底 + 立体书展开的纸声 + 同步时的风铃与低频呼吸。全部数学合成。
用法：python3 score_paperlight.py  → out/paperlight-score.wav
"""
import json, numpy as np, wave, pathlib
from scipy.signal import fftconvolve, butter, sosfilt
HERE = pathlib.Path(__file__).resolve().parent; OUT = HERE / 'out'
SR = 44100; D = 20.0; N = int(SR * D); rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def put(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR); sig = sig[:N - i] * gain
    if i >= N or len(sig) == 0: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * l * 1.414; R[i:i + len(sig)] += sig * r * 1.414
def env(n, a, r):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR)); e[:na] = np.linspace(0, 1, na) ** 2; e[-nr:] *= np.linspace(1, 0, nr) ** 1.5; return e
def lp(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def pad(notes, t0, t1, amp=0.05, att=1.8, rel=2.0, bright=0.6):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for m in notes:
        f = hz(m)
        for det in (-0.2, 0.0, 0.2):
            ph = rng.uniform(0, 6.3); w = 2 * np.pi * (f + det) * t + ph; out += np.sin(w + 0.003 * np.sin(2 * np.pi * 0.2 * t)) + 0.2 * bright * np.sin(2 * w)
    put(out * env(n, att, rel) * amp / len(notes) ** 0.5, t0)
def piano(m, t, amp=0.12, dur=4.0, pan=0.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = hz(m); out = np.zeros(n)
    for k, (a, dec) in enumerate([(1, 2.2), (0.4, 1.1), (0.18, 0.6), (0.08, 0.35)]): out += a * np.sin(2 * np.pi * f * (k + 1) * (1 + 0.0004 * k * k) * tt) * np.exp(-tt / dec)
    out *= (1 - np.exp(-tt / 0.004)); put(lp(out, 5000) * amp, t, pan)
def chime(m, t, amp=0.06, pan=0.0):
    n = int(3.5 * SR); tt = np.arange(n) / SR; f = hz(m)
    out = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 1.4) + 0.3 * np.sin(2 * np.pi * f * 2.756 * tt) * np.exp(-tt / 0.5)
    put(out * (1 - np.exp(-tt / 0.003)) * amp, t, pan)
def thump(t, amp=0.2, f0=62, f1=42, dec=0.12):
    n = int(0.6 * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / 0.05); ph = 2 * np.pi * np.cumsum(f) / SR
    put(np.sin(ph) * np.exp(-tt / dec) * (1 - np.exp(-tt / 0.004)) * amp, t)
def paper_pop(t, amp=0.09, pan=0.0):  # 纸弹起：短促的低频噗 + 纸张摩擦
    n = int(0.35 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * (140 * np.exp(-tt * 18) + 60) * tt) * np.exp(-tt / 0.045)
    rustle = bp(rng.standard_normal(n), 1200, 6000) * np.exp(-tt / 0.08) * 0.35
    put((body + rustle) * (1 - np.exp(-tt / 0.002)) * amp, t, pan)
def pluck(m, t, amp=0.04, pan=0.0):
    n = int(1.2 * SR); tt = np.arange(n) / SR; f = hz(m)
    put((np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / 0.08)) * np.exp(-tt / 0.3) * (1 - np.exp(-tt / 0.002)) * amp, t, pan)

ev = json.load(open(OUT / 'paperlight-events.json')); syncs = [e['t'] for e in ev if e['type'] == 'sync']
# 立体书展开
for i, t in enumerate([0.15, 0.29, 0.41, 0.55, 0.70, 0.87]): paper_pop(t, 0.08 + i * 0.012, (i % 2 - 0.5) * 0.6)
# 铺底：D 大调，随段落换和弦
Dmaj9 = [38, 50, 54, 57, 61, 64]; Gmaj7 = [31, 43, 50, 54, 59, 62]; Bm7 = [35, 47, 50, 54, 57, 62]; Em9 = [40, 52, 55, 59, 62, 66]; A_Cs = [37, 49, 52, 57, 61, 64]
pad(Dmaj9, 0.3, 5.4, 0.055, 2.4, 1.6); pad(Gmaj7, 4.6, 9.2, 0.05, 1.4, 1.4); pad(Em9, 8.4, 13.4, 0.05, 1.4, 1.4); pad(A_Cs, 12.6, 16.9, 0.06, 1.2, 1.2, 0.9); pad(Dmaj9, 16.2, 20.0, 0.07, 1.2, 3.0, 0.9)
# 钢琴主题
for t, m in [(1.0, 78), (2.3, 76), (3.6, 73), (5.0, 71), (6.4, 74), (8.8, 76), (10.2, 78), (12.0, 73)]: piano(m, t, 0.09, pan=0.15)
piano(62, 1.0, 0.06); piano(57, 5.0, 0.05); piano(59, 8.8, 0.05)
# 各闪各的：零散拨弦
t = 4.2; pent = [74, 76, 78, 81, 83, 86]
while t < 11.0: pluck(int(rng.choice(pent)), t, 0.028, rng.uniform(-0.8, 0.8)); t += rng.uniform(0.18, 0.55)
# 同步：风铃 + 心跳
mel = [81, 78, 83, 81, 86, 85, 81]
for k, ts in enumerate(syncs): chime(mel[k % len(mel)], ts, 0.055, 0.15 * (-1) ** k); chime(74, ts + 0.01, 0.03, -0.2); thump(ts, 0.17)
piano(66, 13.6, 0.11); piano(74, 13.6, 0.09); piano(81, 13.61, 0.07)
for t, m in [(16.8, 78), (17.6, 81), (18.4, 83), (19.2, 81)]: piano(m, t, 0.09, pan=0.1)
piano(50, 17.6, 0.07); piano(57, 17.6, 0.05)
# 混响
irn = int(2.6 * SR); it = np.arange(irn) / SR
def ir(): x = rng.standard_normal(irn) * np.exp(-it / 0.7); x[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR)); return lp(x, 6000) / np.sqrt(np.sum(x ** 2))
wl = fftconvolve(L, ir())[:N]; wr = fftconvolve(R, ir())[:N]
oL = 0.72 * L + 0.55 * wl; oR = 0.72 * R + 0.55 * wr
fade = np.ones(N); fade[:int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR)); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
oL *= fade; oR *= fade; pk = max(np.max(np.abs(oL)), np.max(np.abs(oR))); oL *= 0.88 / pk; oR *= 0.88 / pk
st = np.stack([oL, oR], 1); w = wave.open(str(OUT / 'paperlight-score.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes()); w.close(); print('ok')
