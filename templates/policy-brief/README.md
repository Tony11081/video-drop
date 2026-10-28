# Shopwright · Policy Brief 视频模板（v2）

「Etsy 政策速递」固定模板：竖屏 1080×1920、30 fps，配音固定 **Bo**（`zh-CN-Bo:MAI-Voice-2.1`），只给配音加速（现在 1.3 倍，配置里的 `speed`），画面动画保持正常速度。
视觉语言与 openaigrowth.com 首页一致（`src/components/tech-home.css`）：暖白底 `#f6f7f3`、点阵与颗粒、黑色金属渐变标题、
唯一信号色青柠 `#C8FF00`（文字用深绿 `#346a06`），警示色 `#a35300`，毛玻璃控制台、扫描光束、边框光绕行。动画只播一次、落定即停。

## 文件

- `episodes/epNNN.js`：每期唯一要写的文件，包括旁白分句（时长取自 tts 结果）、字幕、关键词，以及每句对应的场景。没有 `scene` 的句子沿用上一句的画面。
- `engine.js`：场景类型、时间轴、字幕切分、进度轨、音效提示点、素材叠加窗口（`OVERLAYS`）。
- `template.html`：设计系统和固定 HUD（字标、期号、进度轨、来源、字幕）；用 `?ep=ep002` 加载对应一期。
- `render.py`：`python3 render.py ep002 auto` 每个场景抽一帧出联系表；`python3 render.py ep002 video` 出无声画面和 `timing.json`。
- `check.py`：`python3 check.py ep012` 渲染前自检（钩子长度、前 30 秒节奏、静止时长、两次号召、音效密度、高亮词、卡片字数）。
- `sfx.py`：`python3 sfx.py ep002`，按 `timing.json` 合成原创 UI 音效 `sfx.wav`。
- `douyin-copy.md`：各期抖音文案。
- EP.001 用的是 v1 引擎（含 r-original / r-edit 等专用场景），源码在仓库历史提交里。

## 场景类型

`hook` 开场（图片或视频窗口）· `index` 目录 · `figure` 大数字 · `rows` 要点清单 · `path` 后台入口路径 · `stats` 数据条 ·
`ledger` 账单测算 · `balance` 余额等式 · `split` 左右对比 · `chips` 标签云 · `date` 日期/法规 · `checklist` 行动清单 · `cta` 结尾

字幕：用 `|` 强制断句；关键词不会被拆开；中英文按宽度切分，每行不超过 15 个汉字宽。

## 出一期新片

1. 用剪辑工具 `tts` 生成旁白（Bo，指令「专业、干脆的商业资讯播报…」）。每秒少于约 3.5 字的句子通常带长停顿，要拆短重生成。
2. 写 `episodes/epNNN.js`，运行 `render.py epNNN auto` 检查每个场景。
3. 动态素材只用 Mixkit「Stock Video Free License」的片段（每段都要打开页面核对，Restricted 的不能商用）。素材先用 `import_video` 导入，取 720p 直链 `assets.mixkit.co/videos/ID/ID-720.mp4`，再把 video_id 写进场景的 `video`。
4. `render.py epNNN video` → `sfx.py epNNN` → 把音效合进画面 → 推到 `Tony11081/video-drop` → `import_video`。
5. 服务器 `render`：clips 用整段，captions 设 none，effects 全部关闭，audio 不降噪；`overlays` 直接用 `timing.json` 的 overlays（layer 设 front）。
6. 导入上一步的成片，再 `mux`：voiceover.at 用 `timing.json` 的 at，BGM 用 `mixkit_driving_ambition.mp3`（音量 0.1），original_volume 0.8，speed 1.25，开启 loudnorm。

## 安全区

关键信息放在 y 300–1270，字幕固定在 y≈1380，y 1500 以下留给平台标题和按钮。示意数据标注「示意 · ILLUSTRATIVE」。

## 包装规矩（借鉴 digital-human-koubo 对头部博主的逐帧实测）

- **音效只给事件**：每个场景最多一个（取最强的：盖章 > 扫描 > 警示 > 确认 > 转场），间隔至少 8 秒，嘀嗒声不出。中文口播头部实测每分钟 1–3 个，从不每个切点挂一个。配置写 `sfx: "full"` 可恢复旧的满音效，`sfxGap` 改间隔。
- **刺激不断**：前 30 秒每 3–5 秒一个新视觉事件，全片静止不超过 8 秒（`check.py` 会报）。
- **号召两次**：7–10.5 秒（成片秒数）自动出一个「关注 · 每周一条 Etsy 政策速递」提示，出现时来源小字让位；结尾 cta 场景是第二次。`follow: "…"` 改文字，`follow: false` 关掉，`followAt: [a, b]` 改时间。
- **开场公式**：0–3 秒只说命题或后果（钩子一句 ≤ 3.5 秒）；3–15 秒给 3 个以上具体事实；结尾回扣开场那句话，不另起话题。
- **不编数据**：数字都来自原文，示意数据标「示意」。

## 要有自己的见解（Tony 10-28 定：不光是介绍政策）

每期必须有一个**我们自己的观点**，一句话能说清，而且敢下判断、有取舍（不是四平八稳的「各有利弊」）。
- **放哪里**：钩子可以直接就是观点（「这条新规，新店反而占便宜」）；正文里放一个「我们的看法」场景，kicker 写 `OUR TAKE · Shopwright 观点`，2–4 句。结尾 CTA 前回扣这个观点。
- **从哪几个角度想**（挑最有力的一两个）：
  1. Etsy 为什么出这条规定，背后想要什么（平台方向）；
  2. 对中国跨境卖家、代运营、手工定制小店意味着什么，谁占便宜谁吃亏；
  3. 大多数卖家会理解错、做错的地方；
  4. 换成我们会怎么做：先做什么、不做什么、怎么取舍。
- **底线**：观点必须从原文事实推出来，旁白和画面里说清是「我们的看法 / 我们判断」，绝不说成 Etsy 的规定；不编数据、不编客户案例、不承诺效果。拿不准的判断宁可说「我们的建议是……」，也不要装成事实。
- **文案**：抖音正文第一句放观点；评论区引导跟观点有关（「你同意吗？」「你会怎么选？」）。
