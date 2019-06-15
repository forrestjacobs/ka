import express from "express";
import React from "react";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { api } from "../api/data";
import { Root } from "../components/root";
import { rootReducer } from "../reducers";
import { renderToString } from "react-dom/server";
import { StaticRouter, StaticRouterContext } from "react-router";
import { loadData } from "../components/routes";
import { parsePath } from "history";
import { parse } from "query-string";
import webpack, { Stats } from "webpack";
import middleware from "webpack-dev-middleware";
import serialize from "serialize-javascript";

export const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../webpack.config.js");
const compiler = webpack(config());

app.use(
  middleware(compiler, {
    publicPath: "/",
    serverSideRender: true
  })
);

app.use(
  async (req, res): Promise<void> => {
    const location = parsePath(decodeURIComponent(req.url));
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
    const html = renderToString(
      <StaticRouter location={location} context={context}>
        <Root store={store} />
      </StaticRouter>
    );

    const stats: Stats.ToJsonOutput = res.locals.webpackStats.toJson();
    const assets = (Object.values(
      stats.assetsByChunkName || {}
    ) as unknown) as string[];

    res.status(context.statusCode || 200).send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <base href="/">
    <title>${context.title || "Kanji Dictionary"}</title>
    <meta content="width=device-width, initial-scale=1" name="viewport">
    ${assets
      .filter((path): boolean => path.endsWith(".css"))
      .map((path): string => `<link href="${path}" rel="stylesheet" />`)
      .join("")}
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${serialize(store.getState(), {
        isJSON: true
      })};
    </script>
    ${assets
      .filter((path): boolean => path.endsWith(".js"))
      .map((path): string => `<script src="${path}"></script>`)
      .join("")}
  </body>
</html>
`);
  }
);
