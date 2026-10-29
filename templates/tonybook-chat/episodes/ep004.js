/* NO.004 · A · 新手为什么卖「带名字的」定制品 — tts 5368dac27a55 (edge-tts zh-CN-XiaoxiaoNeural; Gemini Kore unavailable 2026-10-29: OpenRouter credits ran out, Tony OK'd another voice)
   Our angle: our own wooden name signs and embroidery are made to each buyer's name. No costs, prices or order counts.
   Setup facts only from Etsy Help Center "How to Offer Personalized Listings" (Custom options): up to 5 fields per listing,
   field types Text box / List of options / File upload, required or optional, add-on price only for optional Text box ($0.20–$500),
   buyer entries visible on the Orders page. Page shows no last-updated date; accessed 2026-10-29. */
window.EP = {
  speed: 1.3, lead: 0.1, tail: 2.2,
  episode: "004",
  topic: "Etsy 新手，卖什么不容易被比价？",
  source: "来源：Etsy 帮助中心 How to Offer Personalized Listings（2026-10-29 查阅，页面未标更新日期）",
  tts: { id: "5368dac27a55", voice: "edge-tts · zh-CN-XiaoxiaoNeural", gap: 0.2 },
  voice: [
    { dur: 3.389, cap: "Etsy新手别卖标品|卖能刻名字的", keys: ["能刻名字的"] },
    { dur: 3.089, cap: "标品同款太多|最后只能拼价格", keys: ["拼价格"] },
    { dur: 3.908, cap: "我们自己的木名牌和刺绣|都是按客户名字做的", keys: ["按客户名字"] },
    { dur: 2.883, cap: "每件都不一样|买家不好拿去比价", keys: ["不好拿去比价"] },
    { dur: 3.285, cap: "后台怎么设|Etsy帮助中心写了", keys: ["Etsy帮助中心"] },
    { dur: 3.785, cap: "商品编辑里找到定制选项|点添加字段", keys: ["定制选项"] },
    { dur: 4.318, cap: "字段分三种|文本框、选项列表、上传文件", keys: ["三种"] },
    { dur: 2.321, cap: "一个商品最多设5个字段", keys: ["5个字段"] },
    { dur: 3.185, cap: "名字就用文本框|可以设成必须填写", keys: ["必须填写"] },
    { dur: 3.043, cap: "设成可选的文本框|还能单独加价", keys: ["单独加价"] },
    { dur: 2.67, cap: "加价在0.2到500美元之间", keys: ["0.2到500美元"] },
    { dur: 3.143, cap: "买家填的名字|在订单页面就能看到", keys: ["订单页面"] },
    { dur: 2.476, cap: "所以上架前|先做三件事", keys: ["三件事"] },
    { dur: 3.145, cap: "第一，名字这一项|设成必须填写", keys: ["必须填写"] },
    { dur: 3.329, cap: "第二，说明里写清字数|再给个例子", keys: ["字数"] },
    { dur: 3.111, cap: "第三，发货前|到订单页核对名字", keys: ["核对名字"] },
    { dur: 5.073, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 5.052, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "Etsy 新手，卖什么好？" },
    { at: 0, instant: true, kind: "big", label: "别卖标品 · 卖", text: "能刻名字的", tone: "coral", sub: "同款太多，最后只能 **拼价格**" },
    { at: 2, clear: true, kind: "text", text: "我们自己的**木名牌、刺绣**，都按客户名字做", typing: 0.25 },
    { at: 3, kind: "text", text: "每件都不一样，买家**不好拿去比价**", typing: 0.2 },

    { at: 4, clear: true, kind: "text", text: "后台怎么设？**Etsy 帮助中心**写了 👇", typing: 0.2 },
    { at: 5, kind: "text", text: "商品编辑 → **定制选项** → 添加字段", typing: 0.2 },
    { at: 6, kind: "text", text: "3 种：**文本框 / 选项列表 / 上传**", typing: 0.2 },
    { at: 7, kind: "big", label: "一个商品最多", text: "5 个字段", tone: "coral", sub: "Etsy 帮助中心：Custom options", typing: 0.2 },

    { at: 8, clear: true, kind: "text", text: "名字用**文本框**，可以设成**必填**", typing: 0.2 },
    { at: 9, kind: "text", text: "设成**可选**的文本框，还能**单独加价**", typing: 0.2 },
    { at: 10, kind: "big", label: "单独加价 · 美元", text: "0.20–500", tone: "coral", sub: "只有 **可选文本框** 能加价", typing: 0.2 },
    { at: 11, clear: true, kind: "text", text: "买家填的名字，在**订单页**就能看到", typing: 0.2 },

    { at: 12, clear: true, kind: "todo", title: "上架前先做 3 件事",
      items: [{ at: 13, text: "名字字段设成必填" }, { at: 14, text: "说明里写清字数，再给个例子" }, { at: 15, text: "发货前到订单页核对名字" }] },
    { at: 15.6, kind: "note", text: "以 Etsy 帮助中心 How to Offer Personalized Listings 为准（2026-10-29 查阅）。" },

    { at: 16, clear: true, kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 16.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 17, kind: "follow", name: "TonyBook跨境", sub: "每天讲透一个跨境实操问题", pressAt: 17.5 },
  ],
};
