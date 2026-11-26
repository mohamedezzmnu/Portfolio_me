const EMAIL='mohamedezzmnu@gmail.com';
const ICON={
 sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 moon:'<svg viewBox="0 0 24 24"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>',
 mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
 gh:'<svg viewBox="0 0 24 24"><path d="M9 19c-4 1.3-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.800-.3 5.500-1.400 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.200 4.200 0 0 0-.1-3.200s-1.100-.3-3.500 1.300a12 12 0 0 0-6.200 0C6.500 2.800 5.400 3.100 5.400 3.100a4.200 4.200 0 0 0-.1 3.200A4.600 4.600 0 0 0 4 9.500c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2V21"/></svg>',
 li:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13c0-1.300 1-2 2-2s2 .7 2 2v3"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"/></svg>',
 kg:'<svg viewBox="0 0 24 24"><path d="M8 4v16M8 13l8-9M10.500 11.500 17 20"/></svg>',
 ud:'<svg viewBox="0 0 24 24"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>'
};
const LINKS=[
 ['LinkedIn','https://www.linkedin.com/in/mohamed-ezz-45825a390','li'],
 ['GitHub','https://github.com/mohamedezzmnu','gh'],
 ['Kaggle','https://www.kaggle.com/mohamedezzf','kg'],
 ['X','https://x.com/ezz1611','x'],
 ['Email','mailto:'+EMAIL,'mail']
];
const TC={nextjs:'#d6d6d6',supabase:'#3ecf8e',python:'#5aa0e0',pandas:'#a68af0',matplotlib:'#e8914f',seaborn:'#4fb0c4',api:'#9aa3b2',lr:'#e0b84f'};
const T={
en:{
 name:'Mohamed Ezz',sub:'AI & ML developer · Computer Science · Minya, Egypt',more:'more about me',msg:'message me',
 pitch:'Building intelligent products where AI, data, and web development meet.',
 pitch2:'Currently building applied ML and full-stack projects while studying Computer Science & Artificial Intelligence.',
 copy:'copy email',copied:'copied',
 tabs:{exp:'Experience',proj:'Projects',skills:'Skills',edu:'Education',about:'About',contact:'Contact'},
 palettes:{'nile-silt':'nile silt','deep-moss':'deep moss','basalt':'basalt','nocturne':'nocturne'},
 scroll:'scroll',
 exp:[
  {t:'Machine Learning Training',sub:'NTI · 1 month',date:'1 month · 6h/day, Sun–Thu',role:'NTI — National Telecommunication Institute',
   b:['120-hour intensive training, 6 hours a day, Sunday to Thursday.','How to approach an ML problem and choose the right model for it.','Exploring data (EDA) and cleaning it before modeling.']},
  {t:'Python & C++ Foundations',sub:'Independent study · self-taught',date:'Self-taught',role:'Independent study — YouTube',
   b:['Built core programming fundamentals in Python and C++.','Did it before applying them to real projects.']}
 ],
 proj:[
  {t:'Gymez',sub:'Full-stack developer',role:'Full-stack developer',gh:'https://github.com/mohamedezzmnu/GYMZ.git',live:'https://gymez.vercel.app/',
   d:"A full-stack fitness web app that personalizes a user's workout and nutrition based on their own body data and goals, instead of giving everyone the same generic plan.",

   b:['Problem: people starting a fitness journey usually get one-size-fits-all plans that ignore their condition, goals, and lifestyle.','Approach: a rule-based system (no ML model). User data drives the workout and nutrition logic.','Built: onboarding, weight tracking, personalized workout plans, a nutrition system, and visual progress charts.'],
   chips:[['Next.js','nextjs'],['Supabase','supabase'],['Exercise Image API','api'],['Barcode API','api']]},
  {t:'Bank Term Deposit Prediction',sub:'Solo · data prep, modeling, deployment',role:'Solo — data prep, modeling, deployment',gh:'https://github.com/mohamedezzmnu/bank-term-deposit-prediction.git',live:'https://bank-term-deposit-prediction-gamma.vercel.app/',
   d:"Enter a client's profile and call details to estimate the odds they subscribe to a term deposit.",

   b:['Problem: predict whether a bank client subscribes to a term deposit, from their profile and the marketing call details.','Dataset: bank marketing data from Kaggle.','Result: the model was evaluated on unseen test data with classification metrics.'],
   chips:[['Python','python'],['Pandas','pandas'],['Matplotlib','matplotlib'],['Seaborn','seaborn'],['Logistic Regression','lr']]}
 ],
 skills:[['Programming',['Python','C++','JavaScript']],['Data Analysis',['Pandas','NumPy','Data Cleaning','EDA']],['Machine Learning',['Scikit-learn','Logistic Regression','Classification','Feature Engineering','Model Selection','Model Evaluation']],['Visualization',['Matplotlib','Seaborn']],['Web Development',['Next.js','Full-stack Web Development']],['Database',['Supabase']],['Tools',['Git','GitHub','Vercel','Jupyter Notebook']]],
 edu:{date:'2023/24 — 2027/28',t:'Minya National University',deg:'B.Sc. Computer Science & Artificial Intelligence',meta:[['degree','B.Sc.'],['focus','CS & AI'],['years','2023/24 – 2027/28']],b:['Currently in third year.','Expected graduation: 2027/2028.'],box:'certifications & training',boxChips:['NTI · Machine Learning · 120 hours','Python (self-taught)','C++ (self-taught)']},
 about:{lede:"I'm a third-year <strong>Computer Science & AI</strong> student who learns by building — turning fitness data, banking data, and everyday problems into working software.",
  p:["I care about two things equally: writing software people actually use, and understanding the data and models underneath it. My main interests are Web Development and Artificial Intelligence — I like taking an idea from a blank page to a live product, and adding machine learning to it when the problem calls for it, not just because I can.","Right now I'm looking for internship and freelance opportunities where I can keep building real things and learn from people ahead of me."],
  facts:[['based in','Minya, Egypt'],['studying','Computer Science & AI'],['university','Minya National University'],['graduation','2027 / 2028'],['looking for','Internship, Freelance']],
  exploring:'currently exploring',ex:['Machine Learning','Web Development','Artificial Intelligence']},
 contact:{cta:"Let's build something real.",name:'name',email:'email',msg:'message',send:'send message',sending:'Sending...',ok:"Message sent — I'll get back to you soon.",err:'Something went wrong — please try again or email me directly.'}
},
ar:{
 name:'محمد عز',sub:'مطوّر AI و ML · حاسبات وذكاء اصطناعي · المنيا، مصر',more:'المزيد عني',msg:'راسلني',
 pitch:'بابني منتجات ذكية في التقاء الذكاء الاصطناعي والبيانات وتطوير الويب.',
 pitch2:'حاليًا بشتغل على مشاريع ML وفل ستاك، وبدرس علوم الحاسب والذكاء الاصطناعي.',
 copy:'نسخ الإيميل',copied:'تم النسخ',
 tabs:{exp:'الخبرة',proj:'المشاريع',skills:'المهارات',edu:'التعليم',about:'نبذة',contact:'تواصل'},
 palettes:{'nile-silt':'طمي النيل','deep-moss':'طحلب داكن','basalt':'بازلت','nocturne':'ليلي'},
 scroll:'تمرير',
 exp:[
  {t:'تدريب Machine Learning',sub:'NTI · شهر واحد',date:'شهر · 6 ساعات يوميًا',role:'NTI — المعهد القومي للاتصالات',
   b:['تدريب مكثف 120 ساعة، 6 ساعات يوميًا من الأحد للخميس.','إزاي تفكر في مشكلة ML وتختار الموديل المناسب.','استكشاف البيانات (EDA) وتنظيفها قبل النمذجة.']},
  {t:'أساسيات Python و C++\u200F',sub:'تعلّم ذاتي',date:'تعلّم ذاتي',role:'تعلّم ذاتي — يوتيوب',
   b:['بنيت أساسيات برمجية قوية في Python وC++.','قبل ما أطبقها في مشاريع حقيقية.']}
 ],
 proj:[
  {t:'Gymez',sub:'مطوّر فل ستاك',role:'مطوّر فل ستاك',gh:'https://github.com/mohamedezzmnu/GYMZ.git',live:'https://gymez.vercel.app/',
   d:'تطبيق ويب متكامل للياقة البدنية بيخصص خطة التمرين والتغذية على حسب بيانات جسم المستخدم وأهدافه، بدل خطة عامة للجميع.',

   b:['المشكلة: الناس اللي بتبدأ رحلة لياقة بتاخد غالبًا خطط عامة مش بتراعي حالتهم وأهدافهم ونمط حياتهم.','المنهج: نظام بمنطق قواعد (بدون موديل ML)، وبيانات المستخدم بتوجّه منطق التمرين والتغذية.','اللي بنيته: تسجيل البيانات، متابعة الوزن، خطط تمرين مخصصة، نظام غذائي، ورسومات متابعة بصرية.'],
   chips:[['Next.js','nextjs'],['Supabase','supabase'],['Exercise Image API','api'],['Barcode API','api']]},
  {t:'التنبؤ بالودائع البنكية',sub:'فردي · بيانات، نمذجة، نشر',role:'فردي — تجهيز البيانات، النمذجة، والنشر',gh:'https://github.com/mohamedezzmnu/bank-term-deposit-prediction.git',live:'https://bank-term-deposit-prediction-gamma.vercel.app/',
   d:'بتدخل بيانات بروفايل العميل وتفاصيل المكالمة، والموديل بيقدّر احتمالية اشتراكه في وديعة لأجل.',

   b:['المشكلة: التنبؤ بإذا كان عميل البنك هيشترك في وديعة لأجل بناءً على بروفايله وتفاصيل مكالمة التسويق.','البيانات: بيانات تسويق بنكي من Kaggle.','النتيجة: اتقيّم الموديل على بيانات اختبار لم يرها بمقاييس تصنيف مناسبة.'],
   chips:[['Python','python'],['Pandas','pandas'],['Matplotlib','matplotlib'],['Seaborn','seaborn'],['Logistic Regression','lr']]}
 ],
 skills:[['البرمجة',['Python','C++','JavaScript']],['تحليل البيانات',['Pandas','NumPy','Data Cleaning','EDA']],['تعلم الآلة',['Scikit-learn','Logistic Regression','Classification','Feature Engineering','Model Selection','Model Evaluation']],['التصوير البياني',['Matplotlib','Seaborn']],['تطوير الويب',['Next.js','تطوير ويب متكامل']],['قاعدة البيانات',['Supabase']],['أدوات',['Git','GitHub','Vercel','Jupyter Notebook']]],
 edu:{date:'2023/24 — 2027/28',t:'جامعة المنيا الأهلية',deg:'بكالوريوس حاسبات وذكاء اصطناعي',meta:[['الدرجة','بكالوريوس'],['التخصص','حاسبات وذكاء اصطناعي'],['السنوات','2023/24 – 2027/28']],b:['حاليًا في الفرقة الثالثة.','التخرج المتوقع: 2027/2028.'],box:'الشهادات والتدريب',boxChips:['NTI · Machine Learning · 120 ساعة','Python (تعلّم ذاتي)','C++ (تعلّم ذاتي)']},
 about:{lede:'أنا طالب فرقة ثالثة في <strong>الحاسبات والذكاء الاصطناعي</strong>، بتعلّم عن طريق البناء الفعلي — بحوّل بيانات اللياقة، والبيانات البنكية، ومشاكل يومية لبرامج شغالة فعلًا.',
  p:['بهتم بحاجتين بنفس القد: إني أكتب سوفتوير الناس بتستخدمه فعلًا، وإني أفهم البيانات والموديلات اللي وراه. أكتر اهتماماتي هي تطوير الويب والذكاء الاصطناعي.','حاليًا بدور على فرص تدريب (Internship) وفريلانس أقدر أكمل فيها أبني حاجات حقيقية وأتعلم من ناس أكبر مني في الخبرة.'],
  facts:[['مقيم في','المنيا، مصر'],['بيدرس','حاسبات وذكاء اصطناعي'],['الجامعة','جامعة المنيا الأهلية'],['التخرج','2027 / 2028'],['بيدور على','تدريب، فريلانس']],
  exploring:'بستكشف حاليًا',ex:['Machine Learning','تطوير الويب','الذكاء الاصطناعي']},
 contact:{cta:'يلا نبني حاجة حقيقية.',name:'الاسم',email:'البريد الإلكتروني',msg:'الرسالة',send:'إرسال الرسالة',sending:'جارٍ الإرسال...',ok:'تم إرسال رسالتك بنجاح — هرد عليك قريب.',err:'حصل خطأ أثناء الإرسال، جرّب تاني أو ابعتلي إيميل مباشرة.'}
}};
const TABS=['exp','proj','skills','edu'];
const PALS=[['nile-silt','#d4a359'],['deep-moss','#cbb894'],['basalt','#e07a5f'],['nocturne','#8fb89f']];
const root=document.documentElement;
const $=(s)=>document.querySelector(s);
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get('lang')||'en',theme=store.get('theme')||'dark',pal=store.get('pal')||'nile-silt',tab='exp',sel={exp:0,proj:0};
if(!T[lang])lang='en';if(!PALS.find(p=>p[0]===pal))pal='nile-silt';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const chip=(s,c)=>c?`<span class="chip t" style="--c:${TC[c]}">${esc(s)}</span>`:`<span class="chip">${esc(s)}</span>`;
const hint=()=>`<span class="hint">${ICON.ud}${T[lang].scroll}</span>`;

