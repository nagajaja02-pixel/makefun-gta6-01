import * as T from 'three';
const bodyGeometries=new Map(),bodyMaterials=new Map();
function cachedMaterial(c){if(!bodyMaterials.has(c))bodyMaterials.set(c,new T.MeshStandardMaterial({color:c,metalness:.2,roughness:.55}));return bodyMaterials.get(c)}
function cachedBox(w,h,d){const k=[w,h,d].join(',');if(!bodyGeometries.has(k))bodyGeometries.set(k,new T.BoxGeometry(w,h,d));return bodyGeometries.get(k)}
export function carModel(color,police=false){
 const g=new T.Group();const paint=cachedMaterial(color);
 const part=(w,h,d,x,y,z,c)=>{const m=new T.Mesh(cachedBox(w,h,d),c?.isMaterial?c:cachedMaterial(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
 part(2.15,.7,4.4,0,.8,0,paint);part(1.85,.65,2.1,0,1.4,-.12,0x244854);part(1.7,.48,1.85,0,1.47,-.12,0x244854);part(1.9,.12,2.05,0,1.81,-.12,police?0xf5f0db:paint);
 part(2.05,.18,.16,0,.6,2.23,0xc6cabc);part(2.05,.18,.16,0,.6,-2.23,0xc6cabc);
 for(const x of [-.74,.74]){part(.5,.2,.07,x,.9,2.25,0xffedb0);part(.5,.2,.07,x,.9,-2.25,0xe55f46)}
 for(const x of [-1.05,1.05])for(const z of [-1.35,1.35]){const wheel=new T.Mesh(new T.CylinderGeometry(.46,.46,.26,12),new T.MeshStandardMaterial({color:0x20363c}));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.47,z);wheel.castShadow=true;g.add(wheel);part(.05,.3,.3,x*1.15,.47,z,0xb7c9c1)}
 if(police){part(2.18,.45,2.4,0,.95,0,0xf4ecd9);g.userData.red=part(.65,.17,.45,-.45,1.98,0,0xff4d4d);g.userData.blue=part(.65,.17,.45,.45,1.98,0,0x58aaff);g.userData.red.material=g.userData.red.material.clone();g.userData.blue.material=g.userData.blue.material.clone()}
 return g;
}
export function createVehicles(scene,city){
 const cars=[];const colors=[0xe57d52,0xeee2b4,0x69b4ad,0xd4af60,0x787f9b,0xcbd6bc];
 function spawn(x,z,angle=0,police=false,color=colors[cars.length%colors.length]){const mesh=carModel(color,police);mesh.position.set(x,0,z);mesh.rotation.y=angle;scene.add(mesh);const v={mesh,speed:0,angle,police,occupied:false,ai:false,hp:100,turn:0};cars.push(v);return v}
 const starter=spawn(-4,5,0,false,0xeb8d59);starter.name='Cinder Coupe';
 const target=spawn(46,12,Math.PI,false,0xf6c86a);target.name='Saffron GT';
 for(let i=0;i<22;i++){const r=(i%7-3)*42;const v=spawn(r+(i%2?3.7:-3.7),-145+(i*29)%290,i%2?0:Math.PI);v.ai=true;v.speed=7+i%4}
 for(let i=0;i<12;i++)spawn(-130+i*24,11,Math.PI/2);
 function update(dt,player,input,crime,audio){
 for(const v of cars){if(v.police)continue;const old=v.mesh.position.clone();
 if(player.car===v){const throttle=input.axis('KeyW','KeyS');v.speed+=throttle*20*dt;v.speed*=Math.pow(input.held.has('Space')?.12:.985,dt*60);v.speed=T.MathUtils.clamp(v.speed,-12,38);v.angle+=input.axis('KeyA','KeyD')*dt*v.speed*.042;v.mesh.rotation.y=v.angle;
 if(input.pressed.has('KeyH'))audio.tone(210,.4,.2);if(input.held.has('Space')&&Math.abs(v.speed)>10)skid(v);
 }else if(v.ai){v.speed=9; if(Math.abs(v.mesh.position.z)>173){v.angle+=Math.PI;v.mesh.rotation.y=v.angle}}
 else continue;
 v.mesh.position.x+=Math.sin(v.angle)*v.speed*dt;v.mesh.position.z+=Math.cos(v.angle)*v.speed*dt;
 if(city.blocked(v.mesh.position.x,v.mesh.position.z,1.3)){v.mesh.position.copy(old);if(player.car===v){if(Math.abs(v.speed)>12){player.health-=Math.abs(v.speed)*.08;audio.tone(65,.12,.12)}v.speed*=-.25}else{v.angle+=Math.PI/2;v.mesh.rotation.y=v.angle}}
 }
 for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++){const a=cars[i],b=cars[j];if(a.mesh.position.distanceTo(b.mesh.position)<3.4&&player.car&&(a===player.car||b===player.car)){const v=player.car;if(Math.abs(v.speed)>8){crime(.55);audio.tone(80,.08,.1)}v.speed*=-.3;v.mesh.position.addScaledVector(new T.Vector3(Math.sin(v.angle),0,Math.cos(v.angle)),-1)}}
 }
 let skidCount=0;function skid(v){if(skidCount++%6)return;const m=new T.Mesh(new T.PlaneGeometry(.15,1.4),new T.MeshBasicMaterial({color:0x34484c,transparent:true,opacity:.45}));m.rotation.x=-Math.PI/2;m.rotation.z=-v.angle;m.position.copy(v.mesh.position);m.position.y=.07;scene.add(m);setTimeout(()=>{scene.remove(m);m.geometry.dispose();m.material.dispose()},9000)}
 return {cars,starter,target,spawn,update,nearest(p){let best=null,d=5;for(const v of cars){const n=v.mesh.position.distanceTo(p);if(!v.police&&n<d){d=n;best=v}}return best}};
}
