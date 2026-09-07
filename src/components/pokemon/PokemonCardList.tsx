import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import type { PokemonListItem } from '../../types/pokemon';

interface PokemonCardListProps {
  pokemon: PokemonListItem;
  isCaptured: boolean;
}

export const PokemonCardList: React.FC<PokemonCardListProps> = ({ pokemon, isCaptured }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={`group bg-white dark:bg-slate-900 border rounded-xl p-3 flex items-center justify-between transition-all hover:shadow-md hover:-translate-x-0.5 ${
        isCaptured
          ? 'border-emerald-500/50 dark:border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-14 h-14 bg-slate-100 dark:bg-slate-800/80 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-14 h-14 object-contain transition-transform group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = pokemon.artwork;
            }}
          />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
            {formattedId}
          </span>
          <h3 className="capitalize font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-500 transition-colors text-base">
            {pokemon.name}
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isCaptured && (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-300 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Captured</span>
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
      </div>
    </Link>
  );
};
