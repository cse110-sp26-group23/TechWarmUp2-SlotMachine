/**
 * @fileoverview Weighted pseudo-random draw for reel symbols.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import { getSymbols } from './paytable.js';

/**
 * Builds a cumulative weight map from the symbol list.
 * Pre-computed once so repeated draws are O(n) not O(n²).
 * @returns {{ totalWeight: number, thresholds: Array<{symbol: string, threshold: number}> }}
 */
function buildWeightMap() {
  const symbols = getSymbols();
  let cumulative = 0;
  const thresholds = symbols.map((sym) => {
    cumulative += sym.weight;
    return { symbol: sym.id, threshold: cumulative };
  });
  return { totalWeight: cumulative, thresholds };
}

const WEIGHT_MAP = buildWeightMap();

/**
 * Draws a single symbol id using weighted probability.
 * Uses Math.random() as the PRNG — sufficient for no-money entertainment.
 * @returns {string} The id of the drawn symbol.
 */
function drawSymbol() {
  const roll = Math.random() * WEIGHT_MAP.totalWeight;
  for (const entry of WEIGHT_MAP.thresholds) {
    if (roll < entry.threshold) {
      return entry.symbol;
    }
  }
  // Fallback to last symbol (handles float edge cases at upper bound)
  return WEIGHT_MAP.thresholds[WEIGHT_MAP.thresholds.length - 1].symbol;
}

/**
 * Draws one symbol per reel independently and returns the full spin result.
 * @param {number} reelCount - Number of reels to spin.
 * @returns {string[]} Array of symbol ids, one per reel.
 */
function spinReels(reelCount) {
  const result = [];
  for (let i = 0; i < reelCount; i++) {
    result.push(drawSymbol());
  }
  return result;
}

export { drawSymbol, spinReels };
