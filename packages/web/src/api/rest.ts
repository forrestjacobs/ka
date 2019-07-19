import { Character, isKanji } from "@ka/base";
import { stringify as qsStringify } from "query-string";
import { Api } from ".";

const url = process.env.API_URL;

async function apiFetch(path: string): Promise<Response | undefined> {
  const response = await fetch(`${url}${path}`);
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  return response;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function mapToJson(
  response: Response | undefined,
  undefinedResult?: any
): Promise<any> {
  if (response === undefined) {
    return undefinedResult;
  }
  return await response.json();
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const api: Api = {
  async getSearchResults(q: string): Promise<Character[]> {
    const response = await apiFetch(`/character?${qsStringify({ q })}`);
    return await mapToJson(response, []);
  },

  async getCharacter(literal: string): Promise<Character | undefined> {
    if (!isKanji(literal)) {
      return undefined;
    }
    const response = await apiFetch(`/character/${literal}`);
    return await mapToJson(response);
  }
};
