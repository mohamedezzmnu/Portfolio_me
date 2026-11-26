/* Mohamed Ezz — portfolio app. Original code.
   Spring / jelly motion system, morph buttons, folder panel outline,
   drum rail, stack + education views, dialogs, i18n, theme + palette. */
'use strict';

/* ================= content ================= */
const EMAIL='mohamedezzmnu@gmail.com';
const ICON={
 sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 moon:'<svg viewBox="0 0 24 24"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>',
 mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
 gh:'<svg viewBox="0 0 24 24"><path d="M9 19c-4 1.3-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
 li:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13c0-1.3 1-2 2-2s2 .7 2 2v3"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"/></svg>',
 kg:'<svg viewBox="0 0 24 24"><path d="M8 4v16M8 13l8-9M10.5 11.5 17 20"/></svg>',
 ud:'<svg viewBox="0 0 24 24"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>'
};
const LINKS=[
 ['email','mailto:'+EMAIL,'mail',true],
 ['x','https://x.com/ezz1611','x',false],
 ['kaggle','https://www.kaggle.com/mohamedezzf','kg',false],
 ['github','https://github.com/mohamedezzmnu','gh',false],
 ['linkedin','https://www.linkedin.com/in/mohamed-ezz-45825a390','li',false]
];
const T={
en:{
 name:'Mohamed Ezz',sub:'AI & ML developer · Computer Science · Minya, Egypt',more:'more about me',msg:'message me',
 pitch:'Building intelligent products where AI, data, and web development meet.',
 pitch2:'Currently building applied ML and full-stack projects while studying Computer Science & Artificial Intelligence.',
 copy:'copy email',copied:'copied',switch:'switch',
 tabs:{exp:'Experience',proj:'Projects',stack:'Skills',edu:'Education'},
 palettes:{'nile-silt':'nile silt','deep-moss':'deep moss','basalt':'basalt','nocturne':'nocturne'},
 tips:{palette:'palette',light:'light',dark:'dark',lang:'عربي'},
 exp:[
  {t:'Machine Learning Training',sub:'NTI · trainee',date:'1 month · 6h/day',role:'NTI — National Telecommunication Institute',
   b:['120-hour intensive training, 6 hours a day, Sunday to Thursday.','How to approach an ML problem and choose the right model for it.','Exploring data (EDA) and cleaning it before modeling.'],
   chips:['Python','Pandas','Scikit-learn','EDA']},
  {t:'Python & C++ Foundations',sub:'self-taught · online',date:'self-taught',role:'Independent study — YouTube',
   b:['Built core programming fundamentals in Python and C++.','Did it before applying them to real projects.'],
   chips:['Python','C++']}
 ],
 proj:[
  {t:'Gymez',sub:'full-stack fitness platform',role:'Full-stack developer',
   gh:'https://github.com/mohamedezzmnu/GYMZ.git',live:'https://gymez.vercel.app/',
   d:"A full-stack fitness web app that personalizes a user's workout and nutrition based on their own body data and goals, instead of giving everyone the same generic plan.",
   pipe:'onboarding → rules engine → workout plan → nutrition → progress',metric:'2 live apis',
   b:['Problem: people starting a fitness journey usually get one-size-fits-all plans that ignore their condition, goals, and lifestyle.','Approach: a rule-based system (no ML model). User data drives the workout and nutrition logic.','Built: onboarding, weight tracking, personalized workout plans, a nutrition system, and visual progress charts.'],
   chips:[['Next.js','nextjs'],['Supabase','supabase'],['Exercise Image API','api'],['Barcode API','api']]},
  {t:'Bank Term Deposit Prediction',sub:'solo · data prep to deployment',role:'Solo — data prep, modeling, deployment',
   gh:'https://github.com/mohamedezzmnu/bank-term-deposit-prediction.git',live:'https://bank-term-deposit-prediction-gamma.vercel.app/',
   d:"Enter a client's profile and call details to estimate the odds they subscribe to a term deposit.",
   pipe:'eda → cleaning → features → logistic regression → evaluation',metric:'kaggle data',
   b:['Problem: predict whether a bank client subscribes to a term deposit, from their profile and the marketing call details.','Dataset: bank marketing data from Kaggle.','Result: the model was evaluated on unseen test data with classification metrics.'],
   chips:[['Python','python'],['Pandas','pandas'],['Matplotlib','matplotlib'],['Seaborn','seaborn'],['Logistic Regression','lr']]}
 ],
 stack:[['Programming',['Python','C++','JavaScript']],['Machine Learning',['Scikit-learn','Logistic Regression','Classification','Feature Engineering','Model Selection','Model Evaluation']],['Data Analysis',['Pandas','NumPy','Data Cleaning','EDA']],['Visualization',['Matplotlib','Seaborn']],['Web Development',['Next.js','Full-stack Web Development']],['Database',['Supabase']],['Tools',['Git','GitHub','Vercel','Jupyter Notebook']]],
 edu:{date:'2023/24 — 2027/28',t:'Minya National University',deg:'B.Sc. Computer Science & Artificial Intelligence',
  meta:[['degree:','B.Sc.'],['focus:','CS & AI'],['years:','2023/24 – 2027/28']],
  b:['Currently in third year.','Expected graduation: 2027/2028.'],
  box:'certifications & training',boxChips:['NTI · Machine Learning · 120 hours','Python (self-taught)','C++ (self-taught)']},
 about:{lede:"I'm a third-year <strong>Computer Science & AI</strong> student who learns by building — turning fitness data, banking data, and everyday problems into working software.",
  p:["I care about two things equally: writing software people actually use, and understanding the data and models underneath it. My main interests are Web Development and Artificial Intelligence — I like taking an idea from a blank page to a live product, and adding machine learning to it when the problem calls for it, not just because I can.","Right now I'm looking for internship and freelance opportunities where I can keep building real things and learn from people ahead of me."],
  facts:[['based in','Minya, Egypt'],['studying','Computer Science & AI'],['university','Minya National University'],['graduation','2027 / 2028'],['looking for','Internship, Freelance']],
  exploring:'currently exploring',ex:['Machine Learning','Web Development','Artificial Intelligence']},
 contact:{cta:"Let's build something real.",name:'name',email:'email',msg:'message',send:'send message',sending:'sending...',ok:"Message sent — I'll get back to you soon.",err:'Something went wrong — please try again or email me directly.'}
},
ar:{
 name:'محمد عز',sub:'مطوّر AI و ML · حاسبات وذكاء اصطناعي · المنيا، مصر',more:'المزيد عني',msg:'راسلني',
 pitch:'بابني منتجات ذكية في التقاء الذكاء الاصطناعي والبيانات وتطوير الويب.',
 pitch2:'حاليًا بشتغل على مشاريع ML وفل ستاك، وبدرس علوم الحاسب والذكاء الاصطناعي.',
 copy:'نسخ الإيميل',copied:'تم النسخ',switch:'تنقّل',
 tabs:{exp:'الخبرة',proj:'المشاريع',stack:'المهارات',edu:'التعليم'},
 palettes:{'nile-silt':'طمي النيل','deep-moss':'طحلب داكن','basalt':'بازلت','nocturne':'ليلي'},
 tips:{palette:'الألوان',light:'فاتح',dark:'داكن',lang:'en'},
 exp:[
  {t:'تدريب Machine Learning',sub:'NTI · متدرب',date:'شهر · 6 ساعات يوميًا',role:'NTI — المعهد القومي للاتصالات',
   b:['تدريب مكثف 120 ساعة، 6 ساعات يوميًا من الأحد للخميس.','إزاي تفكر في مشكلة ML وتختار الموديل المناسب.','استكشاف البيانات (EDA) وتنظيفها قبل النمذجة.'],
   chips:['Python','Pandas','Scikit-learn','EDA']},
  {t:'أساسيات Python و C++',sub:'تعلّم ذاتي · أونلاين',date:'تعلّم ذاتي',role:'تعلّم ذاتي — يوتيوب',
   b:['بنيت أساسيات برمجية قوية في Python وC++.','قبل ما أطبقها في مشاريع حقيقية.'],
   chips:['Python','C++']}
 ],
 proj:[
  {t:'Gymez',sub:'منصة لياقة فل ستاك',role:'مطوّر فل ستاك',
   gh:'https://github.com/mohamedezzmnu/GYMZ.git',live:'https://gymez.vercel.app/',
   d:'تطبيق ويب متكامل للياقة البدنية بيخصص خطة التمرين والتغذية على حسب بيانات جسم المستخدم وأهدافه، بدل خطة عامة للجميع.',
   pipe:'onboarding → rules engine → workout plan → nutrition → progress',metric:'2 live apis',
   b:['المشكلة: الناس اللي بتبدأ رحلة لياقة بتاخد غالبًا خطط عامة مش بتراعي حالتهم وأهدافهم ونمط حياتهم.','المنهج: نظام بمنطق قواعد (بدون موديل ML)، وبيانات المستخدم بتوجّه منطق التمرين والتغذية.','اللي بنيته: تسجيل البيانات، متابعة الوزن، خطط تمرين مخصصة، نظام غذائي، ورسومات متابعة بصرية.'],
   chips:[['Next.js','nextjs'],['Supabase','supabase'],['Exercise Image API','api'],['Barcode API','api']]},
  {t:'التنبؤ بالودائع البنكية',sub:'فردي · من البيانات للنشر',role:'فردي — تجهيز البيانات، النمذجة، والنشر',
   gh:'https://github.com/mohamedezzmnu/bank-term-deposit-prediction.git',live:'https://bank-term-deposit-prediction-gamma.vercel.app/',
   d:'بتدخل بيانات بروفايل العميل وتفاصيل المكالمة، والموديل بيقدّر احتمالية اشتراكه في وديعة لأجل.',
   pipe:'eda → cleaning → features → logistic regression → evaluation',metric:'kaggle data',
   b:['المشكلة: التنبؤ بإذا كان عميل البنك هيشترك في وديعة لأجل بناءً على بروفايله وتفاصيل مكالمة التسويق.','البيانات: بيانات تسويق بنكي من Kaggle.','النتيجة: اتقيّم الموديل على بيانات اختبار لم يرها بمقاييس تصنيف مناسبة.'],
   chips:[['Python','python'],['Pandas','pandas'],['Matplotlib','matplotlib'],['Seaborn','seaborn'],['Logistic Regression','lr']]}
 ],
 stack:[['البرمجة',['Python','C++','JavaScript']],['تعلم الآلة',['Scikit-learn','Logistic Regression','Classification','Feature Engineering','Model Selection','Model Evaluation']],['تحليل البيانات',['Pandas','NumPy','Data Cleaning','EDA']],['التصوير البياني',['Matplotlib','Seaborn']],['تطوير الويب',['Next.js','تطوير ويب متكامل']],['قاعدة البيانات',['Supabase']],['أدوات',['Git','GitHub','Vercel','Jupyter Notebook']]],
 edu:{date:'2023/24 — 2027/28',t:'جامعة المنيا الأهلية',deg:'بكالوريوس حاسبات وذكاء اصطناعي',
  meta:[['الدرجة:','بكالوريوس'],['التخصص:','حاسبات وذكاء اصطناعي'],['السنوات:','2023/24 – 2027/28']],
  b:['حاليًا في الفرقة الثالثة.','التخرج المتوقع: 2027/2028.'],
  box:'الشهادات والتدريب',boxChips:['NTI · Machine Learning · 120 ساعة','Python (تعلّم ذاتي)','C++ (تعلّم ذاتي)']},
 about:{lede:'أنا طالب فرقة ثالثة في <strong>الحاسبات والذكاء الاصطناعي</strong>، بتعلّم عن طريق البناء الفعلي — بحوّل بيانات اللياقة، والبيانات البنكية، ومشاكل يومية لبرامج شغالة فعلًا.',
  p:['بهتم بحاجتين بنفس القد: إني أكتب سوفتوير الناس بتستخدمه فعلًا، وإني أفهم البيانات والموديلات اللي وراه. أكتر اهتماماتي هي تطوير الويب والذكاء الاصطناعي.','حاليًا بدور على فرص تدريب (Internship) وفريلانس أقدر أكمل فيها أبني حاجات حقيقية وأتعلم من ناس أكبر مني في الخبرة.'],
  facts:[['مقيم في','المنيا، مصر'],['بيدرس','حاسبات وذكاء اصطناعي'],['الجامعة','جامعة المنيا الأهلية'],['التخرج','2027 / 2028'],['بيدور على','تدريب، فريلانس']],
  exploring:'بستكشف حاليًا',ex:['Machine Learning','تطوير الويب','الذكاء الاصطناعي']},
 contact:{cta:'يلا نبني حاجة حقيقية.',name:'الاسم',email:'البريد الإلكتروني',msg:'الرسالة',send:'إرسال الرسالة',sending:'جارٍ الإرسال...',ok:'تم إرسال رسالتك بنجاح — هرد عليك قريب.',err:'حصل خطأ أثناء الإرسال، جرّب تاني أو ابعتلي إيميل مباشرة.'}
}};
const TABS=['exp','proj','stack','edu'];
const PALS=[['nile-silt','#d4a359','#9c651d'],['deep-moss','#cbb894','#7a6136'],['basalt','#e07a5f','#b84b30'],['nocturne','#8fb89f','#2e6e4d']];

