# Claude Code Prompt: Slot Machine App

You are building a browser-based slot machine app from scratch. Read `src/slot-prd.md` before writing any code — it defines the full scope, game math targets, and what is explicitly out of scope. Everything below tells you how to build it.

---

## Architecture

The app is split into a **server** and a **client**. All game logic lives on the server. The client is purely presentational — it sends requests and renders what the server returns.

- The server runs locally for development but must be designed to be deployed remotely with no code changes. All environment-specific values (port, base URL) go in a `.env` file; nothing is hardcoded.
- The client never imports or calls game logic directly. It communicates with the server exclusively through the REST API via a dedicated `api.js` module.
- This separation also aligns with the regulations research, which requires server-side RNG for any real-money-adjacent system.

---

## Codebase Structure

Organize the project as follows:

```
client/
  index.html
  scss/
    main.scss          # Entry point — imports all partials
    _variables.scss    # Colors, fonts, spacing tokens
    _layout.scss       # Page structure and grid
    _reels.scss        # Reel container and symbol styles
    _controls.scss     # Spin button, bet controls, mute toggle
    _animations.scss   # Win feedback animations (small, big, jackpot)
    _responsive.scss   # Media queries for 500 px, 900 px, 1200 px breakpoints
  css/
    styles.css         # Compiled output — do not edit directly
  js/
    api.js         # All fetch calls to the server — no game logic here
    ui.js          # All DOM manipulation and animation
    audio.js       # Sound loading, playback, mute state
    # Subfolders are encouraged if grouping improves clarity
  audio/
    ...            # Sound files (spin, stop-tick ×3, small-win, big-win, jackpot, ambient)

server/
  server.js        # Express app entry point — loads routes, starts listener
  .env             # PORT and any other env vars — never committed to git
  routes/
    spin.js        # POST /api/spin
  game/
    rng.js         # RNG and weighted symbol draw
    paytable.js    # Symbol definitions, weights, and payout rules
    game.js        # Spin orchestration: calls rng.js, calculates payout

tests/
  unit/            # Tests for server-side modules (no DOM, no network)
  e2e/             # Playwright tests against the running server + client
```

The server exposes a minimal REST API. Start with one endpoint:

- `POST /api/spin` — accepts `{ bet }`, returns `{ reels, payout, credits }`

The client's `api.js` reads the server base URL from a single config value (e.g. `const API_BASE = window.ENV_API_BASE ?? 'http://localhost:3000'`) so that pointing the client at a remote server requires changing one line or injecting an env var at build time.

Compile Sass with:

```
npm run build:css   # one-shot compile
npm run watch:css   # watch mode during development
```

`package.json` lives at the project root and covers both client and server scripts:

```json
"scripts": {
  "start":         "node server/server.js",
  "dev":           "nodemon server/server.js",
  "build:css":     "sass client/scss/main.scss client/css/styles.css --style=compressed",
  "watch:css":     "sass --watch client/scss/main.scss:client/css/styles.css"
}
```

`client/css/styles.css` is the compiled output — `index.html` links only to that file. Never edit it directly; all changes go in the `scss/` partials.

---

## Code Standards

The goal is a codebase that reads as if one person wrote the whole thing. LLMs make stylistic consistency hard to maintain — linters are the enforcement mechanism. Run linting tools on every file as it is generated and fix issues immediately, not after the fact.

Follow the rules from `plan/raw-research/js-practices/research.md` and `plan/raw-research/html-css-practices/research.md`:

- Use `const` and `let` only — never `var`
- Use strict equality (`===`) everywhere
- Use semantic HTML5 elements (`<button>`, `<main>`, `<section>`, not `<div>` for interactive elements)
- No inline styles; all styling goes in the appropriate `scss/` partial
- Use classes for CSS selectors, not IDs

### Linting

Configure and run all three linters from the start. Do not defer this.

- **ESLint** — JS style and usage. Run after every JS file is written or modified.
- **Stylelint** — SCSS/CSS quality. Run after every SCSS partial is written or modified.
- **HTMLHint** (or W3C validator) — HTML validity. Run after `index.html` changes.

Add lint scripts to `package.json`:

```json
"scripts": {
  "lint:js":   "eslint client/js/**/*.js server/**/*.js",
  "lint:scss": "stylelint client/scss/**/*.scss",
  "lint:html": "htmlhint client/index.html",
  "lint":      "npm run lint:js && npm run lint:scss && npm run lint:html"
}
```

All lint checks must pass with zero errors before moving to the next feature.

### Clean Code

Apply these principles to every file written:

- **Meaningful names** — variables and functions must describe what they are/do; no single-letter names outside loop counters
- **Small functions** — each function does one thing; if it needs a comment to explain what it does, it should be split or renamed
- **DRY** — no duplicated logic; extract shared behavior into a shared function
- **Error handling** — handle edge cases (e.g. credits reaching zero, audio load failure) explicitly; never silently swallow errors
- **Appropriate abstraction** — group related logic into modules; avoid reaching across module boundaries for internal state

### Documentation

Every JavaScript file must start with a JSDoc file header and every function must have a full JSDoc block with type annotations, as defined in `plan/raw-research/code-documentation/research.md`:

```js
/**
 * @fileoverview Brief description of this file's role in the slot machine.
 * @author Your Name
 * @part-of CSE 110 Tech Warm-Up 2
 */
```

```js
/**
 * Brief description of what the function does.
 * @param {type} name - Description.
 * @returns {type} Description.
 */
```

---

## Game Math

All game math lives in `server/game/`. Before writing the spin logic, define the paytable in `paytable.js`. Target values from the PRD:

