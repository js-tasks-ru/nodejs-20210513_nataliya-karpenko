const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (path.dirname(req.url) === '/') {
        const rst = fs.createReadStream(filepath);
        rst.on('error', (e) => {
          if (e.code === 'ENOENT') {
            res.statusCode = 404;
            res.end();
          } else {
            res.statusCode = 500;
            res.end(e.message);
          }
        });
        rst.pipe(res);

        req.on('aborted', () => {
          fs.unlink(filepath, () => {});
          rst.destroy();
        });
      } else {
        res.statusCode = 400;
        res.end();
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
