export type Range = '1d' | '7d' | '3m';

export interface Quote {
  symbol: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface SeriesPoint {
  timestamp: number;
  value: number;
}

export interface SeriesDTO {
  symbol: string;
  range: Range;
  currency: string;
  points: SeriesPoint[];
}

export interface QuoteResult {
  symbol: string;
  ok: boolean;
  data?: Quote;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
}
