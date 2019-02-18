import { Character } from "@ka/base";
import React, { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch, fetchCharacter } from "../actions";
import { AsyncState } from "../async";
import { RootState } from "../state";
import { CharacterComponent } from "./character";
import { mapStateToPage } from "./util-pages";

interface CharacterPageProps {
  literal: string;
  characterState?: AsyncState<Character>;
  dispatch: Dispatch;
}

class CharacterPageComponent extends PureComponent<CharacterPageProps> {

  public componentDidMount(): void {
    this.props.dispatch(fetchCharacter(this.props.literal));
  }

  public componentDidUpdate(prevProps: CharacterPageProps): void {
    if (this.props.literal !== prevProps.literal) {
      this.props.dispatch(fetchCharacter(this.props.literal));
    }
  }

  public render(): ReactNode {
    return mapStateToPage(this.props.characterState, (character) => {
      return <CharacterComponent character={character } />;
    });
  }

}

export const CharacterPage = connect(
  (state: RootState, ownProps: RouteComponentProps<{ literal: string }>) => {
    const literal = ownProps.match.params.literal;
    return {literal, characterState: state.entities.characters[literal]};
  })(CharacterPageComponent);
