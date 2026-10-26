#!/usr/bin/env python3
"""声音：按节拍表合成配乐（玩具感：八音盒 / 拨弦 / 马林巴 + 轻鼓，120 BPM）和拟音音效。
全部原创合成，无采样素材。输出 out/<ep>/ 下：music.wav、sfx.wav、mix.wav（未母带）、cues_audio.json（每个音效事件的时间）。

用法：python3 audio.py m001
"""
import json, os, sys
import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ep = sys.argv[1]
cue = json.load(open(os.path.join(HERE, 'episodes', ep + '.json'), encoding='utf-8'))
OUT = os.path.join(HERE, 'out', ep); os.makedirs(OUT, exist_ok=True)
SR = 48000; DUR = cue['duration']; N = int(round(DUR * SR))
E = cue['events']; BPM = cue['bpm']; BEAT = 60 / BPM; BAR = BEAT * 4
rng = np.random.default_rng(cue.get('seed', 2026))

def T(sec): return int(round(sec * SR))
def buf(): return np.zeros((2, N))
def env_ad(n, a, d):  # 指数衰减包络
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    if a > 0: e *= np.clip(t / a, 0, 1)
    return e
PLACED = []  # (起始时刻, 该声音自身的起音时刻) — 起音 = 包络首次超过自身峰值 −30 dB
def place(dst, x, at, gain=1.0, pan=0.0):
    mono = np.abs(x if x.ndim == 1 else x.mean(axis=0)); pk = mono.max() if mono.size else 0
    if pk > 0: PLACED.append((at, at + int(np.argmax(mono > pk * 10 ** (-30 / 20))) / SR))
    i = T(at)
    if i >= N: return
    if x.ndim == 1: x = np.stack([x, x])
    l = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2); r = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    j0, j1 = max(0, i), min(N, i + x.shape[1]); k0 = j0 - i
    dst[0, j0:j1] += x[0, k0:k0 + j1 - j0] * gain * l
    dst[1, j0:j1] += x[1, k0:k0 + j1 - j0] * gain * r
def lp(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), 'low'); return signal.lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), 'high'); return signal.lfilter(b, a, x)
def bp(x, f0, f1, order=2):
    b, a = signal.butter(order, [f0 / (SR / 2), min(0.99, f1 / (SR / 2))], 'band'); return signal.lfilter(b, a, x)
def noise(n): return rng.standard_normal(n)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def sweep_tv(x, fcs, q=0.7):
    """时变低通（逐块）。fcs 与 x 同长。"""
    y = np.zeros_like(x); blk = 256; zi = None
    for s in range(0, len(x), blk):
        fc = float(np.clip(fcs[min(len(fcs) - 1, s)], 40, SR / 2 * 0.95))
        b, a = signal.butter(2, fc / (SR / 2), 'low')
        if zi is None or len(zi) != max(len(a), len(b)) - 1: zi = signal.lfilter_zi(b, a) * x[s]
        y[s:s + blk], zi = signal.lfilter(b, a, x[s:s + blk], zi=zi)
    return y

# ———————————————————————————— 乐器 ————————————————————————————
def pluck(f, dur=0.6, bright=0.5):
    n = T(dur); p = max(2, int(SR / f)); y = np.zeros(n); b = rng.uniform(-1, 1, p)
    b = lp(b, 2000 + 6000 * bright, 1)
    for i in range(n):
        y[i] = b[i % p]; b[i % p] = 0.5 * (b[i % p] + b[(i + 1) % p]) * 0.996
    return y * env_ad(n, 0.002, dur * 0.5)
def musicbox(f, dur=1.6):
    n = T(dur); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.9) + 0.35 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.35) + 0.18 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.08)
    y += 0.12 * np.sin(2 * np.pi * f * 8.9 * t) * np.exp(-t / 0.03)
    return y * np.clip(t / 0.002, 0, 1)
def marimba(f, dur=0.7):
    n = T(dur); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.32) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.06) + 0.08 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t / 0.02)
    y += 0.2 * lp(noise(n), 3000) * np.exp(-t / 0.004)
    return y * np.clip(t / 0.001, 0, 1)
