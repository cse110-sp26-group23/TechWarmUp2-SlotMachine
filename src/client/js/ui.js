/**
 * @fileoverview DOM manipulation, strip animation, and event wiring for the basketball slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { postSpin, postForceSpin } from './api.js';
import { playSpinSound, playStopTickSound, playWinSound, playRiserSound, startBackgroundMusic } from './audio.js';
import { spawnConfetti, addScreenFlash, spawnBouncingBalls, spawnLightBursts, showSlamText } from './effects.js';

// Basketball symbol emoji map — mirrors server paytable IDs
const SYMBOL_EMOJI = {
  basketball: '🏀',
  sneaker:    '👟',
  jersey:     '👕',
  trophy:     '🏆',
  star:       '⭐',
  flame:      '🔥',
  ring:       '💍',
};

const SYMBOL_LABEL = {
  basketball: 'Basketball',
  sneaker:    'Sneaker',
  jersey:     'Jersey',
  trophy:     'Trophy',
  star:       'All-Star',
  flame:      'Hot Streak',
  ring:       'Championship Ring',
};

const SYMBOL_IDS = Object.keys(SYMBOL_EMOJI);

const MIN_BET = 1;
const MAX_BET = 100;
const BET_STEP = 5;

// Scrolling strip constants
const SPIN_CELL_COUNT = 22;  // random cells above the 3 final cells
const STOP_STAGGER_MS = 260; // delay between each reel stopping

/** @type {number} */
let currentCredits = 1000;

/** @type {number} */
let currentBet = 10;

/** @type {boolean} */
let isSpinning = false;

// DOM references
const spinButton = document.getElementById('spinButton');
const betDecreaseButton = document.getElementById('betDecreaseButton');
const betIncreaseButton = document.getElementById('betIncreaseButton');
const betAmountLabel = document.getElementById('betAmount');
const betDisplay = document.getElementById('betDisplay');
const creditsDisplay = document.getElementById('creditsDisplay');
const lastWinDisplay = document.getElementById('lastWinDisplay');
const winMessage = document.getElementById('winMessage');
const muteToggle = document.getElementById('muteToggle');
const muteIcon = muteToggle.querySelector('.mute-toggle__icon');
const paytableEl = document.getElementById('paytable');
const paytableToggle = document.getElementById('paytableToggle');
const debugButton = document.getElementById('debugButton');
const debugModal = document.getElementById('debugModal');
const debugModalClose = document.getElementById('debugModalClose');
const debugTriggers = document.querySelectorAll('.debug-modal__trigger');
const tierGrandEl = document.getElementById('tierGrand');

/**
 * Reads the --reel-cell-height CSS custom property set by the SCSS responsive rules.
 * @returns {number} Cell height in pixels.
 */
function getCellHeight() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--reel-cell-height')
    .trim();
  return parseFloat(raw) || 75;
}

/**
 * Returns a random symbol ID for populating the scrolling spin strip.
 * @returns {string} A symbol ID key.
 */
function randomSymbolId() {
  return SYMBOL_IDS[Math.floor(Math.random() * SYMBOL_IDS.length)];
}

/**
 * Creates a single reel cell element.
 * Attempts to load assets/images/symbols/{symbolId}.png; falls back to the
 * emoji glyph if the image is absent or fails to load.
 * @param {string} symbolId - A key from SYMBOL_EMOJI.
 * @returns {HTMLElement}
 */
function createCell(symbolId) {
  const cell = document.createElement('div');
  cell.className = 'reel__cell';

  const img = document.createElement('img');
  img.className = 'reel__symbol-img';
  img.src = `assets/images/symbols/${symbolId}.png`;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.addEventListener('load', () => cell.classList.add('reel__cell--has-image'), { once: true });
  img.addEventListener('error', () => img.remove(), { once: true });

  const sym = document.createElement('span');
  sym.className = 'reel__symbol';
  sym.textContent = SYMBOL_EMOJI[symbolId] ?? '?';

  cell.appendChild(img);
  cell.appendChild(sym);
  return cell;
}

