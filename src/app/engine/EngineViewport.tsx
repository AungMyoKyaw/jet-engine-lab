import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type {ToolMode} from '../studio/project';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Result } from '../physics/cycle';
import type { VisualEngineId } from '../data/catalog';
import {AfterburnerGeometry,RadialImpeller,RadialDiffuser,PlanetaryGearbox,VariablePetals,IllustrationOverlay,type OverlayMode} from './SpecialGeometry';

import { PARTS, type Part } from '../data/parts';
import { ReferenceCutaway } from './ReferenceCutaway';
import {EngineFlowParticles} from './EngineFlowParticles';
const SILVER='#aebcc7',DARK='#344756',BRONZE='#b68758',SELECT='#7bdff1';
function Material({color= SILVER,metalness=.88,roughness=.31,transparent=false,opacity=1}:{color?:string;metalness?:number;roughness?:number;transparent?:boolean;opacity?:number}){return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={transparent} opacity={opacity} side={THREE.DoubleSide}/>;}
function Ring({radius,x=0,color=SILVER,tube=.035}:{radius:number;x?:number;color?:string;tube?:number}){return <mesh position={[x,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[radius,tube,8,64]}/><Material color={color}/></mesh>;}
function Duct({radius,length=1.6,color=DARK,opacity=.8}:{radius:number;length?:number;color?:string;opacity?:number}){return <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[radius*.91,radius,length,64,1,true,0,Math.PI*1.48]}/><Material color={color} opacity={opacity} transparent={opacity<1}/></mesh>;}
function bladeGeometry(radius:number){
 const root=radius*.43,tip=radius*.97,span=tip-root;
 const vertices:number[]=[],indices:number[]=[];
 const N=12,M=6;
 const make=(side:number)=>{
  for(let j=0;j<=M;j++){
   const v=j/M,r=root+v*span,chord=(.30-.085*v);
   const twist=.10*(1-v)+.24*v;
   const offset=-.11*v*v;
   for(let i=0;i<=N;i++){
    const u=i/N,camber=.06*Math.sin(u*Math.PI)*(1-v*.25);
    const thickness=(.20*(.2969*Math.sqrt(Math.max(.00001,u))-.126*u-.3516*u*u+.2843*u*u*u-.1015*u*u*u*u))*(1-.5*v);
    vertices.push((u-.5)*chord, r, offset+(u-.5)*twist+camber+side*thickness);
   }
  }
 };
 make(1);make(-1);
 const layer=(M+1)*(N+1);
 for(let side=0;side<2;side++)for(let j=0;j<M;j++)for(let i=0;i<N;i++){
   const a=side*layer+j*(N+1)+i,b=a+1,c=a+(N+1),d=c+1;
   if(side===0)indices.push(a,c,b,b,c,d);else indices.push(a,b,c,b,d,c);
 }
 for(let i=0;i<N;i++){
  indices.push(i,layer+i,i+1,i+1,layer+i,layer+i+1);
  const k=M*(N+1)+i;indices.push(k,k+1,layer+k,k+1,layer+k+1,layer+k);
 }
 for(let j=0;j<M;j++){
  const k=j*(N+1),l=layer+k;
  indices.push(k,l,k+N+1,k+N+1,l,l+N+1);
  const e=k+N,f=l+N;indices.push(e,e+N+1,f,e+N+1,f+N+1,f);
 }
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 g.setIndex(indices);
 g.computeVertexNormals();return g;
}
function BladeRow({radius,count=22,shaft='TJ',thermal=false,active=false}:{radius:number;count?:number;shaft?:string|null;thermal?:boolean;active?:boolean}) {
 const rotor=useRef<THREE.Group>(null),blades=useRef<THREE.InstancedMesh>(null);
 const geo=useMemo(()=>bladeGeometry(radius),[radius]);
 const material=useMemo(()=>new THREE.MeshStandardMaterial({color:active?SELECT:thermal?'#c69b74':'#a8bfcd',metalness:.89,roughness:.26,side:THREE.DoubleSide}),[thermal,active]);
 useEffect(()=>{if(!blades.current)return;const matrix=new THREE.Matrix4(),quaternion=new THREE.Quaternion(),axis=new THREE.Vector3(1,0,0);
  for(let i=0;i<count;i++){quaternion.setFromAxisAngle(axis,i*2*Math.PI/count);matrix.compose(new THREE.Vector3(),quaternion,new THREE.Vector3(1,1,1));blades.current.setMatrixAt(i,matrix);}
  blades.current.instanceMatrix.needsUpdate=true;
 },[count]);
 const reduced=useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 useFrame((_,dt)=>{if(rotor.current&&!reduced)rotor.current.rotation.x+=Math.min(dt,.04)*(shaft===null?0:shaft==='HP'?1.3:shaft==='LP'?.72:1);});
 return <group ref={rotor}>
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[radius*.43,radius*.43,.11,40]}/><Material color={active?SELECT:'#556f81'}/></mesh>
  <instancedMesh ref={blades} args={[geo,material,count]} frustumCulled={false}/>
  <Ring radius={radius*.43} tube={.025}/>
 </group>;
}
function Section({part,selected,onSelect,explode,showShell,coreArea,bypassArea,engine,afterburnerOn,nozzleOpen,overlay,toolMode,onMeasurePoint}:{part:Part;selected:boolean;onSelect:(id:string)=>void;explode:number;showShell:boolean;coreArea:number;bypassArea:number;engine:VisualEngineId;afterburnerOn:boolean;nozzleOpen:number;overlay:OverlayMode;toolMode:ToolMode;onMeasurePoint:(p:[number,number,number])=>void}){
 const open=part.kind==='inlet'||part.kind==='bypass';
 const thermal=part.kind==='turbine'||part.kind==='burner'||part.kind==='afterburner';
 const displacement=explode*(part.x<0?-1:1)*(1.2+Math.abs(part.x)*.1);
 const nozzleArea=part.kind==='bypass'?bypassArea:coreArea;
 const throatRadius=Math.sqrt(Math.max(.04,nozzleArea)/Math.PI);
 const color=selected?SELECT:overlay==='heat'&&thermal?'#f39b63':thermal?BRONZE:SILVER;
 const pick=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();if(toolMode==='measure')onMeasurePoint([e.point.x,e.point.y,e.point.z]);else onSelect(part.id);};
 return <group position={[part.x+displacement,0,0]} onClick={pick}>
  {part.kind==='afterburner'?<AfterburnerGeometry active={afterburnerOn} selected={selected} overlay={overlay}/>:part.kind==='impeller'?<RadialImpeller selected={selected} overlay={overlay}/>:part.kind==='diffuser'?<RadialDiffuser selected={selected}/>:part.kind==='gearbox'?<PlanetaryGearbox selected={selected} overlay={overlay}/>:part.kind==='nozzle'&&engine==='afterburning-turbofan'?<VariablePetals radius={part.radius} open={nozzleOpen} selected={selected}/>:part.kind==='nozzle'?<>
    <mesh position={[.25,0,0]} rotation={[0,0,-Math.PI/2]}>
      <cylinderGeometry args={[throatRadius,part.radius,.98,64,1,true]}/><Material color={selected?SELECT:'#677d8b'}/>
    </mesh>
    <Ring radius={throatRadius} x={.76} color={selected?SELECT:BRONZE} tube={.045}/>
    <Ring radius={part.radius} x={-.26} color={color}/>
  </>:part.kind==='bypass'?<>
     <Duct radius={part.radius} length={8.4} color={selected?'#447b87':'#304451'} opacity={showShell?.36:.08}/>
     <Ring radius={part.radius} x={-3.6} color={color}/>
     <Ring radius={part.radius} x={3.6} color={color}/>
     <mesh position={[4.1,0,0]} rotation={[0,0,-Math.PI/2]}><cylinderGeometry args={[Math.sqrt(1.08**2+Math.max(.04,nozzleArea)/Math.PI),part.radius,.7,64,1,true,0,Math.PI*1.48]}/><Material color={selected?SELECT:'#526a79'} opacity={.72} transparent/></mesh>
  </>:<>
    {showShell&&<Duct radius={part.radius} length={part.kind==='inlet'?1.45:part.kind==='burner'?1.55:1.8} color={selected?'#305b69':'#486071'} opacity={part.kind==='inlet'?.66:.26}/>}
    <Ring radius={part.radius} x={-.68} color={color}/>
    <Ring radius={part.radius*.95} x={.68} color={color}/>
    {open&&<mesh position={[-.55,0,0]} rotation={[0,0,-Math.PI/2]}><coneGeometry args={[part.radius*.4,.9,40]}/><Material color="#859daa"/></mesh>}
    {(part.kind==='compressor'||part.kind==='turbine'||part.kind==='fan')&&<>
      {[-.52,-.18,.18,.50].slice(0,part.kind==='fan'?1:4).map((offset,i)=><group key={i} position={[offset,0,0]}>
        <BladeRow radius={part.radius*(1-i*.03)} count={part.kind==='fan'?26:part.kind==='turbine'?18:22} shaft={part.shaft} thermal={thermal} active={selected}/>
        {part.kind!=='fan'&&<Ring x={.11} radius={part.radius*.93} color="#627783" tube={.015}/>}
      </group>)}
    </>}
    {part.kind==='burner'&&Array.from({length:12},(_,i)=><group key={i} rotation={[i*Math.PI/6,0,0]}>
      <mesh position={[0,part.radius*.68,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.11,.11,1.18,10,1,true]}/><Material color={selected?SELECT:'#a87951'}/></mesh>
      <mesh position={[.08,part.radius*.69,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.064,.064,.63,8,1,true]}/><meshBasicMaterial color="#f9a558" transparent opacity={.33}/></mesh>
    </group>)}
    {engine==='turbofan'&&part.kind==='fan'&&<Ring radius={1.95} color="#668b9c"/>}
  </>}
 </group>;
}
function MeasurementSegment({points}:{points:[number,number,number][]}){
 const line=useMemo(()=>new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color:'#f8cd78',depthTest:false})),[points]);
 useEffect(()=>()=>{line.geometry.dispose();(line.material as THREE.Material).dispose()},[line]);
 return <primitive object={line}/>;
}
function World({engine,selected,onSelect,explode,showShell,result,referenceMode,preset,viewReset,toolMode,onMeasurePoint,measurePoints,sectionEnabled,sectionOffset,theme,afterburnerOn,nozzleOpen,overlay,focusPart,flowEnabled}:{engine:VisualEngineId;selected:string;onSelect:(s:string)=>void;explode:number;showShell:boolean;result:Result|null;referenceMode:boolean;preset:ViewPreset;viewReset:number;toolMode:ToolMode;onMeasurePoint:(p:[number,number,number])=>void;measurePoints:[number,number,number][];sectionEnabled:boolean;sectionOffset:number;theme:string;afterburnerOn:boolean;nozzleOpen:number;overlay:OverlayMode;focusPart:string|null;flowEnabled:boolean}){
 const parts=PARTS[engine];
 const orbitRef=useRef<OrbitControlsImpl>(null);
 const lastFitContext=useRef('');
 const {camera,size,gl}=useThree();
 useEffect(()=>{gl.clippingPlanes=sectionEnabled?[new THREE.Plane(new THREE.Vector3(0,1,0),-sectionOffset)]:[];return()=>{gl.clippingPlanes=[]}},[gl,sectionEnabled,sectionOffset]);
 useEffect(()=>{
  const controls=orbitRef.current;
  if(!controls||size.width<1||size.height<1)return;
  const normal:Record<ViewPreset,THREE.Vector3>={
   threequarter:new THREE.Vector3(.63,.33,1),
   side:new THREE.Vector3(0,.13,1),
   top:new THREE.Vector3(0,1,.001),
   axial:new THREE.Vector3(-1,.09,.001)
  };
  const fitContext=[engine,preset,viewReset,referenceMode,focusPart,size.width,size.height].join(':');
  // Adjusting explosion must preserve any custom orbit angle, not jump back to a preset.
  const currentDirection=controls.object.position.clone().sub(controls.target).normalize();
  const direction=lastFitContext.current===fitContext?currentDirection:normal[preset].normalize();
  lastFitContext.current=fitContext;
  // Fit actual assembly envelopes instead of an oversized whole-engine cuboid.
  // The radial envelope varies strongly along the axis, especially at the inlet.
  const points=[] as THREE.Vector3[];
  const twist=new THREE.Matrix4().makeRotationY(-.16);
  const focus=focusPart?parts.find(part=>part.id===focusPart):undefined;
  const center=focus?new THREE.Vector3(focus.x,0,0).applyMatrix4(twist):new THREE.Vector3();
  for(const part of focus?[focus]:parts){
   const span=part.kind==='bypass'?4.3:part.kind==='nozzle'?1:.78;
   const radius=part.radius*(part.kind==='bypass'?1.04:1.06);
   for(const dx of [-span,span])for(const y of [-radius,radius])for(const z of [-radius,radius]){
    const displacement=explode*(part.x<0?-1:1)*(1.2+Math.abs(part.x)*.1);
    points.push(new THREE.Vector3(part.x+displacement+dx,y,z).applyMatrix4(twist));
   }
  }
  if(referenceMode && engine==='turbofan'){
   for(const x of [-5.6,5.6])for(const y of [-2.3,2.3])for(const z of [-2.3,2.3])points.push(new THREE.Vector3(x,y,z));
  }
  const perspective=camera as THREE.PerspectiveCamera;
  const fits=(distance:number)=>{
   perspective.position.copy(direction).multiplyScalar(distance).add(center);
   perspective.lookAt(center);
   perspective.updateMatrixWorld(true);
   perspective.updateProjectionMatrix();
   for(const point of points){
    const viewPoint=point.clone().applyMatrix4(perspective.matrixWorldInverse);
    if(viewPoint.z>=-.3)return false;
    const projected=point.clone().project(perspective);
    if(Math.abs(projected.x)>.83||Math.abs(projected.y)>.82)return false;
   }
   return true;
  };
  let lower=4,upper=90;
  for(let i=0;i<34;i++){const distance=(lower+upper)/2;if(fits(distance))upper=distance;else lower=distance;}
  // A tighter desktop crop follows the real curved silhouette rather than the conservative box corners.
  // Narrow touch viewports keep the full fitted envelope to avoid cropping.
  const wide=size.width>=1080 && size.width/Math.max(1,size.height)>1.65;
  const mobile=size.width<650;
  const tightness=focus?1.65:wide?.93+explode*.07:mobile?.79+explode*.21:1;
  perspective.position.copy(direction).multiplyScalar(upper*tightness).add(center);
  controls.target.copy(center);
  controls.update();
 },[camera,size.width,size.height,engine,preset,viewReset,referenceMode,explode,focusPart]);
 const shaftLength=Math.max(...parts.map(part=>part.x))-Math.min(...parts.map(part=>part.x))-.6;
 return <><color attach="background" args={[theme==='light'?'#e9f1f5':'#0c1925']}/><Suspense fallback={null}><Environment files={import.meta.env.BASE_URL+'assets/studio_small_08_1k.hdr'} environmentIntensity={.48}/></Suspense><fog attach="fog" args={[theme==='light'?'#e9f1f5':'#0c1925',22,46]}/>
 <ambientLight intensity={.95}/><hemisphereLight args={['#d7eaff','#31485f',2.4]}/>
 <directionalLight position={[-4,9,10]} intensity={3.1}/><directionalLight position={[6,-3,-8]} intensity={2.3} color="#92b7db"/>
 <pointLight position={[0,2,4]} intensity={65} distance={9} color="#d29563"/>
 {referenceMode && engine==='turbofan' ? <ReferenceCutaway onSelect={onSelect} explode={explode} showShell={showShell}/> : <group rotation={[0,-.16,0]}>
   {!focusPart&&<mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.23,.23,shaftLength,32]}/><Material color="#587083"/></mesh>}
   <IllustrationOverlay engine={engine} mode={overlay}/>
   {flowEnabled&&!focusPart&&<EngineFlowParticles engine={engine}/>}
   {parts.filter(p=>!focusPart||p.id===focusPart).map(p=><Section key={p.id} part={p} selected={selected===p.id} onSelect={onSelect} explode={explode} showShell={showShell} engine={engine} coreArea={result?.coreGeom??.2} bypassArea={result?.bypassGeom??1.8} afterburnerOn={afterburnerOn} nozzleOpen={nozzleOpen} overlay={overlay} toolMode={toolMode} onMeasurePoint={onMeasurePoint}/>)}
 </group>}
 {measurePoints.map((pos,i)=><mesh key={i} position={pos}><sphereGeometry args={[.09,16,12]}/><meshBasicMaterial color={i===0?'#5ee5ef':'#ffc477'} depthTest={false}/></mesh>)}
 {measurePoints.length===2&&<MeasurementSegment points={measurePoints}/>}
 <Grid infiniteGrid sectionColor={theme==='light'?'#b5ceda':'#3d5a6c'} cellColor={theme==='light'?'#d1e0e9':'#203749'} fadeDistance={25} cellSize={.65} sectionSize={2.6} position={[0,-2.35,0]} side={THREE.DoubleSide}/>
 <ContactShadows opacity={.27} scale={20} blur={2.5} far={5} position={[0,-2.4,0]}/>
 <OrbitControls ref={orbitRef} makeDefault enableDamping dampingFactor={.09} minDistance={5} maxDistance={60} minPolarAngle={.25} maxPolarAngle={Math.PI-.25} target={[0,0,0]}/>
 </>;
}
function WebGLFallback({engine,onSelect,selected}:{engine:VisualEngineId;onSelect:(id:string)=>void;selected:string}) {
 const items=PARTS[engine].filter(p=>p.kind!=='bypass');
 return <div className="webgl-fallback" role="region" aria-label={engine+' accessible two-dimensional engine schematic'}>
  <div className="webgl-fallback-heading">2D ENGINE SCHEMATIC <span>WEBGL UNAVAILABLE</span></div>
  <svg viewBox="0 0 770 240" role="img" aria-label={engine+' labeled core flow path schematic'} preserveAspectRatio="xMidYMid meet">
   <defs><marker id="engine-flow-arrow" orient="auto" markerWidth="6" markerHeight="6" refX="5" refY="3"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#8fd8ea" strokeWidth="1.5"/></marker></defs>
   <line x1="30" y1="120" x2="735" y2="120" stroke="#83cbd6" strokeWidth="2" strokeDasharray="5 6" markerEnd="url(#engine-flow-arrow)"/>
   {items.map((part,i)=>{const width=670/items.length,x=42+i*width;return <g key={part.id}>
    <rect x={x} y={76} width={width-7} height={88} rx={3} fill={selected===part.id?'#315f70':'#173047'} stroke={selected===part.id?'#8de1e8':'#557789'} strokeWidth={selected===part.id?2:1}/>
    <text x={x+(width-7)/2} y={102} fontSize="14" fill="#e7f5fc" textAnchor="middle">{part.id.toUpperCase()}</text>
    <text x={x+(width-7)/2} y={144} fontSize="11" fill="#a8d9e6" textAnchor="middle">{part.shaft||'STATIC'}</text>
   </g>})}
   <text x="30" y="40" fill="#a3c5d2" fontSize="13">AIR IN</text><text x="740" y="40" textAnchor="end" fill="#a3c5d2" fontSize="13">EXHAUST OUT</text>
  </svg>
  <div className="webgl-fallback-links">{items.map(p=><button key={p.id} onClick={()=>onSelect(p.id)} aria-pressed={selected===p.id}>{p.name}</button>)}</div>
  <p>Select a component for its detailed description in the adjacent inspector. Calculated station data remain available without 3D rendering.</p>
 </div>;
}
let cachedWebGLSupport:boolean|null=null;
function webGLSupported(){
 if(cachedWebGLSupport!==null)return cachedWebGLSupport;
 try{const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2')||canvas.getContext('webgl');cachedWebGLSupport=Boolean(context);context?.getExtension('WEBGL_lose_context')?.loseContext();return cachedWebGLSupport;}catch{cachedWebGLSupport=false;return false;}
}
export type ViewPreset='threequarter'|'side'|'top'|'axial';
export function EngineViewport({engine,selected,onSelect,explode,showShell,result,referenceMode=false,preset='threequarter',viewReset=0,toolMode='select',onMeasurePoint=()=>{},measurePoints=[],sectionEnabled=false,sectionOffset=0,theme='dark',afterburnerOn=false,nozzleOpen=.5,overlay='none',focusPart=null,flowEnabled=true}:{engine:VisualEngineId;selected:string;onSelect:(s:string)=>void;explode:number;showShell:boolean;result:Result|null;referenceMode?:boolean;preset?:ViewPreset;viewReset?:number;toolMode?:ToolMode;onMeasurePoint?:(p:[number,number,number])=>void;measurePoints?:[number,number,number][];sectionEnabled?:boolean;sectionOffset?:number;theme?:string;afterburnerOn?:boolean;nozzleOpen?:number;overlay?:OverlayMode;focusPart?:string|null;flowEnabled?:boolean}){
 if(!webGLSupported())return <WebGLFallback engine={engine} onSelect={onSelect} selected={selected}/>;
 return <Canvas key={engine} dpr={[1,1.7]} gl={{antialias:true,powerPreference:'high-performance'}} camera={{position:typeof window!=='undefined'&&window.innerWidth<680?[21,10,34]:[8,4.4,12.4],fov:36,near:.1,far:100}} aria-label={engine+' interactive 3D engine model'}>
  <World engine={engine} selected={selected} onSelect={onSelect} explode={explode} showShell={showShell} result={result} referenceMode={referenceMode} preset={preset} viewReset={viewReset} toolMode={toolMode} onMeasurePoint={onMeasurePoint} measurePoints={measurePoints} sectionEnabled={sectionEnabled} sectionOffset={sectionOffset} theme={theme} afterburnerOn={afterburnerOn} nozzleOpen={nozzleOpen} overlay={overlay} focusPart={focusPart} flowEnabled={flowEnabled}/>
 </Canvas>;
}
