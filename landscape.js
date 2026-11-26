/* Pixel-art landscape engine: procedural canvas, re-themed by palette + light/dark. */
(function(){
const SCENES={
 'nile-silt':{
  dark:{sky:['#08080a','#0d0c0b','#121520','#1a2336'],water:['#15233a','#0a1120'],cloud:['#2e1d14','#5e3822','#c27a3e'],orb:'#f3ede4',reed:'#d4a359',streak:'#e8c890'},
  light:{sky:['#9fb2c4','#c4d0d6','#e2dccb','#ecdcc0'],water:['#8b9eb0','#5e7186'],cloud:['#b59a80','#d6bc9c','#f1e3cb'],orb:'#fff1c9',reed:'#9c651d',streak:'#fff6d8'}},
 'deep-moss':{
  dark:{sky:['#060a08','#0b100d','#101a15','#16281f'],water:['#12241e','#08120e'],cloud:['#1b261f','#364636','#7c8f6c'],orb:'#eaf0ec',reed:'#cbb894',streak:'#cfe0d2'},
  light:{sky:['#9bb2a4','#c1d1c4','#dde5d3','#e4e8d4'],water:['#7a9486','#52695d'],cloud:['#a9b6a3','#c8d2c0','#e9eee0'],orb:'#fbf3d4',reed:'#7d6b43',streak:'#fbf3d4'}},
 'basalt':{
  dark:{sky:['#0a0808','#0e0c0c','#1a1315','#2a1c20'],water:['#1c1822','#0c0a10'],cloud:['#331f1c','#663a33','#c0634f'],orb:'#f2ede8',reed:'#e07a5f',streak:'#f0b8a4'},
  light:{sky:['#a98d9d','#c9a5ae','#e6bfb8','#f0cdb8'],water:['#8f7a95','#6a5a74'],cloud:['#c09aa0','#dcb4b4','#f6dcd0'],orb:'#ffd2b0',reed:'#b84b30',streak:'#ffd9bf'}},
 'nocturne':{
  dark:{sky:['#05080e','#0a0d14','#101828','#182640'],water:['#101a30','#070c18'],cloud:['#1b2434','#31446a','#6c8bb4'],orb:'#eef2f8',reed:'#8fb89f',streak:'#c4d6ee'},
  light:{sky:['#97aac4','#bccadc','#dbe3ec','#e6e9ee'],water:['#6f87a8','#4c6482'],cloud:['#a5b3c8','#c5d0de','#e7edf4'],orb:'#fff6d8',reed:'#4f7a62',streak:'#fff6d8'}}
};
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb=c=>'rgb('+c[0]+','+c[1]+','+c[2]+')';
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}

const INTRO_MS=1850; // glgl-faithful intro length
let intro0=-1;
function disc(cx,cy,rr,fill){ctx.fillStyle=fill;for(let y=-rr;y<=rr;y++)for(let x=-rr;x<=rr;x++){if(x*x+y*y<=rr*rr)ctx.fillRect(cx+x,cy+y,1,1)}}
function discOn(c,cx,cy,rr,fill){c.fillStyle=fill;for(let y=-rr;y<=rr;y++)for(let x=-rr;x<=rr;x++){if(x*x+y*y<=rr*rr)c.fillRect(cx+x,cy+y,1,1)}}
/* Cinematic water-drop reveal (ported from the glgl.me fragment shader):
   phase A (p<.24): the scene sits dormant (dimmed) while a luminous drop with a tapering tail falls to the water;
   phase B (p>=.24): an organic wavefront expands from the impact point and reveals the fully-rendered scene
   behind a Bayer-dithered liquid crest; splash droplets and concentric water rings fire at impact. */
function drawIntroFx(rc,p,sc_,buf){
  const rtl=document.documentElement.dir==='rtl';
  const ox=Math.round(W*(rtl?.52:.48)),iy=Math.round(H*.73);
  const glint=mix(hex(sc_.streak),[255,250,238],.55),gl='rgb('+glint+')',glA='rgba('+glint+',';
  // dormant world (pre-rendered at build; fades in while the drop falls)
  const e0=Math.min(1,p/.24),be=e0*(2-e0); // smoothstep over phase A
  rc.fillStyle='#000';rc.fillRect(0,0,W,H);
  rc.globalAlpha=.35+.65*be;rc.drawImage(dormantBuf,0,0);rc.globalAlpha=1;
  if(p<.24){
    // luminous falling drop: bright elongated head, tapering tail, soft dithered glow
    const e=p/.24,y=Math.round((.04+e*e*.69)*H),c=Math.min(1,e*4.5);
    for(let k=1;k<=9;k++){const w=Math.max(1,Math.round(2*(1-k/9)));rc.globalAlpha=(1-k/9)*.85*c;rc.fillStyle=gl;rc.fillRect(ox-Math.floor(w/2),y-3-k,w,1)}
    rc.globalAlpha=.4*c;discOn(rc,ox,y,4,glA+'.4)');
    rc.globalAlpha=c;discOn(rc,ox,y,2,'rgb(255,252,246)');
    rc.globalAlpha=1;
    return;
  }
  // phase B: organic expanding reveal wavefront
  const q=Math.min(1,(p-.24)/.76),qe=1-Math.pow(1-q,2.35);
  const maxD=Math.sqrt(Math.pow(W/H*.85*.62,2)+.64)+.14;
  const front=(0.035+qe*maxD)*H; // wavefront radius in px
  const rAt=a=>front-(Math.sin(a*5+q*3.5)*.018+Math.sin(a*11-q*6)*.009)*H;
  const N=72;
  if(q<.999){
    rc.save();rc.beginPath();
    for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,r=rAt(a),x=ox+Math.cos(a)*r/0.85,y=iy+Math.sin(a)*r;i?rc.lineTo(x,y):rc.moveTo(x,y)}
    rc.closePath();rc.clip();rc.drawImage(buf,0,0);rc.restore();
    // Bayer-dithered liquid edge + bright crest that dissolves near the end
    const crestA=1-Math.min(1,Math.max(0,(q-.68)/.32));
    for(let i=0;i<N;i++){
      const a=i/N*Math.PI*2,r=rAt(a),ca=Math.cos(a)/0.85,sa=Math.sin(a);
      for(let k=-3;k<=3;k++){
        const x=Math.round(ox+ca*(r+k)),y=Math.round(iy+sa*(r+k));
        if(x<0||x>=W||y<0||y>=H)continue;
        const thr=(BAYER[y&3][x&3]+.5)/16;
        if(k>0&&thr<.55){rc.globalAlpha=.85;rc.fillStyle=gl;rc.fillRect(x,y,1,1)}
        else if(k<=0&&crestA>0&&thr<crestA){rc.globalAlpha=.9*crestA;rc.fillStyle=gl;rc.fillRect(x,y,1,1)}
      }
    }
    rc.globalAlpha=1;
  }else rc.drawImage(buf,0,0);
  // impact: splash droplets arc up and fall, concentric rings expand across the water
  const age=(p-.24)/.76*1.405; // splash clock (seconds) inside the intro window
  if(age>0){
    for(let i=0;i<8;i++){
      const vx=((i/7)-.5)*.11*W,vy0=.085*H,ga=.28*H;
      const x=Math.round(ox+vx*age),y=Math.round(iy-vy0*age+.5*ga*age*age);
      const a=Math.max(0,1-age/.74);if(a<=0)break;
      if(x>=0&&x<W&&y>=0&&y<H){rc.globalAlpha=a;rc.fillStyle=gl;rc.fillRect(x,y,1,2)}
    }
    rc.globalAlpha=1;
    for(let k=0;k<3;k++){
      const ek=Math.min(1,Math.max(0,(age-k*.18)/1.2));
      if(ek<=0)continue;
      const grow=1-Math.pow(1-ek,2.1);
      const rx=Math.round(W*.015+W*.11*grow),ry=Math.max(1,Math.round(rx*.18));
      const a=ek<.62?1:Math.max(0,1-(ek-.62)/.38);
      if(a<=0)continue;
      rc.fillStyle=sc_.streak;
      const thick=ek<.7?2:1;
      for(let x=-rx;x<=rx;x++){
        const u=x/rx,yy=Math.round(ry*Math.sqrt(Math.max(0,1-u*u)));
        for(const sy of[yy,-yy])for(let w2=0;w2<thick;w2++){
          const y=iy+sy+w2;if(y<HY+1)continue; // rings live on the water only
          const thr=(BAYER[y&3][(ox+x)&3]+.5)/16;
          if(thr<.15+.85*a*(w2?.8:1))rc.fillRect(ox+x,y,1,1);
        }
      }
    }
  }
}
const cv=document.querySelector('.pixel-landscape-canvas');
let ctx=cv.getContext('2d');
const realCtx=ctx;
let W,H,HY,sc,pal='nile-silt',mode='dark',statics,clouds,stars,streaks,blades,last=0,raf=0,sceneBuf,bufX,dormantBuf;
let trans=null;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function ditherBand(c,y0,y1,stops,x0,x1){
  // vertical gradient across stops with Bayer dithering
  const n=stops.length-1;
  for(let y=y0;y<y1;y++){
    const t=(y-y0)/Math.max(1,y1-y0-1)*n,i=Math.min(n-1,Math.floor(t)),f=t-i;
    for(let x=x0;x<x1;x++){
      const thr=(BAYER[y&3][x&3]+.5)/16;
      c.fillStyle=f>thr?stops[i+1]:stops[i];
      c.fillRect(x,y,1,1);
    }
  }
}
function build(){
  const S=innerWidth<700?2.6:2.1;
  W=Math.ceil(innerWidth/S);H=Math.ceil(innerHeight/S);sc=H/343;
  cv.width=W;cv.height=H;HY=Math.round(H*.64);
  const sc_=SCENES[pal][mode],dark=mode==='dark',R=rng(7);
  // static layer: sky + water
  statics=document.createElement('canvas');statics.width=W;statics.height=H;
  sceneBuf=document.createElement('canvas');sceneBuf.width=W;sceneBuf.height=H;bufX=sceneBuf.getContext('2d');
  // pre-rendered dormant world for the intro reveal (drawn once; per-frame cost stays flat)
  dormantBuf=document.createElement('canvas');dormantBuf.width=W;dormantBuf.height=H;
  const dx2=dormantBuf.getContext('2d'),dimC=(cc,k)=>rgb(hex(cc).map(v=>Math.round(v*k)));
  ditherBand(dx2,0,HY,[dimC(sc_.sky[0],.49),dimC(sc_.sky[1],.56),dimC(sc_.sky[2],.7),dimC(sc_.sky[3],.7)],0,W);
  ditherBand(dx2,HY,H,[dimC(sc_.water[0],.72),dimC(sc_.water[1],.72)],0,W);
  dx2.fillStyle=dimC(sc_.sky[3],1);
  for(let y=0;y<H;y++){const a=Math.exp(-Math.abs(y-HY)/H*14)*.28;if(a<.02)continue;dx2.globalAlpha=a;dx2.fillRect(0,y,W,1)}
  dx2.globalAlpha=1;
  const s=statics.getContext('2d');
  ditherBand(s,0,HY,sc_.sky,0,W);
  ditherBand(s,HY,H,sc_.water,0,W);
  s.fillStyle=rgb(mix(hex(sc_.water[0]),hex(sc_.streak),.35));s.fillRect(0,HY,W,1);
  // clouds: big masses that frame the edges (left-top, right-mid) plus a small faint one
  clouds=[];const cc=sc_.cloud.map(hex);
  const spec=innerWidth<700
   ?[[-.15,.05,.75,.26],[.45,.2,.7,.22]]
   :[[-.06,.06,.42,.3],[.62,.26,.5,.2],[.34,.02,.2,.2]];
  spec.forEach((sp,k)=>{
    const cw=Math.round(W*sp[2]),ch=Math.round(cw*sp[3]),c=document.createElement('canvas');
    c.width=cw;c.height=ch;const g=c.getContext('2d');
    const bl=[];const nb=14+Math.floor(R()*6);
    for(let b=0;b<nb;b++){const px=.06+.88*(b/(nb-1))+(R()-.5)*.05;const hgt=Math.pow(Math.max(0,1-Math.abs(px-.5)*1.7),.8);
      bl.push({x:cw*px,y:ch*(.78-hgt*.42*(.5+R()*.7)),r:ch*(.16+hgt*.3*(.55+R()*.5))})}
    const mask=new Uint8Array(cw*ch),noise=new Float32Array(cw*ch);
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
      let m=0;for(const b of bl){const dx=x-b.x,dy=(y-b.y)*1.35;if(dx*dx+dy*dy<b.r*b.r)m=1}
      {const wv=.5*Math.sin(x*.11+k)+.3*Math.sin(x*.27+2*k)+.2*Math.sin(x*.05);if(y>ch*(.72+.12*wv))m=0}
      mask[y*cw+x]=m;noise[y*cw+x]=R();}
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
      if(!mask[y*cw+x])continue;
      const below=y+1>=ch||!mask[(y+1)*cw+x],above=y===0||!mask[(y-1)*cw+x],side=x===0||x===cw-1||!mask[y*cw+x-1]||!mask[y*cw+x+1];
      const thr=(BAYER[y&3][x&3]+.5)/16,yy=y/ch,nz=noise[y*cw+x];
      let shade;
      if(dark){
        shade=yy>.66?(below?2:(thr<.42?2:1)):yy>.35?(thr<.5?1:0):(nz<.2?1:0);
        if(below&&shade<2)shade=2;
        if(side&&yy>.3&&shade<1)shade=1;
        if(above&&yy<.25)shade=Math.max(shade,nz<.5?1:0);
      }else{
        shade=above?2:(yy<.4?(thr<.55?2:1):(yy<.7?1:(thr<.45?1:0)));if(below)shade=0;
      }
      g.fillStyle=rgb(cc[shade]);g.fillRect(x,y,1,1);
    }
    clouds.push({c,x:W*sp[0],y:H*sp[1],v:1.2+k*.7,a:dark?1:.88});
  });
  // stars
  stars=[];if(dark){for(let i=0;i<100;i++)stars.push({x:R()*W,y:R()*HY*.8,p:R()*6.28,sp:.3+R()*.7,sp2:i<6});}
  // water streaks
  streaks=[];
  for(let i=0;i<44;i++){const near=R()<.5;streaks.push({near,dx:near?(R()-.5)*W*.22:R()*W,y:HY+3+Math.floor(R()*(H-HY)*.5),w:6+Math.floor(R()*34),p:R()*6.28,v:(R()-.5)*3})}
  // reeds
  blades=[];const rc=hex(sc_.reed),dk=[10,8,6],wc=hex(sc_.water[0]);
  const cnt=Math.round(W*1.5);
  for(let i=0;i<cnt;i++){
    const layer=i%3,tall=1+.55*Math.pow(Math.abs(Math.sin(i*.37))*0+R(),2);
    const h=(layer===0?(26+R()*34):layer===1?(38+R()*52):(30+R()*88))*sc;
    const col=layer===0?mix(rc,wc,.7):layer===1?mix(rc,wc,.38):mix(rc,dk,.12);
    const dir=R()<.62?1:-1; // prevailing slope with organic variation
    blades.push({x:R()*W,h,p:R()*6.28,l:layer,col:rgb(col),col2:rgb(mix(col,dk,.35)),dk:rgb(layer===0?mix(col,dk,.5):dk),y0:H+2-(layer===0?R()*26:layer===1?R()*12:0),head:R()<.22,lean:dir*(6+R()*20)*sc*1.2,curve:1.3+R()*.9,ph:.6+R()*.8});
  }
}
function frame(t){
  const T=t/1000,sc_=SCENES[pal][mode],dark=mode==='dark';
  if(intro0>=0&&(t-intro0)/INTRO_MS<1)ctx=bufX;else ctx=realCtx;
  let tf=1;
  if(trans){const te=Math.min(1,(t-trans.t0)/trans.dur);tf=te<.5?4*te*te*te:1-Math.pow(-2*te+2,3)/2;if(te>=1)trans=null}
  if(trans&&tf<1){ctx.drawImage(trans.statics,0,0);ctx.globalAlpha=tf;ctx.drawImage(statics,0,0);ctx.globalAlpha=1}
  else ctx.drawImage(statics,0,0);
  // day-progress: 0 = night, 1 = day. Drives both celestial bodies along their arcs (glgl-faithful).
  const S=trans?trans.S0+(trans.S1-trans.S0)*tf:(mode==='light'?1:0),di=1-S;
  // stars (fade in with night) and birds (fade in with day)
  if(S<1)for(const s of stars){
    const a=(.3+.7*(.5+.5*Math.sin(T*s.sp+s.p)))*(1-S);
    ctx.fillStyle='rgba(243,237,228,'+a.toFixed(2)+')';const x=Math.floor(s.x),y=Math.floor(s.y);
    ctx.fillRect(x,y,1,1);
    if(s.sp2){ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3)}
  }
  if(S>0){
    ctx.fillStyle='rgba(40,40,60,'+(.55*S).toFixed(2)+')';
    for(let i=0;i<4;i++){const bx=((T*3+i*W/4)%(W+20))-10,by=H*.1+i*9+Math.sin(T+i)*2,f=Math.sin(T*5+i)>0?1:0;
      const x=Math.floor(bx),y=Math.floor(by);ctx.fillRect(x-2,y-f,1,1);ctx.fillRect(x-1,y+1-f,1,1);ctx.fillRect(x,y,1,1);ctx.fillRect(x+1,y+1-f,1,1);ctx.fillRect(x+2,y-f,1,1)}
  }
  // clouds drift slowly around their edge-framing home positions
  const drawClouds=list=>{for(const c of list){
    const dx=Math.sin(T*.035*c.v+c.v)*W*.06;
    ctx.drawImage(c.c,Math.floor(c.x+dx),Math.floor(c.y+Math.sin(T*.05+c.v)*2));
  }};
  if(trans){ctx.globalAlpha=1-tf;drawClouds(trans.clouds);ctx.globalAlpha=tf;drawClouds(clouds);ctx.globalAlpha=1}
  else drawClouds(clouds);
  // moon and sun travel curved arcs with the day-progress S (glgl-faithful):
  // night: moon high at (37%W), sun set below the horizon at (77%W); day: sun high at (63%W), moon set at (23%W).
  // Both are drawn every frame; the waterline (HY) occludes whatever has set, so each body visibly sinks/rises.
  const r=Math.round(Math.min(W,H)*.05);
  const bodies=[
    {x:Math.round(W*(.37-.14*S)),y:Math.round(H*(1-(.87-.56*S*S-.05*S))),crescent:true, col:hex(SCENES[pal].dark.orb), glow:.07},
    {x:Math.round(W*(.63+.14*di)),y:Math.round(H*(1-(.86-.56*di*di-.05*di))),crescent:false,col:hex(SCENES[pal].light.orb),glow:.16}
  ];
  for(const b of bodies){
    if(b.y-r>HY)continue; // fully set below the waterline
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba('+b.col+','+b.glow+')';
    for(let y=-r*2;y<=r*2;y++)for(let x=-r*2;x<=r*2;x++){const yy=b.y+y;if(yy>=HY)continue;if(((x*x+y*y)<(r*1.9)**2)&&((x+y)&1)===0&&(x*x+y*y)>r*r)ctx.fillRect(b.x+x,yy,1,1)}
    ctx.fillStyle=rgb(b.col);
    for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){
      const d=x*x+y*y;if(d>r*r)continue;
      const yy=b.y+y;if(yy>=HY)continue; // the setting body sinks under the water
      if(b.crescent){const x2=x-r*.45,y2=y-r*.1;if(x2*x2+y2*y2<(r*.85)**2)continue}
      ctx.fillRect(b.x+x,yy,1,1);
    }
    ctx.globalAlpha=1;
  }
  // water streaks
  ctx.fillStyle=trans?rgb(mix(hex(trans.sc.streak),hex(sc_.streak),tf)):sc_.streak;
  const oxS=W*(.37+.26*S); // reflection shimmer drifts with the visible body (moon 37%W -> sun 63%W)
  for(const s of streaks){
    const a=.12+.3*(.5+.5*Math.sin(T*.9+s.p));
    const sx=(s.near?oxS+s.dx:s.dx)+T*s.v;
    ctx.globalAlpha=a;ctx.fillRect(Math.floor(((sx%W)+W)%W),s.y,s.w,1);
  }
  ctx.globalAlpha=1;
  // reeds: curved, tapered, leaning blades with per-blade sway
  const wind=T*.8;
  const drawBlades=list=>{for(const b of list){
    const seg=2,n=Math.ceil(b.h/seg),dkH=H*.1,sw=Math.sin(wind*b.ph+b.x*.02+b.p)*2.6;
    let ox2=0;
    for(let j=0;j<n;j++){
      const f=j*seg/b.h;ox2=Math.round((b.lean+sw)*Math.pow(f,b.curve));
      const y=b.y0-j*seg,wid=(b.l>0&&f<.3)?2:1;
      ctx.fillStyle=(b.y0-y<dkH*(b.l===2?1:.5))?b.dk:(f>.8?b.col2:b.col);
      ctx.fillRect(Math.floor(b.x)+ox2,y,wid,seg);
    }
    if(b.head){ctx.fillStyle=b.col2;ctx.fillRect(Math.floor(b.x)+ox2-1,b.y0-b.h-4,3,6);ctx.fillRect(Math.floor(b.x)+ox2,b.y0-b.h-6,1,2)}
  }};
  if(trans){drawBlades(trans.blades);ctx.globalAlpha=tf;drawBlades(blades);ctx.globalAlpha=1}
  else drawBlades(blades);
  // intro: render the scene into the buffer (above), then composite dormant + expanding reveal onto the real canvas
  if(intro0>=0){
    const introP2=(t-intro0)/INTRO_MS;
    if(introP2>=1)intro0=-1;else{ctx=realCtx;drawIntroFx(realCtx,introP2,sc_,sceneBuf)}
  }
}
function loop(t){
  raf=requestAnimationFrame(loop);
  if(t-last<33)return;last=t;frame(t);
}
function start(){
  cancelAnimationFrame(raf);build();
  if(reduce){frame(4000);return}
  raf=requestAnimationFrame(loop);
}
document.addEventListener('visibilitychange',()=>{if(reduce)return;if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(loop)});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(start,150)});
window.landscape={set(p,m){
  if(p===pal&&m===mode)return;
  const themeCh=m!==mode;
  if(!reduce&&statics&&intro0<0){trans={t0:performance.now(),dur:themeCh?900:400,statics,clouds,blades,sc:SCENES[pal][mode],S0:mode==='light'?1:0,S1:m==='light'?1:0};
    const cls=themeCh?'theme-sync':'palette-sync';document.body.classList.add(cls);setTimeout(()=>document.body.classList.remove(cls),themeCh?950:450)}
  pal=p;mode=m;start();
},intro(){if(!reduce)intro0=performance.now()}};
start();
if(!reduce)intro0=performance.now();
})();
