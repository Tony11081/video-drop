/* NO.027 · A · 定制单客户改名字，做到哪一步还能改（2026-11-14），tts c03f10b619e6（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店处理客户改名字的流程（按节点：没出名字图 → 照私信逐字抄新名字出图；图出了没切 → 旧图作废、重出、重核拼写大小写；
   已切好 → 先停、不打包，重做和回复客户交给老板定）。依据运营台定制说明通用规则（名字逐字照抄）和 ep011 老板拍板客户的事。
   不报改单率、成本、单量，不提客户和合作方；不讲 Etsy 取消订单 / 定制选项规则（避开 Etsy-Tony KP.009、EP.026）。
   素材（Pexels 免费商用）：首页 6170316 仓库货架上的包裹｜CH.01 4671883 手指点手机｜CH.02 7504606 办公室电脑操作｜CH.03 30456102 数控激光切割机（ep019 用在 CH.02）｜CH.04 5217304 木工作坊老师傅｜CH.05 3253209 女生在电脑前看手机。
   成片 output c02338a4d3d8（46.7 秒）。封面：Codex IMG-20261114-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "020", date: "11.14",
  // cover: "assets/ep020-cover.png",
  topic: "定制单客户改名字，做到哪一步还能改",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "c03f10b619e6", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.434, cap: "客户要改名字|先看这一单做到哪一步", keys: ["做到哪一步"] },
    { dur: 2.246, cap: "我们Etsy定制店|按三个节点处理", keys: ["三个节点"] },
    { dur: 2.058, cap: "第一个节点|名字图还没出", keys: ["还没出"] },
    { dur: 1.626, cap: "直接按新名字出图就行", keys: ["新名字"] },
    { dur: 3.235, cap: "新名字照客户私信里写的|一个字母一个字母照抄", keys: ["照抄"] },
    { dur: 2.346, cap: "第二个节点|图出了，还没切", keys: ["还没切"] },
    { dur: 2.624, cap: "旧图作废|按新名字重出一张", keys: ["旧图作废"] },
    { dur: 2.438, cap: "拼写和大小写重新核一遍|再派去切", keys: ["重新核一遍"] },
    { dur: 2.182, cap: "第三个节点|木牌已经切好了", keys: ["切好了"] },
    { dur: 1.879, cap: "先把这一单停下|不往下打包", keys: ["停下"] },
    { dur: 2.507, cap: "要不要重做、怎么回客户|交给老板定", keys: ["交给老板定"] },
    { dur: 2.194, cap: "遇到客户改名字|先做三件事", keys: ["三件事"] },
    { dur: 2.128, cap: "第一，先查这一单做到哪一步", keys: ["做到哪一步"] },
    { dur: 2.782, cap: "第二，新名字照私信逐字抄", keys: ["逐字抄"] },
    { dur: 2.316, cap: "第三，切过的单交给老板定", keys: ["交给老板"] },
    { dur: 3.185, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.889, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "客户要改名字|**还来得及吗**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先看做到哪步", tone: "coral", sub: "没出图 · 没切 · 已切好" },

    { at: 2, clear: true, chapter: "没出图", kind: "text", text: "节点一：**名字图还没出**", typing: 0.2 },
    { at: 3, kind: "text", text: "直接按**新名字**出图", typing: 0.2 },
    { at: 4, kind: "text", text: "照私信**逐个字母照抄**", typing: 0.2 },

    { at: 5, clear: true, chapter: "出图没切", kind: "text", text: "节点二：**图出了，还没切**", typing: 0.2 },
    { at: 6, kind: "text", text: "**旧图作废**，重出一张", typing: 0.2 },
    { at: 7, kind: "text", text: "拼写、大小写**再核一遍**", typing: 0.2 },

    { at: 8, clear: true, chapter: "已切好", kind: "text", text: "节点三：**木牌已经切好**", typing: 0.2 },
    { at: 9, kind: "text", text: "先停下，**不往下打包**", typing: 0.2 },
    { at: 10, kind: "text", text: "重做、回客户：**老板定**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "先查做到哪一步" }, { at: 13, text: "新名字照私信逐字抄" }, { at: 14, text: "切过的单交老板定" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，不含改单率、成本和单量。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
