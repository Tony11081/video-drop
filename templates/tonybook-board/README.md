# TonyBook 跨境 · 图解工作台模板（样片 2026-11-18，待 Tony 定）

想换掉 4 号极简杂志（`../tonybook-mag`）的原因：实拍素材是 Pexels 上找的通用镜头，和「我们怎么做」对不上（讲名牌编号配的是别人敲笔记本，讲名字图配的是工厂机器）。
所以这个模板不用外部素材，画面全部用代码画：产品（圣诞袜、木字母、亚克力名牌）、色卡、订单个性化框、名字图、清单。旁白讲到哪，画面就画到哪。

- 风格：米色手账纸 + 点阵、墨蓝粗描边卡片（硬投影）、唯一强调色珊瑚橙 `#FF6B4A`（沿用 TonyBook 品牌色）；顶部刊头 + 每章一格进度条；字幕是白底黑框贴纸。
- 和 Etsy-Tony 不混用：56 号暖白青柠、63 号新闻台、纪录片、微缩城市都不是这个样子。
- 配音、语速、BGM 不变（ElevenLabs Will，tts 内 1.3 倍，gap 0.15；`mixkit_dreaming_big.mp3` 0.1）。
- 出片全部在本地：`python3 render.py epNNN auto|sheet|video` → `out/epNNN/picture.mp4`（约 5–6 MB）→ 推到仓库根目录临时文件 → `import_video` → `mux`（voiceover + bgm）。不再需要 Pexels 搜素材、逐章切段，剪辑服务器只做混音，成片也小，手机下载快。

## 每期写 `episodes/epNNN.js`

`voice` 和 tonybook-mag 一样；画面写 `scenes`（场景种类见 `engine.js` 开头注释：cover / stocking / swatch / note / nameimg / todo / end）。
不同题材要新增图解场景（例如 SKU 拆段、激光排版、打包对 4 样），在 `engine.js` 里加一个 kind。

样片：ep022（圣诞袜名字木头还是亚克力，和杂志版同一条配音），成片 output e26fdb25f2c8。
