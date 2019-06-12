import React from "react";
import { Route, StaticRouter } from "react-router";
import { act, create } from "react-test-renderer";
import { resolved } from "../../async";

const useMapStateMock = jest.fn();
jest.mock("../use-redux", () => ({
  useMapState: useMapStateMock
}));

const characterComponentMock = jest.fn(({ character }) => character);
jest.mock("./component", () => ({
  CharacterComponent: characterComponentMock
}));

import { CharacterPage } from "./page";

describe("character page", () => {
  it("shows the character", () => {
    useMapStateMock.mockImplementation(cb =>
      cb({
        entities: {
          characters: {
            日: resolved("day")
          }
        }
      })
    );

    const page = create(
      <StaticRouter location="/character/日">
        <Route exact path="/character/:literal" component={CharacterPage} />
      </StaticRouter>
    );

    // ensure hooks are called
    act(() => {});

    expect(page.toJSON()).toEqual(create(<>day</>).toJSON());
  });
});
