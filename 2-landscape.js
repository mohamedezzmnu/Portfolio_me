/* Pixel-landscape background: original WebGL fragment-shader renderer.
   Procedural sky, corner cumulus clouds, sun/moon, streaked water with glitter
   reflection, and dense bent reeds. Re-themed by palette + light/dark.
   Written from scratch for this portfolio (standard noise/hash techniques only). */
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
const INTRO_MS=2000, TRANS_MS=900;
const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
const mixc=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);

const FRAG=`
precision highp float;
uniform vec2 uRes;uniform float uTime;uniform float uIntro;uniform float uMix;uniform float uDayF;
uniform vec3 uPalA[12];uniform vec3 uPalB[12];
uniform vec4 uRip[4];
uniform sampler2D uCloudTex;
const float HY=0.365;

float h11(float n){return fract(sin(n*127.1)*43758.5453);}
float Bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float Bayer4(vec2 a){return Bayer2(.5*a)*.25+Bayer2(a);}
float h12(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h12(i),h12(i+vec2(1.,0.)),f.x),mix(h12(i+vec2(0.,1.)),h12(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*vnoise(p);p=p*2.13+vec2(7.3,3.1);a*=.5;}return v;}

float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float cloudS(vec2 p,float seed){
 /* small drifter: a few strongly overlapped, vertically squashed balls merging
    into ONE irregular flattened puff (no beads, no rectangular base) */
 float d=1e3;
 for(int i=0;i<6;i++){
  float fi=float(i);
  float j1=h12(vec2(seed,fi*3.7)),j2=h12(vec2(seed+9.,fi*7.1)),j3=h12(vec2(seed+31.,fi*5.3));
  float lx=.5+(j1-.5)*.52;
  float ly=.44+(j2-.5)*.20;
  float rad=.21+j3*.09;
  float dd=length((p-vec2(lx,ly))*vec2(1.,1.55))-rad;
  d=i==0?dd:smin(d,dd,.13);                       /* single merged puff */
 }
 d+=(vnoise(p*vec2(7.,8.)+seed*3.3)-.5)*.03;
 return d;
}
float cd(vec2 p,float seed,int kind){return cloudS(p,seed);}
vec4 cloud(vec2 uv,vec2 c,vec2 r,float seed,vec3 c0,vec3 c1,vec3 c2,float t,int kind){
 c.x+=sin(t*.02+seed*6.1)*.014;
 vec2 p=(uv-c)/r+.5;
 if(p.x<-.3||p.x>1.3||p.y<-.3||p.y>1.4)return vec4(0.);
 float d=cd(p,seed,kind);
 float body=smoothstep(.007,-.007,d);
 if(body<=0.)return vec4(0.);
 /* per-lobe relief: the SDF gradient inside a ball points outward from its
    center, so lighting it shades every ball top-lit, bottom-shaded */
 float e=.025;
 float dx=cd(p+vec2(e,0.),seed,kind)-d;
 float dy=cd(p+vec2(0.,e),seed,kind)-d;
 vec2 n=vec2(dx,dy)/e;
 float nl=max(length(n),.35);
 float bump=dot(n/nl,vec2(-.25,.97))*min(nl*.6,1.);
 float lit=clamp(.38+bump*.58+smoothstep(.15,.9,p.y)*.14,0.,1.);
 vec3 cc=lit<.5?mix(c0,c1,lit*2.):mix(c1,c2,(lit-.5)*2.);
 return vec4(cc,body);
}

/* one grass blade SDF helper (unused by scene; reeds render on the 2D overlay) */

vec3 scene(vec2 uv,vec3 P0,vec3 P1,vec3 P2,vec3 P3,vec3 P4,vec3 P5,vec3 P6,vec3 P7,vec3 P8,vec3 P9,vec3 P10,vec3 P11,float dayF,float t){
 float asp=uRes.x/uRes.y;
 vec3 col;
 /* celestial bodies ride their own rise/set curves */
 float sunY=mix(-.18,.80,smoothstep(.05,.95,dayF));
 float moonY=mix(.80,-.18,smoothstep(.05,.95,dayF));
 vec2 sunP=vec2(.62,sunY),moonP=vec2(.24,moonY);
 float sunUp=clamp(dayF*1.6-.3,0.,1.),moonUp=clamp((1.-dayF)*1.6-.3,0.,1.);
 vec2 orbP=dayF>.5?sunP:moonP;
 float orbUp=max(sunUp,moonUp);

 if(uv.y>HY){
  float g=(uv.y-HY)/(1.-HY);
  col=g<.5?mix(P2,P1,g*2.):mix(P1,P0,(g-.5)*2.);
  col+=(vnoise(gl_FragCoord.xy/3.1)-.5)*.011;   /* fine isotropic sky grain, no streaks */
  /* warm haze near the sun */
  if(sunUp>0.){
   vec2 od=(uv-sunP)*vec2(asp,1.);
   col=mix(col,P9,exp(-length(od)*7.)*.13*sunUp);
  }
  /* stars */
  if(dayF<1.){
   vec2 sc=vec2(uv.x*asp,uv.y)*46.;
   vec2 cell=floor(sc);
   float sh=h12(cell);
   if(sh>.885){
    vec2 sp=vec2(h12(cell+7.13),h12(cell+3.71));
    float sd=length((fract(sc)-sp)*vec2(1.,1.));
    float tw=.5+.5*sin(t*(1.+sh*2.)+sh*43.);
    float br=(.35+.65*h12(cell+1.91))*tw*(1.-dayF);
    col=mix(col,vec3(.96,.94,.9),smoothstep(.13,.02,sd)*br*.9);
   }
  }
  /* clouds: each side tower = two stacked squarish clusters (keeps lobes round),
     plus horizon mounds and small drifters; y-radii aspect-compensated */
  float casp=min(asp/.462,3.);
  /* corner cumulus banks: pre-rendered curved-path sprite (2D canvas union of
     true ellipses, per-lobe top-lit shading in luminance), tinted by palette */
  vec2 cuv=vec2(clamp(uv.x+sin(t*.02)*.008,0.,1.),uv.y);
  vec4 cs=texture2D(uCloudTex,cuv);
  if(cs.a>.003){
   float lit=cs.r;
   /* multi-anchor bank tint: derived shadow/highlight anchors extend the
      palette range so shaded patches read (P6..P8 alone compress contrast) */
   vec3 cd=P6*.72;
   vec3 cm=mix(P6,P7,.4);
   vec3 cb=mix(P8,vec3(1.),.25);
   vec3 cc=lit<.30?mix(cd,P6*.9,lit/.30)
         :lit<.50?mix(P6*.9,P6,(lit-.30)/.20)
         :lit<.65?mix(P6,cm,(lit-.50)/.15)
         :lit<.85?mix(cm,P8,(lit-.65)/.20)
         :mix(P8,cb,(lit-.85)/.15);
   vec3 ccd=lit<.25?P6
          :lit<.50?mix(P6,P7,(lit-.25)/.25)
          :lit<.80?mix(P7,P8,(lit-.50)/.30)
          :mix(P8,cb,(lit-.80)/.20);
   cc=mix(ccd,cc,dayF);
   float cl=dot(cc,vec3(.299,.587,.114));
   cc=mix(cc,vec3(cl),.12);
   col=mix(col,cc,cs.a);
  }
  vec4 cl;
  cl=cloud(uv,vec2(.33,.66),vec2(.11,.055*casp),12.2,P6,P7,P8,t,1);col=mix(col,cl.rgb,cl.a*.9);
  cl=cloud(uv,vec2(.58,.60),vec2(.08,.045*casp),15.8,P6,P7,P8,t,1);col=mix(col,cl.rgb,cl.a*.85);
  /* birds by day */
  if(dayF>.02){
   for(int i=0;i<3;i++){
    float fi=float(i);
    vec2 bp=vec2(fract(t*.006+fi*.37)*1.3-.15,.70+fi*.045+sin(t*.5+fi*2.)*.008);
    vec2 dd=(uv-bp)*uRes;
    float fl=sin(t*5.+fi*2.6)>0.?1.:-1.;
    float wing=abs(dd.y-abs(dd.x)*.62*fl*.8);
    float bm=(1.-smoothstep(.6,1.4,wing))*step(abs(dd.x),5.)*step(1.2,abs(dd.x));
    col=mix(col,P0*.55,bm*.5*dayF);
   }
  }
  /* sun */
  if(sunUp>0.){
   vec2 od=(uv-sunP)*vec2(asp,1.);
   float d=length(od);
   col=mix(col,P9,exp(-d*8.)*.16*sunUp);
   col=mix(col,P9,smoothstep(.052,.044,d)*sunUp);
   col=mix(col,P9*1.10,smoothstep(.032,.016,d)*sunUp*.5);
  }
  /* crescent moon */
  if(moonUp>0.){
   vec2 od=(uv-moonP)*vec2(asp,1.);
   float d=length(od);
   col=mix(col,P9,exp(-d*16.)*.22*moonUp);
   float body=smoothstep(.040,.034,d);
   float d2=length((uv-moonP-vec2(.018,.009))*vec2(asp,1.));
   body*=smoothstep(.032,.038,d2);
   col=mix(col,vec3(.95,.93,.88),body*moonUp);
  }
 }else{
  /* water */
  float dp=(HY-uv.y)/HY;
  col=mix(P3,P5,pow(dp,.72));
  col=mix(col,P11,exp(-(HY-uv.y)*95.)*.5);            /* horizon light line */
  float sn=vnoise(vec2(uv.x*9.+t*.025,uv.y*230.));
  col=mix(col,P11,smoothstep(.78,.95,sn)*.07*(1.-dp*.6));
  float sn2=vnoise(vec2(uv.x*21.-t*.016,uv.y*85.));
  col=mix(col,P11,smoothstep(.82,.96,sn2)*.05*(1.-dp*.4));
  col+=(vnoise(vec2(uv.x*60.,uv.y*400.))-.5)*.02;
  /* glitter column under the risen body: broad irregular bright dashes */
  if(orbUp>.02){
   float cw=(.07+.16*dp);
   float dx=abs(uv.x-orbP.x);
   col=mix(col,P11,exp(-dx*dx/(cw*cw*2.))*exp(-(HY-uv.y)*22.)*.30*orbUp);
   if(dx<cw){
    float row=floor(gl_FragCoord.y/2.);
    float ts=floor(t*6.);
    float n=h12(vec2(row*.911,ts));
    float n2=h12(vec2(row*3.71,ts+17.3));
    float off=(n-.5)*2.*cw*.85;
    float dw=2.+9.*n2;
    float d=abs((uv.x-orbP.x-off)*uRes.x);
    float on=step(.25,n2);
    float a=(1.-smoothstep(dw*.4,dw,d))*on*(.85-.55*dp);
    col=mix(col,P11,a*.9*orbUp);
   }
  }
  /* tap ripples */
  for(int j=0;j<4;j++){
   vec4 rp=uRip[j];
   if(rp.z>0.){
    float rr=rp.z*.10;
    float e=abs(length((uv-vec2(rp.x,rp.y))*vec2(asp*2.1,8.5))-rr);
    float band=exp(-e*e*900.)*max(0.,1.-rp.z/5.)*rp.w;
    col=mix(col,P11,band*.45);
   }
  }
 }

 /* fine ordered-dither texture (reference-style screen tone) + slight grain */
 col+=(Bayer4(gl_FragCoord.xy)-.6)*.026+(h12(gl_FragCoord.xy)-.5)*.014;
 return col;
}

void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float t=uTime;
 vec3 col;
 if(uMix>.999){
  col=scene(uv,uPalB[0],uPalB[1],uPalB[2],uPalB[3],uPalB[4],uPalB[5],uPalB[6],uPalB[7],uPalB[8],uPalB[9],uPalB[10],uPalB[11],uDayF,t);
 }else{
  /* theme/palette change: smooth crossfade while the bodies ride their arcs */
  vec3 cA=scene(uv,uPalA[0],uPalA[1],uPalA[2],uPalA[3],uPalA[4],uPalA[5],uPalA[6],uPalA[7],uPalA[8],uPalA[9],uPalA[10],uPalA[11],uDayF,t);
  vec3 cB=scene(uv,uPalB[0],uPalB[1],uPalB[2],uPalB[3],uPalB[4],uPalB[5],uPalB[6],uPalB[7],uPalB[8],uPalB[9],uPalB[10],uPalB[11],uDayF,t);
  col=mix(cA,cB,uMix);
 }
 /* intro: a bright drop falls to the water, splash, then a ring of scene expands */
 float p=uIntro;
 if(p<.999){
  float asp=uRes.x/uRes.y;
  vec3 dorm=col*.30;
  dorm+=uPalB[2]*exp(-abs(uv.y-HY)*9.)*.10;
  float dropEnd=.26;
  if(p<dropEnd){
   float e=p/dropEnd;
   col=mix(vec3(.01,.01,.012),dorm,smoothstep(0.,.55,e));
   vec2 dp2=vec2(.48,1.04-e*e*(1.04-HY));
   vec2 dpx=(uv-dp2)*uRes;
   float head=1.-smoothstep(1.,3.4,length(vec2(dpx.x/1.6,dpx.y/2.6)));
   float tail=0.;
   if(dpx.y>0.&&dpx.y<26.){float tt=dpx.y/26.;tail=(1.-tt)*(1.-smoothstep(.3,1.8,abs(dpx.x)- (1.-tt)*1.2));}
   float glow=exp(-length(dpx)*.10)*.5;
   float dv=clamp(max(head,tail)+glow,0.,1.)*min(1.,e*5.);
   col=mix(col,mix(uPalB[11],vec3(1.),.35),dv);
  }else{
   float q=clamp((p-dropEnd)/(1.-dropEnd),0.,1.);
   float qe=1.-pow(1.-q,2.6);
   vec2 org=vec2(.48,HY);
   vec2 df=(uv-org)*vec2(asp*.9,1.);
   float dist=length(df);
   float ang=atan(df.y,df.x);
   float maxd=length(vec2(asp*.9,1.))+.1;
   float wob=sin(ang*6.+q*4.)*.022+sin(ang*13.-q*7.)*.011+(vnoise(uv*14.)-.5)*.05;
   float front=(.02+qe*maxd)*(1.+wob);
   float inEdge=1.-smoothstep(front-.03,front+.015,dist);
   col=mix(dorm,col,inEdge);
   float crest=exp(-pow((dist-front)*26.,2.))*(1.-smoothstep(.6,.95,q));
   col=mix(col,uPalB[11],crest*.6);
   /* splash droplets */
   float age=q*1.35;
   if(age<1.){
    for(int i=0;i<7;i++){
     float fi=float(i);
     float vx=(fi/6.-.5)*.14;
     vec2 pp=org+vec2(vx*age,.10*age-.5*.34*age*age);
     vec2 dd=(uv-pp)*uRes;
     float a=max(0.,1.-age)*(1.-smoothstep(.8,1.8,length(dd)));
     col=mix(col,uPalB[11],a*.8);
    }
    /* expanding rings on the water */
    for(int k=0;k<2;k++){
     float ek=clamp((age-float(k)*.22)/1.1,0.,1.);
     if(ek>0.){
      float rr=.015+.20*(1.-pow(1.-ek,2.2));
      float e2=abs(length((uv-org)*vec2(asp*1.8,7.))-rr);
      float a2=exp(-e2*e2*1400.)*(1.-ek);
      col=mix(col,uPalB[11],a2*.5);
     }
    }
   }
  }
 }
 gl_FragColor=vec4(col,1.);
}`;
const VSH='attribute vec2 aP;void main(){gl_Position=vec4(aP,0.,1.);}';

