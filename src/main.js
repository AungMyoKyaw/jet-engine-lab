import { DEFAULT_ENGINE, turbojetCycle, airfoilModel, velocityTriangle } from './physics.js';
import { createEngineScene } from './scene.js';

const $ = id => document.getElementById(id);
const num = (v,d=0)=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const stageInfo = [
  {name:'AIR INTAKE',desc:'The inlet captures oncoming air and delivers it smoothly to the compressor. Deceleration and inlet design determine pressure recovery and distortion at the compressor face.',fact:'Uniform airflow matters more than merely catching air.',label:'PRESSURE RECOVERY'},
  {name:'AXIAL COMPRESSOR',desc:'Rotating airfoils give energy to the air; stationary vane rows remove swirl and recover static pressure. Each rotor–stator pair makes a relatively small gain, multiplied across stages.',fact:'Rotor = shaft work. Stator = flow turning and diffusion.',label:'ROTOR + STATOR'},
  {name:'COMBUSTION CHAMBER',desc:'Fuel burns continuously in the compressed airflow. The burner raises total temperature dramatically while losing some total pressure across its liner and mixing passages.',fact:'A flame is stabilized; the combustor does not detonate.',label:'CONTINUOUS BURN'},
  {name:'POWER TURBINE',desc:'Hot gas expands through stator nozzles and rotor blades, transferring energy to the common shaft. The turbine extracts enough power to drive the compressor.',fact:'The same shaft closes the compressor power loop.',label:'THE POWER BALANCE'},
  {name:'EXHAUST NOZZLE',desc:'Remaining gas energy becomes a high-speed jet. Net thrust includes increased exhaust momentum, minus incoming ram drag, plus any pressure mismatch at the exit.',fact:'A choked nozzle may still have pressure thrust.',label:'ACCELERATE TO THRUST'}
];
const inputs = {...DEFAULT_ENGINE};
let currentCycle=turbojetCycle(inputs);
let selected=0;
let engine=null;
function setSelected(index,internal=false) {
  selected=index;
  document.querySelectorAll('.stage-item').forEach((button,i)=>{
    const active=i===selected;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  $('detail-index').textContent=String(index+1).padStart(2,'0');
  $('detail-title').textContent=stageInfo[index].name;
  $('detail-description').textContent=stageInfo[index].desc;
  $('detail-fact-label').textContent=stageInfo[index].label;
  $('detail-fact').textContent=stageInfo[index].fact;
  $('frame-status').textContent=String(index+1).padStart(2,'0')+' / 05';
  if(engine && !internal) engine.select(index);
  updateTourButton();
}
function updateTourButton() {
  const active=Boolean(engine?.state.tour);
  $('tour-button').classList.toggle('active',active);
  $('tour-button').setAttribute('aria-pressed',String(active));
}
try {
  engine=createEngineScene($('engine-canvas'),{onSelect:(i,internal)=>setSelected(i,true)});
} catch (error) {
  console.error('3D model initialization failed:',error);
  const wrap=$('engine-canvas').parentElement;
  const notice=document.createElement('p');
  notice.className='scene-error';
  notice.textContent='3D rendering is unavailable in this browser. The live engineering calculations and lessons remain accessible.';
  notice.style.cssText='position:absolute;top:40%;left:15%;right:15%;z-index:5;font-size:14px;text-align:center;color:#84583e;line-height:1.7;';
  wrap.appendChild(notice);
}
document.querySelectorAll('.stage-item').forEach(button=>button.addEventListener('click',()=>setSelected(Number(button.dataset.stage))));
const MODE_BUTTONS=[
  {id:'cutaway-button',value:'cutaway',setter:'setCutaway'},
  {id:'explode-button',value:'explode',setter:'setExplode'},
  {id:'tour-button',value:'tour',setter:'setTour'}
];
MODE_BUTTONS.forEach(({id,value,setter})=>{
  $(id).addEventListener('click',()=>{
    if(!engine) return;
    const next=!engine.state[value];
    engine[setter](next);
    $(id).classList.toggle('active',next);
    $(id).setAttribute('aria-pressed',String(next));
  });
});
$('reset-button').addEventListener('click',()=>{
  engine?.reset();
  $('cutaway-button').classList.add('active');
  $('cutaway-button').setAttribute('aria-pressed','true');
  for(const id of ['explode-button','tour-button']){
    $(id).classList.remove('active');$(id).setAttribute('aria-pressed','false');
  }
  setSelected(0,true);
});
function linePlot(id,values,color,units,stations) {
  const svg=$(id);
  const w=550,h=250,left=38,right=18,top=24,bottom=41;
  const ymax=Math.max(...values)*1.13;
  const ymin=0;
  const x=i=>left+(w-left-right)*i/(values.length-1);
  const y=v=>top+(h-top-bottom)*(1-(v-ymin)/(ymax-ymin));
  const points=values.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ');
  let markup='';
  for(let j=0;j<=4;j++){
    const y0=top+(h-top-bottom)*j/4;
    markup+='<line x1="'+left+'" y1="'+y0+'" x2="'+(w-right)+'" y2="'+y0+'" stroke="#dce2df" stroke-width="1"/>';
    markup+='<text x="0" y="'+(y0+4)+'" fill="#9ca8a9" font-size="11" font-family="monospace">'+num(ymax*(1-j/4),0)+'</text>';
  }
  const fillPoints=left+','+(h-bottom)+' '+points+' '+x(values.length-1)+','+(h-bottom);
  markup+='<polygon points="'+fillPoints+'" fill="'+color+'" fill-opacity=".08"/>';
  markup+='<polyline points="'+points+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round"/>';
  values.forEach((v,i)=>{
    markup+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="4" fill="'+color+'" stroke="#fcfbf7" stroke-width="2"/>';
    markup+='<text x="'+x(i)+'" y="'+(h-13)+'" fill="#839196" text-anchor="middle" font-size="12" font-family="monospace">'+stations[i].id+'</text>';
  });
  svg.innerHTML=markup;
  svg.setAttribute('aria-label',units+' across engine stations');
}
function drawMini(stations) {
  const svg=$('station-mini-chart');
  const width=246,height=115,low=12,high=94;
  const x=i=>5+(width-10)*i/(stations.length-1);
  const plot=key=>{
    const max=Math.max(...stations.map(s=>s[key]))*1.1;
    return stations.map((s,i)=>x(i).toFixed(1)+','+(high-(s[key]/max)*(high-low)).toFixed(1)).join(' ');
  };
  svg.innerHTML=
    '<line x1="0" y1="28" x2="246" y2="28" stroke="#e0e7e3" stroke-dasharray="3 4"/>'+
    '<line x1="0" y1="61" x2="246" y2="61" stroke="#e0e7e3" stroke-dasharray="3 4"/>'+
    '<line x1="0" y1="94" x2="246" y2="94" stroke="#e0e7e3"/>'+
    '<polyline points="'+plot('temperature')+'" stroke="#ce643d" fill="none" stroke-width="2.2" stroke-linejoin="round"/>'+
    '<polyline points="'+plot('pressure')+'" stroke="#537891" fill="none" stroke-width="2" stroke-dasharray="5 3" stroke-linejoin="round"/>'+
    stations.map((s,i)=>'<circle cx="'+x(i)+'" cy="'+(high-(s.temperature/Math.max(...stations.map(t=>t.temperature))*1.1)*(high-low))+'" r="2.5" fill="#ce643d"/>').join('');
}
function updateReadouts() {
  currentCycle=turbojetCycle(inputs);
  engine?.setCycle(currentCycle);
  const c=currentCycle;
  $('thrust-number').textContent=num(c.thrust/1000,1);
  $('thrust-bar').style.width=String(Math.max(0,Math.min(100,c.thrust/90000*100)))+'%';
  $('velocity-number').textContent=num(c.exhaustVelocity,0);
  $('fuel-number').textContent=num(c.fuelFlow,2);
  $('power-number').textContent=num(c.compressorPower/1e6,1);
  $('nozzle-state').textContent=!c.valid?'CHECK':c.choked?'CHOKED':'SUBSONIC';
  $('nozzle-state').style.color=c.valid?'#3f7d65':'#ae5c3c';
  $('model-message').textContent=!c.valid
    ? 'The selected combination falls outside the simplified model’s valid positive-thrust operating region. Try increasing throttle or reducing compression.'
    : 'Steady-state, ideal-gas turbojet. At this setting: '+num(c.fuelPerThrustHour,1)+' kg/(kN·h) fuel consumption. Hypothetical operating point, not an engine map.';
  drawMini(c.stations);
  linePlot('temp-chart',c.stations.map(s=>s.temperature),'#ce643d','Temperature (K)',c.stations);
  linePlot('pressure-chart',c.stations.map(s=>s.pressure/1000),'#537891','Pressure (kPa)',c.stations);
  $('station-table-body').innerHTML=c.stations.map(s=>
    '<tr><td><span class="station-badge">'+s.id+'</span></td><td>'+s.name+'</td><td>'+num(s.temperature,1)+' K</td><td>'+num(s.pressure/1000,1)+' kPa</td><td>'+s.kind.toUpperCase()+'</td></tr>'
  ).join('');
}
const controls=[
  {id:'throttle',key:'throttle',parse:v=>v/100,fmt:v=>num(v*100)+'%'},
  {id:'pressure-ratio',key:'pressureRatio',parse:Number,fmt:v=>num(v,1)+':1'},
  {id:'mass-flow',key:'massFlow',parse:Number,fmt:v=>num(v,0)+' kg/s'},
  {id:'altitude',key:'altitude',parse:Number,fmt:v=>num(v,0)+' m'},
  {id:'mach',key:'mach',parse:Number,fmt:v=>'M '+num(v,2)}
];
function decorateRange(el) {
  const min=Number(el.min),max=Number(el.max),v=Number(el.value);
  el.style.setProperty('--progress',100*(v-min)/(max-min)+'%');
}
controls.forEach(({id,key,parse,fmt})=>{
  const el=$(id);
  const render=()=>{$(id+'-value').textContent=fmt(inputs[key]);decorateRange(el);};
  el.addEventListener('input',()=>{inputs[key]=parse(Number(el.value));render();updateReadouts();});
  render();
});
$('reset-inputs').addEventListener('click',()=>{
  Object.assign(inputs,DEFAULT_ENGINE);
  controls.forEach(({id,key,fmt})=>{const el=$(id);el.value=key==='throttle'?inputs[key]*100:inputs[key];$(id+'-value').textContent=fmt(inputs[key]);decorateRange(el);});
  updateReadouts();
});
// Airfoil study: a finite-span illustrative foil, not a rotor-cascade polar.
function updateAirfoil() {
  const angle=Number($('aoa').value),speed=Number($('airspeed').value);
  const data=airfoilModel({angle,speed});
  $('aoa-value').textContent=(angle>0?'+':'')+angle+'°';
  $('airspeed-value').textContent=num(speed,0)+' m/s';
  $('foil-group').setAttribute('transform','rotate('+angle+' 326 192)');
  $('cl-value').textContent=num(data.liftCoefficient,3);
  $('cd-value').textContent=num(data.dragCoefficient,3);
  $('q-value').textContent=num(data.dynamicPressure,0);
  $('lift-value').textContent=num(data.lift,0);
  $('flow-indicator').classList.toggle('separated',data.separated);
  $('flow-indicator').innerHTML='<span class="small-orange-dot"></span> '+(data.separated?'SEPARATED FLOW':'ATTACHED FLOW');
  $('aero-visual-caption').textContent=data.separated?'ILLUSTRATIVE STALL · α > 13°':'ATTACHED FLOW REGION';
  $('lift-vector').setAttribute('d','M 326 190 V '+(190-72*Math.sign(data.liftCoefficient||1)*Math.max(.18,Math.min(1,Math.abs(data.liftCoefficient)))));
  $('lift-text').setAttribute('y',data.liftCoefficient>=0?'104':'286');
  $('lift-text').textContent=data.liftCoefficient>=0?'LIFT':'NEGATIVE LIFT';
  let lines='';
  const separated=data.separated;
  for(let i=0;i<11;i++){
    const y=65+i*23;
    const upper=y<190;
    const deflection=(upper?-1:1)*(1-Math.abs(y-190)/180)*28*Math.min(1,Math.abs(angle)/14+.25);
    let d='M 15 '+y+' C 105 '+y+' 135 '+(y+deflection*.35)+' 193 '+(y+deflection);
    if(separated && upper && i>=3 && i<=5) {
      d+=' S 385 '+(y-35)+' 428 '+(y-8)+' Q 488 '+(y+48)+' 620 '+(y+19);
    } else {
      d+=' S 422 '+(y+deflection*.6)+' 625 '+y;
    }
    lines+='<path class="'+(separated&&upper&&i>=3&&i<=5?'separated':'')+'" d="'+d+'"/>';
  }
  $('flow-lines').innerHTML=lines;
  decorateRange($('aoa'));decorateRange($('airspeed'));
}
$('aoa').addEventListener('input',updateAirfoil);
$('airspeed').addEventListener('input',updateAirfoil);
// Rotor-relative velocity-triangle laboratory, based on Euler turbomachinery.
function updateVelocityTriangle() {
  const r = velocityTriangle({
    rpm: Number($('rotor-rpm').value),
    axialSpeed: Number($('axial-speed').value),
    deltaSwirl: Number($('swirl-change').value)
  });
  $('rotor-rpm-value').textContent=num(r.rpm,0)+' rpm';
  $('axial-speed-value').textContent=num(r.axialSpeed,0)+' m/s';
  $('swirl-change-value').textContent=num(r.deltaSwirl,0)+' m/s';
  $('blade-speed-out').textContent=num(r.bladeSpeed,0);
  $('relative-angle-out').textContent=num(r.relativeAngle,1)+'°';
  $('stage-work-out').textContent=num(r.specificWork/1000,1);
  const x=126,y=61,scale=Math.min(.76,192/r.bladeSpeed);
  const dx=r.axialSpeed*scale,dy=r.bladeSpeed*scale;
  const vx=x+dx,wy=y+dy;
  const line=(x1,y1,x2,y2,color,marker)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="3" marker-end="url(#'+marker+')"/>';
  $('triangle-vectors').innerHTML=
    '<line x1="44" y1="61" x2="475" y2="61" stroke="#d8e1dc" stroke-dasharray="4 5"/>'+
    '<line x1="126" y1="32" x2="126" y2="280" stroke="#d8e1dc" stroke-dasharray="4 5"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="4" fill="#2c424d"/>'+
    line(x,y,vx,y,'#527f95','vel-arrow-blue')+
    line(x,y,vx,wy,'#2c424d','vel-arrow-dark')+
    line(vx,wy,vx,y,'#ca653d','vel-arrow-orange')+
    '<text x="'+(x+dx/2)+'" y="'+(y-15)+'" text-anchor="middle" fill="#527f95" font-family="monospace" font-size="12" font-weight="700">Vx = '+num(r.axialSpeed,0)+'</text>'+
    '<text x="'+(vx+15)+'" y="'+(y+dy*.53)+'" fill="#ca653d" font-family="monospace" font-size="12" font-weight="700">U = '+num(r.bladeSpeed,0)+'</text>'+
    '<text x="'+(x+dx*.35-14)+'" y="'+(y+dy*.62+14)+'" fill="#2c424d" font-family="monospace" font-size="12" font-weight="700">W</text>'+
    '<text x="35" y="298" fill="#809397" font-family="monospace" font-size="11">β = arctan(U / Vx) = '+num(r.relativeAngle,1)+'°</text>';
  for(const id of ['rotor-rpm','axial-speed','swirl-change']) decorateRange($(id));
}
for (const id of ['rotor-rpm','axial-speed','swirl-change']) $(id).addEventListener('input',updateVelocityTriangle);

// Interactive knowledge check.
const questions=[
  {q:'Which component supplies the power to turn the compressor?',answers:['The inlet','The turbine, via the shaft','The exhaust nozzle'],correct:1,why:'The turbine extracts work from hot gas, and the shaft transmits that work to the compressor.'},
  {q:'What does a compressor stator primarily do?',answers:['Add fuel','Extract shaft work','Redirect and diffuse the airflow'],correct:2,why:'Stator vanes do not rotate. They remove swirl, guide the next rotor inlet flow and recover static pressure.'},
  {q:'What does a higher airspeed do to dynamic pressure at fixed density?',answers:['Increases it with velocity squared','Leaves it unchanged','Only changes temperature'],correct:0,why:'The definition is q = ½ρV². Double velocity means four times dynamic pressure.'}
];
let quizIndex=0,answered=false,quizScore=0;
function showQuestion(){
  answered=false;
  const q=questions[quizIndex];
  $('quiz-progress').textContent=String(quizIndex+1).padStart(2,'0')+' / 03';
  $('quiz-question').textContent=q.q;
  $('quiz-feedback').textContent='';
  $('quiz-feedback').className='quiz-feedback';
  $('quiz-next').disabled=true;
  $('quiz-next').innerHTML='NEXT QUESTION <span>→</span>';
  $('quiz-choices').innerHTML='';
  q.answers.forEach((answer,i)=>{
    const button=document.createElement('button');
    button.className='quiz-choice';
    button.innerHTML='<span class="choice-letter">'+String.fromCharCode(65+i)+'</span>';
    button.append(document.createTextNode(answer));
    button.addEventListener('click',()=>answerQuestion(i));
    $('quiz-choices').append(button);
  });
}
function answerQuestion(choice){
  if(answered) return;
  answered=true;
  const q=questions[quizIndex];
  const correct=choice===q.correct;
  if(correct) quizScore++;
  document.querySelectorAll('.quiz-choice').forEach((button,i)=>{
    button.disabled=true;
    if(i===choice) button.classList.add('selected',correct?'correct':'incorrect');
    if(i===q.correct&&i!==choice) button.classList.add('selected','correct');
  });
  $('quiz-feedback').textContent=(correct?'Correct. ':'Not quite. ')+q.why;
  $('quiz-feedback').classList.toggle('error',!correct);
  $('quiz-next').disabled=false;
  if(quizIndex===questions.length-1) $('quiz-next').innerHTML='RESTART QUESTIONS <span>↺</span>';
}
$('quiz-next').addEventListener('click',()=>{
  if(!answered) return;
  if(quizIndex===questions.length-1){quizIndex=0;quizScore=0;}
  else quizIndex++;
  showQuestion();
});
// Make navigation state follow sections while scrolling.
const navLinks=Array.from(document.querySelectorAll('.nav-link'));
const sections=navLinks.map(el=>document.querySelector(el.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  const chosen=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!chosen)return;
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+chosen.target.id));
},{rootMargin:'-20% 0px -55% 0px',threshold:[0,.2,.5]});
sections.forEach(s=>navObserver.observe(s));
updateReadouts();
updateAirfoil();
updateVelocityTriangle();
showQuestion();
