import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SeriesDTO } from '../../../shared/types';
import { rebaseToZero } from '../../domain/metrics.js';
import { formatTime, formatDate } from '../../domain/format.js';

interface CompanyChartCardProps {
  series: SeriesDTO;
  range: '1d' | '7d' | '3m';
}

export function CompanyChartCard({ series, range }: CompanyChartCardProps) {
  const isIntraday = range === '1d';
  return (
    <section className="company-chart-card">
      <h3 className="company-chart-title">{series.symbol}</h3>
      <div className="company-chart">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={[]} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={(value: number) => (isIntraday ? formatTime(value) : formatDate(value))} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              data={rebaseToZero(series.points)}
              name={series.symbol}
              stroke="#00599D"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
