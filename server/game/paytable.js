/**
 * @fileoverview Defines symbol tiers, reel weights, and payout rules for the slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Game math targets: RTP ~92–95%, hit frequency ~25–35%, medium volatility.
 *
 * Win rules (highest applicable wins):
 *   1. Three of a kind (all 3 reels same): pays bet × symbol.multiplier
 *   2. First two reels match (reel1 === reel2, reel3 different): pays bet × TWO_MATCH_MULTIPLIER
 *
 * Achieving ~93% RTP and ~26% hit frequency:
 *   P(reel1 = reel2) = Σ(p_s²) ≈ 0.264  → hit frequency 26.4%
 *   RTP_2match  = P(2-only) × 2         ≈ 0.370
 *   RTP_3oak    = Σ(p_s³ × m_s)         ≈ 0.557
 *   Total RTP                            ≈ 92.7%
 */

'use strict';

/**
 * Symbol definitions with weights (out of 1000 total) and 3-of-a-kind multipliers.
 *
 * Tiers:
 *   Common    (×3): Cherry, Lemon, Orange
 *   Uncommon  (×2): Bell, Bar
 *   Rare      (×1): Seven
 *   Jackpot   (×1): Diamond
 * @type {Array<{id: string, label: string, emoji: string, weight: number, multiplier: number}>}
 */
const SYMBOLS = [
  { id: 'cherry',  label: 'Cherry',  emoji: '🍒', weight: 350, multiplier: 5    },
  { id: 'lemon',   label: 'Lemon',   emoji: '🍋', weight: 300, multiplier: 7    },
  { id: 'orange',  label: 'Orange',  emoji: '🍊', weight: 200, multiplier: 12   },
  { id: 'bell',    label: 'Bell',    emoji: '🔔', weight: 100, multiplier: 44   },
  { id: 'bar',     label: 'Bar',     emoji: '🎰', weight: 40,  multiplier: 200  },
  { id: 'seven',   label: 'Seven',   emoji: '7️⃣',  weight: 8,   multiplier: 1000 },
  { id: 'diamond', label: 'Diamond', emoji: '💎', weight: 2,   multiplier: 5000 },
];

/**
 * Payout multiplier awarded when the first two reels match but the third does not.
 * This drives hit frequency up to ~26% while keeping RTP ~93%.
 * @type {number}
 */
const TWO_MATCH_MULTIPLIER = 2;

/**
 * Win tier thresholds expressed as a ratio of payout-to-bet.
 * Used to select animation and audio tier; no false wins below 1× are celebrated.
 * @type {{ BIG: number, JACKPOT: number }}
 */
const WIN_TIERS = {
  BIG: 15,    // ratio ≥ 15 → big win (Bell 3oak = 44×)
  JACKPOT: 100, // ratio ≥ 100 → jackpot (Bar 200×, Seven 1000×, Diamond 5000×)
};

/**
 * Returns all symbol definitions.
 * @returns {Array<{id: string, label: string, emoji: string, weight: number, multiplier: number}>}
 */
function getSymbols() {
  return SYMBOLS;
}

/**
 * Looks up a symbol by its id.
 * @param {string} id - Symbol identifier.
 * @returns {{id: string, label: string, emoji: string, weight: number, multiplier: number}|undefined}
 */
function getSymbolById(id) {
  return SYMBOLS.find((symbol) => symbol.id === id);
}

/**
 * Calculates the payout for a given spin result and bet.
 *
 * Priority order:
 *   1. Three of a kind → bet × symbol.multiplier
 *   2. First two reels match → bet × TWO_MATCH_MULTIPLIER
 *   3. No win → 0
 *
 * @param {string[]} reels - Array of exactly three symbol ids (one per reel).
 * @param {number} bet - The wager amount in credits.
 * @returns {number} Payout in credits (0 if no win).
 */
function calculatePayout(reels, bet) {
  if (reels.length !== 3) {
    return 0;
  }

  const [first, second, third] = reels;

  if (first === second && second === third) {
    const symbol = getSymbolById(first);
    return symbol ? bet * symbol.multiplier : 0;
  }

  if (first === second) {
    return bet * TWO_MATCH_MULTIPLIER;
  }

  return 0;
}

/**
 * Classifies a payout into a win tier string based on the payout-to-bet ratio.
 * Returns 'none' for net-zero or net-loss results — no false-win celebrations.
 * @param {number} payout - The payout returned by calculatePayout.
 * @param {number} bet - The wager amount in credits.
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

export {
  SYMBOLS,
  WIN_TIERS,
  TWO_MATCH_MULTIPLIER,
  getSymbols,
  getSymbolById,
  calculatePayout,
  classifyWin,
};
