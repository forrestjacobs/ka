const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { plugins: () => [autoprefixer] },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.ftl$/i,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template,
      inject: false,
      mobile: true,
      title: 'Kanji Dictionary',
      baseHref: '/',
      appMountId: 'root',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'TARGET': JSON.stringify('web'),
      },
    }),
  ],
};
