import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, AlertTriangle, X } from 'lucide-react';
import { ToastContext } from './toast-types';
import type { ConfirmToastOptions } from './toast-types';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<
    | { type: 'captured'; message: string; id: number }
    | { type: 'confirm'; message: string; onConfirm: () => void; confirmLabel: string; cancelLabel: string; id: number }
    | null
  >(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const hideToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  const showCapturedToast = useCallback((message: string) => {
    clearTimer();
    const id = Date.now();
    setToast({ type: 'captured', message, id });
    timerRef.current = setTimeout(() => {
      setToast((curr) => (curr && curr.id === id ? null : curr));
    }, 3500);
  }, []);

  const showConfirmToast = useCallback((options: ConfirmToastOptions) => {
    clearTimer();
    const id = Date.now();
    setToast({
      type: 'confirm',
      message: options.message,
      onConfirm: options.onConfirm,
      confirmLabel: options.confirmLabel || 'Release',
      cancelLabel: options.cancelLabel || 'Cancel',
      id,
    });
    timerRef.current = setTimeout(() => {
      setToast((curr) => (curr && curr.id === id ? null : curr));
    }, 10000);
  }, []);

  return (
    <ToastContext.Provider value={{ showCapturedToast, showConfirmToast, hideToast }}>
      {children}

      {toast &&
        createPortal(
          <div
            className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-[10000] animate-toast-in max-w-[92vw] sm:max-w-md w-auto pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            {toast.type === 'captured' && (
              <div className="flex items-center space-x-3 px-4 py-3 bg-white dark:bg-slate-100 text-slate-900 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-300">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 animate-check-pop shadow-md shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                  <Check className="w-4 h-4 stroke-[3.5]" />
                </div>

                <span className="text-sm font-bold tracking-tight text-slate-900 pr-1">
                  {toast.message}
                </span>

                <button
                  type="button"
                  onClick={hideToast}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-200 transition-colors ml-1"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {toast.type === 'confirm' && (
              <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3 bg-white dark:bg-slate-100 text-slate-900 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-300">
                <div className="flex items-center space-x-2.5 flex-1 text-left">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {toast.message}
                  </span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={hideToast}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
                  >
                    {toast.cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmFn = toast.onConfirm;
                      hideToast();
                      confirmFn();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 transition-colors"
                  >
                    {toast.confirmLabel}
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};