/* ================= state ================= */
const root=document.documentElement;
root.classList.add('booting');
const $=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||location.hash.includes('snap');
const hoverOK=matchMedia('(hover: hover)').matches;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get('lang')||'en',theme=store.get('theme')||'dark',pal=store.get('pal')||'nile-silt';
let tab='exp',sel={exp:0,proj:0};
if(!T[lang])lang='en';if(!PALS.find(p=>p[0]===pal))pal='nile-silt';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ================= spring engine ================= */
const anims=new Set();let rafOn=false,lastT=0;
function wake(){if(rafOn||reduce)return;rafOn=true;lastT=performance.now();requestAnimationFrame(tick)}
function tick(now){
  const dt=Math.min(.05,Math.max(.001,(now-lastT)/1000));lastT=now;
  for(const a of anims)a.step(dt);
  for(const a of anims)if(a.done()){a.finish();anims.delete(a)}
  if(anims.size){requestAnimationFrame(tick)}else rafOn=false;
}
class Spr{
  constructor(k,c,x=0){this.k=k;this.c=c;this.x=x;this.v=0;this.t=x;this.on=null}
  to(t){if(this.t===t)return;this.t=t;wake()}
  snap(x){this.x=this.t=x;this.v=0}
  impulse(v){this.v=Math.max(-240,Math.min(240,this.v+v));wake()}
  get rest(){return Math.abs(this.x-this.t)<.0005&&Math.abs(this.v)<.005}
  step(dt){
    let rem=dt;
    while(rem>0){const h=Math.min(.032,Math.max(.001,rem));rem-=h;
      const a=-this.k*(this.x-this.t)-this.c*this.v;
      this.v+=a*h;this.x+=this.v*h;}
    if(this.rest){this.x=this.t;this.v=0}
    this.on&&this.on(this.x,this.v);
  }
}

