"""萤火虫同步 · 配乐 (62.5s, 60 BPM, D 大调). 事件对齐画面 events.json."""
import json, numpy as np, wave
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100; D = 62.5; N = int(SR * D)
rng = np.random.default_rng(1028)
L = np.zeros(N); R = np.zeros(N)
ev = json.load(open('events.json'))

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def put(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[:N - i] * gain
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * l * 1.414; R[i:i + len(sig)] += sig * r * 1.414
def env_adsr(n, a, r):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) ** 2; e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e
def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

# ---------- instruments ----------
def pad(notes, t0, t1, amp=0.05, att=1.8, rel=2.2, bright=1.0, pan=0.0):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for m in notes:
        f = hz(m)
        for det, ph in ((-0.18, rng.uniform(0, 6.3)), (0.18, rng.uniform(0, 6.3)), (0.0, rng.uniform(0, 6.3))):
            vib = 0.0025 * np.sin(2 * np.pi * (0.18 + rng.uniform(0, .1)) * t)
            w = 2 * np.pi * (f + det) * t + ph
            out += np.sin(w + vib) + 0.22 * bright * np.sin(2 * w) + 0.06 * bright * np.sin(3 * w)
    out *= env_adsr(n, att, rel) * amp / len(notes) ** 0.5
    put(out, t0, pan)

def piano(m, t, amp=0.16, dur=4.0, pan=0.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = hz(m); out = np.zeros(n)
    for k, (a, dec) in enumerate([(1, 2.2), (0.42, 1.1), (0.2, 0.6), (0.09, 0.35), (0.05, 0.2)]):
        out += a * np.sin(2 * np.pi * f * (k + 1) * (1 + 0.0004 * k * k) * tt) * np.exp(-tt / dec)
    out *= (1 - np.exp(-tt / 0.004)); out += 0.02 * rng.standard_normal(n) * np.exp(-tt / 0.01)
    put(lp(out, 5200) * amp, t, pan)

def chime(m, t, amp=0.07, pan=0.0):
    n = int(3.5 * SR); tt = np.arange(n) / SR; f = hz(m)
    out = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 1.4) + 0.35 * np.sin(2 * np.pi * f * 2.756 * tt) * np.exp(-tt / 0.5) \
        + 0.12 * np.sin(2 * np.pi * f * 5.404 * tt) * np.exp(-tt / 0.22)
    out *= (1 - np.exp(-tt / 0.003))
    put(out * amp, t, pan)

def pluck(m, t, amp=0.05, pan=0.0):
    n = int(1.4 * SR); tt = np.arange(n) / SR; f = hz(m)
    out = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / 0.08)) * np.exp(-tt / 0.32)
    out *= (1 - np.exp(-tt / 0.002))
    put(out * amp, t, pan)

def thump(t, amp=0.22, f0=62, f1=42, dec=0.12):
    n = int(0.6 * SR); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt / 0.05); ph = 2 * np.pi * np.cumsum(f) / SR
    out = np.sin(ph) * np.exp(-tt / dec) * (1 - np.exp(-tt / 0.004))
    put(out * amp, t)

def noise_hit(t, lo, hi, dec, amp, pan=0.0, n_s=0.25):
    n = int(n_s * SR); tt = np.arange(n) / SR
    out = bp(rng.standard_normal(n), lo, hi) * np.exp(-tt / dec) * (1 - np.exp(-tt / 0.0015))
    put(out * amp, t, pan)

def clap(t, amp=0.05, pan=0.0):
    for k, dt in enumerate((0, 0.008, 0.017)):
        noise_hit(t + dt, 900, 2600, 0.012 if k < 2 else 0.05, amp * (0.6 if k < 2 else 1), pan, 0.2)

def step(t, amp=0.06, pan=0.0):
    noise_hit(t, 150, 900, 0.03, amp, pan, 0.15); thump(t, amp * 0.5, 120, 80, 0.04)

def tick(t, amp=0.04, pan=0.0):
    noise_hit(t, 2500, 7000, 0.006, amp, pan, 0.05)

# ---------- harmony ----------
D = 62.5
Dmaj9 = [38, 50, 54, 57, 61, 64]; Bm7 = [35, 47, 50, 54, 57, 62]; Gmaj7 = [31, 43, 50, 54, 59, 62]
Em9 = [40, 52, 55, 59, 62, 66]; A_Cs = [37, 49, 52, 57, 61, 64]; Gadd9 = [31, 43, 47, 50, 57, 62]
DF = [42, 50, 54, 57, 62, 66]; Asus = [33, 45, 50, 52, 57, 64]

