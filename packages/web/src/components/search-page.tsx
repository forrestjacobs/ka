import { Character } from "@ka/base";
import { parse as qsParse } from "query-string";
import React, { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch, fetchSearchResults } from "../actions";
import { AsyncState, map } from "../async";
import { RootState } from "../state";
import { CharacterComponent } from "./character";
import { mapStateToComponent, mapStateToPage, NotFound } from "./util-pages";

interface SearchPageProps {
  q?: string;
  results?: AsyncState<Array<AsyncState<Character>>>;
  dispatch: Dispatch;
}

class SearchPageComponent extends PureComponent<SearchPageProps> {

  public componentDidMount(): void {
    if (this.props.q) {
      this.props.dispatch(fetchSearchResults(this.props.q));
    }
  }

  public componentDidUpdate(prevProps: SearchPageProps): void {
    if (this.props.q !== prevProps.q && this.props.q) {
      this.props.dispatch(fetchSearchResults(this.props.q));
    }
  }

  public render(): ReactNode {
    if (!this.props.q) {
      return <NotFound />;
    }
    return mapStateToPage(this.props.results, (results) =>
      results.map((result) => mapStateToComponent(result, (character) => {
        return <CharacterComponent key={character.literal} link character={character} />;
      })),
    );
  }

}

function getQFromLocationSearch(search: string): string | undefined {
  const q: string | string[] | undefined = qsParse(search).q;
  return Array.isArray(q) ? q[0] : q;
}

export const SearchPage = connect(
  (state: RootState, ownProps: RouteComponentProps) => {
    const q = getQFromLocationSearch(ownProps.location.search);
    const result: Partial<SearchPageProps> = {q};
    if (q) {
      const searchResults = state.entities.searchResults[q];
      if (searchResults) {
        result.results = map(searchResults, (literals) => {
          return literals.map((literal) => state.entities.characters[literal]);
        });
      }
    }
    return result;
  })(SearchPageComponent);
