/* NO.036 · A · 圣诞旺季，定制单我们怎么排先后（2026-11-25），tts fd86a5c248aa（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店旺季排单的方法——每单从发货期限倒推做几天 = 最晚开工日，按最晚开工日排、不按下单先后；
   缺料的按到货天数再往前推出最晚下单日，来不及的先标出来交老板拍板。
   依据运营台排产规则（按订单发货期限、制作天数、到货天数倒推最晚时间，「来不及」的优先）。
   无官方数字，不报单量、产能和耗时；不讲 Etsy 发货日规则（避开 Etsy-Tony EP.020 旺季发货）。
   配音 verify 标出第 11 句「旺季」听写成「忘记」，同音，可接受。
   素材（Pexels 免费商用，每章先切段再合成）：首页 6063266 手扎圣诞花环｜CH.01 5408798 手翻台历｜
   CH.02 4294436 仓库货架｜CH.03 32082737 手写清单打勾（ep028 用在 CH.01）｜CH.04 5217304 木工台前做木件。
   成片 output fb1c2e2632be（45.5 秒）。封面：Codex IMG-20261125-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "029", date: "11.25",
  // cover: "assets/ep029-cover.png",
  topic: "圣诞旺季，定制单我们怎么排先后",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "fd86a5c248aa", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.506, cap: "圣诞单一多|我们不按下单顺序做", keys: ["不按下单顺序"] },
    { dur: 2.017, cap: "按最晚开工那一天|排先后", keys: ["最晚开工"] },
    { dur: 1.706, cap: "每一单|先看发货期限", keys: ["发货期限"] },
    { dur: 2.37, cap: "再往前倒推|这一单要做几天", keys: ["倒推"] },
    { dur: 2.095, cap: "推出来那天|就是最晚开工日", keys: ["最晚开工日"] },
    { dur: 2.192, cap: "最晚开工日越早|越先做", keys: ["越先做"] },
    { dur: 3.182, cap: "所以下单晚、但工序多的单|可能排在前面", keys: ["排在前面"] },
    { dur: 1.943, cap: "缺料的单|还要多算一步", keys: ["缺料"] },
    { dur: 2.361, cap: "料要几天到|就再往前推几天", keys: ["再往前推"] },
    { dur: 3.167, cap: "推出来已经来不及的|先标出来，交给老板拍板", keys: ["老板拍板"] },
    { dur: 1.9, cap: "旺季排单|先做三件事", keys: ["三件事"] },
    { dur: 2.482, cap: "第一，每一单算出最晚开工日", keys: ["最晚开工日"] },
    { dur: 2.767, cap: "第二，按这一天排|不按下单先后", keys: ["不按下单先后"] },
    { dur: 3.159, cap: "第三，缺料的倒推下单日|来不及先上报", keys: ["先上报"] },
    { dur: 3.151, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.943, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "圣诞单一多|先做**哪一单**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "倒推开工日", tone: "coral", sub: "按最晚开工那天排，不按下单先后" },

    { at: 2, clear: true, chapter: "倒推开工日", kind: "text", text: "每一单，先看**发货期限**", typing: 0.2 },
    { at: 3, kind: "text", text: "再往前倒推：**要做几天**", typing: 0.2 },
    { at: 4, kind: "big", kicker: "Answer", label: "推出来那天", text: "最晚开工日", tone: "coral", sub: "越早的越先做" },
    { at: 6, kind: "text", text: "下单晚、工序多的，**可能排前面**", typing: 0.2 },

    { at: 7, clear: true, chapter: "缺料的单", kind: "text", text: "缺料的单，**多算一步**", typing: 0.2 },
    { at: 8, kind: "text", text: "料要几天到，**再往前推几天**", typing: 0.2 },
    { at: 9, kind: "big", kicker: "Answer", label: "推出来来不及", text: "先上报", tone: "coral", sub: "标出来，交老板拍板" },

    { at: 10, clear: true, chapter: "先做三件事", kind: "todo", title: "旺季排单先做 3 件事",
      items: [{ at: 11, text: "每一单算出最晚开工日" }, { at: 12, text: "按这一天排，不按下单先后" }, { at: 13, text: "缺料的倒推下单日，来不及先上报" }] },
    { at: 13.6, kind: "note", text: "我们自己定制店的做法，不含单量和产能。" },

    { at: 14, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 14.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 15, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 15.5 },
  ],
};
