import {DEFAULTS,validate,type EngineId,type Input} from '../physics/cycle';
import {isVisualEngineId,type VisualEngineId} from '../data/catalog';
export type StudioMode='inspection'|'simulation'|'analysis'|'learning';
export type ToolMode='select'|'measure'|'section';
export type ProjectFile={format:'jet-engine-lab';schema:1;name:string;activeEngine:EngineId;visualEngine?:VisualEngineId;inputs:Record<EngineId,Input>;view:{mode:StudioMode;selected:string;explode:number;showShell:boolean}};
export function makeProject(name:string,inputs:Record<EngineId,Input>,activeEngine:EngineId,view:ProjectFile['view'],visualEngine?:VisualEngineId):ProjectFile{
 return {format:'jet-engine-lab',schema:1,name:name.trim().slice(0,80)||'Untitled Study',activeEngine,...(visualEngine?{visualEngine}:{}),inputs:structuredClone(inputs),view:{...view}};
}
export function parseProject(json:string):ProjectFile{
 if(json.length>1_000_000)throw Error('Project exceeds 1 MB');
 let data:unknown;try{data=JSON.parse(json)}catch{throw Error('Invalid project JSON')}
 if(!data||typeof data!=='object')throw Error('Invalid project');
 const v=data as Partial<ProjectFile>;
 if(v.format!=='jet-engine-lab'||v.schema!==1)throw Error('Unsupported project format/version');
 if(typeof v.name!=='string'||!v.name.trim()||v.name.length>80)throw Error('Invalid project name');
 if(v.activeEngine!=='turbojet'&&v.activeEngine!=='turbofan')throw Error('Invalid engine');
 if(v.visualEngine!==undefined&&(typeof v.visualEngine!=='string'||!isVisualEngineId(v.visualEngine)))throw Error('Invalid visual engine');
 if(!v.inputs||typeof v.inputs!=='object')throw Error('Inputs missing');
 const inputs={} as Record<EngineId,Input>;
 for(const engine of ['turbojet','turbofan'] as const){
  const candidate=v.inputs[engine];if(!candidate||candidate.engine!==engine)throw Error('Missing '+engine+' inputs');
  const required=Object.keys(DEFAULTS[engine]) as (keyof Input)[];
  if(required.some(k=>typeof candidate[k]!=='number'&&k!=='engine'))throw Error('Missing or invalid numeric input for '+engine);
  const error=validate(candidate);if(error)throw Error(engine+': '+error);
  inputs[engine]={...DEFAULTS[engine],...candidate};
 }
 const view=v.view;
 if(!view||!['inspection','simulation','analysis','learning'].includes(view.mode)||typeof view.selected!=='string'||view.selected.length>100||!Number.isFinite(view.explode)||view.explode<0||view.explode>1||typeof view.showShell!=='boolean')throw Error('Invalid view state');
 return {format:'jet-engine-lab',schema:1,name:v.name,activeEngine:v.activeEngine,...(v.visualEngine?{visualEngine:v.visualEngine}:{}),inputs,view:{...view}};
}
export function downloadProject(project:ProjectFile){
 const url=URL.createObjectURL(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=(project.name.toLowerCase().replace(/[^a-z0-9_-]+/g,'-')||'study')+'.jetlab.json';document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
export function readRecovery():ProjectFile|null{try{const v=localStorage.getItem('jetlab-recovery-v1');return v?parseProject(v):null}catch{return null}}
export function saveRecovery(p:ProjectFile){try{localStorage.setItem('jetlab-recovery-v1',JSON.stringify(p))}catch{/* quota/private mode */}}
