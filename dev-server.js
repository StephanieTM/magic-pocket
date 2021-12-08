const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev');
const env = require('./env');

const options = {
  contentBase: './dist',
  compress: true,
  hot: true,
  port: env.PORT || 3000,
  host: '0.0.0.0',
  historyApiFallback: {
    index: 'views/index.html',
  },
  index: 'views/index.html',
  writeToDisk: true,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3002',
      changeOrigin: true,
    },
  },
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, () => {
  console.log(`dev server listening on port ${options.port}`);
});
