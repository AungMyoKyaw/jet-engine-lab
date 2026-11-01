export type MapData={id:string;sourceUrl:string;sourceSHA256:string;license:string;reviewStatus:string;arrays:Record<string,any>};
function bracket(axis:number[],value:number):[number,number,number]{
 if(!Number.isFinite(value)||value<axis[0]||value>axis[axis.length-1])throw Error('Requested map coordinate lies outside the published table domain.');
 if(value===axis[axis.length-1])return[axis.length-2,axis.length-1,1];
 let lo=0,hi=axis.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(axis[m]>value)hi=m;else lo=m;}
 return[lo,hi,(value-axis[lo])/(axis[hi]-axis[lo])];
}
function bilinear(grid:number[][],x:[number,number,number],y:[number,number,number]){
 const a=grid[x[0]][y[0]]*(1-y[2])+grid[x[0]][y[1]]*y[2];
 const b=grid[x[1]][y[0]]*(1-y[2])+grid[x[1]][y[1]]*y[2];
 return a*(1-x[2])+b*x[2];
}
export function compressorMapPoint(map:MapData,nc:number,rline:number,alphaIndex=0){
 const a=map.arrays;
 if(!Array.isArray(a.NcMap)||!Array.isArray(a.RlineMap)||!Array.isArray(a.WcMap))throw Error('Not a compressor reference map.');
 if(!Number.isInteger(alphaIndex)||alphaIndex<0||alphaIndex>=a.alphaMap.length)throw Error('Alpha slice out of range');
 const x=bracket(a.NcMap,nc),y=bracket(a.RlineMap,rline);
 return { correctedFlowLbmS:bilinear(a.WcMap[alphaIndex],x,y), pressureRatio:bilinear(a.PRmap[alphaIndex],x,y),efficiency:bilinear(a.effMap[alphaIndex],x,y) };
}
export function turbineMapPoint(map:MapData,np:number,ratio:number,alphaIndex=0){
 const a=map.arrays;
 if(!Array.isArray(a.NpMap)||!Array.isArray(a.PRmap)||!Array.isArray(a.WpMap))throw Error('Not a turbine reference map.');
 if(!Number.isInteger(alphaIndex)||alphaIndex<0||alphaIndex>=a.alphaMap.length)throw Error('Alpha slice out of range');
 const x=bracket(a.NpMap,np),y=bracket(a.PRmap,ratio);
 return { correctedFlow:bilinear(a.WpMap[alphaIndex],x,y),efficiency:bilinear(a.effMap[alphaIndex],x,y) };
}
