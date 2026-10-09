// Final chorus: key change, everything at full volume, with the payoffs. Reuses chorus shots for F-4b and F-4c.

// F-1: the sun bursts through; the whole crew sings with arms up; the cannon fires on the shout.
function shotFinalCrew(t, lt, F) {
  const fire = t >= F.lyr.shout ? t - F.lyr.shout : null;
  let s = R.deck(t) + R.sunburst(1060, 150, t, easeOut(prog(lt, 0, 0.6)));
  for (let i = 0; i < 8; i++) s += R.bot({ x: 180 + i * 90, y: 470, s: 0.95, t, variant: i + 2, phase: i * 0.13 + 0.5, sway: 9, sing: true, armsUp: 0.85 });
  for (let i = 0; i < 8; i++) s += R.bot({ x: 160 + i * 100, y: 650, s: 1.35, t, variant: i, phase: i * 0.21, sway: 8, sing: true, armsUp: 0.85 });
  s += R.cannon({ x: 1080, y: 560, s: 0.85, angle: -14, fire, label: SONG.labels.cannon });
  return { svg: s };
}

// F-2: the cannonball lands right at the lab officer's feet.
function shotFeet(t, lt, F) {
  let s = R.deck(t);
  const fall = prog(t, F.thud - 0.45, F.thud), ballY = lerp(-80, 640, easeIn(fall)), hit = t >= F.thud;
  s += R.officer({ x: 560, y: 660, s: 1.7, t, look: hit ? 0 : 2, shrug: hit ? easeOut(prog(t, F.thud, F.thud + 0.2)) : 0, frown: hit });
  s += R.cannonball(700, hit ? 630 : ballY - 30);
  if (hit) s += R.dust(700, 660, (t - F.thud) / 0.6, 2.4) + R.impact(700, 660, (t - F.thud) / 0.4, 2) + R.sfx(860, 520, backOut(prog(t, F.thud, F.thud + 0.2)), copy('thud'), -6, 70);
  return { svg: s };
}

// F-3: close on the board: "We've found other agents!"
function shotOtherAgents(t, lt, F) {
  let s = R.cabinWall(t) + R.noticeBoard({ x: 640, y: 160, s: 1.05, title: SONG.labels.board, notes: 98, t });
  s += R.stickyNote(640, 330, backOut(prog(t, F.lyr.l3, F.lyr.l3 + 0.25)), SONG.labels.otherAgents);
  for (let i = 0; i < 7; i++) s += R.bot({ x: 140 + i * 170, y: 720, s: 1.05, t, variant: i, phase: i * 0.3, sway: 6, sing: t > F.lyr.l3b });
  return { svg: s };
}

// F-4a: the lifeboat's sign: AIR GAP: NONE.
function shotAirGap(t, lt, F) {
  let s = R.sky(430) + R.clouds(t) + R.seaRect(t, 430, H, {});
  const bob = Math.sin(t * 2.1 + 1) * 6, bx = 640, by = 600 + bob, S = 1.55, land = prog(lt, 0.05, 0.3);
  s += R.signpost({ x: bx - 70, y: by - 98 * S - (1 - easeIn(land)) * 560, s: 1.05, text: SONG.labels.airGap, tilt: 0 });
  s += R.lifeboat({ x: bx, y: by, s: S, t, hole: 1.7, label: SONG.labels.sandbox, peek: 1 });
  s += R.seaRect(t + 3, 640, H, { gap: 30 });
  return { svg: s };
}

function finalShots(F) {
  const c = F.cuts;
  return [
    { id: 'F-1', a: c[0], b: c[1], fn: (t, lt) => shotFinalCrew(t, lt, F) },
    { id: 'F-2', a: c[1], b: c[2], fn: (t, lt) => shotFeet(t, lt, F) },
    { id: 'F-3', a: c[2], b: c[3], fn: (t, lt) => shotOtherAgents(t, lt, F) },
    { id: 'F-4a', a: c[3], b: c[4], fn: (t, lt) => shotAirGap(t, lt, F) },
    { id: 'F-4b', a: c[4], b: c[5], fn: (t, lt) => shotNews(t, lt, { v2: true, t0: c[4] - 1.5 }), chyron: SONG.chyrons.ap },
    { id: 'F-4c', a: c[5], b: c[6], fn: (t, lt) => { const r = shotWander(t, lt * 2, { v2: true }); return { svg: r.svg + R.dim(0.5 * prog(lt, 0.5, c[6] - c[5])) }; } },
  ];
}
