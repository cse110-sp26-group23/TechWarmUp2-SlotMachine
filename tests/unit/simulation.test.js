/**
 * @fileoverview Simulation test — runs 10,000+ spins to verify RTP and hit frequency targets.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spin, STARTING_CREDITS, MIN_BET } from '../../server/game/game.js';
import { getSymbols } from '../../server/game/paytable.js';

const SPIN_COUNT = 10000;
const BET = MIN_BET;
// Large starting pool so we never run out of credits during simulation
const CREDITS_POOL = SPIN_COUNT * BET * 10;

describe('simulation', () => {
  it('RTP is within ±1% of the 92–95% target range after 10,000 spins', () => {
    let totalBet = 0;
    let totalPayout = 0;
    let credits = CREDITS_POOL;

    for (let i = 0; i < SPIN_COUNT; i++) {
      const result = spin(credits, BET);
      totalBet += BET;
      totalPayout += result.payout;
      credits = result.credits;
    }

    const rtp = totalPayout / totalBet;
    console.log(`Simulated RTP: ${(rtp * 100).toFixed(2)}%`);

    // Target 92–95%, allow ±1% tolerance for statistical variation
    assert.ok(rtp >= 0.91, `RTP ${(rtp * 100).toFixed(2)}% is below the 91% floor`);
    assert.ok(rtp <= 0.96, `RTP ${(rtp * 100).toFixed(2)}% is above the 96% ceiling`);
  });

  it('hit frequency is within the 25–35% target range', () => {
    let hits = 0;
    let credits = CREDITS_POOL;

    for (let i = 0; i < SPIN_COUNT; i++) {
      const result = spin(credits, BET);
      if (result.payout > 0) {
        hits++;
      }
      credits = result.credits;
    }

    const hitFreq = hits / SPIN_COUNT;
    console.log(`Hit frequency: ${(hitFreq * 100).toFixed(2)}%`);

    // Allow ±5% tolerance beyond the 25–35% target for statistical variation
    assert.ok(hitFreq >= 0.20, `Hit freq ${(hitFreq * 100).toFixed(2)}% is below the 20% floor`);
    assert.ok(hitFreq <= 0.40, `Hit freq ${(hitFreq * 100).toFixed(2)}% exceeds the 40% ceiling`);
  });

  it('symbol distribution is logged and every symbol appears', () => {
    const counts = {};
    for (const sym of getSymbols()) {
      counts[sym.id] = 0;
    }
    let credits = CREDITS_POOL;

    for (let i = 0; i < SPIN_COUNT; i++) {
      const result = spin(credits, BET);
      for (const id of result.reels) {
        counts[id]++;
      }
      credits = result.credits;
    }

    const totalDraws = SPIN_COUNT * 3;
    console.log('Symbol distribution:');
    for (const sym of getSymbols()) {
      const pct = ((counts[sym.id] / totalDraws) * 100).toFixed(2);
      console.log(`  ${sym.id}: ${counts[sym.id]} (${pct}%)`);
      assert.ok(counts[sym.id] > 0, `${sym.id} never appeared — possible weight bug`);
    }
  });
});
