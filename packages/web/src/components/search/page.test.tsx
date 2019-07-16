import React from "react";
import { Route, StaticRouter } from "react-router";
import { act, create } from "react-test-renderer";
import { resolved } from "../../async";
import { parsePath } from "history";

const useMapStateMock = jest.fn();
jest.mock("../use-redux", () => ({
  useMapState: useMapStateMock
}));

const characterComponentMock = jest.fn(({ character }) => character);
jest.mock("../character/component", () => ({
  CharacterComponent: characterComponentMock
}));

import { SearchPage } from "./page";
import { NotFoundPage } from "../not-found/page";

beforeEach(() => {
  useMapStateMock.mockReset();
  characterComponentMock.mockClear();
});

describe("search page", () => {
  it("shows the not found page if the query is missing", () => {
    const page = create(
      <StaticRouter location={{ ...parsePath("/"), query: {} }}>
        <Route component={SearchPage} />
      </StaticRouter>
    );

    expect(page.toJSON()).toEqual(
      create(
        <StaticRouter>
          <NotFoundPage />
        </StaticRouter>
      ).toJSON()
    );
  });

  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("shows the search results", () => {
    useMapStateMock.mockImplementation(cb =>
      cb({
        entities: {
          searchResults: {
            numbers: resolved(["一", "二"])
          },
          characters: {
            一: resolved("Result 1"),
            二: resolved("Result 2")
          }
        }
      })
    );

    const page = create(
      <StaticRouter location={{ ...parsePath("/"), query: { q: "numbers" } }}>
        <Route component={SearchPage} />
      </StaticRouter>
    );

    // ensure hooks are called
    act(() => {});

    expect(page.toJSON()).toEqual(
      create(
        <section>
          <h2>2 results for “numbers”</h2>
          <ol className="list-group list-group-flush">
            <li className="list-group-item">Result 1</li>
            <li className="list-group-item">Result 2</li>
          </ol>
        </section>
      ).toJSON()
    );
  });
});
