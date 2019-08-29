import React from "react";
import { useMessages } from "../../messages";
import { Character, CharacterComponent } from "../character/component";
import { Heading, Section } from "../section";

export function SearchPage({
  query,
  characters
}: {
  query: string;
  characters: Character[];
}): JSX.Element {
  const messages = useMessages();

  return (
    <Section>
      <Heading>
        {messages.search.results({
          results: characters.length,
          terms: query
        })}
      </Heading>
      <ol className="list-group list-group-flush">
        {characters.map(
          (character): JSX.Element => (
            <li className="list-group-item" key={character.literal}>
              <CharacterComponent character={character} />
            </li>
          )
        )}
      </ol>
    </Section>
  );
}
