/* NO.029 · A · 圣诞袜上的名字，木头和亚克力怎么选（2026-11-18），tts 92ac43e0042b（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店三类圣诞袜的名字材料怎么定、颜色从哪读（印花袜身 → 木字母、木本色不分颜色、贴丝绒袜口；
   纯色丝绒袜 → 名牌 20 个选项、1 个木质其余亚克力、颜色看订单上的名牌编号；客户在名字后写编号 → 写几号用几号、没写用主图颜色；
   名字图一律黑字白底、颜色交给材料）。依据运营台定制说明（P0001 / P0003 / P0004 和通用规则第 3 条）。
   不报材料价、成本、单量，不提客户和合作方；不讲 Etsy 定制选项规则（避开 Etsy-Tony EP.026），没讲海关材料申报（避开 Etsy-Tony EP.016）。
   素材（Pexels 免费商用）：首页 6305999 壁炉圣诞袜｜CH.01 5765495 红色圣诞袜｜CH.02 7480059 雕刻机切木板｜CH.03 6781972 女生笔记本打字｜
   CH.04 30456102 激光切割机｜CH.05 32082737 手写清单｜CH.06 6214598 手机打字。
   成片 output f2f5aac68183（51.2 秒）。封面：Codex IMG-20261118-001 做完配音和素材时还是待处理，没用封面。
   配音 verify 标了第 1、2 句（「袜」听写成「瓦」、「亚克力」听写成「压颗粒」、Etsy→ATC），属读音差异，没重来。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "022", date: "11.18",
  // cover: "assets/ep022-cover.png",
  topic: "圣诞袜上的名字，木头和亚克力怎么选",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "92ac43e0042b", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.451, cap: "圣诞袜上的名字，木头还是亚克力|我们按款式定", keys: ["按款式定"] },
    { dur: 2.453, cap: "我们Etsy定制店的圣诞袜|分三种情况", keys: ["三种情况"] },
    { dur: 1.72, cap: "第一种|印花袜身", keys: ["印花袜身"] },
    { dur: 2.726, cap: "名字只用木字母|木本色，不分颜色", keys: ["木字母"] },
    { dur: 1.882, cap: "切好以后|贴在丝绒袜口上", keys: ["袜口"] },
    { dur: 1.804, cap: "第二种|纯色丝绒袜", keys: ["纯色丝绒袜"] },
    { dur: 3.629, cap: "名牌有二十个选项|一个是木质，其余都是亚克力", keys: ["其余都是亚克力"] },
    { dur: 1.892, cap: "颜色看订单上的|名牌编号", keys: ["名牌编号"] },
    { dur: 2.534, cap: "第三种|客户在名字后面写编号", keys: ["写编号"] },
    { dur: 3.111, cap: "写几号就用几号|没写就用主图上的颜色", keys: ["主图上的颜色"] },
    { dur: 3.143, cap: "不管木头还是亚克力|名字图都是黑字白底", keys: ["黑字白底"] },
    { dur: 2.096, cap: "颜色交给材料|不画进图里", keys: ["交给材料"] },
    { dur: 2.111, cap: "上圣诞袜之前|先做三件事", keys: ["三件事"] },
    { dur: 2.152, cap: "第一，按袜子款式定材料", keys: ["定材料"] },
    { dur: 2.408, cap: "第二，名牌颜色用编号来对", keys: ["编号"] },
    { dur: 2.193, cap: "第三，名字图只出黑白", keys: ["只出黑白"] },
    { dur: 3.165, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.879, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "圣诞袜上的名字|**木头还是亚克力**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "按款式定", tone: "coral", sub: "印花袜 · 丝绒袜 · 客户写编号" },

    { at: 2, clear: true, chapter: "印花袜", kind: "text", text: "第一种：**印花袜身**", typing: 0.2 },
    { at: 3, kind: "text", text: "只用**木字母**，木本色不分颜色", typing: 0.2 },
    { at: 4, kind: "text", text: "切好贴在**丝绒袜口**上", typing: 0.2 },

    { at: 5, clear: true, chapter: "丝绒袜", kind: "text", text: "第二种：**纯色丝绒袜**", typing: 0.2 },
    { at: 6, kind: "big", kicker: "Options", label: "名牌选项", text: "20 个", tone: "coral", sub: "1 个木质 · 其余亚克力" },
    { at: 7, kind: "text", text: "颜色看订单上的**名牌编号**", typing: 0.2 },

    { at: 8, clear: true, chapter: "写编号", kind: "text", text: "第三种：客户**在名字后写编号**", typing: 0.2 },
    { at: 9, kind: "text", text: "写几号用几号，**没写用主图颜色**", typing: 0.2 },

    { at: 10, clear: true, chapter: "名字图", kind: "text", text: "名字图一律**黑字白底**", typing: 0.2 },
    { at: 11, kind: "text", text: "颜色**交给材料**，不画进图里", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "按袜子款式定材料" }, { at: 14, text: "名牌颜色用编号来对" }, { at: 15, text: "名字图只出黑白" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含材料价、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
