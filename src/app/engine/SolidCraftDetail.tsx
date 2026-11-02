import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import type {CadDetailKind,Part} from '../data/parts';

/** SolidCraft-authored representative parts, with source .sc and command timelines. */
const MODELS:Record<CadDetailKind,{file:string;radius:number;axial?:number;targetAxial?:number}>={
  fan:{file:'rotor-stage',radius:.73},
  compressor:{file:'rotor-stage',radius:.73},
  turbine:{file:'rotor-stage',radius:.73},
  gearbox:{file:'planetary-reducer',radius:.70},
  burner:{file:'combustor-manifold',radius:.58},
  inlet:{file:'intake-duct',radius:1.03,axial:1.5,targetAxial:1.45},
  bypass:{file:'bypass-lattice',radius:1.0,axial:7.6,targetAxial:8.4},
  nozzle:{file:'nozzle-housing',radius:.93,axial:1.02,targetAxial:.98},
  impeller:{file:'radial-impeller',radius:1.01},
  diffuser:{file:'radial-diffuser',radius:1.04},
  afterburner:{file:'afterburner-assembly',radius:.91},
};

export function SolidCraftDetail({kind,radius,shaft}:{kind:CadDetailKind;radius:number;shaft:Part['shaft']}){
  const config=MODELS[kind];
  const {scene}=useGLTF(import.meta.env.BASE_URL+'assets/solidcraft/'+config.file+'.glb');
  // Each placement owns its transform, while GLTF geometry/material buffers are cached.
  const instance=useMemo(()=>scene.clone(true),[scene]);
  const rotor=useRef<THREE.Group>(null);
  const reducedMotion=useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
  const spins=shaft!==null&&(kind==='fan'||kind==='compressor'||kind==='turbine'||kind==='impeller');
  useFrame((_,dt)=>{
    if(spins&&!reducedMotion&&rotor.current)
      rotor.current.rotation.x+=Math.min(dt,.04)*(shaft==='HP'?1.3:shaft==='LP'?.72:1);
  });
  const radial=radius/config.radius;
  const axial=config.axial&&config.targetAxial?config.targetAxial/config.axial:radial;
  return <group ref={rotor} name={'solidcraft-'+kind}>
    <primitive object={instance} scale={[axial,radial,radial]}/>
  </group>;
}
