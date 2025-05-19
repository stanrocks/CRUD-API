import http from 'node:http';

export const server = http.createServer((req, res) => {
  try {
    console.log(`Request received: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: 'Hello World!',
      }),
    );
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
    );
  }
});
