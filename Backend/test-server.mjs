// Backend/test-server.mjs
console.log("Starting ES module server test...");

import { createServer } from 'http';

const server = createServer((req, res) => {
  console.log(`Received request for ${req.url}`);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from ES modules\n');
});

server.listen(3000, () => {
  console.log('ES module server is running at http://localhost:3000/');
});