// 科普治愈 · 五套视觉模板。每套：init() 建静态资源，draw(g, t, frame) 画一帧。
// 共用 DEMO 节拍：0–2.6 钩子 · 2.6–7.0 现象（各闪各的→同步）· 7.0–10 收尾
"use strict";
const LOOKS = {};

// 节拍权重
const hookA = t => win(t, 0.3, 2.6, 0.45);
const phenA = t => win(t, 2.6, 7.1, 0.5);
const capA = t => win(t, 3.1, 7.0, 0.4);
const closeA = t => clamp((t - 7.3) / 0.6, 0, 1) * clamp((10 - t) / 0.6, 0, 1);

// 沿一条曲线撒点
function alongCurve(pts, n, spread) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const u = rnd(); const k = Math.floor(u * (pts.length - 1)); const f = u * (pts.length - 1) - k;
    const a = pts[k], b = pts[Math.min(k + 1, pts.length - 1)];
    out.push([lerp(a[0], b[0], f) + (rnd() - 0.5) * spread, lerp(a[1], b[1], f) + (rnd() - 0.5) * spread * 0.7]);
  }
  return out;
}
// 手绘感折线（带抖动）
function wobblyPath(g, pts, amp = 1.5) {
  g.beginPath(); pts.forEach((p, i) => { const x = p[0] + Math.sin(i * 1.7) * amp, y = p[1] + Math.cos(i * 2.3) * amp; i ? g.lineTo(x, y) : g.moveTo(x, y); });
}
function curvePts(ctrl, n = 60) { // 二次贝塞尔串
  const out = []; for (let s = 0; s < ctrl.length - 2; s += 2) {
    const [x0, y0] = ctrl[s], [cx, cy] = ctrl[s + 1], [x1, y1] = ctrl[s + 2];
    for (let i = 0; i <= n; i++) { const u = i / n, a = 1 - u; out.push([a * a * x0 + 2 * a * u * cx + u * u * x1, a * a * y0 + 2 * a * u * cy + u * u * y1]); }
  } return out;
}
function drawOn(g, pts, frac, width, color, cap = 'round') { // 线条逐渐画出来
  const n = Math.floor(pts.length * clamp(frac, 0, 1)); if (n < 2) return;
  g.save(); g.strokeStyle = color; g.lineWidth = width; g.lineCap = cap; g.lineJoin = 'round';
  g.beginPath(); for (let i = 0; i < n; i++) { i ? g.lineTo(pts[i][0], pts[i][1]) : g.moveTo(pts[i][0], pts[i][1]); } g.stroke(); g.restore();
}