# 0–11.5 river intro
pad(Dmaj9, 0.0, 7.2, 0.055, att=3.0, rel=2.0, bright=0.6)
pad(Dmaj9[:1] + [52, 57, 61, 66], 6.4, 12.2, 0.06, att=1.0, rel=1.6, bright=0.9)
for t, m in [(1.2, 78), (2.7, 76), (4.0, 73), (5.6, 71), (8.4, 78), (9.9, 81), (11.0, 76)]:
    piano(m, t, 0.10, pan=0.15)
piano(62, 1.2, 0.07); piano(57, 5.6, 0.06)
for e in ev:
    if e['type'] == 'breath': chime(81, e['t'], 0.05, -0.2); chime(74, e['t'] + 0.02, 0.035, 0.25)
# 11.3–17.45 paper: drone + crackle + ticks
pad([35, 47, 54], 11.2, 17.6, 0.05, att=0.8, rel=0.6, bright=0.3)
crk = np.zeros(int(6.3 * SR))
for k in range(int(6.3 * 18)):
    i = rng.integers(0, len(crk) - 200); crk[i:i + 40] += rng.standard_normal(40) * rng.uniform(0.2, 1) * np.exp(-np.arange(40) / 8)
put(bp(crk, 1500, 8000) * 0.05, 11.2)
for t in (12.0, 13.0, 14.0, 15.0, 16.0, 17.0): tick(t, 0.018, 0.3)   # clock-like ticks under the doubt
piano(59, 11.6, 0.08); piano(66, 14.2, 0.07); piano(62, 16.0, 0.06)
for e in ev:
    if e['type'] == 'blink': tick(e['t'], 0.05)
# eye closes 17.35 → soft low swell into film
thump(17.42, 0.12, 50, 38, 0.3)
# 17.45–23.8 film: projector rattle + filtered pad + muted plucks on flashes
n = int(6.4 * SR); tt = np.arange(n) / SR
proj = lp(rng.standard_normal(n), 1800) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * tt)) ** 6 * env_adsr(n, 0.4, 0.8)
put(proj * 0.04, 17.45, 0.2)
pad(Gmaj7, 17.45, 24.4, 0.05, att=1.0, rel=1.4, bright=0.25)
for e in ev:
    if e['type'] == 'filmflash': pluck(74, e['t'], 0.035, -0.1); pluck(66, e['t'] + 0.01, 0.025, 0.1)
# shutter
sh = next(e['t'] for e in ev if e['type'] == 'shutter')
noise_hit(sh - 0.02, 2000, 9000, 0.01, 0.12, 0, 0.08); noise_hit(sh + 0.05, 800, 5000, 0.02, 0.10, 0, 0.12); thump(sh + 0.05, 0.08, 180, 120, 0.03)
# 23.8–27.0 random plinks (no leader)
pad(Em9, 23.6, 27.6, 0.05, att=1.2, rel=1.2, bright=0.5)
pent = [74, 76, 78, 81, 83, 86, 88]
t = 24.0
while t < 26.9:
    pluck(int(rng.choice(pent)), t, 0.03, rng.uniform(-0.8, 0.8)); t += rng.uniform(0.15, 0.5)
# 27–34.5 macro: plucks from focus + its neighbours
pad(A_Cs, 27.0, 31.0, 0.048, att=1.0, rel=1.2, bright=0.5)
pad(Bm7, 30.6, 35.0, 0.05, att=1.2, rel=1.2, bright=0.6)
mac = [e for e in ev if e['type'] == 'macro']
# pick the events from ~9 central fireflies (nearest centre) to keep it musical
cent = sorted({(round(e['x'], 3), round(e['y'], 3)) for e in mac}, key=lambda p: (p[0] - 0.5) ** 2 + (p[1] - 0.56) ** 2)[:9]
cset = set(cent)
for e in mac:
    key = (round(e['x'], 3), round(e['y'], 3))
    if key in cset:
        m = pent[int((1 - e['y']) * 9) % len(pent)]
        pluck(m, e['t'], 0.06 if e.get('focus') else 0.032, (e['x'] - 0.5) * 1.4)
# 34.5–41.7 sync spreads: crescendo + chimes on synced flashes + heartbeat
pad(Gadd9, 34.4, 38.6, 0.06, att=1.4, rel=1.2, bright=0.8)
pad(DF, 37.8, 42.3, 0.075, att=0.8, rel=1.4, bright=1.0)
sw = rng.standard_normal(int(4 * SR)); sw = lp(sw, 900) * np.linspace(0, 1, len(sw)) ** 3 * 0.05; put(sw, 34.0)  # rising air
syncs = [e['t'] for e in ev if e['type'] == 'sync']
mel = [81, 78, 83, 81, 86, 85]
for k, t in enumerate([s for s in syncs if s < 43]):
    chime(mel[k % len(mel)], t, 0.06, 0); chime(74, t + 0.01, 0.03, -0.3); thump(t, 0.16)
