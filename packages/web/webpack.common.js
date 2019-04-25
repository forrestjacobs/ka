const path = require('path');

const webpack = require('webpack');
const glob = require('glob');

const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require("purifycss-webpack");

module.exports = function (isProd) {
  const plugins = [
    new HtmlWebpackPlugin({
      template,
      inject: false,
      mobile: true,
      title: 'Kanji Dictionary',
      baseHref: '/',
      appMountId: 'root',
    }),
    new webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify('web'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
  ];

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin(),
      new PurifyCSSPlugin({
        paths: glob.sync(path.join(__dirname, "src/**/*.{ts,tsx}")),
      }),
    );
  }

  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          include: [
            path.resolve(__dirname, "../base/src"),
            path.resolve(__dirname, "src"),
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: { plugins: () => [autoprefixer] },
            },
            'sass-loader',
          ],
          include: path.resolve(__dirname, "src"),
        },
        {
          test: /\.messages\.yaml$/,
          type: 'javascript/auto',
          loader: 'messageformat-loader',
          options: {
            disablePluralKeyChecks: isProd,
          },
          include: path.resolve(__dirname, "src"),
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      alias: {
        "./messages-loader": path.resolve(__dirname, "src/messages/web-messages-loader.ts"),
        "@ka/base": path.resolve(__dirname, "../base/src/index.ts"),
      },
    },
    optimization: {
      splitChunks: {chunks: 'all'},
    },
    watchOptions: {poll: true},
    plugins,
  };
};
