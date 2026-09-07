import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { PokemonListItem } from '../../types/pokemon';

interface PokemonCardGridProps {
  pokemon: PokemonListItem;
  isCaptured: boolean;
}

export const PokemonCardGrid: React.FC<PokemonCardGridProps> = ({ pokemon, isCaptured }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-between text-center ${
        isCaptured
          ? 'border-emerald-500/50 dark:border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
          {formattedId}
        </span>

        {isCaptured ? (
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-100 dark:ring-emerald-950"
            title="Captured!"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        ) : (
          <div className="w-6 h-6" />
        )}
      </div>

      <div className="relative w-28 h-28 my-2 flex items-center justify-center">
        {!imageLoaded && (
          <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        )}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-28 h-28 object-contain transition-transform duration-200 group-hover:scale-110 drop-shadow-sm ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = pokemon.artwork;
          }}
        />
      </div>

      <div className="w-full mt-1">
        <h3 className="capitalize font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-500 transition-colors text-base truncate">
          {pokemon.name}
        </h3>
      </div>
    </Link>
  );
};
