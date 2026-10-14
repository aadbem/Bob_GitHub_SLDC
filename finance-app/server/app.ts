import express from 'express';
import cors from 'cors';
import { createMarketRouter, errorHandler } from './routes/market.js';
import { FixtureProvider } from './providers/fixtureProvider.js';
import { TtlCache } from './cache.js';
import { companies } from '../shared/companies.js';

export function createApp() {
  const app = express();
  const allowedSymbols = companies.map((c) => c.symbol);
  const provider = new FixtureProvider();
  const cache = new TtlCache();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', provider: 'fixture' });
  });

  app.use('/api/market', createMarketRouter({ provider, allowedSymbols, cache }));

  app.use(errorHandler);

  return app;
}
