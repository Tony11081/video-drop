/* NO.003 · C · Etsy 新店身份验证要备什么 — tts 0bc18eba01dc (Gemini Kore)
   Hook leads with the consequence from Etsy Help Center ("Repeated failures may mean you cannot onboard with Etsy at this time").
   All requirements from Etsy Help Center: How to Verify Your Identity on Etsy (Persona) + How to Verify Your Seller Information for Etsy Payments.
   Pages show no last-updated date; accessed 2026-10-28. */
window.EP = {
  speed: 1.3, lead: 0.1, tail: 2.2,
  episode: "003",
  topic: "Etsy 开店，卡在身份验证怎么办？",
  source: "来源：Etsy 帮助中心 身份验证 / Etsy Payments 卖家信息验证（2026-10-28 查阅，页面未标更新日期）",
  tts: { id: "0bc18eba01dc", voice: "google/gemini-3.8-flash-tts · Kore", gap: 0.2 },
  voice: [
    { dur: 4.355, cap: "Etsy开店的身份验证反复失败|可能就暂时开不了店", keys: ["开不了店"] },
    { dur: 3.473, cap: "官方帮助中心写了要备哪几样|我挑重点说", keys: ["哪几样"] },
    { dur: 2.569, cap: "第一样|政府签发的带照片证件", keys: ["带照片证件"] },
    { dur: 3.353, cap: "护照、驾照这类|按你的国家看能用哪种", keys: ["按你的国家"] },
    { dur: 3.062, cap: "证件不能过期|名字和生日要看得清", keys: ["不能过期"] },
    { dur: 2.372, cap: "名字得是拉丁字母|比如拼音", keys: ["拉丁字母"] },
    { dur: 2.357, cap: "第二样|一个收款的银行账户", keys: ["银行账户"] },
    { dur: 2.874, cap: "证件上的名字|必须和这个账户名一致", keys: ["一致"] },
    { dur: 3.455, cap: "第三样，纳税人地址|名字也要对得上", keys: ["纳税人地址"] },
    { dur: 3.948, cap: "最后拍自拍|系统拿你的脸和证件照比对", keys: ["自拍"] },
    { dur: 2.542, cap: "摘掉眼镜和帽子|脸要拍清楚", keys: ["眼镜和帽子"] },
    { dur: 3.389, cap: "另外，大多数店|还要绑一张借记卡或信用卡", keys: ["借记卡或信用卡"] },
    { dur: 2.508, cap: "所以提交之前|先做三件事", keys: ["三件事"] },
    { dur: 4.609, cap: "第一，证件、银行账户、纳税人地址|名字核对一遍", keys: ["名字核对"] },
    { dur: 2.881, cap: "第二，确认证件没过期|照片清楚", keys: ["没过期"] },
    { dur: 2.921, cap: "第三，备好一张|借记卡或信用卡", keys: ["备好"] },
    { dur: 4.019, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 4.149, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "Etsy 开店，一直卡在**身份验证**…" },
    { at: 0, instant: true, kind: "big", label: "验证反复失败 · 可能暂时", text: "开不了店", tone: "coral", sub: "Etsy 帮助中心：可能 **无法入驻**" },
    { at: 1, kind: "text", text: "官方写了要备**哪几样**，挑重点说 👇", typing: 0.25 },

    { at: 2, clear: true, kind: "text", text: "① 政府签发的**带照片证件**", typing: 0.2 },
    { at: 3, kind: "text", text: "护照、驾照这类，**按国家**看能用哪种", typing: 0.2 },
    { at: 4, kind: "text", text: "**不能过期**，名字和生日看得清", typing: 0.2 },
    { at: 5, kind: "text", text: "名字要是**拉丁字母**（比如拼音）", typing: 0.2 },

    { at: 6, clear: true, kind: "text", text: "② 一个**收款银行账户**", typing: 0.2 },
    { at: 7, kind: "big", label: "证件名字 = 账户名", text: "必须一致", tone: "coral", sub: "官方原文：name must match", typing: 0.2 },
    { at: 8, kind: "text", text: "③ **纳税人地址**，名字也要对得上", typing: 0.2 },

    { at: 9, clear: true, kind: "text", text: "最后**拍自拍**，和证件照比对 🤳", typing: 0.2 },
    { at: 10, kind: "text", text: "摘掉**眼镜和帽子**，脸要清楚", typing: 0.2 },
    { at: 11, kind: "text", text: "大多数店还要绑一张**借记卡或信用卡**", typing: 0.25 },

    { at: 12, clear: true, kind: "todo", title: "提交前先做 3 件事",
      items: [{ at: 13, text: "证件、银行账户、纳税人地址，名字核对一遍" }, { at: 14, text: "证件没过期，照片清楚" }, { at: 15, text: "备好一张借记卡或信用卡" }] },
    { at: 15.6, kind: "note", text: "能用的证件种类按国家不同，以验证页面列出的为准。" },

    { at: 16, clear: true, kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TonyBook跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
