import type {EngineId} from '../physics/cycle';

export type VisualEngineId=EngineId|'afterburning-turbofan'|'centrifugal-turbojet'|'geared-turbofan';
export type EngineEntry={id:VisualEngineId;name:string;label:string;idea:string;tag:string;family:'civil'|'military'|'historic'|'modern';preview:string;simulation:'preview'|'visual-only'};
export const ENGINE_CATALOG:readonly EngineEntry[]=[
 {id:'turbojet',name:'Turbojet',label:'01 / THE ORIGINAL',idea:'One core. Pure jet thrust.',tag:'The simplest jet',family:'historic',preview:'turbojet',simulation:'preview'},
 {id:'turbofan',name:'High-bypass turbofan',label:'02 / AIRLINER',idea:'A big fan moves more air.',tag:'Efficient flight',family:'civil',preview:'turbofan',simulation:'preview'},
 {id:'afterburning-turbofan',name:'Afterburning turbofan',label:'03 / FIGHTER',idea:'Light the exhaust. Open the nozzle.',tag:'Burst of power',family:'military',preview:'afterburning-turbofan',simulation:'visual-only'},
 {id:'centrifugal-turbojet',name:'Centrifugal turbojet',label:'04 / RADIAL',idea:'An impeller throws air outward.',tag:'Radial compression',family:'historic',preview:'centrifugal-turbojet',simulation:'visual-only'},
 {id:'geared-turbofan',name:'Geared turbofan',label:'05 / GEARED',idea:'A gearbox lets the fan turn slower.',tag:'Smarter rotation',family:'modern',preview:'geared-turbofan',simulation:'visual-only'}
];
export const isCycleEngine=(value:VisualEngineId):value is EngineId=>value==='turbojet'||value==='turbofan';
export const findEngine=(id:VisualEngineId)=>ENGINE_CATALOG.find(entry=>entry.id===id)!;
export function isVisualEngineId(value:string):value is VisualEngineId{return ENGINE_CATALOG.some(e=>e.id===value)}