const canvas=document.querySelector('.pixel-landscape-canvas');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let gl,prog,U={},pal='nile-silt',mode='dark';
let palA,palB,mix01=1,dayF=0,intro0=reduce?-1:performance.now();
let ripples=[],raf=0;

/* ---- reed overlay: dense curved tapered blades, 2D canvas above the GL scene ---- */
const rcan=document.createElement('canvas');
rcan.setAttribute('aria-hidden','true');
rcan.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;display:block;pointer-events:none';
canvas.after(rcan);
const rctx=rcan.getContext('2d');
let blades=[];
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const ss=(a,b,x)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
const c8=v=>Math.max(0,Math.min(255,Math.round(v*255)));
const rgb=(v,k)=>`rgb(${c8(v[0]*k)},${c8(v[1]*k)},${c8(v[2]*k)})`;
function buildBlades(){
 blades=[];const W=innerWidth,H=innerHeight,rnd=mulberry(20261126);
 const layer=(n,h0,h1,w0,w1,l0,l1,bf,heads)=>{
  for(let i=0;i<n;i++){
   const xb=(i+.15+rnd()*.7)/n*W;
   const h=H*(h0+(h1-h0)*Math.pow(rnd(),1.25));
   const lean=(rnd()<.62?1:-1)*(l0+(l1-l0)*rnd())*h;   /* prevailing wind with variation */
   blades.push({xb,h,lean,curv:1.15+rnd()*.5,w:w0+(w1-w0)*rnd(),ph:rnd()*6.28,bf:bf*(mode==='dark'?.60:1),head:heads&&rnd()>.62});
  }};
 layer(Math.round(W/4.5),.03,.09,1.6,2.8,.03,.10,.38,false);
 layer(Math.round(W/5.5),.05,.15,1.1,2.2,.04,.16,.55,false);
 layer(Math.round(W/8),.12,.26,1.8,3.4,.10,.28,.9,false);
 layer(Math.round(W/34),.18,.30,3.0,5.2,.14,.32,1.15,true);
}
function drawReeds(now){
 const W=rcan.width,H=rcan.height;
 if(W<4||!blades.length)return;
 let alpha=1;
 if(intro0>=0){const e=(now-intro0)/INTRO_MS;alpha=ss(.35,.85,e);if(alpha<=0)return;}
 const rd=[0,1,2].map(i=>palA[30+i]+(palB[30+i]-palA[30+i])*mix01);
 const t=now/1000,sx=W/innerWidth,sy=H/innerHeight;
 rctx.clearRect(0,0,W,H);
 rctx.globalAlpha=alpha;
 /* dark foliage bank with an irregular top edge */
 rctx.fillStyle=rgb(rd,.16);
 rctx.beginPath();rctx.moveTo(0,H);rctx.lineTo(0,H-8*sy);
 for(let x=0;x<=W;x+=Math.max(6,W/60))rctx.lineTo(x,H-(5+13*Math.abs(Math.sin(x*.043)+Math.sin(x*.011+2.))*.5)*sy);
 rctx.lineTo(W,H);rctx.closePath();rctx.fill();
 for(const b of blades){
  const sway=Math.sin(t*.85+b.ph)*.012*b.h;
  const g=rctx.createLinearGradient(0,H,0,H-b.h*sy);
  g.addColorStop(0,rgb(rd,b.bf*.32));g.addColorStop(1,rgb(rd,b.bf));
  rctx.fillStyle=g;
  const N=10,N2=N;
  rctx.beginPath();
  for(let s=0;s<=N;s++){const u=s/N;
   const x=(b.xb+(b.lean+sway)*Math.pow(u,b.curv))*sx,y=H-b.h*u*sy;
   const w=Math.max(.4,b.w*(1-ss(.45,1,u)*.8))*sx/2;
   s===0?rctx.moveTo(x-w,y):rctx.lineTo(x-w,y);}
  for(let s=N2;s>=0;s--){const u=s/N;
   const x=(b.xb+(b.lean+sway)*Math.pow(u,b.curv))*sx,y=H-b.h*u*sy;
   const w=Math.max(.4,b.w*(1-ss(.45,1,u)*.8))*sx/2;
   rctx.lineTo(x+w,y);}
  rctx.closePath();rctx.fill();
  if(b.head){
   const tx=(b.xb+b.lean+sway)*sx,ty=H-b.h*sy;
   rctx.fillStyle=rgb(rd,b.bf*.8);
   rctx.beginPath();rctx.ellipse(tx,ty-2*sy,1.5*sx,4.5*sy,Math.atan2(b.lean,b.h),0,6.29);rctx.fill();
  }
 }
 rctx.globalAlpha=1;
}

