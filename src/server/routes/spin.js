/**
 * @fileoverview Express route handler for POST /api/spin.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import { Router } from 'express';
import { z } from 'zod';
import { spin, STARTING_CREDITS, MIN_BET, MAX_BET } from '../game/game.js';

const router = Router();

const SpinBodySchema = z.object({
  bet: z
    .number({ invalid_type_error: 'bet must be a number' })
    .int('bet must be an integer')
    .min(MIN_BET, `bet must be at least ${MIN_BET}`)
    .max(MAX_BET, `bet must be at most ${MAX_BET}`),
  credits: z.number().nonnegative().optional().default(STARTING_CREDITS),
});

/**
 * POST /api/spin
 *
 * Request body: { bet: number, credits: number }
 * Response:     { reels: string[], payout: number, credits: number, winTier: string }
 *
 * Returns 400 on invalid input; 500 on unexpected server errors.
 */
router.post('/spin', (req, res) => {
  const parsed = SpinBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { bet, credits } = parsed.data;

  try {
    const result = spin(credits, bet);
    return res.json(result);
  } catch (err) {
    if (err instanceof RangeError) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Unexpected spin error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
