import {lazy,Suspense,useEffect,useState} from 'react';
import {ArrowRight,BookOpen,Box,ChevronLeft,ChevronRight,Download,Flame,Focus,Layers,Lightbulb,Menu,Moon,RotateCcw,Settings2,SlidersHorizontal,Sun,Wind,X,Activity} from 'lucide-react';
import type {ViewPreset} from '../engine/EngineViewport';
import {PARTS} from '../data/parts';
import {type EngineId,type Input,type Result} from '../physics/cycle';
import './visual.css';

const EngineViewport=lazy(async()=>({default:(await import('../engine/EngineViewport')).EngineViewport}));
type Mode='explore'|'understand'|'experiment';
type Phase={name:string;caption:string;detail:string;part:string;icon:'intake'|'compress'|'burn'|'turbine'|'exhaust';color:string};
const PHASES:Record<EngineId,Phase[]>={
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
 {name:'Exhaust',caption:'Two streams produce thrust.',detail:'Core and bypass gases exit through separate nozzles.',part:'nozzle',icon:'exhaust',color:'#ef9fa0'}]
};
const StageIcons={intake:Wind,compress:Layers,burn:Flame,turbine:Settings2,exhaust:ArrowRight};
type Props={engine:EngineId;input:Input;result:Result|null;error:string;pending:boolean;theme:string;onTheme:()=>void;onEngine:(id:EngineId)=>void;onInput:(key:keyof Input,value:number)=>void;onOpen:()=>void;onSave:()=>void;onRoute:(url:string)=>void};
export function VisualLab(p:Props){
 const[mode,setMode]=useState<Mode>('explore'),[active,setActive]=useState(0),[selected,setSelected]=useState('');
 const[shell,setShell]=useState(false),[explode,setExplode]=useState(0),[camera,setCamera]=useState<ViewPreset>('threequarter'),[viewReset,setViewReset]=useState(0);
 const[tools,setTools]=useState(false),[showInfo,setShowInfo]=useState(false),[flow,setFlow]=useState(true),[about,setAbout]=useState(false),[advanced,setAdvanced]=useState(false);
 const phases=PHASES[p.engine],phase=phases[active];
 const part=PARTS[p.engine].find(x=>x.id===selected)||PARTS[p.engine].find(x=>x.id===phase.part)||PARTS[p.engine][0];
 const fmt=(n:number|undefined,d=1)=>n===undefined||!Number.isFinite(n)?'—':n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
 const choose=(index:number)=>{const i=Math.max(0,Math.min(4,index));setActive(i);setSelected(phases[i].part);setShowInfo(true)};
 const pick=(id:string)=>{setSelected(id);const part=PARTS[p.engine].find(x=>x.id===id);if(!part)return;setActive(part.kind==='inlet'?0:part.kind==='fan'||part.kind==='compressor'?1:part.kind==='burner'?2:part.kind==='turbine'?3:4);setShowInfo(true)};
 const switchEngine=(id:EngineId)=>{p.onEngine(id);setActive(0);setSelected('');setExplode(0);setShell(false);setShowInfo(false)};
 const reset=()=>{setCamera('threequarter');setViewReset(x=>x+1);setExplode(0);setShell(false)};
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;if(e.key==='Escape'){setTools(false);setAbout(false);setShowInfo(false)}if(mode==='understand'&&e.key==='ArrowRight'){e.preventDefault();choose(active+1)}if(mode==='understand'&&e.key==='ArrowLeft'){e.preventDefault();choose(active-1)}};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[mode,active,p.engine]);
 const sliders:[Exclude<keyof Input,'engine'>,string,string,number,number,number,number][]=[
  ['throttle','Power','%',0,1,.01,100],['altitude','Altitude','m',0,12000,100,1],['mach','Airspeed','Mach',0,.85,.01,1],['coreArea','Core nozzle','m²',.06,.9,.01,1],
  ...(p.engine==='turbofan'?[['bypassArea','Bypass nozzle','m²',.25,5,.05,1] as [Exclude<keyof Input,'engine'>,string,string,number,number,number,number]]:[])
 ];
 return <main className={'visual-lab'+(mode==='experiment'?' experiment-active':'')} aria-label="Jet Engine Lab visual experience">
  <div className="visual-engine-scene" aria-label="Interactive 3D engine">
   <Suspense fallback={<div className="visual-loading">Preparing the engine…</div>}><EngineViewport engine={p.engine} selected={selected||phase.part} onSelect={pick} explode={explode} showShell={shell} result={p.result} preset={camera} viewReset={viewReset} theme={p.theme}/></Suspense>
  </div>
  <div className="visual-scene-shade" aria-hidden="true"/>
  <header className="visual-header">
   <button className="visual-logo" aria-label="Return to Explore" onClick={()=>{setMode('explore');reset()}}><span><Box size={20}/></span><b>JET ENGINE <em>LAB</em></b><small>SEE HOW IT WORKS</small></button>
   <div className="visual-switch" role="group" aria-label="Engine type"><button aria-pressed={p.engine==='turbofan'} className={p.engine==='turbofan'?'active':''} onClick={()=>switchEngine('turbofan')}>TURBOFAN</button><button aria-pressed={p.engine==='turbojet'} className={p.engine==='turbojet'?'active':''} onClick={()=>switchEngine('turbojet')}>TURBOJET</button></div>
   <div className="visual-actions"><button title="Toggle theme" aria-label="Toggle theme" onClick={p.onTheme}>{p.theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><button title="Options" aria-label="Options" aria-expanded={tools} onClick={()=>setTools(t=>!t)}><Menu size={20}/></button></div>
  </header>
  {tools&&<div className="visual-options" role="menu" aria-label="Options"><button role="menuitem" onClick={()=>{p.onSave();setTools(false)}}><Download size={15}/> Save experiment</button><button role="menuitem" onClick={()=>{p.onOpen();setTools(false)}}><BookOpen size={15}/> Open project</button><button role="menuitem" onClick={()=>{setShell(x=>!x);setTools(false)}}><Layers size={15}/> {shell?'Hide casing':'Show casing'}</button><button role="menuitem" onClick={()=>{setFlow(x=>!x);setTools(false)}}><Wind size={15}/> {flow?'Hide':'Show'} flow illustration</button><button role="menuitem" onClick={()=>{setCamera(c=>c==='side'?'threequarter':'side');setTools(false)}}><Focus size={15}/> Change camera angle</button><button role="menuitem" onClick={()=>{reset();setTools(false)}}><RotateCcw size={15}/> Reset view</button><button role="menuitem" onClick={()=>{setAbout(true);setTools(false)}}><Box size={15}/> About the physics</button><button role="menuitem" onClick={()=>p.onRoute('/reference')}><BookOpen size={15}/> Technical reference</button></div>}
  <div className="visual-coordinate"><span className="visual-pulse"/> INTERACTIVE 3D <i/> {p.engine==='turbofan'?'TWO STREAMS':'SINGLE STREAM'}</div>
  <div className="visual-side-controls" aria-label="Scene controls"><button aria-label="Toggle engine casing" aria-pressed={shell} title="Toggle casing" onClick={()=>setShell(x=>!x)}><Layers size={19}/></button><button aria-label="Toggle exploded view" aria-pressed={explode>0} title="Exploded view" onClick={()=>setExplode(x=>x===0?1:0)}><Focus size={19}/></button><button aria-label="Reset 3D view" title="Reset view" onClick={reset}><RotateCcw size={19}/></button></div>
  {flow&&<div className="visual-flow" aria-label="Illustrative airflow, not measured fluid velocity"><span><Wind size={17}/> AIR IN</span><div className="visual-flow-line"><i/></div><span>EXHAUST <ArrowRight size={17}/></span><small>ILLUSTRATIVE</small></div>}
  <section className="visual-narrative">
   <div className="visual-narrative-index"><b>0{active+1}<span> / 05</span></b><small>{mode==='understand'?'FOLLOW THE AIR':mode==='experiment'?'CHANGE THE CONDITIONS':'PICK A STAGE'}</small></div>
   <h1>{mode==='explore'?'An engine to explore.':phase.name+'.'}</h1>
   <p>{mode==='experiment'?'Move a control. See the response.':phase.caption}</p>
   {(showInfo||mode==='understand')&&<div className="visual-part-note" style={{'--phase-color':phase.color} as React.CSSProperties}><div><strong>{part.name}</strong><p>{part.role}</p></div><button onClick={()=>setShowInfo(false)} aria-label="Close component note"><X size={14}/></button></div>}
   {mode==='understand'&&<div className="visual-lesson-steps"><button aria-label="Previous stage" disabled={active===0} onClick={()=>choose(active-1)}><ChevronLeft size={18}/></button><span>FOLLOW THE AIR</span><button aria-label="Next stage" disabled={active===4} onClick={()=>choose(active+1)}><ChevronRight size={18}/></button></div>}
  </section>
  <aside className="visual-readout" aria-label="Provisional simulation data"><span>NET THRUST <small>PREVIEW</small></span><strong>{p.result&&!p.error?fmt(p.result.thrust/1000,1):'—'} <em>kN</em></strong><div><span>FUEL FLOW</span><b>{p.result&&!p.error?fmt(p.result.fuelFlow,2):'—'} kg/s</b></div><small className={p.error?'invalid':''}>{p.error?'INVALID INPUT':p.pending?'UPDATING':'EDUCATIONAL ESTIMATE'}</small></aside>
  {mode==='experiment'&&<aside className={'visual-experiment'+(advanced?' expanded':'')} aria-label="Experiment controls"><div className="visual-panel-head"><b><SlidersHorizontal size={17}/> EXPERIMENT</b><button aria-label="Close experiment" onClick={()=>setMode('explore')}><X size={17}/></button></div><p>Change the conditions. The scene stays interactive.</p>{sliders.map(([key,name,unit,min,max,step,mult])=><label className="visual-slider" key={key}><span><b>{name}</b><output>{fmt(p.input[key]*mult,mult===100?0:step<1?2:0)} <small>{unit}</small></output></span><input type="range" aria-label={name} min={min*mult} max={max*mult} step={step*mult} value={p.input[key]*mult} onChange={e=>p.onInput(key,Number(e.target.value)/mult)}/></label>)}<button className="visual-advanced-button" aria-expanded={advanced} onClick={()=>setAdvanced(v=>!v)}>{advanced?'Show power only':'More controls'} <ChevronRight size={15}/></button>{p.error&&<p className="visual-invalid" role="alert">{p.error}</p>}<div className="visual-caveat"><Activity size={15}/> Physical RPM and fully coupled nozzle matching are not validated.</div></aside>}
  <div className="visual-bottom">
   <nav className="visual-stages" aria-label="Engine stages">{phases.map((s,i)=>{const Icon=StageIcons[s.icon];return <button key={s.part} aria-current={active===i?'step':undefined} className={active===i?'active':''} style={{'--phase-color':s.color} as React.CSSProperties} onClick={()=>choose(i)}><span className="visual-stage-pictogram"><Icon size={22} strokeWidth={1.65}/></span><span className="visual-stage-text"><small>0{i+1}</small><b>{s.name}</b></span></button>})}</nav>
   <div className="visual-modes" role="group" aria-label="Experience mode"><button aria-pressed={mode==='explore'} className={mode==='explore'?'active':''} onClick={()=>{setMode('explore');setShowInfo(false)}}><Focus size={17}/> Explore</button><button aria-pressed={mode==='understand'} className={mode==='understand'?'active':''} onClick={()=>{setMode('understand');setShowInfo(true)}}><Lightbulb size={17}/> Understand</button><button aria-pressed={mode==='experiment'} className={mode==='experiment'?'active':''} onClick={()=>setMode('experiment')}><SlidersHorizontal size={17}/> Experiment</button></div>
  </div>
  {about&&<div className="visual-modal-cover" onMouseDown={e=>{if(e.target===e.currentTarget)setAbout(false)}}><section className="visual-modal" role="dialog" aria-label="Engineering preview explanation" aria-modal="true"><button aria-label="Close dialog" onClick={()=>setAbout(false)}><X size={18}/></button><Box size={32}/><h2>See the engine. Understand the idea.</h2><p>This is an educational engineering preview. Rotor motion, flow strokes and model geometry are illustrative. Cycle values are preliminary. Calibrated physical N1/N2 and coupled nozzle matching remain unfinished.</p><button onClick={()=>{setAbout(false);p.onRoute('/reference')}}>Open technical reference <ArrowRight size={17}/></button></section></div>}
  <span className="visual-disclaimer">DRAG TO ORBIT · SCROLL TO ZOOM · EDUCATIONAL ENGINEERING PREVIEW</span>
 </main>;
}
