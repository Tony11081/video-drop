/* EP.041 · Shop suspended: temporary vs permanent, 6-month appeal window
   Sources (read 2026-11-27, pages show no updated date):
   - Help Center "How to Reinstate Your Suspended Account" (115015672628):
     reasons: policy violations, overdue bill, required info/steps not completed; Etsy emails the reason (check spam),
     Shop Manager Dashboard banner; temporary causes: overdue bill (pay → automatic), missing US taxpayer ID (automatic),
     non-US sellers add a bank account soon after first sale, bank verification (quick and automatic), identity verification;
     while suspended: shop not viewable, no new orders, no new listings; funds may be reserved;
     CAN complete orders + add tracking, refund, message, view/pay bill, resolve cases;
     CANNOT cancel open orders, create listings, buy Etsy labels, run Etsy Ads, sign in on mobile apps.
     Permanent: email says "permanently suspended" in subject and body.
   - Help Center "How to File an Appeal for a Permanently Suspended Account" (6298920789271):
     "You have 6 months from the day your account was suspended to file an appeal."; Appeals Center etsy.com/appeals;
     reason → actions taken → how practices will change → supporting documents → Submit; resolve cases + pay balances first;
     reply "can take up to two weeks"; "This decision is final."; no guarantee. Number of appeals not stated.
   · OUR TAKE: many suspensions are paperwork, not violations; permanent is what kills — we judge you basically get
     one shot, so write the appeal as fixes + future practice + evidence, not a plea.
   tts c0be82a02cdd (Bo, round 2 of 3; round 1 had 1.0 s / 2.5 s pauses in the last two lines) */
