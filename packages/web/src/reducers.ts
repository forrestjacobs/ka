import { combineReducers } from "redux";
import { Action } from "./actions";
import { CharactersState, RootState } from "./state";

function characters(state: CharactersState = {}, action: Action): CharactersState {
  if (action.type === "FETCH_CHARACTER") {
    return Object.assign({}, state, {[action.request]: action.state});
  }
  return state;
}

export const rootReducer = combineReducers<RootState>({
  entities: combineReducers({characters}),
});
