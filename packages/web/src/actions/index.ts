import { Character } from "@ka/base";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Api } from "../api";
import { RootState } from "../state";
import { AsyncAction, asyncDispatch } from "./async";

export type Action =
  | AsyncAction<"FETCH_SEARCH_RESULTS", string, Character[] | undefined>
  | AsyncAction<"FETCH_CHARACTER", string, Character | undefined>;

interface ThunkParam {
  api: Api;
}

export type Dispatch = ThunkDispatch<RootState, ThunkParam, Action>;

type KaThunkAction<ReturnType> = ThunkAction<
  ReturnType,
  RootState,
  ThunkParam,
  Action
>;

export function fetchSearchResults(q: string): KaThunkAction<Promise<void>> {
  return async (dispatch, getState, { api }): Promise<void> => {
    if (!getState().entities.searchResults.hasOwnProperty(q)) {
      return asyncDispatch("FETCH_SEARCH_RESULTS", q, api.getSearchResults)(
        dispatch
      );
    }
  };
}

export function fetchCharacter(literal: string): KaThunkAction<Promise<void>> {
  return async (dispatch, getState, { api }): Promise<void> => {
    if (!getState().entities.characters.hasOwnProperty(literal)) {
      return asyncDispatch("FETCH_CHARACTER", literal, api.getCharacter)(
        dispatch
      );
    }
  };
}
