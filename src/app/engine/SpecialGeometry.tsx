import type {VisualEngineId} from '../data/catalog';

export type OverlayMode='none'|'heat'|'power'|'ghost';

/** Explanatory light cues only; all solid machinery is loaded from SolidCraft CAD. */
export function IllustrationOverlay({engine,mode}:{engine:VisualEngineId;mode:OverlayMode}){
 if(mode==='power')return <group name="illustrative-power-flow">
   <mesh rotation={[0,0,Math.PI/2]}>
    <cylinderGeometry args={[.31,.31,engine==='afterburning-turbofan'?11:engine==='centrifugal-turbojet'?6:9,24,1,true]}/>
    <meshBasicMaterial color="#ffe098" transparent opacity={.25} depthWrite={false}/>
   </mesh>
   {[-2,0,2].map(x=><mesh key={x} position={[x,0,0]} rotation={[0,Math.PI/2,0]}>
    <torusGeometry args={[.42,.045,8,36]}/>
    <meshBasicMaterial color="#ffe3a1" transparent opacity={.78} depthWrite={false}/>
   </mesh>)}
 </group>;
 if(mode==='heat')return <group name="illustrative-thermal-light">
  <pointLight position={[1,0,0]} intensity={15} distance={5} color="#ff7a48"/>
  <pointLight position={[3,0,0]} intensity={8} distance={5} color="#ffa36c"/>
 </group>;
 return null;
}
