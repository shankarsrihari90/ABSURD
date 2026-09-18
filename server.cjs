const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4175);

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405);
    return response.end();
  }

  const pathname = new URL(request.url, 'http://localhost').pathname;
  const routes = {'/':'index.html','/index.html':'index.html','/calm-game.css':'calm-game.css','/calm-game.js':'calm-game.js','/make-it-absurd.css':'make-it-absurd.css','/make-it-absurd.js':'make-it-absurd.js','/make-it-absurd-v8.css':'make-it-absurd-v8.css','/make-it-absurd-v8.js':'make-it-absurd-v8.js','/absurd-version.js':'absurd-version.js','/absurd-dock.css':'absurd-dock.css','/absurd-dock.js':'absurd-dock.js'};
  if (!Object.hasOwn(routes, pathname)) {
    response.writeHead(404);
    return response.end('Not found');
  }

  const page = path.join(root, routes[pathname]);
  fs.readFile(page, (error, data) => {
    if (error) {
      response.writeHead(500);
      return response.end('Could not load preview.');
    }
    response.writeHead(200, {
      'Content-Type': (pathname.endsWith('.css') ? 'text/css' : pathname.endsWith('.js') ? 'text/javascript' : 'text/html') + '; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Shared ABSURD preview: http://127.0.0.1:${port}`);
});
