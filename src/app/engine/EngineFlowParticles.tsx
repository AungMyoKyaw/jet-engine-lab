import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {PARTS} from '../data/parts';
import type {VisualEngineId} from '../data/catalog';

const BYPASS=new Set<VisualEngineId>(['turbofan','geared-turbofan','afterburning-turbofan']);
export function EngineFlowParticles({engine}:{engine:VisualEngineId}){
 const ref=useRef<THREE.InstancedMesh>(null);
 const count=BYPASS.has(engine)?112:76;
 const parts=PARTS[engine];
 const start=useMemo(()=>Math.min(...parts.map(p=>p.x))-.8,[parts]);
 const length=useMemo(()=>Math.max(...parts.map(p=>p.x))-start+1.4,[parts,start]);
 const matrix=useMemo(()=>new THREE.Matrix4(),[]);
 const pos=useMemo(()=>new THREE.Vector3(),[]);
 const quat=useMemo(()=>new THREE.Quaternion(),[]);
 const size=useMemo(()=>new THREE.Vector3(),[]);
 const reduced=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 const colors=useMemo(()=>Array.from({length:count},(_,i)=>new THREE.Color(i%5===0?'#ffa768':'#74d9fa')),[count]);
 useEffect(()=>{
  const mesh=ref.current;if(!mesh)return;
  for(let i=0;i<count;i++)mesh.setColorAt(i,colors[i]);
  if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 },[colors,count]);
 useFrame(({clock})=>{
  const mesh=ref.current;if(!mesh)return;
  const elapsed=reduced?0:clock.elapsedTime;
  for(let i=0;i<count;i++){
   const phase=(i*.61803398875+elapsed*.11)%1;
   const x=start+phase*length;
   const bypass=BYPASS.has(engine)&&i%5===0;
   // Particles travel through the conceptual core or the separate cool bypass duct.
   // This is an illustrative path, not CFD or measured flow velocity.
   const ring=bypass?engine==='afterburning-turbofan'?1.11:1.48:.32+(i%7)*.035;
   const angle=i*2.39996+elapsed*(reduced?0:.2);
   pos.set(x,Math.cos(angle)*ring,Math.sin(angle)*ring);
   const taper=Math.sin(phase*Math.PI);
   size.setScalar((bypass?.042:.036)*(.65+.35*Math.max(.1,taper)));
   matrix.compose(pos,quat,size);
   mesh.setMatrixAt(i,matrix);
  }
  mesh.instanceMatrix.needsUpdate=true;
 });
 return <instancedMesh ref={ref} args={[undefined,undefined,count]} frustumCulled={false} raycast={()=>null}>
  <sphereGeometry args={[1,6,5]}/>
  <meshBasicMaterial color="#ffffff" transparent opacity={.76} depthWrite={false}/>
 </instancedMesh>;
}
