import { Character } from "@ka/base";
import { fetchCharacter, fetchSearchResults } from ".";
import { Api } from "../api";
import { AsyncStatus } from "../async";
import { RootState } from "../state";

function makeCharacter(literal: string): Character {
  return { literal } as unknown as Character;
}

function forbiddenCallback(): never {
  throw new Error("Should not be called");
}

const searchResults = [makeCharacter("試")];

const api: Api = {
  getSearchResults: () => Promise.resolve(searchResults),
  getCharacter: (literal: string) => Promise.resolve(makeCharacter(literal)),
};

describe("fetch search results action", () => {
  const request = "test";
  const action = fetchSearchResults(request);

  it("does not fetch 'undefined' query", async () => {
    const dispatch = jest.fn();
    await fetchSearchResults(undefined)(dispatch, forbiddenCallback, { api });
    expect(dispatch).toBeCalledTimes(0);
  });

  it("dispatches search results", async () => {
    const dispatch = jest.fn();
    const getState = () => ({entities: {searchResults: {}}} as any as RootState);

    const result = action(dispatch, getState, { api });
    expect(dispatch).toBeCalledWith({
      type: "FETCH_SEARCH_RESULTS", request,
      state: { status: AsyncStatus.IN_PROGRESS },
    });
    await result;

    expect(dispatch).toBeCalledWith({
      type: "FETCH_SEARCH_RESULTS", request,
      state: { status: AsyncStatus.RESOLVED, response: searchResults },
    });
  });

  it("does not refetch search queries", async () => {
    const dispatch = jest.fn();
    const getState = () => ({entities: {searchResults: { [request]: {} }}} as any as RootState);
    await action(dispatch, getState, { api });
    expect(dispatch).toBeCalledTimes(0);
  });
});

describe("fetch character action", () => {
  const request = "亜";
  const action = fetchCharacter(request);

  it("dispatchs character fetch results", async () => {
    const dispatch = jest.fn();
    const getState = () => ({entities: {characters: {}}} as any as RootState);

    const result = action(dispatch, getState, { api });
    expect(dispatch).toBeCalledWith({
      type: "FETCH_CHARACTER", request,
      state: { status: AsyncStatus.IN_PROGRESS },
    });
    await result;

    expect(dispatch).toBeCalledWith({
      type: "FETCH_CHARACTER", request,
      state: { status: AsyncStatus.RESOLVED, response: makeCharacter(request) },
    });
  });

  it("does not refetch characters", async () => {
    const dispatch = jest.fn();
    const getState = () => ({entities: {characters: { [request]: {} }}} as any as RootState);
    await action(dispatch, getState, { api });
    expect(dispatch).toBeCalledTimes(0);
  });

});
