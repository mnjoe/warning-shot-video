#!/usr/bin/env python3
"""Sound-effects layer for Warning Shot. Every sound is synthesized (no samples, nothing licensed), and every cue
time comes from engine/timeline.js, so the effects land on the same frames as the animation that draws them.

  python3 tools/sfx.py song.mp3 outdir/            # writes sfx_stem.wav, mix.wav, cues.txt (all in song time)

sfx_stem.wav  the effects alone (stereo, 48 kHz, song time 0 = first sample)
mix.wav       song + effects, with a brief dip in the music under the mouse squeak (Part C)
cues.txt      every cue: song time, beat, what it is

To make the final audio, put the stinger at 0 and mix.wav after the pre-roll (see README, "Stinger").
"""
import json, os, subprocess, sys
import numpy as np, scipy.io.wavfile as wav, scipy.signal as sg

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(11)

# ---------------------------------------------------------------------------------------------------- timeline
SONG = json.loads(subprocess.run(['node', '-e', open(os.path.join(HERE, 'engine/timeline.js')).read() + '\nconsole.log(JSON.stringify(SONG))'],
                                 capture_output=True, text=True, check=True).stdout)

def beat(t):
    g = SONG['beat']; a = [x for x in g['anchors'] if t >= x['from']] or g['anchors'][:1]; a = a[-1]
    return (t - a['phase']) / a.get('period', g['period'])

def beat_time(t_lo, t_hi):
    """Song times of the whole beats between t_lo and t_hi (solved per anchor region)."""
    out, t, step = [], t_lo, 0.002
    b0 = beat(t)
    while t < t_hi:
        t2 = t + step; b1 = beat(t2)
        if np.floor(b1) > np.floor(b0): out.append(t2)
        t, b0 = t2, b1
    return out

ease = lambda u: 2 * u * u if u < .5 else 1 - (-2 * u + 2) ** 2 / 2
easeIn = lambda u: u ** 3
pan_of = lambda x: float(np.clip((x / 640 - 1) * 0.8, -0.9, 0.9))   # screen x to stereo pan

# ---------------------------------------------------------------------------------------------------- synthesis
def T(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi, o=2): b, a = sg.butter(o, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], 'band'); return sg.lfilter(b, a, x)
def lp(x, fc, o=2): b, a = sg.butter(o, fc / (SR / 2)); return sg.lfilter(b, a, x)
def hp(x, fc, o=2): b, a = sg.butter(o, fc / (SR / 2), 'high'); return sg.lfilter(b, a, x)
def env(d, decay, attack=0.002): t = T(d); return np.minimum(1, t / attack) * np.exp(-t * decay)
def sweep(f0, f1, d, harmonics=(1,), amps=(1,)):
    t = T(d); f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(a * np.sin(h * ph) for h, a in zip(harmonics, amps))
def norm(x): m = np.abs(x).max(); return x / m if m > 0 else x
def pad(x, d): return np.concatenate([x, np.zeros(max(0, int(d * SR) - len(x)))])[:int(d * SR)]
def mixin(a, b, at=0.0):
    i = int(at * SR); n = max(len(a), i + len(b)); out = np.zeros(n); out[:len(a)] += a; out[i:i + len(b)] += b; return out

def thunk(f0=140, body=18, d=0.45, wood=1.0):
    s = sweep(f0, f0 * 0.5, d) * env(d, body)
    s += wood * bp(noise(d), 150, 900) * env(d, 40) * 0.8
    s += 0.5 * np.sin(2 * np.pi * f0 * 1.6 * T(d)) * env(d, 30)
    s[:int(0.002 * SR)] += hp(noise(0.002), 3000) * 0.6
    return norm(s)

def whoosh(d, lo=300, hi=2500):
    n = noise(d); out = np.zeros_like(n); blk = 480
    for k in range(0, len(n), blk):
        u = k / len(n); fc = lo + (hi - lo) * u
        out[k:k + blk] = bp(n[k:k + blk], fc * 0.6, fc * 1.6)
    return norm(out * np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.5)

def rattle(d=0.35, n=6, f=(1900, 2800, 4100)):
    out = np.zeros(int(d * SR))
    for k in range(n):
        at = d * 0.7 * (k / n) ** 1.3; g = 0.9 ** k
        ping = sum(np.sin(2 * np.pi * fr * (1 + rng.uniform(-0.03, 0.03)) * T(0.05)) for fr in f) * env(0.05, 120)
        out = mixin(out, ping * g, at)[:len(out)]
    return norm(out)

