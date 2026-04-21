# AI Use Log

---

## Entry 1

**Goal:** Build the full browser-based slot machine app from scratch following `src/ai-plan-v1.md`.

**Prompt:** "Follow the directions in src/ai-plan-v1.md. Begin."

**Summary:**
Built the entire project in one run following the creation order from the plan:

1. **`package.json`** — root config with all scripts for start, dev, CSS build, lint, and test.
2. **Dependencies installed** — express, dotenv, cors (runtime); eslint, stylelint, sass, htmlhint, playwright, nodemon (dev).
3. **Linter configs** — `eslint.config.js` (flat config with no-var, eqeqeq, prefer-const), `.stylelintrc.json` (stylelint-config-standard-scss + BEM class pattern), `.htmlhintrc`.
4. **`server/game/paytable.js`** — 7 symbols (Cherry, Lemon, Orange, Bell, Bar, Seven, Diamond) with weights (350/300/200/100/40/8/2 out of 1000) and 3-of-a-kind multipliers. Win rules: 3-of-a-kind OR first-two-reels match (2×). Classification tiers: small (<15×), big (15–99×), jackpot (≥100×).
5. **`tests/unit/paytable.test.js`** — 16 tests covering symbol structure, calculatePayout, classifyWin.
6. **`server/game/rng.js`** — weighted draw using cumulative threshold lookup; `spinReels()` spins reels independently.
7. **`tests/unit/rng.test.js`** — 5 tests covering draw validity, weight distribution, reel independence.
8. **`server/game/game.js`** — spin orchestration with bet validation and credit guard; exports `spin()`, `isValidBet()`.
9. **`tests/unit/game.test.js`** — 10 tests covering validation, return shape, credit math, error throwing.
10. **`tests/unit/simulation.test.js`** — 10,000-spin simulation; verified RTP ~91–93%, hit frequency ~27%, all symbols appear.
11. **`server/server.js`** — Express app with CORS, JSON body parsing, static file serving, conditional `startServer()`.
12. **`server/routes/spin.js`** — `POST /api/spin` route with input validation and error handling.
13. **`tests/unit/spin.route.test.js`** — 9 integration tests covering response shape and all invalid-input cases.
14. **`client/index.html`** — Semantic HTML5 with ARIA labels on reels, spin button, mute toggle, stats as `<dl>`, paytable as `<table>`.
15. **SCSS partials** — `_variables.scss`, `_layout.scss`, `_reels.scss`, `_controls.scss`, `_animations.scss`, `_responsive.scss`, `main.scss`. Mobile-first, breakpoints at 500/900/1200 px.
16. **`client/js/api.js`** — Single `postSpin()` fetch wrapper reading `API_BASE` from `window.ENV_API_BASE ?? 'http://localhost:3000'`.
17. **`client/js/ui.js`** — Full DOM wiring: spin handler, bet adjustment, reel spin/stop animation with stagger, tiered win messages and CSS class application, credit display with bump animation.
18. **`client/js/audio.js`** — Web Audio API tone synthesis (no external files required); spin, tick, tiered win, and ambient sounds; mute/unmute with session persistence via `aria-pressed`.
19. **`tests/e2e/slot.spec.js`** — 11 Playwright tests covering page load, spin-credit flow, bet controls, mute toggle, keyboard access, layout overflow at 375/768/1440 px, paytable visibility.
20. **`playwright.config.js`** — Playwright config targeting Chromium.

**Reflection:**
- Initial paytable with only 3-of-a-kind wins produced ~10% RTP and ~4% hit frequency — far below targets. Fixed by redesigning: added 2-of-a-kind partial wins (reels 1&2 match → 2× bet) and recalibrated multipliers to reach ~93% RTP and ~27% hit frequency. The math was derived analytically before coding.
- Sass `@use` requires each partial to import `_variables.scss` individually; the deprecated `darken()` function was replaced with a hardcoded hex value to eliminate deprecation errors.
- Stylelint needed `stylelint-config-standard-scss` (not `stylelint-config-standard`) to understand `@use`, `//` comments, and SCSS variables. The BEM class pattern regex was extended to allow hyphens within block/element/modifier segments.
- ESLint globals (`console`, `process`, `fetch`, `window`, `document`, `AudioContext`, timer functions) had to be declared in the flat config since the server and client share the same config file.
- Playwright's `webServer` config fails on Windows UNC paths; the server must be started manually before running e2e tests.
- No hand-editing was required after each fix; all issues were identified via linter output and corrected programmatically.

