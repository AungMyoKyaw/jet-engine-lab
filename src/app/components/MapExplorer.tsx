import {useMemo,useState} from 'react';
import {compressorMapPoint,turbineMapPoint} from '../physics/maps';
import fan from '../data/maps/fan.json';
import lpc from '../data/maps/lpc.json';
import hpc from '../data/maps/hpc.json';
import hpt from '../data/maps/hpt.json';
import lpt from '../data/maps/lpt.json';
type Key='Fan'|'LPC'|'HPC'|'HPT'|'LPT';
const maps={Fan:fan,LPC:lpc,HPC:hpc,HPT:hpt,LPT:lpt};
export function MapExplorer(){
 const [part,setPart]=useState<Key>('Fan');
 const map=maps[part],turbine=part==='HPT'||part==='LPT';
 const a=map.arrays as { NcMap?:number[]; NpMap?:number[]; RlineMap?:number[]; PRmap:number[] };
 const speeds=(turbine?a.NpMap!:a.NcMap!) as number[],lines=(turbine?a.PRmap:a.RlineMap!) as number[];
 const [position,setPosition]=useState(5),[line,setLine]=useState(3);
 const si=Math.min(position,speeds.length-1),li=Math.min(line,lines.length-1);
 const val=useMemo(()=>turbine?turbineMapPoint(map,speeds[si],lines[li]):compressorMapPoint(map,speeds[si],lines[li]),[si,li,turbine,map,speeds,lines]);
 const points=lines.map(coord=>turbine?turbineMapPoint(map,speeds[si],coord):compressorMapPoint(map,speeds[si],coord));
 const values=points.map(p=>turbine?p.efficiency:(p as ReturnType<typeof compressorMapPoint>).pressureRatio);
 const min=Math.min(...values),max=Math.max(...values),span=max-min||1;
 const poly=values.map((v,i)=>(30+i*460/Math.max(1,values.length-1))+','+(140-(v-min)/span*105)).join(' ');
 return <section className="map-explorer">
  <div className="map-heading"><span className="eyebrow">SOURCE-TRACEABLE ENGINEERING DATA</span><h2>Component map explorer</h2><p>Inspect published reference map surfaces, not a claimed engine-matched RPM solution. The tables are independent of the current preliminary cycle.</p></div>
  <div className="map-tabs" role="group" aria-label="Select mapped component">{(Object.keys(maps) as Key[]).map(k=><button key={k} className={part===k?'active':''} onClick={()=>{setPart(k);setPosition(5);setLine(3);}}>{k}</button>)}</div>
  <div className="map-body"><div className="map-control">
   <label><span>{turbine?'Corrected turbine-speed coordinate':'Corrected compressor-speed coordinate'}</span><strong className="mono">{speeds[si].toFixed(3)}{turbine?' (map scale)':' (map fraction)'}</strong><input type="range" min="0" max={speeds.length-1} value={si} onChange={e=>setPosition(Number(e.target.value))}/></label>
   <label><span>{turbine?'Expansion ratio':'R-line coordinate'}</span><strong className="mono">{lines[li].toFixed(3)}</strong><input type="range" min="0" max={lines.length-1} value={li} onChange={e=>setLine(Number(e.target.value))}/></label>
   <div className="map-results">{turbine?<><div><span>FLOW FUNCTION</span><strong>{(val as ReturnType<typeof turbineMapPoint>).correctedFlow.toFixed(3)}</strong></div><div><span>MAP EFFICIENCY</span><strong>{(val.efficiency*100).toFixed(1)}%</strong></div></>:<><div><span>CORRECTED FLOW</span><strong>{(val as ReturnType<typeof compressorMapPoint>).correctedFlowLbmS.toFixed(1)} <small>lbm/s</small></strong></div><div><span>PRESSURE RATIO</span><strong>{(val as ReturnType<typeof compressorMapPoint>).pressureRatio.toFixed(3)}</strong></div><div><span>EFFICIENCY</span><strong>{(val.efficiency*100).toFixed(1)}%</strong></div></>}</div>
  </div><div className="map-chart"><span className="overline">{turbine?'EFFICIENCY VS. EXPANSION RATIO':'PRESSURE RATIO VS. R-LINE'} · SELECTED SPEED SLICE</span><svg viewBox="0 0 510 170" role="img" aria-label="Selected component map slice">{[0,1,2,3].map(i=><line key={i} x1="28" x2="495" y1={31+i*35} y2={31+i*35} stroke="var(--line)" strokeDasharray="2 5"/>)}<polyline fill="none" stroke="var(--accent)" strokeWidth="2.2" points={poly}/><circle cx={30+li*460/Math.max(1,lines.length-1)} cy={140-(values[li]-min)/span*105} r="5" fill="var(--orange)" stroke="var(--panel)" strokeWidth="2"/><text x="30" y="164" fontSize="10" fill="var(--muted)">{lines[0].toFixed(1)}</text><text x="495" y="164" fontSize="10" fill="var(--muted)" textAnchor="end">{lines[lines.length-1].toFixed(1)}</text></svg></div></div>
 <div className="map-provenance"><span>DATASET / {part} · APACHE-2.0 · RAW REFERENCE TABLE</span><a href={map.sourceUrl} target="_blank" rel="noreferrer">VIEW ORIGINAL</a><small className="mono">SHA256 {map.sourceSHA256}</small><p>Map axes are reference-coordinate tables. No absolute shaft RPM, component calibration, interpolation uncertainty or matched off-design engine output is inferred from this chart.</p></div>
 </section>;
}
