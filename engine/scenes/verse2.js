// Verse 2: the leak. V2-1 NO INTERNET sign, V2-2 the Artifactory shack never set offline, V2-3 the sandbox door,
// V2-4 the message board crowd, V2-5 the field trip, V2-6 the server log. Positions and timing only; draws through R.*.

// V2-1: the sign lands in the lifeboat on the beat; then eyes peek out of the hole right beside it.
function shotNoInternet(t, lt, V) {
  let s = R.sky(430) + R.clouds(t) + R.seaRect(t, 430, H, {});
  const bob = Math.sin(t * 2.1 + 1) * 6, bx = 640, by = 600 + bob, S = 1.55;
  s += R.towline(-40, 380, 200, 470, bx - 250, by - 60);
  const land = prog(t, V.signLand - 0.4, V.signLand), dy = (1 - easeIn(land)) * -560;
  const wob = t > V.signLand ? Math.sin((t - V.signLand) * 14) * 6 * Math.exp(-(t - V.signLand) * 3) : 0;
  s += R.signpost({ x: bx - 70, y: by - 98 * S + dy, s: 1.05, text: SONG.labels.noInternet, tilt: wob });
  s += R.lifeboat({ x: bx, y: by, s: S, t, hole: 1, label: SONG.labels.sandbox, peek: easeOut(prog(t, V.peek, V.peek + 0.25)) });
  if (t > V.signLand) s += R.dust(bx - 70, by - 98 * S, (t - V.signLand) / 0.5, 1.6);
  s += R.seaRect(t + 3, 640, H, { gap: 30 });
  return { svg: s };
}

// V2-2: the dock shack with its switch on OFF, a gangplank and rope running to THE INTERNET, bots strolling across.
function shotShack(t, lt, V) {
  let s = R.sky(470) + R.clouds(t) + R.seaRect(t, 470, H, {});
  s += R.internetShore({ x: 1070, y: 520, s: 1, t, label: SONG.labels.internet });
  s += R.dock(-20, 520, 560, 40);
  const sh = { x: 270, y: 502, s: 1, label: SONG.labels.artifactory, offline: 0, t };
  s += R.gangplank(400, 470, 860, 430);
  for (let i = 0; i < 3; i++) {
    const u = ((lt * 0.22 + i * 0.33) % 1), x = lerp(410, 850, u), y = lerp(468, 428, u);
    s += R.bot({ x, y: y - 4, s: 0.42, t, variant: i + 2, phase: i * 0.4, walk: lt * 2.4 + i * 0.3, backpack: true });
  }
  s += R.shack(sh);
  s += R.seaRect(t + 3, 610, H, { gap: 30 });
  const sw = R.shackSwitchPos(sh), k = backOut(prog(lt, 0.15, 0.5));
  s += R.callout({ x: 640, y: 250, ax: sw.x, ay: sw.y, k, t, lines: [{ s: SONG.labels.offlineMode }, { s: SONG.labels.off, hot: true }] });
  return { svg: s };
}

// V2-3: close on the lifeboat. The door creaks open, and eyes look out of the dark.
function shotDoor(t, lt, V) {
  let s = R.sky(430) + R.clouds(t, 200) + R.seaRect(t, 430, H, {});
  const bob = Math.sin(t * 2.1 + 1) * 6, bx = 560, by = 590 + bob, S = 1.9;
  const open = ease(prog(t, V.creak, V.creak + 0.7));
  s += R.lifeboat({ x: bx, y: by, s: S, t, hole: 1, door: open, label: SONG.labels.sandbox, doorPeek: easeOut(prog(t, V.creak + 0.85, V.creak + 1.1)) });
  const p = prog(t, V.creak, V.creak + 1.4);
  if (p > 0 && p < 1) s += R.sfx(bx - 230, by - 240, backOut(clamp(p * 5)) * (p > 0.8 ? (1 - p) * 5 : 1), copy('creak'), -6, 58);
  s += R.seaRect(t + 3, 650, H, { gap: 30 });
  return { svg: s };
}

// V2-4: the board fills with notes while the crowd grows; the counter runs to 1,200.
function shotBoard(t, lt, V, dur) {
  let s = R.cabinWall(t);
  const fill = easeOut(prog(lt, 0, dur - 0.4));
  s += R.noticeBoard({ x: 600, y: 165, s: 0.92, title: SONG.labels.board, notes: 10 + fill * 88, t });
  const b = beat(t);
  for (let i = 0; i < 11; i++) {
    if (lt < i * 0.12) continue;
    s += R.bot({ x: 110 + i * 100, y: 560, s: 0.8, t, variant: i + 1, phase: i * 0.37, sway: 6, armsUp: (i % 3 === 0) ? 0.5 + 0.5 * Math.abs(Math.sin(Math.PI * (b + i * 0.3))) : 0 });
  }
  for (let i = 0; i < 9; i++) {
    if (lt < 0.4 + i * 0.15) continue;
    s += R.bot({ x: 160 + i * 120, y: 690, s: 1.1, t, variant: i + 3, phase: i * 0.23, sway: 7, look: -3 });
  }
  s += R.counter({ x: 1250, y: 120, value: SONG.counts.board * easeOut(prog(lt, 0.1, dur - 0.5)), k: backOut(prog(lt, 0, 0.25)) });
  return { svg: s };
}

// V2-5: the field trip. A line of bots with backpacks marches along the boardwalk to the harbor town.
function shotFieldTrip(t, lt, V) {
  let s = R.sky(470) + R.clouds(t) + R.seaRect(t, 470, H, {});
  s += R.dock(-40, 1300, 600, 30);
  for (let i = 0; i < 14; i++) {
    const x = ((-60 + i * 72 + lt * 120) % 1010) - 40;
    s += R.bot({ x, y: 554, s: 0.6, t, variant: i, phase: i * 0.21, walk: lt * 2.6 + i * 0.37, backpack: true });
  }
  s += R.harborTown({ x: 1040, y: 560, s: 0.95, t, label: SONG.labels.hf });   // drawn after the bots: they disappear into town
  s += R.seaRect(t + 3, 640, H, { gap: 30 });
  s += R.counter({ x: 1250, y: 120, value: SONG.counts.trip * easeOut(prog(lt, 0.05, 0.9)), k: backOut(prog(lt, 0, 0.25)) });
  return { svg: s };
}

// V2-6: the server log fills with tally marks through the drum stop. The headline lands.
function shotLog(t, lt, V, dur) {
  let s = R.cabinWall(t);
  const m = 300 * easeIn(prog(lt, 0.1, dur));
  s += R.ledger({ x: 640, y: 360, s: 0.9, title: SONG.labels.serverLog, marks: m });
  if (lt > 0.15) s += R.headline(lt - 0.15, SONG.headlines.counts);
  return { svg: s };
}

function verse2Shots(V) {
  const [a, b, c, d, e, g, end] = V.cuts;
  return [
    { id: 'V2-1', a, b, fn: (t, lt) => shotNoInternet(t, lt, V) },
    { id: 'V2-2', a: b, b: c, fn: (t, lt) => shotShack(t, lt, V) },
    { id: 'V2-3', a: c, b: d, fn: (t, lt) => shotDoor(t, lt, V) },
    { id: 'V2-4', a: d, b: e, fn: (t, lt) => shotBoard(t, lt, V, e - d) },
    { id: 'V2-5', a: e, b: g, fn: (t, lt) => shotFieldTrip(t, lt, V) },
    { id: 'V2-6', a: g, b: end, fn: (t, lt) => shotLog(t, lt, V, end - g) },
  ];
}
