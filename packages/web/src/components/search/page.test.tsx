const characterComponentMock = jest.fn(({ character }) => character);
jest.mock("../character/component", () => ({
  CharacterComponent: characterComponentMock
}));

beforeEach(() => {
  characterComponentMock.mockClear();
});

describe("search page", () => {
  it("shows the not found page if the query is missing");

  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("shows the search results");
});
