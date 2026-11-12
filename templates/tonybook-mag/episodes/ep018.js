/* NO.025 · A · 一张订单，AI 和员工怎么交接（2026-11-12），tts 7e601613dc45（ElevenLabs v4 · will · tts 内 1.3 倍；第一轮 fa8da77afb35 的「活」多处被听成「火」，改成「任务」重来）
   A 类：只讲我们 Etsy 定制店 AI 派活 → 员工交差 → 当天验收的交接方法（派活写清单号/款/工序/期限/检查点，交差照检查要点拍照，不对打回写原因、状态改回进行中），
   不报人数、产量、成本、单量，不提客户和合作方；不讲 Etsy 平台规则（避开 Etsy-Tony EP.003 共享权限、EP.025 账户安全）。
   素材（Pexels 免费商用）：首页 7793363 拿手机拍产品｜CH.01 6781972 笔记本打字｜CH.02 7793361 俯拍手机拍产品｜CH.03 5973230 木工看木板｜CH.04 7597168 写清单｜CH.05 7287517 工作室交包裹。
   成片见 douyin-copy.md。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "018", date: "11.12",
  // cover: "assets/ep018-cover.png",
  topic: "一张订单，AI 和员工怎么交接",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "7e601613dc45", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.911, cap: "员工说做好了，没有照片|我们不算交差", keys: ["不算交差"] },
    { dur: 3.983, cap: "我们Etsy定制店的一张订单|从AI派到员工，分三步交接", keys: ["三步交接"] },
    { dur: 1.919, cap: "第一步，派任务写清楚", keys: ["写清楚"] },
    { dur: 2.456, cap: "做哪一单、哪个款|哪道工序", keys: ["哪道工序"] },
    { dur: 2.846, cap: "什么时候要，检查哪几处|都写在任务里", keys: ["检查哪几处"] },
    { dur: 1.846, cap: "第二步，交差带照片", keys: ["带照片"] },
    { dur: 2.287, cap: "照着检查要点拍|一处一张", keys: ["一处一张"] },
    { dur: 2.371, cap: "定制单上的名字|要拍得清清楚楚", keys: ["名字"] },
    { dur: 1.752, cap: "第三步，当天验收", keys: ["当天验收"] },
    { dur: 2.3, cap: "做对了，就点完成|接着往下走", keys: ["点完成"] },
    { dur: 2.914, cap: "不对就打回去|哪里不对、怎么改，写清楚", keys: ["写清楚"] },
    { dur: 2.48, cap: "打回的任务改回进行中|改好再交", keys: ["改好再交"] },
    { dur: 2.415, cap: "想让AI派任务不乱|先做三件事", keys: ["三件事"] },
    { dur: 2.091, cap: "第一，任务里写清检查点", keys: ["检查点"] },
    { dur: 1.981, cap: "第二，交差必须带照片", keys: ["带照片"] },
    { dur: 2.009, cap: "第三，打回一定写原因", keys: ["写原因"] },
    { dur: 3.102, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.826, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "员工说做好了|**怎样才算交差**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的规矩", text: "没照片不算", tone: "coral", sub: "派任务 · 带照片交差 · 当天验收" },

    { at: 2, clear: true, chapter: "派任务", kind: "text", text: "第一步：**派任务写清楚**", typing: 0.2 },
    { at: 3, kind: "text", text: "哪一单 · 哪个款 · **哪道工序**", typing: 0.2 },
    { at: 4, kind: "text", text: "期限和**检查点**，都写进任务", typing: 0.2 },

    { at: 5, clear: true, chapter: "带照片", kind: "text", text: "第二步：**交差带照片**", typing: 0.2 },
    { at: 6, kind: "text", text: "照检查要点拍，**一处一张**", typing: 0.2 },
    { at: 7, kind: "text", text: "定制名字要**拍清楚**", typing: 0.2 },

    { at: 8, clear: true, chapter: "当天验收", kind: "text", text: "第三步：**当天验收**", typing: 0.2 },
    { at: 9, kind: "text", text: "对了：**点完成**，往下走", typing: 0.2 },
    { at: 10, kind: "text", text: "不对：**打回 + 写原因**", typing: 0.2 },
    { at: 11, kind: "text", text: "状态改回进行中，**改好再交**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "任务里写清检查点" }, { at: 14, text: "交差必须带照片" }, { at: 15, text: "打回一定写原因" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含人数、产量和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
