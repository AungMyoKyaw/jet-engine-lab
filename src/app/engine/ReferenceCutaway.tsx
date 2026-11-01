import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

/** CC0 reference artifact only: missing real concentric spools and nozzle actuation. */
export function ReferenceCutaway({onSelect,explode,showShell}:{onSelect:(id:string)=>void;explode:number;showShell:boolean}) {
 const {scene}=useGLTF(import.meta.env.BASE_URL+'assets/turbofan-cutaway-instudy.glb');
 const model=useMemo(()=>scene.clone(true),[scene]);
 const meshes=useMemo(()=>{
  const found:{mesh:THREE.Mesh;z:number}[]=[];
  model.traverse(obj=>{if(obj instanceof THREE.Mesh)found.push({mesh:obj,z:obj.position.z});});
  return found;
 },[model]);
 useEffect(()=>{
  for(const {mesh,z} of meshes){
   mesh.visible=showShell||!/case|nacelle/i.test(mesh.name);
   const dir=/fan|compressor|spinner/i.test(mesh.name)?1:/turbine|nozzle|tail/i.test(mesh.name)?-1:0;
   mesh.position.z=z+explode*.28*dir;
  }
 },[meshes,explode,showShell]);
 const select=(e:ThreeEvent<MouseEvent>)=>{
  e.stopPropagation();
  const name=e.object.name.toLowerCase();
  const part=name.includes('fan')?'fan':name.includes('compressor')?'hpc':name.includes('combustor')?'burner':name.includes('high_pressure_turbine')?'hpt':name.includes('low_pressure_turbine')?'lpt':name.includes('nozzle')?'nozzle':name.includes('nacelle')?'bypass':name.includes('shaft')?'lpc':'inlet';
  onSelect(part);
 };
 return <group position={[0,-2.24,0]} rotation={[0,-Math.PI/2,0]} scale={2.8} onClick={select}>
  <primitive object={model}/>
 </group>;
}
