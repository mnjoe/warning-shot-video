#!/usr/bin/env python3
"""Beat-grid and onset helpers for timeline.js. Needs numpy, scipy, ffmpeg.

  python3 tools/beatfit.py song.mp3 fit 44.8 60        # period + phase for SONG.beat.anchors over a region
  python3 tools/beatfit.py song.mp3 onsets 2 6.5       # onset times in a window (low band = kicks/stomps, mid = vocals)
  python3 tools/beatfit.py song.mp3 align 27.91 99.73  # best lag of a vocal moment against a reference moment

Anchors: beat(t) = (t - phase) / period. Mean error under ~0.03 beat is a good fit; 0.25 is random.
"""
import subprocess, sys, numpy as np, scipy.signal as sg

def load(path, sr=22050):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(float) / 32768, sr

def fluxes(x, sr, hop=256):
    f, t, Z = sg.stft(x, sr, nperseg=1024, noverlap=1024 - hop)
    L = np.log1p(100 * np.abs(Z))
    d = lambda m: np.maximum(0, np.diff(L[m], axis=1)).sum(0)
    return t[1:], d(f < 200), d((f > 300) & (f < 3500)), hop

def onsets(tt, fl, a, b, sr, hop):
    m = (tt >= a) & (tt <= b); seg, ts = fl[m], tt[m]
    p, _ = sg.find_peaks(seg, height=np.percentile(seg, 90) * 0.8, distance=int(0.3 * sr / hop))
    return ts[p]

def fit(on):
    best = None
    for P in np.arange(0.490, 0.506, 0.00025):
        for ph in np.arange(0, P, 0.0025):
            d = (on - ph) / P; e = np.abs(d - np.round(d)).mean()
            if best is None or e < best[0]: best = (e, P, ph)
    return best

if __name__ == '__main__':
    path, cmd, a, b = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
    x, sr = load(path); tt, low, mid, hop = fluxes(x, sr)
    if cmd == 'fit':
        e, P, ph = fit(onsets(tt, low, a, b, sr, hop))
        print(f'{{ from: {a}, period: {P:.5f}, phase: {ph:.4f} }}   mean error {e:.3f} beat')
    elif cmd == 'onsets':
        print('low:', [round(v, 2) for v in onsets(tt, low, a, b, sr, hop)])
        print('mid:', [round(v, 2) for v in onsets(tt, mid, a, b, sr, hop)])
    elif cmd == 'align':
        dt = tt[1] - tt[0]; idx = lambda s: int(round((s - tt[0]) / dt)); N = int(1.4 / dt)
        s1 = mid[idx(a - 0.3):idx(a - 0.3) + N]; s1 = (s1 - s1.mean()) / s1.std(); best = (-9, 0)
        for k in range(-int(0.35 / dt), int(0.35 / dt) + 1):
            s2 = mid[idx(b - 0.3) + k:idx(b - 0.3) + k + N]; s2 = (s2 - s2.mean()) / s2.std(); c = (s1 * s2).mean()
            if c > best[0]: best = (c, k * dt)
        print(f'{b:.2f} -> {b + best[1]:.2f} (lag {best[1] * 1000:+.0f} ms, corr {best[0]:.2f})')
