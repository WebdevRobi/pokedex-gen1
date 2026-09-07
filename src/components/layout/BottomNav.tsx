import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Check } from 'lucide-react';
import { useCaptured } from '../../hooks/useCaptured';

export const BottomNav: React.FC = () => {
  const { count } = useCaptured();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 transition-colors">
      <div className="max-w-md mx-auto px-6 grid grid-cols-2 gap-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
              isActive
                ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <BookOpen className="w-4 h-4" />
          <span>All</span>
        </NavLink>

        <NavLink
          to="/captured"
          className={({ isActive }) =>
            `flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
              isActive
                ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <div className="flex items-center space-x-1">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Captured</span>
          </div>
          {count > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-xs font-bold rounded-full bg-white/20 dark:bg-white/20">
              {count}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
