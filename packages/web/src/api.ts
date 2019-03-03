import { Character, isKanji } from "@ka/base";
import { stringify as qsStringify } from "query-string";

export enum ApiErrorType {
  FetchError,
  ParseError,
  NotFound,
}

export interface HasErrorType {
  type: ApiErrorType;
}

export class ApiError extends Error {
  public readonly type: ApiErrorType;

  constructor(message: string, type: ApiErrorType) {
    super(message);
    this.type = type;
  }
}

export interface Api {
  getSearchResults(q: string): Promise<Character[]>;
  getCharacter(literal: string): Promise<Character>;
}

async function mapResponse<T>(response: Response, cb: (response: Response) => Promise<T>): Promise<T> {
  if (!response.ok) {
    const type = response.status === 404 ? ApiErrorType.NotFound : ApiErrorType.FetchError;
    throw new ApiError(`Status ${response.status}`, type);
  }
  return await cb(response);
}

const restApi: Api = {

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

export function getApi(): Api {
  // todo: non-web api
  return restApi;
}
