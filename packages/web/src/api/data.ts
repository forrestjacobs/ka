import { Character } from "@ka/base";
import { getCharacter as gc, searchForCharacters } from "@ka/data";
import { Api, ApiError, ApiErrorType } from ".";

export const api: Api = {
  getSearchResults: searchForCharacters,

  async getCharacter(literal: string): Promise<Character> {
    const character = await gc(literal);
    if (character === undefined) {
      throw new ApiError("Not found", ApiErrorType.NotFound);
    }
    return character;
  }
};
