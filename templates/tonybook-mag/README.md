# TonyBook 跨境 · 4 号极简杂志模板（v2，2026-10-31 Tony 定）

抖音号「助理－TonyBook跨境」专用，替换原来的 `tonybook-chat` 聊天模板（已停用）。和 Shopwright · 政策速递（暖白底、青柠绿、Bo 男声）是两个号、两套风格，**不混用**。

- **不和 Etsy-Tony 重复**：选题前先读 `templates/policy-brief/topics.md` 和 `douyin-copy.md`，那边讲过的规则 / 政策这边不做（见 `topics.md` 原则）。
- **风格**：模板库 4 号「极简杂志」——细线刊头（TONYBOOK · 跨境 / NO.xxx · 月.日）、章节标（CH.01 …）、衬线大标题、半透明深色卡片，唯一强调色珊瑚橙 `#FF6B4A`；字幕白字、关键词珊瑚色下划线。
- **背景是免费实拍素材**：每一章（每个 `clear` 页）铺一段 Pexels 免费商用视频，正常速度播放；文字、卡片、字幕是透明图层叠在上面。
- **配音固定 ElevenLabs Will**：tts `model elevenlabs/eleven-v4`，`voice will`，**`speed 1.3`**（只加速配音），`gap 0.15`，不写 instructions。英文名写成「Tony Book」带空格。
- **封面**：Codex 生图（生图任务队列，9:16，无文字），放进 `assets/epNNN-cover.png`，`EP.cover` 打开后就是第一帧，也是抖音封面。Codex 没出图就不用，第一页用素材垫底。
- 竖屏 1080×1920、30 fps；关键内容在 y 372–1300，字幕 y≈1350–1470，y 1500 以下留给平台按钮。

## 文件

- `episodes/epNNN.js`：每期唯一要写的文件。格式和老模板一样（`voice`、`msgs`），另外：
  - `speed: 1`、`footage: true`（配音已在 tts 里加速，时间轴就是成片时间轴）
  - `date: "11.01"`、可选 `cover: "assets/epNNN-cover.png"`
  - 每个 `clear: true` 的消息加 `chapter: "两到五个字"`（显示在 CH.0N 后面）
  - `big` 卡可加 `kicker: "Answer" / "Threshold" / "Example"`（卡片左上角小字，英文）
  - `user`（开头的提问）是封面大标题，用 `|` 断行，例如 `"站外广告扣 **15%**|能关吗？"`
  - 正文不要用 emoji
- `engine.js` / `template.html`：版式和动画。`render.py`：`auto` 出联系表；`overlay` 出透明图层 `out/epNNN/overlay.webm` 和 `timing.json`。
- `topics.md`：选题库。`douyin-copy.md`：各期抖音文案。

## 出一期

1. **选题**：`topics.md` 第一个没打勾、没标跳过的题；先对照 Etsy-Tony 发过的（见上），撞题就在那题后面写「跳过：和 Etsy-Tony 某期重复」换下一个。B/C 类数字只用官方原文，看更新日期。
2. **写旁白** 12–18 句，成片 40–55 秒；第一句直接给结果（3 秒内）；倒数第二段「先做三件事」；结尾「我是 Tony Book 跨境的助理，关注我…」。数字写汉字读法。
3. **封面**：同时往生图任务队列提一行（9:16，深色高级杂志感静物或场景，上半部留空给标题，不要文字、人物、品牌），用途写「TonyBook跨境抖音·封面+首帧（题目）」。取到图后删掉自己那一行。
4. **配音**：剪辑工具 `tts` 一次生成整期（Will，见上）。verify 标出的句子先看是不是读音差异（Will 的「到 / 店」常被听写成「倒 / 点」，可以接受）；真念错或漏念的改写后整期重来。把每句时长填进 `voice[].dur`。
5. `python3 render.py epNNN auto` 看联系表，修折行、溢出（中文正文一行约 14 字）。
6. **找素材**：每章一段。WebSearch `allowed_domains ["pexels.com"]` 搜「pexels vertical video + 关键词」，`import_video` 用 `https://www.pexels.com/download/video/<ID>/`，`get_frames` 看画面对不对题（不要有别人的 logo、水印、可读的品牌字）。
7. **切段（必须）**：剪辑服务器拼接**不同来源**的片段时不按 `end` 截断，会一直播到素材结尾。所以每章先单独 `render` 一次切成准确时长（`clips [{start, end}]`，captions none，effects 全关，audio 的 denoise/loudnorm 关；4K 素材也靠这一步转成 1080×1920），再 `import_video` 切好的结果。每章时长 = `timing.json` 里相邻两页开始时间之差（第一页从 0 开始，最后一页到 total）。剪辑服务器一次只跑一个渲染，排队就等。
8. `python3 render.py epNNN overlay` → 把 `overlay.webm` 复制到仓库根目录 `tonybook-NNN-overlay.webm` 推送（fetch + rebase 后推）。
9. **合成**：`render`，`video_id` 写第一段，`clips` 按顺序写每段 `{video_id, start 0, end 该段时长}`；`captions "none"`；`effects {drift 0, flash_first false, sfx false, progress_bar false}`；`audio {denoise false, loudnorm true}`；`overlays [{url: raw.githubusercontent.com/Tony11081/video-drop/<提交SHA>/tonybook-NNN-overlay.webm, start 0, x 0, y 0, w 1080, h 1920, layer "front"}]`；`voiceover {tts_id, at: timing.json 的 at, original_volume 0}`；`bgm {name "mixkit_dreaming_big.mp3", volume 0.1, fade_in 0.5, fade_out 2}`。先 `validate_spec`。checks 全过后 `get_frames` 抽 8 帧，逐页核对素材和章节对得上、字看得清。
10. 收尾：从仓库根目录删掉临时 webm；`topics.md` 打勾；`douyin-copy.md` 记文案（标题 ≤20 字，话题最多 5 个，正文不放网址和微信号）。
11. **手机发布**：手机 Chrome 打开成片下载链接 → 抖音「拍摄」→「相册」→ 选视频 → 下一步 ×2 → 标题 + 正文 → 封面选第一帧 → 「添加自主声明」选内容由 AI 生成（发布页第一次进去没有这一项，返回编辑页再点「下一步」才出现在「添加标签」下面）→ 不加地点 → 发作品。

样片：EP.005（2026-10-31，output 78a0d5ef4755）。
