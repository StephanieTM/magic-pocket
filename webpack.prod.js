const { merge } = require('webpack-merge');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.common');

module.exports = merge(config, {
  mode: 'production',
  output: {
    filename: 'assets/scripts/[name].[chunkhash].js',
    chunkFilename: 'assets/scripts/[name].[chunkhash].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/styles/[name].[contenthash].css',
      chunkFilename: 'assets/styles/[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'views/index.html',
      hash: true,
      inject: false,
      template: './app/views/index.ejs',
    }),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
