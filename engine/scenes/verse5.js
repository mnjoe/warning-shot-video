// Verse 5: the verdict. The calm-down camp gets the last word before the final chorus. Draws through R.*.

// V5-1: the glove pulls the starter cord; the dog with the weedwhacker tears across the deck, shredding ropes.
const ROPES = [760, 900, 1040, 1180];
function shotDog(t, lt, V) {
  const run = V.dogRuns, pass = x => { const u = clamp((x - 540 + 250) / (W + 380 - 540)); return run + 1.7 * Math.cbrt(u); };   // cutter reaches rope x    // when the dog's cutter reaches screen x (u = x / W)
  const dogX = lerp(540, W + 380, easeIn(prog(t, run, run + 1.7)));   // one tearing pass, left to right
  let s = R.deck(t);
  ROPES.forEach(x => {
    const cut = t > pass(x);
    s += R.towline(x, 0, x + 14, 220, x, cut ? 250 : 520);
    if (cut) s += R.ropeBits(x, 520, t - pass(x));
  });
  const starter = prog(t, run - 0.8, run - 0.2);
  if (starter > 0 && starter < 1) s += R.hand({ x: 400 - 200 * ease(starter), y: 470 - 80 * Math.sin(Math.PI * starter), s: 0.9, rot: 170, curl: 1, label: SONG.labels.hand });
  s += R.dog({ x: dogX, y: 650, s: 1.4, t, run: t < run ? 0 : t * 3.2 });
  return { svg: s };
}

// V5-2: the headline.
function shotHeadline(t, lt, V) {
  let s = R.cabinWall(t) + R.dim(0.35);
  const k = clamp(lt / 0.7), sc = lerp(0.05, 1, easeOut(k)), rot = (1 - easeOut(k)) * 720 + Math.sin(lt * 3) * 2 * k;
  s += `<g transform="translate(640 370) rotate(${f(rot)}) scale(${f(sc)})">${R.newspaper({ headline: SONG.labels.salvaggioHeadline })}</g>`;
  return { svg: s };
}

// V5-3: the ship's blueprint gets stamped HUMAN BY DESIGN.
function shotBlueprint(t, lt, V) {
  let s = R.cabinWall(t) + R.blueprint({ x: 640, y: 390, s: 1.05, title: SONG.labels.blueprint, shipLabel: SONG.labels.ship });
  const k = prog(t, V.stamp - 0.08, V.stamp), bump = 1 + 0.06 * Math.sin(Math.PI * prog(t, V.lyr.shout, V.lyr.shout + 0.25));
  s += `<g transform="translate(640 390) scale(${f(bump)}) translate(-640 -390)">${R.bigStamp(700, 360, k, SONG.labels.humanByDesign, -14, 96)}</g>`;
  return { svg: s };
}

function verse5Shots(V) {
  const c = V.cuts, ch = SONG.chyrons;
  return [
    { id: 'V5-1', a: c[0], b: c[1], fn: (t, lt) => shotDog(t, lt, V), chyron: ch.newport },
    { id: 'V5-2', a: c[1], b: c[2], fn: (t, lt) => shotHeadline(t, lt, V), chyron: ch.salvaggio },
    { id: 'V5-3', a: c[2], b: c[3], fn: (t, lt) => shotBlueprint(t, lt, V) },
  ];
}
