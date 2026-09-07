import React from 'react';

interface SkeletonCardProps {
  mode?: 'grid' | 'list';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ mode = 'grid' }) => {
  if (mode === 'list') {
    return (
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center space-x-4 animate-pulse">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center animate-pulse">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="w-28 h-28 bg-slate-200 dark:bg-slate-800 rounded-full my-3" />
      <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
      <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
    </div>
  );
};
