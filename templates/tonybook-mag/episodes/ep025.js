/* NO.032 · A · 名字里有重音字母、连字符，我们怎么出图（2026-11-21），tts 2a5e1ffe3fb3（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店遇到特殊字符名字的三步——照抄（重音字母、连字符、空格、大小写原样，不纠正拼写）→
   看能不能连成一片（名字整块切出来，字母上的小撇要和字母连上）→ 太细就先问（低于最小笔画、看不懂的字符先不出图，标「有问题」写原因）。
   依据运营台定制说明通用规则 1 / 4 和各款「所有字母连成一整块」「最小笔画」说明。无官方数字，不报具体笔画数值、改单率、成本；
   不碰 Etsy-Tony KP.001 标签字符规则、EP.026 定制选项；没重复 ep012 的 1.5mm / 12 字符。
   素材（Pexels 免费商用）：见文件末尾 footage 注释，成片 output 见 topics.md。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "025", date: "11.21",
  // cover: "assets/ep025-cover.png",
  topic: "名字里有重音字母、连字符，我们怎么出图",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "2a5e1ffe3fb3", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.972, cap: "名字带重音、带连字符|我们一个都不去掉", keys: ["都不去掉"] },
    { dur: 2.233, cap: "我们Etsy定制店|按三步来出图", keys: ["三步"] },
    { dur: 1.237, cap: "第一步|照抄", keys: ["照抄"] },
    { dur: 3.023, cap: "重音字母、连字符、空格|原样保留", keys: ["原样保留"] },
    { dur: 2.073, cap: "大小写不改|拼写也不纠正", keys: ["不纠正"] },
    { dur: 1.98, cap: "第二步|看能不能连成一片", keys: ["连成一片"] },
    { dur: 2.354, cap: "我们的名字|是整块一起切出来的", keys: ["整块"] },
    { dur: 2.05, cap: "字母上的小撇|要和字母连上", keys: ["连上"] },
    { dur: 2.02, cap: "第三步|太细就先问", keys: ["先问"] },
    { dur: 2.304, cap: "小撇比最小笔画还细|就先不切", keys: ["先不切"] },
    { dur: 1.944, cap: "看不懂的字符|也先不出图", keys: ["先不出图"] },
    { dur: 2.258, cap: "这一单标成有问题|写清原因", keys: ["有问题"] },
    { dur: 1.969, cap: "出名字图之前|先做三件事", keys: ["三件事"] },
    { dur: 2.186, cap: "第一，特殊字母一个都不删", keys: ["都不删"] },
    { dur: 2.6, cap: "第二，出图后看小撇连没连上", keys: ["连没连上"] },
    { dur: 2.903, cap: "第三，太细或看不懂|先标有问题", keys: ["标有问题"] },
    { dur: 3.145, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.993, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "名字带重音、连字符|**要不要去掉**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "一个都不去掉", tone: "coral", sub: "照抄 · 连成一片 · 太细先问" },

    { at: 2, clear: true, chapter: "照抄", kind: "text", text: "第一步：**照抄**", typing: 0.2 },
    { at: 3, kind: "text", text: "重音、连字符、空格**原样保留**", typing: 0.2 },
    { at: 4, kind: "text", text: "大小写不改，**拼写不纠正**", typing: 0.2 },

    { at: 5, clear: true, chapter: "连成一片", kind: "text", text: "第二步：**连成一片**", typing: 0.2 },
    { at: 6, kind: "text", text: "名字是**整块一起切**出来的", typing: 0.2 },
    { at: 7, kind: "text", text: "字母上的小撇，**要和字母连上**", typing: 0.2 },

    { at: 8, clear: true, chapter: "太细先问", kind: "big", kicker: "Stop", label: "第三步", text: "太细就先问", tone: "coral", sub: "比最小笔画还细 · 看不懂 → 先不出图" },

    { at: 11, clear: true, chapter: "标有问题", kind: "text", text: "这一单标成**有问题**", typing: 0.2 },
    { at: 11.6, kind: "text", text: "写清原因，**问清楚再出图**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "特殊字母一个都不删" }, { at: 14, text: "出图后看小撇连没连上" }, { at: 15, text: "太细或看不懂，先标有问题" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含改单率、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
