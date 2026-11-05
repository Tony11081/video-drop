/* NO.015 · A · 老板几家店，日常运营交给 AI（2026-11-05），tts 3d8f46a62beb（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们自己的流程（AI 看单排期、派活、出名字图、看照片验收、打回写原因；花钱/退款/联系客户留给老板拍板），
   不报成本、利润、单量、店数，不提客户和合作方；不讲 Etsy 规则，没碰 Etsy-Tony EP.003 共享权限、EP.001/EP.023 AI 规则。
   素材（Pexels 免费商用，剪辑服务器上已导入的源片；今天 Pexels 下载接口对服务器返回 403，没能导新素材）：
   首页 7680121 笔记本｜CH.01 6170316 货架包裹｜CH.02 7287517 打包交接｜CH.03 7597168 写清单｜CH.04 6186640 打勾清单｜CH.05 7043685 刺绣机。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "011", date: "11.05",
  // cover: "assets/ep011-cover.png",
  topic: "老板几家店，日常运营交给 AI",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "3d8f46a62beb", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.073, cap: "老板的几家Etsy店|每天先由我这个AI过一遍", keys: ["AI"] },
    { dur: 2.662, cap: "大事小事|最后老板只拍板几件", keys: ["拍板"] },
    { dur: 2.463, cap: "早上开工|我先看订单和发货期限", keys: ["发货期限"] },
    { dur: 2.007, cap: "哪单快到期了|就排在最前面", keys: ["最前面"] },
    { dur: 2.098, cap: "再看今天谁在线|把活派下去", keys: ["派下去"] },
    { dur: 2.773, cap: "定制单要的名字图|我按订单先做出来", keys: ["名字图"] },
    { dur: 2.244, cap: "员工交差|我当天看照片验收", keys: ["看照片"] },
    { dur: 2.285, cap: "做得不对就打回去|原因写清楚", keys: ["打回去"] },
    { dur: 1.634, cap: "但有几类事，我不碰", keys: ["不碰"] },
    { dur: 3.023, cap: "花钱、退款、联系客户|都等老板拍板", keys: ["老板拍板"] },
    { dur: 1.914, cap: "我把要他定的事|列成一张单子", keys: ["一张单子"] },
    { dur: 2.201, cap: "想用AI管店|先做三件事", keys: ["三件事"] },
    { dur: 2.496, cap: "第一，每天的活|写成固定清单", keys: ["固定清单"] },
    { dur: 2.447, cap: "第二，AI做的每一步|都留记录", keys: ["留记录"] },
    { dur: 2.486, cap: "第三，花钱和客户的事|留给人", keys: ["留给人"] },
    { dur: 3.223, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.876, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "老板几家 Etsy 店|每天**谁先过一遍**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "AI 先过", tone: "coral", sub: "最后只留几件事给**老板拍板**" },

    { at: 2, clear: true, chapter: "早上看单", kind: "text", text: "先看**订单**和**发货期限**", typing: 0.2 },
    { at: 3, kind: "text", text: "快到期的单，**排最前面**", typing: 0.2 },

    { at: 4, clear: true, chapter: "派活验收", kind: "text", text: "看谁在线，**把活派下去**", typing: 0.2 },
    { at: 5, kind: "text", text: "定制单的**名字图**，AI 先做", typing: 0.2 },
    { at: 6, kind: "text", text: "员工交差，当天**看照片验收**", typing: 0.2 },
    { at: 7, kind: "text", text: "不对就**打回**，原因写清楚", typing: 0.2 },

    { at: 8, clear: true, chapter: "老板拍板", kind: "text", text: "这几类事，**AI 不碰**", typing: 0.2 },
    { at: 9, kind: "text", text: "**花钱 · 退款 · 联系客户**", typing: 0.2 },
    { at: 10, kind: "text", text: "列成一张单子，**等老板定**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "每天的活写成固定清单" }, { at: 13, text: "AI 每一步都留记录" }, { at: 14, text: "花钱和客户的事留给人" }] },
    { at: 14.6, kind: "note", text: "我们自己管店的做法，不含成本、单量等数据。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
