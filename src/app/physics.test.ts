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
 it('bypass nozzle affects both flow paths through LP shaft matching',()=>{
  const a=compute(DEFAULTS.turbofan),b=compute({...DEFAULTS.turbofan,bypassArea:DEFAULTS.turbofan.bypassArea*.8});
  expect(b.bypassMass).toBeLessThan(a.bypassMass);
  expect(b.coreMass).not.toBeCloseTo(a.coreMass,4);
  expect(b.shaftPowerMismatchPercent).toBeLessThan(.001);
 });
 it('does not claim validated N1/N2 without maps',()=>{const r=compute(DEFAULTS.turbofan);expect(r.n1).toBeNull();expect(r.warning).toMatch(/maps/);});
 it('keeps total-temperature and static-temperature labels explicit',()=>{const r=compute(DEFAULTS.turbojet);expect(r.stations[0].kind).toBe('static');expect(r.stations[1].kind).toBe('total');});
 for(const id of ['turbojet','turbofan'] as EngineId[]){
  it(id+' exposes explicit net thrust and shaft-work closure diagnostics',()=>{
   const r=compute(DEFAULTS[id]);
   expect(r.momentumThrust+r.pressureThrust).toBeCloseTo(r.thrust,8);
   expect(Number.isFinite(r.shaftPowerMismatchPercent)).toBe(true);
    expect(r.shaftPowerMismatchPercent).toBeGreaterThanOrEqual(0);
    expect(r.shaftPowerMismatchPercent).toBeLessThan(.001);
    expect(r.massFlow).toBeCloseTo(r.coreMass+r.bypassMass,8);
    expect(r.turbinePower).toBeCloseTo(r.compressorPower,1);
    expect(r.coreGeom*.97).toBeCloseTo(r.coreArea,8);
    if(id==='turbofan')expect(r.bypassGeom*.97).toBeCloseTo(r.bypassArea,8);
   expect(r.n1).toBeNull();expect(r.n2).toBeNull();
  });
 }
 it('choked convergent core has a sonic throat and pressure thrust',()=>{
  const r=compute(DEFAULTS.turbojet),ambient=atmosphere(0).pressure;
  expect(r.coreChoked).toBe(true);
  expect(r.coreExitMach).toBeCloseTo(1,9);
  expect(r.coreExitPressure).toBeGreaterThan(ambient);
  expect(r.pressureThrust).toBeGreaterThan(0);
  const out=r.stations.find(s=>s.id==='8')!;
  expect(r.coreMass+r.fuelFlow).toBeCloseTo(r.coreArea*out.pressure/(287.05287*out.temperature)*r.coreVelocity,6);
 });
 it('unchoked bypass expands to ambient pressure with subsonic exit Mach',()=>{
  const r=compute(DEFAULTS.turbofan);
  expect(r.bypassChoked).toBe(false);
  expect(r.bypassExitMach).toBeGreaterThan(0);
  expect(r.bypassExitMach!).toBeLessThan(1);
  expect(r.bypassExitPressure).toBeCloseTo(atmosphere(0).pressure,4);
 });
 it('exposes multiple numerical shaft roots without implying map selection',()=>{
  const r=compute(DEFAULTS.turbofan);
  expect(r.solutionBranches).toBeGreaterThan(1);
  expect(r.actualBypassRatio).not.toBeCloseTo(DEFAULTS.turbofan.bypassRatio,2);
  expect(r.warning).toMatch(/Multiple mathematical LP balance branches/);
 });
 it('rejects infeasible high bypass flow capacity instead of reporting a guessed state',()=>{
  expect(()=>compute({...DEFAULTS.turbofan,bypassArea:1.2})).toThrow(/No physically feasible LP shaft/);
 });
 it('outputs no infinite TSFC on zero or nonpositive thrust',()=>{for(const id of ['turbojet','turbofan'] as EngineId[]){const r=compute(DEFAULTS[id]);if(r.tsfc!==null)expect(Number.isFinite(r.tsfc)).toBe(true);}});
});
