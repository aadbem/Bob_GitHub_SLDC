import { describe, it, expect } from 'vitest';
import { windowChangePercent, rebaseToZero, rankByWindowChange } from './metrics.js';
import type { SeriesDTO, SeriesPoint } from '../../shared/types.js';

function series(symbol: string, points: SeriesPoint[]): SeriesDTO {
  return { symbol, range: '1d', currency: 'USD', points };
}

describe('metrics', () => {
  it('calcula variação na janela', () => {
    const s = series('IBM', [{ timestamp: 1, value: 100 }, { timestamp: 2, value: 110 }]);
    expect(windowChangePercent(s)).toBeCloseTo(10);
  });

  it('retorna 0 para série com menos de 2 pontos', () => {
    const s = series('IBM', [{ timestamp: 1, value: 100 }]);
    expect(windowChangePercent(s)).toBe(0);
  });

  it('rebaseToZero começa em 0', () => {
    const out = rebaseToZero([{ timestamp: 1, value: 100 }, { timestamp: 2, value: 110 }]);
    expect(out[0].value).toBe(0);
    expect(out[1].value).toBeCloseTo(10);
  });

  it('rankByWindowChange ordena decrescente', () => {
    const list = [
      series('A', [{ timestamp: 1, value: 100 }, { timestamp: 2, value: 105 }]),
      series('B', [{ timestamp: 1, value: 100 }, { timestamp: 2, value: 120 }]),
    ];
    const ranked = rankByWindowChange(list);
    expect(ranked[0].symbol).toBe('B');
    expect(ranked[1].symbol).toBe('A');
  });
});
