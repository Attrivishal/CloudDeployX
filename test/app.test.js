const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const server = require('../app');

test('CloudDeployX server test suite', async (t) => {
  await t.test('GET / returns 200 and success message', (t, done) => {
    server.listen(0, () => {
      const port = server.address().port;
      http.get(`http://localhost:${port}`, (res) => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          assert.strictEqual(res.statusCode, 200);
          assert.strictEqual(data, "CloudDeployX CI/CD is working 🚀");
          server.close(done);
        });
      }).on('error', (err) => {
        server.close();
        done(err);
      });
    });
  });
});