function packPal(p,m){const s=SCENES[p][m];const out=[];
 out.push(hex(s.sky[0]),mixc(hex(s.sky[1]),hex(s.sky[2]),.5),hex(s.sky[3]));
 out.push(hex(s.water[0]),hex(s.water[1]),hex(s.water[2]));
 out.push(hex(s.cloud[0]),hex(s.cloud[1]),hex(s.cloud[2]));
 out.push(hex(s.orb),hex(s.reed),hex(s.streak));
 return new Float32Array(out.flat());}


/* ---- cloud bank sprite: curved 2D paths (union of true ellipses) rendered
   offscreen once per layout; R channel = lighting (0 shade .. 1 lit), A = mask ---- */
/* corner bank geometry: smooth inner-edge contour (control pts, cosine-interp),
   broad connected under-mass, fine varied crust lobes, edge fill offscreen */
function contourPts(ctl){
 const pts=[];
 for(let i=0;i<ctl.length-1;i++){
  const a=ctl[i],b=ctl[i+1];
  for(let k=0;k<8;k++){const t=k/8,u=(1-Math.cos(t*Math.PI))/2;
   pts.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]);}
 }
 pts.push(ctl[ctl.length-1].slice());
 return pts;
}
function bankPath(side,seed,W,H){
 const R=mulberry(seed);
 /* SOLID filled closed wedge: diagonal inner edge, sky above rounded peak,
    flat scalloped base, mass extending offscreen. Returns core and crust as
    SEPARATE paths: the polygon and ellipse subpaths wind oppositely, so one
    combined nonzero fill carves holes (z5c defect); separate source-over
    fills union correctly. */
 const diag=side>0
  ?[[.600,.285],[.650,.258],[.680,.208],[.730,.192],[.765,.138],[.815,.126],[.850,.090],[.900,.084],[.945,.090],[.978,.100]]
  :[[.280,.250],[.242,.212],[.205,.168],[.170,.146],[.140,.108],[.112,.086],[.090,.058],[.068,.052],[.048,.052]];
 const baseY=side>0?.290:.258;
 /* stepped diagonal: horizontal tread then vertical riser between control
    points, matching the reference's crisp step silhouette */
 let ctl=diag;
 if(side>0){ /* right tower: horizontal tread then vertical riser, the reference's crisp steps; left bank is a smooth mound in the ref, steps read as ledges there */
  ctl=[diag[0]];
  for(let i=1;i<diag.length;i++){ctl.push([diag[i][0],diag[i-1][1]]);ctl.push(diag[i]);}
  for(let i=1;i<ctl.length-1;i++){ctl[i][0]+=(R()-.5)*.006;ctl[i][1]+=(R()-.5)*.005;}
 }
 const pts=contourPts(ctl);
 const core=new Path2D();
 const off=side>0?1.04:-0.04;
 core.moveTo(diag[0][0]*W,baseY*H);
 for(const[cx,cy]of pts)core.lineTo(cx*W,cy*H);
 core.lineTo(side>0?1.0*W:0,pts[pts.length-1][1]*H);
 core.lineTo(off*W,pts[pts.length-1][1]*H);
 core.lineTo(off*W,baseY*H);
 /* scalloped base: downward arcs along the closing edge (silhouette bumps,
    part of the core outline, so no per-bump rim) */
 const nb=side>0?8:7;
 for(let k=0;k<nb;k++){
  const i=side>0?nb-1-k:k; /* arc sweep must follow the base traversal direction, else the self-crossing outline cancels to a slit (z8f artifact) */
  const bx=side>0?diag[0][0]+(1.0-diag[0][0])*(i+.5)/nb:diag[0][0]*(i+.5)/nb;
  if(R()<.35)continue; /* gaps: mostly horizontal irregular base, not a uniform row */
  const r=.013*H*(0.45+1.5*R());
  if(side>0)core.ellipse(bx*W,(baseY+(R()-.5)*.010)*H,r,r*.5,0,0,Math.PI);
  else core.ellipse(bx*W,(baseY+(R()-.5)*.010)*H,r,r*.5,0,Math.PI,0,true);
 }
 core.lineTo(diag[0][0]*W,baseY*H);
 core.closePath();
 /* broad irregular stepped bulges straddling the diagonal: every 2nd
    interpolated point, wide size variation, some skipped */
 const crust=new Path2D();
 for(let i=0;i<pts.length;i+=2){
  if(R()<(side>0?.22:.30))continue;
  const[cx,cy]=pts[i];
  let r=(side>0?.020:.011)*H*(0.60+0.9*R());
  if(R()<.12)r*=1.5;
  r=Math.min(r,Math.max(4,cy*H-(side>0?.080:.030)*H)); /* keep peaks at measured ref extents (.09H right, .035H left) */
  const jx=(R()-.5)*.012*W,jy=(R()-.5)*.006*H;
  const rx=r,ry=side>0?r*.9:r*.85;
  crust.moveTo(cx*W+jx+rx,cy*H+jy);
  crust.ellipse(cx*W+jx,cy*H+jy,rx,ry,0,0,7);
 }
 return {core,crust,pts,side};
}

