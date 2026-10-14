import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SeriesDTO } from '../../../shared/types';
import { rebaseToZero } from '../../domain/metrics.js';
import { formatTime, formatDate } from '../../domain/format.js';

const COLORS: Record<string, string> = {
  IBM: '#00599D',
  MSFT: '#00A4EF',
  ORCL: '#F8A018',
  SAP: '#13749C',
  CRM: '#00A1E0',
};

interface ComparisonChartProps {
  series: SeriesDTO[];
  range: '1d' | '7d' | '3m';
}

export function ComparisonChart({ series, range }: ComparisonChartProps) {
  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length === 0) {
    return <div className="chart-empty">Sem dados suficientes para exibir o gráfico.</div>;
  }

  const isIntraday = range === '1d';

  return (
    <div className="comparison-chart">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={[]} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="timestamp" tickFormatter={(value: number) => (isIntraday ? formatTime(value) : formatDate(value))} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.symbol}
              type="monotone"
              data={rebaseToZero(s.points)}
              name={s.symbol}
              stroke={COLORS[s.symbol] ?? '#666'}
              strokeWidth={s.symbol === 'IBM' ? 3 : 2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
