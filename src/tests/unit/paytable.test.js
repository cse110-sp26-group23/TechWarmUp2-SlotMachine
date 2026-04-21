/**
 * @fileoverview Unit tests for paytable.js — basketball symbol definitions and 5-reel payout rules.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getSymbols,
  getSymbolById,
  calculatePayout,
  classifyWin,
  countConsecutiveMatch,
} from '../../server/game/paytable.js';

describe('getSymbols', () => {
  it('returns a non-empty array', () => {
    const symbols = getSymbols();
    assert.ok(Array.isArray(symbols));
    assert.ok(symbols.length > 0);
  });

  it('every symbol has required fields with positive values', () => {
    for (const sym of getSymbols()) {
      assert.ok(typeof sym.id === 'string' && sym.id.length > 0);
      assert.ok(typeof sym.label === 'string');
      assert.ok(typeof sym.emoji === 'string');
      assert.ok(typeof sym.weight === 'number' && sym.weight > 0);
      assert.ok(typeof sym.payouts === 'object' && sym.payouts !== null);
      for (const mult of Object.values(sym.payouts)) {
        assert.ok(typeof mult === 'number' && mult > 0);
      }
    }
  });

  it('all symbol ids are unique', () => {
    const ids = getSymbols().map((s) => s.id);
    const unique = new Set(ids);
    assert.strictEqual(ids.length, unique.size);
  });

  it('total weight sums to 1000', () => {
    const total = getSymbols().reduce((sum, s) => sum + s.weight, 0);
    assert.strictEqual(total, 1000);
  });
});

describe('getSymbolById', () => {
  it('finds a known basketball symbol', () => {
    const sym = getSymbolById('basketball');
    assert.ok(sym);
    assert.strictEqual(sym.id, 'basketball');
  });

  it('returns undefined for an unknown id', () => {
    assert.strictEqual(getSymbolById('cherry'), undefined);
  });
});

describe('countConsecutiveMatch', () => {
  it('counts 5 when all match', () => {
    assert.strictEqual(countConsecutiveMatch(['basketball', 'basketball', 'basketball', 'basketball', 'basketball']), 5);
  });

  it('counts 3 when first 3 match', () => {
    assert.strictEqual(countConsecutiveMatch(['sneaker', 'sneaker', 'sneaker', 'jersey', 'trophy']), 3);
  });

  it('counts 2 when only first 2 match', () => {
    assert.strictEqual(countConsecutiveMatch(['jersey', 'jersey', 'basketball', 'sneaker', 'trophy']), 2);
  });

  it('counts 1 when nothing matches', () => {
    assert.strictEqual(countConsecutiveMatch(['basketball', 'sneaker', 'jersey', 'trophy', 'star']), 1);
  });
});

describe('calculatePayout', () => {
  it('returns correct 5-match payout for every symbol', () => {
    for (const sym of getSymbols()) {
      const payline = [sym.id, sym.id, sym.id, sym.id, sym.id];
      const payout = calculatePayout(payline, 10);
      assert.strictEqual(payout, 10 * sym.payouts[5], `${sym.id} 5-match payout mismatch`);
    }
  });

  it('returns correct 3-match payout when first 3 reels match', () => {
    const sym = getSymbolById('basketball');
    const payline = [sym.id, sym.id, sym.id, 'sneaker', 'jersey'];
    assert.strictEqual(calculatePayout(payline, 10), 10 * sym.payouts[3]);
  });

  it('returns correct 2-match payout when first 2 reels match', () => {
    const sym = getSymbolById('trophy');
    const payline = [sym.id, sym.id, 'basketball', 'sneaker', 'jersey'];
    assert.strictEqual(calculatePayout(payline, 10), 10 * sym.payouts[2]);
  });

  it('returns 0 when match starts at reel 2 (not reel 1)', () => {
    assert.strictEqual(
      calculatePayout(['basketball', 'sneaker', 'sneaker', 'sneaker', 'sneaker'], 10),
      0
    );
  });

  it('returns 0 for no match', () => {
    assert.strictEqual(
      calculatePayout(['basketball', 'sneaker', 'jersey', 'trophy', 'star'], 10),
      0
    );
  });

  it('returns 0 for wrong array length', () => {
    assert.strictEqual(calculatePayout(['basketball', 'basketball', 'basketball'], 10), 0);
  });

  it('no combination ever returns a negative value', () => {
    for (const sym of getSymbols()) {
      const full = [sym.id, sym.id, sym.id, sym.id, sym.id];
      assert.ok(calculatePayout(full, 10) >= 0);
      const partial = [sym.id, sym.id, 'basketball', 'sneaker', 'jersey'];
      assert.ok(calculatePayout(partial, 10) >= 0);
    }
  });
});

describe('classifyWin', () => {
  it('returns "none" when payout is zero', () => {
    assert.strictEqual(classifyWin(0, 10), 'none');
  });

  it('returns "none" when payout equals bet', () => {
    assert.strictEqual(classifyWin(10, 10), 'none');
  });

  it('returns "small" for a 2-match win', () => {
    assert.strictEqual(classifyWin(20, 10), 'small');
  });

  it('returns "big" for star 3-match (75×)', () => {
    const star = getSymbolById('star');
    assert.strictEqual(classifyWin(10 * star.payouts[3], 10), 'big');
  });

  it('returns "jackpot" for ring 3-match (500×)', () => {
    const ring = getSymbolById('ring');
    assert.strictEqual(classifyWin(10 * ring.payouts[3], 10), 'jackpot');
  });

  it('returns "jackpot" for any 5-match of ring (10000×)', () => {
    const ring = getSymbolById('ring');
    assert.strictEqual(classifyWin(10 * ring.payouts[5], 10), 'jackpot');
  });
});
