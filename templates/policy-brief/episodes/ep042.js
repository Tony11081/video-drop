/* EP.042 · Chargebacks: once the bank is involved, you lose the steering wheel
   Sources (read 2026-11-28, pages show no updated date):
   - Help Center "Chargebacks on Etsy" (4403482405527, en-us titled URL):
     "A chargeback is the dispute of a charge made to a financial institution" (bank, card company, PayPal);
     types: Fraud (didn't authorize), Non-Delivery, Not as Described, Return (unsatisfied, incl. damage);
     a case opened after a chargeback "will be closed by our Case Mediation team" — one dispute method only;
     "Etsy does not make the final decision regarding chargebacks."; once filed "Etsy cannot issue a refund";
     Etsy may contact the seller if paid via Etsy Payments; Etsy's response timeframe "typically a period of 30 to 45 days".
   - Help Center seller article 115015729027 (read the German version; en-us URL blocked this run):
     seller gets an email at the account address with a deadline (no number of days given);
     refunds are a debit on the payment account, not a refund of the order (prevents double refunds);
     a timely response may help avoid a refund in the seller's name; prevention: communication, shop policies,
     detailed listings, Etsy labels with tracking / delivery confirmation.
   Not stated: chargeback fee, seller deadline in days, seller protection terms → not in the video.
   · OUR TAKE: once a chargeback lands, control is gone (refund locked, case closed, bank decides) — the defense
     line sits before the buyer calls the bank; we judge non-delivery is the biggest risk for China-shipped orders. */
window.EP = {
  speed: 1.3, lead: 0.30, tail: 3.0,
  episode: "EP.042",
  source: "SOURCE · ETSY HELP CENTER · CHARGEBACKS",
  tts: { id: "f8d778a8776d", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  follow: "关注 · 每天一条 Etsy 政策速递",
  unit: "POINT", rail: ["01", "02", "03", "04"],
  voice: [
    { dur: 2.358, cap: "买家一拒付|你连退款都退不了", keys: ["退不了"],
      scene: { type: "hook", video: "b3217e58269c", from: 1, kicker: "CHARGEBACK · 信用卡拒付", scanTag: "CHARGEBACK",
               lines: ["买家拒付"], marked: "退款锁死" } },
    { dur: 4.44, cap: "拒付就是买家绕过你|直接找银行或PayPal撤回付款", keys: ["绕过你"],
      scene: { type: "rows", rule: 1, kicker: "WHAT · 什么是拒付", title: ["绕过你", "找银行"],
               rows: [["plain", "买家", "不找你 · 不开 Etsy 纠纷"], ["warn", "直接找", "银行 · 信用卡公司 · PayPal"], ["warn", "结果", "撤回这笔付款"]],
               on: [0.15, 0.4, 0.75] } },
    { dur: 6.307, cap: "Etsy列了4种原因：没下过单、没收到货|货不对板、收到是坏的", keys: ["没收到货"],
      scene: { type: "chips", rule: 1, kicker: "4 TYPES · 原文列的原因", title: ["拒付", "4 种原因"],
               chips: ["没下过单 · Fraud", "没收到货 · Non-Delivery", "货不对板 · Not as Described", "收到是坏的 · Return"],
               on: [0.2, 0.4, 0.6, 0.78] } },
    { dur: 3.559, cap: "拒付一提交|Etsy就不能再给这单退款", keys: ["不能再给这单退款"],
      scene: { type: "split", rule: 2, h: 470, kicker: "AFTER FILING · 拒付之后", title: ["退款锁了", "纠纷关了"],
               left: { name: "REFUND · 退款", items: [["bad", "Etsy 不能再退款"], ["warn", "从付款账户扣"], ["plain", "防止退两次"]] },
               right: { name: "CASE · 纠纷", items: [["bad", "再开纠纷会被关"], ["plain", "只能走一条路"]] },
               on: [0.2, 1.75] } },
    { dur: 5.273, cap: "钱直接从你的付款账户里扣|防止退两次", keys: ["付款账户"] },
    { dur: 4.59, cap: "拒付之后买家再开Etsy纠纷|也会被直接关掉", keys: ["直接关掉"] },
    { dur: 4.302, cap: "Etsy还写明，最后不是它说了算|是银行说了算", keys: ["银行说了算"],
      scene: { type: "rows", rule: 3, kicker: "WHO DECIDES · 谁说了算", title: ["银行", "说了算"],
               rows: [["bad", "Etsy", "不做最终决定"], ["warn", "银行 / 卡组织 / PayPal", "最终决定"]],
               on: [0.25, 0.6] } },
    { dur: 3.065, cap: "你会收到一封邮件|里面写了回复期限", keys: ["回复期限"],
      scene: { type: "figure", rule: 4, big: "30–45", sub: "天 · Etsy 回复银行的一般期限",
               rows: [["warn", "邮件写明回复期限"], ["plain", "Etsy 一般 30–45 天内回复银行"], ["ok", "按时回复 · 才有机会不被扣"]],
               on: [0.1, 1.1, 2.1] } },
    { dur: 4.914, cap: "Etsy一般要在|30到45天内回复银行", keys: ["30到45天"] },
    { dur: 5.281, cap: "按时回复，才有机会|不让这笔钱从你这里扣", keys: ["按时回复"] },
    { dur: 4.963, cap: "我们的看法：|拒付一来，主动权就不在你手里了", keys: ["主动权"],
      scene: { type: "split", h: 440, kicker: "OUR TAKE · Shopwright 观点", title: ["主动权", "在拒付之前"],
               left: { name: "拒付之前 · BEFORE", big: "自己管", sub: "私信 · 退款 · 补发",
                       items: [["ok", "还能自己解决"]] },
               right: { name: "拒付之后 · AFTER", big: "银行判", sub: "你只剩交证据",
                        items: [["bad", "退款锁 · 纠纷关"]] },
               on: [0.3, 1.2] } },
    { dur: 5.294, cap: "退款锁了，纠纷关了|银行来判，你只剩交证据", keys: ["只剩交证据"] },
    { dur: 7.156, cap: "我们判断，国内发货路上时间长|没收到货这一类风险最大", keys: ["没收到货"],
      scene: { type: "rows", kicker: "OUR TAKE · 我们判断", title: ["最怕", "没收到货"],
               rows: [["warn", "国内发货", "路上时间长"], ["bad", "风险最大", "没收到货 · Non-Delivery"], ["ok", "防线", "放在买家找银行之前"]],
               on: [0.15, 0.55, 1.2] } },
    { dur: 3.108, cap: "所以防线要放在|买家找银行之前", keys: ["找银行之前"] },
    { dur: 6.432, cap: "先做三件事：用带追踪的运单|私信当天回，该退的主动退", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · 今天", title: ["今天", "先做三件事"],
               items: ["用带追踪的运单", "私信当天回", "该退的主动退"], at: [0.2, 0.45, 0.68] } },
    { dur: 6.328, cap: "拒付别等银行判|先把买家留在私信里|关注我，每天一条Etsy政策速递", keys: ["留在私信里"],
      scene: { type: "cta", video: "4a9602cf2770", from: 0, kicker: "OUR TAKE · Shopwright 观点", title: ["别等", "银行来判"],
               word: "Shopwright", url: "openaigrowth.com", note: "以 Etsy 帮助中心为准" } },
  ],
};
