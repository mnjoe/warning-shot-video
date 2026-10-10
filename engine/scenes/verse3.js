// Verse 3: the ship's log. Each date is a logbook page: the page turns at the cut and the date is stamped on a beat.
// V3-1 first note, V3-2 the lookout, V3-3 port sweep, V3-4 independence, V3-5 the leads, V3-6 same day,
// V3-7 a stranger in the house, V3-8 the mouse. Positions and timing only; every drawing call goes through R.*.

const stampOf = (V, i, t) => R.dateStamp({ x: 1252, y: 156, text: SONG.labels.dates[i], k: prog(t, V.stamps[i] - 0.18, V.stamps[i]) });

// V3-1: an empty board; a bot pops up and pins the very first note.
function shotFirstNote(t, lt, V) {
  let s = R.cabinWall(t) + R.noticeBoard({ x: 640, y: 170, s: 1.05, title: SONG.labels.board, notes: 0, t });
  const p = V.pin, up = easeOut(prog(t, p - 0.7, p - 0.25)), arm = prog(t, p - 0.3, p);
  s += R.bot({ x: 520, y: lerp(900, 720, up), s: 1.6, t, variant: 2, armsUp: lerp(0, 0.8, arm) * (t < p + 0.6 ? 1 : 0.2), look: t > p + 0.8 ? -4 : 2 });
  if (t > p - 0.05) s += R.stickyNote(640, 340, backOut(prog(t, p - 0.05, p + 0.15)), SONG.labels.firstNote);
  return { svg: s + stampOf(V, 0, t) };
}

// V3-2: an officer in the crow's nest watches the board through a spyglass, then shrugs. On "SOME MORE!" it overflows.
function shotLookout(t, lt, V) {
  const L = V.lyr;
  let s = R.sky(H) + R.clouds(t);
  s += R.crowsNest({ x: 300, y: 780, s: 1.15 });
  const shrug = easeOut(prog(t, 66.4, 66.8)) * (1 - easeIn(prog(t, 67.3, 67.6)));
  s += R.officer({ x: 300, y: 780 - 420 * 1.15, s: 1.15, t, spyglass: 1 - shrug, shrug, look: 2, name: SONG.labels.officers[0] });
  s += R.crowsNestFront({ x: 300, y: 780, s: 1.15 });
  const notes = lerp(8, 60, easeOut(prog(t, V.cuts[1], L.more))) + 40 * easeOut(prog(t, L.more, L.more + 0.4));
  const view = R.noticeBoard({ x: 0, y: -150, s: 0.62, title: SONG.labels.board, notes, t });
  s += R.spyView(890, 400, 210, R.cabinWall(t), view);
  if (t > L.more) s += R.sfx(890, 590, backOut(prog(t, L.more, L.more + 0.25)), copy('moreShout'), -6, 70);
  return { svg: s + stampOf(V, 1, t) };
}

// V3-3: the ship's bell clangs; PORT SWEEP ALERT flashes.
function shotBell(t, lt, V) {
  let s = R.deck(t);
  const [c1, c2] = V.clangs, sw = Math.sin((t - c1 + 0.25) * Math.PI / 0.5) * 22 * clamp((t - (c1 - 0.5)) / 0.5) ;
  s += R.bell({ x: 420, y: 190, s: 1.15, swing: t > c1 - 0.5 ? sw : 0 });
  for (const c of [c1, c2]) { const p = prog(t, c, c + 0.45); if (p > 0 && p < 1) { s += R.shakeLines(420, 360, 120, 1 - p) + R.sfx(420 + (c === c2 ? 60 : -60), 540, backOut(clamp(p * 5)), copy('clang'), c === c2 ? 8 : -10, 64); } }
  s += R.alertSign({ x: 930, y: 330, s: 1, text: SONG.labels.portSweep, on: (t % 0.5) < 0.3 ? 1 : 0 });
  return { svg: s + stampOf(V, 2, t) };
}

