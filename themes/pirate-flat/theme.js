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
    copy: { network: 'PNN', networkFull: 'PIRATE NEWS NETWORK', liveFrom: 'LIVE FROM THE HIGH SEAS', masthead: 'The High Seas Herald', earlier: 'Earlier...', live: 'LIVE', replay: 'REPLAY' },
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
    //    stomp (0..1 leg lift), stompSide (1 right leg, -1 left), squash (0..1, impact)
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
      const armL = `<path d="M-20 ${-56 - sh * 6} Q${-36 - sh * 6} ${-46 - sh * 14} ${-31 - sh * 8} ${-31 - sh * 26}" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/><circle cx="${-31 - sh * 8}" cy="${-31 - sh * 26}" r="5" fill="${v.head}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      let armR;
      if (o.tankard) {
        const lift = Math.sin(b * Math.PI * 2) * 4;
        armR = `<path d="M20 -56 Q38 -68 35 ${f(-82 + lift)}" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/>
      <g transform="translate(36 ${f(-92 + lift)})"><path d="M8 -6 q9 0 9 8 q0 8 -9 8" fill="none" stroke="${ink}" stroke-width="${lw('base')}"/>
      <rect x="-9" y="-10" width="18" height="22" rx="3" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <line x1="-9" y1="-3" x2="9" y2="-3" stroke="${col('brassDark')}" stroke-width="${lw('fine')}"/>
      <path d="M-11 -9 q2 -8 8 -6 q4 -6 9 -1 q6 -2 6 6 z" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('fine')}"/></g>`;
      } else {
        armR = `<path d="M20 ${-56 - sh * 6} Q${36 + sh * 6} ${-46 - sh * 14} ${31 + sh * 8} ${-31 - sh * 26}" fill="none" stroke="${ink}" stroke-width="${lw('limb')}" stroke-linecap="round"/><circle cx="${31 + sh * 8}" cy="${-31 - sh * 26}" r="5" fill="${v.head}" stroke="${ink}" stroke-width="${lw('thin')}"/>`;
      }
      const S = TK.shape, hc = S.headCorner;
      const antenna = S.antenna ? `<line x1="8" y1="-115" x2="12" y2="-128" stroke="${ink}" stroke-width="${lw('base')}"/><circle cx="12" cy="-130" r="4.5" fill="${col('brass')}" stroke="${ink}" stroke-width="${lw('fine')}"/>` : '';
      const bandana = S.bandana ? `<path d="M-26.5 -97 L-26.5 -103 Q-26.5 -117 -12 -117 L12 -117 Q26.5 -117 26.5 -103 L26.5 -97 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <circle cx="-8" cy="-106" r="2.2" fill="${col('cream')}"/><circle cx="8" cy="-109" r="2.2" fill="${col('cream')}"/><circle cx="16" cy="-102" r="2" fill="${col('cream')}"/>
      <path d="M-26 -101 l-14 -7 l3 11 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/>
      <path d="M-26 -99 l-11 9 l9 2 Z" fill="${v.band}" stroke="${ink}" stroke-width="${lw('thin')}" stroke-linejoin="round"/>` : '';
      const patch = S.eyePatch ? `<path d="M-26 -80 L-10 -87 L3 -97" fill="none" stroke="${ink}" stroke-width="${lw('thin')}"/>
      <ellipse cx="-10" cy="-87" rx="8.5" ry="8" fill="${ink}"/>` : `<circle cx="-10" cy="-88" r="7.5" fill="${col('paper')}" stroke="${ink}" stroke-width="${lw('thin')}"/><circle cx="${f(-9 + look)}" cy="-87.5" r="3.4" fill="${ink}"/>`;
      const body = `
    ${leg(-7, legA)}${leg(7, legB)}
    <rect x="-22" y="-66" width="44" height="44" rx="${S.bodyCorner}" fill="${col('cream')}" stroke="${ink}" stroke-width="${lw('base')}"/>
    <rect x="-19" y="-58" width="38" height="5" fill="${v.stripe}"/><rect x="-19" y="-47" width="38" height="5" fill="${v.stripe}"/><rect x="-19" y="-36" width="38" height="5" fill="${v.stripe}"/>
    ${armL}${armR}
    <rect x="-6" y="-73" width="12" height="8" fill="${col('metalDark')}" stroke="${ink}" stroke-width="${lw('fine')}"/>
    <g transform="translate(0 ${f(-sh * 4)})">
      ${antenna}
      <rect x="-26" y="-114" width="52" height="44" rx="${hc}" fill="${v.head}" stroke="${ink}" stroke-width="${lw('base')}"/>
      <circle cx="-23" cy="-78" r="2" fill="${col('metalDark')}"/><circle cx="23" cy="-78" r="2" fill="${col('metalDark')}"/>
      ${bandana}${patch}
      ${eye}${mouth}
    </g>`;
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
    // o: x,y(waterline),s,hole(scale),door(0..1 open|undefined),label
    lifeboat(o) {
      const ink = col('ink'), hole = o.hole || 1;
      let door = '';
      if (o.door != null) {
        const open = o.door;
        door = `<rect x="-118" y="-74" width="44" height="66" rx="3" fill="${ink}"/>
      <path d="M-118 -74 L${f(-118 - 40 * open)} ${f(-80 - 6 * open)} L${f(-118 - 40 * open)} ${f(-2 + 6 * open)} L-118 -8 Z" fill="${col('woodLight')}" stroke="${ink}" stroke-width="${lw('mid')}" stroke-linejoin="round"/>
      <circle cx="${f(-118 - 32 * open)}" cy="-40" r="3.5" fill="${col('brass')}"/>`;
      }
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${o.s || 1})">
    <path d="M-170 -96 L170 -96 Q160 -10 120 0 L-130 0 Q-165 -20 -170 -96 Z" fill="${col('boatHull')}" stroke="${ink}" stroke-width="${lw('bold')}" stroke-linejoin="round"/>
    <path d="M-168 -80 L168 -80" stroke="${col('rust')}" stroke-width="10"/>
    <rect x="-176" y="-106" width="352" height="14" rx="5" fill="${col('woodDark')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    ${txt(10, -36, o.label || '', fitSize(o.label || '', 40, TK.font.display, 150), col('navy'), { font: TK.font.display })}
    <g transform="translate(118 -40) scale(${f(hole)})"><path d="M-22 -18 l10 -8 l8 6 l12 -6 l10 10 l-4 12 l8 10 l-12 10 l-10 -6 l-12 8 l-10 -10 l2 -12 z" fill="${ink}"/></g>
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
      return `<rect x="-40" y="${y0}" width="${W + 80}" height="${y1 - y0}" fill="${opts.fill || col('sea')}"/>` + R.waves(t, y0, y1, opts);
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
