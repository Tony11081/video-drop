/* TonyBook 跨境 · 图解工作台 engine — builds an episode from window.EP, exposes seek(t) / TOTAL / VOICE_AT / CAPS / SCENES.
   t = final video seconds (配音已在 tts 里加速，时间轴就是成片时间轴)。

   EP.voice  : [{dur, cap, keys?}]       one per tts sentence
   EP.scenes : [{at, kind, ...}]          `at` = voice line position (3.5 = halfway through line 3); a scene lasts until the next one.
     cover   {q:"标题|第二行 **重点**", stamp:["我们的做法","按款式定"], chips:[...]}
     stocking{step, title, look:{body,cuff,name,plate}, notes:[{at,text}], pins:[{at,text,x,y,coral?}]}
     swatch  {step, title, total, wood:5, pick:13, notes:[{at,text}], order:{at,text}}
     note    {step, title, boxes:[{at,text,arrow,result,swatch}]}
     nameimg {step, title, name, mats:[{at,label,kind}], notes:[{at,text}]}
     todo    {title, items:[{at,text}], fine}
     end     {lines:[{at,text}], follow:{at, name, sub}}
   Text uses **word** for coral highlight and | for line breaks. */
(function () {
  const E = window.EP;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
  const back = (x) => { x = cl(x); const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const mk = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<em>$1</em>").replace(/\|/g, "<br>");
  const mkb = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\|/g, "<br>");

  /* ---------- timeline ---------- */
  const V = E.voice, gap = E.tts.gap;
  let acc = E.lead;
  V.forEach((v) => { v.at = acc; acc += v.dur + gap; });
  const last = V[V.length - 1];
  const TOTAL = last.at + last.dur + E.tail;
  const T = (x) => { const i = Math.min(V.length - 1, Math.floor(x)), f = x - i; return V[i].at + f * V[i].dur; };
  const LEAD = 0.3; // scene arrives a little before its line

  document.getElementById("epno").textContent = "NO." + E.episode + (E.date ? " · " + E.date : "");
  document.getElementById("topic").textContent = E.topic;
  document.getElementById("src").textContent = E.source || "";

  /* ---------- drawing helpers ---------- */
  const WOOD = (id) => `<linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9C89A"/><stop offset=".45" stop-color="#D6A86E"/><stop offset=".55" stop-color="#E2BB86"/><stop offset="1" stop-color="#C48F55"/></linearGradient>`;
  const GOLD = (id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".35" stop-color="#E7B84A"/><stop offset=".6" stop-color="#B9862A"/><stop offset="1" stop-color="#F6D879"/></linearGradient>`;
  let uid = 0;
  function stocking(look) {
    const id = "s" + (uid++);
    const bodyFill = look.body === "print" ? `url(#${id}p)` : look.body;
    const pattern = look.body === "print" ? `<pattern id="${id}p" width="70" height="70" patternUnits="userSpaceOnUse">
        <rect width="70" height="70" fill="#F1E6D0"/>
        <path d="M10 60 C25 40 45 40 60 10" stroke="#5E7A4E" stroke-width="5" fill="none"/>
        <circle cx="20" cy="22" r="11" fill="#C2483A"/><circle cx="20" cy="22" r="4" fill="#F5D27A"/>
        <circle cx="52" cy="50" r="9" fill="#D9774E"/><circle cx="52" cy="50" r="3.5" fill="#F5D27A"/>
        <ellipse cx="44" cy="22" rx="9" ry="4" fill="#5E7A4E" transform="rotate(-35 44 22)"/></pattern>` : "";
    const cuff = look.cuff === "rib"
      ? `<rect x="40" y="40" width="300" height="130" rx="18" fill="url(#${id}r)" stroke="#1B2232" stroke-width="5"/>`
      : `<rect x="40" y="40" width="300" height="130" rx="18" fill="${look.cuff}" stroke="#1B2232" stroke-width="5"/>
         <rect x="52" y="52" width="276" height="22" rx="10" fill="rgba(255,255,255,.18)"/>`;
    const rib = `<pattern id="${id}r" width="22" height="130" patternUnits="userSpaceOnUse"><rect width="22" height="130" fill="#F4EFE6"/><rect x="0" width="8" height="130" fill="#E2D9C8"/></pattern>`;
    let name = "";
    if (look.name && look.plate === "wood") {
      name = `<text x="190" y="135" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="700" font-size="104"
        fill="url(#${id}w)" stroke="#7A5126" stroke-width="2.5" style="filter:drop-shadow(3px 4px 0 rgba(27,34,50,.55))">${esc(look.name)}</text>`;
    } else if (look.name) {
      const fill = look.plate === "gold" ? `url(#${id}g)` : look.plate;
      name = `<text x="190" y="135" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="700" font-size="104"
        fill="${fill}" stroke="#5c4310" stroke-width="2" style="filter:drop-shadow(3px 4px 0 rgba(27,34,50,.55))">${esc(look.name)}</text>`;
    }
    return `<svg viewBox="0 0 420 640" width="${look.w || 420}" height="${(look.w || 420) * 640 / 420}">
      <defs>${WOOD(id)}${GOLD(id)}${pattern}${rib}
        <linearGradient id="${id}v" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.0)"/><stop offset=".3" stop-color="rgba(255,255,255,.16)"/><stop offset=".6" stop-color="rgba(0,0,0,.12)"/></linearGradient></defs>
      <path d="M190 40 C190 10 222 6 228 26" stroke="#1B2232" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M62 170 L318 170 L318 400 Q318 446 350 472 L388 506 Q420 540 392 584 Q360 626 300 600 L150 520 Q62 476 62 400 Z"
        fill="${bodyFill}" stroke="#1B2232" stroke-width="5" stroke-linejoin="round"/>
      <path d="M62 170 L318 170 L318 400 Q318 446 350 472 L388 506 Q420 540 392 584 Q360 626 300 600 L150 520 Q62 476 62 400 Z" fill="url(#${id}v)"/>
      ${cuff}${name}</svg>`;
  }

  /* ---------- build scenes ---------- */
  const host = document.getElementById("scenes");
  const S = [];       // {el, a, b, instant, items:[{el,a,fx}]}
  const SFX = [];
  E.scenes.forEach((sc, i) => {
    const el = document.createElement("div");
    el.className = "scene";
    const a = sc.instant ? -1 : T(sc.at) - LEAD;
    const items = [];
    const add = (html, at, fx = "up") => { const d = document.createElement("div"); d.innerHTML = html; const n = d.firstElementChild; n.classList.add("anim"); el.appendChild(n); items.push({ el: n, a: at === null ? -1 : T(at), fx }); return n; };
    const step = (s, title, at) => add(`<div class="step">${s ? `<div class="num">${esc(s)}</div>` : ""}<div class="tt">${mk(title)}</div></div>`, sc.instant ? null : at, "fade");

    if (sc.kind === "cover") {
      add(`<div class="q">${mk(sc.q)}</div>`, null, "none");
      add(`<div style="position:absolute;left:30px;top:420px">${stocking({ body: "print", cuff: "#7B2232", name: "Emma", plate: "wood", w: 400 })}</div>`, null, "none");
      add(`<div style="position:absolute;left:330px;top:470px;transform:rotate(6deg)">${stocking({ body: "#21503F", cuff: "rib", name: "Leo", plate: "gold", w: 330 })}</div>`, null, "none");
      add(`<div class="stamp"><div class="s1">${esc(sc.stamp[0])}</div><div class="s2">${esc(sc.stamp[1])}</div></div>`, null, "none");
    } else if (sc.kind === "stocking") {
      step(sc.step, sc.title, sc.at);
      add(`<div style="position:absolute;left:${sc.x ?? 60}px;top:150px">${stocking(Object.assign({ w: 480 }, sc.look))}</div>`, sc.at + 0.15, "pop");
      (sc.pins || []).forEach((p) => add(`<div class="tagl ${p.coral ? "c" : ""} l" style="left:${p.x}px;top:${p.y}px;border-right-color:${p.coral ? "#FF6B4A" : "#1B2232"}">${esc(p.text)}</div>`, p.at, "left"));
      (sc.notes || []).forEach((n, k) => add(`<div class="notes" style="top:${sc.ny ?? 820}px"><div class="nl">${mkb(n.text)}</div></div>`, n.at, "up"));
    } else if (sc.kind === "swatch") {
      step(sc.step, sc.title, sc.at);
      const cols = sc.colors; let cells = "";
      cols.forEach((c, k) => {
        const n = String(k + 1).padStart(2, "0");
        const isWood = k + 1 === sc.wood;
        const bg = isWood ? "linear-gradient(135deg,#E9C89A,#C48F55)" : (Array.isArray(c) ? c[0] : c);
        const dk = Array.isArray(c) && c[1];
        cells += `<div class="c ${dk ? "dk" : ""} ${k + 1 === sc.pick ? "pk" : ""}" data-n="${k + 1}" style="background:${bg}">${n}${isWood ? "<span style='margin-left:8px;font-size:24px'>木</span>" : ""}</div>`;
      });
      const g = add(`<div class="sw" style="left:72px;top:170px">${cells}</div>`, sc.at + 0.3, "pop");
      (sc.notes || []).forEach((n) => add(`<div class="notes" style="top:${sc.ny ?? 760}px"><div class="nl">${mkb(n.text)}</div></div>`, n.at, "up"));
      if (sc.order) {
        add(`<div class="card" style="left:540px;top:850px;width:470px;padding:24px 28px;transform:rotate(3deg)"><div class="cl">ORDER</div>
          <div style="font:700 36px/1.4 var(--sans);margin-top:12px">${mkb(sc.order.text)}</div></div>`, sc.order.at, "pop");
        items.push({ el: g.querySelector(".pk"), a: T(sc.order.at + 0.3), fx: "ring" });
      }
    } else if (sc.kind === "note") {
      step(sc.step, sc.title, sc.at);
      sc.boxes.forEach((b, k) => {
        const y = 200 + k * 380;
        add(`<div class="card" style="left:72px;top:${y}px;width:470px;padding:22px 28px"><div class="cl">Personalization</div>
          <div class="ty" style="font:600 italic 80px/1.3 var(--it);margin-top:10px;white-space:nowrap">${esc(b.text)}</div></div>`, b.at, "type");
        add(`<div style="position:absolute;left:560px;top:${y + 50}px;font:900 80px/1 var(--sans);color:var(--coral)">→</div>`, b.at + 0.5, "left");
        add(`<div style="position:absolute;left:670px;top:${y + 10}px;width:340px">
            <div style="height:150px;border-radius:18px;border:3px solid var(--ink);background:${b.swatch};box-shadow:8px 8px 0 rgba(27,34,50,.9)"></div>
            <div style="font:800 44px/1.3 var(--sans);margin-top:18px">${mkb(b.result)}</div></div>`, b.at + 0.6, "pop");
      });
    } else if (sc.kind === "nameimg") {
      step(sc.step, sc.title, sc.at);
      add(`<div class="nameimg" style="left:150px;top:170px;width:780px;height:300px">${esc(sc.name)}</div>`, sc.at + 0.2, "pop");
      add(`<div class="small" style="left:150px;top:484px">名字图：黑字 · 白底 · 一行</div>`, sc.at + 0.5, "fade");
      sc.mats.forEach((m, k) => {
        const x = 72 + k * 330;
        const bg = m.kind === "wood" ? "linear-gradient(135deg,#E9C89A,#C48F55)" : m.kind;
        const fg = m.kind === "wood" ? "#6b4420" : m.fg || "#111";
        add(`<div class="mat" style="left:${x}px;top:620px;background:${bg};color:${fg}">${esc(sc.name)}</div>`, m.at, "pop");
        add(`<div class="matl" style="left:${x}px;top:812px">${esc(m.label)}</div>`, m.at + 0.1, "fade");
      });
      (sc.notes || []).forEach((n) => add(`<div class="notes" style="top:${sc.ny ?? 880}px"><div class="nl">${mkb(n.text)}</div></div>`, n.at, "up"));
    } else if (sc.kind === "todo") {
      step("", sc.title, sc.at);
      let rows = "";
      sc.items.forEach((it, k) => { rows += `<div class="row"><div class="n">${k + 1}</div><div class="bx" data-at="${it.at}"></div><div>${mkb(it.text)}</div></div>`; });
      const c = add(`<div class="card todo">${rows}</div>`, sc.at + 0.2, "pop");
      c.querySelectorAll(".bx").forEach((bx) => items.push({ el: bx, a: T(+bx.dataset.at), fx: "check" }));
      if (sc.fine) add(`<div class="fine" style="top:${sc.fy ?? 820}px">${esc(sc.fine.text)}</div>`, sc.fine.at, "fade");
    } else if (sc.kind === "end") {
      sc.lines.forEach((l, k) => add(`<div class="notes" style="top:${80 + k * 140}px"><div class="nl" style="font-size:62px">${mkb(l.text)}</div></div>`, l.at, "up"));
      add(`<div class="card" style="left:72px;right:72px;top:420px;padding:40px 46px">
          <div class="cl">Follow</div><div style="font:800 56px/1.3 var(--sans);margin-top:16px">${esc(sc.follow.name)}</div>
          <div style="font:500 38px/1.4 var(--sans);color:var(--ink2);margin-top:10px">${esc(sc.follow.sub)}</div>
          <div class="fb" style="display:inline-block;margin-top:30px;font:800 40px/1 var(--sans);color:#fff;background:var(--coral);padding:22px 44px;border-radius:50px">+ 关注</div></div>`, sc.follow.at, "pop");
      items.push({ el: el.querySelector(".fb"), a: T(sc.follow.at + 0.5), fx: "press" });
    }
    host.appendChild(el);
    S.push({ el, a, items, instant: !!sc.instant });
    if (i > 0) SFX.push([+a.toFixed(3), "whoosh"]);
  });
  S.forEach((s, i) => { s.b = i + 1 < S.length ? S[i + 1].a : TOTAL + 1; });

  /* progress dots: one per scene after the cover */
  const dots = document.getElementById("dots");
  const DOT = S.slice(1).map(() => { const d = document.createElement("div"); d.className = "d"; d.innerHTML = "<i></i>"; dots.appendChild(d); return d.firstChild; });

  /* ---------- captions ---------- */
  const capHost = document.getElementById("cap");
  const CAP = [];
  V.forEach((v) => {
    const parts = v.cap.split("|");
    const tot = parts.reduce((x, p) => x + p.length, 0);
    let t0 = v.at;
    parts.forEach((p) => {
      const d = v.dur * p.length / tot;
      let h = esc(p); (v.keys || []).forEach((k) => { h = h.split(esc(k)).join(`<b>${esc(k)}</b>`); });
      const c = document.createElement("div"); c.className = "c"; c.innerHTML = h; c.style.opacity = 0; capHost.appendChild(c);
      CAP.push({ el: c, a: t0, b: t0 + d, h });
      t0 += d;
    });
  });

  /* ---------- seek ---------- */
  function fx(it, t) {
    const u = it.a < 0 ? 1 : (t - it.a) / 0.45, e = eo(u), el = it.el;
    if (!el) return;
    switch (it.fx) {
      case "none": el.style.opacity = 1; break;
      case "fade": el.style.opacity = cl(u); break;
      case "up": el.style.opacity = cl(u * 1.5); el.style.transform = `translateY(${(1 - e) * 60}px)`; break;
      case "left": el.style.opacity = cl(u * 1.5); el.style.transform = `translateX(${(1 - e) * -50}px)`; break;
      case "pop": { const b = it.a < 0 ? 1 : back((t - it.a) / 0.5); el.style.opacity = cl(u * 2); el.style.transform = `scale(${0.82 + 0.18 * b})`; el.style.transformOrigin = "50% 60%"; break; }
      case "type": { el.style.opacity = cl(u * 2); const ty = el.querySelector(".ty"); const full = ty.dataset.full || (ty.dataset.full = ty.textContent);
        const n = it.a < 0 ? full.length : Math.floor(cl((t - it.a) / 0.6) * full.length); ty.textContent = full.slice(0, n) + (n < full.length ? "|" : ""); break; }
      case "ring": { const on = it.a >= 0 && t >= it.a; el.style.outline = on ? `${(8 * eo((t - it.a) / 0.3)).toFixed(1)}px solid #FF6B4A` : "none"; el.style.outlineOffset = "4px";
        el.style.transform = on ? `scale(${1 + 0.12 * Math.sin(Math.PI * cl((t - it.a) / 0.5))})` : "none"; el.style.zIndex = on ? 3 : 0; break; }
      case "check": { const on = t >= it.a; el.style.background = on ? "#FF6B4A" : "transparent"; el.style.borderColor = on ? "#FF6B4A" : "#1B2232";
        el.textContent = on ? "✓" : ""; el.style.transform = on ? `scale(${back((t - it.a) / 0.35)})` : "none"; break; }
      case "press": { const on = t >= it.a; el.textContent = on ? "已关注 ✓" : "+ 关注"; el.style.background = on ? "#1B2232" : "#FF6B4A";
        el.style.transform = on ? `scale(${1 - 0.08 * Math.sin(Math.PI * cl((t - it.a) / 0.3))})` : "none"; break; }
    }
  }
  window.seek = function (t) {
    S.forEach((s, i) => {
      const inU = s.instant ? 1 : eo((t - s.a) / 0.45), outU = eo((t - s.b) / 0.4);
      const vis = t >= s.a && t < s.b + 0.4;
      s.el.style.display = vis ? "block" : "none";
      if (!vis) return;
      s.el.style.transform = `translateX(${(1 - inU) * 260 - outU * 260}px)`;
      s.el.style.opacity = Math.min(s.instant ? 1 : cl((t - s.a) / 0.3), 1 - cl((t - s.b) / 0.3));
      s.items.forEach((it) => fx(it, t));
    });
    DOT.forEach((d, k) => { const s = S[k + 1]; d.style.transform = `scaleX(${t >= s.b ? 1 : cl((t - s.a) / (s.b - s.a))})`; });
    CAP.forEach((c) => { const on = t >= c.a && t < c.b; c.el.style.opacity = on ? 1 : 0; });
  };
  window.TOTAL = TOTAL;
  window.VOICE_AT = V.map((v) => +v.at.toFixed(3));
  window.SFX = SFX;
  window.OVERLAYS = [];
  window.CAPS = CAP.map((c) => c.h.replace(/<\/?b>/g, ""));
  window.SCENES = S.map((s) => [Math.max(0, s.a), Math.min(TOTAL, s.b), ""]);
  window.seek(0);
})();