piano(66, 38.15, 0.12); piano(74, 38.15, 0.1); piano(81, 38.16, 0.08)
# 41.7–49.8 morphs: heart, applause, footsteps
pad(Gmaj7, 41.4, 45.0, 0.05, att=1.0, rel=1.0, bright=0.6)
pad(Em9, 44.6, 47.4, 0.05, att=0.8, rel=1.0, bright=0.6)
pad(Asus, 47.0, 50.4, 0.05, att=0.8, rel=1.2, bright=0.6)
t = 42.9
while t < 44.6:
    thump(t, 0.2, 70, 45, 0.1); thump(t + 0.19, 0.13, 65, 45, 0.08); t += 0.95
for k in range(70):   # applause random → together
    tr = 45.3 + rng.uniform(-0.3, 1.0); clap(tr, 0.016, rng.uniform(-0.9, 0.9))
t = 45.3 + 0.55 * 2
while t < 46.5:
    for k in range(14): clap(t + rng.normal(0, 0.012), 0.012, rng.uniform(-0.9, 0.9))
    t += 0.55
# footsteps: lane0 cadence 0.5 phase 0 ; lane1 converges (mirror of the visual formula)
def sm(u): u = min(max(u, 0), 1); return u * u * (3 - 2 * u)
prev0 = prev1 = None
for i in range(int((48.9 - 47.0) * 300)):
    t = 47.0 + i / 300
    p0 = (t - 47.0) / 0.5
    cad1 = 0.47 + (0.5 - 0.47) * sm((t - 47.2) / 1.0); off1 = 0.23 * (1 - sm((t - 47.3) / 1.1))
    p1 = (t - 47.0) / cad1 + off1
    if prev0 is not None and int(p0) != int(prev0): step(t, 0.05, -0.35)
    if prev1 is not None and int(p1) != int(prev1): step(t, 0.05, 0.35)
    prev0, prev1 = p0, p1
for t, m in [(41.9, 74), (43.0, 78), (44.7, 76), (46.1, 73), (47.7, 74), (48.6, 69)]:
    piano(m, t, 0.08, pan=0.1)
# 49.8–55 you: intimate
pad(Dmaj9, 49.4, 55.8, 0.05, att=1.4, rel=1.6, bright=0.4)
for t, m in [(50.0, 66), (51.5, 69), (52.6, 73), (53.7, 71), (54.6, 69)]:
    piano(m, t, 0.1, pan=-0.1)
t = 49.8
while t < 54.9:
    chime(86, t, 0.016, rng.uniform(-0.5, 0.5)); t += 1.1
# 55–62.5 finale
pad(Gadd9, 54.8, 58.6, 0.06, att=1.0, rel=1.4, bright=0.8)
pad(Dmaj9, 58.0, 62.5, 0.07, att=1.2, rel=3.2, bright=0.9)
for t, m in [(55.2, 78), (56.2, 81), (57.2, 83), (58.3, 81), (59.3, 78), (60.4, 74)]:
    piano(m, t, 0.1, pan=0.15)
piano(50, 58.3, 0.08); piano(57, 58.3, 0.06); piano(62, 58.3, 0.06)
for k, t in enumerate([s for s in syncs if s > 55]):
    chime([81, 78, 74, 78, 81, 86, 81][k % 7], t, 0.04, 0.2 * (-1) ** k)

# ---------- reverb + master ----------
irn = int(2.8 * SR); it = np.arange(irn) / SR
def ir():
    x = rng.standard_normal(irn) * np.exp(-it / 0.75); x[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR)); return lp(x, 6000) / np.sqrt(np.sum(x ** 2))
wl = fftconvolve(L, ir())[:N]; wr = fftconvolve(R, ir())[:N]
outL = 0.72 * L + 0.55 * wl; outR = 0.72 * R + 0.55 * wr
fade = np.ones(N); fade[:int(0.6 * SR)] = np.linspace(0, 1, int(0.6 * SR)); fo = int(2.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
outL *= fade; outR *= fade
pk = max(np.max(np.abs(outL)), np.max(np.abs(outR))); outL *= 0.89 / pk; outR *= 0.89 / pk
st = np.stack([outL, outR], 1)
w = wave.open('score.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
print('ok', D)
