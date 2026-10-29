# 科普治愈 · 视频模板（v1）

方向：一个自然现象（科学）→ 一句人生道理（治愈）。对标视频号「非米诺斯」「知的识次方」「世界慢一帧」那类，但审美自己定，不用黑底+发光粒子+金色衬线那一套。
竖屏 1080×1920、30 fps，和 policy-brief / tonybook-chat / etsytony-miniature 是不同方向，**不混用**。

## 固定项

- 配音固定 **Achernar**：model `google/gemini-3.8-flash-tts`，voice `Achernar`，instructions「温柔、平静的治愈系科普旁白，像深夜里轻声讲故事，句尾放轻，有停顿感，不要播音腔」，speed 1.3（只加速配音，画面正常速度），gap 0.5。
- 配乐每期按画面事件自己合成（见 `episodes/ep001-firefly/music.py`），不用曲库；也可用 mixkit ambient 当铺底。
- 结构：反直觉提问开头（3 秒内）→ 现象 → 一条简单规则 → 扩展到生活 → 一句能转发的收尾。
- 史实必须查证（`WebSearch`），查不到的写法改成不具体的说法。

## 旗舰模板：纸光 PAPERLIGHT（`paperlight.html`）

手工纸雕灯箱：月亮针孔、远山、中山、硫酸纸雾、割缝湖面、红树、芦苇、前景纸框共 7 层，每层有纸厚度边（顶边受光）、投影、纤维纹；暖光从最深处透出，萤火虫同步时整箱背光、雾、湖面反光一起呼吸。
开场各层像立体书一样由远到近弹起（`UNFOLD` 时刻，expo 缓动）；镜头 15 秒缓慢推进，各层按视差系数 p 位移。文字左对齐留白，逐字起落（`kinetic`），关键词琥珀色；页眉 `NO. 01 / SYNCHRONOUS FIREFLIES` 字距排版。
出样片：`python3 render.py paperlight video` → `python3 score_paperlight.py`（按 `out/paperlight-events.json` 的同步时刻对拍）→ ffmpeg 合成。
换题目：改 `kinetic(...)` 文案、`UNFOLD`、`K(t)` 同步时刻；换场景就改几何部分（`ridge`/`grow`/`reeds`），纸的材质函数 `paper()` 不动。

## 五套备选视觉模板（`looks.js`，`template.html?look=<名字>`）

| look | 名字 | 气质 | 底 / 字 / 强调色 | 字体 |
|---|---|---|---|---|
| `notes` | 博物笔记 | 19 世纪博物学家手账 | 米纸 `#f4ecd8` / 墨 `#2a2622` / 朱砂 `#b4382a` | Noto Serif CJK + DejaVu Serif italic |
| `blueprint` | 蓝图 | 工程图纸、图签、尺寸线 | 普鲁士蓝 / 白 `#dfe9f5` / 琥珀 `#ffcf5c` | Noto Sans CJK + DejaVu Sans Mono |
| `dawn` | 晨光 | 清晨渐变、留白、细字 | 桃→淡蓝渐变 / 深紫 `#3a3452` / 珊瑚 `#e06a3a` | Noto Sans CJK Light/Medium |
| `ink` | 水墨 | 宣纸、笔触、竖排、红印 | 宣纸 `#ece5d3` / 墨 `#17150f` / 朱 `#b4362a` | Noto Serif CJK（竖排） |
| `poster` | 海报 | 瑞士平面、大色块、硬切 | 米白 `#f1ece1` / 黑 / 红 `#d8432f` 蓝 `#1f3f8f` 黄 `#f0b62f` | Noto Sans CJK Black |

每套都实现同一个 10 秒样片节拍（`common.js` 的 `DEMO`：钩子 → 现象（各闪各的→同步）→ 收尾），方便横向比较。
`common.js` 提供：Kuramoto 同步模拟 `makeSwarm`、纸纹 `paperTexture`、颗粒 `grain`、暗角、横排 `textLine`（关键词强调色）、竖排 `textColumn`。

## 文件

- `template.html` + `common.js` + `looks.js`：模板本体。
- `render.py`：`python3 render.py <look|all> frames [t…]` 抽帧联系表；`python3 render.py <look|all> video` 出 10 秒无声样片到 `out/`。
- `episodes/ep001-firefly/`：第一期《萤火虫同步》的完整片（`film.html` 62.5 s 十个分镜、`music.py` 配乐、`render_film.js` 渲染、`script.md` 文案与制作记录）。这一期是定制画面，不走 looks。

## 出一期（定好 look 之后）

1. 写文案 10–12 句（≤ 1 分钟），史实查证；用剪辑工具 `tts`（Achernar，见上）生成，记下每句时长。
2. 按 ep001 的方式写该期的分镜脚本（或在 looks 基础上扩展场景），渲染无声画面；`music.py` 按事件合成配乐。
3. 画面推到 `Tony11081/video-drop` 根目录 → `import_video`（raw.githubusercontent.com 提交 SHA 链接）→ `mux`（voiceover.at 按句起点，bgm 用配乐 mp3 直链，音量 0.4，loudnorm）。
4. `get_frames` 抽帧检查字幕和同步画面。
