// Verse 1: the setup. V1-1 the deck as a gym, V1-2 the target, V1-3 the hand switches off the safety systems,
// V1-4 one bot shrugs. Positions and timing only; every drawing call goes through R.*.

// The gym crew. Lifters press on alternate beats; one bot does sit-ups on a mat.
function gymCrew(t, o = {}) {
  const b = beat(t), press = ph => 0.5 - 0.5 * Math.cos(Math.PI * (b + ph));
  let s = R.gymMat(660, 618, 250);
  s += R.bot({ x: 330, y: 620, s: 1.3, t, variant: 0, phase: 0, armsUp: 0.15 + 0.85 * press(0), barbell: true, squash: (1 - press(0)) * 0.3 });
  s += R.bot({ x: 700, y: 626, s: 1.25, t, variant: 4, phase: 0.4, legRot: -78, lean: lerp(-88, -12, press(0.5)) });
  s += R.bot({ x: 950, y: 620, s: 1.3, t, variant: 1, phase: 0.6, armsUp: 0.15 + 0.85 * press(1), barbell: true, squash: (1 - press(1)) * 0.3 });
  if (o.coach) s += R.bot({ x: 1150, y: 600, s: 1.0, t, variant: 3, phase: 0.2, whistle: true, flip: true });
  return s;
}

// V1-1: the deck fitted out as a gym. The EXPLOITGYM sign drops in on "named it".
function shotGym(t, lt, V) {
  let s = R.deck(t) + gymCrew(t, { coach: true });
  const k = prog(t, V.signDrop, V.signDrop + 0.5);
  if (k > 0) {
    const swing = Math.sin((t - V.signDrop) * 6) * 9 * Math.exp(-(t - V.signDrop) * 1.6);
    s += R.plaque({ x: 880, y: lerp(-120, 236, backOut(k)), s: 1, text: SONG.labels.gym, swing });
  }
  return { svg: s };
}

// V1-2: the ship, and the TARGET buoy out at sea. A course line draws out, the flag gets an arrow, and the line comes back.
function shotTarget(t, lt, V) {
  const [, l2, , l2b] = V.lyr;
  let s = R.sky(400) + R.clouds(t) + R.seaRect(t, 400, H, {});
  const cam = lt * 6;
  s += `<g transform="translate(${f(-cam)} 0)">`;
  s += R.ship({ x: 150, y: 560 + Math.sin(t * 1.6) * 4, s: 0.62, t, rot: Math.sin(t * 1.3) * 1.2, label: SONG.labels.ship, crew: 5 });
  const bx = 990, by = 520;
  s += R.buoy({ x: bx, y: by, s: 1.15, t, label: SONG.labels.target });
  s += R.route(380, 470, 680, 300, bx - 30, by - 70, ease(prog(t, l2 + 0.25, l2 + 1.5)));
  if (t > l2b) s += R.pointer(bx + 20, by - 120, t, backOut(prog(t, l2b, l2b + 0.3)));
  s += R.route(bx - 60, by + 10, 700, 600, 400, 520, ease(prog(t, l2b + 0.75, V.cuts[2] - 0.2)), 'back');
  s += `</g>`;
  s += R.seaRect(t + 3, 590, H, { gap: 30 });
  return { svg: s };
}

