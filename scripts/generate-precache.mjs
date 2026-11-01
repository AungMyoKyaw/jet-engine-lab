import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'dist/assets';
const entries = await readdir(base);
const assets = entries
  .filter(name => (/\.(?:js|css|svg)$/.test(name)) && !/^EngineViewport-/.test(name))
  .sort()
  .map(name=>'assets/'+name);
assets.unshift('');
await writeFile('dist/precache-manifest.json',JSON.stringify({version:1,scope:'/jet-engine-lab/',assets},null,2)+'\n');
console.log('Offline precache manifest:',assets.length,'shell/reference assets');
