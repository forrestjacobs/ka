import React from "react";
import { MemoryRouter, Route, StaticRouter, Switch } from "react-router";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { resolved } from "../async";
import { LoadingPage, NotFoundPage } from "./util-pages";

const fetchSearchResultsMock = jest.fn();
const useActionsMock = jest.fn(() => ({
  fetchSearchResults: fetchSearchResultsMock,
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

import { SearchForm, SearchPage } from "./search-page";

beforeEach(() => {
  fetchSearchResultsMock.mockReset();
  useActionsMock.mockClear();
  useMapStateMock.mockReset();
  characterComponentMock.mockClear();
});

describe("search page", () => {

  it("shows the not found page if the query is missing", () => {
    const page = create((
      <StaticRouter location="/search">
        <Route component={SearchPage} />
      </StaticRouter>
    ));

    expect(page.toJSON()).toEqual(create((
      <StaticRouter>
        <NotFoundPage />
      </StaticRouter>
    )).toJSON());
  });

  it("calls the 'fetch search result' action", () => {
    create((
      <StaticRouter location="/search?q=test%20query">
        <Route component={SearchPage} />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(fetchSearchResultsMock).toBeCalledWith("test query");
  });

  it("shows the loading page when search results are loading", () => {
    useMapStateMock.mockImplementation((cb) => cb({
      entities: {
        searchResults: {},
      },
    }));

    const page = create((
      <StaticRouter location="/search?q=test%20query">
        <Route component={SearchPage} />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(page.toJSON()).toEqual(create((
      <StaticRouter>
        <LoadingPage />
      </StaticRouter>
    )).toJSON());
  });

  // todo: this should not test class names or translated strings,
  // but that might require switching to a different testing library
  it("shows the search results", () => {
    useMapStateMock.mockImplementation((cb) => cb({
      entities: {
        searchResults: {
          numbers: resolved(["一", "二"]),
        },
        characters: {
          一: resolved("Result 1"),
          二: resolved("Result 2"),
        },
      },
    }));

    const page = create((
      <StaticRouter location="/search?q=numbers">
        <Route component={SearchPage} />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(page.toJSON()).toEqual(create((
      <>
        <h1>2 results for “numbers”</h1>
        <ol className="list-group list-group-flush">
          <li className="list-group-item">Result 1</li>
          <li className="list-group-item">Result 2</li>
        </ol>
      </>
    )).toJSON());

  });

});

describe("search form", () => {

  function updateQuery(query: string, form: ReactTestRenderer): void {
    act(() => {
      form.root.findByType("input").props.onChange({
        target: { value: query },
      });
    });
  }

  it("uses the URL's query", () => {
    const form = create((
      <StaticRouter location="/search?q=url%20query">
        <SearchForm />
      </StaticRouter>
    ));

    // ensure hooks are called
    // tslint:disable-next-line: no-empty
    act(() => {});

    expect(form.root.findByType("input").props.value).toBe("url query");
  });

  it("updates the query on input", () => {
    const form = create((
      <StaticRouter>
        <SearchForm />
      </StaticRouter>
    ));

    updateQuery("new value", form);
    expect(form.root.findByType("input").props.value).toBe("new value");
  });

  it("navigates to the search page with the query when submitted", () => {
    const renderSearchRouteMock = jest.fn();
    const form = create((
      <MemoryRouter>
        <SearchForm />
        <Switch>
          <Route exact path="/search" render={renderSearchRouteMock} />
        </Switch>
      </MemoryRouter>
    ));

    const preventDefaultMock = jest.fn();
    updateQuery("new value", form);
    act(() => {
      form.root.findByType("form").props.onSubmit({
        preventDefault: preventDefaultMock,
      });
    });
    expect(preventDefaultMock).toBeCalled();
    expect(renderSearchRouteMock).toBeCalled();
    expect(renderSearchRouteMock.mock.calls[0][0].location.search).toBe("?q=new%20value");
  });

});
