import { resolve } from 'node:path';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';

const root = resolve(import.meta.dir, '..');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const result = await Bun.build({
  entrypoints: [resolve(root, 'src/main.js')],
  outdir: dist,
  target: 'browser',
  minify: true,
  sourcemap: 'none',
  naming: { entry: 'app.js', chunk: '[name]-[hash].js', asset: '[name]-[hash].[ext]' }
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exitCode = 1;
} else {
  const html = (await readFile(resolve(root, 'index.html'), 'utf8'))
    .replace('./src/main.js', './app.js')
    .replace('./src/style.css', './style.css');
  await Promise.all([
    writeFile(resolve(dist, 'index.html'), html),
    writeFile(resolve(dist, 'style.css'), await readFile(resolve(root, 'src/style.css'))),
    writeFile(resolve(dist, 'favicon.svg'), await readFile(resolve(root, 'favicon.svg')))
  ]);
  console.log('Production bundle:', result.outputs.map(x => x.path).join(', '));
  console.log('Local production preview: bun run preview');
}
