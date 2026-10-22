# Shopwright · Policy Brief 视频模板

竖屏 1080×1920、30 fps 的「政策速递」模板，视觉语言与 openaigrowth.com 首页一致（`src/components/tech-home.css`）：
暖白底 `#f6f7f3` + 点阵 + 颗粒，黑色金属渐变标题，唯一信号色青柠 `#C8FF00`（深绿 `#346a06` 用于文字），警示用 `#a35300`，
毛玻璃控制台带顶边高光、扫描光束、边框光绕行一圈。所有动画只播放一次、落定即停。

## 文件

- `episode.js` — 每期唯一需要改的文件：配音分句、字幕、关键词、每句对应的场景和内容。
- `engine.js` — 场景类型、时间轴、字幕切分、进度轨、音效提示点。
- `template.html` — 设计系统（颜色、字体、组件样式）和固定 HUD（字标、期号、进度轨、来源、字幕）。
- `render.py` — `python3 render.py sheet 4.8 16.5 …` 出样帧；`python3 render.py video` 出无声画面 `out/picture.mp4`。
- `sfx.py` — 根据 `out/timing.json` 合成 UI 音效 `out/sfx.wav`（原创合成，无版权素材）。

## 场景类型

`hook` 开场钩子（大图 + 扫描 + 三行标题）· `index` 目录（数字滚动 + 条目）· `r-original` 实物原图核验 ·
`r-edit` 原图/修图对比 + 误导图盖章 · `r-guide` 教程类禁止 · `r-case` 纠纷流程与退款金额 · `r-bot` 批量上架被下架 ·
`detect` 上传识别 + 举报菜单 · `verdict` 允许/不允许清单 · `law` 法规编号 + 生效倒计时 · `checklist` 行动清单 · `cta` 结尾

## 出一期新片

1. 写好 12 句左右的旁白，用剪辑工具 `tts` 生成（音色 `zh-CN-Mei:MAI-Voice-2.1`），把每句 `duration` 和 `tts_id` 填进 `episode.js`。
2. 需要的图片按 codex-image-generation 流程提交给 Codex，放进 `assets/`。
3. `render.py sheet` 抽帧检查 → `render.py video` → `sfx.py` → 合成音效进画面。
4. 推到 `Tony11081/video-drop`，`import_video` 导入剪辑工具，`mux` 合成配音和 BGM，`speed` 与 `episode.js` 里的 `speed` 一致（本期 1.25）。

## 安全区

关键信息在 y 300–1270；字幕固定在 y≈1380；y 1500 以下留给抖音/视频号的标题和按钮。示意图片都标注「示意图 · ILLUSTRATIVE」。
