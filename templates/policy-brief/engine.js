/* Policy Brief engine. Builds the scenes from EP and exposes seek(t) / TOTAL.
   t is in VOICE seconds (the timeline the voiceover was generated on).
   Scene-local animation times u are in OUTPUT seconds (after the final speed-up),
   so motion feels right once the film is played at EP.speed. */
(function () {
  const E = window.EP, K = E.speed;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const back = (x) => { x = cl(x); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = (u, a, d) => cl((u - a) / d);
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  /* ---------- timeline ---------- */
  const V = E.voice, gap = E.tts.gap;
  let acc = E.lead;
  V.forEach((v) => { v.at = acc; acc += v.dur + gap; });
  V.forEach((v, i) => { v.start = i === 0 ? 0 : v.at - 0.12; });
  V.forEach((v, i) => { v.end = i < V.length - 1 ? V[i + 1].start : v.at + v.dur + E.tail; });
  const TOTAL = V[V.length - 1].end;

  /* ---------- small builders ---------- */
  const lines = (arr, cls, t0 = 0.05, step = 0.08, dimFirst = false) =>
    arr.map((l, i) => `<span class="ln"><span class="chrome ${dimFirst && i === 0 && arr.length > 1 ? "dim" : ""} ${cls || ""}" data-a="rise@${(t0 + i * step).toFixed(2)}">${esc(l)}</span></span>`).join("");
  const ruleHead = (s) => `
    <div class="abs ghost" style="right:60px;top:300px" data-a="up@0.1">${String(s.rule).padStart(2, "0")}</div>
    <div class="abs idx" style="left:72px;top:316px" data-a="up@0">RULE ${String(s.rule).padStart(2, "0")} <em>/ 05</em></div>
    <div class="abs" style="left:72px;top:360px">
      <div style="font-weight:700;font-size:70px;line-height:1.12;letter-spacing:-.02em">${lines([s.title[0]], "dim", 0.05)}</div>
      <div style="font-weight:700;font-size:96px;line-height:1.12;letter-spacing:-.03em;margin-top:4px">${lines([s.title[1]], "", 0.12)}</div>
    </div>`;
  const photo = (src, style, a = "reveal@0.1", pos = "center") => `<div class="photo" style="${style}" data-a="${a}"><div class="img" style="background-image:url('${src}');background-position:${pos}"></div></div>`;
  const cbar = (file, run, done, doneCls = "ok") => `<div class="cbar"><span></span><span></span><span></span><code>${esc(file)}</code>
      <div class="st"><i class="run">● ${esc(run)}</i><i class="${doneCls}" style="display:none">● ${esc(done)}</i></div></div>`;
  const setState = (root, u, at) => { const st = $(root, ".st"); if (!st) return; const done = u >= at; st.children[0].style.display = done ? "none" : ""; st.children[1].style.display = done ? "" : "none"; };
  const scanAt = (el, u, a, d, top, bottom) => {
    const p = P(u, a, d), y = top + (bottom - top) * eio(p) - 120;
    el.style.opacity = p > 0 && p < 1 ? 1 : 0; el.style.top = y + "px";
    el.style.clipPath = `inset(${Math.max(0, top - y)}px 0 ${Math.max(0, y + 122 - bottom)}px 0)`;  // stay inside the frame
  };
  const comet = (el, u, a, d = 1.3) => { const p = P(u, a, d); el.style.setProperty("--ang", 360 * eio(p) + "deg"); el.style.setProperty("--co", p > 0 && p < 1 ? 1 : 0); };

  /* ---------- scene types ---------- */
  const T = {};
  T.hook = (s) => ({
    html: `
      ${photo(s.img, "left:72px;top:316px;width:936px;height:560px", "reveal@0", "center 74%")}
      <div class="abs status" style="left:100px;top:344px;background:rgba(255,255,255,.72);backdrop-filter:blur(12px)" data-a="up@0.35"><span class="pulse"></span>${esc(s.kicker)}</div>
      <div class="scan" style="left:72px;right:72px"></div>
      <div class="abs tag bad" style="right:100px;top:796px" data-a="pop@1.55"><span class="d"></span>${esc(s.scanTag)}</div>
      <div class="abs" style="left:72px;top:924px;font-weight:700;font-size:100px;line-height:1.12;letter-spacing:-.03em">
        ${lines(s.lines, "", 0.05, 0.08)}
        <span class="ln"><span data-a="rise@0.21"><span class="marker"><span class="chrome">${esc(s.marked)}</span></span></span></span>
      </div>`,
    fx(r, u, D) {
      $(r, ".photo .img").style.setProperty("--kb", 1.14 - 0.14 * eo(u / D * 1.2));
      scanAt($(r, ".scan"), u, 0.55, 1.0, 316, 876);
      $(r, ".marker").style.setProperty("--mk", eo(P(u, 0.75, 0.55)));
    },
  });
  T.index = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.label)} · ${esc(s.date)}</div>
      <div class="abs chrome bignum" style="left:60px;top:404px;font-size:330px" data-a="up@0.05"><span class="num">00</span></div>
      <div class="abs" style="left:500px;top:452px">
        <div style="font-weight:700;font-size:86px;line-height:1.12;letter-spacing:-.03em">${lines(s.title, "", 0.15)}</div>
        <div class="lede" style="margin-top:14px"><span class="ln"><span data-a="rise@0.26">${esc(s.sub)}</span></span></div>
      </div>
      <div class="abs" style="left:72px;right:72px;top:764px;display:grid;gap:12px">
        ${s.items.map((t, i) => `<div class="row" data-a="up@${(0.55 + i * 0.09).toFixed(2)}" style="padding:20px 28px"><span class="k">${String(i + 1).padStart(2, "0")}</span><span class="v" style="font-size:36px">${esc(t)}</span></div>`).join("")}
      </div>`,
    fx(r, u) { $(r, ".num").textContent = String(Math.round(eo(P(u, 0.1, 1.0)) * s.n)).padStart(2, "0"); },
  });
  T["r-original"] = (s) => ({
    html: `${ruleHead(s)}
      <div class="console" style="left:132px;top:604px;width:816px;height:650px" data-a="up@0.22">
        ${cbar(s.file, "SCANNING", "VERIFIED")}
        ${photo(s.img, "left:26px;top:86px;width:764px;height:440px", "fade@0.3")}
        <div class="scan" style="left:16px;right:16px"></div>
        <div class="abs" style="left:26px;top:552px;display:flex;gap:16px">
          ${s.tags.map((t, i) => `<span class="tag ok" data-a="pop@${(1.85 + i * 0.16).toFixed(2)}"><span class="d"></span>${esc(t)}</span>`).join("")}
        </div>
        <div class="comet"></div>
      </div>
      <div class="abs note" style="right:132px;top:1266px" data-a="fade@1">示意图 · ILLUSTRATIVE</div>`,
    fx(r, u) {
      $(r, ".photo .img").style.setProperty("--kb", 1.06 - 0.06 * eo(P(u, 0.3, 3)));
      scanAt($(r, ".scan"), u, 0.7, 1.05, 86, 526);
      setState(r, u, 1.8); comet($(r, ".comet"), u, 2.15);
    },
  });
  T["r-edit"] = (s) => ({
    html: `${ruleHead(s)}
      <div class="abs pair" style="left:0;top:0;width:1080px;height:1300px">
        ${photo(s.raw, "left:72px;top:610px;width:452px;height:520px", "reveal@0.2")}
        <div class="photo ed" style="left:556px;top:610px;width:452px;height:520px" data-a="reveal@0.3">
          <div class="img" style="background-image:url('${s.raw}')"></div>
          <div class="img e2" style="background-image:url('${s.raw}');filter:brightness(1.09) contrast(1.07) saturate(1.22) sepia(.07);transform:scale(1.2);transform-origin:46% 50%"></div>
          <div class="abs wl" style="top:0;bottom:0;width:3px;background:var(--signal);box-shadow:0 0 16px rgba(104,172,0,.9)"></div>
        </div>
        <div class="abs status" style="left:92px;top:630px;background:rgba(255,255,255,.8)" data-a="up@0.5">原图 · RAW</div>
        <div class="abs status" style="left:576px;top:630px;background:rgba(255,255,255,.8)" data-a="up@0.6">AI 修图 · EDITED</div>
        <div class="abs" style="left:72px;top:1156px;display:flex;gap:14px">
          ${s.okTags.map((t, i) => `<span class="tag ok" data-a="pop@${(1.75 + i * 0.14).toFixed(2)}"><span class="d"></span><span class="zh" style="font-size:26px">✓ ${esc(t)}</span></span>`).join("")}
        </div>
      </div>
      <div class="abs fake" style="left:196px;top:600px;width:688px;height:650px">
        <div class="photo" style="inset:0;box-shadow:0 60px 120px -40px rgba(21,23,26,.85);border:1px solid var(--line-strong)"><div class="img" style="background-image:url('${s.fake}')"></div></div>
        <div class="stamp" style="left:150px;top:256px">✕ ${esc(s.stamp)}</div>
      </div>`,
    fx(r, u, D) {
      const w = eio(P(u, 0.85, 1.0));
      const e2 = $(r, ".e2"); e2.style.clipPath = `inset(0 0 0 ${(1 - w) * 100}%)`;
      const wl = $(r, ".wl"); wl.style.left = `calc(${(1 - w) * 100}% - 1px)`; wl.style.opacity = w > 0 && w < 1 ? 1 : 0;
      const T1 = D * 0.56, f = $(r, ".fake"), k = eo(P(u, T1, 0.7));
      f.style.opacity = k; f.style.transform = `translateY(${(1 - k) * 220}px) rotate(${(1 - k) * 4}deg)`;
      $(r, ".pair").style.opacity = 1 - 0.6 * k; $(r, ".pair").style.filter = `blur(${3 * k}px)`;
      const st = $(r, ".stamp"), p = P(u, T1 + 0.5, 0.45);
      st.style.opacity = p > 0 ? 1 : 0; st.style.transform = `rotate(-8deg) scale(${1.6 - 0.6 * back(p)})`;
    },
  });
  T["r-guide"] = (s) => ({
    html: `${ruleHead(s)}
      <div class="photo pg" style="left:72px;top:604px;width:620px;height:650px" data-a="reveal@0.15"><div class="img" style="background-image:url('${s.img}')"></div><div class="comet"></div></div>
      <div class="console" style="left:560px;top:664px;width:448px;height:330px" data-a="up@0.55">
        ${cbar(s.doc, "AI", "BLOCKED", "bad")}
        <div class="abs" style="left:28px;right:28px;top:96px;display:grid;gap:16px">
          <i style="height:14px;border-radius:7px;background:#e3e5dd;width:92%"></i><i style="height:14px;border-radius:7px;background:#e3e5dd;width:76%"></i>
          <i style="height:14px;border-radius:7px;background:#e3e5dd;width:84%"></i><i style="height:14px;border-radius:7px;background:#e3e5dd;width:58%"></i>
        </div>
        <span class="abs tag bad" style="left:28px;top:240px" data-a="pop@1.0"><span class="d"></span><span class="zh" style="font-size:26px">${esc(s.docTag)}</span></span>
        <div class="strike" style="left:22px;right:22px;top:160px"></div>
      </div>
      <span class="abs tag ok okt" style="left:96px;top:1172px" data-a="pop@9"><span class="d"></span><span class="zh" style="font-size:28px">✓ ${esc(s.okTag)}</span></span>
      <div class="abs note" style="right:72px;top:1266px" data-a="fade@1">示意图 · ILLUSTRATIVE</div>`,
    fx(r, u, D) {
      $(r, ".pg .img").style.setProperty("--kb", 1.08 - 0.08 * eo(P(u, 0.15, D)));
      setState(r, u, 1.55);
      $(r, ".strike").style.setProperty("--sk", eo(P(u, 1.55, 0.45)));
      const ta = D * 0.62; const o = $(r, ".okt"), p = P(u, ta, 0.5);
      o.style.opacity = cl(p * 2); o.style.transform = `scale(${0.82 + 0.18 * back(p)})`;
      comet($(r, ".pg .comet"), u, ta + 0.2, 1.4);
    },
  });
  T["r-case"] = (s) => ({
    html: `${ruleHead(s)}
      <div class="console" style="left:72px;top:604px;width:936px;height:650px" data-a="up@0.2">
        ${cbar("CASE #48213 · 示意", "OPEN", "SELLER REFUNDS", "bad")}
        <div class="abs" style="left:74px;top:118px;width:2px;height:300px;background:var(--line-strong)"><i class="tf" style="position:absolute;left:0;top:0;width:2px;height:0;background:linear-gradient(180deg,rgba(104,172,0,.3),var(--signal) 70%,var(--warn));box-shadow:0 0 10px rgba(104,172,0,.6)"></i></div>
        ${s.steps.map((t, i) => `<div class="abs st-${i}" style="left:60px;top:${100 + i * 100}px;display:flex;align-items:center;gap:30px">
            <span class="dotn" style="width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid var(--line-strong)"></span>
            <span style="font:600 36px/1 var(--sans);color:var(--dim)">${esc(t)}</span></div>`).join("")}
        <div class="abs" style="left:60px;right:60px;top:500px;border-top:1px solid var(--line);padding-top:28px;display:flex;align-items:baseline;justify-content:space-between">
          <span class="mono" style="font-size:18px;color:var(--dim)">退款金额 · REFUND</span>
          <span class="amt" style="font:700 96px/1 var(--sans);letter-spacing:-.04em;color:var(--warn)">−$0.00</span>
        </div>
      </div>`,
    fx(r, u) {
      const ts = [0.45, 0.85, 1.25, 1.65];
      ts.forEach((a, i) => {
        const on = u >= a, row = $(r, ".st-" + i), d = $(row, ".dotn"), tx = row.children[1];
        const last = i === ts.length - 1;
        d.style.background = on ? (last ? "var(--warn)" : "var(--signal)") : "#fff";
        d.style.borderColor = on ? (last ? "var(--warn)" : "#5f9a0d") : "var(--line-strong)";
        d.style.boxShadow = on ? (last ? "0 0 0 6px rgba(163,83,0,.15)" : "0 0 0 6px rgba(200,255,0,.25)") : "none";
        tx.style.color = on ? (last ? "var(--warn)" : "var(--text)") : "var(--dim)";
        row.style.transform = `translateX(${(1 - eo(P(u, a - 0.1, 0.5))) * -14}px)`;
      });
      $(r, ".tf").style.height = 300 * eio(P(u, 0.45, 1.2)) + "px";
      setState(r, u, 1.65);
      const v = s.amount * eo(P(u, 1.8, 1.0));
      $(r, ".amt").textContent = "−$" + v.toFixed(2);
    },
  });
  T["r-bot"] = (s) => ({
    html: `${ruleHead(s)}
      <div class="abs grid6" style="left:72px;top:610px;width:936px;height:484px">
        ${[0, 1, 2, 3, 4, 5].map((i) => `<div class="skel" style="left:${(i % 3) * 320}px;top:${Math.floor(i / 3) * 254}px;width:296px;height:230px" data-a="pop@${(0.18 + i * 0.07).toFixed(2)}">
          <div class="im" style="background:url('${s.img}') center/cover;filter:hue-rotate(${[0, 40, 160, 220, 290, 110][i]}deg) saturate(1.1)"></div><div class="t1"></div><div class="t2"></div><div class="bt">BOT</div><div class="rm">✕ REMOVED</div></div>`).join("")}
        <div class="scan" style="left:-20px;right:-20px"></div>
      </div>
      <div class="abs" style="left:0;right:0;top:1140px;display:flex;justify-content:center">
        <span class="tag bad pill" style="padding:20px 32px" data-a="pop@9"><span class="d"></span><span class="zh" style="font-size:38px">${esc(s.pill)}</span></span>
      </div>`,
    fx(r, u, D) {
      const a = 1.35, d = 1.0;
      scanAt($(r, ".scan"), u, a, d, 0, 484);
      $$(r, ".skel").forEach((el, i) => {
        const row = Math.floor(i / 3), hit = a + d * ((row * 254 + 115) / 484);
        const p = eo(P(u, hit, 0.35));
        $(el, ".rm").style.opacity = p; el.style.filter = `grayscale(${p})`;
      });
      const pl = $(r, ".pill"), p = P(u, D * 0.62, 0.5);
      pl.style.opacity = cl(p * 2); pl.style.transform = `scale(${0.8 + 0.2 * back(p)})`;
    },
  });
  T.detect = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>NEW · LISTING FORM</div>
      <div class="abs" style="left:72px;top:372px">
        <div style="font-weight:700;font-size:70px;line-height:1.12;letter-spacing:-.02em">${lines([s.title[0]], "dim", 0.05)}</div>
        <div style="font-weight:700;font-size:96px;line-height:1.12;letter-spacing:-.03em;margin-top:4px">${lines([s.title[1]], "", 0.12)}</div>
      </div>
      <div class="console" style="left:72px;top:612px;width:936px;height:500px" data-a="up@0.2">
        ${cbar("新建商品 · 上传图片", "UPLOADING", "AI DETECTED", "bad")}
        ${photo(s.img, "left:28px;top:92px;width:290px;height:370px", "fade@0.35")}
        <div class="scan" style="left:18px;width:310px"></div>
        <div class="abs" style="left:350px;right:32px;top:100px">
          <div class="mono" style="font-size:17px;color:var(--dim);margin-bottom:16px">IMG_0423.PNG · 2.4 MB</div>
          <div class="prog"><i></i></div>
        </div>
        <div class="abs ntc" style="left:350px;right:32px;top:176px;padding:28px;border-radius:16px;border:1px solid rgba(163,83,0,.28);background:rgba(255,246,236,.95)">
          <div style="font:700 34px/1.3 var(--sans);color:var(--warn)">⚠ ${esc(s.notice)}</div>
          <div style="font:500 26px/1.5 var(--sans);color:var(--muted);margin-top:14px">${esc(s.tip)}</div>
        </div>
      </div>
      <div class="menu" style="left:388px;top:994px;width:620px">
        <div class="mi" style="font:500 18px/1 var(--mono);letter-spacing:.16em;color:var(--dim);padding:20px 28px">举报此商品 · REPORT</div>
        ${s.menu.map((m, i) => `<div class="mi ${i === s.menu.length - 1 ? "hl" : ""}">${esc(m)}${i === s.menu.length - 1 ? '<span class="new">NEW</span>' : ""}</div>`).join("")}
      </div>`,
    fx(r, u, D) {
      $(r, ".prog i").style.width = 100 * eio(P(u, 0.4, 0.9)) + "%";
      scanAt($(r, ".scan"), u, 1.3, 0.8, 92, 462);
      setState(r, u, 2.0);
      const n = $(r, ".ntc"), p = P(u, 2.05, 0.5); n.style.opacity = cl(p * 2); n.style.transform = `translateY(${(1 - eo(p)) * 24}px)`;
      const m = $(r, ".menu"), q = P(u, D * 0.6, 0.6); m.style.opacity = eo(q); m.style.transform = `translateY(${(1 - eo(q)) * 60}px)`;
      m.style.filter = `blur(${(1 - eo(q)) * 8}px)`;
    },
  });
  T.verdict = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>
      <div class="abs" style="left:72px;top:390px;font-weight:700;font-size:112px;line-height:1.1;letter-spacing:-.03em">${lines(s.title, "", 0.05, 0.09, true)}</div>
      <div class="abs" style="left:72px;right:72px;top:700px;display:grid;gap:20px">
        ${s.rows.map((rw, i) => `<div class="row ${rw[0]} vr" style="padding:30px 32px;position:relative"><span class="ico ${rw[0]}">${rw[0] === "ok" ? "✓" : "✕"}</span><span class="v" style="font-size:46px;${rw[0] === "bad" ? "color:var(--warn)" : ""}">${esc(rw[1])}</span></div>`).join("")}
      </div>`,
    fx(r, u, D) {
      const at = [0.5, D * 0.55, D * 0.7];
      $$(r, ".vr").forEach((el, i) => { const p = P(u, at[i], 0.6), e = eo(p); el.style.opacity = e; el.style.transform = `translateY(${(1 - e) * 40}px)`; el.style.filter = `blur(${(1 - e) * 8}px)`; });
    },
  });
  T.law = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>
      <div class="abs" style="left:60px;top:376px;font-weight:700;font-size:236px;line-height:1;letter-spacing:-.05em">${lines([s.code], "", 0.08)}</div>
      <div class="abs" style="left:72px;right:72px;top:668px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div class="row" style="display:block;padding:30px 32px" data-a="up@0.9"><div class="mono" style="font-size:17px;color:var(--dim)">EFFECTIVE · 生效</div><div style="font:700 66px/1 var(--sans);letter-spacing:-.03em;margin-top:22px">${esc(s.eff)}</div></div>
        <div class="row ok" style="display:block;padding:30px 32px" data-a="up@1.05"><div class="mono" style="font-size:17px;color:var(--signal-ink)">COUNTDOWN · 距生效</div><div style="font:700 66px/1 var(--sans);letter-spacing:-.03em;margin-top:22px"><span class="dn">0</span><span style="font-size:40px;margin-left:10px">天</span></div></div>
      </div>
      <div class="abs" style="left:72px;right:72px;top:930px">
        <div style="font:700 54px/1.3 var(--sans);letter-spacing:-.01em"><span class="ln"><span class="l1">${esc(s.line[0])}</span></span></div>
        <div class="lede" style="margin-top:6px"><span class="ln"><span class="l2">${esc(s.line[1])}</span></span></div>
        <div style="margin-top:40px;font:700 72px/1.2 var(--sans);letter-spacing:-.02em"><span class="ln"><span class="l3"><span class="marker"><span class="chrome">${esc(s.must)}</span></span></span></span></div>
      </div>`,
    fx(r, u, D) {
      $(r, ".dn").textContent = Math.round(s.days * eo(P(u, 1.2, 1.1)));
      const a = D * 0.5, b = D * 0.72;
      [[".l1", a], [".l2", a + 0.1], [".l3", b]].forEach(([q, t]) => { $(r, q).style.transform = `translateY(${(1 - eo(P(u, t, 0.7))) * 110}%)`; });
      $(r, ".marker").style.setProperty("--mk", eo(P(u, b + 0.45, 0.5)));
    },
  });
  T.checklist = (s) => ({
    html: `
      <div class="abs status" style="left:72px;top:316px" data-a="up@0"><span class="pulse"></span>${esc(s.kicker)}</div>
      <div class="abs" style="left:72px;top:376px">
        <div style="font-weight:700;font-size:76px;line-height:1.12">${lines([s.title[0]], "dim", 0.05)}</div>
        <div style="font-weight:700;font-size:112px;line-height:1.1;letter-spacing:-.03em">${lines([s.title[1]], "", 0.12)}</div>
      </div>
      <div class="abs" style="left:72px;right:72px;top:690px;display:grid;gap:22px">
        ${s.items.map((t, i) => `<div class="row cr" style="padding:30px 32px;gap:28px" data-a="up@${(0.35 + i * 0.1).toFixed(2)}"><span class="check"></span><span class="k" style="width:auto">${String(i + 1).padStart(2, "0")}</span><span class="v" style="font-size:44px">${esc(t)}</span></div>`).join("")}
      </div>`,
    fx(r, u, D) {
      $$(r, ".cr").forEach((el, i) => {
        const p = P(u, s.at[i] * D, 0.45), b = back(p);
        $(el, ".check").style.setProperty("--ck", p > 0 ? b : 0);
        el.classList.toggle("ok", p > 0.4);
        $(el, ".v").style.color = p > 0.4 ? "var(--text)" : "var(--muted)";
      });
    },
  });
  T.cta = (s) => ({
    html: `
      ${photo(s.img, "left:72px;top:316px;width:936px;height:500px", "reveal@0")}
      <div class="abs status" style="left:100px;top:344px;background:rgba(255,255,255,.78);backdrop-filter:blur(12px)" data-a="up@0.3"><span class="pulse"></span>PRODUCT PHOTOS · 产品图服务</div>
      <div class="abs" style="left:64px;top:846px;font-weight:700;font-size:150px;line-height:1.05;letter-spacing:-.05em">${lines([s.word], "", 0.08)}</div>
      <div class="abs lede" style="left:72px;top:1022px;font-size:44px;color:var(--text);font-weight:600"><span class="ln"><span data-a="rise@0.25">${esc(s.title.join(""))}</span></span></div>
      <div class="abs" style="left:72px;top:1104px" data-a="pop@0.7"><span class="btn">${esc(s.url)} <span style="font-size:46px">→</span></span></div>
      <div class="abs note" style="left:72px;top:1250px" data-a="fade@1.1">${esc(s.note)}</div>`,
    fx(r, u, D) {
      $(r, ".photo .img").style.setProperty("--kb", 1.12 - 0.12 * eo(P(u, 0, D)));
      $(r, ".btn").style.setProperty("--bx", -120 + 240 * eio(P(u, 1.3, 1.1)) + "%");
    },
  });

  /* ---------- build ---------- */
  const host = document.getElementById("scenes");
  const S = V.map((v, i) => {
    const def = T[v.scene.type](v.scene);
    const el = document.createElement("div");
    el.className = "scene"; el.innerHTML = def.html; host.appendChild(el);
    const anims = $$(el, "[data-a]").map((n) => { const [fx, at, d] = n.dataset.a.split("@").join("@").split("@"); return { n, fx, at: +at, d: d ? +d : null }; });
    const chromes = $$(el, ".chrome");
    return { v, i, el, def, anims, chromes, last: i === V.length - 1 };
  });
  document.getElementById("epitext").textContent = `POLICY BRIEF · ${E.episode}`;
  document.getElementById("src").innerHTML = `<i></i>${esc(E.source)}`;
  const rail = document.getElementById("rail");
  E.rail.forEach((l, i) => {
    const x = (i / (E.rail.length - 1)) * 100;
    rail.insertAdjacentHTML("beforeend", `<div class="node" style="left:${x}%"></div><div class="lbl" style="left:${x}%">${l}</div>`);
  });
  const nodes = $$(rail, ".node"), lbls = $$(rail, ".lbl"), fill = $(rail, ".fill");

  /* captions: split each line into short phrases, timed by character count */
  const MAX = 15;
  const CAP = [];
  V.forEach((v) => {
    const raw = v.cap.split(/[，、：；。！？,]/).map((x) => x.trim()).filter(Boolean);
    const ph = [];   // merge fragments while they still fit on one line
    raw.forEach((x) => { const j = ph.length - 1; if (j >= 0 && (ph[j].length < 6 || x.length < 5) && ph[j].length + x.length + 1 <= MAX) ph[j] += " " + x; else ph.push(x); });
    const out = [];
    ph.forEach((p) => {
      const n = Math.ceil(p.length / MAX);
      if (n <= 1) return out.push(p);
      let size = Math.ceil(p.length / n), i = 0;
      while (i < p.length) {
        let cut = Math.min(p.length, i + size);
        v.keys.forEach((k) => { const j = p.indexOf(k); if (j >= 0 && j < cut && j + k.length > cut) cut = j + k.length <= i + MAX ? j + k.length : j; });
        if (cut <= i) cut = Math.min(p.length, i + size);
        out.push(p.slice(i, cut)); i = cut;
      }
    });
    const total = out.reduce((a, b) => a + b.length, 0);
    let t = v.at;
    out.forEach((p) => {
      const d = v.dur * (p.length / total);
      let h = esc(p); v.keys.forEach((k) => { h = h.split(esc(k)).join(`<b>${esc(k)}</b>`); });
      CAP.push({ a: t, b: t + d, h }); t += d;
    });
  });
  const capHost = document.getElementById("cap");
  let capCur = -1, capEl = null;

  /* ---------- per-frame ---------- */
  function apply(a, u) {
    const n = a.n, f = a.fx;
    if (f === "rise") { const e = eo(P(u, a.at, a.d || 0.75)); n.style.transform = `translateY(${(1 - e) * 112}%)`; }
    else if (f === "up") { const e = eo(P(u, a.at, a.d || 0.7)); n.style.opacity = e; n.style.transform = `translateY(${(1 - e) * 46}px)`; n.style.filter = e < 1 ? `blur(${(1 - e) * 10}px)` : "none"; }
    else if (f === "pop") { const p = P(u, a.at, a.d || 0.5); n.style.opacity = cl(p * 2.2); n.style.transform = `scale(${0.82 + 0.18 * back(p)})`; }
    else if (f === "reveal") { const e = eo(P(u, a.at, a.d || 1.0)); n.style.clipPath = `inset(${(1 - e) * 100}% 0 0 0 round 16px)`; }
    else if (f === "fade") { n.style.opacity = eo(P(u, a.at, a.d || 0.5)); }
  }
  function seek(t) {
    const F = Math.round(t * 30);
    const st = document.getElementById("stage");
    st.style.setProperty("--mx", 50 + 30 * Math.sin(t * 0.21) + "%");
    st.style.setProperty("--my", 26 + 12 * Math.cos(t * 0.29) + "%");
    document.getElementById("grain").style.transform = `translate(${(F * 37) % 60 - 30}px,${(F * 53) % 60 - 30}px)`;
    const pp = (t / K % 1.8) / 1.8;
    $$(document, ".pulse").forEach((p) => { p.style.setProperty("--po", (1 - pp) * 0.8); p.style.setProperty("--ps", 1 + pp * 0.9); });

    let active = 0;
    S.forEach((s) => {
      const u = (t - s.v.start) / K, D = (s.v.end - s.v.start) / K;
      const vis = t >= s.v.start && (s.last ? t < s.v.end : t < s.v.end + 0.22 * K);  // short overlap = dissolve
      if (t >= s.v.start && t < s.v.end) active = s.i;
      s.el.style.visibility = vis ? "visible" : "hidden";
      if (!vis) return;
      s.anims.forEach((a) => apply(a, u));
      s.chromes.forEach((c) => c.style.setProperty("--sx", 160 - 220 * eio(P(u, 0.9, 1.3)) + "%"));
      if (s.def.fx) s.def.fx(s.el, u, D);
      if (!s.last) { const x = eio(P(u, D - 0.1, 0.32)); s.el.style.opacity = (1 - x) * (1 - x); s.el.style.transform = `translateY(${-28 * x}px)`; s.el.style.filter = x > 0 ? `blur(${8 * x}px)` : "none"; }
    });

    /* rail: rules are the scenes with a rule number */
    const sc = S[active], u = (t - sc.v.start) / K;
    const ruleOf = (s) => (s.v.scene.rule ? s.v.scene.rule : s.i > 6 ? 6 : 0);
    const cur = ruleOf(sc), prev = active > 0 ? ruleOf(S[active - 1]) : 0;
    const tgt = (r) => (r <= 1 ? 0 : Math.min(1, (r - 1) / (E.rail.length - 1)));
    const fr = tgt(prev) + (tgt(cur) - tgt(prev)) * eio(P(u, 0.1, 0.8));
    fill.style.width = fr * 100 + "%";
    nodes.forEach((n, i) => { const on = cur > i + 1 || (cur === i + 1 && u > 0.35) || cur >= 6; n.classList.toggle("on", on); lbls[i].classList.toggle("on", on); });
    rail.style.opacity = cur === 0 ? 0.55 : 1;

    /* captions */
    let ci = -1; CAP.forEach((c, i) => { if (t >= c.a - 0.04 && t < c.b + 0.05) ci = i; });
    if (ci !== capCur) {
      capHost.innerHTML = ci >= 0 ? `<div class="capline">${CAP[ci].h}</div>` : "";
      capEl = capHost.firstChild; capCur = ci;
    }
    if (capEl) { const e = eo(cl((t - CAP[ci].a) / K / 0.22)); capEl.style.opacity = e; capEl.style.transform = `translateY(${(1 - e) * 18}px)`; }
  }
  /* sound cues, in voice seconds: [time, kind] — synthesized by sfx.py */
  const CUES = {
    hook: () => [[0.55, "scan"], [1.55, "bad"]],
    index: () => [[0.1, "tick"], [0.3, "tick"], [0.5, "tick"], [0.7, "tick"], [0.9, "tick"], ...[0, 1, 2, 3, 4].map((i) => [0.55 + i * 0.09, "soft"])],
    "r-original": () => [[0.7, "scan"], [1.85, "ok"], [2.01, "soft"]],
    "r-edit": (D) => [[0.85, "scan"], [1.75, "soft"], [1.89, "soft"], [2.03, "soft"], [D * 0.56, "whoosh"], [D * 0.56 + 0.5, "stamp"]],
    "r-guide": (D) => [[1.0, "bad"], [1.55, "scan"], [D * 0.62, "ok"]],
    "r-case": () => [[0.45, "tick"], [0.85, "tick"], [1.25, "tick"], [1.65, "bad"]],
    "r-bot": (D) => [...[0, 1, 2, 3, 4, 5].map((i) => [0.18 + i * 0.07, "soft"]), [1.35, "scan"], [D * 0.62, "stamp"]],
    detect: (D) => [[1.3, "scan"], [2.05, "bad"], [D * 0.6, "whoosh"]],
    verdict: (D) => [[0.5, "ok"], [D * 0.55, "ok"], [D * 0.7, "bad"]],
    law: (D) => [[1.2, "tick"], [1.6, "tick"], [2.0, "tick"], [D * 0.72 + 0.45, "ok"]],
    checklist: (D) => [[0.36 * D, "ok"], [0.6 * D, "ok"], [0.8 * D, "ok"]],
    cta: () => [[0.7, "ok"], [1.3, "scan"]],
  };
  const SFX = [];
  S.forEach((s) => {
    const D = (s.v.end - s.v.start) / K;
    if (s.i > 0) SFX.push([s.v.start, "whoosh"]);
    (CUES[s.v.scene.type] ? CUES[s.v.scene.type](D) : []).forEach(([u, k]) => SFX.push([+(s.v.start + u * K).toFixed(3), k]));
  });
  window.SFX = SFX;
  window.seek = seek; window.TOTAL = TOTAL;
  window.VOICE_AT = V.map((v) => +v.at.toFixed(3));
  seek(0);
})();
