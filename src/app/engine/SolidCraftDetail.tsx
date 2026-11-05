import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import type {CadDetailKind,Part} from '../data/parts';
import type {VisualEngineId} from '../data/catalog';
import type {Result} from '../physics/cycle';
import {meteredThroats,THROAT_CAD} from './nozzle-geometry';

type Supplement={file:string;rotating?:boolean;shellOnly?:boolean;position?:[number,number,number]};
type CadAssembly={file:string;radius:number;axial?:number;targetAxial?:number;rotation?:[number,number,number];supplements?:readonly Supplement[]};

/** SolidCraft B-rep families; stationary stators never rotate with the shaft. */
const MODELS:Record<CadDetailKind,CadAssembly>={
  fan:{file:'fan-blisk',radius:1.05,supplements:[{file:'fan-outlet-guides'},{file:'fan-retention-hardware'}]},
  compressor:{file:'compressor-cassette',radius:.923,supplements:[{file:'stator-vane-ring'},{file:'compressor-case-detail'},{file:'compressor-service-hardware'},{file:'compressor-vsv-linkage'}]},
  turbine:{file:'turbine-wheel',radius:.872,supplements:[{file:'turbine-nozzle-guide'},{file:'turbine-shroud'},{file:'bearing-cartridge'},{file:'bearing-roller-train'},{file:'turbine-thermal-service'}]},
  gearbox:{file:'planetary-reducer',radius:.70,supplements:[{file:'gearbox-support-hardware'}]},
  burner:{file:'combustor-liner',radius:.79,rotation:[Math.PI,0,0],supplements:[{file:'combustor-dome'},{file:'combustor-manifold',position:[-.42,0,0]},{file:'combustor-thermal-hardware'}]},
  inlet:{file:'intake-duct',radius:1.03,axial:1.5,targetAxial:1.45,supplements:[{file:'intake-lip-hardware'}]},
  bypass:{file:'bypass-lattice',radius:1.0,axial:7.6,targetAxial:8.4,supplements:[{file:'bypass-structural-fittings'},{file:'bypass-nacelle-panels',shellOnly:true}]},
  nozzle:{file:'nozzle-housing',radius:.962,axial:1.02,targetAxial:.98,rotation:[Math.PI,0,0],supplements:[{file:'nozzle-petals'},{file:'nozzle-actuators'},{file:'nozzle-hinge-service'}]},
  impeller:{file:'radial-impeller',radius:1.01},
  diffuser:{file:'radial-diffuser',radius:1.04,supplements:[{file:'diffuser-service-hardware'}]},
  afterburner:{file:'afterburner-assembly',radius:.91,supplements:[{file:'afterburner-gutter-details'}]},
};

type RadialDeformation={hinge:number;exit:number;tipDelta:number};
function CadAsset({file,scale,position,rotation,showShell=true,selected=false,dimmed=false,deform}:{file:string;scale:[number,number,number];position?:[number,number,number];rotation?:[number,number,number];showShell?:boolean;selected?:boolean;dimmed?:boolean;deform?:RadialDeformation}){
  const {scene}=useGLTF(import.meta.env.BASE_URL+'assets/solidcraft/'+file+'.glb');
  // Shared cached geometry, unique per-instance materials for independent highlight.
  const instance=useMemo(()=>{
    const clone=scene.clone(true);
    clone.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      object.material=Array.isArray(object.material)?object.material.map(material=>material.clone()):object.material.clone();
      if(deform){
        object.geometry=object.geometry.clone();
        const attribute=object.geometry.getAttribute('position');
        // Every vertex remains on its original SolidCraft petal. The upstream
        // hinge is immobile; only the nozzle-facing free edge tracks the area.
        for(let index=0;index<attribute.count;index++){
          const x=attribute.getX(index),y=attribute.getY(index),z=attribute.getZ(index);
          const radial=Math.hypot(y,z);
          if(radial===0||x<=deform.hinge)continue;
          const progress=Math.min(1,Math.max(0,(x-deform.hinge)/(deform.exit-deform.hinge)));
          const weight=progress*progress*(3-2*progress);
          const factor=(radial+deform.tipDelta*weight)/radial;
          attribute.setXYZ(index,x,y*factor,z*factor);
        }
        attribute.needsUpdate=true;
        object.geometry.computeVertexNormals();
        object.geometry.computeBoundingSphere();
      }
    });
    return clone;
  },[scene,deform?.hinge,deform?.exit,deform?.tipDelta]);
  useEffect(()=>{
    instance.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      const isCasing=/ - (shell|heat_shell)(?:\.\d+)?$/i.test(object.name);
      object.visible=showShell||!isCasing;
      const materials=Array.isArray(object.material)?object.material:[object.material];
      for(const material of materials){
        if(!(material instanceof THREE.MeshStandardMaterial))continue;
        material.emissive.set(selected?'#286878':'#000000');
        material.emissiveIntensity=selected?.22:0;
        material.transparent=dimmed;
        material.opacity=dimmed?.035:1;
        material.depthWrite=!dimmed;
      }
    });
  },[instance,showShell,selected,dimmed]);
  useEffect(()=>()=>instance.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    if(deform)object.geometry.dispose();
    const materials=Array.isArray(object.material)?object.material:[object.material];
    materials.forEach(material=>material.dispose());
  }),[instance,Boolean(deform)]);
  return <primitive object={instance} scale={scale} position={position} rotation={rotation}/>;
}

