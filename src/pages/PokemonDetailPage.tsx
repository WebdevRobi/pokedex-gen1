import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Tag, Scale, Ruler } from 'lucide-react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useCaptured } from '../hooks/useCaptured';
import { Badge } from '../components/common/Badge';
import { getPokemonArtwork, getPokemonSprite } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { PokemonDetail } from '../types/pokemon';
import type { CapturedPokemon } from '../types/captured';

const getTodayDateFormatted = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

interface StatusSectionProps {
  pokemon: PokemonDetail;
  isCaptured: boolean;
  capturedData?: CapturedPokemon;
  onCapture: (pokemon: CapturedPokemon) => void;
  onRelease: (id: number) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({
  pokemon,
  isCaptured,
  capturedData,
  onCapture,
  onRelease,
}) => {
  const [nickname, setNickname] = useState(capturedData?.nickname || '');
  const [date, setDate] = useState(capturedData?.date || getTodayDateFormatted());
  const { showCapturedToast, showConfirmToast } = useToast();

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date.trim()) {
      alert('Please enter or select a capture date.');
      return;
    }

    onCapture({
      id: pokemon.id,
      name: pokemon.name,
      nickname: nickname.trim() || pokemon.name,
      date: date.trim(),
      sprite: getPokemonSprite(pokemon.id),
      artwork: getPokemonArtwork(pokemon.id),
      types: pokemon.types.map((t) => t.type.name),
      capturedAtTimestamp: Date.now(),
    });

    showCapturedToast(
      isCaptured
        ? `Updated captured info for ${pokemon.name}!`
        : `Successfully captured ${pokemon.name}!`
    );
  };

  const handleRelease = () => {
    const targetName = capturedData?.nickname || pokemon.name;
    showConfirmToast({
      message: `Are you sure you want to release ${targetName}?`,
      confirmLabel: 'Release',
      onConfirm: () => {
        onRelease(pokemon.id);
        setNickname('');
        setDate(getTodayDateFormatted());
        showCapturedToast(`Released ${pokemon.name} from collection.`);
      },
    });
  };

  return (
    <div className="text-left space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Status
        </h4>
        {isCaptured && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Currently in your collection
          </span>
        )}
      </div>

      <form onSubmit={handleCaptureSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nickname"
            className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1"
          >
            Enter Nickname
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={`e.g. Capt, Sparky, ${pokemon.name}`}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="capture-date"
              className="block text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              Enter Date (MM/DD/YYYY)
            </label>
            <button
              type="button"
              onClick={() => setDate(getTodayDateFormatted())}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
            >
              Set to Today
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="capture-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isCaptured
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isCaptured ? 'Update Captured Info' : 'Tag as Captured'}</span>
          </button>

          {isCaptured && (
            <button
              type="button"
              onClick={handleRelease}
              className="py-3 px-5 rounded-xl font-bold text-sm border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              Release Pokémon
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = parseInt(id || '1', 10);

  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(numericId);
  const { isPokemonCaptured, getCaptured, capture, release } = useCaptured();

  const isCaptured = isPokemonCaptured(numericId);
  const currentCapturedData = getCaptured(numericId);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4 animate-pulse">
        <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
        <div className="w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
        <div className="w-36 h-8 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
        <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Failed to load Pokémon details</h2>
        <p className="text-slate-500 text-sm">{error?.message || 'Pokémon not found.'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold text-sm"
        >
          &lt; Go Back
        </button>
      </div>
    );
  }

  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  const artworkUrl = getPokemonArtwork(pokemon.id);
  const spriteUrl = getPokemonSprite(pokemon.id);

  return (
    <div className="max-w-xl mx-auto pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-bold hover:border-red-400 hover:text-red-500 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        {isCaptured && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Captured</span>
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
        <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-slate-800/80 dark:to-slate-800/20" />
          <img
            src={artworkUrl}
            alt={pokemon.name}
            className="relative z-10 w-44 h-44 object-contain drop-shadow-md transition-transform hover:scale-105 duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = spriteUrl;
            }}
          />
        </div>

        <div className="mt-3">
          <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500">
            {formattedId}
          </span>
          <h2 className="text-3xl font-black capitalize tracking-tight text-slate-900 dark:text-white mt-0.5">
            {pokemon.name}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 mt-3 mb-6">
          {pokemon.types.map((t) => (
            <Badge key={t.slot} type={t.type.name} size="md" />
          ))}
        </div>

        {/* Details section - displays "Details" with no "<>" */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 text-left space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 text-center">
            Details
          </h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mb-1">
                <Ruler className="w-3.5 h-3.5" />
                <span>Height</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {(pokemon.height / 10).toFixed(1)} m
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mb-1">
                <Scale className="w-3.5 h-3.5" />
                <span>Weight</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {(pokemon.weight / 10).toFixed(1)} kg
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
              Abilities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pokemon.abilities.map((a) => (
                <span
                  key={a.slot}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 capitalize text-slate-700 dark:text-slate-300"
                >
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden && (
                    <span className="ml-1 text-[10px] text-slate-400">(Hidden)</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Base Stats:
            </span>
            <div className="space-y-2">
              {pokemon.stats.map((s) => {
                const statNameMap: Record<string, string> = {
                  hp: 'HP',
                  attack: 'ATK',
                  defense: 'DEF',
                  'special-attack': 'Sp. ATK',
                  'special-defense': 'Sp. DEF',
                  speed: 'SPD',
                };
                const label = statNameMap[s.stat.name] || s.stat.name;
                const percentage = Math.min(100, Math.round((s.base_stat / 180) * 100));

                return (
                  <div key={s.stat.name} className="flex items-center text-xs">
                    <span className="w-16 font-semibold text-slate-500 dark:text-slate-400">
                      {label}
                    </span>
                    <span className="w-8 font-mono font-bold text-slate-800 dark:text-slate-200 text-right mr-3">
                      {s.base_stat}
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-700 my-6" />

        <StatusSection
          key={`${numericId}-${isCaptured ? 'captured' : 'new'}`}
          pokemon={pokemon}
          isCaptured={isCaptured}
          capturedData={currentCapturedData}
          onCapture={capture}
          onRelease={release}
        />
      </div>
    </div>
  );
};
