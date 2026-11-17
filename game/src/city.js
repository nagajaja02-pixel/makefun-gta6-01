import * as T from 'three';
export const roads=Array.from({length:9},(_,i)=>(i-4)*42);
export const obstacles=[];
const palette=[0xeecfa2,0xf3a58b,0xb6d6c6,0xe3d8b9,0xf1bf79,0x9bc5c9];
export function makeCity(scene,seed=7){
 let n=seed;const rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296};
 const materials=new Map();const mat=(c)=>{if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.85}));return materials.get(c)};
 const geo=new T.BoxGeometry(1,1,1);const batches=new Map();
 function box(x,y,z,w,h,d,c,solid=false){if(!batches.has(c))batches.set(c,[]);batches.get(c).push([x,y,z,w,h,d]);if(solid)obstacles.push({x,z,w:w/2,d:d/2});}
 box(0,-.7,0,430,1,430,0xd6c9a2);box(241,-1,0,60,1,600,0x4caeb5);
 for(const r of roads){box(r,-.08,0,15,.2,360,0x52666b);box(0,-.07,r,360,.2,15,0x52666b);
 for(let p=-175;p<176;p+=7){if(roads.every(q=>Math.abs(p-q)>9)){box(r,.04,p,.14,.025,2.8,0xffe7aa);box(p,.04,r,2.8,.025,.14,0xffe7aa)}}}
 for(let ix=0;ix<8;ix++)for(let iz=0;iz<8;iz++){
 const x=-147+ix*42,z=-147+iz*42;box(x,.05,z,27, .35,27,0xe7ddbf);
 const park=(ix===4&&iz===3)||(ix===6&&iz===5);
 if(park){box(x,.28,z,24,.2,24,0x95b77b);for(let k=0;k<6;k++)tree(x+(rand()-.5)*20,z+(rand()-.5)*20);continue}
 const h=8+rand()*22+(ix<3?rand()*18:0),c=palette[Math.floor(rand()*palette.length)];
 const w=17+rand()*5,d=16+rand()*5;box(x,h/2+.25,z,w,h,d,c,true);box(x,h+.5,z,w+1,.6,d+1,0xf7e3be);
 box(x,h+1.2,z,6,1.5,5,0x849898);
 for(let floor=3;floor<h-1;floor+=3.5)for(let a=-6;a<=6;a+=3){box(x+a,floor,z+d/2+.02,1.5,1.9,.1,0x477d86);box(x+w/2+.02,floor,z+a,.1,1.9,1.5,0x477d86)}
 box(x,2,z-d/2-.2,w+1,.4,2,ix%2?0xdf7f66:0x3f9990);
 for(const sx of [-1,1]){tree(x+sx*12.1,z-12);lamp(x+sx*13,z+12)}
 }
 function tree(x,z){box(x,2.6,z,.45,5,.45,0x977452);const crown=new T.Group();crown.position.set(x,5.2,z);for(let a=0;a<7;a++){const leaf=new T.Mesh(new T.ConeGeometry(1.1,5,3),mat(a%2?0x4c947b:0x68a67c));leaf.rotation.z=1.05;leaf.rotation.y=a*Math.PI*2/7;leaf.position.set(Math.sin(a*6.28/7)*1.2,.2,Math.cos(a*6.28/7)*1.2);crown.add(leaf)}scene.add(crown)}
 function lamp(x,z){box(x,3,z,.14,6,.14,0x3e666a);box(x+.7,6,z,1.7,.12,.12,0x3e666a);box(x+1.4,5.95,z,.65,.13,.4,0xffecc5)}
 // Seafront promenade and distant sailing silhouettes.
 box(194,.2,0,15,.5,360,0xf4e0b7);for(let z=-160;z<=160;z+=12){tree(192,z);box(202,1,z,.15,2,.15,0xffffff)}
 for(let z=-100;z<160;z+=70){box(235,.2,z,2,.5,9,0xffffff);const sail=new T.Mesh(new T.ConeGeometry(3,10,3),mat(0xfff0cf));sail.position.set(235,5,z);scene.add(sail)}
 for(const [c,arr] of batches){const mesh=new T.InstancedMesh(geo,mat(c),arr.length);const dummy=new T.Object3D();arr.forEach((a,i)=>{dummy.position.set(a[0],a[1],a[2]);dummy.scale.set(a[3],a[4],a[5]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.receiveShadow=true;mesh.castShadow=c!==0x52666b;scene.add(mesh)}
 const names=[['SOLENNE',-21,10,-35],['PALM HOTEL',21,13,49],['MARÉ MARKET',-63,8,49],['SUNDIAL AUTO',63,6,7],['RADIO 88.4',21,17,-77]];
 for(const [name,x,y,z] of names){const can=document.createElement('canvas');can.width=512;can.height=96;const ctx=can.getContext('2d');ctx.fillStyle='#264e52';ctx.fillRect(0,0,512,96);ctx.fillStyle='#ffdda0';ctx.font='bold 45px Arial';ctx.textAlign='center';ctx.fillText(name,256,64);const sign=new T.Mesh(new T.PlaneGeometry(13,2.4),new T.MeshBasicMaterial({map:new T.CanvasTexture(can),side:T.DoubleSide}));sign.position.set(x,y,z);scene.add(sign)}
 // Combine repeated palm fronds and boat sails into static GPU batches.
 scene.updateMatrixWorld(true);
 const clusters=new Map(), originals=[];
 scene.traverse(m=>{if(m.isMesh&&!m.isInstancedMesh&&!m.material.map){const key=m.geometry.type+JSON.stringify(m.geometry.parameters)+m.material.color.getHex();if(!clusters.has(key))clusters.set(key,[]);clusters.get(key).push(m);originals.push(m)}});
 for(const list of clusters.values()){const batch=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((m,i)=>batch.setMatrixAt(i,m.matrixWorld));batch.castShadow=true;scene.add(batch)}
 for(const m of originals)m.parent.remove(m);
 return {blocked(x,z,r=.5){return Math.abs(x)>181||Math.abs(z)>181||obstacles.some(o=>Math.abs(x-o.x)<o.w+r&&Math.abs(z-o.z)<o.d+r)}};
}
