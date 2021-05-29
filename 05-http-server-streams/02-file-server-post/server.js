const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const Lst = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (path.dirname(req.url) === '/') {
        if (fs.existsSync(filepath)) {
          res.statusCode = 409;
          res.end();
        } else {
          const wst = fs.createWriteStream(filepath, {flags: 'wx'});
          const limitS = new Lst({limit: 1048576});
          req.pipe(limitS)
              .on('error', (e) => {
                fs.unlink(filepath, ()=>{});
                res.statusCode = 413;
                res.end(e.message);
              })
              .pipe(wst)
              .on('error', (e) => {
                res.statusCode = 500;
                res.end(e.message);
              });

          wst.on('finish', () => {
            res.statusCode = 201;
            res.end('success');
          });

          req.on('aborted', () => {
            fs.unlink(filepath, ()=>{});
            wst.destroy();
          });
        }
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
