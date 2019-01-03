import { Character, isKanji } from "@ka/base";

export interface Api {
  getCharacter(literal: string): Promise<Character | undefined>;
}

const restApi: Api = {
  async getCharacter(literal: string): Promise<Character | undefined> {
    if (!isKanji(literal)) {
      return;
    }

    const result = await fetch(`/api/character/${literal}`);
    if (result.ok) {
      return await result.json();
    }
    if (result.status === 404) {
      return;
    }
    throw new Error(`Status ${result.status}`);
  },
};

export function getApi(): Api {
  // todo: non-web api
  return restApi;
}
