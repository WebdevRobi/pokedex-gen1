import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../services/api';
import type { PokemonDetail } from '../types/pokemon';

export function usePokemonDetail(idOrName: string | number | undefined) {
  return useQuery<PokemonDetail, Error>({
    queryKey: ['pokemonDetail', idOrName],
    queryFn: () => {
      if (!idOrName) {
        throw new Error('No Pokemon ID or name provided');
      }
      return fetchPokemonDetail(idOrName);
    },
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}
