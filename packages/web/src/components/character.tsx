import { Character } from "@ka/base";
import React, { PureComponent, ReactNode, ReactNodeArray } from "react";

interface CharacterProps {
  character: Character;
  link?: boolean;
}

function toList(items: ReactNodeArray, keyPrefix: string): ReactNode {
  return items.map((item) => <li key={`${keyPrefix}-${item}`}>{item}</li>);
}

export class CharacterComponent extends PureComponent<CharacterProps> {

  public render(): ReactNode {
    const { character, link } = this.props;
    const { literal } = character;
    return (
      <>
        <h1 className="literal">{
          link ? <a href={ `/character/${literal}` }>{ literal }</a> : literal
        }</h1>
        <ol className="meanings">{ toList(character.meaning, `${literal}-meaning`) }</ol>

        <h2>Kun</h2>
        <ol className="kun-reading">{ toList(character.kun, `${literal}-kun`) }</ol>

        <h2>On</h2>
        <ol className="on-reading">{ toList(character.on, `${literal}-on`) }</ol>
      </>
    );
  }

}