// =====================================================================
// A · 博物笔记  FIELD NOTES
// =====================================================================
LOOKS.notes = {
  name: '博物笔记', ink: '#2a2622', red: '#b4382a', paperColor: '#f4ecd8',
  init() {
    reseed(11); this.paper = paperTexture(this.paperColor, 18, 0.035);
    this.branch = curvePts([[-30, 1120], [300, 880], [560, 960], [560, 960], [820, 1040], [1110, 820]], 50);
    this.twigs = [curvePts([[300, 910], [330, 760], [420, 690]], 20), curvePts([[620, 975], [660, 840], [760, 800]], 20), curvePts([[860, 1030], [930, 1140], [1030, 1160]], 20)];
    this.swarm = makeSwarm(alongCurve(this.branch, 92, 210).concat(alongCurve(this.twigs[0], 14, 90), alongCurve(this.twigs[1], 14, 90)), 7);
    this.focus = 25;
  },
  draw(g, t, frame) {
    const { ink, red } = this;
    g.drawImage(this.paper, 0, 0);
    // 横格与边线
    g.save(); g.strokeStyle = 'rgba(70,60,40,0.10)'; g.lineWidth = 1;
    for (let y = 240; y < H; y += 56) { g.beginPath(); g.moveTo(90, y); g.lineTo(W - 70, y); g.stroke(); }
    g.strokeStyle = 'rgba(180,56,42,0.55)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(150, 160); g.lineTo(150, H - 120); g.stroke(); g.restore();
    // 页眉
    g.fillStyle = ink; g.font = 'italic 26px "DejaVu Serif"'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('FIELD NOTES  ·  No. 01', 170, 150);
    g.font = '400 26px "Noto Serif CJK SC"'; g.textAlign = 'right'; g.fillText(DEMO.label, W - 80, 150);
    g.strokeStyle = ink; g.lineWidth = 1.2; g.beginPath(); g.moveTo(170, 182); g.lineTo(W - 80, 182); g.stroke();
    // 钩子
    const ha = hookA(t); if (ha > 0) {
      g.save(); g.globalAlpha = ha;
      const y0 = 430 + (1 - sm(t / 0.9)) * 10;
      textLine(g, DEMO.hook[0], 600, y0, { font: '700 58px "Noto Serif CJK SC"', color: ink, accent: red });
      textLine(g, DEMO.hook[1], 600, y0 + 92, { font: '700 58px "Noto Serif CJK SC"', color: ink, accent: red });
      // 手画下划线（关键词）
      g.font = '700 58px "Noto Serif CJK SC"'; const w1 = g.measureText('凭什么能').width, w2 = g.measureText('一起亮').width, tot = g.measureText('凭什么能一起亮？').width;
      const ux = 600 - tot / 2 + w1; const uf = sm((t - 1.2) / 0.5);
      g.strokeStyle = red; g.lineWidth = 3; g.lineCap = 'round'; wobblyPath(g, Array.from({ length: 12 }, (_, i) => [ux + i / 11 * w2 * uf, y0 + 92 + 36 + Math.sin(i) * 2]), 1.5); g.stroke();
      g.restore();
    }
    // 现象：树枝与萤火虫
    const pa = phenA(t); if (pa > 0) {
      g.save(); g.globalAlpha = pa;
      const df = (t - 2.6) / 1.2;
      drawOn(g, this.branch, df, 4, ink); this.twigs.forEach((tw, i) => drawOn(g, tw, df - 0.3 - i * 0.15, 2.5, ink));
      const S = this.swarm; const show = sm((t - 3.2) / 0.5);
      S.forEach((s, i) => {
        const f = s.flash || 0; const r = 9;
        g.globalAlpha = pa * show;
        // 点刻光晕
        if (f > 0.15) { g.fillStyle = red; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + i, rr = r + 8 + f * 22 * ((k % 3) + 1) / 2; g.beginPath(); g.arc(s.x + Math.cos(a) * rr, s.y + Math.sin(a) * rr, 1.6 + f * 1.4, 0, TAU); g.fill(); } }
        g.beginPath(); g.arc(s.x, s.y, r, 0, TAU); g.fillStyle = f > 0.15 ? red : this.paperColor; g.fill(); g.strokeStyle = ink; g.lineWidth = 1.6; g.stroke();
      });
      // 批注：引线 + 小字
      const na = win(t, 3.8, 7.0, 0.4); if (na > 0) {
        g.globalAlpha = pa * na; const fo = S[this.focus];
        g.strokeStyle = red; g.lineWidth = 1.4; g.setLineDash([3, 5]);
        for (const j of fo.nb) { g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(S[j].x, S[j].y); g.stroke(); }
        g.setLineDash([]); g.beginPath(); g.arc(fo.x, fo.y, 22, 0, TAU); g.stroke();
        const nx = 640, ny = 560; wobblyPath(g, [[fo.x + 14, fo.y - 18], [nx - 40, ny + 60], [nx, ny + 60]], 1); g.stroke();
        g.fillStyle = red; g.font = 'italic 26px "DejaVu Serif"'; g.textAlign = 'left'; g.fillText('fig. 1', nx + 8, ny + 20);
        g.fillStyle = ink; g.font = '400 30px "Noto Serif CJK SC"'; g.fillText('只盯最近的六七只', nx + 8, ny + 60);
      }
      g.restore();
    }
    const ca = capA(t); if (ca > 0) { g.save(); g.globalAlpha = ca; textLine(g, DEMO.cap, 600, 1400, { font: '400 46px "Noto Serif CJK SC"', color: ink, accent: red }); g.restore(); }
    // 收尾
    const za = closeA(t); if (za > 0) {
      g.save(); g.globalAlpha = za;
      textLine(g, DEMO.close[0], 600, 880, { font: '700 60px "Noto Serif CJK SC"', color: ink, accent: red });
      textLine(g, DEMO.close[1], 600, 976, { font: '700 60px "Noto Serif CJK SC"', color: ink, accent: red });
      // 小印
      g.translate(W - 190, 1180); g.rotate(-0.06); g.strokeStyle = red; g.lineWidth = 3; g.strokeRect(-44, -44, 88, 88);
      g.fillStyle = red; g.font = '700 30px "Noto Serif CJK SC"'; g.textAlign = 'center'; g.fillText('笔', 0, -18); g.fillText('记', 0, 20);
      g.restore();
    }
    grain(g, frame, 0.06, 'multiply');
  }
};

