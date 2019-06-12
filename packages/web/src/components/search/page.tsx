import { Character } from "@ka/base";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AsyncState, unwrap } from "../../async";
import { useMessages } from "../../messages";
import { CharacterComponent } from "../character/component";
import { useMapState } from "../use-redux";
import { NotFoundPage, Page, mapAsyncStateToEl } from "../util-pages";

interface SearchResult {
  literal: string;
  character: AsyncState<Character>;
}

export function SearchPage({ location }: RouteComponentProps): JSX.Element {
  const q = location.query.q;
  if (q === undefined || typeof q !== "string") {
    return <NotFoundPage />;
  }

  const messages = useMessages();

  const results = useMapState(
    ({ entities }): SearchResult[] =>
      unwrap(entities.searchResults[q]).map(
        (literal): SearchResult => ({
          literal,
          character: entities.characters[literal]
        })
      )
  );

  const items = results.map(
    (result): JSX.Element => (
      <li className="list-group-item" key={result.literal}>
        {mapAsyncStateToEl(
          result.character,
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
          results: results.length,
          terms: q
        })}
      </h1>
      <ol className="list-group list-group-flush">{items}</ol>
    </Page>
  );
}
