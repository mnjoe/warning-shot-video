#!/usr/bin/env python3
"""Render Warning Shot frames with a chosen theme.

  python3 render.py --theme pirate-flat --from 27.86 --to 44.79 --out chorus.mp4 --audio song.mp3
  python3 render.py --theme newsprint --stills 28.9,30.9,33.1,36.9,38.6,43 --out preview   # contact sheet
"""
import argparse, os, subprocess, sys, time
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--theme', default='pirate-flat')
ap.add_argument('--from', dest='t0', type=float, default=0)
ap.add_argument('--to', dest='t1', type=float, default=None)
ap.add_argument('--fps', type=int, default=30)
ap.add_argument('--res', type=int, default=720, choices=[720, 1080])
ap.add_argument('--audio', help='song MP3; muxes the matching slice under the video')
ap.add_argument('--stills', help='comma-separated times; writes PNGs and a contact sheet instead of video')
ap.add_argument('--debug', action='store_true', help='burn shot id, time and beat into a corner (review renders only)')
ap.add_argument('--final', action='store_true', help='upload quality: sharper frame capture and encode (slower)')
ap.add_argument('--out', required=True)
a = ap.parse_args()

scale = a.res / 720
with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=scale)
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(f'file://{HERE}/engine/stage.html?theme={a.theme}')
    pg.evaluate('window.READY')
    if errs: sys.exit('page errors: ' + '; '.join(errs))

    if a.stills:
        from PIL import Image
        ts = [float(x) for x in a.stills.split(',')]
        files = []
        for t in ts:
            sid = pg.evaluate(f'render({t}, {str(a.debug).lower()})')
            fn = f'{a.out}_{t:07.2f}.png'; pg.screenshot(path=fn); files.append((fn, sid, t))
        cols = 2; rows = (len(files) + 1) // 2
        sheet = Image.new('RGB', (1280, 360 * rows), 'black')
        for i, (fn, sid, t) in enumerate(files):
            sheet.paste(Image.open(fn).resize((640, 360)), ((i % cols) * 640, (i // cols) * 360))
        sheet.save(f'{a.out}_sheet.png')
        print('stills:', [(sid, t) for _, sid, t in files], 'sheet:', f'{a.out}_sheet.png', 'errors:', errs)
        sys.exit()

    if a.t1 is None: sys.exit('--to is required for video')
    n = int(round((a.t1 - a.t0) * a.fps))
    silent = a.out + '.noaudio.mp4' if a.audio else a.out
    ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', str(a.fps), '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium' if a.final else 'veryfast', '-crf', '16' if a.final else '20', '-pix_fmt', 'yuv420p', silent], stdin=subprocess.PIPE)
    st = time.time()
    for i in range(n):
        pg.evaluate(f'render({a.t0 + i / a.fps:.4f}, {str(a.debug).lower()})')
        ff.stdin.write(pg.screenshot(type='jpeg', quality=98 if a.final else 92))
        if i % 150 == 0: print(f'{i}/{n} frames, {time.time() - st:.0f}s', flush=True)
    ff.stdin.close(); ff.wait()
    print(f'{n} frames in {time.time() - st:.0f}s; errors: {errs[:5]}')

if a.audio:
    d = a.t1 - a.t0
    pad = max(0.0, -a.t0)   # pre-roll: negative song time is silence before the track starts
    fx = f'adelay={int(round(pad * 1000))}:all=1,' if pad else 'afade=t=in:d=0.15,'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(max(0.0, a.t0)), '-t', str(d - pad), '-i', a.audio, '-vn',
                    '-af', fx + f'apad,atrim=0:{d:.3f},afade=t=out:st={max(0, d - 0.43):.2f}:d=0.43', '-c:a', 'aac', '-b:a', '320k' if a.final else '192k', a.out + '.m4a'], check=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', silent, '-i', a.out + '.m4a', '-map', '0:v', '-map', '1:a',
                    '-c', 'copy', '-shortest', '-movflags', '+faststart', a.out], check=True)
    os.remove(silent); os.remove(a.out + '.m4a')
    print('wrote', a.out)
