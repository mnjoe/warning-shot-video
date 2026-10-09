// The song's facts. Identical for every theme. Source: warning-shot-video-notes.md, Part D (lyrics) and Part E (timing).
// "~" in the notes = estimate; those are marked EST here and should be checked by ear.
const SONG = {
  audio: 'Warning_Shot_-_v6_-_candidate.mp3',   // not in the repo; upload it per chat
  length: 238.82,
  beat: {
    period: 0.48812,   // 122.92 BPM, measured from the audio
    // phase fits per region (seconds). Measured with spectral flux; refine as sections get built.
    anchors: [
      { from: 0, phase: 0.215 },
      { from: 27, phase: 0.27 },
      { from: 59.5, phase: 0.06 },
      { from: 99, phase: 0.44 },
      { from: 140, phase: 0.065 },
      { from: 180, phase: 0.45 },
      { from: 210, phase: 0.08 },
    ],
  },
  // On-screen labels the storyboard specifies. Story content, not style: every theme shows these words.
  labels: {
    ship: 'OPENAI', sandbox: 'SANDBOX', cannon: 'WARNING SHOT', hand: 'US',
    rogueHeadline: 'IT WENT ROGUE!', biggest: '“The biggest in the field!”',
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
  chorus: {
    // cuts: C-1..C-6 starts + end. fireAt: crowd shout. lyr: [l1, shout, l2, l3, l3b, l4, l5, l6, l6b, end]
    one: {
      cuts: [27.86, 30.37, 31.86, 35.85, 37.34, 39.82, 44.79], fireAt: 28.88,
      lyr: [27.91, 28.88, 30.16, 31.98, 33.90, 35.85, 37.22, 39.77, 42.30, 44.57],
    },
    two: { // shout, l3b, l6b are EST (same offsets as chorus 1)
      cuts: [99.54, 102.03, 103.54, 107.51, 108.99, 111.48, 116.47], fireAt: 100.70,
      lyr: [99.73, 100.70, 101.97, 103.69, 105.61, 107.27, 108.95, 111.48, 114.01, 116.33],
    },
  },
};

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
