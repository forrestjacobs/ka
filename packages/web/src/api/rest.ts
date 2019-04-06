import { Character, isKanji } from "@ka/base";
import { stringify as qsStringify } from "query-string";
import { Api, ApiError, ApiErrorType } from "./api";

const url = process.env.API_URL;

async function apiFetch(path: string): Promise<Response> {
  const response = await fetch(`${url}${path}`);
  if (!response.ok) {
    const type = response.status === 404 ? ApiErrorType.NotFound : ApiErrorType.FetchError;
    throw new ApiError(`Status ${response.status}`, type);
  }
  return response;
}

export const restApi: Api = {

  async getSearchResults(q: string): Promise<Character[]> {
    const response = await apiFetch(`/character?${qsStringify({q})}`);
    return await response.json();
  },

  async getCharacter(literal: string): Promise<Character> {
    if (!isKanji(literal)) {
      throw new ApiError(`Invalid kanji: ${literal}`, ApiErrorType.NotFound);
    }
    const response = await apiFetch(`/character/${literal}`);
    return await response.json();
  },

};
