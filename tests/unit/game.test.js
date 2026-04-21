/**
 * @fileoverview Unit tests for game.js — spin orchestration and payout logic.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spin, isValidBet, STARTING_CREDITS, MIN_BET, MAX_BET } from '../../server/game/game.js';
import { getSymbols, calculatePayout } from '../../server/game/paytable.js';

const VALID_IDS = new Set(getSymbols().map((s) => s.id));

describe('isValidBet', () => {
  it('accepts a valid bet', () => {
    assert.ok(isValidBet(10));
    assert.ok(isValidBet(MIN_BET));
    assert.ok(isValidBet(MAX_BET));
  });

  it('rejects out-of-range bets', () => {
    assert.ok(!isValidBet(0));
    assert.ok(!isValidBet(MAX_BET + 1));
    assert.ok(!isValidBet(-1));
  });

  it('rejects non-integer bets', () => {
    assert.ok(!isValidBet(1.5));
    assert.ok(!isValidBet('10'));
    assert.ok(!isValidBet(null));
  });
});

describe('spin', () => {
  it('returns an object with the expected shape', () => {
    const result = spin(STARTING_CREDITS, 10);
    assert.ok(Array.isArray(result.reels));
    assert.strictEqual(result.reels.length, 3);
    assert.ok(typeof result.payout === 'number');
    assert.ok(typeof result.credits === 'number');
    assert.ok(typeof result.winTier === 'string');
  });

  it('all reel symbols are valid', () => {
    for (let i = 0; i < 20; i++) {
      const { reels } = spin(STARTING_CREDITS, 10);
      for (const id of reels) {
        assert.ok(VALID_IDS.has(id), `${id} must be a valid symbol id`);
      }
    }
  });

  it('credits decrease by bet on a losing spin (forced by checking balance)', () => {
    // Run enough spins that at least one should be a loss
    let lossFound = false;
    for (let i = 0; i < 200; i++) {
      const result = spin(STARTING_CREDITS, 10);
      if (result.payout === 0) {
        assert.strictEqual(result.credits, STARTING_CREDITS - 10);
        lossFound = true;
        break;
      }
    }
    assert.ok(lossFound, 'Expected at least one losing spin in 200 tries');
  });

  it('credits never go below zero', () => {
    let credits = 5;
    for (let i = 0; i < 50; i++) {
      try {
        const result = spin(credits, MIN_BET);
        assert.ok(result.credits >= 0);
        credits = result.credits;
      } catch {
        // Insufficient credits — that is fine, stop the loop
        break;
      }
    }
  });

  it('throws RangeError for invalid bet', () => {
    assert.throws(() => spin(STARTING_CREDITS, 0), RangeError);
    assert.throws(() => spin(STARTING_CREDITS, MAX_BET + 1), RangeError);
    assert.throws(() => spin(STARTING_CREDITS, 1.5), RangeError);
  });

  it('throws RangeError when credits are insufficient', () => {
    assert.throws(() => spin(0, MIN_BET), RangeError);
    assert.throws(() => spin(5, 10), RangeError);
  });

  it('payout calculation is correct for each win tier', () => {
    for (const sym of getSymbols()) {
      const expectedPayout = sym.multiplier * 10;
      const actualPayout = calculatePayout([sym.id, sym.id, sym.id], 10);
      assert.strictEqual(actualPayout, expectedPayout);
    }
  });
});
