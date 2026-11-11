'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { calculateTax } = require('./tax');
const page = fs.readFileSync(path.join(__dirname, '../public/index.html'));
function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' }); return res.end('Method not allowed');
    }
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok' }));
    }
    if (url.pathname === '/api/tax') {
      try {
        const income = url.searchParams.get('income');
        const rate = url.searchParams.get('rate');
        if (income === null || rate === null || !income.trim() || !rate.trim()) throw new Error('Income and rate are required.');
        const result = calculateTax(Number(income), Number(rate));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message }));
      }
    }
    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(page);
    }
    res.writeHead(404); res.end('Not found');
  });
}
if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  const server = createServer().listen(port, '0.0.0.0', () => console.log(`Tax Calculator listening on port ${port}`));
  process.on('SIGTERM', () => server.close());
}
module.exports = { createServer };
