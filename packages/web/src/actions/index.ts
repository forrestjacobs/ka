import { Character } from "@ka/base";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Api } from "../api";
import { RootState } from "../state";
import { AsyncAction, asyncDispatch } from "./async";

export type Action = AsyncAction<"FETCH_CHARACTER", string, Character | undefined>;

interface ThunkParam { api: Api; }

export type Dispatch = ThunkDispatch<RootState, ThunkParam, Action>;

type KaThunkAction<ReturnType> = ThunkAction<ReturnType, RootState, ThunkParam, Action>;

export function fetchCharacter(literal: string): KaThunkAction<Promise<void>> {
  return async (dispatch, getState, {api}) => {
    if (!getState().entities.characters.hasOwnProperty(literal)) {
      return asyncDispatch("FETCH_CHARACTER", literal, api.getCharacter)(dispatch);
    }
  };
}