/**
 * Initialises or resets a reel strip with SPIN_CELL_COUNT random cells followed
 * by the three final cells (top, mid, bot). Resets transform so the strip
 * begins at the top of the scroll range.
 * @param {number} reelIndex - 0–4.
 * @param {string} topId - Symbol id for visible top row.
 * @param {string} midId - Symbol id for middle (payline) row.
 * @param {string} botId - Symbol id for visible bottom row.
 */
function setupStrip(reelIndex, topId, midId, botId) {
  const strip = document.getElementById(`strip${reelIndex}`);
  strip.innerHTML = '';

  for (let i = 0; i < SPIN_CELL_COUNT; i++) {
    strip.appendChild(createCell(randomSymbolId()));
  }
  strip.appendChild(createCell(topId));
  strip.appendChild(createCell(midId));
  strip.appendChild(createCell(botId));
}

/**
 * Scrolls a reel strip from the top to its final position (revealing the 3 final
 * symbols) using a CSS transition. The strip must already be set up via setupStrip.
 * @param {number} reelIndex - 0–4.
 * @param {number} spinDuration - Duration of the scroll animation in ms.
 * @returns {Promise<void>} Resolves when the animation completes.
 */
function animateStrip(reelIndex, spinDuration) {
  return new Promise((resolve) => {
    const strip = document.getElementById(`strip${reelIndex}`);
    const cellHeight = getCellHeight();
    const targetOffset = SPIN_CELL_COUNT * cellHeight;

    gsap.set(strip, { y: 0 });
    gsap.to(strip, {
      y: -targetOffset,
      duration: spinDuration / 1000,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}

/**
 * Updates the ARIA label on a reel after it stops.
 * @param {number} reelIndex - 0–4.
 * @param {string} symbolId - The payline symbol id.
 */
function updateReelAriaLabel(reelIndex, symbolId) {
  const reel = document.getElementById(`reel${reelIndex}`);
  const label = SYMBOL_LABEL[symbolId] ?? symbolId;
  reel.setAttribute('aria-label', `Reel ${reelIndex + 1} showing ${label}`);
}

/**
 * Pulses the GRAND jackpot tier indicator using GSAP (4 full pulses, 0.6 s each).
 */
function animateJackpotTier() {
  if (!tierGrandEl) {
    return;
  }
  gsap.fromTo(
    tierGrandEl,
    { scale: 1, boxShadow: '0 0 12px rgb(255 204 0 / 30%)' },
    {
      scale: 1.08,
      boxShadow: '0 0 28px rgb(255 204 0 / 80%)',
      duration: 0.3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 7,
      onComplete: () => gsap.set(tierGrandEl, { clearProps: 'scale,boxShadow' }),
    }
  );
}

/**
 * Applies win-tier visual classes to the winning reels (consecutive from left)
 * and triggers matching celebratory effects.
 * @param {string} winTier - 'none' | 'small' | 'big' | 'jackpot'.
 * @param {number} matchCount - Number of reels from the left that matched.
 */
function applyWinAnimation(winTier, matchCount) {
  if (winTier === 'none') {
    return;
  }

  const winClass = `reel--win-${winTier}`;

  for (let i = 0; i < matchCount; i++) {
    document.getElementById(`reel${i}`).classList.add(winClass);
  }

  if (winTier === 'big' || winTier === 'jackpot') {
    addScreenFlash();
    spawnLightBursts();
    spawnBouncingBalls(winTier === 'jackpot' ? 15 : 8);
    showSlamText(winTier);
  }

  if (winTier === 'small') {
    showSlamText('small');
  }

  if (winTier === 'jackpot') {
    spawnConfetti();
    animateJackpotTier();
  }
}

/**
 * Removes all win-state classes from every reel.
 */
function clearWinClasses() {
  for (let i = 0; i < 5; i++) {
    const reel = document.getElementById(`reel${i}`);
    reel.classList.remove('reel--win-small', 'reel--win-big', 'reel--win-jackpot');
  }
}

/**
 * Shows a win message then fades it after 2.5 s.
 * @param {string} text - Message to display.
 */
function showWinMessage(text) {
  winMessage.textContent = text;
  winMessage.classList.add('visible');
  setTimeout(() => winMessage.classList.remove('visible'), 2500);
}

/**
 * Updates the credits display with an animated count-up and scale pop.
 * @param {number} amount - New credit total.
 */
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

/**
 * Updates the bet amount labels and toggles boundary button states.
 */
function refreshBetDisplay() {
  betAmountLabel.textContent = currentBet;
  betDisplay.textContent = currentBet;
  betDecreaseButton.disabled = currentBet <= MIN_BET;
  betIncreaseButton.disabled = currentBet >= MAX_BET;
}

/**
 * Runs the full spin sequence: sets up strips, triggers scrolling animation reel by
 * reel (staggered), then shows win feedback when all reels have landed.
 * @param {string[][]} reels - 2D array [reel][row] from server (5 reels × 3 rows).
 * @param {string[]} payline - Array of 5 payline symbol ids (middle row).
 * @param {number} payout - Win amount in credits.
 * @param {number} newCredits - Updated credit balance.
 * @param {string} winTier - 'none' | 'small' | 'big' | 'jackpot'.
 * @param {number} matchCount - Consecutive matching reels from the left.
 */
async function runSpinSequence(reels, payline, payout, newCredits, winTier, matchCount) {
  clearWinClasses();

  for (let i = 0; i < 5; i++) {
    setupStrip(i, reels[i][0], reels[i][1], reels[i][2]);
  }

  playSpinSound();
  startBackgroundMusic();

  const baseDuration = 900;

  // Kick off all strips with staggered starts; collect their completion promises
  // so tick sounds and riser sounds fire exactly when each reel physically lands.
  const stripPromises = Array.from({ length: 5 }, (_, i) =>
    new Promise((resolve) => {
      setTimeout(
        () => animateStrip(i, baseDuration + i * STOP_STAGGER_MS).then(resolve),
        i * STOP_STAGGER_MS
      );
    })
  );

  let chainBroken = false;

  for (let i = 0; i < 5; i++) {
    await stripPromises[i];
    playStopTickSound();
    updateReelAriaLabel(i, payline[i]);

    // Play a rising riser tone while the chain is still live (reels 2–4)
    if (i > 0 && !chainBroken) {
      if (payline[i] === payline[0]) {
        if (i < 4) {
          const chainLen = i + 1;
          setTimeout(() => playRiserSound(chainLen), 120);
        }
      } else {
        chainBroken = true;
      }
    }
  }

  // All reels have landed — show win feedback now
  if (payout > 0) {
    playWinSound(winTier);
    applyWinAnimation(winTier, matchCount);

    const SLAM_MESSAGES = {
      jackpot: ['🏆 CHAMPIONSHIP!', '🏀 BUZZER BEATER!', 'NOTHING BUT NET!'],
      big:     ['🔥 FROM DOWNTOWN!', '💪 AND ONE!', '🔥 BIG WIN!'],
    };
    const msgPool = SLAM_MESSAGES[winTier];
    const header = msgPool ? msgPool[Math.floor(Math.random() * msgPool.length)] : '';
    showWinMessage(header ? `${header} +${payout} credits!` : `+${payout} credits`);
  }

  updateCreditsDisplay(newCredits);
  lastWinDisplay.textContent = payout;
  currentCredits = newCredits;
}

/**
 * Handles a spin button press: validates state, calls the API, runs the animation.
 */
async function handleSpin() {
  if (isSpinning) {
    return;
  }
  if (currentCredits < currentBet) {
    showWinMessage('Not enough credits!');
    return;
  }

  isSpinning = true;
  spinButton.disabled = true;
  betDecreaseButton.disabled = true;
  betIncreaseButton.disabled = true;
  winMessage.classList.remove('visible');

  try {
    const result = await postSpin(currentBet, currentCredits);
    await runSpinSequence(
      result.reels,
      result.payline,
      result.payout,
      result.credits,
      result.winTier,
      result.matchCount
    );
  } catch (err) {
    console.error('Spin error:', err);
    showWinMessage('Connection error — try again.');
  } finally {
    isSpinning = false;
    spinButton.disabled = false;
    refreshBetDisplay();
  }
}

/** Handles bet decrease. */
function handleBetDecrease() {
  currentBet = Math.max(MIN_BET, currentBet - BET_STEP);
  refreshBetDisplay();
}

/** Handles bet increase. */
function handleBetIncrease() {
  currentBet = Math.min(MAX_BET, currentBet + BET_STEP);
  refreshBetDisplay();
}

/** Handles mute toggle. */
function handleMuteToggle() {
  const isMuted = muteToggle.getAttribute('aria-pressed') === 'true';
  const nextMuted = !isMuted;
  muteToggle.setAttribute('aria-pressed', String(nextMuted));
  muteIcon.textContent = nextMuted ? '🔇' : '🔊';
  muteToggle.setAttribute('aria-label', nextMuted ? 'Unmute audio' : 'Mute audio');

  import('./audio.js').then(({ setMuted }) => setMuted(nextMuted));
}

/** Toggles the collapsible paytable open/closed. */
function handlePaytableToggle() {
  const isOpen = paytableEl.classList.toggle('paytable--open');
  paytableToggle.setAttribute('aria-expanded', String(isOpen));
}

/**
 * Runs a forced spin for the given win tier (debug mode only).
 * Mirrors handleSpin() but calls postForceSpin instead of postSpin.
 * @param {'none'|'small'|'big'|'jackpot'} winTier - The desired outcome.
 */
async function handleDebugSpin(winTier) {
  if (isSpinning) {
    return;
  }

  isSpinning = true;
  spinButton.disabled = true;
  betDecreaseButton.disabled = true;
  betIncreaseButton.disabled = true;
  winMessage.classList.remove('visible');

  try {
    const result = await postForceSpin(currentBet, currentCredits, winTier);
    await runSpinSequence(
      result.reels,
      result.payline,
      result.payout,
      result.credits,
      result.winTier,
      result.matchCount
    );
  } catch (err) {
    console.error('Debug spin error:', err);
    showWinMessage('Debug spin failed — is DEV_MODE active?');
  } finally {
    isSpinning = false;
    spinButton.disabled = false;
    refreshBetDisplay();
  }
}

/**
 * Initialises the debug UI if window.DEV_MODE is set.
 * No-ops in production builds.
 */
function initDevMode() {
  if (!window.DEV_MODE) {
    return;
  }

  debugButton.removeAttribute('hidden');

  function openModal() {
    debugModal.removeAttribute('hidden');
    debugModal.querySelector('.debug-modal__panel').focus();
  }

  function closeModal() {
    debugModal.setAttribute('hidden', '');
    debugButton.focus();
  }

  debugButton.addEventListener('click', openModal);
  debugModalClose.addEventListener('click', closeModal);

  debugModal.addEventListener('click', (event) => {
    if (event.target === debugModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !debugModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  debugTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      closeModal();
      handleDebugSpin(trigger.dataset.tier);
    });
  });
}

// Wire up event listeners
spinButton.addEventListener('click', handleSpin);
betDecreaseButton.addEventListener('click', handleBetDecrease);
betIncreaseButton.addEventListener('click', handleBetIncrease);
muteToggle.addEventListener('click', handleMuteToggle);
paytableToggle.addEventListener('click', handlePaytableToggle);

// 's' key shortcut to spin
document.addEventListener('keydown', (event) => {
  if (event.key === 's' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const active = document.activeElement;
    if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
      handleSpin();
    }
  }
});

/**
 * Wires up load/error handlers on paytable symbol images.
 * On successful load the parent cell gets .paytable__symbol-cell--has-image,
 * switching the img on and the emoji off via CSS.
 */
function initPaytableImages() {
  document.querySelectorAll('.paytable__symbol-img').forEach((img) => {
    img.addEventListener('load', () => {
      img.closest('.paytable__symbol-cell').classList.add('paytable__symbol-cell--has-image');
    }, { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
  });
}

// Seed all reels with staggered symbols on first load
(function initReels() {
  for (let i = 0; i < 5; i++) {
    const topId = SYMBOL_IDS[i % SYMBOL_IDS.length];
    const midId = SYMBOL_IDS[(i + 1) % SYMBOL_IDS.length];
    const botId = SYMBOL_IDS[(i + 2) % SYMBOL_IDS.length];
    setupStrip(i, topId, midId, botId);
  }
})();

refreshBetDisplay();
updateCreditsDisplay(currentCredits);
initDevMode();
initPaytableImages();
