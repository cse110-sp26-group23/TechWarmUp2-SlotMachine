/**
 * @fileoverview Unit tests for rng.js — weighted draw and reel spin functions.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { drawSymbol, spinReels } from '../../server/game/rng.js';
import { getSymbols } from '../../server/game/paytable.js';

const VALID_IDS = new Set(getSymbols().map((s) => s.id));

describe('drawSymbol', () => {
  it('returns a valid symbol id', () => {
    for (let i = 0; i < 100; i++) {
      assert.ok(VALID_IDS.has(drawSymbol()), 'drawSymbol must return a valid id');
    }
  });

  it('distribution roughly matches weights over many draws', () => {
    const DRAWS = 50000;
    const counts = {};
    for (const sym of getSymbols()) {
      counts[sym.id] = 0;
    }

    for (let i = 0; i < DRAWS; i++) {
      counts[drawSymbol()]++;
    }

    const totalWeight = getSymbols().reduce((sum, s) => sum + s.weight, 0);

    for (const sym of getSymbols()) {
      const expected = (sym.weight / totalWeight) * DRAWS;
      const actual = counts[sym.id];
      // Allow ±30% tolerance to avoid flaky tests while still catching gross bugs
      assert.ok(
        actual >= expected * 0.7 && actual <= expected * 1.3,
        `${sym.id}: expected ~${expected.toFixed(0)}, got ${actual}`
      );
    }
  });
});

describe('spinReels', () => {
  it('returns an array of the requested length', () => {
    assert.strictEqual(spinReels(3).length, 3);
    assert.strictEqual(spinReels(5).length, 5);
  });

  it('all returned values are valid symbol ids', () => {
    const reels = spinReels(3);
    for (const id of reels) {
      assert.ok(VALID_IDS.has(id), `${id} must be a valid symbol id`);
    }
  });

  it('reels spin independently (not all identical over many spins)', () => {
    let allSame = true;
    for (let i = 0; i < 100; i++) {
      const [a, b, c] = spinReels(3);
      if (a !== b || b !== c) {
        allSame = false;
        break;
      }
    }
    assert.ok(!allSame, 'Reels should not always produce the same symbol');
  });
});
