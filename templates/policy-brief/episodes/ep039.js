/* EP.039 · Etsy revises the new Terms of Use on Nov 23 (update to EP.032 / EP.035): anti-copycat promise written into §5.C, opt-out wording gone
   Source: etsy.com/legal/terms (version "effective on December 16, 2026", read 2026-11-24), §5.C:
   "As part of this license we, and our partners and vendors, may use Your Content to develop, train, test and improve artificial
   intelligence and machine learning technologies..." — examples: help buyers find items, seller tools, customer support, promote/advertise, protect community (fraud, policy);
   "We won't use Your Content to train AI models designed to replace your creativity or to create copycat versions of the items you sell on Etsy.";
   "When we work with partners and vendors that provide or train AI models, our purpose is to support our sellers ... and not to enable them to imitate your items.";
   "Our Privacy Policy explains how we use personal information in Your Content and the choices available to you." (no opt-out sentence in §5);
   license: non-exclusive, worldwide, royalty-free, irrevocable, sub-licensable, perpetual.
   October version (read for EP.032) said the AI use was subject to opt-out rights in the Privacy Policy.
   Revision date Nov 23 per community post slug "updated-nov-23-our-recent-terms-of-use-update-192097" (post itself not readable this run).
   tts 4e4056247940 (Bo, round 3; round 1 four long pauses, round 2 line 5 too slow)
   · OUR TAKE: Etsy gave a guarantee, not a switch — the promise only covers models built to copy you; protect designs yourself */
