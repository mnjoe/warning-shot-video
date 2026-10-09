// Theme: newsprint — demo of a derived theme. Same rigs as pirate-flat; only tokens and fonts change.
// Greyscale with a single red accent, typewriter lyrics, rounder heads, no eye patches, heavier lines.
registerTheme('newsprint', {
  extends: 'pirate-flat',
  fonts: {
    hand: { family: 'Special Elite', file: 'fonts/SpecialElite-Regular.ttf', fallback: "'Courier New', monospace" },
    display: { family: 'Abril Fatface', file: 'fonts/AbrilFatface-Regular.ttf', fallback: 'Georgia, serif' },
  },
  tokens: {
    color: {
      navy: '#2A2A2A', navyDeep: '#141414', sea: '#5E6266', seaLine: '#8A8F94',
      cream: '#F2F0EA', parch: '#E4E1D8', parchDark: '#B9B5AA', rust: '#3C3C3C',
      brass: '#C9C6BC', brassDark: '#8D8A82', live: '#D7141A', ink: '#111111',
      wood: '#7D7A74', woodDark: '#4A4844', woodLight: '#A9A59C', woodSeam: '#6A6762',
      sky1: '#F4F2EC', sky2: '#D9D6CC', metal: '#C9CCCF', metalDark: '#7F8388',
      iron: '#2B2B2B', ironHi: '#5A5A5A', ironShine: '#777777',
      paper: '#FFFFFF', mouth: '#D7141A', leg: '#333333', cloud: '#FFFFFF',
      glove: '#D9D4C7', gloveCuff: '#A8A39A', gloveSeam: '#7D786F',
      smoke: '#E6E6E6', smokeEdge: '#9A9A9A', smokeHi: '#F5F5F5', rope: '#6A6762', ripple: '#B5B9BD',
      boatHull: '#FFFFFF', newsPaper: '#FFFFFF', newsPhoto: '#D9D6CC', newsLine: '#A9A59C',
      chyronRope: '#111111', chyronRopeHi: '#888888', chyronSub: '#444444',
      shadow: '#000000', vignette: '#000000', fleck: '#000000', liveText: '#FFFFFF',
      lyric: '#FFFFFF', lyricShout: '#D7141A', lyricOutline: '#111111',
    },
    bots: [
      { band: '#D7141A', head: '#C9CCCF', stripe: '#111111' },
      { band: '#111111', head: '#E4E1D8', stripe: '#D7141A' },
      { band: '#6A6762', head: '#B9BCBF', stripe: '#111111' },
      { band: '#111111', head: '#C9CCCF', stripe: '#6A6762' },
      { band: '#D7141A', head: '#E4E1D8', stripe: '#111111' },
    ],
    line: { scale: 1.15 },
    shape: { headCorner: 22, eyePatch: false },
    lyrics: { size: 34, shoutSize: 42, y: 86 },
    ticker: { size: 22 },
    flashback: '0.3 0.59 0.11 0 0.02  0.3 0.59 0.11 0 0.04  0.3 0.59 0.11 0 0.12  0 0 0 1 0',
    copy: { masthead: 'The Evening Broadsheet' },
  },
});
