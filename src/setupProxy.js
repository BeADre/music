const proxy = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(proxy('/local', {
    target: 'http://localhost:3000',
    pathRewrite: {
      "^/local": "/"
    }
  }));
};
