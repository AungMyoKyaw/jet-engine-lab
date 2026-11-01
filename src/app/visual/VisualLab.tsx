import {lazy,Suspense,useEffect,useState} from 'react';
import {ArrowRight,BookOpen,Box,ChevronLeft,ChevronRight,Download,Flame,Focus,Layers,Lightbulb,Menu,Moon,RotateCcw,Settings2,SlidersHorizontal,Sun,Wind,X,Activity} from 'lucide-react';
import type {ViewPreset} from '../engine/EngineViewport';
import {PARTS} from '../data/parts';
import {type Input,type Result} from '../physics/cycle';
import {ENGINE_CATALOG,findEngine,isCycleEngine,type VisualEngineId} from '../data/catalog';
import type {OverlayMode} from '../engine/SpecialGeometry';
import './visual.css';

const EngineViewport=lazy(async()=>({default:(await import('../engine/EngineViewport')).EngineViewport}));
type Mode='explore'|'understand'|'experiment';
type Phase={name:string;caption:string;detail:string;part:string;icon:'intake'|'compress'|'burn'|'turbine'|'exhaust';color:string};
const PHASES:Record<VisualEngineId,Phase[]>={
 turbojet:[
 {name:'Intake',caption:'Air enters the engine.',detail:'The inlet guides air toward the compressor.',part:'inlet',icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'Blades squeeze the air.',detail:'Compressor rows increase total pressure before combustion.',part:'compressor',icon:'compress',color:'#91c5f3'},
 {name:'Combustion',caption:'Fuel adds energy to the flow.',detail:'Hot gas gains energy in the combustor.',part:'burner',icon:'burn',color:'#f6a477'},
 {name:'Turbine',caption:'Hot gas turns the shaft.',detail:'A turbine extracts work to drive the compressor.',part:'turbine',icon:'turbine',color:'#f3c878'},
 {name:'Exhaust',caption:'Gas accelerates rearward.',detail:'Momentum and pressure forces produce forward thrust.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}],
 turbofan:[
 {name:'Intake',caption:'Air enters the large inlet.',detail:'The inlet supplies both the core and bypass stream.',part:'inlet',icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'The fan and compressors pressurize air.',detail:'Most air bypasses the hot core; compressor stages raise core pressure.',part:'hpc',icon:'compress',color:'#91c5f3'},
 {name:'Combustion',caption:'Fuel heats the core air.',detail:'Combustion adds energy before the turbine stages.',part:'burner',icon:'burn',color:'#f6a477'},
 {name:'Turbines',caption:'Hot gas powers two shafts.',detail:'High and low pressure turbines drive the compressors and fan.',part:'hpt',icon:'turbine',color:'#f3c878'},
 {name:'Exhaust',caption:'Two streams produce thrust.',detail:'Core and bypass gases exit through separate nozzles.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}],
 'afterburning-turbofan':[
 {name:'Intake',caption:'Air rushes into the low-bypass fan.',detail:'A compact fan feeds the core and the small bypass duct.',part:'fan',icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'Compressors raise the pressure.',detail:'The low and high pressure compressors prepare air for combustion.',part:'hpc',icon:'compress',color:'#91c5f3'},
 {name:'Core fire',caption:'Fuel heats the compressed flow.',detail:'Core combustion powers the turbine stages ahead of the afterburner.',part:'burner',icon:'burn',color:'#f6a477'},
 {name:'Afterburner',caption:'A second flame lights the exhaust.',detail:'Fuel is added downstream of the turbine. This is a visual demonstration, not calculated performance.',part:'afterburner',icon:'burn',color:'#ff894f'},
 {name:'Variable nozzle',caption:'Petals move to change the outlet.',detail:'A movable nozzle illustrates exhaust-area control. The engine is not numerically calibrated.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}],
 'centrifugal-turbojet':[
 {name:'Intake',caption:'Air enters the compressor eye.',detail:'The intake delivers air to a compact centrifugal impeller.',part:'inlet',icon:'intake',color:'#79d8f5'},
 {name:'Impeller',caption:'Blades throw air outward.',detail:'Unlike an axial compressor, this impeller turns axial flow into radial flow.',part:'impeller',icon:'compress',color:'#91c5f3'},
 {name:'Diffuser',caption:'The outward flow slows down.',detail:'Stationary diffuser passages recover static pressure after the impeller.',part:'diffuser',icon:'compress',color:'#a4d7ca'},
 {name:'Combustion',caption:'Fuel adds heat.',detail:'The combustor sits behind the radial compressor assembly.',part:'burner',icon:'burn',color:'#f6a477'},
 {name:'Exhaust',caption:'One turbine. One nozzle.',detail:'The turbine drives the compressor; the nozzle accelerates the hot gas.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}],
 'geared-turbofan':[
 {name:'Big fan',caption:'A larger fan moves more air.',detail:'The large fan illustrates the high-bypass architecture.',part:'fan',icon:'intake',color:'#79d8f5'},
 {name:'Gearbox',caption:'Small gears change rotation speed.',detail:'The sun and planet gears illustrate a reduction stage between fan and LP shaft.',part:'gearbox',icon:'compress',color:'#e2ca93'},
 {name:'Compression',caption:'The core is compressed.',detail:'LP and HP compressors raise air pressure before fuel is added.',part:'hpc',icon:'compress',color:'#91c5f3'},
 {name:'Hot core',caption:'Combustion powers the turbines.',detail:'The turbines recover work to drive the compressors and geared fan.',part:'burner',icon:'burn',color:'#f6a477'},
 {name:'Exhaust',caption:'The two streams leave separately.',detail:'The bypass and core streams contribute to thrust. The values remain uncalibrated for this visual study.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}]
};
const StageIcons={intake:Wind,compress:Layers,burn:Flame,turbine:Settings2,exhaust:ArrowRight};
type Props={engine:VisualEngineId;input:Input;result:Result|null;error:string;pending:boolean;theme:string;onTheme:()=>void;onEngine:(id:VisualEngineId)=>void;onInput:(key:keyof Input,value:number)=>void;onOpen:()=>void;onSave:()=>void;onRoute:(url:string)=>void};
export function VisualLab(p:Props){
 const[mode,setMode]=useState<Mode>('explore'),[active,setActive]=useState(0),[selected,setSelected]=useState('');
 const[focusPart,setFocusPart]=useState<string|null>(null),[shell,setShell]=useState(false),[explode,setExplode]=useState(0),[camera,setCamera]=useState<ViewPreset>('threequarter'),[viewReset,setViewReset]=useState(0);
 const[gallery,setGallery]=useState(false),[overlay,setOverlay]=useState<OverlayMode>('none'),[afterburnerOn,setAfterburnerOn]=useState(p.engine==='afterburning-turbofan'),[nozzleOpen,setNozzleOpen]=useState(.5),[tools,setTools]=useState(false),[showInfo,setShowInfo]=useState(false),[flow,setFlow]=useState(true),[about,setAbout]=useState(false),[advanced,setAdvanced]=useState(false);
 const phases=PHASES[p.engine],phase=phases[active];
 const part=PARTS[p.engine].find(x=>x.id===selected)||PARTS[p.engine].find(x=>x.id===phase.part)||PARTS[p.engine][0];
 const fmt=(n:number|undefined,d=1)=>n===undefined||!Number.isFinite(n)?'—':n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
 const choose=(index:number)=>{const i=Math.max(0,Math.min(4,index));setActive(i);setSelected(phases[i].part);setFocusPart(phases[i].part);setShowInfo(true)};
 const pick=(id:string)=>{setSelected(id);setFocusPart(id);const part=PARTS[p.engine].find(x=>x.id===id);if(!part)return;setActive(part.kind==='inlet'?0:part.kind==='fan'||part.kind==='compressor'?1:part.kind==='burner'?2:part.kind==='turbine'?3:4);setShowInfo(true)};
 const switchEngine=(id:VisualEngineId)=>{p.onEngine(id);setGallery(false);setOverlay('none');setAfterburnerOn(id==='afterburning-turbofan');setNozzleOpen(.5);setActive(0);setSelected('');setFocusPart(null);setExplode(0);setShell(false);setShowInfo(false)};
 const reset=()=>{setFocusPart(null);setCamera('threequarter');setViewReset(x=>x+1);setExplode(0);setShell(false)};
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;if(e.key==='Escape'){setGallery(false);setTools(false);setAbout(false);setShowInfo(false)}if(mode==='understand'&&e.key==='ArrowRight'){e.preventDefault();choose(active+1)}if(mode==='understand'&&e.key==='ArrowLeft'){e.preventDefault();choose(active-1)}};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[mode,active,p.engine]);
 const sliders:[Exclude<keyof Input,'engine'>,string,string,number,number,number,number][]=[
  ['throttle','Power','%',0,1,.01,100],['altitude','Altitude','m',0,12000,100,1],['mach','Airspeed','Mach',0,.85,.01,1],['coreArea','Core nozzle','m²',.06,.9,.01,1],
  ...(p.engine==='turbofan'?[['bypassArea','Bypass nozzle','m²',.25,5,.05,1] as [Exclude<keyof Input,'engine'>,string,string,number,number,number,number]]:[])
 ];
 return <main className={'visual-lab'+(mode==='experiment'?' experiment-active':'')} aria-label="Jet Engine Lab visual experience">
  <div className="visual-engine-scene" aria-label="Interactive 3D engine">
   <Suspense fallback={<div className="visual-loading">Preparing the engine…</div>}><EngineViewport engine={p.engine} selected={selected||phase.part} onSelect={pick} explode={explode} showShell={shell||overlay==='ghost'} result={isCycleEngine(p.engine)?p.result:null} preset={camera} viewReset={viewReset} theme={p.theme} focusPart={focusPart} afterburnerOn={afterburnerOn} nozzleOpen={nozzleOpen} overlay={overlay} flowEnabled={flow}/></Suspense>
  </div>
  <div className="visual-scene-shade" aria-hidden="true"/>
  <header className="visual-header">
   <button className="visual-logo" aria-label="Return to Explore" onClick={()=>{setMode('explore');reset()}}><span><Box size={20}/></span><b>JET ENGINE <em>LAB</em></b><small>SEE HOW IT WORKS</small></button>
   <button className="visual-gallery-trigger" aria-haspopup="dialog" aria-expanded={gallery} onClick={()=>setGallery(true)}><span className="visual-gallery-trigger-kicker">EXPLORE THE COLLECTION</span><strong>{findEngine(p.engine).name}</strong><span className="visual-gallery-trigger-count">05 ENGINES <ChevronRight size={15}/></span></button>
   <div className="visual-actions"><button title="Toggle theme" aria-label="Toggle theme" onClick={p.onTheme}>{p.theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><button title="Options" aria-label="Options" aria-expanded={tools} onClick={()=>setTools(t=>!t)}><Menu size={20}/></button></div>
  </header>
  {tools&&<div className="visual-options" role="menu" aria-label="Options"><button role="menuitem" onClick={()=>{p.onSave();setTools(false)}}><Download size={15}/> Save experiment</button><button role="menuitem" onClick={()=>{p.onOpen();setTools(false)}}><BookOpen size={15}/> Open project</button><button role="menuitem" onClick={()=>{setShell(x=>!x);setTools(false)}}><Layers size={15}/> {shell?'Hide casing':'Show casing'}</button><button role="menuitem" onClick={()=>{setFlow(x=>!x);setTools(false)}}><Wind size={15}/> {flow?'Hide':'Show'} flow illustration</button><button role="menuitem" onClick={()=>{setOverlay('heat');setTools(false)}}><Flame size={15}/> Show heat zones</button><button role="menuitem" onClick={()=>{setOverlay('power');setTools(false)}}><Settings2 size={15}/> Show power path</button><button role="menuitem" onClick={()=>{setOverlay('ghost');setTools(false)}}><Layers size={15}/> Ghost casing</button><button role="menuitem" onClick={()=>{setOverlay('none');setTools(false)}}><X size={15}/> Clear overlays</button><button role="menuitem" onClick={()=>{setCamera(c=>c==='side'?'threequarter':'side');setTools(false)}}><Focus size={15}/> Change camera angle</button><button role="menuitem" onClick={()=>{reset();setTools(false)}}><RotateCcw size={15}/> Reset view</button><button role="menuitem" onClick={()=>{setAbout(true);setTools(false)}}><Box size={15}/> About the physics</button><button role="menuitem" onClick={()=>p.onRoute('/reference')}><BookOpen size={15}/> Technical reference</button></div>}
  <div className="visual-coordinate"><span className="visual-pulse"/> INTERACTIVE 3D <i/> {findEngine(p.engine).label}</div>{focusPart&&<button className="visual-back-engine" onClick={()=>setFocusPart(null)}><ChevronLeft size={15}/> Show full engine</button>}
  <div className="visual-side-controls" aria-label="Scene controls"><button aria-label="Toggle engine casing" aria-pressed={shell} title="Toggle casing" onClick={()=>setShell(x=>!x)}><Layers size={19}/></button><button aria-label="Toggle exploded view" aria-pressed={explode>0} title="Exploded view" onClick={()=>setExplode(x=>x===0?1:0)}><Focus size={19}/></button><button aria-label="Reset 3D view" title="Reset view" onClick={reset}><RotateCcw size={19}/></button></div>
  {flow&&<div className="visual-flow" aria-label="Illustrative airflow, not measured fluid velocity"><span><Wind size={17}/> AIR IN</span><div className="visual-flow-line"><i/></div><span>EXHAUST <ArrowRight size={17}/></span><small>ILLUSTRATIVE</small></div>}
  <section className="visual-narrative">
   <div className="visual-narrative-index"><b>0{active+1}<span> / 05</span></b><small>{mode==='understand'?'FOLLOW THE AIR':mode==='experiment'?'CHANGE THE CONDITIONS':'PICK A STAGE'}</small></div>
   <h1>{mode==='explore'?'An engine to explore.':phase.name+'.'}</h1>
   <p>{mode==='experiment'?'Move a control. See the response.':phase.caption}</p>
   {(showInfo||mode==='understand')&&<div className="visual-part-note" style={{'--phase-color':phase.color} as React.CSSProperties}><div><strong>{part.name}</strong><p>{part.role}</p></div><button onClick={()=>setShowInfo(false)} aria-label="Close component note"><X size={14}/></button></div>}
   {mode==='understand'&&<div className="visual-lesson-steps"><button aria-label="Previous stage" disabled={active===0} onClick={()=>choose(active-1)}><ChevronLeft size={18}/></button><span>FOLLOW THE AIR</span><button aria-label="Next stage" disabled={active===4} onClick={()=>choose(active+1)}><ChevronRight size={18}/></button></div>}
  </section>
  <aside className="visual-readout" aria-label="Provisional simulation data"><span>{isCycleEngine(p.engine)?'NET THRUST':'3D ARCHITECTURE'} <small>{isCycleEngine(p.engine)?'PREVIEW':'VISUAL STUDY'}</small></span><strong>{isCycleEngine(p.engine)&&p.result&&!p.error?fmt(p.result.thrust/1000,1):'—'} <em>{isCycleEngine(p.engine)?'kN':'NOT MODELED'}</em></strong><div><span>{isCycleEngine(p.engine)?'FUEL FLOW':'PHYSICS STATUS'}</span><b>{isCycleEngine(p.engine)&&p.result&&!p.error?fmt(p.result.fuelFlow,2)+' kg/s':'Illustrative only'}</b></div><small className={p.error?'invalid':''}>{p.error?'INVALID INPUT':p.pending?'UPDATING':isCycleEngine(p.engine)?'EDUCATIONAL ESTIMATE':'NO CALIBRATED SOLVER'}</small></aside>
  {mode==='experiment'&&<aside className={'visual-experiment'+(advanced?' expanded':'')} aria-label="Experiment controls"><div className="visual-panel-head"><b><SlidersHorizontal size={17}/> EXPERIMENT</b><button aria-label="Close experiment" onClick={()=>setMode('explore')}><X size={17}/></button></div><p>Change the conditions. The scene stays interactive.</p>{isCycleEngine(p.engine)?sliders.map(([key,name,unit,min,max,step,mult])=><label className="visual-slider" key={key}><span><b>{name}</b><output>{fmt(p.input[key]*mult,mult===100?0:step<1?2:0)} <small>{unit}</small></output></span><input type="range" aria-label={name} min={min*mult} max={max*mult} step={step*mult} value={p.input[key]*mult} onChange={e=>p.onInput(key,Number(e.target.value)/mult)}/></label>):<div className="visual-study-controls"><span className="visual-study-label">VISUAL DEMONSTRATION · NO PHYSICAL OUTPUTS</span>{p.engine==='afterburning-turbofan'?<><button className={'visual-study-toggle'+(afterburnerOn?' active':'')} aria-pressed={afterburnerOn} onClick={()=>{setAfterburnerOn(v=>!v);setSelected('afterburner');setActive(3)}}><Flame size={18}/>{afterburnerOn?'AFTERBURNER ON':'LIGHT AFTERBURNER'}</button><label className="visual-slider"><span><b>Nozzle petals</b><output>{Math.round(nozzleOpen*100)}%</output></span><input aria-label="Nozzle opening illustration" type="range" min="0" max="100" value={Math.round(nozzleOpen*100)} onChange={e=>setNozzleOpen(Number(e.target.value)/100)}/></label></>:p.engine==='geared-turbofan'?<button className="visual-study-toggle" onClick={()=>{setOverlay('power');setFocusPart(null);setSelected('gearbox');setActive(1)}}><Settings2 size={18}/> REVEAL GEAR POWER PATH</button>:<button className="visual-study-toggle" onClick={()=>{setSelected('impeller');setActive(1);setOverlay('power')}}><Wind size={18}/> EXPLORE RADIAL ROTATION</button>}</div>}<button className="visual-advanced-button" aria-expanded={advanced} onClick={()=>setAdvanced(v=>!v)}>{advanced?'Show power only':'More controls'} <ChevronRight size={15}/></button>{p.error&&<p className="visual-invalid" role="alert">{p.error}</p>}<div className="visual-caveat"><Activity size={15}/> {isCycleEngine(p.engine)?'Physical RPM and fully coupled nozzle matching are not validated.':'This is a visual-only engine architecture. No calibrated performance outputs exist.'}</div></aside>}
  <div className="visual-bottom">
   <nav className="visual-stages" aria-label="Engine stages">{phases.map((s,i)=>{const Icon=StageIcons[s.icon];return <button key={s.part} aria-current={active===i?'step':undefined} className={active===i?'active':''} style={{'--phase-color':s.color} as React.CSSProperties} onClick={()=>choose(i)}><span className="visual-stage-pictogram"><Icon size={22} strokeWidth={1.65}/></span><span className="visual-stage-text"><small>0{i+1}</small><b>{s.name}</b></span></button>})}</nav>
   <div className="visual-modes" role="group" aria-label="Experience mode"><button aria-pressed={mode==='explore'} className={mode==='explore'?'active':''} onClick={()=>{setMode('explore');setShowInfo(false);setFocusPart(null)}}><Focus size={17}/> Explore</button><button aria-pressed={mode==='understand'} className={mode==='understand'?'active':''} onClick={()=>{setMode('understand');setShowInfo(true);setFocusPart(phases[active].part)}}><Lightbulb size={17}/> Understand</button><button aria-pressed={mode==='experiment'} className={mode==='experiment'?'active':''} onClick={()=>setMode('experiment')}><SlidersHorizontal size={17}/> Experiment</button></div>
  </div>

  {gallery&&<div className="visual-gallery-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setGallery(false)}}><section className="visual-gallery" role="dialog" aria-modal="true" aria-label="Explore five jet engines">
    <div className="visual-gallery-heading"><div><span className="visual-gallery-eyebrow">THE ENGINE COLLECTION / 05 MODELS</span><h2>Five engines. Five big ideas.</h2><p>Choose one. Rotate it. See what makes it different.</p></div><button className="visual-gallery-close" aria-label="Close engine gallery" onClick={()=>setGallery(false)}><X size={20}/></button></div>
    <div className="visual-gallery-grid">{ENGINE_CATALOG.map((entry,i)=><button className={'visual-gallery-card'+(entry.id===p.engine?' selected':'')} key={entry.id} onClick={()=>switchEngine(entry.id)} aria-label={'Explore '+entry.name}>
      <div className="visual-gallery-art"><img loading={i<2?'eager':'lazy'} src={import.meta.env.BASE_URL+'assets/engine-previews/'+entry.preview+'.png'} alt={'3D rendered '+entry.name+' study'} /><span className="visual-gallery-index">0{i+1} / 05</span></div>
      <div className="visual-gallery-card-copy"><span>{entry.label}</span><strong>{entry.name}</strong><small>{entry.idea}</small><em>{entry.simulation==='visual-only'?'3D visual study':'Preview cycle'} <ArrowRight size={13}/></em></div>
    </button>)}</div>
    <p className="visual-gallery-footnote">Original schematic 3D models · Illustrative animation · Physical performance shown only where a preliminary solver exists</p>
  </section></div>}

  {about&&<div className="visual-modal-cover" onMouseDown={e=>{if(e.target===e.currentTarget)setAbout(false)}}><section className="visual-modal" role="dialog" aria-label="Engineering preview explanation" aria-modal="true"><button aria-label="Close dialog" onClick={()=>setAbout(false)}><X size={18}/></button><Box size={32}/><h2>See the engine. Understand the idea.</h2><p>This is an educational engineering preview. Rotor motion, flow strokes and model geometry are illustrative. Cycle values are preliminary. Calibrated physical N1/N2 and coupled nozzle matching remain unfinished.</p><button onClick={()=>{setAbout(false);p.onRoute('/reference')}}>Open technical reference <ArrowRight size={17}/></button></section></div>}
  <span className="visual-disclaimer">DRAG TO ORBIT · SCROLL TO ZOOM · EDUCATIONAL ENGINEERING PREVIEW</span>
 </main>;
}
