/* NO.030 · A · 员工交差的照片，我们看哪几处（2026-11-19），tts 1a5e03982967（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店看员工交差照片的四处——名字逐字母对订单（含大小写）、切边有没有焦 / 细笔画有没有断、
   标签上名字 / 订单号 / 零件一一对应、打包逐件扫码面单和本单一致；有一处不对就打回，写清原因、状态改回进行中。
   依据运营台工序检查要点（P0003 路线：清理 / 自检 / 贴标签 / 打包出库）和验收规则。
   不讲人数、产量、返工数据，不提客户和合作方；不碰 Etsy-Tony EP.003 共享权限、EP.025 账户安全；
   和 ep018（交接三步）的区别：这期只讲照片里看什么。
   素材（Pexels 免费商用）：首页 7793363 拿手机拍产品｜CH.01 8519334 纸上写字｜CH.02 34716349 激光切割机｜CH.03 6170316 货架上的包裹｜
   CH.04 6342201 封箱｜CH.05 6781972 笔记本打字｜CH.06 6186640 手写清单打勾｜CH.07 6214598 手机打字。
   成片 output 42a7b13b4a7c（46.3 秒）。封面：Codex IMG-20261119-001 做完配音和素材时还是待处理，没用封面。
   配音 verify 标了第 2、5、7 句（Etsy→Atzi、「边」听写成「编」、「第三处」听写成「3.」），属读音差异，没重来。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "023", date: "11.19",
  // cover: "assets/ep023-cover.png",
  topic: "员工交差的照片，我们看哪几处",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "1a5e03982967", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.828, cap: "员工说做好了|我们先看照片上这四处", keys: ["这四处"] },
    { dur: 2.896, cap: "我们Etsy定制店|每道工序交差都看照片", keys: ["都看照片"] },
    { dur: 1.288, cap: "第一处|名字", keys: ["名字"] },
    { dur: 2.736, cap: "照着订单逐个字母对|大小写也算", keys: ["大小写"] },
    { dur: 1.671, cap: "第二处|边和笔画", keys: ["边和笔画"] },
    { dur: 2.388, cap: "看边有没有切焦|细笔画有没有断", keys: ["切焦"] },
    { dur: 1.446, cap: "第三处|标签", keys: ["标签"] },
    { dur: 2.725, cap: "名字、订单号和零件|要一一对得上", keys: ["一一对得上"] },
    { dur: 1.376, cap: "第四处|面单", keys: ["面单"] },
    { dur: 2.841, cap: "打包时逐件扫码|面单要和这一单一致", keys: ["逐件扫码"] },
    { dur: 1.534, cap: "有一处不对|就打回", keys: ["打回"] },
    { dur: 2.28, cap: "写清原因|状态改回进行中", keys: ["写清原因"] },
    { dur: 1.779, cap: "看照片之前|先做三件事", keys: ["三件事"] },
    { dur: 2.558, cap: "第一，每道工序写清检查要点", keys: ["检查要点"] },
    { dur: 1.98, cap: "第二，照片对着要点拍", keys: ["对着要点"] },
    { dur: 2.024, cap: "第三，打回一定写原因", keys: ["写原因"] },
    { dur: 3.188, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.866, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "员工说做好了|**照片先看哪几处**？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "看 4 处", tone: "coral", sub: "名字 · 切边 · 标签 · 面单" },

    { at: 2, clear: true, chapter: "名字", kind: "text", text: "第一处：**名字**", typing: 0.2 },
    { at: 3, kind: "text", text: "照订单**逐个字母**对，大小写也算", typing: 0.2 },

    { at: 4, clear: true, chapter: "切边", kind: "text", text: "第二处：**边和笔画**", typing: 0.2 },
    { at: 5, kind: "text", text: "边有没有**切焦**，细笔画有没有**断**", typing: 0.2 },

    { at: 6, clear: true, chapter: "标签", kind: "text", text: "第三处：**标签**", typing: 0.2 },
    { at: 7, kind: "text", text: "名字、订单号、零件**一一对上**", typing: 0.2 },

    { at: 8, clear: true, chapter: "面单", kind: "text", text: "第四处：**面单**", typing: 0.2 },
    { at: 9, kind: "text", text: "逐件扫码，面单和**这一单一致**", typing: 0.2 },

    { at: 10, clear: true, chapter: "打回", kind: "big", kicker: "Reject", label: "有一处不对", text: "打回", tone: "coral", sub: "照片对不上检查要点" },
    { at: 11, kind: "text", text: "写清原因，状态改回**进行中**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "每道工序写清检查要点" }, { at: 14, text: "照片对着要点拍" }, { at: 15, text: "打回一定写原因" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含人数、产量和返工数据。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
