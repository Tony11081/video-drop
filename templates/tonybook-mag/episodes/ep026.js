/* NO.033 · A · 同一天几十张名字图，我们怎么按批切（2026-11-22），tts 3003d0997c6b（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店名字图出完后的上机顺序——读出每张图的材料（颜色在 SKU 最后一段 / 名字后面的名牌编号 / 没写编号用主图颜色）→
   同一种材料放一批（名字图永远黑字白底，颜色全靠材料：木头一批、每种颜色亚克力各一批）→ 按任务号（订单号+行号）对回订单不串单。
   依据运营台定制说明通用规则 2 / 3 / 5 和 P0002 / P0003 / P0004 的名牌颜色来源。无官方数字，不报产量、耗时、材料价；
   不碰 Etsy-Tony EP.026 定制选项、EP.018 星级卖家；和 ep015（出名字图）、ep022（木头和亚克力怎么选）的区别是只讲出图之后怎么分批上机。
   素材（Pexels 免费商用）：首页 30456102 CNC 激光切割｜CH.01 6120119 放大镜细看（ep025 用在 CH.03）｜CH.02 13892563 桌上摆放纸张｜
   CH.03 7054942 桌上一摞文件｜CH.04 6781972 笔记本桌面（ep025 用在 CH.06）｜CH.05 7987956 女生看手机。
   成片 output 2194b1b0d5b1（50.9 秒）。封面：Codex IMG-20261122-001 做完配音和素材时还是待处理，没用封面。配音 verify 无标记。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "026", date: "11.22",
  // cover: "assets/ep026-cover.png",
  topic: "名字图一多，我们怎么按批切",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "3003d0997c6b", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.879, cap: "名字图出完，先按材料分批|再上机切", keys: ["按材料分批"] },
    { dur: 2.105, cap: "我们Etsy定制店|分三步来切", keys: ["三步"] },
    { dur: 1.972, cap: "第一步|读出每张图的材料", keys: ["材料"] },
    { dur: 3.063, cap: "有的款，颜色写在|SKU最后一段", keys: ["SKU最后一段"] },
    { dur: 2.236, cap: "有的款，看名字后面的|名牌编号", keys: ["名牌编号"] },
    { dur: 1.986, cap: "没写编号|就用主图上的颜色", keys: ["主图"] },
    { dur: 2.153, cap: "第二步|同一种材料放一批", keys: ["放一批"] },
    { dur: 2.93, cap: "名字图都是黑字白底|颜色全靠材料", keys: ["全靠材料"] },
    { dur: 3.121, cap: "所以木头一批|每种颜色的亚克力各一批", keys: ["各一批"] },
    { dur: 2.46, cap: "第三步|按任务号对回订单", keys: ["对回订单"] },
    { dur: 2.432, cap: "每张图都用|订单号加行号命名", keys: ["订单号加行号"] },
    { dur: 2.762, cap: "一行一张图|切完对回去，不串单", keys: ["不串单"] },
    { dur: 1.852, cap: "上机之前|先做三件事", keys: ["三件事"] },
    { dur: 2.2, cap: "第一，每张图先读出材料", keys: ["读出材料"] },
    { dur: 2.168, cap: "第二，同一种材料放一批切", keys: ["放一批"] },
    { dur: 2.638, cap: "第三，按订单号加行号|对回去", keys: ["对回去"] },
    { dur: 3.11, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.947, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "名字图一多|**先切哪张**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先按材料分批", tone: "coral", sub: "读材料 · 同料一批 · 对回订单" },

    { at: 2, clear: true, chapter: "读材料", kind: "text", text: "第一步：**读出材料**", typing: 0.2 },
    { at: 3, kind: "text", text: "有的款看 **SKU 最后一段**", typing: 0.2 },
    { at: 4, kind: "text", text: "有的款看**名牌编号**", typing: 0.2 },
    { at: 5, kind: "text", text: "没写编号，用**主图颜色**", typing: 0.2 },

    { at: 6, clear: true, chapter: "同料一批", kind: "text", text: "第二步：**同一种材料放一批**", typing: 0.2 },
    { at: 7, kind: "text", text: "图是黑字白底，**颜色全靠材料**", typing: 0.2 },
    { at: 8, kind: "big", kicker: "Batch", label: "上机顺序", text: "木头一批", tone: "coral", sub: "每种颜色的亚克力 · 各一批" },

    { at: 9, clear: true, chapter: "对回订单", kind: "text", text: "第三步：**对回订单**", typing: 0.2 },
    { at: 10, kind: "text", text: "文件名 = **订单号 + 行号**", typing: 0.2 },
    { at: 11, kind: "text", text: "一行一张图，**不串单**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "上机前先做 3 件事",
      items: [{ at: 13, text: "每张图先读出材料" }, { at: 14, text: "同一种材料放一批切" }, { at: 15, text: "按订单号 + 行号对回去" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含产量、耗时和材料价。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
