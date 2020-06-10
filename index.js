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
  startPing() {
    setInterval(() => {
      this.publishAll(':ping')
    }, this.pingInterval);
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
  /**
   *
   * @param {String} key the key of pool
   */
  getAlive(key) {
    const ssePool = this.ssePool[key] || []
    this.ssePool[key]= ssePool.filter(s => !s._writableState.destroyed);
    return this.ssePool[key];
  }
  /**
   *
   * @param {String} key the key of pool
   */
  close(key) {
    const connections = this.ssePool[key];
    if (connections && connections.length) {
      connections.forEach(con => {
        con.close();
      })
    }
  }
  closeAll() {
    for (const key in this.ssePool) {
      const connections = this.ssePool[key];
      if (connections && connections.length) {
        connections.forEach(con => {
          con.close();
        })
      }
    }
  }
  /**
   *
   * @param {String} key the key of pool
   */
  count(key) {
    let count = 0;
    const connections = this.ssePool[key];
    if (connections && connections.length) {
      count = connections.length;
    }
    return count;
  }
  countAll() {
    let count = 0;
    for (const key in this.ssePool) {
      const connections = this.ssePool[key];
      if (connections && connections.length) {
        count += connections.length;
      }
    }
    return count;
  }
}

module.exports = SSEManager;
