import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CapturedPokemon } from '../types/captured';
import {
  getCapturedList,
  saveCaptured,
  removeCaptured,
  CAPTURED_CHANGE_EVENT,
} from '../services/storage';

export function useCaptured() {
  const [capturedList, setCapturedList] = useState<CapturedPokemon[]>(() => getCapturedList());

  useEffect(() => {
    const handleStorageChange = () => {
      setCapturedList(getCapturedList());
    };

    window.addEventListener(CAPTURED_CHANGE_EVENT, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CAPTURED_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const capturedMap = useMemo(() => {
    const map = new Map<number, CapturedPokemon>();
    for (const item of capturedList) {
      map.set(item.id, item);
    }
    return map;
  }, [capturedList]);

  const isPokemonCaptured = useCallback(
    (id: number) => capturedMap.has(id),
    [capturedMap]
  );

  const getCaptured = useCallback(
    (id: number) => capturedMap.get(id),
    [capturedMap]
  );

  const capture = useCallback((pokemon: CapturedPokemon) => {
    saveCaptured(pokemon);
    setCapturedList(getCapturedList());
  }, []);

  const release = useCallback((id: number) => {
    removeCaptured(id);
    setCapturedList(getCapturedList());
  }, []);

  return {
    capturedList,
    capturedMap,
    isPokemonCaptured,
    getCaptured,
    capture,
    release,
    count: capturedList.length,
  };
}
