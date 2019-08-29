import { ApolloServer } from "apollo-server";
import { schema } from ".";

const server = new ApolloServer({ schema });

server.listen(4000);
