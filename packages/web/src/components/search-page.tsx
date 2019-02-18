import { Character } from "@ka/base";
import { parse as qsParse } from "query-string";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps as OwnProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { fetchSearchResults } from "../actions";
import { AsyncState, map } from "../async";
import { RootState } from "../state";
import { CharacterComponent } from "./character";
import { mapAsyncPropsToPage, mapStateToComponent } from "./util-pages";

interface PageProps {
  state?: AsyncState<Array<AsyncState<Character>>>;
  fetch: () => void;
}

function getQ(ownProps: OwnProps): string | undefined {
  const q: string | string[] | undefined = qsParse(ownProps.location.search).q;
  return Array.isArray(q) ? q[0] : q;
}

function getResults(state: RootState, q: string): AsyncState<Array<AsyncState<Character>>> | undefined {
  const searchResults = state.entities.searchResults[q];
  if (searchResults === undefined) {
    return undefined;
  }
  return map(searchResults, (literals) => literals.map((literal) => state.entities.characters[literal]));
}

export const SearchPage = connect(
  (state: RootState, ownProps: OwnProps) => {
    const q = getQ(ownProps);
    const results = q === undefined ? undefined : getResults(state, q);
    return { state: results };
  },
  (dispatch, ownProps) => bindActionCreators({
    fetch: () => {
      const q = getQ(ownProps);
      return q === undefined ? undefined : fetchSearchResults(q);
    },
  }, dispatch),
)((props: PageProps) => mapAsyncPropsToPage(props, (state) =>
  state.map((result) => mapStateToComponent(result, (character) =>
    <CharacterComponent key={character.literal} character={character} />,
  )),
));
