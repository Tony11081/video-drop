/* NO.017 · A · 一台激光机，能做哪些定制小件（2026-11-06），tts b1e0230d5455（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们自己 Etsy 定制店在切的三种名字件（木字母贴袜口、镜面亚克力名字贴化妆包、木/亚克力 3D 名牌）和名字图怎么出
   （黑字白底、颜色交给材料、字母连成一整块、最细笔画 1.5mm、字数上限 12、名字照抄），来源是运营台定制说明；
   不报机器价、成本、单量，不提客户和合作方；不讲 Etsy 规则，没碰 Etsy-Tony EP.023「激光木牌算不算自制」。
   素材（Pexels 免费商用）：首页 30456102 激光切割机｜CH.01 6305999 壁炉圣诞袜｜CH.02 7308098 首饰礼盒（5210526 亚克力收纳盒有可读品牌字，换掉）｜CH.03 7480059 雕刻机切木板｜CH.04 7873071 笔记本打字｜CH.05 32082737 手写清单｜CH.06 6214598 手机打字。
   封面：Codex IMG-20261106-001 未出图，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "012", date: "11.06",
  // cover: "assets/ep012-cover.png",
  topic: "一台激光机，能做哪些定制小件",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "b1e0230d5455", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.507, cap: "我们一台激光机|切出三种定制名字件", keys: ["三种"] },
    { dur: 2.730, cap: "都是Etsy定制店里|客户写名字的那一块", keys: ["名字"] },
    { dur: 1.291, cap: "第一种，木字母", keys: ["木字母"] },
    { dur: 2.188, cap: "切好木板|贴在圣诞袜的袜口上", keys: ["袜口"] },
    { dur: 2.222, cap: "第二种，镜面亚克力名字", keys: ["镜面亚克力"] },
    { dur: 3.185, cap: "金色、银色、玫瑰金|贴在化妆包正面", keys: ["化妆包"] },
    { dur: 3.346, cap: "第三种，3D名牌|木头和亚克力都能做", keys: ["3D名牌"] },
    { dur: 2.084, cap: "三种用的|都是同一张名字图", keys: ["同一张"] },
    { dur: 2.108, cap: "黑字白底|颜色交给材料", keys: ["黑字白底"] },
    { dur: 2.752, cap: "字母要连成一整块|切出来才是一片", keys: ["一整块"] },
    { dur: 2.893, cap: "笔画太细会断|我们定最细1.5毫米", keys: ["1.5毫米"] },
    { dur: 2.297, cap: "想用激光机做定制|先做三件事", keys: ["三件事"] },
    { dur: 2.845, cap: "第一，名字照客户写的抄|一个字母都不改", keys: ["不改"] },
    { dur: 3.041, cap: "第二，每个款定好字数上限|我们是12个", keys: ["字数上限"] },
    { dur: 2.844, cap: "第三，最细的笔画|先切一块试试", keys: ["试试"] },
    { dur: 3.174, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.853, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "一台激光机|能切出**哪些**定制件？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们在切的", text: "3 种", tone: "coral", sub: "都是客户**写名字**的那一块" },

    { at: 2, clear: true, chapter: "木字母", kind: "text", text: "第一种：**木字母**", typing: 0.2 },
    { at: 3, kind: "text", text: "切好木板，贴在**圣诞袜袜口**", typing: 0.2 },

    { at: 4, clear: true, chapter: "镜面亚克力", kind: "text", text: "第二种：**镜面亚克力**名字", typing: 0.2 },
    { at: 5, kind: "text", text: "金 · 银 · 玫瑰金，贴**化妆包**", typing: 0.2 },

    { at: 6, clear: true, chapter: "3D 名牌", kind: "text", text: "第三种：**3D 名牌**", typing: 0.2 },
    { at: 6.5, kind: "text", text: "**木头**和**亚克力**都能做", typing: 0.2 },

    { at: 7, clear: true, chapter: "名字图", kind: "text", text: "三种都用**同一张名字图**", typing: 0.2 },
    { at: 8, kind: "text", text: "**黑字白底**，颜色交给材料", typing: 0.2 },
    { at: 9, kind: "text", text: "字母连成**一整块**，切出一片", typing: 0.2 },
    { at: 10, kind: "text", text: "最细笔画 **1.5 毫米**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "名字照抄，一个字母不改" }, { at: 13, text: "每个款定好字数上限" }, { at: 14, text: "最细笔画先试切一块" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含机器价、成本和单量。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