- RTP: ~92–95%
- Hit frequency: ~25–35% of spins
- Volatility: medium (frequent small wins, rare jackpots)
- Symbol tiers: Common ×3, Uncommon ×2, Rare ×1, Jackpot ×1

Use weighted probability arrays for each reel — not uniform random. The jackpot symbol must have the lowest weight. Each reel spins independently. Determine the full outcome (all three reel positions) before starting any animation.

---

## UI & Visuals

Follow `plan/raw-research/responsive-web-design/research.md`:

- Mobile-first layout using fluid CSS; breakpoints at 500 px, 900 px, and 1200 px
- The spin button and credit display must be reachable and fully operable on a 375 px screen
- Use CSS transitions for reel animations; the DOM update showing the final symbols happens after the animation completes, not before

Win feedback tiers (reference `plan/raw-research/slot-machine-visuals/research.md`):

- No effect for net-zero or net-loss results (no false-win celebrations)
- Small win: brief highlight animation on the winning row
- Big win: more prominent animation with screen flash
- Jackpot: full celebratory animation sequence

Always display: current credits, current bet, last win amount.

---

## Sound

Reference `plan/raw-research/slot-machine-sounds/research.md`:

- Play a spin sound when the spin button is pressed
- Play a stop-tick sound as each reel stops (stagger them for suspense)
- Play tiered win sounds matching the visual feedback tiers above
- Loop ambient background audio at low volume
- A mute toggle button must silence all audio immediately and persist for the session
- All sounds must be immediate — no perceptible delay between trigger and playback

---

## Accessibility

Reference `plan/raw-research/accessibility-language-support/research.md`:

- All interactive elements must be keyboard-reachable (Tab) and activatable (Enter or Space)
- Use ARIA labels on the spin button and reel containers
- Do not encode any information using color alone
- Run a Lighthouse accessibility audit before considering the UI done; target 90+

---

## Testing

Reference `plan/raw-research/testing/research.md`. Write tests as each module is built — do not save testing for the end. Consider writing tests first and then implementing the code that makes them pass.

**Unit tests** (required — place in `tests/unit/`):

Each unit test file maps to one server-side module. Use the Arrange-Act-Assert pattern. Tests must be fast, isolated, and deterministic — import the module directly, no network calls, no DOM.

- `rng.test.js` — weighted draw returns only valid symbols; distribution matches weights over many samples
- `paytable.test.js` — every defined combination returns the correct payout; no combination returns a negative value
- `game.test.js` — spin result is fully determined before return; payout calculation is correct for each win tier; credits never go below zero
- `spin.route.test.js` — `POST /api/spin` returns the expected shape; rejects invalid bet values

Simulation test (can live in `tests/unit/simulation.test.js`):
- Run 10,000+ spins through `game.js` directly (no HTTP)
- Assert estimated RTP is within ±1% of the paytable target
- Assert hit frequency is within the target range
- Log symbol distribution to catch weight bugs

**End-to-end tests** (strongly recommended — place in `tests/e2e/` using Playwright):

Playwright tests run against the actual server (`npm run dev`) and the client served from `client/`. They test the full stack through the browser.

- Spin button triggers reel animation and updates credit display
- Credits decrease by the bet amount on a non-winning spin
- Win amount is added to credits on a winning spin
- Mute toggle silences audio and persists for the session
- All controls reachable and operable via keyboard
- Layout renders without overflow at 375 px, 768 px, and 1440 px viewports

Add test scripts to `package.json`:

```json
"scripts": {
  "test:unit": "node --test tests/unit/**/*.test.js",
  "test:e2e":  "playwright test tests/e2e/",
  "test":      "npm run test:unit && npm run test:e2e"
}
```

All tests must pass before a feature is considered done.

---

## AI-Use Log

At the end of each run — meaning once per time Claude Code is invoked, not once per file — append one entry to `src/ai-use-log/ai-use-log.md` following the format in `plan/raw-research/code-documentation/research.md`. Do not create a separate entry for every file touched in a single run.

Each entry must include:

- **Goal:** What were we trying to build?
- **Prompt:** The exact instruction given.
- **Summary:** A short description of what was done this run (which files were created or changed and why).
- **Reflection:** Did it work? What required manual editing?
- **Commit Hash:** To be filled in after committing.

The project requires a minimum of 20 entries total.

---

## Creation Order

Build in this sequence to avoid rework:

At each step: write the code, run the relevant linter (`npm run lint`), write or run the relevant tests (`npm run test:unit`), and fix any issues before moving on.

1. `server/game/paytable.js` — define symbols, weights, and payout rules; write `paytable.test.js` alongside it
2. `server/game/rng.js` — weighted draw function; write `rng.test.js` alongside it
3. `server/game/game.js` — spin orchestration and payout calculation; write `game.test.js` and the simulation test alongside it
4. Confirm all unit tests pass and simulated RTP is on target before writing any routes
5. `server/server.js` + `server/routes/spin.js` — Express app and `POST /api/spin` endpoint; write `spin.route.test.js` alongside it
6. `client/index.html` + SCSS partials — static layout, mobile-first; run `npm run watch:css` and `npm run lint:html` / `npm run lint:scss` as you go
7. `client/js/api.js` — fetch wrapper pointing at the configurable server base URL
8. `client/js/ui.js` — wire up DOM, animations, credit display using responses from `api.js`; add Playwright e2e tests for spin flow and credit updates
9. `client/js/audio.js` — sounds and mute toggle; add Playwright e2e test for mute persistence
10. Accessibility pass — ARIA, keyboard nav, Lighthouse audit 90+; add Playwright keyboard-nav test
11. Run `npm run lint && npm run test` — everything must be green
