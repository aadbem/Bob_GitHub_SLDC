import type { QuoteResult, Range, SeriesDTO } from '../../shared/types.js';

export interface MarketDataProvider {
  getQuotes(symbols: string[]): Promise<QuoteResult[]>;
  getHistory(symbol: string, range: Range): Promise<SeriesDTO>;
}
