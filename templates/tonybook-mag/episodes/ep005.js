/* NO.005 · B · Etsy 站外广告，哪些店能关 — 4 号极简杂志样片（2026-10-31），tts 8875aff4bd7f（ElevenLabs v4 · will）
   Facts only from Etsy Help Center "How Etsy's Offsite Ads Work" (help.etsy.com/hc/articles/360000338367), accessed 2026-10-30, page shows no last-updated date:
   15% for shops that have never made $10,000 in any consecutive 365 days, 12% for shops that have; fee never exceeds $100 per order;
   attributed when a buyer clicks an ad and buys within 30 days; only shops under the threshold can opt out
   (Shop Manager → Settings → Offsite Ads → Opt out), can turn it back on from the same page; once over the threshold, required from then on.
   The $100 order is an illustrative calculation (示意). */
window.EP = {
  speed: 1.3, lead: 0.1, tail: 2.2,
  episode: "005", date: "10.31",
  cover: "assets/ep005-cover.png",
  topic: "Etsy 站外广告扣 15%，能关吗？",
  source: "来源：Etsy 帮助中心 How Etsy's Offsite Ads Work（2026-10-30 查阅，页面未标更新日期）· 示意计算",
  tts: { id: "8875aff4bd7f", voice: "elevenlabs/eleven-v4 · will", gap: 0.2 },
  voice: [
    { dur: 4.801, cap: "站外广告的单要扣15%|小店可以直接关", keys: ["直接关"] },
    { dur: 2.815, cap: "关键就看一个数|1万美元", keys: ["1万美元"] },
    { dur: 5.569, cap: "任意连续365天|销售额从没到过1万美元，就能关", keys: ["从没到过"] },
    { dur: 3.811, cap: "一旦到过1万|就得一直参加，再也关不掉", keys: ["再也关不掉"] },
    { dur: 1.505, cap: "那钱是怎么扣的？", keys: ["怎么扣"] },
    { dur: 3.96, cap: "没到过1万的店|广告带来的单扣15%", keys: ["15%"] },
    { dur: 2.724, cap: "到过1万的店，扣12%", keys: ["12%"] },
    { dur: 3.316, cap: "不管订单多大|每单最多扣100美元", keys: ["100美元"] },
    { dur: 4.616, cap: "买家点了广告，30天内|在你店里下单，都算广告单", keys: ["30天内"] },
    { dur: 3.394, cap: "比如一单100美元|就要扣15美元", keys: ["15美元"] },
    { dur: 4.931, cap: "在哪关？店铺管理|设置，站外广告，点退出", keys: ["站外广告"] },
    { dur: 3.312, cap: "关了以后想再开|同一页还能打开", keys: ["同一页"] },
    { dur: 1.915, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.947, cap: "第一，查清自己|有没有到过1万", keys: ["到过1万"] },
    { dur: 4.066, cap: "第二，利润薄的店|先算广告单还赚不赚", keys: ["还赚不赚"] },
    { dur: 3.825, cap: "第三，到1万之前想好|过了就关不掉", keys: ["关不掉"] },
    { dur: 4.035, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 5.04, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "站外广告扣 **15%**|能关吗？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "从没到过 $1 万的店", text: "可以直接关", tone: "coral", sub: "到过 $1 万的店，**再也关不掉**" },

    { at: 1, clear: true, chapter: "能不能关", kind: "text", text: "关键就看一个数", typing: 0.2 },
    { at: 1.3, kind: "big", kicker: "Threshold", label: "门槛 · 任意连续 365 天销售额", text: "$1 万", tone: "coral", sub: "按 **任意连续 365 天** 算，不是自然年", typing: 0.2 },
    { at: 2.5, kind: "text", text: "**从没到过** $1 万 → 能关", typing: 0.2 },
    { at: 3, kind: "text", text: "一旦到过 → **再也关不掉**", typing: 0.2 },

    { at: 4, clear: true, chapter: "怎么扣钱", kind: "text", text: "那钱是怎么扣的？", typing: 0.2 },
    { at: 5, kind: "cmp", title: "一单 $100 · 站外广告费（示意）", tag: "COMPARE",
      cols: [{ at: 5.3, name: "从没到过 $1 万", rate: "15%", fee: 15, hot: true },
             { at: 6.1, name: "到过 $1 万", rate: "12%", fee: 12 }],
      badge: { at: 7.2, text: "每单最多 $100" }, foot: "只算广告带来的单" },

    { at: 8, clear: true, chapter: "算一笔账", kind: "text", text: "点了广告 **30 天内**下单，都算", typing: 0.2 },
    { at: 9, kind: "big", kicker: "Example", label: "一单 $100 · 小店（示意）", text: "−$15.00", tone: "coral", count: 15, pre: "−$",
      sub: "订单再大，每单也 **最多扣 $100**", typing: 0.2 },

    { at: 10, clear: true, chapter: "在哪关", kind: "text", text: "在哪关？店铺管理里", typing: 0.2 },
    { at: 10.35, kind: "text", text: "**设置** → **站外广告** → 退出", typing: 0.2 },
    { at: 11, kind: "text", text: "关了想再开，**同一页**还能打开", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "查清有没有到过 $1 万" }, { at: 14, text: "利润薄的店，先算广告单还赚不赚" }, { at: 15, text: "到 $1 万之前想好，过了关不掉" }] },
    { at: 15.6, kind: "note", text: "以 Etsy 帮助中心 How Etsy's Offsite Ads Work 为准（2026-10-30 查阅）；$100 一单为示意计算。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
