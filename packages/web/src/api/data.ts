import { getCharacter, searchForCharacters } from "@ka/data";
import { Api } from ".";

export const api: Api = {
  getSearchResults: searchForCharacters,
  getCharacter
};
