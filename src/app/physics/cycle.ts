export type EngineId='turbojet'|'turbofan';
export type Input={engine:EngineId;throttle:number;altitude:number;mach:number;pressureRatio:number;bypassRatio:number;coreArea:number;bypassArea:number};
export type Station={id:string;name:string;temperature:number;pressure:number;kind:'static'|'total'};
export type Result={valid:boolean;engine:EngineId;thrust:number;momentumThrust:number;pressureThrust:number;shaftPowerMismatchPercent:number;fuelFlow:number;tsfc:number|null;massFlow:number;coreMass:number;bypassMass:number;coreVelocity:number;coreChoked:boolean;bypassChoked:boolean;coreArea:number;bypassArea:number;coreGeom:number;bypassGeom:number;compressorPower:number;turbinePower:number;stations:Station[];n1:null;n2:null;warning:string};
export const DEFAULTS:Record<EngineId,Input>={
 turbojet:{engine:'turbojet',throttle:.68,altitude:0,mach:.2,pressureRatio:13,bypassRatio:0,coreArea:.28,bypassArea:0},
 turbofan:{engine:'turbofan',throttle:.72,altitude:0,mach:.28,pressureRatio:9.2,bypassRatio:5.2,coreArea:.20,bypassArea:1.85}
};
export const LIMITS={throttle:[0,1],altitude:[0,12000],mach:[0,.85],pressureRatio:[4,24],bypassRatio:[2,10],coreArea:[.06,.9],bypassArea:[.25,5]} as const;
type Gas='air'|'gas';const R=287.05287,LHV=43e6,CD=.97;
function cp(t:number,g:Gas){return(g==='air'?1005:1150)+(g==='air'?.12:.16)*(t-300);}
function enthalpy(t:number,g:Gas){const b=g==='air'?.12:.16;return (g==='air'?1005:1150)*(t-300)+.5*b*(t-300)**2;}
function entropy(t:number,g:Gas){const b=g==='air'?.12:.16;return((g==='air'?1005:1150)-300*b)*Math.log(t/300)+b*(t-300);}
function inverse(fn:(t:number)=>number,goal:number){let lo=100,hi=2600;for(let i=0;i<64;i++){const m=(lo+hi)/2;if(fn(m)>goal)hi=m;else lo=m;}return(lo+hi)/2;}
const th=(v:number,g:Gas)=>inverse(t=>enthalpy(t,g),v);
const ts=(v:number,g:Gas)=>inverse(t=>entropy(t,g),v);
export function atmosphere(alt:number){const t=alt<=11000?288.15-.0065*alt:216.65;const p=alt<=11000?101325*(t/288.15)**5.2558797:22632.06*Math.exp(-9.80665*(alt-11000)/(R*216.65));return{temperature:t,pressure:p};}
export function validate(v:Input){for(const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]){if(v.engine==='turbojet'&&(key==='bypassArea'||key==='bypassRatio'))continue;const num=v[key],range=LIMITS[key];if(!Number.isFinite(num)||num<range[0]||num>range[1])return key+' must be between '+range[0]+' and '+range[1];}return null;}
type Point={id:string;name:string;t:number;p:number};
function compress(s:Point,pr:number,eff:number,id:string,name:string):Point{const ideal=ts(entropy(s.t,'air')+R*Math.log(pr),'air');return{id,name,p:s.p*pr,t:th(enthalpy(s.t,'air')+(enthalpy(ideal,'air')-enthalpy(s.t,'air'))/eff,'air')};}
function exit(s:Point,ambient:number,area:number,g:Gas){const gamma=cp(s.t,g)/(cp(s.t,g)-R),crit=(2/(gamma+1))**(gamma/(gamma-1)),choked=ambient/s.p<crit;const pe=s.p<=ambient?ambient:Math.max(ambient,s.p*crit);const ideal=s.p<=ambient?s.t:ts(entropy(s.t,g)+R*Math.log(pe/s.p),g);const te=th(enthalpy(s.t,g)-.95*(enthalpy(s.t,g)-enthalpy(ideal,g)),g);const v=Math.sqrt(Math.max(0,2*(enthalpy(s.t,g)-enthalpy(te,g))));const geometric=area/CD;return{pe,te,v,choked,flow:pe/(R*te)*v*area,pressure:(pe-ambient)*geometric,geometric};}
function station(s:Point,kind:'static'|'total'='total'):Station{return{id:s.id,name:s.name,temperature:s.t,pressure:s.p,kind};}
export function compute(v:Input):Result{
 const err=validate(v);if(err)throw Error(err);
 const ambient=atmosphere(v.altitude),speed=v.mach*Math.sqrt(1.4*R*ambient.temperature);
 const t2=th(enthalpy(ambient.temperature,'air')+.5*speed**2,'air');
 const p2=ambient.pressure*Math.exp((entropy(t2,'air')-entropy(ambient.temperature,'air'))/R)*(.99-.02*v.mach**2);
 const inlet:Point={t:t2,p:p2,id:'2',name:'Diffuser'};
 const stations:Station[]=[station({t:ambient.temperature,p:ambient.pressure,id:'0',name:'Freestream'},'static'),station(inlet)];
 const t4=1060+590*v.throttle;let coreMass=0,bypassMass=0,fuelFlow=0,power=0,turbinePower=0,hot,by;
 if(v.engine==='turbojet'){
  const comp=compress(inlet,v.pressureRatio,.87,'3','Compressor'),burner={t:t4,p:comp.p*.95,id:'4',name:'Combustor'};
  if(t4<=comp.t+30)throw Error('Turbine inlet temperature is insufficient for this compressor condition.');
  const f=(enthalpy(t4,'gas')-enthalpy(comp.t,'air'))/(.99*LHV-enthalpy(t4,'gas'));if(f<=0)throw Error('Nonphysical fuel-air ratio.');
  const work=enthalpy(comp.t,'air')-enthalpy(inlet.t,'air'),t5=th(enthalpy(t4,'gas')-work/((1+f)*.99),'gas');
  const ideal=th(enthalpy(t4,'gas')-(enthalpy(t4,'gas')-enthalpy(t5,'gas'))/.89,'gas');
  const turbine={id:'5',name:'Turbine',t:t5,p:burner.p*Math.exp((entropy(ideal,'gas')-entropy(t4,'gas'))/R)};
  if(turbine.p<=ambient.pressure*1.01)throw Error('Insufficient core nozzle pressure.');
  hot=exit(turbine,ambient.pressure,v.coreArea,'gas');coreMass=hot.flow/(1+f);fuelFlow=coreMass*f;
  power=coreMass*work;turbinePower=(coreMass+fuelFlow)*(enthalpy(t4,'gas')-enthalpy(t5,'gas'));
  stations.push(station(comp),station(burner),station(turbine),station({id:'8',name:'Core exhaust',t:hot.te,p:hot.pe},'static'));
 }else{
  const fan=compress(inlet,1.58,.91,'13','Fan'),lpc=compress(fan,1.7,.91,'25','LPC'),hpc=compress(lpc,v.pressureRatio,.88,'3','HPC');
  const burner={id:'4',name:'Combustor',t:t4,p:hpc.p*.95};
  if(t4<=hpc.t+30)throw Error('Insufficient turbine entry temperature.');
  const f=(enthalpy(t4,'gas')-enthalpy(hpc.t,'air'))/(.99*LHV-enthalpy(t4,'gas'));if(f<=0)throw Error('Nonphysical fuel-air ratio.');
  const hpWork=enthalpy(hpc.t,'air')-enthalpy(lpc.t,'air'),fanWork=enthalpy(fan.t,'air')-enthalpy(inlet.t,'air'),lpWork=enthalpy(lpc.t,'air')-enthalpy(fan.t,'air')+fanWork*(1+v.bypassRatio);
  const t45=th(enthalpy(t4,'gas')-hpWork/((1+f)*.99),'gas'),i45=th(enthalpy(t4,'gas')-(enthalpy(t4,'gas')-enthalpy(t45,'gas'))/.89,'gas');
  const hpt={t:t45,p:burner.p*Math.exp((entropy(i45,'gas')-entropy(t4,'gas'))/R),id:'45',name:'HPT'};
  const t5=th(enthalpy(t45,'gas')-lpWork/((1+f)*.99),'gas'),i5=th(enthalpy(t45,'gas')-(enthalpy(t45,'gas')-enthalpy(t5,'gas'))/.9,'gas');
  const lpt={t:t5,p:hpt.p*Math.exp((entropy(i5,'gas')-entropy(t45,'gas'))/R),id:'5',name:'LPT'};
  if(lpt.p<=ambient.pressure*1.01)throw Error('Insufficient core nozzle pressure for this operating point.');
  hot=exit(lpt,ambient.pressure,v.coreArea,'gas');by=exit({...fan,p:fan.p*.985},ambient.pressure,v.bypassArea,'air');
  coreMass=hot.flow/(1+f);bypassMass=by.flow;fuelFlow=coreMass*f;
  power=coreMass*(hpWork+enthalpy(lpc.t,'air')-enthalpy(fan.t,'air'))+(coreMass+bypassMass)*fanWork;
  turbinePower=(coreMass+fuelFlow)*(enthalpy(t4,'gas')-enthalpy(t5,'gas'));
  stations.push(station(fan),station(lpc),station(hpc),station(burner),station(hpt),station(lpt),station({id:'8',name:'Core exhaust',t:hot.te,p:hot.pe},'static'),station({id:'18',name:'Bypass exhaust',t:by.te,p:by.pe},'static'));
 }
 const momentumThrust=(coreMass+fuelFlow)*hot.v+bypassMass*(by?.v??0)-(coreMass+bypassMass)*speed;
 const pressureThrust=hot.pressure+(by?.pressure??0);
 const thrust=momentumThrust+pressureThrust;
 if(!Number.isFinite(thrust)||coreMass<=0)throw Error('Operating state is not physically feasible.');
 const shaftPowerMismatchPercent=100*Math.abs(turbinePower-power)/Math.max(turbinePower,power);
 const warning='Preliminary steady-state cycle; independently validated component maps and physical RPM prediction remain unimplemented.'+
  (shaftPowerMismatchPercent>5?' Shaft work is not closed ('+shaftPowerMismatchPercent.toFixed(1)+'% difference between computed turbine extraction and compressor/fan demand).':'');
 return {valid:thrust>0,engine:v.engine,thrust,momentumThrust,pressureThrust,shaftPowerMismatchPercent,fuelFlow,tsfc:thrust>1?fuelFlow*3600/(thrust/1000):null,massFlow:coreMass+bypassMass,coreMass,bypassMass,coreVelocity:hot.v,coreChoked:hot.choked,bypassChoked:by?.choked??false,coreArea:v.coreArea,bypassArea:v.engine==='turbofan'?v.bypassArea:0,coreGeom:hot.geometric,bypassGeom:by?.geometric??0,compressorPower:power,turbinePower,stations,n1:null,n2:null,warning};
}
