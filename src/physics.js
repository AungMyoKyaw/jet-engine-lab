/**
 * Zero-dimensional, steady-state educational turbojet cycle.
 * All total-state stations use stagnation P/T except 0 and 8 (static).
 * Sources: NASA Glenn Brayton cycle and thrust equation; see README.
 * No manufacturer-specific performance claims.
 */
const AIR = Object.freeze({ gamma: 1.4, R: 287.05287, cp: 1004 });
const GAS = Object.freeze({ gamma: 1.33, R: 287.05287, cp: 1150 });
export const CONSTANTS = Object.freeze({
  air: AIR, gas: GAS, lhv: 43e6, compressorEfficiency: 0.86,
  turbineEfficiency: 0.89, burnerEfficiency: 0.99, shaftEfficiency: 0.99,
  diffuserRecovery: 0.985, burnerPressureRecovery: 0.95,
  nozzleEfficiency: 0.96
});
export const DEFAULT_ENGINE = Object.freeze({
  throttle: 0.68, pressureRatio: 13, massFlow: 62, altitude: 0, mach: 0.20
});
const clamp = (v, a, b) => Math.min(b, Math.max(a, Number.isFinite(Number(v)) ? Number(v) : a));

/** ISA (dry air, 0–16 km; standard troposphere + isothermal lower stratosphere). */
export function atmosphere(altitude = 0) {
  const h = clamp(altitude, 0, 16000);
  const T = h <= 11000 ? 288.15 - 0.0065 * h : 216.65;
  const P = h <= 11000
    ? 101325 * Math.pow(T / 288.15, 5.2558797)
    : 22632.06 * Math.exp(-9.80665 * (h - 11000) / (AIR.R * 216.65));
  return { altitude: h, temperature: T, pressure: P,
    density: P / (AIR.R * T), speedOfSound: Math.sqrt(AIR.gamma * AIR.R * T) };
}

export function turbojetCycle(values = {}) {
  const input = {
    throttle: clamp(values.throttle ?? DEFAULT_ENGINE.throttle, 0, 1),
    pressureRatio: clamp(values.pressureRatio ?? DEFAULT_ENGINE.pressureRatio, 3, 25),
    massFlow: clamp(values.massFlow ?? DEFAULT_ENGINE.massFlow, 10, 130),
    altitude: clamp(values.altitude ?? DEFAULT_ENGINE.altitude, 0, 16000),
    mach: clamp(values.mach ?? DEFAULT_ENGINE.mach, 0, 0.9)
  };
  const a = atmosphere(input.altitude);
  const c = CONSTANTS;
  const V0 = a.speedOfSound * input.mach;
  const Tt2 = a.temperature * (1 + (AIR.gamma - 1) * input.mach ** 2 / 2);
  const Pt0 = a.pressure * Math.pow(Tt2 / a.temperature, AIR.gamma / (AIR.gamma - 1));
  const Pt2 = Pt0 * c.diffuserRecovery;
  const Pt3 = Pt2 * input.pressureRatio;
  const Tt3 = Tt2 * (1 + (Math.pow(input.pressureRatio, (AIR.gamma - 1) / AIR.gamma) - 1) / c.compressorEfficiency);
  const Pt4 = Pt3 * c.burnerPressureRecovery;
  const Tt4 = 1020 + 680 * input.throttle;
  const f = Math.max(0, (GAS.cp * Tt4 - AIR.cp * Tt3) / (c.burnerEfficiency * c.lhv - GAS.cp * Tt4));
  const compressorPower = input.massFlow * AIR.cp * (Tt3 - Tt2);
  const fuelFlow = input.massFlow * f;
  const Tt5 = Tt4 - compressorPower / ((input.massFlow + fuelFlow) * GAS.cp * c.shaftEfficiency);
  const Tt5s = Tt4 - (Tt4 - Tt5) / c.turbineEfficiency;
  const Pt5 = Pt4 * Math.pow(Math.max(0.001, Tt5s / Tt4), GAS.gamma / (GAS.gamma - 1));
  const turbinePower = (input.massFlow + fuelFlow) * GAS.cp * (Tt4 - Tt5);
  const criticalRatio = Math.pow(2 / (GAS.gamma + 1), GAS.gamma / (GAS.gamma - 1));
  const nozzleHasPressure = Pt5 > a.pressure;
  const choked = nozzleHasPressure && a.pressure / Pt5 < criticalRatio;
  const Pe = nozzleHasPressure ? Math.max(a.pressure, criticalRatio * Pt5) : a.pressure;
  const Ve = nozzleHasPressure ? Math.sqrt(Math.max(0,
    2 * c.nozzleEfficiency * GAS.cp * Tt5
    * (1 - Math.pow(Pe / Pt5, (GAS.gamma - 1) / GAS.gamma)))) : 0;
  const Te = Tt5 - Ve * Ve / (2 * GAS.cp);
  const rhoE = Pe / (GAS.R * Te);
  const areaExit = Ve > 0 ? (input.massFlow + fuelFlow) / (rhoE * Ve) : 0;
  const momentumThrust = (input.massFlow + fuelFlow) * Ve - input.massFlow * V0;
  const pressureThrust = (Pe - a.pressure) * areaExit;
  const thrust = momentumThrust + pressureThrust;
  const valid = nozzleHasPressure && Tt5s > 0 && Tt4 > Tt3 && thrust > 0;
  const stations = [
    { id: '0', name: 'Freestream', short: 'Ambient', temperature: a.temperature, pressure: a.pressure, kind: 'static', color: '#698ba6' },
    { id: '2', name: 'Diffuser exit', short: 'Intake', temperature: Tt2, pressure: Pt2, kind: 'total', color: '#6c9cb9' },
    { id: '3', name: 'Compressor exit', short: 'Compressor', temperature: Tt3, pressure: Pt3, kind: 'total', color: '#527d9f' },
    { id: '4', name: 'Combustor exit', short: 'Combustor', temperature: Tt4, pressure: Pt4, kind: 'total', color: '#f08b4d' },
    { id: '5', name: 'Turbine exit', short: 'Turbine', temperature: Tt5, pressure: Pt5, kind: 'total', color: '#d68d5f' },
    { id: '8', name: 'Nozzle exit', short: 'Exhaust', temperature: Te, pressure: Pe, kind: 'static', color: '#858eaa' }
  ];
  return {
    input, ambient: a, stations, valid, choked, criticalRatio,
    inletVelocity: V0, exhaustVelocity: Ve,
    pressureRatio: input.pressureRatio, fuelAirRatio: f, fuelFlow,
    compressorPower, turbinePower, massFlow: input.massFlow,
    thrust, momentumThrust, pressureThrust, nozzleArea: areaExit,
    turbineInletTemperature: Tt4, compressorOutletTemperature: Tt3,
    nozzlePressureRatio: Pt5 / a.pressure,
    specificThrust: thrust / input.massFlow,
    fuelPerThrustHour: valid ? fuelFlow * 3600 / (thrust / 1000) : 0, // kg/(kN·h)
    idealBraytonEfficiency: 1 - Math.pow(input.pressureRatio, -(AIR.gamma - 1) / AIR.gamma)
  };
}


