import type { VisualEngineId } from './catalog';
export type Part={id:string;name:string;role:string;x:number;radius:number;kind:'fan'|'compressor'|'burner'|'turbine'|'nozzle'|'inlet'|'bypass'|'afterburner'|'impeller'|'diffuser'|'gearbox';shaft:'LP'|'HP'|'TJ'|null};
export const PARTS:Record<VisualEngineId,Part[]>={
 turbojet:[
  {id:'inlet',name:'Air intake',role:'Diffuses incoming air and delivers it to the compressor.',x:-4.2,radius:1.30,kind:'inlet',shaft:null},
  {id:'compressor',name:'Axial compressor',role:'Rotor and stator rows increase total pressure before combustion.',x:-2.05,radius:1.13,kind:'compressor',shaft:'TJ'},
  {id:'burner',name:'Annular combustor',role:'Adds fuel energy to the compressed core flow.',x:.20,radius:1.05,kind:'burner',shaft:null},
  {id:'turbine',name:'Power turbine',role:'Extracts energy to drive the single compressor shaft.',x:2.20,radius:.91,kind:'turbine',shaft:'TJ'},
  {id:'nozzle',name:'Exhaust nozzle',role:'Converts gas pressure and enthalpy into exhaust jet velocity.',x:4.18,radius:.76,kind:'nozzle',shaft:null}
 ],
 turbofan:[
  {id:'inlet',name:'Air intake',role:'Feeds both the hot core and the bypass stream.',x:-5.2,radius:1.90,kind:'inlet',shaft:null},
  {id:'fan',name:'Bypass fan',role:'Accelerates bypass air and supplies flow to the core.',x:-3.85,radius:1.73,kind:'fan',shaft:'LP'},
  {id:'lpc',name:'Low-pressure compressor',role:'LP-driven booster compression ahead of the HPC.',x:-2.2,radius:.97,kind:'compressor',shaft:'LP'},
  {id:'hpc',name:'High-pressure compressor',role:'HP shaft raises core pressure before combustion.',x:-.82,radius:.83,kind:'compressor',shaft:'HP'},
  {id:'burner',name:'Annular combustor',role:'Fuel/air reaction adds enthalpy to core gas.',x:1.04,radius:.89,kind:'burner',shaft:null},
  {id:'hpt',name:'High-pressure turbine',role:'Extracts work to drive the high-pressure compressor.',x:2.50,radius:.81,kind:'turbine',shaft:'HP'},
  {id:'lpt',name:'Low-pressure turbine',role:'Extracts work to drive the fan and LPC.',x:3.77,radius:.91,kind:'turbine',shaft:'LP'},
  {id:'nozzle',name:'Core exhaust',role:'Discharges hot core gas through its own nozzle.',x:5.18,radius:.69,kind:'nozzle',shaft:null},
  {id:'bypass',name:'Bypass duct & nozzle',role:'Keeps the cold stream separate from the hot core.',x:.48,radius:1.66,kind:'bypass',shaft:null}
 ],
 'afterburning-turbofan':[
  {id:'inlet',name:'Low-bypass intake',role:'Guides air toward the fighter-engine fan.',x:-5.2,radius:1.48,kind:'inlet',shaft:null},
  {id:'fan',name:'Low-bypass fan',role:'Accelerates the bypass air while feeding the core.',x:-3.87,radius:1.40,kind:'fan',shaft:'LP'},
  {id:'lpc',name:'LP compressor',role:'Boosts core pressure before the HPC.',x:-2.3,radius:.90,kind:'compressor',shaft:'LP'},
  {id:'hpc',name:'HP compressor',role:'Raises core pressure for combustion.',x:-.84,radius:.82,kind:'compressor',shaft:'HP'},
  {id:'burner',name:'Core combustor',role:'Fuel heats the compressed core air.',x:.9,radius:.83,kind:'burner',shaft:null},
  {id:'hpt',name:'HP turbine',role:'Extracts work to drive the HPC.',x:2.24,radius:.78,kind:'turbine',shaft:'HP'},
  {id:'lpt',name:'LP turbine',role:'Extracts work to drive the fan.',x:3.45,radius:.80,kind:'turbine',shaft:'LP'},
  {id:'afterburner',name:'Afterburner',role:'Additional fuel burns in the hot exhaust stream. The flame is illustrative.',x:5.08,radius:.87,kind:'afterburner',shaft:null},
  {id:'nozzle',name:'Variable nozzle petals',role:'Movable convergent-divergent petals change the exit geometry in the visual study.',x:7.01,radius:.76,kind:'nozzle',shaft:null},
  {id:'bypass',name:'Low bypass duct',role:'A smaller, cool bypass stream surrounds the core.',x:-.15,radius:1.32,kind:'bypass',shaft:null}
 ],
 'centrifugal-turbojet':[
  {id:'inlet',name:'Air intake',role:'Feeds axial flow into the radial compressor eye.',x:-3.9,radius:1.06,kind:'inlet',shaft:null},
  {id:'impeller',name:'Centrifugal impeller',role:'Curved rotating passages send air radially outward.',x:-2.2,radius:1.42,kind:'impeller',shaft:'TJ'},
  {id:'diffuser',name:'Radial diffuser',role:'Slows the outward-flowing air and recovers static pressure.',x:-.78,radius:1.58,kind:'diffuser',shaft:null},
  {id:'burner',name:'Combustion chamber',role:'Fuel adds heat after the diffuser.',x:.94,radius:1.07,kind:'burner',shaft:null},
  {id:'turbine',name:'Single turbine',role:'Drives the centrifugal compressor through a common shaft.',x:2.52,radius:.91,kind:'turbine',shaft:'TJ'},
  {id:'nozzle',name:'Propelling nozzle',role:'Converts hot-gas energy into exhaust velocity.',x:4.13,radius:.73,kind:'nozzle',shaft:null}
 ],
 'geared-turbofan':[
  {id:'inlet',name:'Wide air intake',role:'Guides airflow toward a large, slower-turning fan.',x:-5.35,radius:2.06,kind:'inlet',shaft:null},
  {id:'fan',name:'Geared fan',role:'The reduction gearbox allows the fan to spin more slowly than the LP spool.',x:-4.17,radius:1.87,kind:'fan',shaft:'LP'},
  {id:'gearbox',name:'Epicyclic gearbox',role:'Sun, planet and ring gears illustrate torque transfer between LP spool and fan.',x:-2.99,radius:1.05,kind:'gearbox',shaft:'LP'},
  {id:'lpc',name:'Low-pressure compressor',role:'Driven by the low-pressure turbine shaft.',x:-1.94,radius:.95,kind:'compressor',shaft:'LP'},
  {id:'hpc',name:'High-pressure compressor',role:'Pressurizes the hot core.',x:-.77,radius:.82,kind:'compressor',shaft:'HP'},
  {id:'burner',name:'Annular combustor',role:'Adds fuel energy to the core flow.',x:1.03,radius:.89,kind:'burner',shaft:null},
  {id:'hpt',name:'High-pressure turbine',role:'Powers the HP compressor.',x:2.49,radius:.80,kind:'turbine',shaft:'HP'},
  {id:'lpt',name:'Low-pressure turbine',role:'Powers the LP spool through the reduction gear.',x:3.8,radius:.91,kind:'turbine',shaft:'LP'},
  {id:'nozzle',name:'Core nozzle',role:'Exhausts the hot core stream.',x:5.2,radius:.70,kind:'nozzle',shaft:null},
  {id:'bypass',name:'High-bypass duct',role:'Carries the cooler bypass flow separately.',x:.46,radius:1.82,kind:'bypass',shaft:null}
 ]
};
