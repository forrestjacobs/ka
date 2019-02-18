import { Character } from "@ka/base";
import React, { PureComponent, ReactNode, ReactNodeArray } from "react";
import { NavLink } from "react-router-dom";

interface CharacterProps {
  character: Character;
}

function toList(items: ReactNodeArray, keyPrefix: string): ReactNode {
  return items.map((item) => <li key={`${keyPrefix}-${item}`}>{item}</li>);
}

export class CharacterComponent extends PureComponent<CharacterProps> {

  public render(): ReactNode {
    const { character } = this.props;
    const { literal } = character;
    return (
      <>
        <h1 className="literal">
          <NavLink exact to={`/character/${literal}`}>{ literal }</NavLink>
        </h1>
        <ol className="meanings">{ toList(character.meaning, `${literal}-meaning`) }</ol>

        <h2>Kun</h2>
        <ol className="kun-reading">{ toList(character.kun, `${literal}-kun`) }</ol>

        <h2>On</h2>
        <ol className="on-reading">{ toList(character.on, `${literal}-on`) }</ol>
      </>
    );
  }

}