def kick(dur=0.35):
    n = T(dur); t = np.arange(n) / SR; f = 45 + 95 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.12) + 0.3 * lp(noise(n), 2500) * np.exp(-t / 0.004)
def snare(dur=0.25):
    n = T(dur); t = np.arange(n) / SR
    return 0.5 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) + 0.7 * bp(noise(n), 1500, 9000) * np.exp(-t / 0.07)
def shaker(dur=0.09):
    n = T(dur); t = np.arange(n) / SR
    return hp(noise(n), 6000) * np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.025)
def bass(f, dur=0.45):
    n = T(dur); t = np.arange(n) / SR
    y = signal.sawtooth(2 * np.pi * f * t) * 0.6 + np.sin(2 * np.pi * f * t)
    return lp(y, 600) * np.clip(t / 0.005, 0, 1) * np.exp(-t / 0.25)
def pad(freqs, dur):
    n = T(dur); t = np.arange(n) / SR; y = np.zeros(n)
    for f in freqs:
        for d in (-0.15, 0.15): y += signal.sawtooth(2 * np.pi * f * (1 + d / 100) * t)
    y = lp(y, 1400) / (len(freqs) * 2)
    return y * np.clip(t / 0.6, 0, 1) * np.clip((dur - t) / 1.2, 0, 1)
def bell(f, dur=1.2, bright=1.0):  # 金属铃：非谐分音
    n = T(dur); t = np.arange(n) / SR; y = np.zeros(n)
    for k, (r, a, d) in enumerate([(1, 1, 0.6), (2.76, 0.5, 0.3), (5.4, 0.35 * bright, 0.12), (8.93, 0.2 * bright, 0.05)]):
        y += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d)
    return y * np.clip(t / 0.001, 0, 1)

