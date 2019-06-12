const dispatchMock = jest.fn();
const fetchCharacterMock = jest.fn(
  (literal: string): string => `${literal} action`
);
jest.mock("../../actions", () => ({
  fetchCharacter: fetchCharacterMock
}));

import { characterRoute } from "./route";

describe("character route", () => {
  it("calls the 'fetch character' action", () => {
    characterRoute.loadData({
      dispatch: dispatchMock,
      match: {
        params: {
          literal: "日"
        }
      }
    });
    expect(fetchCharacterMock).toBeCalledWith("日");
    expect(dispatchMock).toBeCalledWith("日 action");
  });
});
