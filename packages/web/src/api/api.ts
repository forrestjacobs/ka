import { Character } from "@ka/base";

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