/* ---- jelly: impulse translate + squash ---- */
const jellyState=new Map();
function jelly(el,{vx=0,vy=0,i=.35}={}){
  if(reduce||!el)return;
  let st=jellyState.get(el);
  if(!st){
    st={tx:new Spr(320,14),ty:new Spr(320,14)};
    const apply=()=>{
      const sx=1+Math.max(-.06,Math.min(.06,st.tx.v*.00035));
      const sy=1+Math.max(-.09,Math.min(.09,st.ty.v*.00035));
      el.style.transform=`translate(${st.tx.x.toFixed(2)}px,${st.ty.y.toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    };
    st.tx.on=st.ty.on=apply;
    st.done=()=>st.tx.rest&&st.ty.rest;
    st.finish=()=>{el.style.transform=''};
    st.step=dt=>{st.tx.step(dt);st.ty.step(dt)};
    jellyState.set(el,st);
  }
  anims.add(st);
  st.tx.impulse(vx*i*2.2);st.ty.impulse(vy*i*2.2);
}
function bindJelly(el,{hv=22,hi=.45,cv=26,ci=.72}={}){
  if(!hoverOK)return;
  el.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;jelly(el,{vy:hv,i:hi})});
  el.addEventListener('click',()=>jelly(el,{vy:cv,i:ci}));
}

/* ---- spring-in entrance for an element ---- */
function springIn(el,{dx=0,dy=0,k=210,c=16,delay=0,stretch=.0009,axis='y'}={}){
  if(reduce)return;
  const s=new Spr(k,c,1); // 1 = fully offset
  const t0=performance.now()+delay;
  el.style.opacity='0';
  const a={
    step(dt){
      if(performance.now()<t0)return;
      s.step(dt);
    },
    done(){return performance.now()>=t0&&s.rest},
    finish(){el.style.transform='';el.style.opacity='';el.style.willChange=''}
  };
  s.on=(x,v)=>{
    const ox=dx*x,oy=dy*x;
    const sq=Math.max(axis==='y'?.91:.94,Math.min(axis==='y'?1.11:1.07,1+Math.abs(v)*stretch*.01));
    const sx=axis==='y'?1:sq,sy=axis==='y'?sq:1;
    el.style.opacity=String(Math.min(1,Math.max(0,(1-x)/.35)));
    el.style.transform=`translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
  };
  el.style.willChange='transform,opacity';
  anims.add(a);wake();
}

/* ================= morph buttons ================= */
const measureCtx=document.createElement('canvas').getContext('2d');
function labelW(txt,fs){measureCtx.font=`${fs}px "Geist Mono", monospace`;return Math.ceil(measureCtx.measureText(txt).width)}
function rrect(x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  return `M${x+r},${y}h${w-2*r}a${r},${r} 0 0 1 ${r},${r}v${h-2*r}a${r},${r} 0 0 1 ${-r},${r}h${-(w-2*r)}a${r},${r} 0 0 1 ${-r},${-r}v${-(h-2*r)}a${r},${r} 0 0 1 ${r},${-r}z`;
}
class Morph{
  constructor(btn,{label,dir='down',size=40,accent=false}){
    this.btn=btn;this.label=label;this.dir=dir;this.size=size;
    this.path=btn.querySelector('.mpath');
    this.lab=null;
    this.t=new Spr(255,15,0);
    this.t.on=()=>this.draw();
    this.a={step:dt=>this.t.step(dt),done:()=>this.t.rest,finish:()=>{this.draw();}};
    anims.add(this.a);
    this.buildLabel();
    this.draw();
    if(hoverOK){
      btn.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;this.show(true)});
      btn.addEventListener('pointerleave',()=>this.show(false));
      btn.addEventListener('focus',()=>this.show(true));
      btn.addEventListener('blur',()=>this.show(false));
    }
  }
  buildLabel(){
    const l=document.createElement('span');l.className='mlab';l.textContent=this.label;l.setAttribute('aria-hidden','true');
    this.btn.appendChild(l);this.lab=l;
  }
  show(on){
    this.btn.classList.toggle('hov',on);
    anims.add(this.a);
    this.t.to(on?1:0);wake();
    if(on)jelly(this.btn,{vy:this.dir==='down'?22:0,vx:this.dir==='down'?0:14,i:.45});
  }
  draw(){
    const t=Math.max(0,Math.min(1.06,this.t.x)),S=this.size;
    const fs=this.dir==='down'?10.6:10.7;
    const lw=labelW(this.label,fs);
    const bw=(lw+(this.dir==='down'?24:22))*Math.min(1,t),bh=26*Math.min(1,t);
    let d=rrect(0,0,S,S,14-2*Math.min(1,t));
    this.lab.style.width='auto';
    if(t>.02&&bw>4&&bh>4){
      const r=this.btn.getBoundingClientRect();
      if(this.dir==='down'){
        let cx=S/2;
        const pageL=r.left+cx-bw/2,pageR=r.left+cx+bw/2;
        if(pageL<8)cx+=8-pageL;if(pageR>innerWidth-8)cx-=pageR-(innerWidth-8);
        const by=S-6*Math.min(1,t);
        d+=rrect(cx-bw/2,by,bw,bh+6*Math.min(1,t),Math.min(11,bh/2));
        this.lab.style.left=(cx-bw/2)+'px';this.lab.style.top=by+'px';
        this.lab.style.width=bw+'px';this.lab.style.height=bh+'px';
        this.lab.style.transform='none';this.lab.style.insetInlineEnd='auto';
      }else{
        const rtl=root.dir==='rtl';
        let cy=S/2;
        const pageT=r.top+cy-bh/2,pageB=r.top+cy+bh/2;
        if(pageT<8)cy+=8-pageT;if(pageB>innerHeight-8)cy-=pageB-(innerHeight-8);
        const x0=rtl?S-6*Math.min(1,t):-6*Math.min(1,t)-bw;
        d+=rrect(x0,cy-bh/2,bw+6*Math.min(1,t),bh,Math.min(11,bh/2));
        this.lab.style.left=x0+'px';this.lab.style.top=(cy-bh/2)+'px';
        this.lab.style.width=bw+'px';this.lab.style.height=bh+'px';
        this.lab.style.transform='none';this.lab.style.insetInlineEnd='auto';
      }
      this.lab.style.opacity=String(Math.max(0,Math.min(1,(t-.4)/.45)));
    }else this.lab.style.opacity='0';
    this.path.setAttribute('d',d);
  }
}
const morphs=[];
function initMorphs(){
  const t=T[lang];
  // icon row
  const ic=$('#icons');
  ic.innerHTML=LINKS.map(l=>
    `<a class="mbtn jelly${l[3]?' accent':''}" href="${l[1]}" ${l[1].startsWith('http')?'target="_blank" rel="noopener"':''} aria-label="${l[0]}"><svg class="morph" aria-hidden="true"><path class="mpath"/></svg><span class="mic">${ICON[l[2]]}</span></a>`
  ).join('');
  morphs.length=0;
  ic.querySelectorAll('.mbtn').forEach((b,i)=>{morphs.push(new Morph(b,{label:LINKS[i][0],dir:'down',size:40,accent:LINKS[i][3]}));bindJelly(b,{hv:22,hi:.45,cv:26,ci:.72})});
  // dock
  const tips=[t.tips.palette,theme==='dark'?t.tips.light:t.tips.dark,t.tips.lang];
  document.querySelectorAll('.dbtn').forEach((b,i)=>{
    if(b._morph){b._morph.label=tips[i];b._morph.lab.textContent=tips[i];b._morph.draw();return}
    b._morph=new Morph(b,{label:tips[i],dir:innerWidth>=1325?'side':'down',size:34});
    bindJelly(b,{hv:b._morph.dir==='down'?22:0,hi:.45,cv:b._morph.dir==='down'?26:18,ci:.72});
  });
}

