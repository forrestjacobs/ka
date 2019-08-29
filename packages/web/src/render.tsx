import { ApolloProvider } from "@apollo/react-hooks";
import { schema } from "@ka/server";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { SchemaLink } from "apollo-link-schema";
import { createMemoryNavigation, NotFoundError } from "navi";
import React from "react";
import { renderToString } from "react-dom/server";
import { Router, View } from "react-navi";
import serialize from "serialize-javascript";
import { ErrorComponent } from "./components/error/component";
import { NotFound } from "./components/not-found/component";
import { Root } from "./components/root";
import { routes } from "./components/routes";

export async function render(
  url: string,
  template: string
): Promise<{
  statusCode: number;
  html: string;
}> {
  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache()
  });

  function getHtml(title: string, app: JSX.Element): string {
    return template
      .replace("<!-- title -->", title || "Kanji Dictionary")
      .replace("<!-- root -->", renderToString(app))
      .replace(
        '"-- state --"',
        serialize(client.extract(), {
          isJSON: true
        })
      );
  }

  const navigation = createMemoryNavigation({
    context: { client },
    routes,
    url
  });

  const app = (
    <ApolloProvider client={client}>
      <Router context={{ client }} navigation={navigation}>
        <Root>
          <View />
        </Root>
      </Router>
    </ApolloProvider>
  );

  const route = await navigation.getRoute();

  try {
    return {
      statusCode: route.status || 200,
      html: getHtml(route.title || "Kanji Dictionary", app)
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        html: getHtml(
          "Not Found",
          <Root>
            <NotFound />
          </Root>
        )
      };
    } else {
      return {
        statusCode: 500,
        html: getHtml(
          "Error",
          <Root>
            <ErrorComponent />
          </Root>
        )
      };
    }
  }
}
