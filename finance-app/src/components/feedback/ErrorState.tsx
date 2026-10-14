interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <p className="error-message">{message}</p>
      <button type="button" className="retry-button" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}
