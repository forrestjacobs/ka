import { GlobalWithFetchMock } from "jest-fetch-mock";

const { fetch } = global as GlobalWithFetchMock;
const isKanjiMock = jest.fn();
jest.mock("@ka/base", () => ({ isKanji: isKanjiMock }));

process.env.API_URL = "http://api";

import { ApiError, ApiErrorType } from "./api";
import { restApi } from "./rest";

describe("get search results", () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it("calls the rest API", async () => {
    fetch.once(JSON.stringify([{ literal: "試" }]));
    expect(await restApi.getSearchResults("test")).toEqual([{ literal: "試" }]);
    expect(fetch.mock.calls[0][0]).toBe("http://api/character?q=test");
  });

  it("handles errors", async () => {
    fetch.once("Error", { status: 500 });
    const asymmetricMatch = (error: ApiError) =>
      error.type === ApiErrorType.FetchError;
    await expect(restApi.getSearchResults("test")).rejects.toEqual({
      asymmetricMatch
    });
  });
});

describe("get character", () => {
  function errorOfType(type: ApiErrorType): any {
    return { asymmetricMatch: (error: ApiError) => error.type === type };
  }

  afterEach(() => {
    isKanjiMock.mockReset();
    fetch.resetMocks();
  });

  it("calls the rest API", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once(JSON.stringify({ literal: "試" }));

    expect(await restApi.getCharacter("試")).toEqual({ literal: "試" });
    expect(fetch.mock.calls[0][0]).toBe("http://api/character/試");
  });

  it("validates kanji before calling the API", async () => {
    isKanjiMock.mockReturnValueOnce(false);

    await expect(restApi.getCharacter("a")).rejects.toEqual(
      errorOfType(ApiErrorType.NotFound)
    );
    expect(fetch).toBeCalledTimes(0);
  });

  it("handles missing kanji", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once("", { status: 404 });

    await expect(restApi.getCharacter("空")).rejects.toEqual(
      errorOfType(ApiErrorType.NotFound)
    );
  });

  it("handles other errors", async () => {
    isKanjiMock.mockReturnValueOnce(true);
    fetch.once("", { status: 500 });

    await expect(restApi.getCharacter("例")).rejects.toEqual(
      errorOfType(ApiErrorType.FetchError)
    );
  });
});
