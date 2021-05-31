const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.dirname(req.url) === '/') {
        fs.unlink(filepath, (e) => {
          if (e) {
            if (e.code === 'ENOENT') {
              res.statusCode = 404;
              res.end();
            } else {
              res.statusCode = 500;
              res.end(e.message);
            }
          } else {
            console.log(`${filepath} was deleted`);
            res.statusCode = 200;
            res.end('success');
          }
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
