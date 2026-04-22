# Asset Manifest — Hoops Slots

All placeholder and synthesized assets are listed below. The design team must
replace every `[PLACEHOLDER]` entry before shipping. `[SYNTHESIZED]` entries are
generated in-browser via the Web Audio API and require no file; provide a real
audio file if higher production quality is desired.

---

## Images

| File | Status | Dimensions | Notes |
|------|--------|------------|-------|
| `images/bg-arena.svg` | [PLACEHOLDER] | 1920×1080 px recommended | Full-page arena background. Must be dark enough that reels and UI text remain legible. Avoid competing visually with the reel grid. PNG/JPEG accepted; update the CSS `background-image` path if you change the extension. |
| `images/bg-court.svg` | [PLACEHOLDER] | 800×400 px recommended | Wood-grain court texture for the reel grid overlay. Warm gold tone; must work behind a dark-tinted overlay without losing the court pattern. |

---

## Audio

| File | Status | Duration | Format | Notes |
|------|--------|----------|--------|-------|
| `audio/bg-music.mp3` | [PLACEHOLDER] | 60–120 s loop | MP3 + OGG fallback | Looping background music. Basketball / hip-hop genre, 90–110 BPM. The loop point must be seamless. Provide both MP3 and OGG for broad browser support. |
| `audio/spin.mp3` | [SYNTHESIZED] | 0.3–0.6 s | MP3 | Reel spin swoosh played when the spin button is pressed. Currently synthesized via Web Audio API. |
| `audio/stop-tick.mp3` | [SYNTHESIZED] | 0.05–0.15 s | MP3 | Per-reel landing click, staggered across the 5 reels for suspense. Currently synthesized. |
| `audio/win-small.mp3` | [SYNTHESIZED] | 0.5–1.5 s | MP3 | Small-win fanfare (e.g. quick ascending tone). Currently synthesized. |
| `audio/win-big.mp3` | [SYNTHESIZED] | 1–3 s | MP3 | Big-win fanfare (e.g. crowd cheer + horn). Currently synthesized. |
| `audio/win-jackpot.mp3` | [SYNTHESIZED] | 3–6 s | MP3 | Jackpot celebration (full crowd roar + buzzer + music sting). Currently synthesized. |

---

## Naming Convention

All asset file names use lowercase kebab-case. Do not rename existing files
without updating the corresponding path in `src/client/js/audio.js` (audio)
or `src/client/scss/_layout.scss` / `src/client/scss/_reels.scss` (images).
