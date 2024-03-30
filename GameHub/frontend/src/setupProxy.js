const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
    app.use(
        '/games',
        createProxyMiddleware({
            target: "http://localhost:5000/",
            changeOrigin: true
        })
    );

    app.use(
        '/api',
        createProxyMiddleware({
            target: "http://localhost:5000/",
            changeOrigin: true
        })
    );

    app.use(
        '/users',
        createProxyMiddleware({
            target: "http://localhost:5000/",
            changeOrigin: true
        }) 
    );
}