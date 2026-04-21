# PRD: Browser-Based Slot Machine App

## 1. Overview

### 1.1 Purpose

This document defines requirements for a browser-based slot machine app built with vanilla HTML, CSS, and JavaScript. The app delivers an engaging, fair, and accessible slot machine experience in the browser — no real money, no deposits, no accounts required.

### 1.2 Background & Rationale

- Existing free slot apps frustrate users with aggressive deposit prompts, perceived rigging, and ad interruptions after wins
- User feedback highlights strong demand for transparent RNG, satisfying win animations/sounds, and a generous entry reward
- A purely front-end implementation avoids regulatory burdens around real-money play while still delivering casino-style entertainment

---

## 2. Target Users

- **Casual players** looking for a low-stakes, fun browser game during downtime
- **Mobile users** expecting a responsive, touch-friendly experience
- **Accessibility-conscious users** who rely on keyboard navigation or screen readers

---

## 3. Core Features

### 3.1 Spin Mechanics

- RNG determines the outcome before any animation begins; animation is purely visual
- Each spin is statistically independent — no "due for a win" behavior
- Weighted symbol probabilities control hit frequency and volatility
- A paytable is always visible, showing all winning combinations and payouts

### 3.2 Credits & Betting

- Players start with a free credit bonus on first load (entry reward based on user feedback)
- Configurable bet amount per spin
- Persistent credit display showing current balance, last win, and net position

### 3.3 Win Feedback

- Distinct sound and animation tiers: small win, big win, jackpot
- No "false win" celebrations — wins equal to or less than the bet do not trigger celebration effects
- Reel stop sounds play per-reel to build suspense before the result is shown

### 3.4 Sound & Accessibility

- Background ambient sound toggleable by the player
- All sounds and music can be muted via a visible control
- Semantic HTML with ARIA labels for screen reader support
- Full keyboard navigation (Tab to focus, Enter/Space to spin)
- High-contrast-friendly color palette; no color-only information encoding

### 3.5 Responsive Layout

- Mobile-first design with fluid layout; playable on phones, tablets, and desktops
- Breakpoints at ~500 px (mobile), ~900 px (tablet), ~1200 px (desktop)
- Touch-optimized spin button and controls

---

## 4. Technical Requirements

### 4.1 Stack

- **HTML/CSS/JavaScript** — no build tools or frameworks required
- Utility CSS classes for layout; semantic HTML5 elements throughout
- `const`/`let` only; strict equality (`===`) enforced; ESLint + Prettier for code quality

### 4.2 Architecture

- Game logic module (RNG, paytable, payout calculation) is fully decoupled from the UI
- UI module reads the resolved spin result and drives animations
- Audio module manages sound loading, playback, and mute state
- No external APIs or backend — all state lives in memory (credits reset on page reload)

### 4.3 Testing

- Simulation script runs 10,000+ spins to verify estimated RTP, hit frequency, and reward distribution
- Manual test checklist covers spin independence, animation/outcome decoupling, keyboard nav, and mute control
- Lighthouse accessibility audit targeting 90+ score

---

## 5. Game Math Design

| Parameter | Target |
|---|---|
| RTP | ~92–95% |
| Hit frequency | ~25–35% of spins |
| Volatility | Medium (mix of small frequent wins and rare jackpots) |
| Symbol tiers | Common (3), Uncommon (2), Rare (1), Jackpot (1) |

- Paytable finalized before implementation begins
- Weighted symbol pool drives the RNG draw for each reel independently
- Jackpot symbol has lowest weight; jackpot only awarded on 3-of-a-kind

---

## 6. Out of Scope

- Real-money play, deposits, or withdrawals
- User accounts or persistent session history
- Age verification or geolocation enforcement (no real-money transactions)
- Auto-play or turbo-spin features

---

## 7. Success Metrics

- Simulated RTP falls within ±1% of the target after 10,000 spins
- All interactive elements reachable and operable via keyboard alone
- Layout renders correctly at 375 px, 768 px, and 1440 px viewport widths
- No false-win celebrations trigger on net-zero or net-loss spins
- Mute control persists for the session and silences all audio immediately
