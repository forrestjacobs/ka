import { combineReducers } from "redux";
import { Action } from "./actions";
import { AsyncStatus, map, resolved } from "./async";
import { CharactersState, RootState, SearchResultsState } from "./state";

function searchResults(state: SearchResultsState = {}, action: Action): SearchResultsState {
  if (action.type === "FETCH_SEARCH_RESULTS") {
    const literals = map(action.state, (results) => {
      if (results !== undefined) {
        return results.map((character) => character.literal);
      }
    });
    return Object.assign({}, state, {[action.request]: literals});
  }
  return state;
}

function characters(state: CharactersState = {}, action: Action): CharactersState {
  if (action.type === "FETCH_CHARACTER") {
    return Object.assign({}, state, {[action.request]: action.state});
  } else if (action.type === "FETCH_SEARCH_RESULTS" && action.state.status === AsyncStatus.RESOLVED &&
             action.state.response) {
    const newCharacters: CharactersState = {};
    for (const character of action.state.response) {
      newCharacters[character.literal] = resolved(character);
    }
    return Object.assign({}, state, newCharacters);
  }
  return state;
}

export const rootReducer = combineReducers<RootState>({
  entities: combineReducers({searchResults, characters}),
});