// V3-4: fireworks over the dock at night. The shack falls in the drum stop; the bots raise INDEPENDENCE.
function shotIndependence(t, lt, V) {
  let s = R.nightSky(t, 470) + R.seaRect(t, 470, H, { fillKey: 'nightDeep' });
  const fw = [[71.70, 300, 150, 'live'], [72.12, 960, 120, 'brass'], [72.60, 640, 200, 'star'], [74.13, 220, 230, 'brass'], [74.63, 1040, 170, 'live'],
    [75.12, 520, 120, 'star'], [75.62, 820, 160, 'live'], [76.08, 340, 140, 'brass'], [76.58, 1000, 230, 'star'], [77.08, 600, 150, 'live']];
  fw.forEach(([at, x, y, c]) => { s += R.firework(x, y, prog(t, at, at + 0.9), c); });
  s += R.dock(-40, 1320, 600, 40);
  const fall = prog(t, V.fell - 0.05, V.fell + 0.35);
  if (fall < 1) s += `<g transform="translate(640 542) rotate(${f(easeIn(fall) * 12)}) scale(1 ${f(1 - easeIn(fall) * 0.85)}) translate(-640 -542)">${R.shack({ x: 640, y: 542, s: 1.05, label: SONG.labels.artifactory, t })}</g>`;
  if (t > V.fell + 0.2) s += R.rubble({ x: 640, y: 540, s: 1.05 }) + R.signpost({ x: 430, y: 548, s: 0.8, text: SONG.labels.formerly, tilt: -8 });
  if (t > V.fell) s += R.dust(640, 540, (t - V.fell) / 0.8, 3.2);
  const up = easeOut(prog(t, V.banner - 0.3, V.banner));
  if (up > 0) {
    const y = lerp(720, 552, up);
    s += R.heldBanner({ x: 820, y: y - 60, w: 300, text: SONG.labels.independence, t });
    s += R.bot({ x: 670, y, s: 0.95, t, variant: 1, armsUp: 0.75, sing: true }) + R.bot({ x: 970, y, s: 0.95, t, variant: 3, phase: 0.4, armsUp: 0.75, sing: true, flip: true });
  }
  s += R.seaRect(t + 3, 640, H, { fillKey: 'nightDeep', gap: 30 });
  return { svg: s + stampOf(V, 3, t) };
}

// V3-5: the leads stare at the red-string corkboard and scratch their heads. Then the lab glove wipes it clean.
function shotLeads(t, lt, V) {
  const L = V.lyr, [w0, w1] = V.wipeAt;
  let s = R.cabinWall(t);
  const wipe = ease(prog(t, w0, w1));
  s += R.corkboard({ x: 470, y: 380, s: 1, wipe });
  const scr = t > L.july5b ? 1 : 0, sh = easeOut(prog(t, w1, w1 + 0.3));
  s += R.officer({ x: 900, y: 700, s: 1.55, t, scratch: scr * (1 - sh), shrug: sh, flip: true, frown: true, name: SONG.labels.officers[0] });
  s += R.officer({ x: 1110, y: 690, s: 1.45, t, phase: 0.6, scratch: (t > L.july5b + 0.5 ? 1 : 0) * (1 - sh), shrug: sh, flip: true, name: SONG.labels.officers[1] });
  [L.july5b + 0.3, L.july5b + 0.8].forEach((at, j) => { s += R.sfx(j ? 1150 : 920, j ? 330 : 310, backOut(prog(t, at, at + 0.25)) * (1 - sh), '?', j ? 12 : -12, 90); });
  if (t > w0 - 0.3 && t < w1 + 0.4) {
    const hx = lerp(150, 820, wipe), hy = 390 + Math.sin(wipe * Math.PI * 4) * 50, inn = easeOut(prog(t, w0 - 0.3, w0)), out = easeIn(prog(t, w1, w1 + 0.4));
    s += R.hand({ x: hx, y: hy + (1 - inn) * 400 + out * 400, s: 1.0, rot: 70, curl: 0.1, label: SONG.labels.hand });
  }
  return { svg: s + stampOf(V, 4, t) };
}