/* ================= panel outline ================= */
const outline={x:new Spr(280,18),w:new Spr(280,18),lean:0,ready:false};
function measureTab(){
  const btn=$('#tabs .tab[aria-selected="true"]');
  if(!btn)return null;
  const col=$('#panelCol');
  const bx=btn.offsetLeft,bw=btn.offsetWidth,bt=btn.offsetTop;
  const boxTop=$('#tabs').offsetHeight;
  const W=col.clientWidth,H=col.clientHeight;
  return{bx,bw,bt,boxTop,W,H};
}
function outlinePath(bx,bw,bt,boxTop,W,H,lean){
  const r=W<380?10:14,tr=11,jr=9;
  const x0=0,y0=boxTop,x1=W,y1=H;
  bx=Math.max(x0+r+jr,Math.min(bx,x1-r-jr-bw));
  const tlx=bx+lean,trx=bx+bw+lean;
  return [
   `M${x0+r},${y0}`,
   `L${bx-jr},${y0}`,
   `Q${bx},${y0} ${bx},${y0-jr}`,
   `L${tlx},${bt+tr}`,
   `Q${tlx},${bt} ${tlx+tr},${bt}`,
   `L${trx-tr},${bt}`,
   `Q${trx},${bt} ${trx},${bt+tr}`,
   `L${bx+bw},${y0-jr}`,
   `Q${bx+bw},${y0} ${bx+bw+jr},${y0}`,
   `L${x1-r},${y0}`,`Q${x1},${y0} ${x1},${y0+r}`,
   `L${x1},${y1-r}`,`Q${x1},${y1} ${x1-r},${y1}`,
   `L${x0+r},${y1}`,`Q${x0},${y1} ${x0},${y1-r}`,
   `L${x0},${y0+r}`,`Q${x0},${y0} ${x0+r},${y0}`,'Z'
  ].join('');
}
let outlineAnim=null;
function updateOutline(animate){
  const m=measureTab();if(!m)return;
  if(reduce||!animate||!outline.ready){
    outline.x.snap(m.bx);outline.w.snap(m.bw);outline.ready=true;
    paintOutline(m,outline.x.x,outline.w.x,0);
    return;
  }
  outline.x.to(m.bx);outline.w.to(m.bw);wake();
  if(!outlineAnim){
    outlineAnim={lastX:outline.x.x,step:dt=>{
      outline.x.step(dt);outline.w.step(dt);
      const vx=(outline.x.x-outlineAnim.lastX)/Math.max(dt,.001);outlineAnim.lastX=outline.x.x;
      outline.lean=Math.max(-7,Math.min(7,vx*.012+outline.x.v*.02));
      const mm=measureTab();if(mm)paintOutline(mm,outline.x.x,outline.w.x,outline.lean);
    },done:()=>outline.x.rest&&outline.w.rest,finish:()=>{outlineAnim=null;outline.lean=0;const mm=measureTab();if(mm)paintOutline(mm,outline.x.x,outline.w.x,0)}};
    anims.add(outlineAnim);
  }
}
function paintOutline(m,bx,bw,lean){
  const d=outlinePath(bx,bw,m.bt,m.boxTop,m.W,m.H,lean);
  $('#pstroke').setAttribute('d',d);
  $('#pclipPath').setAttribute('d',d);
}