def sign_drop():                       # returns (sound, lead): a whoosh falls into a wooden thunk, a little chain rattle
    s = mixin(whoosh(0.2, 1800, 400) * 0.35, thunk(130, 16) * 1.0, 0.2)
    s = mixin(s, rattle() * 0.25, 0.24)
    return norm(s), 0.2

def clunk():                           # heavy lever: thump, metal ring, ratchet click
    d = 0.6; t = T(d)
    s = sweep(95, 60, d) * env(d, 25)
    s += sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * dec) for f, a, dec in [(430, 0.5, 14), (1170, 0.35, 22), (1830, 0.25, 30), (2610, 0.15, 40)])
    s += bp(noise(d), 600, 3000) * env(d, 90) * 0.7
    pre = hp(noise(0.012), 2500) * env(0.012, 200) * 0.5
    return norm(mixin(pre, s, 0.03)), 0.03

def boom():                            # cannon: crack, low sweep, rumble tail
    d = 2.2
    s = sweep(72, 34, d) * env(d, 3.2, 0.004) * 1.0
    s += lp(noise(d), 380) * env(d, 4.5, 0.003) * 1.6
    s += lp(noise(d), 160) * env(d, 1.6, 0.05) * 1.2
    s[:int(0.006 * SR)] += hp(noise(0.006), 2000) * 0.8
    return norm(s), 0.0

def roll(d):                           # cannonball rolling down the barrel
    t = T(d); n = bp(noise(d), 120, 520) * (0.6 + 0.4 * np.sin(2 * np.pi * (8 + 10 * t / d) * t))
    ring = bp(noise(d), 650, 900) * 0.25
    return norm((n + ring) * np.minimum(1, t / 0.15) * (0.5 + 0.5 * t / d))

def clonk():                           # ball hits the breech
    d = 0.8; t = T(d)
    s = thunk(110, 14, d, 0.6) + 0.6 * sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dec) for f, dec in [(300, 9), (745, 14), (1290, 20)])
    return norm(s)

def pat():                             # gloved hand on iron: muffled thud, a whisper of ring
    d = 0.18; t = T(d)
    s = lp(noise(d), 420) * env(d, 55) + 0.15 * np.sin(2 * np.pi * 520 * t) * np.exp(-t * 35)
    return norm(s)

def creak(d, rate=(28, 62, 38), pitch=1.0):    # door hinge: a slow stick-slip pulse train through wood resonances
    t = T(d); u = t / d
    r = np.interp(u, [0, 0.5, 1], rate) * pitch * (1 + 0.08 * np.sin(2 * np.pi * 3.1 * t) + 0.05 * rng.standard_normal(len(t)).cumsum() / np.sqrt(len(t)))
    ph = np.cumsum(r) / SR; pulses = np.zeros_like(t); idx = np.where(np.diff(np.floor(ph)) > 0)[0]; pulses[idx] = 1
    s = sum(g * bp(pulses, lo * pitch, hi * pitch, 2) for lo, hi, g in [(480, 720, 1.0), (1050, 1450, 0.7), (2100, 2700, 0.35)])
    return norm(s * np.sin(np.pi * u) ** 0.6)

def scratch(d):                        # one pen stroke on paper
    d = max(0.012, min(0.07, d))
    return bp(noise(d), 2400, 6500) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))) * rng.uniform(0.6, 1.0)

def clang():                           # ship's bell, struck hard
    d = 2.4; t = T(d); f0 = 392
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * dec) for r, a, dec in [(0.5, 0.6, 1.0), (1.0, 1.0, 1.5), (1.19, 0.7, 2.0), (1.56, 0.5, 2.6), (2.0, 0.55, 3.2), (2.74, 0.3, 4.5), (3.76, 0.2, 6)])
    s[:int(0.004 * SR)] += hp(noise(0.004), 1500) * 1.5
    return norm(s * np.minimum(1, t / 0.0015))

def fw_pop():                          # firework: pop, then crackle
    d = 1.3; t = T(d)
    s = lp(noise(d), 1500) * env(d, 28) + 0.8 * sweep(90, 45, d) * env(d, 20)
    crackle = np.zeros(int(d * SR))
    for at in np.sort(rng.uniform(0.25, 1.1, 40)):
        crackle = mixin(crackle, hp(noise(0.004), 2500) * rng.uniform(0.2, 0.8) * np.exp(-(at - 0.25) * 2.5), at)[:len(crackle)]
    return norm(s + crackle * 0.9)

