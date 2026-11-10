"""Original synthesized score for the hype reel: 150 BPM, 20 s. Everything generated here (no samples)."""
import numpy as np, wave
SR = 44100; BEAT = 0.4; TOTAL = 20.0
N = int(SR * TOTAL); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); n = min(len(sig), N - i)
    if n <= 0: return
    L[i:i+n] += sig[:n] * gain * (1 - max(0, pan)); R[i:i+n] += sig[:n] * gain * (1 + min(0, pan))

def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def kick(dur=0.32):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * np.exp(-t / 0.13)) + 0.25 * rng.standard_normal(n) * np.exp(-t / 0.004)

def onepole_hp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); lp = 0.0
    for i in range(len(x)):
        lp = a * lp + (1 - a) * x[i]; y[i] = x[i] - lp
    return y

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); lp = 0.0
    for i in range(len(x)):
        lp = a * lp + (1 - a) * x[i]; y[i] = lp
    return y

def clap(dur=0.22):
    n = int(SR * dur); x = rng.standard_normal(n); t = np.arange(n) / SR
    e = sum(np.where(t >= o, np.exp(-(t - o) / 0.012), 0) for o in (0, 0.011, 0.023)) * 0.5 + np.exp(-t / 0.07) * 0.6
    return onepole_lp(onepole_hp(x, 900), 6500) * e

def snare(dur=0.16):
    n = int(SR * dur); t = np.arange(n) / SR
    return (onepole_hp(rng.standard_normal(n), 1500) * np.exp(-t / 0.05) + 0.6 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.03))

def hat(dur=0.05, d=0.012):
    n = int(SR * dur); t = np.arange(n) / SR
    return onepole_hp(rng.standard_normal(n), 7000) * np.exp(-t / d)

def saw(f, n, det=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * (1 + det) * t) % 1) - 1

def bass(f, dur=0.17):
    n = int(SR * dur)
    x = saw(f, n) * 0.6 + np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR)) * 0.4
    return np.tanh(1.6 * onepole_lp(x, 520)) * env(n, 0.004, 0.11)

def stab(notes, dur=0.5, d=0.16, bright=3200):
    n = int(SR * dur); x = np.zeros(n)
    for f in notes:
        for det in (-0.006, 0, 0.007):
            x += saw(f, n, det)
    return onepole_lp(x / (len(notes) * 3), bright) * env(n, 0.003, d)

def riser(dur, f0=300, f1=9000):
    n = int(SR * dur); t = np.arange(n) / SR; x = rng.standard_normal(n); y = np.zeros(n)
    lp = 0.0
    fc = f0 * (f1 / f0) ** (t / dur)
    a = np.exp(-2 * np.pi * fc / SR)
    for i in range(n):
        lp = a[i] * lp + (1 - a[i]) * x[i]; y[i] = lp
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (2 * t / dur)) / SR) * 0.25
    return (y * 1.4 + tone) * (t / dur) ** 2

def impact(dur=2.4):
    n = int(SR * dur); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.5)
    crash = onepole_hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.55) * 0.5
    return np.tanh(1.8 * boom) + crash

A1, C2, D2, E2, F1, G1 = 55.0, 65.41, 73.42, 82.41, 43.65, 49.0
def chord(root): return [root * 4, root * 4 * 2 ** (3 / 12), root * 4 * 2 ** (7 / 12), root * 8]
bt = lambda b: b * BEAT
K, C, S, H = kick(), clap(), snare(), hat()
HO = hat(0.14, 0.05)

# bar 1 (beats 0-3): build - thuds on each word, accelerating snare roll, riser
add(riser(4 * BEAT), 0, 0.5)
for b in range(4):
    add(K, bt(b), 0.75); add(stab(chord(A1), 0.3, 0.07, 1800), bt(b), 0.35)
for i in range(8):  add(S, bt(i * 0.5), 0.18 + 0.03 * i)          # 8ths, beats 0-3.5
for i in range(8):  add(S, bt(2 + i * 0.25), 0.3 + 0.04 * i)       # 16ths over beats 2-4

