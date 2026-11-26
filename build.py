#!/usr/bin/env python3
"""Generates every HTML page from the content below. Edit text here, then run: python3 build.py
Drop a CV at assets/resume.pdf and rebuild to get the resume button and icon."""
import html, os, json

ROOT = os.path.dirname(os.path.abspath(__file__))
EMAIL = "mohamedezzmnu@gmail.com"
GITHUB = "https://github.com/mohamedezzmnu"
LINKEDIN = "https://www.linkedin.com/in/mohamed-ezz-45825a390"
KAGGLE = "https://www.kaggle.com/mohamedezzf"
XURL = "https://x.com/ezz1611"
FORM_NOTE = ""
HAS_RESUME = os.path.exists(os.path.join(ROOT, "assets", "resume.pdf"))

def e(s): return html.escape(s, quote=True)

PROJECT_LINKS = {
    "gymez": ("https://github.com/mohamedezzmnu/GYMZ.git", "https://gymez.vercel.app/"),
    "bank": ("https://github.com/mohamedezzmnu/bank-term-deposit-prediction.git",
             "https://bank-term-deposit-prediction-gamma.vercel.app/"),
}

STACK = [
    ["programming", "ml", "data", "viz", "web", "db", "tools"],
    [["Python", "C++", "JavaScript"],
     ["Scikit-learn", "Logistic Regression", "Classification", "Feature Engineering", "Model Selection", "Model Evaluation"],
     ["Pandas", "NumPy", "Data Cleaning", "EDA"],
     ["Matplotlib", "Seaborn"],
     ["Next.js", "Full-stack Web Development"],
     ["Supabase"],
     ["Git", "GitHub", "Vercel", "Jupyter Notebook"]],
]

