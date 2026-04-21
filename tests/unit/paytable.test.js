/**
 * @fileoverview Unit tests for paytable.js — symbol definitions and payout rules.
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
  TWO_MATCH_MULTIPLIER,
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
      assert.ok(typeof sym.multiplier === 'number' && sym.multiplier > 0);
    }
  });

  it('all symbol ids are unique', () => {
    const ids = getSymbols().map((s) => s.id);
    const unique = new Set(ids);
    assert.strictEqual(ids.length, unique.size);
  });
});

describe('getSymbolById', () => {
  it('finds a known symbol', () => {
    const sym = getSymbolById('cherry');
    assert.ok(sym);
    assert.strictEqual(sym.id, 'cherry');
  });

  it('returns undefined for unknown id', () => {
    assert.strictEqual(getSymbolById('unknown_xyz'), undefined);
  });
});

describe('calculatePayout', () => {
  it('returns correct payout for 3-of-a-kind at bet 10', () => {
    for (const sym of getSymbols()) {
      const payout = calculatePayout([sym.id, sym.id, sym.id], 10);
      assert.strictEqual(payout, 10 * sym.multiplier, `${sym.id} 3oak payout mismatch`);
    }
  });

  it('returns 2× bet when first two reels match but third does not', () => {
    const payout = calculatePayout(['cherry', 'cherry', 'lemon'], 10);
    assert.strictEqual(payout, 10 * TWO_MATCH_MULTIPLIER);
  });

  it('returns 0 when only reels 2 and 3 match', () => {
    assert.strictEqual(calculatePayout(['lemon', 'cherry', 'cherry'], 10), 0);
  });

  it('returns 0 for no match', () => {
    assert.strictEqual(calculatePayout(['cherry', 'lemon', 'orange'], 10), 0);
  });

  it('returns 0 for wrong array length', () => {
    assert.strictEqual(calculatePayout(['cherry', 'cherry'], 10), 0);
  });

  it('no combination ever returns a negative value', () => {
    for (const sym of getSymbols()) {
      assert.ok(calculatePayout([sym.id, sym.id, sym.id], 10) >= 0);
      assert.ok(calculatePayout([sym.id, sym.id, 'lemon'], 10) >= 0);
    }
    assert.ok(calculatePayout(['cherry', 'lemon', 'orange'], 10) >= 0);
  });
});

describe('classifyWin', () => {
  it('returns "none" when payout is zero', () => {
    assert.strictEqual(classifyWin(0, 10), 'none');
  });

  it('returns "none" when payout equals bet (net-zero)', () => {
    assert.strictEqual(classifyWin(10, 10), 'none');
  });

  it('returns "small" for a 2-match win (2× bet)', () => {
    assert.strictEqual(classifyWin(20, 10), 'small');
  });

  it('returns "small" for cherry/lemon 3oak', () => {
    const cherry = getSymbolById('cherry');
    assert.strictEqual(classifyWin(10 * cherry.multiplier, 10), 'small');
  });

  it('returns "big" for bell 3oak', () => {
    const bell = getSymbolById('bell');
    assert.strictEqual(classifyWin(10 * bell.multiplier, 10), 'big');
  });

  it('returns "jackpot" for bar/seven/diamond 3oak', () => {
    for (const id of ['bar', 'seven', 'diamond']) {
      const sym = getSymbolById(id);
      assert.strictEqual(classifyWin(10 * sym.multiplier, 10), 'jackpot', `${id} should be jackpot`);
    }
  });
});
