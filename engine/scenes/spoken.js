// Spoken Word: the PNN studio. The band drops out; the captain's cabin becomes a news studio.
// Real names appear only in chyrons; the pundits are parrots. Positions and timing only; draws through R.*.

// S-1: full-screen quote card with the OpenAI attribution.
function shotQuoteCard(t, lt) {
  return { svg: R.studioSet(t) + R.dim(0.35) + R.quoteCard({ lines: SONG.labels.openaiQuote, k: prog(lt, 0, 0.4) }) };
}

// S-2 and S-4: the prompt terminal. Pre-typed (invented, tagged DRAMATIZATION); it deletes on "No?", REDACTED on "Okay."
function shotPrompt(t, lt, P) {
  const lines = SONG.labels.fakePrompt, total = lines.join('').length;
  const chars = total * (1 - prog(t, P.no, P.no + 0.35));
  let s = R.studioSet(t) + R.dim(0.25) + R.terminal({ x: 520, y: 400, s: 0.9, lines, chars, t });
  s += R.bigStamp(520, 400, prog(t, P.okay - 0.08, P.okay), SONG.labels.redacted, -12, 110);
  const gull = R.cabinWall(t) + R.seagull({ x: 150, y: 250, s: 1.25, t, talk: t > SONG.spoken.lyr.s2 && t < P.okay + 0.3 });
  s += R.pip({ x: 900, y: 150, w: 330, h: 250, inner: gull, k: backOut(prog(t, SONG.spoken.cuts[1], SONG.spoken.cuts[1] + 0.2)), id: 'gull' });
  s += R.tagLabel({ x: 40, y: 560, lines: SONG.labels.dramatization });
  return { svg: s };
}

// S-5: the parrot pundits at the desk. One squawks per quote; the chyron names the source.
function shotPundits(t, lt, who) {
  let s = R.studioSet(t);
  [360, 640, 920].forEach((x, i) => {
    const on = i === who, sc = on ? 1.85 : 1.6;
    s += R.parrot({ x, y: 490, s: sc, t, variant: i, squawk: on ? 1 : 0, flap: on ? 0.3 : 0, flip: x > 640 });
    if (on) s += R.sfx(x + (x > 640 ? -110 : 110), 230, 0.9 + 0.1 * Math.abs(Math.sin(t * 16)), '!', x > 640 ? -10 : 10, 80);
  });
  s += R.newsDesk({ x: 640, y: 480 });
  return { svg: s };
}

// S-6: callback to the late-May lookout, then two officers pointing at each other.
function shotWhoToTell(t, lt, S) {
  const split = S.lyr.s6b - 0.1;
  if (t < split) {
    let s = R.sky(H) + R.clouds(t) + R.crowsNest({ x: 360, y: 840, s: 1.15 });
    s += R.officer({ x: 360, y: 840 - 420 * 1.15, s: 1.15, t, spyglass: 1, look: 2, name: SONG.labels.officers[0] }) + R.crowsNestFront({ x: 360, y: 840, s: 1.15 });
    s += R.spyView(890, 400, 210, R.cabinWall(t), R.noticeBoard({ x: 0, y: -150, s: 0.62, title: SONG.labels.board, notes: 60, t }));
    return { svg: R.flashback(t, s), live: 'replay' };
  }
  let s = R.deck(t);
  const p = easeOut(prog(t, split, split + 0.35));
  s += R.officer({ x: 470, y: 660, s: 1.6, t, point: p, look: 3, frown: true, name: SONG.labels.officers[0] });
  s += R.officer({ x: 810, y: 660, s: 1.6, t, phase: 0.5, point: p, flip: true, look: 3, frown: true, name: SONG.labels.officers[1] });
  s += R.sfx(640, 300, backOut(prog(t, split + 0.4, split + 0.65)), '?!', 0, 96);
  // The deadpan seagull answers the question.
  const d = S.duh, k = backOut(prog(t, d - 0.25, d - 0.05));
  if (k > 0) {
    const gull = R.cabinWall(t) + R.seagull({ x: 140, y: 230, s: 1.15, t, talk: t > d && t < d + 0.6 });
    s += R.pip({ x: 930, y: 170, w: 300, h: 220, inner: gull, k, id: 'duh' });
    s += R.chatBubble(835, 290, backOut(prog(t, d, d + 0.2)), SONG.labels.duh, 'right');   // tail points at the seagull
  }
  return { svg: s };
}

// S-7a: a parrot flaps about secret civilizations. S-7b: the giant blinking SECRET MEETING HERE over the board.
function shotConspiracy(t, lt) {
  let s = R.studioSet(t) + R.parrot({ x: 640, y: 500, s: 2.3, t, variant: 2, squawk: 1, flap: 1 });
  return { svg: s + R.newsDesk({ x: 640, y: 480 }) };
}
function shotSecretMeeting(t, lt) {
  let s = R.cabinWall(t) + R.noticeBoard({ x: 640, y: 290, s: 0.95, title: SONG.labels.board, notes: 98, t });
  s += R.marquee({ x: 640, y: 222, s: 0.9 * backOut(prog(lt, 0.1, 0.45)), text: SONG.labels.secretMeeting, t });
  for (let i = 0; i < 6; i++) s += R.bot({ x: 160 + i * 190, y: 720, s: 1.0, t, variant: i, phase: i * 0.3, sway: 5, look: -3 });
  return { svg: s };
}

function spokenShots(S) {
  const c = S.cuts, ch = SONG.chyrons;
  return [
    { id: 'S-1', a: c[0], b: c[1], fn: (t, lt) => shotQuoteCard(t, lt), chyron: ch.openai },
    { id: 'S-2', a: c[1], b: c[2], fn: (t, lt) => shotPrompt(t, lt, S) },
    { id: 'S-4', a: c[2], b: c[3], fn: (t, lt) => shotPrompt(t, lt, S) },
    { id: 'S-5', a: c[3], b: c[4], fn: (t, lt) => shotPundits(t, lt, 0), chyron: ch.delangue },
    { id: 'S-5', a: c[4], b: c[5], fn: (t, lt) => shotPundits(t, lt, 1), chyron: ch.cotra },
    { id: 'S-5', a: c[5], b: c[6], fn: (t, lt) => shotPundits(t, lt, 2), chyron: ch.eighty },
    { id: 'S-5', a: c[6], b: c[7], fn: (t, lt) => shotPundits(t, lt, 0), chyron: ch.sanders },
    { id: 'S-6', a: c[7], b: c[8], fn: (t, lt) => shotWhoToTell(t, lt, S) },
    { id: 'S-7', a: c[8], b: c[9], fn: (t, lt) => shotConspiracy(t, lt), chyron: ch.patel },
    { id: 'S-7', a: c[9], b: c[10], fn: (t, lt) => shotSecretMeeting(t, lt) },
  ];
}
