/* NO.026 · A · 激光切木牌，同一块板怎么排版省料（2026-11-13），tts 1855eb527ee9（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店激光切名字木牌的排版思路（长短名字穿插排 → 件与件留间距 → 先切内孔再切外框 → 边角料留着切小件），
   不报板材价、成本、单量和省了多少料，不提客户和合作方；不讲 Etsy 平台规则（没碰 Etsy-Tony EP.023 自制认定）。
   素材（Pexels 免费商用）：首页 34716349 激光切割机工作中｜CH.01 7492602 木工往台锯上放板｜CH.02 30456102 数控激光切镂空板｜CH.03 5089240 带锯切木条特写｜CH.04 4224557 锯木特写｜CH.05 5217355 木工作坊｜CH.06 8818344 斜切锯切木。
   成片 output 3871b263a640（47.8 秒）。封面：Codex IMG-20261113-008 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "019", date: "11.13",
  // cover: "assets/ep019-cover.png",
  topic: "激光切木牌，同一块板怎么排版省料",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "1855eb527ee9", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.485, cap: "一块木板能多切几块|看的是排版", keys: ["排版"] },
    { dur: 3.0, cap: "我们Etsy定制店切名字木牌|排版分四步", keys: ["四步"] },
    { dur: 2.699, cap: "第一步，长名字和短名字|穿插着排", keys: ["穿插着排"] },
    { dur: 2.721, cap: "长的先排成一行|短的塞进空当里", keys: ["空当"] },
    { dur: 2.583, cap: "第二步，件和件之间|留好间距", keys: ["留好间距"] },
    { dur: 3.187, cap: "挨得太近，切完边容易焦|还可能连在一起", keys: ["容易焦"] },
    { dur: 2.795, cap: "第三步，先切里面的孔|再切外框", keys: ["再切外框"] },
    { dur: 3.117, cap: "外框先切了，木牌一松动|里面就切歪了", keys: ["切歪了"] },
    { dur: 2.213, cap: "第四步，剩下的边角料别扔", keys: ["边角料"] },
    { dur: 1.783, cap: "留着切单个字母这种小件", keys: ["小件"] },
    { dur: 2.558, cap: "想让一块板多出几块|先做三件事", keys: ["三件事"] },
    { dur: 2.178, cap: "第一，长短名字穿插着排", keys: ["穿插"] },
    { dur: 2.451, cap: "第二，先切内孔再切外框", keys: ["先切内孔"] },
    { dur: 2.335, cap: "第三，边角料留着切小件", keys: ["边角料"] },
    { dur: 3.161, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.982, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "同一块木板|**怎么多切几块**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "看排版", tone: "coral", sub: "穿插排 · 留间距 · 先内后外 · 用边角料" },

    { at: 2, clear: true, chapter: "穿插排", kind: "text", text: "第一步：**长短名字穿插排**", typing: 0.2 },
    { at: 3, kind: "text", text: "长的排一行，短的**塞空当**", typing: 0.2 },

    { at: 4, clear: true, chapter: "留间距", kind: "text", text: "第二步：**件和件留间距**", typing: 0.2 },
    { at: 5, kind: "text", text: "挨太近：边会焦，**还会连片**", typing: 0.2 },

    { at: 6, clear: true, chapter: "先内后外", kind: "text", text: "第三步：**先切内孔，再切外框**", typing: 0.2 },
    { at: 7, kind: "text", text: "外框先切，木牌松动，**里面切歪**", typing: 0.2 },

    { at: 8, clear: true, chapter: "边角料", kind: "text", text: "第四步：**边角料别扔**", typing: 0.2 },
    { at: 9, kind: "text", text: "留着切**单个字母**这种小件", typing: 0.2 },

    { at: 10, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 11, text: "长短名字穿插排" }, { at: 12, text: "先切内孔再切外框" }, { at: 13, text: "边角料留着切小件" }] },
    { at: 13.6, kind: "note", text: "我们自己定制店的做法，不含板材价、成本和单量。" },

    { at: 14, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 14.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 15, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 15.5 },
  ],
};
