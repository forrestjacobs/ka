import { graphql } from "graphql";

const getCharacterMock = jest.fn();
const searchForCharactersMock = jest.fn();

jest.mock("@ka/data", () => ({
  getCharacter: getCharacterMock,
  searchForCharacters: searchForCharactersMock
}));

import { schema } from ".";

const literal = "日";
const character = {
  literal,
  meaning: ["Sun"]
};

describe("schema", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("It can get characters", async () => {
    getCharacterMock.mockImplementation(() => character);

    const result = await graphql({
      schema,
      source: `
        query getCharacter($literal: String!) {
          character(literal: $literal) { literal meaning }
        }
      `,
      variableValues: {
        literal
      }
    });

    expect(result).toEqual({
      data: { character }
    });
  });

  test("It can search for characters", async () => {
    searchForCharactersMock.mockImplementation(() => [character]);

    const result = await graphql({
      schema,
      source: `
        query getSearchResults($query: String!) {
          search(query: $query) { literal meaning }
        }
      `,
      variableValues: {
        query: "Sun"
      }
    });

    expect(result).toEqual({
      data: { search: [character] }
    });
  });
});
