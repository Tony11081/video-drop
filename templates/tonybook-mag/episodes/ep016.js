/* NO.023 · A · 客户给的名字太长，刺绣怎么排（2026-11-10），tts 2f0b27ea60d1（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店遇到长名字的做法（先量可绣位置 → 照原样试排一行 → 太小会糊就换排法 → 发效果图客户确认再绣；名字照抄、不替客户改，依据运营台定制说明通用规则），
   不报价格、耗时、单量，不提客户和合作方；不讲 Etsy 定制选项规则（避开 Etsy-Tony EP.026）。
   素材（Pexels 免费商用）：见文末 footage 记录。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "016", date: "11.10",
  // cover: "assets/ep016-cover.png",
  topic: "客户给的名字太长，刺绣怎么排",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "2f0b27ea60d1", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.377, cap: "名字太长绣不下|我们先试排，客户看了再绣", keys: ["客户看了再绣"] },
    { dur: 1.96, cap: "第一步，先量能绣的地方", keys: ["先量"] },
    { dur: 3.517, cap: "袜口、帽子、包上|能绣的位置大小都不一样", keys: ["都不一样"] },
    { dur: 2.116, cap: "第二步，按原样排成一行", keys: ["排成一行"] },
    { dur: 2.395, cap: "名字照客户写的抄|一个字母都不删", keys: ["不删"] },
    { dur: 2.297, cap: "第三步，字太小就别硬缩", keys: ["别硬缩"] },
    { dur: 3.077, cap: "缩得太小，线挤在一起|绣出来会糊", keys: ["会糊"] },
    { dur: 2.623, cap: "可以排成两行|或者换一种窄一点的字体", keys: ["两行"] },
    { dur: 2.191, cap: "第四步，发效果图给客户看", keys: ["效果图"] },
    { dur: 1.709, cap: "客户点头了，再上机器绣", keys: ["点头"] },
    { dur: 2.486, cap: "要缩写还是换个名字|让客户自己定", keys: ["客户自己定"] },
    { dur: 1.057, cap: "我们不替客户改", keys: ["不替客户改"] },
    { dur: 1.851, cap: "名字太长，先做三件事", keys: ["三件事"] },
    { dur: 1.782, cap: "第一，先量能绣的地方", keys: ["先量"] },
    { dur: 2.403, cap: "第二，缩到看不清|就换排法", keys: ["换排法"] },
    { dur: 2.265, cap: "第三，效果图确认了再绣", keys: ["确认了再绣"] },
    { dur: 3.227, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.913, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "客户的名字**太长**|刺绣怎么排？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们不硬缩", text: "先试排", tone: "coral", sub: "效果图客户看了再绣" },

    { at: 1, clear: true, chapter: "先量位置", kind: "text", text: "第一步：**先量能绣的地方**", typing: 0.2 },
    { at: 2, kind: "text", text: "袜口 · 帽子 · 包，**大小不同**", typing: 0.2 },

    { at: 3, clear: true, chapter: "照原样排", kind: "text", text: "第二步：**按原样排成一行**", typing: 0.2 },
    { at: 4, kind: "text", text: "名字照抄，**一个字母都不删**", typing: 0.2 },

    { at: 5, clear: true, chapter: "别硬缩", kind: "text", text: "第三步：**字太小就别硬缩**", typing: 0.2 },
    { at: 6, kind: "text", text: "线挤在一起，**绣出来会糊**", typing: 0.2 },
    { at: 7, kind: "text", text: "改排**两行** / 换**窄一点的字体**", typing: 0.2 },

    { at: 8, clear: true, chapter: "看效果图", kind: "text", text: "第四步：**发效果图给客户看**", typing: 0.2 },
    { at: 9, kind: "text", text: "客户点头，**再上机器绣**", typing: 0.2 },
    { at: 10, kind: "text", text: "缩写还是换名字，**客户自己定**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "先量能绣的地方" }, { at: 14, text: "缩到看不清，就换排法" }, { at: 15, text: "效果图确认了再绣" }] },
    { at: 15.6, kind: "note", text: "我们自己刺绣定制单的做法，不含价格、耗时和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