# ———————————————————————————— 配乐 ————————————————————————————
# F 大调，10 小节：F C Dm Bb | F C Dm Bb-C | Bb F
CH = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53], [46, 50, 53], [53, 57, 60]]
MEL = {  # 小节号: [(拍, MIDI, 长度拍)]
    0: [(0, 77, 1), (1.5, 81, 0.5), (2, 84, 1), (3, 81, 1)],
    1: [(0, 79, 1.5), (2, 76, 1), (3, 72, 1)],
    2: [(0, 77, 0.5), (0.5, 81, 0.5), (1, 84, 1), (2, 86, 1), (3, 84, 1)],
    3: [(0, 82, 1.5), (2, 81, 0.5), (2.5, 79, 0.5), (3, 77, 1)],
    4: [(0, 77, 0.5), (0.5, 81, 0.5), (1, 84, 0.5), (1.5, 89, 0.5), (2, 88, 1), (3, 84, 1)],
    5: [(0, 79, 0.5), (0.5, 84, 0.5), (1, 88, 1)],
    6: [(0, 86, 0.5), (0.5, 84, 0.5), (1, 81, 0.5), (1.5, 84, 0.5), (2, 86, 0.5), (2.5, 89, 0.5), (3, 88, 1)],
    7: [(0, 86, 1), (1, 84, 0.5), (1.5, 82, 0.5), (2, 79, 1), (3, 84, 1)],
    8: [(0, 82, 1), (1, 81, 0.5), (1.5, 79, 0.5), (2, 77, 2)],
    9: [(0, 77, 1), (1, 81, 1), (2, 84, 2)],
}
def build_music():
    m = buf()
    sec = lambda t: next((s for s in cue['audio']['sections'] if s['t0'] <= t < s['t1']), cue['audio']['sections'][-1])
    for bar in range(10):
        t0 = bar * BAR; ch = CH[bar]
        if bar == 7: ch2 = [48, 52, 55]
        for b in range(8):  # 八分音符网格
            t = t0 + b * BEAT / 2; s = sec(t); inst = s['inst']; chord = ch if not (bar == 7 and b >= 4) else [48, 52, 55]
            build = E['buildup'] <= t < E['trainIn']
            if 'pluck' in inst and (b % 2 == 0 or build or t >= E['trainIn']):
                note = chord[(b // 2) % 3] + 12 if not build else chord[0] + 12
                g = 0.30 if not build else 0.18 + 0.25 * (t - E['buildup']) / (E['trainIn'] - E['buildup'])
                place(m, pluck(mtof(note), 0.5, 0.4 + 0.3 * build), t, g, pan=-0.35 + 0.1 * (b % 3))
            if 'marimba' in inst and not build:
                arp = [chord[0], chord[1], chord[2], chord[1] + 12, chord[2], chord[1], chord[0] + 12, chord[2]]
                place(m, marimba(mtof(arp[b] + 12)), t, 0.20, pan=0.4)
            if 'shaker' in inst:
                place(m, shaker(), t, 0.12 if not build else 0.10, pan=0.6)
                if build or t >= E['trainIn'] and t < E['revealStart']: place(m, shaker(), t + BEAT / 4, 0.08, pan=0.6)
            if 'kick' in inst and b % 2 == 0 and not build:
                if t >= E['trainIn'] or b in (0, 4): place(m, kick(), t, 0.55)
            if 'snare' in inst and b in (2, 6): place(m, snare(), t, 0.28, pan=0.1)
            if 'bass' in inst and b % 2 == 0: place(m, bass(mtof(chord[0] - 12)), t, 0.38)
        # 八音盒旋律
        if 'musicbox' in sec(t0 + 0.01)['inst'] or bar in (2, 3, 4, 5) or bar >= 6:
            for (bt, note, ln) in MEL[bar]:
                t = t0 + bt * BEAT
                if E['buildup'] <= t < E['trainIn']: continue
                place(m, musicbox(mtof(note), 1.4 + ln * 0.3), t, 0.24 if bar < 6 else 0.28, pan=0.15)
        if 'pad' in sec(t0 + 0.01)['inst']:
            place(m, pad([mtof(n) for n in ch], BAR + (1.8 if bar == 9 else 0.4)), t0, 0.22)
    # 蓄势：渐强的上行噪声
    n = T(E['trainIn'] - E['buildup']); tt = np.arange(n) / n
    riser = bp(noise(n), 300, 5000) * tt ** 2
    riser = sweep_tv(riser, 300 + 6000 * tt ** 2)
    place(m, riser, E['buildup'], 0.35)
    # 结尾主和弦长音（八音盒 + 拨弦）
    for k, note in enumerate([65, 69, 72, 77]):
        place(m, musicbox(mtof(note + 12), 2.4), 18.0 + k * 0.06, 0.18, pan=-0.2 + 0.15 * k)
    # 结尾 0.6 秒淡出
    fade = np.ones(N); f0 = T(DUR - 0.6); fade[f0:] = np.linspace(1, 0, N - f0) ** 1.5
    return m * fade

# ———————————————————————————— 音效 ————————————————————————————
log = []  # (名称, 时刻)
def ev(name, t): log.append({'name': name, 't': round(float(t), 4)})

def city_bed():
    """城市环境底噪：低沉车流 + 偶尔驶过的车 + 远处人声 + 鸟叫；拉焦时被低通"""
    n = N; t = np.arange(n) / SR
    rumble = lp(noise(n), 280) * 0.9 + lp(noise(n), 1200) * 0.25
    bed = np.stack([rumble, lp(noise(n), 280) * 0.9 + lp(noise(n), 1200) * 0.25])
    # 驶过的车（随机，固定种子）
    for k in range(26):
        at = rng.uniform(0, 16); d = rng.uniform(0.8, 1.6); m = T(d); tt = np.arange(m) / m
        car = bp(noise(m), 200, 2500) * np.sin(np.pi * tt) ** 2
        pan = rng.uniform(-0.8, 0.8); place(bed, car, at, 0.35, pan)
    # 远处人声（带通噪声 + 音节起伏）
    for k in range(18):
        at = rng.uniform(0.2, 11); d = rng.uniform(0.4, 0.9); m = T(d); tt = np.arange(m) / SR
        v = bp(noise(m), 300, 1800) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(4, 7) * tt)) * np.sin(np.pi * tt / d)
        place(bed, v, at, 0.12, rng.uniform(-0.6, 0.6))
    # 拉焦：两次低通扫频 + 揭示后环境变成屋内（更闷）
    fc = np.full(n, 9000.0)
    for (a, b, c, d) in [(E['pull1Out'], E['pull1Move'], E['pull1Land'], E['pull1In']), (E['pull2Out'], E['pull2Move'], E['pull2Land'], E['pull2In'])]:
        i0, i1, i2, i3 = T(a), T(b), T(c), T(d)
        fc[i0:i1] = np.geomspace(9000, 350, i1 - i0); fc[i1:i2] = 350; fc[i2:i3] = np.geomspace(350, 9000, i3 - i2)
    r0 = T(E['revealStart']); r1 = T(E['revealEnd']); fc[r0:r1] = np.geomspace(9000, 700, r1 - r0); fc[r1:] = 700
    bed = np.stack([sweep_tv(bed[0], fc), sweep_tv(bed[1], fc)])
    lvl = np.ones(n); lvl[r0:] = np.linspace(1, 0.45, n - r0)
    # 列车段：底噪让位给列车
    a0, a1 = T(E['trainIn'] - 0.2), T(E['revealStart'])
    lvl[a0:a1] *= 0.5
    return bed * lvl * 0.22

