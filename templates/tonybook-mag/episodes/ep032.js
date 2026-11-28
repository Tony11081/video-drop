/* NO.039 · A · 新款物料清单没填尺寸，我们为什么先不做（2026-11-28），tts b42dddf5b30f（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店新款开做前的顺序——物料清单先拆零件、写清每个零件走哪种工艺用什么材料；
   要刻名字的零件按尺码填尺寸；尺寸空着名字图不知道排多大，不凭感觉先出一版；尺寸补齐才出第一张名字图；
   出图后贴到产品上拍照对大小和位置，对不上回去改物料清单，不只改这一张图。
   依据运营台物料清单（每个款式由哪些零件组成、每个零件走哪种工艺、用什么物料、按尺码多大）。
   无官方数字，不报尺寸数值、成本和采购价；没碰 Etsy-Tony 政策速递；和 ep021 打样的区别是只讲物料清单尺寸没填先不出图。
   配音：verify 标了第 9 句（听写成「除了图也不算晚，要拿食物对一下」），属读音同音差异，试听无漏句，未重出。
   素材（Pexels 免费商用，每章先切段再合成）：首页 7484777 工作台上画图纸、木尺｜CH.01 12692039 笔记本电脑打字｜CH.02 7123283 卷尺放在蓝桌上｜
   CH.03 7793363 给产品拍照｜CH.04 9616096 手绘图纸特写｜CH.05 4872898 笔记本电脑打字。
   成片 output 0b9a59736842（49.6 秒）。封面：Codex IMG-20261128-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "032", date: "11.28",
  // cover: "assets/ep032-cover.png",
  topic: "新款物料清单没填尺寸，我们为什么先不做",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "b42dddf5b30f", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.522, cap: "尺寸没定|生产文件我们一张都不出", keys: ["一张都不出"] },
    { dur: 2.771, cap: "一款新定制品|先在物料清单里拆零件", keys: ["物料清单"] },
    { dur: 2.874, cap: "每个零件写清|走哪种工艺、用什么材料", keys: ["工艺"] },
    { dur: 2.716, cap: "要刻名字的零件|还要按尺码填尺寸", keys: ["按尺码填尺寸"] },
    { dur: 2.472, cap: "尺寸空着|名字图就不知道排多大", keys: ["排多大"] },
    { dur: 1.767, cap: "我们不凭感觉|先出一版试试", keys: ["不凭感觉"] },
    { dur: 2.668, cap: "切大了放不进|切小了又显得空", keys: ["放不进"] },
    { dur: 2.36, cap: "尺寸补齐以后|才出第一张名字图", keys: ["尺寸补齐"] },
    { dur: 2.363, cap: "出了图也不算完|要拿实物对一下", keys: ["实物"] },
    { dur: 2.701, cap: "贴到产品上拍照|看大小和位置对不对", keys: ["大小和位置"] },
    { dur: 2.889, cap: "对不上就回去改物料清单|不只改这一张图", keys: ["改物料清单"] },
    { dur: 2.209, cap: "新款开做之前|先做三件事", keys: ["三件事"] },
    { dur: 2.413, cap: "第一，零件和工艺先拆清楚", keys: ["零件和工艺"] },
    { dur: 2.252, cap: "第二，每个尺码的尺寸填齐", keys: ["尺寸填齐"] },
    { dur: 2.722, cap: "第三，出图以后|对着实拍再确认", keys: ["实拍"] },
    { dur: 3.256, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.952, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "新款尺寸没填|能**先做**吗？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先不出图", tone: "coral", sub: "尺寸没定，生产文件一张都不出" },

    { at: 1, clear: true, chapter: "拆零件", kind: "text", text: "新款先在**物料清单**拆零件", typing: 0.2 },
    { at: 2, kind: "text", text: "每个零件：**工艺 + 材料**", typing: 0.2 },
    { at: 3, kind: "big", kicker: "Answer", label: "刻名字的零件", text: "按尺码填尺寸", tone: "coral", sub: "大中小各填一份" },

    { at: 4, clear: true, chapter: "尺寸空着", kind: "text", text: "尺寸空着，名字图**排多大？**", typing: 0.2 },
    { at: 5, kind: "text", text: "不凭感觉**先出一版**", typing: 0.2 },
    { at: 6, kind: "big", kicker: "Example", label: "凭感觉出图", text: "大了放不进", tone: "coral", sub: "小了又显得空" },

    { at: 7, clear: true, chapter: "对实物", kind: "text", text: "尺寸补齐，**才出第一张图**", typing: 0.2 },
    { at: 8, kind: "text", text: "出了图，还要**拿实物对**", typing: 0.2 },
    { at: 9, kind: "text", text: "贴到产品上拍照，看**大小和位置**", typing: 0.2 },
    { at: 10, kind: "big", kicker: "Answer", label: "对不上", text: "改物料清单", tone: "coral", sub: "不只改这一张图" },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "新款开做前先做 3 件事",
      items: [{ at: 12, text: "零件和工艺先拆清楚" }, { at: 13, text: "每个尺码的尺寸填齐" }, { at: 14, text: "出图后对着实拍确认" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含尺寸数值和成本。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