/* ================= views ================= */
const chipPlain=s=>`<span class="chip ltr">${esc(s)}</span>`;
const chipTech=(s,c)=>c?`<span class="chip t ltr" style="--tc:var(--tech-${c},var(--accent))">${esc(s)}</span>`:chipPlain(s);
const hint=()=>`<span class="hint">${ICON.ud}<span>${T[lang].switch}</span></span>`;

function entryExp(i){
  const e=T[lang].exp[i];
  return `<div class="entry"><div class="entry-top"><div class="dhead"><h2>${esc(e.t)}</h2><span class="chip-date">${esc(e.date)}</span></div>
  <p class="role">${esc(e.role)}</p>
  <ul class="bul">${e.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="foot"><div class="chips">${e.chips.map(chipPlain).join('')}</div>${hint()}</div></div>`;
}
function entryProj(i){
  const p=T[lang].proj[i];
  return `<div class="entry"><div class="entry-top"><div class="dhead"><h2>${esc(p.t)}</h2>
  <span class="pills"><a class="pill a jelly" href="${p.gh}" target="_blank" rel="noopener">github ↗</a><a class="pill jelly" href="${p.live}" target="_blank" rel="noopener">live ↗</a></span></div>
  <p class="role">${esc(p.role)}</p>
  <p class="desc">${esc(p.d)}</p>
  <div class="pipe"><code>${esc(p.pipe)}</code><span class="metric">${esc(p.metric)}</span></div>
  <ul class="bul">${p.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="foot"><div class="chips">${p.chips.map(c=>chipTech(c[0],c[1])).join('')}</div>${hint()}</div></div>`;
}
function viewSplit(k){
  const t=T[lang],arr=t[k],i=sel[k];
  const items=arr.map((x,n)=>`<button class="item" role="option" data-i="${n}" aria-selected="${n===i}" tabindex="${n===i?0:-1}"><span class="n">0${n+1}</span><span class="itxt"><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></span></button>`).join('');
  return `<div class="view split"><div class="rail" role="listbox" aria-label="${t.tabs[k]}" tabindex="0"><div class="rail-stage">${items}</div></div><div class="inspector" id="inspector">${k==='exp'?entryExp(i):entryProj(i)}</div></div>`;
}
function viewStack(){
  const t=T[lang];
  return `<div class="view full"><div class="cards">${t.stack.map(([g,c])=>`<div class="scard"><header><span class="slabel">${esc(g)}</span><span class="scount">${String(c.length).padStart(2,'0')}</span></header><div class="chips">${c.map(chipPlain).join('')}</div></div>`).join('')}</div></div>`;
}
function viewEdu(){
  const e=T[lang].edu;
  return `<div class="view edu"><div class="entry-top"><div class="dhead"><h2>${esc(e.t)}</h2><span class="chip-date ltr">${e.date}</span></div>
  <p class="role">${esc(e.deg)}</p></div>
  <div class="meta">${e.meta.map(m=>`<div><small>${esc(m[0])}</small><span>${esc(m[1])}</span></div>`).join('')}</div>
  <ul class="bul">${e.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  <div class="course"><small>${esc(e.box)}</small><div class="chips">${e.boxChips.map(chipPlain).join('')}</div></div></div>`;
}
function viewFor(k){
  if(k==='exp'||k==='proj')return viewSplit(k);
  if(k==='stack')return viewStack();
  return viewEdu();
}