window.EP = {
  speed: 1.3, lead: 0.30, tail: 3.0,
  episode: "EP.041",
  source: "SOURCE · ETSY HELP CENTER · SUSPENDED ACCOUNTS",
  tts: { id: "c0be82a02cdd", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  follow: "关注 · 每天一条 Etsy 政策速递",
  unit: "POINT", rail: ["01", "02", "03", "04"],
  voice: [
    { dur: 3.051, cap: "店被Etsy封了|先查是不是手续没办完", keys: ["手续没办完"],
      scene: { type: "hook", video: "13cdb08927d7", from: 0, kicker: "ACCOUNT · 店铺被暂停", scanTag: "SUSPENDED",
               lines: ["店被封了"], marked: "先查手续" } },
    { dur: 5.748, cap: "Etsy说，暂停原因会发邮件告诉你|后台首页也可能有提示", keys: ["发邮件"],
      scene: { type: "rows", rule: 1, kicker: "WHY · 为什么被暂停", title: ["先看", "邮件"],
               rows: [["warn", "原因", "Etsy 发邮件说明"], ["plain", "后台", "首页可能有横幅提示"], ["plain", "别漏看", "垃圾邮件箱也查"]],
               on: [0.2, 0.6, 0.85] } },
    { dur: 5.604, cap: "账单逾期、没填美国税号|银行账户没验证，都会被暂停", keys: ["都会被暂停"],
      scene: { type: "rows", rule: 2, kicker: "TEMPORARY · 常见暂停原因", title: ["手续", "没办完"],
               rows: [["warn", "账单", "逾期没付"], ["warn", "美国税号", "没填"],
                      ["warn", "银行账户", "没验证 · 非美国卖家首单后没绑"], ["ok", "补上以后", "自动恢复"]],
               on: [0.1, 0.4, 0.75, 1.5] } },
    { dur: 4.422, cap: "非美国卖家|第一单之后要尽快绑好银行账户", keys: ["绑好银行账户"] },
    { dur: 4.1, cap: "这几种补上就行|Etsy写的是自动恢复", keys: ["自动恢复"] },
    { dur: 3.649, cap: "暂停期间，店铺别人看不到|也接不了新订单", keys: ["接不了新订单"],
      scene: { type: "split", rule: 3, h: 470, kicker: "WHILE SUSPENDED · 暂停期间", title: ["店看不到", "老单照做"],
               left: { name: "CAN · 还能做", items: [["ok", "发货 · 填单号"], ["ok", "全额 / 部分退款"], ["ok", "回私信"], ["ok", "处理纠纷"]] },
               right: { name: "CAN'T · 不能做", items: [["bad", "接新订单"], ["bad", "取消订单"], ["bad", "上架新商品"], ["bad", "投 Etsy 广告"]] },
               on: [1, 2] } },
    { dur: 5.546, cap: "但老订单照样能发货|填单号、退款、回私信", keys: ["老订单"] },
    { dur: 3.648, cap: "不能取消订单，不能上架|也不能投广告", keys: ["不能取消订单"] },
    { dur: 4.223, cap: "永久封号不一样|邮件标题会写永久暂停", keys: ["永久封号"],
      scene: { type: "figure", rule: 4, big: "6 个月", sub: "永久封号 · 申诉窗口",
               rows: [["warn", "邮件标题写 permanently"], ["warn", "从封号那天算 · 过期不能再申诉"], ["plain", "最长 2 周回复 · 结论是最终的"]],
               on: [0.2, 1.1, 2.1] } },
    { dur: 5.541, cap: "从封号那天起，6个月内必须申诉|过期就不能再申诉", keys: ["6个月"] },
    { dur: 5.419, cap: "申诉在申诉中心提交，最长两周回复|Etsy写明结论是最终的", keys: ["结论是最终的"],
      scene: { type: "path", rule: 4, title: ["申诉中心"], crumbs: ["etsy.com/appeals", "选原因", "写已做的改正", "写以后怎么做", "附证据 · 提交"],
               foot: [["warn", "最长两周回复", "结论是最终的"]], footAt: [0.6] } },
    { dur: 5.883, cap: "我们的看法：|很多暂停只是手续问题，不是违规", keys: ["不是违规"],
      scene: { type: "split", h: 440, kicker: "OUR TAKE · Shopwright 观点", title: ["暂停补手续", "永久写透"],
               left: { name: "暂停 · TEMPORARY", big: "补手续", sub: "账单 · 税号 · 银行账户",
                       items: [["ok", "补上自动恢复"]] },
               right: { name: "永久 · PERMANENT", big: "1 次", sub: "我们判断：基本只有一次机会",
                        items: [["bad", "结论是最终的"]] },
               on: [0.3, 1.2] } },
    { dur: 6.446, cap: "真正要命的是永久封号|我们判断，申诉基本只有一次机会", keys: ["一次机会"] },
    { dur: 5.041, cap: "所以别写求情信|写清改了什么、以后怎么做，再附上证据", keys: ["别写求情信"],
      scene: { type: "rows", kicker: "OUR TAKE · 申诉怎么写", title: ["别写", "求情信"],
               rows: [["bad", "不写", "求情 · 喊冤"], ["ok", "写清", "已经改了什么"], ["ok", "写清", "以后怎么做"], ["ok", "附上", "证据文件"]],
               on: [0.15, 0.45, 0.6, 0.8] } },
    { dur: 6.094, cap: "先做三件事，查邮箱和垃圾箱|结清账单、绑好银行账户", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · 今天", title: ["今天", "先做三件事"],
               items: ["查邮箱和垃圾箱", "结清 Etsy 账单", "绑好银行账户"], at: [0.2, 0.45, 0.68] } },
    { dur: 5.937, cap: "封店先查手续、申诉一次写透|关注我，每天一条Etsy政策速递", keys: ["申诉一次写透"],
      scene: { type: "cta", video: "d7eb2a21fad5", from: 0, kicker: "OUR TAKE · Shopwright 观点", title: ["申诉", "一次写透"],
               word: "Shopwright", url: "openaigrowth.com", note: "以 Etsy 帮助中心为准" } },
  ],
};
