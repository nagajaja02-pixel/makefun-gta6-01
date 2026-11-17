import * as T from 'three';
import {personModel} from './pedestrians.js';
export function createPlayer(scene){const mesh=personModel(0xe58453);scene.add(mesh);mesh.position.set(-2,0,0);return {mesh,position:mesh.position,health:100,money:250,car:null,angle:0,jump:0,vy:0,cooldown:0}}
export function updatePlayer(p,dt,input,city,vehicles,pedestrians,crime,audio,camera){
 p.cooldown=Math.max(0,p.cooldown-dt);
 if(input.pressed.has('KeyE')){if(p.car){const v=p.car;p.car=null;p.mesh.visible=true;p.position.copy(v.mesh.position).add(new T.Vector3(3,0,0));p.position.y=0;v.occupied=false;v.ai=false;v.speed=0}else{const v=vehicles.nearest(p.position);if(v){p.car=v;v.occupied=true;v.ai=false;p.mesh.visible=false;crime(1);audio.tone(440,.08,.08)}}}
 if(p.car){p.position.copy(p.car.mesh.position);p.angle=p.car.angle;return}
 const forward=input.axis('KeyW','KeyS'),side=input.axis('KeyA','KeyD');const moving=forward||side;const speed=input.held.has('ShiftLeft')?9:4.5;
 if(moving){const yaw=camera.yaw;let dx=-Math.sin(yaw)*forward-Math.cos(yaw)*side,dz=-Math.cos(yaw)*forward+Math.sin(yaw)*side;const len=Math.hypot(dx,dz);dx/=len;dz/=len;p.angle=Math.atan2(dx,dz);const nx=p.position.x+dx*speed*dt,nz=p.position.z+dz*speed*dt;if(!city.blocked(nx,p.position.z))p.position.x=nx;if(!city.blocked(p.position.x,nz))p.position.z=nz;p.mesh.rotation.y=p.angle;p.mesh.userData.legs.forEach((m,i)=>m.rotation.x=Math.sin(performance.now()*.013+i*Math.PI)*.55)}
 if(input.pressed.has('Space')&&p.position.y<=.01)p.vy=7;p.vy-=19*dt;p.position.y=Math.max(0,p.position.y+p.vy*dt);
 if((input.pressed.has('KeyF')||input.pressed.has('Fire'))&&p.cooldown===0){const gun=input.pressed.has('Fire');p.cooldown=gun?.28:.5;crime(gun?.7:.35);audio.tone(gun?90:150,.09,.15);const dir=new T.Vector3(-Math.sin(camera.yaw),0,-Math.cos(camera.yaw));let best=null,dist=gun?40:3;for(const n of pedestrians.people){const delta=n.mesh.position.clone().sub(p.position);const d=delta.length();if(n.health>0&&d<dist&&delta.normalize().dot(dir)>.78){best=n;dist=d}}if(best){best.health-=gun?60:35;best.scared=8;if(best.health<=0)p.money+=25}
 const end=p.position.clone().addScaledVector(dir,dist);end.y=1.3;const start=p.position.clone();start.y=1.4;const line=new T.Line(new T.BufferGeometry().setFromPoints([start,end]),new T.LineBasicMaterial({color:0xffdc8e}));p.mesh.parent.add(line);setTimeout(()=>{line.parent?.remove(line);line.geometry.dispose();line.material.dispose()},100);
 }
}
