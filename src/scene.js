import * as THREE from './vendor/three.module.js';

const MAT = {
  casing: new THREE.MeshStandardMaterial({ color: 0xd3dfe0, metalness: 0.74, roughness: 0.29, side: THREE.DoubleSide, transparent: true, opacity: .19, depthWrite: false }),
  metal: new THREE.MeshStandardMaterial({ color: 0x859ca5, metalness: .82, roughness: .29, side: THREE.DoubleSide }),
  blade: new THREE.MeshStandardMaterial({ color: 0xb5c6c8, metalness: .76, roughness: .26, side: THREE.DoubleSide }),
  dark: new THREE.MeshStandardMaterial({ color: 0x4f6871, metalness: .80, roughness: .36, side: THREE.DoubleSide }),
  graphite: new THREE.MeshStandardMaterial({ color: 0x546d75, metalness: .74, roughness: .36, side: THREE.DoubleSide }),
  bronze: new THREE.MeshStandardMaterial({ color: 0xb9825c, metalness: .76, roughness: .30, side: THREE.DoubleSide }),
  turbine: new THREE.MeshStandardMaterial({ color: 0x9b8583, metalness: .86, roughness: .29, side: THREE.DoubleSide }),
  flame: new THREE.MeshStandardMaterial({ color: 0xf48b48, metalness: .10, roughness: .30, emissive: 0xe85b18, emissiveIntensity: .60 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xd4a277, metalness: .58, roughness: .32, side: THREE.DoubleSide }),
  black: new THREE.MeshStandardMaterial({ color: 0x344750, metalness: .66, roughness: .44 })
};
const CENTERS = [-3.85,-1.82,.40,2.22,4.08];
const STAGE_RADII = [1.29,1.29,1.12,.99,.84];
const TAU = 2 * Math.PI;
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const prefersReducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches;
function remember(mesh,index,group) { mesh.userData.stage=index; group.add(mesh); return mesh; }
function tube(group,index,x,length,left,right,material,thetaLength=TAU) {
  const geo = new THREE.CylinderGeometry(right,left,length,48,1,true,0,thetaLength);
  const mesh = new THREE.Mesh(geo,material);
  mesh.rotation.z=-Math.PI/2;
  mesh.position.x=x;
  remember(mesh,index,group);
  return mesh;
}
function disk(group,index,x,rad,thick,material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,thick,48),material);
  mesh.rotation.z=-Math.PI/2;
  mesh.position.x=x;
  return remember(mesh,index,group);
}
function ring(group,index,x,r,t,material) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(r,t,7,64),material);
  mesh.rotation.y=Math.PI/2;
  mesh.position.x=x;
  return remember(mesh,index,group);
}
function rotor(stageGroup,stage,x,radius,n,color,kind) {
  const spinning = kind === 'rotor';
  const root = new THREE.Group();
  root.position.x=x;
  stageGroup.add(root);
  disk(root,stage,0, .44, .09, spinning ? MAT.dark : MAT.graphite);
  ring(root,stage,0,radius,.034,spinning?MAT.metal:MAT.graphite);
  const base = new THREE.BoxGeometry(.15,.12,Math.max(.21,radius-.40));
  for(let i=0;i<n;i++) {
    const theta=i/n*TAU;
    const blade = new THREE.Mesh(base,color);
    const bladeMid = (.43+radius)/2;
    blade.position.set(0,Math.cos(theta)*bladeMid,Math.sin(theta)*bladeMid);
    blade.rotation.x=theta-Math.PI/2;
    blade.rotation.y=spinning ? -.36 : .36;
    remember(blade,stage,root);
  }
  return root;
}
function shellPair(group,index,length,rLeft,rRight) {
  const transparentMat = MAT.casing.clone();
  const opaqueMat = new THREE.MeshStandardMaterial({color:0x9aadb3,metalness:.78,roughness:.27,side:THREE.DoubleSide,transparent:true,opacity:.83,depthWrite:true});
  const cut=tube(group,index,0,length,rLeft,rRight,transparentMat,Math.PI*1.22);
  cut.rotation.x=.10;
  const solid=tube(group,index,0,length,rLeft,rRight,opaqueMat);
  solid.visible=false;
  ring(group,index,-length/2+.05,rLeft,.045,MAT.metal);
  ring(group,index,length/2-.05,rRight,.045,MAT.metal);
  return {cut,solid};
}
export function createEngineScene(canvas,{onSelect=()=>{}}={}) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setClearColor(0xffffff,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.5;
  const camera = new THREE.PerspectiveCamera(36,1,.08,100);
  const hemisphere = new THREE.HemisphereLight(0xeaf6ff,0x677a79,2.2);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xffffff,3.5);
  key.position.set(-2,8,11); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbadff3,1.7);
  fill.position.set(-8,-3,-7); scene.add(fill);
  const warm = new THREE.PointLight(0xff8f50,40,7,1.8);
  warm.position.set(1.1,0,0); scene.add(warm);
  const stageGroups=CENTERS.map((x)=> {const g=new THREE.Group();g.position.x=x;scene.add(g);return g;});
  const shells=[];
  // Intake: subsonic capture duct, guide rings, and a visible central spinner.
  {
    const g=stageGroups[0];
    shells.push(shellPair(g,0,1.95,1.48,1.22));
    ring(g,0,-.86,1.45,.04,MAT.copper);
    for(const x of [-.65,-.42,-.18,.2,.53]) ring(g,0,x,1.25,.014,MAT.metal);
    const spinner=new THREE.Mesh(new THREE.ConeGeometry(.53,1.14,40),MAT.metal);
    spinner.rotation.z=Math.PI/2; spinner.position.x=-.27;remember(spinner,0,g);
    for(let i=0;i<8;i++) {
      const angle=i/8*TAU;
      const vane=new THREE.Mesh(new THREE.BoxGeometry(.16,.075,.67),MAT.dark);
      vane.position.set(.64,Math.cos(angle)*.80,Math.sin(angle)*.80);
      vane.rotation.x=angle-Math.PI/2;
      remember(vane,0,g);
    }
  }
  const compressorRotors=[];
  {
    const g=stageGroups[1];
    shells.push(shellPair(g,1,2.5,1.27,1.05));
    tube(g,1,0,2.44,.47,.44,MAT.graphite);
    for(let n=0;n<6;n++) {
      const x=-1.01+n*.39;
      const radius=1.17-n*.030;
      compressorRotors.push(rotor(g,1,x,radius,19,MAT.blade,'rotor'));
      if(n<5) rotor(g,1,x+.19,radius-.025,18,MAT.dark,'stator');
    }
  }
  const flames=[];
  {
    const g=stageGroups[2];
    shells.push(shellPair(g,2,1.83,1.10,1.08));
    tube(g,2,0,1.65,.43,.43,MAT.graphite);
    for(let n=0;n<10;n++) {
      const angle=n/10*TAU;
      const can = new THREE.Mesh(new THREE.CylinderGeometry(.17,.19,1.17,12,1,true),MAT.copper);
      can.rotation.z=-Math.PI/2;
      can.position.set(.05,Math.cos(angle)*.74,Math.sin(angle)*.74);
      remember(can,2,g);
      const burner = new THREE.Mesh(new THREE.CylinderGeometry(.11,.10,.60,12,1,true),MAT.flame.clone());
      burner.rotation.z=-Math.PI/2;
      burner.position.set(.22,Math.cos(angle)*.74,Math.sin(angle)*.74);
      flames.push(remember(burner,2,g));
    }
    ring(g,2,-.6,.82,.055,MAT.copper); ring(g,2,.7,.89,.055,MAT.copper);
  }
  const turbineRotors=[];
  {
    const g=stageGroups[3];
    shells.push(shellPair(g,3,1.78,1.05,.86));
    tube(g,3,0,1.65,.44,.44,MAT.graphite);
    for(let n=0;n<3;n++) {
      const x=-.54+n*.47;
      turbineRotors.push(rotor(g,3,x,.99-n*.055,20,MAT.turbine,'rotor'));
      if(n<2) rotor(g,3,x+.22,.955-n*.055,18,MAT.bronze,'stator');
    }
    ring(g,3,.73,.81,.08,MAT.copper);
  }
  {
    const g=stageGroups[4];
    shells.push(shellPair(g,4,1.88,.86,.56));
    tube(g,4,.12,1.64,.68,.44,new THREE.MeshStandardMaterial({color:0x6c7883,metalness:.79,roughness:.33,side:THREE.DoubleSide,transparent:true,opacity:.44,depthWrite:false}));
    ring(g,4,-.78,.83,.07,MAT.metal);
    ring(g,4,.78,.59,.07,MAT.copper);
    ring(g,4,.91,.53,.026,MAT.flame);
  }
  // A continuous spool connects turbine rotor work to compressor rotors.
  const spool=new THREE.Group();
  tube(spool,2,0,7.6,.20,.20,MAT.dark);
  disk(spool,2,-3.2,.28,.08,MAT.metal);
  disk(spool,2,3.2,.28,.08,MAT.metal);
  scene.add(spool);
  // Single shared flow animation: stations and particles are controlled by cycle state.
  const particleCount=165;
  const coords=new Float32Array(particleCount*3);
  const colors=new Float32Array(particleCount*3);
  const seeds=Array.from({length:particleCount},(_,i)=>({
    x:((i*0.61803398875)%1)*10-5,phase:(i*0.75487766)%1*TAU,
    radius:.25+Math.sqrt(((i*0.41421356237)%1))*.62,
    jitter: (i*0.1618)%1
  }));
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(coords,3));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const pointMaterial=new THREE.PointsMaterial({size:.051,vertexColors:true,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending});
  const particles=new THREE.Points(geometry,pointMaterial);
  scene.add(particles);
  const accentRing=new THREE.Mesh(new THREE.TorusGeometry(1.36,.017,6,75),new THREE.MeshBasicMaterial({color:0xcf6e49,transparent:true,opacity:.8,depthTest:false}));
  accentRing.rotation.y=Math.PI/2;
  scene.add(accentRing);
  const state={selected:0,cutaway:true,explode:false,tour:false,angle:.35,elevation:.23,distance:14.2,targetX:0,dragging:false,cycle:null,quality:'high'};
  const pointer={downX:0,downY:0,lastX:0,lastY:0,moved:false};
  let lastTime=0,raf=0,lastInteraction=performance.now(),tourStep=-1;
  const raycaster=new THREE.Raycaster(),rayMouse=new THREE.Vector2(),tmpWorld=new THREE.Vector3();
  const annotations=Array.from(document.querySelectorAll('.annotation'));
  const axisKey=document.querySelector('.axis-key');
  const axisLeft=axisKey?.querySelector('span:first-child');
  const axisRight=axisKey?.querySelector('span:last-child');
  let axisReversed=null;
  const updateSelected=()=>{
    accentRing.position.x=CENTERS[state.selected]+(state.explode?(state.selected-2)*.62:0);
    accentRing.scale.setScalar(STAGE_RADII[state.selected]/1.36);
    annotations.forEach((x,i)=>x.classList.toggle('active',i===state.selected));
  };
  function select(index,internal=false) {
    state.selected=clamp(index,0,4);
    state.targetX=CENTERS[state.selected]*.13;
    tourStep=state.selected;
    updateSelected();
    if(!internal) {
      state.tour=false;
      lastInteraction=performance.now();
    }
    onSelect(state.selected,internal);
  }
  function setCutaway(v) {
    state.cutaway=Boolean(v);
    shells.forEach(({cut,solid})=>{cut.visible=state.cutaway;solid.visible=!state.cutaway;});
  }
  function setExplode(v) {state.explode=Boolean(v); updateSelected();}
  function setTour(v) {
    state.tour=Boolean(v);
    lastInteraction=performance.now();
    tourStep=-1;
    if(state.tour) select(0,true);
  }
  function touch() {lastInteraction=performance.now();if(state.tour){state.tour=false;onSelect(state.selected,false);}}
  function pointerDown(e) {
    canvas.setPointerCapture?.(e.pointerId);
    pointer.downX=e.clientX;pointer.downY=e.clientY;
    pointer.lastX=e.clientX;pointer.lastY=e.clientY;pointer.moved=false;
    state.dragging=true;touch();
  }
  function pointerMove(e) {
    if(!state.dragging) return;
    const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
    if(Math.abs(e.clientX-pointer.downX)>4 || Math.abs(e.clientY-pointer.downY)>4) pointer.moved=true;
    state.angle+=dx*.006;state.elevation=clamp(state.elevation-dy*.005,-.15,1.03);
    pointer.lastX=e.clientX;pointer.lastY=e.clientY;touch();
  }
  function pointerUp(e) {
    if(!state.dragging) return;
    state.dragging=false;
    if(!pointer.moved) {
      const rect=canvas.getBoundingClientRect();
      rayMouse.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);
      raycaster.setFromCamera(rayMouse,camera);
      const hits=raycaster.intersectObjects(stageGroups,true);
      const hit=hits.find(h=>Number.isInteger(h.object.userData.stage));
      if(hit) select(hit.object.userData.stage);
    }
  }
  const wheel=(e)=>{e.preventDefault();state.distance=clamp(state.distance+e.deltaY*.014,7.7,24);touch();};
  canvas.addEventListener('pointerdown',pointerDown);
  canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',()=>{state.dragging=false;});
  canvas.addEventListener('wheel',wheel,{passive:false});
  canvas.addEventListener('dblclick',()=>{state.angle=.35;state.elevation=.23;state.distance=14.2;touch();});
  let width=0,height=0;
  function resize() {
    const rect=canvas.getBoundingClientRect();
    width=Math.max(2,Math.floor(rect.width));height=Math.max(2,Math.floor(rect.height));
    renderer.setSize(width,height,false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
    camera.aspect=width/height;
    camera.fov=camera.aspect<.9 ? 49 : camera.aspect<1.25 ? 42 : 36;
    camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('resize',resize);
  resize();
  function animate(time) {
    raf=requestAnimationFrame(animate);
    if(document.hidden) {lastTime=time;return;}
    const dt=Math.min(.055,Math.max(0,(time-lastTime)*.001||.016));lastTime=time;
    const quiet=(time-lastInteraction)>25000;
    if(quiet && !state.tour && !prefersReducedMotion) {state.tour=true;tourStep=-1;}
    if(state.tour && !prefersReducedMotion) {
      const step=Math.floor((time-lastInteraction)/4000)%5;
      if(step!==tourStep) select(step,true);
      state.angle+=dt*.085;
    }
    const targetDist=width/height<.9?19.5:width/height<1.25?16.7:14.2;
    const radius=Math.max(state.distance,targetDist);
    const target=new THREE.Vector3(state.targetX,0,0);
    camera.position.set(target.x+Math.sin(state.angle)*Math.cos(state.elevation)*radius,Math.sin(state.elevation)*radius,Math.cos(state.angle)*Math.cos(state.elevation)*radius);
    camera.lookAt(target);
    const intakeX=new THREE.Vector3(-5,0,0).project(camera).x;
    const exhaustX=new THREE.Vector3(5,0,0).project(camera).x;
    const flipped=intakeX>exhaustX;
    if(flipped!==axisReversed && axisLeft && axisRight){
      axisReversed=flipped;
      axisLeft.textContent=flipped?'← EXHAUST OUT':'← AIR IN';
      axisRight.textContent=flipped?'AIR IN →':'EXHAUST OUT →';
      axisKey.classList.toggle('reverse',flipped);
    }
    const motion=prefersReducedMotion?0:dt;
    compressorRotors.forEach((g,i)=>g.rotation.x+=motion*2.9*(1-i*.045));
    turbineRotors.forEach(g=>g.rotation.x+=motion*2.9);
    spool.rotation.x+=motion*2.9;
    flames.forEach((m,i)=>m.material.emissiveIntensity=.44+Math.sin(time*.003+i*1.1)*.12);
    warm.intensity=30+8*Math.sin(time*.003);
    for(let i=0;i<stageGroups.length;i++) {
      const offset=state.explode?(i-2)*.62:0;
      stageGroups[i].position.x+=(CENTERS[i]+offset-stageGroups[i].position.x)*Math.min(1,dt*8);
    }
    spool.visible=!state.explode;
    accentRing.position.x=CENTERS[state.selected]+(stageGroups[state.selected].position.x-CENTERS[state.selected]);
    const speed=(state.cycle?.exhaustVelocity||600)/760;
    for(let i=0;i<particleCount;i++) {
      const seed=seeds[i];
      const x=-5+((seed.x+5+(time*.00032)*(1+speed*.8)+i*.009)%10);
      const env=x < -1 ? 1.05 : x < 1.2 ? .88 : x < 3.1 ? .77 : .66;
      const y=Math.cos(seed.phase+time*.00036)*seed.radius*env;
      const z=Math.sin(seed.phase+time*.00036)*seed.radius*env;
      coords[i*3]=x;coords[i*3+1]=y;coords[i*3+2]=z;
      const c=new THREE.Color(x < -.65 ? 0x75b9d8 : x < 1.3 ? 0xffac58 : x < 3.0 ? 0xfba46c : 0xe1a9a1);
      colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
    }
    geometry.attributes.position.needsUpdate=true;
    geometry.attributes.color.needsUpdate=true;
    if(annotations.length && width) {
      annotations.forEach((el,i)=>{
        tmpWorld.set(stageGroups[i].position.x,STAGE_RADII[i]+.50+(i%2)*.23,0).project(camera);
        el.style.left=((tmpWorld.x+1)*50).toFixed(2)+'%';
        el.style.top=((1-tmpWorld.y)*50).toFixed(2)+'%';
        el.style.display=tmpWorld.z>1?'none':'';
      });
    }
    renderer.render(scene,camera);
  }
  updateSelected();
  raf=requestAnimationFrame(animate);
  return {
    select,setCutaway,setExplode,setTour,
    setCycle(v){state.cycle=v;},
    reset(){state.angle=.35;state.elevation=.23;state.distance=14.2;setTour(false);setExplode(false);setCutaway(true);select(0);},
    state,
    dispose(){cancelAnimationFrame(raf);observer.disconnect();renderer.dispose();}
  };
}
