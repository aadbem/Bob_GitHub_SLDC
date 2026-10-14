import YahooFinance from 'yahoo-finance2';
import type { QuoteResult, Range, SeriesDTO } from '../../shared/types.js';
import { MarketDataProvider } from './MarketDataProvider.js';
import { rangeConfig } from '../domain/ranges.js';
import { normalizeSeries } from '../domain/normalize.js';

const yahoo = new YahooFinance();

export class YahooProvider implements MarketDataProvider {
  async getQuotes(symbols: string[]): Promise<QuoteResult[]> {
    const results: QuoteResult[] = [];
    for (const symbol of symbols) {
      try {
        const quote = await yahoo.quote(symbol);
        results.push({
          symbol,
          ok: true,
          data: {
            symbol,
            price: Number(quote.regularMarketPrice ?? 0),
            currency: quote.currency ?? 'USD',
            change: Number(quote.regularMarketChange ?? 0),
            changePercent: Number(quote.regularMarketChangePercent ?? 0),
            timestamp: Date.now(),
          },
        });
      } catch (err) {
        results.push({
          symbol,
          ok: false,
          error: err instanceof Error ? err.message : 'Erro ao consultar cotação.',
        });
      }
    }
    return results;
  }

  async getHistory(symbol: string, range: Range): Promise<SeriesDTO> {
    const config = rangeConfig(range);
    const from = new Date(Date.now() - config.period1Ms);
    const to = new Date();

    const result = await (yahoo as { historical: (s: string, o: unknown) => Promise<unknown[]> }).historical(
      symbol,
      { period1: from, period2: to, interval: config.interval }
    );

    const raw = (result as unknown as { timestamp?: number; close?: number | null }[]).map(
      (row) => ({ timestamp: row.timestamp, close: row.close })
    );

    return normalizeSeries(symbol, range, 'USD', raw);
  }
}
