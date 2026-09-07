import React from 'react';

interface BadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: 'bg-stone-500/20', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-500/30' },
  fire: { bg: 'bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500/30' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/30' },
  grass: { bg: 'bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30' },
  electric: { bg: 'bg-amber-400/25', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-400/40' },
  ice: { bg: 'bg-cyan-400/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-400/30' },
  fighting: { bg: 'bg-red-700/20', text: 'text-red-800 dark:text-red-300', border: 'border-red-700/30' },
  poison: { bg: 'bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/30' },
  ground: { bg: 'bg-amber-600/20', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-600/30' },
  flying: { bg: 'bg-indigo-400/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-400/30' },
  psychic: { bg: 'bg-pink-500/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-500/30' },
  bug: { bg: 'bg-lime-600/20', text: 'text-lime-800 dark:text-lime-300', border: 'border-lime-600/30' },
  rock: { bg: 'bg-yellow-700/20', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-700/30' },
  ghost: { bg: 'bg-purple-800/20', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-800/30' },
  dragon: { bg: 'bg-violet-700/20', text: 'text-violet-800 dark:text-violet-300', border: 'border-violet-700/30' },
  steel: { bg: 'bg-slate-400/20', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-400/30' },
  fairy: { bg: 'bg-rose-400/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-400/30' },
};

export const Badge: React.FC<BadgeProps> = ({ type, size = 'md' }) => {
  const normalizedType = type.toLowerCase();
  const theme = TYPE_COLORS[normalizedType] || {
    bg: 'bg-slate-200 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-semibold'
      : 'px-2.5 py-1 text-xs sm:text-sm font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border uppercase tracking-wider capitalize ${theme.bg} ${theme.text} ${theme.border} ${sizeClasses}`}
    >
      {type}
    </span>
  );
};