# bars 2-7 (beats 4-27): six fact bars, bar roots
roots = [A1, A1, F1, F1, G1, E2 / 2 * 1.0]
add(impact(), bt(4), 0.9)
def groove(b0, root, fill=False, dense=False):
    for b in range(4):
        add(K, bt(b0 + b), 1.0)
        if b % 2 == 1: add(C, bt(b0 + b), 0.55)
        add(HO, bt(b0 + b + 0.5), 0.2, pan=0.25)
        add(bass(root * (2 if b == 3 else 1)), bt(b0 + b + 0.5), 0.6)
        add(bass(root), bt(b0 + b + 0.25), 0.32); add(bass(root), bt(b0 + b + 0.75), 0.32)
        if dense:
            for q in (0.25, 0.75): add(H, bt(b0 + b + q), 0.16, pan=-0.3)
    add(stab(chord(root), 0.6, 0.2), bt(b0), 0.5)             # number slam
    add(stab(chord(root), 0.25, 0.06, 2400), bt(b0 + 1), 0.25)  # label
    add(stab([f * 2 for f in chord(root)], 0.4, 0.12, 4500), bt(b0 + 2), 0.38)  # punch strip
    if fill:
        for i in range(4): add(S, bt(b0 + 3 + i * 0.25), 0.25 + 0.06 * i)
for i, r in enumerate(roots):
    groove(4 + 4 * i, r, fill=(i in (1, 3, 5)), dense=(i >= 2))

# bars 8-9 (beats 28-35): rapid words - kick+clap every beat, climbing stabs, roll + riser into 36
climb = [A1, C2, D2, E2, A1, C2, D2, E2]
for i in range(8):
    b = 28 + i
    add(K, bt(b), 1.0); add(C, bt(b), 0.5)
    add(stab([f * (2 if i >= 4 else 1) for f in chord(climb[i])], 0.3, 0.09, 4200), bt(b), 0.5)
    add(bass(climb[i]), bt(b + 0.5), 0.6)
    for q in (0.25, 0.5, 0.75): add(H, bt(b + q), 0.18, pan=0.3 if q == 0.5 else -0.3)
add(riser(4 * BEAT), bt(32), 0.5)
for i in range(16): add(S, bt(32 + i * 0.25), 0.14 + 0.03 * i)

# bar 10 (beats 36-39): count-up - impact, groove
add(impact(1.6), bt(36), 0.8); groove(36, A1, dense=True)
# bar 11 (beats 40-43): take - half-time, then drop out before the final hit
for b in (40, 42): add(K, bt(b), 1.0)
add(bass(F1, 0.5), bt(40), 0.7); add(stab(chord(F1), 0.7, 0.25, 2200), bt(40), 0.4)
add(C, bt(41), 0.5)
add(stab([f * 2 for f in chord(G1)], 0.6, 0.2, 5000), bt(42), 0.55); add(bass(G1, 0.4), bt(42), 0.7)
for i in range(4): add(S, bt(43 + i * 0.25), 0.3 + 0.08 * i)
# beat 44: final hit, chord rings out to 20 s; soft pulses on beats 45-46 for the follow chip
add(impact(2.4), bt(44), 1.0); add(K, bt(44), 1.0)
add(stab(chord(A1) + [A1 * 2], 2.4, 0.75, 3000), bt(44), 0.6)
for b in (45, 46): add(HO, bt(b), 0.14); add(stab([f * 2 for f in chord(A1)], 0.3, 0.1, 5000), bt(b), 0.14)

mix = np.stack([L, R], 1)
print("pre-peak", np.abs(mix).max(), "pre-rms", np.sqrt((mix**2).mean())); mix = np.tanh(mix * 0.55)
fade = np.ones(N); k = int(SR * 0.5); fade[-k:] = np.linspace(1, 0, k) ** 2
mix = mix * fade[:, None]
mix = mix / np.abs(mix).max() * 0.92
with wave.open("out/score.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", TOTAL)
