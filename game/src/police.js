import * as T from 'three';
export function createPolice(vehicles){let heat=0,lastCrime=0,escape=0;const units=[];function crime(amount){heat=Math.min(5,heat+amount);lastCrime=0;escape=0}
 function update(dt,p,time){lastCrime+=dt;const stars=Math.ceil(heat);while(units.length<Math.min(5,stars+1)&&stars>0){const i=units.length;const v=vehicles.spawn(p.position.x+(i%2?8:-8),Math.max(-170,p.position.z-35-i*12),0,true);units.push(v)}
 let nearest=999;for(const v of units){v.mesh.visible=stars>0;const pos=v.mesh.position,delta=p.position.clone().sub(pos);const d=delta.length();nearest=Math.min(nearest,d);const lane=n=>Math.round(n/42)*42;
 const waypoint=p.position.clone();
 const onVertical=Math.abs(pos.x-lane(pos.x))<8;
 if(onVertical&&Math.abs(delta.x)>14){waypoint.x=pos.x;waypoint.z=lane(pos.z);if(Math.abs(waypoint.z-pos.z)<3){waypoint.x=lane(p.position.x);waypoint.z=lane(pos.z)}}
 else if(!onVertical&&Math.abs(delta.z)>14){waypoint.x=lane(pos.x);waypoint.z=pos.z;if(Math.abs(waypoint.x-pos.x)<3){waypoint.x=lane(pos.x);waypoint.z=lane(p.position.z)}}
 const desired=Math.atan2(waypoint.x-pos.x,waypoint.z-pos.z);v.angle+=T.MathUtils.euclideanModulo(desired-v.angle+Math.PI,Math.PI*2)-Math.PI;v.mesh.rotation.y=v.angle;
 if(stars&&d>4){const speed=Math.min(22,10+stars*3);const nx=pos.x+Math.sin(v.angle)*speed*dt,nz=pos.z+Math.cos(v.angle)*speed*dt;pos.x=T.MathUtils.clamp(nx,-177,177);pos.z=T.MathUtils.clamp(nz,-177,177)}
 if(stars&&d<4){p.health-=dt*5;if(p.car)p.car.speed*=.98}
 v.mesh.userData.red.material.emissive.setHex(Math.sin(time*12)>0?0xff2222:0x220000);v.mesh.userData.blue.material.emissive.setHex(Math.sin(time*12)<0?0x2266ff:0x000022);
 }
 if(stars){if(nearest>48||lastCrime>22)escape+=dt;else escape=Math.max(0,escape-dt*.2);if(escape>12){heat=Math.max(0,heat-1);escape=0}}else for(const v of units)v.mesh.visible=false;
 }
 return {crime,update,get heat(){return heat},set heat(v){heat=v;lastCrime=0;escape=0},get escape(){return escape},units};
}
