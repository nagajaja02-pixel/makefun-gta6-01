export function createInput(){
 const held=new Set(), pressed=new Set();let drag=false,dx=0,dy=0;
 addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(!held.has(e.code))pressed.add(e.code);held.add(e.code)});
 addEventListener('keyup',e=>held.delete(e.code));addEventListener('blur',()=>held.clear());
 addEventListener('mousedown',e=>{if(e.target.tagName==='BUTTON')return;drag=true;pressed.add('Fire')});addEventListener('mouseup',()=>drag=false);
 addEventListener('mousemove',e=>{if(drag){dx+=e.movementX;dy+=e.movementY}});
 return {held,pressed,axis(a,b){return Number(held.has(a))-Number(held.has(b))},mouse(){const v=[dx,dy];dx=dy=0;return v},end(){pressed.clear()}};
}
