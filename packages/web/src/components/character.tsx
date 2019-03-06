import { Character } from "@ka/base";
import { Localized } from "fluent-react";
import React, { PureComponent, ReactNode, ReactNodeArray } from "react";
import { NavLink } from "react-router-dom";

interface CharacterProps {
  character: Character;
}

function toList(items: ReactNodeArray, keyPrefix: string, lang?: string): ReactNode {
  return items.map((item) =>
    <li className="list-inline-item mr-4" key={`${keyPrefix}-${item}`} lang={lang}>{item}</li>);
}

export class CharacterComponent extends PureComponent<CharacterProps> {

  public render(): ReactNode {
    const { character } = this.props;
    const { literal } = character;

    const readingElements: JSX.Element[] = [];

    if (character.kun.length !== 0) {
      readingElements.push(
        <div className="row mb-3" key="kun">
          <Localized id="character-kun">
            <h2 className="h6 col-2 col-md-1 mb-0" />
          </Localized>
          <ol className="col list-inline mb-0">{toList(character.kun, `${literal}-kun`, "ja")}</ol>
        </div>,
      );
    }

    if (character.on.length !== 0) {
      readingElements.push(
        <div className="row mb-3" key="on">
          <Localized id="character-on">
            <h2 className="h6 col-2 col-md-1 mb-0" />
          </Localized>
          <ol className="col list-inline mb-0">{toList(character.on, `${literal}-on`, "ja")}</ol>
        </div>,
      );
    }

    return (
      <div className="row position-relative">
        <div className="col-auto h1 position-static">
          <NavLink
            exact
            to={`/character/${literal}`}
            lang="ja"
            className="stretched-link text-decoration-none"
          >
            {literal}
          </NavLink>
        </div>
        <div className="col">
          <ol className="list-inline mb-3">{toList(character.meaning, `${literal}-meaning`)}</ol>
          {readingElements}
        </div>
      </div>
    );
  }

}
