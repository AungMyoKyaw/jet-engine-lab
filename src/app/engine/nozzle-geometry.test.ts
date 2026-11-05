import {describe,expect,it} from 'bun:test';
import {compute,DEFAULTS,type Result} from '../physics/cycle';
import {meteredThroats,THROAT_CAD} from './nozzle-geometry';

describe('Solver-driven SolidCraft nozzle dimensions',()=>{
 it('converts effective core nozzle area to geometric circular aperture across settings',()=>{
  for(const engine of ['turbojet','turbofan'] as const){
   for(const coreArea of [.20,.28,.40,.48]){
    const r=compute({...DEFAULTS[engine],coreArea});
    const throat=meteredThroats(r).core;
    expect(throat.area).toBeCloseTo(r.coreGeom,12);
    expect(throat.area*.97).toBeCloseTo(coreArea,12);
    expect(throat.radius).toBeCloseTo(THROAT_CAD.coreLipBore*throat.lipRadialScale,12);
   }
  }
 });
 it('uses a fixed, separate inner fairing and independent bypass nozzle capacity',()=>{
  for(const bypassArea of [.3,.45,.6,.8]){
   const r=compute({...DEFAULTS.turbofan,bypassArea});
   const t=meteredThroats(r);
   expect(t.bypass).not.toBeNull();
   expect(t.bypass!.innerRadius).toBe(THROAT_CAD.bypassFairing);
   expect(t.bypass!.area).toBeCloseTo(r.bypassGeom,12);
   expect(t.bypass!.area*.97).toBeCloseTo(bypassArea,12);
   expect(t.bypass!.outerRadius).toBeCloseTo(THROAT_CAD.bypassLipBore*t.bypass!.lipRadialScale,12);
   expect(t.bypass!.outerRadius).toBeGreaterThan(t.bypass!.innerRadius);
  }
 });
 it('does not render unaccepted numerical geometry',()=>{
  expect(()=>meteredThroats({...compute(DEFAULTS.turbojet),valid:false} as Result)).toThrow();
  expect(()=>meteredThroats({...compute(DEFAULTS.turbofan),bypassGeom:NaN} as Result)).toThrow();
  expect(meteredThroats(compute(DEFAULTS.turbojet)).bypass).toBeNull();
 });
});
