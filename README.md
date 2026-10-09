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
```

Needs Python Playwright with Chromium, ffmpeg, and Pillow (all present in Claude's sandbox).
Rendering runs at about 12 frames per second at 720p on one CPU. Render long spans in sections and join them with ffmpeg's concat.

## Layout

```
engine/core.js          math, beat grid, theme loader, txt()/textWidth()/fitSize()
engine/timeline.js      SONG: cut times, lyrics, labels, chyron names, ticker, beat anchors
engine/scenes/*.js      choreography: what happens when; draws only through R.*
engine/stage.html       shot list in song order + render(t)
themes/<name>/theme.js  tokens + rigs (the look)
themes/<name>/fonts/    font files and their licenses
render.py               stills, contact sheets, video, audio mux
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
| `lab-glove` | Rig override: replaces only `hand()` (lab-coat sleeve, ID badge, blue nitrile glove, jointed fingers). Everything else inherited. |

Story words such as the hand's "US" label live in `SONG.labels` in `timeline.js`, not in a theme. Changing one changes it in every theme.

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

**Different-looking characters or props:** add a `rigs` block that replaces just those functions, for example a new `bot(o)`. It must accept the same inputs (below). Every scene picks it up automatically.

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
- `copy`: theme flavor text: `network, masthead, earlier, live, replay`. Story text lives in `SONG.labels`, not here.

## Theme contract (rigs every theme must provide)

Inherited from `pirate-flat` unless overridden. `t` is song time in seconds, `lt` is time since the shot started.

| Rig | Inputs |
|---|---|
| `defs()` | returns `<defs>` content; must define `#sky`, `#vig`, `#flashback` |
| `bot(o)` | `x, y` (feet), `s`, `t`, `variant, phase, sway, tankard, sing, walk, whistle, flip, shrug, look, frown` |
| `hand(o)` | `x, y, s, rot, curl (0 flat to 1 gripping), label` |
| `cannon(o)` | `x, y, s, angle, fire (seconds since firing or null), label` |
| `cannonball(x, y)` | |
| `lifeboat(o)` | `x, y (waterline), s, hole, door (0 to 1 open, optional), label` |
| `newspaper(o)` | `headline`; drawn centered at 0,0; the scene adds the spin |
| `speechBubble(x, y, k, text)` | `k` = pop-in scale |
| `deck(t)` | full-frame ship-deck set |
| `exterior(t, camX, o)` | ship and lifeboat at sea; `boatX, hole, shipLabel, boatLabel, extras` |
| `flashback(t, svg)` | wraps a shot in the flashback treatment |
| `sky, cloud, clouds, waves, seaRect, smokePuff, musicNote, ripple, dim` | environment helpers |
| `liveTag(t, mode)`, `bug(t)`, `ticker(t, items, start)`, `chyron(lt, name, sub)`, `lyrics(t, entry)` | network chrome |

New scenes will add rigs (notice board, Artifactory shack, parrots, seagull, arcade cabinet and so on). Add each one to `pirate-flat` and to this table.

## Content rules (from the production notes)

- No real people drawn. Real names appear only in chyrons. No company logos; plain-text labels only.
- Ticker lines come only from items marked "Fact" in the known-vs-unknown note.
- The prompt gag must read as invented and carry a "dramatization" tag. Never use "complex attack paths" as prompt text.
- Check every quote against its source link before publishing.

## Status

| Section | Shots | State |
|---|---|---|
| Chorus 1 and 2 | C-1 to C-6 | built (Chorus 2 timing partly estimated) |
| Everything else | | not started; build in song order |

Times marked EST in `timeline.js`, and the beat-grid anchors, should be checked by ear as sections are built.
