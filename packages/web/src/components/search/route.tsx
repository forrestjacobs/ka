import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { route } from "navi";
import React from "react";
import { Character } from "../character/component";
import { SearchPage } from "./page";

const GET_SEARCH_RESULTS = gql`
  query getSearchResults($query: String!) {
    search(query: $query) {
      literal
      on
      kun
      meaning
    }
  }
`;

export const searchRoute = route<{ client: ApolloClient<unknown> }>(
  async ({ params, context }): Promise<{}> => {
    const query = params.q;
    const queryResult = await context.client.query<{ search: Character[] }>({
      query: GET_SEARCH_RESULTS,
      variables: {
        query
      }
    });

    return {
      title: query,
      view: <SearchPage query={query} characters={queryResult.data.search} />
    };
  }
);
