const path = require("path");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const glob = require("glob");
const webpack = require("webpack");

const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const template = require("html-webpack-template");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = function(env) {
  const mode = env && env.production ? "production" : "development";
  const { ifProduction, ifDevelopment } = getIfUtils(mode);

  return {
    mode,
    entry: {
      main: "./src/index.ts",
      styles: "./styles/index.scss"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
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
          include: path.resolve(__dirname, "styles")
        },
        {
          test: /\.messages\.yaml$/,
          type: "javascript/auto",
          loader: "messageformat-loader",
          options: {
            disablePluralKeyChecks: ifProduction()
          },
          include: path.resolve(__dirname, "src")
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
    devServer: ifDevelopment({
      host: "0.0.0.0",
      port: 8080,
      historyApiFallback: true
    }),
    optimization: {
      splitChunks: { chunks: "all" },
      minimizer: ifProduction([
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin()
      ])
    },
    watchOptions: { poll: true },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        template,
        inject: false,
        mobile: true,
        title: "Kanji Dictionary",
        baseHref: "/",
        appMountId: "root"
      }),
      new webpack.DefinePlugin({
        "process.env.TARGET": JSON.stringify("web"),
        "process.env.API_URL": JSON.stringify(
          process.env.API_URL || "http://localhost:3000"
        )
      }),
      ifProduction(new MiniCssExtractPlugin()),
      ifProduction(
        PurifyCSSPlugin({
          paths: glob.sync(path.join(__dirname, "src/**/*.{ts,tsx}"))
        })
      )
    ])
  };
};
