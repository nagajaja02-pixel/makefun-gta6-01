const key='sunbreak-solenne-save-v1';
export function saveGame(p,missions){try{localStorage.setItem(key,JSON.stringify({version:1,x:p.position.x,z:p.position.z,money:p.money,stage:missions.stage}));return true}catch{return false}}
export function loadGame(p,missions){try{const d=JSON.parse(localStorage.getItem(key));if(d?.version!==1)return false;p.car=null;p.mesh.visible=true;p.position.set(Number(d.x)||0,0,Number(d.z)||0);p.money=Number(d.money)||250;p.health=100;missions.stage=d.stage;return true}catch{return false}}
