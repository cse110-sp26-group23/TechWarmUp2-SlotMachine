/**
 * @fileoverview Integration tests for POST /api/spin — response shape and input validation.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app, startServer } from '../../server/server.js';
import { STARTING_CREDITS, MIN_BET, MAX_BET } from '../../server/game/game.js';

let server;
let baseUrl;

before(() => {
  server = startServer();
  const address = server.address();
  baseUrl = `http://localhost:${address.port}`;
});

after(() => {
  server.close();
});

/**
 * Posts a spin request and returns the parsed JSON response.
 * @param {object} body - Request body.
 * @returns {Promise<{ status: number, body: object }>}
 */
async function postSpin(body) {
  const response = await fetch(`${baseUrl}/api/spin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return { status: response.status, body: json };
}

describe('POST /api/spin', () => {
  it('returns 200 with the expected response shape', async () => {
    const { status, body } = await postSpin({ bet: 10, credits: STARTING_CREDITS });
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body.reels));
    assert.strictEqual(body.reels.length, 3);
    assert.ok(typeof body.payout === 'number');
    assert.ok(typeof body.credits === 'number');
    assert.ok(typeof body.winTier === 'string');
  });

  it('credits decrease by bet on a non-winning spin (statistically likely)', async () => {
    let nonWinFound = false;
    for (let i = 0; i < 50; i++) {
      const { body } = await postSpin({ bet: 10, credits: STARTING_CREDITS });
      if (body.payout === 0) {
        assert.strictEqual(body.credits, STARTING_CREDITS - 10);
        nonWinFound = true;
        break;
      }
    }
    assert.ok(nonWinFound, 'Expected a non-winning spin within 50 tries');
  });

  it('uses STARTING_CREDITS when credits is not provided', async () => {
    const { status, body } = await postSpin({ bet: MIN_BET });
    assert.strictEqual(status, 200);
    assert.ok(body.credits <= STARTING_CREDITS);
  });

  it('returns 400 when bet is missing', async () => {
    const { status } = await postSpin({ credits: STARTING_CREDITS });
    assert.strictEqual(status, 400);
  });

  it('returns 400 when bet is zero', async () => {
    const { status } = await postSpin({ bet: 0, credits: STARTING_CREDITS });
    assert.strictEqual(status, 400);
  });

  it('returns 400 when bet exceeds MAX_BET', async () => {
    const { status } = await postSpin({ bet: MAX_BET + 1, credits: STARTING_CREDITS });
    assert.strictEqual(status, 400);
  });

  it('returns 400 when bet is a non-integer', async () => {
    const { status } = await postSpin({ bet: 1.5, credits: STARTING_CREDITS });
    assert.strictEqual(status, 400);
  });

  it('returns 400 when bet is a string', async () => {
    const { status } = await postSpin({ bet: '10', credits: STARTING_CREDITS });
    assert.strictEqual(status, 400);
  });

  it('returns 400 when credits are insufficient', async () => {
    const { status } = await postSpin({ bet: 10, credits: 5 });
    assert.strictEqual(status, 400);
  });
});
