const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, statusCode, content, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(content);
}

function resolveRequestPath(urlPath) {
  const cleaned = decodeURIComponent(urlPath.split('?')[0]);
  const requested = cleaned === '/' ? '/index.html' : cleaned;
  const resolved = path.normalize(path.join(ROOT, requested));

  if (!resolved.startsWith(ROOT)) {
    return null;
  }

  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || '/');

  if (!filePath) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      send(res, 404, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);

    stream.on('error', () => {
      if (!res.headersSent) {
        send(res, 500, 'Server Error');
      } else {
        res.destroy();
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Blog server is running at http://${HOST}:${PORT}`);
});
