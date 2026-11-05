/** Reproducible numerical self-consistency audit, NOT measured-engine validation.
 * Run with `bun run physics:validate`; writes a versioned report for review.
 */
import {writeFile,mkdir} from 'node:fs/promises';
import {compute,DEFAULTS,atmosphere,type Input,type Result} from '../src/app/physics/cycle';

const R=287.05287,CD=.97;
const cases:{name:string;input:Input}[]=[];
for(const engine of ['turbojet','turbofan'] as const)cases.push({name:`${engine}-reference`,input:DEFAULTS[engine]});
for(const throttle of [.4,.6,.8,.95])for(const coreArea of [.2,.28,.4])
 cases.push({name:`turbojet-t${throttle}-a${coreArea}`,input:{...DEFAULTS.turbojet,throttle,coreArea}});
for(const altitude of [0,3000,7000])for(const mach of [.1,.28,.55])
 cases.push({name:`turbojet-h${altitude}-m${mach}`,input:{...DEFAULTS.turbojet,altitude,mach}});
for(const bypassArea of [.3,.45,.6,.7,.8])for(const throttle of [.6,.72,.85])
 cases.push({name:`turbofan-a${bypassArea}-t${throttle}`,input:{...DEFAULTS.turbofan,bypassArea,throttle}});

function assert(ok:boolean,label:string){if(!ok)throw Error(label);}
function near(a:number,b:number,relative=1e-7){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=relative*Math.max(1,Math.abs(a),Math.abs(b));}
function audit(r:Result,input:Input){
 const ambient=atmosphere(input.altitude);
 assert(r.valid,'positive net thrust');
 assert(near(r.thrust,r.momentumThrust+r.pressureThrust),'force conservation');
 assert(near(r.massFlow,r.coreMass+r.bypassMass),'mass split');
 assert(near(r.coreArea,CD*r.coreGeom),'core discharge-coefficient geometry relation');
 assert(r.coreMass>0&&r.fuelFlow>0&&r.coreVelocity>0,'positive gas flow');
 assert(r.shaftPowerMismatchPercent<.001,'matched modeled shaft work');
 assert(near(r.compressorPower,r.turbinePower,1e-5),'shaft power consistency');
 assert(r.n1===null&&r.n2===null,'unvalidated RPM cannot be fabricated');
 assert(r.solutionBranches>=1,'solution existence');
 const core=r.stations.find(s=>s.id==='8');
 assert(Boolean(core),'core outlet static state');
 const gasMass=r.coreMass+r.fuelFlow;
 assert(near(gasMass,r.coreArea*r.coreVelocity*core!.pressure/(R*core!.temperature)),'core nozzle mass continuity');
 const expectedPressureForce=(r.coreExitPressure-ambient.pressure)*r.coreGeom+
  (r.bypassExitPressure===null?0:(r.bypassExitPressure-ambient.pressure)*r.bypassGeom);
 assert(near(r.pressureThrust,expectedPressureForce),'nozzle pressure-area force');
 const cpGas=1150+.16*(core!.temperature-300);
 const gammaGas=cpGas/(cpGas-R);
 assert(near(r.coreExitMach,r.coreVelocity/Math.sqrt(gammaGas*R*core!.temperature)),'core Mach kinematics');
 if(r.coreChoked){assert(Math.abs(r.coreExitMach-1)<1e-8,'core sonic throat');assert(r.coreExitPressure>=ambient.pressure,'choked core backpressure');}
 else {assert(near(r.coreExitPressure,ambient.pressure),'unchoked core backpressure');assert(r.coreExitMach<1,'subsonic core');}
 if(input.engine==='turbofan'){
  const bypass=r.stations.find(s=>s.id==='18');
  assert(Boolean(bypass),'bypass outlet static state');
  assert(near(r.bypassArea,CD*r.bypassGeom),'bypass discharge-coefficient geometry relation');
  assert(r.bypassMass>0&&Number.isFinite(r.bypassMass),'bypass finite mass');
  assert(near(r.actualBypassRatio!,r.bypassMass/r.coreMass),'actual bypass ratio');
  assert(r.bypassExitMach!==null,'bypass Mach exists');
  const cpAir=1005+.12*(bypass!.temperature-300);
  const gammaAir=cpAir/(cpAir-R);
  const density=bypass!.pressure/(R*bypass!.temperature);
  const speed=r.bypassMass/(density*r.bypassArea);
  assert(near(r.bypassExitMach!,speed/Math.sqrt(gammaAir*R*bypass!.temperature)),'bypass Mach/mass kinematics');
  if(r.bypassChoked)assert(Math.abs(r.bypassExitMach!-1)<1e-8,'bypass sonic throat');
  else {assert(r.bypassExitMach!<1,'subsonic bypass');assert(near(r.bypassExitPressure!,ambient.pressure),'unchoked bypass backpressure');}
 }
}

const accepted:unknown[]=[],rejected:unknown[]=[],errors:string[]=[];
for(const item of cases){
 try{
  const r=compute(item.input);audit(r,item.input);
  accepted.push({case:item.name,engine:item.input.engine,thrustN:r.thrust,coreMassKgS:r.coreMass,bypassMassKgS:r.bypassMass,shaftPowerGapPercent:r.shaftPowerMismatchPercent,coreExitMach:r.coreExitMach,bypassExitMach:r.bypassExitMach,solutionBranches:r.solutionBranches});
 }catch(e){
  const message=e instanceof Error?e.message:String(e);
  if(/No physically feasible LP shaft\/nozzle balance|Insufficient|Nozzle total pressure/.test(message))rejected.push({case:item.name,reason:message});
  else errors.push(`${item.name}: ${message}`);
 }
}
assert(accepted.some((v)=> (v as {case:string}).case==='turbojet-reference'),'turbojet default accepted');
assert(accepted.some((v)=> (v as {case:string}).case==='turbofan-reference'),'turbofan default accepted');
assert(accepted.length>=20,`insufficient feasible numerical cases: ${accepted.length}`);
assert(errors.length===0,`failed numerical assertions: ${errors.join(' | ')}`);
const report={
 schema:1,model:'Jet Engine Lab educational steady-state cycle',validationLevel:'numerical-internal-only',
 scope:'Self-consistency checks for thrust, nozzle mass continuity, Mach/pressure, discharge areas and shaft work. Not externally validated.',
 assumptions:{gasConstantJkgK:R,dischargeCoefficient:CD,geometryIsGeometricAreaNotMeasured:true},
 evidenceGates:{internalConservation:true,independentReferencePoints:false,physicalGeometryMeasurements:false,calibratedOffDesignMaps:false,validatedPhysicalRPM:false,areaToRenderedThroat:false,certifiedDigitalTwin:false},
 count:{attempted:cases.length,passed:accepted.length,unmatchedOrInfeasible:rejected.length,failed:errors.length},accepted,rejected,errors
};
await mkdir('validation',{recursive:true});
await writeFile('validation/physics-numerical-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(`Numerical cycle audit: ${accepted.length}/${cases.length} feasible and internally consistent; ${rejected.length} infeasible; ${errors.length} failures. NOT independently calibrated.`);
