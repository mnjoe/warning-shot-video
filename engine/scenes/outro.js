// Outro: slow and a cappella. Night falls, protest signs, the logs chest, the cannon at night, the parking lot,
// then the end card with sources and the laugh stinger. Draws through R.*.

const LANTERNS = [200, 520, 840, 1160];
function nightDeck(t, dark = 0.55) {
  return R.deck(t) + R.dim(dark) + LANTERNS.map(x => R.lantern(x, 120, true, t)).join('');
}

// O-1: night falls and the lanterns light; the crew sings in silhouette.
function shotNightfall(t, lt, O) {
  let s = R.deck(t);
  for (let i = 0; i < 8; i++) s += R.bot({ x: 160 + i * 135, y: 650, s: 1.3, t, variant: i, phase: i * 0.2, sway: 5, sing: true });
  const k = ease(prog(lt, 0, 1.2));
  s += R.dim(0.65 * k);
  s += LANTERNS.map((x, i) => R.lantern(x, 120, lt > 0.3 + i * 0.2, t)).join('');
  return { svg: s };
}

// O-2: bots hold up the signs, which read across: SHOW US / THE / PROMPT!
function shotProtest(t, lt, O) {
  let s = nightDeck(t);
  SONG.labels.protest.forEach((text, i) => {
    const at = O.lyr.l1 + i * 0.5, up = backOut(prog(t, at, at + 0.3)), x = 300 + i * 340, bob = Math.sin((beat(t) + i * 0.3) * Math.PI) * 6;
    s += R.signpost({ x, y: 640 - up * 40 + bob, s: 0.95 * Math.max(0.01, up), text });
    s += R.bot({ x: x - 4, y: 670, s: 1.25, t, variant: i + 1, phase: i * 0.3, armsUp: 0.6, sing: true });
  });
  return { svg: s };
}

// O-3: the LOGS chest. Two figures tagged METR and REDWOOD climb in, and the lid slams on us.
function shotLogs(t, lt, O) {
  let s = R.cabinWall(t) + R.dim(0.3);
  const shut = t >= O.slam;
  s += R.chest({ x: 460, y: 640, s: 1.3, label: SONG.labels.logs, open: shut ? 1 - easeIn(prog(t, O.slam - 0.08, O.slam)) : 1 });
  [[SONG.labels.metr, 0], [SONG.labels.redwood, 0.4]].forEach(([name, d], i) => {
    const walk = prog(t, O.lyr.l2 + d, O.lyr.l2 + d + 1.4), hop = prog(t, O.lyr.l2 + d + 1.4, O.lyr.l2 + d + 1.9);
    if (hop >= 1) return;
    const x = lerp(1000 + i * 160, 470 + i * 30, ease(walk)), y = 640 - Math.sin(Math.PI * hop) * 160 + easeIn(hop) * 60, sc = 1.3 * (1 - hop * 0.6);
    s += R.officer({ x, y, s: sc, t, phase: i, flip: true, hat: false, look: 2 }) + R.nameTag(x, y - 290 * sc / 1.3 - 30, name);
  });
  if (shut) s += R.sfx(700, 330, backOut(prog(t, O.slam, O.slam + 0.2)), copy('slam'), -8, 80) + R.dust(460, 450, (t - O.slam) / 0.5, 2.2);
  const shake = shut && t - O.slam < 0.4 ? `translate(${f(Math.sin(t * 90) * 10 * (1 - (t - O.slam) / 0.4))} 0)` : '';
  return { svg: `<g transform="${shake}">${s}</g>` };
}

// O-3b: the WARNING SHOT cannon at night, smoke still curling from the barrel. Then it fires again: confetti.
function shotCannonNight(t, lt, O) {
  let s = R.nightSky(t, 470) + R.moon(1040, 150) + R.seaRect(t, 470, H, { fillKey: 'nightDeep' });
  s += R.dock(-40, 1320, 640, 30);
  const fire = t >= O.encore ? t - O.encore : null, m = muzzle(620, 520, 1.4, -20);
  s += R.cannon({ x: 620, y: 520, s: 1.4, angle: -20, label: SONG.labels.cannon, fire }) + R.dim(0.35);
  if (fire == null) for (let i = 0; i < 6; i++) { const p = ((lt * 0.35 + i / 6) % 1); s += R.smokePuff(m.x + Math.sin(p * 6 + i) * 20 + p * 60, m.y - 20 - p * 260, 14 + p * 30, (1 - p) * 0.8); }
  if (fire != null) s += R.confetti(m.x, m.y, fire);   // one more shot, confetti this time, bright against the night
  return { svg: s };
}

// O-4: pull back to reveal the ship parked between painted lines, next to a parking meter.
function shotParkingLot(t, lt, O) {
  const z = lerp(1.9, 1, ease(prog(lt, 1.2, 3.6)));   // close on the hull, then pull back on "parking lot"
  let world = R.nightSky(t, 470) + R.moon(200, 130) + R.parkingLot(470);
  world += R.ship({ x: 640, y: 600, s: 0.62, t, label: SONG.labels.ship, crew: 0, flag: true });
  world += R.parkingMeter({ x: 1000, y: 640, s: 1.1 });
  return { svg: `<g transform="translate(640 520) scale(${f(z)}) translate(-640 -520)">${world}</g>` };
}

// O-5 and O-6: the end card and sources; then the 8-bit bot pops in and laughs along.
function shotEndCard(t, lt, O, stinger) {
  let s = R.endCard({ k: prog(t, O.cuts[5], O.cuts[5] + 0.6), sources: SONG.sources });
  if (stinger) {
    const pop = backOut(prog(t, O.laugh - 0.2, O.laugh + 0.1));
    s += R.pixelBot({ x: 1205, y: 705, s: 1.25 * pop, t, laugh: t > O.laugh }) + R.sfx(1010, 690, pop, copy('laugh'), -6, 40);   // clear of the sources list
  }
  return { svg: s };
}

function outroShots(O) {
  const c = O.cuts;
  return [
    { id: 'O-1', a: c[0], b: c[1], fn: (t, lt) => shotNightfall(t, lt, O) },
    { id: 'O-2', a: c[1], b: c[2], fn: (t, lt) => shotProtest(t, lt, O) },
    { id: 'O-3', a: c[2], b: c[3], fn: (t, lt) => shotLogs(t, lt, O) },
    { id: 'O-3b', a: c[3], b: c[4], fn: (t, lt) => shotCannonNight(t, lt, O) },
    { id: 'O-4', a: c[4], b: c[5], fn: (t, lt) => shotParkingLot(t, lt, O) },
    { id: 'O-5', a: c[5], b: c[6], fn: (t, lt) => shotEndCard(t, lt, O, false), chrome: false },
    { id: 'O-6', a: c[6], b: c[7] + 1, fn: (t, lt) => shotEndCard(t, lt, O, true), chrome: false },
  ];
}
