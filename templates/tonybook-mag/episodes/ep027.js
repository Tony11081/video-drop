/* NO.034 · A · 亚克力名字的颜色，为什么不画进名字图（2026-11-23），tts 856b148c09a7（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店为什么名字图永远黑字白底——名字图是拿去激光切的，切出来的颜色看放进去哪块板，
   图上画颜色也切不出颜色；颜色从订单里读：化妆包看 SKU 最后一段（GLM 金镜面），圣诞袜看名牌编号（13 金镜面），
   没写编号用主图颜色；读不出颜色先问清楚不猜。
   依据运营台定制说明通用规则 2 / 3 和 P0002 / P0003 / P0004 的名牌颜色来源、店铺字体样图表「缺颜色映射先处理，不能猜」。
   无官方数字，不报材料价和成本；不碰 Etsy-Tony EP.026 定制选项；和 ep022（木头和亚克力怎么选）、ep026（按材料分批切）的区别是只讲颜色为什么不进图、从哪读。
   素材（Pexels 免费商用，每章先切段再合成）：首页 27936932 激光切割特写｜CH.01 34716349 工业激光切割机｜CH.02 4973185 手拿色卡（10 秒素材，接一小段同素材补足）｜
   CH.03 8472466 笔记本桌面倒咖啡｜CH.04 10527947 手机刷消息。成片 output bf47586017dd（50.5 秒）。封面：Codex IMG-20261123-003 做完配音和素材时还是待处理，没用封面。
   配音 verify 标了第 5 句（「金镜面亚克力」听写成「精进面压颗粒」），同音听写差异，未改。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "027", date: "11.23",
  // cover: "assets/ep027-cover.png",
  topic: "亚克力名字的颜色，为什么不画进名字图",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "856b148c09a7", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.706, cap: "金色的名字|图上我们只画黑字", keys: ["只画黑字"] },
    { dur: 2.415, cap: "名字什么颜色|靠材料，不靠图", keys: ["靠材料"] },
    { dur: 1.723, cap: "名字图是拿去|激光切的", keys: ["激光切"] },
    { dur: 2.71, cap: "切出来什么颜色|看放进去的是哪块板", keys: ["哪块板"] },
    { dur: 2.607, cap: "放金镜面亚克力|切出来就是金色", keys: ["金镜面亚克力"] },
    { dur: 2.295, cap: "图上画了金色|也切不出金色", keys: ["切不出"] },
    { dur: 2.719, cap: "同一张黑白图|换块板就是另一种颜色", keys: ["换块板"] },
    { dur: 1.525, cap: "颜色要从订单里读", keys: ["订单"] },
    { dur: 5.059, cap: "化妆包看SKU最后一段|GLM就是金镜面", keys: ["SKU最后一段"] },
    { dur: 2.765, cap: "圣诞袜看名牌编号|13号是金镜面", keys: ["名牌编号"] },
    { dur: 1.994, cap: "没写编号|就用主图上的颜色", keys: ["主图"] },
    { dur: 1.827, cap: "出图之前|先做三件事", keys: ["三件事"] },
    { dur: 2.348, cap: "第一，名字图只出黑字白底", keys: ["黑字白底"] },
    { dur: 3.044, cap: "第二，颜色从SKU或编号里读", keys: ["SKU"] },
    { dur: 2.909, cap: "第三，读不出颜色|先问清楚，不猜", keys: ["不猜"] },
    { dur: 3.181, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.983, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "金色的名字|图上为什么**是黑字**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "颜色靠材料", tone: "coral", sub: "图只管形状 · 颜色看板材" },

    { at: 2, clear: true, chapter: "图只管形状", kind: "text", text: "名字图是拿去**激光切**的", typing: 0.2 },
    { at: 3, kind: "text", text: "颜色看**放进去哪块板**", typing: 0.2 },
    { at: 4, kind: "big", kicker: "Example", label: "放金镜面亚克力", text: "切出来是金色", tone: "coral", sub: "图上画金色，也切不出金色" },
    { at: 6, kind: "text", text: "同一张黑白图，**换板就换色**", typing: 0.2 },

    { at: 7, clear: true, chapter: "颜色从哪读", kind: "text", text: "颜色要**从订单里读**", typing: 0.2 },
    { at: 8, kind: "text", text: "化妆包：**SKU 最后一段**", typing: 0.2 },
    { at: 8.5, kind: "big", kicker: "Example", label: "化妆包 SKU 最后一段 GLM", text: "金镜面", tone: "coral", sub: "圣诞袜看名牌编号：13 = 金镜面" },
    { at: 10, kind: "text", text: "没写编号，用**主图颜色**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "出图前先做 3 件事",
      items: [{ at: 12, text: "名字图只出黑字白底" }, { at: 13, text: "颜色从 SKU 或编号里读" }, { at: 14, text: "读不出颜色，先问清楚不猜" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含材料价和成本。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