// =====================================================================
// B · 蓝图  BLUEPRINT
// =====================================================================
LOOKS.blueprint = {
  name: '蓝图', line: '#dfe9f5', amber: '#ffcf5c', bg0: '#164274', bg1: '#0b2446',
  init() {
    reseed(22); const pts = []; for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) pts.push([205 + c * 96 + (rnd() - 0.5) * 50, 640 + r * 78 + (rnd() - 0.5) * 36]);
    this.swarm = makeSwarm(pts, 7); this.focus = 38; this.noise = noiseCanvas(270, 480, 255);
  },
  draw(g, t, frame) {
    const { line, amber } = this;
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, this.bg0); gr.addColorStop(1, this.bg1); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.12; g.drawImage(this.noise, 0, 0, W, H); g.restore();
    // 网格
    g.save(); g.strokeStyle = 'rgba(223,233,245,0.07)'; g.lineWidth = 1;
    for (let x = 0; x <= W; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.strokeStyle = 'rgba(223,233,245,0.16)'; for (let x = 0; x <= W; x += 100) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 100) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // 图框 + 图签
    g.strokeStyle = line; g.lineWidth = 2; g.strokeRect(50, 50, W - 100, H - 100); g.lineWidth = 1; g.strokeRect(62, 62, W - 124, H - 124);
    g.beginPath(); g.moveTo(560, H - 62); g.lineTo(560, H - 260); g.lineTo(W - 62, H - 260); g.stroke();
    for (let y = H - 260; y < H - 62; y += 50) { g.beginPath(); g.moveTo(560, y); g.lineTo(W - 62, y); g.stroke(); }
    g.fillStyle = line; g.font = '20px "DejaVu Sans Mono"'; g.textAlign = 'left'; g.textBaseline = 'middle';
    const rows = [['TITLE', '萤火虫同步  FIREFLIES'], ['SCALE', '1 : 1   UNIT  只'], ['SHEET', '01 / 01   REV  A'], ['DATE', '2026-10-29   BY  NOVA']];
    rows.forEach((r, i) => { g.font = '18px "DejaVu Sans Mono"'; g.fillStyle = 'rgba(223,233,245,0.6)'; g.fillText(r[0], 575, H - 235 + i * 50); g.fillStyle = line; g.font = '22px "DejaVu Sans Mono", "Noto Sans CJK SC"'; g.fillText(r[1], 680, H - 235 + i * 50); });
    g.font = '20px "DejaVu Sans Mono"'; g.fillStyle = 'rgba(223,233,245,0.7)'; g.fillText('FIG. 1 — ' + DEMO.en, 80, 110); g.textAlign = 'right'; g.fillText('DWG  No. SH-001', W - 80, 110);
    g.restore();
    // 钩子
    const ha = hookA(t); if (ha > 0) {
      g.save(); g.globalAlpha = ha;
      textLine(g, DEMO.hook[0], 540, 400, { font: '700 56px "Noto Sans CJK SC"', color: line, accent: amber });
      textLine(g, DEMO.hook[1], 540, 490, { font: '700 56px "Noto Sans CJK SC"', color: line, accent: amber });
      g.restore();
    }
    // 现象
    const pa = phenA(t); if (pa > 0) {
      g.save(); g.globalAlpha = pa; const S = this.swarm; const show = sm((t - 2.7) / 0.6);
      S.forEach((s, i) => {
        const f = s.flash || 0; g.globalAlpha = pa * show;
        g.strokeStyle = line; g.lineWidth = 1.6; g.beginPath(); g.arc(s.x, s.y, 13, 0, TAU); g.stroke();
        g.beginPath(); g.moveTo(s.x - 20, s.y); g.lineTo(s.x - 15, s.y); g.moveTo(s.x + 15, s.y); g.lineTo(s.x + 20, s.y); g.moveTo(s.x, s.y - 20); g.lineTo(s.x, s.y - 15); g.moveTo(s.x, s.y + 15); g.lineTo(s.x, s.y + 20); g.stroke();
        if (f > 0.12) { g.fillStyle = amber; g.globalAlpha = pa * show * Math.min(1, f + 0.2); g.beginPath(); g.arc(s.x, s.y, 9, 0, TAU); g.fill(); g.strokeStyle = amber; g.lineWidth = 2; g.beginPath(); g.arc(s.x, s.y, 18 + f * 12, 0, TAU); g.stroke(); }
      });
      const na = win(t, 3.8, 7.0, 0.4); if (na > 0) {
        g.globalAlpha = pa * na; const fo = S[this.focus];
        g.strokeStyle = amber; g.lineWidth = 1.4; g.setLineDash([6, 6]); for (const j of fo.nb) { g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(S[j].x, S[j].y); g.stroke(); } g.setLineDash([]);
        // 半径尺寸线
        const far = S[fo.nb[fo.nb.length - 1]]; const R = Math.hypot(far.x - fo.x, far.y - fo.y);
        g.beginPath(); g.arc(fo.x, fo.y, R, 0, TAU); g.stroke();
        g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(fo.x + R, fo.y); g.stroke();
        g.fillStyle = amber; g.font = '22px "DejaVu Sans Mono"'; g.textAlign = 'left'; g.fillText('r', fo.x + R / 2 - 6, fo.y - 18);
        g.font = '22px "DejaVu Sans Mono", "Noto Sans CJK SC"'; g.fillText('n = 6 ~ 7 只', fo.x + R + 14, fo.y - 14);
      }
      g.restore();
    }
    const ca = capA(t); if (ca > 0) { g.save(); g.globalAlpha = ca; textLine(g, DEMO.cap, 540, 1430, { font: '400 46px "Noto Sans CJK SC"', color: line, accent: amber }); g.restore(); }
    const za = closeA(t); if (za > 0) {
      g.save(); g.globalAlpha = za;
      textLine(g, DEMO.close[0], 540, 860, { font: '700 58px "Noto Sans CJK SC"', color: line, accent: amber });
      textLine(g, DEMO.close[1], 540, 950, { font: '700 58px "Noto Sans CJK SC"', color: line, accent: amber });
      g.strokeStyle = amber; g.lineWidth = 2; g.setLineDash([10, 8]); g.strokeRect(150, 790, 780, 230); g.restore();
    }
    vignette(g, 0.35, 0.35);
  }
};