function genCloudSprite(W,H){
 const c2=document.createElement('canvas');c2.width=Math.max(2,W);c2.height=Math.max(2,H);
 const x2=c2.getContext('2d');
 const bR=bankPath(1,7,c2.width,c2.height),bL=bankPath(-1,21,c2.width,c2.height);
 const rim=Math.max(2,Math.round(c2.height*.004));
 x2.fillStyle='rgb(205,205,205)';
 for(const b of[bR,bL]){x2.fill(b.core);x2.fill(b.crust);}
 x2.globalCompositeOperation='source-atop';
 x2.save();x2.translate(0,rim);x2.fillStyle='rgb(130,130,130)';
 for(const b of[bR,bL]){x2.fill(b.core);x2.fill(b.crust);}
 x2.restore();
 /* per-tier shading: bright band hugging the sky side of the contour,
    darker patch just inside, elongated along the tangent - matches the
    reference's per-step highlights without ball-per-lobe shading */
 for(const b of[bR,bL]){
  const pts=b.pts,Rt=mulberry(b.side>0?55:77);
  for(let i=2;i<pts.length-2;i+=5){
   if(Rt()<.2)continue;
   const[cx,cy]=pts[i],[dx2,dy2]=[pts[i+1][0]-pts[i-1][0],pts[i+1][1]-pts[i-1][1]];
   const L=Math.hypot(dx2,dy2)||1,nx=dy2/L,ny=-dx2/L,ang=Math.atan2(dy2,dx2);
   const px=cx*c2.width,py=cy*c2.height;
   const rb=(.036+.024*Rt())*c2.height;
   x2.save();x2.translate(px+nx*.019*c2.height,py+ny*.019*c2.height);x2.rotate(ang);x2.scale(1.9,1);
   let g=x2.createRadialGradient(0,0,rb*.15,0,0,rb);
   g.addColorStop(0,`rgba(255,246,224,${.40+.10*Rt()})`);g.addColorStop(1,'rgba(0,0,0,0)');
   x2.fillStyle=g;x2.fillRect(-rb,-rb,rb*2,rb*2);x2.restore();
   const rs=(.040+.030*Rt())*c2.height;
   x2.save();x2.translate(px-nx*.034*c2.height,py-ny*.034*c2.height);x2.rotate(ang);x2.scale(1.9,1);
   g=x2.createRadialGradient(0,0,rs*.2,0,0,rs);
   g.addColorStop(0,`rgba(40,28,14,${.10+.07*Rt()})`);g.addColorStop(1,'rgba(0,0,0,0)');
   x2.fillStyle=g;x2.fillRect(-rs,-rs,rs*2,rs*2);x2.restore();
  }
 }
 /* broad soft volume: muted darker low/interior patches + faint top lift,
    breaking the flat face (radial gradients, source-atop = mass only) */
 const blob=(cx,cy,r,dark,a)=>{
  const g=x2.createRadialGradient(cx,cy,r*.1,cx,cy,r);
  g.addColorStop(0,dark?`rgba(30,20,10,${a})`:`rgba(255,250,235,${a})`);
  g.addColorStop(1,'rgba(0,0,0,0)');
  x2.fillStyle=g;x2.fillRect(cx-r,cy-r,r*2,r*2);
 };
 const W2=c2.width,H2=c2.height;
 blob(.76*W2,.24*H2,.135*H2,true,.26);
 blob(.84*W2,.20*H2,.10*H2,true,.16);
 blob(.95*W2,.19*H2,.10*H2,true,.16);
 blob(.70*W2,.155*H2,.06*H2,true,.12);
 blob(.86*W2,.11*H2,.07*H2,false,.12);
 blob(.92*W2,.245*H2,.07*H2,true,.18);
 blob(.66*W2,.27*H2,.05*H2,true,.12);
 blob(.12*W2,.20*H2,.11*H2,true,.20);
 blob(.22*W2,.23*H2,.07*H2,true,.11);
 blob(.05*W2,.13*H2,.06*H2,true,.12);
 blob(.09*W2,.065*H2,.06*H2,false,.12);
 /* granular dithered highlights/shadows: deterministic 1-3px speckle in the
    luminance channel, denser toward the top of the masses */
 const R3=mulberry(91);
 for(let i=0;i<5200;i++){
  const sx=R3()*W2,sy=R3()*H2*.34;
  const top=1-sy/(.34*H2);
  if(R3()>.25+top*.6)continue;
  const s=R3()<.85?1:(2+R3()*2)|0;
  const hi=R3()<.5;
  x2.fillStyle=hi?`rgba(255,246,225,${.05+R3()*.07})`:`rgba(35,25,12,${.06+R3()*.08})`;
  x2.fillRect(sx,sy,s,s);
 }
 const vg=x2.createLinearGradient(0,c2.height*.1,0,c2.height*.7);
 vg.addColorStop(0,'rgba(255,255,255,.10)');vg.addColorStop(1,'rgba(0,0,0,.14)');
 x2.fillStyle=vg;x2.fillRect(0,0,c2.width,c2.height);
 /* posterize luminance into flat patches with ordered-dither transitions and
    dithered crisp edges - the reference's indexed-color/granular look */
 {
  const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const id=x2.getImageData(0,0,c2.width,c2.height),d=id.data;
  const step=24,w4=c2.width;
  for(let y=0;y<c2.height;y++)for(let x=0;x<w4;x++){
   const i=(y*w4+x)*4,bt=(B[(y&3)*4+(x&3)]+.5)/16;
   let v=d[i]+(bt-.5)*step;
   v=Math.max(72,Math.min(216,Math.round(v/step)*step));
   d[i]=d[i+1]=d[i+2]=v;
   d[i+3]=d[i+3]>bt*255?255:0;
  }
  x2.putImageData(id,0,0);
 }
 return c2;
}
let cloudTex=null;
function uploadCloudSprite(){
 const spr=genCloudSprite(canvas.width,canvas.height);
 if(!cloudTex)cloudTex=gl.createTexture();
 gl.bindTexture(gl.TEXTURE_2D,cloudTex);
 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,spr);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
}

