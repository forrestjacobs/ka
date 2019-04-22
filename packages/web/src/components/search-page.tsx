import { parse as qsParse, stringify as qsStringify } from "query-string";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { map } from "../async";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { mapAsyncStateToEl, mapAsyncStateToPage, NotFoundPage, Page } from "./util-pages";

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const q = getQ(location.search);
  if (q === undefined) {
    return <NotFoundPage />;
  }

  const asyncResults = useMapState(({ entities }) => {
    const results = entities.searchResults[q];
    if (results !== undefined) {
      return map(results, (literals) => literals.map((literal) => ({
        literal, character: entities.characters[literal],
      })));
    }
  });

  const { fetchSearchResults } = useActions();
  useEffect(() => { fetchSearchResults(q); }, [fetchSearchResults, q]);

  return mapAsyncStateToPage(asyncResults, (searchResults) => {
    const searchResultsEls = searchResults.map((searchResult) => (
      <li className="list-group-item" key={searchResult.literal}>
        {mapAsyncStateToEl(searchResult.character, (character) => <CharacterComponent {...{character}} />)}
      </li>
    ));
    return (
      <Page title={q}>
        <h1>
          <FormattedMessage
            id="search.results"
            values={{ results: searchResults.length, terms: <strong>{q}</strong> }}
          />
        </h1>
        <ol className="list-group list-group-flush">{searchResultsEls}</ol>
      </Page>
    );
  });
}

export const SearchForm = withRouter(({ history, location }) => {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (location.pathname === "/search") {
      const locationQ = getQ(location.search);
      if (locationQ !== undefined) {
        setQ(locationQ);
      }
    }
  }, [location.pathname, location.search]);

  function onSearchSubmit(e: React.FormEvent<any>): void {
    e.preventDefault();
    history.push({
      pathname: "/search",
      search: `?${qsStringify({q})}`,
    });
  }

  function onQChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQ(e.target.value);
  }

  function input(label: string): JSX.Element {
    return (
      <input
        value={q}
        onChange={onQChange}
        type="search"
        name="q"
        id="q"
        aria-label={label}
        className="form-control"
      />
    );
  }

  return (
    <form method="get" action="/search" onSubmit={onSearchSubmit}>
      <div className="input-group">
        <FormattedMessage id="search.field">
          {(label) => input(label as string)}
        </FormattedMessage>
        <div className="input-group-append">
          <FormattedMessage id="search.button">
            {(text) => <button className="btn btn-outline-primary" type="submit">{text}</button>}
          </FormattedMessage>
        </div>
      </div>
    </form>
  );
});

function getQ(search: string): string | undefined {
  const q = qsParse(search).q;
  if (Array.isArray(q)) {
    return q.join(" ");
  } else if (q !== null) {
    return q;
  }
}