window.EP = {
  speed: 1.3, lead: 0.30, tail: 3.0,
  episode: "EP.039",
  source: "SOURCE · ETSY TERMS OF USE §5.C",
  tts: { id: "4e4056247940", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  follow: "关注 · 每天一条 Etsy 政策速递",
  unit: "POINT", rail: ["01", "02", "03", "04"],
  voice: [
    { dur: 4.244, cap: "Etsy条款又改了|多一句承诺，少一句退出", keys: ["少一句退出"],
      scene: { type: "hook", video: "cf25537985d7", from: 1, kicker: "TERMS OF USE · 11.23 再改", scanTag: "AI",
               lines: ["多一句承诺"], marked: "少一句退出" } },
    { dur: 5.348, cap: "11月23日，Etsy修改了新版使用条款|还是12月16日生效", keys: ["12月16日生效"],
      scene: { type: "date", kicker: "TERMS OF USE · 新版条款", big: ["12.16", "2026"], size: 190,
               tiles: [["修改 · REVISED", "11.23", "warn", 54], ["生效 · EFFECTIVE", "12.16 不变", "plain", 54]],
               lines: ["使用条款 · §5 Your Content"], must: "生效日不变 · 12 月 16 日" } },
    { dur: 4.989, cap: "新加的一句：不会用你的内容|训练取代你创意的AI模型", keys: ["取代你创意"],
      scene: { type: "rows", rule: 1, kicker: "NEW IN §5.C · 新加的一句", title: ["新加", "一句承诺"],
               rows: [["ok", "不训练", "取代创意的模型"], ["ok", "不拿来做", "你商品的仿款"]],
               on: [0.1, 1.05] } },
    { dur: 2.054, cap: "也不会拿来|做你商品的仿款", keys: ["仿款"] },
    { dur: 3.459, cap: "但授权一点没松|全球免费，永久不可撤销", keys: ["一点没松"],
      scene: { type: "chips", rule: 2, kicker: "LICENSE · 授权没变", title: ["授权", "一点没松"],
               chips: ["Worldwide 全球", "Royalty-free 免费", "Perpetual 永久", "Irrevocable 不可撤销"],
               on: [0.15, 0.35, 0.55, 0.75] } },
    { dur: 5.882, cap: "Etsy和合作伙伴、供应商|照样能用你的内容训练AI", keys: ["训练AI"],
      scene: { type: "rows", rule: 2, kicker: "§5.C · 条款原文", title: ["照样", "能训练 AI"],
               rows: [["warn", "Etsy", "可用你的内容"], ["warn", "合作伙伴 · 供应商", "Partners & vendors"]],
               on: [0.1, 0.45] } },
    { dur: 7.686, cap: "条款列的用途：帮买家找商品|卖家工具、客服、推广，还有防欺诈", keys: ["防欺诈"],
      scene: { type: "chips", rule: 2, kicker: "USES · 条款列的用途", title: ["拿去", "干什么"],
               chips: ["帮买家找商品", "卖家工具", "客服", "推广广告", "防欺诈"],
               on: [0.1, 0.3, 0.45, 0.6, 0.8] } },
    { dur: 4.877, cap: "对合作伙伴，条款只写了目的|没写成禁令", keys: ["没写成禁令"],
      scene: { type: "rows", rule: 3, kicker: "PARTNERS · 合作伙伴", title: ["只写目的", "不是禁令"],
               rows: [["plain", "条款写的", "目的是支持卖家"], ["bad", "没写成", "禁止模仿的禁令"]],
               on: [0.1, 0.55] } },
    { dur: 5.253, cap: "十月版条款写着|受隐私政策的退出权利约束", keys: ["退出权利"],
      scene: { type: "split", rule: 4, h: 440, kicker: "OPT-OUT · 退出那句", title: ["退出", "那句删了"],
               left: { name: "十月版 · OCT", big: "有", sub: "受隐私政策退出约束",
                       items: [["ok", "写明退出权利"]] },
               right: { name: "11.23 版 · NOV", big: "删了", sub: "只说隐私政策有选择",
                        items: [["bad", "没提退出"]] },
               on: [0.1, 1.05] } },
    { dur: 5.089, cap: "这次这句删了|只剩隐私政策会说明你有哪些选择", keys: ["这句删了"] },
    { dur: 5.115, cap: "我们的看法：这次换来的|是一句保证，不是一个开关", keys: ["不是一个开关"],
      scene: { type: "split", h: 440, kicker: "OUR TAKE · Shopwright 观点", title: ["一句保证", "不是开关"],
               left: { name: "得到 · GOT", big: "保证", sub: "写进条款 §5.C",
                       items: [["ok", "比社区帖有分量"]] },
               right: { name: "没得到 · NOT", big: "开关", sub: "退出那句删了",
                        items: [["bad", "授权照旧"]] },
               on: [0.3, 1.1] } },
    { dur: 3.632, cap: "承诺写进条款|比上周的社区帖子更有分量", keys: ["更有分量"] },
    { dur: 6.422, cap: "但我们判断，它只管专门用来仿你的模型|管不到别的训练", keys: ["管不到别的训练"],
      scene: { type: "rows", kicker: "OUR TAKE · 我们判断", title: ["只管", "仿款模型"],
               rows: [["ok", "专门仿你的模型", "管得到"], ["bad", "别的训练", "管不到"], ["warn", "保护设计", "要靠自己"]],
               on: [0.1, 0.55, 1.1] } },
    { dur: 3.687, cap: "所以保护设计|别指望条款，要靠自己", keys: ["要靠自己"] },
    { dur: 9.088, cap: "先做三件事：新设计先别放全套高清图|设计稿留好日期，发现仿款走侵权举报", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · 今天", title: ["今天", "先做三件事"],
               items: ["新设计别放全套高清图", "设计稿留好日期", "发现仿款走侵权举报"], at: [0.2, 0.45, 0.68] } },
    { dur: 4.931, cap: "条款给了保证，没给开关|关注我，每天一条Etsy政策速递", keys: ["没给开关"],
      scene: { type: "cta", video: "f06336b65d9a", from: 1, kicker: "OUR TAKE · Shopwright 观点", title: ["给了保证", "没给开关"],
               word: "Shopwright", url: "openaigrowth.com", note: "观点仅供参考 · 非法律意见" } },
  ],
};
