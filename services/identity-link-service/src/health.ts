import http from 'http';

export const runHealth = () => {
  const server = http.createServer((_, res) => {
    res.writeHead(200);
    res.end('ok');
  });

  server.listen(8080);
};
