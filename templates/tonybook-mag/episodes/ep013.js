/* NO.018 · A · 客户发来一个 logo，刺绣怎么做出来（2026-11-07），tts 2df771e3b06a（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 刺绣定制单的流程（看图 → 制版 → 打样 → 批量），不报价格、成本、单量，不提客户和合作方；
   不讲 Etsy 规则，没碰 Etsy-Tony EP.010 侵权、EP.026 定制选项。
   素材（Pexels 免费商用）：首页 7043686 多头刺绣机（12–17 秒段；7043665 绣框里有可读品牌字，换掉；5077071 手机屏有外卖 App 标，换掉）｜CH.01 5121702 看手机｜CH.02 7989707 数位板｜CH.03 9034690 手绣绷子｜CH.04 4927683 缝纫机批量｜CH.05 7452737 缝纫机特写｜CH.06 8946881 手机。
   成片 output ef3647fb4287（48.6 秒）。封面：Codex IMG-20261107-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "013", date: "11.07",
  // cover: "assets/ep013-cover.png",
  topic: "客户发来一个 logo，刺绣怎么做出来",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "2df771e3b06a", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.510, cap: "客户发来一个logo|要先制版才能绣", keys: ["制版"] },
    { dur: 2.032, cap: "这是我们Etsy|刺绣定制单的做法", keys: ["刺绣定制单"] },
    { dur: 1.219, cap: "第一步，看图", keys: ["看图"] },
    { dur: 3.055, cap: "图要清楚|糊的截图先找客户要原图", keys: ["原图"] },
    { dur: 2.816, cap: "太细的线和太小的字|绣出来会糊", keys: ["会糊"] },
    { dur: 1.212, cap: "第二步，制版", keys: ["制版"] },
    { dur: 2.353, cap: "把图转成刺绣机|认得的针迹文件", keys: ["针迹文件"] },
    { dur: 3.294, cap: "每一块用什么针法、什么颜色的线|都在这一步定", keys: ["针法"] },
    { dur: 1.410, cap: "第三步，打样", keys: ["打样"] },
    { dur: 2.174, cap: "先绣一个样|拍照发给客户确认", keys: ["确认"] },
    { dur: 2.499, cap: "客户点头了|第四步才批量做", keys: ["批量"] },
    { dur: 2.650, cap: "批量照着样品来|线色和位置都不改", keys: ["不改"] },
    { dur: 2.297, cap: "想接logo刺绣单|先做三件事", keys: ["三件事"] },
    { dur: 2.046, cap: "第一，要原图|不用截图", keys: ["原图"] },
    { dur: 2.948, cap: "第二，细线小字|先跟客户商量改粗", keys: ["改粗"] },
    { dur: 2.019, cap: "第三，不打样|不批量", keys: ["不打样"] },
    { dur: 3.212, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.963, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "客户发来一个 **logo**|怎么绣出来？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "上机之前", text: "先制版", tone: "coral", sub: "我们 Etsy **刺绣定制单**走 4 步" },

    { at: 2, clear: true, chapter: "看图", kind: "text", text: "第一步：**看图**", typing: 0.2 },
    { at: 3, kind: "text", text: "截图糊了，先要**原图**", typing: 0.2 },
    { at: 4, kind: "text", text: "细线、小字，**绣出来会糊**", typing: 0.2 },

    { at: 5, clear: true, chapter: "制版", kind: "text", text: "第二步：**制版**", typing: 0.2 },
    { at: 6, kind: "text", text: "图转成刺绣机认得的**针迹文件**", typing: 0.2 },
    { at: 7, kind: "text", text: "**针法**和**线色**，都在这一步定", typing: 0.2 },

    { at: 8, clear: true, chapter: "打样", kind: "text", text: "第三步：**打样**", typing: 0.2 },
    { at: 9, kind: "text", text: "先绣一个，**拍照给客户确认**", typing: 0.2 },

    { at: 10, clear: true, chapter: "批量", kind: "text", text: "客户点头，第四步才**批量**", typing: 0.2 },
    { at: 11, kind: "text", text: "照样品来，**线色和位置不改**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "要原图，不用截图" }, { at: 14, text: "细线小字，先商量改粗" }, { at: 15, text: "不打样，不批量" }] },
    { at: 15.6, kind: "note", text: "我们自己刺绣定制单的做法，不含价格、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
