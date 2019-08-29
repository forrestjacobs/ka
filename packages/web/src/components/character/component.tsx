import { Character as FullCharacter } from "@ka/base";
import React from "react";
import { useActive, Link } from "react-navi";
import { useMessages } from "../../messages";
import { Article, Heading, Section } from "../section";

export type Character = Pick<
  FullCharacter,
  "literal" | "on" | "kun" | "meaning"
>;

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
  character
}: {
  character: Character;
}): JSX.Element {
  const { literal } = character;
  const messages = useMessages();

  const href = `/character/${literal}`;
  const isOnCharacter = useActive(href);

  return (
    <Article className="character-component">
      <Heading className="literal" lang="ja">
        {isOnCharacter ? (
          literal
        ) : (
          <Link active={false} href={`/character/${literal}`}>
            {literal}
          </Link>
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
