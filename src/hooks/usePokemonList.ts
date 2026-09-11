import { useState, useMemo, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList, searchPokemonViaApi, GEN1_TOTAL } from '../services/api';
import { useDebounce } from './useDebounce';

export function usePokemonList(limit: number = 24) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery.trim(), 300);

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

  const apiSearchQuery = useQuery({
    queryKey: ['pokemonApiSearch', debouncedQuery],
    queryFn: () => searchPokemonViaApi(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const paginatedList = useMemo(() => {
    if (!infiniteQuery.data) return [];
    return infiniteQuery.data.pages.flatMap((page) => page.results);
  }, [infiniteQuery.data]);

  const isSearchActive = searchQuery.trim().length > 0;
  const isSearching =
    isSearchActive &&
    (searchQuery.trim() !== debouncedQuery ||
      apiSearchQuery.isLoading ||
      apiSearchQuery.isFetching);

  const pokemonList = useMemo(() => {
    if (!isSearchActive) {
      return paginatedList;
    }
    return apiSearchQuery.data || [];
  }, [isSearchActive, paginatedList, apiSearchQuery.data]);

  const loadMore = useCallback(() => {
    if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [infiniteQuery]);

  return {
    pokemonList,
    totalGen1: GEN1_TOTAL,
    loadedCount: paginatedList.length,
    isLoading: isSearchActive ? isSearching : infiniteQuery.isLoading,
    isSearching,
    isFetchingMore: infiniteQuery.isFetchingNextPage,
    isError: isSearchActive ? apiSearchQuery.isError : infiniteQuery.isError,
    error: isSearchActive ? apiSearchQuery.error : infiniteQuery.error,
    searchQuery,
    setSearchQuery,
    loadMore,
    hasMore: isSearchActive ? false : !!infiniteQuery.hasNextPage,
    refetch: isSearchActive ? apiSearchQuery.refetch : infiniteQuery.refetch,
  };
}
