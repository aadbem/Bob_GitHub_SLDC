import type { Range } from '../../shared/types.js';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_QUARTER = 90 * ONE_DAY;

interface RangeMapping {
  period1Ms: number;
  interval: string;
  ttlSeconds: number;
  label: string;
}

export const RANGE_CONFIG: Record<Range, RangeMapping> = {
  '1d': {
    period1Ms: ONE_DAY,
    interval: '5m',
    ttlSeconds: 30,
    label: 'Dia atual',
  },
  '7d': {
    period1Ms: ONE_WEEK,
    interval: '30m',
    ttlSeconds: 5 * 60,
    label: '7 dias',
  },
  '3m': {
    period1Ms: ONE_QUARTER,
    interval: '1d',
    ttlSeconds: 60 * 60,
    label: 'Trimestre',
  },
};

export function rangeConfig(range: Range): RangeMapping {
  return RANGE_CONFIG[range];
}
