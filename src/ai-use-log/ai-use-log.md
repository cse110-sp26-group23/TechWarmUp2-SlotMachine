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