/* ================= tabs ================= */
function renderTabs(){
  const t=T[lang];
  $('#tabs').innerHTML=TABS.map(k=>{
    const n=k==='exp'?t.exp.length:k==='proj'?t.proj.length:0;
    return `<button class="tab" role="tab" id="tab-${k}" data-k="${k}" aria-selected="${k===tab}" aria-controls="panel" tabindex="${k===tab?0:-1}">${t.tabs[k]}${n?`<span class="cnt">${String(n).padStart(2,'0')}</span>`:''}</button>`;
  }).join('');
}
function setTab(k,focus){
  if(k===tab){updateOutline(false);return}
  const oldI=TABS.indexOf(tab),newI=TABS.indexOf(k);
  let dir=newI>oldI?1:-1;if(root.dir==='rtl')dir*=-1;
  tab=k;renderTabs();
  const panel=$('#panel');
  const out=panel.firstElementChild;
  if(out&&!reduce){
    out.classList.add('out');
    out.animate([{opacity:1,transform:'translateX(0) scale(1)'},{opacity:0,transform:`translateX(${-18*dir}px) scale(.985)`}],{duration:150,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}).onfinish=()=>out.remove();
  }else if(out)out.remove();
  panel.innerHTML='';
  panel.insertAdjacentHTML('beforeend',viewFor(tab));
  bindPanel();
  const nv=panel.firstElementChild;
  if(nv&&!reduce)springIn(nv,{dx:28*dir,dy:0,k:290,c:21,axis:'x',stretch:.00018*100});
  jelly(panel,{vx:-14*dir,vy:8,i:.32});
  window.landscape&&window.landscape.gust&&window.landscape.gust(1.05);
  updateOutline(true);
  if(focus){const b=$(`#tab-${k}`);b&&b.focus()}
}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)setTab(b.dataset.k)});
$('#tabs').addEventListener('keydown',e=>{
  const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(e.key))return;
  e.preventDefault();
  const rtl=root.dir==='rtl';let i=TABS.indexOf(tab);
  if(e.key==='Home')i=0;else if(e.key==='End')i=TABS.length-1;
  else{const step=(e.key==='ArrowRight')===!rtl?1:-1;i=(i+step+TABS.length)%TABS.length}
  setTab(TABS[i],true);
});
$('#tabs').addEventListener('scroll',()=>updateOutline(false),{passive:true});