def crash():                           # the shack: a groan, a thump, planks clattering down
    s = creak(0.35, (22, 12, 9), 0.6) * 0.5
    s = mixin(s, thunk(85, 9, 0.9, 1.5) * 1.0, 0.3)
    for k, at in enumerate(np.sort(rng.uniform(0.32, 1.0, 12))):
        s = mixin(s, thunk(rng.uniform(170, 420), rng.uniform(25, 45), 0.25, 1.2) * rng.uniform(0.3, 0.7), at)
    s = mixin(s, lp(noise(1.2), 900) * env(1.2, 3, 0.05) * 0.4, 0.3)
    return norm(s), 0.0

def squeak():                          # SQUEAK!
    d = 0.24; t = T(d); u = t / d
    f = np.interp(u, [0, 0.3, 0.7, 1], [2300, 3700, 3300, 2600]) * (1 + 0.025 * np.sin(2 * np.pi * 34 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.sin(np.pi * u) ** 0.5 + bp(noise(d), 3000, 7000) * 0.08
    return norm(s)

def key_click():
    d = 0.05; s = hp(noise(d), 2000) * env(d, 260) + 0.4 * np.sin(2 * np.pi * 170 * T(d)) * env(d, 90)
    return norm(s)

def stamp():                           # rubber stamp slammed onto paper
    s = mixin(whoosh(0.08, 2000, 700) * 0.25, thunk(115, 22, 0.5, 0.4) * 0.9, 0.08)
    s = mixin(s, bp(noise(0.25), 800, 2600) * env(0.25, 55) * 0.6, 0.08)
    return norm(s), 0.08

def poof8():                           # 8-bit poof: crunchy held noise falling in pitch, plus a square sweep down
    d = 0.5; n = int(d * SR); out = np.zeros(n); i = 0; v = 1.0
    while i < n:
        hold = int(SR / (4000 * (1 - i / n) ** 2 + 120)); out[i:i + hold] = v; v = rng.choice([-1.0, 1.0]); i += hold
    sq = np.sign(sweep(880, 110, d))
    return norm((out * 0.7 + sq * 0.3) * env(d, 6, 0.003))

def coin():                            # 8-bit pickup: a quick rising arpeggio (our own, not any game's jingle)
    s = np.zeros(0)
    for k, note in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        d = 0.045 if k < 3 else 0.22; t = T(d); sq = np.sign(np.sin(2 * np.pi * note * t)) * (0.6 if k < 3 else np.exp(-t * 14))
        s = np.concatenate([s, sq])
    return norm(s)

def confetti():                        # party-cannon pop, then paper fluttering down
    s = sweep(400, 1300, 0.02) * env(0.02, 30) + 0.0
    s = mixin(s, sweep(85, 50, 0.35) * env(0.35, 14) * 0.9, 0.0)
    s = mixin(s, lp(noise(0.12), 2000) * env(0.12, 40) * 0.8, 0.0)
    flutter = np.zeros(int(1.8 * SR))
    for at in np.sort(rng.uniform(0.05, 1.6, 220)):
        flutter = mixin(flutter, bp(noise(0.02), 2500, 8000) * rng.uniform(0.1, 0.5) * np.exp(-at * 1.4), at)[:len(flutter)]
    return norm(mixin(s, flutter * 0.6, 0.03)), 0.0

def whistle():                         # falling cannonball
    d = 0.45; t = T(d); f = 1500 * (500 / 1500) ** (t / d) * (1 + 0.01 * np.sin(2 * np.pi * 9 * t))
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 1.5)

def slam():                            # chest lid: heavy wood, then the latch
    s = thunk(88, 10, 1.0, 1.6)
    t = T(0.25); latch = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 60) for f in (1850, 2930, 4100)) * 0.35
    s = mixin(s, latch, 0.035); s = mixin(s, rattle(0.3, 4) * 0.15, 0.06)
    return norm(s)

def wipe(speed):                       # rag across cork; speed is a 0..1 curve sampled at SR
    n = len(speed); return norm(lp(bp(noise(n / SR), 700, 3200), 2600) * speed ** 0.8)

def weedwhacker(run):                  # starter cord, sputtering idle, then a rev and a pass left to right
    t0 = run - 0.8; d = 3.0; t = T(d)
    zip_ = whoosh(0.28, 300, 1800) * 0.5
    f = np.where(t < 0.8, 92 + 6 * np.sin(2 * np.pi * 7 * t), np.interp(t, [0.8, 1.2, 2.3, 3.0], [92, 205, 190, 150]))
    ph = 2 * np.pi * np.cumsum(f) / SR
    eng = sum(np.sin(h * ph) / h for h in range(1, 28)) + 0.25 * np.sin(3 * ph + 0.5) + bp(noise(d), 800, 4000) * 0.15
    gate = np.where(t < 0.8, (np.sin(2 * np.pi * 11 * t) > -0.2) * 0.6 + 0.2, 1.0)
    amp = np.interp(t, [0, 0.62, 0.65, 0.8, 1.0, 1.5, 2.3, 2.9, 3.0], [0, 0, 0.35, 0.35, 0.8, 1.0, 0.6, 0.0, 0.0])
    s = mixin(zip_, eng * gate * amp * 0.5, 0.0)
    pan = np.interp(t, [0, 0.8, 2.6], [-0.3, -0.25, 0.95])
    return norm(s), t0, pan

