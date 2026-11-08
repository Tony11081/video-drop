/* NO.021 · A · 店小秘发 Etsy 单，从导单到回填单号（2026-11-08），tts 40236b51d513（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店在店小秘里的发货流程（同步订单 → 审单 → 选物流 → 打面单 → 回填单号），不报物流价格、成本、单量，不提客户和合作方；
   不讲 Etsy 规则（发货时限、星级卖家、压款都不碰），避开 Etsy-Tony EP.018 / EP.020 / EP.024。
   素材（Pexels 免费商用）：首页 7464140 纸箱特写｜CH.01 7252675 笔记本打字（9558853 有可读的球队字和贴纸，换掉）｜CH.02 4872898 笔记本打字｜CH.03 7308100 打包礼盒｜CH.04 9594581 纸箱贴标签｜CH.05 13443899 快递送件｜CH.06 6169117 抱箱出门｜CH.07 12692039 笔记本打字。
   成片 output 3ef54c00b8a5（51.3 秒）。封面：Codex IMG-20261108-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "014", date: "11.08",
  // cover: "assets/ep014-cover.png",
  topic: "店小秘发 Etsy 单，从导单到回填单号",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "40236b51d513", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 3.410, cap: "我们Etsy定制店的订单|在店小秘里走五步发出去", keys: ["五步"] },
    { dur: 1.553, cap: "第一步，同步订单", keys: ["同步订单"] },
    { dur: 2.777, cap: "店铺授权给店小秘以后|新订单自己进来", keys: ["自己进来"] },
    { dur: 1.356, cap: "第二步，审单", keys: ["审单"] },
    { dur: 3.526, cap: "地址、定制的名字、SKU|三样先对一遍", keys: ["三样"] },
    { dur: 2.321, cap: "名字照客户写的抄|一个字母都不改", keys: ["不改"] },
    { dur: 1.526, cap: "第三步，选物流", keys: ["选物流"] },
    { dur: 3.758, cap: "按包裹选好渠道，我们用燕文和出口易|申请运单号", keys: ["运单号"] },
    { dur: 1.415, cap: "第四步，打面单", keys: ["打面单"] },
    { dur: 2.688, cap: "面单贴上箱子|和订单号对上了再封箱", keys: ["对上"] },
    { dur: 1.670, cap: "第五步，回填单号", keys: ["回填单号"] },
    { dur: 2.830, cap: "交给物流以后|单号回传到Etsy的订单里", keys: ["回传"] },
    { dur: 2.453, cap: "用店小秘发Etsy单|先做三件事", keys: ["三件事"] },
    { dur: 2.412, cap: "第一，先审单|再申请单号", keys: ["先审单"] },
    { dur: 2.570, cap: "第二，面单和订单号对上|再封箱", keys: ["对上"] },
    { dur: 3.070, cap: "第三，单号回传以后|去Etsy后台看一眼", keys: ["看一眼"] },
    { dur: 3.200, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.897, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "一单 **Etsy** 订单|店小秘里怎么发？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "从进单到回填", text: "走 5 步", tone: "coral", sub: "我们 Etsy **定制店**的发货流程" },

    { at: 1, clear: true, chapter: "同步订单", kind: "text", text: "第一步：**同步订单**", typing: 0.2 },
    { at: 2, kind: "text", text: "店铺授权后，新订单**自己进来**", typing: 0.2 },

    { at: 3, clear: true, chapter: "审单", kind: "text", text: "第二步：**审单**", typing: 0.2 },
    { at: 4, kind: "text", text: "**地址 · 名字 · SKU** 先对一遍", typing: 0.2 },
    { at: 5, kind: "text", text: "名字照抄，**一个字母都不改**", typing: 0.2 },

    { at: 6, clear: true, chapter: "选物流", kind: "text", text: "第三步：**选物流**", typing: 0.2 },
    { at: 7, kind: "text", text: "燕文 / 出口易，**申请运单号**", typing: 0.2 },

    { at: 8, clear: true, chapter: "打面单", kind: "text", text: "第四步：**打面单**", typing: 0.2 },
    { at: 9, kind: "text", text: "和订单号**对上了再封箱**", typing: 0.2 },

    { at: 10, clear: true, chapter: "回填单号", kind: "text", text: "第五步：**回填单号**", typing: 0.2 },
    { at: 11, kind: "text", text: "交给物流后，单号**回传 Etsy**", typing: 0.2 },

    { at: 12, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 13, text: "先审单，再申请单号" }, { at: 14, text: "面单对上订单号，再封箱" }, { at: 15, text: "回传后，去 Etsy 后台看一眼" }] },
    { at: 15.6, kind: "note", text: "我们自己定制店的做法，不含物流价格、成本和单量。" },

    { at: 16, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
