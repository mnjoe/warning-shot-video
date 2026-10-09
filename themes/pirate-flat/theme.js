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
      glove: '#C99A68', gloveCuff: '#B07E4E', gloveSeam: '#8C6640',
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
    copy: { network: 'PNN', masthead: 'The High Seas Herald', earlier: 'Earlier...', live: 'LIVE', replay: 'REPLAY' },
  },
  rigs: {
    // ---- shared <defs>, rebuilt from tokens ----
    defs() {
      return `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col('sky1')}"/><stop offset="1" stop-color="${col('sky2')}"/></linearGradient>
<radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="${col('vignette')}" stop-opacity="0"/><stop offset="1" stop-color="${col('vignette')}" stop-opacity="0.65"/></radialGradient>
<filter id="flashback" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${TK.flashback}"/></filter>`;
    },

    // ---- characters ----
    // o: x,y,s,t,variant,phase,sway(deg),tankard,sing,walk(phase|null),whistle,flip,shrug(0..1),look(px),frown
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
      const leg = (dx, a) => `<g transform="rotate(${f(a)} ${dx} -22)"><rect x="${dx - 4.5}" y="-24" width="9" height="22" rx="3" fill="${col('leg')}" stroke="${ink}" stroke-width="${lw('thin')}"/><ellipse cx="${dx + 3}" cy="-2" rx="8" ry="4.5" fill="${ink}"/></g>`;
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
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) scale(${f(o.s * fl)} ${f(o.s)})"><g transform="rotate(${f(rot)}) translate(0 ${f(bob)})">${body}</g></g>`;
    },

    // The humans. Gripping pose by default (curl 1), flat at 0. o.label goes on the cuff.
    hand(o) {
      const curl = o.curl ?? 1, ink = col('ink'), skin = col('glove');
      const fingers = [-24, -8, 8, 24].map(dy => {
        const len = 54 - Math.abs(dy) * 0.4, bend = curl * 34;
        const d = `M-10 ${dy} q${f(-len * .6)} ${f(-2)} ${f(-len)} ${f(bend * .25)} q-6 ${f(bend * .4)} ${f(4 + bend * .2)} ${f(bend * .55)}`;
        return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="20" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>`;
      }).join('');
      return `<g transform="translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.rot || 0)}) scale(${o.s || 1})">
    <rect x="40" y="-40" width="260" height="80" fill="${col('navy')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    <rect x="20" y="-46" width="42" height="92" rx="8" fill="${col('gloveCuff')}" stroke="${ink}" stroke-width="${lw('heavy')}"/>
    ${txt(150, 14, o.label || '', 40, col('cream'), { font: TK.font.display })}
    <path d="M24 -36 Q-20 -44 -30 -20 L-30 26 Q-20 44 24 38 Z" fill="${skin}" stroke="${ink}" stroke-width="${lw('heavy')}" stroke-linejoin="round"/>
    ${fingers}
    <path d="M6 30 q-20 22 -46 16" fill="none" stroke="${ink}" stroke-width="20" stroke-linecap="round"/>
    <path d="M6 30 q-20 22 -46 16" fill="none" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
    <path d="M-2 -10 q8 4 4 14 M-2 6 q8 4 4 14" fill="none" stroke="${col('gloveSeam')}" stroke-width="${lw('thin')}" stroke-linecap="round"/>
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
          if (sg.at && t < sg.at) return '';
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
