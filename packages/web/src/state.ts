import { Character } from "@ka/base";
import { AsyncState } from "./async";

export interface SearchResultsState {
  [q: string]: AsyncState<string[]>;
}

export interface CharactersState {
  [literal: string]: AsyncState<Character>;
}

export interface RootState {
  entities: {
    searchResults: SearchResultsState;
    characters: CharactersState;
  };
}
