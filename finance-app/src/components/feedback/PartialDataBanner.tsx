interface PartialDataBannerProps {
  missing: string[];
}

export function PartialDataBanner({ missing }: PartialDataBannerProps) {
  if (missing.length === 0) return null;
  return (
    <div className="partial-data-banner" role="alert">
      <p>Dados indisponíveis para: {missing.join(', ')}. As demais empresas seguem sendo exibidas.</p>
    </div>
  );
}
