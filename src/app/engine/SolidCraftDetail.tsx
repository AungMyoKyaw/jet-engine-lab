import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import type {CadDetailKind,Part} from '../data/parts';

type Supplement={file:string;rotating?:boolean;position?:[number,number,number]};
type CadAssembly={file:string;radius:number;axial?:number;targetAxial?:number;rotation?:[number,number,number];supplements?:readonly Supplement[]};

/** SolidCraft B-rep families; stationary stators never rotate with the shaft. */
const MODELS:Record<CadDetailKind,CadAssembly>={
  fan:{file:'fan-blisk',radius:1.05,supplements:[{file:'fan-outlet-guides'}]},
  compressor:{file:'compressor-cassette',radius:.923,supplements:[{file:'stator-vane-ring'},{file:'compressor-case-detail'}]},
  turbine:{file:'turbine-wheel',radius:.872,supplements:[{file:'turbine-nozzle-guide'},{file:'turbine-shroud'},{file:'bearing-cartridge'}]},
  gearbox:{file:'planetary-reducer',radius:.70},
  burner:{file:'combustor-liner',radius:.79,rotation:[Math.PI,0,0],supplements:[{file:'combustor-dome'},{file:'combustor-manifold',position:[-.42,0,0]}]},
  inlet:{file:'intake-duct',radius:1.03,axial:1.5,targetAxial:1.45},
  bypass:{file:'bypass-lattice',radius:1.0,axial:7.6,targetAxial:8.4},
  nozzle:{file:'nozzle-housing',radius:.962,axial:1.02,targetAxial:.98,rotation:[Math.PI,0,0],supplements:[{file:'nozzle-petals'},{file:'nozzle-actuators'}]},
  impeller:{file:'radial-impeller',radius:1.01},
  diffuser:{file:'radial-diffuser',radius:1.04},
  afterburner:{file:'afterburner-assembly',radius:.91},
};

function CadAsset({file,scale,position,rotation}:{file:string;scale:[number,number,number];position?:[number,number,number];rotation?:[number,number,number]}){
  const {scene}=useGLTF(import.meta.env.BASE_URL+'assets/solidcraft/'+file+'.glb');
  // Every placement owns its transform, while the GLTF geometry is cached.
  const instance=useMemo(()=>scene.clone(true),[scene]);
  return <primitive object={instance} scale={scale} position={position} rotation={rotation}/>;
}

export function SolidCraftDetail({kind,radius,shaft}:{kind:CadDetailKind;radius:number;shaft:Part['shaft']}){
  const config=MODELS[kind];
  const rotor=useRef<THREE.Group>(null);
  const reducedMotion=useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
  const spins=shaft!==null&&(kind==='fan'||kind==='compressor'||kind==='turbine'||kind==='impeller');
  useFrame((_,dt)=>{
    if(spins&&!reducedMotion&&rotor.current)
      rotor.current.rotation.x+=Math.min(dt,.04)*(shaft==='HP'?1.3:shaft==='LP'?.72:1);
  });
  const radial=radius/config.radius;
  const axial=config.axial&&config.targetAxial?config.targetAxial/config.axial:radial;
  const scale:[number,number,number]=[axial,radial,radial];
  return <group name={'solidcraft-'+kind}>
    <group ref={rotor}>
      {spins&&<CadAsset file={config.file} scale={scale} rotation={config.rotation}/>}
      {config.supplements?.filter(part=>part.rotating).map(part=><CadAsset key={part.file} file={part.file} scale={scale} position={part.position}/>)}
    </group>
    {!spins&&<CadAsset file={config.file} scale={scale} rotation={config.rotation}/>}
    {config.supplements?.filter(part=>!part.rotating).map(part=><CadAsset key={part.file} file={part.file} scale={scale} position={part.position}/>)}
  </group>;
}
