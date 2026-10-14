import type { Quote } from '../../../shared/types';
import { formatCurrency, formatPercent } from '../../domain/format.js';

interface SummaryCardProps {
  quote: Quote;
}

export function SummaryCard({ quote }: SummaryCardProps) {
  const up = quote.changePercent >= 0;
  return (
    <article className={`summary-card ${up ? 'up' : 'down'}`}>
      <h3 className="summary-symbol">{quote.symbol}</h3>
      <div className="summary-price">{formatCurrency(quote.price, quote.currency)}</div>
      <div className={`summary-change ${up ? 'up' : 'down'}`}>{formatPercent(quote.changePercent)}</div>
    </article>
  );
}
