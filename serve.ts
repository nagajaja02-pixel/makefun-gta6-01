import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const base = resolve('game');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
createServer(async (req,res) => {
  try {
    const route = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname);
    const target = resolve(base, '.' + (route === '/' ? '/index.html' : route));
    if (!target.startsWith(base + sep)) throw Error('path');
    const bytes = await readFile(target);
    res.writeHead(200, {'Content-Type':mime[extname(target)] || 'application/octet-stream'}).end(bytes);
  } catch { res.writeHead(404).end('Missing file'); }
}).listen(Number(process.env.PORT || 8080),'0.0.0.0',()=>console.log('Play: http://localhost:8080'));