// =====================================================================
// C · 晨光  DAWN
// =====================================================================
LOOKS.dawn = {
  name: '晨光', text: '#3a3452', accent: '#e06a3a', muted: 'rgba(58,52,82,0.55)',
  init() {
    reseed(33); const pts = []; for (let i = 0; i < 64; i++) pts.push([150 + rnd() * 780, 700 + rnd() * 540]);
    this.swarm = makeSwarm(pts, 7);
    this.spr = document.createElement('canvas'); this.spr.width = this.spr.height = 160; const s = this.spr.getContext('2d');
    const gr = s.createRadialGradient(80, 80, 0, 80, 80, 80); gr.addColorStop(0, 'rgba(255,214,120,0.95)'); gr.addColorStop(0.25, 'rgba(250,180,90,0.45)'); gr.addColorStop(1, 'rgba(240,160,80,0)'); s.fillStyle = gr; s.fillRect(0, 0, 160, 160);
    this.core = document.createElement('canvas'); this.core.width = this.core.height = 32; const c = this.core.getContext('2d'); const cg = c.createRadialGradient(16, 16, 0, 16, 16, 16); cg.addColorStop(0, 'rgba(255,255,255,1)'); cg.addColorStop(0.5, 'rgba(255,245,220,0.8)'); cg.addColorStop(1, 'rgba(255,240,210,0)'); c.fillStyle = cg; c.fillRect(0, 0, 32, 32);
  },
  draw(g, t, frame) {
    const { text, accent } = this;
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#fbe3cc'); gr.addColorStop(0.45, '#efd6e4'); gr.addColorStop(1, '#cfe1f4'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // 太阳
    const sun = g.createRadialGradient(540, 560 + Math.sin(t * 0.3) * 6, 10, 540, 560, 520); sun.addColorStop(0, 'rgba(255,255,250,0.95)'); sun.addColorStop(0.3, 'rgba(255,236,210,0.55)'); sun.addColorStop(1, 'rgba(255,230,210,0)'); g.fillStyle = sun; g.fillRect(0, 0, W, H);
    // 页眉
    g.fillStyle = this.muted; g.font = '300 24px "Noto Sans CJK SC"'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('01 — 萤火虫', 110, 150);
    g.textAlign = 'right'; g.font = '300 22px "DejaVu Sans"'; g.fillText(DEMO.en, W - 110, 150);
    g.strokeStyle = 'rgba(58,52,82,0.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(110, 185); g.lineTo(W - 110, 185); g.stroke();
    const ha = hookA(t); if (ha > 0) {
      g.save(); g.globalAlpha = ha; const y0 = 390 + (1 - sm(t / 1.0)) * 14;
      textLine(g, DEMO.hook[0], 540, y0, { font: '500 54px "Noto Sans CJK SC"', color: text, accent, spacing: 2 });
      textLine(g, DEMO.hook[1], 540, y0 + 92, { font: '500 54px "Noto Sans CJK SC"', color: text, accent, spacing: 2 });
      g.restore();
    }
    const pa = phenA(t); if (pa > 0) {
      g.save(); const S = this.swarm; const show = sm((t - 2.7) / 0.8);
      S.forEach((s, i) => { const f = s.flash || 0; const x = s.x + Math.sin(t * 0.5 + i) * 4, y = s.y + Math.cos(t * 0.4 + i) * 4; const sz = 40 + f * 110; g.globalAlpha = pa * show * (0.12 + f * 0.85); g.drawImage(this.spr, x - sz / 2, y - sz / 2, sz, sz); const cs = 10 + f * 14; g.globalAlpha = pa * show * (0.35 + f * 0.65); g.drawImage(this.core, x - cs / 2, y - cs / 2, cs, cs); });
      g.restore();
      const na = win(t, 3.8, 7.0, 0.5); if (na > 0) {
        g.save(); g.globalAlpha = pa * na; const fo = this.swarm[20];
        g.strokeStyle = accent; g.lineWidth = 1.2; for (const j of fo.nb) { const o = this.swarm[j]; g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(o.x, o.y); g.stroke(); }
        g.beginPath(); g.arc(fo.x, fo.y, 20, 0, TAU); g.stroke(); g.restore();
      }
    }
    const ca = capA(t); if (ca > 0) {
      g.save(); g.globalAlpha = ca; g.strokeStyle = 'rgba(58,52,82,0.3)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(300, 1370); g.lineTo(780, 1370); g.stroke(); g.beginPath(); g.moveTo(300, 1480); g.lineTo(780, 1480); g.stroke();
      textLine(g, DEMO.cap, 540, 1425, { font: '300 42px "Noto Sans CJK SC"', color: text, accent, spacing: 1 }); g.restore();
    }
    const za = closeA(t); if (za > 0) {
      g.save(); g.globalAlpha = za;
      textLine(g, DEMO.close[0], 540, 880, { font: '500 56px "Noto Sans CJK SC"', color: text, accent, spacing: 2 });
      textLine(g, DEMO.close[1], 540, 972, { font: '500 56px "Noto Sans CJK SC"', color: text, accent, spacing: 2 });
      g.fillStyle = accent; g.beginPath(); g.arc(540, 1080, 6, 0, TAU); g.fill(); g.restore();
    }
    grain(g, frame, 0.035, 'soft-light');
  }
};

