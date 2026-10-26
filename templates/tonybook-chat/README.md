# TonyBook 跨境实操 · 助理聊天模板（v1）

抖音号「助理－TonyBook跨境」专用。和 Shopwright · Policy Brief（暖白底、青柠色、Bo 男声）是两个号、两套风格，**不混用**。

- 内容：跨境实操干货（Etsy / Shopify / 亚马逊），一条讲透一个问题，数字和规则只用官方原文。
- 风格：深色聊天界面，「Tony 助理」一条条发消息讲重点；粉丝提问用蓝色气泡，强调色珊瑚橙 `#FF6B4A`，确认色薄荷绿 `#3DDC97`。
- 配音固定 **Lan**：`microsoft/mai-voice-2.1`，`zh-CN-Lan:MAI-Voice-2.1`，instructions 只写「亲切的女助理，语速偏快，口语化。」（写长了模型会把说明念出来）。英文名写成「Tony Book」带空格，否则会念错。
- 配音 1.3 倍速，只在 mux 里加速（`speed: 1.3`）；BGM 固定 `mixkit_dreaming_big.mp3`，音量 0.1。
- 竖屏 1080×1920、30 fps。关键信息在 y 372–1300 的聊天区，字幕在 y≈1350–1470，y 1500 以下留给平台按钮。

## 文件

- `episodes/epNNN.js`：每期唯一要写的文件。`voice` 是逐句旁白（时长取自 tts 结果，字幕 `cap` 用 `|` 强制断句，`keys` 黄色高亮）；`msgs` 是聊天消息。
- `engine.js`：消息排版、打字中动画、翻页、卡片动画、字幕、音效提示点。
- `template.html`：设计系统和固定界面（顶栏、置顶话题、来源行）。
- `render.py`：`python3 render.py epNNN auto` 每页抽一帧出联系表；`python3 render.py epNNN video` 出无声画面和 `timing.json`。
- `sfx.py`：`python3 sfx.py epNNN` 合成音效（发送、气泡、计数、确认、翻页），原创合成，无授权素材。
- `douyin-copy.md`：各期抖音标题和正文。

## 消息类型（`msgs`）

`at` 是旁白位置：`3` 是第 3 句开头，`3.5` 是第 3 句一半。`clear: true` 翻到新的一页。文字里 `**词**` 是珊瑚色高亮。

| kind | 用途 | 字段 |
|---|---|---|
| `user` | 粉丝提问（右侧蓝气泡），一般放开头当钩子 | `text` |
| `text` | 助理气泡 | `text`, `typing`（打字时长，默认 0.4） |
| `big` | 大数字卡 | `label`, `text`, `tone: "coral"`, `count`/`pre`/`dec`（数字滚动）, `sub` |
| `bill` | 账单（逐行扣钱 + 合计） | `title`, `tag`, `rows: [{at, label, sub, amt}]`, `total: {at, label, amt}` |
| `cmp` | 两栏对比 | `title`, `cols: [{at, name, rate, fee, hot}]`, `badge: {at, text}`, `foot` |
| `todo` | 行动清单（逐条打勾） | `title`, `items: [{at, text}]` |
| `follow` | 结尾关注卡 | `name`, `sub`, `pressAt`（按下「关注」的时刻） |
| `note` | 小字补充（无头像） | `text` |

## 出一期

1. 查官方原文（帮助中心、政策页，看更新日期），只用原文里的数字；示意计算标「示意」，在 `source` 写清来源和日期。
2. 写旁白：10–25 句短句，第一句是钩子（数字或后果），倒数第二段是「先做三件事」，结尾「我是 Tony Book 跨境的助理，关注我…」。数字写汉字读法。
3. 剪辑工具 `tts` 一次生成整期（Lan，见上）。每秒少于约 3.5 字、或 verify 听写出现无关内容的句子，拆短后整期重来；把时长填进 `voice[].dur`。
4. `render.py epNNN auto` 看联系表，修折行、溢出、空页。
5. `render.py epNNN video` → `sfx.py epNNN` → ffmpeg 把 `sfx.wav` 合进 `picture.mp4` → 推到 `Tony11081/video-drop` 根目录 → `import_video`（raw.githubusercontent.com 的提交 SHA 链接）。
6. `mux`：voiceover `{tts_id, at: timing.json 的 at}`，bgm `mixkit_dreaming_big.mp3` 音量 0.1、fade_in 0.5、fade_out 2，original_volume 0.8，loudnorm，**speed 1.3**。get_frames 抽帧检查。
7. 手机发布：手机 Chrome 打开成片下载链接 → 抖音「拍摄」→「相册」→ 选视频 → 下一步 ×2 → 标题（≤20 字）+ 正文 → 封面选开头提问那一帧 → 「添加自主声明」选内容由 AI 生成 → 不加地点 → 发作品。
