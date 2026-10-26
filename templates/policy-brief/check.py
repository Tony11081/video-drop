"""Pre-render check for a Policy Brief episode (borrowed idea: digital-human-koubo check_edit.py).
   python3 check.py ep012          (runs `render.py epNNN timing` first if timing.json is missing or stale)
Checks the config and the timeline against the rules we measured from head creators:
  - hook line short (≤ 3.5 s on screen), first 30 s: a new visual event at least every 5 s,
    no static stretch longer than 8 s anywhere;
  - call to action twice (follow prompt within 15 s + closing cta scene);
  - sound effects only on events (prints effects per minute);
  - keys really appear in their caption, card text short enough not to wrap.
Exit code 1 when something must be fixed; warnings only print."""
import json, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).parent.resolve()
EP = sys.argv[1]
cfg_js = ROOT / "episodes" / f"{EP}.js"
tj = ROOT / "out" / EP / "timing.json"
if not tj.exists() or tj.stat().st_mtime < cfg_js.stat().st_mtime or "events" not in json.loads(tj.read_text()):
    subprocess.run([sys.executable, str(ROOT / "render.py"), EP, "timing"], check=True)
T = json.loads(tj.read_text())
E = json.loads(subprocess.run(["node", "-e", f"global.window={{}};require({json.dumps(str(cfg_js))});console.log(JSON.stringify(window.EP))"],
                              capture_output=True, text=True, check=True).stdout)
K = E["speed"]; bad, warn = [], []


def width(s):  # CJK = 1, ASCII ≈ 0.55
    return sum(1 if ord(c) > 0x2E80 else 0.55 for c in str(s))


# ---- text ----
for i, v in enumerate(E["voice"]):
    cap = v["cap"].replace("|", "")
    for k in v.get("keys", []):
        if k not in cap: bad.append(f"第 {i + 1} 句：高亮词「{k}」不在字幕里")
        if any(c in k for c in "、，："): bad.append(f"第 {i + 1} 句：高亮词「{k}」不能含 、，：")
    s = v.get("scene") or {}
    lim = {"split": 9.5, "rows": 15, "checklist": 13, "path": 17, "index": 18}.get(s.get("type"))
    texts = []
    if s.get("type") == "split":
        for side in ("left", "right"): texts += [it[1] for it in s.get(side, {}).get("items", [])]
    if s.get("type") in ("rows", "figure"): texts += [r[1] for r in s.get("rows", [])]
    if s.get("type") == "checklist": texts += s.get("items", [])
    if s.get("type") == "path": texts += s.get("crumbs", [])
    if s.get("type") == "index": texts += s.get("items", [])
    lim = lim or 15
    for t in texts:
        if width(t) > lim: warn.append(f"第 {i + 1} 句 {s.get('type')}：「{t}」偏长（{width(t):.1f} > {lim}），可能折行")

# ---- rhythm (output seconds) ----
total = T["total"] / K
ev = sorted({round(t / K, 2) for t, _ in T["events"]} | {round(a / K, 2) for a, _, _ in T["scenes"]} | ({round(T["follow"][0] / K, 2)} if T.get("follow") else set()))
ev = [0.0] + [e for e in ev if e > 0] + [total]
gaps = [(a, b) for a, b in zip(ev, ev[1:])]
first = [(a, b) for a, b in gaps if a < 30 and b - a > 5]
for a, b in first: warn.append(f"前 30 秒 {a:.1f}–{b:.1f} 秒 有 {b - a:.1f} 秒没有新的视觉事件（目标每 3–5 秒一个）")
for a, b in gaps:
    if a >= 30 and b - a > 8 and b < total - 0.5: warn.append(f"{a:.1f}–{b:.1f} 秒 画面静止 {b - a:.1f} 秒（目标 ≤ 8 秒）")
hook = E["voice"][0]["dur"] / K
if hook > 3.6: warn.append(f"第一句钩子 {hook:.1f} 秒，偏长（目标 ≤ 3.5 秒：开头只说命题或后果）")

# ---- calls to action ----
if not T.get("follow"): warn.append("没有前 15 秒的关注提示（号召至少两次）")
elif T["follow"][0] / K > 15: warn.append("关注提示出现得太晚（应在前 15 秒）")
if T["scenes"][-1][2] != "cta": bad.append("最后一个场景不是 cta")

# ---- sound ----
spm = len(T["sfx"]) / (total / 60)
if spm > 8: warn.append(f"音效 {spm:.1f} 个/分钟，偏多（只给事件，目标 ≤ 8）")

print(f"{EP} · 成片约 {total:.1f} 秒（{K} 倍语速）· {len(T['scenes'])} 个场景 · 视觉事件 {len(ev) - 2} 个 · "
      f"最长静止 {max(b - a for a, b in gaps):.1f} 秒 · 音效 {len(T['sfx'])} 个（{spm:.1f}/分钟）· 关注提示 "
      + (f"{T['follow'][0] / K:.1f}–{T['follow'][1] / K:.1f} 秒" if T.get("follow") else "无"))
if not 40 <= total <= 70: warn.append(f"成片 {total:.0f} 秒，超出 45–65 秒的常用范围")
for w in warn: print("提醒：" + w)
for b in bad: print("✗ " + b)
if bad: sys.exit(1)
print("✓ 可以渲染")
