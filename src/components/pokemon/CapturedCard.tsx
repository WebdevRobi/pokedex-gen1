import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Calendar, Tag } from 'lucide-react';
import type { CapturedPokemon } from '../../types/captured';
import { useToast } from '../../hooks/useToast';

interface CapturedCardProps {
  captured: CapturedPokemon;
  onRelease: (id: number) => void;
  mode?: 'grid' | 'list';
}

export const CapturedCard: React.FC<CapturedCardProps> = ({
  captured,
  onRelease,
  mode = 'list',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showConfirmToast, showCapturedToast } = useToast();
  const formattedId = `#${captured.id.toString().padStart(3, '0')}`;

  const handleRelease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetName = captured.nickname || captured.name;
    showConfirmToast({
      message: `Are you sure you want to release ${targetName}?`,
      confirmLabel: 'Release',
      onConfirm: () => {
        onRelease(captured.id);
        showCapturedToast(`Released ${targetName} from collection.`);
      },
    });
  };

  if (mode === 'grid') {
    return (
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 border border-emerald-500/40 dark:border-emerald-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        {/* Header with Release Button */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
            {formattedId}
          </span>
          <button
            type="button"
            onClick={handleRelease}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900"
            title="Release Pokémon"
            aria-label={`Release ${captured.name}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clickable body navigating to detail */}
        <Link to={`/pokemon/${captured.id}`} className="flex flex-col items-center my-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <img
              src={captured.sprite}
              alt={captured.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-24 h-24 object-contain transition-transform group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={(e) => {
                if (captured.artwork) {
                  (e.target as HTMLImageElement).src = captured.artwork;
                }
              }}
            />
          </div>
          <h3 className="capitalize font-bold text-slate-900 dark:text-white text-base">
            {captured.name}
          </h3>
        </Link>

        {/* Nickname and Date details */}
        <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-left">
          <div className="flex items-center text-slate-700 dark:text-slate-300">
            <Tag className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
            <span className="font-semibold mr-1">Nickname:</span>
            <span className="truncate">{captured.nickname || 'None'}</span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
            <span className="font-semibold mr-1">Date:</span>
            <span>{captured.date}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-900 border border-emerald-500/40 dark:border-emerald-500/30 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <Link
        to={`/pokemon/${captured.id}`}
        className="flex items-center space-x-4 flex-1 min-w-0"
      >
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center p-1 flex-shrink-0 border border-slate-200 dark:border-slate-800">
          <img
            src={captured.sprite}
            alt={captured.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-14 h-14 object-contain transition-transform group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              if (captured.artwork) {
                (e.target as HTMLImageElement).src = captured.artwork;
              }
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="capitalize font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              {captured.name}
            </h3>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {formattedId}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Nickname:</span>{' '}
            <span className="font-medium text-red-600 dark:text-red-400">{captured.nickname || 'None'}</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Date:</span> {captured.date}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleRelease}
        className="ml-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex-shrink-0"
        title={`Release ${captured.nickname || captured.name}`}
        aria-label="Release"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
