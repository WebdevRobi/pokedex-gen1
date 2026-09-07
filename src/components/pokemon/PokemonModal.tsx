import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Calendar, Tag, Scale, Ruler, Loader2 } from 'lucide-react';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useCaptured } from '../../hooks/useCaptured';
import { Badge } from '../common/Badge';
import { getPokemonArtwork, getPokemonSprite } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import type { PokemonDetail } from '../../types/pokemon';
import type { CapturedPokemon } from '../../types/captured';

interface PokemonModalProps {
  pokemonId: number;
  onClose: () => void;
}

const getTodayDateFormatted = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

interface ModalStatusFormProps {
  pokemon: PokemonDetail;
  isCaptured: boolean;
  capturedData?: CapturedPokemon;
  onCapture: (pokemon: CapturedPokemon) => void;
  onRelease: (id: number) => void;
  onClose: () => void;
}

const ModalStatusForm: React.FC<ModalStatusFormProps> = ({
  pokemon,
  isCaptured,
  capturedData,
  onCapture,
  onRelease,
  onClose,
}) => {
  const navigate = useNavigate();
  const { showCapturedToast, showConfirmToast } = useToast();
  const [nickname, setNickname] = useState(capturedData?.nickname || '');
  const [date, setDate] = useState(capturedData?.date || getTodayDateFormatted());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date.trim()) {
      alert('Please enter or select a capture date.');
      return;
    }

    setIsSubmitting(true);

    // 1. Loading for 2 seconds
    setTimeout(() => {
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

      // 2. Show toast alert with animated round green checkmark
      showCapturedToast(
        isCaptured
          ? `Updated captured info for ${pokemon.name}!`
          : `Successfully captured ${pokemon.name}!`
      );

      setIsSubmitting(false);

      // 3. Show toast alert for 2 seconds, then smoothly close modal and navigate to captured list
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          navigate('/captured', { state: { newlyCapturedId: pokemon.id } });
        }, 250);
      }, 2000);
    }, 2000);
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
    <div className="text-left space-y-2.5 sm:space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Status
        </h4>
        {isCaptured && (
          <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Currently in collection
          </span>
        )}
      </div>

      <form onSubmit={handleCaptureSubmit} className="space-y-2.5 sm:space-y-3">
        <div>
          <label
            htmlFor="modal-nickname"
            className="block text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mb-0.5"
          >
            Enter Nickname
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              id="modal-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isSubmitting}
              placeholder={`e.g. Capt, Sparky, ${pokemon.name}`}
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-75"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label
              htmlFor="modal-capture-date"
              className="block text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              Enter Date (MM/DD/YYYY)
            </label>
            <button
              type="button"
              onClick={() => setDate(getTodayDateFormatted())}
              disabled={isSubmitting}
              className="text-[11px] sm:text-xs text-red-600 dark:text-red-400 hover:underline font-semibold disabled:opacity-50"
            >
              Set to Today
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              id="modal-capture-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-75"
              required
            />
          </div>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isSubmitting
                ? 'bg-emerald-600 text-white cursor-wait opacity-90'
                : isCaptured
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isCaptured ? 'Updating Details...' : 'Capturing Pokémon (2s)...'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isCaptured ? 'Update Captured Info' : 'Tag as Captured'}</span>
              </>
            )}
          </button>

          {isCaptured && !isSubmitting && (
            <button
              type="button"
              onClick={handleRelease}
              className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              Release Pokémon
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export const PokemonModal: React.FC<PokemonModalProps> = ({ pokemonId, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(pokemonId);
  const { isPokemonCaptured, getCaptured, capture, release } = useCaptured();

  const isCaptured = isPokemonCaptured(pokemonId);
  const currentCapturedData = getCaptured(pokemonId);

  // Smooth entrance transition on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15);
    return () => clearTimeout(timer);
  }, []);

  // Smooth exit transition
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  }, [onClose]);

  // Lock body scroll while modal is open & handle Esc key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  const formattedId = `#${pokemonId.toString().padStart(3, '0')}`;
  const artworkUrl = getPokemonArtwork(pokemonId);
  const spriteUrl = getPokemonSprite(pokemonId);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto overscroll-contain transition-opacity duration-250 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto overscroll-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-center transform transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {isLoading && (
          <div className="py-12 space-y-4 animate-pulse">
            <div className="w-12 h-5 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
            <div className="w-32 h-7 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        )}

        {isError && (
          <div className="py-8 space-y-3">
            <h3 className="text-lg font-bold text-red-600">Failed to load Pokémon</h3>
            <p className="text-sm text-slate-500">{error?.message}</p>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        )}

        {pokemon && (
          <>
            {/* Header with ID and Captured badge */}
            <div className="flex items-center justify-between mb-0.5 sm:mb-1 pr-8">
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">
                {formattedId}
              </span>
              {isCaptured && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[10px] sm:text-xs font-bold">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Captured</span>
                </span>
              )}
            </div>

            {/* Photo - responsive size on mobile */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto my-1 sm:my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-slate-800/80 dark:to-slate-800/20" />
              <img
                src={artworkUrl}
                alt={pokemon.name}
                className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-md transition-transform hover:scale-105 duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = spriteUrl;
                }}
              />
            </div>

            {/* Name */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black capitalize tracking-tight text-slate-900 dark:text-white mt-0.5">
              {pokemon.name}
            </h2>

            {/* Types */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 mb-3 sm:mb-4">
              {pokemon.types.map((t) => (
                <Badge key={t.slot} type={t.type.name} size="sm" />
              ))}
            </div>

            {/* Details section */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 text-left space-y-2.5 sm:space-y-3">
              <h4 className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Details
              </h4>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] sm:text-xs mb-0.5">
                    <Ruler className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Height</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] sm:text-xs mb-0.5">
                    <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Weight</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Base Stats:
                </span>
                <div className="space-y-1 sm:space-y-1.5">
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
                      <div key={s.stat.name} className="flex items-center text-[11px] sm:text-xs">
                        <span className="w-12 sm:w-14 font-semibold text-slate-500 dark:text-slate-400">
                          {label}
                        </span>
                        <span className="w-6 sm:w-7 font-mono font-bold text-slate-800 dark:text-slate-200 text-right mr-2">
                          {s.base_stat}
                        </span>
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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

            {/* Dashed Separator */}
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-3.5 sm:my-4" />

            {/* Status Section Form */}
            <ModalStatusForm
              key={`${pokemon.id}-${isCaptured ? 'captured' : 'new'}`}
              pokemon={pokemon}
              isCaptured={isCaptured}
              capturedData={currentCapturedData}
              onCapture={capture}
              onRelease={release}
              onClose={handleClose}
            />
          </>
        )}
      </div>
    </div>
  );
};
