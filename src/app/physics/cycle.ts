export type EngineId='turbojet'|'turbofan';
export type Input={engine:EngineId;throttle:number;altitude:number;mach:number;pressureRatio:number;bypassRatio:number;coreArea:number;bypassArea:number};
export type Station={id:string;name:string;temperature:number;pressure:number;kind:'static'|'total'};
export type Result={valid:boolean;engine:EngineId;thrust:number;momentumThrust:number;pressureThrust:number;shaftPowerMismatchPercent:number;actualBypassRatio:number|null;solutionBranches:number;fuelFlow:number;tsfc:number|null;massFlow:number;coreMass:number;bypassMass:number;coreVelocity:number;coreChoked:boolean;bypassChoked:boolean;coreExitMach:number;bypassExitMach:number|null;coreExitPressure:number;bypassExitPressure:number|null;coreArea:number;bypassArea:number;coreGeom:number;bypassGeom:number;compressorPower:number;turbinePower:number;stations:Station[];n1:null;n2:null;warning:string};
export const DEFAULTS:Record<EngineId,Input>={
 turbojet:{engine:'turbojet',throttle:.68,altitude:0,mach:.2,pressureRatio:13,bypassRatio:0,coreArea:.28,bypassArea:0},
 turbofan:{engine:'turbofan',throttle:.72,altitude:0,mach:.28,pressureRatio:9.2,bypassRatio:5.2,coreArea:.20,bypassArea:.8}
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
export function validate(v:Input){if(v.engine!=='turbojet'&&v.engine!=='turbofan')return 'Unsupported engine';for(const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]){if(v.engine==='turbojet'&&(key==='bypassArea'||key==='bypassRatio'))continue;const num=v[key],range=LIMITS[key];if(!Number.isFinite(num)||num<range[0]||num>range[1])return key+' must be between '+range[0]+' and '+range[1];}return null;}
type Point={id:string;name:string;t:number;p:number};
function compress(s:Point,pr:number,eff:number,id:string,name:string):Point{const ideal=ts(entropy(s.t,'air')+R*Math.log(pr),'air');return{id,name,p:s.p*pr,t:th(enthalpy(s.t,'air')+(enthalpy(ideal,'air')-enthalpy(s.t,'air'))/eff,'air')};}
/** Convergent nozzle: sonic throat from variable-cp energy and entropy,
 * subsonic exit at ambient pressure otherwise. A_eff = Cd * A_geometry.
 * Cd approximates discharge losses; avoid also imposing a fictitious
 * 0.95 exit-efficiency which would yield subsonic speed at a sonic throat.
 */
