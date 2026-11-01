import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {VisualEngineId} from '../data/catalog';
export type OverlayMode='none'|'heat'|'power'|'ghost';
const meshMat=(color:string,opacity=1)=>({color,metalness:.78,roughness:.32,transparent:opacity<1,opacity,side:THREE.DoubleSide});
function Spinning({children,speed=1}:{children:React.ReactNode;speed?:number}){
 const ref=useRef<THREE.Group>(null);
 const reduce=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 useFrame((_,delta)=>{if(ref.current&&!reduce)ref.current.rotation.x+=Math.min(delta,.05)*speed});
 return <group ref={ref}>{children}</group>;
}
export function RadialImpeller({selected=false,overlay='none'}:{selected?:boolean;overlay?:OverlayMode}){
 const color=selected?'#82e9f1':overlay==='heat'?'#e4ab78':'#9fb4c2';
 return <Spinning speed={.53}>
   <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.35,.70,.68,48]}/><meshStandardMaterial {...meshMat('#4c6474')}/></mesh>
   <mesh position={[-.31,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[1.13,.49,.12,64]}/><meshStandardMaterial {...meshMat('#3c5667')}/></mesh>
   {Array.from({length:18},(_,i)=><group key={i} rotation={[i*Math.PI/9,0,0]}>
     <mesh position={[-.09,.78,0]} rotation={[.39,0,-.14]}><boxGeometry args={[.54,.68,.065]}/><meshStandardMaterial {...meshMat(color)}/></mesh>
     <mesh position={[-.17,1.13,.03]} rotation={[.65,0,-.18]}><boxGeometry args={[.32,.17,.07]}/><meshStandardMaterial {...meshMat('#6c8799')}/></mesh>
   </group>)}
   <mesh position={[.12,0,0]} rotation={[0,0,Math.PI/2]}><coneGeometry args={[.39,.75,40]}/><meshStandardMaterial {...meshMat('#b5c7cf')}/></mesh>
 </Spinning>;
}
export function RadialDiffuser({selected=false}:{selected?:boolean}){
 return <group>
  {[.70,1.39].map((radius,i)=><mesh key={i} rotation={[0,Math.PI/2,0]}><torusGeometry args={[radius,.06,10,72]}/><meshStandardMaterial {...meshMat(selected?'#86e2ed':'#889dad')}/></mesh>)}
  {Array.from({length:20},(_,i)=><group key={i} rotation={[i*Math.PI/10,0,0]}>
   <mesh position={[0,1.05,0]} rotation={[.43,0,.15]}><boxGeometry args={[.18,.65,.065]}/><meshStandardMaterial {...meshMat(selected?'#8ae3ed':'#9eacb6')}/></mesh>
  </group>)}
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[1.53,1.53,.18,60,1,true]}/><meshStandardMaterial {...meshMat('#577184',.35)}/></mesh>
 </group>;
}
function GearWheel({radius,teeth,color}:{radius:number;teeth:number;color:string}){
 return <group>
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[radius*.85,radius*.85,.17,48]}/><meshStandardMaterial {...meshMat(color)}/></mesh>
  {Array.from({length:teeth},(_,i)=><mesh key={i} rotation={[i*2*Math.PI/teeth,0,0]} position={[0,radius*.9,0]}><boxGeometry args={[.19,radius*.23,.09]}/><meshStandardMaterial {...meshMat(color)}/></mesh>)}
  <mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[radius*.37,.065,10,44]}/><meshStandardMaterial {...meshMat('#273d4d')}/></mesh>
 </group>;
}
export function PlanetaryGearbox({selected=false,overlay='none'}:{selected?:boolean;overlay?:OverlayMode}){
 const ringColor=selected?'#83e6f1':'#9eb4c4',gold=overlay==='power'?'#ffe08a':'#cdab73';
 return <group>
   <mesh rotation={[0,Math.PI/2,0]}><torusGeometry args={[.95,.10,16,72]}/><meshStandardMaterial {...meshMat(ringColor)}/></mesh>
   <mesh rotation={[0,Math.PI/2,0]}><torusGeometry args={[.77,.035,10,72]}/><meshStandardMaterial {...meshMat('#516e7d')}/></mesh>
   <Spinning speed={1.0}><GearWheel radius={.28} teeth={12} color={gold}/></Spinning>
   <Spinning speed={-.42}>
    {Array.from({length:4},(_,i)=><group key={i} rotation={[i*Math.PI/2,0,0]} position={[0,0,0]}>
      <group position={[0,.56,0]}><Spinning speed={-1.5}><GearWheel radius={.23} teeth={10} color={selected?'#86e1e8':'#b0bec7'}/></Spinning></group>
      <mesh position={[.2,.27,0]} rotation={[0,0,Math.PI/2]}><boxGeometry args={[.10,.52,.09]}/><meshStandardMaterial {...meshMat('#657b89')}/></mesh>
    </group>)}
   </Spinning>
   <mesh position={[-.55,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.26,.26,.7,40]}/><meshStandardMaterial {...meshMat('#5b7589')}/></mesh>
 </group>;
}
export function AfterburnerGeometry({active,selected,overlay}:{active:boolean;selected:boolean;overlay:OverlayMode}){
 const reduce=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 const flame=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(flame.current&&!reduce)flame.current.scale.x=.92+.09*Math.sin(clock.elapsedTime*7)});
 return <group>
  {[0,.58].map((x,i)=><mesh key={i} position={[x,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.82,.07,10,64]}/><meshStandardMaterial {...meshMat(selected?'#9af0ed':'#988e85')}/></mesh>)}
  {Array.from({length:12},(_,i)=><group key={i} rotation={[i*Math.PI/6,0,0]}>
    <mesh position={[.12,.63,0]}><boxGeometry args={[.85,.07,.09]}/><meshStandardMaterial {...meshMat('#6d8898')}/></mesh>
    <mesh position={[.38,.51,0]} rotation={[0,0,.28]}><boxGeometry args={[.16,.33,.1]}/><meshStandardMaterial {...meshMat('#ac7d5b')}/></mesh>
  </group>)}
  <group ref={flame} visible={active}>
   {Array.from({length:9},(_,i)=><group key={i} rotation={[i*2*Math.PI/9,0,0]}>
      <mesh position={[.85,.32,0]} rotation={[0,0,-Math.PI/2]}><coneGeometry args={[.20,1.35,12]}/><meshBasicMaterial color={i%2?'#ffb361':'#ff6d47'} transparent opacity={overlay==='heat'?.85:.58} depthWrite={false}/></mesh>
    </group>)}
   <pointLight position={[.42,0,0]} intensity={5} distance={3.3} color="#ff8f53"/>
  </group>
 </group>;
}
export function VariablePetals({radius,open,selected}:{radius:number;open:number;selected:boolean}){
 const exitRadius=radius*(.75+.45*open);
 return <group>
  <mesh position={[-.26,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[radius,radius,.15,48,1,true]}/><meshStandardMaterial {...meshMat('#566d7b')}/></mesh>
  {Array.from({length:16},(_,i)=><group key={i} rotation={[i*Math.PI/8,0,0]}>
    <mesh position={[.22,(radius+exitRadius)/2,0]} rotation={[0,0,Math.atan2(exitRadius-radius,1.18)]}>
      <boxGeometry args={[1.2,.06,.23]}/><meshStandardMaterial {...meshMat(selected?'#8be5ed':i%2?'#9c9e9b':'#687f8c')}/></mesh>
  </group>)}
  <mesh position={[.79,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[exitRadius,.038,8,64]}/><meshStandardMaterial {...meshMat('#c39b78')}/></mesh>
 </group>;
}
export function IllustrationOverlay({engine,mode}:{engine:VisualEngineId;mode:OverlayMode}){
 if(mode==='none')return null;
 if(mode==='power')return <group>
   <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.31,.31,engine==='afterburning-turbofan'?11:engine==='centrifugal-turbojet'?6:9,24,1,true]}/><meshBasicMaterial color="#ffe098" transparent opacity={.5} depthWrite={false}/></mesh>
   {[ -2,0,2].map(x=><mesh key={x} position={[x,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.42,.055,8,36]}/><meshBasicMaterial color="#ffe3a1" transparent opacity={.83}/></mesh>)}
 </group>;
 if(mode==='heat')return <group><pointLight position={[1,0,0]} intensity={15} distance={5} color="#ff7a48"/><pointLight position={[3.0,0,0]} intensity={8} distance={5} color="#ffa36c"/></group>;
 return null;
}
