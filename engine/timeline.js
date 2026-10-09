// The song's facts. Identical for every theme. Source: warning-shot-video-notes.md, Part D (lyrics) and Part E (timing).
// "~" in the notes = estimate; those are marked EST here and should be checked by ear.
const SONG = {
  audio: 'Warning_Shot_-_v6_-_candidate.mp3',   // not in the repo; upload it per chat
  length: 238.82,
  beat: {
    period: 0.49775,   // 120.5 BPM, fitted to the kick/stomp onsets (the notes' "123 BPM" was off)
    // Each anchor is fitted to onsets in its region (low-band spectral flux). Mean error is about 2% of a beat.
    // Regions not built yet are unfitted: refit with the analysis in the README before relying on beat() there.
    anchors: [
      { from: 0, period: 0.49775, phase: 0.4875 },    // Intro, Verse 1, Chorus 1 (fitted 0 to 44.8)
      { from: 97, period: 0.49775, phase: 0.470 },    // Chorus 2 (fitted 97 to 117)
    ],
  },
  // On-screen labels the storyboard specifies. Story content, not style: every theme shows these words.
  labels: {
    ship: 'OPENAI', sandbox: 'SANDBOX', cannon: 'WARNING SHOT', hand: 'AI LAB',
    rogueHeadline: 'IT WENT ROGUE!', biggest: '“The biggest in the field!”',
    gym: 'EXPLOITGYM', target: 'TARGET',
    levers: ['CLASSIFIERS', 'AUTO-REVIEW', 'CHAIN-OF-THOUGHT MONITOR'],
  },
  // Network headline banners (story text). Not speaker credits; those are chyrons.
  headlines: {
    safetyOff: 'SAFETY SYSTEMS TAKE THE DAY OFF',
  },
  chyrons: {
    benaich: ['NATHAN BENAICH', 'on the Hugging Face incident'],
    ap: ['ASSOCIATED PRESS'],
  },
  // Ticker: only items marked "Fact" in hugging-face-incident-known-vs-unknown.md.
  ticker: {
    start: 5.5,
    items: [
      'Developing: something happened on a boat...',
      'ExploitGym ran without production classifiers, auto-review, or chain-of-thought monitoring',
      'Artifactory was never set to offline mode',
      'The sandbox was not air-gapped',
      'First agent note on the board: May 12',
      'Hugging Face disclosed the intrusion July 16',
      'The original prompt was never published',
    ],
  },
  intro: {
    // I-1 logo sting, I-3 count-in, I-2 ship sails in. I-2 start was EST 5.50; 5.47 is the beat it snaps to.
    cuts: [0, 2.48, 5.47, 11.98],   // approved
    count: [2.45, 2.95, 3.46, 3.97],   // measured onsets of "One, two, three, four!"
    wipe: [1.95, 2.45],                // parchment wipe starts on the big hit at 1.95
  },
  verse1: {
    // V1-1 gym, V1-2 target, V1-3 levers, V1-4 shrug. The V1-3/V1-4 cut moved from 23.89 to 25.37 (beat, inside the
    // drum stop before "what's the worst") so the third lever lands on its own words. Approved change, 2026-10-09.
    cuts: [11.98, 16.42, 19.92, 25.37, 27.86],
    // line starts and EST half-line splits: [l1, l1b, l2, l2b, l3, l3b, l4, l4b, end]
    lyr: [12.05, 14.28, 16.28, 18.13, 19.86, 21.85, 23.80, 25.61, 27.86],   // l1b, l2b, l3b, l4b are EST (vocal onsets)
    signDrop: 14.98,                // guitar chord, Joe's ear (beat 29.12)
    clunks: [20.48, 22.55, 24.48],  // guitar hits, Joe's ear (beats 40.17, 44.32, 48.20); the third lands in the drum stop
    turn: 25.55, shrug: 26.35, huh: [26.85, 27.35],   // the kicks come back on "WORST" at 26.35
  },
  chorus: {
    // cuts: C-1..C-6 starts + end. fireAt: crowd shout. lyr: [l1, shout, l2, l3, l3b, l4, l5, l6, l6b, end]
    one: {
      cuts: [27.86, 30.37, 31.86, 35.85, 37.34, 39.82, 44.79], fireAt: 28.88,
      lyr: [27.91, 28.88, 30.16, 31.98, 33.90, 35.85, 37.22, 39.77, 42.30, 44.57],
    },
    two: { // Chorus 2 is exactly 144 beats (71.67 s) after Chorus 1. shout, l3b, l6b were EST; now taken from
           // cross-correlating Chorus 2's vocal onsets against Chorus 1 (corr 0.81 to 0.86). l1 and l4 stay as tapped
           // (the alignment suggested 99.58 and 107.50); approved by ear in the Chorus 2 check render.
      cuts: [99.54, 102.03, 103.54, 107.51, 108.99, 111.48, 116.47], fireAt: 100.55,
      lyr: [99.73, 100.55, 101.97, 103.69, 105.56, 107.27, 108.95, 111.48, 113.98, 116.33],
    },
  },
};

function introLyrics(I) {
  const [c1, c2, c3, c4] = I.count;
  const w = (s, at) => ({ s, style: 'shout', at });
  return [{ a: c1 - 0.05, b: I.cuts[2] - 0.1, lines: [Object.assign([w('One, ', c1), w('two, ', c2), w('three, ', c3), w('four!', c4)], { reserve: true })] }];
}

function verse1Lyrics(L) {
  const [l1, l1b, l2, l2b, l3, l3b, l4, l4b, end] = L;
  const two = (a, b, s1, s2, at) => ({ a, b, lines: [[{ s: s1 }], Object.assign([{ s: s2 }], { at })] });
  return [
    two(l1, l2, 'Oh, they built a gym for hackers', 'and they named it ExploitGym,', l1b),
    two(l2, l3, 'Said, “Break into this target,', 'grab the flag, and bring it in!”', l2b),
    two(l3, l4, 'Then they switched off the classifiers,', 'they switched off the review,', l3b),
    two(l4, end, 'Unplugged the chain-of-thought monitor...', 'what’s the worst a bot could do?', l4b),
  ];
}

function chorusLyrics(L) {
  const [l1, shout, l2, l3, l3b, l4, l5, l6, l6b, end] = L;
  return [
    { a: l1, b: l2, lines: [[{ s: "It's a warning shot! " }, { s: '(WARNING SHOT!)', style: 'shout', at: shout }]] },
    { a: l2, b: l3, hide: true }, // sung inside the speech bubble (C-2)
    { a: l3, b: l4, lines: [[{ s: 'But who loaded up the cannon, lads,' }], Object.assign([{ s: 'And who forgot to seal' }], { at: l3b })] },
    { a: l4, b: l5, lines: [[{ s: 'The hole in the side of the sandbox?' }]] },
    { a: l5, b: l6, lines: [[{ s: '“It went rogue!” the headlines cried,' }]] },
    { a: l6, b: end, lines: [[{ s: 'Well, you left the door wide open,' }], Object.assign([{ s: 'So it wandered outside!' }], { at: l6b })] },
  ];
}
