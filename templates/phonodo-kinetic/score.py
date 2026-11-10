#!/usr/bin/env python3
"""Original score for the Phonodo kinetic promo: 120 BPM, 52 beats (26 s). Everything lands on the picture's beats.
   python3 score.py -> out/score.wav"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt

SR = 44100; SPB = 0.5; BEATS = 52; N = int(BEATS * SPB * SR) + SR // 2
rng = np.random.default_rng(7)
T = lambda b: int(round(b * SPB * SR))
mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def filt(x, kind, fc, order=2):
    return sosfilt(butter(order, np.array(fc) / (SR / 2), kind, output='sos'), x)
def place(dst, x, b, gain=1.0, pan=0.0):
    i = T(b); n = min(len(x), N - i)
    if n <= 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    dst[0, i:i + n] += x[:n] * gain * l * 1.414; dst[1, i:i + n] += x[:n] * gain * r * 1.414
def tt(dur): return np.arange(int(dur * SR)) / SR

def kick(dur=0.32):
    t = tt(dur); f = 48 + 110 * np.exp(-t * 34)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + 0.25 * filt(rng.standard_normal(len(t)), 'high', 3000) * np.exp(-t * 120)
def clap(dur=0.22):
    t = tt(dur); n = filt(rng.standard_normal(len(t)), 'band', [900, 3800])
    e = sum(np.exp(-np.maximum(t - d, 0) * 55) * (t >= d) for d in (0, 0.011, 0.023)) / 2
    return n * e
def hat(dur=0.05, o=False):
    t = tt(0.22 if o else dur); return filt(rng.standard_normal(len(t)), 'high', 7500) * np.exp(-t * (16 if o else 70))
def bass(f, dur):
    t = tt(dur); ph = 2 * np.pi * f * t
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    x = filt(x, 'low', 420, 4); return x * np.minimum(t * 200, 1) * np.exp(-t * 3.2)
def pluck(f, dur=0.32, br=1.0):
    t = tt(dur); ph = 2 * np.pi * f * t
    x = sum(np.sin(k * ph) * np.exp(-t * (6 + k * 5 / br)) / k for k in range(1, 7))
    return x * np.minimum(t * 400, 1)
def pad(freqs, dur):
    t = tt(dur); x = np.zeros(len(t))
    for f in freqs:
        for d in (-0.35, 0, 0.35): x += np.sin(2 * np.pi * (f * 2 ** (d / 12 / 4)) * t + rng.uniform(0, 6))
        x += 0.4 * np.sin(2 * np.pi * 2 * f * t)
    e = np.minimum(t * 3, 1) * np.minimum((dur - t) * 4, 1)
    return filt(x, 'low', 2400) * e / len(freqs)
def impact(dur=1.4):
    t = tt(dur); f = 38 + 70 * np.exp(-t * 12)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) + 0.5 * filt(rng.standard_normal(len(t)), 'low', 1800) * np.exp(-t * 9)
def riser(dur):
    t = tt(dur); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); k = 2048
    for i in range(0, len(t) - k, k // 2):
        fc = 300 + 7000 * (i / len(t)) ** 2
        out[i:i + k] += filt(n[i:i + k], 'band', [fc, fc * 1.6]) * np.hanning(k)
    return out * (t / dur) ** 2
def whoosh(dur=0.5):
    t = tt(dur); return filt(rng.standard_normal(len(t)), 'band', [500, 5000]) * np.sin(np.pi * t / dur) ** 2
def ding(f, dur=0.6):
    t = tt(dur); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t) + 0.25 * np.sin(2 * np.pi * f * 3.02 * t)) * np.exp(-t * 7)
def tick():
    t = tt(0.05); return filt(rng.standard_normal(len(t)), 'band', [2500, 6000]) * np.exp(-t * 90)

drums = np.zeros((2, N)); mus = np.zeros((2, N)); fx = np.zeros((2, N)); duck = np.ones(N)
# chords per 4-beat bar from beat 8: Am F C G
CH = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]

# intro: one hit per word (beats 0-3, 4-6), riser into 4 and 8
for b in (0, 1, 2): place(drums, impact(0.9), b, 0.75)
place(drums, clap(), 3, 0.9); place(fx, whoosh(0.35), 2.7, 0.5)
place(fx, riser(1.0), 3.0, 0.5)
for b in (4, 5, 6): place(drums, impact(1.2), b, 0.95)
place(fx, ding(mtof(84)), 7, 0.3); place(fx, riser(1.0), 7.0, 0.6)
for i, b in enumerate(np.arange(7, 8, 0.25)): place(drums, clap(0.12), b, 0.35 + 0.12 * i)
place(mus, pad([mtof(m) for m in (45, 57, 64)], 4.0), 0, 0.10); place(mus, pad([mtof(m) for m in (41, 53, 60)], 4.0), 4, 0.12)

# main groove beats 8-40
for b in range(8, 40):
    place(drums, kick(), b, 1.0); i = T(b); n = int(0.24 * SR); duck[i:i + n] = np.minimum(duck[i:i + n], 0.35 + 0.65 * np.linspace(0, 1, n) ** 1.5)
    if b % 2 == 1: place(drums, clap(), b, 0.8)
    place(drums, hat(o=(b % 4 == 3)), b + 0.5, 0.42, 0.25)
    if b >= 16:
        for q in (0.25, 0.75): place(drums, hat(), b + q, 0.2, -0.3)
    root, tri = CH[((b - 8) // 4) % 4]
    for q in (0, 0.5): place(mus, bass(mtof(root if not (q and b % 4 == 3) else root + 12), 0.24), b + q, 0.5)
    if b >= 16:
        seq = [tri[0] + 12, tri[1] + 12, tri[2] + 12, tri[1] + 24] if b < 32 else [tri[2] + 12, tri[0] + 24, tri[1] + 24, tri[2] + 24]
        for k, m in enumerate(seq): place(mus, pluck(mtof(m), 0.3, 1.0 if b < 32 else 1.5), b + k * 0.25, 0.16 if b < 24 else 0.2, (-0.5, 0.5, -0.2, 0.3)[k])
    if b % 4 == 0: place(mus, pad([mtof(m) for m in tri], 2.05), b, 0.13 if b < 24 else 0.16)
for b in (8, 16, 24, 32):
    place(drums, impact(1.0), b, 0.55); place(fx, whoosh(0.5), b - 0.5, 0.45)
    for q in (0.5, 0.75): place(drums, clap(0.12), b - 1 + q, 0.5)
# picture sfx
place(fx, ding(mtof(81)), 12, 0.28, -0.3); place(fx, ding(mtof(88)), 14, 0.36); place(fx, ding(mtof(93), 0.4), 14.12, 0.25)
for b, m in ((17, 76), (19, 79), (21, 83)): place(fx, ding(mtof(m), 0.5), b, 0.3, 0.3)
place(fx, ding(mtof(88)), 23, 0.3)
for b in (25, 26, 27):
    for q in np.arange(0, 0.7, 0.09): place(fx, tick(), b + q, 0.16, -0.2)
for b, m in ((29, 84), (30, 86), (31, 88)): place(fx, ding(mtof(m), 0.35), b, 0.3, 0.2)
for b in range(33, 40): place(fx, tick(), b + 0.3, 0.3)

# montage 40-44: kick on every half beat, snare roll, riser
place(fx, riser(2.0), 40, 0.75)
for k in range(8):
    b = 40 + k * 0.5; place(drums, kick(0.22), b, 1.0); place(drums, clap(0.14), b, 0.45 + 0.05 * k)
    place(mus, bass(mtof(45 + (0, 0, 3, 3, 5, 5, 7, 10)[k]), 0.22), b, 0.5)
for b in np.arange(43, 44, 0.125): place(drums, clap(0.08), b, 0.3 + 0.5 * (b - 43))

# end 44-52: big hit, C major chord, sparkles on the word slams
place(drums, impact(2.6), 44, 1.25); place(drums, kick(0.5), 44, 1.0)
place(mus, pad([mtof(m) for m in (48, 55, 60, 64, 67, 72)], 4.3), 44, 0.34)
place(mus, bass(mtof(36), 3.0), 44, 0.6)
for b, m in ((45, 84), (46, 88), (46.5, 91), (47.5, 96)): place(fx, ding(mtof(m), 1.4), b, 0.3, 0.2); place(drums, impact(0.7), b, 0.4)
for k, m in enumerate((72, 76, 79, 84, 88, 91, 96)): place(mus, pluck(mtof(m), 0.9, 2), 44 + k * 0.125, 0.14, -0.6 + k * 0.2)

mus *= duck
mixd = drums * 0.62 + mus * 1.0 + fx * 0.8
# light stereo slapback on music/fx for width
d = int(0.1875 * SR); wet = np.zeros_like(mixd); wet[0, d:] = (mus + fx)[1, :-d] * 0.16; wet[1, d:] = (mus + fx)[0, :-d] * 0.16
mixd += wet
fo = np.ones(N); i0 = T(49.5); fo[i0:] = np.clip(1 - (np.arange(N - i0) / (T(52) - i0)), 0, 1) ** 1.5
mixd *= fo
mixd = np.tanh(mixd * 1.25); mixd = mixd / np.abs(mixd).max() * 0.89
mixd = mixd[:, :T(52)]
out = Path(__file__).parent / 'out' / 'score.wav'
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mixd.T * 32767).astype('<i2').tobytes())
print('score', mixd.shape[1] / SR, 's')