def chirp(at, dst, gain=0.25, pan=0.0):
    for k in range(rng.integers(2, 5)):
        d = rng.uniform(0.05, 0.12); m = T(d); tt = np.arange(m) / SR
        f = rng.uniform(3200, 5200) + rng.uniform(-1500, 1500) * tt / d
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** 2
        place(dst, y, at + k * rng.uniform(0.07, 0.14), gain, pan)

def build_sfx(ambient=True):
    s = buf()
    if ambient:
        s += city_bed()
        # 鸟叫（清晨，第一幕多）
        for k in range(9): chirp(rng.uniform(0.1, 4.4), s, 0.16, rng.uniform(-0.7, 0.7))
        for k in range(4): chirp(rng.uniform(5.6, 10.5), s, 0.10, rng.uniform(-0.7, 0.7))
    # 0 秒钩子：一辆车贴近驶过（第一帧就有声音）
    m = T(1.1); tt = np.arange(m) / m
    whoosh = bp(noise(m), 150, 3000) * (np.exp(-((tt - 0.3) / 0.18) ** 2))
    place(s, np.stack([whoosh * (1 - tt), whoosh * tt]), 0.0, 0.9); ev('hook_car', 0.0)
    # 红绿灯：黄灯一声提示、行人绿灯「嘀嘀」（踩在拍点上）
    place(s, bell(1320, 0.4, 0.3) * 0.6, E['sigEwYellow'], 0.35, 0.2); ev('signal_yellow', E['sigEwYellow'])
    tb = np.ceil(E['sigNsGreen'] / BEAT) * BEAT
    k = 0
    while tb < E['sigNsYellow']:
        m = T(0.06); tt = np.arange(m) / SR
        beep = np.sin(2 * np.pi * 2400 * tt) * np.clip(tt / 0.003, 0, 1) * np.exp(-tt / 0.03)
        place(s, beep, tb, 0.28 * (1 - 0.08 * k), -0.3); place(s, beep, tb + 0.12, 0.2 * (1 - 0.08 * k), -0.3)
        if k == 0: ev('ped_beep', tb)
        tb += BEAT; k += 1
    # 公交进站：刹车 + 气刹「嗤」+ 开门；出站引擎
    m = T(0.9); tt = np.arange(m) / SR
    brake = bp(noise(m), 1800, 6000) * np.exp(-tt / 0.25) * np.clip(tt / 0.005, 0, 1)
    place(s, bp(noise(T(1.2)), 80, 400) * np.linspace(1, 0, T(1.2)), E['busArrive'] - 1.2, 0.5, 0.3)
    place(s, brake, E['busArrive'], 0.9, 0.3); ev('bus_airbrake', E['busArrive'])
    m = T(1.4); tt = np.arange(m) / SR
    rev = lp(signal.sawtooth(2 * np.pi * (55 + 40 * tt) * tt), 500) * np.clip(tt / 0.05, 0, 1) * np.exp(-tt / 0.9)
    place(s, rev, E['busDepart'], 0.45, 0.4); ev('bus_depart', E['busDepart'])
    # 早餐摊：蒸笼「嘶」（底层持续）
    m = T(4.4); tt = np.arange(m) / SR
    place(s, hp(noise(m), 4000) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * tt)) * np.clip(tt / 0.3, 0, 1) * np.clip((4.4 - tt) / 0.4, 0, 1), 0.05, 0.07, 0.35)
    # 远处反光：一声细小的「叮」
    place(s, bell(2637, 0.9, 0.6), E['glint'] + 0.2, 0.16, 0.5); ev('glint', E['glint'] + 0.2)
    # 拉焦转场：空气声 + 低通「呼」，落地一声闷响
    for (a, b, c, d, nm) in [(E['pull1Out'], E['pull1Move'], E['pull1Land'], E['pull1In'], 'pull1'), (E['pull2Out'], E['pull2Move'], E['pull2Land'], E['pull2In'], 'pull2')]:
        dur = d - a; m = T(dur); tt = np.arange(m) / SR
        envl = np.interp(tt, [0, b - a, c - a, dur], [0, 1, 0.8, 0])
        air = bp(noise(m), 200, 4000) * envl
        air = sweep_tv(air, np.interp(tt, [0, b - a, c - a, dur], [4000, 600, 600, 2500]))
        place(s, np.stack([air, np.roll(air, 240)]), a, 0.9); ev(nm + '_out', a)
        thump = lp(noise(T(0.3)), 160) * env_ad(T(0.3), 0.003, 0.06) + 0.6 * np.sin(2 * np.pi * 70 * np.arange(T(0.3)) / SR) * env_ad(T(0.3), 0.002, 0.08)
        place(s, thump, c, 0.9); ev(nm + '_land', c)
    # 第二幕：门吊电机、集装箱落下「哐」、塔吊转动、船笛、水声
    lift = E['craneLift']; m = T(2.4); tt = np.arange(m) / SR
    motor = lp(signal.sawtooth(2 * np.pi * (70 + 30 * np.clip(tt / 1.0, 0, 1)) * tt), 900) * np.clip(tt / 0.15, 0, 1) * np.clip((2.4 - tt) / 0.3, 0, 1)
    place(s, motor, lift, 0.22, -0.3); ev('crane_motor', lift)
    clank_t = lift + 6.0 * 0.72
    cl = bp(noise(T(0.5)), 300, 3000) * env_ad(T(0.5), 0.001, 0.07) + 0.5 * bell(210, 0.5, 0.8)
    place(s, cl, clank_t, 0.55, -0.2); ev('container_clank', clank_t)
    m = T(2.8); tt = np.arange(m) / SR
    creak = bp(noise(m), 600, 1400) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 1.6 * tt))) * np.clip(tt / 0.02, 0, 1) * np.interp(tt, [0, 0.03, 2.2, 2.8], [0.5, 1, 0.8, 0])
    place(s, creak, 5.9, 0.16, 0.5); ev('tower_crane', 5.9)
    m = T(1.1); tt = np.arange(m) / SR
    horn = (np.sin(2 * np.pi * 185 * tt) + 0.5 * np.sin(2 * np.pi * 370 * tt) + 0.25 * np.sin(2 * np.pi * 555 * tt)) * np.clip(tt / 0.06, 0, 1) * np.clip((1.1 - tt) / 0.25, 0, 1)
    place(s, lp(horn, 1500), 6.5, 0.20, 0.6); ev('boat_horn', 6.5)
    m = T(2.6); tt = np.arange(m) / SR
    place(s, bp(noise(m), 300, 1500) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.3 * tt)) * np.sin(np.pi * tt / 2.6), 5.3, 0.18)
    # 第三幕：站台广播「叮咚」、道口铃（八分音符，踩拍）、栏杆电机
    place(s, bell(1047, 1.0, 0.5), 9.4, 0.2, -0.4); place(s, bell(784, 1.4, 0.5), 9.62, 0.2, -0.4); ev('station_chime', 9.4)
    m = T(0.8); tt = np.arange(m) / SR
    place(s, lp(signal.sawtooth(2 * np.pi * 140 * tt), 700) * np.sin(np.pi * tt / 0.8), E['gateDown'], 0.18, 0.3); ev('gate_motor', E['gateDown'])
    tb = np.ceil((E['gateDown'] - 0.25) / (BEAT / 2)) * (BEAT / 2); k = 0
    while tb < E['gateUp'] + 0.5:
        g = 0.42 if tb < E['trainIn'] else 0.22
        if tb > E['gateUp']: g *= 0.5
        place(s, bell(880 if k % 2 == 0 else 740, 0.45, 0.7), tb, g, 0.35 * (1 if k % 2 else -1))
        if k == 0: ev('crossing_bell', tb)
        tb += BEAT / 2; k += 1
    # 电线微颤：细高的嗡鸣
    m = T(E['trainIn'] - E['buildup'] + 0.5); tt = np.arange(m) / SR
    place(s, np.sin(2 * np.pi * 1760 * tt + 0.4 * np.sin(2 * np.pi * 9 * tt)) * (tt / tt[-1]) ** 2 * 0.5, E['buildup'], 0.06)
    # 铁轨「咔嗒」：蓄势时按八分音符轻响，列车经过时按十六分音符重响（全部对齐节拍网格）
    def clack(gain):
        y = bp(noise(T(0.08)), 500, 5000) * env_ad(T(0.08), 0.0005, 0.012) + 0.6 * np.sin(2 * np.pi * 320 * np.arange(T(0.08)) / SR) * env_ad(T(0.08), 0.0005, 0.02)
        return y * gain
    tb = np.ceil((E['buildup'] + 0.5) / (BEAT / 2)) * (BEAT / 2); first = True
    while tb < E['trainIn']:
        place(s, clack(0.15 + 0.4 * (tb - E['buildup']) / (E['trainIn'] - E['buildup'])), tb, 0.6, 0.1)
        if first: ev('rail_clack_soft', tb); first = False
        tb += BEAT / 2
    tb = E['trainIn']; first = True
    while tb < E['revealStart'] - 0.1:
        g = 1.0 if tb < 15.6 else 0.6
        place(s, clack(g), tb, 0.75, -0.1); place(s, clack(g * 0.8), tb + 0.045, 0.6, 0.1)
        if first: ev('rail_clack_pass', tb); first = False
        tb += BEAT / 4
    # 列车：驶近的多普勒呼啸 → 入画气浪 → 跟拍时的轰鸣 → 远去（音调下沉）
    a = E['trainIn'] - 0.9; m = T(0.95); tt = np.arange(m) / SR
    app = bp(noise(m), 400, 7000) * np.clip(tt / 0.01, 0, 1) * (0.15 + 0.85 * (tt / tt[-1]) ** 3)  # 起点轻轻可闻，然后渐强
    app = sweep_tv(app, 1500 + 9000 * (tt / tt[-1]) ** 2)
    place(s, np.stack([app * 0.6, app]), a, 1.2); ev('train_approach', a)
    m = T(1.6); tt = np.arange(m) / SR
    blast = lp(noise(m), 900) * np.exp(-tt / 0.35) * np.clip(tt / 0.008, 0, 1) + 0.7 * np.sin(2 * np.pi * (60 - 25 * tt) * tt) * np.exp(-tt / 0.3)
    place(s, np.stack([blast, np.roll(blast, 96)]), E['trainIn'], 1.25); ev('train_blast', E['trainIn'])
    d = E['revealStart'] + 1.2 - E['trainIn']; m = T(d); tt = np.arange(m) / SR
    roar = bp(noise(m), 120, 2600) * 0.8 + bp(noise(m), 2500, 9000) * 0.25
    roar += 0.35 * lp(signal.sawtooth(2 * np.pi * (88 + 4 * np.sin(2 * np.pi * 0.7 * tt)) * tt), 400)
    lvl = np.interp(tt, [0, 0.15, 15.1 - E['trainIn'], 15.9 - E['trainIn'], d], [0.2, 1, 1, 0.55, 0])
    fcs = np.interp(tt, [0, 15.1 - E['trainIn'], 16.6 - E['trainIn'], d], [9000, 8000, 1500, 600])
    roar = sweep_tv(roar * lvl, fcs)
    place(s, np.stack([roar, np.roll(roar, 140)]), E['trainIn'], 0.7); ev('train_roar', E['trainIn'])
    m = T(1.8); tt = np.arange(m) / SR
    dop = np.sin(2 * np.pi * np.cumsum(520 - 180 * np.clip(tt / 0.6, 0, 1)) / SR) * np.exp(-tt / 0.6) * np.clip(tt / 0.02, 0, 1)
    place(s, lp(dop, 2000), 15.15, 0.12, -0.2); ev('train_recede', 15.15)
    # 鸟群：惊起扑翅 + 叫声；之后落回
    def flutter(at, dur, gain, rate=14):
        m = T(dur); tt = np.arange(m) / SR
        y = bp(noise(m), 500, 5000) * (0.5 + 0.5 * np.sin(2 * np.pi * rate * tt)) ** 3 * np.interp(tt, [0, 0.04, dur * 0.4, dur], [0, 1, 0.7, 0])
        place(s, np.stack([y, np.roll(y, 300)]), at, gain)
    flutter(E['birdsUp'], 1.3, 0.85); ev('birds_up', E['birdsUp'])
    for k in range(4): chirp(E['birdsUp'] + 0.1 + k * 0.2, s, 0.2, rng.uniform(-0.6, 0.6))
    flutter(E['birdsLand'] + 0.3, 1.2, 0.35, 11); ev('birds_land', E['birdsLand'] + 0.3)
    # 拉远：风声
    a, b = E['revealStart'], E['revealEnd'] + 0.4; m = T(b - a); tt = np.arange(m) / SR
    wind = bp(noise(m), 200, 2200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.9 * tt)) * np.interp(tt, [0, 0.5, b - a - 0.6, b - a], [0, 1, 0.8, 0])
    wind = sweep_tv(wind, 500 + 2500 * np.sin(np.pi * tt / (b - a)))
    place(s, np.stack([wind, np.roll(wind, 500)]), a, 0.6); ev('pullout_wind', a)
    # 标题：一声轻响（木头轻敲 + 小铃）
    th = E['titleHit']
    knock = bp(noise(T(0.2)), 400, 3000) * env_ad(T(0.2), 0.0005, 0.02) + 0.6 * np.sin(2 * np.pi * 420 * np.arange(T(0.2)) / SR) * env_ad(T(0.2), 0.0005, 0.04)
    place(s, knock, th, 0.55); place(s, bell(1568, 1.6, 0.6), th + 0.005, 0.22, 0.1); ev('title_hit', th)
    # 屋内房间声（结尾）
    m = N - T(E['revealEnd']); place(s, lp(noise(m), 300) * 0.5 * np.clip(np.arange(m) / SR / 0.5, 0, 1), E['revealEnd'], 0.05)
    fade = np.ones(N); f0 = T(DUR - 0.5); fade[f0:] = np.linspace(1, 0, N - f0)
    return s * fade

