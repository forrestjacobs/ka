import { parse as qsParse, stringify as qsStringify } from "query-string";
import React, { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { map } from "../async";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { mapAsyncState } from "./util-pages";

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const q = getQ(location.search);
  if (q === undefined) {
    return <Redirect to="/" />;
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

  return mapAsyncState(asyncResults, (searchResults) => {
    const searchResultsEls = searchResults.map((searchResult) => (
      <li className="list-group-item" key={searchResult.literal}>
        {mapAsyncState(searchResult.character, (character) => <CharacterComponent {...{character}} />)}
      </li>
    ));
    return (
      <>
        <h1>{searchResults.length} results for “{q}”</h1>
        <ol className="list-group list-group-flush">{searchResultsEls}</ol>
      </>
    );
  }, true);
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

  return (
    <form method="get" action="/search" onSubmit={onSearchSubmit}>
      <div className="input-group">
        <input
          value={q}
          onChange={onQChange}
          type="search"
          name="q"
          id="q"
          aria-label="Search"
          className="form-control"
        />
        <div className="input-group-append">
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </div>
      </div>
    </form>
  );
});

function getQ(search: string): string | undefined {
  const q: string | string[] | undefined = qsParse(search).q;
  return Array.isArray(q) ? q.join(" ") : q;
}
