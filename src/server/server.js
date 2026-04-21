/**
 * @fileoverview Express application entry point — loads routes and starts the HTTP listener.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import spinRouter from './routes/spin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '..', 'client');

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(clientPath));

app.use('/api', spinRouter);

/**
 * Starts the HTTP server on the configured port.
 * @returns {import('http').Server}
 */
function startServer() {
  return app.listen(PORT, () => {
    console.log(`Slot machine server running on http://localhost:${PORT}`);
  });
}

export { app, startServer };

// Only start the listener when this file is run directly (not imported by tests)
if (process.argv[1]?.endsWith('server.js')) {
  startServer();
}
