import { Character } from "@ka/base";
import { AsyncState } from "./async";

export interface CharactersState {
  [literal: string]: AsyncState<Character | undefined>;
}

export interface RootState {
  entities: {
    characters: CharactersState;
  };
}
