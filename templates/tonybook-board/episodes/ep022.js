/* 图解工作台 样片：NO.029 · A · 圣诞袜上的名字，木头和亚克力怎么选（和 tonybook-mag ep022 同一条旁白、同一条配音，方便对比）
   tts 92ac43e0042b（ElevenLabs v4 · will · tts 内 1.3 倍）。依据运营台定制说明 P0001 / P0003 / P0004 + 通用规则第 3 条。
   色卡颜色是示意（只有 05 木质、13 金镜面、14 银镜面对得上定制说明），画面上标了「示意」。 */
window.EP = {
  lead: 0.1, tail: 2.2,
  episode: "022", date: "11.18",
  topic: "圣诞袜上的名字，木头和亚克力怎么选",
  source: "我们自己定制店的做法 · 色卡为示意",
  tts: { id: "92ac43e0042b", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.451, cap: "圣诞袜上的名字，木头还是亚克力|我们按款式定", keys: ["按款式定"] },
    { dur: 2.453, cap: "我们Etsy定制店的圣诞袜|分三种情况", keys: ["三种情况"] },
    { dur: 1.72, cap: "第一种|印花袜身", keys: ["印花袜身"] },
    { dur: 2.726, cap: "名字只用木字母|木本色，不分颜色", keys: ["木字母"] },
    { dur: 1.882, cap: "切好以后|贴在丝绒袜口上", keys: ["丝绒袜口"] },
    { dur: 1.804, cap: "第二种|纯色丝绒袜", keys: ["纯色丝绒袜"] },
    { dur: 3.629, cap: "名牌有二十个选项|一个是木质，其余都是亚克力", keys: ["二十个选项", "亚克力"] },
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
  scenes: [
    { at: 0, instant: true, kind: "cover", q: "圣诞袜上的名字|**木头**还是**亚克力**？", stamp: ["我们的做法", "按款式定"] },

    { at: 2, kind: "stocking", step: "1", title: "**印花**袜身",
      look: { body: "print", cuff: "#7B2232", name: "Emma", plate: "wood" },
      pins: [{ at: 3, text: "木字母 · 木本色", x: 580, y: 200 }, { at: 4, text: "贴在丝绒袜口", x: 580, y: 330, coral: true }],
      notes: [{ at: 3.3, text: "名字**只用木字母**，不分颜色" }] , ny: 900 },

    { at: 5, kind: "swatch", step: "2", title: "纯色**丝绒袜**", wood: 5, pick: 13,
      colors: [["#E8473C", 1], "#F28AB2", "#FFFFFF", ["#1B1B1B", 1], "wood", ["#2E7D4F", 1], ["#2F5DA8", 1], "#8FC6E8", "#F5C542", "#F08A3C",
        ["#6B3FA0", 1], "#C7A0E0", "linear-gradient(160deg,#FFF3C4,#E7B84A 40%,#B9862A 70%,#F6D879)", "linear-gradient(160deg,#FFFFFF,#C9CED6 45%,#8E949E 70%,#E9ECF0)",
        "linear-gradient(160deg,#FBE1D6,#E3A28C 45%,#B8735E 75%,#F4C8B6)", ["linear-gradient(160deg,#F2B48A,#B9662F 50%,#7D3E17)", 1], ["#0F4D3A", 1], "#E05A9A", "#D9E6F2", ["#B5232E", 1]],
      notes: [{ at: 6.2, text: "名牌 **20 个选项**：1 个木质，其余亚克力" }], ny: 730,
      order: { at: 7, text: "Name Option: **13**|→ 13 号金镜面" } },

    { at: 8, kind: "note", step: "3", title: "客户**写编号**",
      boxes: [{ at: 8.4, text: "Lucas / 13", swatch: "linear-gradient(160deg,#FFF3C4,#E7B84A 40%,#B9862A 70%,#F6D879)", result: "写几号**用几号**" },
              { at: 9.4, text: "Mia", swatch: "repeating-linear-gradient(45deg,#FFFDF8 0 18px,#EDE5D6 18px 36px)", result: "没写：**用主图颜色**" }] },

    { at: 10, kind: "nameimg", step: "4", title: "名字图**只出黑白**", name: "Lucas",
      mats: [{ at: 11, label: "木头", kind: "wood" }, { at: 11.25, label: "金镜面亚克力", kind: "linear-gradient(160deg,#FFF3C4,#E7B84A 40%,#B9862A 70%,#F6D879)", fg: "#5c4310" },
             { at: 11.5, label: "红色亚克力", kind: "#D8343B", fg: "#fff" }],
      notes: [{ at: 11.6, text: "颜色**交给材料**，不画进图里" }], ny: 880 },

    { at: 12, kind: "todo", title: "先做 **3** 件事",
      items: [{ at: 13, text: "按袜子款式**定材料**" }, { at: 14, text: "名牌颜色**用编号对**" }, { at: 15, text: "名字图**只出黑白**" }],
      fine: { at: 15.6, text: "我们自己定制店的做法，不含材料价、成本和单量。" }, fy: 960 },

    { at: 16, kind: "end", lines: [{ at: 16, text: "有店不知道上什么？" }, { at: 16.5, text: "来 **Etsy-Tony 粉丝群**找 Tony" }],
      follow: { at: 17, name: "TONYBOOK · 跨境", sub: "每天讲透一个 Etsy 实操问题" } },
  ],
};
