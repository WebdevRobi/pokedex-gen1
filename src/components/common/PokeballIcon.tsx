import React from 'react';

interface PokeballIconProps {
  className?: string;
}

export const PokeballIcon: React.FC<PokeballIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12 A10 10 0 0 1 22 12 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M2 12 A10 10 0 0 0 22 12 Z" fill="white" fillOpacity="0.9" className="dark:fill-slate-900 dark:fill-opacity-80" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="white" className="dark:fill-slate-900" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);