L = {
 "en": dict(
  dir="ltr", title="Mohamed Ezz — AI & Machine Learning Developer",
  desc="Mohamed Ezz, AI & machine learning developer. Machine learning and full-stack web projects.",
  name="Mohamed Ezz", role="AI & ML developer · Computer Science · Minya, Egypt", about="more about me",
  bio1="Building intelligent products where AI, data, and web development meet.",
  bio2="Currently building applied ML and full-stack projects while studying Computer Science & Artificial Intelligence.",
  resume="resume", copy="copy email", copied="copied", email="email", github="github", linkedin="linkedin", kaggle="kaggle", x="x",
  tabs=["Experience", "Projects", "Skills", "Education"], switch="switch",
  palette="palette", light="light", dark="dark", lang="العربية",
  pals=["nile silt", "deep moss", "basalt", "nocturne"],
  to_light="switch to light mode", to_dark="switch to dark mode",
  stack_labels=["Programming", "Machine Learning", "Data Analysis", "Visualization", "Web Development", "Database", "Tools"],
  exp=[
    dict(t="Machine Learning Training", s="NTI — National Telecommunication Institute", d="NTI · trainee", pill="1 month · 120h",
         b=["120-hour intensive training, 6 hours a day, Sunday to Thursday.",
            "How to approach an ML problem and choose the right model for it.",
            "Exploring data (EDA) and cleaning it before modeling."],
         c=["Python", "Pandas", "Scikit-learn", "EDA"]),
    dict(t="Python & C++ Foundations", s="Independent study — YouTube", d="self-taught · online", pill="self-taught",
         b=["Built core programming fundamentals in Python and C++.",
            "Did it before applying them to real projects."],
         c=["Python", "C++"]),
  ],
  projects=[
    dict(key="gymez", t="Gymez", s="Full-stack developer", d="full-stack fitness platform",
         sum="A full-stack fitness web app that personalizes a user's workout and nutrition based on their own body data and goals, instead of giving everyone the same generic plan.",
         pipe="onboarding → rules engine → workout plan → nutrition → progress", metric="2 live apis",
         b=["Problem: people starting a fitness journey usually get one-size-fits-all plans that ignore their condition, goals, and lifestyle.",
            "Approach: a rule-based system (no ML model). User data drives the workout and nutrition logic.",
            "Built: onboarding, weight tracking, personalized workout plans, a nutrition system, and visual progress charts."],
         c=["Next.js", "Supabase", "Exercise Image API", "Barcode API"]),
    dict(key="bank", t="Bank Term Deposit Prediction", s="Solo — data prep, modeling, deployment", d="solo · data prep to deployment",
         sum="Enter a client's profile and call details to estimate the odds they subscribe to a term deposit.",
         pipe="eda → cleaning → features → logistic regression → evaluation", metric="kaggle data",
         b=["Problem: predict whether a bank client subscribes to a term deposit, from their profile and the marketing call details.",
            "Dataset: bank marketing data from Kaggle.",
            "Result: the model was evaluated on unseen test data with classification metrics."],
         c=["Python", "Pandas", "Matplotlib", "Seaborn", "Logistic Regression"]),
  ],
  live="live", code="github", write="write-up",
  edu=dict(t="Minya National University", s="B.Sc. Computer Science & Artificial Intelligence", pill="2023/24 — 2027/28",
           stats=[("degree:", "B.Sc."), ("focus:", "CS & AI"), ("years:", "2023/24 – 2027/28")],
           b=["Currently in third year.", "Expected graduation: 2027/2028."],
           cw="certifications & training", chips=["NTI · Machine Learning · 120 hours", "Python (self-taught)", "C++ (self-taught)"]),
  # inner pages
  back="Back to portfolio", notes="Engineering notes", toc="In this essay", read="1 min read", city="Minya, Egypt",
  about_title="About me", about_lead="I'm a third-year Computer Science & AI student who learns by building: turning fitness data, banking data and everyday problems into working software.",
  about_sec=[("What I care about", ["I care about two things equally: writing software people actually use, and understanding the data and models underneath it. My main interests are web development and artificial intelligence."]),
             ("How I work", ["I like taking an idea from a blank page to a live product, and adding machine learning to it when the problem calls for it, not just because I can."]),
             ("What's next", ["I'm looking for internship and freelance opportunities where I can keep building real things and learn from people ahead of me."])],
  contact="Say hello", crumb_about="about", crumb_work="work", msg="message me",
  dlg=dict(cta="Let's build something real.", name="name", email="email", msg="message", send="send message", sending="sending...", ok="Message sent — I'll get back to you soon.", err="Something went wrong — please try again or email me directly."),
  heads=dict(problem="Problem", approach="Approach", built="What I built", dataset="Dataset", result="Result", tech="Technologies"),
  case=dict(
    gymez=[("problem", "People starting a fitness journey usually get one-size-fits-all plans that ignore their current condition, goals and lifestyle."),
           ("approach", "Built as a rule-based system with no ML model: user data drives the workout and nutrition logic, with weight tracking and progress charts."),
           ("built", "User onboarding, weight tracking, personalized workout plans, a nutrition system and progress charts."),
           ("tech", "Next.js for the full-stack app, Supabase as the database, a third-party API for exercise images and a barcode API for food lookup.")],
    bank=[("problem", "Predict whether a bank client will subscribe to a term deposit based on their profile and the details of the marketing call."),
          ("dataset", "Bank marketing dataset sourced from Kaggle."),
          ("approach", "Logistic regression, with exploratory analysis and data cleaning done in Pandas beforehand."),
          ("result", "The classification model was evaluated on unseen test data using classification metrics.")]),
 ),
 "ar": dict(
  dir="rtl", title="محمد عز — مطوّر AI و Machine Learning",
  desc="محمد عز، مطوّر ذكاء اصطناعي وتعلم آلة. مشاريع تعلم آلة وويب متكامل.",
  name="محمد عز", role="مطوّر AI و ML · حاسبات وذكاء اصطناعي · المنيا، مصر", about="المزيد عني",
  bio1="بابني منتجات ذكية في التقاء الذكاء الاصطناعي والبيانات وتطوير الويب.",
  bio2="حاليًا بشتغل على مشاريع ML وفل ستاك، وبدرس علوم الحاسب والذكاء الاصطناعي.",
  resume="السيرة الذاتية", copy="انسخ الإيميل", copied="اتنسخ", email="الإيميل", github="جيت هب", linkedin="لينكدإن", kaggle="كاجل", x="إكس",
  tabs=["الخبرة", "المشاريع", "المهارات", "التعليم"], switch="تبديل",
  palette="الألوان", light="فاتح", dark="غامق", lang="English",
  pals=["طمي النيل", "طحلب غامق", "بازلت", "ليلي"],
  to_light="التحويل للوضع الفاتح", to_dark="التحويل للوضع الغامق",
  stack_labels=["البرمجة", "تعلم الآلة", "تحليل البيانات", "التصوير البياني", "تطوير الويب", "قاعدة البيانات", "أدوات"],
  exp=[
    dict(t="تدريب Machine Learning", s="NTI — المعهد القومي للاتصالات", d="NTI · متدرب", pill="شهر · 120 ساعة",
         b=["تدريب مكثف 120 ساعة، 6 ساعات يوميًا من الأحد للخميس.",
            "إزاي تفكر في مشكلة ML وتختار الموديل المناسب.",
            "استكشاف البيانات (EDA) وتنظيفها قبل النمذجة."],
         c=["Python", "Pandas", "Scikit-learn", "EDA"]),
    dict(t="أساسيات Python و C++", s="تعلّم ذاتي — يوتيوب", d="تعلّم ذاتي · أونلاين", pill="تعلّم ذاتي",
         b=["بنيت أساسيات برمجية قوية في Python وC++.",
            "قبل ما أطبقها في مشاريع حقيقية."],
         c=["Python", "C++"]),
  ],
  projects=[
    dict(key="gymez", t="Gymez", s="مطوّر فل ستاك", d="منصة لياقة فل ستاك",
         sum="تطبيق ويب متكامل للياقة البدنية بيخصص خطة التمرين والتغذية على حسب بيانات جسم المستخدم وأهدافه، بدل خطة عامة للجميع.",
         pipe="onboarding → rules engine → workout plan → nutrition → progress", metric="2 live apis",
         b=["المشكلة: الناس اللي بتبدأ رحلة لياقة بتاخد غالبًا خطط عامة مش بتراعي حالتهم وأهدافهم ونمط حياتهم.",
            "المنهج: نظام بمنطق قواعد (بدون موديل ML)، وبيانات المستخدم بتوجّه منطق التمرين والتغذية.",
            "اللي بنيته: تسجيل البيانات، متابعة الوزن، خطط تمرين مخصصة، نظام غذائي، ورسومات متابعة بصرية."],
         c=["Next.js", "Supabase", "Exercise Image API", "Barcode API"]),
    dict(key="bank", t="التنبؤ بالودائع البنكية", s="فردي — تجهيز البيانات، النمذجة، والنشر", d="فردي · من البيانات للنشر",
         sum="بتدخل بيانات بروفايل العميل وتفاصيل المكالمة، والموديل بيقدّر احتمالية اشتراكه في وديعة لأجل.",
         pipe="eda → cleaning → features → logistic regression → evaluation", metric="kaggle data",
         b=["المشكلة: التنبؤ بإذا كان عميل البنك هيشترك في وديعة لأجل بناءً على بروفايله وتفاصيل مكالمة التسويق.",
            "البيانات: بيانات تسويق بنكي من Kaggle.",
            "النتيجة: اتقيّم الموديل على بيانات اختبار لم يرها بمقاييس تصنيف مناسبة."],
         c=["Python", "Pandas", "Matplotlib", "Seaborn", "Logistic Regression"]),
  ],
  live="عرض حي", code="github", write="التفاصيل",
  edu=dict(t="جامعة المنيا الأهلية", s="بكالوريوس حاسبات وذكاء اصطناعي", pill="2023/24 — 2027/28",
           stats=[("الدرجة:", "بكالوريوس"), ("التخصص:", "حاسبات وذكاء اصطناعي"), ("السنوات:", "2023/24 – 2027/28")],
           b=["حاليًا في الفرقة الثالثة.", "التخرج المتوقع: 2027/2028."],
           cw="الشهادات والتدريب", chips=["NTI · Machine Learning · 120 ساعة", "Python (تعلّم ذاتي)", "C++ (تعلّم ذاتي)"]),
  back="رجوع للبورتفوليو", notes="ملاحظات هندسية", toc="في الصفحة دي", read="قراءة دقيقة", city="المنيا، مصر",
  about_title="نبذة عني", about_lead="أنا طالب فرقة ثالثة في الحاسبات والذكاء الاصطناعي، بتعلّم عن طريق البناء الفعلي: بحوّل بيانات اللياقة والبيانات البنكية ومشاكل يومية لبرامج شغالة فعلًا.",
  about_sec=[("اللي يهمني", ["بهتم بحاجتين بنفس القد: إني أكتب سوفتوير الناس بتستخدمه فعلًا، وإني أفهم البيانات والموديلات اللي وراه. أكتر اهتماماتي هي تطوير الويب والذكاء الاصطناعي."]),
             ("بشتغل إزاي", ["بحب آخد الفكرة من صفحة فاضية لمنتج شغال، وأضيف تعلم الآلة لما المشكلة تحتاجه، مش لمجرد إني أقدر."]),
             ("الجاي", ["بدور على فرص تدريب وفريلانس أقدر أكمل فيها أبني حاجات حقيقية وأتعلم من ناس أكبر مني في الخبرة."])],
  contact="تواصل معايا", crumb_about="نبذة عني", crumb_work="الأعمال", msg="راسلني",
  dlg=dict(cta="يلا نبني حاجة حقيقية.", name="الاسم", email="البريد الإلكتروني", msg="الرسالة", send="إرسال الرسالة", sending="جارٍ الإرسال...", ok="تم إرسال رسالتك بنجاح — هرد عليك قريب.", err="حصل خطأ أثناء الإرسال، جرّب تاني أو ابعتلي إيميل مباشرة."),
  heads=dict(problem="المشكلة", approach="المنهج", built="اللي بنيته", dataset="البيانات", result="النتيجة", tech="التقنيات"),
  case=dict(
    gymez=[("problem", "الناس اللي بتبدأ رحلة لياقة بدنية بتاخد غالبًا خطط عامة مش بتراعي حالتهم وأهدافهم ونمط حياتهم."),
           ("approach", "اتبنى بمنطق قواعد (بدون موديل ML): بيانات المستخدم بتوجّه منطق التمرين والتغذية، مع متابعة الوزن ورسومات للتقدم."),
           ("built", "تسجيل بيانات المستخدم، متابعة الوزن، خطط تمرين مخصصة، نظام غذائي، ورسومات متابعة."),
           ("tech", "Next.js للتطبيق الكامل، Supabase كقاعدة بيانات، و API خارجي لصور التمارين و API للباركود.")],
    bank=[("problem", "التنبؤ بإذا كان عميل البنك هيشترك في وديعة لأجل، بناءً على بروفايله وتفاصيل مكالمة التسويق."),
          ("dataset", "بيانات تسويق بنكي من Kaggle."),
          ("approach", "Logistic Regression، مع استكشاف وتنظيف البيانات باستخدام Pandas قبل النمذجة."),
          ("result", "اتقيّم الموديل على بيانات اختبار لم يرها من قبل باستخدام مقاييس تصنيف.")]),
 ),
}

