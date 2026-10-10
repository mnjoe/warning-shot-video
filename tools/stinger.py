#!/usr/bin/env python3
"""PNN logo stinger for the 2 s pre-roll. Synthesized from scratch (no samples, nothing licensed).

  python3 tools/stinger.py out.wav

Timed to the I-1 animation (video time): whoosh while the wheel spins in, a boom and a ship's bell as it lands
(~1.05 s), then a brass "da-da-DAAA" in D minor (the song's key) as the banner unfurls. The last chord holds and then fades
out by ~2.95 s; with a 3.5 s pre-roll that leaves a moment of silence before the song.
"""
import sys, numpy as np, scipy.io.wavfile as wav, scipy.signal as sg

SR = 48000                     # matches the song MP3
LEN = 3.1                      # the last chord holds, then fades out by ~2.95 s
n = int(SR * LEN)
rng = np.random.default_rng(7)
t = np.arange(n) / SR
mix = np.zeros((n, 2))

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(n, i + len(sig))
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:j, 0] += sig[:j - i] * gain * l * 1.414
    mix[i:j, 1] += sig[:j - i] * gain * r * 1.414

def hz(note):                  # 'A3', 'D4', 'F#4'
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    return 440 * 2 ** ((names[note[:-1]] + 12 * (int(note[-1]) - 4)) / 12)

# 1. Whoosh: band-passed noise sweeping up while the wheel spins in.
d = 1.15; m = int(SR * d); noise = rng.standard_normal(m)
whoosh = np.zeros(m); blk = 512
for k in range(0, m, blk):
    u = k / m; fc = 250 + 2600 * u ** 2
    b, a = sg.butter(2, [fc * 0.6 / (SR / 2), min(0.99, fc * 1.6 / (SR / 2))], 'band')
    whoosh[k:k + blk] = sg.lfilter(b, a, noise[k:k + blk])
whoosh *= np.sin(np.pi * np.linspace(0, 1, m)) ** 1.5 * np.linspace(0.3, 1, m)
place(whoosh / np.abs(whoosh).max(), 0.0, 0.32, -0.3)

# 2. Timpani roll building under the whoosh (D2), then the boom when the wheel lands.
def timp(f0, dur, amp):
    m = int(SR * dur); tt = np.arange(m) / SR
    pitch = f0 * (1 + 0.08 * np.exp(-tt * 30))
    s = np.sin(2 * np.pi * np.cumsum(pitch) / SR) + 0.35 * np.sin(2 * np.pi * np.cumsum(pitch * 1.5) / SR)
    s *= np.exp(-tt * (3.2 / dur)) * amp
    s[:int(0.004 * SR)] += rng.standard_normal(int(0.004 * SR)) * 0.4 * amp
    return s
for i, at in enumerate(np.arange(0.25, 1.0, 0.075)):
    place(timp(hz('D2'), 0.25, 0.10 + 0.5 * (at - 0.25)), at, 1.0, 0.2)
place(timp(hz('D2'), 1.4, 1.0), 1.05, 0.9)

# 3. Ship's bell (inharmonic partials) on the landing.
def bell(f0, dur):
    m = int(SR * dur); tt = np.arange(m) / SR; s = np.zeros(m)
    for ratio, amp, dec in [(0.5, 0.5, 1.2), (1.0, 1.0, 1.8), (1.19, 0.6, 2.4), (1.56, 0.4, 3.0), (2.0, 0.5, 3.6), (2.74, 0.25, 5), (3.76, 0.15, 7)]:
        s += amp * np.sin(2 * np.pi * f0 * ratio * tt) * np.exp(-tt * dec)
    return s * np.minimum(1, tt / 0.002)
place(bell(hz('D5'), 1.5) / 3.4, 1.05, 0.55, 0.35)

# 4. Brass fanfare: A3, A3, then a D-minor chord. Additive saw voices with a brassy brightness swell and vibrato.
def brass(f0, dur, swell=0.06, vib=0.0, sustain=0.75):
    m = int(SR * dur); tt = np.arange(m) / SR; s = np.zeros(m)
    for det in (-0.004, 0.0, 0.005):
        f = f0 * (1 + det) * (1 + vib * 0.006 * np.sin(2 * np.pi * 5.5 * tt) * np.minimum(1, tt / 0.25))
        ph = 2 * np.pi * np.cumsum(f) / SR
        bright = np.minimum(1, tt / swell) * (sustain + (1 - sustain) * np.exp(-tt * 3))
        for h in range(1, 18):
            if f0 * h > 9000: break
            s += np.sin(h * ph) / h * np.exp(-(h - 1) * (1.15 - bright) * 0.55)
    env = np.minimum(1, tt / 0.02) * np.minimum(1, (dur - tt) / 0.05).clip(0, 1)
    return s * env / 3
place(brass(hz('A3'), 0.13) * 0.9, 1.30, 0.5, -0.2)
place(brass(hz('A3'), 0.13) * 0.9, 1.45, 0.5, -0.2)
chord = [('D3', -0.4, 0.8), ('A3', 0.0, 0.7), ('D4', 0.25, 0.9), ('F4', 0.45, 0.6)]
for note, pan, g in chord:
    # bum-bum-bum-BUMMMMM: hold the chord ~0.55 s with a slight swell, then a long smooth fade (~0.8 s) that stays
    # full for its first half and tails off at the end.
    hold, fade = 0.55, 0.80
    s = brass(hz(note), hold + fade + 0.1, swell=0.09, vib=1.0, sustain=0.92)[:int((hold + fade) * SR)]
    env = np.concatenate([np.linspace(0.8, 1.0, int(hold * SR)), np.cos(np.linspace(0, np.pi / 2, int((hold + fade) * SR) - int(hold * SR))) ** 2])
    place(s * env * g, 1.60, 0.42, pan)

# 5. A little room: convolve with a short decaying-noise impulse response.
ir = rng.standard_normal(int(0.55 * SR)) * np.exp(-np.arange(int(0.55 * SR)) / SR * 9)
ir /= np.abs(ir).sum() / 6
wet = np.stack([sg.fftconvolve(mix[:, c], ir)[:n] for c in (0, 1)], 1)
out = mix * 0.85 + wet * 0.35
out *= np.concatenate([np.ones(int(2.95 * SR)), np.cos(np.linspace(0, np.pi / 2, n - int(2.95 * SR))) ** 2])[:, None]   # only trims the reverb tail
out = out / np.abs(out).max() * 0.56                                                              # peak about -5 dBFS: a touch above the song's intro
wav.write(sys.argv[1] if len(sys.argv) > 1 else 'stinger.wav', SR, (out * 32767).astype(np.int16))