**Commit Hash:** 1e7161c

**Time:** 15m 12s
**Tokens** 54.2k

---

## Entry 2

**Goal:** Apply Refinement 1 — restructure project into `src/`, basketball theme, 5×3 reel grid, collapsible paytable, background image setup, scrolling reel animation, improved mobile layout, visual effects system, background music system, and updated README.

**Prompt:** "Continue working on this slot machine app, following the refinement directions in src/refinement-1.md"

**Summary:**

1. **Project restructure** — `git mv` moved `client/`, `server/`, and `tests/` into `src/`. Updated all path references in `package.json`, `playwright.config.js`, `eslint.config.js`, and `src/server/server.js` (which now uses `import.meta.url` + `path.join` for a robust absolute path to `src/client`).

2. **Basketball theme** — Replaced 7 fruit/casino symbols (Cherry, Lemon, …) with 7 basketball symbols: Basketball 🏀 (wt 350), Sneaker 👟 (280), Jersey 👕 (200), Trophy 🏆 (100), All-Star ⭐ (45), Hot Streak 🔥 (20), Championship Ring 💍 (5). Color palette updated to NBA orange (#f26522) + arena dark (#0a0e1a).

3. **5×3 reels and new game math** — Server now returns `reels` as a 2D array (5 columns × 3 rows) plus `payline` (middle row), `matchCount`, and existing fields. `paytable.js` uses per-symbol `payouts: {2, 3, 4, 5}` multiplier maps and `countConsecutiveMatch()` left-to-right win logic. Simulated RTP ~94.2%, hit frequency ~25.2%.

4. **Scrolling reel animation** — Each reel uses a `.reel__strip` div containing 22 random cells + 3 final cells. On spin, a CSS `cubic-bezier` transition scrolls the strip from `translateY(0)` to `translateY(−22 × cellHeight)`, landing on the correct symbols. Cell height is driven by `--reel-cell-height` CSS custom property updated at each breakpoint, read by JS via `getComputedStyle`.

5. **Collapsible paytable** — `<div class="paytable">` toggled open/closed by `paytable--open` class; CSS `max-height` transition animates the collapse. The toggle button sets `aria-expanded` for screen readers.

6. **Background image setup** — Created `src/client/assets/images/` with two SVG placeholder files (`bg-arena.svg` for the full page, `bg-court.svg` for the reel container). Both have comments indicating where to substitute real images.

7. **Background music system** — Replaced the interval-based ambient tone with `startBackgroundMusic()` / `stopBackgroundMusic()` in `audio.js`. Loads `assets/audio/bg-music.mp3` via `HTMLAudioElement`; a missing file is silently ignored so the game runs without the file present.

8. **Visual effects module** — New `src/client/js/effects.js` exports `addScreenFlash()` (full-screen overlay) and `spawnConfetti()` (60 animated `.particle` elements with random colors, sizes, positions, and durations).

9. **Mobile-first vertical layout** — Stats bar and header at top, reels occupy `flex: 1` to fill remaining vertical space, controls at the bottom. Max-width scales from 560 px → 720 px → 860 px across breakpoints.

10. **Tests updated** — All 5 unit test files rewritten for the new symbol set and 5-reel API shape. 43/43 tests pass.

11. **README** — Added full launch instructions, port configuration, development commands, and project structure.

**Reflection:**
- The `TOTAL_CELLS` constant was declared but unused (ESLint caught it); removed.
- `Audio` and `getComputedStyle` globals were missing from `eslint.config.js`; added them.
- One paytable test used trophy 3-match (12×) to assert "big" win — but 12 < 15 (the big threshold), so it's correctly "small". Fixed the test to use All-Star 3-match (75×).
- Stylelint flagged a missing empty line before an inline comment in `_reels.scss`; added it.
- npm scripts fail on the WSL UNC path in Windows; CSS build and linters invoked directly via `node node_modules/...` instead.

**Commit Hash:** TBD