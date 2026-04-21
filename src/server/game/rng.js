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
  return WEIGHT_MAP.thresholds[WEIGHT_MAP.thresholds.length - 1].symbol;
}

/**
 * Spins all reels and returns a 2D array of symbol ids.
 * Each reel is a column of visibleRows independently drawn symbols.
 * The middle row (index 1) is the payline.
 * @param {number} reelCount - Number of reel columns.
 * @param {number} [visibleRows=3] - Number of visible symbol rows per reel.
 * @returns {string[][]} 2D array [reel][row] of symbol ids.
 */
function spinReels(reelCount, visibleRows = 3) {
  const result = [];
  for (let i = 0; i < reelCount; i++) {
    const column = [];
    for (let row = 0; row < visibleRows; row++) {
      column.push(drawSymbol());
    }
    result.push(column);
  }
  return result;
}

export { drawSymbol, spinReels };