// =====================================================================
// D · 水墨  INK
// =====================================================================
LOOKS.ink = {
  name: '水墨', ink: '#17150f', grey: 'rgba(23,21,15,0.22)', red: '#b4362a', paperColor: '#ece5d3',
  init() {
    reseed(44); this.paper = paperTexture(this.paperColor, 14, 0.05);
    // 墨枝：一条主枝，用许多半透明圆叠出笔触
    this.branch = curvePts([[-60, 1260], [260, 1000], [480, 1060], [480, 1060], [700, 1120], [900, 880]], 90);
    this.twig = curvePts([[480, 1060], [560, 900], [640, 860]], 30); this.twig2 = curvePts([[250, 1010], [230, 900], [300, 820]], 30);
    this.swarm = makeSwarm(alongCurve(this.branch, 80, 200).concat(alongCurve(this.twig, 12, 80), alongCurve(this.twig2, 10, 80)), 7); this.focus = 30;
    // 预画笔触层
    this.strokes = document.createElement('canvas'); this.strokes.width = W; this.strokes.height = H; const s = this.strokes.getContext('2d');
    const brush = (pts, w0, w1, a) => { pts.forEach((p, i) => { const u = i / pts.length; const w = lerp(w0, w1, u) * (0.75 + 0.5 * Math.sin(i * 0.9) ** 2); s.fillStyle = `rgba(23,21,15,${a * (0.45 + 0.55 * Math.sin(i * 0.37) ** 2)})`; s.beginPath(); s.arc(p[0] + (rnd() - 0.5) * 4, p[1] + (rnd() - 0.5) * 4, w / 2, 0, TAU); s.fill(); }); };
    // 飞白：沿枝多条细线
    const feibai = (pts, n, w, a) => { for (let k = 0; k < n; k++) { const off = (k - n / 2) * w; s.strokeStyle = `rgba(23,21,15,${a * (0.4 + rnd() * 0.6)})`; s.lineWidth = 1 + rnd() * 2; s.beginPath(); pts.forEach((p, i) => { const x = p[0] + off * 0.3 + (rnd() - 0.5) * 2, y = p[1] + off; i ? s.lineTo(x, y) : s.moveTo(x, y); }); s.stroke(); } };
    brush(this.branch, 58, 14, 0.16); brush(this.branch, 34, 8, 0.42); brush(this.branch, 16, 4, 0.8); feibai(this.branch, 7, 5, 0.35);
    brush(this.twig, 18, 5, 0.6); brush(this.twig2, 16, 4, 0.55); feibai(this.twig, 4, 3, 0.3);
    // 远山淡墨
    const m = s.createRadialGradient(240, 1900, 40, 240, 1900, 760); m.addColorStop(0, 'rgba(23,21,15,0.07)'); m.addColorStop(1, 'rgba(23,21,15,0)'); s.fillStyle = m; s.fillRect(0, 1200, W, 720);
  },
  draw(g, t, frame) {
    const { ink, red } = this;
    g.drawImage(this.paper, 0, 0);
    // 题签（竖排小字）
    g.fillStyle = 'rgba(23,21,15,0.6)'; g.font = '400 22px "Noto Serif CJK SC"';
    textColumn(g, [['现象其一']], W - 90, 120, { font: '400 24px "Noto Serif CJK SC"', color: 'rgba(23,21,15,0.6)', accent: red });
    // 钩子：竖排两列
    const ha = hookA(t); if (ha > 0) {
      g.save(); g.globalAlpha = ha;
      textColumn(g, [['几千只萤火虫']], W - 190, 300, { font: '600 56px "Noto Serif CJK SC"', color: ink, accent: red });
      textColumn(g, [['没人指挥，凭什么能'], ['一起亮', 1], ['？']], W - 270, 300, { font: '600 56px "Noto Serif CJK SC"', color: ink, accent: red });
      g.restore();
    }
    const pa = phenA(t); if (pa > 0) {
      g.save(); g.globalAlpha = pa * sm((t - 2.6) / 0.9); g.drawImage(this.strokes, 0, 0); g.restore();
      const S = this.swarm; const show = sm((t - 3.2) / 0.6);
      S.forEach((s, i) => {
        const f = s.flash || 0; g.save(); g.globalAlpha = pa * show;
        // 墨晕
        if (f > 0.1) { const hz = g.createRadialGradient(s.x, s.y, 0, s.x, s.y, 20 + f * 34); hz.addColorStop(0, `rgba(23,21,15,${0.55 * f})`); hz.addColorStop(1, 'rgba(23,21,15,0)'); g.fillStyle = hz; g.beginPath(); g.arc(s.x, s.y, 20 + f * 34, 0, TAU); g.fill(); }
        g.fillStyle = f > 0.1 ? ink : this.grey; g.beginPath(); g.arc(s.x + Math.sin(i) * 1.5, s.y, 7 + f * 4, 0, TAU); g.fill(); g.restore();
      });
      const na = win(t, 3.8, 7.0, 0.4); if (na > 0) {
        g.save(); g.globalAlpha = pa * na; const fo = S[this.focus];
        g.strokeStyle = red; g.lineWidth = 1.2; for (const j of fo.nb) { g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(S[j].x, S[j].y); g.stroke(); }
        g.beginPath(); g.arc(fo.x, fo.y, 18, 0, TAU); g.stroke(); g.restore();
      }
    }
    const ca = capA(t); if (ca > 0) { g.save(); g.globalAlpha = ca; textColumn(g, DEMO.cap, 120, 330, { font: '400 40px "Noto Serif CJK SC"', color: ink, accent: red }); g.restore(); }
    const za = closeA(t); if (za > 0) {
      g.save(); g.globalAlpha = za;
      textColumn(g, DEMO.close[0], 640, 420, { font: '600 58px "Noto Serif CJK SC"', color: ink, accent: red });
      textColumn(g, DEMO.close[1], 540, 420, { font: '600 58px "Noto Serif CJK SC"', color: ink, accent: red });
      // 印
      g.translate(440, 1250); g.rotate(0.03); g.fillStyle = red; roundRect(g, -46, -46, 92, 92, 6); g.fill();
      g.fillStyle = this.paperColor; g.font = '700 34px "Noto Serif CJK SC"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('同', 0, -20); g.fillText('步', 0, 20);
      g.restore();
    }
    grain(g, frame, 0.05, 'multiply');
  }
};

