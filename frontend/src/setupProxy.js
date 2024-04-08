const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Проксі для '/api/premium/create-portal-session/'
  app.use(
    '/api/premium/create-portal-session/',
    createProxyMiddleware({
      target: 'https://billing.stripe.com',
      changeOrigin: true,
    })
  );

  // Проксі для '/api/premium/buy/'
  app.use(
    '/api/premium/buy/',
    createProxyMiddleware({
      target: 'https://billing.stripe.com',
      changeOrigin: true,
    })
  );
};
