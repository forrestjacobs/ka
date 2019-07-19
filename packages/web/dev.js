const path = require("path");
const chokidar = require("chokidar");
const express = require("express");
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

app.use((req, res, next) => {
  const { render } = require("./lib/render");

  const template = res.locals.fs.readFileSync(
    path.join(__dirname, "dist/.template.html"),
    "utf8"
  );

  render(req.url, template).then(
    result => res.status(result.statusCode).send(result.html),
    e => next(e)
  );
});

app.listen(8080);
