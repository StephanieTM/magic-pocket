const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', './app/index.tsx'],
    vendor: ['react', 'react-dom'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer(),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@primary-color': '#ff7d37',
                  '@link-color': '#ff7d37',
                  '@heading-color': '#000',
                  '@text-color': '#1a202c',
                  '@text-color-secondary': 'rgba(0, 0, 0, 0.6)',
                  '@disabled-color': 'rgba(0, 0, 0, 0.35)',
                  '@border-radius-base': '2px',
                  '@border-color-base': '#d9d9d9',
                  '@font-family': `Rubik, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,

                  '@pc-max-container-width': '800px',
                  '@pc-container-padding': '40px',
                  '@mobile-container-padding': '1.5rem',
                  '@pc-header-height': '60px',
                  '@mobile-header-height': '4rem',
                },
                javascriptEnabled: true,
              }
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin(),
    ],
  },
  plugins: [
    // clean dir before build
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets/images', to: 'assets/images' },
      ],
    }),
    new webpack.ProgressPlugin({ profile: false }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json',
  },
  optimization: {
    // moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 10,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
};
