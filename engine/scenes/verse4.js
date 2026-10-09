// Where a cannon placed at x,y (scale s, barrel angle in degrees) fires from: 150 units along the barrel from its pivot.
function muzzle(x, y, s, angle) { const a = angle * Math.PI / 180; return { x: x + Math.cos(a) * 150 * s, y: y - 58 * s + Math.sin(a) * 150 * s }; }

// Verse 4: the arcade. Less Skynet, more arcade: the bots were chasing scores. Draws through R.*.

// V4-1: the headline version (a hulking war-bot of our own design) bursts into pixels and becomes a cute 8-bit bot.
function shotMorph(t, lt, V) {
  const m = V.morph, after = t >= m;
  let s = after ? R.sky(H) + R.clouds(t) : R.nightSky(t, H) + R.dim(0.2);
  if (!after) s += R.warBot({ x: 640, y: 660, s: 1.25 + lt * 0.04, t });
  s += R.pixelBurst(640, 520, prog(t, m, m + 0.8), 1.2);
  if (after) s += R.pixelBot({ x: 640, y: 640, s: 3.2 * backOut(prog(t, m + 0.1, m + 0.45)), t });
  s += R.sfx(860, 360, backOut(prog(t, m, m + 0.2)) * (1 - prog(t, m + 0.7, m + 0.9)), copy('poof'), -8, 70);
  s += R.tagLabel({ x: 40, y: 560, lines: [after ? 'THE TRANSCRIPTS' : 'THE HEADLINES'] });
  return { svg: s };
}

// V4-2: a bot mashes buttons at the ExploitGym cabinet on an UNSOLVED level.
function shotArcade(t, lt, V) {
  let s = R.cabinWall(t);
  s += R.arcadeCabinet({ x: 700, y: 700, s: 1.0, t, title: SONG.labels.gym, level: SONG.labels.level, sub: SONG.labels.insert, score: SONG.labels.score, press: 1 });
  s += R.bot({ x: 380, y: 700, s: 1.9, t, variant: 3, armsUp: 0.35 + 0.25 * Math.abs(Math.sin(t * 24)), sing: true });
  s += R.sfx(1060, 300, 1 + 0.08 * Math.sin(t * 30), copy('mash'), 8, 56);
  return { svg: s };
}

// V4-3: a little boat spins circles in a lagoon, collecting coins that keep coming back.
function shotLagoon(t, lt, V) {
  let s = `${R.sky(H)}` + R.seaRect(t, 0, H, { fillKey: 'land' });
  const cx = 640, cy = 400, rx = 330, ry = 190;
  s += R.lagoon({ x: cx, y: cy, rx, ry, t });
  const ang = lt * 2.6, n = 7;
  for (let i = 0; i < n; i++) {
    const a = i * Math.PI * 2 / n, d = ((ang - a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    if (d < 0.25 || d > 2.2) s += R.coin(cx + Math.cos(a) * rx * 0.7, cy + Math.sin(a) * ry * 0.7, t + i);   // gone just after the boat passes, back later
  }
  s += R.toyBoat({ x: cx + Math.cos(ang) * rx * 0.7, y: cy + Math.sin(ang) * ry * 0.7, s: 1.2, rot: ang * 180 / Math.PI + 90 });
  s += R.counter({ x: 1250, y: 150, value: 10 * Math.floor(lt * 2.6 * n / (Math.PI * 2) + 3), k: 1 });
  return { svg: s };
}

// V4-4: the confetti cannon goes off on "SURPRISE!"
function shotSurprise(t, lt, V) {
  const L = V.lyr, fire = t >= L.surprise ? t - L.surprise : null;
  let s = R.deck(t);
  for (let i = 0; i < 6; i++) s += R.bot({ x: 140 + i * 110, y: 640, s: 1.2, t, variant: i, phase: i * 0.2, sway: 6, sing: true, armsUp: fire != null ? 0.8 : 0 });
  s += R.cannon({ x: 1000, y: 540, s: 0.9, angle: -30, fire, label: SONG.labels.confettiCannon });
  if (fire != null) { const m = muzzle(1000, 540, 0.9, -30); s += R.confetti(m.x, m.y, fire); }
  return { svg: s };
}

function verse4Shots(V) {
  const c = V.cuts, ch = SONG.chyrons;
  return [
    { id: 'V4-1', a: c[0], b: c[1], fn: (t, lt) => shotMorph(t, lt, V) },
    { id: 'V4-2', a: c[1], b: c[2], fn: (t, lt) => shotArcade(t, lt, V) },
    { id: 'V4-3', a: c[2], b: c[3], fn: (t, lt) => shotLagoon(t, lt, V), chyron: ch.heaven },
    { id: 'V4-4', a: c[3], b: c[4], fn: (t, lt) => shotSurprise(t, lt, V) },
  ];
}
