import axios from 'axios';
import type { PokemonListResponse, PokemonDetail, PokemonListItem } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const GEN1_TOTAL = 151;

export function extractIdFromUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  const idStr = segments[segments.length - 1];
  return parseInt(idStr, 10);
}

export function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPokemonList(limit: number = 20, offset: number = 0): Promise<{
  results: PokemonListItem[];
  total: number;
  hasMore: boolean;
}> {
  if (offset >= GEN1_TOTAL) {
    return { results: [], total: GEN1_TOTAL, hasMore: false };
  }

  const effectiveLimit = Math.min(limit, GEN1_TOTAL - offset);
  const response = await apiClient.get<PokemonListResponse>(`/pokemon`, {
    params: {
      limit: effectiveLimit,
      offset,
    },
  });

  const results: PokemonListItem[] = response.data.results
    .map((item) => {
      const id = extractIdFromUrl(item.url);
      return {
        id,
        name: item.name,
        url: item.url,
        sprite: getPokemonSprite(id),
        artwork: getPokemonArtwork(id),
      };
    })
    .filter((pokemon) => pokemon.id <= GEN1_TOTAL);

  const hasMore = offset + effectiveLimit < GEN1_TOTAL;

  return {
    results,
    total: GEN1_TOTAL,
    hasMore,
  };
}

export async function fetchAllGen1Pokemon(): Promise<PokemonListItem[]> {
  const response = await apiClient.get<PokemonListResponse>(`/pokemon`, {
    params: {
      limit: GEN1_TOTAL,
      offset: 0,
    },
  });

  return response.data.results
    .map((item) => {
      const id = extractIdFromUrl(item.url);
      return {
        id,
        name: item.name,
        url: item.url,
        sprite: getPokemonSprite(id),
        artwork: getPokemonArtwork(id),
      };
    })
    .filter((pokemon) => pokemon.id <= GEN1_TOTAL);
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const response = await apiClient.get<PokemonDetail>(`/pokemon/${idOrName}`);
  return response.data;
}

export async function searchPokemonViaApi(query: string): Promise<PokemonListItem[]> {
  const clean = query.trim().toLowerCase().replace(/^#/, '');
  if (!clean) return [];

  const isNumeric = /^\d+$/.test(clean);

  if (isNumeric) {
    const id = parseInt(clean, 10);
    if (id >= 1 && id <= GEN1_TOTAL) {
      try {
        const detail = await fetchPokemonDetail(id);
        return [{
          id: detail.id,
          name: detail.name,
          url: `${API_BASE_URL}/pokemon/${detail.id}/`,
          sprite: getPokemonSprite(detail.id),
          artwork: getPokemonArtwork(detail.id),
        }];
      } catch {
        return [];
      }
    }
  }

  try {
    const direct = await fetchPokemonDetail(clean);
    if (direct.id <= GEN1_TOTAL) {
      return [{
        id: direct.id,
        name: direct.name,
        url: `${API_BASE_URL}/pokemon/${direct.id}/`,
        sprite: getPokemonSprite(direct.id),
        artwork: getPokemonArtwork(direct.id),
      }];
    }
  } catch {
  }

  const response = await apiClient.get<PokemonListResponse>(`/pokemon`, {
    params: {
      limit: GEN1_TOTAL,
      offset: 0,
    },
  });

  return response.data.results
    .map((item) => {
      const id = extractIdFromUrl(item.url);
      return {
        id,
        name: item.name,
        url: item.url,
        sprite: getPokemonSprite(id),
        artwork: getPokemonArtwork(id),
      };
    })
    .filter((pokemon) => {
      if (pokemon.id > GEN1_TOTAL) return false;
      const nameMatch = pokemon.name.toLowerCase().includes(clean);
      const idMatch = pokemon.id.toString() === clean || pokemon.id.toString().padStart(3, '0').includes(clean);
      return nameMatch || idMatch;
    });
}

