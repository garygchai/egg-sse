
'use strict';
const SSE = require('../../sse');
module.exports = () => {
  return async function sse_call(ctx, next) {
    const config = ctx.app.config.sse
    if (ctx.path === config.path) {
      if (ctx.res.headerSent) {
        if (!(ctx.sse instanceof SSE)) {
          console.error('SSE response header has been sent, Unable to create the sse response');
        }
        return await next();
      }
      const { connectKey } = ctx.request.query
      const cacheKey = connectKey || config.cacheKey;
      ctx.app.sse.ssePool[cacheKey] = ctx.app.sse.ssePool[cacheKey] || [];
      let ssePool = ctx.app.sse.ssePool[cacheKey];
      if (ssePool.length >= config.maxClients) {
        console.error('SSE client number more than the maximum, Unable to create the sse response');
        return await next();
      }
      const sseItem = new SSE(ctx, config);
      ctx.sse = ctx.response.sse = sseItem;
      ssePool.push(sseItem);
    }
    await next();
  };
};
