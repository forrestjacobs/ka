const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common(false), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
  },
});
