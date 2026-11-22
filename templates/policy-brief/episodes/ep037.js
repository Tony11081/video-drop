/* EP.037 · UK pricing transparency under the DMCC Act: UK buyers see the total price incl. delivery
   Source: community.etsy.com/forum/announcements-290/topic/pricing-transparency-in-the-uk-under-the-dmcc-act-165033/
   (Etsy Staff, VP of Customer Operations; posted ~6 months ago, staff follow-up ~4 months ago; no calendar dates shown):
   DMCC Act "requires businesses to clearly show the total price a customer in the UK must pay upfront, throughout the purchase journey";
   mandatory costs "such as shipping or other required fees can't be introduced later"; Etsy shows UK buyers a combined total =
   item price + VAT-inclusive shipping, "including when viewing a listing"; "it can make a listing's price look higher at first glance";
   "the total amount a buyer pays has not changed"; final total may update at checkout if delivery details change or items qualify
   for combined shipping, buyers always see the updated final price before purchase.
   Follow-up (newer): rolling out an update that "returns your listing price (inclusive of VAT, where applicable) as the headline price";
   "Just below, UK buyers will see the total price, including delivery and any sales you're running."
   Post gives no rollout date and no required seller action. Help article 38513781539863 not readable this run.
   tts b93c87f2c5d7 (Bo, round 1; two 0.8 s pauses after 「运费这类必须付的钱，」 and 「第一，」)
   · OUR TAKE: in the UK, "low price + high shipping" no longer works — buyers compare totals; shops shipping from China with high
     shipping lose most, and moving shipping into the price doesn't change the total. */
