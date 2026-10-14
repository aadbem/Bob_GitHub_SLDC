export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-label="Carregando">
      <span className="spinner"></span>
      <span className="loading-label">Carregando dados de mercado…</span>
    </div>
  );
}
