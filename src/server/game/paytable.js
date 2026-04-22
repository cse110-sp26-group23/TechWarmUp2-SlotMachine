/**
 * @fileoverview Basketball-themed symbol definitions, reel weights, and 5-reel payout rules.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Game math targets: RTP ~91–95%, hit frequency ~42–47%, medium volatility.
 *
 * Win rule: count consecutive matching symbols in the payline row from left to
 * right. The payouts object maps match count (2–5) to bet multiplier.
 * Only matches starting from reel 0 pay.
 *
 * Weights rebalanced for Refinement 2: common symbols heavier, multipliers
 * reduced proportionally to maintain RTP while increasing hit frequency.
 */

'use strict';

/**
 * Basketball-themed symbol definitions.
 * Tiers: Common (Basketball, Sneaker, Jersey), Uncommon (Trophy),
 *        Rare (All-Star, Hot Streak), Jackpot (Championship Ring).
 * payouts maps consecutive-match count → bet multiplier.
 * @type {Array<{id: string, label: string, emoji: string, weight: number, payouts: Record<number,number>}>}
 */
const SYMBOLS = [
  {
    id: 'basketball', label: 'Basketball', emoji: '🏀', weight: 420,
    payouts: { 2: 2, 3: 3, 4: 4, 5: 12 },
  },
  {
    id: 'sneaker', label: 'Sneaker', emoji: '👟', weight: 300,
    payouts: { 2: 2, 3: 4, 4: 8, 5: 18 },
  },
  {
    id: 'jersey', label: 'Jersey', emoji: '👕', weight: 180,
    payouts: { 2: 2, 3: 5, 4: 12, 5: 35 },
  },
  {
    id: 'trophy', label: 'Trophy', emoji: '🏆', weight: 65,
    payouts: { 2: 2, 3: 10, 4: 30, 5: 75 },
  },
  {
    id: 'star', label: 'All-Star', emoji: '⭐', weight: 25,
    payouts: { 2: 3, 3: 60, 4: 220, 5: 700 },
  },
  {
    id: 'flame', label: 'Hot Streak', emoji: '🔥', weight: 8,
    payouts: { 2: 5, 3: 150, 4: 700, 5: 2200 },
  },
  {
    id: 'ring', label: 'Championship Ring', emoji: '💍', weight: 2,
    payouts: { 2: 10, 3: 400, 4: 1800, 5: 7500 },
  },
];

/**
 * Win tier thresholds (payout-to-bet ratio).
 * @type {{ BIG: number, JACKPOT: number }}
 */
const WIN_TIERS = {
  BIG: 12,
  JACKPOT: 100,
};

/**
 * Returns all symbol definitions.
 * @returns {Array<{id: string, label: string, emoji: string, weight: number, payouts: Record<number,number>}>}
 */
function getSymbols() {
  return SYMBOLS;
}

/**
 * Looks up a symbol by its id.
 * @param {string} id - Symbol identifier.
 * @returns {{id: string, label: string, emoji: string, weight: number, payouts: Record<number,number>}|undefined}
 */
function getSymbolById(id) {
  return SYMBOLS.find((s) => s.id === id);
}

/**
 * Counts consecutive matching symbols from reel 0 in the payline.
 * @param {string[]} payline - Array of symbol ids, one per reel (left to right).
 * @returns {number} Length of the consecutive run starting at index 0.
 */
function countConsecutiveMatch(payline) {
  const first = payline[0];
  let count = 1;
  for (let i = 1; i < payline.length; i++) {
    if (payline[i] === first) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * Calculates the payout for a 5-reel spin based on the payline symbols.
 * @param {string[]} payline - Array of exactly 5 symbol ids (middle row of each reel).
 * @param {number} bet - Wager amount in credits.
 * @returns {number} Payout in credits (0 if no win).
 */
function calculatePayout(payline, bet) {
  if (payline.length !== 5) {
    return 0;
  }

  const matchCount = countConsecutiveMatch(payline);
  if (matchCount < 2) {
    return 0;
  }

  const symbol = getSymbolById(payline[0]);
  if (!symbol || !symbol.payouts[matchCount]) {
    return 0;
  }

  return bet * symbol.payouts[matchCount];
}

/**
 * Classifies a payout into a win-tier string for animation and audio selection.
 * Returns 'none' for net-zero or net-loss — no false-win celebrations.
 * @param {number} payout - Payout from calculatePayout.
 * @param {number} bet - Wager amount in credits.
 * @returns {'none'|'small'|'big'|'jackpot'}
 */
function classifyWin(payout, bet) {
  if (payout <= bet) {
    return 'none';
  }
  const ratio = payout / bet;
  if (ratio >= WIN_TIERS.JACKPOT) {
    return 'jackpot';
  }
  if (ratio >= WIN_TIERS.BIG) {
    return 'big';
  }
  return 'small';
}

export { SYMBOLS, WIN_TIERS, getSymbols, getSymbolById, calculatePayout, classifyWin, countConsecutiveMatch };
