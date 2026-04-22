# Claude Code Prompt: Refinement Lib-04 — Zod Schema Validation

You are refining a browser-based slot machine app. Make sure to continue to adhere to `src/ai-plan.md` and `src/slot-prd.md`.

---

## Change for this step

Replace the manual `typeof` / `Number.isInteger()` / range-check validation in the server-side route handlers with **Zod**, the most popular JavaScript/TypeScript schema validation library. Zod makes validation declarative, self-documenting, and consistent — a complex chain of if-guards becomes a single `.safeParse()` call.

Install via npm:

```
npm install zod
```

Import in route files:

```js
import { z } from 'zod';
```

---

### 1. Replace validation in `src/server/routes/spin.js`

**Before:** a sequence of manual checks:

```js
if (typeof body.bet !== 'number') { return res.status(400)... }
if (!Number.isInteger(body.bet))  { return res.status(400)... }
if (body.bet < MIN_BET || body.bet > MAX_BET) { return res.status(400)... }
// etc.
```

**After:** define a schema at the top of the file (outside the route handler, so it is created once):

```js
import { z } from 'zod';
import { STARTING_CREDITS, MIN_BET, MAX_BET } from '../game/game.js';

const SpinBodySchema = z.object({
  bet: z
    .number({ invalid_type_error: 'bet must be a number' })
    .int('bet must be an integer')
    .min(MIN_BET, `bet must be at least ${MIN_BET}`)
    .max(MAX_BET, `bet must be at most ${MAX_BET}`),
  credits: z
    .number()
    .nonnegative()
    .optional()
    .default(STARTING_CREDITS),
});
```

Then in the route handler:

```js
router.post('/spin', (req, res) => {
  const parsed = SpinBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { bet, credits } = parsed.data;
  // ... rest of handler unchanged
});
```

Note: Zod's `.int()` check rejects non-integer numbers (e.g. `1.5`) and its type check rejects strings — the existing `spin.route.test.js` cases for string bets and non-integer bets will still pass.

---

### 2. Replace validation in `src/server/routes/debug.js`

**Before:** manual check on the `tier` string against an allowlist.

**After:**

```js
const ForceTierSchema = z.object({
  tier: z.enum(['jackpot', 'big', 'small', 'none']),
  bet: z
    .number()
    .int()
    .min(MIN_BET)
    .max(MAX_BET),
  credits: z
    .number()
    .nonnegative()
    .optional()
    .default(STARTING_CREDITS),
});

router.post('/force-spin', (req, res) => {
  if (process.env.DEV_MODE !== 'true') {
    return res.status(403).json({ error: 'Debug endpoint not available.' });
  }
  const parsed = ForceTierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { tier, bet, credits } = parsed.data;
  // ... rest of handler unchanged
});
```

---

### 3. Keep `isValidBet()` in `game.js`

`game.js` still needs `isValidBet()` as a pure function — the `spin()` function throws `RangeError` on invalid input to protect against direct (non-HTTP) callers. Do not remove it. The Zod schemas in the route layer are the HTTP-boundary guard; `isValidBet()` is the domain-layer guard.

---

### 4. Update tests

The existing `spin.route.test.js` tests for 400 responses cover:
- missing bet
- bet = 0 (below MIN_BET)
- bet > MAX_BET
- non-integer bet (1.5)
- string bet ('10')
- insufficient credits

All of these will still return 400 with Zod in place. Verify by running `npm run test:unit` after the change.

---

### 5. Cleanup

- Remove the manual `typeof`, `Number.isInteger()`, and range-check guards that are now handled by Zod.
- The error message format changes slightly (now includes the Zod issue message). Update any test that asserts on the specific error string if necessary.
- Run `npm run lint && npm run test:unit` and fix any issues.

Always make sure to check work against `ai-plan.md` and test.
