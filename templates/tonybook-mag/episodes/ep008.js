/* NO.008 · A · 有香港身份，开 Etsy 店要准备什么（2026-11-02，topics.md 里 Tony 11-02 插队的 NO.021 香港题），tts b43bd4095902（ElevenLabs v4 · will · tts 内 1.3 倍）
   核实（2026-11-02 查阅，Etsy 帮助中心，页面均未标更新日期）：
   Countries Eligible for Etsy Payments（香港在列、无星号；「At this time, new shops cannot open in China.」；须用店铺所在国家/地区的银行账户）；
   How to Open an Etsy Shop（电脑上开店；绑银行账户收款 + 信用卡/借记卡交账单；政府证件照片 + 自拍，证件名与银行户名一致；必须开两步验证；一次性、不退的开店费）；
   How to Verify Your Seller Information for Etsy Payments（政府签发带照片证件）。
   A 类合作部分只讲方向，不报价格、不承诺收益。CTA 按 topics.md 换成「私信我『香港』」。
   成片 output 0f948975f445（49.96 秒）。素材（Pexels 免费商用）：首页 17397533 香港夜景｜CH.01 6613676 拿卡网购｜CH.02 6186640 写待办清单｜CH.03 12692099 看手机｜CH.04 7043686 刺绣车间｜CH.05 6214598 手机打字。封面：Codex IMG-20261102-001 未出图，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 1.6, footage: true,   // 配音已在 tts 里 1.3 倍（ElevenLabs will），画面按成片时间轴，背景素材在服务器上合成
  episode: "008", date: "11.02",
  // cover: "assets/ep008-cover.png",  // Codex 封面图到了再打开
  topic: "有香港身份，开 Etsy 店要准备什么",
  source: "Etsy 帮助中心 Countries Eligible for Etsy Payments / How to Open an Etsy Shop（2026-11-02 查阅，页面未标更新日期）",
  tts: { id: "b43bd4095902", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.636, cap: "内地现在新开不了Etsy店|香港可以", keys: ["香港可以"] },
    { dur: 3.153, cap: "Etsy官方写着|目前中国内地不能开新店", keys: ["不能开新店"] },
    { dur: 2.199, cap: "香港在Etsy Payments的|支持地区里", keys: ["支持地区"] },
    { dur: 1.358, cap: "开店先备齐四样", keys: ["四样"] },
    { dur: 2.295, cap: "一个Etsy账号|开店要用电脑", keys: ["电脑"] },
    { dur: 2.379, cap: "一个香港本地的银行账户|用来收款", keys: ["银行账户"] },
    { dur: 2.547, cap: "一张信用卡或借记卡|交平台费用", keys: ["信用卡"] },
    { dur: 2.95, cap: "一张政府签发的带照片证件|再加一张自拍", keys: ["自拍"] },
    { dur: 1.466, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.881, cap: "第一，证件上的名字|和银行户名要对上", keys: ["对上"] },
    { dur: 1.814, cap: "第二，开好两步验证", keys: ["两步验证"] },
    { dur: 2.471, cap: "第三，留好一笔|一次性的开店费", keys: ["开店费"] },
    { dur: 2.598, cap: "有身份的人|缺的往往是货和运营", keys: ["货和运营"] },
    { dur: 4.392, cap: "我们有自己的激光和刺绣生产|也有运营团队，在找香港合作店主", keys: ["香港合作店主"] },
    { dur: 3.294, cap: "只找本人愿意参与经营的店主|不做挂名，不刷单", keys: ["不做挂名"] },
    { dur: 3.548, cap: "有香港身份、想一起做的|私信我「香港」两个字", keys: ["香港"] },
    { dur: 3.879, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "有 **香港身份**|能开 Etsy 店吗？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "内地新开不了", text: "香港可以", tone: "coral", sub: "香港在 **Etsy Payments** 支持地区" },

    { at: 1, clear: true, chapter: "官方怎么说", kind: "text", text: "官方：中国内地**目前不能开新店**", typing: 0.2 },
    { at: 2, kind: "text", text: "香港在**支持地区**名单里", typing: 0.2 },
    { at: 2.4, kind: "note", text: "Etsy 帮助中心 Countries Eligible for Etsy Payments（2026-11-02 查阅）" },

    { at: 3, clear: true, chapter: "备齐四样", kind: "todo", title: "开店备齐 4 样",
      items: [{ at: 4, text: "Etsy 账号，开店用电脑" }, { at: 5, text: "香港本地银行账户，收款" }, { at: 6, text: "信用卡或借记卡，交费用" }, { at: 7, text: "带照片的政府证件 + 自拍" }] },

    { at: 8, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 9, text: "证件名和银行户名对上" }, { at: 10, text: "开好两步验证" }, { at: 11, text: "留好一次性开店费" }] },
    { at: 11.6, kind: "note", text: "以 Etsy 帮助中心 How to Open an Etsy Shop 为准（2026-11-02 查阅）" },

    { at: 12, clear: true, chapter: "我们在找人", kind: "text", text: "有身份，缺的往往是**货和运营**", typing: 0.2 },
    { at: 13, kind: "text", text: "我们自己做**激光、刺绣**", typing: 0.2 },
    { at: 13.4, kind: "text", text: "有运营团队，在找**香港店主**", typing: 0.2 },
    { at: 14, kind: "text", text: "只找本人参与经营的", typing: 0.2 },
    { at: 14.4, kind: "text", text: "**不挂名，不刷单**", typing: 0.2 },

    { at: 15, clear: true, chapter: "私信我", kind: "text", text: "有香港身份、想一起做？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "私信我「**香港**」两个字", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
