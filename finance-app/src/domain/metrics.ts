import type { Quote, SeriesDTO, SeriesPoint } from '../../shared/types';

export function dayChangePercent(quote: Quote): number {
  return quote.changePercent;
}

export function windowChangePercent(series: SeriesDTO): number {
  const points = series.points;
  if (points.length < 2) return 0;
  const first = points[0].value;
  const last = points[points.length - 1].value;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

export function rebaseToZero(points: SeriesPoint[]): SeriesPoint[] {
  if (points.length === 0) return [];
  const first = points[0].value;
  if (first === 0) return points.map((p) => ({ ...p, value: 0 }));
  return points.map((p) => ({ ...p, value: ((p.value - first) / first) * 100 }));
}

export function rankByWindowChange(series: SeriesDTO[]): SeriesDTO[] {
  return [...series].sort((a, b) => windowChangePercent(b) - windowChangePercent(a));
}
