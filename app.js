'use strict';
const SSEManager = require('./index');
module.exports = app => {
  const opts = app.config.sse;
  app.config.coreMiddleware.push('sse');
  app.router.get(opts.path, ctx => {
    ctx.body = ctx.sse;
  });

  // sse manager
  app.sse = new SSEManager(opts);
};
