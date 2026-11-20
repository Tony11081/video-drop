/* NO.031 · A · 客户在个性化里写了一大段话，我们怎么处理（2026-11-20），tts b5b49002dbb5（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店读个性化的三步——找名字（逐字母照抄，大小写不改）→ 看编号（有的款名字后面写编号 = 名牌颜色，
   没写用主图颜色）→ 拿不准就停（两个名字或看不懂先不出图，标「有问题」写原因，问清楚再出图）。
   依据运营台定制说明通用规则 1 / 4 和 P0004 名牌编号说明。无官方数字，不报改单率、成本；
   不碰 Etsy-Tony EP.026 定制选项（字段数、加价）；和 ep015（名字图四步）的区别是只讲「从一段话里读出名字」。
   素材（Pexels 免费商用）：首页 4041801 女生托腮思考｜CH.01 5524251 老人拿放大镜读书｜CH.02 4973185 手拿色卡｜CH.03 8632782 女生对着电脑扶额｜
   CH.04 6781972 笔记本打字（ep023 用在 CH.05）｜CH.05 5900627 手写清单｜CH.06 6278834 手拿手机。
   成片 output 78db833819d3（48.6 秒）。封面：Codex IMG-20261120-001 做完配音和素材时还是待处理，没用封面。
   配音 verify 只标了第 2 句（Etsy→AdC、「店」听写成「电」），属读音差异，没重来。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "024", date: "11.20",
  // cover: "assets/ep024-cover.png",
  topic: "客户在个性化里写了一大段话，我们怎么处理",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "b5b49002dbb5", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.838, cap: "个性化里写了一大段话|名字拿不准，我们先问，不猜", keys: ["先问，不猜"] },
    { dur: 2.187, cap: "我们Etsy定制店|按三步来读", keys: ["三步"] },
    { dur: 1.307, cap: "第一步|找名字", keys: ["找名字"] },
    { dur: 2.633, cap: "从一大段话里|先找出要刻的那个名字", keys: ["要刻的"] },
    { dur: 2.623, cap: "照原样逐个字母抄|大小写也不改", keys: ["大小写"] },
    { dur: 1.427, cap: "第二步|看编号", keys: ["看编号"] },
    { dur: 3.218, cap: "有的款，名字后面写个编号|就是名牌颜色", keys: ["名牌颜色"] },
    { dur: 2.111, cap: "没写编号|就用主图上的颜色", keys: ["主图"] },
    { dur: 1.776, cap: "第三步|拿不准就停", keys: ["就停"] },
    { dur: 2.542, cap: "写了两个名字，或者看不懂|先不出图", keys: ["先不出图"] },
    { dur: 2.379, cap: "这一单标成有问题|写清原因", keys: ["有问题"] },
    { dur: 1.55, cap: "问清楚了|再照着出图", keys: ["问清楚"] },
    { dur: 2.054, cap: "读个性化之前|先做三件事", keys: ["三件事"] },
    { dur: 2.04, cap: "第一，名字一个字母都不改", keys: ["都不改"] },
    { dur: 2.909, cap: "第二，编号和颜色对上再出图", keys: ["对上"] },
    { dur: 2.143, cap: "第三，拿不准就标有问题", keys: ["标有问题"] },
    { dur: 3.113, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.939, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "个性化写了一大段|**名字是哪个**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先问，不猜", tone: "coral", sub: "找名字 · 看编号 · 拿不准就停" },

    { at: 2, clear: true, chapter: "找名字", kind: "text", text: "第一步：**找名字**", typing: 0.2 },
    { at: 3, kind: "text", text: "一大段里找出**要刻的那个名字**", typing: 0.2 },
    { at: 4, kind: "text", text: "逐个字母照抄，**大小写不改**", typing: 0.2 },

    { at: 5, clear: true, chapter: "看编号", kind: "text", text: "第二步：**看编号**", typing: 0.2 },
    { at: 6, kind: "text", text: "名字后面的编号 = **名牌颜色**", typing: 0.2 },
    { at: 7, kind: "text", text: "没写编号，用**主图上的颜色**", typing: 0.2 },

    { at: 8, clear: true, chapter: "拿不准", kind: "big", kicker: "Stop", label: "第三步", text: "拿不准就停", tone: "coral", sub: "两个名字 · 看不懂 → 先不出图" },

    { at: 10, clear: true, chapter: "标有问题", kind: "text", text: "这一单标成**有问题**", typing: 0.2 },
    { at: 10.6, kind: "text", text: "写清原因，**问清楚再出图**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "名字一个字母都不改" }, { at: 14, text: "编号和颜色对上再出图" }, { at: 15, text: "拿不准就标有问题" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含改单率、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
