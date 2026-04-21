/**
 * @fileoverview DOM manipulation, animation orchestration, and event wiring for the slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { postSpin } from './api.js';
import { playSpinSound, playStopTickSound, playWinSound, stopAmbient, startAmbient } from './audio.js';

// Symbol emoji map — mirrors server paytable
const SYMBOL_EMOJI = {
  cherry: '🍒',
  lemon: '🍋',
  orange: '🍊',
  bell: '🔔',
  bar: '🎰',
  seven: '7️⃣',
  diamond: '💎',
};

const SYMBOL_LABEL = {
  cherry: 'Cherry',
  lemon: 'Lemon',
  orange: 'Orange',
  bell: 'Bell',
  bar: 'Bar',
  seven: 'Seven',
  diamond: 'Diamond',
};

const MIN_BET = 1;
const MAX_BET = 100;
const BET_STEP = 5;
const REEL_SPIN_DURATION_MS = 400;
const REEL_STOP_STAGGER_MS = 250;

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

/**
 * Returns the reel DOM element for the given index.
 * @param {number} index - Reel index (0–2).
 * @returns {HTMLElement}
 */
function getReelElement(index) {
  return document.getElementById(`reel${index}`);
}

/**
 * Returns the symbol sub-element inside a reel.
 * @param {HTMLElement} reelEl - The reel container element.
 * @returns {HTMLElement}
 */
function getSymbolElement(reelEl) {
  return reelEl.querySelector('.reel__symbol');
}

/**
 * Updates the credits display and triggers a bump animation.
 * @param {number} amount - New credit total.
 */
function updateCreditsDisplay(amount) {
  creditsDisplay.textContent = amount;
  creditsDisplay.classList.remove('stats__value--bump');
  // Force reflow to restart the animation
  void creditsDisplay.offsetWidth;
  creditsDisplay.classList.add('stats__value--bump');
}

/**
 * Updates the last-win display.
 * @param {number} amount - Last payout amount.
 */
function updateLastWinDisplay(amount) {
  lastWinDisplay.textContent = amount;
}

/**
 * Shows a win message string, then fades it out.
 * @param {string} text - Message to display.
 */
function showWinMessage(text) {
  winMessage.textContent = text;
  winMessage.classList.add('visible');
  setTimeout(() => {
    winMessage.classList.remove('visible');
  }, 2500);
}

/**
 * Updates the bet amount label and disables adjustment buttons at limits.
 */
function refreshBetDisplay() {
  betAmountLabel.textContent = currentBet;
  betDisplay.textContent = currentBet;
  betDecreaseButton.disabled = currentBet <= MIN_BET;
  betIncreaseButton.disabled = currentBet >= MAX_BET;
}

/**
 * Sets a reel into its spinning visual state.
 * @param {HTMLElement} reelEl - The reel container.
 */
function startReelSpin(reelEl) {
  reelEl.classList.add('reel--spinning');
  reelEl.classList.remove('reel--stopping', 'reel--win-small', 'reel--win-big', 'reel--win-jackpot', 'reel--highlight');
}

/**
 * Stops a reel and displays the final symbol.
 * @param {HTMLElement} reelEl - The reel container.
 * @param {string} symbolId - The symbol id to display.
 * @returns {Promise<void>} Resolves after the stop animation completes.
 */
function stopReel(reelEl, symbolId) {
  return new Promise((resolve) => {
    reelEl.classList.remove('reel--spinning');
    reelEl.classList.add('reel--stopping');

    const symbolEl = getSymbolElement(reelEl);
    symbolEl.textContent = SYMBOL_EMOJI[symbolId] ?? symbolId;

    const label = SYMBOL_LABEL[symbolId] ?? symbolId;
    reelEl.setAttribute('aria-label', `Reel showing ${label}`);

    setTimeout(() => {
      reelEl.classList.remove('reel--stopping');
      resolve();
    }, 350);
  });
}

/**
 * Applies win-tier visual feedback classes to the reel elements.
 * @param {string} winTier - One of 'none', 'small', 'big', 'jackpot'.
 */
