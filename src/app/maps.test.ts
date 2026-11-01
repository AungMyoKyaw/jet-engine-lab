import {describe,it,expect} from 'bun:test';
import fan from './data/maps/fan.json';
import hpc from './data/maps/hpc.json';
import hpt from './data/maps/hpt.json';
import {compressorMapPoint,turbineMapPoint} from './physics/maps';
describe('Imported Apache-2.0 pyCycle reference map interpolation',()=>{
 it('retains source hashes and reference rights',()=>{for(const m of [fan,hpc,hpt]){expect(m.license).toBe('Apache-2.0');expect(m.sourceSHA256).toMatch(/^[a-f0-9]{64}$/);expect(m.sourceUrl).toContain('OpenMDAO/pyCycle');}});
 it('reproduces exact fan table grid points',()=>{const a=fan.arrays,ni=8,ri=4;const p=compressorMapPoint(fan,a.NcMap[ni],a.RlineMap[ri]);expect(p.correctedFlowLbmS).toBeCloseTo(a.WcMap[0][ni][ri],8);expect(p.pressureRatio).toBeCloseTo(a.PRmap[0][ni][ri],8);expect(p.efficiency).toBeCloseTo(a.effMap[0][ni][ri],8);});
 it('linearly interpolates within published HPC domain',()=>{const a=hpc.arrays;const n=(a.NcMap[5]+a.NcMap[6])/2,rl=(a.RlineMap[4]+a.RlineMap[5])/2,p=compressorMapPoint(hpc,n,rl);expect(Number.isFinite(p.correctedFlowLbmS)).toBe(true);expect(p.pressureRatio).toBeGreaterThan(1);expect(p.efficiency).toBeGreaterThan(0);expect(p.efficiency).toBeLessThan(1.01);});
 it('reproduces turbine grid-point efficiency and flow',()=>{const a=hpt.arrays,i=2,j=5,p=turbineMapPoint(hpt,a.NpMap[i],a.PRmap[j]);expect(p.efficiency).toBeCloseTo(a.effMap[0][i][j],8);expect(p.correctedFlow).toBeCloseTo(a.WpMap[0][i][j],8);});
 it('rejects extrapolation and malformed requests',()=>{const a=fan.arrays;expect(()=>compressorMapPoint(fan,a.NcMap[0]-.01,a.RlineMap[4])).toThrow();expect(()=>turbineMapPoint(hpt,NaN,5)).toThrow();expect(()=>compressorMapPoint(fan,a.NcMap[4],a.RlineMap[3],9)).toThrow();});
 it('does not produce absolute engine RPM without design-point calibration',()=>{const p=compressorMapPoint(fan,fan.arrays.NcMap[8],fan.arrays.RlineMap[4]);expect('rpm' in p).toBe(false);});
});
