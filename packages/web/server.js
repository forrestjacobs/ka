const path = require("path");
const express = require("express");
const preCompressedAssets = require("pre-compressed-assets");
const serialize = require("serialize-javascript");

const app = express();

app.use(preCompressedAssets(/\.(js|css)/, path.join(__dirname, "dist")));
app.use(express.static("dist"));

app.use(async (req, res) => {
  const { render } = require("./lib/render");
  const result = await render(req.url);

  res.status(result.statusCode).send(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <base href="/">
    <title>${result.title}</title>
    <link rel="stylesheet" href="main.css">
    <meta content="width=device-width, initial-scale=1" name="viewport">
  </head>
  <body>
    <div id="root">${result.root}</div>
    <script>window.__PRELOADED_STATE__ = ${serialize(result.state, {
      isJSON: true
    })};</script>
    <script src="main.js"></script>
    <script src="vendors~main.js"></script>
  </body>
</html>
`
  );
});

app.listen(8080);