function applyWinAnimation(winTier) {
  if (winTier === 'none') {
    return;
  }

  const winClass = `reel--win-${winTier}`;

  for (let i = 0; i < 3; i++) {
    const reelEl = getReelElement(i);
    reelEl.classList.add(winClass);
  }

  if (winTier === 'big' || winTier === 'jackpot') {
    addScreenFlash();
  }
}

/**
 * Briefly overlays a screen flash element for high-tier wins.
 */
function addScreenFlash() {
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1200);
}

/**
 * Waits for a number of milliseconds.
 * @param {number} ms - Duration in milliseconds.
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs the full spin sequence: plays audio, animates reels, shows result.
 * @param {string[]} reels - Array of three symbol ids from the server.
 * @param {number} payout - Payout amount in credits.
 * @param {number} newCredits - Updated credit total from the server.
 * @param {string} winTier - Win classification from the server.
 */
async function runSpinSequence(reels, payout, newCredits, winTier) {
  playSpinSound();

  // Start all reels spinning simultaneously
  for (let i = 0; i < 3; i++) {
    startReelSpin(getReelElement(i));
  }

  await delay(REEL_SPIN_DURATION_MS);

  // Stop reels one at a time with stagger for suspense
  for (let i = 0; i < 3; i++) {
    await delay(i === 0 ? 0 : REEL_STOP_STAGGER_MS);
    playStopTickSound();
    await stopReel(getReelElement(i), reels[i]);
  }

  // Show win feedback after all reels have stopped
  if (payout > 0) {
    playWinSound(winTier);
    applyWinAnimation(winTier);

    const message =
      winTier === 'jackpot'
        ? `JACKPOT! +${payout} credits!`
        : winTier === 'big'
        ? `Big win! +${payout} credits!`
        : `+${payout} credits`;

    showWinMessage(message);
  }

  updateCreditsDisplay(newCredits);
  updateLastWinDisplay(payout);
  currentCredits = newCredits;
}

/**
 * Handles a spin button press: validates state, calls the API, and runs the animation.
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
    await runSpinSequence(result.reels, result.payout, result.credits, result.winTier);
  } catch (err) {
    console.error('Spin error:', err);
    showWinMessage('Connection error — try again.');
  } finally {
    isSpinning = false;
    spinButton.disabled = false;
    refreshBetDisplay();
  }
}

/**
 * Handles bet decrease button press.
 */
function handleBetDecrease() {
  currentBet = Math.max(MIN_BET, currentBet - BET_STEP);
  refreshBetDisplay();
}

/**
 * Handles bet increase button press.
 */
function handleBetIncrease() {
  currentBet = Math.min(MAX_BET, currentBet + BET_STEP);
  refreshBetDisplay();
}

/**
 * Handles mute toggle button press.
 */
function handleMuteToggle() {
  const isMuted = muteToggle.getAttribute('aria-pressed') === 'true';
  const nextMuted = !isMuted;

  muteToggle.setAttribute('aria-pressed', String(nextMuted));
  muteIcon.textContent = nextMuted ? '🔇' : '🔊';
  muteToggle.setAttribute('aria-label', nextMuted ? 'Unmute audio' : 'Mute audio');

  if (nextMuted) {
    stopAmbient();
  } else {
    startAmbient();
  }
}

// Wire up event listeners
spinButton.addEventListener('click', handleSpin);
betDecreaseButton.addEventListener('click', handleBetDecrease);
betIncreaseButton.addEventListener('click', handleBetIncrease);
muteToggle.addEventListener('click', handleMuteToggle);

// Keyboard activation for spin (Enter and Space both work via native button behavior)
// Additional keyboard shortcut: 's' key to spin
document.addEventListener('keydown', (event) => {
  if (event.key === 's' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const active = document.activeElement;
    // Only trigger shortcut when focus is not inside an input
    if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
      handleSpin();
    }
  }
});

// Initialize display
refreshBetDisplay();
updateCreditsDisplay(currentCredits);
startAmbient();