function initGL(){
 gl=canvas.getContext('webgl',{antialias:false,alpha:false,preserveDrawingBuffer:true});
 if(!gl){window.__glerr='no-webgl';fallback2d();return false;}
 const sh=(t,src)=>{const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){window.__glerr=gl.getShaderInfoLog(s);return null;}return s;};
 const vs=sh(gl.VERTEX_SHADER,VSH),fs=sh(gl.FRAGMENT_SHADER,FRAG);
 if(!vs||!fs)return false;
 prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){window.__glerr=gl.getProgramInfoLog(prog);return false;}
 gl.useProgram(prog);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(prog,'aP');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 for(const n of ['uRes','uTime','uIntro','uMix','uDayF','uPalA','uPalB','uRip','uCloudTex'])U[n]=gl.getUniformLocation(prog,n);
 gl.uniform1i(U.uCloudTex,0);
 return true;
}
function fallback2d(){const c=canvas.getContext('2d');const g=c.createLinearGradient(0,0,0,canvas.height);
 const s=SCENES[pal][mode];g.addColorStop(0,s.sky[0]);g.addColorStop(.6,s.sky[3]);g.addColorStop(.63,s.water[0]);g.addColorStop(1,s.water[2]);
 c.fillStyle=g;c.fillRect(0,0,canvas.width,canvas.height);
 drawReeds(performance.now());}
