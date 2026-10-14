import type { QuoteResult } from '../../../shared/types';
import { SummaryCard } from './SummaryCard.js';

interface SummaryCardGridProps {
  quotes: QuoteResult[];
}

export function SummaryCardGrid({ quotes }: SummaryCardGridProps) {
  const available = quotes.filter((q) => q.ok && q.data);
  if (available.length === 0) {
    return <div className="empty">Não há cotações disponíveis.</div>;
  }
  return (
    <div className="summary-card-grid">
      {available.map((q) => (
        <SummaryCard key={q.symbol} quote={q.data!} />
      ))}
    </div>
  );
}