/* ================= drum rail ================= */
function bindPanel(){
  document.querySelectorAll('.pill.jelly').forEach(p=>bindJelly(p,{hv:14,hi:.35,cv:18,ci:.55}));
}
function pick(i,fromKey){
  i=+i;const arr=T[lang][tab];const n=arr.length;
  const old=sel[tab];sel[tab]=((i%n)+n)%n;
  document.querySelectorAll('.item').forEach(b=>{const on=+b.dataset.i===sel[tab];b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
  const insp=$('#inspector');if(!insp)return;
  const dirY=sel[tab]>=old?1:-1;
  insp.innerHTML=tab==='exp'?entryExp(sel[tab]):entryProj(sel[tab]);
  const ent=insp.firstElementChild;
  if(ent&&!reduce)springIn(ent,{dy:14*dirY,dx:0,k:320,c:22});
  const it=document.querySelector(`.item[data-i="${sel[tab]}"]`);
  if(it){
    jelly(it,{vy:18*dirY,i:.5});
    if(innerWidth<960)it.scrollIntoView({behavior:reduce?'auto':'smooth',inline:'center',block:'nearest'});
  }
  window.landscape&&window.landscape.ripple&&window.landscape.ripple(.9);
  bindPanel();
  if(fromKey&&it)it.focus();
}
let wheelLock=0;
$('#panel').addEventListener('wheel',e=>{
  if(innerWidth<960)return;
  const rail=e.target.closest('.rail');if(!rail)return;
  e.preventDefault();
  const d=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
  if(Math.abs(d)<4)return;
  const now=performance.now();if(now-wheelLock<180)return;wheelLock=now;
  pick(sel[tab]+(d>0?1:-1));
},{passive:false});
$('#panel').addEventListener('click',e=>{
  const it=e.target.closest('.item');if(!it)return;
  if(+it.dataset.i===sel[tab]){jelly(it,{vy:16,i:.4});return}
  pick(it.dataset.i);
});
$('#panel').addEventListener('keydown',e=>{
  const rail=e.target.closest('.rail');if(!rail)return;
  const stacked=innerWidth<960,rtl=root.dir==='rtl';
  const n=T[lang][tab].length;let i=sel[tab];
  const fwd=stacked?(rtl?'ArrowLeft':'ArrowRight'):'ArrowDown';
  const back=stacked?(rtl?'ArrowRight':'ArrowLeft'):'ArrowUp';
  if(e.key===fwd){e.preventDefault();pick(i+1,true)}
  else if(e.key===back){e.preventDefault();pick(i-1,true)}
  else if(e.key==='Home'){e.preventDefault();pick(0,true)}
  else if(e.key==='End'){e.preventDefault();pick(n-1,true)}
});

/* ================= dialogs ================= */
function aboutView(){const a=T[lang].about;return `<p class="lede">${a.lede}</p>${a.p.map(x=>`<p class="desc">${esc(x)}</p>`).join('')}<div class="facts">${a.facts.map(f=>`<div><span>${esc(f[0])}</span><span>${esc(f[1])}</span></div>`).join('')}</div><div class="box"><small>${esc(a.exploring)}</small><div class="chips" style="margin-top:4px">${a.ex.map(chipPlain).join('')}</div></div>`}
function contactView(){const c=T[lang].contact;return `<div class="crow"><div><p class="cta">${esc(c.cta)}</p><div class="links">${LINKS.map(l=>`<a href="${l[1]}" ${l[1].startsWith('http')?'target="_blank" rel="noopener"':''}>${l[0]}<span>${l[1].startsWith('mailto')?EMAIL:'↗'}</span></a>`).join('')}</div></div>
 <form class="form" id="contactForm" action="https://api.web3forms.com/submit" method="POST"><input type="hidden" name="access_key" value="6bd643cd-9c55-42b1-88d9-4425248539a9"><input type="hidden" name="subject" value="New message from portfolio contact form"><input type="checkbox" name="botcheck" style="display:none">
 <div><label>${c.name}</label><input type="text" name="name" required></div><div><label>${c.email}</label><input type="email" name="email" required></div><div><label>${c.msg}</label><textarea name="message" required></textarea></div>
 <div style="display:flex;gap:12px;align-items:center"><button class="btn primary" type="submit" style="height:36px">${c.send}</button><span class="fstatus" id="fstatus"></span></div></form></div>`}
function openDlg(k){
  closeDlg();
  const o=document.createElement('div');o.className='ovl';o.id='dlg';
  o.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><button class="x" aria-label="close">×</button>${k==='about'?aboutView():contactView()}</div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeDlg()});
  o.querySelector('.x').addEventListener('click',closeDlg);
  const f=o.querySelector('#contactForm');if(f)bindForm(f);
  if(!reduce)springIn(o.querySelector('.dlg'),{dy:18,k:210,c:16});
  o.querySelector('.x').focus();
}
function closeDlg(){const o=$('#dlg');if(o)o.remove()}
function bindForm(f){
  f.addEventListener('submit',async e=>{
    e.preventDefault();const c=T[lang].contact,b=f.querySelector('button[type=submit]'),st=f.querySelector('#fstatus'),old=b.textContent;
    b.textContent=c.sending;b.disabled=true;
    try{const r=await fetch(f.action,{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});const j=await r.json();
      if(r.ok&&j.success){st.textContent=c.ok;f.reset()}else st.textContent=c.err}catch(x){st.textContent=c.err}
    b.textContent=old;b.disabled=false;
  });
}
$('#moreBtn').addEventListener('click',()=>openDlg('about'));
$('#msgBtn').addEventListener('click',()=>openDlg('contact'));

/* ================= theme / palette / language ================= */
function applyTheme(anim){
  root.dataset.palette=pal;root.dataset.theme=theme;
  $('#themeBtn .dic').innerHTML=theme==='dark'?ICON.sun:ICON.moon;
  $('#themeBtn').setAttribute('aria-label',theme==='dark'?'switch to light':'switch to dark');
  const tips=[T[lang].tips.palette,theme==='dark'?T[lang].tips.light:T[lang].tips.dark,T[lang].tips.lang];
  document.querySelectorAll('.dbtn').forEach((b,i)=>{if(b._morph){b._morph.label=tips[i];b._morph.lab.textContent=tips[i]}});
  document.body.classList.remove('theme-sync','palette-sync');
  if(anim&&!reduce){void document.body.offsetWidth;document.body.classList.add(anim)}
  window.landscape&&window.landscape.set&&window.landscape.set(pal,theme);
}
function applyLang(){
  const t=T[lang];root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  $('#langBtn .dlg-label').textContent=lang==='ar'?'en':'ع';
  document.querySelectorAll('[data-t]').forEach(e=>{e.textContent=t[e.dataset.t]});
  document.title=lang==='ar'?'محمد عز — مطوّر AI و Machine Learning':'Mohamed Ezz — AI & Machine Learning Developer';
  renderPalMenu();renderTabs();
  $('#panel').innerHTML=viewFor(tab);bindPanel();
  updateOutline(false);
  setTimeout(()=>{window.landscape&&window.landscape.relayout&&window.landscape.relayout()},150);
}
function renderPalMenu(){
  const t=T[lang];
  $('#palMenu').innerHTML=PALS.map(([k,d,l])=>`<button class="pal-opt jelly" role="option" data-p="${k}" aria-selected="${k===pal}" style="--pc:${theme==='dark'?d:l}"><span class="pdot"></span>${t.palettes[k]}</button>`).join('');
  $('#palMenu').querySelectorAll('.pal-opt').forEach(b=>bindJelly(b,{hv:10,hi:.25,ci:.4,cv:12}));
}
$('#themeBtn').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';store.set('theme',theme);applyTheme('theme-sync');renderPalMenu()});
window.__toggleTheme=()=>$('#themeBtn').click();
$('#langBtn').addEventListener('click',()=>{lang=lang==='en'?'ar':'en';store.set('lang',lang);applyLang();applyTheme()});
const popState={s:new Spr(300,18,.9),open:false};
function popDraw(){
  const v=popState.s.x,vel=popState.s.v;
  const sq=Math.max(-.06,Math.min(.06,vel*.0004));
  const compact=innerWidth<1325;
  const ty=compact?(1-Math.min(1,(v-.9)/.1))*-10:0;
  $('#palMenu').style.transform=`translateY(${ty}px) scale(${v+sq},${v-sq})`;
  $('#palMenu').style.opacity=String(Math.max(0,Math.min(1,(v-.88)/.08)));
}
popState.s.on=popDraw;
const popAnim={step:dt=>popState.s.step(dt),done:()=>popState.s.rest,finish:()=>{if(!popState.open)$('#palMenu').classList.remove('open')}};
function togglePop(open){
  popState.open=open;
  $('#palBtn').setAttribute('aria-expanded',open);
  anims.add(popAnim);
  if(open){$('#palMenu').classList.add('open');popState.s.snap(.9);popState.s.to(1);wake()}
  else{popState.s.to(.9);wake()}
}
$('#palBtn').addEventListener('click',()=>togglePop(!popState.open));
$('#palMenu').addEventListener('click',e=>{
  const b=e.target.closest('.pal-opt');if(!b)return;
  pal=b.dataset.p;store.set('pal',pal);
  jelly(b,{vy:12,i:.4});
  renderPalMenu();applyTheme('palette-sync');togglePop(false);
});
document.addEventListener('click',e=>{if(popState.open&&!e.target.closest('.pal-pop')&&!e.target.closest('#palBtn'))togglePop(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){togglePop(false);closeDlg()}});

