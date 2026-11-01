import {useEffect,useMemo,useRef,useState} from 'react';
import {BookOpen, Box, ChartNoAxesCombined, ChevronDown, Command, Gauge, Layers, Maximize, MousePointer2, PanelBottom, PanelRight, Ruler, Save, Scissors, Search, Undo2, Redo2, Sun, Moon, X} from 'lucide-react';
import type {EngineId} from '../physics/cycle';
import type {StudioMode,ToolMode} from './project';

type Props={engine:EngineId;mode:StudioMode;onMode:(mode:StudioMode)=>void;tool:ToolMode;onTool:(tool:ToolMode)=>void;projectName:string;onName:(name:string)=>void;onNew:()=>void;onOpen:()=>void;onSave:()=>void;onUndo:()=>void;onRedo:()=>void;canUndo:boolean;canRedo:boolean;partsOpen:boolean;onParts:()=>void;advancedOpen:boolean;onAdvanced:()=>void;pending:boolean;error:string;onRoute:(url:string)=>void;sectionEnabled:boolean;onSection:()=>void;theme:string;onTheme:()=>void};
type Action={id:string;label:string;shortcut?:string;run:()=>void;section:'File'|'View'|'Tools'|'Navigate'};
export function StudioBar(p:Props){
 const [palette,setPalette]=useState(false),[query,setQuery]=useState(''),[menu,setMenu]=useState<string|null>(null),[rename,setRename]=useState(false);
 const searchRef=useRef<HTMLInputElement>(null);
 const actions=useMemo<Action[]>(()=>[
  {id:'new',label:'New study',shortcut:'⌘ N',run:p.onNew,section:'File'},
  {id:'open',label:'Open project…',shortcut:'⌘ O',run:p.onOpen,section:'File'},
  {id:'save',label:'Save project…',shortcut:'⌘ S',run:p.onSave,section:'File'},
  {id:'undo',label:'Undo parameter change',shortcut:'⌘ Z',run:p.onUndo,section:'File'},
  {id:'redo',label:'Redo parameter change',shortcut:'⌘ ⇧ Z',run:p.onRedo,section:'File'},
  {id:'inspection',label:'Inspection workspace',shortcut:'1',run:()=>p.onMode('inspection'),section:'View'},
  {id:'simulation',label:'Simulation workspace',shortcut:'2',run:()=>p.onMode('simulation'),section:'View'},
  {id:'analysis',label:'Analysis workspace',shortcut:'3',run:()=>p.onMode('analysis'),section:'View'},
  {id:'learning',label:'Learning workspace',shortcut:'4',run:()=>p.onMode('learning'),section:'View'},
  {id:'parts',label:p.partsOpen?'Close component browser':'Open component browser',shortcut:'B',run:p.onParts,section:'View'},
  {id:'parameters',label:p.advancedOpen?'Hide parameters dock':'Show parameters dock',shortcut:'P',run:p.onAdvanced,section:'View'},
  {id:'select',label:'Select components',shortcut:'V',run:()=>p.onTool('select'),section:'Tools'},
  {id:'measure',label:'Measure 3D distance',shortcut:'M',run:()=>p.onTool('measure'),section:'Tools'},
  {id:'section',label:'Section plane',shortcut:'C',run:()=>{p.onTool('section');if(!p.sectionEnabled)p.onSection();},section:'Tools'},
  {id:'fullscreen',label:'Toggle fullscreen',shortcut:'F',run:()=>{if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen?.()},section:'View'},
  {id:'courses',label:'Open courses',run:()=>p.onRoute('/courses'),section:'Navigate'},
  {id:'reference',label:'Open technical reference',run:()=>p.onRoute('/reference'),section:'Navigate'},
  {id:'credits',label:'Open credits',run:()=>p.onRoute('/credits'),section:'Navigate'}
 ],[p]);
 const execute=(action:Action)=>{action.run();setPalette(false);setMenu(null);setQuery('')};
 useEffect(()=>{const key=(e:KeyboardEvent)=>{
  const isTyping=e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement;
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(v=>!v);setMenu(null);return}
  if(e.key==='Escape'){setPalette(false);setMenu(null);return}
  if(!isTyping&&(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();(e.shiftKey?p.onRedo:p.onUndo)();return}
  if((e.metaKey||e.ctrlKey)&&['s','o','n'].includes(e.key.toLowerCase())){e.preventDefault();const found=actions.find(a=>a.id===({s:'save',o:'open',n:'new'} as Record<string,string>)[e.key.toLowerCase()]);found?.run();return}
  if(isTyping||e.metaKey||e.ctrlKey||e.altKey||e.repeat||palette)return;
  const map:Record<string,string>={'1':'inspection','2':'simulation','3':'analysis','4':'learning',v:'select',m:'measure',c:'section',b:'parts',p:'parameters',f:'fullscreen'};
  const id=map[e.key.toLowerCase()];if(id){e.preventDefault();actions.find(a=>a.id===id)?.run()}
 };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[actions,palette]);
 useEffect(()=>{if(palette)searchRef.current?.focus()},[palette]);
 const filtered=actions.filter(a=>(a.label+' '+a.section).toLowerCase().includes(query.toLowerCase()));
 return <div className="studio-chrome">
  <div className="studio-titlebar">
   <div className="studio-brand"><span className="studio-brand-mark"><Box size={16}/></span><strong>JET ENGINE LAB</strong><span className="studio-brand-divider">/</span><span className="studio-brand-subtitle">ENGINEERING STUDIO</span></div>
   <div className="studio-doc">{rename?<input autoFocus aria-label="Project name" maxLength={80} defaultValue={p.projectName} onBlur={e=>{p.onName(e.target.value);setRename(false)}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();if(e.key==='Escape')setRename(false)}}/>:<button onClick={()=>setRename(true)} title="Rename study">{p.projectName} <span className="studio-doc-ext">.jetlab</span></button>}<span className="studio-preview-tag">PREVIEW</span></div>
   <div className="studio-title-actions"><span className={'studio-solver-health'+(p.error?' error':'')}>{p.error?'INPUT ERROR':p.pending?'SOLVING':'PRELIMINARY MODEL'}</span><button onClick={()=>setPalette(true)} aria-label="Command palette" title="Command palette (⌘K)"><Search size={15}/><span>Search</span><kbd>⌘ K</kbd></button><button aria-label="Toggle light/dark theme" title="Toggle color theme" onClick={p.onTheme}>{p.theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button><button aria-label="Toggle fullscreen" title="Fullscreen" onClick={()=>execute(actions.find(a=>a.id==='fullscreen')!)}><Maximize size={16}/></button></div>
  </div>
  <div className="studio-ribbon" role="toolbar" aria-label="Engineering studio toolbar">
   <div className="studio-menus">{(['File','View','Tools','Navigate'] as const).map(section=><div className="studio-menu-wrap" key={section}><button aria-haspopup="menu" aria-expanded={menu===section} onClick={()=>setMenu(m=>m===section?null:section)}>{section}<ChevronDown size={12}/></button>{menu===section&&<div className="studio-dropdown" role="menu">{actions.filter(a=>a.section===section).map(a=><button key={a.id} role="menuitem" onClick={()=>execute(a)}><span>{a.label}</span><kbd>{a.shortcut}</kbd></button>)}</div>}</div>)}</div>
   <div className="studio-ribbon-divider"/>
   <div className="studio-toolset" aria-label="Scene tools">
    <button title="Select (V)" aria-label="Select tool" className={p.tool==='select'?'active':''} onClick={()=>p.onTool('select')}><MousePointer2 size={16}/><span>Select</span></button>
    <button title="Measure (M)" aria-label="Measure distance tool" className={p.tool==='measure'?'active':''} onClick={()=>p.onTool('measure')}><Ruler size={16}/><span>Measure</span></button>
    <button title="Section plane (C)" aria-label="Section tool" className={p.tool==='section'?'active':''} onClick={()=>{p.onTool('section');if(!p.sectionEnabled)p.onSection()}}><Scissors size={16}/><span>Section</span></button>
   </div>
   <div className="studio-ribbon-divider"/>
   <div className="studio-toolset studio-workspace-tabs" aria-label="Workspace mode">{([
    ['inspection','Inspect',Layers],['simulation','Simulate',Gauge],['analysis','Analyze',ChartNoAxesCombined],['learning','Learn',BookOpen]
   ] as const).map(([mode,label,Icon])=><button key={mode} aria-pressed={p.mode===mode} className={p.mode===mode?'active':''} onClick={()=>p.onMode(mode)}><Icon size={15}/><span>{label}</span></button>)}</div>
   <div className="studio-toolset studio-history-actions"><button title="Undo (⌘Z)" disabled={!p.canUndo} onClick={p.onUndo}><Undo2 size={15}/></button><button title="Redo (⌘⇧Z)" disabled={!p.canRedo} onClick={p.onRedo}><Redo2 size={15}/></button></div><div className="studio-ribbon-spacer"/>
   <div className="studio-toolset studio-ribbon-end"><button aria-label="Toggle parts browser" aria-pressed={p.partsOpen} className={p.partsOpen?'active':''} onClick={p.onParts} title="Components (B)"><PanelRight size={16}/></button><button aria-label="Toggle parameters dock" aria-pressed={p.advancedOpen} className={p.advancedOpen?'active':''} onClick={p.onAdvanced} title="Parameters (P)"><PanelBottom size={16}/></button><button title="Save study (⌘S)" onClick={p.onSave}><Save size={16}/></button></div>
  </div>
  {palette&&<div className="studio-command-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPalette(false)}}><div className="studio-command" role="dialog" aria-label="Command palette" aria-modal="true"><div className="studio-command-search"><Command size={20}/><input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search actions, tools, workspaces…" aria-label="Search commands"/><button aria-label="Close command palette" onClick={()=>setPalette(false)}><X size={17}/></button></div><div className="studio-command-results">{filtered.length?filtered.map(a=><button key={a.id} onClick={()=>execute(a)}><span><small>{a.section}</small>{a.label}</span><kbd>{a.shortcut}</kbd></button>):<p>No matching commands</p>}</div><div className="studio-command-foot">ENTER select · ESC close · Available offline</div></div></div>}
 </div>;
}
