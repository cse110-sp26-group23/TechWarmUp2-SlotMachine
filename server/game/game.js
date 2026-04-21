/**
 * @fileoverview Spin orchestration — combines RNG draw with payout calculation.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import { spinReels } from './rng.js';
import { calculatePayout, classifyWin } from './paytable.js';

const REEL_COUNT = 3;
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
 * Executes a single spin and returns the full result.
 * The outcome is fully determined before this function returns — animation is the client's concern.
 * @param {number} credits - Current player credit balance.
 * @param {number} bet - The wager amount for this spin.
 * @returns {{ reels: string[], payout: number, credits: number, winTier: string }}
 * @throws {RangeError} If the bet is invalid or credits are insufficient.
 */
function spin(credits, bet) {
  if (!isValidBet(bet)) {
    throw new RangeError(`Bet must be an integer between ${MIN_BET} and ${MAX_BET}.`);
  }
  if (credits < bet) {
    throw new RangeError('Insufficient credits to place this bet.');
  }

  const reels = spinReels(REEL_COUNT);
  const payout = calculatePayout(reels, bet);
  const updatedCredits = Math.max(0, credits - bet + payout);
  const winTier = classifyWin(payout, bet);

  return { reels, payout, credits: updatedCredits, winTier };
}

export { spin, isValidBet, STARTING_CREDITS, MIN_BET, MAX_BET };
