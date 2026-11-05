import {describe,expect,test} from 'bun:test';
import {ENGINE_CATALOG} from './catalog';
import {PARTS} from './parts';
import {PHASES} from './learning-stages';

describe('learning-stage CAD linkage',()=>{
 for(const engine of ENGINE_CATALOG){
  test(`${engine.id}: five lessons cover each mounted CAD part once`,()=>{
   const installed=PARTS[engine.id].map(part=>part.id);
   const phases=PHASES[engine.id];
   expect(phases).toHaveLength(5);
   for(const phase of phases){
    expect(phase.parts.length).toBeGreaterThan(0);
    expect(phase.parts).toContain(phase.part);
    for(const id of phase.parts)expect(installed).toContain(id);
   }
   const focused=phases.flatMap(phase=>phase.parts);
   expect(focused.length).toBe(new Set(focused).size);
   expect([...focused].sort()).toEqual([...installed].sort());
  });
 }
});
