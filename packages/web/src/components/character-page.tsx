import { Character } from "@ka/base";
import React, { PureComponent, ReactNode, ReactNodeArray } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch, fetchCharacter } from "../actions";
import { AsyncState } from "../async";
import { RootState } from "../state";
import { mapStateToPage } from "./util-pages";

interface CharacterPageProps {
  literal: string;
  characterState?: AsyncState<Character | undefined>;
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
    function toList(items: ReactNodeArray, keyPrefix: string): ReactNode {
      return items.map((item) => <li key={`${keyPrefix}-${item}`}>{item}</li>);
    }
    return mapStateToPage(this.props.characterState, (character) => {
      const { literal } = character;
      return (
        <>
          <h1 className="literal">{ literal }</h1>
          <ol className="meanings">{ toList(character.meaning, `${literal}-meaning`) }</ol>

          <h2>Kun</h2>
          <ol className="kun-reading">{ toList(character.kun, `${literal}-kun`) }</ol>

          <h2>On</h2>
          <ol className="on-reading">{ toList(character.on, `${literal}-on`) }</ol>
        </>
      );
    });
  }

}

export const CharacterPage = connect(
  (state: RootState, ownProps: RouteComponentProps<{ literal: string }>) => {
    const literal = ownProps.match.params.literal;
    return {literal, characterState: state.entities.characters[literal]};
  })(CharacterPageComponent);
