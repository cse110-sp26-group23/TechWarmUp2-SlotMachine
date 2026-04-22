# Claude Code Prompt: Refinement Lib-05 — Helmet, Morgan, express-rate-limit

You are refining a browser-based slot machine app. Make sure to continue to adhere to `src/ai-plan.md` and `src/slot-prd.md`.

---

## Change for this step

Add three small, standard Express middleware libraries to `src/server/server.js`:

- **Helmet** — sets secure HTTP response headers in one line (OWASP top-10 mitigations for HTTP headers).
- **Morgan** — HTTP request logger; makes development debugging and server observability dramatically easier.
- **express-rate-limit** — protects the `/api/spin` endpoint from abuse (rapid automated requests would let a client hammer the RNG without real user input).

All three are among the most downloaded Express middleware packages, are actively maintained, and require essentially no configuration to be useful.

Install:

```
npm install helmet morgan express-rate-limit
```

---

### 1. Add Helmet to `server.js`

Import and mount before all other middleware so headers are set on every response:

```js
import helmet from 'helmet';

app.use(helmet());
```

Helmet sets: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, and several others. The defaults are production-safe.

**Note:** Helmet's default CSP will block inline scripts. The DEV_MODE injection currently injects a `<script>window.DEV_MODE = true;</script>` tag inline into the HTML. To keep this working, either:
- Move the DEV_MODE value to a small external JS file that Helmet's CSP allows, **or**
- Add a `nonce` to the CSP for that specific script tag, **or**
- Disable only the CSP directive for development:
  ```js
  app.use(helmet({ contentSecurityPolicy: process.env.DEV_MODE === 'true' ? false : undefined }));
  ```

The third option is the simplest and acceptable since DEV_MODE is already only active in development.

---

### 2. Add Morgan to `server.js`

Import and mount after Helmet, before routes:

```js
import morgan from 'morgan';

app.use(morgan('dev'));
```

The `'dev'` format outputs concise colorized logs:

```
POST /api/spin 200 4.321 ms - 312
GET  /         200 1.043 ms - 4521
```

In production, switch to `'combined'` for Apache-format logs suitable for log aggregators:

```js
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

---

### 3. Add express-rate-limit to the spin endpoint

Import and apply as route-level middleware:

```js
import rateLimit from 'express-rate-limit';

const spinLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1-minute window
  max: 200,             // max 200 spins per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — slow down.' },
});

app.use('/api/spin', spinLimiter);
```

Place the rate limiter registration after `app.use(express.json())` but before `app.use('/api', spinRouter)`.

200 requests per minute is generous for a real user (≈3 per second) while blocking automated hammering. Adjust the limit if needed.

---

### 4. Final middleware order in `server.js`

After this change, the middleware registration order should be:

```js
app.use(helmet({ contentSecurityPolicy: DEV_MODE ? false : undefined }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());
app.use('/api/spin', spinLimiter);

if (DEV_MODE) {
  // DEV_MODE GET / override and debug router
}

app.use(express.static(clientPath));
app.use('/api', spinRouter);
```

---

### 5. Update tests

The existing `spin.route.test.js` makes up to 50 spin requests in one test and 8 or more in individual cases. With a limit of 200/minute at a test port 0 instance, all tests will pass well within limits. No test changes are needed.

If in future tests exceed the limit (e.g. in a high-volume simulation test that goes through HTTP), apply the limiter only in non-test environments:

```js
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/spin', spinLimiter);
}
```

---

### 6. Verify

- Run `npm run dev` and confirm Morgan logs appear in the terminal on each request.
- Open the browser developer tools and confirm Helmet response headers (`x-frame-options`, `x-content-type-options`, etc.) are present on every response.
- Run `npm run test:unit` — all tests should still pass with zero changes.

Always make sure to check work against `ai-plan.md` and test.
