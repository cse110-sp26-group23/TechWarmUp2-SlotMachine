/**
 * @fileoverview Express application entry point — loads routes and starts the HTTP listener.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import spinRouter from './routes/spin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '..', 'client');

const app = express();
const PORT = process.env.PORT ?? 3000;
const DEV_MODE = process.env.DEV_MODE === 'true';

const spinLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — slow down.' },
});

app.use(helmet({
  contentSecurityPolicy: DEV_MODE
    ? false
    : {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
        },
      },
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());
app.use('/api/spin', spinLimiter);

if (DEV_MODE) {
  // Inject window.DEV_MODE before static middleware so debug UI activates
  app.get('/', (req, res) => {
    let html = readFileSync(join(clientPath, 'index.html'), 'utf-8');
    html = html.replace('</body>', '<script>window.DEV_MODE = true;</script></body>');
    res.type('html').send(html);
  });

  const { default: debugRouter } = await import('./routes/debug.js');
  app.use('/api/debug', debugRouter);
  console.log('[DEV] Debug mode active');
}

app.use(express.static(clientPath));
app.use('/api', spinRouter);

/**
 * Starts the HTTP server on the given port and resolves when the socket is bound.
 * Pass port 0 to let the OS assign a random port (useful in tests).
 * @param {number} [port] - Port to listen on. Defaults to the configured PORT.
 * @returns {Promise<import('http').Server>}
 */
function startServer(port = PORT) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Slot machine server running on http://localhost:${server.address().port}`);
      resolve(server);
    });
  });
}

export { app, startServer };

// Only start the listener when this file is run directly (not imported by tests)
if (process.argv[1]?.endsWith('server.js')) {
  startServer();
}
