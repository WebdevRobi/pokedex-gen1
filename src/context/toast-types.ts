import { createContext } from 'react';

export interface ConfirmToastOptions {
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface ToastContextValue {
  showCapturedToast: (message: string) => void;
  showConfirmToast: (options: ConfirmToastOptions) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
