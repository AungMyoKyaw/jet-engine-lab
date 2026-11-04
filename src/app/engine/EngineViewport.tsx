import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type {ToolMode} from '../studio/project';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Result } from '../physics/cycle';
import type { VisualEngineId } from '../data/catalog';
import {IllustrationOverlay,type OverlayMode} from './SpecialGeometry';

import { PARTS, type Part } from '../data/parts';
import {EngineFlowParticles} from './EngineFlowParticles';
import {SolidCraftDetail,SolidCraftShaft} from './SolidCraftDetail';
/** Assembly is all-or-nothing: never present an incomplete engine as a finished CAD model. */
class CadAssemblyBoundary extends Component<{children:ReactNode;engine:VisualEngineId;onError:()=>void},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(error:Error){console.error('SolidCraft CAD assembly unavailable:',this.props.engine,error.message);this.props.onError();}
 render(){return this.state.failed?null:this.props.children;}
}
function CadAssemblyReady({onReady}:{onReady:()=>void}){
 useEffect(()=>onReady(),[onReady]);
 return null;
}
function CadAssemblyState({failed}:{failed:boolean}){
 return <div className={'cad-assembly-overlay'+(failed?' cad-asset-error':' cad-loading-surface')}>
  {failed?<div className="cad-assembly-state cad-assembly-failed" role="alert">
   <strong>CAD ASSET UNAVAILABLE</strong>
   <p>The complete original SolidCraft assembly could not be loaded.</p>
   <button type="button" onClick={()=>window.location.reload()}>Retry loading CAD</button>
  </div>:<div className="cad-assembly-state cad-assembly-loading" role="status" aria-live="polite">
   <div className="cad-loading-trace" aria-hidden="true"><span/><span/><span/><span/><span/></div>
   <strong>Assembling SolidCraft CAD</strong>
   <p>Loading the original 3D components and drive shafts.</p>
   <div className="cad-loading-track" aria-hidden="true"><span/></div>
  </div>}
 </div>;
}
function Section({part,selected,onSelect,explode,showShell,nozzleOpen,motionSpeed,toolMode,onMeasurePoint}:{part:Part;selected:boolean;onSelect:(id:string)=>void;explode:number;showShell:boolean;nozzleOpen:number;motionSpeed:number;toolMode:ToolMode;onMeasurePoint:(p:[number,number,number])=>void}){
 const displacement=explode*(part.x<0?-1:1)*(1.2+Math.abs(part.x)*.1);
 const pick=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();if(toolMode==='measure')onMeasurePoint([e.point.x,e.point.y,e.point.z]);else onSelect(part.id);};
 return <group name={'cad-part-'+part.id} position={[part.x+displacement,0,0]} onClick={pick} userData={{cadPart:part.id,selected}}>
  <SolidCraftDetail kind={part.kind} radius={part.radius} shaft={part.shaft} showShell={showShell} selected={selected} nozzleOpen={nozzleOpen} motionSpeed={motionSpeed}/>
 </group>;
}
function MeasurementSegment({points}:{points:[number,number,number][]}){
 const line=useMemo(()=>new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color:'#f8cd78',depthTest:false})),[points]);
 useEffect(()=>()=>{line.geometry.dispose();(line.material as THREE.Material).dispose()},[line]);
 return <primitive object={line}/>;
}
function World({engine,selected,onSelect,explode,showShell,nozzleOpen,motionSpeed,afterburnerOn,preset,viewReset,toolMode,onMeasurePoint,measurePoints,sectionEnabled,sectionOffset,theme,overlay,focusPart,flowEnabled,onAssemblyReady,onAssemblyError}:{engine:VisualEngineId;selected:string;onSelect:(s:string)=>void;explode:number;showShell:boolean;nozzleOpen:number;motionSpeed:number;afterburnerOn:boolean;preset:ViewPreset;viewReset:number;toolMode:ToolMode;onMeasurePoint:(p:[number,number,number])=>void;measurePoints:[number,number,number][];sectionEnabled:boolean;sectionOffset:number;theme:string;overlay:OverlayMode;focusPart:string|null;flowEnabled:boolean;onAssemblyReady:()=>void;onAssemblyError:()=>void}){
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
  const fitContext=[engine,preset,viewReset,focusPart,size.width,size.height].join(':');
  // Adjusting explosion must preserve any custom orbit angle, not jump back to a preset.
  const currentDirection=controls.object.position.clone().sub(controls.target).normalize();
  // A centrifugal impeller's radial vanes are on the inlet-facing side.
  // Focus from that side so its solid backplate cannot hide the blade passages.
  const focusDirection=focusPart==='impeller'
   ?new THREE.Vector3(-1.05,.33,.88)
   :normal[preset];
  const direction=lastFitContext.current===fitContext?currentDirection:focusDirection.normalize();
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
  // A CAD component is the subject of focus mode, not a tiny feature in a distant whole-engine frame.
  // Preserve the conservative fit on narrow screens where controls overlap the canvas.
  const tightness=focus?(mobile?1.55:1.1):wide?.93+explode*.07:mobile?.79+explode*.21:1;
  perspective.position.copy(direction).multiplyScalar(upper*tightness).add(center);
  controls.target.copy(center);
  controls.update();
 },[camera,size.width,size.height,engine,preset,viewReset,explode,focusPart]);
 return <><color attach="background" args={[theme==='light'?'#e9f1f5':'#0c1925']}/><Suspense fallback={null}><Environment files={import.meta.env.BASE_URL+'assets/studio_small_08_1k.hdr'} environmentIntensity={.48}/></Suspense>{size.width>=650&&<fog attach="fog" args={[theme==='light'?'#e9f1f5':'#0c1925',22,46]}/>}
 <ambientLight intensity={.95}/><hemisphereLight args={['#d7eaff','#31485f',2.4]}/>
 <directionalLight position={[-4,9,10]} intensity={3.1}/><directionalLight position={[6,-3,-8]} intensity={2.3} color="#92b7db"/>
 <pointLight position={[0,2,4]} intensity={65} distance={9} color="#d29563"/>
 {engine==='afterburning-turbofan'&&afterburnerOn&&<pointLight position={[5.2,.25,0]} intensity={20} distance={3} color="#ed8949"/>}
 <group rotation={[0,-.16,0]}>
   <IllustrationOverlay engine={engine} mode={overlay}/>
   {flowEnabled&&!focusPart&&<EngineFlowParticles engine={engine}/>}
   <CadAssemblyBoundary key={engine+':'+(focusPart??'complete')} engine={engine} onError={onAssemblyError}>
    <Suspense fallback={null}>
     <group name="original-solidcraft-cad-assembly">
      {!focusPart&&<SolidCraftShaft engine={engine} selected={false}/>}
      {parts.filter(p=>!focusPart||p.id===focusPart).map(p=><Section key={p.id} part={p} selected={selected===p.id} onSelect={onSelect} explode={explode} showShell={showShell} nozzleOpen={nozzleOpen} motionSpeed={motionSpeed} toolMode={toolMode} onMeasurePoint={onMeasurePoint}/>)}
      <CadAssemblyReady onReady={onAssemblyReady}/>
     </group>
    </Suspense>
   </CadAssemblyBoundary>
 </group>
 {measurePoints.map((pos,i)=><mesh key={i} position={pos}><sphereGeometry args={[.09,16,12]}/><meshBasicMaterial color={i===0?'#5ee5ef':'#ffc477'} depthTest={false}/></mesh>)}
 {measurePoints.length===2&&<MeasurementSegment points={measurePoints}/>}
 <Grid infiniteGrid sectionColor={theme==='light'?'#b5ceda':'#3d5a6c'} cellColor={theme==='light'?'#d1e0e9':'#203749'} fadeDistance={25} cellSize={.65} sectionSize={2.6} position={[0,-2.35,0]} side={THREE.DoubleSide}/>
 <ContactShadows opacity={.27} scale={20} blur={2.5} far={5} position={[0,-2.4,0]}/>
 <OrbitControls ref={orbitRef} makeDefault enableDamping dampingFactor={.09} minDistance={5} maxDistance={60} minPolarAngle={.25} maxPolarAngle={Math.PI-.25} target={[0,0,0]}/>
 </>;
}
function WebGLUnavailable(){
 return <div className="webgl-fallback" role="alert">
  <div className="webgl-fallback-heading">3D VIEW UNAVAILABLE <span>WEBGL REQUIRED</span></div>
  <p>This viewport displays original SolidCraft CAD only. Enable WebGL or use a compatible browser to inspect the 3D assembly.</p>
 </div>;
}
let cachedWebGLSupport:boolean|null=null;
function webGLSupported(){
 if(cachedWebGLSupport!==null)return cachedWebGLSupport;
 try{const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2')||canvas.getContext('webgl');cachedWebGLSupport=Boolean(context);context?.getExtension('WEBGL_lose_context')?.loseContext();return cachedWebGLSupport;}catch{cachedWebGLSupport=false;return false;}
}
export type ViewPreset='threequarter'|'side'|'top'|'axial';
export function EngineViewport({engine,selected,onSelect,explode,showShell,preset='threequarter',viewReset=0,toolMode='select',onMeasurePoint=()=>{},measurePoints=[],sectionEnabled=false,sectionOffset=0,theme='dark',overlay='none',focusPart=null,flowEnabled=true,nozzleOpen=.5,motionSpeed=1,afterburnerOn=false}:{engine:VisualEngineId;selected:string;onSelect:(s:string)=>void;explode:number;showShell:boolean;result:Result|null;preset?:ViewPreset;viewReset?:number;toolMode?:ToolMode;onMeasurePoint?:(p:[number,number,number])=>void;measurePoints?:[number,number,number][];sectionEnabled?:boolean;sectionOffset?:number;theme?:string;overlay?:OverlayMode;focusPart?:string|null;flowEnabled?:boolean;nozzleOpen?:number;motionSpeed?:number;afterburnerOn?:boolean}){
 const assemblyKey=engine+':'+(focusPart??'complete');
 const [assembly,setAssembly]=useState<{key:string;status:'ready'|'failed'}|null>(null);
 const onAssemblyReady=useCallback(()=>setAssembly({key:assemblyKey,status:'ready'}),[assemblyKey]);
 const onAssemblyError=useCallback(()=>setAssembly({key:assemblyKey,status:'failed'}),[assemblyKey]);
 const status=assembly?.key===assemblyKey?assembly.status:'loading';
 if(!webGLSupported())return <WebGLUnavailable/>;
 return <>
  <Canvas key={engine} dpr={typeof window!=='undefined'&&window.innerWidth<650?[1,1.25]:[1,1.7]} gl={{antialias:true,powerPreference:'high-performance'}} camera={{position:typeof window!=='undefined'&&window.innerWidth<680?[21,10,34]:[8,4.4,12.4],fov:36,near:.1,far:100}} aria-label={engine+' interactive 3D engine model'}>
   <World engine={engine} selected={selected} onSelect={onSelect} explode={explode} showShell={showShell} nozzleOpen={nozzleOpen} motionSpeed={motionSpeed} afterburnerOn={afterburnerOn} preset={preset} viewReset={viewReset} toolMode={toolMode} onMeasurePoint={onMeasurePoint} measurePoints={measurePoints} sectionEnabled={sectionEnabled} sectionOffset={sectionOffset} theme={theme} overlay={overlay} focusPart={focusPart} flowEnabled={flowEnabled} onAssemblyReady={onAssemblyReady} onAssemblyError={onAssemblyError}/>
  </Canvas>
  {status!=='ready'&&<CadAssemblyState failed={status==='failed'}/>}
 </>;
}
