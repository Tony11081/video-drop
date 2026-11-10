/* No.63 Policy Desk engine (news-desk look) — same episode config as templates/policy-brief (window.EP),
   plus one extra scene type `quote` (official text slip). Builds an episode and exposes seek(t) / TOTAL.
   t is in VOICE seconds (the timeline the voiceover was generated on).
   Scene-local animation times u are in OUTPUT seconds (after the final speed-up EP.speed).
   A voice line without `scene` continues the previous scene, so one picture can carry several lines.
   Scenes with `video` leave a 16:9 window that the editing server fills with stock footage
   (window.OVERLAYS, in picture seconds). */
(function () {
  const E = window.EP, K = E.speed, N = E.rail.length, UNIT = E.unit || "RULE";
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const back = (x) => { x = cl(x); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = (u, a, d) => cl((u - a) / d);
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const pad = (n) => String(n).padStart(2, "0");
  const f2 = (x) => (+x).toFixed(2);

  /* ---------- timeline: voice lines → scene groups ---------- */
  const V = E.voice, gap = E.tts.gap;
  let acc = E.lead;
  V.forEach((v) => { v.at = acc; acc += v.dur + gap; });
  const G = [];
  V.forEach((v, i) => { if (v.scene || i === 0) G.push({ scene: v.scene, lines: [v] }); else G[G.length - 1].lines.push(v); });
  G.forEach((g, i) => { g.i = i; g.start = i === 0 ? 0 : g.lines[0].at - 0.12; });
  G.forEach((g, i) => {
    const l = g.lines[g.lines.length - 1];
    g.end = i < G.length - 1 ? G[i + 1].start : l.at + l.dur + E.tail;
    g.D = (g.end - g.start) / K;
    g.L = g.lines.map((x) => (x.at - g.start) / K);
    g.LE = g.lines.map((x) => (x.at + x.dur - g.start) / K);
  });
  const TOTAL = G[G.length - 1].end;
  const OVERLAYS = [];

  /* when the i-th item of a scene appears (output seconds, scene-local) */
  const onT = (g, x) => { const k = Math.floor(x), f = x - k; return g.L[k] + f * (g.LE[k] - g.L[k]) + 0.25; };
  const when = (s, g, i, dflt) => (s.on ? onT(g, s.on[i]) : s.at ? s.at[i] * g.D : dflt);

  /* ---------- small builders ---------- */
  const lines = (arr, cls, t0 = 0.05, step = 0.08, dimFirst = false) =>
    arr.map((l, i) => `<span class="ln"><span class="chrome ${dimFirst && i === 0 && arr.length > 1 ? "dim" : ""} ${cls || ""}" data-a="rise@${f2(t0 + i * step)}">${esc(l)}</span></span>`).join("");
  const isTake = (s) => /^OUR TAKE/i.test((s && s.kicker) || "");
  const stamp = (style, at = 0.15) => `<div class="abs take" style="${style}" data-a="stamp@${f2(at)}"><span>我们的看法</span><small>OUR TAKE · SHOPWRIGHT</small></div>`;
  const head = (s) => {
    let h = "";
    if (s.rule) h += `<div class="abs ghost" style="right:56px;top:290px" data-a="up@0.1">${pad(s.rule)}</div>
      <div class="abs idx" style="left:72px;top:322px" data-a="up@0">${UNIT} ${pad(s.rule)} <em>/ ${pad(N)}</em></div>`;
    else if (isTake(s)) h += `<div class="abs idx" style="left:72px;top:322px" data-a="up@0">OUR TAKE <em>/ 观点</em></div>${stamp("right:72px;top:292px")}`;
    else if (s.kicker) h += `<div class="abs status" style="left:72px;top:312px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>`;
    if (s.title) h += `<div class="abs" style="left:72px;top:${s.rule ? 366 : 380}px">
        ${s.title.length > 1 ? `<div class="t1">${lines([s.title[0]], "dim", 0.05)}</div>` : ""}
        <div class="t2">${lines([s.title[s.title.length - 1]], "", 0.12)}</div></div>`;
    return h;
  };
  const TOP = (s) => (s.title ? (s.title.length > 1 ? 630 : 540) : 400);
  const ICON = { ok: "✓", bad: "✕", plain: "•", warn: "!" };
  const rowEl = (r, t, extra = "") => {
    const [kind, text, sub] = r;
    return `<div class="row ${kind === "plain" ? "" : kind} rw" style="padding:26px 30px;${extra}" data-a="up@${f2(t)}">
      <span class="ico ${kind === "warn" ? "bad" : kind === "plain" ? "pl" : kind}">${ICON[kind]}</span>
      <span style="display:block;min-width:0"><span class="v" style="font-size:40px;display:block;${kind === "bad" ? "color:var(--warn)" : ""}">${esc(text)}</span>${sub ? `<span class="rsub">${esc(sub)}</span>` : ""}</span></div>`;
  };
  const photo = (src, style, a = "reveal@0.1", pos = "center") => `<div class="photo" style="${style}" data-a="${a}"><div class="img" style="background-image:url('${src}');background-position:${pos}"></div></div>`;
  const vframe = (x, y, w, h) => `<div class="vframe" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" data-a="fade@0"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i></div>`;
  const cbar = (file, run, done, doneCls = "ok") => `<div class="cbar"><span></span><span></span><span></span><code>${esc(file)}</code>
      <div class="st"><i class="run">● ${esc(run)}</i><i class="${doneCls}" style="display:none">● ${esc(done)}</i></div></div>`;
  const setState = (root, u, at) => { const st = $(root, ".st"); if (!st) return; const done = u >= at; st.children[0].style.display = done ? "none" : ""; st.children[1].style.display = done ? "" : "none"; };
  const scanAt = (el, u, a, d, top, bottom) => {
    const p = P(u, a, d), y = top + (bottom - top) * eio(p) - 120;
    el.style.opacity = p > 0 && p < 1 ? 1 : 0; el.style.top = y + "px";
    el.style.clipPath = `inset(${Math.max(0, top - y)}px 0 ${Math.max(0, y + 122 - bottom)}px 0)`;
  };
  const comet = (el, u, a, d = 1.3) => { const p = P(u, a, d); el.style.setProperty("--ang", 360 * eio(p) + "deg"); el.style.setProperty("--co", p > 0 && p < 1 ? 1 : 0); };
  const addOverlay = (g, s, x, y, w, h) => {
    if (!s.video) return;
    const st = g.i === 0 ? 0.05 : g.start + 0.08;
    OVERLAYS.push({ video_id: s.video, start: +st.toFixed(3), from: s.from || 0, duration: +Math.min(g.end - st + 0.12, TOTAL - st - 0.05).toFixed(3), x, y, w, h, fade: 0.3 });
  };
  const fmtNum = (n, dec = 0) => (dec ? n.toFixed(dec) : Math.round(n).toLocaleString("en-US"));

  /* ---------- scene types: (s, g) → {html, fx?, cues} ---------- */
  const T = {};
  const FY = 262, FH = 608;                           // full-width 16:9 footage window
  T.hook = (s, g) => {
    const vid = !!s.video, fs = s.lines.length > 1 ? 92 : 108;
    addOverlay(g, s, 0, FY, 1080, FH);
    return {
      html: `
      ${vid ? vframe(0, FY, 1080, FH) : photo(s.img, `left:0;top:${FY}px;width:1080px;height:${FH}px`, "reveal@0", s.pos || "center 60%")}
      ${vid ? "" : '<div class="scan"></div>'}
      <div class="abs lt3" style="left:0;right:0;top:${FY + FH}px" data-a="wipe@0.2"><b>快讯</b><span>${esc(s.kicker)}</span>${s.scanTag ? `<em>${esc(s.scanTag)}</em>` : ""}</div>
      <div class="abs" style="left:72px;top:${FY + FH + 88}px;font-weight:900;font-size:${fs}px;line-height:1.14;letter-spacing:-.03em">
        ${lines(s.lines, "", 0.05, 0.08)}
        <span class="ln"><span data-a="rise@0.21"><span class="marker"><span class="chrome">${esc(s.marked)}</span></span></span></span>
      </div>`,
      fx(r, u, D) {
        const im = $(r, ".photo .img"); if (im) im.style.setProperty("--kb", 1.14 - 0.14 * eo((u / D) * 1.2));
        const sc = $(r, ".scan"); if (sc) scanAt(sc, u, 0.55, 1.0, FY, FY + FH);
        $(r, ".marker").style.setProperty("--mk", eo(P(u, 0.75, 0.55)));
      },
      cues: [[0.55, "scan"], [0.8, "soft"], [1.4, "bad"]],
    };
  };
  T.index = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.label)}</div>
      <div class="abs chrome bignum" style="left:60px;top:404px;font-size:330px" data-a="up@0.05"><span class="num">00</span></div>
      <div class="abs" style="left:500px;top:452px">
        <div style="font-weight:700;font-size:80px;line-height:1.12;letter-spacing:-.03em">${lines(s.title, "", 0.15)}</div>
        <div class="lede" style="margin-top:14px"><span class="ln"><span data-a="rise@0.26">${esc(s.sub)}</span></span></div>
      </div>
      <div class="abs" style="left:72px;right:72px;top:764px;display:grid;gap:12px">
        ${s.items.map((t, i) => `<div class="row" data-a="up@${f2(0.55 + i * 0.09)}" style="padding:22px 28px"><span class="k">${pad(i + 1)}</span><span class="v" style="font-size:36px">${esc(t)}</span></div>`).join("")}
      </div>`,
    fx(r, u) { $(r, ".num").textContent = pad(Math.round(eo(P(u, 0.1, 1.0)) * s.n)); },
    cues: [...Array(Math.min(s.n, 7)).keys()].map((i) => [0.12 + i * 0.13, "tick"]).concat(s.items.map((_, i) => [0.55 + i * 0.09, "soft"])),
  });
  T.figure = (s, g) => {
    const size = s.size || 280, bigTop = 372, subTop = bigTop + Math.round(size * 0.95) + 22, rowTop = subTop + 96;
    const ts = (s.rows || []).map((_, i) => when(s, g, i, 1.0 + i * 0.3));
    return {
      html: `${head({ rule: s.rule, kicker: s.kicker })}
        <div class="abs" style="left:58px;top:${bigTop}px;font-weight:700;font-size:${size}px;line-height:.95;letter-spacing:-.055em;white-space:nowrap">
          <span class="ln"><span class="chrome big" data-a="rise@0.06">${esc(s.big)}</span></span></div>
        <div class="abs uline" style="left:72px;top:${subTop - 18}px;width:300px"></div>
        <div class="abs lede" style="left:72px;top:${subTop + 10}px;color:var(--text);font-weight:700;font-size:40px"><span class="ln"><span data-a="rise@0.3">${esc(s.sub)}</span></span></div>
        <div class="abs" style="left:72px;right:72px;top:${rowTop}px;display:grid;gap:16px">${(s.rows || []).map((r, i) => rowEl(r, ts[i])).join("")}</div>`,
      fx(r, u) {
        $(r, ".uline").style.setProperty("--ul", eo(P(u, 0.35, 0.7)));
        if (s.count != null) $(r, ".big").textContent = (s.pre || "") + fmtNum(s.count * eo(P(u, 0.12, 1.1)), s.dec || 0) + (s.post || "");
      },
      cues: [[0.15, "tick"], [0.45, "tick"], [0.75, "tick"], [1.1, "ok"]].concat(ts.map((t, i) => [t, s.rows[i][0] === "bad" ? "bad" : "soft"])),
    };
  };
  T.rows = (s, g) => {
    const ts = s.rows.map((_, i) => when(s, g, i, 0.5 + i * 0.3));
    return {
      html: `${head(s)}<div class="abs" style="left:72px;right:72px;top:${s.top || TOP(s)}px;display:grid;gap:18px">${s.rows.map((r, i) => rowEl(r, ts[i])).join("")}</div>
        ${s.note ? `<div class="abs note" style="right:72px;top:1262px" data-a="fade@1">${esc(s.note)}</div>` : ""}`,
      cues: ts.map((t, i) => [t, s.rows[i][0] === "ok" ? "ok" : s.rows[i][0] === "plain" ? "soft" : "bad"]),
    };
  };
  T.path = (s, g) => {
    const n = s.crumbs.length, step = Math.min(0.55, (g.D * 0.55) / n), t0 = 0.55;
    const top = s.top || TOP(s), h = 92 + n * 92 + 40;
    return {
      html: `${head(s)}
        <div class="console" style="left:72px;top:${top}px;width:936px;height:${h}px" data-a="up@0.2">
          ${cbar(s.file || "Shop Manager", "NAVIGATING", "FOUND")}
          <div class="abs" style="left:57px;top:${92 + 30}px;width:2px;height:${(n - 1) * 92}px;background:var(--line-strong)"><i class="tf"></i></div>
          ${s.crumbs.map((c, i) => `<div class="abs cr cr-${i}" style="left:42px;right:36px;top:${92 + 14 + i * 92}px">
              <span class="cdot"></span><span class="ctx">${esc(c)}</span>${i === n - 1 ? '<span class="carrow">→</span>' : ""}</div>`).join("")}
          <div class="comet"></div>
        </div>
        ${s.foot ? `<div class="abs" style="left:72px;right:72px;top:${top + h + 26}px;display:grid;gap:16px">${s.foot.map((r, i) => rowEl(r, when({ on: s.footOn, at: s.footAt }, g, i, t0 + n * step + 0.4 + i * 0.3))).join("")}</div>` : ""}`,
      fx(r, u) {
        s.crumbs.forEach((_, i) => {
          const a = t0 + i * step, on = u >= a, el = $(r, ".cr-" + i), last = i === n - 1;
          el.classList.toggle("on", on); el.classList.toggle("fin", on && last);
          el.style.transform = `translateX(${(1 - eo(P(u, a - 0.12, 0.5))) * -16}px)`;
          el.style.opacity = 0.35 + 0.65 * eo(P(u, a - 0.12, 0.4));
        });
        $(r, ".tf").style.height = (n - 1) * 92 * eio(P(u, t0, step * (n - 1) + 0.01)) + "px";
        setState(r, u, t0 + (n - 1) * step); comet($(r, ".comet"), u, t0 + (n - 1) * step + 0.2, 1.3);
      },
      cues: s.crumbs.map((_, i) => [t0 + i * step, i === n - 1 ? "ok" : "tick"]),
    };
  };
  T.stats = (s, g) => {
    const top = s.top || TOP(s), mx = Math.max(...s.items.map((x) => x[1]));
    const ts = s.items.map((_, i) => when(s, g, i, 0.5 + i * 0.4));
    const w = (v) => (s.scale === "lin" ? v / mx : Math.log10(1 + v) / Math.log10(1 + mx));
    const tipT = (s.tips || []).map((_, i) => when({ on: s.tipsOn, at: s.tipsAt }, g, i, g.D * 0.6 + i * 0.3));
    const tipTop = top + s.items.length * 128 + 22;
    return {
      html: `${head(s)}
        <div class="abs" style="left:72px;right:72px;top:${top}px">
          ${s.items.map((it, i) => `<div class="stat st-${i}" data-a="up@${f2(ts[i])}">
              <div class="sl"><span>${esc(it[0])}</span><b class="sv">0</b></div>
              <div class="bar"><i></i></div></div>`).join("")}
        </div>
        ${(s.tips || []).length ? `<div class="abs" style="left:72px;right:72px;top:${tipTop}px;display:grid;gap:16px">${s.tips.map((r, i) => rowEl(r, tipT[i])).join("")}</div>` : ""}
        ${s.note ? `<div class="abs note" style="left:72px;top:1262px" data-a="fade@0.8">${esc(s.note)}</div>` : ""}`,
      fx(r, u) {
        s.items.forEach((it, i) => {
          const p = eo(P(u, ts[i] + 0.1, 1.1)), el = $(r, ".st-" + i);
          $(el, ".bar i").style.width = 100 * w(it[1]) * p + "%";
          $(el, ".sv").textContent = it[2] && p >= 0.999 ? it[2] : (s.pre ?? "+") + fmtNum(it[1] * p) + (s.post ?? "%");
        });
      },
      cues: ts.map((t) => [t + 0.1, "tick"]).concat(ts.map((t) => [t + 1.05, "soft"])).concat(tipT.map((t, i) => [t, s.tips[i][0] === "bad" ? "bad" : "ok"])),
    };
  };
  T.ledger = (s, g) => {
    const top = s.top || TOP(s), n = s.rows.length, h = 92 + n * 76 + 170;
    const ts = s.rows.map((_, i) => when(s, g, i, 0.5 + i * 0.32));
    const tt = s.totalOn != null ? g.L[s.totalOn] + 0.3 : s.totalAt != null ? s.totalAt * g.D : ts[n - 1] + 0.6;
    const neg = /−|-/.test(s.total[1]);
    return {
      html: `${head(s)}
        <div class="console" style="left:72px;top:${top}px;width:936px;height:${h}px" data-a="up@0.2">
          ${cbar(s.file, "CALCULATING", s.done || "DONE", neg ? "bad" : "ok")}
          ${s.rows.map((r, i) => `<div class="abs lr" style="left:36px;right:36px;top:${92 + 12 + i * 76}px" data-a="up@${f2(ts[i])}">
              <span>${esc(r[0])}</span><b style="${/−|-/.test(r[1]) ? "color:var(--muted)" : ""}">${esc(r[1])}</b></div>`).join("")}
          <div class="abs ltot ${neg ? "neg" : "pos"}" style="left:24px;right:24px;top:${92 + n * 76 + 30}px" data-a="pop@${f2(tt)}">
            <span>${esc(s.total[0])}</span><b>${esc(s.total[1])}</b></div>
        </div>
        <div class="abs note" style="right:72px;top:${top + h + 18}px" data-a="fade@1">${esc(s.note || "示意 · ILLUSTRATIVE")}</div>`,
      fx(r, u) { setState(r, u, tt); },
      cues: ts.map((t) => [t, "tick"]).concat([[tt, neg ? "bad" : "ok"]]),
    };
  };
  T.balance = (s, g) => {
    const top = s.top || TOP(s), ts = [0, 1, 2].map((i) => when(s, g, i, 0.5 + i * 0.45));
    const rt = (s.rows || []).map((_, i) => when({ on: s.rowsOn, at: s.rowsAt }, g, i, ts[2] + 0.8 + i * 0.3));
    const tile = (t, i) => `<div class="tile ${i === 2 ? "ok" : ""} tl-${i}" data-a="up@${f2(ts[i])}"><div class="mono tlab">${esc(t[0])}</div><div class="tval">$0</div></div>`;
    return {
      html: `${head(s)}
        <div class="abs" style="left:72px;right:72px;top:${top}px;display:grid;grid-template-columns:1fr 44px 1fr 44px 1fr;align-items:center">
          ${tile(s.tiles[0], 0)}<div class="op" data-a="fade@${f2(ts[1] - 0.1)}">+</div>${tile(s.tiles[1], 1)}<div class="op" data-a="fade@${f2(ts[2] - 0.1)}">=</div>${tile(s.tiles[2], 2)}
        </div>
        <div class="abs" style="left:72px;right:72px;top:${top + 250}px;display:grid;gap:16px">${(s.rows || []).map((r, i) => rowEl(r, rt[i])).join("")}</div>
        <div class="abs note" style="right:72px;top:1262px" data-a="fade@1">${esc(s.note || "示意 · ILLUSTRATIVE")}</div>`,
      fx(r, u) { s.tiles.forEach((t, i) => { $(r, `.tl-${i} .tval`).textContent = "$" + fmtNum(t[1] * eo(P(u, ts[i] + 0.1, 0.9))); }); },
      cues: ts.map((t, i) => [t, i === 2 ? "ok" : "tick"]).concat(rt.map((t) => [t, "soft"])),
    };
  };
  T.split = (s, g) => {
    const top = s.top || TOP(s), ts = [0, 1].map((i) => when(s, g, i, 0.5 + i * 0.6));
    const isNeg = (c) => c.items.filter((it) => it[0] === "bad" || it[0] === "warn").length * 2 >= c.items.length;
    const kind = (c, o, i) => (isNeg(c) ? "neg" : isNeg(o) || i === 1 ? "pos" : "");
    const col = (c, i) => `<div class="scol ${kind(c, i ? s.left : s.right, i)}" style="left:${72 + i * 480}px;top:${top}px;width:456px;height:${s.h || 600}px" data-a="up@${f2(ts[i])}">
        <div class="sname">${esc(c.name)}</div>
        <div style="padding:20px 26px 0">
          ${c.big ? `<div class="sbig">${esc(c.big)}</div><div class="ssub">${esc(c.sub || "")}</div>` : ""}
          <div style="display:grid;gap:14px;margin-top:${c.big ? 22 : 6}px">${c.items.map((it) => `<div class="sit"><span class="ico ${it[0] === "plain" ? "pl" : it[0] === "warn" ? "bad" : it[0]}" style="width:38px;height:38px;font-size:20px">${ICON[it[0]]}</span><span>${esc(it[1])}</span></div>`).join("")}</div>
        </div><div class="comet"></div></div>`;
    return {
      html: `${head(s)}${col(s.left, 0)}${col(s.right, 1)}`,
      fx(r, u) { $$(r, ".scol .comet").forEach((c, i) => comet(c, u, ts[i] + 0.7, 1.3)); },
      cues: ts.map((t) => [t, "whoosh"]).concat(ts.map((t) => [t + 0.7, "soft"])),
    };
  };
  T.chips = (s, g) => {
    const top = s.top || TOP(s), ts = s.chips.map((_, i) => (s.on ? onT(g, s.on[i]) : 0.45 + i * 0.14));
    const tipT = (s.tips || []).map((_, i) => when({ on: s.tipsOn, at: s.tipsAt }, g, i, g.D * 0.6 + i * 0.3));
    return {
      html: `${head(s)}
        <div class="abs" style="left:72px;right:72px;top:${top}px;display:flex;flex-wrap:wrap;gap:16px">
          ${s.chips.map((c, i) => { const bad = Array.isArray(c); const t = bad ? c[1] : c; return `<span class="chip ${bad ? "bad" : ""}" data-a="pop@${f2(ts[i])}">${bad ? "✕ " : "# "}${esc(t)}</span>`; }).join("")}
        </div>
        ${(s.tips || []).length ? `<div class="abs" style="left:72px;right:72px;top:${s.tipsTop || top + 330}px;display:grid;gap:16px">${s.tips.map((r, i) => rowEl(r, tipT[i])).join("")}</div>` : ""}`,
      cues: ts.map((t, i) => [t, Array.isArray(s.chips[i]) ? "bad" : "soft"]).concat(tipT.map((t, i) => [t, s.tips[i][0] === "bad" ? "bad" : "ok"])),
    };
  };
  T.date = (s, g) => {
    const big = [].concat(s.big), size = s.size || 236, bigTop = 376, bigH = Math.round(big.length * size * 1.0);
    const tilesTop = bigTop + bigH + 34, linesTop = tilesTop + 196;
    const la = s.linesOn != null ? g.L[s.linesOn] + 0.2 : g.D * 0.45, ma = s.mustOn != null ? g.L[s.mustOn] + 0.2 : g.D * 0.7;
    return {
      html: `
        <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>
        <div class="abs" style="left:60px;top:${bigTop}px;font-weight:700;font-size:${size}px;line-height:1;letter-spacing:-.05em">${lines(big, "", 0.08, 0.08)}</div>
        <div class="abs" style="left:72px;right:72px;top:${tilesTop}px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
          ${s.tiles.map((t, i) => `<div class="row ${t[2] || ""}" style="display:block;padding:28px 30px" data-a="up@${f2(0.9 + i * 0.15)}"><div class="mono" style="font-size:17px;color:${t[2] === "ok" ? "var(--signal-ink)" : "var(--dim)"}">${esc(t[0])}</div><div style="font:700 ${t[3] || 60}px/1 var(--sans);letter-spacing:-.03em;margin-top:22px;white-space:nowrap">${esc(t[1])}</div></div>`).join("")}
        </div>
        <div class="abs" style="left:72px;right:72px;top:${linesTop}px">
          ${s.lines ? `<div style="font:700 50px/1.3 var(--sans)"><span class="ln"><span class="l1">${esc(s.lines[0])}</span></span></div>
          ${s.lines[1] ? `<div class="lede" style="margin-top:6px"><span class="ln"><span class="l2">${esc(s.lines[1])}</span></span></div>` : ""}` : ""}
          ${s.must ? `<div style="margin-top:34px;font:700 68px/1.2 var(--sans);letter-spacing:-.02em"><span class="ln"><span class="l3"><span class="marker"><span class="chrome">${esc(s.must)}</span></span></span></span></div>` : ""}
        </div>`,
      fx(r, u) {
        [[".l1", la], [".l2", la + 0.1], [".l3", ma]].forEach(([q, t]) => { const el = $(r, q); if (el) el.style.transform = `translateY(${(1 - eo(P(u, t, 0.7))) * 110}%)`; });
        const m = $(r, ".marker"); if (m) m.style.setProperty("--mk", eo(P(u, ma + 0.45, 0.5)));
      },
      cues: [[0.9, "tick"], [1.05, "tick"], [la, "soft"], [ma + 0.45, "ok"]],
    };
  };
  T.checklist = (s, g) => {
    const ts = s.items.map((_, i) => (s.on ? onT(g, s.on[i]) + 0.1 : s.at[i] * g.D));
    return {
      html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>
      <div class="abs" style="left:72px;top:376px">
        <div style="font-weight:700;font-size:76px;line-height:1.12">${lines([s.title[0]], "dim", 0.05)}</div>
        <div style="font-weight:700;font-size:112px;line-height:1.1;letter-spacing:-.03em">${lines([s.title[1]], "", 0.12)}</div>
      </div>
      <div class="abs" style="left:72px;right:72px;top:690px;display:grid;gap:22px">
        ${s.items.map((t, i) => `<div class="row cr2" style="padding:30px 32px;gap:28px" data-a="up@${f2(0.35 + i * 0.1)}"><span class="check"></span><span class="k" style="width:auto">${pad(i + 1)}</span><span class="v" style="font-size:${s.fs || 42}px">${esc(t)}</span></div>`).join("")}
      </div>`,
      fx(r, u) {
        $$(r, ".cr2").forEach((el, i) => {
          const p = P(u, ts[i], 0.45), b = back(p);
          $(el, ".check").style.setProperty("--ck", p > 0 ? b : 0);
          el.classList.toggle("ok", p > 0.4);
          $(el, ".v").style.color = p > 0.4 ? "var(--text)" : "var(--muted)";
        });
      },
      cues: ts.map((t) => [t, "ok"]),
    };
  };
  T.cta = (s, g) => {
    const vid = !!s.video, take = isTake(s);
    addOverlay(g, s, 0, FY, 1080, FH);
    return {
      html: `
      ${vid ? vframe(0, FY, 1080, FH) : photo(s.img, `left:0;top:${FY}px;width:1080px;height:${FH}px`, "reveal@0")}
      <div class="abs lt3" style="left:0;right:0;top:${FY + FH}px" data-a="wipe@0.2"><b>${take ? "观点" : "快讯"}</b><span>${esc(take ? "OUR TAKE · SHOPWRIGHT" : s.kicker || "")}</span></div>
      <div class="abs" style="left:72px;top:${FY + FH + 124}px;font-weight:900;font-size:124px;line-height:1.1;letter-spacing:-.04em">${lines(s.title, "", 0.08)}</div>
      <div class="abs note" style="left:72px;top:1304px;font-size:22px" data-a="fade@1.1">${esc(s.word || "Shopwright")} · ${esc(s.url)}${s.note ? " · " + esc(s.note) : ""}</div>`,
      fx(r, u, D) {
        const im = $(r, ".photo .img"); if (im) im.style.setProperty("--kb", 1.12 - 0.12 * eo(P(u, 0, D)));
      },
      cues: [[0.7, "ok"], [1.3, "scan"]],
    };
  };
  /* official text slip: { type:"quote", meta, en, mark, zh, rows?, on?, markAt?, h? } */
  T.quote = (s, g) => {
    const top = s.top || TOP(s), ch = s.h || 356;
    const ts = (s.rows || []).map((_, i) => when(s, g, i, 1.5 + i * 0.3));
    const mt = s.markAt != null ? onT(g, s.markAt) : 1.0;
    const en = s.mark ? esc(s.en).split(esc(s.mark)).join(`<span class="hl">${esc(s.mark)}</span>`) : esc(s.en);
    return {
      html: `${head(s)}
        <div class="abs paper" style="left:72px;top:${top}px;width:936px;height:${ch}px" data-a="slip@0.2">
          <div class="pmeta"><b>原文</b>${esc(s.meta || "")}</div>
          <div class="pen">${en}</div>
          ${s.zh ? `<div class="pzh">${esc(s.zh)}</div>` : ""}
        </div>
        <div class="abs" style="left:72px;right:72px;top:${top + ch + 30}px;display:grid;gap:16px">${(s.rows || []).map((r, i) => rowEl(r, ts[i])).join("")}</div>`,
      fx(r, u) { const h = $(r, ".hl"); if (h) h.style.setProperty("--mk", eo(P(u, mt, 0.6))); },
      cues: [[0.25, "whoosh"], [mt, "ok"]].concat(ts.map((t, i) => [t, s.rows[i][0] === "bad" ? "bad" : "soft"])),
    };
  };

  /* ---------- build ---------- */
  const host = document.getElementById("scenes");
  const firstRule = G.findIndex((g) => g.scene.rule), lastRule = G.length - 1 - [...G].reverse().findIndex((g) => g.scene.rule);
  let prevStep = 0;
  const S = G.map((g) => {
    const def = T[g.scene.type](g.scene, g);
    const el = document.createElement("div");
    const take = isTake(g.scene);
    el.className = "scene" + (take ? " tk" : ""); el.innerHTML = def.html; host.appendChild(el);
    if (take && g.scene.type !== "cta") def.cues = (def.cues || []).concat([[0.3, "stamp"]]);
    const anims = $$(el, "[data-a]").map((n) => { const [fx, at, d] = n.dataset.a.split("@"); return { n, fx, at: +at, d: d ? +d : null }; });
    const step = g.scene.rule ? g.scene.rule : firstRule < 0 ? 0 : g.i > lastRule ? N + 1 : g.i < firstRule ? 0 : prevStep;
    prevStep = step;
    return { g, i: g.i, el, def, anims, chromes: $$(el, ".chrome"), last: g.i === G.length - 1, step };
  });
  document.getElementById("epitext").textContent = E.episode;
  const srcIn = document.getElementById("src");
  srcIn.innerHTML = `<span>${esc(E.source.replace(/^SOURCE\s*·\s*/i, ""))}</span>`.repeat(6);
  const segW = srcIn.firstChild.getBoundingClientRect().width || 600;
  const rail = document.getElementById("rail");
  E.rail.forEach((l, i) => {
    const x = (i / Math.max(1, E.rail.length - 1)) * 100;
    rail.insertAdjacentHTML("beforeend", `<div class="node" style="left:${x}%"></div><div class="lbl" style="left:${x}%">${l}</div>`);
  });
  const nodes = $$(rail, ".node"), lbls = $$(rail, ".lbl"), fill = $(rail, ".fill");

  /* ---------- captions: width-aware phrases (CJK = 1, ASCII = .55), keys never split ---------- */
  const MAXW = 15;
  const wl = (s) => [...s].reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  const CAP = [];
  V.forEach((v) => {
    const keys = v.keys || [];
    const ph = [];
    v.cap.split("|").forEach((hard) => {
      const raw = hard.split(/[，、：；。！？]/).map((x) => x.trim()).filter(Boolean), base = ph.length;
      raw.forEach((x) => { const j = ph.length - 1; if (j >= base && (wl(ph[j]) < 6 || wl(x) < 5) && wl(ph[j]) + wl(x) + 0.6 <= MAXW) ph[j] += " " + x; else ph.push(x); });
    });
    const out = [];
    ph.forEach((p) => {
      if (wl(p) <= MAXW) return out.push(p);
      const tok = []; let i = 0;
      while (i < p.length) {
        const k = keys.find((k) => p.startsWith(k, i));
        if (k) { tok.push(k); i += k.length; continue; }
        const m = /^[\x21-\x7e]+(?: [\x21-\x7e]+)*/.exec(p.slice(i));
        if (m) { tok.push(m[0]); i += m[0].length; continue; }
        tok.push(p[i]); i++;
      }
      const n = Math.ceil(wl(p) / MAXW), target = Math.min(MAXW, wl(p) / n + 1.2);
      let cur = "";
      tok.forEach((t) => { if (cur && wl(cur + t) > target) { out.push(cur.trim()); cur = ""; } cur += t; });
      if (cur.trim()) out.push(cur.trim());
    });
    const total = out.reduce((a, b) => a + wl(b), 0);
    let t = v.at;
    out.forEach((p) => {
      const d = v.dur * (wl(p) / total);
      let h = esc(p); keys.forEach((k) => { h = h.split(esc(k)).join(`<b>${esc(k)}</b>`); });
      CAP.push({ a: t, b: t + d, h }); t += d;
    });
  });
  const capHost = document.getElementById("cap");
  let capCur = -1, capEl = null;

  /* early follow prompt (call to action #1, within the first 15 output seconds) */
  const FOLLOW = E.follow === false ? null : (E.follow || "关注 · 每周一条 Etsy 政策速递");
  const FW = E.followAt || [7, 10.5];               // output seconds
  const followEl = document.getElementById("follow"), srcEl = document.getElementById("tick");
  if (followEl) followEl.innerHTML = FOLLOW ? `<span class="plus">＋</span><span class="ft">${esc(FOLLOW)}</span>` : "";

  /* ---------- per-frame ---------- */
  function apply(a, u) {
    const n = a.n, f = a.fx;
    if (f === "rise") { const e = eo(P(u, a.at, a.d || 0.75)); n.style.transform = `translateY(${(1 - e) * 112}%)`; }
    else if (f === "up") { const e = eo(P(u, a.at, a.d || 0.7)); n.style.opacity = e; n.style.transform = `translateY(${(1 - e) * 46}px)`; n.style.filter = e < 1 ? `blur(${(1 - e) * 10}px)` : "none"; }
    else if (f === "pop") { const p = P(u, a.at, a.d || 0.5); n.style.opacity = cl(p * 2.2); n.style.transform = `scale(${0.82 + 0.18 * back(p)})`; }
    else if (f === "reveal") { const e = eo(P(u, a.at, a.d || 1.0)); n.style.clipPath = `inset(${(1 - e) * 100}% 0 0 0 round 16px)`; }
    else if (f === "fade") { n.style.opacity = eo(P(u, a.at, a.d || 0.5)); }
    else if (f === "stamp") { const p = P(u, a.at, a.d || 0.3), e = eo(p); n.style.opacity = cl(p * 4); n.style.transform = `rotate(-6deg) scale(${2.4 - 1.4 * e})`; }
    else if (f === "wipe") { const e = eo(P(u, a.at, a.d || 0.6)); n.style.clipPath = `inset(0 ${(1 - e) * 100}% 0 0)`; }
    else if (f === "slip") { const e = eo(P(u, a.at, a.d || 0.8)); n.style.opacity = cl(e * 1.6); n.style.transform = `translateX(${(1 - e) * 140}px) rotate(${-1.2 + (1 - e) * 4}deg)`; }
  }
  function seek(t) {
    const F = Math.round(t * 30);
    const st = document.getElementById("stage");
    st.style.setProperty("--mx", 50 + 30 * Math.sin(t * 0.21) + "%");
    st.style.setProperty("--my", 26 + 12 * Math.cos(t * 0.29) + "%");
    document.getElementById("grain").style.transform = `translate(${(F * 37) % 60 - 30}px,${(F * 53) % 60 - 30}px)`;
    const pp = ((t / K) % 1.8) / 1.8;
    $$(document, ".pulse").forEach((p) => { p.style.setProperty("--po", (1 - pp) * 0.8); p.style.setProperty("--ps", 1 + pp * 0.9); });

    let active = 0;
    S.forEach((s) => {
      const g = s.g, u = (t - g.start) / K, D = g.D;
      const vis = t >= g.start && (s.last ? t < g.end : t < g.end + 0.22 * K);
      if (t >= g.start && t < g.end) active = s.i;
      s.el.style.visibility = vis ? "visible" : "hidden";
      if (!vis) return;
      s.anims.forEach((a) => apply(a, u));
      s.chromes.forEach((c) => c.style.setProperty("--sx", 160 - 220 * eio(P(u, 0.9, 1.3)) + "%"));
      if (s.def.fx) s.def.fx(s.el, u, D);
      if (!s.last) { const x = eio(P(u, D - 0.1, 0.32)); s.el.style.opacity = (1 - x) * (1 - x); s.el.style.transform = `translateY(${-28 * x}px)`; s.el.style.filter = x > 0 ? `blur(${8 * x}px)` : "none"; }
    });

    const sc = S[active], u = (t - sc.g.start) / K;
    const cur = sc.step, prev = active > 0 ? S[active - 1].step : 0;
    const tgt = (r) => (r <= 1 ? 0 : Math.min(1, (r - 1) / Math.max(1, N - 1)));
    fill.style.width = (tgt(prev) + (tgt(cur) - tgt(prev)) * eio(P(u, 0.1, 0.8))) * 100 + "%";
    nodes.forEach((n, i) => { const on = cur > i + 1 || (cur === i + 1 && u > 0.35); n.classList.toggle("on", on); lbls[i].classList.toggle("on", on); });
    rail.style.opacity = cur === 0 ? 0.55 : 1;

    let ci = -1; CAP.forEach((c, i) => { if (t >= c.a - 0.04 && t < c.b + 0.05) ci = i; });
    if (ci !== capCur) { capHost.innerHTML = ci >= 0 ? `<div class="capline">${CAP[ci].h}</div>` : ""; capEl = capHost.firstChild; capCur = ci; }
    if (capEl) { const e = eo(cl((t - CAP[ci].a) / K / 0.22)); capEl.style.opacity = e; capEl.style.transform = `translateY(${(1 - e) * 18}px)`; }

    const o = t / K, lastG = G[G.length - 1], lf = eo(P((t - lastG.start) / K, -0.25, 0.3));
    srcIn.style.transform = `translateX(${-((o * 34) % segW)}px)`;
    srcEl.style.opacity = 1 - lf;
    if (followEl && FOLLOW) {
      const inn = eo(P(o, FW[0], 0.35)), out = eio(P(o, FW[1] - 0.3, 0.3)), e = inn * (1 - out);
      followEl.style.opacity = e; srcEl.style.opacity = (1 - e) * (1 - lf); followEl.style.transform = `translate(-50%, ${(1 - inn) * 22}px) scale(${0.94 + 0.06 * back(P(o, FW[0], 0.45))})`;
    }
  }

  /* ---------- sound cues (voice seconds) ---------- */
  /* RAW = every animation event (used by check.py to measure visual rhythm).
     SFX = what we actually hear: sound only marks events — at most one cue per scene
     (the strongest), at least sfxGap output seconds apart; ticks and soft blips are dropped.
     Head-creator measurements: Chinese talking-head channels use ~1–3 effects/min, never one per cut.
     EP.sfx = "full" restores the old every-animation layer. */
  const RAW = [];
  S.forEach((s) => {
    if (s.i > 0) RAW.push([+s.g.start.toFixed(3), "whoosh", s.i]);
    (s.def.cues || []).forEach(([u, k]) => { if (u < s.g.D) RAW.push([+(s.g.start + u * K).toFixed(3), k, s.i]); });
  });
  RAW.sort((a, b) => a[0] - b[0]);
  let SFX;
  if (E.sfx === "full") SFX = RAW.map(([t, k]) => [t, k]);
  else {
    const PR = { stamp: 6, scan: 5, bad: 4, ok: 3, whoosh: 2 }, best = {};
    RAW.forEach(([t, k, i]) => { const p = PR[k]; if (p !== undefined && (!best[i] || p > best[i][2])) best[i] = [t, k, p]; });
    const minGap = (E.sfxGap || 8) * K; let last = -1e9; SFX = [];
    Object.values(best).sort((a, b) => a[0] - b[0]).forEach(([t, k]) => { if (t - last >= minGap) { SFX.push([t, k]); last = t; } });
  }
  window.SFX = SFX;
  window.EVENTS = RAW.map(([t, k]) => [t, k]);
  window.FOLLOW_AT = FOLLOW ? FW.map((x) => +(x * K).toFixed(3)) : null;
  window.OVERLAYS = OVERLAYS;
  window.SCENES = G.map((g) => [+g.start.toFixed(3), +g.end.toFixed(3), g.scene.type]);
  window.seek = seek; window.TOTAL = TOTAL;
  window.VOICE_AT = V.map((v) => +v.at.toFixed(3));
  window.CAPS = CAP.map((c) => c.h.replace(/<\/?b>/g, ""));
  seek(0);
})();
