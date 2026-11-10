# Hype reel（快节奏卡点混剪）· Etsy 政策速递栏目预告

20 秒、1080×1920、30 fps、150 BPM（一拍 0.4 秒 = 12 帧，所有切点都落在整帧上）。全部在工作区本地出片，不经过剪辑服务器。

- `reel.html`：画面。`FACTS`（6 条，每条 4 拍：数字砸下 → 说明 → 青柠条 → 停）、`WORDS`（8 个词，每拍一个）、`HOOK`、结尾卡。只写已出期数里核实过的事实；背景是网站自己的配图（`assets/`），不是外部素材。
- `score.py`：原创合成配乐（鼓、贝斯、和弦都是代码生成，没有采样），输出 `out/score.wav`，拍点和画面一一对应。
- `render.py`：`python3 render.py sheet 1.7 2.3 …` 出联系表；`python3 render.py video` 出 `out/picture.mp4`。
- 合成：`ffmpeg -i out/picture.mp4 -i out/score.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000 -c:a aac -b:a 256k out/reel.mp4`

注意（2026-11-10）：试过把透明层（VP9 webm）叠在服务器上的 Mixkit 素材上（19 段切片 + 整幅透明层 + bgm），剪辑服务器两次都在「合成成片」阶段 502 重启，没再试第三次，原因没查。
