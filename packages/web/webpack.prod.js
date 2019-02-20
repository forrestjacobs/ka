const path = require('path');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    maxModules: Infinity,
    optimizationBailout: true,
  },
});
