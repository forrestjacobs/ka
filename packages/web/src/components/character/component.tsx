import { Character } from "@ka/base";
import React from "react";
import { NavLink } from "react-router-dom";
import { useMessages } from "../../messages";
import { Article, Heading, Section } from "../section";

function ListItems({ items }: { items: string[] }): JSX.Element {
  return (
    <>
      {items.map(
        (item): JSX.Element => (
          <li key={item}>{item}</li>
        )
      )}
    </>
  );
}

function Reading({
  heading,
  readings
}: {
  heading: string;
  readings: string[];
}): JSX.Element | null {
  if (readings.length === 0) {
    return null;
  }

  return (
    <Section className="vlist">
      <Heading className="heading">{heading}</Heading>
      <ol lang="ja">
        <ListItems items={readings} />
      </ol>
    </Section>
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

  return (
    <Article className="character-component">
      <Heading className="literal" lang="ja">
        {link ? (
          <NavLink exact to={`/character/${literal}`}>
            {literal}
          </NavLink>
        ) : (
          literal
        )}
      </Heading>
      <div className="col">
        <Section className="vlist">
          <ol>
            <ListItems items={character.meaning} />
          </ol>
        </Section>
        <Reading heading={messages.character.kun()} readings={character.kun} />
        <Reading heading={messages.character.on()} readings={character.on} />
      </div>
    </Article>
  );
}
