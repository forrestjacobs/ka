import { Api } from "../api";
import { RootState } from "../state";

const innerAsyncDispatchMock = jest.fn(async () => undefined);
const asyncDispatchMock = jest.fn(() => innerAsyncDispatchMock);

jest.mock("./async", () => ({
  asyncDispatch: asyncDispatchMock,
}));

const dispatch = jest.fn();

import { fetchCharacter, fetchSearchResults } from ".";

const api = {
  getSearchResults: jest.fn(),
  getCharacter: jest.fn(),
} as any as Api;

function stateGetter(state: any): () => RootState {
  return () => state as RootState;
}

describe("fetch search results action", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not fetch 'undefined' query", async () => {
    await fetchSearchResults(undefined)(dispatch, stateGetter(undefined), { api });
    expect(asyncDispatchMock).toBeCalledTimes(0);
    expect(innerAsyncDispatchMock).toBeCalledTimes(0);
  });

  it("pipes search API to asyncDispatch", async () => {
    await fetchSearchResults("test")(dispatch, stateGetter({entities: {searchResults: {}}}), { api });
    expect(asyncDispatchMock).toBeCalledWith("FETCH_SEARCH_RESULTS", "test", api.getSearchResults);
    expect(innerAsyncDispatchMock).toBeCalledWith(dispatch);
  });

  it("does not refetch search queries", async () => {
    await fetchSearchResults("test")(dispatch, stateGetter({entities: {searchResults: { test: {} }}}), { api });
    expect(asyncDispatchMock).toBeCalledTimes(0);
    expect(innerAsyncDispatchMock).toBeCalledTimes(0);
  });
});

describe("fetch character action", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("pipes character fetch API to asyncDispatch", async () => {
    await fetchCharacter("亜")(dispatch, stateGetter({entities: {characters: {}}}), { api });
    expect(asyncDispatchMock).toBeCalledWith("FETCH_CHARACTER", "亜", api.getCharacter);
    expect(innerAsyncDispatchMock).toBeCalledWith(dispatch);
  });

  it("does not refetch characters", async () => {
    await fetchCharacter("亜")(dispatch, stateGetter({entities: {characters: { 亜: {} }}}), { api });
    expect(asyncDispatchMock).toBeCalledTimes(0);
    expect(innerAsyncDispatchMock).toBeCalledTimes(0);
  });

});
