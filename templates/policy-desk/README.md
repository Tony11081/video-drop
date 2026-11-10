# 63 号 · 新闻快讯台（Policy Desk）

给「Etsy 政策速递」做的新外观：深色新闻台、粗白大字、**只有一个警示色**（红橙 `#ff4b1f`），官方原文和「该怎么做」用米白纸条。
竖屏 1080×1920、30 fps。配音、语速、背景音乐、选题台账、出片流程都和 56 号（`templates/policy-brief/`）一样，**只换画面**。

> 状态：2026-11-10 做的样片（EP.029 同一条旁白，方便和 56 号对比）。Tony 定了再把每天 08:37 的政策速递切到这个模板；没定之前每日任务仍用 56 号。

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

- **顶栏**：红底「快讯」+ ETSY 政策速递 + 期号；下面一条进度线，菱形节点对应 `rail`。
- **开头 hook / 结尾 cta**：实拍素材通栏 1080×608（y 262–870），下面紧贴一条新闻字幕条，再下面是大字结论（重点词红底白字）。素材窗口在联系表里是深灰占位，合成时才叠。
- **要点**：`RULE 01 / 03` + 大标题；事实行左边一条色边（白 = 成立，红橙 = 风险）。
- **谁吃亏 / 谁受益（split）**：坏的一栏深色加红橙顶边，好的一栏米白纸。按每栏里 ✕ 的多少自动判断。
- **我们的看法**：kicker 以 `OUR TAKE` 开头的场景，右上角自动盖「我们的看法」红章（带盖章音效），背景带一点红橙光。
- **来源**：字幕上方一条慢滚的来源条；7–10.5 秒让位给「关注」提示；结尾让位给网址小字。
- **字幕**：米白底黑字、左侧红橙边，高亮词红底白字，y≈1380。

## 出片

和 56 号的流程一样（见 `../policy-brief/README.md` 和 etsy-policy-brief-video 技能），区别只有：

1. `python3 check.py epNNN` → `python3 render.py epNNN auto` 看联系表 → `python3 render.py epNNN video`（两个进程各渲一半再无损拼接，约 6 分钟）。
2. `python3 sfx.py epNNN`，把 `sfx.wav` 合进 `picture.mp4`，推到仓库根目录，剪辑服务器 `import_video`。
3. `mux`：配音 Bo、`speed` 1.3、BGM `mixkit_driving_ambition.mp3` 0.1、original_volume 0.8、loudnorm。
4. 再 `render` 叠素材：`timing.json` 的 overlays，start 和 duration 除以 1.3，`layer: front`；素材窗口是 x 0、y 262、1080×608。

## 安全区

关键信息 y 262–1270，来源条 y≈1296，字幕 y≈1380，y 1500 以下留给平台按钮。