/* copy email */
$('#copyBtn').addEventListener('click',async()=>{
  const b=$('#copyBtn');
  try{await navigator.clipboard.writeText(EMAIL)}catch(x){const t=document.createElement('textarea');t.value=EMAIL;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(y){}t.remove()}
  b.textContent=T[lang].copied;b.classList.add('copied');
  setTimeout(()=>{b.textContent=T[lang].copy;b.classList.remove('copied')},1800);
});
document.querySelectorAll('.btn.jelly').forEach(b=>bindJelly(b,{hv:14,hi:.3,cv:20,ci:.55}));

/* ================= print ================= */
addEventListener('beforeprint',()=>{
  const t=T[lang];
  $('#printAll').innerHTML=TABS.map(k=>`<section class="print-sec"><h2>${t.tabs[k]}</h2>${k==='exp'?t.exp.map((e,i)=>entryExp(i)).join(''):k==='proj'?t.proj.map((p,i)=>entryProj(i)).join(''):k==='stack'?viewStack():viewEdu()}</section>`).join('');
});
addEventListener('afterprint',()=>{$('#printAll').innerHTML=''});

/* ================= entrance ================= */
function entrance(){
  if(reduce){root.classList.remove('is-world-entering');return}
  window.landscape&&window.landscape.intro&&window.landscape.intro();
  const seq=[
    ['.who',-36,0],['.pitch',38,40],['.pitch2',42,95],['.btns',46,150],['.icons',50,205]
  ];
  setTimeout(()=>{
    for(const [s,dy,d] of seq){const el=$(s);el&&springIn(el,{dy,delay:d,k:210,c:16})}
    springIn($('#panelCol'),{dy:48,delay:100,k:205,c:16});
    springIn($('.dock'),{dy:44,delay:240,k:205,c:16});
    setTimeout(()=>root.classList.remove('is-world-entering'),60);
  },420);
  setTimeout(()=>root.classList.remove('is-world-entering'),3500);
}

/* ================= hash params (preview/testing) ================= */
function applyHash(){
  const h=location.hash;
  const lm=h.match(/lang=(en|ar)/);if(lm&&lm[1]!==lang){lang=lm[1];store.set('lang',lang)}
  const tm=h.match(/theme=(dark|light)/);if(tm)theme=tm[1];
  const pm=h.match(/pal=([a-z-]+)/);if(pm&&PALS.find(p=>p[0]===pm[1]))pal=pm[1];
  const bm=h.match(/tab=(exp|proj|stack|edu)/);if(bm)tab=bm[1];
  if(h.includes('dlg=about'))setTimeout(()=>openDlg('about'),900);
  else if(h.includes('dlg=contact'))setTimeout(()=>openDlg('contact'),900);
}

/* ================= boot ================= */
if(location.hash.includes('dbg'))setTimeout(()=>{
  const h=document.querySelector('#panel h2');if(!h){document.title='DBG:no-h2';return}
  const cs=getComputedStyle(h),r=h.getBoundingClientRect();
  document.title=`DBG c:${cs.color} o:${cs.opacity} v:${cs.visibility} d:${cs.display} r:${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}x${Math.round(r.height)} fs:${cs.fontSize} ff:${cs.fontFamily.slice(0,20)}`;
},1500);
applyHash();
applyTheme();
applyLang();
initMorphs();
updateOutline(false);
entrance();
requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('booting')));
setTimeout(()=>root.classList.remove('booting'),400);

let rT;
addEventListener('resize',()=>{
  clearTimeout(rT);rT=setTimeout(()=>{
    document.querySelectorAll('.dbtn').forEach(b=>{if(b._morph)b._morph.dir=innerWidth>=1325?'side':'down'});
    updateOutline(false);
  },120);
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{initMorphs();updateOutline(false)});
