import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { createBrowserNavigation } from "navi";
import React, { Suspense } from "react";
import { hydrate } from "react-dom";
import { Router } from "react-navi";
import { ErrorBoundedView } from "./components/error-bounded-view";
import { LoadingPage } from "./components/loading/page";
import { Root } from "./components/root";
import { routes } from "./components/routes";

const cache = new InMemoryCache({});
if (window.__PRELOADED_STATE__) {
  cache.restore(window.__PRELOADED_STATE__);
}

const client = new ApolloClient({
  cache,
  uri: process.env.GRAPHQL_SERVER_URL
});

const navigation = createBrowserNavigation({
  context: { client },
  routes
});

hydrate(
  <ApolloProvider client={client}>
    <Router navigation={navigation}>
      <Root>
        <Suspense fallback={<LoadingPage />}>
          <ErrorBoundedView />
        </Suspense>
      </Root>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
