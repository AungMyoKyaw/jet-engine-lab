import type {VisualEngineId} from './catalog';

export type Phase={name:string;caption:string;detail:string;part:string;parts:readonly string[];icon:'intake'|'compress'|'burn'|'turbine'|'exhaust';color:string};
export const PHASES:Record<VisualEngineId,Phase[]>={
 turbojet:[
 {name:'Intake',caption:'Air enters the engine.',detail:'The inlet guides air toward the compressor.',part:'inlet',parts:['inlet'],icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'Blades squeeze the air.',detail:'Compressor rows increase total pressure before combustion.',part:'compressor',parts:['compressor'],icon:'compress',color:'#91c5f3'},
 {name:'Combustion',caption:'Fuel adds energy to the flow.',detail:'Hot gas gains energy in the combustor.',part:'burner',parts:['burner'],icon:'burn',color:'#f6a477'},
 {name:'Turbine',caption:'Hot gas turns the shaft.',detail:'A turbine extracts work to drive the compressor.',part:'turbine',parts:['turbine'],icon:'turbine',color:'#f3c878'},
 {name:'Exhaust',caption:'Gas accelerates rearward.',detail:'Momentum and pressure forces produce forward thrust.',part:'nozzle',parts:['nozzle'],icon:'exhaust',color:'#ef9fa0'}],
 turbofan:[
 {name:'Intake',caption:'Air enters the large inlet.',detail:'The inlet supplies both the core and bypass stream.',part:'inlet',parts:['inlet'],icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'The fan and compressors pressurize air.',detail:'Most air bypasses the hot core; compressor stages raise core pressure.',part:'hpc',parts:['fan','lpc','hpc'],icon:'compress',color:'#91c5f3'},
 {name:'Combustion',caption:'Fuel heats the core air.',detail:'Combustion adds energy before the turbine stages.',part:'burner',parts:['burner'],icon:'burn',color:'#f6a477'},
 {name:'Turbines',caption:'Hot gas powers two shafts.',detail:'High and low pressure turbines drive the compressors and fan.',part:'hpt',parts:['hpt','lpt'],icon:'turbine',color:'#f3c878'},
 {name:'Exhaust',caption:'Two streams produce thrust.',detail:'Core and bypass gases exit through separate nozzles.',part:'nozzle',parts:['nozzle','bypass'],icon:'exhaust',color:'#ef9fa0'}],
 'afterburning-turbofan':[
 {name:'Intake',caption:'Air rushes into the low-bypass fan.',detail:'A compact fan feeds the core and the small bypass duct.',part:'fan',parts:['inlet','fan','bypass'],icon:'intake',color:'#79d8f5'},
 {name:'Compression',caption:'Compressors raise the pressure.',detail:'The low and high pressure compressors prepare air for combustion.',part:'hpc',parts:['lpc','hpc'],icon:'compress',color:'#91c5f3'},
 {name:'Core & turbines',caption:'Fuel heats the compressed flow.',detail:'Core combustion powers the HP and LP turbines ahead of the afterburner.',part:'burner',parts:['burner','hpt','lpt'],icon:'burn',color:'#f6a477'},
 {name:'Afterburner',caption:'A second flame lights the exhaust.',detail:'Fuel is added downstream of the turbine. This is a visual demonstration, not calculated performance.',part:'afterburner',parts:['afterburner'],icon:'burn',color:'#ff894f'},
 {name:'Variable nozzle',caption:'Petals move to change the outlet.',detail:'A movable nozzle illustrates exhaust-area control. The engine is not numerically calibrated.',part:'nozzle',parts:['nozzle'],icon:'exhaust',color:'#ef9fa0'}],
 'centrifugal-turbojet':[
 {name:'Intake',caption:'Air enters the compressor eye.',detail:'The intake delivers air to a compact centrifugal impeller.',part:'inlet',parts:['inlet'],icon:'intake',color:'#79d8f5'},
 {name:'Impeller',caption:'Blades throw air outward.',detail:'Unlike an axial compressor, this impeller turns axial flow into radial flow.',part:'impeller',parts:['impeller'],icon:'compress',color:'#91c5f3'},
 {name:'Diffuser',caption:'The outward flow slows down.',detail:'Stationary diffuser passages recover static pressure after the impeller.',part:'diffuser',parts:['diffuser'],icon:'compress',color:'#a4d7ca'},
 {name:'Combustion',caption:'Fuel adds heat.',detail:'The combustor sits behind the radial compressor assembly.',part:'burner',parts:['burner'],icon:'burn',color:'#f6a477'},
 {name:'Exhaust',caption:'One turbine. One nozzle.',detail:'The turbine drives the compressor; the nozzle accelerates the hot gas.',part:'nozzle',parts:['turbine','nozzle'],icon:'exhaust',color:'#ef9fa0'}],
 'geared-turbofan':[
 {name:'Big fan',caption:'A larger fan moves more air.',detail:'The large fan illustrates the high-bypass architecture.',part:'fan',parts:['inlet','fan'],icon:'intake',color:'#79d8f5'},
 {name:'Gearbox',caption:'Small gears change rotation speed.',detail:'The sun and planet gears illustrate a reduction stage between fan and LP shaft.',part:'gearbox',parts:['gearbox'],icon:'compress',color:'#e2ca93'},
 {name:'Compression',caption:'The core is compressed.',detail:'LP and HP compressors raise air pressure before fuel is added.',part:'hpc',parts:['lpc','hpc'],icon:'compress',color:'#91c5f3'},
 {name:'Hot core',caption:'Combustion powers the turbines.',detail:'The turbines recover work to drive the compressors and geared fan.',part:'burner',parts:['burner','hpt','lpt'],icon:'burn',color:'#f6a477'},
 {name:'Exhaust',caption:'The two streams leave separately.',detail:'The bypass and core streams contribute to thrust. The values remain uncalibrated for this visual study.',part:'nozzle',parts:['nozzle','bypass'],icon:'exhaust',color:'#ef9fa0'}]
};