function size(){
 const dpr=Math.min(devicePixelRatio||1,2);
 let w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);
 const cap=1600000,scale=Math.min(1,Math.sqrt(cap/(w*h)));
 canvas.width=Math.max(2,Math.round(w*scale));canvas.height=Math.max(2,Math.round(h*scale));
 rcan.width=canvas.width;rcan.height=canvas.height;
 buildBlades();
 if(gl){gl.viewport(0,0,canvas.width,canvas.height);uploadCloudSprite();}}
function frame(now){
 const t=now/1000;
 gl.uniform2f(U.uRes,canvas.width,canvas.height);
 gl.uniform1f(U.uTime,t%3600);
 gl.uniform1f(U.uIntro,intro0<0?1:Math.min(1,(now-intro0)/INTRO_MS));
 gl.uniform1f(U.uMix,mix01);
 gl.uniform1f(U.uDayF,dayF);
 gl.uniform3fv(U.uPalA,palA);gl.uniform3fv(U.uPalB,palB);
 const rp=new Float32Array(16);
 ripples=ripples.filter(r=>now-r.t0<5000);
 ripples.slice(0,4).forEach((r,i)=>{rp[i*4]=r.x;rp[i*4+1]=r.y;rp[i*4+2]=(now-r.t0)/1000;rp[i*4+3]=r.s;});
 gl.uniform4fv(U.uRip,rp);
 gl.drawArrays(gl.TRIANGLES,0,3);
}
function loop(now){frame(now);drawReeds(now);if(!reduce)raf=requestAnimationFrame(loop);}