function applyTheme(){
  root.dataset.palette=pal;root.dataset.theme=theme;
  $('#themeBtn').innerHTML=theme==='dark'?ICON.moon:ICON.sun;
  window.landscape&&window.landscape.set(pal,theme);
}
function applyLang(){
  const t=T[lang];root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  $('#langBtn').textContent=lang==='ar'?'en':'ع';
  document.querySelectorAll('[data-t]').forEach(e=>{e.textContent=t[e.dataset.t]});
  document.title=lang==='ar'?'محمد عز — مطوّر AI و Machine Learning':'Mohamed Ezz — AI & Machine Learning Developer';
  $('#palMenu').innerHTML=PALS.map(([k,c])=>`<button role="option" data-p="${k}" aria-selected="${k===pal}"><i style="background:${c}"></i>${t.palettes[k]}</button>`).join('');
  renderTabs();renderPanel(false);
  setTimeout(()=>{window.landscape&&window.landscape.relayout&&window.landscape.relayout()},120);
}
function renderTabs(){
  const t=T[lang];
  $('#tabs').innerHTML=TABS.map(k=>`<button class="tab" role="tab" data-k="${k}" aria-selected="${k===tab}" tabindex="${k===tab?0:-1}">${t.tabs[k]}${k==='exp'?`<span class="cnt">0${t.exp.length}</span>`:k==='proj'?`<span class="cnt">0${t.proj.length}</span>`:''}</button>`).join('');
  $('#panel').classList.toggle('first-active',tab===TABS[0]);
}
function detailExp(i){const e=T[lang].exp[i];return `<div class="detail"><div class="dbody"><div class="dhead"><h2>${esc(e.t)}</h2><span class="chip-date">${esc(e.date)}</span></div><p class="role">${esc(e.role)}</p><ul class="bul">${e.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`}
function detailProj(i){const p=T[lang].proj[i];return `<div class="detail"><div class="dbody"><div class="dhead"><h2>${esc(p.t)}</h2><span style="display:flex;gap:6px"><a class="sbtn a" href="${p.gh}" target="_blank" rel="noopener">github ↗</a><a class="sbtn" href="${p.live}" target="_blank" rel="noopener">live ↗</a></span></div><p class="role">${esc(p.role)}</p><p class="desc">${esc(p.d)}</p><ul class="bul">${p.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="foot"><div class="chips">${p.chips.map(c=>chip(c[0],c[1])).join('')}</div></div></div>`}
function split(k){
  const t=T[lang],arr=t[k],i=sel[k];
  const list=arr.map((x,n)=>`<button class="item" role="option" data-i="${n}" aria-selected="${n===i}" tabindex="${n===i?0:-1}"><span class="n">0${n+1}</span><span><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></span></button>`).join('');
  return `<div class="view split"><div class="list" role="listbox">${list}</div><div id="detail">${k==='exp'?detailExp(i):detailProj(i)}</div></div>`;
}
function viewFor(k){
  const t=T[lang];
  if(k==='exp'||k==='proj')return split(k);
  if(k==='skills')return `<div class="view full"><div class="cards">${t.skills.map(([g,c])=>`<div class="card"><header><span>${esc(g)}</span><em>${String(c.length).padStart(2,'0')}</em></header><div class="chips">${c.map(x=>chip(x)).join('')}</div></div>`).join('')}</div></div>`;
  if(k==='edu'){const e=t.edu;return `<div class="view full"><div class="dhead"><h2 style="font-size:22px;font-weight:700">${esc(e.t)}</h2><span class="chip-date">${e.date}</span></div><p class="role">${esc(e.deg)}</p><div class="meta">${e.meta.map(m=>`<div><small>${esc(m[0])}</small><span>${esc(m[1])}</span></div>`).join('')}</div><ul class="bul">${e.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="box"><small>${esc(e.box)}</small><div class="chips">${e.boxChips.map(c=>chip(c)).join('')}</div></div></div>`}
}
function aboutView(){const a=T[lang].about;return `<p class="lede">${a.lede}</p>${a.p.map(x=>`<p class="desc">${esc(x)}</p>`).join('')}<div class="facts">${a.facts.map(f=>`<div><span>${esc(f[0])}</span><span>${esc(f[1])}</span></div>`).join('')}</div><div class="box"><small>${esc(a.exploring)}</small><div class="chips">${a.ex.map(c=>chip(c)).join('')}</div></div>`}
function contactView(){const c=T[lang].contact;return `<div class="crow"><div><p class="cta">${esc(c.cta)}</p><div class="links">${LINKS.map(l=>`<a href="${l[1]}" ${l[1].startsWith('http')?'target="_blank" rel="noopener"':''}>${l[0]}<span>${l[1].startsWith('mailto')?EMAIL:'↗'}</span></a>`).join('')}</div></div>
  <form class="form" id="contactForm" action="https://api.web3forms.com/submit" method="POST"><input type="hidden" name="access_key" value="6bd643cd-9c55-42b1-88d9-4425248539a9"><input type="hidden" name="subject" value="New message from portfolio contact form"><input type="checkbox" name="botcheck" style="display:none">
  <div><label>${c.name}</label><input type="text" name="name" required></div><div><label>${c.email}</label><input type="email" name="email" required></div><div><label>${c.msg}</label><textarea name="message" required></textarea></div>
  <div style="display:flex;gap:12px;align-items:center"><button class="btn primary" type="submit" style="height:36px">${c.send}</button><span class="fstatus" id="fstatus"></span></div></form></div>`}
