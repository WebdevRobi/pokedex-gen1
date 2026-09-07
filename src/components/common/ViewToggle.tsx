import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  mode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/80 dark:border-slate-700/80">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`p-2 rounded-lg transition-all ${
          mode === 'grid'
            ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
        }`}
        title="Grid view"
        aria-label="Grid view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`p-2 rounded-lg transition-all ${
          mode === 'list'
            ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
        }`}
        title="List view"
        aria-label="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
};
