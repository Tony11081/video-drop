/* NO.035 · A · 新员工第一天，我们先教哪三件事（2026-11-24），tts e60c0e8afd00（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店新员工第一天不先上机，先学三件事——看懂任务（单号 / 款式 / 工序 / 期限 / 检查要点）、
   交差照检查要点拍照一处一张、拿不准就标有问题先问再做。
   依据运营台派工和工序交差规则（任务写清检查要点、交差带照片、拿不准标有问题不猜）。
   无官方数字，不讲人数、工资、产量；不碰 Etsy-Tony EP.003 共享权限、EP.025 账户安全；
   和 ep018（交接 3 步）、ep023（验收看照片 4 处）的区别是只讲新人第一天先学什么。
   素材（Pexels 免费商用，每章先切段再合成）：首页 34716349 工业激光切割机｜CH.01 32082737 手写清单打勾（ep 之前用在 CH.04）｜
   CH.02 7793363 拿手机给产品拍照（之前用在首页）｜CH.03 32421244 桌前笔记本写字（5972656 工具台只有 5.8 秒，换掉）｜CH.04 6278834 手拿手机。
   成片 output d1a8e45bf948（46.1 秒）。封面：Codex IMG-20261124-001 做完配音和素材时还是待处理，没用封面。配音 verify 无标记。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "028", date: "11.24",
  // cover: "assets/ep028-cover.png",
  topic: "新员工第一天，我们先教哪三件事",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "e60c0e8afd00", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.217, cap: "新员工第一天|我们不先让他上机", keys: ["不先让他上机"] },
    { dur: 1.957, cap: "先学会三件事|再碰机器", keys: ["三件事"] },
    { dur: 2.213, cap: "机器切错一块|这块板就废了", keys: ["废了"] },
    { dur: 2.181, cap: "所以第一天|先看懂一张任务", keys: ["看懂一张任务"] },
    { dur: 3.225, cap: "单号、款式、工序、期限|都写在上面", keys: ["工序"] },
    { dur: 2.501, cap: "还有一栏检查要点|做完要对着看", keys: ["检查要点"] },
    { dur: 2.131, cap: "交差的时候|照检查要点拍照", keys: ["拍照"] },
    { dur: 2.746, cap: "一处一张|名字要看清每个字母", keys: ["每个字母"] },
    { dur: 1.96, cap: "看不懂的地方|先问，不猜", keys: ["不猜"] },
    { dur: 2.875, cap: "名字读不懂、颜色对不上|先标有问题", keys: ["有问题"] },
    { dur: 2.083, cap: "新人第一天|先做三件事", keys: ["三件事"] },
    { dur: 2.215, cap: "第一，看懂任务上的检查要点", keys: ["检查要点"] },
    { dur: 3.015, cap: "第二，交差照要点拍照|一处一张", keys: ["一处一张"] },
    { dur: 3.073, cap: "第三，拿不准就标有问题|先问再做", keys: ["先问再做"] },
    { dur: 3.184, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.937, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "新员工第一天|先让他**上机**吗？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "先学三件事", tone: "coral", sub: "看任务 · 拍照片 · 不懂就问" },

    { at: 2, clear: true, chapter: "先看任务", kind: "text", text: "切错一块，**这块板就废了**", typing: 0.2 },
    { at: 3, kind: "text", text: "第一天，先**看懂一张任务**", typing: 0.2 },
    { at: 4, kind: "big", kicker: "Example", label: "一张任务上", text: "写清四样", tone: "coral", sub: "单号 · 款式 · 工序 · 期限，外加检查要点" },
    { at: 5, kind: "text", text: "做完要**对着检查要点看**", typing: 0.2 },

    { at: 6, clear: true, chapter: "拍照和提问", kind: "text", text: "交差：**照检查要点拍照**", typing: 0.2 },
    { at: 7, kind: "text", text: "一处一张，**名字看清每个字母**", typing: 0.2 },
    { at: 8, kind: "big", kicker: "Answer", label: "看不懂的地方", text: "先问，不猜", tone: "coral", sub: "名字读不懂、颜色对不上 → 先标有问题" },

    { at: 10, clear: true, chapter: "先做三件事", kind: "todo", title: "新人第一天先做 3 件事",
      items: [{ at: 11, text: "看懂任务上的检查要点" }, { at: 12, text: "交差照要点拍照，一处一张" }, { at: 13, text: "拿不准就标有问题，先问再做" }] },
    { at: 13.6, kind: "note", text: "我们自己定制店的做法，不含人数和工资。" },

    { at: 14, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 14.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 15, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 15.5 },
  ],
};
