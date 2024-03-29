const autoprefixer = require("autoprefixer");
const CompressionPlugin = require("compression-webpack-plugin");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
const PurifyCSSPlugin = require("purifycss-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");

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
      path: path.resolve(__dirname, "dist"),
      filename: ifProduction("[name].[contenthash:8].js", "[name].js")
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
      new HtmlWebpackPlugin({
        template: "template.html",
        filename: ".template.html"
      }),
      new webpack.DefinePlugin({
        "process.env.TARGET": JSON.stringify("web"),
        "process.env.GRAPHQL_SERVER_URL": JSON.stringify(
          process.env.GRAPHQL_SERVER_URL || "http://localhost:4000"
        )
      }),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifDevelopment(new webpack.NoEmitOnErrorsPlugin()),
      ifProduction(
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:8].css"
        })
      ),
      ifProduction(
        PurifyCSSPlugin({
          paths: glob.sync(path.join(__dirname, "src/**/*.{ts,tsx}"))
        })
      ),
      ifProduction(
        new CompressionPlugin({
          exclude: /\.html$/
        })
      )
    ])
  };
};
