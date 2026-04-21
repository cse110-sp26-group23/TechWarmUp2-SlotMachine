/**
 * @fileoverview Spin orchestration — combines RNG draw with payout calculation.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import { spinReels } from './rng.js';
import { calculatePayout, classifyWin, countConsecutiveMatch } from './paytable.js';

const REEL_COUNT = 5;
const VISIBLE_ROWS = 3;
const PAYLINE_ROW = 1; // index of the middle (winning) row in each reel column
const STARTING_CREDITS = 1000;
const MIN_BET = 1;
const MAX_BET = 100;

/**
 * Validates that a bet amount is within allowed bounds.
 * @param {number} bet - Proposed bet amount.
 * @returns {boolean} True if valid.
 */
function isValidBet(bet) {
  return Number.isInteger(bet) && bet >= MIN_BET && bet <= MAX_BET;
}

/**
 * Executes a single 5×3 spin and returns the full result.
 * The outcome is fully determined before this function returns.
 * @param {number} credits - Current player credit balance.
 * @param {number} bet - Wager amount for this spin.
 * @returns {{ reels: string[][], payline: string[], payout: number, credits: number, winTier: string, matchCount: number }}
 * @throws {RangeError} If the bet is invalid or credits are insufficient.
 */
function spin(credits, bet) {
  if (!isValidBet(bet)) {
    throw new RangeError(`Bet must be an integer between ${MIN_BET} and ${MAX_BET}.`);
  }
  if (credits < bet) {
    throw new RangeError('Insufficient credits to place this bet.');
  }

  const reels = spinReels(REEL_COUNT, VISIBLE_ROWS);
  const payline = reels.map((col) => col[PAYLINE_ROW]);
  const payout = calculatePayout(payline, bet);
  const updatedCredits = Math.max(0, credits - bet + payout);
  const winTier = classifyWin(payout, bet);
  const matchCount = countConsecutiveMatch(payline);

  return { reels, payline, payout, credits: updatedCredits, winTier, matchCount };
}

export { spin, isValidBet, STARTING_CREDITS, MIN_BET, MAX_BET, REEL_COUNT, PAYLINE_ROW };
