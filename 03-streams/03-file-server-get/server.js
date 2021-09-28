const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const isFirstLevelPath = (pathname) => pathname.split('/').length === 1;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);
      stream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          if (!isFirstLevelPath(pathname)) {
            res.statusCode = 400;
            res.end('Bad request');
          } else {
            res.statusCode = 404;
            res.end('Not Found');
          }
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });
      req.on('aborted', () => stream.destroy());
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
