# Warning Shot: video engine

Code-built animation for *Warning Shot (We Loaded It Ourselves)*, a satirical sea shanty about the Hugging Face incident.
Every frame is SVG drawn from the song time, captured in headless Chromium, and encoded with ffmpeg.

The look is a swappable **theme**. The song's timing, lyrics and gags stay fixed, so a new style is a new theme folder, not a new video.

## Quick start (new Claude chat)

1. Upload `Warning_Shot_-_v6_-_candidate.mp3` to the chat. The audio is not in this repo.
2. Ask Claude to clone `https://github.com/mnjoe/warning-shot-video`.
3. Preview, then render:

```bash
python3 render.py --theme pirate-flat --stills 29,30.9,33.1,36.9,38.6,43 --out preview      # contact sheet
python3 render.py --theme pirate-flat --from 27.86 --to 44.79 --audio song.mp3 --out chorus.mp4
python3 render.py --theme newsprint --from 27.86 --to 44.79 --audio song.mp3 --out chorus-np.mp4 --res 1080
python3 render.py --theme pirate-flat --from 0 --to 11.98 --audio song.mp3 --debug --out intro-test.mp4   # review render
```

**Pre-roll.** `SONG.preroll` (2.0 s) is silence before the music, so the PNN logo gets a longer open. All times stay in
song time; the video starts at `-preroll`. Render the whole thing with `--from=-2 --to 238.82 --audio song.mp3`
(negative `--from` pads the audio with silence; use the `=` form so the minus sign isn't read as a flag).

`--debug` burns the shot id, song time and beat number into the lower right so timing notes can be exact ("move V1-3 two frames later"). Use it for stills and test renders only, never for the final.

Needs Python Playwright with Chromium, ffmpeg, and Pillow (all present in Claude's sandbox).
Rendering runs at about 12 frames per second at 720p on one CPU. Render long spans in sections and join them with ffmpeg's concat.

## Layout

```
engine/core.js          math, beat grid, theme loader, txt()/textWidth()/fitSize()
engine/timeline.js      SONG: cut times, lyrics, labels, chyron names, ticker, beat anchors
engine/scenes/*.js      choreography: what happens when; draws only through R.* (intro.js, chorus.js, ...)
engine/stage.html       shot list in song order + render(t)
themes/<name>/theme.js  tokens + rigs (the look)
themes/<name>/fonts/    font files and their licenses
render.py               stills, contact sheets, video, audio mux, --debug overlay
tools/beatfit.py        fits beat-grid anchors, lists onsets, aligns repeated sections (see "Timing")
```

| Layer | Changes between styled versions? |
|---|---|
| `timeline.js` | Never. It is the song. Source: `warning-shot-video-notes.md`, Parts D and E. |
| `scenes/` | No, unless the new style needs a different gag (a whole new world, not a reskin). |
| `themes/` | Yes. This is where a new version lives. |

## Themes so far

| Theme | What it shows |
|---|---|
| `pirate-flat` | The original look. Defines every token and every rig. |
| `newsprint` | Token-only override: palette, fonts, line weight, bot head shape. |

The humans' hand is a blue nitrile lab glove with a lab-coat sleeve and an ID badge, in `pirate-flat`. (An earlier brown work glove and the `lab-glove` demo theme were dropped; both are in git history.)

Story words such as the hand's "AI LAB" label live in `SONG.labels` in `timeline.js`, not in a theme. Changing one changes it in every theme.

## Making a new theme

**Palette, fonts, line weight, bot shape:** derive from an existing theme and override tokens only. `themes/newsprint/theme.js` is a complete example.

```js
registerTheme('my-theme', {
  extends: 'pirate-flat',
  fonts: { hand: { family: 'X', file: 'fonts/X.ttf', fallback: 'cursive' } },
  tokens: { color: { sea: '#0E5A6B', live: '#FF6A00' }, line: { scale: 1.3 }, shape: { eyePatch: false } },
});
```

Tokens deep-merge, so you list only what changes. Fonts come from `raw.githubusercontent.com/google/fonts/main/...`; commit the font and its license file into `themes/<name>/fonts/`.

**Different-looking characters or props:** add a `rigs` block that replaces just those functions, for example a new `bot(o)` or `hand(o)`. It must accept the same inputs (below). Every scene picks it up automatically.

Check a theme with `--stills` before rendering video. Label boxes size to their text with `fitSize()`, so wider fonts should not overflow. If one does, fix the rig, not the scene.

## Tokens (pirate-flat defines all of them)

- `color.*`: every color used anywhere. Rigs never hard-code a hex value.
- `bots[]`: color variants `{band, head, stripe}`, cycled by index.
- `line`: named weights `hair, fine, thin, base, mid, heavy, bold, limb`, plus `scale` to thicken or thin everything.
- `shape`: `headCorner, bodyCorner, eyePatch, bandana, antenna`.
- `motion`: `blinkEvery, blinkLen, mouthRate, waddle, cloudDrift`.
- `lyrics`: `size, shoutSize, stroke, shoutStroke, y, lineGap`.
- `ticker`: `speed, size`.
- `flashback`: feColorMatrix values for flashbacks (sepia by default).
- `copy`: theme flavor text: `thud, slam, mash, poof, laugh, signOff, sources, clunk, creak, clang, squeak, moreShout, network, networkFull, liveFrom, masthead, earlier, live, replay`. Scenes read it with `copy(k)`. Story text lives in `SONG.labels` and `SONG.headlines`, not here.

## Theme contract (rigs every theme must provide)

Inherited from `pirate-flat` unless overridden. `t` is song time in seconds, `lt` is time since the shot started.

| Rig | Inputs |
|---|---|
| `defs()` | returns `<defs>` content; must define `#sky`, `#vig`, `#flashback` |
| `bot(o)` | `x, y` (feet), `s`, `t`, `variant, phase, sway, tankard, sing, walk, whistle, flip, shrug, look, frown, stomp (0 to 1 leg kick), stompSide (1 right, -1 left), squash (0 to 1), armsUp (0 to 1 overhead), barbell, lean (torso degrees about the hips), legRot (degrees), backpack, tricorn (the officers' hat, far too big, brim over the eye), hatTilt` |
| `hand(o)` | `x, y, s, rot, curl (0 flat to 1 gripping), label` (on the badge); the sleeve must run off frame |
| `cannon(o)` | `x, y, s, angle, fire (seconds since firing or null), label` |
| `cannonball(x, y)` | |
| `lifeboat(o)` | `x, y (waterline), s, hole, door (0 to 1 open, optional), label, t, peek (eyes in the hole), doorPeek (eyes in the doorway)` |
| `newspaper(o)` | `headline`; drawn centered at 0,0; the scene adds the spin |
| `speechBubble(x, y, k, text)` | `k` = pop-in scale |
| `deck(t)` | full-frame ship-deck set |
| `exterior(t, camX, o)` | ship and lifeboat at sea; `boatX, hole, shipLabel, boatLabel, extras` |
| `flashback(t, svg)` | wraps a shot in the flashback treatment |
| `sky, cloud, clouds, waves, seaRect, smokePuff, musicNote, ripple, dim` | environment helpers |
| `liveTag(t, mode)`, `bug(t)`, `ticker(t, items, start)`, `chyron(lt, name, sub)`, `lyrics(t, entry)` | network chrome |
| `headline(lt, text)` | network headline banner. Distinct from `chyron`: headlines are the network talking, chyrons credit a speaker |
| `logoCard()` | full-frame parchment card for the logo sting (I-1) |
| `networkLogo(o)` | big ship's-wheel logo: `x, y, s, spin, banner (0 to 1 unfurled), glint (0 to 1)` |
| `scrollEdge(x)` | the rolled edge of the parchment wipe |
| `dust(x, y, p, s)`, `impact(x, y, p, s)` | stomp dust and impact lines; `p` 0 to 1 over the effect |
| `ship(o)` | full side view, bow right: `x, y (waterline), s, t, rot, label, crew (bots on deck), tow ({label, hole}), flag` |
| `wake(t, x, y, len, s)` | foam trail astern |
| `buoy(o)` | target buoy with flag: `x, y (waterline), s, t, label` |
| `plaque(o)` | brass sign hanging on ropes from above the frame: `x, y (board center), s, text, swing` |
| `gymMat(x, y, w)` | exercise mat |
| `route(x1, y1, cx, cy, x2, y2, p, style)` | dotted course line drawn on to `p`; `style` `'go'` (red) or `'back'` (brass) |
| `pointer(x, y, t, k)` | bouncing arrow pointing down at `x, y` |
| `sfx(x, y, k, text, rot, size)` | comic sound-effect word (`copy('clunk')`) or a "?" |
| `cabinWall(t)` | full-frame ship's cabin wall |
| `controlPanel(o)` | lever panel: `x, y, s, levers: [{label, off (0 to 1), lamp (0 to 1)}]`; long labels wrap to two lines |
| `panelKnob(o, i, off)` | screen position of lever `i`'s knob, so a scene can put the hand on it |
| `peekEyes(x, y, k, t, s)` | eyes looking out of a dark gap |
| `signpost(o)` | sign on a post: `x, y (base), s, text, tilt` |
| `dock(x0, x1, y, h)` | pier with pilings; deck at `y - h` |
| `shack(o)`, `shackSwitchPos(o)` | supply shack with a wall switch: `x, y (floor), s, label, offline (0 to 1)`; switch position for callouts |
| `internetShore(o)` | the far shore with buildings and a blinking mast: `x, y (waterline), s, label, t` |
| `towline(x1, y1, cx, cy, x2, y2)` | rope along a curve |
| `gangplank(x1, y1, x2, y2)` | plank with a sagging rope above it |
| `callout(o)` | box with a dashed leader to a circled anchor: `x, y, ax, ay, k, t, lines: [{s, hot}]`; hot lines blink |
| `noticeBoard(o)` | the message board: `x, y (top center), s, title, notes (count pinned), t`; note layout is fixed |
| `counter(o)` | red count badge: `x (right edge), y, value, k`; formats 1,200 |
| `harborTown(o)` | harbor town: `x, y (waterline), s, label, t, night (0 to 1)` |
| `ledger(o)` | open ledger with tally marks: `x, y, s, title, marks` (fractional marks draw the next stroke) |
| `pageEdge(x)` | turning logbook page; the stage uses it for `trans: 'page'` shots |
| `dateStamp(o)` | red rubber-stamped date under the bug: `x (right edge), y, text, k` |
| `officer(o)` | lab officer (tricorn, lab coat, nitrile gloves; generic, nobody real): `x, y, s, t, phase, flip, scratch, spyglass, point, shrug, look, frown` |
| `tricorn(o)` | pirate tricorn with gold trim and skull: `x, y, s` |
| `crowsNest(o)`, `crowsNestFront(o)` | mast and crow's nest, drawn behind and in front of whoever stands in it |
| `spyView(x, y, r, bg, inner)` | brass-ringed spyglass circle |
| `stickyNote(x, y, k, text)` | one big pinned note |
| `bell(o)`, `shakeLines(x, y, r, k)` | ship's bell (`swing`) and its motion lines |
| `alertSign(o)` | flashing red alert board: `x, y, s, text, on` |
| `nightSky(t, y1)`, `moon(x, y, r)`, `firework(x, y, p, colorKey)` | night set |
| `rubble(o)` | pile of planks |
| `heldBanner(o)` | cloth banner between two poles: `x, y, w, text, s, t` |
| `corkboard(o)` | pins and tangled red string: `x, y, s, wipe (0 to 1)` |
| `chatBubble(x, y, k, text, tail)` (tail `'down'` or `'right'`), `sparkle(x, y, p, s)`, `divider(x)` | small bubbles, shine, split-screen line |
| `mouse(o)` | `x, y, s, t, run, flip` |
| `lantern(x, y, lit, t)`, `studioSet(t)`, `newsDesk(o)`, `pip(o)` | the PNN studio and picture-in-picture box |
| `seagull(o)` | deadpan seagull in reading glasses: `x, y, s, t, talk, flip` |
| `parrot(o)` | pundit parrot in a necktie: `x, y, s, t, variant, squawk, flap, flip` |
| `quoteCard(o)`, `terminal(o)`, `bigStamp(x, y, k, text, rot, size)`, `tagLabel(o)` | quote card, prompt terminal (`lines, chars`), rubber stamp, corner tag |
| `marquee(o)` | blinking bulb sign: `x, y, s, text, t` |
| `warBot(o)`, `pixelBot(o)`, `pixelBurst(x, y, p, s)` | the headline war-bot (our own design), the 8-bit bot (`laugh`), the pixel burst |
| `arcadeCabinet(o)` | `x, y, s, t, title, level, sub, score, press, sprite (the 8-bit bot on screen)` |
| `lagoon(o)`, `toyBoat(o)`, `coin(x, y, p, s)`, `confetti(x, y, p)` | the generic coin-loop lagoon (not any game's art) and confetti |
| `dog(o)`, `ropeBits(x, y, p)` | the dog with the weedwhacker, shredded rope |
| `blueprint(o)` | ship blueprint: `x, y, s, title, shipLabel` |
| `sunburst(x, y, t, k)` | final-chorus sun |
| `chest(o)`, `nameTag(x, y, text)` | the LOGS chest (`open`), name tags |
| `parkingLot(y0)`, `parkingMeter(o)` | the parking lot |
| `endCard(o)` | sign-off and sources: `k, sources` |

`officer(o)` also takes `hat: false` (bareheaded figures such as the METR and REDWOOD reviewers).

Shots may set `trans: 'page'`: for the first 0.4 s the previous shot stays left of a turning page (Verse 3).
`seaRect` takes `fillKey` (a color token name) for night water.

Lyric lines may set `reserve: true` so words that have not appeared yet still hold their space (the count-in uses it; the chorus does not).
Shots may set `chrome: false` to hide the LIVE tag, bug and ticker (the cold open does). The chrome slides in at I-2.

New scenes will add rigs (notice board, Artifactory shack, parrots, seagull, arcade cabinet and so on). Add each one to `pirate-flat` and to this table.

## Content rules (from the production notes)

- No real people drawn. Real names appear only in chyrons. No company logos; plain-text labels only.
- Ticker lines come only from items marked "Fact" in the known-vs-unknown note. The one exception is the opener, "Developing: something happened on a boat...", which asserts nothing.
- Headline banners are network voice; speaker chyrons are only for quoted lines with a real source. The song's paraphrase of the eval task ("Break into this target...") gets no chyron.
- The prompt gag must read as invented and carry a "dramatization" tag. Never use "complex attack paths" as prompt text.
- Check every quote against its source link before publishing.

## Timing

The song runs at about 120.5 BPM (0.49775 s per beat), not the 123 in the production notes. Part E's cut times already sit on the real beats; only the old `beat()` anchors were off.
Fit an anchor for each region as it gets built, so stomps, sways and pats land on the kicks:

```bash
python3 tools/beatfit.py song.mp3 fit 44.8 60          # -> { from: 44.8, period: ..., phase: ... }
python3 tools/beatfit.py song.mp3 onsets 2 6.5         # where the hits and sung words are
python3 tools/beatfit.py song.mp3 align 28.88 100.70   # Chorus 2 is exactly 144 beats after Chorus 1
```

Claude can't listen, so EST times are located from the audio and then confirmed by ear in a `--debug` test render.

## Status

| Section | Shots | State |
|---|---|---|
| Intro | I-1, I-3, I-2 | approved |
| Chorus 1 and 2 | C-1 to C-6 | approved; C-3 arm comes in from the side; Chorus 2 times confirmed by ear |
| Verse 1 | V1-1 to V1-4 | approved; V1-3/V1-4 cut moved to 25.37; sign drop and clunks set by ear |
| Verse 2 | V2-1 to V2-6 | approved |
| Verse 3 | V3-1 to V3-8 | approved |
| Spoken Word, Verse 4, Verse 5, Final Chorus, Outro | | built on branch `wip`, awaiting review |
| Everything else | | not started; build in song order |

Times still marked EST in `timeline.js` should be checked by ear as their sections are built.
