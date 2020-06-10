/* eslint-disable jsdoc/check-param-names */
/* eslint-disable quote-props */
'use strict';
const stream = require('stream');
const Transform = stream.Transform;

class SSETransform extends Transform {
  constructor(ctx, opts) {
    super({
      writableObjectMode: true,
    });
    this.opts = opts;
    this.ctx = ctx;
    this.ended = false;
    ctx.req.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    ctx.set({ ...opts.headers });
  }
  /**
   *
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   * @param {function} callback same as the write method callback
   */
  send(data, callback) {
    if (arguments.length === 0 || this.ended || this._writableState.destroyed) return false;
    Transform.prototype.write.call(this, data, encodeURI, callback);
  }
  /**
   *
   * @param {String} data sse data to send, if it's a string, an anonymous event will be sent.
   * @param {Object} data sse send object mode
   * @param {Object|String} data.data data to send, if it's object, it will be converted to json
   * @param {String} data.event sse event name
   * @param {Number} data.id sse event id
   * @param {Number} data.retry sse retry times
   * @param {*} encoding not use
   * @param {function} callback same as the write method callback
   */
  sendEnd(data, callback) {
    // if not set end(data), send end event before end, the event name is configurable
    // Because you override the native end method, In order to prevent multiple sending end events, add the ended prop
    if (this.ended || this._writableState.destroyed) {
      return false;
    }
    if (!data && !this.ended) {
      data = { event: this.opts.closeEvent };
    }
    this.ended = true;
    Transform.prototype.end.call(this, data, encodeURI, callback);
  }
  close() {
    if (!this.ended) {
      this.ended = true;
      this.emit('close');
    }
  }
  _transform(data, encoding, callback) {
    let senderObject;
    let dataLines;
    let prefix = 'data: ';
    const commentReg = /^\s*:\s*/;
    let res = [];
    if (typeof data === 'string') {
      senderObject = { data };
    } else {
      senderObject = data;
    }
    if (senderObject.event) res.push('event: ' + senderObject.event);
    if (senderObject.retry) res.push('retry: ' + senderObject.retry);
    if (senderObject.id) res.push('id: ' + senderObject.id);
    if (typeof senderObject.data === 'object') {
      dataLines = JSON.stringify(senderObject.data);
      res.push(prefix + dataLines);
    } else if (typeof senderObject.data === 'undefined') {
      // Send an empty string even without data
      res.push(prefix);
    } else {
      senderObject.data = String(senderObject.data);
      if (senderObject.data.search(commentReg) !== -1) {
        senderObject.data = senderObject.data.replace(commentReg, '');
        prefix = ': ';
      }
      senderObject.data = senderObject.data.replace(/(\r\n|\r|\n)/g, '\n');
      dataLines = senderObject.data.split(/\n/);
      for (let i = 0, l = dataLines.length; i < l; ++i) {
        const line = dataLines[i];
        if ((i + 1) === l) res.push(prefix + line);
        else res.push(prefix + line);
      }
    }
    // Concentrated to send
    res = res.join('\n') + '\n\n';
    this.push(res);
    this.emit('message', res);
    if (this.ctx.body && typeof this.ctx.body.flush === 'function' && this.ctx.body.flush.name !== 'deprecated') {
      this.ctx.body.flush();
    }
    callback();
  }
}

module.exports = SSETransform;
