import { Character } from "@ka/base";
import React, { ReactNode, ReactNodeArray } from "react";
import { NavLink } from "react-router-dom";
import { useMessages } from "../../messages";
import { Section, Heading } from "../section";

function toList(
  items: ReactNodeArray,
  keyPrefix: string,
  lang?: string
): ReactNode {
  return items.map(
    (item): JSX.Element => (
      <li
        className="list-inline-item mr-4"
        key={`${keyPrefix}-${item}`}
        lang={lang}
      >
        {item}
      </li>
    )
  );
}

export function CharacterComponent({
  character,
  link
}: {
  character: Character;
  link?: boolean;
}): JSX.Element {
  const { literal } = character;

  const messages = useMessages();

  const readingElements: JSX.Element[] = [];

  if (character.kun.length !== 0) {
    readingElements.push(
      <div className="row mb-3" key="kun">
        <h2 className="h6 col-2 col-md-1 mb-0">{messages.character.kun()}</h2>
        <ol className="col list-inline mb-0">
          {toList(character.kun, `${literal}-kun`, "ja")}
        </ol>
      </div>
    );
  }

  if (character.on.length !== 0) {
    readingElements.push(
      <div className="row mb-3" key="on">
        <h2 className="h6 col-2 col-md-1 mb-0">{messages.character.on()}</h2>
        <ol className="col list-inline mb-0">
          {toList(character.on, `${literal}-on`, "ja")}
        </ol>
      </div>
    );
  }

  return (
    <Section className="row position-relative">
      <div className="col-auto position-static">
        <Heading className="h1" lang="ja">
          {link ? (
            <NavLink
              exact
              to={`/character/${literal}`}
              className="stretched-link text-decoration-none"
            >
              {literal}
            </NavLink>
          ) : (
            literal
          )}
        </Heading>
      </div>
      <div className="col">
        <ol className="list-inline mb-3">
          {toList(character.meaning, `${literal}-meaning`)}
        </ol>
        {readingElements}
      </div>
    </Section>
  );
}
