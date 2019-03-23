const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common(false), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
});
