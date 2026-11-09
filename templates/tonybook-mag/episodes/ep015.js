/* NO.022 · A · 定制木牌的名字图，怎么一单一单出不出错（2026-11-09），tts 8d2733d72017（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店出名字图的规矩（依据运营台定制说明的通用规则：逐字照抄不纠正拼写、黑字白底横向一行、颜色交给材料、超字数 / 中文 emoji / 两个名字不出图标「有问题」、一行一张图按订单号-行号命名），
   不报耗时、成本、单量，不提客户和合作方；不讲 Etsy 定制选项规则（避开 Etsy-Tony EP.026），不重复 ep012 讲过的 1.5mm / 12 字符。
   素材（Pexels 免费商用）：见文末 render 记录。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "015", date: "11.09",
  // cover: "assets/ep015-cover.png",
  topic: "定制木牌的名字图，怎么一单一单出不出错",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "8d2733d72017", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.397, cap: "我们出名字图只守一条|客户怎么写，就怎么抄", keys: ["就怎么抄"] },
    { dur: 1.557, cap: "第一步，逐字照抄", keys: ["逐字照抄"] },
    { dur: 3.429, cap: "大小写、空格、重音字母、连字符|一个都不改", keys: ["不改"] },
    { dur: 2.147, cap: "客户拼错了|我们也不替他纠正", keys: ["不替他纠正"] },
    { dur: 2.002, cap: "第二步，只出黑字白底", keys: ["黑字白底"] },
    { dur: 2.808, cap: "名字排成一排|不加阴影，不画颜色", keys: ["不画颜色"] },
    { dur: 2.478, cap: "木头还是亚克力|颜色交给材料", keys: ["交给材料"] },
    { dur: 2.244, cap: "第三步，三种情况不出图", keys: ["不出图"] },
    { dur: 3.726, cap: "超过字数上限、有中文或表情|一单写了两个名字", keys: ["两个名字"] },
    { dur: 2.624, cap: "这一项先标成有问题|写清原因", keys: ["有问题"] },
    { dur: 2.163, cap: "第四步，一个名字一张图", keys: ["一张图"] },
    { dur: 2.959, cap: "文件名用订单号加序号|切的时候对得上", keys: ["对得上"] },
    { dur: 1.857, cap: "出名字图，先做三件事", keys: ["三件事"] },
    { dur: 2.461, cap: "第一，名字照抄|拼错也不改", keys: ["不改"] },
    { dur: 2.778, cap: "第二，拿不准的先标有问题|不硬做", keys: ["不硬做"] },
    { dur: 2.976, cap: "第三，文件名带上|订单号和序号", keys: ["订单号"] },
    { dur: 3.087, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.967, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "定制木牌的**名字图**|怎么出才不出错？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们只守一条", text: "照抄", tone: "coral", sub: "客户怎么写，就怎么抄" },

    { at: 1, clear: true, chapter: "逐字照抄", kind: "text", text: "第一步：**逐字照抄**", typing: 0.2 },
    { at: 2, kind: "text", text: "大小写 · 空格 · 重音 · 连字符", typing: 0.2 },
    { at: 3, kind: "text", text: "拼错了也**不替客户纠正**", typing: 0.2 },

    { at: 4, clear: true, chapter: "黑字白底", kind: "text", text: "第二步：**只出黑字白底**", typing: 0.2 },
    { at: 5, kind: "text", text: "横排一行，**不加阴影不上色**", typing: 0.2 },
    { at: 6, kind: "text", text: "木头 / 亚克力，**颜色交给材料**", typing: 0.2 },

    { at: 7, clear: true, chapter: "不出图", kind: "text", text: "第三步：**三种情况不出图**", typing: 0.2 },
    { at: 8, kind: "text", text: "超字数 · 中文表情 · **两个名字**", typing: 0.2 },
    { at: 9, kind: "text", text: "先标**有问题**，写清原因", typing: 0.2 },

    { at: 10, clear: true, chapter: "一名一图", kind: "text", text: "第四步：**一个名字一张图**", typing: 0.2 },
    { at: 11, kind: "text", text: "文件名 = **订单号 + 序号**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "名字照抄，拼错也不改" }, { at: 14, text: "拿不准先标有问题，不硬做" }, { at: 15, text: "文件名带订单号和序号" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含耗时、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
