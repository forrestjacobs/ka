import React from "react";
import { parsePath } from "history";
import { parse } from "query-string";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "./reducers";
import thunk from "redux-thunk";
import { api } from "./api/data";
import { Root } from "./components/root";
import { renderToString } from "react-dom/server";
import { StaticRouter, StaticRouterContext } from "react-router";
import { loadData } from "./components/routes";
import { RootState } from "./state";

export async function render(
  url: string
): Promise<{ statusCode: number; title: string; root: string; state: RootState }> {
  const location = parsePath(decodeURIComponent(url));
  location.query = location.search ? parse(location.search) : {};

  const store = createStore(
    rootReducer,
    applyMiddleware(thunk.withExtraArgument({ api }))
  );

  await loadData(
    location,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any): Promise<void> => store.dispatch(action)
  );

  const context: StaticRouterContext & { title?: string } = {};
  const root = renderToString(
    <StaticRouter location={location} context={context}>
      <Root store={store} />
    </StaticRouter>
  );

  return {
    statusCode: context.statusCode || 200,
    title: context.title || "Kanji Dictionary",
    root: root,
    state: store.getState()
  }
}