// =====================================================================
// E · 海报  POSTER
// =====================================================================
LOOKS.poster = {
  name: '海报', bg: '#f1ece1', black: '#141414', red: '#d8432f', blue: '#1f3f8f', yellow: '#f0b62f',
  init() {
    reseed(55); const pts = []; for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) pts.push([180 + c * 90, 740 + r * 76]);
    this.swarm = makeSwarm(pts, 8); this.focus = 40;
  },
  draw(g, t, frame) {
    const { bg, black, red, blue, yellow } = this; const snap = u => clamp(u, 0, 1) < 1 ? ease(u) : 1;
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // 大圆（红）从右上滑入
    const ci = snap(t / 0.5); g.fillStyle = red; g.beginPath(); g.arc(W + 80 - ci * 300, -60 + ci * 160, 330, 0, TAU); g.fill();
    // 蓝条
    const bi = snap((t - 0.15) / 0.45); g.fillStyle = blue; g.fillRect(0, 1560, W * bi, 70);
    // 页眉
    g.fillStyle = black; g.font = '700 22px "DejaVu Sans"'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('SCIENCE  /  HEALING', 90, 130);
    g.font = '700 22px "Noto Sans CJK SC"'; g.fillText('萤火虫同步', 90, 165);
    g.font = '900 220px "Noto Sans CJK SC"'; g.fillStyle = 'rgba(20,20,20,0.08)'; g.textAlign = 'right'; g.fillText('01', W - 70, 1700);
    const ha = t < 2.6 ? snap((t - 0.3) / 0.35) : 0; if (ha > 0) {
      g.save(); g.globalAlpha = 1; const dx = (1 - ha) * -60;
      textLine(g, DEMO.hook[0], 90 + dx, 430, { font: '900 66px "Noto Sans CJK SC"', color: black, accent: red, align: 'left' });
      textLine(g, DEMO.hook[1], 90 + dx, 530, { font: '900 66px "Noto Sans CJK SC"', color: black, accent: red, align: 'left' });
      g.fillStyle = yellow; g.fillRect(90, 600, 160 * ha, 14); g.restore();
    }
    const pa = t >= 2.6 && t < 7.2 ? 1 : 0; if (pa > 0) {
      const S = this.swarm; const show = snap((t - 2.6) / 0.3);
      S.forEach((s, i) => { const f = s.flash || 0; const on = f > 0.2; const r = (on ? 19 : 12) * show; g.fillStyle = on ? red : black; g.beginPath(); g.arc(s.x, s.y, r, 0, TAU); g.fill(); });
      const na = t > 3.8 ? 1 : 0; if (na) {
        const fo = S[this.focus]; g.strokeStyle = blue; g.lineWidth = 4; for (const j of fo.nb) { g.beginPath(); g.moveTo(fo.x, fo.y); g.lineTo(S[j].x, S[j].y); g.stroke(); }
        g.fillStyle = yellow; g.beginPath(); g.arc(fo.x, fo.y, 18, 0, TAU); g.fill(); g.strokeStyle = black; g.lineWidth = 3; g.stroke();
      }
      if (t > 3.1) { g.fillStyle = black; g.fillRect(90, 1445, 10, 70); textLine(g, DEMO.cap, 125, 1480, { font: '700 44px "Noto Sans CJK SC"', color: black, accent: red, align: 'left' }); }
    }
    if (t >= 7.2) {
      const za = snap((t - 7.2) / 0.35); const dx = (1 - za) * -60;
      g.fillStyle = yellow; g.fillRect(0, 760, W, 300 * za);
      textLine(g, DEMO.close[0], 90 + dx, 850, { font: '900 64px "Noto Sans CJK SC"', color: black, accent: red, align: 'left' });
      textLine(g, DEMO.close[1], 90 + dx, 950, { font: '900 64px "Noto Sans CJK SC"', color: black, accent: red, align: 'left' });
    }
    g.fillStyle = bg; g.font = '700 22px "DejaVu Sans"'; g.textAlign = 'left'; g.fillText('No. 01   SYNCHRONOUS FIREFLIES   2026', 90, 1595);
  }
};
