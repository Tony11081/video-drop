/* NO.037 · A · 一家四口一张单，名字图我们怎么拆（2026-11-26），tts a0ea24d53ed4（ElevenLabs v4 · will · tts 内 1.3 倍）
   A 类：只讲我们 Etsy 定制店一单多个名字怎么出图——一行一个名字、一行一张黑白图、不拼图；
   文件名用订单号 + 行号，切好的名字靠它对回每一只袜子；每一行的名字逐字照抄、颜色一行一行读；
   一行里写了两个名字先不出图，标「有问题」写原因，问清楚再做。
   依据运营台定制说明通用规则 1 / 2 / 3 / 4 / 5（逐字照抄、黑字白底、颜色由材料决定、两个名字不出图标有问题、一行一张 PNG 按 ORD-订单号-行号 命名）。
   无官方数字，不报单量、成本和耗时；没碰 Etsy-Tony EP.026 定制选项；和 ep015 出图、ep026 分批的区别是只讲一单多个名字怎么拆。
   配音：第一次整期 tts（verify 开）卡住 25 分钟以上没结束，改 verify=false 重出，每句时长正常，无漏句。
   素材（Pexels 免费商用，每章先切段再合成）：首页 6235606 圣诞树下放礼物｜CH.01 6814544 男士拿笔翻看文件｜
   CH.02 5971266 绿墙前拿笔看纸｜CH.03 6274630 系礼物丝带｜CH.04 5765774 牛皮纸礼盒俯拍。
   成片 output 89a2ad221255（46.7 秒）。封面：Codex IMG-20261126-001 做完配音和素材时还是待处理，没用封面。 */
window.EP = {
  speed: 1, lead: 0.1, tail: 2.2, footage: true,
  episode: "030", date: "11.26",
  // cover: "assets/ep030-cover.png",
  topic: "一家四口一张单，名字图我们怎么拆",
  source: "我们自己的做法（A 类，无官方数字）",
  tts: { id: "a0ea24d53ed4", voice: "elevenlabs/eleven-v4 · will · speed 1.3", gap: 0.15 },
  voice: [
    { dur: 2.685, cap: "一家四口一张单|我们出四张名字图", keys: ["四张名字图"] },
    { dur: 2.126, cap: "一行一张|从来不拼在一起", keys: ["不拼在一起"] },
    { dur: 2.16, cap: "一张单里的每一行|就是一个名字", keys: ["一个名字"] },
    { dur: 2.261, cap: "每个名字|单独出一张黑白图", keys: ["黑白图"] },
    { dur: 2.052, cap: "文件名用|订单号加行号", keys: ["订单号加行号"] },
    { dur: 2.481, cap: "切好的名字|靠它对回每一只袜子", keys: ["对回"] },
    { dur: 2.76, cap: "每一行的名字|都照客户写的逐字照抄", keys: ["逐字照抄"] },
    { dur: 2.636, cap: "颜色也一行一行读|不能照第一行套", keys: ["一行一行读"] },
    { dur: 2.777, cap: "哪一行写了两个名字|这一行先不出图", keys: ["先不出图"] },
    { dur: 2.968, cap: "标成有问题，写清原因|问清楚再做", keys: ["有问题"] },
    { dur: 2.431, cap: "一单多个名字|先做三件事", keys: ["三件事"] },
    { dur: 2.565, cap: "第一，一行一张图|不拼图", keys: ["一行一张图"] },
    { dur: 2.389, cap: "第二，用订单号加行号命名", keys: ["订单号加行号"] },
    { dur: 2.838, cap: "第三，一行写了两个名字|先标有问题", keys: ["先标有问题"] },
    { dur: 3.152, cap: "有店不知道上什么|可以来Etsy-Tony粉丝群找Tony", keys: ["Etsy-Tony粉丝群"] },
    { dur: 3.853, cap: "我是Tony Book跨境的助理|关注我，每天讲透一个跨境问题", keys: ["关注我"] },
  ],
  msgs: [
    { at: 0, instant: true, kind: "user", text: "一张单**四个名字**|怎么出图？" },
    { at: 0, instant: true, kind: "big", kicker: "Answer", label: "我们的做法", text: "一行一张图", tone: "coral", sub: "四个名字出四张，从来不拼在一起" },

    { at: 2, clear: true, chapter: "一行一张", kind: "text", text: "每一行，就是**一个名字**", typing: 0.2 },
    { at: 3, kind: "text", text: "每个名字，单独一张**黑白图**", typing: 0.2 },
    { at: 4, kind: "big", kicker: "Example", label: "文件名", text: "订单号-行号", tone: "coral", sub: "切好的名字，靠它对回每一只袜子" },

    { at: 6, clear: true, chapter: "逐行核对", kind: "text", text: "名字一行一行，**逐字照抄**", typing: 0.2 },
    { at: 7, kind: "text", text: "颜色也逐行读，**不照第一行套**", typing: 0.2 },
    { at: 8, kind: "big", kicker: "Answer", label: "一行写了两个名字", text: "先不出图", tone: "coral", sub: "标有问题、写清原因，问清楚再做" },

    { at: 10, clear: true, chapter: "先做三件事", kind: "todo", title: "一单多个名字先做 3 件事",
      items: [{ at: 11, text: "一行一张图，不拼图" }, { at: 12, text: "订单号加行号命名" }, { at: 13, text: "一行两个名字，先标有问题" }] },
    { at: 13.6, kind: "note", text: "我们自己定制店的做法，不含单量和成本。" },

    { at: 14, clear: true, chapter: "找 Tony", kind: "text", text: "有店不知道上什么？", typing: 0.2 },
    { at: 14.4, kind: "text", text: "来 **Etsy-Tony 粉丝群**找 Tony", typing: 0.2 },
    { at: 15, kind: "follow", name: "TONYBOOK · 跨境", sub: "每天讲透一个跨境实操问题", pressAt: 15.5 },
  ],
};
