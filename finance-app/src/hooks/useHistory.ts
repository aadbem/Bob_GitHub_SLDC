import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../api/marketApi';
import type { Range, SeriesDTO } from '../../shared/types';

export function useHistory(symbols: string[], range: Range, enabled: boolean = true) {
  return useQuery<Record<string, SeriesDTO>>({
    queryKey: ['history', symbols.join(','), range],
    queryFn: () => getHistory(symbols, range),
    enabled: enabled && symbols.length > 0,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
