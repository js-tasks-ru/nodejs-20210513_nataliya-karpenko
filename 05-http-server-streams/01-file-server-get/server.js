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
      const p = pathname.split('/');
      const str = new fs.ReadStream(filepath);
      str.on('readable', (error, data) => {
        const buffer = str.read();
        if (buffer) res.write(buffer);
        res.end();
      });

      str.on('error', (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            if (p.length > 1) res.statusCode = 400;
            res.end();
          }
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
