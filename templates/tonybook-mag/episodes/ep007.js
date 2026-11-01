/* NO.007 · B · 亚马逊个人卖家和专业卖家怎么选（2026-11-01），tts 98e1a13a4ef1（ElevenLabs v4 · will · tts 内 1.3 倍）
   topics.md 原 NO.008（原 NO.007 因和 Etsy-Tony EP.018 重复已跳过），期号顺延为 007。
   核实（2026-11-01 查阅）：sell.amazon.com/pricing（个人 $0.99/件，专业 $39.99/月 + 销售费用；页面未标更新日期）；
   sell.amazon.com/blog/amazon-professional-vs-individual-selling-plan（2025-10-01 发布：个人适合每月 40 件以下，超过 40 件考虑专业；
   专业多批量上架、品牌管理、销售报表、广告工具；计划可随时切换、立即生效）。40 × $0.99 = $39.60 为示意计算。
   成片 output 1ee46f9f445e（54.95 秒）。素材（Pexels 免费商用）：首页 7735854 手机计算器｜CH.01 7873071 笔记本打字｜CH.02 6700653 办公桌数钱｜CH.03 5100052 仓库货架｜CH.04 32082737 手写清单｜CH.05 12692039 桌边打字。封面：Codex IMG-20261101-002 未出图，没用封面。 */
window.EP = {
  speed: 1, lead: 0.05, tail: 0.25, footage: true,   // 配音 54.66 秒，压短片头片尾让成片不超过 55 秒
  episode: "007", date: "11.01",
  // cover: "assets/ep007-cover.png",  // Codex 封面图到了再打开
  topic: "亚马逊个人卖家和专业卖家怎么选",
  source: "sell.amazon.com 价格页与官方博客（2026-11-01 查阅）· 40 件为示意计算",
  tts: { id: "98e1a13a4ef1", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.097, cap: "亚马逊一个月卖不到40件|先别开专业账户", keys: ["40件"] },
    { dur: 2.19, cap: "亚马逊卖家|有两种销售计划", keys: ["两种"] },
    { dur: 3.101, cap: "个人计划，每卖出一件|交0.99美元", keys: ["0.99美元"] },
    { dur: 2.678, cap: "专业计划，每月固定|39.99美元", keys: ["39.99美元"] },
    { dur: 1.837, cap: "卖多卖少，月费都一样", keys: ["都一样"] },
    { dur: 4.045, cap: "算一下，40件乘0.99|是39.6美元", keys: ["39.6美元"] },
    { dur: 2.035, cap: "还比专业计划的月费|便宜一点", keys: ["便宜"] },
    { dur: 3.201, cap: "卖到第41件|专业计划才开始省钱", keys: ["第41件"] },
    { dur: 3.631, cap: "亚马逊官方也说|每月超过40件，再考虑专业计划", keys: ["超过40件"] },
    { dur: 2.93, cap: "两种计划，卖出去|都还要另交销售佣金", keys: ["销售佣金"] },
    { dur: 4.153, cap: "专业计划多出来的|是批量上架、广告和销售报表这些工具", keys: ["批量上架"] },
    { dur: 2.247, cap: "计划可以随时切换|马上生效", keys: ["随时切换"] },
    { dur: 1.475, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.463, cap: "第一，算清自己|每个月能卖多少件", keys: ["多少件"] },
    { dur: 2.593, cap: "第二，不到40件|先用个人计划", keys: ["个人计划"] },
    { dur: 3.368, cap: "第三，要打广告、批量上架了|再升专业计划", keys: ["再升"] },
    { dur: 3.161, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.9, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "亚马逊卖不到 **40 件**|开专业账户吗？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "每月 40 件以下", text: "先别开", tone: "coral", sub: "超过 40 件，**专业计划**才开始划算" },

    { at: 1, clear: true, chapter: "两种计划", kind: "text", text: "亚马逊卖家有**两种**销售计划", typing: 0.2 },
    { at: 2, kind: "text", text: "个人计划：每卖一件 **$0.99**", typing: 0.2 },
    { at: 3, kind: "text", text: "专业计划：每月固定 **$39.99**", typing: 0.2 },
    { at: 4, kind: "text", text: "卖多卖少，**月费都一样**", typing: 0.2 },

    { at: 5, clear: true, chapter: "算一笔账", kind: "cmp", title: "每月卖 40 件 · 平台月度费用（示意）", tag: "COMPARE",
      cols: [{ at: 5.3, name: "个人 40 × $0.99", rate: "按件", fee: 39.6, hot: true },
             { at: 5.8, name: "专业计划", rate: "按月", fee: 39.99 }],
      badge: { at: 7, text: "第 41 件起专业更省" }, foot: "不含销售佣金" },
    { at: 8, kind: "text", text: "官方：**超过 40 件**再考虑专业", typing: 0.2 },

    { at: 9, clear: true, chapter: "还要知道", kind: "text", text: "两种计划都**另交销售佣金**", typing: 0.2 },
    { at: 10, kind: "text", text: "专业多了**批量上架**、广告、报表", typing: 0.2 },
    { at: 11, kind: "text", text: "计划**随时切换**，马上生效", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "算清自己每月能卖多少件" }, { at: 14, text: "不到 40 件，先用个人计划" }, { at: 15, text: "要打广告、批量上架，再升专业" }] },
    { at: 15.6, kind: "note", text: "以 sell.amazon.com 价格页和官方博客为准（2026-11-01 查阅）；40 件为示意计算。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
