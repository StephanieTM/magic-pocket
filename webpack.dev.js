const { merge } = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.common');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    filename: 'assets/scripts/[name].bundle.js',
    chunkFilename: 'assets/scripts/[name].chunk.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: './tsconfig.json',
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
      eslint: {
        enabled: true,
        files: [
          './app/**/*.{ts,tsx}',
          './src/**/*.{ts,tsx}',
        ],
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'views/index.html',
      hash: true,
      inject: false,
      template: './app/views/index.ejs',
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/styles/[name].css',
      chunkFilename: 'assets/styles/[id].css',
    }),
  ],
});
