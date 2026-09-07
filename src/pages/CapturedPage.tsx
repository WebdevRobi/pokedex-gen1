import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { ViewToggle } from '../components/common/ViewToggle';
import { CapturedCard } from '../components/pokemon/CapturedCard';
import { PokemonModal } from '../components/pokemon/PokemonModal';
import { useCaptured } from '../hooks/useCaptured';
import { getStoredViewMode, setStoredViewMode } from '../services/storage';
import { BookOpen } from 'lucide-react';
import { PokeballIcon } from '../components/common/PokeballIcon';

export const CapturedPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => getStoredViewMode());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const { capturedList, release } = useCaptured();
  const location = useLocation();

  const newlyCapturedId = (location.state as { newlyCapturedId?: number } | null)?.newlyCapturedId;

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    setStoredViewMode(mode);
  };

  const filteredCaptured = capturedList.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const nameMatch = item.name.toLowerCase().includes(query);
    const nicknameMatch = item.nickname.toLowerCase().includes(query);
    const idMatch = item.id.toString() === query || `#${item.id}` === query;
    return nameMatch || nicknameMatch || idMatch;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search captured by name or nickname..."
        />
        <ViewToggle mode={viewMode} onChange={handleViewModeChange} />
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
        <span>
          Captured Pokémon:{' '}
          <strong className="text-emerald-600 dark:text-emerald-400">{capturedList.length}</strong> / 151
        </span>
        {capturedList.length > 0 && (
          <span className="text-xs text-slate-400">
            {Math.round((capturedList.length / 151) * 100)}% Gen 1 Completed
          </span>
        )}
      </div>
      {filteredCaptured.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
              : 'flex flex-col space-y-3'
          }
        >
          {filteredCaptured.map((captured) => (
            <CapturedCard
              key={captured.id}
              captured={captured}
              onRelease={release}
              mode={viewMode}
              isNew={captured.id === newlyCapturedId}
              onClick={() => setSelectedPokemonId(captured.id)}
            />
          ))}
        </div>
      )}
      {capturedList.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-500">
            <PokeballIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Captured Pokémon Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 mb-6">
            Browse the Pokédex, select any Gen 1 Pokémon, and click &quot;Tag as Captured&quot; to add them to your collection.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md shadow-red-600/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Go to Pokédex</span>
          </Link>
        </div>
      )}
      {capturedList.length > 0 && filteredCaptured.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No captured Pokémon match &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Clear Filter
          </button>
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
