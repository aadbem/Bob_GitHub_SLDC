import { useQuery } from '@tanstack/react-query';
import { getQuotes } from '../api/marketApi';
import type { QuoteResult } from '../../shared/types';

export function useQuotes(symbols: string[], enabled: boolean = true) {
  return useQuery<QuoteResult[]>({
    queryKey: ['quotes', symbols.join(',')],
    queryFn: () => getQuotes(symbols),
    enabled: enabled && symbols.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
