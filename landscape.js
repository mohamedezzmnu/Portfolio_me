/* Pixel-landscape background: original 2D canvas smooth anti-aliased art drawn at full resolution.
   Layers: dithered sky, stars or birds, crescent moon or sun, drifting pixel clouds, horizon, water with
   shimmering streaks, swaying reeds. Re-themed by palette and light/dark. Written from scratch. */
(function(){
const SCENES={
 'nile-silt':{
  dark:{sky:['#060504','#0b0908','#120f0b','#191410'],water:['#17130e','#0e0b08','#080706'],cloud:['#2c1c10','#5e3a22','#a5713f'],orb:'#f3ede4',reed:'#d4a359',streak:'#e8c890'},
  light:{sky:['#9fb2c4','#c4d0d6','#e2dccb','#ecdcc0'],water:['#8fa5ae','#6e8391','#56727c'],cloud:['#c4a37e','#e0c49c','#f9efdb'],orb:'#ffc35c',reed:'#b98a35',streak:'#fff3cf'}},
 'deep-moss':{
  dark:{sky:['#060a08','#0b100d','#101a15','#16281f'],water:['#12241e','#08120e'],cloud:['#1b261f','#364636','#7c8f6c'],orb:'#eaf0ec',reed:'#cbb894',streak:'#cfe0d2'},
  light:{sky:['#9bb2a4','#c1d1c4','#dde5d3','#e4e8d4'],water:['#82988a','#5c7365'],cloud:['#a9b6a3','#c8d2c0','#e9eee0'],orb:'#ffe9a8',reed:'#8a7748',streak:'#fbf3d4'}},
 'basalt':{
  dark:{sky:['#0a0808','#0e0c0c','#1a1315','#2a1c20'],water:['#1c1822','#0c0a10'],cloud:['#331f1c','#663a33','#c0634f'],orb:'#f2ede8',reed:'#e07a5f',streak:'#f0b8a4'},
  light:{sky:['#a98d9d','#c9a5ae','#e6bfb8','#f0cdb8'],water:['#96869b','#6f6479'],cloud:['#c09aa0','#dcb4b4','#f6dcd0'],orb:'#ffd2a0',reed:'#b84b30',streak:'#ffd9bf'}},
 'nocturne':{
  dark:{sky:['#05080e','#0a0d14','#101828','#182640'],water:['#101a30','#070c18'],cloud:['#1b2434','#31446a','#6c8bb4'],orb:'#eef2f8',reed:'#8fb89f',streak:'#c4d6ee'},
  light:{sky:['#97aac4','#bccadc','#dbe3ec','#e6e9ee'],water:['#758ca6','#526882'],cloud:['#a5b3c8','#c5d0de','#e7edf4'],orb:'#ffe9a8',reed:'#5d8468',streak:'#fff6d8'}}
};
const cv=document.querySelector('.pixel-landscape-canvas');if(!cv)return;
cv.style.imageRendering='auto';
const ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const css=(c,a)=>a===undefined?`rgb(${c[0]},${c[1]},${c[2]})`:`rgba(${c[0]},${c[1]},${c[2]},${a})`;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let pal='nile-silt',mode='dark',S=SCENES[pal][mode];
let W=0,H=0,K=1,HY=0,orb={x:0,y:0,r:10},cloudBand=[0,0];
let blades=[],stars=[],streaks=[],birds=[],clouds=[],cloudSprites=[];
let veil=null,veilT0=0,veilDur=0,introT0=-1,raf=0,last=0;
const off=document.createElement('canvas'),octx=off.getContext('2d');
const snap=document.createElement('canvas'),sctx=snap.getContext('2d');
function layoutAnchors(){
  const stacked=W<1200||W/H<0.95;
  const sy=scrollY;
  if(H<560&&stacked){
    orb={x:W-34,y:H*.5,r:Math.max(9,Math.min(16,H*.04))};cloudBand=[H*.01,H*.05];HY=Math.round(H*.84);return;
  }
  if(stacked){
    const ic=document.querySelector('.icons'),tb=document.querySelector('.tabs'),dock=document.querySelector('.dock');
    let top=H*.2,bot=H*.55;
    if(ic&&tb){const a=ic.getBoundingClientRect(),b=tb.getBoundingClientRect();
      if(b.top>a.bottom){top=a.bottom+sy;bot=b.top+sy;}}
    if(bot>H)bot=H*.7;
    const gap=Math.max(40,bot-top);
    orb={x:W*.5,y:top+gap*.5,r:Math.max(10,Math.min(W*.075,gap*.32,34))};
    cloudBand=[top+gap*.12,bot-gap*.12];
  }else{
    orb={x:W*(mode==='light'?.62:.5),y:H*.15,r:Math.max(14,Math.min(30,H*.035))};
    cloudBand=[H*.04,H*.17];
  }
  HY=Math.round(Math.min(H*.8,Math.max(H*.64,(stacked?cloudBand[1]+18:0))));
}

function build(){
  W=innerWidth;H=innerHeight;K=Math.min(devicePixelRatio||1,1.5);
  for(const c of [cv,off,snap]){c.width=Math.round(W*K);c.height=Math.round(H*K)}
  layoutAnchors();
  const R=rng(20261126);
  /* static sky and water: smooth gradients */
  octx.setTransform(K,0,0,K,0,0);
  const sk=S.sky.map(hex),wt=S.water.map(hex);
  let g=octx.createLinearGradient(0,0,0,HY);
  sk.forEach((c,i)=>g.addColorStop(i/(sk.length-1),css(c)));
  octx.fillStyle=g;octx.fillRect(0,0,W,HY+1);
  g=octx.createLinearGradient(0,HY,0,H);
  wt.forEach((c,i)=>g.addColorStop(wt.length>1?i/(wt.length-1):0,css(c)));
  octx.fillStyle=g;octx.fillRect(0,HY,W,H-HY);
  /* soft glow around the orb, baked into the sky */
  const orbC=hex(S.orb);
  g=octx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,orb.r*6);
  g.addColorStop(0,css(orbC,mode==='light'?.38:.16));g.addColorStop(.35,css(orbC,mode==='light'?.14:.06));g.addColorStop(1,css(orbC,0));
  octx.save();octx.beginPath();octx.rect(0,0,W,HY);octx.clip();octx.fillStyle=g;octx.fillRect(orb.x-orb.r*6,orb.y-orb.r*6,orb.r*12,orb.r*12);octx.restore();
  /* horizon haze */
  g=octx.createLinearGradient(0,HY-H*.07,0,HY);
  const hz=hex(S.streak);g.addColorStop(0,css(hz,0));g.addColorStop(1,css(hz,mode==='light'?.22:.07));
  octx.fillStyle=g;octx.fillRect(0,HY-H*.07,W,H*.07);
  stars=[];const ns=Math.round(W*HY/9000);
  for(let i=0;i<ns;i++)stars.push({x:R()*W,y:R()*HY*.85,r:.5+R()*.9,p:R()*6.28,s:.3+R()*.5,sp:R()<.07});
  birds=[];for(let i=0;i<4;i++)birds.push({x:R()*W,y:cloudBand[0]*(.2+R()*.6)+8,v:9+R()*8,p:R()*6});
  cloudSprites=[];clouds=[];
  const nc=W<700?2:3;
  for(let i=0;i<nc;i++){
    const cw=W<700?W*(.4+R()*.2):W*(.1+R()*.07),ch=Math.max(26,cw*(.28+R()*.08));
    cloudSprites.push(makeCloud(cw,ch,R));
    const band=cloudBand[1]-cloudBand[0];
    clouds.push({i,x:R()*W,y:cloudBand[0]+band*(i/(nc-.4))+(R()-.5)*8,v:6+R()*9});
  }
  streaks=[];const ns2=Math.round(W/22);
  for(let i=0;i<ns2;i++){
    const near=R()<.55;const cx=near?orb.x+(R()-.5)*W*.22:R()*W;
    streaks.push({x:cx,y:HY+4+Math.pow(R(),1.5)*(H-HY)*.55,w:14+R()*(near?70:36),p:R()*6.28,v:(R()-.5)*8,a:near?.5:.26});
  }
  blades=[];const nb=Math.round(Math.min(380,W*.42));
  for(let i=0;i<nb;i++){
    const layer=i%3,x=R()*W;
    const hmax=Math.min(H*(H<560?.1:.3),(W<700?150:260)*(layer===0?.55:layer===1?.8:1.05));
    blades.push({x,h:hmax*(.45+R()*.55),layer,p:R()*6.28,lean:(R()-.5)*8,seed:R()<.2,w:.9+layer*.35});
  }
  blades.sort((a,b)=>a.layer-b.layer);
}
function makeCloud(w,h,R){
  const m=h*.5,c=document.createElement('canvas');c.width=Math.ceil((w+2*m)*K);c.height=Math.ceil((h+2*m)*K);c._m=m;
  const g=c.getContext('2d');g.setTransform(K,0,0,K,m*K,m*K);
  const cl=S.cloud.map(hex);
  const n=7+Math.floor(R()*3),puffs=[];
  for(let i=0;i<n;i++){const t=(i+.5)/n,bump=Math.sin(t*Math.PI);
    puffs.push({x:w*(.1+.8*t),y:h*(.66-.34*bump*(.55+R()*.45)),r:h*(.26+.2*bump*(.5+R()*.5))});}
  /* body: dark base, then mid, then light tops, all with soft radial edges */
  const layers=[[cl[0],0,.8],[cl[1],-.18,.7],[cl[2],-.34,.5]];
  for(const [col,dy,sc] of layers){
    for(const p of puffs){
      const r=p.r*(.8+sc*.35),cy=p.y+dy*p.r;
      const rg=g.createRadialGradient(p.x,cy,0,p.x,cy,r);
      rg.addColorStop(0,css(col,.97));rg.addColorStop(.72,css(col,.9));rg.addColorStop(1,css(col,0));
      g.fillStyle=rg;g.fillRect(p.x-r,cy-r,r*2,r*2);
    }
  }
  /* soft flat underside */
  g.globalCompositeOperation='destination-out';
  const fg=g.createLinearGradient(0,h*.72,0,h*.84);fg.addColorStop(0,'rgba(0,0,0,0)');fg.addColorStop(1,'rgba(0,0,0,1)');
  g.fillStyle=fg;g.fillRect(-m,h*.72,w+2*m,h);
  return c;
}
function frame(now){
  const t=now/1000,day=mode==='light';
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
  ctx.drawImage(off,0,0);
  ctx.setTransform(K,0,0,K,0,0);
  const orbC=hex(S.orb),streakC=hex(S.streak),reedC=hex(S.reed);
  if(!day){
    for(const s of stars){const a=.3+.7*(.5+.5*Math.sin(t*s.s+s.p));
      ctx.fillStyle=`rgba(243,237,228,${(a*.9).toFixed(2)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill();
      if(s.sp&&a>.6){ctx.strokeStyle=`rgba(243,237,228,${(a*.6).toFixed(2)})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(s.x-4,s.y);ctx.lineTo(s.x+4,s.y);ctx.moveTo(s.x,s.y-4);ctx.lineTo(s.x,s.y+4);ctx.stroke()}}
  }else{
    ctx.strokeStyle='rgba(70,64,70,.55)';ctx.lineWidth=1.3;ctx.lineCap='round';
    for(const b of birds){const x=(((b.x-t*b.v)%(W+40))+W+40)%(W+40)-20,y=b.y+Math.sin(t+b.p)*3,f=Math.sin(t*3+b.p)*2.2;
      ctx.beginPath();ctx.moveTo(x-6,y-f);ctx.quadraticCurveTo(x-3,y-3-f,x,y);ctx.quadraticCurveTo(x+3,y-3-f,x+6,y-f);ctx.stroke()}
  }
  /* clouds (behind the orb disc) */
  for(const c of clouds){const sp=cloudSprites[c.i],m=sp._m,w=sp.width/K,span=W+w;
    const x=((c.x-t*c.v)%span+span)%span-w;
    ctx.drawImage(sp,x-m,c.y-m,w,sp.height/K)}
  /* orb */
  const r=orb.r;
  if(day){
    const rg=ctx.createRadialGradient(orb.x-r*.25,orb.y-r*.25,0,orb.x,orb.y,r);
    rg.addColorStop(0,css(mix(orbC,[255,255,255],.55)));rg.addColorStop(.7,css(orbC));rg.addColorStop(1,css(mix(orbC,[255,150,60],.25)));
    ctx.fillStyle=rg;ctx.beginPath();ctx.arc(orb.x,orb.y,r,0,6.283);ctx.fill();
  }else{
    ctx.save();ctx.beginPath();ctx.arc(orb.x,orb.y,r,0,6.283);ctx.clip();
    ctx.beginPath();ctx.rect(orb.x-r*2,orb.y-r*2,r*4,r*4);ctx.arc(orb.x+r*.5,orb.y-r*.2,r*.92,0,6.283);
    const rg=ctx.createLinearGradient(orb.x-r,orb.y,orb.x+r*.4,orb.y);rg.addColorStop(0,css(orbC));rg.addColorStop(1,css(mix(orbC,[200,190,170],.4)));
    ctx.fillStyle=rg;ctx.fill('evenodd');ctx.restore();
  }
  /* water streaks */
  const sc=day?[255,243,207]:streakC;
  ctx.lineCap='round';ctx.lineWidth=1.4;
  for(const s of streaks){const a=s.a*(.5+.5*Math.sin(t*1.3+s.p));
    const x=s.x+Math.sin(t*.4+s.p)*s.v*3-s.w/2;
    const lg=ctx.createLinearGradient(x,0,x+s.w,0);lg.addColorStop(0,css(sc,0));lg.addColorStop(.5,css(sc,a.toFixed(2)));lg.addColorStop(1,css(sc,0));
    ctx.fillStyle=lg;ctx.fillRect(x,s.y,s.w,1.4)}
  /* horizon line */
  ctx.fillStyle=css(sc,.2);ctx.fillRect(0,HY,W,1);
  /* reeds: anti-aliased curved strokes */
  ctx.lineCap='round';
  for(const b of blades){
    const dark=b.layer===0?.55:b.layer===1?.78:1;
    const base=mix([0,0,0],reedC,dark);
    const sw=Math.sin(t*.8+b.x*.02+b.p)*10+b.lean*3;
    const x0=b.x,y0=H+4,x1=b.x+sw,y1=H-b.h;
    const cx=b.x+sw*.15+b.lean,cy=H-b.h*.55;
    const lg=ctx.createLinearGradient(0,H,0,y1);
    lg.addColorStop(0,css([8,6,4]));lg.addColorStop(.18,css(mix([8,6,4],base,.55)));lg.addColorStop(1,css(base));
    ctx.strokeStyle=lg;ctx.lineWidth=b.w;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke();
    if(b.seed){ctx.fillStyle=css(mix([30,20,8],reedC,.9));ctx.beginPath();ctx.ellipse(x1,y1-3,1.6,5,sw*.01,0,6.283);ctx.fill()}
  }
  /* theme / intro veil */
  ctx.setTransform(1,0,0,1,0,0);
  if(introT0>=0){const a=1-Math.min(1,(now-introT0)/1200);if(a>0){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(0,0,cv.width,cv.height)}else introT0=-1}
  if(veil){const a=1-Math.min(1,(now-veilT0)/veilDur);if(a>0){ctx.globalAlpha=a;ctx.drawImage(snap,0,0);ctx.globalAlpha=1}else veil=null}
}
function loop(now){raf=requestAnimationFrame(loop);if(now-last<33)return;last=now;frame(now)}
function start(){cancelAnimationFrame(raf);build();if(reduce){frame(performance.now());return}raf=requestAnimationFrame(loop)}
window.landscape={
  set(p,m){
    if(p===pal&&m===mode)return;
    if(!reduce&&W){sctx.setTransform(1,0,0,1,0,0);sctx.clearRect(0,0,snap.width,snap.height);sctx.drawImage(cv,0,0);veil=true;veilT0=performance.now();veilDur=700}
    pal=p;mode=m;S=SCENES[pal][mode];start();
  },
  intro(){if(!reduce)introT0=performance.now()},
  relayout(){const a=orb.x+','+orb.y;layoutAnchors();if(orb.x+','+orb.y!==a)start()}
};
let rt,lw=innerWidth,lh=innerHeight;
addEventListener('resize',()=>{if(innerWidth===lw&&Math.abs(innerHeight-lh)<200)return;lw=innerWidth;lh=innerHeight;clearTimeout(rt);rt=setTimeout(start,150)});
document.addEventListener('visibilitychange',()=>{if(reduce)return;if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(loop)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>setTimeout(()=>window.landscape.relayout(),50));
addEventListener('load',()=>setTimeout(()=>window.landscape.relayout(),200));
start();
})();
