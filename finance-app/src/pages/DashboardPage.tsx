import { useState, useEffect } from 'react';
import { useQuotes } from '../hooks/useQuotes.js';
import { useHistory } from '../hooks/useHistory.js';
import { companies } from '../../shared/companies';
import type { Range } from '../../shared/types';
import { Header } from '../components/layout/Header.js';
import { RangeTabs } from '../components/controls/RangeTabs.js';
import { SummaryCardGrid } from '../components/summary/SummaryCardGrid.js';
import { ComparisonChart } from '../components/charts/ComparisonChart.js';
import { RankingTable } from '../components/summary/RankingTable.js';
import { LoadingState } from '../components/feedback/LoadingState.js';
import { ErrorState } from '../components/feedback/ErrorState.js';
import { PartialDataBanner } from '../components/feedback/PartialDataBanner.js';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary.js';
import { windowChangePercent } from '../domain/metrics.js';

const DEFAULT_RANGE: Range = '1d';

export function DashboardPage() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE);
  const symbols = companies.map((c) => c.symbol);

  const quotes = useQuotes(symbols, true);
  const history = useHistory(symbols, range, true);

  const missing = quotes.data
    ? quotes.data.filter((q) => !q.ok).map((q) => q.symbol)
    : [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRange = params.get('range');
    if (urlRange === '1d' || urlRange === '7d' || urlRange === '3m') {
      setRange(urlRange);
    }
  }, []);

  if (quotes.isLoading || history.isLoading) {
    return <LoadingState />;
  }

  if (quotes.isError || history.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar os dados de mercado. Verifique sua conexão e tente novamente."
        onRetry={() => {
          quotes.refetch();
          history.refetch();
        }}
      />
    );
  }

  const availableQuotes = quotes.data?.filter((q) => q.ok && q.data) ?? [];
  const availableSeries = history.data ?? {};
  const ranked = Object.values(availableSeries).sort(
    (a, b) => windowChangePercent(b) - windowChangePercent(a)
  );

  return (
    <ErrorBoundary fallback={<p>Erro ao renderizar o dashboard.</p>}>
      <section className="dashboard">
        <Header />
        <div className="dashboard-controls">
          <RangeTabs value={range} onChange={setRange} />
        </div>
        {missing.length > 0 && <PartialDataBanner missing={missing} />}
        <div className="dashboard-summary">
          <SummaryCardGrid quotes={availableQuotes} />
        </div>
        <div className="dashboard-chart">
          <ComparisonChart
            series={Object.values(availableSeries)}
            range={range}
          />
        </div>
        <div className="dashboard-ranking">
          <h2>Ranking por variação na janela</h2>
          <RankingTable series={ranked} />
        </div>
      </section>
    </ErrorBoundary>
  );
}
