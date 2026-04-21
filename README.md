# Hoops Slots — Basketball Slot Machine

A browser-based 5×3 basketball-themed slot machine built with vanilla HTML/CSS/JavaScript and a Node.js/Express backend.

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

Install dependencies (run once from the project root):

```bash
npm install
```

---

## Launch the Game

### 1. Start the server

```bash
npm start
```

The server starts on **http://localhost:3000** (or the port set in `src/server/.env`).

For auto-restart during development:

```bash
npm run dev
```

### 2. Open the game

Navigate to **http://localhost:3000** in any modern browser.

The server serves the client automatically — no separate step required.

---

## Port configuration

Create `src/server/.env` to override the default port:

```
PORT=4000
```

---

## Development

| Command | Description |
|---------|-------------|
| `npm run build:css` | Compile SCSS → CSS (one-shot) |
| `npm run watch:css` | Compile SCSS → CSS (watch mode) |
| `npm run lint` | Run ESLint + Stylelint + HTMLHint |
| `npm run test:unit` | Run server-side unit tests |

### Background music

Place an MP3 file at `src/client/assets/audio/bg-music.mp3` to enable background music. The game handles a missing file silently.

### Replacing placeholder backgrounds

- `src/client/assets/images/bg-arena.svg` — full-page arena background (replace with JPG/PNG/WebP)
- `src/client/assets/images/bg-court.svg` — reel background texture (replace with JPG/PNG/WebP)

Update the `background-image` references in `src/client/scss/_layout.scss` and `src/client/scss/_reels.scss` to point at the new files.

---

## Project structure

```
src/
  client/          # Static front-end files served by Express
    index.html
    css/           # Compiled CSS (do not edit directly)
    scss/          # SCSS source partials
    js/            # Client JavaScript modules
    assets/        # Images and audio (replace placeholders)
  server/          # Node.js + Express back-end
    server.js
    routes/spin.js
    game/          # RNG, paytable, spin orchestration
  tests/
    unit/          # Server-side unit + simulation tests
    e2e/           # Playwright end-to-end tests
```

---

## Game rules

- 5 reels, 3 visible rows — the **middle row** is the payline
- Wins count consecutive matching symbols **from the leftmost reel**
- Minimum 2-of-a-kind to win; up to 5-of-a-kind for the Championship Ring jackpot
- RTP target ~94%, hit frequency ~25%