function exit(s:Point,ambient:number,area:number,g:Gas){
 if(s.p<=ambient)throw Error('Nozzle total pressure must exceed ambient pressure.');
 let low=100,high=s.t;
 for(let i=0;i<64;i++){
  const trial=(low+high)/2;
  const gamma=cp(trial,g)/(cp(trial,g)-R);
  const energy=enthalpy(s.t,g)-enthalpy(trial,g)-.5*gamma*R*trial;
  if(energy>0)low=trial;else high=trial;
 }
 const sonicT=(low+high)/2;
 const sonicP=s.p*Math.exp((entropy(sonicT,g)-entropy(s.t,g))/R);
 const choked=ambient<=sonicP;
 const pe=choked?sonicP:ambient;
 const te=choked?sonicT:ts(entropy(s.t,g)+R*Math.log(pe/s.p),g);
 const v=Math.sqrt(Math.max(0,2*(enthalpy(s.t,g)-enthalpy(te,g))));
 const gamma=cp(te,g)/(cp(te,g)-R),mach=v/Math.sqrt(gamma*R*te);
 const geometric=area/CD;
 return{pe,te,v,mach,choked,flow:pe/(R*te)*v*area,pressure:(pe-ambient)*geometric,geometric};
}
function station(s:Point,kind:'static'|'total'='total'):Station{return{id:s.id,name:s.name,temperature:s.t,pressure:s.p,kind};}
export function compute(v:Input):Result{
 const err=validate(v);if(err)throw Error(err);
 const ambient=atmosphere(v.altitude),speed=v.mach*Math.sqrt(1.4*R*ambient.temperature);
 const t2=th(enthalpy(ambient.temperature,'air')+.5*speed**2,'air');
 const p2=ambient.pressure*Math.exp((entropy(t2,'air')-entropy(ambient.temperature,'air'))/R)*(.99-.02*v.mach**2);
 const inlet:Point={t:t2,p:p2,id:'2',name:'Diffuser'};
 const stations:Station[]=[station({t:ambient.temperature,p:ambient.pressure,id:'0',name:'Freestream'},'static'),station(inlet)];
 const t4=1060+590*v.throttle;let coreMass=0,bypassMass=0,fuelFlow=0,power=0,turbinePower=0,hot,by,solutionBranches=1;
 if(v.engine==='turbojet'){
  const comp=compress(inlet,v.pressureRatio,.87,'3','Compressor'),burner={t:t4,p:comp.p*.95,id:'4',name:'Combustor'};
  if(t4<=comp.t+30)throw Error('Turbine inlet temperature is insufficient for this compressor condition.');
  const f=(enthalpy(t4,'gas')-enthalpy(comp.t,'air'))/(.99*LHV-enthalpy(t4,'gas'));if(f<=0)throw Error('Nonphysical fuel-air ratio.');
  const work=enthalpy(comp.t,'air')-enthalpy(inlet.t,'air'),t5=th(enthalpy(t4,'gas')-work/((1+f)*.99),'gas');
  const ideal=th(enthalpy(t4,'gas')-(enthalpy(t4,'gas')-enthalpy(t5,'gas'))/.89,'gas');
  const turbine={id:'5',name:'Turbine',t:t5,p:burner.p*Math.exp((entropy(ideal,'gas')-entropy(t4,'gas'))/R)};
  if(turbine.p<=ambient.pressure*1.01)throw Error('Insufficient core nozzle pressure.');
  hot=exit(turbine,ambient.pressure,v.coreArea,'gas');coreMass=hot.flow/(1+f);fuelFlow=coreMass*f;
  power=coreMass*work;turbinePower=.99*(coreMass+fuelFlow)*(enthalpy(t4,'gas')-enthalpy(t5,'gas'));
  stations.push(station(comp),station(burner),station(turbine),station({id:'8',name:'Core exhaust',t:hot.te,p:hot.pe},'static'));
 }else{
  const fan=compress(inlet,1.58,.91,'13','Fan'),lpc=compress(fan,1.7,.91,'25','LPC'),hpc=compress(lpc,v.pressureRatio,.88,'3','HPC');
  const burner={id:'4',name:'Combustor',t:t4,p:hpc.p*.95};
  if(t4<=hpc.t+30)throw Error('Insufficient turbine entry temperature.');
  const f=(enthalpy(t4,'gas')-enthalpy(hpc.t,'air'))/(.99*LHV-enthalpy(t4,'gas'));if(f<=0)throw Error('Nonphysical fuel-air ratio.');
  const hpWork=enthalpy(hpc.t,'air')-enthalpy(lpc.t,'air'),fanWork=enthalpy(fan.t,'air')-enthalpy(inlet.t,'air'),lpcWork=enthalpy(lpc.t,'air')-enthalpy(fan.t,'air');
  const t45=th(enthalpy(t4,'gas')-hpWork/((1+f)*.99),'gas'),i45=th(enthalpy(t4,'gas')-(enthalpy(t4,'gas')-enthalpy(t45,'gas'))/.89,'gas');
  const hpt={t:t45,p:burner.p*Math.exp((entropy(i45,'gas')-entropy(t4,'gas'))/R),id:'45',name:'HPT'};
  by=exit({...fan,p:fan.p*.985},ambient.pressure,v.bypassArea,'air');
  bypassMass=by.flow;
  // LP shaft work is an unknown. Each candidate changes the LPT pressure,
  // nozzle capacity and therefore actual core/bypass split. Match the LP
  // turbine to the *nozzle-derived* mass flows, never an assumed bypass ratio.
  const idealAtMin=ts(entropy(hpt.t,'gas')+R*Math.log(ambient.pressure*1.01/hpt.p),'gas');
  const maxSpecificWork=(1+f)*.99*.9*(enthalpy(hpt.t,'gas')-enthalpy(idealAtMin,'gas'));
  if(!(maxSpecificWork>0)||!Number.isFinite(maxSpecificWork))throw Error('Insufficient turbine pressure for LP shaft matching.');
  const candidate=(specificWork:number)=>{
   const t=th(enthalpy(hpt.t,'gas')-specificWork/((1+f)*.99),'gas');
   const ti=th(enthalpy(hpt.t,'gas')-specificWork/((1+f)*.99*.9),'gas');
   const stage:Point={t,p:hpt.p*Math.exp((entropy(ti,'gas')-entropy(hpt.t,'gas'))/R),id:'5',name:'LPT'};
   if(stage.p<=ambient.pressure*1.01)return null;
   const nozzle=exit(stage,ambient.pressure,v.coreArea,'gas');
   const air=nozzle.flow/(1+f);
   if(!(air>0)||!Number.isFinite(air))return null;
   const demand=air*(lpcWork+fanWork)+bypassMass*fanWork;
   const supply=air*specificWork;
   return {stage,nozzle,air,demand,supply,residual:supply-demand,ratio:bypassMass/air};
  };
  type Candidate=NonNullable<ReturnType<typeof candidate>>;
  const roots:Candidate[]=[];
  let previous=candidate(0);
  const steps=192;
  for(let k=1;k<=steps;k++){
   const next=candidate(maxSpecificWork*(1-1e-7)*k/steps);
   if(previous&&next&&previous.residual*next.residual<=0){
    let lo=maxSpecificWork*(1-1e-7)*(k-1)/steps,hi=maxSpecificWork*(1-1e-7)*k/steps;
    let left=previous;
    for(let i=0;i<65;i++){
     const middle=(lo+hi)/2,trial=candidate(middle);
     if(!trial)throw Error('LP matching left the physical nozzle domain.');
     if(Math.abs(trial.residual)<=1e-9*Math.max(trial.demand,1)){lo=middle;hi=middle;break;}
     if((trial.residual>0)===(left.residual>0)){lo=middle;left=trial;}else hi=middle;
    }
    const root=candidate((lo+hi)/2);
    if(root&&Math.abs(root.residual)<=1e-6*Math.max(root.demand,1))roots.push(root);
   }
   previous=next;
  }
  if(!roots.length)throw Error('No physically feasible LP shaft/nozzle balance for these settings. Adjust the nozzle areas or flight conditions.');
  // Multiple roots are possible with fixed reference ratios. Favor the flow
  // split closest to the user's *reference* BPR, and report branch count.
  roots.sort((a,b)=>Math.abs(a.ratio-v.bypassRatio)-Math.abs(b.ratio-v.bypassRatio));
  solutionBranches=roots.length;
  const matched=roots[0],lpt=matched.stage;
  hot=matched.nozzle;coreMass=matched.air;fuelFlow=coreMass*f;
  power=coreMass*(hpWork+lpcWork+fanWork)+bypassMass*fanWork;
  turbinePower=.99*(coreMass+fuelFlow)*(enthalpy(t4,'gas')-enthalpy(lpt.t,'gas'));
  stations.push(station(fan),station(lpc),station(hpc),station(burner),station(hpt),station(lpt),station({id:'8',name:'Core exhaust',t:hot.te,p:hot.pe},'static'),station({id:'18',name:'Bypass exhaust',t:by.te,p:by.pe},'static'));
 }
 const momentumThrust=(coreMass+fuelFlow)*hot.v+bypassMass*(by?.v??0)-(coreMass+bypassMass)*speed;
 const pressureThrust=hot.pressure+(by?.pressure??0);
 const thrust=momentumThrust+pressureThrust;
 if(!Number.isFinite(thrust)||coreMass<=0)throw Error('Operating state is not physically feasible.');
 const shaftPowerMismatchPercent=100*Math.abs(turbinePower-power)/Math.max(turbinePower,power);
 const actualBypassRatio=v.engine==='turbofan'?bypassMass/coreMass:null;
 const warning='Steady-state teaching cycle with matched shaft work and convergent-nozzle flow. Component maps are not coupled; calibrated engine operating lines, physical RPM and measured dimensions remain unavailable.'+
  (solutionBranches>1?' Multiple mathematical LP balance branches exist; the reference bypass ratio selects one.':'');
 return {valid:thrust>0,engine:v.engine,thrust,momentumThrust,pressureThrust,shaftPowerMismatchPercent,actualBypassRatio,solutionBranches,fuelFlow,tsfc:thrust>1?fuelFlow*3600/(thrust/1000):null,massFlow:coreMass+bypassMass,coreMass,bypassMass,coreVelocity:hot.v,coreChoked:hot.choked,bypassChoked:by?.choked??false,coreExitMach:hot.mach,bypassExitMach:by?.mach??null,coreExitPressure:hot.pe,bypassExitPressure:by?.pe??null,coreArea:v.coreArea,bypassArea:v.engine==='turbofan'?v.bypassArea:0,coreGeom:hot.geometric,bypassGeom:by?.geometric??0,compressorPower:power,turbinePower,stations,n1:null,n2:null,warning};
}
