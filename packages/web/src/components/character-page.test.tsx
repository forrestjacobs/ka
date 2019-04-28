import React from "react";
import { Route, StaticRouter } from "react-router";
import { act, create } from "react-test-renderer";
import { resolved } from "../async";

const fetchCharacterMock = jest.fn();
const useActionsMock = jest.fn(() => ({
  fetchCharacter: fetchCharacterMock,
}));
const useMapStateMock = jest.fn();
jest.mock("./use-redux", () => ({
  useActions: useActionsMock,
  useMapState: useMapStateMock,
}));

const characterComponentMock = jest.fn(({character}) => character);
jest.mock("./character", () => ({
  CharacterComponent: characterComponentMock,
}));

import { CharacterPage } from "./character-page";

describe("search page", () => {

  it("calls the 'fetch character' action", () => {
    create((
      <StaticRouter location="/character/日">
        <Route exact path="/character/:literal" component={CharacterPage} />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(fetchCharacterMock).toBeCalledWith("日");
  });

  it("shows the character", () => {
    useMapStateMock.mockImplementation((cb) => cb({
      entities: {
        characters: {
          日: resolved("day"),
        },
      },
    }));

    const page = create((
      <StaticRouter location="/character/日">
        <Route exact path="/character/:literal" component={CharacterPage} />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(page.toJSON()).toEqual(create(<>day</>).toJSON());

  });

});
