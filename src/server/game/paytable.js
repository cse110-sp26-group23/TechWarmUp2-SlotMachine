/**
 * @fileoverview Basketball-themed symbol definitions, reel weights, and 5-reel payout rules.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Game math targets: RTP ~94%, hit frequency ~25%, medium volatility.
 *
 * Win rule: count consecutive matching symbols in the payline row from left to
 * right. The payouts object maps match count (2–5) to bet multiplier.
 * Only matches starting from reel 0 pay.
 *
 * Simulated RTP breakdown (total weight = 1000):
 *   P(2-match) ≈ 17.9%  →  RTP contribution ≈ 35.9%
 *   P(3-match) ≈  5.1%  →  RTP contribution ≈ 24.8%
 *   P(4-match) ≈  1.6%  →  RTP contribution ≈ 16.2%
 *   P(5-match) ≈  0.6%  →  RTP contribution ≈ 17.3%
 *   Total RTP ≈ 94.2%, hit frequency ≈ 25.2%
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
    id: 'basketball', label: 'Basketball', emoji: '🏀', weight: 350,
    payouts: { 2: 2, 3: 4, 4: 8, 5: 20 },
  },
  {
    id: 'sneaker', label: 'Sneaker', emoji: '👟', weight: 280,
    payouts: { 2: 2, 3: 5, 4: 12, 5: 30 },
  },
  {
    id: 'jersey', label: 'Jersey', emoji: '👕', weight: 200,
    payouts: { 2: 2, 3: 6, 4: 20, 5: 50 },
  },
  {
    id: 'trophy', label: 'Trophy', emoji: '🏆', weight: 100,
    payouts: { 2: 2, 3: 12, 4: 40, 5: 100 },
  },
  {
    id: 'star', label: 'All-Star', emoji: '⭐', weight: 45,
    payouts: { 2: 3, 3: 75, 4: 300, 5: 1000 },
  },
  {
    id: 'flame', label: 'Hot Streak', emoji: '🔥', weight: 20,
    payouts: { 2: 5, 3: 200, 4: 1000, 5: 3000 },
  },
  {
    id: 'ring', label: 'Championship Ring', emoji: '💍', weight: 5,
    payouts: { 2: 10, 3: 500, 4: 2500, 5: 10000 },
  },
];

/**
 * Win tier thresholds (payout-to-bet ratio).
 * @type {{ BIG: number, JACKPOT: number }}
 */
const WIN_TIERS = {
  BIG: 15,
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
