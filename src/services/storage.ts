import type { CapturedPokemon } from '../types/captured';

const CAPTURED_STORAGE_KEY = 'pokedex_captured_list';
const THEME_STORAGE_KEY = 'pokedex_theme';
const VIEW_MODE_STORAGE_KEY = 'pokedex_view_mode';

export const CAPTURED_CHANGE_EVENT = 'pokedex_captured_changed';

export function getCapturedList(): CapturedPokemon[] {
  try {
    const raw = localStorage.getItem(CAPTURED_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse captured list from localStorage', err);
    return [];
  }
}

export function saveCaptured(pokemon: CapturedPokemon): void {
  try {
    const list = getCapturedList();
    const existingIndex = list.findIndex((item) => item.id === pokemon.id);
    let updatedList: CapturedPokemon[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...pokemon,
      };
    } else {
      updatedList = [pokemon, ...list];
    }
    localStorage.setItem(CAPTURED_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent(CAPTURED_CHANGE_EVENT, { detail: updatedList }));
  } catch (err) {
    console.error('Failed to save captured pokemon to localStorage', err);
  }
}

export function removeCaptured(id: number): void {
  try {
    const list = getCapturedList();
    const updatedList = list.filter((item) => item.id !== id);
    localStorage.setItem(CAPTURED_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent(CAPTURED_CHANGE_EVENT, { detail: updatedList }));
  } catch (err) {
    console.error('Failed to remove captured pokemon from localStorage', err);
  }
}

export function isCaptured(id: number): boolean {
  const list = getCapturedList();
  return list.some((item) => item.id === id);
}

export function getCapturedById(id: number): CapturedPokemon | undefined {
  const list = getCapturedList();
  return list.find((item) => item.id === id);
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to save theme to localStorage', err);
  }
}

export function getStoredViewMode(): 'grid' | 'list' {
  try {
    const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return mode === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
}

export function setStoredViewMode(mode: 'grid' | 'list'): void {
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch (err) {
    console.error('Failed to save view mode to localStorage', err);
  }
}
