'use strict';

const mock = require('egg-mock');

describe('test/sse.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/sse-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, sse')
      .expect(200);
  });
});
