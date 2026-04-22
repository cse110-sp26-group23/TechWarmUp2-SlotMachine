/**
 * @fileoverview All fetch calls to the server. No game logic lives here.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

// Point the client at the server. Override via window.ENV_API_BASE for remote deployments.
const API_BASE = window.ENV_API_BASE ?? 'http://localhost:3000';

/**
 * Sends a spin request to the server.
 * @param {number} bet - The wager amount in credits.
 * @param {number} credits - The player's current credit balance.
 * @returns {Promise<{ reels: string[], payout: number, credits: number, winTier: string }>}
 * @throws {Error} If the network request fails or the server returns a non-ok status.
 */
async function postSpin(bet, credits) {
  const response = await fetch(`${API_BASE}/api/spin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bet, credits }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error ?? `Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Sends a forced-spin request to the debug endpoint.
 * Only works when the server is running in DEV_MODE.
 * @param {number} bet - The wager amount in credits.
 * @param {number} credits - The player's current credit balance.
 * @param {'none'|'small'|'big'|'jackpot'} winTier - The desired outcome tier.
 * @returns {Promise<{ reels: string[][], payout: number, credits: number, winTier: string, matchCount: number }>}
 * @throws {Error} If the network request fails or the server returns a non-ok status.
 */
async function postForceSpin(bet, credits, winTier) {
  const response = await fetch(`${API_BASE}/api/debug/force-spin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bet, credits, winTier }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error ?? `Server error: ${response.status}`);
  }

  return response.json();
}

export { postSpin, postForceSpin };
