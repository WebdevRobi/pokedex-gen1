import { useState, useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList, fetchAllGen1Pokemon, GEN1_TOTAL } from '../services/api';

export function usePokemonList(limit: number = 24) {
  const [searchQuery, setSearchQuery] = useState<string>('');


  const allGen1Query = useQuery({
    queryKey: ['allGen1Pokemon'],
    queryFn: fetchAllGen1Pokemon,
    staleTime: 1000 * 60 * 60,
  });

  
  const infiniteQuery = useInfiniteQuery({
    queryKey: ['pokemonListInfinite', limit],
    queryFn: async ({ pageParam }) => {
      return fetchPokemonList(limit, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage.hasMore) return undefined;
      const nextOffset = lastPageParam + limit;
      return nextOffset < GEN1_TOTAL ? nextOffset : undefined;
    },
    staleTime: 1000 * 60 * 30,
  });

  const paginatedList = useMemo(() => {
    if (!infiniteQuery.data) return [];
    return infiniteQuery.data.pages.flatMap((page) => page.results);
  }, [infiniteQuery.data]);

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return paginatedList;
    }

    const sourcePool =
      allGen1Query.data && allGen1Query.data.length > 0
        ? allGen1Query.data
        : paginatedList;

    return sourcePool.filter((pokemon) => {
      const nameMatch = pokemon.name.toLowerCase().includes(query);
      const idMatch =
        pokemon.id.toString() === query ||
        `#${pokemon.id}` === query ||
        pokemon.id.toString().padStart(3, '0').includes(query);
      return nameMatch || idMatch;
    });
  }, [searchQuery, paginatedList, allGen1Query.data]);

  return {
    pokemonList: filteredList,
    totalGen1: GEN1_TOTAL,
    loadedCount: paginatedList.length,
    isLoading: infiniteQuery.isLoading,
    isFetchingMore: infiniteQuery.isFetchingNextPage,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    searchQuery,
    setSearchQuery,
    loadMore: () => infiniteQuery.fetchNextPage(),
    hasMore: !!infiniteQuery.hasNextPage,
    refetch: infiniteQuery.refetch,
  };
}
