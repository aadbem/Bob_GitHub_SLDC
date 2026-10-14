import type { Range } from '../../shared/types.js';

const SYMBOL_REGEX = /^[A-Z.-]{1,10}$/;

export function validateSymbols(symbols: string[], allowed: string[]): string[] {
  const list = symbols
    .map((s) => s.trim().toUpperCase())
    .filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i);

  if (list.length === 0) {
    throw new Error('Nenhum símbolo informado.');
  }
  if (list.length > 5) {
    throw new Error('Máximo de 5 símbolos por requisição.');
  }
  for (const symbol of list) {
    if (!SYMBOL_REGEX.test(symbol)) {
      throw new Error(`Símbolo inválido: ${symbol}`);
    }
    if (!allowed.includes(symbol)) {
      throw new Error(`Símbolo não configurado: ${symbol}`);
    }
  }
  return list;
}

export function validateRange(range: string | undefined): Range {
  const allowed: Range[] = ['1d', '7d', '3m'];
  if (!range || !allowed.includes(range as Range)) {
    throw new Error(`Range inválido: ${range ?? ''}`);
  }
  return range as Range;
}
