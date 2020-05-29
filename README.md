# egg-sse
Server sent event for egg.

## Install

```bash
$ npm i egg-sse --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.sse = {
  enable: true,
  package: 'egg-sse',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.sse = {
  path: '/stream', // event path
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
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## API
```
/**
  * Publish message to some connections.
  * @param {String} key the key of pool.
  * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
  * @param {Object} data sse send object mode
  * @param {Object|String} data.data data to send, if it's object, it will be converted to json
  * @param {String} data.event sse event name
  * @param {Number} data.id sse event id
  * @param {Number} data.retry sse retry times
  */
  publish(key, data)
}
```

```
/**
  * Publish message to all connections.
  * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
  * @param {Object} data sse send object mode
  * @param {Object|String} data.data data to send, if it's object, it will be converted to json
  * @param {String} data.event sse event name
  * @param {Number} data.id sse event id
  * @param {Number} data.retry sse retry times
  */
  publishAll(data)
```

## Server Side Usage

### Schedule mode
Get data to publish to all the clients.

```
'use strict';
module.exports = {
  schedule: {
    interval: '5s',
    type: 'all', // must be all
  },
  async task(ctx) {
    const data = {
      id: Math.random(),
      event: 'data',
      data: {
        aa: 11,
      },
    };
    // Publish data to all connections.
    ctx.app.sse.publishAll(data);
  },
};

```

### Redis Subcription mode
Here is the demo for redis.
```
// app.js
module.exports = app => {
  app.beforeStart(() => {
    if (app.config.redis.app) {
      // redis subcribe the news.
      app.redis.get('client1').subscribe('news');
      // listen to the message
      app.redis.get('client1').on('message', (channel, message) => {
        // Publish data to the connections of `channel` pool.
        app.see.publish(channel, {
          id: Math.random(),
          event: 'data',
          data: message,
        };)
      });
    }
  });
};

// publush.js
ctx.app.redis.clients.get('client2').publish('news', 'hello')
```

### Egg messenger mode
```
// app.js
module.exports = app => {
  app.beforeStart(() => {
    app.messenger.on('message', message => {
      // Publish data to all connections.
      app.see.publish({
        id: Math.random(),
        event: 'data',
        data: message,
      };)
    });
  });
};

// publish.js
ctx.app.sendToApp('message', 'hello')
```

## Client Side Usage
```
const eventSource = new EventSource(`http://myhost.com/stream?connectKey=${YOUR_BIZ_KEY}`);
eventSource.onopen = e => {
  console.log('Server sent event is opened.', e);
};
eventSource.onerror = e => {
  console.log('Server sent event is error.', e);
};
eventSource.onmessage = e => {
  const data = JSON.parse(e.data);
  console.log('Recieve message from server:\n', data);
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
