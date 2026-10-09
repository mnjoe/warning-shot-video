// Theme: lab-glove — demo of a rig override. Identical to pirate-flat except the humans' hand:
// a blue nitrile lab glove with jointed fingers, coming out of a white lab-coat sleeve with an ID badge.
// Same inputs as pirate-flat's hand(o): x, y, s, rot, curl (0 flat .. 1 gripping), label.
registerTheme('lab-glove', {
  extends: 'pirate-flat',
  tokens: {
    color: {
      labCoat: '#F7F7F4', labCoatShade: '#D5D9DE', labButton: '#E9E4D6',
      nitrile: '#5B8FD9', nitrileDark: '#3E6DB5', nitrileHi: '#A9C8F2',
      badge: '#FFFFFF', badgeStrip: '#E0201B', badgeClip: '#8E959E',
    },
  },
  rigs: {
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
    <path d="M44 -44 L300 -48 L300 48 L44 44 Z" fill="${col('labCoat')}" stroke="${ink}" stroke-width="${base}" stroke-linejoin="round"/>
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
  },
});
