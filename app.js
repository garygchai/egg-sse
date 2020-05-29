'use strict';
const SSEManager = require('./index');
module.exports = app => {
  if (app.config.sse.enable !== false) {
    app.config.coreMiddleware.push('sse');
    const config = app.config.sse;
    app.router.get(config.path, ctx => {
      ctx.body = ctx.sse;
    });
    app.sse = new SSEManager(config);
  }
};
