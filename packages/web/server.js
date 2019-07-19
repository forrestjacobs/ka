const path = require("path");
const fs = require("fs");
const express = require("express");
const preCompressedAssets = require("pre-compressed-assets");
const { render } = require("./lib/render");

const template = fs.readFileSync(
  path.join(__dirname, "dist/.template.html"),
  "utf8"
);

const app = express();

app.use(preCompressedAssets(/\.(js|css)/, path.join(__dirname, "dist")));
app.use(express.static("dist"));

app.use(async (req, res) => {
  const result = await render(req.url, template);
  res.status(result.statusCode).send(result.html);
});

app.listen(8080);