def svg(body, fill=False):
    a = 'fill="currentColor"' if fill else 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
    return f'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" {a}>{body}</svg>'

ICONS = dict(
  resume=svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
  email=svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  github=svg('<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>', True),
  linkedin=svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-7m0 3a2.5 2.5 0 0 1 5 0v4"/>'),
  kaggle=svg('<path d="M7 4v16M17 4l-9 9M11 10l6 10"/>'),
  x=svg('<path d="M4 4l16 16M20 4 4 20"/>'),
)
SUN = '<svg class="ico sun" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
MOON = '<svg class="ico moon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>'

def head(c, lang, title, up, extra_class=""):
    return f'''<!doctype html>
<html lang="{lang}" dir="{c['dir']}" data-theme="dark" data-palette="nile-silt"{extra_class}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(c['desc'])}">
<link rel="icon" href="{up}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="{up}favicon-32.png">
<link rel="apple-touch-icon" href="{up}apple-touch-icon.png">
<link rel="preload" href="{up}assets/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{up}assets/fonts/geist-mono-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<script>(function(h){{try{{var p=localStorage.getItem('palette'),t=localStorage.getItem('main-theme');if(p)h.dataset.palette=p;if(t)h.dataset.theme=t}}catch(e){{}}}})(document.documentElement)</script>
<link rel="stylesheet" href="{up}css/style.css">
</head>
'''

