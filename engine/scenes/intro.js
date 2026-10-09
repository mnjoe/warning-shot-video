// Intro choreography: I-1 logo sting, I-3 count-in stomp, I-2 the ship sails in. Positions and timing only;
// every drawing call goes through R.*. Network chrome (LIVE tag, bug, ticker) is off until I-2.

// The deck with the crew stomping on the beat. Used by I-3, and under the wipe at the end of I-1.
function introDeck(t, I) {
  const b = beat(t), k = Math.floor(b), u = b - k;
  const first = Math.round(beat(I.count[0]));            // beat index of "One"
  const stomping = b > first - 0.7;
  const lift = stomping ? Math.sin(Math.PI * clamp((u - 0.3) / 0.7)) : 0;
  const hit = stomping && k >= first ? clamp(1 - u / 0.15) : 0;
  const side = k % 2 ? 1 : -1;
  const shouting = t > I.count[0] - 0.05 && t < I.count[3] + 0.45;
  const words = I.count.reduce((n, c) => n + easeOut(prog(t, c, c + 0.18)), 0);   // push in a little on each count word
  const zoom = 1 + 0.025 * words;
  let s = R.deck(t), crew = '', fx = '';
  for (let i = 0; i < 8; i++) {
    const x = 175 + i * 133;
    crew += R.bot({ x, y: 640, s: 1.35, t, variant: i, phase: i * 0.21, stomp: lift, stompSide: side, squash: hit, sing: shouting });
    if (stomping && k >= first) {
      const p = u / 0.45;
      fx += R.dust(x + side * 10, 640, p, 1.2) + (i % 2 === 0 ? R.impact(x + side * 10, 640, p * 1.6, 1.1) : '');
    }
  }
  const shake = hit > 0 ? `translate(${f(Math.sin(t * 83) * 4 * hit)} ${f(3 * hit)})` : '';
  return `<g transform="${shake} translate(640 560) scale(${f(zoom)}) translate(-640 -560)">${s}${crew}${fx}</g>`;
}

// I-1: the logo sting. It opens in silence (the pre-roll): the wheel spins in slowly, the banner unfurls and a glint
// passes; the music starts at 0; on the big hit at 1.95 the wheel kicks and a parchment wipe reveals the deck.
function shotSting(t, lt, I) {
  const [w0, w1] = I.wipe, start = -SONG.preroll;
  const u = t - start;                                     // seconds since the video began
  const spinIn = easeOut(prog(u, 0, 1.6));
  const spin = (1 - spinIn) * -360 + Math.sin(u * 1.4) * 4 * spinIn + easeOut(prog(t, w0, w0 + 0.3)) * 45;
  const card = R.logoCard() + R.networkLogo({
    x: 640, y: 300, s: lerp(0.1, 1, backOut(prog(u, 0.1, 1.3))), spin,
    banner: easeOut(prog(u, 1.3, 2.1)), glint: Math.max(prog(u, 2.2, 2.7), prog(t, 0.25, 0.75)),
  });
  if (t < w0) return { svg: card };
  const edge = lerp(-40, W + 60, ease(prog(t, w0, w1)));
  return { svg: introDeck(t, I) + `<clipPath id="wipeclip"><rect x="${f(edge)}" y="0" width="${W + 100}" height="${H}"/></clipPath><g clip-path="url(#wipeclip)">${card}</g>` + R.scrollEdge(edge) };
}

// I-3: "One, two, three, four!" with a stomp on each beat.
function shotCount(t, lt, I) {
  return { svg: introDeck(t, I) };
}

// I-2: long establishing shot. The ship sails in from the left towing the SANDBOX lifeboat; the headline slides in.
function shotSailIn(t, lt, I) {
  let s = R.sky(430) + R.clouds(t);
  s += R.seaRect(t, 430, H, {});
  s += R.buoy({ x: 1150, y: 446, s: 0.32, t });                    // the target, far off on the horizon
  const glide = easeOut(prog(lt, 0, 4.8));
  const x = lerp(-420, 720, glide) + Math.max(0, lt - 4.8) * 6, y = 556 + Math.sin(t * 1.6) * 5, S = 0.72;
  const speed = 1 - glide * 0.85;
  s += R.wake(t * (0.6 + speed), x - 300 * S, y + 4, 260, 1.2);
  s += R.ship({ x, y, s: S, t, rot: Math.sin(t * 1.3) * 1.6, label: SONG.labels.ship, crew: 6, tow: { label: SONG.labels.sandbox } });
  s += R.seaRect(t + 3, 566, H, { gap: 30 });
  for (let i = 0; i < 3; i++) s += R.ripple(x + 330 * S + i * 8, 568, ((t * (0.8 + speed) + i / 3) % 1));
  if (lt > 0.8) s += R.headline(lt - 0.8, `${copy('network')} • ${copy('liveFrom')}`);
  return { svg: s };
}

function introShots(I) {
  const [i1, i3, i2, end] = I.cuts;
  return [
    { id: 'I-1', a: i1 - SONG.preroll, b: i3, fn: (t, lt) => shotSting(t, lt, I), chrome: false },
    { id: 'I-3', a: i3, b: i2, fn: (t, lt) => shotCount(t, lt, I), chrome: false },
    { id: 'I-2', a: i2, b: end, fn: (t, lt) => shotSailIn(t, lt, I) },
  ];
}
