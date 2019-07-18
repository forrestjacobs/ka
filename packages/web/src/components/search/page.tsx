import { Character } from "@ka/base";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AsyncState, notFound } from "../../async";
import { useMessages } from "../../messages";
import { CharacterComponent } from "../character/component";
import { useMapState } from "../use-redux";
import { MapAsyncState } from "../map-async-state";
import { Page } from "../page";
import { Section, Heading } from "../section";

function SearchResult({ literal }: { literal: string }): JSX.Element {
  const characterState = useMapState(
    ({ entities }): AsyncState<Character> => entities.characters[literal],
    [literal]
  );

  return (
    <MapAsyncState state={characterState}>
      {(character): JSX.Element => (
        <CharacterComponent link character={character} />
      )}
    </MapAsyncState>
  );
}

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const messages = useMessages();

  const q = location.query.q;
  const literalsState = useMapState(
    ({ entities }): AsyncState<string[]> =>
      q === undefined || typeof q !== "string"
        ? notFound
        : entities.searchResults[q],
    [q]
  );

  return (
    <MapAsyncState page state={literalsState}>
      {(literals): JSX.Element => (
        <Page title={q}>
          <Section>
            <Heading>
              {messages.search.results({
                results: literals.length,
                terms: q
              })}
            </Heading>
            <ol className="list-group list-group-flush">
              {literals.map(
                (literal): JSX.Element => (
                  <li className="list-group-item" key={literal}>
                    <SearchResult literal={literal} />
                  </li>
                )
              )}
            </ol>
          </Section>
        </Page>
      )}
    </MapAsyncState>
  );
}
