'use strict';
const SSEManager = require('./index');
module.exports = app => {
  if (app.config.sse.enable !== false) {
    app.config.coreMiddleware.push('sse');
    app.addSingleton('sse', config => {
      app.router.get(config.path, ctx => {
        ctx.body = ctx.sse;
      });
      return new SSEManager(config);
    });
  }
};
