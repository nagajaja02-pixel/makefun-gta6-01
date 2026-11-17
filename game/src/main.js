import * as T from 'three';
import {makeCity} from './city.js';
import {createVehicles} from './vehicles.js';
import {createPedestrians} from './pedestrians.js';
import {createPlayer,updatePlayer} from './player.js';
import {createPolice} from './police.js';
import {createMissions} from './missions.js';
import {createHUD} from './hud.js';
import {createAudio} from './audio.js';
import {saveGame,loadGame} from './save.js';
import {createInput} from './input.js';
import {createCamera} from './camera.js';
const query=new URLSearchParams(location.search),shot=query.get('shot');
const renderer=new T.WebGLRenderer({canvas:document.getElementById('world'),antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
const scene=new T.Scene();scene.background=new T.Color(0xa4d5df);scene.fog=new T.Fog(0xa4d5df,110,320);scene.add(new T.HemisphereLight(0xd5efff,0xd2a57d,2.3));const sun=new T.DirectionalLight(0xffe5b7,3.2);sun.position.set(-65,100,45);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-110,right:110,top:110,bottom:-110,near:1,far:250});sun.shadow.bias=-.0006;scene.add(sun);scene.add(sun.target);
const city=makeCity(scene,Number(query.get('seed'))||7),vehicles=createVehicles(scene,city),pedestrians=createPedestrians(scene),player=createPlayer(scene),police=createPolice(vehicles),missions=createMissions(scene,vehicles,police),input=createInput(),view=createCamera(),audio=createAudio(),hud=createHUD();
let playing=false,paused=false,time=0,last=performance.now(),saveTimer=0,missionInfo,previousStage=0;
function enter(){playing=true;paused=false;document.body.className='playing';audio.start();hud.toast('PORT SOLENNE / YOUR FREQUENCY, YOUR RULES')}
document.getElementById('play').onclick=enter;document.getElementById('load').onclick=()=>{if(loadGame(player,missions))enter();else{enter();hud.toast('NO SAVE YET — STARTING A NEW STORY')}};document.getElementById('help').onclick=()=>{document.getElementById('instructions').hidden=!document.getElementById('instructions').hidden};
if(shot){playing=shot!=='start';document.body.className=playing?'playing':'';if(shot==='chase'){player.car=vehicles.starter;player.mesh.visible=false;vehicles.starter.mesh.position.set(0,0,18);player.position.copy(vehicles.starter.mesh.position);vehicles.starter.speed=23;missions.stage=3;police.heat=3;for(const [x,z] of [[-4,5],[4,-4]]){const v=vehicles.spawn(x,z,0,true);police.units.push(v)}view.yaw=.3}else if(shot==='mission'){player.position.set(41,0,6);missions.stage=1;view.yaw=2.5}else if(shot==='foot'){player.position.set(9,0,3);view.yaw=2.7}else{player.position.set(4,0,12);view.yaw=2.35}}
function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;const active=playing&&!paused&&!shot;if(input.pressed.has('Escape')&&playing){paused=!paused;document.body.className=paused?'paused':'playing';document.getElementById('play').textContent='RESUME THE CITY';document.getElementById('play').onclick=()=>{paused=false;document.body.className='playing'}}
 if(active){time+=dt;updatePlayer(player,dt,input,city,vehicles,pedestrians,police.crime,audio,view);vehicles.update(dt,player,input,police.crime,audio);pedestrians.update(dt,player,police.crime);police.update(dt,player,time);audio.update(dt,player,input);saveTimer+=dt;if(input.pressed.has('KeyP')||saveTimer>30){saveTimer=0;hud.toast(saveGame(player,missions)?'SAVED / FREQUENCY SECURED':'SAVE UNAVAILABLE')}
 if(player.health<=0){player.health=100;player.money=Math.max(0,player.money-150);player.car=null;player.mesh.visible=true;player.position.set(-2,0,0);police.heat=0;hud.toast('PATCHED UP / $150 CLINIC FEE')}
 }
 missionInfo=missions.update(active?dt:0,player,input,time);if(missionInfo.stage!==previousStage){previousStage=missionInfo.stage;hud.toast('CONTRACT UPDATED / PAYMENT RECEIVED');audio.tone(660,.3,.1)}
 if(shot)police.update(0,player,1.3);view.update(shot?.05:dt,player,input,!!shot||!playing);if(shot==='start'){view.camera.position.set(80,65,110);view.camera.lookAt(0,0,0)};hud.update(dt,player,police,missionInfo,vehicles,time);renderer.render(scene,view.camera);input.end();requestAnimationFrame(frame);
}
addEventListener('resize',()=>renderer.setSize(innerWidth,innerHeight));requestAnimationFrame(frame);
window.sunbreak={player,vehicles,police,missions,scene,view,get mission(){return missionInfo},get playing(){return playing},enter};
