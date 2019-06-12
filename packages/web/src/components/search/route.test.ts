const dispatchMock = jest.fn();
const fetchSearchResultsMock = jest.fn(
  (terms: string): string => `${terms} action`
);
jest.mock("../../actions", () => ({
  fetchSearchResults: fetchSearchResultsMock
}));

import { searchRoute } from "./route";

beforeEach(() => {
  dispatchMock.mockClear();
  fetchSearchResultsMock.mockClear();
});

describe("search route", () => {
  it("calls the 'fetch search result' action", async () => {
    searchRoute.loadData({
      dispatch: dispatchMock,
      location: {
        query: {
          q: "test query"
        }
      }
    });
    expect(fetchSearchResultsMock).toBeCalledWith("test query");
    expect(dispatchMock).toBeCalledWith("test query action");
  });
});
