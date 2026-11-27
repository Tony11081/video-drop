/* NO.038 · A · 同一款化妆包三个尺码，名字怎么放（2026-11-27），tts 2e6166eb15d8（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店斑马纹化妆包（S / M / L）的亚克力名字怎么放——字高按尺码固定先照这个高度排；
   名字超宽不挤字距、不压扁字母，整个名字等比缩小放进框里；缩小后最细一笔低于最小笔画先标「有问题」；
   名字图永远黑白，颜色看 SKU 最后一段决定切哪种亚克力。
   依据运营台定制说明 P0002（三个尺码、字高固定超宽时整体缩小、最小笔画、颜色在 SKU 最后一段）和通用规则 2 / 3 / 4。
   无官方数字，不报尺寸数值、材料价和成本；没碰 Etsy-Tony EP.026 定制选项；没重复 ep012 的字数上限。
   配音：verify 开的第一次 tts 卡住 10 分钟以上，改 verify=false 重出（tts 2e6166eb15d8），每句时长正常，无漏句。
   素材（Pexels 免费商用，每章先切段再合成）：首页 7291773 化妆品俯拍平铺｜CH.01 7033925 卷尺特写｜CH.02 7204567 笔记本电脑做设计｜
   CH.03 34716349 激光切割机｜CH.04 32082737 手写勾清单｜CH.05 4622325 桌上纸样、尺子和剪刀。（首页原用 5210526，可读到化妆品品牌字，换掉）
   成片 output 5d998052d549（51.6 秒）。封面：Codex IMG-20261127-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "031", date: "11.27",
  // cover: "assets/ep031-cover.png",
  topic: "同一款化妆包三个尺码，名字怎么放",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "2e6166eb15d8", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.203, cap: "名字太长放不下|我们整体缩小，不挤字", keys: ["整体缩小"] },
    { dur: 2.646, cap: "同一款化妆包|有大中小三个尺码", keys: ["三个尺码"] },
    { dur: 2.368, cap: "每个尺码|放名字的位置都是定好的", keys: ["定好的"] },
    { dur: 2.629, cap: "字高按尺码固定|先照这个高度排", keys: ["字高"] },
    { dur: 2.082, cap: "名字一长|宽度就超出来了", keys: ["超出来"] },
    { dur: 2.072, cap: "我们不挤字距|也不把字母压扁", keys: ["不挤字距"] },
    { dur: 2.517, cap: "而是整个名字等比缩小|放进框里", keys: ["等比缩小"] },
    { dur: 2.107, cap: "缩小以后|再看最细的那一笔", keys: ["最细"] },
    { dur: 3.202, cap: "细过最小笔画，切出来会断|先标有问题", keys: ["有问题"] },
    { dur: 2.903, cap: "颜色不画进图里|名字图永远是黑白的", keys: ["黑白"] },
    { dur: 3.694, cap: "颜色看SKU最后一段|决定切哪种亚克力", keys: ["SKU最后一段"] },
    { dur: 2.513, cap: "三个尺码出名字图|先做三件事", keys: ["三件事"] },
    { dur: 2.116, cap: "第一，字高按尺码固定", keys: ["字高"] },
    { dur: 2.758, cap: "第二，超宽就整体缩小|不挤字", keys: ["整体缩小"] },
    { dur: 3.01, cap: "第三，缩小后笔画太细|先标有问题", keys: ["有问题"] },
    { dur: 3.232, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.885, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "名字太长|化妆包**放不下**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "整体缩小", tone: "coral", sub: "不挤字距，也不压扁字母" },

    { at: 1, clear: true, chapter: "三个尺码", kind: "text", text: "同一款，**大中小三个尺码**", typing: 0.2 },
    { at: 2, kind: "text", text: "每个尺码，名字位置**都定好了**", typing: 0.2 },
    { at: 3, kind: "big", kicker: "Answer", label: "先定", text: "字高固定", tone: "coral", sub: "按尺码定高度，先照这个高度排" },

    { at: 4, clear: true, chapter: "整体缩小", kind: "text", text: "名字一长，**宽度超出**", typing: 0.2 },
    { at: 5, kind: "text", text: "不挤字距，**不压扁字母**", typing: 0.2 },
    { at: 6, kind: "big", kicker: "Answer", label: "超宽时", text: "等比缩小", tone: "coral", sub: "整个名字一起缩，放进框里" },

    { at: 7, clear: true, chapter: "笔画颜色", kind: "text", text: "缩小后，看**最细那一笔**", typing: 0.2 },
    { at: 8, kind: "big", kicker: "Threshold", label: "细过最小笔画", text: "先标有问题", tone: "coral", sub: "切出来会断，问清楚再做" },
    { at: 9, kind: "text", text: "名字图永远**黑白**", typing: 0.2 },
    { at: 10, kind: "text", text: "颜色看 **SKU 最后一段**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "三个尺码出图先做 3 件事",
      items: [{ at: 12, text: "字高按尺码固定" }, { at: 13, text: "超宽整体缩小，不挤字" }, { at: 14, text: "笔画太细，先标有问题" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含尺寸数值和成本。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
