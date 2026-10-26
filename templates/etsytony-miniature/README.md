# Etsy-Tony · 移轴微缩模板（v1）

抖音号 **Etsy-Tony** 专用的「移轴微缩摄影」动态模板：一座 1:150 的玩具城市沙盘（发货街区 → 河港 → 快线站台 → 桌上沙盘揭示），
竖屏 1080×1920、30 fps。和 TonyBook跨境 的聊天模板、Shopwright 的政策速递模板是不同方向，**不混用**。

每期只写一份节拍表 `episodes/<id>.json`，画面（`render.py`）和声音（`audio.py`）都从它读时间，不手抄。

## 风格要点（每期都要守住）

1. 高机位俯拍：俯角 41–55°，`camera.fov` 30°（真实透视，非等轴测）。
2. 焦带：倾斜焦平面，按像素到焦平面的世界距离算弥散圈（`post.js`），`focus.sharp` = 清晰半厚度（米），`k` = 每米多少像素的虚化。
3. 玩具感：Phong 塑料高光、硬阴影、提饱和/对比、暗角（`grade`）。
4. 时间加速：车速 15–22 m/s、行人走路动作 12 fps 定格。
5. 尺度线索：车流、停车场、行人、行道树、屋顶空调、斑马线。
6. 运镜只平移/推拉；跟拍用 `camera.track`（速度连续）。
7. 镜头之间用拉焦转场：`focus.blur` 0→1→0，相机在全虚时移动，配「失焦」音效。

## 节拍表字段

| 字段 | 作用 |
|---|---|
| `brand` | `{name, short}`：仓库招牌、列车涂装、旗子、集装箱上的品牌字 |
| `title` | 结尾铭牌：`main`（主字）、`sub`（副标题）、`scale`、`width`（铭牌宽，米；226 时主字约 80 px） |
| `events` | 所有动作的时间点（信号灯、公交、反光、两次拉焦、道口落杆、列车入画、鸟群、揭示、标题） |
| `train` | `cars`、`carLen`、`s0`（入画时车头沿线位置）、`speed` |
| `camera.keys` | `{t, target 或 rail:[s,off,y], dist, pitch, yaw, trackMix, ease}`；`ease` 作用于从上一个关键帧到本帧 |
| `camera.track` | 跟拍：慢推 → 匀加速 → 与车同速 → 匀减速 |
| `focus.keys` | `sharp`、`k`、`cocMax`、`blur`、`angle`（0 横向 → 1 沿快线）、`tilt`（0 垂直视线 → 1 竖直贴线）、`railMix`、`ahead` |
| `sun.keys` / `grade.keys` | 太阳方位/高度/颜色、天光；曝光、饱和、对比、暖色、泛光 |
| `render` | 快门（帧宽）、每段子帧数（动态模糊）、哪些时段每个子帧都更新阴影 |
| `keyframes` | 关键帧检查的时刻 |
| `audio` | 配乐分段与乐器、音乐/音效增益 |

## 出一期

1. 复制 `episodes/m001.json` 改名，改 `brand`、`title`、`events`、相机与焦点关键帧。
2. 关键帧：`python3 render.py <id> keys - 0.5`（半分辨率联系表，约 2 分钟），逐张看构图和焦带位置。
3. 动作预览：`python3 render.py <id> preview 0.4`（每帧 1 个子帧，约 10 分钟），查死段、快动作。
4. 成片画面：`python3 render.py <id> video 0 300` 和 `video 300 600`（全分辨率，每段约 1–1.5 小时，**用后台任务跑**），
   再 `ffmpeg -f concat` 拼成 `out/<id>/picture.mp4`。
5. 声音：`python3 audio.py <id>` → `python3 master.py <id>`（−14 LUFS、AAC 后真峰值 ≤ −1 dBTP，自动迭代）→ `out/<id>/video.mp4`。
6. 检查：`python3 check.py <id>`（时长、帧数、分辨率、响度、真峰值、黑帧、音效起音偏差、分轨响度）。
7. 要配音时：沿用 Etsy-Tony 方向固定的配音（定下后写在这里），只在 mux 里加速 1.3 倍，画面不动。

## 环境说明

- 没有显卡：Chromium + SwiftShader 软件渲染。单个子帧全分辨率约 2.5–3 秒；20 秒片子约 2800 个子帧。
- Three.js 从 GitHub 标签 r170 取（npm 在这个环境被拦），已放在目录里。
- 字体只用系统的 Noto Sans CJK SC（OFL）。素材与许可见 `CREDITS.md`。