palA=packPal(pal,mode);palB=palA;
function start(){
 size();
 if(!gl&&!initGL())return;
 size();
 if(reduce){frame(performance.now());drawReeds(performance.now());return;}
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
window.landscape={
 set(p,m){
  if(p===pal&&m===mode)return;
  intro0=-1;  /* a theme/palette click during the intro skips it, so background and UI transitions start together at full brightness */
  const themeCh=m!==mode;
  palA=new Float32Array(palB);
  pal=p;mode=m;palB=packPal(p,m);
  buildBlades();
  mix01=0;
  const day0=dayF,day1=m==='light'?1:0;
  const t0=performance.now(),dur=themeCh?TRANS_MS:400;
  const step=n=>{const e=Math.min(1,(n-t0)/dur);
   mix01=e;dayF=day0+(day1-day0)*e;
   if(e<1&&!reduce)requestAnimationFrame(step);};
  if(!reduce)requestAnimationFrame(step);else{mix01=1;dayF=day1;drawReeds(performance.now());}
  const cls=themeCh?'theme-sync':'palette-sync';document.body.classList.add(cls);
  setTimeout(()=>document.body.classList.remove(cls),themeCh?950:450);
 },
 intro(){intro0=reduce?-1:performance.now();}
};
addEventListener('pointerdown',e=>{
 const y=1-e.clientY/innerHeight;
 if(y<.365)ripples.push({x:e.clientX/innerWidth,y,t0:performance.now(),s:.8});
});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(start,150)});
document.addEventListener('visibilitychange',()=>{if(reduce)return;
 if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(loop)});
start();
})();
