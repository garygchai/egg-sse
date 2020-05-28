
'use strict';
const SSE = require('../../sse');
module.exports = () => {
  return async function sse_call(ctx, next) {
    let opts = { client: ctx.app.config.sse };
    if (ctx.app.config.sse.client) {
      opts = ctx.app.config.sse;
    } else if (ctx.app.config.sse.clients) {
      opts = ctx.app.config.sse.clients;
    }
    for (const i in opts) {
      const config = Object.assign({}, opts[i], ctx.app.config.sse.default);
      let sseClient = ctx.app.sse;
      if (!sseClient.ssePool) {
        sseClient = ctx.app.sse.get(i);
      }
      if (ctx.path === config.path) {
        if (ctx.res.headerSent) {
          if (!(ctx.sse instanceof SSE)) {
            console.error('SSE response header has been sent, Unable to create the sse response');
          }
          return await next();
        }
        if (sseClient.ssePool.length >= config.maxClients) {
          console.error('SSE client number more than the maximum, Unable to create the sse response');
          return await next();
        }
        const sseItem = new SSE(ctx, config);
        ctx.sse = ctx.response.sse = sseItem;
        sseClient.ssePool.push(sseItem);
      }
    }
    await next();
  };
};
