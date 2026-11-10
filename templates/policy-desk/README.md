# 63 号 · 新闻快讯台（Policy Desk，国际新闻台风格）

给「Etsy 政策速递」做的新外观，照国际大新闻频道的 breaking news 做法：深蓝演播室 + 转动的线框地球、新闻红、白色标题条、
英文用窄体斜体大字（Barlow Condensed，OFL 授权，字体文件在 `fonts/`）。是自己的原创设计，不带任何电视台的台标和专有样式。
竖屏 1080×1920、30 fps。配音、语速、背景音乐、选题台账、出片流程都和 56 号（`templates/policy-brief/`）一样，**只换画面**。

> 状态：2026-11-10 做的样片（EP.029 同一条旁白，方便和 56 号对比）。v1 是深色 + 红橙，Tony 要「CNN 那种国际大频道的 breaking news」，同一天改成现在的 v2。
> Tony 定了再把每天 08:37 的政策速递切到这个模板；没定之前每日任务仍用 56 号。

## 和 56 号的关系

- **配置通用**：读同一种 `window.EP`（`episodes/epNNN.js`）。这里的 `episodes/` 没有的期号，会自动去 `../policy-brief/episodes/` 找，所以 56 号的任何一期都能直接用这个外观渲染：`python3 render.py ep028 auto`。
- `assets` 是指向 `../policy-brief/assets` 的链接；`sfx.py`、`check.py` 是 56 号的原样拷贝。
- 多一种场景 `quote`（官方原文纸条，划重点）：
  ```js
  scene: { type: "quote", rule: 1, title: ["申诉", "全员开放"], meta: "ETSY COMMUNITY · 官方回复",
           en: "Listing appeals are now available to all Etsy sellers.", mark: "all Etsy sellers", markAt: 0.45,
           zh: "下架申诉，已对所有卖家开放", rows: [["plain", "原计划", "2026 年底前 · 现在提前了"]], on: [1.05] }
  ```
  `en` 只放原文里很短的一句（不超过十几个词），`mark` 是要划的词，`markAt` 是划线出现在第几句（可带小数）。

## 画面结构

- **顶栏**：红底地球标 + ETSY 政策速递 / GLOBAL SELLER BRIEFING；右边「最新」+ 期号 + 日期（配置里写 `date: "2026-11-10"`，不写就用当天）。下面一条进度线，菱形节点对应 `rail`。
- **开场（hook）**：前 0.95 秒在素材窗口里放 BREAKING NEWS 突发大字开场（带一声低音 + 上扬气声），然后收进字幕条，实拍素材淡入。`sting: false` 可关掉开场。
  素材通栏 1080×608（y 262–870）；下面紧贴两层字幕条（红 BREAKING NEWS + 白「快讯」+ 蓝底英文 kicker）；再下面是标题条：每行一条白底深蓝字，重点那行红底白字。
- **结尾（cta）**：同样的素材窗口和字幕条（观点类写 ANALYSIS · 观点），标题条最后一行红底。网址只有小字。
- **要点**：红色斜切标签 `RULE 01` + `OF 03`，大标题白字；事实行是蓝色玻璃条，左边色边（白 = 成立，红 = 风险）。
- **谁吃亏 / 谁受益（split）**：坏的一栏蓝玻璃 + 红色栏头，好的一栏白底 + 深蓝栏头。按每栏里 ✕ 的多少自动判断。
- **我们的看法**：kicker 以 `OUR TAKE` 开头的场景，标签自动变成「ANALYSIS · 我们的看法」，背景带一点红光，带一声低音。
- **转场**：每次换场景有一道红白斜条扫过。
- **底部滚动条**：通栏，红色「最新 LATEST」+ 来源慢滚 + 右边网址小字；7–10.5 秒让位给「关注」提示；结尾隐藏。
- **字幕**：白底深蓝字、左侧红边，高亮词红底白字，y≈1384。

## 出片

和 56 号的流程一样（见 `../policy-brief/README.md` 和 etsy-policy-brief-video 技能），区别只有：

1. `python3 check.py epNNN` → `python3 render.py epNNN auto` 看联系表 → `python3 render.py epNNN video`（两个进程各渲一半再无损拼接，约 6 分钟）。
2. `python3 sfx.py epNNN`，把 `sfx.wav` 合进 `picture.mp4`，推到仓库根目录，剪辑服务器 `import_video`。
3. `mux`：配音 Bo、`speed` 1.3、BGM `mixkit_driving_ambition.mp3` 0.1、original_volume 0.8、loudnorm。
4. 再 `render` 叠素材：`timing.json` 的 overlays，start 和 duration 除以 1.3，`layer: front`；素材窗口是 x 0、y 262、1080×608。

## 安全区

关键信息 y 262–1285，滚动条 y 1304–1350，字幕 y≈1384，y 1500 以下留给平台按钮。
