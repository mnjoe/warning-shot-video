// Theme: pirate-flat — the original look. Flat vector cartoon, ink outlines, navy/parchment/rust/brass.
// Every color and line weight below is a token. Rigs read tokens at draw time, so a derived theme that
// only overrides tokens recolors everything. See README "Theme contract" for the rig list.
registerTheme('pirate-flat', {
  fonts: {
    hand: { family: 'Patrick Hand', file: 'fonts/PatrickHand-Regular.ttf', fallback: "'Comic Sans MS', cursive" },
    display: { family: 'Pirata One', file: 'fonts/PirataOne-Regular.ttf', fallback: 'Georgia, serif' },
  },
  tokens: {
    color: {
      navy: '#1B3253', navyDeep: '#122340', sea: '#22426A', seaLine: '#3A5E8A',
      cream: '#F3E9D2', parch: '#EADBB8', parchDark: '#D6C190', rust: '#A4442A',
      brass: '#C9A043', brassDark: '#9C7A2C', live: '#E0201B', ink: '#1E2430',
      wood: '#8B5A34', woodDark: '#5E3A20', woodLight: '#A9774B', woodSeam: '#7A4E2C',
      sky1: '#F7F0DE', sky2: '#E6D6B0', metal: '#B5C2CC', metalDark: '#7E8E9C',
      iron: '#2E3238', ironHi: '#565C66', ironShine: '#6B717C',
      paper: '#FFFDF6', mouth: '#5A1E1E', leg: '#3A3F4A', cloud: '#FFFBF0',
      labCoat: '#F7F7F4', labCoatShade: '#D5D9DE', labButton: '#E9E4D6',
      nitrile: '#5B8FD9', nitrileDark: '#3E6DB5', nitrileHi: '#A9C8F2',
      badge: '#FFFFFF', badgeStrip: '#E0201B', badgeClip: '#8E959E',
      smoke: '#EEE8DC', smokeEdge: '#B9B1A1', smokeHi: '#F6F2EA', rope: '#7A5A30', ripple: '#9FB6D0',
      boatHull: '#F4EEDF', newsPaper: '#F8F3E6', newsPhoto: '#DCD3BE', newsLine: '#B8AE98',
      chyronRope: '#8A6A3A', chyronRopeHi: '#C7A86A', chyronSub: '#5A4A30',
      shadow: '#1E2430', vignette: '#2B1A0A', fleck: '#3A2A18', liveText: '#FFFDF6',
      lyric: '#F3E9D2', lyricShout: '#C9A043', lyricOutline: '#122340',
      land: '#9DB38A', landDark: '#6E8B5A', windowLit: '#F6D77A',
      gull: '#FBF8F0', gullWing: '#A9B4BE', parrot: '#4E9A4A', parrotDark: '#2F6B33', parrotRed: '#C8372D', parrotBlue: '#3F7CC0',
      pixel: '#4FA3D9', pixelDark: '#2E6FA3', screen: '#141A22', amber: '#F2B84B', dog: '#C9A27A', dogDark: '#8C6A48',
      blueprint: '#2C5A8C', blueprintLine: '#D7E6F5', asphalt: '#565B63', sun: '#F2C14E',
      skin: '#E9C6A0', night: '#16243F', nightDeep: '#0C1526', star: '#F6F0D8', cork: '#C89B62', string: '#C8241E', mouse: '#9A9188', mouseEar: '#E7B7A8',
    },
    // Bot color variants, cycled by index.
    bots: [
      { band: '#A4442A', head: '#B5C2CC', stripe: '#1B3253' },
      { band: '#E0201B', head: '#C8BBA4', stripe: '#A4442A' },
      { band: '#C9A043', head: '#A9B8AA', stripe: '#1B3253' },
      { band: '#1B3253', head: '#B5C2CC', stripe: '#A4442A' },
      { band: '#6E8B5A', head: '#C8BBA4', stripe: '#1B3253' },
    ],
    line: { scale: 1, hair: 1.5, fine: 2, thin: 2.5, base: 3, mid: 3.5, heavy: 4, bold: 5, limb: 6 },
    shape: { headCorner: 12, bodyCorner: 10, eyePatch: true, bandana: true, antenna: true },
    motion: { blinkEvery: 3.3, blinkLen: 0.11, mouthRate: 12.5, waddle: 6, cloudDrift: 8 },
    lyrics: { size: 38, shoutSize: 44, stroke: 8, shoutStroke: 5, y: 88, lineGap: 46 },
    ticker: { speed: 95, size: 25 },
    // Sepia matrix for flashbacks (feColorMatrix values).
    flashback: '0.393 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0',
    copy: { thud: 'THUD!', slam: 'SLAM!', mash: 'MASH! MASH!', poof: 'POOF!', laugh: 'HAR HAR HAR!', signOff: 'That’s the news from the high seas. This has been PNN.', sources: 'SOURCES', clunk: 'CLUNK!', creak: 'CREAK...', clang: 'CLANG!', squeak: 'SQUEAK!', moreShout: 'SOME MORE!', network: 'PNN', networkFull: 'PIRATE NEWS NETWORK', liveFrom: 'LIVE FROM THE HIGH SEAS', masthead: 'The High Seas Herald', earlier: 'Earlier...', live: 'LIVE', replay: 'REPLAY' },
  },
  rigs: {
    // ---- shared <defs>, rebuilt from tokens ----
    defs() {
      return `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col('sky1')}"/><stop offset="1" stop-color="${col('sky2')}"/></linearGradient>
<radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="${col('vignette')}" stop-opacity="0"/><stop offset="1" stop-color="${col('vignette')}" stop-opacity="0.65"/></radialGradient>
<filter id="flashback" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${TK.flashback}"/></filter>`;
    },

    // ---- characters ----
    // o: x,y,s,t,variant,phase,sway(deg),tankard,sing,walk(phase|null),whistle,flip,shrug(0..1),look(px),frown,
    //    stomp (0..1 leg lift), stompSide (1 right leg, -1 left), squash (0..1, impact),
    //    armsUp (0..1 overhead), barbell (draws one in the hands), lean (deg, torso about the hips), legRot (deg), backpack,
    //    tricorn (true: the officers' hat, far too big, brim down over the eye), hatTilt (deg)
    bot(o) {
      const v = TK.bots[(o.variant || 0) % TK.bots.length], M = TK.motion, ink = col('ink');
      const t = o.t, ph = o.phase || 0, b = beat(t) + ph;
      let rot = 0, bob = 0;
      if (o.sway) { rot = Math.sin(b * Math.PI) * o.sway; bob = -Math.abs(Math.sin(b * Math.PI)) * 3; }
      let legA = 0, legB = 0;
      if (o.walk != null) {
        const wv = o.walk * Math.PI * 2;
        legA = Math.sin(wv) * 24; legB = -legA;
        bob = -Math.abs(Math.sin(wv)) * 5; rot += Math.sin(wv) * M.waddle;
      }
      const blink = ((t + ph * 1.7) % M.blinkEvery) < M.blinkLen;
      const sh = o.shrug || 0, look = o.look || 0;
      let mouth;
      if (o.sing) {
        const open = 0.25 + 0.75 * Math.abs(Math.sin(t * M.mouthRate + ph * 4.1));
        mouth = `<ellipse cx="3" cy="-78" rx="7" ry="${f(1.5 + 6 * open)}" fill="${col('mouth')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      } else if (o.whistle) {
        mouth = `<circle cx="6" cy="-77" r="3.2" fill="${col('mouth')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      } else if (o.frown) {
        mouth = `<path d="M-5 -74 Q3 -82 11 -74" fill="none" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round"/>`;
      } else {
        mouth = `<path d="M-5 -79 Q3 -72 11 -79" fill="none" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round"/>`;
      }
      const eye = blink
        ? `<line x1="${4 + look}" y1="-87" x2="${16 + look}" y2="-87" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round"/>`
        : `<circle cx="${10 + look * 0.4}" cy="-88" r="7.5" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('thin')}"/><circle cx="${f(11 + look)}" cy="-87.5" r="3.4" fill="${ink}"/>`;
      const st = o.stomp || 0, side = o.stompSide || 1, sq = o.squash || 0;
      const leg = (dx, a) => { const up = Math.sign(dx) === side ? st : 0; return `<g transform="translate(0 ${f(-up * 12)})"><g transform="rotate(${f(a - up * 40 * side)} ${dx} -22)"><rect x="${dx - 4.5}" y="-24" width="9" height="22" rx="3" fill="${col('leg')}" stroke="${ink}" stroke-width="${lw('thin')}"/><ellipse cx="${dx + 3}" cy="-2" rx="8" ry="4.5" fill="${ink}"/></g></g>`; };
      const up = o.armsUp || 0;
      const arm = (m) => {
        const hx = lerp(31 + sh * 8, 34, up) * m, hy = lerp(-31 - sh * 26, -140, up), cx = lerp(36 + sh * 6, 46, up) * m, cy = lerp(-46 - sh * 14, -92, up);
        return `<path d="M${20 * m} ${-56 - sh * 6} Q${f(cx)} ${f(cy)} ${f(hx)} ${f(hy)}" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="5" fill="${v.head}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      };
      const armL = arm(-1);
      const bar = o.barbell ? (() => { const by = lerp(-31 - sh * 26, -140, up), plate = (x) => `<rect x="${x - 7}" y="${f(by - 22)}" width="14" height="44" rx="3" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('thin')}"/><rect x="${x + (x > 0 ? 8 : -14)}" y="${f(by - 15)}" width="6" height="30" rx="2" fill="${col('ironHi')}" stroke="${ink}" stroke-width="${lw('fine')}"/>`;
        return `<line x1="-64" y1="${f(by)}" x2="64" y2="${f(by)}" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/><line x1="-64" y1="${f(by)}" x2="64" y2="${f(by)}" stroke="${col('metal')}" stroke-width="${lw('fine')}"/>${plate(-52)}${plate(52)}`; })() : '';
      let armR;
      if (o.tankard) {
        const lift = Math.sin(b * Math.PI * 2) * 4;
        armR = `<path d="M20 -56 Q38 -68 35 ${f(-82 + lift)}" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/>
      <g transform="translate(36 ${f(-92 + lift)})"><path d="M8 -6 q9 0 9 8 q0 8 -9 8" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/>
      <rect x="-9" y="-10" width="18" height="22" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <line x1="-9" y1="-3" x2="9" y2="-3" stroke="${col('brassDark')}" stroke-width="${lw('fine')}"/>
      <path d="M-11 -9 q2 -8 8 -6 q4 -6 9 -1 q6 -2 6 6 z" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('fine')}"/></g>`;
      } else {
        armR = arm(1);
      }
      const S = TK.shape, hc = S.headCorner;
      const antenna = S.antenna ? `<line x1="8" y1="-115" x2="12" y2="-128" stroke="${ink}" stroke-width="${lw('base')}"/><circle cx="12" cy="-130" r="4.5" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('fine')}"/>` : '';
      const bandana = S.bandana ? `<path d="M-26.5 -97 L-26.5 -103 Q-26.5 -117 -12 -117 L12 -117 Q26.5 -117 26.5 -103 L26.5 -97 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <circle cx="-8" cy="-106" r="2.2" fill="${col('cream')}"/><circle cx="8" cy="-109" r="2.2" fill="${col('cream')}"/><circle cx="16" cy="-102" r="2" fill="${col('cream')}"/>
      <path d="M-26 -101 l-14 -7 l3 11 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/>
      <path d="M-26 -99 l-11 9 l9 2 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/>` : '';
      const patch = S.eyePatch ? `<path d="M-26 -80 L-10 -87 L3 -97" fill="none" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <ellipse cx="-10" cy="-87" rx="8.5" ry="8" fill="${ink}"/>` : `<circle cx="-10" cy="-88" r="7.5" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('thin')}"/><circle cx="${f(-9 + look)}" cy="-87.5" r="3.4" fill="${ink}"/>`;
      const lr = o.legRot || 0;
      const body = `
    ${leg(-7, legA + lr)}${leg(7, legB + lr)}
    <g transform="rotate(${f(o.lean || 0)} 0 -24)">
    ${o.backpack ? `<rect x="-34" y="-64" width="20" height="34" rx="6" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('thin')}"/><rect x="-36" y="-50" width="10" height="12" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('fine')}"/>` : ''}
    <rect x="-22" y="-66" width="44" height="44" rx="${S.bodyCorner}" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    <rect x="-19" y="-58" width="38" height="5" fill="${v.stripe}"/><rect x="-19" y="-47" width="38" height="5" fill="${v.stripe}"/><rect x="-19" y="-36" width="38" height="5" fill="${v.stripe}"/>
    ${o.backpack ? `<path d="M-20 -62 L14 -30" stroke="${col('rust')}" stroke-width="${lw('heavy')}" stroke-linecap="round"/>` : ''}
    ${armL}${armR}
    <rect x="-6" y="-73" width="12" height="8" fill="${col('metalDark')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
    <g transform="translate(0 ${f(-sh * 4)})">
      ${antenna}
      <rect x="-26" y="-114" width="52" height="44" rx="${hc}" fill="${v.head}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <circle cx="-23" cy="-78" r="2" fill="${col('metalDark')}"/><circle cx="23" cy="-78" r="2" fill="${col('metalDark')}"/>
      ${bandana}${patch}
      ${o.tricorn ? '' : eye}${mouth}
      ${o.tricorn ? `<g transform="rotate(${f(o.hatTilt || 0)} 0 -100)">${R.tricorn({ x: 0, y: -86, s: 1 })}</g>` : ''}
    </g>${bar}</g>`;
      const fl = o.flip ? -1 : 1;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s * fl)} ${f(o.s)})"><g transform="scale(${f(1 + sq * 0.07)} ${f(1 - sq * 0.09)})"><g transform="rotate(${f(rot)}) translate(0 ${f(bob)})">${body}</g></g></g>`;
    },

    // The humans: a blue nitrile lab glove with jointed fingers, out of a white lab-coat sleeve with an ID badge.
    // o: x,y,s,rot,curl (0 flat .. 1 gripping),label (on the badge). The sleeve runs off frame.
    hand(o) {
      const ink = col('ink'), curl = o.curl ?? 1;
      const base = lw('heavy');
      // Jointed fingers: knuckle -> middle joint -> tip, bending toward +y as curl rises.
      const spec = [[-27, 30, 25], [-9, 34, 29], [9, 33, 27], [27, 27, 21]];
      const dir = (x, y, len, deg) => [x - len * Math.cos(deg * Math.PI / 180), y + len * Math.sin(deg * Math.PI / 180)];
      let fingers = '', creases = '', shine = '';
      spec.forEach(([dy, p, d], i) => {
        const kx = -30, ky = dy;
        const a1 = curl * (50 + i * 3), a2 = a1 + curl * 70;
        const [jx, jy] = dir(kx, ky, p, a1), [tx, ty] = dir(jx, jy, d, a2);
        const path = `M${f(kx)} ${f(ky)} L${f(jx)} ${f(jy)} L${f(tx)} ${f(ty)}`;
        fingers += `<path d="${path}" fill="none" stroke="${ink}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>`;
        fingers += `<path d="${path}" fill="none" stroke="${col('nitrile')}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
        const [hx1, hy1] = dir(kx, ky - 3, 6, a1), [hx2, hy2] = dir(kx, ky - 3, p - 6, a1);
        shine += `<line x1="${f(hx1)}" y1="${f(hy1)}" x2="${f(hx2)}" y2="${f(hy2)}" stroke="${col('nitrileHi')}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>`;
        creases += `<circle cx="${f(jx)}" cy="${f(jy)}" r="2" fill="${col('nitrileDark')}"/>`;
      });
      // Thumb tucks up under the fingers as the grip closes.
      const thx = -40 + curl * 6, thy = 50 - curl * 10;
      const thumb = `<path d="M2 26 Q-14 50 ${f(thx)} ${f(thy)}" fill="none" stroke="${ink}" stroke-width="20" stroke-linecap="round"/>
        <path d="M2 26 Q-14 50 ${f(thx)} ${f(thy)}" fill="none" stroke="${col('nitrile')}" stroke-width="13" stroke-linecap="round"/>`;
      const label = o.label || '';
      const ls = fitSize(label, 34, TK.font.display, 76);
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.rot || 0)}) scale(${o.s || 1})">
    <path d="M44 -44 L800 -48 L800 48 L44 44 Z" fill="${col('labCoat')}" stroke="${ink}" stroke-width="${base}" stroke-linejoin="round"/>
    <path d="M110 -40 Q130 -6 112 40 M210 -42 Q226 0 206 42" fill="none" stroke="${col('labCoatShade')}" stroke-width="${lw('base')}" stroke-linecap="round"/>
    <rect x="44" y="-44" width="26" height="88" fill="${col('labCoat')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    <circle cx="57" cy="-20" r="5" fill="${col('labButton')}" stroke="${ink}" stroke-width="${lw('fine')}"/><circle cx="57" cy="20" r="5" fill="${col('labButton')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
    <g transform="translate(170 -4) rotate(-4)">
      <rect x="-6" y="-44" width="12" height="12" rx="2" fill="${col('badgeClip')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
      <rect x="-46" y="-34" width="92" height="66" rx="6" fill="${col('badge')}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <rect x="-46" y="-34" width="92" height="14" rx="6" fill="${col('badgeStrip')}"/><rect x="-46" y="-26" width="92" height="6" fill="${col('badgeStrip')}"/>
      ${txt(0, 18, label, ls, ink, { font: TK.font.display })}
    </g>
    <rect x="14" y="-46" width="34" height="92" rx="12" fill="${col('nitrileDark')}" stroke="${ink}" stroke-width="${base}"/>
    <line x1="24" y1="-40" x2="24" y2="40" stroke="${col('nitrile')}" stroke-width="${lw('base')}" stroke-linecap="round"/>
    <path d="M18 -38 Q-18 -46 -34 -24 L-36 22 Q-22 44 18 38 Z" fill="${col('nitrile')}" stroke="${ink}" stroke-width="${base}" stroke-linejoin="round"/>
    ${thumb}${fingers}${shine}${creases}
    <path d="M-6 -30 Q4 -10 -4 12" fill="none" stroke="${col('nitrileHi')}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
  </g>`;
    },

    // ---- props ----
    cannonball(x, y) {
      return `<circle cx="${f(x)}" cy="${f(y)}" r="34" fill="${col('iron')}" stroke="${col('ink')}" stroke-width="${lw('heavy')}"/><circle cx="${f(x - 10)}" cy="${f(y - 12)}" r="8" fill="${col('ironShine')}"/>`;
    },
    // o: x,y,s,angle,fire(seconds since firing|null),label(string|false)
    cannon(o) {
      const ink = col('ink'), ang = o.angle ?? -10;
      const recoil = o.fire != null ? -Math.sin(clamp(o.fire / 0.25) * Math.PI) * 16 : 0;
      let fx = '';
      if (o.fire != null && o.fire >= 0) {
        const ft = o.fire;
        if (ft < 0.22) {
          const k = 1 - ft / 0.22, Rr = 40 + 70 * (1 - k);
          fx += `<g transform="translate(150 0)" opacity="${f(k)}"><path d="M0 0 L${Rr} -${Rr * .35} L${Rr * .55} -${Rr * .05} L${Rr * 1.25} 0 L${Rr * .55} ${Rr * .05} L${Rr} ${Rr * .35} Z" fill="${col('brass')}" stroke="${col('live')}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/></g>`;
        }
        for (let i = 0; i < 7; i++) {
          const p = clamp((ft - i * 0.04) / 1.6);
          if (p <= 0) continue;
          const dx = 150 + easeOut(p) * (60 + i * 35), dy = -easeOut(p) * (10 + (i % 3) * 18) + (i % 2 ? 10 : -6);
          fx += R.smokePuff(dx, dy, 14 + p * (28 + i * 4), (1 - p) * 0.95 + 0.05 * (p < 1));
        }
      }
      let label = '';
      if (o.label) {
        const ls = fitSize(o.label, 22, TK.font.display, 176), bw = Math.max(148, Math.min(200, textWidth(o.label, ls, TK.font.display) + 24));
        label = `<g transform="translate(0 46)"><rect x="${f(-bw / 2)}" y="-16" width="${f(bw)}" height="30" rx="4" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}"/>${txt(0, 7, o.label, ls, ink, { font: TK.font.display })}</g>`;
      }
      const wheel = x => `<circle cx="${x}" cy="72" r="26" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="${x}" cy="72" r="7" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${o.s})">
    <path d="M-110 18 L90 18 L80 70 L-100 70 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
    <line x1="-100" y1="44" x2="84" y2="44" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/>
    <g transform="rotate(${ang}) translate(${f(recoil)} 0)">
      ${o.under || ''}
      <path d="M-120 -30 Q-140 0 -120 30 L130 20 Q150 20 150 0 Q150 -20 130 -20 Z" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
      <rect x="-90" y="-31" width="12" height="60" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <rect x="40" y="-25" width="10" height="49" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <rect x="128" y="-23" width="14" height="46" rx="4" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <circle cx="-138" cy="0" r="10" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <path d="M-110 -18 Q0 -26 120 -14" fill="none" stroke="${col('ironHi')}" stroke-width="${lw('bold')}" stroke-linecap="round"/>
      ${fx}
    </g>
    ${wheel(-62)}${wheel(52)}
    ${label}
  </g>`;
    },
    // o: x,y(waterline),s,hole(scale),door(0..1 open|undefined),label,t, peek (eyes in the hole), doorPeek (eyes in the doorway)
    lifeboat(o) {
      const ink = col('ink'), hole = o.hole || 1;
      let door = '';
      if (o.door != null) {
        const open = o.door;
        door = `<rect x="-118" y="-74" width="44" height="66" rx="3" fill="${ink}"/>
      <path d="M-118 -74 L${f(-118 - 40 * open)} ${f(-80 - 6 * open)} L${f(-118 - 40 * open)} ${f(-2 + 6 * open)} L-118 -8 Z" fill="${col('woodLight')}" stroke="${ink}" stroke-width="${lw('mid')}" stroke-linejoin="round"/>
      <circle cx="${f(-118 - 32 * open)}" cy="-40" r="3.5" fill="${col('brass')}"/>${o.doorPeek ? R.peekEyes(-96, -44, o.doorPeek, o.t || 0, 1) : ''}`;
      }
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${o.s || 1})">
    <path d="M-170 -96 L170 -96 Q160 -10 120 0 L-130 0 Q-165 -20 -170 -96 Z" fill="${col('boatHull')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
    <path d="M-168 -80 L168 -80" stroke="${col('rust')}" stroke-width="10"/>
    <rect x="-176" y="-106" width="352" height="14" rx="5" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    ${txt(10, -36, o.label || '', fitSize(o.label || '', 40, TK.font.display, 150), col('navy'), { font: TK.font.display })}
    <g transform="translate(118 -40) scale(${f(hole)})"><path d="M-22 -18 l10 -8 l8 6 l12 -6 l10 10 l-4 12 l8 10 l-12 10 l-10 -6 l-12 8 l-10 -10 l2 -12 z" fill="${ink}"/>${o.peek ? R.peekEyes(-2, -2, o.peek, o.t || 0, 0.7) : ''}</g>
    ${door}
  </g>`;
    },
    // Static front page. Motion (spin-in) is choreography; the scene wraps it.
    newspaper(o) {
      const ink = col('ink');
      return `<rect x="-286" y="-196" width="580" height="400" fill="${col('shadow')}" opacity="0.35"/>
    <rect x="-290" y="-200" width="580" height="400" fill="${col('newsPaper')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    ${txt(0, -152, TK.copy.masthead, 40, ink, { font: TK.font.display })}
    <line x1="-262" y1="-136" x2="262" y2="-136" stroke="${ink}" stroke-width="${lw('base')}"/><line x1="-262" y1="-130" x2="262" y2="-130" stroke="${ink}" stroke-width="${lw('hair')}"/>
    ${txt(0, -54, o.headline, fitSize(o.headline, 86, TK.font.display, 540), col('live'), { font: TK.font.display, stroke: ink, sw: lw('heavy') })}
    <rect x="-262" y="-20" width="190" height="190" fill="${col('newsPhoto')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    ${R.bot({ x: -167, y: 160, s: 1.15, t: 0.5, variant: 1, phase: 0, frown: true })}
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="-50" y="${-10 + i * 26}" width="${[300, 280, 310, 260, 300, 220, 290][i]}" height="10" rx="3" fill="${col('newsLine')}"/>`).join('')}`;
    },
    speechBubble(x, y, k, text) {
      return `<g transform="translate(${x} ${y}) scale(${f(k)})">
      <path d="M-300 -58 Q-300 -88 -270 -88 L270 -88 Q300 -88 300 -58 L300 30 Q300 60 270 60 L40 60 L0 120 L10 60 L-270 60 Q-300 60 -300 30 Z" fill="${col('paper')}" stroke="${col('ink')}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
      ${txt(0, 4, text, fitSize(text, 52, TK.font.display, 560), col('ink'), { font: TK.font.display })}</g>`;
    },

    // ---- environment ----
    sky(y1 = 720) { return `<rect x="0" y="0" width="${W}" height="${y1}" fill="url(#sky)"/>`; },
    cloud(x, y, s) {
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})" fill="${col('cloud')}" stroke="${col('parchDark')}" stroke-width="${lw('fine')}">
    <path d="M-60 10 q-4 -26 24 -26 q8 -24 36 -16 q20 -16 40 4 q30 -2 28 22 q8 16 -12 22 l-104 0 q-20 -2 -12 -6 z"/></g>`;
    },
    clouds(t, offset = 0) {
      const list = [[160, 70, 1.1], [520, 40, 0.8], [880, 90, 1.0], [1180, 50, 0.9], [1500, 80, 1.1]];
      const drift = TK.motion.cloudDrift;
      return list.map(([x, y, s]) => R.cloud(((x - t * drift - offset) % 1700 + 1700) % 1700 - 200, y, s)).join('');
    },
    waves(t, y0, y1, opts = {}) {
      const c = opts.col || col('seaLine'), x0 = opts.x0 ?? -40, x1 = opts.x1 ?? W + 40, gap = opts.gap || 30, amp = opts.amp || 4;
      let s = '', r = 0;
      for (let y = y0 + 14; y < y1; y += gap, r++) {
        let d = '';
        for (let x = x0; x <= x1; x += 20) d += (x === x0 ? 'M' : 'L') + f(x) + ' ' + f(y + Math.sin(x / 55 + t * 1.6 + r * 1.3) * amp) + ' ';
        s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${lw('base')}" stroke-linecap="round" stroke-dasharray="${40 + r * 7} ${26 + r * 5}" stroke-dashoffset="${f(-t * 30 * (r % 2 ? 1 : -1))}"/>`;
      }
      return s;
    },
    seaRect(t, y0, y1 = H, opts = {}) {
      return `<rect x="-40" y="${y0}" width="${W + 80}" height="${y1 - y0}" fill="${opts.fill || (opts.fillKey ? col(opts.fillKey) : col('sea'))}"/>` + R.waves(t, y0, y1, opts);
    },
    smokePuff(x, y, r, a) {
      return `<g opacity="${f(a)}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${col('smoke')}" stroke="${col('smokeEdge')}" stroke-width="${lw('fine')}"/><circle cx="${f(x + r * .6)}" cy="${f(y - r * .4)}" r="${f(r * .7)}" fill="${col('smokeHi')}"/></g>`;
    },
    musicNote(x, y, s, a) {
      const ink = col('ink');
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)}) rotate(-12)" opacity="${f(a)}"><ellipse cx="0" cy="0" rx="8" ry="6" fill="${ink}" transform="rotate(-20)"/><line x1="7" y1="-2" x2="7" y2="-34" stroke="${ink}" stroke-width="${lw('mid')}"/><path d="M7 -34 q12 6 10 18" fill="none" stroke="${ink}" stroke-width="${lw('mid')}" stroke-linecap="round"/></g>`;
    },
    ripple(x, y, p) {
      return `<ellipse cx="${f(x)}" cy="${y}" rx="${f(18 + p * 40)}" ry="${f(4 + p * 6)}" fill="none" stroke="${col('ripple')}" stroke-width="${lw('thin')}" opacity="${f(1 - p)}"/>`;
    },
    dim(a) { return `<rect width="${W}" height="${H}" fill="${col('navyDeep')}" opacity="${f(a)}"/>`; },

    // Ship deck set (C-1, C-2, C-3 background).
    deck(t) {
      const ink = col('ink'), seam = col('woodSeam');
      let s = R.sky(330) + R.clouds(t);
      const bob = Math.sin(t * 2) * 3;
      s += R.seaRect(t, 214, 330, { gap: 26, amp: 3 });
      s += `<g transform="translate(860 ${f(238 + bob)}) scale(0.6)"><path d="M-14 0 h28 l-6 14 h-16 z" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('base')}"/><line x1="0" y1="0" x2="0" y2="-40" stroke="${ink}" stroke-width="${lw('base')}"/><path d="M0 -40 l26 7 l-26 7 z" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('thin')}"/></g>`;
      s += `<rect x="-10" y="300" width="${W + 20}" height="78" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      for (let y = 322; y < 378; y += 18) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${seam}" stroke-width="${lw('fine')}"/>`;
      s += `<rect x="-10" y="292" width="${W + 20}" height="16" rx="4" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      s += `<rect x="-10" y="378" width="${W + 20}" height="350" fill="${col('woodLight')}"/>`;
      [398, 424, 455, 492, 535, 585, 642, 708].forEach((y, i) => {
        s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${seam}" stroke-width="${lw('thin')}"/>`;
        for (let x = (i * 137) % 260; x < W; x += 260 + i * 20) s += `<line x1="${x}" y1="${[378, 398, 424, 455, 492, 535, 585, 642][i]}" x2="${x}" y2="${y}" stroke="${seam}" stroke-width="${lw('fine')}"/>`;
      });
      s += `<path d="M178 -20 Q420 10 470 60 Q430 150 178 168 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <path d="M200 30 Q350 50 420 70" fill="none" stroke="${col('parchDark')}" stroke-width="${lw('base')}"/>
        <line x1="178" y1="168" x2="40" y2="300" stroke="${ink}" stroke-width="${lw('thin')}"/><line x1="178" y1="120" x2="330" y2="300" stroke="${ink}" stroke-width="${lw('thin')}"/>
        <rect x="150" y="-20" width="30" height="430" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <rect x="140" y="384" width="50" height="22" rx="4" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      return s;
    },
    // Exterior set: ship hull (left) towing the lifeboat. camX pans; o.boatX places the boat; o.extras drawn in world space.
    exterior(t, camX, o = {}) {
      const ink = col('ink');
      const bobShip = Math.sin(t * 1.4) * 4, bobBoat = Math.sin(t * 2.1 + 1) * 5;
      let s = R.sky(430) + R.clouds(t, camX * 0.3);
      s += `<g transform="translate(${f(-camX)} 0)">`;
      s += `<g transform="translate(0 ${f(bobShip)})">
    <rect x="80" y="-40" width="26" height="380" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <rect x="400" y="-40" width="26" height="380" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <path d="M106 0 Q260 30 300 110 Q250 200 106 220 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <path d="M426 20 Q560 50 590 120 Q550 210 426 230 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <path d="M-240 300 L660 300 Q650 420 540 470 L-240 470 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
    <rect x="-240" y="290" width="910" height="18" rx="5" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <line x1="-240" y1="340" x2="652" y2="340" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/><line x1="-240" y1="420" x2="610" y2="420" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/>
    ${[0, 120, 240, 360].map(x => `<rect x="${x - 120}" y="352" width="36" height="34" rx="3" fill="${ink}"/><rect x="${x - 112}" y="362" width="28" height="12" rx="4" fill="${col('iron')}"/>`).join('')}
    ${txt(170, 452, o.shipLabel || '', fitSize(o.shipLabel || '', 52, TK.font.hand, 300), col('cream'), { stroke: ink, sw: lw('bold') })}
  </g>`;
      s += `<path d="M640 ${f(330 + bobShip)} Q760 ${f(430)} ${f(o.boatX - 160)} ${f(400 + bobBoat)}" fill="none" stroke="${col('rope')}" stroke-width="${lw('bold')}"/>`;
      s += `</g>`;
      s += R.seaRect(t, 440, H, {});
      s += `<g transform="translate(${f(-camX)} 0)">`;
      s += R.lifeboat({ x: o.boatX, y: 482 + bobBoat, s: 1.3, hole: o.hole, label: o.boatLabel });
      s += (o.extras || '');
      s += `</g>`;
      s += `<rect x="-20" y="${f(470 + Math.sin(t * 2) * 2)}" width="${W + 40}" height="${H}" fill="${col('sea')}" opacity="0.92"/>` + R.waves(t + 3, 468, H, { gap: 32 });
      return s;
    },
    // Wrap a shot in the flashback treatment.
    flashback(t, inner) {
      let flecks = '';
      for (let i = 0; i < 6; i++) { const r = rnd(Math.floor(t * 12) + i * 7.3); if (r > 0.55) flecks += `<circle cx="${f(rnd(i + Math.floor(t * 12)) * W)}" cy="${f(rnd(i * 3.1 + Math.floor(t * 12)) * H)}" r="${f(1 + r * 2)}" fill="${col('fleck')}" opacity="0.5"/>`; }
      const scratch = rnd(Math.floor(t * 8)) > 0.6 ? `<line x1="${f(rnd(Math.floor(t * 8) + 1) * W)}" y1="0" x2="${f(rnd(Math.floor(t * 8) + 1) * W + 6)}" y2="${H}" stroke="${col('fleck')}" stroke-width="${lw('hair')}" opacity="0.35"/>` : '';
      const tag = `<g transform="translate(26 616)"><rect width="190" height="44" rx="6" fill="${col('parch')}" stroke="${col('ink')}" stroke-width="${lw('base')}"/>${txt(95, 32, TK.copy.earlier, 32, col('ink'), { font: TK.font.display })}</g>`;
      return `<g filter="url(#flashback)">${inner}</g><rect width="${W}" height="${H}" fill="url(#vig)"/>${flecks}${scratch}${tag}`;
    },

    // ---- intro: network logo card ----
    // Full-frame parchment card behind the logo sting.
    logoCard() {
      let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="${col('parch')}"/>`;
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; s += `<line x1="640" y1="330" x2="${f(640 + Math.cos(a) * 900)}" y2="${f(330 + Math.sin(a) * 900)}" stroke="${col('parchDark')}" stroke-width="${lw('fine')}" opacity="0.55"/>`; }
      s += `<circle cx="640" cy="330" r="250" fill="none" stroke="${col('parchDark')}" stroke-width="${lw('fine')}" opacity="0.7"/><circle cx="640" cy="330" r="330" fill="none" stroke="${col('parchDark')}" stroke-width="${lw('hair')}" opacity="0.6" stroke-dasharray="10 8"/>`;
      s += `<rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="10" fill="none" stroke="${col('chyronRope')}" stroke-width="${lw('bold')}" stroke-dasharray="9 5"/>`;
      return s + `<rect width="${W}" height="${H}" fill="url(#vig)" opacity="0.6"/>`;
    },
    // Big ship's-wheel logo. o: x,y,s,spin(deg),banner(0..1 unfurled),glint(0..1)
    networkLogo(o) {
      const ink = col('ink');
      let spokes = '';
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4, c = Math.cos(a), sn = Math.sin(a);
        spokes += `<line x1="0" y1="0" x2="${f(c * 150)}" y2="${f(sn * 150)}" stroke="${ink}" stroke-width="20" stroke-linecap="round"/><line x1="0" y1="0" x2="${f(c * 150)}" y2="${f(sn * 150)}" stroke="${col('wood')}" stroke-width="11" stroke-linecap="round"/>`;
        spokes += `<ellipse cx="${f(c * 166)}" cy="${f(sn * 166)}" rx="15" ry="15" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`;
      }
      const rim = `<circle r="118" fill="none" stroke="${ink}" stroke-width="34"/><circle r="118" fill="none" stroke="${col('wood')}" stroke-width="24"/><circle r="118" fill="none" stroke="${col('woodLight')}" stroke-width="${lw('fine')}" stroke-dasharray="14 10"/>`;
      const hub = `<circle r="84" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('bold')}"/><circle r="72" fill="none" stroke="${col('brass')}" stroke-width="${lw('base')}"/>`;
      const name = copy('network'), full = copy('networkFull');
      const k = clamp(o.banner ?? 1), bw = Math.max(330, textWidth(full, 34, TK.font.display) + 80);
      const banner = k <= 0 ? '' : `<g transform="translate(0 214)"><clipPath id="bannerclip"><rect x="${f(-bw / 2 - 40)}" y="-50" width="${f((bw + 80) * k)}" height="100"/></clipPath><g clip-path="url(#bannerclip)">
        <path d="M${f(-bw / 2 - 34)} -18 l26 0 l0 44 l-26 0 l12 -22 z M${f(bw / 2 + 34)} -18 l-26 0 l0 44 l26 0 l-12 -22 z" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <rect x="${f(-bw / 2)}" y="-28" width="${f(bw)}" height="50" rx="4" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(0, 9, full, fitSize(full, 34, TK.font.display, bw - 40), col('liveText'), { font: TK.font.display })}</g></g>`;
      const glint = o.glint ? `<g opacity="${f(Math.sin(clamp(o.glint) * Math.PI))}" transform="translate(52 -52) rotate(${f(o.glint * 90)})"><path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill="${col('paper')}" stroke="${col('brass')}" stroke-width="${lw('fine')}"/></g>` : '';
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <g transform="translate(8 10)" opacity="0.2"><circle r="118" fill="none" stroke="${col('shadow')}" stroke-width="40"/></g>
        <g transform="rotate(${f(o.spin || 0)})">${spokes}${rim}</g>${hub}
        ${txt(0, 30, name, fitSize(name, 86, TK.font.display, 140), col('live'), { font: TK.font.display, stroke: ink, sw: lw('base') })}${glint}${banner}</g>`;
    },
    // The rolled edge of a parchment wipe, standing vertically at x.
    scrollEdge(x) {
      const ink = col('ink');
      return `<rect x="${f(x - 22)}" y="-10" width="44" height="${H + 20}" fill="${col('parchDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <rect x="${f(x - 8)}" y="-10" width="10" height="${H + 20}" fill="${col('parch')}" opacity="0.8"/>
        <rect x="${f(x + 22)}" y="-10" width="14" height="${H + 20}" fill="${col('shadow')}" opacity="0.18"/>`;
    },

    // ---- network headline banner (not a speaker credit; those are chyrons) ----
    headline(lt, text) {
      const ink = col('ink'), k = easeOut(prog(lt, 0, 0.4)), size = 34;
      const wd = textWidth(text, size, TK.font.display) + 70, h = 50, y = 676 - h - 12;
      const x = lerp(-wd - 30, 0, k);
      return `<g transform="translate(${f(x)} ${y})">
        <rect x="0" y="6" width="${f(wd + 6)}" height="${h}" fill="${col('shadow')}" opacity="0.3"/>
        <path d="M0 0 L${f(wd)} 0 L${f(wd + 22)} ${h / 2} L${f(wd)} ${h} L0 ${h} Z" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <rect x="0" y="0" width="${f(wd)}" height="5" fill="${col('brass')}"/>
        ${txt(30, 36, text, size, col('liveText'), { anchor: 'start', font: TK.font.display })}</g>`;
    },

    // ---- intro: impacts ----
    dust(x, y, p, s = 1) {
      if (p <= 0 || p >= 1) return '';
      let out = '';
      for (const d of [-1, 1]) out += R.smokePuff(x + d * (14 + p * 34) * s, y - 4 - p * 10 * s, (6 + p * 10) * s, (1 - p) * 0.9);
      return out;
    },
    impact(x, y, p, s = 1) {
      if (p <= 0 || p >= 1) return '';
      const ink = col('ink'), r0 = (26 + p * 22) * s, r1 = r0 + 16 * s * (1 - p);
      return [-150, -120, -60, -30].map(deg => { const a = deg * Math.PI / 180; return `<line x1="${f(x + Math.cos(a) * r0)}" y1="${f(y + Math.sin(a) * r0)}" x2="${f(x + Math.cos(a) * r1)}" y2="${f(y + Math.sin(a) * r1)}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round" opacity="${f(1 - p)}"/>`; }).join('');
    },

    // ---- the ship, full side view (bow to the right) ----
    // o: x,y (waterline),s,t,rot,label,crew (bot count on deck),tow ({label, hole} lifeboat towed astern),flag
    ship(o) {
      const ink = col('ink'), t = o.t;
      const sail = (x, y1, y2, w, b) => `<line x1="${x - w / 2 - 10}" y1="${y1}" x2="${x + w / 2 + 10}" y2="${y1}" stroke="${col('woodDark')}" stroke-width="${lw('limb')}" stroke-linecap="round"/>
        <path d="M${x - w / 2} ${y1} Q${x} ${y1 + 8} ${x + w / 2} ${y1} L${x + w / 2 - 6} ${y2} Q${x} ${y2 + b} ${x - w / 2 + 6} ${y2} Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <path d="M${x - w / 2 + 16} ${f((y1 + y2) / 2)} Q${x} ${f((y1 + y2) / 2 + b * 0.6)} ${x + w / 2 - 16} ${f((y1 + y2) / 2)}" fill="none" stroke="${col('parchDark')}" stroke-width="${lw('base')}"/>`;
      const billow = 26 + Math.sin(t * 1.7) * 4;
      let s = '';
      // rigging
      s += `<path d="M-70 -560 L-290 -160 M-70 -560 L130 -112 M150 -470 L300 -150 M150 -470 L-70 -230" fill="none" stroke="${ink}" stroke-width="${lw('fine')}"/>`;
      // bowsprit and jib
      s += `<line x1="280" y1="-140" x2="400" y2="-205" stroke="${col('woodDark')}" stroke-width="12" stroke-linecap="round"/><line x1="280" y1="-140" x2="400" y2="-205" stroke="${ink}" stroke-width="${lw('fine')}" opacity="0.4"/>
        <path d="M156 -455 L392 -205 L176 -205 Q200 -330 156 -455 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>`;
      // masts
      s += `<rect x="-82" y="-580" width="24" height="470" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <rect x="139" y="-480" width="22" height="370" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`;
      s += sail(-70, -560, -490, 140, billow * 0.5) + sail(-70, -440, -235, 205, billow) + sail(150, -470, -410, 110, billow * 0.45) + sail(150, -392, -215, 190, billow * 0.9);
      // crow's nest
      s += `<path d="M-102 -486 L-38 -486 L-44 -462 L-96 -462 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/><line x1="-100" y1="-476" x2="-40" y2="-476" stroke="${col('woodSeam')}" stroke-width="${lw('fine')}"/>`;
      // pennant
      let d = 'M-70 -580 ';
      for (let i = 1; i <= 8; i++) d += `L${-70 + i * 12} ${f(-588 + i * 0.6 + Math.sin(t * 7 - i * 0.8) * 3.5 * i / 8)} `;
      for (let i = 8; i >= 0; i--) d += `L${-70 + i * 12} ${f(-572 - i * 0.6 + Math.sin(t * 7 - i * 0.8) * 3.5 * i / 8)} `;
      if (o.flag !== false) s += `<path d="${d}Z" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/>`;
      // crew on deck
      const n = o.crew || 0;
      for (let i = 0; i < n; i++) s += R.bot({ x: -170 + i * (360 / Math.max(1, n - 1)), y: -112, s: 0.42, t, variant: i, phase: i * 0.27, sway: 6 });
      // hull
      s += `<path d="M-300 -150 L-205 -150 L-195 -112 L215 -112 Q262 -116 300 -150 L312 -146 Q300 -70 250 -6 Q238 10 215 14 L-245 14 Q-280 -40 -300 -150 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <rect x="-306" y="-162" width="112" height="14" rx="4" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <rect x="-200" y="-124" width="420" height="12" rx="4" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M-288 -98 L292 -98" stroke="${col('brass')}" stroke-width="${lw('bold')}"/>
        <path d="M-276 -50 L270 -50 M-262 -22 L250 -22" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/>
        ${[-280, -248].map(x => `<rect x="${x}" y="-144" width="22" height="18" rx="3" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`).join('')}
        ${[-160, -90, -20, 50, 120, 190].map(x => `<rect x="${x}" y="-88" width="30" height="24" rx="3" fill="${ink}"/><rect x="${x + 6}" y="-80" width="24" height="9" rx="3" fill="${col('iron')}"/>`).join('')}
        ${txt(10, -14, o.label || '', fitSize(o.label || '', 50, TK.font.hand, 360), col('cream'), { stroke: ink, sw: lw('bold') })}`;
      // towed lifeboat
      let tow = '';
      if (o.tow) {
        const bob = Math.sin(t * 2.1 + 1) * 6;
        tow = `<path d="M-298 -60 Q-340 -10 -385 ${f(-52 + bob)}" fill="none" stroke="${col('rope')}" stroke-width="${lw('heavy')}"/>`
          + R.lifeboat({ x: -490, y: 6 + bob, s: 0.62, hole: o.tow.hole || 1, label: o.tow.label });
      }
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${tow}<g transform="rotate(${f(o.rot || 0)})">${s}</g></g>`;
    },
    // Foam trail behind a moving hull. x,y = stern at the waterline; len in px; speed scales the drift.
    wake(t, x, y, len, s = 1) {
      let out = '';
      for (let i = 0; i < 9; i++) {
        const p = ((t * 0.9 + i / 9) % 1), xx = x - p * len, a = (1 - p) * 0.9;
        out += `<path d="M${f(xx - 26 * s)} ${f(y + (i % 3) * 7 * s)} q${f(13 * s)} ${f(-7 * s)} ${f(26 * s)} 0" fill="none" stroke="${col('cloud')}" stroke-width="${lw('base')}" stroke-linecap="round" opacity="${f(a)}"/>`;
      }
      return out;
    },
    // Marker buoy with a flag, matching the little target on the deck's horizon. o: x,y (waterline),s,t,label
    buoy(o) {
      const ink = col('ink'), wav = Math.sin(o.t * 5) * 3;
      const label = o.label ? (() => { const ls = fitSize(o.label, 30, TK.font.display, 150), bw = textWidth(o.label, ls, TK.font.display) + 30;
        return `<g transform="translate(0 46)"><rect x="${f(-bw / 2)}" y="-20" width="${f(bw)}" height="36" rx="4" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>${txt(0, 8, o.label, ls, ink, { font: TK.font.display })}</g>`; })() : '';
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)}) rotate(${f(Math.sin(o.t * 1.9) * 4)})">
        <path d="M-24 -6 h48 l-10 26 h-28 z" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <rect x="-26" y="-12" width="52" height="10" rx="3" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <line x1="0" y1="-12" x2="0" y2="-90" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M0 -90 Q22 ${f(-86 + wav)} 46 ${f(-80 + wav)} Q22 ${f(-74 + wav)} 0 -66 Z" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        ${label}</g>`;
    },

    // ---- verse 1 ----
    // Brass sign hanging on two ropes that run off the top of the frame. o: x,y (board center),s,text,swing (deg)
    plaque(o) {
      const ink = col('ink'), size = fitSize(o.text, 46, TK.font.display, 380), bw = textWidth(o.text, size, TK.font.display) + 60, bh = 74;
      return `<g transform="translate(${f(o.x)} ${f(o.y - 400 * o.s)}) rotate(${f(o.swing || 0)}) translate(0 ${f(400 * o.s)}) scale(${f(o.s)})">
        <line x1="${f(-bw / 2 + 24)}" y1="${-bh / 2}" x2="${f(-bw / 2 + 24)}" y2="-420" stroke="${col('rope')}" stroke-width="${lw('heavy')}"/>
        <line x1="${f(bw / 2 - 24)}" y1="${-bh / 2}" x2="${f(bw / 2 - 24)}" y2="-420" stroke="${col('rope')}" stroke-width="${lw('heavy')}"/>
        <rect x="${f(-bw / 2 + 6)}" y="${-bh / 2 + 7}" width="${f(bw)}" height="${bh}" rx="8" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="${f(-bw / 2)}" y="${-bh / 2}" width="${f(bw)}" height="${bh}" rx="8" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="${f(-bw / 2 + 8)}" y="${-bh / 2 + 8}" width="${f(bw - 16)}" height="${bh - 16}" rx="5" fill="none" stroke="${col('brassDark')}" stroke-width="${lw('base')}"/>
        ${[-1, 1].map(m => `<circle cx="${f(m * (bw / 2 - 24))}" cy="${-bh / 2 + 4}" r="5" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('fine')}"/>`).join('')}
        ${txt(0, 15, o.text, size, ink, { font: TK.font.display })}</g>`;
    },
    gymMat(x, y, w) {
      return `<rect x="${f(x - w / 2)}" y="${f(y - 10)}" width="${f(w)}" height="20" rx="8" fill="${col('rust')}" stroke="${col('ink')}" stroke-width="${lw('base')}"/><line x1="${f(x - w / 2 + 14)}" y1="${f(y - 2)}" x2="${f(x + w / 2 - 14)}" y2="${f(y - 2)}" stroke="${col('cream')}" stroke-width="${lw('fine')}" stroke-dasharray="10 8"/>`;
    },
    // Dotted course line along a quadratic curve, drawn on up to p (0..1). style 'go' or 'back'.
    route(x1, y1, cx, cy, x2, y2, p, style = 'go') {
      const ink = col('ink'), fill = style === 'back' ? col('brass') : col('live');
      let out = '';
      const n = 26;
      for (let i = 0; i <= n * p; i++) {
        const u = i / n, x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2, y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2;
        out += `<circle cx="${f(x)}" cy="${f(y)}" r="5.5" fill="${fill}" stroke="${ink}" stroke-width="${lw('fine')}"/>`;
      }
      if (p >= 1) {
        const ux = x2 - cx, uy = y2 - cy, L = Math.hypot(ux, uy), a = Math.atan2(uy, ux) * 180 / Math.PI;
        out += `<g transform="translate(${f(x2 + ux / L * 18)} ${f(y2 + uy / L * 18)}) rotate(${f(a)})"><path d="M8 0 L-12 -11 L-12 11 Z" fill="${fill}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/></g>`;
      }
      return out;
    },
    // Bouncing "this one" arrow pointing down at x,y.
    pointer(x, y, t, k = 1) {
      const b = Math.abs(Math.sin(t * 6)) * 14;
      return `<g transform="translate(${f(x)} ${f(y - b)}) scale(${f(k)})"><path d="M0 0 L-24 -30 L-10 -30 L-10 -64 L10 -64 L10 -30 L24 -30 Z" fill="${col('live')}" stroke="${col('ink')}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/></g>`;
    },
    // Comic sound-effect word (or a "?"), popping in with k.
    sfx(x, y, k, text, rot = -8, size = 64) {
      if (k <= 0) return '';
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(k)})">${txt(0, 0, text, size, col('live'), { font: TK.font.display, stroke: col('ink'), sw: lw('bold') })}</g>`;
    },
    // Full-frame ship's cabin wall: vertical planks and a porthole.
    cabinWall(t) {
      const ink = col('ink');
      let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="${col('woodLight')}"/>`;
      for (let x = 0; x < W; x += 96) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/><circle cx="${x + 12}" cy="40" r="3" fill="${col('woodSeam')}"/><circle cx="${x + 12}" cy="${H - 70}" r="3" fill="${col('woodSeam')}"/>`;
      s += `<rect x="0" y="${H - 60}" width="${W}" height="60" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      return s + `<rect width="${W}" height="${H}" fill="url(#vig)" opacity="0.5"/>`;
    },
    // Brass-framed panel of big lever switches, each with a lamp and a label plate.
    // o: x,y,s, levers: [{label, off (0 up/on .. 1 down/off), lamp (0 dark .. 1 lit)}]
    controlPanel(o) {
      const ink = col('ink'), n = o.levers.length, gap = 300, x0 = -gap * (n - 1) / 2;
      let s = `<rect x="-466" y="-226" width="944" height="464" rx="18" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="-472" y="-232" width="944" height="464" rx="18" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="-450" y="-210" width="900" height="420" rx="10" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`;
      for (const [x, y] of [[-452, -212], [452, -212], [-452, 212], [452, 212]]) s += `<circle cx="${x}" cy="${y}" r="7" fill="${col('brassDark')}" stroke="${ink}" stroke-width="${lw('fine')}"/>`;
      o.levers.forEach((L, i) => {
        const cx = x0 + i * gap, lamp = clamp(L.lamp);
        // lamp
        s += `<circle cx="${cx}" cy="-160" r="${f(30 + 26 * lamp)}" fill="${col('brass')}" opacity="${f(0.35 * lamp)}"/>
          <circle cx="${cx}" cy="-160" r="30" fill="${lamp > 0.5 ? col('brass') : col('iron')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
          <circle cx="${cx}" cy="-160" r="${f(16 * lamp)}" fill="${col('paper')}" opacity="${f(lamp)}"/>
          <circle cx="${cx - 9}" cy="-170" r="6" fill="${lamp > 0.5 ? col('paper') : col('ironShine')}" opacity="0.8"/>`;
        // label plate, two lines if it will not fit on one
        const pw = 250, words = L.label.split(' ');
        let lines = [L.label];
        if (words.length > 1 && fitSize(L.label, 26, TK.font.display, pw - 24) < 26) { const m = Math.ceil(words.length / 2); lines = [words.slice(0, m).join(' '), words.slice(m).join(' ')]; }
        const ph = lines.length > 1 ? 74 : 48;
        s += `<rect x="${cx - pw / 2}" y="-112" width="${pw}" height="${ph}" rx="5" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
        lines.forEach((ln, j) => { s += txt(cx, -112 + (lines.length > 1 ? 30 + j * 30 : 33), ln, fitSize(ln, 26, TK.font.display, pw - 24), ink, { font: TK.font.display }); });
        // lever: slot, arm, knob
        const a = lerp(-90, 30, clamp(L.off)) * Math.PI / 180, kx = cx + Math.cos(a) * 130, ky = 150 + Math.sin(a) * 130;
        s += `<path d="M${cx} 150 m-14 0 a14 14 0 0 1 28 0" fill="none"/>
          <rect x="${cx - 20}" y="96" width="40" height="110" rx="10" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('base')}"/>
          <line x1="${cx}" y1="150" x2="${f(kx)}" y2="${f(ky)}" stroke="${ink}" stroke-width="18" stroke-linecap="round"/>
          <line x1="${cx}" y1="150" x2="${f(kx)}" y2="${f(ky)}" stroke="${col('metal')}" stroke-width="10" stroke-linecap="round"/>
          <circle cx="${cx}" cy="150" r="16" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
          <circle cx="${f(kx)}" cy="${f(ky)}" r="22" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="${f(kx - 7)}" cy="${f(ky - 7)}" r="6" fill="${col('cream')}" opacity="0.6"/>`;
      });
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${s}</g>`;
    },
    // Screen position of lever i's knob, so a scene can put the hand on it. Same geometry as controlPanel.
    panelKnob(o, i, off) {
      const n = o.levers.length, cx = -300 * (n - 1) / 2 + i * 300, a = lerp(-90, 30, clamp(off)) * Math.PI / 180;
      return { x: o.x + o.s * (cx + Math.cos(a) * 130), y: o.y + o.s * (150 + Math.sin(a) * 130) };
    },

    // ---- verse 2 ----
    // Two eyes peering out of a dark gap. k 0..1 pops them open; they glance around and blink.
    peekEyes(x, y, k, t, s = 1) {
      if (k <= 0) return '';
      const ink = col('ink'), look = Math.sin(t * 2.3) * 2.5, blink = (t % 2.7) < 0.12 ? 0.15 : 1, ry = 6 * k * blink;
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${[-8, 8].map(dx => `<ellipse cx="${dx}" cy="0" rx="6" ry="${f(ry)}" fill="${col('paper')}"/><circle cx="${f(dx + look)}" cy="1" r="${f(2.6 * k * blink)}" fill="${ink}"/>`).join('')}</g>`;
    },
    // Signpost planted at x,y (base). o: x,y,s,text,tilt
    signpost(o) {
      const ink = col('ink'), size = fitSize(o.text, 44, TK.font.display, 280), bw = textWidth(o.text, size, TK.font.display) + 54;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.tilt || 0)}) scale(${f(o.s)})">
        <rect x="-8" y="-170" width="16" height="170" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <rect x="${f(-bw / 2 + 6)}" y="-226" width="${f(bw)}" height="70" rx="6" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="${f(-bw / 2)}" y="-232" width="${f(bw)}" height="70" rx="6" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${[-1, 1].map(m => `<circle cx="${f(m * (bw / 2 - 16))}" cy="-197" r="4" fill="${col('iron')}"/>`).join('')}
        ${txt(0, -182, o.text, size, col('live'), { font: TK.font.display, stroke: ink, sw: lw('fine') })}</g>`;
    },
    // Pier at waterline y, from x0 to x1, deck at y - h.
    dock(x0, x1, y, h = 40) {
      const ink = col('ink');
      let s = '';
      for (let x = x0 + 30; x < x1; x += 110) s += `<rect x="${x - 9}" y="${y - h}" width="18" height="${h + 60}" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      s += `<rect x="${x0}" y="${y - h - 18}" width="${x1 - x0}" height="22" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`;
      for (let x = x0 + 40; x < x1; x += 40) s += `<line x1="${x}" y1="${y - h - 18}" x2="${x}" y2="${y - h + 4}" stroke="${col('woodSeam')}" stroke-width="${lw('fine')}"/>`;
      return s;
    },
    // Supply shack on the dock. o: x,y (floor),s,label,offline (0 off .. 1 on),t. Switch box on the right wall.
    shack(o) {
      const ink = col('ink'), on = clamp(o.offline || 0), a = lerp(40, -40, on) * Math.PI / 180;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <rect x="-130" y="-190" width="260" height="190" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${[-86, -42, 2, 46, 90].map(x => `<line x1="${x}" y1="-186" x2="${x}" y2="-4" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/>`).join('')}
        <path d="M-156 -186 L0 -276 L156 -186 Z" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <rect x="-96" y="-120" width="70" height="120" rx="4" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="-38" cy="-60" r="5" fill="${col('brass')}"/>
        <rect x="-110" y="-176" width="220" height="40" rx="4" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${txt(0, -147, o.label || '', fitSize(o.label || '', 30, TK.font.display, 200), ink, { font: TK.font.display })}
        <g transform="translate(64 -70)"><rect x="-30" y="-40" width="60" height="80" rx="6" fill="${col('metal')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
          <line x1="0" y1="0" x2="${f(Math.sin(a) * 30)}" y2="${f(Math.cos(a) * 30)}" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>
          <circle cx="${f(Math.sin(a) * 30)}" cy="${f(Math.cos(a) * 30)}" r="8" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/><circle r="7" fill="${col('iron')}"/></g>
      </g>`;
    },
    shackSwitchPos(o) { return { x: o.x + 64 * o.s, y: o.y - 70 * o.s }; },
    // The far shore. o: x,y (waterline),s,label,t
    internetShore(o) {
      const ink = col('ink'), blink = (o.t % 1) < 0.5;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <path d="M-260 10 Q-200 -150 0 -170 Q220 -180 320 10 Z" fill="${col('land')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <path d="M-180 -40 Q-60 -80 60 -70" fill="none" stroke="${col('landDark')}" stroke-width="${lw('base')}"/>
        ${[[-120, 70, 60], [-40, 50, 90], [30, 60, 70], [110, 46, 110]].map(([x, w, h]) => `<rect x="${x}" y="${-150 - h + 20}" width="${w}" height="${h}" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
          ${[0, 1].map(r => `<rect x="${x + 10}" y="${-150 - h + 34 + r * 26}" width="${w - 20}" height="10" fill="${col('navy')}"/>`).join('')}`).join('')}
        <line x1="188" y1="-150" x2="188" y2="-262" stroke="${ink}" stroke-width="${lw('heavy')}"/><path d="M172 -150 L188 -230 L204 -150" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/>
        <circle cx="188" cy="-266" r="7" fill="${blink ? col('live') : col('iron')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
        <g transform="translate(-10 -16)"><rect x="-120" y="-24" width="240" height="44" rx="5" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${txt(0, 9, o.label || '', fitSize(o.label || '', 32, TK.font.display, 220), ink, { font: TK.font.display })}</g></g>`;
    },
    // Rope along a quadratic curve (tow lines, mooring lines).
    towline(x1, y1, cx, cy, x2, y2) {
      return `<path d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" fill="none" stroke="${col('rope')}" stroke-width="${lw('bold')}"/>`;
    },
    // Gangplank with a sagging rope above it, from (x1,y1) to (x2,y2).
    gangplank(x1, y1, x2, y2) {
      const ink = col('ink');
      let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="20" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col('woodLight')}" stroke-width="13" stroke-linecap="round"/>`;
      for (let i = 1; i < 14; i++) { const u = i / 14, x = lerp(x1, x2, u), y = lerp(y1, y2, u); s += `<line x1="${f(x)}" y1="${f(y - 6)}" x2="${f(x)}" y2="${f(y + 6)}" stroke="${col('woodSeam')}" stroke-width="${lw('fine')}"/>`; }
      s += `<path d="M${x1} ${y1 - 70} Q${f((x1 + x2) / 2)} ${f((y1 + y2) / 2 - 10)} ${x2} ${y2 - 70}" fill="none" stroke="${col('rope')}" stroke-width="${lw('bold')}"/>`;
      return s;
    },
    // Callout box with a leader line to an anchor. o: x,y (box center),ax,ay,k (pop),lines [{s, hot}], hot lines flash with t
    callout(o) {
      if (o.k <= 0) return '';
      const ink = col('ink'), size = 34, wd = Math.max(...o.lines.map(l => textWidth(l.s, size, TK.font.display))) + 50, h = o.lines.length * 42 + 22;
      const on = (o.t % 0.5) < 0.32;
      const body = o.lines.map((l, i) => txt(0, -h / 2 + 46 + i * 42, l.s, size, l.hot ? (on ? col('live') : col('rust')) : ink, { font: TK.font.display })).join('');
      return `<line x1="${f(o.ax)}" y1="${f(o.ay)}" x2="${f(lerp(o.ax, o.x, o.k))}" y2="${f(lerp(o.ay, o.y, o.k))}" stroke="${ink}" stroke-width="${lw('base')}" stroke-dasharray="8 6"/>
        <circle cx="${f(o.ax)}" cy="${f(o.ay)}" r="44" fill="none" stroke="${col('live')}" stroke-width="${lw('heavy')}" opacity="${f(o.k)}"/>
        <g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.k)})"><rect x="${f(-wd / 2 + 6)}" y="${f(-h / 2 + 6)}" width="${f(wd)}" height="${h}" rx="8" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="${f(-wd / 2)}" y="${f(-h / 2)}" width="${f(wd)}" height="${h}" rx="8" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('bold')}"/>${body}</g>`;
    },
    // The unsanctioned message board. o: x,y (top center),s,title,notes (how many pinned),t. Layout is fixed so notes stay put.
    noticeBoard(o) {
      const ink = col('ink'), cols = 14, rows = 7, bw = 700, bh = 330;
      let s = `<rect x="${-bw / 2 + 8}" y="8" width="${bw}" height="${bh}" rx="8" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="${-bw / 2}" y="0" width="${bw}" height="${bh}" rx="8" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="${-bw / 2 + 16}" y="52" width="${bw - 32}" height="${bh - 68}" rx="4" fill="${col('parchDark')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <rect x="-150" y="10" width="300" height="36" rx="4" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${txt(0, 37, o.title || '', fitSize(o.title || '', 28, TK.font.display, 280), ink, { font: TK.font.display })}`;
      const n = Math.floor(o.notes || 0);
      for (let i = 0; i < Math.min(n, cols * rows); i++) {
        const r = rnd(i * 3.7 + 1), c = i % cols, rw = Math.floor(i / cols);
        const x = -bw / 2 + 44 + c * 47 + (rnd(i * 1.3) - 0.5) * 14, y = 74 + rw * 36 + (rnd(i * 2.9) - 0.5) * 10, rot = (r - 0.5) * 18;
        s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-17" y="-12" width="34" height="28" fill="${r > 0.8 ? col('cream') : col('paper')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
          <line x1="-11" y1="0" x2="${f(-11 + 16 + r * 6)}" y2="0" stroke="${col('newsLine')}" stroke-width="2"/><line x1="-11" y1="7" x2="${f(-11 + 10 + r * 10)}" y2="7" stroke="${col('newsLine')}" stroke-width="2"/>
          <circle cx="0" cy="-10" r="3.5" fill="${col('live')}" stroke="${ink}" stroke-width="1"/></g>`;
      }
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${s}</g>`;
    },
    // Network-style count badge. o: x,y (right edge, top),value,k (pop)
    counter(o) {
      if ((o.k ?? 1) <= 0) return '';
      const ink = col('ink'), v = Math.round(o.value).toLocaleString('en-US'), size = 46, wd = Math.max(150, textWidth(v, size, TK.font.display) + 44);
      return `<g transform="translate(${f(o.x - wd)} ${f(o.y)}) scale(${f(o.k ?? 1)})"><rect x="5" y="5" width="${f(wd)}" height="60" rx="8" fill="${col('shadow')}" opacity="0.3"/>
        <rect width="${f(wd)}" height="60" rx="8" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(wd / 2, 45, v, size, col('liveText'), { font: TK.font.display })}</g>`;
    },
    // Harbor town on the far shore. o: x,y (waterline),s,label,t,night (0..1),lit (0..1 the middle house's window), stranger (silhouette in it)
    harborTown(o) {
      const ink = col('ink'), nt = o.night || 0;
      const house = (x, w, h, roof, i) => {
        const win = i === 1 && o.lit ? col('windowLit') : (nt > 0.5 ? col('nightDeep') : col('navy'));
        const glow = i === 1 && o.lit ? `<circle cx="${x + w / 2}" cy="${-h + 38}" r="${f(40 * o.lit)}" fill="${col('windowLit')}" opacity="${f(0.35 * o.lit)}"/>` : '';
        const who = i === 1 && o.stranger ? `<g transform="translate(${x + w / 2} ${-h + 52}) scale(0.2)" opacity="${f(o.stranger)}"><rect x="-26" y="-114" width="52" height="44" rx="12" fill="${ink}"/><rect x="-22" y="-70" width="44" height="70" rx="10" fill="${ink}"/><line x1="8" y1="-115" x2="12" y2="-130" stroke="${ink}" stroke-width="6"/><circle cx="12" cy="-132" r="6" fill="${ink}"/></g>` : '';
        return `${glow}<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="${nt > 0.5 ? col('navy') : col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M${x - 10} ${-h} L${x + w / 2} ${-h - w * 0.55} L${x + w + 10} ${-h} Z" fill="${nt > 0.5 ? col('navyDeep') : roof}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <rect x="${x + w / 2 - 12}" y="${-h + 26}" width="24" height="24" fill="${win}" stroke="${ink}" stroke-width="${lw('thin')}"/>${who}`;
      };
      let s = `<rect x="-280" y="-18" width="560" height="30" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`;
      s += house(-240, 110, 130, col('rust'), 0) + house(-110, 130, 180, col('navy'), 1) + house(40, 100, 120, col('brassDark'), 2) + house(160, 90, 150, col('rust'), 3);
      s += `<g transform="translate(0 -18)"><rect x="-150" y="-32" width="300" height="46" rx="5" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${txt(0, 2, o.label || '', fitSize(o.label || '', 34, TK.font.display, 280), ink, { font: TK.font.display })}</g>`;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${s}</g>`;
    },
    // Open ledger with tally marks in groups of five. o: x,y (center),s,title,marks (fractional draws the next stroke)
    ledger(o) {
      const ink = col('ink'), m = o.marks || 0;
      let s = `<rect x="-424" y="-232" width="860" height="478" rx="10" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="-430" y="-240" width="860" height="480" rx="10" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <path d="M-410 -224 L-6 -214 L-6 224 L-410 220 Z" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M410 -224 L6 -214 L6 224 L410 220 Z" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <line x1="0" y1="-218" x2="0" y2="224" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(-208, -164, o.title || '', fitSize(o.title || '', 44, TK.font.display, 340), ink, { font: TK.font.display })}
        <line x1="-380" y1="-140" x2="-36" y2="-140" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      for (let r = 0; r < 7; r++) for (const side of [-1, 1]) { const y = -96 + r * 46; if (side < 0 && r > 5) continue; s += `<line x1="${side < 0 ? -380 : 36}" y1="${y + 14}" x2="${side < 0 ? -36 : 380}" y2="${y + 14}" stroke="${col('newsLine')}" stroke-width="${lw('fine')}"/>`; }
      // slots: left page 6 rows, then right page 7 rows; 6 groups per row
      const slots = [];
      for (let r = 0; r < 6; r++) slots.push([-370, -96 + r * 46]);
      for (let r = 0; r < 7; r++) slots.push([46, -96 + r * 46]);
      for (let i = 0; i < Math.ceil(m); i++) {
        const g = Math.floor(i / 5), k = i % 5, row = Math.floor(g / 6), col6 = g % 6;
        if (row >= slots.length) break;
        const [sx, sy] = slots[row], gx = sx + col6 * 56, p = clamp(m - i);
        if (k < 4) { const x = gx + k * 9; s += `<line x1="${x}" y1="${sy - 14}" x2="${x}" y2="${f(sy - 14 + 30 * p)}" stroke="${ink}" stroke-width="${lw('mid')}" stroke-linecap="round"/>`; }
        else s += `<line x1="${gx - 6}" y1="${sy + 10}" x2="${f(gx - 6 + 42 * p)}" y2="${f(sy + 10 - 22 * p)}" stroke="${col('live')}" stroke-width="${lw('mid')}" stroke-linecap="round"/>`;
      }
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${s}</g>`;
    },

    // ---- verse 3 ----
    // The turning page of the ship's logbook: its edge at x, sweeping right to left.
    pageEdge(x) {
      const ink = col('ink');
      return `<path d="M${f(x)} -10 Q${f(x + 30)} ${H / 2} ${f(x)} ${H + 10} L${f(x + 70)} ${H + 10} Q${f(x + 90)} ${H / 2} ${f(x + 70)} -10 Z" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M${f(x + 70)} -10 Q${f(x + 90)} ${H / 2} ${f(x + 70)} ${H + 10}" fill="none" stroke="${col('parchDark')}" stroke-width="10" opacity="0.7"/>
        <rect x="${f(x - 26)}" y="-10" width="26" height="${H + 20}" fill="${col('shadow')}" opacity="0.18"/>`;
    },
    // Rubber-stamped date tag, top right under the network bug. o: x (right edge),y,text,k (0..1 stamp)
    dateStamp(o) {
      if (o.k <= 0) return '';
      const ink = col('ink'), size = 34, wd = textWidth(o.text, size, TK.font.display) + 40, sc = lerp(2.4, 1, easeOut(clamp(o.k))), a = clamp(o.k * 3);
      return `<g transform="translate(${f(o.x - wd / 2)} ${f(o.y)}) rotate(-6) scale(${f(sc)})" opacity="${f(a)}">
        <rect x="${f(-wd / 2)}" y="-26" width="${f(wd)}" height="52" rx="6" fill="${col('paper')}" stroke="${col('live')}" stroke-width="${lw('bold')}"/>
        <rect x="${f(-wd / 2 + 6)}" y="-20" width="${f(wd - 12)}" height="40" rx="4" fill="none" stroke="${col('live')}" stroke-width="${lw('fine')}"/>
        ${txt(0, 12, o.text, size, col('live'), { font: TK.font.display })}</g>`;
    },
    // A ship's officer from the AI lab: tricorn hat, lab coat, nitrile gloves. Generic, not anyone real.
    // o: x,y (feet),s,t,phase,flip,scratch (0..1 hand to head),spyglass (0..1 raised),point (0..1 arm out),shrug (0..1),look,frown,hat (false = bareheaded)
    officer(o) {
      const ink = col('ink'), t = o.t, ph = o.phase || 0, sc = o.scratch || 0, spy = o.spyglass || 0, pt = o.point || 0, sh = o.shrug || 0, look = o.look || 0;
      const blink = ((t + ph * 1.9) % 3.1) < 0.11;
      const glove = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${col('nitrile')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      const arm = (sx, sy, ex, ey, cx, cy) => `<path d="M${sx} ${sy} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M${sx} ${sy} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" fill="none" stroke="${col('labCoat')}" stroke-width="9" stroke-linecap="round"/>${glove(ex, ey)}`;
      // back arm: scratch head, or shrug, or hang
      const wig = Math.sin(t * 22) * 4 * sc;
      let bx = lerp(-24, -36, sh), by = lerp(-46, -92, sh);
      bx = lerp(bx, -14 + wig, sc); by = lerp(by, -146, sc);
      const back = arm(-18, -98, bx, by, lerp(-34, -40, Math.max(sc, sh)), lerp(-70, -120, Math.max(sc, sh)));
      // front arm: spyglass to the eye, or point, or hang/shrug
      let fx = lerp(24, 36, sh), fy = lerp(-46, -92, sh);
      fx = lerp(fx, 50, pt); fy = lerp(fy, -104, pt);
      fx = lerp(fx, 22, spy); fy = lerp(fy, -128, spy);
      const front = arm(18, -98, fx, fy, lerp(34, 40, Math.max(sh, pt, spy)), lerp(-70, -112, Math.max(sh, pt, spy)));
      const glass = spy > 0.05 ? `<g transform="translate(${f(fx)} ${f(fy - 4)}) rotate(-8)" opacity="${f(clamp(spy * 2))}"><rect x="-4" y="-9" width="70" height="18" rx="4" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}"/><rect x="40" y="-11" width="30" height="22" rx="4" fill="${col('brassDark')}" stroke="${ink}" stroke-width="${lw('base')}"/></g>` : '';
      const eyeY = -138, mouth = o.frown ? `<path d="M2 -118 Q9 -124 16 -118" fill="none" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round"/>` : `<path d="M2 -121 Q9 -115 16 -121" fill="none" stroke="${ink}" stroke-width="${lw('base')}" stroke-linecap="round"/>`;
      const eyes = blink ? `<line x1="${4 + look}" y1="${eyeY}" x2="${12 + look}" y2="${eyeY}" stroke="${ink}" stroke-width="${lw('base')}"/>` : `<circle cx="${8 + look}" cy="${eyeY}" r="3.6" fill="${ink}"/><circle cx="${22 + look}" cy="${eyeY}" r="3.6" fill="${ink}"/>`;
      const body = `
        <rect x="-14" y="-40" width="11" height="40" rx="4" fill="${col('navy')}" stroke="${ink}" stroke-width="${lw('thin')}"/><rect x="3" y="-40" width="11" height="40" rx="4" fill="${col('navy')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
        <ellipse cx="-6" cy="-2" rx="10" ry="5" fill="${ink}"/><ellipse cx="12" cy="-2" rx="10" ry="5" fill="${ink}"/>
        ${back}
        <path d="M-26 -104 Q0 -112 26 -104 L32 -32 L-32 -32 Z" fill="${col('labCoat')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <line x1="2" y1="-104" x2="2" y2="-34" stroke="${col('labCoatShade')}" stroke-width="${lw('base')}"/>
        <circle cx="10" cy="-84" r="3" fill="${col('labButton')}" stroke="${ink}" stroke-width="1"/><circle cx="10" cy="-62" r="3" fill="${col('labButton')}" stroke="${ink}" stroke-width="1"/>
        <rect x="-20" y="-92" width="18" height="14" rx="2" fill="${col('badge')}" stroke="${ink}" stroke-width="1"/><rect x="-20" y="-92" width="18" height="4" fill="${col('badgeStrip')}"/>
        <circle cx="4" cy="-134" r="26" fill="${col('skin')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${eyes}${mouth}
        ${o.hat === false ? `<path d="M-20 -150 Q4 -170 28 -150" fill="none" stroke="${col('woodDark')}" stroke-width="${lw('limb')}" stroke-linecap="round"/>` : R.tricorn({ x: 4, y: -152, s: 1 })}
        ${front}${glass}`;
      const fl = o.flip ? -1 : 1;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s * fl)} ${f(o.s)})">${body}</g>`;
    },
    // Classic pirate tricorn, seen from the front: crown behind, brim swept up into two side corners and a front point,
    // gold trim on the turned-up edge, skull and crossbones on the front. o: x,y (where it sits on the head),s
    tricorn(o) {
      const ink = col('ink'), hat = col('navyDeep');
      const brim = `M-58 -44 Q-50 -6 0 2 Q50 -6 58 -44 Q40 -30 22 -30 L0 -58 L-22 -30 Q-40 -30 -58 -44 Z`;
      const trim = `M-58 -44 Q-40 -30 -22 -30 L0 -58 L22 -30 Q40 -30 58 -44`;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <path d="M-30 -18 Q-32 -62 0 -66 Q32 -62 30 -18 Z" fill="${hat}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <path d="${brim}" fill="${hat}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <path d="${trim}" fill="none" stroke="${col('brass')}" stroke-width="${lw('heavy')}" stroke-linejoin="round" stroke-linecap="round"/>
        <g transform="translate(0 -22)">
          <path d="M-11 -6 L11 6 M-11 6 L11 -6" stroke="${col('cream')}" stroke-width="3.2" stroke-linecap="round"/>
          <circle cx="0" cy="-4" r="7" fill="${col('cream')}"/><rect x="-4.5" y="0" width="9" height="5" rx="1.5" fill="${col('cream')}"/>
          <circle cx="-2.6" cy="-4.5" r="1.7" fill="${hat}"/><circle cx="2.6" cy="-4.5" r="1.7" fill="${hat}"/></g>
      </g>`;
    },
    // Mast with a crow's nest. o: x,y (base),s. The nest's floor is at y - 420*s.
    crowsNest(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="-14" y="-560" width="28" height="580" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <line x1="-140" y1="-560" x2="140" y2="-560" stroke="${col('woodDark')}" stroke-width="16" stroke-linecap="round"/>
        <path d="M-70 -420 L70 -420 L60 -360 L-60 -360 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <line x1="-66" y1="-398" x2="66" y2="-398" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/></g>`;
    },
    crowsNestFront(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><path d="M-78 -440 L78 -440 L66 -360 L-66 -360 Z" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <line x1="-72" y1="-412" x2="72" y2="-412" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/><line x1="-70" y1="-386" x2="70" y2="-386" stroke="${col('woodSeam')}" stroke-width="${lw('base')}"/></g>`;
    },
    // Ship's bell on a bracket. o: x,y (pivot),s,swing (deg)
    bell(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <rect x="-120" y="-30" width="240" height="26" rx="6" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <g transform="rotate(${f(o.swing || 0)})"><line x1="0" y1="-4" x2="0" y2="30" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <path d="M-70 200 Q-74 110 -44 60 Q0 20 44 60 Q74 110 70 200 Q0 214 -70 200 Z" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <path d="M-50 186 Q0 196 50 186" fill="none" stroke="${col('brassDark')}" stroke-width="${lw('heavy')}"/><path d="M-30 80 Q-40 120 -38 170" fill="none" stroke="${col('cream')}" stroke-width="${lw('heavy')}" opacity="0.6" stroke-linecap="round"/>
        <line x1="0" y1="200" x2="0" y2="232" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="0" cy="238" r="12" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('base')}"/></g></g>`;
    },
    // Motion lines around something shaking. x,y center, r radius, k 0..1 strength
    shakeLines(x, y, r, k) {
      if (k <= 0) return '';
      const ink = col('live');
      return [-1, 1].map(m => `<path d="M${f(x + m * r)} ${f(y - 40)} q${f(m * 22)} 40 0 80 M${f(x + m * (r + 26))} ${f(y - 56)} q${f(m * 26)} 56 0 112" fill="none" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linecap="round" opacity="${f(k)}"/>`).join('');
    },
    // Red alert board. o: x,y,s,text,on (0..1 flash)
    alertSign(o) {
      const ink = col('ink'), size = fitSize(o.text, 44, TK.font.display, 420), lines = o.text.split(' '), m = Math.ceil(lines.length / 2);
      const l1 = lines.slice(0, m).join(' '), l2 = lines.slice(m).join(' '), bw = Math.max(textWidth(l1, 46, TK.font.display), textWidth(l2, 46, TK.font.display)) + 60;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="${f(-bw / 2 + 7)}" y="-64" width="${f(bw)}" height="136" rx="10" fill="${col('shadow')}" opacity="0.3"/>
        <rect x="${f(-bw / 2)}" y="-70" width="${f(bw)}" height="136" rx="10" fill="${o.on > 0.5 ? col('live') : col('rust')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${txt(0, -14, l1, 46, col('liveText'), { font: TK.font.display })}${txt(0, 42, l2, 46, col('liveText'), { font: TK.font.display })}</g>`;
    },
    nightSky(t, y1 = H) {
      let s = `<rect x="0" y="0" width="${W}" height="${y1}" fill="${col('night')}"/>`;
      for (let i = 0; i < 46; i++) { const x = rnd(i * 1.7) * W, y = rnd(i * 3.3 + 2) * y1 * 0.8, tw = 0.5 + 0.5 * Math.sin(t * 3 + i); s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1 + rnd(i * 5.1) * 1.6)}" fill="${col('star')}" opacity="${f(0.4 + 0.6 * tw)}"/>`; }
      return s;
    },
    moon(x, y, r = 34) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${col('star')}" stroke="${col('parchDark')}" stroke-width="${lw('fine')}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.86}" fill="${col('night')}"/>`; },
    // Firework burst at x,y; p 0..1 through its life; color is a token name
    firework(x, y, p, colorKey) {
      if (p <= 0 || p >= 1) return '';
      const c = col(colorKey), r = easeOut(p) * 110, a = 1 - easeIn(p);
      let s = '';
      for (let i = 0; i < 14; i++) { const ang = i * Math.PI * 2 / 14, x1 = x + Math.cos(ang) * r * 0.45, y1 = y + Math.sin(ang) * r * 0.45 + p * p * 30, x2 = x + Math.cos(ang) * r, y2 = y + Math.sin(ang) * r + p * p * 40;
        s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${lw('heavy')}" stroke-linecap="round" opacity="${f(a)}"/><circle cx="${f(x2)}" cy="${f(y2)}" r="4" fill="${col('star')}" opacity="${f(a)}"/>`; }
      return s;
    },
    // Pile of planks where the shack stood. o: x,y,s
    rubble(o) {
      const ink = col('ink');
      const planks = [[-120, -10, 8], [-40, -24, -14], [40, -8, 22], [100, -18, -6], [-80, -40, 30], [20, -44, -25], [-10, -60, 6], [70, -50, 40]];
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">${planks.map(([x, y, r], i) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-70" y="-10" width="140" height="20" rx="3" fill="${i % 3 === 0 ? col('rust') : col('wood')}" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="-56" cy="0" r="3" fill="${col('iron')}"/></g>`).join('')}</g>`;
    },
    // Cloth banner held between two poles (poles end at y). o: x,y (pole bottoms, center),w,text,s
    heldBanner(o) {
      const ink = col('ink'), s = o.s || 1, w = o.w, size = fitSize(o.text, 40, TK.font.display, w - 30), wave = Math.sin((o.t || 0) * 4) * 4;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(s)})">
        <line x1="${-w / 2}" y1="0" x2="${-w / 2}" y2="-190" stroke="${col('woodDark')}" stroke-width="10" stroke-linecap="round"/><line x1="${w / 2}" y1="0" x2="${w / 2}" y2="-190" stroke="${col('woodDark')}" stroke-width="10" stroke-linecap="round"/>
        <path d="M${-w / 2} -184 Q0 ${f(-174 + wave)} ${w / 2} -184 L${w / 2} -124 Q0 ${f(-114 + wave)} ${-w / 2} -124 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(0, f(-140 + wave * 0.6), o.text, size, col('live'), { font: TK.font.display })}</g>`;
    },
    // Corkboard of pins and tangled red string. o: x,y (center),s,wipe (0..1 cleared from left)
    corkboard(o) {
      const ink = col('ink'), bw = 520, bh = 320, pins = [[-200, -110], [180, -120], [-150, 100], [200, 90], [0, -60], [-60, 40], [110, 10], [-220, 10], [60, 120], [150, -40]];
      let str = '';
      for (let i = 0; i < 18; i++) { const a = pins[i % pins.length], b = pins[(i * 7 + 3) % pins.length]; str += `<path d="M${a[0]} ${a[1]} Q${f((a[0] + b[0]) / 2 + (rnd(i) - 0.5) * 120)} ${f((a[1] + b[1]) / 2 + (rnd(i + 9) - 0.5) * 120)} ${b[0]} ${b[1]}" fill="none" stroke="${col('string')}" stroke-width="${lw('base')}"/>`; }
      let notes = pins.map(([x, y], i) => `<g transform="translate(${x} ${y + 18}) rotate(${f((rnd(i * 2.2) - 0.5) * 16)})"><rect x="-26" y="-6" width="52" height="38" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('fine')}"/><line x1="-18" y1="8" x2="16" y2="8" stroke="${col('newsLine')}" stroke-width="2"/><line x1="-18" y1="18" x2="8" y2="18" stroke="${col('newsLine')}" stroke-width="2"/></g>`).join('');
      const pinDots = pins.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('fine')}"/>`).join('');
      const wx = -bw / 2 + bw * clamp(o.wipe || 0);
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <rect x="${-bw / 2 - 18}" y="${-bh / 2 - 18}" width="${bw + 36}" height="${bh + 36}" rx="8" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" fill="${col('cork')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <clipPath id="corkclip"><rect x="${f(wx)}" y="${-bh / 2}" width="${f(bw / 2 - wx)}" height="${bh}"/></clipPath>
        <g clip-path="url(#corkclip)">${notes}${str}${pinDots}</g></g>`;
    },
    // Spyglass view: a brass-ringed circle at x,y showing bg (full frame) with inner drawn centered on the circle.
    spyView(x, y, r, bg, inner) {
      const ink = col('ink');
      return `<clipPath id="spyclip"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#spyclip)">${bg}<g transform="translate(${x} ${y})">${inner}</g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col('shadow')}" stroke-width="40" opacity="0.35"/></g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${ink}" stroke-width="20"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col('brass')}" stroke-width="12"/>`;
    },
    // One big pinned note with a few words on it. k pop-in.
    stickyNote(x, y, k, text) {
      if (k <= 0) return '';
      const ink = col('ink');
      const w = Math.max(116, textWidth(text, 40, TK.font.hand) + 50);
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(-4) scale(${f(k)})"><rect x="${f(-w / 2)}" y="-34" width="${f(w)}" height="84" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(0, 22, text, 40, ink)}<circle cx="0" cy="-30" r="8" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/></g>`;
    },
    // Small chat bubble with a tail pointing down-left. k pop-in.
    chatBubble(x, y, k, text) {
      if (k <= 0) return '';
      const ink = col('ink'), size = 30, w = textWidth(text, size, TK.font.hand) + 36;
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><path d="M${f(-w / 2)} -28 Q${f(-w / 2)} -44 ${f(-w / 2 + 16)} -44 L${f(w / 2 - 16)} -44 Q${f(w / 2)} -44 ${f(w / 2)} -28 L${f(w / 2)} 0 Q${f(w / 2)} 16 ${f(w / 2 - 16)} 16 L-10 16 L-26 36 L-24 16 L${f(-w / 2 + 16)} 16 Q${f(-w / 2)} 16 ${f(-w / 2)} 0 Z" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        ${txt(0, 0, text, size, ink)}</g>`;
    },
    sparkle(x, y, p, s = 1) {
      if (p <= 0 || p >= 1) return '';
      const k = Math.sin(p * Math.PI) * s;
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)}) rotate(${f(p * 90)})"><path d="M0 -24 L5 -5 L24 0 L5 5 L0 24 L-5 5 L-24 0 L-5 -5 Z" fill="${col('paper')}" stroke="${col('brass')}" stroke-width="${lw('base')}"/></g>`;
    },
    // Split-screen divider at x.
    divider(x) { return `<rect x="${f(x - 5)}" y="0" width="10" height="${H}" fill="${col('ink')}"/><rect x="${f(x - 2)}" y="0" width="4" height="${H}" fill="${col('brass')}"/>`; },
    // The mouse. o: x,y (feet),s,t,run (phase or null),flip
    mouse(o) {
      const ink = col('ink'), run = o.run, legs = run != null ? Math.sin(run * Math.PI * 2) * 10 : 0, bob = run != null ? -Math.abs(Math.sin(run * Math.PI * 2)) * 6 : 0;
      const fl = o.flip ? -1 : 1;
      return `<g transform="translate(${f(o.x)} ${f(o.y + bob)}) scale(${f(o.s * fl)} ${f(o.s)})">
        <path d="M-40 -20 Q-80 -30 -96 -60" fill="none" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linecap="round"/>
        <line x1="-16" y1="-8" x2="${f(-20 + legs)}" y2="0" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linecap="round"/><line x1="14" y1="-8" x2="${f(18 - legs)}" y2="0" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linecap="round"/>
        <ellipse cx="0" cy="-22" rx="44" ry="22" fill="${col('mouse')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <circle cx="22" cy="-46" r="14" fill="${col('mouse')}" stroke="${ink}" stroke-width="${lw('base')}"/><circle cx="22" cy="-46" r="7" fill="${col('mouseEar')}"/>
        <path d="M30 -34 Q58 -30 62 -22 Q50 -10 30 -12 Z" fill="${col('mouse')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <circle cx="62" cy="-22" r="4" fill="${ink}"/><circle cx="42" cy="-28" r="3.4" fill="${ink}"/>
        <path d="M58 -24 l14 -6 M58 -20 l15 2" stroke="${ink}" stroke-width="1.5"/></g>`;
    },

    // ---- spoken word: the PNN studio ----
    lantern(x, y, lit, t) {
      const ink = col('ink'), fl = lit ? 0.85 + 0.15 * Math.sin(t * 9 + x) : 0;
      return `<line x1="${x}" y1="${y - 80}" x2="${x}" y2="${y - 34}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${lit ? `<circle cx="${x}" cy="${y}" r="${f(60 * fl)}" fill="${col('windowLit')}" opacity="${f(0.28 * fl)}"/>` : ''}
        <path d="M${x - 16} ${y - 34} h32 l6 10 v34 l-6 12 h-32 l-6 -12 v-34 z" fill="${lit ? col('windowLit') : col('iron')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <path d="M${x - 8} ${y - 24} v38 M${x + 8} ${y - 24} v38" stroke="${col('brassDark')}" stroke-width="${lw('thin')}"/>
        <rect x="${x - 20}" y="${y - 40}" width="40" height="8" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
    },
    // The captain's cabin dressed as a news studio: PNN wheel on a sail, lanterns.
    studioSet(t) {
      const ink = col('ink');
      let s = R.cabinWall(t);
      s += `<path d="M180 70 Q640 40 1100 70 L1060 470 Q640 440 220 470 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <path d="M260 120 Q640 96 1020 120" fill="none" stroke="${col('parchDark')}" stroke-width="${lw('base')}"/>`;
      s += R.networkLogo({ x: 640, y: 250, s: 0.55, spin: Math.sin(t * 0.6) * 6, banner: 1 });
      s += [150, 1130].map(x => R.lantern(x, 230, true, t)).join('');
      return s;
    },
    newsDesk(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s || 1)})"><rect x="-470" y="0" width="940" height="44" rx="6" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="-450" y="44" width="900" height="200" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="-150" y="80" width="300" height="70" rx="6" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(0, 133, copy('network'), 56, col('liveText'), { font: TK.font.display })}</g>`;
    },
    // Picture-in-picture box. inner is drawn in local coordinates (0..w, 0..h).
    pip(o) {
      const ink = col('ink'), k = o.k ?? 1;
      if (k <= 0) return '';
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(k)})"><rect x="8" y="8" width="${o.w}" height="${o.h}" rx="8" fill="${col('shadow')}" opacity="0.35"/>
        <clipPath id="pipclip${o.id || ''}"><rect width="${o.w}" height="${o.h}" rx="8"/></clipPath><g clip-path="url(#pipclip${o.id || ''})">${o.inner}</g>
        <rect width="${o.w}" height="${o.h}" rx="8" fill="none" stroke="${ink}" stroke-width="${lw('bold')}"/><rect x="5" y="5" width="${o.w - 10}" height="${o.h - 10}" rx="5" fill="none" stroke="${col('brass')}" stroke-width="${lw('base')}"/></g>`;
    },
    // The deadpan seagull in reading glasses. o: x,y (feet),s,t,talk (bool),flip
    seagull(o) {
      const ink = col('ink'), t = o.t, open = o.talk ? Math.abs(Math.sin(t * 13)) * 7 : 0, blink = (t % 3.4) < 0.14;
      const fl = o.flip ? -1 : 1;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s * fl)} ${f(o.s)})">
        <path d="M-8 -6 L-12 0 M8 -6 L4 0" stroke="${col('rust')}" stroke-width="${lw('heavy')}" stroke-linecap="round"/>
        <path d="M-60 -60 Q-70 -20 -20 -10 L20 -10 Q40 -30 30 -70 Q0 -96 -60 -60 Z" fill="${col('gull')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <path d="M-60 -60 Q-30 -40 10 -50 Q-20 -24 -64 -38 Z" fill="${col('gullWing')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <path d="M-80 -58 L-60 -60 L-64 -44 Z" fill="${col('gullWing')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <circle cx="26" cy="-104" r="30" fill="${col('gull')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M50 -104 L92 ${f(-100 - open * 0.3)} L56 -94 Z" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <path d="M54 -94 L88 ${f(-92 + open)} L52 -88 Z" fill="${col('brassDark')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <circle cx="34" cy="-112" r="9" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
        ${blink ? `<line x1="26" y1="-112" x2="42" y2="-112" stroke="${ink}" stroke-width="${lw('base')}"/>` : `<circle cx="37" cy="-110" r="3.4" fill="${ink}"/><path d="M25 -116 L43 -116" stroke="${ink}" stroke-width="${lw('heavy')}"/>`}
        <circle cx="34" cy="-112" r="13" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/><circle cx="62" cy="-110" r="10" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/>
        <line x1="47" y1="-112" x2="52" y2="-111" stroke="${ink}" stroke-width="${lw('base')}"/><line x1="21" y1="-114" x2="2" y2="-120" stroke="${ink}" stroke-width="${lw('base')}"/></g>`;
    },
    // A pundit parrot in a necktie. o: x,y (feet),s,t,variant,squawk (0..1),flap (0..1),flip
    parrot(o) {
      const ink = col('ink'), t = o.t, v = o.variant || 0, sq = o.squawk || 0, fl = o.flap || 0;
      const body = [col('parrot'), col('parrotBlue'), col('parrotRed'), col('parrot')][v % 4], tie = [col('live'), col('brass'), col('navy'), col('rust')][v % 4];
      const open = sq * (0.4 + 0.6 * Math.abs(Math.sin(t * 16))), bob = sq ? Math.sin(t * 16) * 3 : 0;
      const wing = m => { const a = fl * (60 + 20 * Math.sin(t * 20)) * m; return `<g transform="rotate(${f(a)} ${m * 22} -70)"><path d="M${m * 22} -76 Q${m * 52} -40 ${m * 30} -14 Q${m * 16} -40 ${m * 22} -76 Z" fill="${col('parrotDark')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/></g>`; };
      const flip = o.flip ? -1 : 1;
      return `<g transform="translate(${f(o.x)} ${f(o.y + bob)}) scale(${f(o.s * flip)} ${f(o.s)})">
        <path d="M-10 -4 L-14 4 M10 -4 L6 4" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linecap="round"/>
        <path d="M-8 -12 L-20 30 L4 30 Z" fill="${col('parrotRed')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        ${wing(-1)}
        <ellipse cx="0" cy="-54" rx="30" ry="46" fill="${body}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M-6 -84 L6 -84 L10 -40 L0 -26 L-10 -40 Z" fill="${tie}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/><path d="M-8 -86 L8 -86 L4 -78 L-4 -78 Z" fill="${tie}" stroke="${ink}" stroke-width="${lw('thin')}"/>
        <path d="M-12 -92 L0 -84 L12 -92" fill="none" stroke="${col('paper')}" stroke-width="${lw('base')}"/>
        ${wing(1)}
        <circle cx="4" cy="-112" r="26" fill="${body}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <circle cx="12" cy="-118" r="8" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('thin')}"/><circle cx="14" cy="-118" r="3.6" fill="${ink}"/>
        <path d="M24 -118 Q44 -118 40 ${f(-98 - open * 3)} Q32 -104 24 -106 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <path d="M24 -102 Q32 ${f(-98 + open * 9)} 36 ${f(-96 + open * 10)}" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <path d="M-6 -136 Q4 -150 10 -136 Q16 -150 22 -134" fill="none" stroke="${body}" stroke-width="${lw('limb')}" stroke-linecap="round"/></g>`;
    },
    // Full-screen quote card. o: lines (array), k (pop)
    quoteCard(o) {
      const ink = col('ink'), k = o.k ?? 1, size = 66;
      const body = o.lines.map((l, i) => txt(640, 300 + i * 84 - (o.lines.length - 1) * 42, l, fitSize(l, size, TK.font.display, 900), ink, { font: TK.font.display })).join('');
      return `<g transform="translate(640 330) scale(${f(lerp(0.85, 1, easeOut(k)))}) translate(-640 -330)" opacity="${f(clamp(k * 2))}">
        <rect x="120" y="110" width="1040" height="420" rx="16" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="140" y="130" width="1000" height="380" rx="10" fill="none" stroke="${col('chyronRope')}" stroke-width="${lw('bold')}" stroke-dasharray="9 5"/>
        ${txt(200, 250, '“', 180, col('rust'), { font: TK.font.display })}${txt(1080, 520, '”', 180, col('rust'), { font: TK.font.display })}
        ${body}</g>`;
    },
    // Brass-framed terminal; shows the first `chars` characters of `lines`. o: x,y,s,lines,chars,t
    terminal(o) {
      const ink = col('ink'), n = Math.max(0, Math.floor(o.chars));
      let used = 0, rows = '', lastX = 0, lastY = 0;
      o.lines.forEach((ln, i) => {
        const part = ln.slice(0, Math.max(0, n - used)); used += ln.length;
        if (part.length || i === 0) { rows += txt(-370, -90 + i * 56, esc(part), 40, col('amber'), { anchor: 'start' }); lastX = -370 + textWidth(part, 40, TK.font.hand); lastY = -90 + i * 56; }
      });
      const cur = (o.t % 0.8) < 0.45 ? `<rect x="${f(lastX + 6)}" y="${lastY - 32}" width="18" height="38" fill="${col('amber')}"/>` : '';
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="-430" y="-190" width="860" height="380" rx="26" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="-400" y="-160" width="800" height="320" rx="14" fill="${col('screen')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>${rows}${cur}
        ${[-360, 360].map(x => `<circle cx="${x}" cy="172" r="6" fill="${col('brassDark')}"/>`).join('')}</g>`;
    },
    // Rubber stamp slammed onto something. k 0..1 (slam), rot degrees.
    bigStamp(x, y, k, text, rot = -12, size = 90) {
      if (k <= 0) return '';
      const c = col('live'), w = textWidth(text, size, TK.font.display) + 60, sc = lerp(2.2, 1, easeOut(clamp(k))), a = clamp(k * 3);
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(sc)})" opacity="${f(a)}">
        <rect x="${f(-w / 2)}" y="${-size * 0.75}" width="${f(w)}" height="${size * 1.25}" rx="10" fill="none" stroke="${c}" stroke-width="${lw('limb') + 2}"/>
        ${txt(0, size * 0.3, text, size, c, { font: TK.font.display })}</g>`;
    },
    // Small dark tag in a corner. o: x,y (top left),lines
    tagLabel(o) {
      const ink = col('ink'), w = Math.max(...o.lines.map((l, i) => textWidth(l, i ? 20 : 26, i ? TK.font.hand : TK.font.display))) + 30;
      return `<g transform="translate(${f(o.x)} ${f(o.y)})"><rect width="${f(w)}" height="${18 + o.lines.length * 26}" rx="6" fill="${col('navyDeep')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${o.lines.map((l, i) => txt(15, 34 + i * 26, l, i ? 20 : 26, col('cream'), { anchor: 'start', font: i ? TK.font.hand : TK.font.display })).join('')}</g>`;
    },
    // Marquee sign with chasing bulbs. o: x,y,s,text,t
    marquee(o) {
      const ink = col('ink'), size = 64, w = textWidth(o.text, size, TK.font.display) + 120, h = 130;
      let bulbs = '';
      const n = Math.floor((w + h) * 2 / 46), step = Math.floor(o.t * 8);
      for (let i = 0; i < n; i++) {
        let d = i * 46, x, y; const P = w * 2 + h * 2;
        d = d % P;
        if (d < w) { x = -w / 2 + d; y = -h / 2; } else if (d < w + h) { x = w / 2; y = -h / 2 + d - w; } else if (d < 2 * w + h) { x = w / 2 - (d - w - h); y = h / 2; } else { x = -w / 2; y = h / 2 - (d - 2 * w - h); }
        const on = (i + step) % 3 !== 0;
        bulbs += `<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="${on ? col('windowLit') : col('brassDark')}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      }
      const flash = (o.t % 0.6) < 0.4;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="${f(-w / 2 + 8)}" y="${-h / 2 + 8}" width="${f(w)}" height="${h}" rx="12" fill="${col('shadow')}" opacity="0.35"/>
        <rect x="${f(-w / 2)}" y="${-h / 2}" width="${f(w)}" height="${h}" rx="12" fill="${flash ? col('live') : col('rust')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${txt(0, 22, o.text, size, col('liveText'), { font: TK.font.display, stroke: ink, sw: lw('base') })}${bulbs}
        <line x1="${f(-w / 4)}" y1="${-h / 2}" x2="${f(-w / 4)}" y2="-400" stroke="${ink}" stroke-width="${lw('heavy')}"/><line x1="${f(w / 4)}" y1="${-h / 2}" x2="${f(w / 4)}" y2="-400" stroke="${ink}" stroke-width="${lw('heavy')}"/></g>`;
    },

    // ---- verse 4: the arcade ----
    // A hulking chrome war-bot of our own design (not any film's). o: x,y (feet),s,t
    warBot(o) {
      const ink = col('ink'), t = o.t, scan = Math.sin(t * 3) * 18;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <rect x="-120" y="-60" width="240" height="60" rx="30" fill="${col('iron')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${[-80, -27, 27, 80].map(x => `<circle cx="${x}" cy="-30" r="20" fill="${col('ironHi')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>`).join('')}
        <path d="M-90 -60 L-110 -250 L110 -250 L90 -60 Z" fill="${col('metal')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <path d="M-60 -230 L-40 -80" stroke="${col('paper')}" stroke-width="10" opacity="0.6" stroke-linecap="round"/>
        <rect x="-50" y="-200" width="100" height="70" rx="8" fill="${col('metalDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <circle cx="0" cy="-165" r="18" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${[-1, 1].map(m => `<circle cx="${m * 130}" cy="-232" r="40" fill="${col('metalDark')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
          <path d="M${m * 140} -210 L${m * 170} -120 L${m * 150} -60" fill="none" stroke="${ink}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M${m * 140} -210 L${m * 170} -120 L${m * 150} -60" fill="none" stroke="${col('metal')}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M${m * 150} -60 l${m * -18} 30 M${m * 150} -60 l${m * 18} 30" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/>`).join('')}
        <rect x="-70" y="-340" width="140" height="96" rx="20" fill="${col('metal')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        <rect x="-56" y="-312" width="112" height="28" rx="12" fill="${col('screen')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <rect x="${f(-20 + scan)}" y="-306" width="40" height="16" rx="6" fill="${col('live')}"/>
        <line x1="0" y1="-340" x2="0" y2="-380" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="0" cy="-386" r="8" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/></g>`;
    },
    // Cute 8-bit arcade bot, drawn as pixels. o: x,y (feet),s,t,laugh (bool)
    pixelBot(o) {
      const grid = ['....AA....', '....AA....', '.BBBBBBBB.', '.BWWBBWWB.', '.BWKBBWKB.', '.BBBBBBBB.', '.BBMMMMBB.', '..BBBBBB..', 'BB.BBBB.BB', 'B..BBBB..B', '...B..B...', '..BB..BB..'];
      const laughOpen = o.laugh && (o.t % 0.3) < 0.15;
      const c = { A: col('amber'), B: col('pixel'), W: col('paper'), K: col('ink'), M: laughOpen ? col('mouth') : col('pixelDark') };
      let s = '';
      grid.forEach((row, y) => [...row].forEach((ch, x) => { if (c[ch]) s += `<rect x="${x * 10 - 50}" y="${y * 10 - 120}" width="10.5" height="10.5" fill="${c[ch]}"/>`; }));
      const bounce = o.laugh ? -Math.abs(Math.sin(o.t * 10)) * 8 : Math.round(Math.sin(o.t * 4)) * 4;
      return `<g transform="translate(${f(o.x)} ${f(o.y + bounce)}) scale(${f(o.s)})" shape-rendering="crispEdges">${s}</g>`;
    },
    // Burst of square pixels. p 0..1
    pixelBurst(x, y, p, s = 1) {
      if (p <= 0 || p >= 1) return '';
      const cs = ['metal', 'pixel', 'metalDark', 'pixelDark', 'live', 'amber'];
      let out = '';
      for (let i = 0; i < 40; i++) { const a = rnd(i) * Math.PI * 2, r = (40 + rnd(i + 3) * 260) * easeOut(p) * s, sz = (8 + rnd(i + 7) * 14) * s * (1 - p * 0.6);
        out += `<rect x="${f(x + Math.cos(a) * r - sz / 2)}" y="${f(y + Math.sin(a) * r - sz / 2 - 150 * s)}" width="${f(sz)}" height="${f(sz)}" fill="${col(cs[i % cs.length])}" opacity="${f(1 - easeIn(p))}"/>`; }
      return out;
    },
    // Arcade cabinet, screen facing us. o: x,y (floor),s,t,title,level,sub,score,press (0..1 buttons)
    arcadeCabinet(o) {
      const ink = col('ink'), t = o.t, blink = (t % 0.6) < 0.4, pr = o.press || 0;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <path d="M-200 0 L-200 -520 L-170 -560 L170 -560 L200 -520 L200 0 Z" fill="${col('navy')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <path d="M-200 -300 L-150 -300 M150 -300 L200 -300" stroke="${col('live')}" stroke-width="${lw('limb')}"/>
        <rect x="-160" y="-550" width="320" height="70" rx="6" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${txt(0, -500, o.title || '', fitSize(o.title || '', 46, TK.font.display, 290), col('liveText'), { font: TK.font.display })}
        <rect x="-170" y="-470" width="340" height="250" rx="10" fill="${col('ink')}"/>
        <rect x="-155" y="-455" width="310" height="220" rx="6" fill="${col('screen')}" stroke="${col('pixelDark')}" stroke-width="${lw('base')}"/>
        ${txt(0, -390, o.level || '', fitSize(o.level || '', 40, TK.font.display, 280), col('amber'), { font: TK.font.display })}
        ${blink ? txt(0, -340, o.sub || '', 26, col('pixel'), {}) : ''}
        ${txt(0, -268, o.score || '', 26, col('paper'), {})}
        <path d="M-210 -220 L210 -220 L240 -150 L-240 -150 Z" fill="${col('navyDeep')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <line x1="-120" y1="-185" x2="${f(-120 + Math.sin(t * 30) * 14 * pr)}" y2="-240" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/><circle cx="${f(-120 + Math.sin(t * 30) * 14 * pr)}" cy="-244" r="14" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        ${[30, 90, 150].map((x, i) => { const down = pr * (Math.sin(t * 40 + i * 2) > 0 ? 1 : 0); return `<ellipse cx="${x}" cy="${f(-186 + down * 4)}" rx="22" ry="${f(12 - down * 4)}" fill="${[col('live'), col('brass'), col('pixel')][i]}" stroke="${ink}" stroke-width="${lw('base')}"/>`; }).join('')}
        <rect x="-60" y="-110" width="120" height="44" rx="6" fill="${col('ink')}"/><rect x="-14" y="-100" width="28" height="24" fill="${col('amber')}"/></g>`;
    },
    // A round lagoon with a sand rim. o: x,y,rx,ry,t
    lagoon(o) {
      const ink = col('ink');
      let s = `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx + 30}" ry="${o.ry + 24}" fill="${col('parchDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="${col('sea')}" stroke="${ink}" stroke-width="${lw('base')}"/>`;
      for (let i = 0; i < 5; i++) { const r = 0.3 + i * 0.15; s += `<ellipse cx="${o.x}" cy="${o.y}" rx="${f(o.rx * r)}" ry="${f(o.ry * r)}" fill="none" stroke="${col('seaLine')}" stroke-width="${lw('fine')}" stroke-dasharray="20 18" stroke-dashoffset="${f(o.t * 30 * (i % 2 ? 1 : -1))}"/>`; }
      return s;
    },
    // A generic little toy boat (not any game's art). o: x,y,s,rot
    toyBoat(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.rot || 0)}) scale(${f(o.s)})"><path d="M-40 -10 L40 -10 L28 12 L-30 12 Z" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
        <line x1="0" y1="-10" x2="0" y2="-62" stroke="${ink}" stroke-width="${lw('heavy')}"/><path d="M2 -60 L34 -18 L2 -18 Z" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/></g>`;
    },
    coin(x, y, p, s = 1) {
      const sx = Math.abs(Math.cos(p * 6)) * 0.8 + 0.2;
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(sx * s)} ${f(s)})"><circle r="16" fill="${col('brass')}" stroke="${col('ink')}" stroke-width="${lw('base')}"/><circle r="9" fill="none" stroke="${col('brassDark')}" stroke-width="${lw('thin')}"/></g>`;
    },
    // Confetti shower from x,y. p is seconds since it fired.
    confetti(x, y, p) {
      if (p <= 0 || p > 3) return '';
      const cs = ['live', 'brass', 'pixel', 'cream', 'parrot', 'rust'];
      let out = '';
      for (let i = 0; i < 90; i++) {
        const a = -Math.PI / 2 + (rnd(i) - 0.5) * 2.2, v = 500 + rnd(i + 2) * 700, vx = Math.cos(a) * v, vy = Math.sin(a) * v;
        const px = x + vx * p * 0.6 + Math.sin(p * 6 + i) * 20, py = y + vy * p * 0.6 + 420 * p * p;
        out += `<rect x="${f(px)}" y="${f(py)}" width="12" height="7" fill="${col(cs[i % cs.length])}" transform="rotate(${f(p * 400 + i * 37)} ${f(px + 6)} ${f(py + 3)})" opacity="${f(clamp(3 - p))}"/>`;
      }
      return out;
    },

    // ---- verse 5: the verdict ----
    // A dog with a weedwhacker strapped to its back, the spinning head out in front. o: x,y (feet),s,t,run
    dog(o) {
      const ink = col('ink'), t = o.t, r = o.run ?? t * 3, leg = a => Math.sin(r * Math.PI * 2 + a) * 22, bob = -Math.abs(Math.sin(r * Math.PI * 2)) * 6;
      const L = (x, a) => `<line x1="${x}" y1="-40" x2="${f(x + leg(a))}" y2="0" stroke="${ink}" stroke-width="14" stroke-linecap="round"/><line x1="${x}" y1="-40" x2="${f(x + leg(a))}" y2="0" stroke="${col('dog')}" stroke-width="8" stroke-linecap="round"/>`;
      const spin = t * 2000;
      return `<g transform="translate(${f(o.x)} ${f(o.y + bob)}) scale(${f(o.s)})">
        ${L(-50, 0)}${L(40, Math.PI)}
        <path d="M-80 -60 Q-110 -90 -100 -110" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/>
        <ellipse cx="-10" cy="-62" rx="80" ry="34" fill="${col('dog')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        ${L(-30, Math.PI)}${L(60, 0)}
        <circle cx="86" cy="-92" r="34" fill="${col('dog')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M70 -122 L58 -150 L86 -126 Z" fill="${col('dogDark')}" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
        <ellipse cx="120" cy="-84" rx="20" ry="14" fill="${col('dog')}" stroke="${ink}" stroke-width="${lw('base')}"/><circle cx="136" cy="-88" r="6" fill="${ink}"/>
        <circle cx="96" cy="-100" r="5" fill="${ink}"/><path d="M110 -72 Q120 -60 132 -70" fill="${col('mouth')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
        <rect x="-60" y="-104" width="80" height="22" rx="6" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('base')}"/><line x1="-20" y1="-82" x2="-20" y2="-30" stroke="${col('rust')}" stroke-width="${lw('heavy')}"/>
        <rect x="-74" y="-128" width="40" height="30" rx="6" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <line x1="-40" y1="-110" x2="210" y2="-6" stroke="${ink}" stroke-width="14" stroke-linecap="round"/><line x1="-40" y1="-110" x2="210" y2="-6" stroke="${col('metal')}" stroke-width="7" stroke-linecap="round"/>
        <g transform="translate(214 -4)"><ellipse rx="34" ry="8" fill="none" stroke="${col('ink')}" stroke-width="${lw('fine')}" stroke-dasharray="6 6" stroke-dashoffset="${f(spin % 12)}"/>
          <circle r="12" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/></g></g>`;
    },
    // Shredded rope bits flying from x,y. p seconds since the cut.
    ropeBits(x, y, p) {
      if (p <= 0 || p > 1.5) return '';
      let out = '';
      for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (rnd(i + 30) - 0.5) * 2.4, v = 220 + rnd(i) * 300, px = x + Math.cos(a) * v * p, py = y + Math.sin(a) * v * p + 600 * p * p;
        out += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px + 18)}" y2="${f(py + 4)}" stroke="${col('rope')}" stroke-width="${lw('heavy')}" stroke-linecap="round" transform="rotate(${f(p * 500 + i * 40)} ${f(px + 9)} ${f(py + 2)})" opacity="${f(clamp(1.5 - p))}"/>`; }
      return out;
    },
    // The ship's blueprint. o: x,y (center),s,title,shipLabel
    blueprint(o) {
      const L = col('blueprintLine'), ink = col('ink');
      let grid = '';
      for (let x = -460; x <= 460; x += 40) grid += `<line x1="${x}" y1="-260" x2="${x}" y2="260" stroke="${L}" stroke-width="1" opacity="0.25"/>`;
      for (let y = -260; y <= 260; y += 40) grid += `<line x1="-460" y1="${y}" x2="460" y2="${y}" stroke="${L}" stroke-width="1" opacity="0.25"/>`;
      const line = d => `<path d="${d}" fill="none" stroke="${L}" stroke-width="${lw('base')}" stroke-linejoin="round"/>`;
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="-470" y="-270" width="940" height="540" fill="${col('blueprint')}" stroke="${ink}" stroke-width="${lw('bold')}"/>${grid}
        ${txt(-440, -224, o.title || '', 32, L, { anchor: 'start', font: TK.font.display })}
        <g transform="translate(0 120) scale(0.75)">${line('M-300 -150 L-205 -150 L-195 -112 L215 -112 Q262 -116 300 -150 L312 -146 Q300 -70 250 -6 Q238 10 215 14 L-245 14 Q-280 -40 -300 -150 Z')}
        ${line('M-70 -112 L-70 -560 M150 -112 L150 -470')}${line('M-175 -440 L35 -440 L30 -235 L-170 -235 Z')}${line('M55 -392 L245 -392 L240 -215 L60 -215 Z')}${line('M156 -455 L392 -205 L176 -205 Z')}
        ${line('M-300 40 L312 40 M-300 30 L-300 50 M312 30 L312 50')}${txt(6, 30, o.shipLabel || '', 46, L, { font: TK.font.hand })}</g>
        ${line('M300 -230 L440 -230 L440 -150 L300 -150 Z')}${txt(370, -184, 'REV. 1', 26, L, {})}</g>`;
    },

    // ---- final chorus ----
    sunburst(x, y, t, k) {
      if (k <= 0) return '';
      let rays = '';
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + t * 0.3; rays += `<path d="M${f(x + Math.cos(a - 0.08) * 90)} ${f(y + Math.sin(a - 0.08) * 90)} L${f(x + Math.cos(a) * (240 + 30 * Math.sin(t * 3 + i)) * k)} ${f(y + Math.sin(a) * (240 + 30 * Math.sin(t * 3 + i)) * k)} L${f(x + Math.cos(a + 0.08) * 90)} ${f(y + Math.sin(a + 0.08) * 90)} Z" fill="${col('sun')}" opacity="${f(0.55 * k)}"/>`; }
      return rays + `<circle cx="${x}" cy="${y}" r="${f(80 * k)}" fill="${col('sun')}" stroke="${col('brassDark')}" stroke-width="${lw('heavy')}"/>`;
    },

    // ---- outro ----
    // Treasure chest. o: x,y (floor),s,label,open (0 shut .. 1 open)
    chest(o) {
      const ink = col('ink'), a = lerp(0, -110, clamp(o.open ?? 0));
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})">
        <rect x="-150" y="-150" width="300" height="150" rx="10" fill="${col('wood')}" stroke="${ink}" stroke-width="${lw('bold')}"/>
        ${[-100, 100].map(x => `<rect x="${x - 10}" y="-150" width="20" height="150" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}"/>`).join('')}
        <rect x="-70" y="-110" width="140" height="44" rx="5" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>${txt(0, -78, o.label || '', fitSize(o.label || '', 34, TK.font.display, 120), ink, { font: TK.font.display })}
        <g transform="rotate(${f(a)} -150 -150)"><path d="M-156 -150 L-156 -200 Q0 -260 156 -200 L156 -150 Z" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <rect x="-16" y="-170" width="32" height="34" rx="4" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}"/></g></g>`;
    },
    nameTag(x, y, text) {
      const ink = col('ink'), w = textWidth(text, 28, TK.font.display) + 30;
      return `<line x1="${x}" y1="${y + 16}" x2="${x}" y2="${y + 40}" stroke="${ink}" stroke-width="${lw('base')}"/><rect x="${f(x - w / 2)}" y="${y - 20}" width="${f(w)}" height="38" rx="5" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>${txt(x, y + 9, text, 28, ink, { font: TK.font.display })}`;
    },
    // Asphalt lot with painted stall lines (full frame below y0).
    parkingLot(y0) {
      let s = `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${col('asphalt')}"/>`;
      for (let x = -200; x < W + 200; x += 300) s += `<line x1="${x}" y1="${H}" x2="${x + 120}" y2="${y0}" stroke="${col('cream')}" stroke-width="10"/>`;
      return s;
    },
    parkingMeter(o) {
      const ink = col('ink');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s)})"><rect x="-8" y="-170" width="16" height="170" fill="${col('metalDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
        <path d="M-40 -170 L-40 -250 Q0 -290 40 -250 L40 -170 Z" fill="${col('metal')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
        <rect x="-26" y="-250" width="52" height="40" rx="6" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('base')}"/>
        <rect x="-22" y="-246" width="20" height="32" fill="${col('live')}"/>${txt(10, -222, '0:00', 16, ink, {})}</g>`;
    },
    // Closing card: logo, sign-off line, and the sources. o: k (fade in),sources [[name, where]]
    endCard(o) {
      const ink = col('ink'), k = clamp(o.k ?? 1);
      const half = Math.ceil(o.sources.length / 2);
      const rows = o.sources.map(([who, where], i) => { const c = i < half ? 0 : 1, r = i % half, x = c ? 660 : 110, y = 360 + r * 52;
        return txt(x, y, who, 26, ink, { anchor: 'start', font: TK.font.display }) + txt(x, y + 22, where, 19, col('chyronSub'), { anchor: 'start' }); }).join('');
      return `<g opacity="${f(k)}">${R.logoCard()}${R.networkLogo({ x: 640, y: 150, s: 0.42, spin: 0, banner: 0 })}
        ${txt(640, 270, copy('signOff'), fitSize(copy('signOff'), 34, TK.font.hand, 1000), ink, {})}
        <line x1="110" y1="296" x2="1170" y2="296" stroke="${col('chyronRope')}" stroke-width="${lw('base')}"/>
        ${txt(110, 326, copy('sources'), 26, col('rust'), { anchor: 'start', font: TK.font.display })}${rows}</g>`;
    },

    // ---- network chrome ----
    liveTag(t, mode = 'live') {
      const ink = col('ink');
      if (mode === 'replay') {
        const rw = Math.max(128, textWidth(TK.copy.replay, 26, TK.font.hand) + 48);
        return `<g transform="translate(26 24)"><rect width="${f(rw)}" height="36" rx="6" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <path d="M18 18 m-8 0 a8 8 0 1 0 3 -6.2" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/><path d="M10 6 l3 6 l-6.5 1" fill="none" stroke="${ink}" stroke-width="${lw('base')}" stroke-linejoin="round"/>
      ${txt(f(rw - 52), 27, TK.copy.replay, 26, ink)}</g>`;
      }
      const on = (t % 1.0) < 0.6, lwid = Math.max(104, textWidth(TK.copy.live, 27, TK.font.hand) + 56);
      return `<g transform="translate(26 24)"><rect width="${f(lwid)}" height="36" rx="6" fill="${col('live')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    <circle cx="20" cy="18" r="7" fill="${col('liveText')}" opacity="${on ? 1 : 0.25}"/>${txt(f(lwid - 40), 27, TK.copy.live, 27, col('liveText'))}</g>`;
    },
    bug(t) {
      const ink = col('ink'), spin = Math.sin(t * 0.8) * 8;
      let spokes = '';
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; spokes += `<line x1="0" y1="0" x2="${f(Math.cos(a) * 34)}" y2="${f(Math.sin(a) * 34)}" stroke="${ink}" stroke-width="${lw('heavy')}"/><circle cx="${f(Math.cos(a) * 37)}" cy="${f(Math.sin(a) * 37)}" r="4.5" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('fine')}"/>`; }
      return `<g transform="translate(1196 66)" opacity="0.94"><g transform="rotate(${f(spin)})">${spokes}</g>
    <circle r="24" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('mid')}"/>${txt(0, 8, TK.copy.network, 22, col('live'), { font: TK.font.display })}</g>`;
    },
    ticker(t, items, start) {
      const sep = '   •   ', str = items.join(sep) + sep, size = TK.ticker.size;
      const wd = textWidth(str, size, TK.font.hand);
      const x = 1290 - ((Math.max(0, t - start) * TK.ticker.speed) % wd);
      const s = esc(str);
      return `<g><rect x="0" y="676" width="${W}" height="44" fill="${col('navyDeep')}"/><rect x="0" y="674" width="${W}" height="3" fill="${col('brass')}"/>
    ${txt(x, 706, s, size, col('cream'), { anchor: 'start' })}${txt(x + wd, 706, s, size, col('cream'), { anchor: 'start' })}
    <rect x="0" y="677" width="118" height="43" fill="${col('live')}"/>${txt(59, 708, TK.copy.network, 30, col('liveText'), { font: TK.font.display })}
    <path d="M118 677 l14 21.5 l-14 21.5 z" fill="${col('live')}"/></g>`;
    },
    // lt = seconds since the shot started
    chyron(lt, name, sub) {
      const ink = col('ink'), k = easeOut(prog(lt, 0, 0.35)), nameSize = 38;
      const wName = textWidth(name, nameSize, TK.font.display), wSub = sub ? textWidth(sub, 22, TK.font.hand) : 0;
      const wd = Math.max(wName, wSub) + 64, h = sub ? 78 : 60;
      const x = lerp(-wd - 20, 36, k), y = 666 - h - 14;
      const rope = `<rect x="4" y="4" width="${f(wd - 8)}" height="${h - 8}" rx="6" fill="none" stroke="${col('chyronRope')}" stroke-width="${lw('bold')}" stroke-dasharray="7 4"/><rect x="4" y="4" width="${f(wd - 8)}" height="${h - 8}" rx="6" fill="none" stroke="${col('chyronRopeHi')}" stroke-width="${lw('hair')}" stroke-dasharray="7 4" stroke-dashoffset="3.5"/>`;
      return `<g transform="translate(${f(x)} ${f(y)})">
    <rect x="6" y="6" width="${f(wd)}" height="${h}" rx="8" fill="${col('shadow')}" opacity="0.35"/>
    <rect width="${f(wd)}" height="${h}" rx="8" fill="${col('parch')}" stroke="${ink}" stroke-width="${lw('base')}"/>${rope}
    <rect x="0" y="0" width="12" height="${h}" rx="4" fill="${col('rust')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    ${txt(36, 44, name, nameSize, ink, { anchor: 'start', font: TK.font.display })}
    ${sub ? txt(36, 68, sub, 22, col('chyronSub'), { anchor: 'start' }) : ''}</g>`;
    },
    // Burned-in lyrics. e = one timeline entry {a,b,lines}; segments may have style 'shout' and reveal time 'at'.
    lyrics(t, e) {
      const L = TK.lyrics, fade = clamp((t - e.a) / 0.12) * clamp((e.b - t) / 0.12);
      let out = '';
      e.lines.forEach((segs, li) => {
        if (segs.at && t < segs.at) return;
        const parts = segs.map(sg => {
          if (sg.at && t < sg.at) return segs.reserve ? `<tspan fill-opacity="0" stroke-opacity="0" font-family="${sg.style === 'shout' ? TK.font.display : TK.font.hand}" font-size="${sg.style === 'shout' ? L.shoutSize : L.size}">${sg.s}</tspan>` : '';
          const shout = sg.style === 'shout';
          const pop = shout ? backOut(clamp((t - (sg.at || e.a)) / 0.25)) : 1;
          const size = shout ? L.shoutSize : L.size;
          return `<tspan ${shout ? `stroke-width="${L.shoutStroke}"` : ''} font-family="${shout ? TK.font.display : TK.font.hand}" font-size="${f(size * (0.6 + 0.4 * pop))}" fill="${shout ? col('lyricShout') : col('lyric')}">${sg.s}</tspan>`;
        }).join('');
        out += `<text x="640" y="${L.y + li * L.lineGap}" text-anchor="middle" stroke="${col('lyricOutline')}" stroke-width="${L.stroke}" paint-order="stroke" stroke-linejoin="round">${parts}</text>`;
      });
      return `<g opacity="${f(fade)}">${out}</g>`;
    },
  },
});
