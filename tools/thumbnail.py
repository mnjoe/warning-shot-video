#!/usr/bin/env python3
"""YouTube thumbnail (1280x720) composed from the theme's rigs, so it matches the video.

  python3 tools/thumbnail.py "IT WENT ROGUE?" thumb.png [--theme pirate-flat]

The AI LAB glove loads a cannonball into the WARNING SHOT cannon while a pirate bot shrugs. Big text across the top.
"""
import argparse, json, os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('text'); ap.add_argument('out'); ap.add_argument('--theme', default='pirate-flat')
a = ap.parse_args()

JS = """(text) => {
  const t = 3.2;
  let s = R.deck(t);
  // the cannon, aimed up and to the right, with the glove pushing a ball into the muzzle
  const cx = 600, cy = 560, cs = 1.85, ang = -12, ar = ang * Math.PI / 180;
  const mx = cx + Math.cos(ar) * 150 * cs, my = cy + Math.sin(ar) * 150 * cs;   // muzzle (the barrel pivots at the cannon's origin)
  s += R.cannon({ x: cx, y: cy, s: cs, angle: ang, label: SONG.labels.cannon });
  s += R.cannonball(mx + 24, my);
  s += R.hand({ x: mx + 84, y: my - 4, s: 1.25, rot: -4, curl: 1, label: SONG.labels.hand });
  // a pirate bot shrugs at the camera: who, me?
  s += R.bot({ x: 215, y: 700, s: 2.5, t, variant: 1, shrug: 1, look: -2 });
  s += R.sfx(330, 330, 1, '?', 12, 120);
  // headline
  const size = fitSize(text, 132, TK.font.display, 1080);
  s += txt(640, 172, text, size, col('paper'), { font: TK.font.display, stroke: col('ink'), sw: 26 });
  s += txt(640, 172, text, size, col('live'), { font: TK.font.display, stroke: col('ink'), sw: 6 });
  s += R.liveTag(t, 'live') + R.bug(t);
  document.getElementById('root').innerHTML = s;
}"""

with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'file://{HERE}/engine/stage.html?theme={a.theme}'); pg.evaluate('window.READY')
    pg.evaluate(JS, a.text); pg.wait_for_timeout(300)
    if errs: raise SystemExit('; '.join(errs))
    pg.screenshot(path=a.out, type='png')
    print('wrote', a.out)
