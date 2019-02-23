import { parse as qsParse } from "query-string";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { map } from "../async";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { mapAsyncStateToPage, mapStateToComponent } from "./util-pages";

function getQ(props: RouteComponentProps): string | undefined {
  const q: string | string[] | undefined = qsParse(props.location.search).q;
  return Array.isArray(q) ? q[0] : q;
}

export function SearchPage(props: RouteComponentProps): JSX.Element {
  const q = getQ(props);
  const results = useMapState(({ entities }) =>
    q !== undefined && entities.searchResults.hasOwnProperty(q)
      ? map(entities.searchResults[q], (literals) => literals.map((literal) => entities.characters[literal]))
      : undefined);

  const { fetchSearchResults } = useActions();
  useEffect(() => { fetchSearchResults(q); }, [fetchSearchResults, q]);

  return mapAsyncStateToPage(results, (r) => <>
    <h1>{r.length} results</h1>
    <ol className="list-group list-group-flush">
      {
        r.map((result) => mapStateToComponent(result, (character) =>
          <li className="list-group-item" key={character.literal}>
            <CharacterComponent character={character} />
          </li>,
        ))
      }
    </ol>
  </>);
}