def dock(c, lang_href):
    other = "ع" if c["dir"] == "ltr" else "en"
    return f'''<aside class="dock" aria-label="controls">
  <button class="dock-btn morph" id="paletteBtn" aria-haspopup="listbox" aria-expanded="false" aria-label="{c['palette']}" data-label="{c['palette']}"><span class="swatch"></span></button>
  <button class="dock-btn morph" id="themeBtn" aria-label="{c['to_light']}" data-label="{c['light']}" data-light="{c['light']}" data-dark="{c['dark']}" data-aria-light="{c['to_light']}" data-aria-dark="{c['to_dark']}">{SUN}{MOON}</button>
  <a class="dock-btn morph" href="{lang_href}" aria-label="{c['lang']}" data-label="{c['lang']}"><span class="lang-glyph">{other}</span></a>
</aside>
<div class="palette-pop" id="palettePop" role="listbox" aria-label="{c['palette']}" hidden>
''' + "".join(f'  <button role="option" class="pal-opt" data-value="{v}" aria-selected="false"><span class="pal-dot"></span>{n}</button>\n'
              for v, n in zip(["nile-silt", "deep-moss", "basalt", "nocturne"], c["pals"])) + "</div>\n"

def chips(items, tech=False):
    out = ""
    for i in items:
        dt = ' data-tech="' + e(i.lower()) + '"' if tech else ""
        out += '<li class="chip ltr' + (" tech" if tech else "") + '"' + dt + '>' + e(i) + '</li>'
    return out

