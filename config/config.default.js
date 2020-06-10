/* eslint-disable quote-props */
'use strict';
module.exports = {
  sse: {
    path: '/stream',
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Transfer-Encoding': 'off',
      'Access-Control-Allow-Origin': '*',
    },
    maxClients: 10000,
    pingInterval: 10000,
    cacheKey: '@sse/count',
  },
};
