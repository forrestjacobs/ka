import { parse as qsParse, stringify as qsStringify } from "query-string";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AsyncState, map } from "../async";
import { useMessages } from "../messages";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import {
  NotFoundPage,
  Page,
  mapAsyncStateToEl,
  mapAsyncStateToPage
} from "./util-pages";
import { Character } from "@ka/base";

function getQ(search: string): string | undefined {
  const q = qsParse(search).q;
  if (Array.isArray(q)) {
    return q.join(" ");
  } else if (q !== null) {
    return q;
  }
}

interface SearchResult {
  literal: string;
  character: AsyncState<Character>;
}

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const q = getQ(location.search);
  if (q === undefined) {
    return <NotFoundPage />;
  }

  const messages = useMessages();

  const asyncResults = useMapState(
    ({ entities }): AsyncState<SearchResult[]> | undefined => {
      const results = entities.searchResults[q];
      if (results !== undefined) {
        return map(
          results,
          (literals): SearchResult[] =>
            literals.map(
              (literal): SearchResult => ({
                literal,
                character: entities.characters[literal]
              })
            )
        );
      }
    }
  );

  const { fetchSearchResults } = useActions();
  useEffect((): void => {
    fetchSearchResults(q);
  }, [fetchSearchResults, q]);

  return mapAsyncStateToPage(
    asyncResults,
    (searchResults): JSX.Element => {
      const searchResultsEls = searchResults.map(
        (searchResult): JSX.Element => (
          <li className="list-group-item" key={searchResult.literal}>
            {mapAsyncStateToEl(
              searchResult.character,
              (character): JSX.Element => (
                <CharacterComponent character={character} />
              )
            )}
          </li>
        )
      );
      return (
        <Page title={q}>
          <h1>
            {messages.search.results({
              results: searchResults.length,
              terms: q
            })}
          </h1>
          <ol className="list-group list-group-flush">{searchResultsEls}</ol>
        </Page>
      );
    }
  );
}

export const SearchForm = withRouter(
  ({ history, location }): JSX.Element => {
    const [q, setQ] = useState("");

    useEffect((): void => {
      if (location.pathname === "/search") {
        const locationQ = getQ(location.search);
        if (locationQ !== undefined) {
          setQ(locationQ);
        }
      }
    }, [location.pathname, location.search]);

    const messages = useMessages();

    function onSearchSubmit(e: React.FormEvent<unknown>): void {
      e.preventDefault();
      history.push({
        pathname: "/search",
        search: `?${qsStringify({ q })}`
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
            aria-label={messages.search.field()}
            className="form-control"
          />
          <div className="input-group-append">
            <button className="btn btn-outline-primary" type="submit">
              {messages.search.button()}
            </button>
          </div>
        </div>
      </form>
    );
  }
);
