/* Episode config — the only file to change for a new Policy Brief.
   voice: one entry per TTS segment, same order as the tts call.
     dur  = segment duration from the tts result (seconds)
     cap  = caption text as displayed (digits instead of spoken numbers)
     keys = words highlighted in the caption
   scene: which scene type plays under that line, plus its content.
   Times inside scenes are in OUTPUT seconds (after the final speed-up). */
window.EP = {
  speed: 1.25,            // final mux speed; the engine pre-compensates animation timing
  lead: 0.30,             // voice starts this many voice-seconds after frame 0
  tail: 3.2,              // hold after the last line (voice-seconds)
  episode: "EP.001",
  date: "2026.10.22",
  source: "SOURCE · ETSY SELLER HANDBOOK · 2026.10.22",
  tts: { id: "971624198a8b", voice: "zh-CN-Bo:MAI-Voice-2.1", gap: 0.3 },
  rail: ["01", "02", "03", "04", "05"],
  voice: [
    { dur: 4.647, cap: "Etsy刚改了规则：你用AI做的产品图，可能让你倒贴退款", keys: ["倒贴退款"],
      scene: { type: "hook", img: "assets/img006.png", kicker: "ETSY · AI POLICY UPDATE",
               lines: ["你的 AI 产品图", "可能让你"], marked: "倒贴退款", scanTag: "AI GENERATED ?" } },
    { dur: 5.149, cap: "10月22日，Etsy发布AI使用新规，重点就5条", keys: ["5条"],
      scene: { type: "index", label: "ETSY SELLER HANDBOOK", date: "2026.10.22", n: 5,
               title: ["AI 使用新规"], sub: "重点就五条",
               items: ["至少一张实物原图", "修图不能变样", "教程类禁止 AI 生成", "不达标，退款你扛", "机器人上架即下架"] } },
    { dur: 7.676, cap: "每个商品至少要有一张完全没修过的实物照片，背景也必须是真的", keys: ["完全没修过", "实物照片"],
      scene: { type: "r-original", rule: 1, title: ["至少一张", "未编辑实物原图"], img: "assets/img003.png",
               file: "listing_photo_01.jpg", tags: ["未编辑 · UNEDITED", "真实背景 · REAL"] } },
    { dur: 9.395, cap: "其他图可以用AI调光、调色、换背景，但不能让商品和实物不一样", keys: ["不能"],
      scene: { type: "r-edit", rule: 2, title: ["可以修图", "不能变样"], raw: "assets/img003.png", fake: "assets/img004.png",
               okTags: ["调光", "调色", "裁剪 / 换背景"], stamp: "与实物不符" } },
    { dur: 8.679, cap: "纸样、食谱、教程这类功能性指南，不能再用AI生成，还要放按教程真实做出来的成品", keys: ["不能再用AI生成", "真实"],
      scene: { type: "r-guide", rule: 3, title: ["教程类", "禁止 AI 生成"], img: "assets/img005.png",
               doc: "PATTERN_GUIDE.pdf", docTag: "AI 生成内容", okTag: "按教程做出的真实成品" } },
    { dur: 8.737, cap: "图片不达标，买家又以货不对板开纠纷，退款可能要你来承担", keys: ["退款"],
      scene: { type: "r-case", rule: 4, title: ["图片不达标", "退款你来扛"],
               steps: ["买家收到货", "开启纠纷 · 与描述不符", "核对商品图片", "卖家承担退款"], amount: 48 } },
    { dur: 6.059, cap: "完全没有人参与、机器人批量生成的商品，会被下架，严重的整店移除", keys: ["下架", "整店移除"],
      scene: { type: "r-bot", rule: 5, img: "assets/img004.png", title: ["机器人上架", "直接下架"], pill: "严重者 · 整店移除" } },
    { dur: 9.321, cap: "以后上传图片，平台会识别AI图并给出提示，买家也能举报误导性的AI图片", keys: ["识别AI图", "举报"],
      scene: { type: "detect", title: ["平台开始", "识别 AI 图"], img: "assets/img004.png",
               notice: "检测到可能由 AI 生成的图片", tip: "请确保图片如实展示买家将收到的商品",
               menu: ["与描述不符", "侵犯知识产权", "误导性 AI 图片"] } },
    { dur: 10.138, cap: "AI艺术品还能卖，但要有真正的创作参与，并如实说明用了AI", keys: ["如实说明"],
      scene: { type: "verdict", kicker: "AI ART · 仍然允许", title: ["AI 艺术品", "还能卖"],
               rows: [["ok", "有真实的创作参与"], ["ok", "如实披露使用了 AI"], ["bad", "冒充手工或纯原创"]] } },
    { dur: 9.093, cap: "卖美国还要注意：加州新法2027年1月1日起，AI生成的逼真人物可能需要明确标注", keys: ["明确标注"],
      scene: { type: "law", kicker: "CALIFORNIA · USA", code: "SB 1050", eff: "2027.01.01", days: 71,
               line: ["AI 生成的逼真人物", "出现在图片或视频里"], must: "可能需要明确标注" } },
    { dur: 11.717, cap: "今晚就做三件事：补一张实物原图，最真实的放首图，用过AI修图的写进描述", keys: ["三件事"],
      scene: { type: "checklist", kicker: "TODO · TONIGHT", title: ["今晚", "做三件事"],
               items: ["每个商品补一张实物原图", "最真实的那张放首图", "AI 修过图，写进描述"], at: [0.36, 0.6, 0.8] } },
    { dur: 3.058, cap: "合规又好看的产品图，交给Shopwright", keys: ["Shopwright"],
      scene: { type: "cta", img: "assets/product-photo.webp", title: ["合规又好看的", "产品图"],
               word: "Shopwright", url: "openaigrowth.com", note: "独立平台 · 与 Etsy 无关联" } }
  ]
};
