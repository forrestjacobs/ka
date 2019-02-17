import { Character, isKanji } from "@ka/base";

export interface Api {
  getSearchResults(q: string): Promise<Character[]>;
  getCharacter(literal: string): Promise<Character>;
}

async function mapResponse<T>(response: Response, cb: (response: Response) => Promise<T>): Promise<T> {
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return await cb(response);
}

const restApi: Api = {

  async getSearchResults(q: string): Promise<Character[]> {
    return mapResponse(await fetch(`/api/character?q=${q}`), (result) => result.json());
  },

  async getCharacter(literal: string): Promise<Character> {
    if (!isKanji(literal)) {
      throw new Error(`Status 404`);
    }
    return mapResponse(await fetch(`/api/character/${literal}`), (result) => result.json());
  },

};

export function getApi(): Api {
  // todo: non-web api
  return restApi;
}
