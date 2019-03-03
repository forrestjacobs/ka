import { parse as qsParse } from "query-string";
import React, { useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { map } from "../async";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { mapAsyncState } from "./util-pages";

export function SearchPage(props: RouteComponentProps): JSX.Element {
  const qs = qsParse(props.location.search).q;
  if (qs === undefined) {
    return <Redirect to="/" />;
  }
  const q = Array.isArray(qs) ? qs.join(" ") : qs;

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
        <h1>{searchResults.length} results</h1>
        <ol className="list-group list-group-flush">{searchResultsEls}</ol>
      </>
    );
  }, true);
}
