const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = require('html-webpack-template');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template,
      inject: false,
      title: 'ka',
      baseHref: '/',
      appMountId: 'root',
    }),
  ],
};
