import { Character } from "@ka/base";
import { getCharacter, searchForCharacters } from "@ka/data";

async function characterQuery(
  _: unknown,
  { literal }: { literal: string }
): Promise<Character | undefined> {
  return await getCharacter(literal);
}

async function searchQuery(
  _: unknown,
  { query }: { query: string }
): Promise<Character[]> {
  return await searchForCharacters(query);
}

export const resolvers = {
  Query: {
    character: characterQuery,
    search: searchQuery
  }
};
