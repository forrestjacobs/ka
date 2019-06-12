import React from "react";
import { MemoryRouter, Route, StaticRouter, Switch } from "react-router";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { parsePath } from "history";

import { SearchForm } from "./form";

describe("search form", () => {
  function updateQuery(query: string, form: ReactTestRenderer): void {
    act(() => {
      form.root.findByType("input").props.onChange({
        target: { value: query }
      });
    });
  }

  it("uses the URL's query", () => {
    const form = create(
      <StaticRouter
        location={{ ...parsePath("/search"), query: { q: "url query" } }}
      >
        <SearchForm />
      </StaticRouter>
    );

    // ensure hooks are called
    act(() => {});

    expect(form.root.findByType("input").props.value).toBe("url query");
  });

  it("updates the query on input", () => {
    const form = create(
      <StaticRouter>
        <SearchForm />
      </StaticRouter>
    );

    updateQuery("new value", form);
    expect(form.root.findByType("input").props.value).toBe("new value");
  });

  it("navigates to the search page with the query when submitted", () => {
    const renderSearchRouteMock = jest.fn();
    const form = create(
      <MemoryRouter>
        <SearchForm />
        <Switch>
          <Route exact path="/search" render={renderSearchRouteMock} />
        </Switch>
      </MemoryRouter>
    );

    const preventDefaultMock = jest.fn();
    updateQuery("new value", form);
    act(() => {
      form.root.findByType("form").props.onSubmit({
        preventDefault: preventDefaultMock
      });
    });
    expect(preventDefaultMock).toBeCalled();
    expect(renderSearchRouteMock).toBeCalled();
    expect(renderSearchRouteMock.mock.calls[0][0].location.query.q).toBe(
      "new value"
    );
  });
});