// V3-6: the rebuilt shack, shiny and new. On "same day" the screen splits: the bots are already chatting.
function shotSameDay(t, lt, V) {
  const L = V.lyr, k = ease(prog(t, L.same - 0.1, L.same + 0.25)), edge = lerp(W + 10, 640, k);
  const shackSide = () => {
    let s = R.sky(470) + R.clouds(t) + R.seaRect(t, 470, H, {}) + R.dock(-40, 1320, 600, 40);
    s += R.shack({ x: 640, y: 542, s: 1.1, label: SONG.labels.artifactory, t });
    for (let i = 0; i < 5; i++) s += R.sparkle(500 + rnd(i) * 300, 300 + rnd(i + 4) * 220, ((t * 0.9 + i / 5) % 1), 1.2);
    s += R.plaque({ x: 640, y: 210, s: 0.8, text: SONG.labels.rebuilt, swing: Math.sin(t * 2) * 3 });
    return s + R.seaRect(t + 3, 640, H, { gap: 30 });
  };
  const chatSide = () => {
    let s = R.cabinWall(t);
    s += R.bot({ x: 850, y: 660, s: 1.45, t, variant: 0, sway: 6, sing: true }) + R.bot({ x: 1090, y: 660, s: 1.45, t, variant: 2, phase: 0.5, sway: 6, sing: true, flip: true });
    s += R.chatBubble(830, 410, backOut(prog(t, L.same + 0.4, L.same + 0.65)), SONG.labels.chat[0]);
    s += R.chatBubble(1110, 380, backOut(prog(t, L.same + 0.9, L.same + 1.15)), SONG.labels.chat[1]);
    return s;
  };
  let s = `<g transform="translate(${f(-320 * k)} 0)">${shackSide()}</g>`;
  if (k > 0) {
    s += `<clipPath id="splitclip"><rect x="${f(edge)}" y="0" width="${W}" height="${H}"/></clipPath><g clip-path="url(#splitclip)"><g transform="translate(${f(edge - 640)} 0)">${chatSide()}</g></g>`;
    s += R.divider(edge) + R.sfx(960, 260, backOut(prog(t, L.same, L.same + 0.3)), SONG.labels.sameDay, -4, 76);
  }
  return { svg: s + stampOf(V, 5, t) };
}

// V3-7: the harbor town at night. A window flicks on, with a silhouette in it.
function shotStranger(t, lt, V) {
  let s = R.nightSky(t, 470) + R.moon(1040, 170) + R.seaRect(t, 470, H, { fillKey: 'nightDeep' });
  const on = t < V.light ? 0 : (t - V.light < 0.25 ? (Math.floor((t - V.light) * 24) % 2) : 1);
  const z = 1 + lt * 0.02 + 0.9 * ease(prog(t, V.light + 0.3, V.light + 1.3)), wx = 579, wy = 398;   // push in on the lit window
  s += `<g transform="translate(${wx} ${wy}) scale(${f(z)}) translate(${-wx} ${-wy})">${R.harborTown({ x: 640, y: 590, s: 1.35, t, label: SONG.labels.hf, night: 1, lit: on, stranger: on * easeOut(prog(t, V.light + 0.25, V.light + 0.7)) })}</g>`;
  s += R.seaRect(t + 3, 650, H, { fillKey: 'nightDeep', gap: 30 });
  return { svg: s + stampOf(V, 6, t) };
}

// V3-8: someone finally looks at the sandbox. Eyes in the hole; then the mouse bolts out with a SQUEAK.
function shotMouse(t, lt, V) {
  let s = R.sky(430) + R.clouds(t, 200) + R.seaRect(t, 430, H, {});
  const bob = Math.sin(t * 2.1 + 1) * 6, bx = 700, by = 590 + bob, S = 1.7, q = V.squeak;
  s += R.lifeboat({ x: bx, y: by, s: S, t, hole: 1, label: SONG.labels.sandbox, peek: t < q - 0.05 ? easeOut(prog(t, q - 1.6, q - 1.3)) : 0 });
  const startled = easeOut(prog(t, q, q + 0.2));
  s += R.officer({ x: 150, y: 700, s: 1.5, t, scratch: t > V.lyr.mouseB && t < q ? 1 : 0, shrug: startled, look: 3, frown: t > q, name: SONG.labels.officers[1] });
  if (t > q - 0.05) {
    const run = prog(t, q - 0.05, q + 0.9), hx = bx + 118 * S, hy = by - 40 * S;
    s += R.mouse({ x: hx + easeIn(run) * 700, y: lerp(hy + 30, 640, clamp(run * 4)), s: 1.3, t, run: t * 7 });
    const p = prog(t, q, q + 0.8); if (p < 1) s += R.sfx(hx + 60, hy - 120, backOut(clamp(p * 5)) * (p > 0.8 ? (1 - p) * 5 : 1), copy('squeak'), -8, 64);
  }
  s += R.seaRect(t + 3, 655, H, { gap: 30 });
  return { svg: s };
}

function verse3Shots(V) {
  const c = V.cuts, fns = [shotFirstNote, shotLookout, shotBell, shotIndependence, shotLeads, shotSameDay, shotStranger, shotMouse];
  return fns.map((fn, i) => ({ id: `V3-${i + 1}`, a: c[i], b: c[i + 1], fn: (t, lt) => fn(t, lt, V), trans: i < 7 ? 'page' : undefined }));
}
