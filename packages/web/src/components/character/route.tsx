import { ApolloClient, gql } from "apollo-boost";
import { route } from "navi";
import React from "react";
import { Character, CharacterComponent } from "./component";

const GET_CHARACTER = gql`
  query getCharacter($literal: String!) {
    character(literal: $literal) {
      literal
      on
      kun
      meaning
    }
  }
`;

export const characterRoute = route<{ client: ApolloClient<unknown> }>(
  async ({ params, context }): Promise<{}> => {
    const result = await context.client.query<{ character: Character }>({
      query: GET_CHARACTER,
      variables: {
        literal: params.literal
      }
    });
    return {
      view: <CharacterComponent character={result.data.character} />
    };
  }
);
