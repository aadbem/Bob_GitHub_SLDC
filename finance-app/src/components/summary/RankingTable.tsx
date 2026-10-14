import type { SeriesDTO } from '../../../shared/types';
import { windowChangePercent } from '../../domain/metrics.js';
import { formatPercent } from '../../domain/format.js';

interface RankingTableProps {
  series: SeriesDTO[];
}

export function RankingTable({ series }: RankingTableProps) {
  const ranked = series.slice().sort((a: SeriesDTO, b: SeriesDTO) => windowChangePercent(b) - windowChangePercent(a));
  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th>Posição</th>
          <th>Empresa</th>
          <th>Variação na janela</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((s, i) => (
          <tr key={s.symbol}>
            <td>{i + 1}</td>
            <td>{s.symbol}</td>
            <td>{formatPercent(windowChangePercent(s))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
