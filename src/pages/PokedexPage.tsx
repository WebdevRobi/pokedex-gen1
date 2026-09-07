import React, { useState } from 'react';
import { SearchBar } from '../components/common/SearchBar';
import { ViewToggle } from '../components/common/ViewToggle';
import { PokemonCardGrid } from '../components/pokemon/PokemonCardGrid';
import { PokemonCardList } from '../components/pokemon/PokemonCardList';
import { PokemonModal } from '../components/pokemon/PokemonModal';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { usePokemonList } from '../hooks/usePokemonList';
import { useCaptured } from '../hooks/useCaptured';
import { getStoredViewMode, setStoredViewMode } from '../services/storage';
import { Loader2, AlertCircle } from 'lucide-react';

export const PokedexPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => getStoredViewMode());
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  const {
    pokemonList,
    totalGen1,
    loadedCount,
    isLoading,
    isFetchingMore,
    isError,
    error,
    searchQuery,
    setSearchQuery,
    loadMore,
    hasMore,
    refetch,
  } = usePokemonList(24);

  const { isPokemonCaptured } = useCaptured();

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    setStoredViewMode(mode);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Gen 1 Pokémon (e.g. Pikachu, #25)..."
        />
        <ViewToggle mode={viewMode} onChange={handleViewModeChange} />
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
        <span>
          {searchQuery ? (
            <>
              Found <strong className="text-slate-800 dark:text-slate-200">{pokemonList.length}</strong> matches for &quot;{searchQuery}&quot;
            </>
          ) : (
            <>
              Showing <strong className="text-slate-800 dark:text-slate-200">{loadedCount}</strong> of{' '}
              <strong className="text-slate-800 dark:text-slate-200">{totalGen1}</strong> Gen 1 Pokémon
            </>
          )}
        </span>
      </div>
      {isError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-700 dark:text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-semibold">Failed to load Pokémon</p>
          <p className="text-sm mt-1 mb-4 text-red-600 dark:text-red-300">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      {isLoading && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
              : 'flex flex-col space-y-3'
          }
        >
          {Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} mode={viewMode} />
          ))}
        </div>
      )}
      {!isLoading && pokemonList.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
              : 'flex flex-col space-y-3'
          }
        >
          {pokemonList.map((pokemon) =>
            viewMode === 'grid' ? (
              <PokemonCardGrid
                key={pokemon.id}
                pokemon={pokemon}
                isCaptured={isPokemonCaptured(pokemon.id)}
                onClick={() => setSelectedPokemonId(pokemon.id)}
              />
            ) : (
              <PokemonCardList
                key={pokemon.id}
                pokemon={pokemon}
                isCaptured={isPokemonCaptured(pokemon.id)}
                onClick={() => setSelectedPokemonId(pokemon.id)}
              />
            )
          )}
        </div>
      )}
      {!isLoading && pokemonList.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Pokémon found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            No Gen 1 Pokémon matched your search query &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
      {!searchQuery && hasMore && !isLoading && (
        <div className="pt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isFetchingMore}
            className="w-full sm:w-auto min-w-[200px] px-8 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm transition-all hover:shadow hover:border-red-400 flex items-center justify-center space-x-2"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                <span>Loading more...</span>
              </>
            ) : (
              <span>Load more</span>
            )}
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {totalGen1 - loadedCount} Pokémon remaining
          </span>
        </div>
      )}
      {selectedPokemonId !== null && (
        <PokemonModal
          pokemonId={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </div>
  );
};
