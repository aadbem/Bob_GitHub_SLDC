import express, { Request, Response, NextFunction } from 'express';
import type { QuoteResult, Range } from '../../shared/types.js';
import { validateSymbols, validateRange } from '../domain/validation.js';
import { AppError } from '../errors.js';

export function createMarketRouter({
  provider,
  allowedSymbols,
  cache,
}: {
  provider: { getQuotes(symbols: string[]): Promise<QuoteResult[]>; getHistory(symbol: string, range: Range): Promise<unknown> };
  allowedSymbols: string[];
  cache: { get(key: string): unknown; set(key: string, value: unknown, ttl: number): void };
}) {
  const router = express.Router();

  function coerceSymbols(raw: unknown): string[] {
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
      .filter((s): s is string => typeof s === 'string')
      .flatMap((s) => s.split(','));
  }

  router.get('/quotes', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbols = validateSymbols(coerceSymbols(req.query.symbols), allowedSymbols);
      const results = await provider.getQuotes(symbols);
      res.json({ results });
    } catch (err) {
      next(err);
    }
  });

  router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbols = validateSymbols(coerceSymbols(req.query.symbols), allowedSymbols);
      const range = validateRange(req.query.range as string | undefined);
      const results: Record<string, unknown> = {};
      for (const symbol of symbols) {
        const cacheKey = `history:${symbol}:${range}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          results[symbol] = cached;
          continue;
        }
        const data = await provider.getHistory(symbol, range);
        cache.set(cacheKey, data, 60);
        results[symbol] = data;
      }
      res.json({ results });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  let status = 500;
  let body = { error: { code: 'INTERNAL_ERROR', message: 'Erro inesperado ao processar a requisição.' } };

  if (err instanceof AppError) {
    status = err.status;
    body = { error: { code: err.code, message: err.message } };
  } else if (err instanceof Error) {
    body = { error: { code: 'INTERNAL_ERROR', message: 'Erro inesperado ao processar a requisição.' } };
  }

  return res.status(status).json(body);
}