# ---------------------------------------------------------------------------------------------------- cues
cues = []   # (song time of the sound's start, sound, gain dB, pan or pan-curve, label)
def cue(at, sound, gain, pan, label, lead=0.0):
    cues.append((at - lead, sound, gain, pan, label, at))

V1, V2, V3, S, V4, V5, F, O = (SONG[k] for k in ('verse1', 'verse2', 'verse3', 'spoken', 'verse4', 'verse5', 'final', 'outro'))
C1, C2 = SONG['chorus']['one'], SONG['chorus']['two']

s, lead = sign_drop(); cue(V1['signDrop'] + 0.19, s, -8, pan_of(880), 'V1-1 EXPLOITGYM sign lands', lead)
for i, c in enumerate(V1['clunks']):
    s, lead = clunk(); cue(c, s, -9, pan_of(640 + 0.9 * (i - 1) * 300), f'V1-3 lever clunk {i + 1}', lead)
for C, name in ((C1, 'Chorus 1'), (C2, 'Chorus 2')):
    s, lead = boom(); cue(C['fireAt'], s, -8, pan_of(1000), f'{name} C-1 cannon boom')
    a = C['cuts'][2]
    cue(a + 1.0, roll(0.75), -14, pan_of(480), f'{name} C-3 cannonball rolls in')
    cue(a + 1.75, clonk(), -9, pan_of(330), f'{name} C-3 ball hits the breech')
    for tb in beat_time(a + 2.75, a + 3.9):
        cue(tb, pat(), -11, pan_of(600), f'{name} C-3 pat')
    cue(C['cuts'][5], creak(0.6), -10, pan_of(380), f'{name} C-6 door creaks open')
s, lead = sign_drop(); cue(V2['signLand'], s, -8, pan_of(570), 'V2-1 NO INTERNET sign lands', lead)
cue(V2['creak'], creak(0.75, (24, 55, 30)), -10, pan_of(378), 'V2-3 door creak')
# V2-6: one pen stroke per tally mark, as fast as the ledger fills
a, end = V2['cuts'][5], V2['cuts'][6]; dur = end - a
marks = [a + 0.1 + (i / 300) ** (1 / 3) * (dur - 0.1) for i in range(1, 301)]
scr = np.zeros(int((dur + 0.2) * SR))
for i, m in enumerate(marks):
    gap = (marks[i + 1] - m) if i + 1 < len(marks) else 0.05
    scr = mixin(scr, scratch(gap * 0.9), m - a)[:len(scr)]
cue(a, norm(scr), -12, 0.0, 'V2-6 scribbling tally marks (speeds up)')
for i, c in enumerate(V3['clangs']):
    cue(c, clang(), -10, pan_of(420), f'V3-3 bell clang {i + 1}')
for at, x, y, colr in V3['fireworks']:
    cue(at, fw_pop(), -14, pan_of(x), 'V3-4 firework')
s, lead = crash(); cue(V3['fell'] - 0.05, s, -8, 0.0, 'V3-4 Artifactory collapses')
w0, w1 = V3['wipeAt']; d = (w1 + 0.1) - (w0 - 0.05); tt = np.arange(int(d * SR)) / SR + (w0 - 0.05)
pos = np.array([[np.interp(ease(min(1, max(0, (x - w0) / (w1 - w0)))), [0, 1], [150, 820]),
                 np.sin(ease(min(1, max(0, (x - w0) / (w1 - w0)))) * np.pi * 4) * 50] for x in tt[::48]])
spd = np.hypot(*np.gradient(pos, axis=0).T); spd = np.interp(np.arange(len(tt)), np.arange(0, len(tt), 48)[:len(spd)], spd / (spd.max() + 1e-9))
cue(w0 - 0.05, wipe(spd), -12, pan_of(480), 'V3-5 the glove wipes the corkboard')
cue(V3['squeak'], squeak(), -7, pan_of(980), 'V3-8 SQUEAK (music dips under it)')
for k in range(12):
    cue(S['no'] + k * 0.03 + rng.uniform(-0.006, 0.006), key_click(), -13, pan_of(520), 'S-2 backspace' if k == 0 else None)
