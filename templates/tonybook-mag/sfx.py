"""TonyBook chat template: synthesize the UI sound layer from out/<ep>/timing.json (cues in voice seconds).
   Output: out/sfx.wav (48 kHz stereo). Original synthesis — no licensed samples."""
import json, pathlib, sys, numpy as np, wave

ROOT = pathlib.Path(__file__).parent
SR = 48000
rng = np.random.default_rng(7)


def env(n, decay, attack=0.002):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t * decay)


def tone(f, dur, decay, amp, harm=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + harm * np.sin(2 * np.pi * 2 * f * t)
    return amp * s * env(n, decay)


def lp(x, a):  # one-pole lowpass with per-sample coefficient array or scalar
    y = np.empty_like(x); acc = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y


def noise_sweep(dur, f0, f1, amp):
    n = int(dur * SR); x = rng.standard_normal(n)
    fc = np.geomspace(f0, f1, n)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    band = lp(x, a) - lp(lp(x, a), a * 0.35)
    w = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    return amp * band * w / (np.abs(band).max() + 1e-9)


def chirp(f0, f1, dur, decay, amp):
    n = int(dur * SR); t = np.arange(n) / SR
    f = np.geomspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return amp * np.sin(ph) * env(n, decay, 0.003)


def make(kind):
    if kind == "pop":  # assistant bubble arrives: short rising blip
        a = chirp(620, 1240, 0.09, 38, 0.10); b = chirp(1240, 1860, 0.06, 60, 0.03)
        a[: len(b)] += b
        return a
    if kind == "send":  # fan's question sent: soft falling swoop
        return chirp(1400, 700, 0.12, 22, 0.07)
    if kind == "tick":
        return tone(2900, 0.05, 140, 0.10, 0.25)
    if kind == "soft":
        return tone(1500, 0.08, 70, 0.055, 0.1)
    if kind == "ok":
        a = tone(1318.5, 0.45, 11, 0.075, 0.15); b = tone(1975.5, 0.45, 11, 0.06, 0.1)
        out = np.zeros(int(0.5 * SR)); out[: len(a)] += a; o = int(0.055 * SR); out[o:o + len(b)] += b[: len(out) - o]
        return out
    if kind == "bad":
        a = tone(233, 0.35, 13, 0.11, 0.5); b = tone(311, 0.35, 13, 0.06, 0.3)
        return a + b
    if kind == "scan":
        return noise_sweep(0.75, 700, 4200, 0.045)
    if kind == "whoosh":
        return noise_sweep(0.38, 300, 1600, 0.035)
    if kind == "stamp":
        th = tone(85, 0.4, 16, 0.22); th[: int(0.2 * SR)] += tone(170, 0.2, 30, 0.06)
        n = int(0.03 * SR); th[:n] += 0.08 * rng.standard_normal(n) * env(n, 200)
        return th
    raise ValueError(kind)


def main():
    OUT = ROOT / "out" / sys.argv[1]
    tj = json.loads((OUT / "timing.json").read_text())
    total = tj["total"]; cues = tj["sfx"]
    L = np.zeros(int(total * SR) + SR); R = np.zeros_like(L)
    for i, (t, k) in enumerate(cues):
        s = make(k); o = int(t * SR); n = min(len(s), len(L) - o)
        pan = 0.5 + 0.18 * np.sin(i * 1.7)  # gentle stereo spread
        L[o:o + n] += s[:n] * (1 - pan) * 1.4; R[o:o + n] += s[:n] * pan * 1.4
    st = np.stack([L, R], 1)[: int(total * SR)]
    pk = np.abs(st).max(); print("peak", round(float(pk), 3), "cues", len(cues))
    st = np.clip(st, -0.98, 0.98)
    with wave.open(str(OUT / "sfx.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    main()
