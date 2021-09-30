const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (req.url.split('/').length > 2) {
    res.statusCode = 400;
    res.end('Nested folders are not supported');
    return;
  }
  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath, { flags: 'wx' });
      const limitSizeStream = new LimitSizeStream({ limit: Math.pow(2, 20) });

      req.pipe(limitSizeStream).pipe(stream);

      stream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      limitSizeStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('Limit exceeded');
          fs.unlink(filepath, (err) => { });
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });
      req.on('aborted', () => {
        stream.destroy();
        limitSizeStream.destroy();
        fs.unlink(filepath, (err) => { });
      });

      stream.on('finish', () => {
        res.statusCode = 201;
        res.end('Filed saved');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
