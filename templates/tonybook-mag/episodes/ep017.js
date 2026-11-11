/* NO.024 · A · 定制单打包前，我们对哪几样（2026-11-11），tts 771d954daa95（ElevenLabs v4 · will · tts 内 1.3 倍；第一轮 6732c5623519 的「第一样」被听成「迪洋」，改成「第一样，先对SKU」重来）
   A 类：只讲我们 Etsy 定制店封箱前的核对方法（SKU / 名字逐字母 / 配件 / 面单订单号，对不上先不封），
   不报售后数据、价格、耗时、单量，不提客户和合作方；不讲 Etsy 平台规则（避开 Etsy-Tony EP.018 星级卖家、EP.020 发货）。
   素材（Pexels 免费商用）：首页 7205557 封箱贴胶带｜CH.01 6170316 货架上的包裹｜CH.02 5971266 拿笔看单据（7308090 有可读的 Special Delivery 字，换掉）｜CH.03 7287517 店里打包｜CH.04 6342201 封箱｜CH.05 6186640 手写清单打勾｜CH.06 6342196 坐地封箱。
   成片 output 0f803cb5dabb（49.8 秒）。封面：Codex IMG-20261111-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "017", date: "11.11",
  // cover: "assets/ep017-cover.png",
  topic: "定制单打包前，我们对哪几样",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "771d954daa95", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.381, cap: "定制单封箱前，我们对四样|全对上了再封", keys: ["全对上了再封"] },
    { dur: 2.02, cap: "第一样，先对SKU", keys: ["SKU"] },
    { dur: 3.901, cap: "款式、颜色、尺寸|和手里的货一样一样对", keys: ["一样一样对"] },
    { dur: 1.391, cap: "第二样，对名字", keys: ["对名字"] },
    { dur: 2.802, cap: "拿着订单上的名字|一个字母一个字母地对", keys: ["一个字母"] },
    { dur: 2.938, cap: "大小写也要对|客户怎么写，我们就怎么做", keys: ["大小写"] },
    { dur: 1.487, cap: "第三样，对配件", keys: ["对配件"] },
    { dur: 2.198, cap: "订单里带的小配件|最容易漏装", keys: ["漏装"] },
    { dur: 2.082, cap: "订单上有的，盒子里都要有", keys: ["都要有"] },
    { dur: 1.378, cap: "第四样，对面单", keys: ["对面单"] },
    { dur: 2.556, cap: "面单上的订单号|和这一单对上了再贴", keys: ["订单号"] },
    { dur: 2.66, cap: "有一样对不上，先不封箱|查清楚再发", keys: ["先不封箱"] },
    { dur: 1.794, cap: "封箱前，先做三件事", keys: ["三件事"] },
    { dur: 2.237, cap: "第一，SKU和货对一遍", keys: ["对一遍"] },
    { dur: 2.444, cap: "第二，名字|一个字母一个字母地对", keys: ["一个字母"] },
    { dur: 2.494, cap: "第三，配件和面单|都对上再封", keys: ["对上再封"] },
    { dur: 3.216, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.985, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "定制单**封箱前**|要对哪几样？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们对 4 样", text: "全对上再封", tone: "coral", sub: "SKU · 名字 · 配件 · 面单" },

    { at: 1, clear: true, chapter: "对 SKU", kind: "text", text: "第一样：**先对 SKU**", typing: 0.2 },
    { at: 2, kind: "text", text: "款式 · 颜色 · 尺寸，**逐样对**", typing: 0.2 },

    { at: 3, clear: true, chapter: "对名字", kind: "text", text: "第二样：**对名字**", typing: 0.2 },
    { at: 4, kind: "text", text: "**一个字母一个字母**地对", typing: 0.2 },
    { at: 5, kind: "text", text: "大小写也照**客户写的**", typing: 0.2 },

    { at: 6, clear: true, chapter: "对配件", kind: "text", text: "第三样：**对配件**", typing: 0.2 },
    { at: 7, kind: "text", text: "小配件**最容易漏装**", typing: 0.2 },
    { at: 8, kind: "text", text: "订单上有的，**盒子里都要有**", typing: 0.2 },

    { at: 9, clear: true, chapter: "对面单", kind: "text", text: "第四样：**对面单**", typing: 0.2 },
    { at: 10, kind: "text", text: "订单号**对上了再贴**", typing: 0.2 },
    { at: 11, kind: "text", text: "有一样对不上：**先不封箱**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "SKU 和货对一遍" }, { at: 14, text: "名字逐个字母对" }, { at: 15, text: "配件、面单对上再封" }] },
    { at: 15.6, kind: "note", text: "我们自己定制单的做法，不含售后数据、价格和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
