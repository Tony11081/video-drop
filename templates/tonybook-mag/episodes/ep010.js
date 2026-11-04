/* NO.012 · A · Etsy 主图第一张怎么做（2026-11-04），tts 8e161819d4b2（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：官方要求只用 Etsy 帮助中心 Requirements and Best Practices for Images in Your Etsy Shop 原文（2026-11-04 查阅，页面未标更新日期）：
   首图长宽至少 635 像素否则搜索靠后；建议长宽 2000 像素以上；首图横图或方图；留边可裁成方/竖/横缩略图；超过 1MB 可能传不完；不支持透明 PNG。
   拍法是我们自己给卖家做产品图的方法，不报成本和数据。没用 Etsy-Tony EP.005 讲过的「10 张图 / 视频」转化数字。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "010", date: "11.04",
  // cover: "assets/ep010-cover.png",
  topic: "Etsy 主图第一张怎么做",
  source: "Etsy 帮助中心 · Requirements and Best Practices for Images（2026-11-04 查阅）",
  tts: { id: "8e161819d4b2", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 4.33, cap: "第一张主图，长宽不到六百三十五像素|在搜索里会往后排", keys: ["往后排"] },
    { dur: 1.876, cap: "这是Etsy帮助中心写的规矩", keys: ["帮助中心"] },
    { dur: 3.091, cap: "官方建议，长和宽|都做到两千像素以上", keys: ["两千像素"] },
    { dur: 1.97, cap: "第一张用横图或者方图", keys: ["横图"] },
    { dur: 3.487, cap: "四周要留白边|方的、竖的、横的都能裁", keys: ["留白边"] },
    { dur: 2.548, cap: "文件别超过一兆|大了可能传不上去", keys: ["一兆"] },
    { dur: 2.073, cap: "透明背景的PNG，不支持", keys: ["透明背景"] },
    { dur: 1.98, cap: "我们给卖家做主图|先定拍什么", keys: ["拍什么"] },
    { dur: 2.397, cap: "定制木牌|就拍刻好名字的成品", keys: ["成品"] },
    { dur: 2.104, cap: "产品放正中间|占画面一大半", keys: ["正中间"] },
    { dur: 2.459, cap: "再缩成小图看一眼|看不清就重拍", keys: ["重拍"] },
    { dur: 1.502, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.502, cap: "第一，长和宽|都做到两千像素", keys: ["两千像素"] },
    { dur: 2.869, cap: "第二，横图或方图|四周留边", keys: ["四周留边"] },
    { dur: 2.32, cap: "第三，缩小了|也能一眼看懂", keys: ["一眼看懂"] },
    { dur: 3.093, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.989, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "Etsy 第一张主图|**多大**才不吃亏？" },
    { at: 0, instant: true, kind: "big", kicker: "Threshold", label: "官方 · 长和宽都要", text: "635 像素", tone: "coral", sub: "不到就在搜索里**往后排**" },

    { at: 1, clear: true, chapter: "官方原文", kind: "text", text: "Etsy **帮助中心**写的规矩", typing: 0.2 },
    { at: 2, kind: "text", text: "建议长宽都在 **2000 像素**以上", typing: 0.2 },
    { at: 3, kind: "text", text: "第一张用**横图或方图**", typing: 0.2 },

    { at: 4, clear: true, chapter: "留边裁切", kind: "text", text: "四周**留白边**，方竖横都能裁", typing: 0.2 },
    { at: 5, kind: "text", text: "文件别超 **1MB**，大了难上传", typing: 0.2 },
    { at: 6, kind: "text", text: "**透明背景** PNG 不支持", typing: 0.2 },

    { at: 7, clear: true, chapter: "我们怎么拍", kind: "text", text: "给卖家做主图，先定**拍什么**", typing: 0.2 },
    { at: 8, kind: "text", text: "定制木牌，拍**刻好名字**的成品", typing: 0.2 },
    { at: 9, kind: "text", text: "产品放**正中间**，占一大半", typing: 0.2 },
    { at: 10, kind: "text", text: "缩成小图看，**看不清就重拍**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "长和宽都做到 2000 像素" }, { at: 13, text: "横图或方图，四周留边" }, { at: 14, text: "缩小了也能一眼看懂" }] },
    { at: 14.6, kind: "note", text: "要求以 Etsy 帮助中心图片要求页为准（2026-11-04 查阅）；拍法是我们自己的做法。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