def write_wav(path, x):
    from scipy.io import wavfile
    wavfile.write(path, SR, np.clip(x.T, -1, 1).astype(np.float32))

music = build_music()
sfx = build_sfx()
mg = 10 ** (cue['audio'].get('musicGainDb', -6) / 20); sg = 10 ** (cue['audio'].get('sfxGainDb', 0) / 20)
# 归一化各轨到相近的峰值后再按增益混合
music = music / (np.max(np.abs(music)) + 1e-9) * 0.5
sfx = sfx / (np.max(np.abs(sfx)) + 1e-9) * 0.7
write_wav(os.path.join(OUT, 'music.wav'), music * mg)
write_wav(os.path.join(OUT, 'sfx.wav'), sfx * sg)
mix = music * mg + sfx * sg
write_wav(os.path.join(OUT, 'mix.wav'), mix / (np.max(np.abs(mix)) + 1e-9) * 0.7)
for c in log:  # 每个节拍表事件：找在该时刻放下的声音，量它自己的起音
    cand = [o for (a, o) in PLACED if abs(a - c['t']) < 0.002]
    if cand: c['onset'] = round(min(cand), 4); c['dev_ms'] = round((min(cand) - c['t']) * 1000, 1)
json.dump(log, open(os.path.join(OUT, 'cues_audio.json'), 'w'), ensure_ascii=False, indent=1)
# 只含事件音效（无环境底噪）的分轨，专门用来测起音与节拍表的偏差
log.clear(); ev_only = build_sfx(ambient=False)
write_wav(os.path.join(OUT, 'sfx_events.wav'), ev_only / (np.max(np.abs(ev_only)) + 1e-9) * 0.7)
print('ok', len(log), 'cues')