// V1-3: the lab glove flips the three levers, one per clunk. The lamps die; the band stops; the headline lands.
const PANEL = { x: 640, y: 372, s: 0.9 };
function shotLevers(t, lt, V) {
  const C = V.clunks;
  // each lever: grab 0.35 s before its clunk, throw on the clunk
  const offs = C.map(c => ease(prog(t, c - 0.12, c)));
  const lamps = C.map((c, i) => t < c ? 1 : (t - c < 0.16 ? (Math.floor((t - c) * 25) % 2 ? 1 : 0.2) : 0));
  const panel = Object.assign({ levers: SONG.labels.levers.map((label, i) => ({ label, off: offs[i], lamp: lamps[i] })) }, PANEL);
  let s = R.cabinWall(t) + R.controlPanel(panel);
  // which lever is the hand working on?
  let i = C.findIndex(c => t < c + 0.25); if (i < 0) i = C.length;
  let hx, hy, curl = 0.75;
  const knob = j => R.panelKnob(panel, j, offs[j]);
  const off = { x: 10, y: 6 };
  const enter = easeOut(prog(t, Math.max(V.cuts[2], C[0] - 0.9), C[0] - 0.2));   // swoops in from the cut if the first hit is early
  if (i < C.length) {
    const k = knob(i);
    const prevAt = i === 0 ? null : C[i - 1] + 0.25, arrive = C[i] - 0.3;
    if (i === 0) { hx = lerp(1300, k.x + off.x, enter); hy = lerp(820, k.y + off.y, enter); }
    else { const pk = knob(i - 1), m = ease(prog(t, prevAt, arrive)); hx = lerp(pk.x, k.x, m) + off.x; hy = lerp(pk.y, k.y, m) + off.y - Math.sin(Math.PI * m) * 60; }
    curl = t > arrive - 0.05 ? 0.8 : 0.3;
  } else {
    const k = knob(C.length - 1), out = easeIn(prog(t, C[C.length - 1] + 0.3, C[C.length - 1] + 0.9));
    hx = lerp(k.x + off.x, 1350, out); hy = lerp(k.y + off.y, 860, out); curl = 0.3;
  }
  s += R.hand({ x: hx, y: hy, s: 1.0, rot: 38, curl, label: SONG.labels.hand });
  C.forEach((c, j) => {
    const k = R.panelKnob(panel, j, 1), p = prog(t, c, c + 0.45);
    if (p > 0 && p < 1) s += R.sfx(k.x - 70, k.y - 150, backOut(clamp(p * 4)) * (p > 0.8 ? (1 - p) * 5 : 1), copy('clunk'), -10 + j * 6, 52);
  });
  const dark = clamp((t - C[C.length - 1] - 0.1) / 0.4) * 0.35;
  if (dark > 0) s += R.dim(dark);
  const hl = C[C.length - 1] + 0.15;
  if (t > hl) s += R.headline(t - hl, SONG.headlines.safetyOff);
  return { svg: s };
}

// V1-4: one bot turns to the camera and shrugs. Question marks pop on the beat.
function shotShrug(t, lt, V) {
  let s = R.deck(t);
  const b = beat(t), press = ph => 0.5 - 0.5 * Math.cos(Math.PI * (b + ph));
  s += R.bot({ x: 250, y: 470, s: 0.9, t, variant: 0, armsUp: 0.15 + 0.85 * press(0), barbell: true });
  s += R.bot({ x: 1040, y: 470, s: 0.9, t, variant: 1, armsUp: 0.15 + 0.85 * press(1), barbell: true });
  const k = prog(t, V.turn, V.turn + 0.22), flipped = k < 0.5, sx = Math.max(0.08, Math.abs(Math.cos(Math.PI * k)));
  const sh = easeOut(prog(t, V.shrug - 0.1, V.shrug + 0.2));
  const bot = R.bot({ x: 0, y: 0, s: 2.55, t, variant: 2, phase: 0.3, flip: flipped, shrug: sh, look: flipped ? 0 : -3 });
  s += `<g transform="translate(640 668) scale(${f(sx)} 1)">${bot}</g>`;
  V.huh.forEach((h, j) => { s += R.sfx(j ? 860 : 420, j ? 300 : 330, backOut(prog(t, h, h + 0.25)), '?', j ? 14 : -14, 110); });
  return { svg: s };
}

function verse1Shots(V) {
  const [a, b, c, d, end] = V.cuts;
  return [
    { id: 'V1-1', a, b, fn: (t, lt) => shotGym(t, lt, V) },
    { id: 'V1-2', a: b, b: c, fn: (t, lt) => shotTarget(t, lt, V) },
    { id: 'V1-3', a: c, b: d, fn: (t, lt) => shotLevers(t, lt, V) },
    { id: 'V1-4', a: d, b: end, fn: (t, lt) => shotShrug(t, lt, V) },
  ];
}
