export interface CapturedPokemon {
  id: number;
  name: string;
  nickname: string;
  date: string; // MM/DD/YYYY or YYYY-MM-DD
  sprite: string;
  artwork?: string;
  types?: string[];
  capturedAtTimestamp?: number;
}
