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

## API
```
/**
  *
  * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
  * @param {Object} data sse send object mode
  * @param {Object|String} data.data data to send, if it's object, it will be converted to json
  * @param {String} data.event sse event name
  * @param {Number} data.id sse event id
  * @param {Number} data.retry sse retry times
  */
app.sse.publish(data)
```
Publish data to all sse items.

`app.sse.close()`  
Close all the sse items.

`app.sse.open()`  
Open all the sse items.

## Usage

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
      retry: 5000,
      id: Math.random(),
      event: 'data',
      data: {
        aa: 11,
      },
    };
    // publish the data to all sse.
    ctx.app.sse.publish(data);
  },
};

```

### Subcription mode

```
// TODO
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
