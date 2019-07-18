const path = require("path");
const chokidar = require("chokidar");
const express = require("express");
const serialize = require("serialize-javascript");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config.js");

const dirsToClean = [
  path.resolve(__dirname, "../base/lib"),
  path.resolve(__dirname, "./lib"),
  path.resolve(__dirname, "./messages")
];

chokidar.watch(dirsToClean).on("all", () => {
  for (const id of Object.keys(require.cache)) {
    for (const dir of dirsToClean) {
      if (id.startsWith(dir)) {
        delete require.cache[id];
      }
    }
  }
});

const app = express();

const compiler = webpack(webpackConfig());

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: "/",
    serverSideRender: true
  })
);

app.use(webpackHotMiddleware(compiler));

function getPaths(assets) {
  const paths = [];
  for (const entry of Object.values(assets)) {
    if (Array.isArray(entry)) {
      Array.prototype.push.apply(paths, entry);
    } else {
      paths.push(entry);
    }
  }
  return paths;
}

app.use(async (req, res) => {
  const { render } = require("./lib/render");
  const result = await render(req.url);

  const jsPaths = getPaths(
    res.locals.webpackStats.toJson().assetsByChunkName
  ).filter(path => path.endsWith(".js"));

  res.status(result.statusCode).send(
    `<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <base href="/">
    <title>${result.title}</title>
    <meta content="width=device-width, initial-scale=1" name="viewport">
  </head>
  <body>
    <div id="root">${result.root}</div>
    <script>window.__PRELOADED_STATE__ = ${serialize(result.state, {
      isJSON: true
    })};</script>
${jsPaths.map(path => `    <script src="${path}"></script>`).join("\n")}
  </body>
</html>
`);
});

app.listen(8080);
