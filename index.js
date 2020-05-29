/* eslint-disable jsdoc/check-param-names */
/* eslint-disable quote-props */
'use strict';

class SSEManager {
  constructor(opts = {}) {
    this.ssePool = {};
    this.pingInterval = opts.pingInterval || 10000;
    // Keep running
    this.startPing();
  }
  /**
   *
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   */
  publishAll(data) {
    for (let key in this.ssePool) {
      this.publish(key, data);
    }
  }
  /**
   *
   * @param {String} key the key of pool.
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   */
  publish(key, data) {
    const ssePool = this.getAlive(key);
    ssePool.forEach(s => s.send(data));
  }
  startPing() {
    setInterval(() => {
      this.publishAll(':ping')
    }, this.pingInterval);
  }
  /**
   *
   * @param {String} key the key of pool
   */
  getAlive(key) {
    const ssePool = this.ssePool[key] || []
    this.ssePool[key]= ssePool.filter(s => !s._writableState.destroyed);
    return this.ssePool[key];
  }
}

module.exports = SSEManager;
