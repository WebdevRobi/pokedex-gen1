import { useState, useEffect } from 'react';
import { getStoredTheme, setStoredTheme } from '../services/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getStoredTheme());

  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
