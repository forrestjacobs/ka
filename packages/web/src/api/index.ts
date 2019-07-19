import { Character } from "@ka/base";

export interface Api {
  getSearchResults(q: string): Promise<Character[]>;
  getCharacter(literal: string): Promise<Character | undefined>;
}
