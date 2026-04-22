# Claude Code Prompt: Refinement Lib-01 — GSAP Animation Library

You are refining a browser-based slot machine app. Make sure to continue to adhere to `src/ai-plan.md` and `src/slot-prd.md`.

---

## Change for this step

Replace the manual CSS-transition + `setTimeout` animation code in `src/client/js/ui.js` and `src/client/js/effects.js` with **GSAP** (GreenSock Animation Platform). GSAP is the industry-standard JS animation library: it handles animation timing, easing, sequencing, and cleanup far more reliably than hand-rolled `setTimeout` chains and CSS transition hacks.

Install via npm:

```
npm install gsap
```

Import in the files that need it (since the project uses ES modules served statically, load from the CDN via a script tag in `index.html`, or use a bundler step — see note below):

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
```

Or add a build step (e.g. Vite, esbuild, Rollup) and import normally:

```js
import gsap from 'gsap';
```

---

### 1. Replace `animateStrip()` in `ui.js`

**Before:** manually sets `strip.style.transition`, triggers reflow with `void strip.offsetWidth`, then resolves after a `setTimeout`.

**After:** use `gsap.to()` with `onComplete`:

```js
function animateStrip(reelIndex, spinDuration) {
  return new Promise((resolve) => {
    const strip = document.getElementById(`strip${reelIndex}`);
    const cellHeight = getCellHeight();
    const targetOffset = SPIN_CELL_COUNT * cellHeight;

    // Reset to top instantly (no animation)
    gsap.set(strip, { y: 0 });

    // Animate to final position
    gsap.to(strip, {
      y: -targetOffset,
      duration: spinDuration / 1000,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}
```

Remove the `void strip.offsetWidth` reflow hack — GSAP handles initial-state registration automatically.

Also remove these lines from `setupStrip()`:

```js
strip.style.transition = 'none';
strip.style.transform = 'translateY(0)';
```

Instead call `gsap.set(strip, { y: 0 })` at the start of `animateStrip()`.

---

### 2. Replace the credits counter bump in `updateCreditsDisplay()`

**Before:** toggles a CSS class off/on to trigger a keyframe bump animation.

**After:** use GSAP to animate the numeric value and scale:

```js
function updateCreditsDisplay(amount) {
  const counter = { value: currentCredits };
  gsap.to(counter, {
    value: amount,
    duration: 0.6,
    ease: 'power1.out',
    snap: { value: 1 },
    onUpdate() {
      creditsDisplay.textContent = Math.round(counter.value);
    },
  });
  gsap.fromTo(creditsDisplay, { scale: 1.15 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
}
```

Remove the `.stats__value--bump` class and its corresponding keyframe from `_animations.scss`.

---

### 3. Replace the slam-text entrance/exit animation in `effects.js`

**Before:** `.slam-text` uses CSS keyframes `slam-text-in` / `slam-text-out` and the JS manually adds/removes CSS classes on a timer.

**After:** use a GSAP timeline for the full lifecycle:

```js
function showSlamText(tier) {
  const pool = SLAM_MESSAGES[tier] ?? SLAM_MESSAGES.small;
  const message = pool[Math.floor(Math.random() * pool.length)];

  const el = document.createElement('div');
  el.className = `slam-text${tier === 'small' ? ' slam-text--subtle' : ''}`;
  el.textContent = message;
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  const displayMs = tier === 'small' ? 1200 : 2000;

  gsap.timeline()
    .fromTo(el, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' })
    .to(el, { scale: 0.8, opacity: 0, duration: 0.25, ease: 'power2.in', delay: displayMs / 1000, onComplete: () => el.remove() });
}
```

Remove the `slam-text-in`, `slam-text-out`, and related CSS keyframes from `_animations.scss` — GSAP owns the animation now.

---

### 4. Replace the `spawnBouncingBalls()` animation in `effects.js`

**Before:** CSS keyframe `basketball-bounce` with a JS loop of `setTimeout` calls.

**After:** GSAP handles the arc, squash, and cleanup:

```js
function spawnBouncingBalls(count = 6) {
  const container = getContainer();

  for (let i = 0; i < count; i++) {
    const ball = document.createElement('div');
    ball.textContent = '🏀';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = 'position:absolute;font-size:2.5rem;pointer-events:none;';
    container.appendChild(ball);

    const startX = (10 + Math.random() * 80) + 'vw';
    const startY = '110vh';
    const peakY  = (10 + Math.random() * 40) + 'vh';

    gsap.set(ball, { x: startX, y: startY });

    const tl = gsap.timeline({ delay: i * 0.12, onComplete: () => ball.remove() });
    tl.to(ball, { y: peakY, duration: 0.55, ease: 'power2.out', rotation: -180 })
      .to(ball, { y: startY, duration: 0.55, ease: 'bounce.out', rotation: -360 });
  }
}
```

Remove the `basketball-bounce` keyframe and `.basketball-bounce` class from `_animations.scss`.

---

### 5. Cleanup

- Remove all animation-related class toggles in `ui.js` that were only needed to restart CSS keyframes (the `void el.offsetWidth` reflow trick appears in `animateJackpotTier()` and elsewhere — GSAP eliminates the need for all of them).
- Remove the `--bounce-duration` and `--burst-duration` CSS custom properties from `_variables.scss` if they are no longer referenced after the CSS keyframes are removed.
- Run `npm run lint && npm run test:unit` after changes and fix any issues.

Always make sure to check work against `ai-plan.md` and test.