function openDlg(k){
  closeDlg();
  const o=document.createElement('div');o.className='ovl';o.id='dlg';
  o.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><button class="x" aria-label="close">\u00d7</button>${k==='about'?aboutView():contactView()}</div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeDlg()});
  o.querySelector('.x').addEventListener('click',closeDlg);
  const f=o.querySelector('#contactForm');if(f)bindForm(f);
  o.querySelector('.x').focus();
}
function closeDlg(){const o=$('#dlg');if(o)o.remove();}
function renderPanel(){$('#panel').innerHTML=viewFor(tab)}
function setTab(k){tab=k;renderTabs();renderPanel();}
function bindForm(f){
  f.addEventListener('submit',async e=>{
    e.preventDefault();const c=T[lang].contact,b=f.querySelector('button[type=submit]'),st=f.querySelector('#fstatus'),old=b.textContent;
    b.textContent=c.sending;b.disabled=true;
    try{const r=await fetch(f.action,{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});const j=await r.json();
      if(r.ok&&j.success){st.textContent=c.ok;f.reset()}else st.textContent=c.err}catch(x){st.textContent=c.err}
    b.textContent=old;b.disabled=false;
  });
}
$('#panel').addEventListener('click',e=>{
  const it=e.target.closest('.item');if(!it)return;
  pick(it.dataset.i);
});
function pick(i){
  i=+i;sel[tab]=i;
  document.querySelectorAll('.item').forEach(b=>{const on=+b.dataset.i===i;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
  const d=$('#detail');d.innerHTML=tab==='exp'?detailExp(i):detailProj(i);
  const n=d.firstElementChild;n.style.animation='none';void n.offsetWidth;n.style.animation='fade .2s both';
}
$('#panel').addEventListener('keydown',e=>{
  const it=e.target.closest('.item');if(!it)return;
  const n=T[lang][tab].length;let i=+it.dataset.i;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();i=(i+(e.key==='ArrowDown'?1:n-1))%n;pick(i);document.querySelector(`.item[data-i="${i}"]`).focus()}
});
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)setTab(b.dataset.k)});
$('#tabs').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
  const rtl=root.dir==='rtl',step=(e.key==='ArrowRight')===!rtl?1:-1;
  const i=(TABS.indexOf(tab)+step+TABS.length)%TABS.length;setTab(TABS[i]);document.querySelector(`.tab[data-k="${TABS[i]}"]`).focus();
});
$('#moreBtn').addEventListener('click',()=>openDlg('about'));
$('#msgBtn').addEventListener('click',()=>openDlg('contact'));
$('#langBtn').addEventListener('click',()=>{lang=lang==='en'?'ar':'en';store.set('lang',lang);applyLang();enterAnim()});
$('#themeBtn').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';store.set('theme',theme);applyTheme()});
$('#palBtn').addEventListener('click',()=>{const m=$('#palMenu'),o=m.classList.toggle('open');$('#palBtn').setAttribute('aria-expanded',o)});
$('#palMenu').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;pal=b.dataset.p;store.set('pal',pal);$('#palMenu').classList.remove('open');applyTheme();applyLang()});
document.addEventListener('click',e=>{if(!e.target.closest('.pal-wrap'))$('#palMenu').classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#palMenu').classList.remove('open');closeDlg()}});
$('#copyBtn').addEventListener('click',async()=>{
  const b=$('#copyBtn');
  try{await navigator.clipboard.writeText(EMAIL)}catch(x){const t=document.createElement('textarea');t.value=EMAIL;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(y){}t.remove()}
  b.textContent=T[lang].copied;setTimeout(()=>{b.textContent=T[lang].copy},1500);
});
$('#icons').innerHTML=LINKS.map((l,i)=>`<a class="ibtn${i===LINKS.length-1?' tint':''}" href="${l[1]}" ${l[1].startsWith('http')?'target="_blank" rel="noopener"':''} data-tip="${l[0].toLowerCase()}" aria-label="${l[0]}">${ICON[l[2]]}</a>`).join('');
function enterAnim(){
  root.classList.remove('enter');void root.offsetWidth;root.classList.add('enter');
  if(window.landscape&&window.landscape.intro)window.landscape.intro();
}
applyTheme();applyLang();enterAnim();
(()=>{const h=location.hash;
  const lm=h.match(/lang=(en|ar)/);if(lm&&lm[1]!==lang){lang=lm[1];applyLang()}
  const tm2=h.match(/theme=(dark|light)/);if(tm2&&tm2[1]!==theme){theme=tm2[1];applyTheme()}
  const pm=h.match(/pal=([a-z-]+)/);if(pm&&PALS.find(p=>p[0]===pm[1])&&pm[1]!==pal){pal=pm[1];applyTheme();applyLang()}
  const bm=h.match(/tab=(exp|proj|skills|edu)/);if(bm)setTab(bm[1]);
  if(h.includes('dlg=about'))openDlg('about');else if(h.includes('dlg=contact'))openDlg('contact');
})();
