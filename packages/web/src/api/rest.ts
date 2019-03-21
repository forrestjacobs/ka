import { Character, isKanji } from "@ka/base";
import { stringify as qsStringify } from "query-string";
import { Api, ApiError, ApiErrorType } from "./api";

async function mapResponse<T>(response: Response, cb: (response: Response) => Promise<T>): Promise<T> {
  if (!response.ok) {
    const type = response.status === 404 ? ApiErrorType.NotFound : ApiErrorType.FetchError;
    throw new ApiError(`Status ${response.status}`, type);
  }
  return await cb(response);
}

export const restApi: Api = {

  async getSearchResults(q: string): Promise<Character[]> {
    return await mapResponse(await fetch(`/api/character?${qsStringify({q})}`), (result) => result.json());
  },

  async getCharacter(literal: string): Promise<Character> {
    if (!isKanji(literal)) {
      throw new ApiError(`Invalid kanji: ${literal}`, ApiErrorType.NotFound);
    }
    return await mapResponse(await fetch(`/api/character/${literal}`), (result) => result.json());
  },

};
