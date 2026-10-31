import { describe, expect, it } from 'bun:test';
import { atmosphere, turbojetCycle, airfoilModel, velocityTriangle } from './physics.js';

describe('ISA', () => {
  it('has standard sea-level conditions', () => {
    const a = atmosphere(0);
    expect(a.temperature).toBeCloseTo(288.15, 3);
    expect(a.pressure).toBeCloseTo(101325, 0);
    expect(a.density).toBeGreaterThan(1.2);
  });
  it('has realistic 11 km conditions', () => {
    const a = atmosphere(11000);
    expect(a.temperature).toBeCloseTo(216.65, 2);
    expect(a.pressure).toBeGreaterThan(22500);
    expect(a.pressure).toBeLessThan(22800);
  });
});
describe('turbojet steady-state demonstrator', () => {
  const data = turbojetCycle();
  it('has finite positive thrust and fuel flow', () => {
    expect(data.valid).toBe(true);
    expect(data.thrust).toBeGreaterThan(0);
    expect(data.fuelFlow).toBeGreaterThan(0);
    expect(Number.isFinite(data.fuelPerThrustHour)).toBe(true);
  });
  it('compresses air and heats it across burner', () => {
    expect(data.stations[2].pressure).toBeGreaterThan(data.stations[1].pressure);
    expect(data.stations[2].temperature).toBeGreaterThan(data.stations[1].temperature);
    expect(data.stations[3].temperature).toBeGreaterThan(data.stations[2].temperature);
    expect(data.stations[3].pressure).toBeLessThan(data.stations[2].pressure);
    expect(data.stations[4].temperature).toBeLessThan(data.stations[3].temperature);
    expect(data.stations[4].pressure).toBeLessThan(data.stations[3].pressure);
  });
  it('turbine work balances compressor work via shaft efficiency', () => {
    expect(data.turbinePower * 0.99).toBeCloseTo(data.compressorPower, 2);
  });
  it('has exact displayed thrust component balance', () => {
    expect(data.momentumThrust + data.pressureThrust).toBeCloseTo(data.thrust, 6);
  });
  it('fuel flow increases with throttle for fixed other inputs', () => {
    const low = turbojetCycle({ throttle: 0.25 });
    const high = turbojetCycle({ throttle: 0.95 });
    expect(high.fuelFlow).toBeGreaterThan(low.fuelFlow);
    expect(high.stations[3].temperature).toBeGreaterThan(low.stations[3].temperature);
  });
  it('increasing pressure ratio raises compressor exit pressure', () => {
    const low = turbojetCycle({ pressureRatio: 5 });
    const high = turbojetCycle({ pressureRatio: 20 });
    expect(high.stations[2].pressure).toBeGreaterThan(low.stations[2].pressure);
  });
  it('remains finite across control domain', () => {
    for (const throttle of [0, 0.5, 1])
      for (const mach of [0, 0.5, 0.9])
        for (const pressureRatio of [3, 13, 25]) {
          const v = turbojetCycle({ throttle, mach, pressureRatio, altitude: 16000 });
          expect(v.stations.every(s => Number.isFinite(s.temperature) && Number.isFinite(s.pressure))).toBe(true);
          expect(Number.isFinite(v.thrust)).toBe(true);
        }
  });
});
describe('rotor-relative velocity triangle', () => {
  it('computes tangential blade speed and the correct relative inlet angle', () => {
    const v=velocityTriangle({rpm:6000,radius:0.5,axialSpeed:150,deltaSwirl:40});
    expect(v.bladeSpeed).toBeCloseTo(100*Math.PI,5);
    expect(v.relativeAngle).toBeCloseTo(Math.atan2(100*Math.PI,150)*180/Math.PI,5);
    expect(v.relativeSpeed).toBeCloseTo(Math.hypot(150,100*Math.PI),5);
  });
  it('Euler stage work increases with rotor speed and imparted swirl', () => {
    const a=velocityTriangle({rpm:6000,deltaSwirl:30});
    const b=velocityTriangle({rpm:12000,deltaSwirl:60});
    expect(b.specificWork/a.specificWork).toBeCloseTo(4,6);
    expect(b.totalTemperatureRise).toBeGreaterThan(a.totalTemperatureRise);
  });
});
describe('airfoil teaching model', () => {
  it('zero incidence gives near-zero lift and positive drag', () => {
    const m = airfoilModel({angle:0});
    expect(m.lift).toBe(0);
    expect(m.drag).toBeGreaterThan(0);
  });
  it('lift peaks and then decreases after stall', () => {
    expect(airfoilModel({angle:22}).liftCoefficient).toBeLessThan(airfoilModel({angle:13}).liftCoefficient);
  });
  it('dynamic pressure increases quadratically with speed', () => {
    const a=airfoilModel({speed:60});
    const b=airfoilModel({speed:120});
    expect(b.dynamicPressure / a.dynamicPressure).toBeCloseTo(4, 4);
  });
});
