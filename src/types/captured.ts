export interface CapturedPokemon {
  id: number;
  name: string;
  nickname: string;
  date: string;
  sprite: string;
  artwork?: string;
  types?: string[];
  capturedAtTimestamp?: number;
}
