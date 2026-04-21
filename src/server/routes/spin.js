/**
 * @fileoverview Express route handler for POST /api/spin.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import { Router } from 'express';
import { spin, isValidBet, STARTING_CREDITS, MIN_BET, MAX_BET } from '../game/game.js';

const router = Router();

/**
 * POST /api/spin
 *
 * Request body: { bet: number, credits: number }
 * Response:     { reels: string[], payout: number, credits: number, winTier: string }
 *
 * Returns 400 on invalid input; 500 on unexpected server errors.
 */
router.post('/spin', (req, res) => {
  const { bet, credits } = req.body;

  if (typeof bet !== 'number') {
    return res.status(400).json({ error: 'bet must be a number.' });
  }

  if (!isValidBet(bet)) {
    return res
      .status(400)
      .json({ error: `bet must be an integer between ${MIN_BET} and ${MAX_BET}.` });
  }

  const currentCredits =
    typeof credits === 'number' && credits >= 0 ? credits : STARTING_CREDITS;

  try {
    const result = spin(currentCredits, bet);
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
