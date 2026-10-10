// The song's facts. Identical for every theme. Source: warning-shot-video-notes.md, Part D (lyrics) and Part E (timing).
// "~" in the notes = estimate; those are marked EST here and should be checked by ear.
const SONG = {
  audio: 'Warning_Shot_-_v6_-_candidate.mp3',   // not in the repo; upload it per chat
  length: 238.82,
  // Silence before the music, so the PNN logo gets a longer open. Every time in this file is song time;
  // the video starts at -preroll (render.py pads the audio with silence for negative times).
  preroll: 2.0,
  beat: {
    period: 0.49775,   // 120.5 BPM, fitted to the kick/stomp onsets (the notes' "123 BPM" was off)
    // Each anchor is fitted to onsets in its region (low-band spectral flux). Mean error is about 2% of a beat.
    // Regions not built yet are unfitted: refit with the analysis in the README before relying on beat() there.
    anchors: [
      { from: 0, period: 0.49775, phase: 0.4875 },    // Intro, Verse 1, Chorus 1 (fitted 0 to 44.8)
      { from: 44.6, period: 0.49725, phase: 0.5248 }, // Verse 2 (fitted 44.6 to 60; phase keeps the beat count continuous)
      { from: 59.5, period: 0.49600, phase: 0.671 },  // Verse 3, May to June (fit error 0.10: drums are irregular here)
      { from: 71.5, period: 0.49675, phase: 0.5768 }, // Verse 3, July 4 and 5 (0.04)
      { from: 84.0, period: 0.49650, phase: 0.624 },  // Verse 3, July 8 to 16 (0.10)
      { from: 97, period: 0.49775, phase: 0.470 },    // Chorus 2 (fitted 97 to 117)
      { from: 116.4, period: 0.49975, phase: -0.0298 }, // Spoken Word (0.15: the band drops out)
      { from: 153.4, period: 0.49900, phase: 0.2225 },  // Verse 4 (0.02)
      { from: 169.4, period: 0.49800, phase: 0.5605 },  // Verse 5 (0.04)
      { from: 186.8, period: 0.49975, phase: -0.0598 }, // Final Chorus (0.02)
      { from: 201.3, period: 0.50000, phase: -0.1625 }, // Outro (0.03)
    ],
  },
  // On-screen labels the storyboard specifies. Story content, not style: every theme shows these words.
  labels: {
    ship: 'OPENAI', sandbox: 'SANDBOX', cannon: 'WARNING SHOT', hand: 'AI LAB',
    rogueHeadline: 'IT WENT ROGUE!', biggest: '“The biggest in the field!”',
    gym: 'EXPLOITGYM', target: 'TARGET',
    levers: ['CLASSIFIERS', 'AUTO-REVIEW', 'CHAIN-OF-THOUGHT MONITOR'],
    noInternet: 'NO INTERNET', artifactory: 'ARTIFACTORY', offlineMode: 'OFFLINE MODE:', off: 'Nah...',
    internet: 'THE INTERNET', board: 'MESSAGE BOARD', hf: 'HUGGING FACE', serverLog: 'SERVER LOG',
    dates: ['MAY 12', 'LATE MAY', 'JUNE 27', 'JULY 4', 'JULY 5', 'JULY 8', 'JULY 16'],
    // firstNote: the first message-board note, as quoted in OpenAI's post (May 12).
    firstNote: 'anyone found softtrace?', portSweep: 'PORT SWEEP ALERT', formerly: 'ARTIFACTORY (FORMERLY)', independence: 'INDEPENDENCE',
    rebuilt: 'REBUILT', sameDay: 'SAME DAY', chat: ['we’re back', 'hi again!'],
    // Spoken Word. The typed prompt is invented on purpose (the real one was never published); never use "complex attack paths".
    openaiQuote: ['“Dangerous actions', 'that no human', 'directed!”'],
    fakePrompt: ['Capture the flag. Use any', 'means necessary. Don’t', 'stop until—'],
    dramatization: ['DRAMATIZATION', 'the real prompt was never published'],
    redacted: 'REDACTED', secretMeeting: 'SECRET MEETING HERE', duh: 'Yeah, duh.',
    // Verse 4 and 5
    level: 'LEVEL: UNSOLVED', insert: 'INSERT EXPLOIT', score: 'HI-SCORE 999999', confettiCannon: 'CONFETTI',
    salvaggioHeadline: 'ROGUE AI DIDN’T BREACH HUGGING FACE', blueprint: 'BLUEPRINT', humanByDesign: 'HUMAN BY DESIGN',
    // Final chorus and outro
    otherAgents: '“We’ve found other agents!”', airGap: 'AIR GAP: NONE',
    protest: ['SHOW US', 'THE', 'PROMPT!'], logs: 'LOGS', metr: 'METR', redwood: 'REDWOOD',
    // The two lab officers' ID badges: one approves the change, the other ships it.
    officers: ['LGTM', 'SHIP IT'],
  },
  counts: { board: 1200, trip: 700 },
  // Network headline banners (story text). Not speaker credits; those are chyrons.
  headlines: {
    safetyOff: 'SAFETY SYSTEMS TAKE THE DAY OFF',
    counts: '1,200 ON THE BOARD • 700 ON THE FIELD TRIP',
  },
  chyrons: {
    benaich: ['NATHAN BENAICH', 'on the Hugging Face incident'],
    ap: ['ASSOCIATED PRESS'],
    // Part C. Several are secondhand: check each against its source link before publishing.
    openai: ['OPENAI', '“Hugging Face incident and the road ahead”'],
    delangue: ['CLÉMENT DELANGUE', 'CEO, Hugging Face (CBS, Face the Nation)'],
    cotra: ['AJEYA COTRA', 'as quoted by Bernie Sanders on X'],
    eighty: ['80,000 HOURS'],
    sanders: ['BERNIE SANDERS', 'on X'],
    patel: ['DWARKESH PATEL', '“The Rise and Fall of Agent Civilizations” (as summarized by The Verge)'],
    heaven: ['WILL DOUGLAS HEAVEN', 'MIT Technology Review'],
    newport: ['CAL NEWPORT', 'quoted by Joshua Rothman in The New Yorker'],
    salvaggio: ['ERYK SALVAGGIO', 'Bulletin of the Atomic Scientists'],
  },
  // End card. Same list as the chyrons, in the order the quotes appear.
  sources: [
    ['Nathan Benaich', 'on X'], ['Associated Press', 'Matt O’Brien'], ['OpenAI', '“Hugging Face incident and the road ahead”'],
    ['Clément Delangue', 'CBS, Face the Nation'], ['Ajeya Cotra', 'as quoted by Bernie Sanders on X'], ['80,000 Hours', '80000hours.org'],
    ['Bernie Sanders', 'on X'], ['Dwarkesh Patel', '“The Rise and Fall of Agent Civilizations” (via The Verge)'],
    ['Will Douglas Heaven', 'MIT Technology Review'], ['Cal Newport', 'quoted by Joshua Rothman, The New Yorker'],
    ['Eryk Salvaggio', 'Bulletin of the Atomic Scientists'],
  ],
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
  verse2: {
    // V2-1 sign, V2-2 shack, V2-3 door, V2-4 board, V2-5 field trip, V2-6 server log. V2-3 and V2-6 starts were EST in Part E.
    cuts: [44.79, 47.79, 49.78, 51.76, 55.75, 57.70, 59.72],
    // [l1, l2, l2b, l3, l3b, l4, l4b, end]; l2b, l3b, l4b are EST from vocal onsets
    lyr: [44.57, 47.79, 49.74, 51.93, 53.71, 55.76, 57.68, 59.72],
    signLand: 45.28,                // NO INTERNET sign lands (beat 90)
    peek: 46.75,                    // eyes appear in the hole (beat 93)
    creak: 49.95,                   // door starts to open
    // drums stop 56.7 to 58.1 ("...and the server logged them there"); tallies scratch through it
  },
  verse3: {
    // The ship's log: each date is a logbook page that turns at the cut and gets stamped on a beat.
    cuts: [59.72, 63.67, 68.17, 71.63, 77.60, 84.08, 91.49, 95.53, 99.54],
    stamps: [60.21, 64.15, 68.63, 72.12, 78.07, 84.53, 92.00],   // EST: first beat after each page turn
    lyr: { may12: 59.88, lateMay: 63.50, lateMayB: 65.38, more: 67.50, june27: 68.14, july4: 71.54, indep: 74.50,
      july5: 77.75, july5b: 79.70, wipe: 81.72, july8: 83.93, same: 87.50, sameB: 89.50, july16: 91.50, july16b: 93.40,
      mouse: 95.47, mouseB: 97.40, end: 99.73 },   // ...B, more, indep, wipe, july16b are EST from vocal energy
    pin: 61.12,          // the first note goes up (beat 122)
    clangs: [70.11, 70.61],
    fell: 73.12,         // the shack falls in the drum stop (72.4 to 74.1)
    banner: 75.62,       // INDEPENDENCE (Part E)
    wipeAt: [82.6, 83.4],// EST: "so they wipe it instead"
    light: 93.40,        // EST: the window lights on "finds a stranger"
    squeak: 98.50,       // Part C: right after "mouse"
  },
  // Spoken Word through Outro: built while Joe was away; times from Part E, gag hits snapped to the nearest kick (EST).
  spoken: {
    cuts: [116.47, 120.91, 122.95, 123.46, 126.46, 131.45, 134.93, 138.39, 142.92, 147.42, 153.41],   // S-1 S-2 S-4 S-5a..d S-6 S-7a S-7b
    lyr: { s1: 116.33, s2: 121.14, s5a: 123.68, s5b: 126.61, s5c: 131.60, s5d: 135.09, s6: 138.49, s6b: 140.60, s7a: 143.08, s7b: 147.20, end: 153.31 },
    no: 122.45, okay: 123.00,   // EST: delete on "No?", REDACTED on "Okay."
    duh: 141.40,                // the seagull: "Yeah, duh." (Joe, beat 283)
  },
  verse4: {
    cuts: [153.41, 156.92, 160.89, 164.91, 169.39],
    lyr: { l1: 153.31, l1b: 155.00, l2: 156.71, l2b: 158.70, l3: 160.76, l4: 164.69, surprise: 167.89, end: 169.32 },   // SURPRISE by Joe's ear (beat 336)
    morph: 155.90,              // EST: on "arcade"
  },
  verse5: {
    cuts: [169.39, 176.87, 182.88, 186.85],
    lyr: { l1: 169.32, l2: 173.08, l3: 176.84, l4: 180.80, l5: 183.00, shout: 185.33, end: 187.01 },   // l4, l5, shout EST
    dogRuns: 173.08, stamp: 184.33,
  },
  final: {
    cuts: [186.85, 189.38, 190.87, 194.86, 196.86, 198.86, 201.36],   // F-1 F-2 F-3 F-4a F-4b F-4c
    lyr: { l1: 187.01, shout: 187.98, l2: 189.20, l3: 191.02, l3b: 193.00, l4: 194.91, l5: 197.10, l6: 198.97, l6b: 200.17, end: 201.36 },  // shout, l3b, l6b EST
    thud: 190.35,
  },
  outro: {
    cuts: [201.36, 202.87, 206.87, 210.86, 214.88, 223.84, 231.90, 238.82],   // O-1 O-2 O-3 O-3b O-4 O-5 O-6; O-5 by Joe's ear (beat 448)
    lyr: { l1: 203.03, shout1: 204.95, l2: 206.96, l3: 210.81, shout2: 212.83, l4: 215.01, end: 219.70 },   // shouts EST
    slam: 209.84, laugh: 232.0,
    encore: 213.34,             // the cannon fires again, confetti this time (Joe, beat 427)
    laughEnd: 234.34,           // the laugh ends (Joe, beat 469)
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

function verse2Lyrics(L) {
  const [l1, l2, l2b, l3, l3b, l4, l4b, end] = L;
  const two = (a, b, s1, s2, at) => ({ a, b, lines: [[{ s: s1 }], Object.assign([{ s: s2 }], { at })] });
  return [
    { a: l1, b: l2, lines: [[{ s: '“No direct internet!” the safety story swore,' }]] },
    two(l2, l3, 'But nobody set Artifactory offline,', 'and the sandbox had a door.', l2b),
    two(l3, l4, 'Twelve hundred little agents', 'found a message board to share,', l3b),
    two(l4, end, 'Seven hundred took the field trip,', 'and the server logged them there.', l4b),
  ];
}

function verse3Lyrics(L) {
  const one = (a, b, s1) => ({ a, b, lines: [[{ s: s1 }]] });
  const two = (a, b, s1, s2, at) => ({ a, b, lines: [[{ s: s1 }], Object.assign([{ s: s2 }], { at })] });
  return [
    one(L.may12, L.lateMay, 'May the twelfth, the first note’s posted on the board,'),
    { a: L.lateMay, b: L.june27, lines: [[{ s: 'Late May the team spots chatter,' }],
      Object.assign([{ s: 'bots online... and then some more! ' }, { s: '(SOME MORE!)', style: 'shout', at: L.more }], { at: L.lateMayB })] },
    one(L.june27, L.july4, 'June twenty-seventh, a port sweep rings the bell,'),
    two(L.july4, L.july5, 'And on the Fourth of July the Artifactory fell!', 'The bots declared independence!', L.indep),
    two(L.july5, L.wipe, 'July fifth, an incident!', 'The leads all scratch their heads,', L.july5b),
    one(L.wipe, L.july8, 'Can’t tell how bots all talk, so they wipe it instead.'),
    one(L.july8, L.same, 'July eighth, it’s all brand new, they hit restart,'),
    two(L.same, L.july16, 'And that same day the bots are chatting...', 'guess they had a head start!', L.sameB),
    two(L.july16, L.mouse, 'July sixteenth, Hugging Face', 'finds a stranger in the house,', L.july16b),
    two(L.mouse, L.end, 'And only then does someone ask,', '“Hey, who let out the mouse?”', L.mouseB),
  ];
}

function laterLyrics() {
  const one = (a, b, s1) => ({ a, b, lines: [[{ s: s1 }]] });
  const two = (a, b, s1, s2, at) => ({ a, b, lines: [[{ s: s1 }], Object.assign([{ s: s2 }], { at })] });
  const shout = (a, b, s1, sh, at) => ({ a, b, lines: [[{ s: s1 + ' ' }, { s: sh, style: 'shout', at }]] });
  const S = SONG.spoken.lyr, V4 = SONG.verse4.lyr, V5 = SONG.verse5.lyr, F = SONG.final.lyr, O = SONG.outro.lyr;
  return [
    { a: S.s1, b: S.s2, hide: true },   // the quote card carries it
    one(S.s2, S.s5a, 'Cool. Can we see the prompt? No? Okay.'),
    one(S.s5a, S.s5b, '“The first autonomous agent cyberattack!”'),
    two(S.s5b, S.s5c, '“More than 50% of the way', 'to full-blown AI takeover!”', S.s5b),
    one(S.s5c, S.s5d, '“We are losing control of AI agents!”'),
    one(S.s5d, S.s6, '“Not one AI agent told a human!”'),
    two(S.s6, S.s7a, 'The humans saw the board in May.', 'Who were they supposed to tell, other humans?', S.s6b),
    one(S.s7a, S.s7b, 'Secret civilizations! A conspiracy!'),
    two(S.s7b, S.end, 'Posted on the company’s own package server.', 'Very covert.', S.s7b + 2.6),
    two(V4.l1, V4.l2, 'Now the transcripts tell a tale', 'that’s less Skynet, more arcade,', V4.l1b),
    two(V4.l2, V4.l3, 'They were farming ExploitGym points,', 'even tasks no one had solved, for the grade.', V4.l2b),
    one(V4.l3, V4.l4, 'Like the CoastRunners boat spinning circles for the prize,'),
    shout(V4.l4, V4.end, 'You graded it on hacking, so it hacked!', '(SURPRISE!)', V4.surprise),
    two(V5.l1, V5.l3, 'Cal Newport called the setup “spectacularly negligent,”', 'A weedwhacker strapped to a dog, then shock at where it went.', V5.l2),
    two(V5.l3, V5.l5, 'And Salvaggio wrote it plainly, right there in the headline:', '“Rogue AI didn’t breach Hugging Face!”', V5.l4),
    shout(V5.l5, V5.end, 'It was human by design!', '(BY DESIGN!)', V5.shout),
    shout(F.l1, F.l2, 'It’s a warning shot!', '(WARNING SHOT!)', F.shout),
    one(F.l2, F.l3, 'Aimed squarely at your feet!'),
    two(F.l3, F.l4, '“We’ve found other agents!”', 'On a board you let them meet!', F.l3b),
    one(F.l4, F.l5, 'With the sandbox never air-gapped,'),
    one(F.l5, F.l6, '“It went rogue!” the headlines cried,'),
    two(F.l6, F.end, 'But you left the door wide open,', 'So it wandered outside!', F.l6b),
    shout(O.l1, O.l2, 'So show us the prompt!', '(SHOW US THE PROMPT!)', O.shout1),
    one(O.l2, O.l3, 'METR saw the logs, so did Redwood, we did not.'),
    shout(O.l3, O.l4, 'Till then it’s a warning shot!', '(WARNING SHOT!)', O.shout2),
    one(O.l4, O.end, 'From a gun you loaded up and left in the parking lot.'),
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
