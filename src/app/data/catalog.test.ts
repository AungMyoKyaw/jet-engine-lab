import {describe,it,expect} from 'bun:test';
import {ENGINE_CATALOG,isCycleEngine,isVisualEngineId} from './catalog';
import {PARTS} from './parts';
import {DEFAULTS} from '../physics/cycle';
import {makeProject,parseProject} from '../studio/project';

describe('visual engine gallery and architectural integrity',()=>{
 it('exposes five unique selectable architectures',()=>{
  expect(ENGINE_CATALOG).toHaveLength(5);
  expect(new Set(ENGINE_CATALOG.map(x=>x.id)).size).toBe(5);
  expect(ENGINE_CATALOG.every(x=>isVisualEngineId(x.id))).toBe(true);
  expect(isVisualEngineId('not-an-engine')).toBe(false);
 });
 it('identifies visual-only engines separately from the numerical solver',()=>{
  expect(ENGINE_CATALOG.filter(x=>x.simulation==='preview').map(x=>x.id)).toEqual(['turbojet','turbofan']);
  expect(ENGINE_CATALOG.filter(x=>x.simulation==='visual-only')).toHaveLength(3);
  for(const e of ENGINE_CATALOG)expect(isCycleEngine(e.id)).toBe(e.simulation==='preview');
 });
 it('has distinct mechanical assemblies and stable component IDs',()=>{
  const required={
   'afterburning-turbofan':['afterburner','nozzle','fan'],
   'centrifugal-turbojet':['impeller','diffuser','turbine'],
   'geared-turbofan':['gearbox','fan','hpt','lpt']
  } as const;
  for(const e of ENGINE_CATALOG){
   const parts=PARTS[e.id];
   expect(parts.length).toBeGreaterThanOrEqual(5);
   expect(new Set(parts.map(p=>p.id)).size).toBe(parts.length);
   expect(parts.every(p=>Number.isFinite(p.x)&&p.radius>0&&p.name.length>0&&p.role.length>0)).toBe(true);
  }
  for(const [engine,ids] of Object.entries(required))for(const id of ids){
   expect(PARTS[engine as keyof typeof PARTS].some(p=>p.id===id)).toBe(true);
  }
 });
 it('round-trips selected new architecture through a legacy-compatible project',()=>{
  for(const e of ENGINE_CATALOG){
   const primary=isCycleEngine(e.id)?e.id:'turbofan';
   const project=makeProject('Visual engine study',structuredClone(DEFAULTS),primary,{mode:'inspection',selected:'',explode:0,showShell:true},e.id);
   const decoded=parseProject(JSON.stringify(project));
   expect(decoded.visualEngine).toBe(e.id);
   expect(decoded.activeEngine).toBe(primary);
  }
 });
 it('rejects unknown architecture identifiers in imported files',()=>{
  const project=makeProject('Experiment',structuredClone(DEFAULTS),'turbofan',{mode:'inspection',selected:'',explode:0,showShell:true});
  expect(()=>parseProject(JSON.stringify({...project,visualEngine:'fake-engine'}))).toThrow('Invalid visual engine');
 });
});
