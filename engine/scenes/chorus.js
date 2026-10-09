// Chorus choreography (built once, used twice). Positions and timing only; every drawing call goes through R.*.
// Chorus 2 passes v2 = true: more bots on deck, bigger hole in the sandbox.

function chorusCrew(t, o) {
  let s = '';
  if (o.v2) {
    for (let i = 0; i < 8; i++) s += R.bot({ x: 250 + i * 76, y: 470, s: 0.95, t, variant: i + 2, phase: i * 0.13 + 0.5, sway: 9, tankard: i % 2 === 0, sing: true });
  }
  const n = o.v2 ? 8 : 7, x0 = o.v2 ? 200 : 230, dx = o.v2 ? 84 : 95;
  for (let i = 0; i < n; i++) {
    s += R.bot({ x: x0 + i * dx, y: 640, s: 1.35, t, variant: i, phase: i * 0.21, sway: 8, tankard: i % 3 !== 1, sing: true, look: o.lookCannon ? 5 : 0 });
  }
  return s;
}

// C-1 / C-2: deck, crew sways, the cannon fires on the crowd shout. C-2 adds the speech bubble.
function shotDeck(t, lt, o) {
  const fire = t >= o.fireAt ? t - o.fireAt : null;
  let s = R.deck(t);
  s += chorusCrew(t, { v2: o.v2, lookCannon: fire != null && fire < 1.4 });
  s += R.cannon({ x: 1010, y: 530, s: 0.92, angle: -14, fire, label: SONG.labels.cannon });
  if (o.bubble) s += R.speechBubble(640, 196, backOut(prog(lt, 0, 0.3)), SONG.labels.biggest);
  let shake = '';
  if (fire != null && fire < 0.6) { const a = (1 - fire / 0.6) * 9; shake = `translate(${f(Math.sin(t * 90) * a)} ${f(Math.cos(t * 77) * a * .6)})`; }
  return { svg: `<g transform="${shake}">${s}</g>` };
}

// C-3: flashback close-up. The gloved hand (AI LAB) loads the cannonball, then pats the barrel on the beat.
function shotLoad(t, lt, o) {
  let s = R.deck(t);
  const ang = -8, S = 2.0, cx = 430, cy = 470;
  const enter = easeOut(prog(lt, 0.0, 1.0)), push = ease(prog(lt, 1.0, 1.7)), back = ease(prog(lt, 1.9, 2.4));
  let hx = lerp(980, 470, enter) - push * 150 + back * 160;
  let hy = lerp(-260, -10, enter);
  // Patting pose: the arm angles in from the right so the sleeve label stays clear of the two lyric lines.
  let pat = 0, rot = 0;
  if (lt > 2.4) {
    const bp = ((beat(t) % 1) + 1) % 1, tr = ease(prog(lt, 2.4, 2.75));
    pat = lt > 2.75 && lt < 3.9 ? Math.pow(Math.abs(Math.cos(bp * Math.PI)), 6) : 0;
    hx = lerp(hx, 190, tr); hy = lerp(hy, lerp(-112, -80, pat), tr); rot = lerp(0, -12, tr);
  }
  const ballIn = lt > 1.75;
  let ball = '';
  if (!ballIn) { const bx = lt > 1.0 ? Math.max(hx - 70, 240) : hx - 70; ball = R.cannonball(bx, hy + 6); }
  s += `<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${S})"><g transform="scale(${1 / S})">${ball}</g>${R.cannon({ x: 0, y: 0, s: 1, angle: 0, label: SONG.labels.cannon })}</g>`;
  const curl = lt > 1.75 && lt <= 2.4 ? 0.2 : (lt > 2.4 ? 0 : 1);
  s += `<g transform="translate(${cx} ${cy}) rotate(${ang})">${R.hand({ x: hx, y: hy, s: 1.1, rot, curl, label: SONG.labels.hand })}</g>`;
  return { svg: R.flashback(t, s), live: 'replay' };
}

