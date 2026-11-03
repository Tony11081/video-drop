/* NO.009 · A · 单多了不发错货，靠一串 SKU（2026-11-03），tts 13d0b1cc12f8（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们自己定制店的 SKU 编法（topics.md NO.009：款式号-图案号-颜色-尺码，客户的名字不进 SKU）。
   不报成本、单量、颜色数；SKU 示例为示意，不是真实编号。不讲 Etsy 平台规则（Etsy-Tony EP.014 讲过欧盟海关用 SKU，这里不碰）。
   成片 output 1ad1bade1958（46.54 秒）。素材（Pexels 免费商用）：首页 7210955 贴标签纸箱｜CH.01 4973185 色卡｜CH.02 7362811 扫包裹｜CH.03 6781988 记事本写字｜CH.04 4292903 仓库扫码｜CH.05 32421244 桌边手写｜CH.06 7287517 小工作室打包。封面：Codex IMG-20261103-001 未出图，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,   // 配音已在 tts 里 1.3 倍（ElevenLabs will），画面按成片时间轴，背景素材在服务器上合成
  episode: "009", date: "11.03",
  // cover: "assets/ep009-cover.png",  // Codex 封面图到了再打开
  topic: "单多了不发错货，靠一串 SKU",
  source: "TonyBook 自己的定制店做法 · SKU 为示意",
  tts: { id: "13d0b1cc12f8", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 4.273, cap: "同一款木牌好多种颜色|我们靠一串SKU不发错货", keys: ["SKU"] },
    { dur: 1.405, cap: "这串编号分四段", keys: ["四段"] },
    { dur: 1.449, cap: "第一段，款式号", keys: ["款式号"] },
    { dur: 1.468, cap: "第二段，图案号", keys: ["图案号"] },
    { dur: 1.481, cap: "第三段，颜色", keys: ["颜色"] },
    { dur: 1.426, cap: "第四段，尺码", keys: ["尺码"] },
    { dur: 2.5, cap: "中间用短横线隔开|一眼就能看懂", keys: ["短横线"] },
    { dur: 2.602, cap: "客户的名字，不放进SKU", keys: ["不放进"] },
    { dur: 2.618, cap: "名字每单都不一样|单独从订单里读", keys: ["订单里"] },
    { dur: 3.01, cap: "出单以后，按SKU|找到模板和底板", keys: ["模板"] },
    { dur: 2.671, cap: "打包之前|再对一遍SKU和实物", keys: ["再对一遍"] },
    { dur: 1.412, cap: "所以先做三件事", keys: ["三件事"] },
    { dur: 2.539, cap: "第一，每个变体|都编一个SKU", keys: ["每个变体"] },
    { dur: 3.317, cap: "第二，四段的顺序定死|全店统一", keys: ["全店统一"] },
    { dur: 2.596, cap: "第三，名字只看订单|不进编号", keys: ["不进编号"] },
    { dur: 3.165, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.907, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "同款木牌**好多种颜色**|怎么不发错？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的定制店 · 靠编号对货", text: "一串 SKU", tone: "coral", sub: "款式 - 图案 - 颜色 - 尺码，**名字不进**" },

    { at: 1, clear: true, chapter: "四段编号", kind: "text", text: "这串编号分**四段**", typing: 0.2 },
    { at: 2, kind: "text", text: "**01** 款式号", typing: 0.2 },
    { at: 3, kind: "text", text: "**02** 图案号", typing: 0.2 },
    { at: 4, kind: "text", text: "**03** 颜色", typing: 0.2 },
    { at: 5, kind: "text", text: "**04** 尺码", typing: 0.2 },
    { at: 6, clear: true, chapter: "编号示意", kind: "big", kicker: "Example", label: "短横线隔开 · 示意", text: "NS01-P03", tone: "coral", sub: "后面接 **-NV-M**：颜色 - 尺码" },

    { at: 7, clear: true, chapter: "名字不进", kind: "text", text: "客户的名字，**不放进** SKU", typing: 0.2 },
    { at: 8, kind: "text", text: "名字每单不同，从**订单里**读", typing: 0.2 },

    { at: 9, clear: true, chapter: "出单对货", kind: "text", text: "出单后，按 **SKU** 找模板和底板", typing: 0.2 },
    { at: 10, kind: "text", text: "打包前，SKU 和实物**再对一遍**", typing: 0.2 },

    { at: 11, clear: true, chapter: "先做三件事", kind: "todo", title: "先做 3 件事",
      items: [{ at: 12, text: "每个变体都编一个 SKU" }, { at: 13, text: "四段顺序定死，全店统一" }, { at: 14, text: "名字只看订单，不进编号" }] },
    { at: 14.6, kind: "note", text: "我们自己定制店的做法，编号为示意，不含成本和单量。" },

    { at: 15, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 15.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 16, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 16.5 },
  ],
};
