import { Character } from "@ka/base";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AsyncState } from "../../async";
import { useMessages } from "../../messages";
import { CharacterComponent } from "../character/component";
import { useMapState } from "../use-redux";
import { NotFoundPage, Page, MapAsyncState } from "../util-pages";

interface SearchResult {
  literal: string;
  character: AsyncState<Character>;
}

function SearchResults({
  resultLiterals
}: {
  resultLiterals: string[];
}): JSX.Element {
  const results = useMapState(
    ({ entities }): SearchResult[] =>
      resultLiterals.map(
        (literal): SearchResult => ({
          literal,
          character: entities.characters[literal]
        })
      )
  );

  return (
    <ol className="list-group list-group-flush">
      {results.map(
        (result): JSX.Element => (
          <li className="list-group-item" key={result.literal}>
            <MapAsyncState state={result.character}>
              {(character): JSX.Element => (
                <CharacterComponent character={character} />
              )}
            </MapAsyncState>
          </li>
        )
      )}
    </ol>
  );
}

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const messages = useMessages();

  const q = location.query.q;
  if (q === undefined || typeof q !== "string") {
    return <NotFoundPage />;
  }

  const resultsState = useMapState(
    ({ entities }): AsyncState<string[]> => entities.searchResults[q]
  );

  return (
    <MapAsyncState page state={resultsState}>
      {(results): JSX.Element => (
        <Page title={q}>
          <h1>
            {messages.search.results({
              results: results.length,
              terms: q
            })}
          </h1>
          <SearchResults resultLiterals={results} />
        </Page>
      )}
    </MapAsyncState>
  );
}