def bullets(b): return '<ul class="impact">' + "".join(f"<li>{e(x)}</li>" for x in b) + "</ul>"

def master(c, kind, entries, up):
    rail, panes = "", ""
    for i, en in enumerate(entries):
        sel = "true" if i == 0 else "false"
        act = " is-active" if i == 0 else ""
        rail += (f'<div class="drum-item" role="option" id="{kind}-opt-{i}" aria-selected="{sel}" tabindex="{0 if i==0 else -1}">'
                 f'<span class="drum-num ltr">{i+1:02d}</span><span class="drum-text"><span class="drum-title">{e(en["t"])}</span>'
                 f'<span class="drum-sub">{e(en.get("d") or en["s"])}</span></span></div>')
        if kind == "projects":
            gh, live = PROJECT_LINKS[en["key"]]
            right = (f'<div class="pills"><a class="pill accent" href="{gh}" target="_blank" rel="noopener">{c["code"]} ↗</a>'
                     f'<a class="pill" href="{live}" target="_blank" rel="noopener">{c["live"]} ↗</a>'
                     f'<a class="pill" href="work/{en["key"]}/">{c["write"]} ↗</a></div>')
            mid = (f'<p class="summary">{e(en["sum"])}</p><div class="pipeline"><code class="ltr">{e(en["pipe"])}</code>'
                   f'<span class="metric ltr">{e(en["metric"])}</span></div>')
        else:
            right = f'<span class="date-pill">{e(en["pill"])}</span>'
            mid = ""
        panes += (f'<article class="entry{act}" aria-labelledby="{kind}-opt-{i}"><div class="entry-top">'
                  f'<div class="heading-row"><div class="heading-main"><h2 class="entry-title">{e(en["t"])}</h2>'
                  f'<p class="entry-sub">{e(en["s"])}</p></div>{right}</div>{mid}{bullets(en["b"])}</div>'
                  f'<div class="entry-foot"><ul class="chips">{chips(en["c"], kind=="projects")}</ul>'
                  f'<span class="wheel-hint">↑↓ {c["switch"]}</span></div></article>')
    return (f'<div class="master"><div class="rail" role="listbox" aria-label="{kind}"><div class="rail-stage">{rail}</div></div>'
            f'<div class="inspector">{panes}</div></div>')

