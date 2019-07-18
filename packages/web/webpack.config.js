const path = require("path");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const glob = require("glob");
const webpack = require("webpack");

const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = function(env) {
  const mode = env && env.production ? "production" : "development";
  const { ifProduction, ifDevelopment } = getIfUtils(mode);

  return {
    mode,
    context: __dirname,
    entry: {
      main: removeEmpty([
        "./src/index.tsx",
        "./src/index.scss",
        ifDevelopment("webpack-hot-middleware/client?reload=true")
      ])
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.webpack.json",
            onlyCompileBundledFiles: true
          },
          include: [
            path.resolve(__dirname, "../base/src"),
            path.resolve(__dirname, "src")
          ]
        },
        {
          test: /\.scss$/,
          use: [
            ifProduction(MiniCssExtractPlugin.loader, "style-loader"),
            "css-loader",
            {
              loader: "postcss-loader",
              options: { plugins: () => [autoprefixer] }
            },
            "sass-loader"
          ],
          include: path.resolve(__dirname, "src")
        },
        {
          test: /\.messages\.yaml$/,
          type: "javascript/auto",
          loader: "messageformat-loader",
          options: {
            disablePluralKeyChecks: ifProduction()
          },
          include: path.resolve(__dirname, "messages")
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "./messages-loader": path.resolve(
          __dirname,
          "src/messages/web-messages-loader.ts"
        ),
        "@ka/base": path.resolve(__dirname, "../base/src/index.ts")
      }
    },
    output: ifProduction({
      path: path.resolve(__dirname, "dist")
    }),
    devtool: ifDevelopment("inline-source-map"),
    optimization: {
      splitChunks: { chunks: "all" },
      minimizer: ifProduction([
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin()
      ])
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        "process.env.TARGET": JSON.stringify("web"),
        "process.env.API_URL": JSON.stringify(
          process.env.API_URL || "http://localhost:3000"
        )
      }),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifDevelopment(new webpack.NoEmitOnErrorsPlugin()),
      ifProduction(new MiniCssExtractPlugin()),
      ifProduction(
        PurifyCSSPlugin({
          paths: glob.sync(path.join(__dirname, "src/**/*.{ts,tsx}"))
        })
      )
    ])
  };
};
