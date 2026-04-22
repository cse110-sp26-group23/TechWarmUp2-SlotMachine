/**
 * @fileoverview Debug route — forced-spin endpoint for dev/test mode only.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Only active when DEV_MODE=true. Returns 403 otherwise.
 * Mount this router at /api/debug in server.js.
 */

'use strict';

import { Router } from 'express';
import { z } from 'zod';
import { drawSymbol } from '../game/rng.js';
import { calculatePayout, classifyWin } from '../game/paytable.js';
import { STARTING_CREDITS, MIN_BET, MAX_BET } from '../game/game.js';

const router = Router();

const ForceTierSchema = z.object({
  tier: z.enum(['jackpot', 'big', 'small', 'none']),
  bet: z
    .number()
    .int()
    .min(MIN_BET)
    .max(MAX_BET),
  credits: z.number().nonnegative().optional().default(STARTING_CREDITS),
});

/**
 * Builds a forced 5-reel result for the given win tier.
 * Top and bottom rows are filled with random symbols for visual realism.
 * @param {'none'|'small'|'big'|'jackpot'} winTier
 * @returns {string[][]} 2D array [reel][row] — 5 reels × 3 rows.
 */
function buildForcedReels(winTier) {
  const paylineSymbols = {
    jackpot: ['ring', 'ring', 'ring', 'ring', 'ring'],
    big:     ['flame', 'flame', 'flame', drawSymbol(), drawSymbol()],
    small:   ['basketball', 'basketball', drawSymbol(), drawSymbol(), drawSymbol()],
    none:    ['basketball', 'sneaker', 'jersey', 'trophy', 'star'],
  };

  const payline = paylineSymbols[winTier] ?? paylineSymbols.none;

  const reels = [];
  for (let i = 0; i < 5; i++) {
    const col = [drawSymbol(), payline[i], drawSymbol()];
    reels.push(col);
  }
  return reels;
}

/**
 * POST /api/debug/force-spin
 *
 * Request body: { bet: number, credits: number, winTier: 'none'|'small'|'big'|'jackpot' }
 * Response: same shape as POST /api/spin
 *
 * Returns 403 if DEV_MODE is not active; 400 on invalid input.
 */
router.post('/force-spin', (req, res) => {
  if (process.env.DEV_MODE !== 'true') {
    return res.status(403).json({ error: 'Debug endpoint not available.' });
  }

  const parsed = ForceTierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { tier, bet, credits } = parsed.data;
  const reels = buildForcedReels(tier);
  const payline = reels.map((col) => col[1]);

  let matchCount = 1;
  for (let i = 1; i < payline.length; i++) {
    if (payline[i] === payline[0]) {
      matchCount++;
    } else {
      break;
    }
  }

  const payout = calculatePayout(payline, bet);
  const resolvedTier = classifyWin(payout, bet);
  const newCredits = Math.max(0, credits - bet + payout);

  return res.json({
    reels,
    payline,
    payout,
    credits: newCredits,
    winTier: resolvedTier,
    matchCount,
  });
});

export default router;