def home(lang):
    c = L[lang]; up = "" if lang == "en" else "../"
    other = "ar/" if lang == "en" else "../"
    icons = []
    if HAS_RESUME: icons.append(("resume", f'{up}assets/resume.pdf', ' download', " accent"))
    icons += [("email", f"mailto:{EMAIL}", "", "" if HAS_RESUME else " accent"),
              ("x", XURL, ' target="_blank" rel="noopener"', ""),
              ("kaggle", KAGGLE, ' target="_blank" rel="noopener"', ""),
              ("github", GITHUB, ' target="_blank" rel="noopener"', ""),
              ("linkedin", LINKEDIN, ' target="_blank" rel="noopener"', "")]
    icon_row = "".join(f'<a class="icon-btn morph{a}" href="{h}"{x} aria-label="{c[k]}" data-label="{c[k]}">{ICONS[k]}</a>' for k, h, x, a in icons)
    if HAS_RESUME:
        primary = f'<a class="cta primary jelly" href="{up}assets/resume.pdf" download>{c["resume"]} <span aria-hidden="true">↗</span></a>'
    else:
        primary = f'<a class="cta primary jelly" href="{GITHUB}" target="_blank" rel="noopener">{c["github"]} <span aria-hidden="true">↗</span></a>'
    dlgdata = dict(c["dlg"], links=[[c["email"], "mailto:" + EMAIL, EMAIL], ["x", XURL, "↗"], ["kaggle", KAGGLE, "↗"], ["github", GITHUB, "↗"], ["linkedin", LINKEDIN, "↗"]])
    names = ["experience", "projects", "stack", "education"]
    counts = [len(c["exp"]), len(c["projects"]), None, None]
    tabs = "".join(
        f'<button class="tab" role="tab" id="tab-{n}" aria-controls="panel-{n}" aria-selected="{"true" if i==0 else "false"}" tabindex="{0 if i==0 else -1}">'
        f'{c["tabs"][i]}' + (f' <span class="count ltr">{counts[i]:02d}</span>' if counts[i] else "") + "</button>" for i, n in enumerate(names))
    stack = "".join(f'<section class="card"><header class="card-head"><h2 class="card-label">{lab}</h2><span class="card-count ltr">{len(items):02d}</span></header><ul class="chips">{chips(items)}</ul></section>'
                    for lab, items in zip(c["stack_labels"], STACK[1]))
    ed = c["edu"]
    edu = (f'<div class="edu"><div class="heading-row"><div class="heading-main"><h2 class="entry-title">{e(ed["t"])}</h2><p class="entry-sub">{e(ed["s"])}</p></div>'
           f'<span class="date-pill ltr">{e(ed["pill"])}</span></div><div class="stats">'
           + "".join(f'<div class="stat"><span>{e(a)}</span><strong>{e(b)}</strong></div>' for a, b in ed["stats"])
           + f'</div>{bullets(ed["b"])}<div class="coursework"><h3>{e(ed["cw"])}</h3><ul class="chips">{chips(ed["chips"])}</ul></div></div>')
    panels = [master(c, "experience", c["exp"], up), master(c, "projects", c["projects"], up), f'<div class="stack">{stack}</div>', edu]
    panel_html = "".join(f'<div class="tab-panel{" is-active" if i==0 else ""}" role="tabpanel" id="panel-{n}" aria-labelledby="tab-{n}">{panels[i]}</div>' for i, n in enumerate(names))
    # project write-up links are relative to the language root, which is this page's folder
    return head(c, lang, c["title"], up) + f'''<body class="home">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches){{document.documentElement.classList.add('is-world-entering');setTimeout(function(){{if(!window.__booted)document.documentElement.classList.remove('is-world-entering')}},3000)}}</script>
<canvas id="scene" aria-hidden="true"></canvas>
{dock(c, other)}<div class="shell">
<main>
<div class="zones">
  <div class="identity">
    <div class="head-row" data-enter="head">
      <img class="avatar" src="{up}assets/avatar.jpg" width="60" height="60" alt="{c['name']}">
      <div class="who"><h1>{c['name']}</h1><p class="role">{c['role']}<span class="sep">·</span><a href="about/">{c['about']}</a></p></div>
    </div>
    <p class="bio1" data-enter="bio1">{e(c['bio1'])}</p>
    <p class="bio2" data-enter="bio2">{e(c['bio2'])}</p>
    <div class="cta-row" data-enter="cta">{primary}<button class="cta secondary jelly" id="msgBtn" data-dlg="{e(json.dumps(dlgdata, ensure_ascii=False))}"><span>{c['msg']}</span></button><button class="cta secondary jelly" id="copyBtn" data-email="{EMAIL}" data-copied="{c['copied']}"><span>{c['copy']}</span></button></div>
    <div class="icon-row" data-enter="icons">{icon_row}</div>
  </div>
  <div class="panel" data-enter="panel">
    <div class="folder">
      <div class="folder-bg" aria-hidden="true"></div>
      <svg class="folder-line" aria-hidden="true"><path/></svg>
      <div class="tabbar" role="tablist">{tabs}</div>
      <div class="panel-box">{panel_html}</div>
    </div>
  </div>
</div>
</main>
</div>
<script src="{up}js/motion.js"></script>
<script src="{up}js/landscape.js"></script>
<script src="{up}js/main.js"></script>
</body>
</html>
'''

