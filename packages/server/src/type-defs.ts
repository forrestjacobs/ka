import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    character(literal: String!): Character
    search(query: String!): [Character!]!
  }

  type Character {
    literal: ID!
    radical: Int!
    nelsonRadical: Int!
    grade: Int
    strokeCount: [Int!]!
    freq: Int
    radicalNames: [String!]!
    jlpt: Int
    on: [String!]!
    kun: [String!]!
    meaning: [String!]!
    nanori: [String!]!
  }
`;
