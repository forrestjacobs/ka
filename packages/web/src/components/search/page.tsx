import { Character } from "@ka/base";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AsyncState } from "../../async";
import { useMessages } from "../../messages";
import { CharacterComponent } from "../character/component";
import { useMapState } from "../use-redux";
import { NotFoundPage, Page, MapAsyncState } from "../util-pages";

function SearchResult({ literal }: { literal: string }): JSX.Element {
  const characterState = useMapState(
    ({ entities }): AsyncState<Character> => entities.characters[literal],
    [literal]
  );

  return (
    <MapAsyncState state={characterState}>
      {(character): JSX.Element => <CharacterComponent character={character} />}
    </MapAsyncState>
  );
}

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const messages = useMessages();

  const q = location.query.q;
  if (q === undefined || typeof q !== "string") {
    return <NotFoundPage />;
  }

  const literalsState = useMapState(
    ({ entities }): AsyncState<string[]> => entities.searchResults[q],
    [q]
  );

  return (
    <MapAsyncState page state={literalsState}>
      {(literals): JSX.Element => (
        <Page title={q}>
          <h1>
            {messages.search.results({
              results: literals.length,
              terms: q
            })}
          </h1>
          <ol className="list-group list-group-flush">
            {literals.map(
              (literal): JSX.Element => (
                <li className="list-group-item" key={literal}>
                  <SearchResult literal={literal} />
                </li>
              )
            )}
          </ol>
        </Page>
      )}
    </MapAsyncState>
  );
}
