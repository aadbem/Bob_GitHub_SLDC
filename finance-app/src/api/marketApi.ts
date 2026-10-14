import { getJson } from './client';
import type { Quote, QuoteResult, Range, SeriesDTO } from '../../shared/types';

export async function getQuotes(symbols: string[]): Promise<QuoteResult[]> {
  const params = new URLSearchParams({ symbols: symbols.join(',') });
  const res = await getJson<{ results: QuoteResult[] }>(`/api/market/quotes?${params}`);
  return res.results;
}

export async function getHistory(symbols: string[], range: Range): Promise<Record<string, SeriesDTO>> {
  const params = new URLSearchParams({ symbols: symbols.join(','), range });
  const res = await getJson<{ results: Record<string, SeriesDTO> }>(`/api/market/history?${params}`);
  return res.results;
}

export type { Quote, QuoteResult, Range, SeriesDTO };
