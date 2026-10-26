#!/usr/bin/env python3
"""成片实测（全部在 video.mp4 / 母带分轨上测）：时长、帧数、分辨率、帧率、编码、音频、响度、AAC 后真峰值、
黑帧、音效起音与节拍表的偏差、音效轨响度。用法：python3 check.py m001"""
import json, os, re, subprocess, sys
import numpy as np
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__)); ep = sys.argv[1]; OUT = os.path.join(HERE, 'out', ep)
cue = json.load(open(os.path.join(HERE, 'episodes', ep + '.json'), encoding='utf-8'))
video = os.path.join(OUT, 'video.mp4')
def run(a): return subprocess.run(a, capture_output=True, text=True)
pr = json.loads(run(['ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', video]).stdout)
v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next((s for s in pr['streams'] if s['codec_type'] == 'audio'), None)
res = {
  'path': video, 'duration_s': float(pr['format']['duration']), 'video_duration_s': float(v.get('duration', 0)),
  'frames': int(v['nb_read_frames']), 'resolution': f"{v['width']}x{v['height']}", 'fps': v['r_frame_rate'], 'vcodec': v['codec_name'], 'pix_fmt': v['pix_fmt'],
  'audio': None if not a else f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']}ch",
}
r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', video, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
res['LUFS_I'] = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); res['truePeak_dBTP_afterAAC'] = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
bd = run(['ffmpeg', '-hide_banner', '-nostats', '-i', video, '-vf', 'blackdetect=d=0.05:pic_th=0.95', '-an', '-f', 'null', '-']).stderr
res['black_segments'] = re.findall(r'black_start:[\d.]+ black_end:[\d.]+', bd)
# 音效起音偏差：audio.py 对每个事件单独量了自身起音（不受底噪和重叠声音干扰）
cues = json.load(open(os.path.join(OUT, 'cues_audio.json')))
dev = [{'cue': c['name'], 't_cue': c['t'], 't_onset': c['onset'], 'dev_ms': c['dev_ms']} for c in cues if 'onset' in c]
res['audio_sync'] = dev; res['audio_sync_max_ms'] = max(abs(q['dev_ms']) for q in dev) if dev else None
L = json.load(open(os.path.join(OUT, 'loudness.json'))); res['sfx_stem_LUFS'] = L['sfx_stem_I']; res['music_stem_LUFS'] = L['music_stem_I']
json.dump(res, open(os.path.join(OUT, 'checks.json'), 'w'), ensure_ascii=False, indent=1)
for k, val in res.items():
    if k != 'audio_sync': print(f'{k}: {val}')
for q in dev: print(f"  {q['cue']:<18} cue {q['t_cue']:6.3f}  onset {q['t_onset']:6.3f}  {q['dev_ms']:+.1f} ms")
