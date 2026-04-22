# Claude Code Prompt: Refinement Lib-03 — Howler.js Audio

You are refining a browser-based slot machine app. Make sure to continue to adhere to `src/ai-plan.md` and `src/slot-prd.md`.

---

## Change for this step

Replace the manual Web Audio API boilerplate in `src/client/js/audio.js` with **Howler.js**, the most widely used browser audio library. Howler handles `AudioContext` lifecycle, browser autoplay policy, MP3/OGG format fallback, volume control, looping, and global mute — all the things `audio.js` currently manages by hand.

The immediate win is background music: the current `startBackgroundMusic()` manually creates an `<audio>` element outside the Web Audio graph, which means it cannot be muted or volume-controlled alongside the synthesized sounds. Howler unifies everything through one global `AudioContext`.

Install via npm:

```
npm install howler
```

Or load from CDN in `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/howler@2/dist/howler.min.js"></script>
```

The CDN version exposes `Howl` and `Howler` as globals. The npm version is imported as:

```js
import { Howl, Howler } from 'howler';
```

---

### 1. Replace background music with a `Howl` instance

**Before:** `new Audio('assets/audio/bg-music.mp3')` — an `<audio>` element with no connection to the Web Audio API.

**After:**

```js
const bgMusic = new Howl({
  src: ['assets/audio/bg-music.mp3', 'assets/audio/bg-music.ogg'],
  loop: true,
  volume: 0.12,
  html5: true,  // stream instead of decode-all for long tracks
});

function startBackgroundMusic() {
  if (Howler._muted || bgMusic.playing()) return;
  bgMusic.play();
}

function stopBackgroundMusic() {
  bgMusic.stop();
}
```

The `Howl` instance gracefully no-ops if the file is missing (it fires an `onloaderror` callback rather than throwing). Wire it:

```js
bgMusic.on('loaderror', () => {
  // File not available yet — silently ignore
});
```

---

### 2. Replace the synthesized tones with Howler sprite sheets (optional path)

If the design team provides the audio files listed in `src/client/assets/ASSETS.md`, load all game sounds as a single Howler sprite sheet:

```js
const sfx = new Howl({
  src: ['assets/audio/sfx.mp3', 'assets/audio/sfx.ogg'],
  sprite: {
    spin:       [0,    300],
    stopTick:   [400,  150],
    winSmall:   [700,  800],
    winBig:     [1600, 1200],
    winJackpot: [2900, 3000],
  },
});

function playSpinSound()            { sfx.play('spin'); }
function playStopTickSound()        { sfx.play('stopTick'); }
function playWinSound(winTier) {
  if (winTier === 'none') return;
  sfx.play({ small: 'winSmall', big: 'winBig', jackpot: 'winJackpot' }[winTier]);
}
```

Until audio files are provided, keep the oscillator-based synthesis for the sound effects (they work fine for now) and only replace background music with Howler.

---

### 3. Replace global mute with `Howler.mute()`

**Before:** `isMuted` module-level boolean; all playback functions check it before every call; `stopBackgroundMusic()` is called on mute.

**After:** Howler provides a global mute that silences every `Howl` instance at once:

```js
function setMuted(muted) {
  Howler.mute(muted);
  if (!muted) startBackgroundMusic();
}

function getMuted() {
  return Howler._muted;
}
```

Remove the `isMuted` module variable and every `if (isMuted) return;` guard in the individual sound functions.

---

### 4. Remove the manual `AudioContext` management

**Before:** `getAudioContext()` lazily creates and resumes a shared `AudioContext`; all synthesized sounds pass `ctx` explicitly.

**After:** Howler owns the global `AudioContext` (available as `Howler.ctx`). For the synthesized tones that remain (spin, stopTick, win), update `getAudioContext()` to return `Howler.ctx` rather than creating one independently:

```js
function getAudioContext() {
  return Howler.ctx;
}
```

This eliminates the duplicate `AudioContext` and ensures Howler's autoplay-unlock mechanism covers the synthesized sounds too.

---

### 5. Cleanup

- Remove `bgMusicEl` module variable and all references to it.
- Remove the `el.play().then(...).catch(...)` pattern in the old `startBackgroundMusic()`.
- Run `npm run lint && npm run test:unit` after changes and fix any issues.
- Manually test that toggling the mute button silences both background music and sound effects simultaneously.

Always make sure to check work against `ai-plan.md` and test.
