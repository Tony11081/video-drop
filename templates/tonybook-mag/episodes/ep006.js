/* NO.006 · A · 一个名字木牌，从出单到发货（2026-11-01），tts d4a1a34ad986（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们自己的流程（topics.md NO.006 列的 7 步：导单 → 按 SKU 出名字图 → 激光切割 → 打包 → 店小秘建单 → 燕文 / 出口易发货 → 回填单号）。
   不报耗时、成本、单量；「先做三件事」是方法建议，不是数据。
   成片 output 5f7b144d5950（49.95 秒）。素材（Pexels 免费商用）：首页 7205557 封箱｜CH.01 4872898 笔记本打字｜CH.02 30456102 激光切割机｜CH.03 5043690 搬包裹｜CH.04 5989753 咖啡馆打字｜CH.05 7287517 小工作室打包。封面：Codex IMG-20261101-001 未出图，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,   // 配音已在 tts 里 1.3 倍（ElevenLabs will），画面按成片时间轴，背景素材在服务器上合成
  episode: "006", date: "11.01",
  // cover: "assets/ep006-cover.png",  // Codex 封面图到了再打开
  topic: "一个名字木牌，从出单到发货",
  source: "TonyBook 自己的定制店流程 · 不含成本和耗时",
  tts: { id: "d4a1a34ad986", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.313, cap: "一个名字木牌，从出单到发货|我们一共走7步", keys: ["7步"] },
    { dur: 1.707, cap: "第一步，把订单导出来", keys: ["导出来"] },
    { dur: 2.587, cap: "名字、款式、颜色|都在订单里", keys: ["订单里"] },
    { dur: 2.731, cap: "第二步，按SKU出名字图", keys: ["SKU"] },
    { dur: 2.413, cap: "款式对上模板|名字原样放进去", keys: ["原样"] },
    { dur: 2.089, cap: "第三步，上激光机切割", keys: ["激光机"] },
    { dur: 1.947, cap: "切完对着订单|再核一遍名字", keys: ["再核一遍"] },
    { dur: 1.38, cap: "第四步，打包", keys: ["打包"] },
    { dur: 2.388, cap: "第五步，在店小秘里|建物流单", keys: ["店小秘"] },
    { dur: 2.75, cap: "第六步，交给燕文|或者出口易发货", keys: ["发货"] },
    { dur: 2.133, cap: "第七步，把单号传回Etsy", keys: ["单号"] },
    { dur: 2.363, cap: "买家那边，就能看到|包裹走到哪了", keys: ["走到哪了"] },
    { dur: 1.467, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.644, cap: "第一，名字从订单里复制|别手打", keys: ["别手打"] },
    { dur: 3.701, cap: "第二，每个款式编好SKU|出图不靠猜", keys: ["不靠猜"] },
    { dur: 2.587, cap: "第三，货一发出|当天就传单号", keys: ["当天"] },
    { dur: 3.101, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.802, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "客户只写了**一个名字**|接下来做什么？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "名字木牌 · 从出单到发货", text: "7 步", tone: "coral", sub: "导单 → 出图 → 切割 → 打包 → 建单 → 发货 → **回填**" },

    { at: 1, clear: true, chapter: "导单出图", kind: "text", text: "**01** 把订单导出来", typing: 0.2 },
    { at: 2, kind: "text", text: "名字、款式、颜色，都在订单里", typing: 0.2 },
    { at: 3, kind: "text", text: "**02** 按 **SKU** 出名字图", typing: 0.2 },
    { at: 4, kind: "text", text: "款式对上模板，名字**原样**放进去", typing: 0.2 },

    { at: 5, clear: true, chapter: "切割打包", kind: "text", text: "**03** 上激光机切割", typing: 0.2 },
    { at: 6, kind: "text", text: "切完对着订单，**再核一遍**名字", typing: 0.2 },
    { at: 7, kind: "text", text: "**04** 打包", typing: 0.2 },

    { at: 8, clear: true, chapter: "发货回填", kind: "text", text: "**05** 店小秘里建物流单", typing: 0.2 },
    { at: 9, kind: "text", text: "**06** 燕文 / 出口易发货", typing: 0.2 },
    { at: 10, kind: "text", text: "**07** 单号传回 **Etsy**", typing: 0.2 },
    { at: 11, kind: "text", text: "买家就能看到包裹**走到哪了**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "名字从订单里复制，别手打" }, { at: 14, text: "每个款式编好 SKU，出图不靠猜" }, { at: 15, text: "货一发出，当天就传单号" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，只讲流程，不含成本和耗时。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
