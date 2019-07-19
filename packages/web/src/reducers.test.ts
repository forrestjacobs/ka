import { Character } from "@ka/base";
import { resolvedState } from "./async";
import { rootReducer } from "./reducers";
import { RootState } from "./state";

const baseState: RootState = {
  entities: {
    searchResults: {},
    characters: {}
  }
};

function makeCharacter(literal: string): Character {
  return ({ literal } as unknown) as Character;
}

describe("fetch search results action reducer", () => {
  const terms = "test";
  const ichi = makeCharacter("一");
  const ni = makeCharacter("二");
  const resolvedResults = resolvedState([
    makeCharacter("一"),
    makeCharacter("二")
  ]);

  it("stores result list from search", () => {
    const state = rootReducer(baseState, {
      type: "FETCH_SEARCH_RESULTS",
      request: terms,
      state: resolvedResults
    });
    expect(state.entities.searchResults[terms]).toEqual(
      resolvedState(["一", "二"])
    );
  });

  it("stores characters from search", () => {
    const state = rootReducer(baseState, {
      type: "FETCH_SEARCH_RESULTS",
      request: terms,
      state: resolvedResults
    });
    expect(state.entities.characters[ichi.literal]).toEqual(
      resolvedState(ichi)
    );
    expect(state.entities.characters[ni.literal]).toEqual(resolvedState(ni));
  });
});

describe("fetch character action reducer", () => {
  it("stores character from fetch", () => {
    const literal = "亜";
    const resolvedChar = resolvedState(makeCharacter(literal));
    const state = rootReducer(baseState, {
      type: "FETCH_CHARACTER",
      request: literal,
      state: resolvedChar
    });
    expect(state.entities.characters[literal]).toEqual(resolvedChar);
  });
});