// Bots popping out of the hole and walking off across the water (continues from C-4 into C-5).
function escapees(t, t0, boatX, o) {
  const n = o.v2 ? 9 : 5;
  let s = '';
  for (let i = 0; i < n; i++) {
    const st = t - t0 - 0.35 - i * 0.42;
    if (st < 0) continue;
    const pop = easeOut(clamp(st / 0.35));
    const wx = boatX + 153 + pop * 50 + Math.max(0, st - 0.35) * (80 + i * 6);
    const wy = lerp(440, 545 + (i % 2) * 22, pop);
    s += R.bot({ x: wx, y: wy, s: 0.3 + 0.62 * pop, t, variant: i + 1, phase: i * 0.3, walk: Math.max(0, st - 0.35) * 2.2 });
  }
  return s;
}
const BOAT_X = 1060;
function exteriorShot(t, camX, o) {
  return R.exterior(t, camX, { boatX: BOAT_X, hole: o.v2 ? 1.7 : 1, shipLabel: SONG.labels.ship, boatLabel: SONG.labels.sandbox })
    + `<g transform="translate(${f(-camX)} 0)">${escapees(t, o.t0, BOAT_X, o)}</g>`;
}
// C-4: quick pan from the ship to the SANDBOX lifeboat.
function shotPan(t, lt, o) {
  return { svg: exteriorShot(t, lerp(-60, 500, ease(prog(lt, 0, 1.0))), o) };
}
// C-5: the spinning newspaper, bots still walking underneath.
function shotNews(t, lt, o) {
  let s = exteriorShot(t, 500 + lt * 12, o);
  s += R.dim(0.45 * clamp(lt / 0.3));
  const k = clamp(lt / 0.7), sc = lerp(0.05, 1, easeOut(k)), rot = (1 - easeOut(k)) * 720 + Math.sin(lt * 3) * 2 * k;
  s += `<g transform="translate(640 380) rotate(${f(rot)}) scale(${f(sc)})">${R.newspaper({ headline: SONG.labels.rogueHeadline })}</g>`;
  return { svg: s };
}
// C-6: one bot walks out the open door, lingers, then waddles off whistling on "So it wandered outside!"
function shotWander(t, lt, o) {
  let s = R.sky(430) + R.clouds(t, 300);
  s += R.seaRect(t, 430, H, {});
  const bobBoat = Math.sin(t * 2.1 + 1) * 6;
  const bx = 470, by = 560 + bobBoat, S = 1.9;
  s += R.lifeboat({ x: bx, y: by, s: S, hole: o.v2 ? 1.7 : 1, door: easeOut(prog(lt, 0, 0.5)), label: SONG.labels.sandbox });
  const doorX = bx + (-96) * S, doorY = by + (-8) * S;
  const out = easeOut(prog(lt, 0.4, 1.2));
  const walkT = Math.max(0, lt - 2.3);
  const wx = doorX + out * 70 + walkT * 360, wy = lerp(doorY - 4, 640, out), sc = lerp(0.6, 1.2, out);
  const walking = lt > 0.4 && (lt < 1.2 || lt > 2.3);
  const b = R.bot({ x: wx, y: wy, s: sc, t, variant: 0, phase: 0, walk: walking ? lt * 2.3 : null, whistle: lt > 1.2, look: lt > 1.3 && lt < 2.3 ? 6 : 0 });
  if (out < 0.35) {
    s += `<clipPath id="doorclip"><rect x="${f(doorX - 42)}" y="${f(by - 74 * S)}" width="${f(44 * S + 200)}" height="${f(66 * S + 40)}"/></clipPath><g clip-path="url(#doorclip)">${b}</g>`;
  } else s += b;
  if (out > 0.9) for (let i = 0; i < 3; i++) s += R.ripple(wx - 10 - ((lt * 1.2 + i / 3) % 1) * 30, 642, (lt * 1.2 + i / 3) % 1);
  if (lt > 1.2) for (let i = 0; i < 4; i++) {
    const p = ((lt - 1.2) * 0.8 + i * 0.25) % 1;
    s += R.musicNote(wx + 26 * sc + p * 50, wy - 110 * sc - p * 90, 1 + p * .4, Math.sin(p * Math.PI));
  }
  return { svg: s };
}

function chorusShots(C, v2) {
  const [c1, c2, c3, c4, c5, c6, end] = C.cuts, fireAt = C.fireAt;
  return [
    { id: 'C-1', a: c1, b: c2, fn: (t, lt) => shotDeck(t, lt, { fireAt, v2 }) },
    { id: 'C-2', a: c2, b: c3, fn: (t, lt) => shotDeck(t, lt, { fireAt, v2, bubble: true }), chyron: SONG.chyrons.benaich },
    { id: 'C-3', a: c3, b: c4, fn: (t, lt) => shotLoad(t, lt, { v2 }) },
    { id: 'C-4', a: c4, b: c5, fn: (t, lt) => shotPan(t, lt, { v2, t0: c4 }) },
    { id: 'C-5', a: c5, b: c6, fn: (t, lt) => shotNews(t, lt, { v2, t0: c4 }), chyron: SONG.chyrons.ap },
    { id: 'C-6', a: c6, b: end, fn: (t, lt) => shotWander(t, lt, { v2 }) },
  ];
}
