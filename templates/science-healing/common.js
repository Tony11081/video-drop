// 科普治愈 · 公共工具：时间线、同步模拟、纹理、文字排版
"use strict";
const W = 1080, H = 1920, FPS = 30, DT = 1 / FPS, TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const sm = u => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const ease = u => { u = clamp(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const win = (t, a, b, f = 0.5) => clamp(Math.min((t - a) / f, (b - t) / f), 0, 1);
let _seed = 20261029;
function rnd() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
function reseed(s) { _seed = s; }

// ---------- 同步模拟：n 个振子，各看最近 k 个邻居 ----------
function makeSwarm(points, k = 8) {
  const S = points.map(p => ({ x: p[0], y: p[1], ph: rnd(), om: 1 / (0.95 + rnd() * 0.1), nb: [] }));
  for (const s of S) {
    s.nb = S.map((o, j) => [(o.x - s.x) ** 2 + (o.y - s.y) ** 2, j]).sort((a, b) => a[0] - b[0]).slice(1, k + 1).map(v => v[1]);
  }
  S.step = (K) => {
    const ph = S.map(s => s.ph);
    let re = 0, im = 0; for (const s of S) { re += Math.cos(TAU * s.ph); im += Math.sin(TAU * s.ph); }
    const mph = Math.atan2(im, re) / TAU;
    for (const s of S) {
      let c = 0; for (const j of s.nb) c += Math.sin(TAU * (ph[j] - s.ph)); c /= s.nb.length;
      const np = s.ph + DT * (s.om + K * (c + 0.4 * Math.sin(TAU * (mph - s.ph))));
      s.flash = np >= 1 ? 1 : (s.flash || 0) * 0.84;
      s.ph = (np % 1 + 1) % 1;
    }
    S.R = Math.hypot(re, im) / S.length;
  };
  return S;
}
const flashShape = p => p < 0.14 ? Math.sin(Math.PI * p / 0.14) : 0;

// ---------- 纹理 ----------
function noiseCanvas(w, h, alpha = 255, mono = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const im = g.createImageData(w, h); const d = im.data;
  for (let i = 0; i < d.length; i += 4) { const v = rnd() * 255; d[i] = v; d[i + 1] = mono ? v : rnd() * 255; d[i + 2] = mono ? v : rnd() * 255; d[i + 3] = alpha; }
  g.putImageData(im, 0, 0); return c;
}
function paperTexture(base, fiber = 18, blotch = 0.05) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  const im = g.getImageData(0, 0, W, H); const d = im.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * fiber; d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.8; }
  g.putImageData(im, 0, 0);
  for (let k = 0; k < 14; k++) { const x = rnd() * W, y = rnd() * H, r = 260 + rnd() * 420; const gr = g.createRadialGradient(x, y, 0, x, y, r); const a = rnd() * blotch; gr.addColorStop(0, `rgba(90,70,40,${a})`); gr.addColorStop(1, 'rgba(90,70,40,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  return c;
}
const GRAIN = []; for (let k = 0; k < 4; k++) GRAIN.push(noiseCanvas(270, 480));
function grain(g, frame, alpha = 0.05, mode = 'overlay') { g.save(); g.globalCompositeOperation = mode; g.globalAlpha = alpha; g.drawImage(GRAIN[frame % 4], 0, 0, W, H); g.restore(); }
function vignette(g, strength = 0.5, inner = 0.3) {
  const gr = g.createRadialGradient(W / 2, H * 0.5, H * inner, W / 2, H * 0.5, H * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${strength})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// ---------- 文字 ----------
// parts: [[text, accent?], ...]  按宽度居中；accent 为 true 的词用强调色
function textLine(g, parts, x, y, { font, color, accent, align = 'center', shadow = null, spacing = 0 }) {
  g.save(); g.font = font; g.textBaseline = 'middle';
  const widths = parts.map(p => g.measureText(p[0]).width + spacing * (p[0].length - 1));
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - total / 2 : (align === 'right' ? x - total : x);
  if (shadow) { g.shadowColor = shadow; g.shadowBlur = 16; }
  g.textAlign = 'left';
  parts.forEach((p, i) => {
    g.fillStyle = p[1] ? accent : color;
    if (spacing) { for (const ch of p[0]) { g.fillText(ch, cx, y); cx += g.measureText(ch).width + spacing; } }
    else { g.fillText(p[0], cx, y); cx += widths[i]; }
  });
  g.restore();
}
// 竖排（水墨用）
function textColumn(g, parts, x, yTop, { font, color, accent, gap = 1.12 }) {
  g.save(); g.font = font; g.textBaseline = 'middle'; g.textAlign = 'center';
  const size = parseInt(font.match(/(\d+)px/)[1]); let y = yTop + size / 2;
  for (const p of parts) { g.fillStyle = p[1] ? accent : color; for (const ch of p[0]) { const rot = /[，。、：；！？]/.test(ch); g.save(); g.translate(x, y); if (rot) { g.translate(size * 0.3, -size * 0.3); } g.fillText(ch, 0, 0); g.restore(); y += size * gap; } }
  g.restore(); return y;
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------- 样片共用节拍（10 秒）----------
// 0–2.6 钩子 · 2.6–7.0 现象（各闪各的 → 同步）· 7.0–10 收尾
const DEMO = {
  dur: 10,
  hook: [[['几千只萤火虫，没人指挥，']], [['凭什么能'], ['一起亮', 1], ['？']]],
  cap: [['每只，只看身边最近的'], ['六七只', 1], ['。']],
  close: [[['想成为什么样的人，']], [['先看看，你在'], ['跟谁一起闪', 1], ['。']]],
  label: '现象 01 · 萤火虫同步',
  en: 'SYNCHRONOUS FIREFLIES',
  K: t => t < 3.2 ? 0 : 0.45 * sm((t - 3.2) / 2.2),   // 耦合强度随时间
};
