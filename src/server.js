import { resolve, sep } from 'node:path';

const useDist = process.argv.includes('--dist');
const root = resolve(import.meta.dir, '..', useDist ? 'dist' : '.');
const port = Number(process.env.PORT || 4173);

Bun.serve({
  hostname: '127.0.0.1',
  port,
  async fetch(request) {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Bad URL', { status: 400 }); }
    if (pathname.includes('\0')) return new Response('Bad URL', { status: 400 });
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) return new Response('Forbidden', { status: 403 });
    const body = Bun.file(file);
    if (!await body.exists()) return new Response('Not found', { status: 404 });
    return new Response(body, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
});
console.log('Jet Engine Lab: http://127.0.0.1:' + port + (useDist ? ' (production build)' : ' (development)'));
