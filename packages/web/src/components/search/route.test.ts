const dispatchMock = jest.fn();
const fetchSearchResultsMock = jest.fn(
  (terms: string): string => `${terms} action`
);
jest.mock("../../actions", () => ({
  fetchSearchResults: fetchSearchResultsMock
}));

beforeEach(() => {
  dispatchMock.mockClear();
  fetchSearchResultsMock.mockClear();
});

describe("search route", () => {
  it("calls the 'fetch search result' action");
});
