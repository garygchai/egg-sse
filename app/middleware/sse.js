
'use strict';
const SSE = require('../../sse');
module.exports = () => {
  return async function sse_call(ctx, next) {
    const opts = ctx.app.config.sse;
    if (ctx.path.indexOf(opts.path) > -1) {
      if (ctx.res.headerSent) {
        if (!(ctx.sse instanceof SSE)) {
          console.error('SSE response header has been sent, Unable to create the sse response');
        }
        return await next();
      }
      if (ctx.app.sse.ssePool.length >= opts.maxClients) {
        console.error('SSE client number more than the maximum, Unable to create the sse response');
        return await next();
      }
      const sseItem = new SSE(ctx, opts);
      ctx.sse = ctx.response.sse = sseItem;
      ctx.app.sse.ssePool.push(sseItem);
    }
    await next();
  };
};