s, lead = stamp(); cue(S['okay'], s, -6, pan_of(520), 'S-4 REDACTED stamp', lead)
cue(V4['morph'], poof8(), -12, 0.0, 'V4-1 8-bit poof')
a, b = V4['cuts'][2], V4['cuts'][3]
for i in range(7):
    ai = i * 2 * np.pi / 7
    for k in range(3):
        lt = (ai + 2 * np.pi * k) / 2.6
        if 0.05 < lt < b - a:
            cue(a + lt, coin(), -17, pan_of(640 + np.cos(ai) * 330 * 0.7), 'V4-3 coin')
s, lead = confetti(); cue(V4['lyr']['surprise'], s, -5, pan_of(1117), 'V4-4 confetti cannon (SURPRISE!)')
ww, t0, pan_curve = weedwhacker(V5['dogRuns']); cue(t0, ww, -17, pan_curve, 'V5-1 starter cord, then the weedwhacker passes')
s, lead = stamp(); cue(V5['stamp'], s, -6, pan_of(700), 'V5-3 HUMAN BY DESIGN stamp', lead)
s, lead = boom(); cue(F['lyr']['shout'], s, -8, pan_of(1080), 'F-1 cannon boom')
cue(F['thud'] - 0.45, whistle(), -16, pan_of(700), 'F-2 cannonball whistles down')
cue(F['thud'], thunk(80, 8, 1.0, 1.4), -5, pan_of(700), 'F-2 cannonball THUD')
s, lead = sign_drop(); cue(F['cuts'][3] + 0.3, s, -8, pan_of(570), 'F-4a AIR GAP: NONE sign lands', lead)
cue(F['cuts'][5], creak(0.35, (30, 66, 44)), -10, pan_of(380), 'F-4c door creak')
cue(O['slam'] - 0.01, slam(), -4, pan_of(460), 'O-3 chest SLAM')
s, lead = confetti(); cue(O['encore'], s, -6, pan_of(820), 'O-3b the cannon fires confetti')

# ---------------------------------------------------------------------------------------------------- render
def main():
    song_path, outdir = sys.argv[1], sys.argv[2]; os.makedirs(outdir, exist_ok=True)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', song_path, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    song = np.frombuffer(raw, np.int16).astype(float).reshape(-1, 2) / 32768
    n = len(song); stem = np.zeros((n, 2))
    lines = []
    for start, snd, gain, pan, label, at in sorted(cues, key=lambda c: c[0]):
        i = int(start * SR); j = min(n, i + len(snd)); x = snd[:j - i] * 10 ** (gain / 20)
        p = pan if np.ndim(pan) else np.full(len(x), pan)
        if np.ndim(pan): p = np.interp(np.arange(len(x)) / SR, np.arange(len(pan)) / SR, pan)
        stem[i:j, 0] += x * np.cos((p + 1) * np.pi / 4) * 1.414
        stem[i:j, 1] += x * np.sin((p + 1) * np.pi / 4) * 1.414
        if label: lines.append(f'{at:8.2f}s  beat {beat(at):7.2f}  {label}')
    # Part C: dip the music briefly under the squeak so it cuts through
    q = SONG['verse3']['squeak']; tt = np.arange(n) / SR
    duck = 1 - 0.5 * np.clip(np.minimum((tt - (q - 0.06)) / 0.05, ((q + 0.36) - tt) / 0.12), 0, 1)
    mix = song * duck[:, None] + stem
    peak = np.abs(mix).max()
    # soft limiter: leaves everything under 0.85 alone and rounds off the rare peaks above it
    over = np.abs(mix) > 0.85
    mix[over] = np.sign(mix[over]) * (0.85 + 0.14 * np.tanh((np.abs(mix[over]) - 0.85) / 0.14))
    wav.write(os.path.join(outdir, 'sfx_stem.wav'), SR, (np.clip(stem, -1, 1) * 32767).astype(np.int16))
    wav.write(os.path.join(outdir, 'mix.wav'), SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
    open(os.path.join(outdir, 'cues.txt'), 'w').write('\n'.join(lines) + '\n')
    print(f'{len(cues)} cues, {len(lines)} labeled; stem peak {20 * np.log10(np.abs(stem).max()):.1f} dBFS; mix peak {20 * np.log10(peak):.1f} dBFS'
          + f'; {int(over.sum())} samples soft-limited')

if __name__ == '__main__':
    main()
