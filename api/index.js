import login from './login';
import signup from './signup';
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  switch (req.path) {
    case '/signup':
      signup(req, res);
      break;
    case '/login':
      login(req, res);
      break;
    case '/forgot':
      break;
    case '/change':
      break;
    default:
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('No matching path\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
