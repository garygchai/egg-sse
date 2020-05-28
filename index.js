/* eslint-disable jsdoc/check-param-names */
/* eslint-disable quote-props */
'use strict';

class SSEManager {
  constructor(opts = {}) {
    this.ssePool = [];
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
  publish(data) {
    this.ssePool = this.getAlive();
    this.ssePool.forEach(s => s.send(data));
  }
  startPing() {
    setInterval(() => {
      this.publish(':ping');
    }, this.pingInterval);
  }
  getAlive() {
    this.ssePool = this.ssePool.filter(s => !s._writableState.destroyed);
    return this.ssePool;
  }
  close() {
    this.ssePool = this.getAlive();
    this.ssePool.forEach(s => s.close());
  }
  open() {
    this.ssePool = this.getAlive();
    this.ssePool.forEach(s => s.open());
  }
}

module.exports = SSEManager;
