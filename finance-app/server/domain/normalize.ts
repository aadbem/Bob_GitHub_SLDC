import type { SeriesDTO, Range } from '../../shared/types.js';

interface RawPoint {
  timestamp?: number | string;
  close?: number | null;
  [key: string]: unknown;
}

export function normalizeSeries(
  symbol: string,
  range: Range,
  currency: string,
  raw: unknown[]
): SeriesDTO {
  const points: { timestamp: number; value: number }[] = [];

  for (const item of raw as RawPoint[]) {
    const ts = Number(item.timestamp);
    const close = item.close;
    if (!Number.isFinite(ts) || close === null || close === undefined || !Number.isFinite(Number(close))) {
      continue;
    }
    points.push({ timestamp: ts, value: Number(close) });
  }

  points.sort((a, b) => a.timestamp - b.timestamp);

  return {
    symbol,
    range,
    currency,
    points,
  };
}
