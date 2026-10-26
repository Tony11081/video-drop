/* NO.001 · Etsy 手续费：大陆卖家卖 $100 先被扣多少 — tts 57f8c1279fc5 (Gemini Kore)
   v2: the hook leads with the result (−$28.50 on screen from frame 0, voice says it in line 1). */
window.EP = {
  speed: 1.3, lead: 0.1, tail: 2.2,
  episode: "001",
  topic: "大陆卖家做 Etsy，每单先被扣多少？",
  source: "来源：Etsy 收费政策（2026-10-05 更新）· Etsy 帮助中心 · 示意计算",
  tts: { id: "57f8c1279fc5", voice: "google/gemini-3.8-flash-tts · Kore", gap: 0.2 },
  voice: [
    { dur: 3.538, cap: "在Etsy卖100美元|你先被扣掉28.5", keys: ["28.5"] },
    { dur: 2.95, cap: "而且收款手续费|比美国卖家贵一倍", keys: ["贵一倍"] },
    { dur: 1.204, cap: "我给你一笔一笔算", keys: ["一笔一笔算"] },
    { dur: 2.093, cap: "上架费，0.2美元", keys: ["0.2美元"] },
    { dur: 4.039, cap: "成交费6.5%|运费也要算，就是6.5美元", keys: ["运费也要算"] },
    { dur: 3.319, cap: "收款手续费|国内账户收6.5%", keys: ["6.5%"] },
    { dur: 1.735, cap: "再加0.3美元", keys: ["0.3美元"] },
    { dur: 4.113, cap: "美国账户只要3%加0.25|差了一倍多", keys: ["一倍多"] },
    { dur: 2.265, cap: "三笔加起来，先少13.5", keys: ["13.5"] },
    { dur: 3.638, cap: "要是站外广告带来的单|小店再扣15%", keys: ["15%"] },
    { dur: 1.477, cap: "一共28.5美元", keys: ["28.5美元"] },
    { dur: 2.115, cap: "所以定价前先做三件事", keys: ["三件事"] },
    { dur: 2.099, cap: "第一，运费算进成交费", keys: ["运费"] },
    { dur: 2.283, cap: "第二，后台看清收款费率", keys: ["收款费率"] },
    { dur: 2.505, cap: "第三，广告单的利润单独算", keys: ["单独算"] },
    { dur: 3.778, cap: "关注Tony Book跨境|每天讲透一个跨境问题", keys: ["关注"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "在 Etsy 卖了一单 **$100**" },
    { at: 0, instant: true, kind: "big", label: "大陆卖家 · 先被扣掉", text: "−$28.50", tone: "coral", sub: "到手只剩 **$71.50**" },
    { at: 1, kind: "text", text: "而且收款手续费，比美国卖家**贵 1 倍**", typing: 0.25 },
    { at: 2, kind: "text", text: "我给你一笔一笔算 👇", typing: 0.2 },

    { at: 3, clear: true, kind: "bill", title: "一单 $100 · 一笔一笔扣", tag: "RECEIPT",
      rows: [{ at: 3.15, label: "① 上架费", sub: "每个商品 · 4 个月到期再续", amt: 0.2 },
             { at: 4.1, label: "② 成交费 6.5%", sub: "商品价 + 运费 一起算", amt: 6.5 }] },

    { at: 5, clear: true, kind: "cmp", title: "③ 收款手续费 · 同样一单 $100", tag: "COMPARE",
      cols: [{ at: 5.3, name: "国内银行账户", rate: "6.5% + $0.30", fee: 6.8, hot: true },
             { at: 7.05, name: "美国银行账户", rate: "3% + $0.25", fee: 3.25 }],
      badge: { at: 7.6, text: "差了 1 倍多" }, foot: "香港账户：4.4% + HK$2" },

    { at: 8, clear: true, kind: "bill", title: "一单 $100 · 合计", tag: "TOTAL",
      rows: [{ at: 8.05, label: "上架费", amt: 0.2 }, { at: 8.15, label: "成交费 6.5%", amt: 6.5 },
             { at: 8.25, label: "收款费（国内账户）", amt: 6.8 }],
      total: { at: 8.5, label: "先扣", amt: 13.5 } },
    { at: 9, kind: "text", text: "**站外广告**带来的单，小店再扣 **15%**", typing: 0.25 },
    { at: 10, kind: "big", label: "这一单一共被扣", text: "−$28.50", tone: "coral", count: 28.5, pre: "−$",
      sub: "到手 **$71.50**，还没算成本和物流", typing: 0.2 },

    { at: 11, clear: true, kind: "todo", title: "定价前先做 3 件事",
      items: [{ at: 12, text: "运费算进成交费" }, { at: 13, text: "后台看清收款费率" }, { at: 14, text: "广告单的利润单独算" }] },
    { at: 14.6, kind: "note", text: "站外广告：年销售额 $1 万以下的店 15%，以上 12%，每单最多 $100。" },

    { at: 15, clear: true, kind: "follow", name: "TonyBook跨境", sub: "每天讲透一个跨境实操问题", pressAt: 15.5 },
  ],
};
