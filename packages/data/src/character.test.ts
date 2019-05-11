const CHARACTER_CS = new Object();

const manyOrNoneMock: jest.Mock<Promise<any[]>> = jest.fn();
const oneOrNoneMock: jest.Mock<Promise<any>> = jest.fn();
const helpersInsertMock: jest.Mock<string> = jest.fn();

jest.mock("./db", () => ({
  db: {
    manyOrNone: manyOrNoneMock,
    oneOrNone: oneOrNoneMock
  },
  pgp: {
    helpers: {
      ColumnSet: jest.fn(() => CHARACTER_CS),
      insert: helpersInsertMock
    }
  }
}));

import {
  getCharacter,
  getUpdateCharactersSql,
  searchForCharacters
} from "./character";

describe("search for characters", () => {
  afterEach(() => {
    manyOrNoneMock.mockReset();
  });

  test("can deal with an empty query", async () => {
    expect(await searchForCharacters("   ")).toEqual([]);
    expect(manyOrNoneMock).toBeCalledTimes(0);
  });

  test("can search for one term", async () => {
    manyOrNoneMock.mockResolvedValueOnce([{ literal: "猫" }]);
    expect(await searchForCharacters("  cat  ")).toEqual([{ literal: "猫" }]);
    expect(manyOrNoneMock.mock.calls[0][1]).toEqual("cat");
  });

  test("can search for multiple terms", async () => {
    manyOrNoneMock.mockResolvedValueOnce([{ literal: "橙" }]);
    expect(await searchForCharacters("bitter orange")).toEqual([
      { literal: "橙" }
    ]);
    expect(manyOrNoneMock.mock.calls[0][1]).toEqual("bitter & orange");
  });
});

describe("get character", () => {
  afterEach(() => {
    oneOrNoneMock.mockReset();
  });

  test("returns undefined if not found", async () => {
    const literal = "空";
    oneOrNoneMock.mockResolvedValueOnce(null);
    expect(await getCharacter(literal)).toBe(undefined);
    expect(oneOrNoneMock.mock.calls[0][1]).toEqual(literal);
  });

  test("returns a character with all values filled in", async () => {
    const literal = "八";
    const radical = 12;
    const strokeCount = [2];
    const radicalNames = ["はちがしら"];
    const on = ["ハチ"];
    const kun = ["や", "や.つ", "やっ.つ", "よう"];
    const meaning = ["eight", "eight radical (no. 12)"];
    const nanori = ["な", "は", "はっ", "はつ", "やち", "やつ"];
    const grade = 1;
    const freq = 92;
    const jlpt = 4;

    oneOrNoneMock.mockResolvedValueOnce({
      literal,
      radical,
      on,
      kun,
      meaning,
      nanori,
      grade,
      freq,
      jlpt,
      nelson_radical: radical,
      stroke_count: strokeCount,
      radical_names: radicalNames
    });

    expect(await getCharacter(literal)).toEqual({
      literal,
      radical,
      strokeCount,
      radicalNames,
      on,
      kun,
      meaning,
      nanori,
      grade,
      freq,
      jlpt,
      nelsonRadical: radical
    });

    expect(oneOrNoneMock.mock.calls[0][1]).toEqual(literal);
  });

  test("returns a character with minimal values filled in", async () => {
    const literal = "隝";
    const radical = 170;
    const strokeCount = [14];
    const radicalNames: string[] = [];
    const on = ["トウ", "チョウ"];
    const kun = ["しま"];
    const meaning: string[] = [];
    const nanori: string[] = [];

    oneOrNoneMock.mockResolvedValueOnce({
      literal,
      radical,
      on,
      kun,
      meaning,
      nanori,
      nelson_radical: radical,
      stroke_count: strokeCount,
      radical_names: radicalNames,
      grade: null,
      freq: null,
      jlpt: null
    });

    expect(await getCharacter(literal)).toEqual({
      literal,
      radical,
      strokeCount,
      radicalNames,
      on,
      kun,
      meaning,
      nanori,
      nelsonRadical: radical
    });

    expect(oneOrNoneMock.mock.calls[0][1]).toEqual(literal);
  });
});

describe("get update characters sql", () => {
  afterEach(() => {
    helpersInsertMock.mockReset();
  });

  it("generates sql using pgPromise", () => {
    const literal = "隝";
    const radical = 170;
    const strokeCount = [14];
    const radicalNames: string[] = [];
    const on = ["トウ", "チョウ"];
    const kun = ["しま"];
    const meaning: string[] = [];
    const nanori: string[] = [];

    const characters = [
      {
        literal,
        radical,
        strokeCount,
        radicalNames,
        on,
        kun,
        meaning,
        nanori,
        nelsonRadical: radical
      }
    ];

    helpersInsertMock.mockImplementationOnce(
      () => "INSERT INTO table VALUES x"
    );

    expect(getUpdateCharactersSql(characters)).toMatch(
      /^INSERT INTO table VALUES x/
    );
    expect(helpersInsertMock).toBeCalledWith(characters, CHARACTER_CS);
  });
});