def inner(lang, slug):
    c = L[lang]
    parts = slug.split("/")
    up = "../" * (len(parts) + (1 if lang == "ar" else 0))
    home_href = "../" * len(parts)
    other = up + ("ar/" if lang == "en" else "") + slug + "/"
    if slug == "about":
        title, lead, crumb = c["about_title"], c["about_lead"], c["crumb_about"]
        secs = [(f"s{i}", h, ps) for i, (h, ps) in enumerate(c["about_sec"])]
        pills = f'<span class="a-pill">{c["city"]}</span><span class="a-pill">{c["read"]}</span>'
        header = f'<img class="a-avatar big" src="{up}assets/avatar.jpg" alt="{c["name"]}" width="60" height="60"><h1>{title}</h1><div class="byline">{pills}</div><hr class="dashed">'
        extra = (f'<h2>{c["contact"]}</h2><p><a class="ltr" href="mailto:{EMAIL}">{EMAIL}</a><br><a href="{GITHUB}">GitHub</a> · <a href="{LINKEDIN}">LinkedIn</a> · <a href="{KAGGLE}">Kaggle</a> · <a href="{XURL}">X</a></p>')
        tech = []
    else:
        key = parts[1]
        p = next(x for x in c["projects"] if x["key"] == key)
        title, lead, crumb = p["t"], p["sum"], c["crumb_work"] + " / " + key
        secs = [(k, c["heads"][k], [t]) for k, t in c["case"][key]]
        gh, live = PROJECT_LINKS[key]
        header = (f'<h1>{e(title)}</h1><div class="byline"><img class="a-avatar" src="{up}assets/avatar.jpg" alt="" width="34" height="34"><span>{c["name"]}</span><span aria-hidden="true">·</span>'
                  f'<span class="a-pill">{c["read"]}</span><span class="a-pill metric ltr">{p["metric"]}</span><a class="a-pill repo" href="{gh}">github ↗</a><a class="a-pill repo" href="{live}">{c["live"]} ↗</a></div>')
        extra, tech = "", p["c"]
    toc = "".join(f'<a href="#{i}">{h}</a>' for i, h, _ in secs)
    body = "".join(f'<h2 id="{i}">{h}</h2>' + "".join(f"<p>{e(x)}</p>" for x in ps) for i, h, ps in secs)
    notes = "".join(f'<a class="note-card" href="{home_href}work/{p["key"]}/"><strong>{e(p["t"])}</strong><span>{e(p["sum"])}</span></a>'
                    for p in c["projects"] if not slug.endswith(p["key"]))
    return head(c, lang, f'{title} · {c["name"]}', up) + f'''<body class="inner">
<div class="progress" aria-hidden="true"></div><div class="top-glow" aria-hidden="true"></div>
<header class="topbar"><div class="topbar-in">
  <a class="brand" href="{home_href}"><span class="arrow">←</span> {c['name']}</a><span class="slash">/</span><span class="crumb">{crumb}</span>
  <div class="top-controls">
    <button class="round" id="paletteBtn" aria-haspopup="listbox" aria-expanded="false" aria-label="{c['palette']}"><span class="swatch"></span></button>
    <button class="round" id="themeBtn" aria-label="{c['to_light']}" data-aria-light="{c['to_light']}" data-aria-dark="{c['to_dark']}">{SUN}{MOON}</button>
    <a class="round" href="{other}" aria-label="{c['lang']}">{"ع" if lang=="en" else "en"}</a>
  </div>
</div></header>
<div class="palette-pop in-top" id="palettePop" role="listbox" aria-label="{c['palette']}" hidden>''' + "".join(
        f'<button role="option" class="pal-opt" data-value="{v}" aria-selected="false"><span class="pal-dot"></span>{n}</button>'
        for v, n in zip(["nile-silt", "deep-moss", "basalt", "nocturne"], c["pals"])) + f'''</div>
<main class="article">
  <header>{header}<p class="lead">{e(lead)}</p>{f'<ul class="chips">{chips(tech, True)}</ul>' if tech else ''}
  <nav class="toc" aria-label="{c['toc']}"><span>{c['toc']}</span>{toc}</nav></header>
  {body}{extra}
  <footer class="a-foot"><h2>{c['notes']}</h2><div class="notes">{notes}</div><a class="back-btn jelly" href="{home_href}">{c['back']}</a></footer>
</main>
<script src="{up}js/motion.js"></script>
<script src="{up}js/main.js"></script>
</body>
</html>
'''

def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(text)

for lang in ("en", "ar"):
    pre = "" if lang == "en" else "ar/"
    write(pre + "index.html", home(lang))
    for slug in ("about", "work/gymez", "work/bank"):
        write(pre + slug + "/index.html", inner(lang, slug))
print("built; resume:", HAS_RESUME)