export function SolidCraftDetail({kind,radius,shaft,showShell=true,selected=false,dimmed=false,nozzleOpen=.5,motionSpeed=1,result=null}:{kind:CadDetailKind;radius:number;shaft:Part['shaft'];showShell?:boolean;selected?:boolean;dimmed?:boolean;nozzleOpen?:number;motionSpeed?:number;result?:Result|null}){
  const config=MODELS[kind];
  const rotor=useRef<THREE.Group>(null);
  const reducedMotion=useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
  const spins=shaft!==null&&(kind==='fan'||kind==='compressor'||kind==='turbine'||kind==='impeller');
  useFrame((_,dt)=>{
    if(spins&&!reducedMotion&&rotor.current)
      rotor.current.rotation.x+=Math.min(dt,.04)*(shaft==='HP'?1.3:shaft==='LP'?.72:1)*motionSpeed;
  });
  const radial=radius/config.radius;
  const axial=config.axial&&config.targetAxial?config.targetAxial/config.axial:radial;
  const scale:[number,number,number]=[axial,radial,radial];
  const throat=result?meteredThroats(result):null;
  const coreActuation=kind==='nozzle'&&throat?{
    hinge:THROAT_CAD.corePetalHinge,exit:THROAT_CAD.corePetalExit,
    tipDelta:throat.core.radius/radial-THROAT_CAD.corePetalTip
  }:undefined;
  const bypassActuation=kind==='bypass'&&throat?.bypass?{
    hinge:THROAT_CAD.bypassPetalHinge,exit:THROAT_CAD.bypassPetalExit,
    tipDelta:throat.bypass.outerRadius-THROAT_CAD.bypassPetalTip
  }:undefined;
  const appearance={showShell,selected,dimmed};
  return <group name={'solidcraft-'+kind}>
    <group ref={rotor}>
      {spins&&<CadAsset file={config.file} scale={scale} rotation={config.rotation} {...appearance}/>}
    {config.supplements?.filter(part=>part.rotating&&(!part.shellOnly||showShell)).map(part=><CadAsset key={part.file} file={part.file} scale={scale} position={part.position} {...appearance}/>)}
    </group>
    {!spins&&<CadAsset file={config.file} scale={scale} rotation={config.rotation} {...appearance}/>}
    {config.supplements?.filter(part=>!part.rotating&&(!part.shellOnly||showShell)).map(part=><CadAsset key={part.file} file={part.file} scale={part.file==='nozzle-petals'&&!throat?[scale[0],scale[1]*(.97+nozzleOpen*.09),scale[2]*(.97+nozzleOpen*.09)]:scale} deform={part.file==='nozzle-petals'?coreActuation:undefined} position={part.position} {...appearance}/>)}
    {kind==='nozzle'&&throat&&<group name="solver-coupled-core-throat" userData={{geometricAreaM2:throat.core.area,effectiveAreaM2:throat.core.effective}}>
      <CadAsset file="core-throat-lip" scale={[1,throat.core.lipRadialScale,throat.core.lipRadialScale]} position={[THROAT_CAD.corePetalExit*axial,0,0]} {...appearance}/>
    </group>}
    {kind==='bypass'&&throat?.bypass&&<group name="solver-coupled-bypass-throat" userData={{geometricAreaM2:throat.bypass.area,effectiveAreaM2:throat.bypass.effective}}>
      <CadAsset file="bypass-inner-fairing" scale={[axial,1,1]} {...appearance}/>
      <CadAsset file="bypass-nozzle-petals" scale={[axial,1,1]} deform={bypassActuation} {...appearance}/>
      <CadAsset file="bypass-throat-lip" scale={[1,throat.bypass.lipRadialScale,throat.bypass.lipRadialScale]} position={[THROAT_CAD.bypassPetalExit*axial,0,0]} {...appearance}/>
    </group>}
  </group>;
}

/** Coaxial drive tubes and bearing collars are editable SolidCraft CAD parts. */
export function SolidCraftShaft({engine,selected=false,dimmed=false}:{engine:VisualEngineId;selected?:boolean;dimmed?:boolean}){
  const dual=engine==='turbofan'||engine==='geared-turbofan'||engine==='afterburning-turbofan';
  const position:[number,number,number]=dual?[-.1,0,0]:[0,0,0];
  return <group name="solidcraft-drive-shafts"><CadAsset file={dual?'shaft-dual-spool':'shaft-single-spool'} scale={[1,1,1]} position={position} selected={selected} dimmed={dimmed}/></group>;
}
