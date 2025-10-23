const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const outDir = path.join(__dirname, 'out');

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    let filePath = path.join(outDir, req.url === '/' ? '/index.html' : req.url);
    // Prevent path traversal
    if (!filePath.startsWith(outDir)) {
      res.writeHead(400);
      res.end('Bad Request');
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end('Server Error');
  }
});

server.listen(port, () => {
  console.log(`Static server serving ${outDir} on http://localhost:${port}`);
});
