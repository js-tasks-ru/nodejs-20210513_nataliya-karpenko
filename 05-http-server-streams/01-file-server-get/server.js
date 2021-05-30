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
      // const p = pathname.split('/');
      // const str = new fs.ReadStream(filepath);
      // req.pipe(str)
      //     .on('finish', () => {
      //       const buffer = str.read();
      //       if (buffer) res.write(buffer);
      //       res.end();
      //     })

      //     .on('error', (error) => {
      //       if (error.code === 'ENOENT') res.statusCode = 404;
      //       if (p.length > 1) res.statusCode = 400;
      //       res.end();
      //     });
      // break;

      if (path.dirname(req.url) === '/') {
        if (!fs.existsSync(filepath)) {
          res.statusCode = 404;
          res.end();
        } else {
          const rst = fs.createReadStream(filepath);
          req
              .on('error', (e) => {
                res.statusCode = 500;
                res.end(e.message);
              });
          req.pipe(rst, {end: false}).pipe(res);

          req.on('aborted', () => {
            fs.unlink(filepath, ()=>{});
            rst.destroy();
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
