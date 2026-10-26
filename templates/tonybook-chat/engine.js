/* TonyBook 跨境实操 · chat engine v1 — builds an episode from window.EP and exposes seek(t) / TOTAL.
   t is in VOICE seconds (the timeline the voiceover was generated on); the picture is sped up by EP.speed
   in the final mux, so every animation duration below is written in OUTPUT seconds and multiplied by K.

   EP.voice : [{dur, cap, keys?}]          one entry per tts sentence (dur from the tts result)
   EP.msgs  : [{at, kind, clear?, ...}]    chat messages; `at` is a line position: 3 = start of line 3,
                                           3.5 = halfway through line 3. Card parts (rows, items) have their own `at`.
   kinds: user (fan's question, right) · text (assistant bubble) · big (big number card) · bill (receipt rows +
          total) · cmp (two-column comparison) · todo (checklist) · follow (CTA card) · note (small footnote).
   `clear: true` starts a fresh chat page (old messages slide away). Text uses **word** for coral highlight.
   `instant: true` puts a message on screen fully drawn from frame 0 (use it for the hook: the first frame is the feed preview). */
(function () {
  const E = window.EP, K = E.speed;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const back = (x) => { x = cl(x); const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = (u, a, d) => cl((u - a) / d);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const mk = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
  const money = (v, dec = 2) => "$" + Math.abs(v).toFixed(dec);

  /* ---------- timeline ---------- */
  const V = E.voice, gap = E.tts.gap;
  let acc = E.lead;
  V.forEach((v) => { v.at = acc; acc += v.dur + gap; });
  const last = V[V.length - 1];
  const TOTAL = last.at + last.dur + E.tail;
  const T = (x) => { const i = Math.min(V.length - 1, Math.floor(x)), f = x - i; return V[i].at + f * V[i].dur; };

  document.getElementById("epno").textContent = "NO." + E.episode;
  document.getElementById("topic").textContent = E.topic;
  document.getElementById("src").textContent = E.source || "";

  /* ---------- build messages ---------- */
  const chat = document.getElementById("chat");
  const VIEWH = 900, GAP = 30;
  const SFX = [];
  const M = [];
  let page = -1;
  E.msgs.forEach((m, i) => {
    if (m.clear || i === 0) page++;
    // instant: on screen from the very first frame, fully drawn (the first frame is what the feed shows)
    const a = m.instant ? -1 : T(m.at);
    const el = document.createElement("div");
    el.className = "msg " + (m.kind === "user" ? "u" : "a");
    const parts = []; // timed inner parts: {el, a, fx}
    const part = (sel, at, fx, extra = {}) => ({ sel, a: T(at), fx, ...extra });
    let html = "", wants = [];
    const avatar = m.kind === "user" || m.kind === "note" || m.kind === "follow" || m.noAvatar ? "" : '<div class="av">T</div>';
    if (m.kind === "user" || m.kind === "text") {
      html = `<div class="body"><div class="bub">${mk(m.text)}</div></div>`;
    } else if (m.kind === "note") {
      html = `<div class="note">${mk(m.text)}</div>`;
    } else if (m.kind === "big") {
      html = `<div class="body"><div class="bignum"><div class="lb">${mk(m.label)}</div>
        <div class="n ${m.tone || ""}" data-n>${esc(m.text)}</div>${m.sub ? `<div class="sb">${mk(m.sub)}</div>` : ""}</div></div>`;
      if (m.count != null) wants.push({ q: "[data-n]", fx: "count", a, to: m.count, pre: m.pre || "", post: m.post || "", dec: m.dec ?? 2 });
      if (m.tone === "coral") SFX.push([a + 0.15 * K, "bad"]);
    } else if (m.kind === "bill") {
      html = `<div class="body"><div class="card"><div class="ch">${mk(m.title)}<span class="tag">${esc(m.tag || "RECEIPT")}</span></div><div class="cb">
        ${m.rows.map((r, j) => `<div class="brow" data-r="${j}"><div class="l"><b>${mk(r.label)}</b>${r.sub ? `<span>${mk(r.sub)}</span>` : ""}</div>
           <div class="amt" data-amt="${j}">−${money(r.amt)}</div></div>`).join("")}
        ${m.total ? `<div class="btotal" data-t><b>${mk(m.total.label)}</b><div class="amt" data-tamt>−${money(m.total.amt)}</div></div>` : ""}
      </div></div></div>`;
      m.rows.forEach((r, j) => {
        const ra = r.at != null ? T(r.at) : a + (0.25 + j * 0.2) * K;
        wants.push({ q: `[data-r="${j}"]`, fx: "row", a: ra });
        wants.push({ q: `[data-amt="${j}"]`, fx: "count", a: ra + 0.1 * K, to: r.amt, pre: "−$", dec: 2, d: 0.6 });
        SFX.push([ra, "tick"]);
      });
      if (m.total) {
        const ta = T(m.total.at);
        wants.push({ q: "[data-t]", fx: "pop", a: ta });
        wants.push({ q: "[data-tamt]", fx: "count", a: ta + 0.1 * K, to: m.total.amt, pre: "−$", dec: 2, d: 0.8 });
        SFX.push([ta, "bad"]);
      }
    } else if (m.kind === "cmp") {
      const mx = Math.max(...m.cols.map((c) => c.fee));
      html = `<div class="body"><div class="card"><div class="ch">${mk(m.title)}<span class="tag">${esc(m.tag || "COMPARE")}</span></div>
        <div class="cmp">${m.cols.map((c, j) => `<div class="col ${c.hot ? "hot" : ""}" data-c="${j}"><div class="nm">${mk(c.name)}</div>
          <div class="rt">${esc(c.rate)}</div><div class="fee" data-f="${j}">${money(c.fee)}</div><div class="bar"><i data-b="${j}" data-w="${(c.fee / mx) * 100}"></i></div></div>`).join("")}</div>
        <div class="cmp-foot">${m.badge ? `<span class="badge" data-badge>${mk(m.badge.text)}</span>` : ""}<span>${mk(m.foot || "")}</span></div></div></div>`;
      m.cols.forEach((c, j) => {
        const ca = c.at != null ? T(c.at) : a + 0.2 * K;
        wants.push({ q: `[data-c="${j}"]`, fx: "pop", a: ca });
        wants.push({ q: `[data-f="${j}"]`, fx: "count", a: ca + 0.1 * K, to: c.fee, pre: "$", dec: 2, d: 0.7 });
        wants.push({ q: `[data-b="${j}"]`, fx: "bar", a: ca + 0.15 * K });
        SFX.push([ca, "tick"]);
      });
      if (m.badge) { wants.push({ q: "[data-badge]", fx: "pop", a: T(m.badge.at) }); SFX.push([T(m.badge.at), "bad"]); }
    } else if (m.kind === "todo") {
      html = `<div class="body"><div class="card todo"><div class="ch">${mk(m.title)}<span class="tag">TODO</span></div><div class="cb">
        ${m.items.map((it, j) => `<div class="it" data-i="${j}"><span class="n">${j + 1}</span><span class="box">✓</span><span>${mk(it.text)}</span></div>`).join("")}</div></div></div>`;
      m.items.forEach((it, j) => {
        const ia = T(it.at);
        wants.push({ q: `[data-i="${j}"]`, fx: "check", a: ia });
        SFX.push([ia + 0.2 * K, "ok"]);
      });
    } else if (m.kind === "follow") {
      html = `<div class="body" style="margin-left:56px"><div class="follow"><div class="av">T</div><div>
        <b>${esc(m.name)}</b><span>${mk(m.sub)}</span><div class="btn" data-btn>+ 关注</div></div></div></div>`;
      if (m.pressAt != null) { wants.push({ q: "[data-btn]", fx: "press", a: T(m.pressAt) }); SFX.push([T(m.pressAt), "ok"]); }
    }
    el.innerHTML = avatar + html;
    chat.appendChild(el);
    const lead = m.instant || m.kind === "user" || m.kind === "note" ? 0 : (m.typing ?? 0.4) * K;
    M.push({ m, el, a, s: a - lead, page, lead, parts: wants.map((w) => ({ ...w, el: el.querySelector(w.q) })) });
    if (m.kind !== "note" && !m.instant) SFX.push([a, m.kind === "user" ? "send" : "pop"]);
  });

  /* typing bubble (one, reused) */
  const typing = document.createElement("div");
  typing.className = "msg a";
  typing.innerHTML = '<div class="av">T</div><div class="body"><div class="typing"><i></i><i></i><i></i></div></div>';
  chat.appendChild(typing);

  /* layout: measure real heights once, stack per page */
  const pages = [];
  M.forEach((x) => {
    const h = x.el.offsetHeight;
    const p = (pages[x.page] ||= { y: 0, start: x.s, msgs: [] });
    x.y = p.y; x.h = h; p.y += h + (x.m.kind === "note" ? 10 : GAP);
    x.target = Math.max(0, x.y + h - VIEWH);
    p.msgs.push(x);
    x.el.style.top = x.y + "px";
  });
  pages.forEach((p, i) => { if (i > 0) SFX.push([p.start - 0.18 * K, "whoosh"]); });

  /* ---------- captions ---------- */
  const wl = (s) => [...s].reduce((n, c) => n + (/[\x20-\x7e]/.test(c) ? 0.55 : 1), 0);
  const MAXW = 14;
  const CAP = [];
  V.forEach((v) => {
    const keys = v.keys || [];
    const out = [];
    v.cap.split("|").forEach((hard) => {
      let cur = "";
      hard.split(/(?<=[，、：；。！？])/).forEach((seg) => {
        seg = seg.replace(/[，、：；。！？]$/, "").trim();
        if (!seg) return;
        if (cur && wl(cur) + wl(seg) + 0.5 <= MAXW) cur += " " + seg;
        else { if (cur) out.push(cur); cur = seg; }
      });
      if (cur) out.push(cur);
    });
    const tot = out.reduce((n, p) => n + wl(p), 0);
    let t = v.at;
    out.forEach((p) => {
      const d = v.dur * (wl(p) / tot);
      let h = esc(p); keys.forEach((k) => { h = h.split(esc(k)).join(`<b>${esc(k)}</b>`); });
      CAP.push({ a: t, b: t + d, h }); t += d;
    });
  });
  const capHost = document.getElementById("cap");
  let capCur = -1, capEl = null;

  /* ---------- per-frame ---------- */
  const fmt = (v, dec) => v.toFixed(dec);
  function part(p, t) {
    const w = (t - p.a) / K, n = p.el;
    if (!n) return;
    if (p.fx === "row") { const e = eo(P(w, 0, 0.45)); n.style.opacity = t < p.a ? 0.0 : e; n.style.transform = `translateX(${(1 - e) * -40}px)`; }
    else if (p.fx === "pop") { const q = P(w, 0, 0.45); n.style.opacity = t < p.a ? 0 : cl(q * 2.5); n.style.transform = `scale(${0.9 + 0.1 * back(q)})`; }
    else if (p.fx === "count") { const e = eo(P(w, 0, p.d || 0.7)); n.textContent = p.pre + fmt(p.to * e, p.dec) + (p.post || ""); }
    else if (p.fx === "bar") { n.style.width = eio(P(w, 0, 0.8)) * +n.dataset.w + "%"; }
    else if (p.fx === "check") { const e = eo(P(w, 0, 0.4)); n.style.opacity = t < p.a ? 0.35 : 0.35 + 0.65 * e; n.classList.toggle("on", w > 0.2); }
    else if (p.fx === "press") { const on = w > 0; n.classList.toggle("done", on); n.textContent = on ? "已关注 ✓" : "+ 关注"; n.style.transform = `scale(${on ? 1 - 0.08 * Math.sin(Math.PI * P(w, 0, 0.3)) : 1})`; }
  }
  function seek(t) {
    const F = Math.round(t * 30);
    const st = document.getElementById("stage");
    st.style.setProperty("--gx", 22 + 10 * Math.sin(t * 0.17) + "%");
    st.style.setProperty("--gy", 16 + 6 * Math.cos(t * 0.23) + "%");
    document.getElementById("grain").style.transform = `translate(${(F * 37) % 60 - 30}px,${(F * 53) % 60 - 30}px)`;

    let cur = 0; pages.forEach((p, i) => { if (t >= p.start) cur = i; });
    const nxt = pages[cur + 1];
    // page scroll: ease to each started message's target
    let sc = 0;
    pages[cur].msgs.forEach((x) => { if (t >= x.s) sc += (Math.max(sc, x.target) - sc) * eio(P((t - x.s) / K, 0, 0.4)); });
    // leaving page: slide up & fade just before the next page starts
    const out = nxt ? eio(P((t - (nxt.start - 0.22 * K)) / K, 0, 0.22)) : 0;
    chat.style.transform = `translateY(${-sc - out * 160}px)`;
    chat.style.opacity = 1 - out;

    let typ = null;
    M.forEach((x) => {
      const vis = x.page === cur && t >= x.a;
      x.el.style.visibility = vis ? "visible" : "hidden";
      if (x.page === cur && t >= x.s && t < x.a && x.lead > 0) typ = x;
      if (!vis) return;
      const e = x.m.instant ? 1 : eo(P((t - x.a) / K, 0, 0.32));
      x.el.style.opacity = e;
      x.el.style.transform = `translateY(${(1 - e) * 36}px) scale(${0.97 + 0.03 * e})`;
      x.el.style.transformOrigin = x.m.kind === "user" ? "right bottom" : "left top";
      x.parts.forEach((p) => part(p, t));
    });
    typing.style.visibility = typ ? "visible" : "hidden";
    if (typ) {
      typing.style.top = typ.y + "px";
      const ph = ((t - typ.s) / K) * 3.2;
      [...typing.querySelectorAll("i")].forEach((d, i) => { const s = Math.sin((ph - i * 0.33) * Math.PI * 2); d.style.transform = `translateY(${-8 * Math.max(0, s)}px)`; d.style.opacity = 0.5 + 0.5 * Math.max(0, s); });
    }

    let ci = -1; CAP.forEach((c, i) => { if (t >= c.a - 0.04 && t < c.b + 0.05) ci = i; });
    if (ci !== capCur) { capHost.innerHTML = ci >= 0 ? `<div class="capline">${CAP[ci].h}</div>` : ""; capEl = capHost.firstChild; capCur = ci; }
    if (capEl) { const e = eo(cl((t - CAP[ci].a) / K / 0.2)); capEl.style.opacity = e; capEl.style.transform = `translateY(${(1 - e) * 14}px)`; }
  }

  window.SFX = SFX.filter((c) => c[0] >= 0 && c[0] < TOTAL).sort((a, b) => a[0] - b[0]).map(([a, k]) => [+a.toFixed(3), k]);
  window.OVERLAYS = [];
  // one sheet frame per page (late in the page, when it is full)
  window.SCENES = pages.map((p, i) => [+p.start.toFixed(3), +(pages[i + 1] ? pages[i + 1].start : TOTAL).toFixed(3), "page"]);
  window.seek = seek; window.TOTAL = TOTAL;
  window.VOICE_AT = V.map((v) => +v.at.toFixed(3));
  window.CAPS = CAP.map((c) => c.h.replace(/<\/?b>/g, ""));
  seek(0);
})();
