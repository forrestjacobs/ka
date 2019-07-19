import { GlobalWithFetchMock } from "jest-fetch-mock";

const { fetch } = global as GlobalWithFetchMock;
const isKanjiMock = jest.fn();
jest.mock("@ka/base", () => ({ isKanji: isKanjiMock }));

process.env.API_URL = "http://api";

import { api } from "./rest";

describe("get search results", () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it("calls the rest API", async () => {
    fetch.once(JSON.stringify([{ literal: "試" }]));
    expect(await api.getSearchResults("test")).toEqual([{ literal: "試" }]);
    expect(fetch.mock.calls[0][0]).toBe("http://api/character?q=test");
  });

  it("handles errors", async () => {
    fetch.once("Error", { status: 500 });
    await expect(api.getSearchResults("test")).rejects.toThrowError();
  });
});

describe("get character", () => {
  afterEach(() => {
    isKanjiMock.mockReset();
    fetch.resetMocks();
  });

  it("calls the rest API", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once(JSON.stringify({ literal: "試" }));

    expect(await api.getCharacter("試")).toEqual({ literal: "試" });
    expect(fetch.mock.calls[0][0]).toBe("http://api/character/試");
  });

  it("validates kanji before calling the API", async () => {
    isKanjiMock.mockReturnValueOnce(false);

    await expect(api.getCharacter("a")).resolves.toBe(undefined);
    expect(fetch).toBeCalledTimes(0);
  });

  it("handles missing kanji", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once("", { status: 404 });

    await expect(api.getCharacter("空")).resolves.toBe(undefined);
  });

  it("handles other errors", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once("", { status: 500 });

    await expect(api.getCharacter("例")).rejects.toThrowError();
  });
});
