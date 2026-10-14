export class AppError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class InvalidSymbol extends AppError {
  constructor(symbol: string) {
    super('INVALID_SYMBOL', 400, `Símbolo inválido: ${symbol}`);
  }
}

export class InvalidRange extends AppError {
  constructor(range: string) {
    super('INVALID_RANGE', 400, `Range inválido: ${range}`);
  }
}

export class UpstreamUnavailable extends AppError {
  constructor(detail?: string) {
    super('UPSTREAM_UNAVAILABLE', 502, 'Servidor de dados indisponível no momento.');
    this.message = detail ? `Servidor de dados indisponível no momento. (${detail})` : this.message;
  }
}

export class TimeoutError extends AppError {
  constructor() {
    super('TIMEOUT', 504, 'Tempo esgotado ao consultar os dados de mercado.');
  }
}

export function errorResponse(err: unknown): ApiError {
  if (err instanceof AppError) {
    return { code: err.code, message: err.message };
  }
  return { code: 'INTERNAL_ERROR', message: 'Erro inesperado ao processar a requisição.' };
}

interface ApiError {
  code: string;
  message: string;
}
