import type { QuoteResult, Range, SeriesDTO } from '../../shared/types.js';
import { MarketDataProvider } from './MarketDataProvider.js';

const FIXED_PRICES: Record<string, number> = {
  IBM: 195.5,
  MSFT: 425.3,
  ORCL: 158.9,
  SAP: 230.2,
  CRM: 340.7,
};

export class FixtureProvider implements MarketDataProvider {
  async getQuotes(symbols: string[]): Promise<QuoteResult[]> {
    return symbols.map((symbol) => {
      const price = FIXED_PRICES[symbol];
      if (price === undefined) {
        return { symbol, ok: false, error: 'Símbolo não disponível em modo fixture.' };
      }
      return {
        symbol,
        ok: true,
        data: {
          symbol,
          price,
          currency: 'USD',
          change: 1.2,
          changePercent: 0.6,
          timestamp: Date.now(),
        },
      };
    });
  }

  async getHistory(symbol: string, range: Range): Promise<SeriesDTO> {
    const price = FIXED_PRICES[symbol];
    if (price === undefined) {
      throw new Error(`Símbolo não disponível em modo fixture: ${symbol}`);
    }
    const now = Date.now();
    const points: { timestamp: number; value: number }[] = [];
    for (let i = 9; i >= 0; i--) {
      points.push({
        timestamp: now - i * 60 * 60 * 1000,
        value: price * (1 + (Math.random() - 0.5) * 0.02),
      });
    }
    return { symbol, range, currency: 'USD', points };
  }
}
