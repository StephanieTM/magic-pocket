const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = require('./env');

const app = express();
const staticRoot = path.join(__dirname, 'dist');

app.use(express.static(staticRoot));
app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:3002',
  changeOrigin: true,
}));

app.get('/*', (req, res) => {
  res.sendFile('./views/index.html', { root: staticRoot });
});

app.listen(env.PORT || 3000, function() {
  console.log(`app listening on port ${env.PORT || 3000}!\n`);
});