/**
 * Idealized axial rotor inlet velocity triangle with zero absolute inlet swirl.
 * Euler stage work is driven by the selected (illustrative) exit swirl change.
 */
export function velocityTriangle(values = {}) {
  const rpm = clamp(values.rpm ?? 9000, 3000, 14000);
  const radius = clamp(values.radius ?? 0.35, 0.1, 1);
  const axialSpeed = clamp(values.axialSpeed ?? 150, 80, 240);
  const deltaSwirl = clamp(values.deltaSwirl ?? 45, 10, 100);
  const bladeSpeed = 2 * Math.PI * radius * rpm / 60;
  const relativeSpeed = Math.hypot(axialSpeed, bladeSpeed);
  const relativeAngle = Math.atan2(bladeSpeed, axialSpeed) * 180 / Math.PI;
  const specificWork = bladeSpeed * deltaSwirl;
  return {
    rpm, radius, axialSpeed, deltaSwirl, bladeSpeed, relativeSpeed,
    relativeAngle, specificWork, totalTemperatureRise: specificWork / AIR.cp
  };
}

export function airfoilModel(values = {}) {
  const angle = clamp(values.angle ?? 6, -18, 24);
  const speed = clamp(values.speed ?? 85, 15, 260);
  const altitude = clamp(values.altitude ?? 0, 0, 16000);
  const chord = clamp(values.chord ?? 0.25, 0.05, 2);
  const span = clamp(values.span ?? 1, 0.2, 10);
  const env = atmosphere(altitude);
  const stallAngle = 13;
  const ar = span / chord;
  const slope = 2 * Math.PI * ar / (ar + 2);
  const r = Math.PI / 180;
  const abs = Math.abs(angle);
  const liftCoefficient = Math.sign(angle) * slope * (Math.min(abs, stallAngle) * r) *
    (abs > stallAngle ? Math.exp(-(abs - stallAngle) / 10) : 1);
  const separation = Math.max(0, abs - stallAngle);
  const dragCoefficient = 0.016 + liftCoefficient ** 2 / (Math.PI * ar * 0.83) + 0.0017 * separation ** 1.6;
  const dynamicPressure = 0.5 * env.density * speed ** 2;
  const area = chord * span;
  return {
    angle, speed, altitude, chord, span, stallAngle,
    density: env.density, mach: speed / env.speedOfSound,
    area, aspectRatio: ar, liftCoefficient, dragCoefficient,
    dynamicPressure, lift: dynamicPressure * area * liftCoefficient,
    drag: dynamicPressure * area * dragCoefficient,
    liftToDrag: Math.abs(liftCoefficient) / dragCoefficient,
    separated: abs > stallAngle
  };
}
