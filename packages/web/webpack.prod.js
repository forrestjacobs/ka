const path = require("path");
const common = require("./webpack.common.js");
const merge = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common(true), {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  stats: {
    maxModules: Infinity,
    optimizationBailout: true
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()]
  }
});
