/* NO.002 · A · 圣诞定制单：最晚哪天接单 — tts 96ba61bfd9f9 (Gemini Kore)
   Hook leads with the result: USPS 2026 recommended send-by date (12/17, Ground Advantage) on screen from frame 0.
   Our angle: our own custom shop is stocking for Christmas; method only, no costs / volumes / transit-day numbers. */
window.EP = {
  speed: 1.3, lead: 0.1, tail: 2.2,
  episode: "002",
  topic: "圣诞定制单，最晚哪天还能接？",
  source: "来源：USPS 2026 节日寄件建议日期 · Etsy 卖家手册 Holiday HQ（2026-10-05）· 示意",
  tts: { id: "96ba61bfd9f9", voice: "google/gemini-3.8-flash-tts · Kore", gap: 0.2 },
  voice: [
    { dur: 4.257, cap: "想赶圣诞|美国本土最晚12月17号就得寄出", keys: ["12月17号"] },
    { dur: 3.226, cap: "我们从国内发，路上更久|还得往前推", keys: ["往前推"] },
    { dur: 2.772, cap: "我们自己的定制店|正在备圣诞货", keys: ["备圣诞货"] },
    { dur: 1.579, cap: "说说我们怎么倒着算", keys: ["倒着算"] },
    { dur: 3.628, cap: "从12月17号往前|先减国际物流的天数", keys: ["国际物流"] },
    { dur: 1.912, cap: "再减你自己的制作天数", keys: ["制作天数"] },
    { dur: 2.571, cap: "算出来那天|就是你的最晚接单日", keys: ["最晚接单日"] },
    { dur: 3.475, cap: "Etsy官方也建议|节前定好最后接单日", keys: ["最后接单日"] },
    { dur: 3.291, cap: "定制款的加工时间|要改成真实能做到的", keys: ["真实能做到"] },
    { dur: 2.82, cap: "我们的做法是|热门款先把底板做好", keys: ["底板"] },
    { dur: 3.464, cap: "出单以后只刻名字|加工时间就能短一截", keys: ["只刻名字"] },
    { dur: 1.838, cap: "所以现在就做三件事", keys: ["三件事"] },
    { dur: 3.625, cap: "第一，倒推出最后接单日|写进店铺公告", keys: ["店铺公告"] },
    { dur: 3.181, cap: "第二，每个款式的|加工时间分开设", keys: ["分开设"] },
    { dur: 2.667, cap: "第三，热门款提前备好底板", keys: ["备好底板"] },
    { dur: 3.926, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 4.689, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "圣诞定制单，**最晚哪天**还能接？" },
    { at: 0, instant: true, kind: "big", label: "美国本土 · 建议最晚寄出", text: "12月17日", tone: "coral", sub: "USPS 普通包裹，赶 **12/25** 前送到" },
    { at: 1, kind: "text", text: "从国内发，路上更久，还得**往前推**", typing: 0.25 },
    { at: 2, kind: "text", text: "我们的定制店，正在备圣诞货 🎄", typing: 0.2 },
    { at: 3, kind: "text", text: "说说我们怎么**倒着算** 👇", typing: 0.2 },

    { at: 4, clear: true, kind: "text", text: "从 **12/17** 往前，减**国际物流天数**", typing: 0.25 },
    { at: 5, kind: "text", text: "再减你自己的 **制作天数**", typing: 0.2 },
    { at: 6, kind: "big", label: "算出来的那一天", text: "最晚接单日", tone: "coral", sub: "示意：天数按你自己的物流和产能填", typing: 0.2 },

    { at: 7, clear: true, kind: "text", text: "Etsy 建议：节前定好**最后接单日**", typing: 0.25 },
    { at: 8, kind: "text", text: "**加工时间**改成真实能做到的", typing: 0.25 },
    { at: 9, kind: "text", text: "我们的做法：热门款先把**底板**做好", typing: 0.25 },
    { at: 10, kind: "text", text: "出单只刻**名字**，加工时间短一截", typing: 0.25 },

    { at: 11, clear: true, kind: "todo", title: "现在就做 3 件事",
      items: [{ at: 12, text: "倒推最后接单日，写进店铺公告" }, { at: 13, text: "每个款式的加工时间分开设" }, { at: 14, text: "热门款提前备好底板" }] },
    { at: 14.6, kind: "note", text: "USPS 2026 建议寄出日（美国本土）：Ground Advantage 12/17，Priority Mail 12/18，Express 12/19。" },

    { at: 15, clear: true, kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TonyBook跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
