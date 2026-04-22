# Claude Code Prompt: Refinement Lib-02 — canvas-confetti

You are refining a browser-based slot machine app. Make sure to continue to adhere to `src/ai-plan.md` and `src/slot-prd.md`.

---

## Change for this step

Replace the manual DOM-based confetti system in `src/client/js/effects.js` with **canvas-confetti**, a tiny (~7 KB), GPU-accelerated, MIT-licensed confetti library that renders on a `<canvas>` overlay. The current `spawnConfetti()` implementation spawns 60 `<div>` particles with staggered `setTimeout` calls, each with manual style strings and `animationend` cleanup — canvas-confetti does all of this with a single function call and looks dramatically better.

Install via npm:

```
npm install canvas-confetti
```

Or load from CDN in `index.html` (for the no-bundler setup):

```html
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1/dist/confetti.browser.min.js"></script>
```

The CDN version exposes `confetti` as a global. The npm version is imported as:

```js
import confetti from 'canvas-confetti';
```

---

### 1. Replace `spawnConfetti()` in `effects.js`

**Before:** 25 lines of `setTimeout` loops, DOM particle creation, inline style strings, and `animationend` listener cleanup.

**After:** a single two-burst call that fires from both screen edges — matching the casino-style cannon effect:

```js
function spawnConfetti() {
  const colors = ['#f26522', '#ffd700', '#1d428a', '#f0ede8', '#4caf50'];

  confetti({
    angle: 60,
    spread: 55,
    particleCount: 80,
    origin: { x: 0, y: 0.6 },
    colors,
  });

  confetti({
    angle: 120,
    spread: 55,
    particleCount: 80,
    origin: { x: 1, y: 0.6 },
    colors,
  });
}
```

The library handles canvas creation, particle physics, gravity, rotation, fading, and DOM cleanup automatically.

---

### 2. Add a sustained jackpot burst (optional enhancement)

For a richer jackpot feel, fire a third wave of confetti with a short delay:

```js
function spawnConfetti() {
  const colors = ['#f26522', '#ffd700', '#1d428a', '#f0ede8', '#4caf50'];
  const shared = { spread: 55, particleCount: 80, colors };

  confetti({ ...shared, angle: 60,  origin: { x: 0,   y: 0.6 } });
  confetti({ ...shared, angle: 120, origin: { x: 1,   y: 0.6 } });

  setTimeout(() => {
    confetti({ ...shared, angle: 90, spread: 120, particleCount: 60, origin: { x: 0.5, y: 0.4 } });
  }, 400);
}
```

---

### 3. Remove the old particle infrastructure

- Delete the `CONFETTI_COLORS` constant from `effects.js` (colors are now passed directly to `confetti()`).
- Delete the `CONFETTI_COUNT` constant.
- Remove the `.particle` CSS rule and its `@keyframes fall` animation from `src/client/scss/_animations.scss`.
- Remove the `#particlesContainer` element from `index.html` if it is no longer used by any other effect (check whether `spawnBouncingBalls()` and `spawnLightBursts()` still reference it — if they do, keep the element but remove only the confetti-specific CSS).

---

### 4. No DOM changes required for the canvas

canvas-confetti creates its own `<canvas>` element on first call, positions it as a full-screen fixed overlay with `pointer-events: none`, and removes it when the animation completes. No HTML or CSS changes are needed.

---

### 5. Verify

- Trigger a jackpot win in DEV_MODE ("Force Jackpot" button) and confirm the confetti fires from both sides.
- Confirm no `.particle` elements appear in the DOM during a jackpot — the old system must be fully removed.
- Run `npm run lint && npm run test:unit` and fix any issues.

Always make sure to check work against `ai-plan.md` and test.
