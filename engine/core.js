// Warning Shot engine core: math, beat grid, theme registry, text helpers.
// Nothing in here decides how anything looks. Looks live in themes/<name>/theme.js.
const W = 1280, H = 720;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const backOut = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const f = n => (Math.round(n * 100) / 100);
function rnd(seed) { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

// Beat grid: piecewise anchors from SONG.beat (Suno drifts a little, so each region has its own fit).
// An anchor may carry its own period; otherwise SONG.beat.period is used. Integer values of beat(t) are on the beat.
function beat(t) {
  const g = SONG.beat, a = [...g.anchors].reverse().find(x => t >= x.from) || g.anchors[0];
  return (t - a.phase) / (a.period || g.period);
}
// Theme flavor text (network name and so on). Scenes may read it; story words live in SONG.labels.
const copy = k => TK.copy[k];

// ---------- Theme registry ----------
// A theme file calls registerTheme(name, def). def = { extends?, fonts, tokens, rigs }.
// Derived themes deep-merge tokens and override only the rigs they replace.
const THEMES = {};
let TK = null;   // resolved tokens of the active theme
let R = null;    // resolved rigs of the active theme
function registerTheme(name, def) {
  const src = document.currentScript ? document.currentScript.src : '';
  def.dir = src.slice(0, src.lastIndexOf('/') + 1);
  THEMES[name] = def;
}
function deepMerge(a, b) {
  if (Array.isArray(b) || typeof b !== 'object' || b === null) return b;
  const out = Object.assign({}, a);
  for (const k of Object.keys(b)) out[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k])) ? deepMerge(a[k], b[k]) : b[k];
  return out;
}
function loadScript(url) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = url; s.onload = res; s.onerror = () => rej(new Error('cannot load ' + url)); document.head.appendChild(s); });
}
async function loadTheme(name) {
  if (!THEMES[name]) await loadScript(`../themes/${name}/theme.js`);
  const def = THEMES[name];
  if (!def) throw new Error('theme did not register: ' + name);
  let base = { fonts: {}, tokens: {}, rigs: {} };
  if (def.extends) base = await loadTheme(def.extends);
  const fonts = Object.assign({}, base.fonts);
  for (const [role, fd] of Object.entries(def.fonts || {})) fonts[role] = Object.assign({ dir: def.dir }, fd);
  return { fonts, tokens: deepMerge(base.tokens, def.tokens || {}), rigs: Object.assign({}, base.rigs, def.rigs || {}) };
}
async function activateTheme(name) {
  const th = await loadTheme(name);
  for (const fd of Object.values(th.fonts)) {
    const face = new FontFace(fd.family, `url(${fd.dir}${fd.file})`);
    document.fonts.add(await face.load());
  }
  TK = th.tokens;
  TK.font = {};
  for (const [role, fd] of Object.entries(th.fonts)) TK.font[role] = `'${fd.family}', ${fd.fallback || 'sans-serif'}`;
  R = th.rigs;
  return th;
}

// ---------- Helpers every theme can use ----------
const col = k => TK.color[k];
const lw = k => f(TK.line[k] * (TK.line.scale || 1));
function txt(x, y, s, size, fill, opts = {}) {
  const anchor = opts.anchor || 'middle', font = opts.font || TK.font.hand;
  const stroke = opts.stroke ? `stroke="${opts.stroke}" stroke-width="${opts.sw || 6}" paint-order="stroke" stroke-linejoin="round"` : '';
  const ls = opts.ls ? `letter-spacing="${opts.ls}"` : '';
  return `<text x="${f(x)}" y="${f(y)}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${stroke} ${ls} ${opts.extra || ''}>${s}</text>`;
}
let _measure = null;
function textWidth(s, size, font) {
  if (!_measure) _measure = document.createElement('canvas').getContext('2d');
  _measure.font = `${size}px ${font}`;
  return _measure.measureText(s).width;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// Largest font size <= size that fits s into maxW. Themes use it so labels never overflow with wider fonts.
function fitSize(s, size, font, maxW) {
  const w0 = textWidth(s, size, font);
  return w0 <= maxW ? size : f(size * maxW / w0);
}
