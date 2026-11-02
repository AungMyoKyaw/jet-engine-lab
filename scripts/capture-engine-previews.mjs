/** Rebuild five engine gallery previews from their verified assembled CAD scenes. */
import {spawnSync} from 'node:child_process';

for (const [program,args] of [
  ['bun',['scripts/smoke-solidcraft-full.mjs']],
  ['python3',['scripts/crop-engine-previews.py']],
]){
  const result=spawnSync(program,args,{stdio:'inherit',cwd:process.cwd(),timeout:120_000});
  if(result.error||result.status!==0){
    console.error(program+' failed:',result.error?.message||result.signal||result.status);
    process.exit(1);
  }
}
console.log('Five gallery previews updated from current SolidCraft assembled engines.');
