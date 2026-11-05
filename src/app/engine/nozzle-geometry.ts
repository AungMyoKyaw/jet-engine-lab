import type {Result} from '../physics/cycle';

/** Reference dimensions are SolidCraft B-rep millimetres exported in metres.
 * The site models a hypothetical engine; these are design parameters, not OEM metrology.
 * In the core the circular aperture has no centerbody. The separate bypass
 * annulus has a fixed 0.650 m inner fairing. Both use the solver's accepted
 * geometric areas (A_eff / C_d), never the requested area before convergence.
 */
export const THROAT_CAD={
 coreLipBore:0.500,
 corePetalTip:0.555,
 corePetalHinge:-0.180,
 corePetalExit:0.475,
 bypassFairing:0.650,
 bypassLipBore:1.100,
 bypassPetalTip:1.100,
 bypassPetalHinge:3.180,
 bypassPetalExit:3.680,
} as const;

export type MeteredThroats={
 core:{radius:number;area:number;effective:number;lipRadialScale:number};
 bypass:null|{outerRadius:number;innerRadius:number;area:number;effective:number;lipRadialScale:number};
};

export function meteredThroats(result:Result):MeteredThroats{
 if(!result.valid||!(result.coreGeom>0)||!Number.isFinite(result.coreGeom))throw Error('Invalid accepted core nozzle geometry');
 const radius=Math.sqrt(result.coreGeom/Math.PI);
 const core={radius,area:Math.PI*radius**2,effective:result.coreArea,lipRadialScale:radius/THROAT_CAD.coreLipBore};
 if(result.engine==='turbojet')return{core,bypass:null};
 if(!(result.bypassGeom>0)||!Number.isFinite(result.bypassGeom))throw Error('Invalid accepted bypass nozzle geometry');
 const innerRadius=THROAT_CAD.bypassFairing;
 const outerRadius=Math.sqrt(result.bypassGeom/Math.PI+innerRadius**2);
 return {core,bypass:{outerRadius,innerRadius,area:Math.PI*(outerRadius**2-innerRadius**2),effective:result.bypassArea,lipRadialScale:outerRadius/THROAT_CAD.bypassLipBore}};
}