window.EP = {
  speed: 1.3, lead: 0.30, tail: 3.0,
  episode: "EP.037",
  source: "SOURCE · ETSY COMMUNITY ANNOUNCEMENT",
  tts: { id: "b93c87f2c5d7", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  follow: "关注 · 每天一条 Etsy 政策速递",
  unit: "RULE", rail: ["01", "02", "03"],
  voice: [
    { dur: 2.988, cap: "英国买家|第一眼就看到你的运费了", keys: ["看到你的运费"],
      scene: { type: "hook", video: "6681d2acac54", from: 1, kicker: "UK · DMCC 价格透明", scanTag: "UK",
               lines: ["英国买家"], marked: "先看到运费" } },
    { dur: 5.395, cap: "英国的DMCC法案要求|总价必须一开始就讲清楚", keys: ["一开始就讲清楚"],
      scene: { type: "date", kicker: "UK LAW · DMCC ACT", big: ["DMCC"], size: 260,
               tiles: [["适用 · WHO", "英国买家", "", 54], ["要求 · RULE", "总价先讲清", "ok", 54]],
               lines: ["英国《数字市场、竞争和消费者法》"], must: "必付费用不能后加" } },
    { dur: 4.751, cap: "运费这类必须付的钱|不能到结账才冒出来", keys: ["不能到结账"] },
    { dur: 4.469, cap: "所以Etsy给英国买家|显示商品价加运费的总价", keys: ["总价"],
      scene: { type: "rows", kicker: "UK BUYERS · 英国买家", title: ["显示", "总价"],
               rows: [["plain", "商品价", "ITEM PRICE"], ["plain", "+ 运费", "含增值税 · VAT"], ["warn", "= 总价", "TOTAL PRICE"]],
               on: [0.1, 0.45, 0.75] } },
    { dur: 3.897, cap: "运费含增值税|在商品页上就能看到", keys: ["商品页"],
      scene: { type: "rows", kicker: "WHERE · 在哪看到", title: ["一路", "都能看到"],
               rows: [["plain", "商品页", "就显示总价"], ["plain", "整个购买流程", "一直显示"]],
               on: [0.1, 0.5] } },
    { dur: 2.938, cap: "Etsy自己也承认|价格乍一看会更高", keys: ["乍一看会更高"],
      scene: { type: "rows", kicker: "ETSY SAYS · 官方原话", title: ["看起来", "更贵"],
               rows: [["bad", "第一眼", "价格显得更高"], ["plain", "原因", "运费算进了总价"]], on: [0.1, 0.55] } },
    { dur: 5.587, cap: "第一，买家付的总钱数没变|变的只是显示方式", keys: ["总钱数没变"],
      scene: { type: "split", rule: 1, h: 400, title: ["钱没变", "显示变了"],
               left: { name: "没变 · SAME", big: "总额", sub: "买家实际付的钱",
                       items: [["ok", "一分没多"]] },
               right: { name: "变了 · NEW", big: "显示", sub: "总价提前亮出来",
                        items: [["warn", "比价看总价"]] },
               on: [0.2, 0.6] } },
    { dur: 3.724, cap: "第二，卖家反馈之后|大字改回了你的商品标价", keys: ["商品标价"],
      scene: { type: "rows", rule: 2, title: ["改了", "一步"],
               rows: [["ok", "大字", "你的商品标价"], ["plain", "含增值税", "适用时"]],
               on: [0.15, 0.55] } },
    { dur: 3.472, cap: "紧跟在下面一行|是含运费和折扣的总价", keys: ["含运费和折扣"],
      scene: { type: "rows", rule: 2, title: ["下面", "一行"],
               rows: [["ok", "大字", "你的商品标价"], ["warn", "下一行", "含运费和折扣的总价"]],
               on: [0, 0.3] } },
    { dur: 5.367, cap: "第三，换了地址或者能合并运费|结账总价会更新", keys: ["结账总价会更新"],
      scene: { type: "rows", rule: 3, title: ["结账", "可能变"],
               rows: [["plain", "换了收货地址", "总价更新"], ["plain", "能合并运费", "总价更新"], ["ok", "付款前", "一定看到最终价"]],
               on: [0.1, 0.4, 0.7] } },
    { dur: 3.575, cap: "公告没写上线日期|也没说卖家必须做什么", keys: ["没写上线日期"],
      scene: { type: "rows", title: ["公告", "没写的"],
               rows: [["bad", "上线日期", "没写"], ["bad", "卖家必做", "没写"]],
               on: [0.1, 0.5] } },
    { dur: 5.174, cap: "我们的看法：在英国|低标价加高运费这招，失效了", keys: ["失效了"],
      scene: { type: "split", h: 440, kicker: "OUR TAKE · Shopwright 观点", title: ["低价高运费", "失效了"],
               left: { name: "以前 · BEFORE", big: "标价", sub: "运费结账才看到",
                       items: [["bad", "低标价拉点击"]] },
               right: { name: "现在 · NOW", big: "总价", sub: "就在标价下面",
                        items: [["warn", "买家比总价"]] },
               on: [0.3, 0.9] } },
    { dur: 3.95, cap: "总价就在标价下面|买家比价，比的是总价", keys: ["比的是总价"] },
    { dur: 4.912, cap: "从国内发货、运费高的店最吃亏|把运费挪进标价也没用", keys: ["最吃亏"],
      scene: { type: "rows", kicker: "OUR TAKE · 我们判断", title: ["谁", "最吃亏"],
               rows: [["bad", "国内发货", "运费高"], ["bad", "运费挪进标价", "总价不变"]],
               on: [0.1, 0.55] } },
    { dur: 8.993, cap: "今天先做三件事：算出英国单的总价|跟英国本地店比一比，再把多件合并运费设好", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · 今天", title: ["今天", "先做三件事"],
               items: ["算出英国单的总价", "跟英国本地店比一比", "设好多件合并运费"], at: [0.2, 0.45, 0.68] } },
    { dur: 5.279, cap: "运费藏不住了，那就比总价|关注我，每天一条Etsy政策速递", keys: ["比总价"],
      scene: { type: "cta", video: "8ed914a93223", from: 1, kicker: "OUR TAKE · Shopwright 观点", title: ["运费藏不住", "就比总价"],
               word: "Shopwright", url: "openaigrowth.com", note: "观点仅供参考" } },
  ],
};
