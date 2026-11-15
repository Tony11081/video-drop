/* NO.028 · A · 一款新定制品，上架前我们先打几块样（2026-11-15），tts 4e8ab199784b（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店上新款前的打样流程（出几张长短名字图 → 上激光机试切看细笔画断不断、边焦不焦 → 贴到产品上拍照看大小位置 →
   按最长能放下的定字数上限，超上限的单先标有问题再问客户）。依据 topics.md NO.028 流程和运营台定制说明通用规则（有问题先标再问）。
   不报打样成本、耗时、单量，不提客户和合作方；不写具体字数（没重复 ep012 的 12 字符 / 1.5mm）；不讲 Etsy 定制选项规则（避开 Etsy-Tony EP.026），
   不讲产品图要求（避开 Etsy-Tony KP.004 / KP.005）。
   素材（Pexels 免费商用）：首页 5481308 木工作坊｜CH.01 7204567 女生电脑做图｜CH.02 34716349 激光切割机｜CH.03 6877260 手机拍照｜
   CH.04 5973230 木工检查木料｜CH.05 7504609 男生电脑操作｜CH.06 6278834 手里拿着手机。
   成片 output 33d019928967（47.3 秒）。封面：Codex IMG-20261115-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "021", date: "11.15",
  // cover: "assets/ep021-cover.png",
  topic: "一款新定制品，上架前我们先打几块样",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "4e8ab199784b", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.636, cap: "新款不打样就上架|第一单就可能返工", keys: ["返工"] },
    { dur: 2.61, cap: "我们Etsy定制店上新款|先走四步打样", keys: ["四步打样"] },
    { dur: 1.846, cap: "第一步|先出几张名字图", keys: ["名字图"] },
    { dur: 2.238, cap: "长名字、短名字|各挑几个来出", keys: ["长名字、短名字"] },
    { dur: 2.003, cap: "第二步|上激光机试切", keys: ["试切"] },
    { dur: 2.567, cap: "看细的笔画会不会断|边会不会焦", keys: ["会不会断"] },
    { dur: 2.904, cap: "第三步|把切好的名字贴到产品上拍照", keys: ["贴到产品上"] },
    { dur: 2.305, cap: "看大小和位置|放上去合不合适", keys: ["大小和位置"] },
    { dur: 1.795, cap: "第四步|定字数上限", keys: ["字数上限"] },
    { dur: 2.478, cap: "最长能放下几个字母|就定成上限", keys: ["最长"] },
    { dur: 3.131, cap: "超过上限的单|先标有问题，再问客户", keys: ["先标有问题"] },
    { dur: 2.015, cap: "上新款之前|先做三件事", keys: ["三件事"] },
    { dur: 2.298, cap: "第一，长名字短名字都试切", keys: ["都试切"] },
    { dur: 2.075, cap: "第二，贴到产品上拍照看", keys: ["拍照看"] },
    { dur: 2.636, cap: "第三，按最长那块定字数上限", keys: ["最长那块"] },
    { dur: 3.127, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.968, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "新款不打样就上架|**会怎样**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先打几块样", tone: "coral", sub: "出图 · 试切 · 上身拍照 · 定字数" },

    { at: 2, clear: true, chapter: "出名字图", kind: "text", text: "第一步：**先出几张名字图**", typing: 0.2 },
    { at: 3, kind: "text", text: "**长名字、短名字**各挑几个", typing: 0.2 },

    { at: 4, clear: true, chapter: "试切", kind: "text", text: "第二步：**上激光机试切**", typing: 0.2 },
    { at: 5, kind: "text", text: "细笔画**断不断**，边**焦不焦**", typing: 0.2 },

    { at: 6, clear: true, chapter: "上身拍照", kind: "text", text: "第三步：**贴到产品上拍照**", typing: 0.2 },
    { at: 7, kind: "text", text: "看**大小和位置**合不合适", typing: 0.2 },

    { at: 8, clear: true, chapter: "定字数", kind: "text", text: "第四步：**定字数上限**", typing: 0.2 },
    { at: 9, kind: "text", text: "**最长能放下**几个字母就定成上限", typing: 0.2 },
    { at: 10, kind: "text", text: "超上限的单：**先标有问题再问**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "长短名字都试切" }, { at: 13, text: "贴到产品上拍照看" }, { at: 14, text: "按最长那块定字数上限" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含打样成本、耗时和单量。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
