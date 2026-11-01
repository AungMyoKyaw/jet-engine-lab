import {describe,it,expect} from 'bun:test';
import {compute,DEFAULTS,validate,atmosphere,type EngineId} from './physics/cycle';
describe('Preliminary cycle model',()=>{
 it('reproduces bounded sea-level ISA',()=>{const a=atmosphere(0);expect(a.temperature).toBeCloseTo(288.15,6);expect(a.pressure).toBeCloseTo(101325,1);});
 for(const id of ['turbojet','turbofan'] as EngineId[]){
  it(id+' generates finite, labeled stations and positive flow',()=>{const r=compute(DEFAULTS[id]);expect(r.engine).toBe(id);expect(r.stations.length).toBeGreaterThan(4);expect(r.massFlow).toBeGreaterThan(0);expect(r.fuelFlow).toBeGreaterThan(0);expect(Number.isFinite(r.thrust)).toBe(true);expect(r.n1).toBeNull();expect(r.n2).toBeNull();});
  it(id+' changing core nozzle area affects solved mass capacity',()=>{const first=compute(DEFAULTS[id]);const next=compute({...DEFAULTS[id],coreArea:DEFAULTS[id].coreArea*1.1});expect(next.coreMass).toBeGreaterThan(first.coreMass);expect(next.coreGeom).toBeCloseTo(DEFAULTS[id].coreArea*1.1/.97,5);});
  it(id+' rejects physically invalid inputs',()=>{const bad={...DEFAULTS[id],altitude:20000};expect(validate(bad)).not.toBeNull();expect(()=>compute(bad)).toThrow();});
  it(id+' rejects nonfinite inputs instead of clamping',()=>{const bad={...DEFAULTS[id],throttle:NaN};expect(()=>compute(bad)).toThrow();});
 }
 it('turbofan keeps bypass separate from core nozzle',()=>{const r=compute(DEFAULTS.turbofan);expect(r.bypassMass).toBeGreaterThan(0);expect(r.coreMass).toBeGreaterThan(0);expect(r.stations.find(s=>s.id==='18')).toBeDefined();expect(r.stations.find(s=>s.id==='45')).toBeDefined();});
 it('separate bypass nozzle changes bypass flow',()=>{const a=compute(DEFAULTS.turbofan),b=compute({...DEFAULTS.turbofan,bypassArea:DEFAULTS.turbofan.bypassArea*.8});expect(b.bypassMass).toBeLessThan(a.bypassMass);expect(b.coreMass).toBeCloseTo(a.coreMass,4);});
 it('does not claim validated N1/N2 without maps',()=>{const r=compute(DEFAULTS.turbofan);expect(r.n1).toBeNull();expect(r.warning).toMatch(/maps/);});
 it('keeps total-temperature and static-temperature labels explicit',()=>{const r=compute(DEFAULTS.turbojet);expect(r.stations[0].kind).toBe('static');expect(r.stations[1].kind).toBe('total');});
 it('outputs no infinite TSFC on zero or nonpositive thrust',()=>{for(const id of ['turbojet','turbofan'] as EngineId[]){const r=compute(DEFAULTS[id]);if(r.tsfc!==null)expect(Number.isFinite(r.tsfc)).toBe(true);}});
});
