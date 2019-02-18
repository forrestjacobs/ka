import { Character } from "@ka/base";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { fetchCharacter } from "../actions";
import { AsyncState } from "../async";
import { RootState } from "../state";
import { CharacterComponent } from "./character";
import { mapAsyncPropsToPage } from "./util-pages";

interface PageProps {
  state?: AsyncState<Character>;
  fetch: () => void;
}

type OwnProps = RouteComponentProps<{ literal: string }>;

function getLiteral(ownProps: OwnProps): string {
  return ownProps.match.params.literal;
}

export const CharacterPage = connect(
  (state: RootState, ownProps: OwnProps) => ({ state: state.entities.characters[getLiteral(ownProps)] }),
  (dispatch, ownProps) => bindActionCreators({ fetch: () => fetchCharacter(getLiteral(ownProps)) }, dispatch),
)((props: PageProps) => mapAsyncPropsToPage(props, (character) => <CharacterComponent character={character} />));
