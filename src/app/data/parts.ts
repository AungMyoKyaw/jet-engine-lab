import type { EngineId } from '../physics/cycle';
export type Part={id:string;name:string;role:string;x:number;radius:number;kind:'fan'|'compressor'|'burner'|'turbine'|'nozzle'|'inlet'|'bypass';shaft:'LP'|'HP'|'TJ'|null};
export const PARTS:Record<EngineId,Part[]>={
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
 ]
};
