/* Mohamed Ezz — portfolio background scene. Original code.
   Smooth (non-pixelated) 2D canvas rendering of the full spec scene:
   sky bands + glow, stars, shooting stars, crescent moon / sun with arcs,
   lit framing clouds + travelers, sea with waves / reflection / glitter column,
   fish school, U-shaped 3-tier grass with wind + cursor repulsion,
   splash ripples + droplets, mouse parallax, intro drop-and-reveal. */
(function(){
'use strict';
/* 16 scene colors per palette, night + day */
const KEYS=['skyTop','skyMid','skyLow','cloudHi','cloudLit','cloudShad','moon','sun','seaTop','seaMid','seaDeep','seaGlint','grassBack','grassMid','grassFront','grassTip'];
const SCENE={
 'nile-silt':{
  night:['#080707','#130f0d','#40291c','#dfa366','#6b3d25','#1f1310','#f6e5c4','#f7c779','#1a2736','#101924','#080d14','#e8c68e','#6e5839','#30281c','#090808','#c4985a'],
  day:['#96abbc','#d7cab3','#f7ebd4','#fffaf2','#ebd4b7','#b5977c','#f7edd8','#ffd478','#4f7487','#335263','#1e3442','#fff2cf','#8c7a52','#52482f','#211e15','#e0b363']},
 'deep-moss':{
  night:['#070b09','#101915','#2e4237','#dfd0af','#567363','#192620','#ece6d2','#ebd096','#172c2a','#0e1e1d','#081211','#e2d4b1','#5d6e56','#26362b','#09100c','#cbb894'],
  day:['#80a69d','#bcd4c9','#ebf2eb','#fbfdfb','#d2e0d7','#92ad9f','#eef5ef','#f7da92','#45736e','#2c524e','#193330','#f8f1d8','#5e7a5d','#334d39','#15241a','#cfb882']},
 'basalt':{
  night:['#090809','#191213','#5c3227','#f2b28d','#944b3a','#2e1918','#f5e0d4','#f7a97e','#1b2633','#111822','#0a0e14','#f2bc99','#7d5e48','#382822','#0b0909','#e08a6c'],
  day:['#9e8e94','#dec0b4','#f7e8df','#fff8f4','#ebd0c3','#b58f82','#f7ebe4','#ffb57d','#536d7d','#374d5c','#22313d','#ffe9d6','#82634f','#4c382d','#211714','#e08666']},
 'nocturne':{
  night:['#070a10','#101724','#293c54','#b9d4c4','#4f6a87','#162130','#e6f0fc','#ebd8a4','#192c40','#101d2c','#08101a','#cbe3d8','#536b64','#233333','#080d12','#96c2a8'],
  day:['#749bc4','#b0cae3','#e7f0f8','#fafdff','#cfe0f0','#8ea8c2','#edf4fc','#ffe094','#446f96','#2c4f70','#19314a','#f5faff','#56786b','#2f4a41','#142420','#96c2a8']}
};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixC=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const rgba=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const easeO=t=>1-Math.pow(1-t,3);
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(n){n=Math.imul(n^n>>>16,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296}

const cv=document.querySelector('.scene');if(!cv)return;
const ctx=cv.getContext('2d');
const snapT=(location.hash.match(/snap=([0-9.]+)/)||[])[1];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||snapT!==undefined;
const off=document.createElement('canvas'),octx=off.getContext('2d');

let W=0,H=0,K=1,HY=0;
let pal='nile-silt',mode='dark';
let dayD=0,dayFrom=0,dayTo=0,dayT0=-1;           /* day progress anim */
let palFade=1,palT0=-1,prevPal='nile-silt';       /* palette crossfade */
let time=0,raf=0,lastTs=0;
let stars=[],sparkles=[],blades=[],fish=[],birds=[],travelers=[],banks=[],meteors=[];
let ripples=[],droplets=[];
let mx=.5,my=.5,smx=.5,smy=.5,pointerIn=0,presence=0;
let gustAmp=0,rippleAmp=0;
let tierSway=[{x:0,v:0},{x:0,v:0},{x:0,v:0}];
let intro={on:false,t0:0,impacted:false};
const DUR_INTRO=1.85;

function colorsFor(p,d){
  const n=SCENE[p].night,dy=SCENE[p].day,o={};
  for(let i=0;i<16;i++)o[KEYS[i]]=mixC(hex(n[i]),hex(dy[i]),d);
  return o;
}
function curColors(){
  let d=dayD;
  if(dayT0>=0){const p=clamp((time-dayT0)/.9,0,1);d=dayFrom+(dayTo-dayFrom)*easeIO(p);if(p>=1){dayD=dayTo;dayT0=-1;d=dayTo}}
  dayD=d;
  let c=colorsFor(pal,d);
  if(palFade<1){
    const f=easeO(clamp(palFade,0,1));
    const pc=colorsFor(prevPal,d);
    for(const k of KEYS)c[k]=mixC(pc[k],c[k],clamp(f,0,1));
  }
  return{c,d};
}

/* ---------- build ---------- */
function build(){
  W=innerWidth;H=innerHeight;K=Math.min(devicePixelRatio||1,1.5);
  cv.width=Math.round(W*K);cv.height=Math.round(H*K);
  off.width=cv.width;off.height=cv.height;
  HY=Math.round(H*.635);
  const R=rng(20261126);
  stars=[];const skyA=W*HY;
  const ns=Math.round(skyA/4200);
  for(let i=0;i<ns;i++)stars.push({x:R()*W,y:R()*HY*.92,r:.5+R()*.9,p:R()*6.28,sp:1.5+R()*2.5});
  sparkles=[];const nsp=Math.round(skyA/20000);
  for(let i=0;i<nsp;i++)sparkles.push({x:R()*W,y:R()*HY*.7,p:R()*6.28,sp:.8+R()*.9});
  meteors=[
    {period:23,offset:1,dir:1,dur:1.2,len:52,spd:150},
    {period:37,offset:9,dir:-1,dur:1.2,len:66,spd:185}
  ].map(m=>({...m,sx:(.18+R()*.5)*W,sy:H*(1-(.78+R()*.15))}));
  travelers=[];for(let i=0;i<3;i++)travelers.push({x:R()*W*1.4-W*.2,y:HY*(.28+i*.14)+R()*10,w:W*(.10+R()*.03),v:(5+R()*4)});
  banks=[buildBank(R,0),buildBank(R,1)];
  fish=[];for(let i=0;i<7;i++)fish.push({o:i*10.5*(W/720)+R()*6,y:.105+(R()-.5)*.03,len:4.2+R()*1.6,p:R()*6.28,wag:5.2+R()*.8});
  birds=[];
  for(let f=0;f<2;f++){const n=f?4:5;for(let i=0;i<n;i++)birds.push({f,i,p:R()*6.28,span:(6+R()*1.6)*(f?.84:1)*(W/720)})}
  blades=[];
  const tiers=[{sp:7,w:1.45,hh:.35},{sp:8,w:1.9,hh:.30},{sp:9.5,w:2.55,hh:.26}];
  for(let L=0;L<3;L++){
    const t=tiers[L];
    for(let x=R()*t.sp;x<W;x+=t.sp){
      const u=Math.abs(x/W-.5)*2;
      const base=.44+.56*Math.pow(u,1.42);
      const cl=.85+.15*Math.sin(x*.008+L*2.1)+.1*Math.sin(x*.02+L);
      const h=H*t.hh*base*cl*(.55+R()*.45);
      blades.push({x,h,L,p:R()*6.28,arch:(x<W/2?-1:1)*(11+R()*22)*(0.4+u*.6),seed:L===0&&R()<.44,w:t.w*(0.85+R()*.3)});
    }
  }
}
function buildBank(R,side){
  const puffs=[];
  for(let i=0;i<9;i++){
    const t=i/8;
    const x=side?t*0.32:1-t*0.36;      /* fraction of W */
    const y=side?(.03+t*.14):(.02+t*.15);/* fraction of sky height from top */
    puffs.push({fx:x+(R()-.5)*.028,fy:y+(R()-.5)*.022,r:(.062+.032*R())*(1-t*.3),p:R()*6.28});
  }
  const wisps=[];const nw=3+Math.floor(R()*2);
  for(let i=0;i<nw;i++)wisps.push({fx:side?R()*.28:.62+R()*.33,fy:.3+R()*.18,w:.02+R()*.03,p:R()*6.28});
  return{side,puffs,wisps};
}

/* ---------- wave slope field ---------- */
function slope(x,y,t){
  const d=clamp((y-HY)/Math.max(1,H-HY),0,1);
  const chop=1+.35*gustAmp+.45*rippleAmp;
  let s=0;
  s+=Math.sin(x/W*8.5*6.28+(x/W)*(d*1.45)*3+t*1.9)*0.5;
  s+=Math.sin(-x/W*16*6.28+d*2.95*2+t*2.6)*0.32;
  s+=Math.sin(x/W*28*6.28+d*5.6*4-t*3.4)*0.2;
  s+=Math.sin(-x/W*46*6.28+d*10.2*5+t*4.6)*0.12;
  return s*chop;
}

/* ---------- scene render ---------- */
function renderScene(C,d,t,g){
  const px=(smx-.5)*.018*W,py=(smy-.5)*.011*H;
  /* sky */
  let gr=g.createLinearGradient(0,0,0,HY);
  gr.addColorStop(0,rgba(C.skyTop,1));gr.addColorStop(.56,rgba(C.skyMid,1));gr.addColorStop(1,rgba(C.skyLow,1));
  g.fillStyle=gr;g.fillRect(0,0,W,HY+1);
  /* center glow near horizon */
  const glowX=W*.5+px*.12;
  gr=g.createRadialGradient(glowX,HY,0,glowX,HY,W*.3);
  gr.addColorStop(0,rgba(mixC(C.skyLow,C.cloudLit,.5),.14));gr.addColorStop(1,rgba(C.skyLow,0));
  g.fillStyle=gr;g.fillRect(0,0,W,HY);
  /* horizon haze */
  gr=g.createLinearGradient(0,HY-H*.08,0,HY);
  gr.addColorStop(0,rgba(mixC(C.skyLow,C.cloudLit,.6),0));gr.addColorStop(1,rgba(mixC(C.skyLow,C.cloudLit,.6),.12+.05*d));
  g.fillStyle=gr;g.fillRect(0,HY-H*.08,W,H*.08);

  const mA=1-smooth(.52,.92,d);   /* moon alpha */
  const sA=smooth(.08,.48,d);     /* sun alpha */
  const phone=W<960;
  const moonX=phone?W*.5:(.37-.14*d)*W+px*.22,moonY=phone?H*.05:H*(1-(.87-.56*d*d-.05*d))+py*.22;
  const si=1-d,sunX=phone?W*.5:(.63+.14*si)*W+px*.22,sunY=phone?H*.05:H*(1-(.86-.56*si*si-.05*si))+py*.22;
  const lightX=d>.5?sunX:moonX,lightY=d>.5?sunY:moonY;

  /* stars */
  const stA=1-smooth(0,.55,d);
  if(stA>.01){
    for(const s of stars){
      const fade=smooth(HY*.05,HY*.28,s.y)*smooth(HY*.98,HY*.72,s.y);
      const a=stA*fade*(.35+.65*(.5+.5*Math.sin(t*s.sp+s.p)));
      if(a<.03)continue;
      g.fillStyle=rgba(C.moon,a*.9);
      g.beginPath();g.arc(s.x+px*.08,s.y+py*.08,s.r,0,6.283);g.fill();
    }
    for(const s of sparkles){
      const a=stA*(.5+.5*Math.sin(t*s.sp+s.p))*.5;
      if(a<.05)continue;
      g.strokeStyle=rgba(C.moon,a);g.lineWidth=.9;
      const x=s.x+px*.08,y=s.y+py*.08,l=3;
      g.beginPath();g.moveTo(x-l,y);g.lineTo(x+l,y);g.moveTo(x,y-l);g.lineTo(x,y+l);g.stroke();
    }
    /* shooting stars */
    for(const m of meteors){
      const lt=((t-m.offset)%m.period+m.period)%m.period;
      if(lt>m.dur)continue;
      const p=lt/m.dur;
      const dx=m.dir*.866,dyv=.5;
      const hx=m.sx+dx*m.spd*lt,hy=m.sy+dyv*m.spd*lt;
      const tl=m.len*(1-p*.4);
      const tx=hx-dx*tl,ty=hy-dyv*tl;
      const a=stA*Math.sin(Math.PI*clamp(p,0,1));
      const grd=g.createLinearGradient(tx,ty,hx,hy);
      grd.addColorStop(0,rgba(C.moon,0));grd.addColorStop(1,rgba(C.moon,a*.9));
      g.strokeStyle=grd;g.lineWidth=1.6;g.lineCap='round';
      g.beginPath();g.moveTo(tx,ty);g.lineTo(hx,hy);g.stroke();
      g.fillStyle=rgba(C.moon,a);
      g.beginPath();g.arc(hx,hy,1.6,0,6.283);g.fill();
    }
  }
  /* sun / moon halos + bodies */
  if(mA>.01){
    gr=g.createRadialGradient(moonX,moonY,0,moonX,moonY,H*.11);
    gr.addColorStop(0,rgba(C.moon,.19*mA));gr.addColorStop(1,rgba(C.moon,0));
    g.fillStyle=gr;g.fillRect(moonX-H*.11,moonY-H*.11,H*.22,H*.22);
  }
  if(sA>.01){
    gr=g.createRadialGradient(sunX,sunY,0,sunX,sunY,H*.17);
    gr.addColorStop(0,rgba(C.sun,.25*sA));gr.addColorStop(1,rgba(C.sun,0));
    g.fillStyle=gr;g.fillRect(sunX-H*.17,sunY-H*.17,H*.34,H*.34);
    g.save();g.translate(sunX,sunY);g.rotate(t*.05);
    for(let i=0;i<8;i++){
      g.rotate(Math.PI/4);
      const rg=g.createLinearGradient(0,0,H*.14,0);
      rg.addColorStop(0,rgba(C.sun,.035*sA));rg.addColorStop(1,rgba(C.sun,0));
      g.fillStyle=rg;g.fillRect(0,-H*.008,H*.14,H*.016);
    }
    g.restore();
  }
  /* clouds: framing banks (skipped on phones: keep the scene clear of hero text and dock) */
  if(!phone)for(const b of banks){
    const sway=Math.sin(t*.4+b.side*2)*.012*W;
    /* soft underlay knits the puffs into one mass */
    const bx=(b.side?.16:.84)*W+sway+px*.12, by=(b.side?.10:.095)*HY+py*.12;
    let ug=g.createRadialGradient(bx,by,0,bx,by,1);
    ug.addColorStop(0,rgba(C.cloudShad,.34));ug.addColorStop(.7,rgba(C.cloudShad,.2));ug.addColorStop(1,rgba(C.cloudShad,0));
    g.save();g.translate(bx,by);g.scale(W*.21,HY*.085);g.fillStyle=ug;
    g.beginPath();g.arc(0,0,1,0,6.283);g.fill();g.restore();
    ug=g.createRadialGradient(bx,by-HY*.03,0,bx,by-HY*.03,1);
    ug.addColorStop(0,rgba(C.cloudLit,.2));ug.addColorStop(1,rgba(C.cloudLit,0));
    g.save();g.translate(bx,by-HY*.03);g.scale(W*.17,HY*.06);g.fillStyle=ug;
    g.beginPath();g.arc(0,0,1,0,6.283);g.fill();g.restore();
    for(const p of b.puffs){
      const x=p.fx*W+sway+px*.12,y=p.fy*HY+Math.sin(t*.0035*60+p.p)*4+py*.12;
      const r=p.r*W;
      puff(g,x,y,r,C,lightX,lightY,.96);
    }
    for(const wsp of b.wisps){
      const x=wsp.fx*W+sway*1.4+px*.12,y=wsp.fy*HY+py*.12,r=wsp.w*W;
      puff(g,x,y,r,C,lightX,lightY,.28,true);
    }
  }
  /* traveling cumulus */
  for(const c of travelers){
    const span=W*1.38;
    const x=((c.x+t*c.v)%span+span)%span-W*.19+px*.18;
    const y=c.y+py*.18;
    const n=4;
    let tg=g.createRadialGradient(x,y,0,x,y,1);
    tg.addColorStop(0,rgba(C.cloudShad,.3));tg.addColorStop(1,rgba(C.cloudShad,0));
    g.save();g.translate(x,y);g.scale(c.w*.5,c.w*.16);g.fillStyle=tg;
    g.beginPath();g.arc(0,0,1,0,6.283);g.fill();g.restore();
    for(let i=0;i<n;i++){
      const tt=i/(n-1)-.5;
      puff(g,x+tt*c.w*.55,y-Math.cos(tt*2.4)*c.w*.07,c.w*.34*(1-Math.abs(tt)*.45),C,lightX,lightY,.6);
    }
  }
  /* sun & moon discs (over clouds) */
  if(mA>.01){
    const r=H*.027;
    g.save();g.globalAlpha=mA;
    g.beginPath();g.arc(moonX,moonY,r,0,6.283);g.clip();
    g.fillStyle=rgba(C.moon,1);g.fillRect(moonX-r,moonY-r,r*2,r*2);
    g.globalCompositeOperation='destination-out';
    g.beginPath();g.arc(moonX+r*.41,moonY-r*.26,r*.92,0,6.283);g.fill();
    g.restore();
  }
  if(sA>.01){
    const r=H*.036;
    gr=g.createRadialGradient(sunX-r*.2,sunY-r*.2,0,sunX,sunY,r);
    gr.addColorStop(0,rgba(mixC(C.sun,[255,255,255],.55),sA));gr.addColorStop(.75,rgba(C.sun,sA));gr.addColorStop(1,rgba(C.sun,sA));
    g.fillStyle=gr;g.beginPath();g.arc(sunX,sunY,r,0,6.283);g.fill();
  }
  /* birds (day) */
  const bA=smooth(.12,.3,d)*(1-smooth(.45,.58,d));
  if(bA>.01){
    g.strokeStyle=rgba(mixC(mixC(C.cloudShad,C.skyTop,.28),[0,0,0],.18),.68*bA);
    g.lineWidth=1.4;g.lineCap='round';
    for(const b of birds){
      const f=b.f,spd=f?-.0062:.0080;
      const baseX=f?1.18-.02:-.18;
      let x=(baseX+spd*t+b.i*.016*(f?-1:1))%1.36;if(x<-.18)x+=1.36;
      x*=W;
      const vx=b.i===0?0:(b.i%2?1:-1)*Math.ceil(b.i/2)*11.5*(W/720);
      const vy=b.i===0?0:Math.ceil(b.i/2)*3.8*(W/720);
      const y=(f?.135:.19)*HY+vy+Math.sin(t*1.3+b.p)*2.5+py*.09;
      const xx=x+vx+px*.09;
      const bout=.5+.5*Math.sin(t*.9+b.p);
      const flap=Math.sin(t*7+b.p)*(.35+.65*bout)*.9;
      const ws=b.span;
      g.beginPath();
      g.moveTo(xx-ws,y-flap*ws*.5);
      g.quadraticCurveTo(xx-ws*.45,y-ws*.28-flap*ws*.3,xx,y);
      g.quadraticCurveTo(xx+ws*.45,y-ws*.28-flap*ws*.3,xx+ws,y-flap*ws*.5);
      g.stroke();
    }
  }
  /* sea */
  gr=g.createLinearGradient(0,HY,0,H);
  gr.addColorStop(0,rgba(C.seaTop,1));gr.addColorStop(.42,rgba(C.seaMid,1));gr.addColorStop(1,rgba(C.seaDeep,1));
  g.fillStyle=gr;g.fillRect(0,HY,W,H-HY);
  const seaPx=px*.4,seaPy=py*.4;
  /* orb reflection */
  const rbA=(mA>.01?.58*mA:0)+(sA>.01?.65*sA:0);
  if(rbA>.02){
    const ox=mA>sA?moonX:sunX,oy=HY+(HY-(mA>sA?moonY:sunY))*.24;
    const rw=H*.05,rh=H*.16;
    for(let i=0;i<6;i++){
      const yy=oy-rh/2+rh*i/6+Math.sin(t*1.7+i)*2;
      const wob=Math.sin(t*1.2+i*1.7)*rw*.3;
      const a=rbA*.12*(1-i/7);
      g.fillStyle=rgba(mA>sA?C.moon:C.sun,a);
      g.beginPath();g.ellipse(ox+wob*.2+seaPx*.3,yy,rw*(1-i*.1),rh/7,0,0,6.283);g.fill();
    }
  }
  /* glitter column */
  const glX=(mA>sA?moonX:sunX);
  const colC=mixC(C.seaGlint,[255,250,235],.25*d);
  for(let y=HY+4,ri=0;y<H;y+=4,ri++){
    if(hash(ri*7+13)>.44)continue;
    const dep=(y-HY)/Math.max(1,H-HY);
    const hw=(.046+.094*dep)*W;
    const cx=glX+Math.sin(dep*3+t*.2)*8+seaPx;
    const sp=.5+hash(ri*13+7)*.6;
    const drift=((t*sp*30+hash(ri)*200)%(hw*2))-hw;
    const n=1+Math.floor(hash(ri*31)*2);
    for(let k=0;k<n;k++){
      const xx=cx-hw+((hash(ri*17+k*91)+drift/(hw*2))%1+1)%1*hw*2;
      const sl=slope(xx,y,t);
      const lit=clamp(.5+sl*.9,0,1);
      const a=(.10+.5*lit)*(1-dep*.55)*(0.55+0.45*d+.45*mA);
      if(a<.03)continue;
      const wl=8+hash(ri*3+k)*22*(1+dep);
      g.fillStyle=rgba(colC,a);
      g.fillRect(xx-wl/2,y,wl,1.3);
    }
  }
  /* horizon hairline + soft band */
  g.fillStyle=rgba(mixC(C.seaTop,C.seaGlint,.58),.5);g.fillRect(0,HY,W,1.35);
  gr=g.createLinearGradient(0,HY-6,0,HY);
  gr.addColorStop(0,rgba(C.skyLow,0));gr.addColorStop(1,rgba(C.skyLow,.35));
  g.fillStyle=gr;g.fillRect(0,HY-6,W,6);
  /* fish school */
  const seaH=H-HY;
  g.save();
  for(let i=0;i<7;i++){
    const fsh=fish[i];
    const span=W*1.36;
    const x=((fsh.o+t*.010*W*.14)%span+span)%span-W*.18;
    const y=HY+fsh.y*seaH+Math.sin(t*.9+fsh.p)*3;
    const L=fsh.len*(W/720)*2.2;
    const wag=Math.sin(t*fsh.wag+fsh.p)*.5;
    g.fillStyle=rgba(mixC(C.seaDeep,C.seaMid,.5),.48);
    g.beginPath();
    g.moveTo(x+L*.5,y);
    g.quadraticCurveTo(x+L*.1,y-L*.22,x-L*.28,y);
    g.lineTo(x-L*.5,y-L*.2*wag-.01);
    g.lineTo(x-L*.42,y);
    g.lineTo(x-L*.5,y+L*.2*wag+.01);
    g.quadraticCurveTo(x+L*.1,y+L*.22,x+L*.5,y);
    g.fill();
  }
  g.restore();
  /* splash ripples */
  for(const rp of ripples){
    const age=(t-rp.t0);if(age>1.85)continue;
    const p=age/1.85;
    const r=.125*H*age;
    const a=(1-p)*.8;
    for(const k of [1,.72]){
      g.strokeStyle=rgba(C.seaGlint,a*(k===1?.5:.3));
      g.lineWidth=k===1?1.6:1.1;
      g.beginPath();g.ellipse(rp.x,rp.y,r*k,r*k*.42,0,0,6.283);g.stroke();
    }
  }
  for(const dr of droplets){
    const age=t-dr.t0;if(age>1.4)continue;
    const y=dr.y-(dr.vy*age-.5*.42*H*age*age);
    if(y>dr.y+8)continue;
    g.fillStyle=rgba(C.seaGlint,clamp(1-age*1.35,0,1)*.8);
    g.fillRect(dr.x+dr.vx*age,y,2,2);
  }
  /* grass */
  const tiers=[[C.grassBack,C.grassMid,.65],[C.grassMid,C.grassTip,.825],[C.grassFront,C.grassBack,1]];
  const windBase=Math.sin(t*.55*6.28*.16)*1;
  for(let L=0;L<3;L++){
    const sw=tierSway[L].x;
    const plx=[.65,.825,1][L];
    for(const b of blades){
      if(b.L!==L)continue;
      const gust=Math.sin(b.x*.008-t*1.6)*.5+Math.sin(b.x*.023+t*.9)*.3;
      const flut=Math.sin(t*(4+b.L)+b.p)*.18;
      let push=0;
      if(presence>.01){
        const dx=b.x-mx*W;
        if(Math.abs(dx)<44){
          const vert=clamp((my-0.76)/.18,0,1);
          push=(dx<0?-1:1)*28*(1-Math.abs(dx)/44)*presence*vert;
        }
      }
      const amp=(1+gust*.4*(1+gustAmp)+gustAmp*.8);
      const tipX=b.x+b.arch+ (gust*10+flut*6+sw*22+windBase*4)*amp + push;
      const tipY=H-b.h+Math.abs(push)*.3;
      const cxp=b.x+b.arch*.4+(gust*4+sw*8)*amp+push*.4;
      const col=tiers[L][0];
      g.strokeStyle=rgba(col,1);
      g.lineWidth=b.w;g.lineCap='round';
      g.beginPath();g.moveTo(b.x,H+4);g.quadraticCurveTo(cxp,H-b.h*.55,tipX+ (smx-.5)*.018*W*plx*.4,tipY);g.stroke();
      if(b.seed&&b.h>H*.12){
        g.fillStyle=rgba(C.grassTip,.9);
        g.beginPath();g.ellipse(tipX,tipY-2,1.4,4.5,(tipX-b.x)*.004,0,6.283);g.fill();
      }
    }
  }
  /* soil bank */
  gr=g.createLinearGradient(0,H*.94,0,H);
  gr.addColorStop(0,rgba(mixC(C.grassFront,C.grassMid,.35),0));
  gr.addColorStop(.4,rgba(mixC(C.grassFront,C.grassMid,.35),.9));
  gr.addColorStop(1,rgba(C.grassFront,1));
  g.fillStyle=gr;g.fillRect(0,H*.94,W,H*.06);
}

function puff(g,x,y,r,C,lx,ly,alpha,flat){
  if(r<2)return;
  const toward=lx>x?1:-1;
  const sh=C.cloudShad,li=C.cloudLit,hi=C.cloudHi;
  /* base shadow body */
  let gr=g.createRadialGradient(x,y+r*.12,0,x,y+r*.12,r);
  gr.addColorStop(0,rgba(sh,alpha*.72));gr.addColorStop(.72,rgba(sh,alpha*.5));gr.addColorStop(1,rgba(sh,0));
  g.fillStyle=gr;g.fillRect(x-r*1.15,y-r*1.15,r*2.3,r*2.3);
  /* lit mid, offset toward light */
  gr=g.createRadialGradient(x+toward*r*.24,y-r*.24,0,x+toward*r*.24,y-r*.24,r*.72);
  gr.addColorStop(0,rgba(li,alpha*.55));gr.addColorStop(.75,rgba(li,alpha*.32));gr.addColorStop(1,rgba(li,0));
  g.fillStyle=gr;g.fillRect(x-r*1.1,y-r*1.2,r*2.2,r*2.2);
  /* highlight crown */
  gr=g.createRadialGradient(x+toward*r*.38,y-r*.42,0,x+toward*r*.38,y-r*.42,r*.4);
  gr.addColorStop(0,rgba(hi,alpha*.38));gr.addColorStop(1,rgba(hi,0));
  g.fillStyle=gr;g.fillRect(x-r*.9,y-r,r*1.8,r*1.8);
  void flat;
}

/* ---------- frame ---------- */
function frame(){
  const {c:C,d}=curColors();
  ctx.setTransform(K,0,0,K,0,0);
  const g=octx;g.setTransform(K,0,0,K,0,0);
  renderScene(C,d,time,g);
  ctx.clearRect(0,0,W,H);
  if(intro.on){
    const p=(time-intro.t0)/DUR_INTRO;
    if(p>=1){intro.on=false;ctx.drawImage(off,0,0,cv.width,cv.height);return}
    const dropP=clamp(p/.24,0,1);
    /* dormant darkening */
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,W,H);
    const revP=clamp((p-.24)/.76,0,1);
    const R=Math.max(W,H)*1.3*Math.pow(revP,1/2.35)* (revP>0?1:0);
    const ix=.48*W,iy=H*(1-.27);
    if(revP>0){
      ctx.save();
      const path=new Path2D();
      const N=72;
      for(let i=0;i<=N;i++){
        const th=i/N*6.2832;
        const rr=R*(1+.06*Math.sin(5*th+time*2)+.045*Math.sin(11*th+1.7)+.03*Math.sin(3*th+time));
        const xx=ix+Math.cos(th)*rr,yy=iy+Math.sin(th)*rr*.82;
        i?path.lineTo(xx,yy):path.moveTo(xx,yy);
      }
      path.closePath();
      ctx.clip(path);
      ctx.drawImage(off,0,0,cv.width,cv.height);
      ctx.restore();
      /* crest line */
      ctx.strokeStyle=`rgba(255,244,214,${(.5*(1-revP)).toFixed(3)})`;
      ctx.lineWidth=1.6;
      ctx.beginPath();
      for(let i=0;i<=N;i++){
        const th=i/N*6.2832;
        const rr=R*(1+.06*Math.sin(5*th+time*2)+.045*Math.sin(11*th+1.7)+.03*Math.sin(3*th+time));
        const xx=ix+Math.cos(th)*rr,yy=iy+Math.sin(th)*rr*.82;
        i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);
      }
      ctx.closePath();ctx.stroke();
      /* faint horizon glow while dormant part remains */
    }else{
      /* dormant scene: faint horizon glow */
      const gr2=ctx.createRadialGradient(.48*W,HY,0,.48*W,HY,W*.3);
      gr2.addColorStop(0,`rgba(232,198,142,${(.12*(1-dropP)).toFixed(3)})`);gr2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr2;ctx.fillRect(0,0,W,H);
    }
    /* falling drop */
    if(dropP<1){
      const dy2=dropP*dropP;
      const yy=.04*H+(H*(1-.27)-.04*H)*dy2;
      const xx=.48*W;
      const grd=ctx.createLinearGradient(xx,yy-18,xx,yy);
      grd.addColorStop(0,'rgba(255,244,214,0)');grd.addColorStop(1,'rgba(255,244,214,.9)');
      ctx.strokeStyle=grd;ctx.lineWidth=2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(xx,yy-18);ctx.lineTo(xx,yy);ctx.stroke();
      ctx.fillStyle='rgba(255,244,214,.95)';
      ctx.beginPath();ctx.arc(xx,yy,1.8,0,6.283);ctx.fill();
    }else if(!intro.impacted){
      intro.impacted=true;
      splash(.48*W,H*(1-.27));
    }
    /* darken not-yet-revealed scene edges slightly */
    return;
  }
  ctx.drawImage(off,0,0,cv.width,cv.height);
}
function splash(x,y){
  if(ripples.length>=3)ripples.shift();
  ripples.push({x,y,t0:time});
  const R=rng((x*31+y)|0);
  for(let i=0;i<8;i++)droplets.push({x,y,vx:(R()-.5)*.11*W,vy:(.085+R()*.07)*H,t0:time});
  rippleAmp=Math.min(1.6,rippleAmp+.9);
}

/* ---------- loop ---------- */
function loop(ts){
  raf=requestAnimationFrame(loop);
  const dt=clamp((ts-lastTs)/1000,0,.05);lastTs=ts;
  time+=dt;
  /* smooth mouse */
  smx+=(mx-smx)*Math.min(1,8.5*dt);smy+=(my-smy)*Math.min(1,8.5*dt);
  presence+=((pointerIn?1:0)-presence)*Math.min(1,6*dt);
  gustAmp=Math.max(0,gustAmp-.18*dt);
  rippleAmp=Math.max(0,rippleAmp-.08*dt);
  if(palFade<1&&palT0>=0)palFade=clamp(1-(time-palT0)/.4,0,1);
  /* grass tier sway springs (natural freq .55/.8/1.1 Hz, damping .42/.46/.5) */
  const fr=[.55,.8,1.1],da=[.42,.46,.5];
  for(let L=0;L<3;L++){
    const w=6.283*fr[L];
    const target=Math.sin(time*.5+L*1.7)*.6+Math.sin(time*.23+L)*.4;
    const s=tierSway[L];
    const a=-w*w*(s.x-target*.14)-2*da[L]*w*s.v;
    s.v+=a*dt;s.x+=s.v*dt;
  }
  frame();
}

/* ---------- public api ---------- */
window.landscape={
  set(p,m){
    const palChange=p!==pal,modeChange=m!==mode;
    if(!palChange&&!modeChange)return;
    if(palChange){prevPal=pal;pal=p;palFade=reduce?0:1;palT0=time}
    if(modeChange){mode=m;dayFrom=dayD;dayTo=m==='light'?1:0;
      if(reduce){dayD=dayTo;dayT0=-1}else{dayT0=time;dayFrom=dayD}}
    if(reduce)stillFrame();
  },
  intro(){
    if(reduce)return;
    intro={on:true,t0:time,impacted:false};
  },
  relayout(){},
  gust(x){gustAmp=Math.min(1.6,gustAmp+x)},
  ripple(x){rippleAmp=Math.min(1.6,rippleAmp+x)}
};

function stillFrame(){
  const tFrozen=snapT!==undefined?parseFloat(snapT):0;
  time=Math.max(time,tFrozen);
  const {c:C,d}=curColors();
  octx.setTransform(K,0,0,K,0,0);
  renderScene(C,d,tFrozen,octx);
  /* frozen shooting star at night */
  if(d<.5){
    octx.strokeStyle='rgba(246,229,196,.8)';octx.lineWidth=1.6;octx.lineCap='round';
    octx.beginPath();octx.moveTo(W*.5-40,H*.18-23);octx.lineTo(W*.5,H*.18);octx.stroke();
  }
  ctx.setTransform(K,0,0,K,0,0);
  ctx.clearRect(0,0,W,H);ctx.drawImage(off,0,0,cv.width,cv.height);
}

/* ---------- events ---------- */
addEventListener('pointermove',e=>{
  mx=clamp(e.clientX/W,0,1);my=clamp(e.clientY/H,0,1);pointerIn=1;
  /* cursor over orb? */
  const {d}=curColors();
  const ox=(d>.5?(.63+.14*(1-d)):(.37-.14*d))*W,oy=H*(1-(d>.5?.86-(0.56*(1-d)*(1-d)+.05*(1-d)):(.87-.56*d*d-.05*d)));
  const overOrb=Math.hypot(e.clientX-ox,e.clientY-oy)<.075*H;
  const overUI=e.target&&e.target.closest&&e.target.closest('.dock,.pal-pop,.panel-col,.ident,button,a,.ovl');
  document.body.style.cursor=overOrb&&!overUI?'pointer':'';
},{passive:true});
addEventListener('pointerleave',()=>{pointerIn=0});
addEventListener('click',e=>{
  if(e.target&&e.target.closest&&e.target.closest('.dock,.pal-pop,.panel-col,.ident,button,a,.ovl,input,textarea'))return;
  const {d}=curColors();
  const ox=(d>.5?(.63+.14*(1-d)):(.37-.14*d))*W;
  const oy=H*(1-(d>.5?.86-(0.56*(1-d)*(1-d)+.05*(1-d)):(.87-.56*d*d-.05*d)));
  if(Math.hypot(e.clientX-ox,e.clientY-oy)<.075*H){window.__toggleTheme&&window.__toggleTheme();return}
  const fromBottom=H-e.clientY;
  if(fromBottom>.14*H&&fromBottom<.37*H)splash(e.clientX,e.clientY);
});
document.addEventListener('visibilitychange',()=>{
  if(reduce)return;
  if(document.hidden)cancelAnimationFrame(raf);
  else{lastTs=performance.now();raf=requestAnimationFrame(loop)}
});
let rT;
addEventListener('resize',()=>{clearTimeout(rT);rT=setTimeout(()=>{build();if(reduce)stillFrame()},150)});

/* ---------- boot ---------- */
build();
if(reduce){stillFrame()}
else{lastTs=performance.now();raf=requestAnimationFrame(loop)}
})();
