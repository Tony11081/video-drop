/* EP.040 · Regulatory Operating Fee: rates changed in 7 countries from June 22, 2026
   Sources:
   - Etsy Community announcement "Regulatory Operating Fee updates for some markets" (181930, jamesossman, VP of Customer Operations):
     "Starting on June 22, 2026": France 0.47%→1.14%, Hungary new 1.97%, India 0.29%→0.05%, Italy 0.32%→0.80%,
     Spain 0.72%→0.88%, Türkiye 2.27%→1.67%, UK 0.32%→0.48%; "to help cover the rising costs of operating under local
     government regulations"; fees "are set by country and reviewed each year".
   - Help Center "What is a Regulatory Operating Fee?" (1500011073202, en-gb, read 2026-11-25, no updated date):
     table Canada 0.50%, France 1.14%, Hungary 1.97%, Italy 0.80%, India 0.05%, Spain 0.88%, Türkiye 1.67%, UK 0.48%, Vietnam 1.24%;
     "charged on the item price and postage costs (including gift wrap and personalisation costs, if applicable) and will vary
     based on seller location"; "subject to VAT where applicable"; "These fees will appear on your Payment account".
     The page does not mention China / Hong Kong.
   tts b1640613157f (Bo, round 2 of 3; round 1 five long pauses + 89s; round 3 more pauses than round 2)
   · OUR TAKE: where your shop is registered is itself a cost — not on the table if you sell from China (our reading),
     shops that put on an EU identity to look local pay on every order */
window.EP = {
  speed: 1.3, lead: 0.30, tail: 3.0,
  episode: "EP.040",
  source: "SOURCE · ETSY HELP CENTER · REGULATORY OPERATING FEE",
  tts: { id: "b1640613157f", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  follow: "关注 · 每天一条 Etsy 政策速递",
  unit: "POINT", rail: ["01", "02", "03", "04"],
  voice: [
    { dur: 2.962, cap: "店开在哪国|Etsy就多扣你一笔费", keys: ["多扣你一笔费"],
      scene: { type: "hook", video: "27c0aa88c22e", from: 1, kicker: "FEES · 监管运营费", scanTag: "FEE",
               lines: ["店开在哪国"], marked: "就多扣一笔费" } },
    { dur: 3.515, cap: "这笔叫监管运营费|按卖家所在地收", keys: ["卖家所在地"],
      scene: { type: "rows", rule: 1, kicker: "REGULATORY OPERATING FEE", title: ["监管", "运营费"],
               rows: [["warn", "按谁收", "卖家所在地"], ["plain", "算在哪", "商品价 + 运费"], ["plain", "也算进去", "礼品包装 · 定制费"]],
               on: [0.15, 1.05, 1.5] } },
    { dur: 4.542, cap: "算的是商品价加运费|礼品包装和定制费也算进去", keys: ["商品价加运费"] },
    { dur: 3.603, cap: "6月22日起|Etsy调了7个国家的费率", keys: ["7个国家"],
      scene: { type: "date", kicker: "SINCE 06.22 · 新费率", big: ["6.22", "2026"], size: 190,
               tiles: [["调整 · UPDATED", "7 国", "warn", 54], ["基数 · BASE", "商品价+运费", "plain", 54]],
               lines: ["Regulatory Operating Fee"], must: "2026 年 6 月 22 日起生效" } },
    { dur: 4.544, cap: "法国从0.47%涨到1.14%|翻了一倍多", keys: ["翻了一倍多"],
      scene: { type: "stats", rule: 2, kicker: "UP · 涨了的 4 国", title: ["涨了", "4 国"], scale: "lin", pre: "", post: "%", dec: 2,
               on: [0.15, 1.0, 1.35, 1.65],
               items: [["法国 · France", 1.14, "0.47 → 1.14%"], ["意大利 · Italy", 0.80, "0.32 → 0.80%"],
                       ["英国 · UK", 0.48, "0.32 → 0.48%"], ["西班牙 · Spain", 0.88, "0.72 → 0.88%"]],
               note: "按商品价 + 运费收 · 6.22 起" } },
    { dur: 4.026, cap: "意大利涨到0.8%|英国0.48%，西班牙0.88%", keys: ["0.8%"] },
    { dur: 4.375, cap: "匈牙利新加了1.97%|全表最高", keys: ["全表最高"],
      scene: { type: "figure", rule: 3, big: "1.97%", sub: "匈牙利 · 新加 · 全表最高",
               rows: [["warn", "以前没有这项费"], ["ok", "印度 0.29% → 0.05%"], ["ok", "土耳其 2.27% → 1.67%"]],
               on: [0.5, 1.05, 1.35] } },
    { dur: 3.83, cap: "印度和土耳其的费率|反而降了", keys: ["反而降了"] },
    { dur: 4.079, cap: "帮助中心的表上现在一共9国|还有加拿大和越南", keys: ["9国"],
      scene: { type: "chips", rule: 3, kicker: "HELP CENTER · 现行费率表", title: ["表上", "一共 9 国"],
               chips: ["法国 1.14%", "匈牙利 1.97%", "意大利 0.80%", "西班牙 0.88%", "英国 0.48%",
                       "土耳其 1.67%", "印度 0.05%", "加拿大 0.50%", "越南 1.24%"],
               on: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.6, 0.8] } },
    { dur: 5.502, cap: "这笔费还要另交增值税|在付款账户里和其他费用一起扣", keys: ["另交增值税"],
      scene: { type: "rows", rule: 4, kicker: "VAT · 增值税", title: ["另交", "增值税"],
               rows: [["warn", "增值税", "适用时另算"], ["plain", "在哪扣", "付款账户 · 和其他费用一起"], ["plain", "多久调", "每年按各国成本评估"]],
               on: [0.1, 0.55, 1.1] } },
    { dur: 4.782, cap: "Etsy说，这些费率每年|都会按各国成本重新评估", keys: ["每年"] },
    { dur: 3.174, cap: "我们的看法：|开店所在地本身就是成本", keys: ["本身就是成本"],
      scene: { type: "split", h: 440, kicker: "OUR TAKE · Shopwright 观点", title: ["开店地", "就是成本"],
               left: { name: "国内开店 · CN", big: "没列", sub: "我们判断：眼下不收",
                       items: [["ok", "9 国表上没有中国"]] },
               right: { name: "挂欧洲身份 · EU", big: "多交", sub: "法国 1.14% · 意大利 0.80%",
                        items: [["bad", "还要另交增值税"]] },
               on: [1.05, 2.05] } },
    { dur: 4.554, cap: "表上没有中国，我们判断|在国内开店的眼下不收", keys: ["眼下不收"] },
    { dur: 5.661, cap: "反倒是挂欧洲身份|装本地的店，每单都多交", keys: ["每单都多交"] },
    { dur: 7.785, cap: "先做三件事：查店铺注册地|看付款账户费用明细，定价多留1个点", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · 今天", title: ["今天", "先做三件事"],
               items: ["查店铺注册地", "看付款账户费用明细", "定价多留 1 个点"], at: [0.2, 0.45, 0.68] } },
    { dur: 5.035, cap: "开店地就是成本|关注我，每天一条Etsy政策速递", keys: ["开店地就是成本"],
      scene: { type: "cta", video: "4bb669ab1567", from: 1, kicker: "OUR TAKE · Shopwright 观点", title: ["开店地", "就是成本"],
               word: "Shopwright", url: "openaigrowth.com", note: "费率以 Etsy 帮助中心为准" } },
  ],
};
