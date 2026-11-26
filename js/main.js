(function () {
  const { Spring, springIn, jelly, reduced, clamp } = window.Motion;
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rtl = html.dir === 'rtl';
  const scene = () => window.Scene;
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  window.__booted = true;

  /* ---------- theme + palette ---------- */
  const themeBtn = $('#themeBtn');
  function syncTheme() {
    const dark = html.dataset.theme === 'dark';
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', dark ? themeBtn.dataset.ariaLight : themeBtn.dataset.ariaDark);
    if (themeBtn.dataset.light) themeBtn.dataset.label = dark ? themeBtn.dataset.light : themeBtn.dataset.dark;
    const tip = $('.tip', themeBtn);
    if (tip) tip.textContent = themeBtn.dataset.label;
  }
  function toggleTheme() {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    store('main-theme', html.dataset.theme);
    syncTheme();
    scene() && scene().update();
  }
  themeBtn && themeBtn.addEventListener('click', toggleTheme);
  syncTheme();

  const palBtn = $('#paletteBtn'), pop = $('#palettePop');
  if (palBtn && pop) {
    const opts = $$('.pal-opt', pop);
    const mark = () => opts.forEach(o => o.setAttribute('aria-selected', String(o.dataset.value === html.dataset.palette)));
    mark();
    let open = false;
    const spring = Spring(0, 300, 18, (p, v) => {
      const down = innerWidth <= 1324 || pop.classList.contains('in-top');
      const sq = clamp(v * .006, -.06, .06);
      const base = (down ? .92 : .9);
      const s = base + (1 - base) * p;
      pop.style.opacity = String(clamp(p, 0, 1));
      pop.style.transform = `${down ? `translateY(${-10 * (1 - p)}px) ` : ''}scale(${s - sq},${s + sq})`;
      if (!open && p < .02) pop.hidden = true;
    });
    const set = state => {
      if (open === state) return;
      open = state;
      palBtn.setAttribute('aria-expanded', String(state));
      if (state) { pop.hidden = false; spring.set(1); } else spring.set(0);
    };
    palBtn.addEventListener('click', e => {
      e.stopPropagation();
      set(!open);
      if (open && e.detail === 0) (opts.find(o => o.getAttribute('aria-selected') === 'true') || opts[0]).focus();
    });
    opts.forEach((o, i) => {
      o.addEventListener('click', () => {
        html.dataset.palette = o.dataset.value;
        store('palette', o.dataset.value);
        mark();
        jelly(o, { vy: -5, intensity: .3 });
        scene() && scene().update();
      });
      o.addEventListener('keydown', e => {
        const d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (d) { e.preventDefault(); opts[(i + d + opts.length) % opts.length].focus(); }
      });
    });
    document.addEventListener('click', e => { if (!pop.contains(e.target) && !palBtn.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { set(false); palBtn.focus(); } });
  }

  /* hover / click jelly */
  $$('.jelly, .pill, .pal-opt').forEach(el => {
    el.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') jelly(el, { vy: -6, intensity: .3 }); });
    el.addEventListener('click', () => jelly(el, { vy: 14, intensity: .6 }));
  });

  /* ---------- copy email ---------- */
  const copy = $('#copyBtn');
  if (copy) {
    const label = $('span', copy), original = label.textContent;
    let timer;
    copy.addEventListener('click', async () => {
      const text = copy.dataset.email;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
        const t = document.createElement('textarea');
        t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { ok = document.execCommand('copy'); } catch (err) {}
        t.remove();
      }
      if (!ok) { location.href = 'mailto:' + text; return; }
      label.textContent = copy.dataset.copied;
      copy.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = original; copy.classList.remove('is-copied'); }, 1800);
    });
  }

  /* ---------- morph buttons ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  /* square s with radius r, plus a tab hanging below (t: 0..1.06), tab centre at cx */
  function pathDown(s, r, t, w, cx, h, gap) {
    if (t <= .01) return `M${r} 0H${s - r}Q${s} 0 ${s} ${r}V${s - r}Q${s} ${s} ${s - r} ${s}H${r}Q0 ${s} 0 ${s - r}V${r}Q0 0 ${r} 0Z`;
    const tw = 20 + (w - 20) * t, c = s / 2 + (cx - s / 2) * Math.min(1, t);
    const x0 = c - tw / 2, x1 = c + tw / 2, y0 = s + gap * t, y1 = y0 + h * t;
    const n = 9, br = Math.min(11, h * t / 2);
    const a = s / 2 - n, b = s / 2 + n;
    return `M${r} 0H${s - r}Q${s} 0 ${s} ${r}V${s - r}Q${s} ${s} ${s - r} ${s}H${b + 3}Q${b} ${s} ${b} ${y0}` +
      `H${x1 - br}Q${x1} ${y0} ${x1} ${y0 + br}V${y1 - br}Q${x1} ${y1} ${x1 - br} ${y1}H${x0 + br}Q${x0} ${y1} ${x0} ${y1 - br}` +
      `V${y0 + br}Q${x0} ${y0} ${x0 + br} ${y0}H${a}Q${a} ${s} ${a - 3} ${s}H${r}Q0 ${s} 0 ${s - r}V${r}Q0 0 ${r} 0Z`;
  }
  /* square that stretches sideways into a pill; dir -1 left, +1 right */
  function pathSide(s, r, t, w, dir) {
    const ext = Math.max(0, w * t), x0 = dir < 0 ? -ext : 0, x1 = dir < 0 ? s : s + ext;
    const inset = (s - 26) / 2 * Math.min(1, t), y0 = 0, y1 = s;
    const rr = r + (13 - r) * Math.min(1, t) * .3;
    return `M${x0 + rr} ${y0 + inset}H${x1 - rr}Q${x1} ${y0 + inset} ${x1} ${y0 + inset + rr}V${y1 - inset - rr}Q${x1} ${y1 - inset} ${x1 - rr} ${y1 - inset}` +
      `H${x0 + rr}Q${x0} ${y1 - inset} ${x0} ${y1 - inset - rr}V${y0 + inset + rr}Q${x0} ${y0 + inset} ${x0 + rr} ${y0 + inset}Z`;
  }
  $$('.morph').forEach(btn => {
    const dock = btn.classList.contains('dock-btn');
    const size = dock ? 34 : 40, radius = dock ? 10 : 12;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'blob'); svg.setAttribute('viewBox', `0 0 ${size} ${size}`); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(NS, 'path'); svg.appendChild(path); btn.prepend(svg);
    const tip = document.createElement('span'); tip.className = 'tip'; tip.setAttribute('aria-hidden', 'true');
    tip.textContent = btn.dataset.label; btn.appendChild(tip);
    let geo = { mode: 'down', w: 60, cx: size / 2 };
    function measure() {
      const w = Math.ceil(tip.scrollWidth) + (dock ? 22 : 24);
      const rect = btn.getBoundingClientRect();
      if (dock && innerWidth > 1324) geo = { mode: 'side', w: w + 4, dir: rtl ? 1 : -1 };
      else {
        const mid = rect.left + rect.width / 2;
        const clamped = clamp(mid, 8 + w / 2, innerWidth - 8 - w / 2);
        geo = { mode: 'down', w, cx: size / 2 + clamped - mid };
      }
      tip.style.width = w + 'px';
    }
    function draw(t) {
      t = clamp(t, 0, 1.06);
      path.setAttribute('d', geo.mode === 'side' ? pathSide(size, radius, t, geo.w, geo.dir) : pathDown(size, radius, t, geo.w, geo.cx, 26, 6));
      tip.style.opacity = String(clamp((t - .35) / .65, 0, 1));
      if (geo.mode === 'side') { tip.style.top = (size - 26) / 2 + 'px'; tip.style.left = (geo.dir < 0 ? -geo.w + 4 : size - 4) + 'px'; }
      else { tip.style.top = size + 6 * t + 'px'; tip.style.left = geo.cx - (geo.w) / 2 + 'px'; }
      if (t <= .01) btn.classList.remove('is-open');
    }
    const spring = Spring(0, 255, 15, draw);
    draw(0);
    const on = () => { measure(); btn.classList.add('is-hot', 'is-open'); spring.set(1); };
    const off = () => { btn.classList.remove('is-hot'); spring.set(0); };
    btn.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') { on(); jelly(btn, { vy: 22, intensity: .45 }); } });
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) on(); });
    btn.addEventListener('blur', off);
    btn.addEventListener('click', () => jelly(btn, { vy: 26, intensity: .72 }));
  });

  /* ---------- inner pages ---------- */
  const bar = $('.progress');
  if (bar) {
    const grow = () => {
      const max = html.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    };
    addEventListener('scroll', grow, { passive: true }); addEventListener('resize', grow); grow();
  }

  const folder = $('.folder');
  if (!folder) return;

  /* ---------- folder outline ---------- */
  const tabbar = $('.tabbar'), box = $('.panel-box'), tabs = $$('.tab'), panels = $$('.tab-panel');
  const line = $('.folder-line path'), bg = $('.folder-bg');
  let current = 0, geo = { x: 0, w: 0, lean: 0 };
  function draw() {
    const W = folder.offsetWidth, H = folder.offsetHeight, T = box.offsetTop;
    if (!W) return;
    const R = innerWidth < 380 ? 10 : 14, o = .5;
    const x0 = clamp(geo.x, o, W - o - 24), x1 = clamp(geo.x + geo.w, x0 + 24, W - o);
    const rl = Math.max(0, Math.min(11, x0 - o)), rr = Math.max(0, Math.min(11, W - o - x1));
    const Rl = Math.min(R, Math.max(0, x0 - o - rl)), Rr = Math.min(R, Math.max(0, W - o - x1 - rr));
    const tl = x0 + geo.lean, tr = x1 + geo.lean, y = T + o;
    const d = `M${o} ${y + Rl}Q${o} ${y} ${o + Rl} ${y}H${x0 - rl}Q${x0} ${y} ${x0} ${y - rl}` +
      `L${tl} ${o + 11}Q${tl} ${o} ${tl + 11} ${o}H${tr - 11}Q${tr} ${o} ${tr} ${o + 11}` +
      `L${x1} ${y - rr}Q${x1} ${y} ${x1 + rr} ${y}H${W - o - Rr}Q${W - o} ${y} ${W - o} ${y + Rr}` +
      `V${H - o - R}Q${W - o} ${H - o} ${W - o - R} ${H - o}H${o + R}Q${o} ${H - o} ${o} ${H - o - R}Z`;
    line.setAttribute('d', d);
    bg.style.clipPath = `path('${d}')`;
  }
  const sx = Spring(0, 280, 18, (v, vel) => { geo.x = v; geo.lean = clamp(vel * .006, -7, 7); draw(); });
  const sw = Spring(0, 280, 18, v => { geo.w = v; draw(); });
  function place(animate) {
    const t = tabs[current];
    const x = t.getBoundingClientRect().left - folder.getBoundingClientRect().left;
    const w = t.offsetWidth;
    // layout offsets, immune to entrance transforms
    const lx = t.offsetLeft - tabbar.scrollLeft + tabbar.offsetLeft;
    const target = t.offsetParent === folder || t.offsetParent === tabbar ? (t.offsetParent === tabbar ? lx : t.offsetLeft - tabbar.scrollLeft) : x;
    if (animate) { sx.set(target); sw.set(w); } else { sx.snap(target); sw.snap(w); }
  }
  tabbar.style.position = 'relative';
  new ResizeObserver(() => place(false)).observe(folder);
  tabbar.addEventListener('scroll', () => place(false), { passive: true });
  document.fonts && document.fonts.ready.then(() => place(false));
  addEventListener('resize', () => place(false));

  /* ---------- tabs ---------- */
  let leaving = null;
  function select(i, focus) {
    if (focus) tabs[i].focus({ preventScroll: true });
    if (i === current) return;
    const dir = (i > current ? 1 : -1) * (rtl ? -1 : 1);
    const out = panels[current], inc = panels[i];
    tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    current = i;
    if (leaving) leaving.cancel();
    panels.forEach(p => p.classList.remove('is-active', 'is-leaving'));
    inc.classList.add('is-active');
    if (!reduced) {
      out.classList.add('is-leaving');
      const anim = out.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-18 * dir}px) scale(.985)` }],
        { duration: 150, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      leaving = anim;
      anim.onfinish = () => { out.classList.remove('is-leaving'); anim.cancel(); };
      anim.oncancel = () => out.classList.remove('is-leaving');
      springIn(inc, { x: 28 * dir, k: 290, c: 21, fade: .16 });
      jelly($('.panel'), { vx: -14 * dir, vy: 8, intensity: .32 });
    }
    scene() && scene().gust();
    if (tabbar.scrollWidth > tabbar.clientWidth) tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    place(true);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      let n = null;
      if (e.key === 'ArrowRight') n = current + (rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') n = current + (rtl ? 1 : -1);
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select((n + tabs.length) % tabs.length, true);
    });
  });

  /* ---------- drum rails ---------- */
  const stacked = matchMedia('(max-width: 959px)');
  $$('.master').forEach(master => {
    const rail = $('.rail', master), items = $$('.drum-item', rail), entries = $$('.entry', master), insp = $('.inspector', master);
    let at = 0, lastWheel = 0;
    function pick(i, dir, focus) {
      if (focus) items[i].focus({ preventScroll: true });
      if (i === at) { jelly(items[i], { vy: 10, intensity: .35 }); return; }
      items.forEach((it, n) => { it.setAttribute('aria-selected', String(n === i)); it.tabIndex = n === i ? 0 : -1; });
      entries.forEach((en, n) => en.classList.toggle('is-active', n === i));
      at = i; insp.scrollTop = 0;
      springIn(entries[i], { y: 14 * dir, k: 320, c: 22, fade: .16 });
      jelly(items[i], { vy: 18 * dir, intensity: .5 });
      scene() && scene().micro();
      if (stacked.matches) items[i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    }
    items.forEach((it, i) => {
      it.addEventListener('click', () => pick(i, i > at ? 1 : -1));
      it.addEventListener('keydown', e => {
        const fwd = stacked.matches ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        const back = stacked.matches ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        let n = null, d = 1;
        if (e.key === fwd) n = (at + 1) % items.length;
        else if (e.key === back) { n = (at - 1 + items.length) % items.length; d = -1; }
        else if (e.key === 'Home') { n = 0; d = -1; }
        else if (e.key === 'End') n = items.length - 1;
        else if (e.key === 'Enter' || e.key === ' ') n = i;
        if (n === null) return;
        e.preventDefault();
        pick(n, d, true);
      });
    });
    rail.addEventListener('wheel', e => {
      if (stacked.matches) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4 || performance.now() - lastWheel < 180) return;
      lastWheel = performance.now();
      const d = e.deltaY > 0 ? 1 : -1;
      pick((at + d + items.length) % items.length, d);
    }, { passive: false });
  });

  window.__toggleTheme = toggleTheme;
  /* ---------- message dialog ---------- */
  const msgBtn = $('#msgBtn');
  if (msgBtn) {
    const D = JSON.parse(msgBtn.dataset.dlg);
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const close = () => { const o = $('#dlg'); if (o) o.remove(); };
    msgBtn.addEventListener('click', () => {
      close();
      const o = document.createElement('div'); o.className = 'ovl'; o.id = 'dlg';
      o.innerHTML = '<div class="dlg" role="dialog" aria-modal="true"><button class="x" aria-label="close">\u00d7</button><div class="crow"><div><p class="cta-t">' + esc(D.cta) + '</p><div class="links">'
        + D.links.map(l => '<a href="' + esc(l[1]) + '"' + (l[1].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l[0]) + '<span>' + esc(l[2]) + '</span></a>').join('')
        + '</div></div><form class="form" id="contactForm" action="https://api.web3forms.com/submit" method="POST"><input type="hidden" name="access_key" value="6bd643cd-9c55-42b1-88d9-4425248539a9"><input type="hidden" name="subject" value="New message from portfolio contact form"><input type="checkbox" name="botcheck" style="display:none">'
        + '<div><label>' + esc(D.name) + '</label><input type="text" name="name" required></div><div><label>' + esc(D.email) + '</label><input type="email" name="email" required></div><div><label>' + esc(D.msg) + '</label><textarea name="message" required></textarea></div>'
        + '<div style="display:flex;gap:12px;align-items:center"><button class="cta primary" type="submit">' + esc(D.send) + '</button><span class="fstatus" id="fstatus"></span></div></form></div></div>';
      document.body.appendChild(o);
      o.addEventListener('click', e => { if (e.target === o) close(); });
      $('.x', o).addEventListener('click', close);
      addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', k); } });
      const f = $('#contactForm', o);
      f.addEventListener('submit', async e => {
        e.preventDefault();
        const b = $('button[type=submit]', f), st = $('#fstatus', f), old = b.textContent;
        b.textContent = D.sending; b.disabled = true;
        try { const r = await fetch(f.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) }); const j = await r.json();
          if (r.ok && j.success) { st.textContent = D.ok; f.reset(); } else st.textContent = D.err; } catch (x) { st.textContent = D.err; }
        b.textContent = old; b.disabled = false;
      });
      $('.x', o).focus();
    });
  }
  window.Scene = {
    update() { window.landscape && window.landscape.set(html.dataset.palette, html.dataset.theme); },
    gust() { window.landscape && window.landscape.gust(1.05); },
    micro() { window.landscape && window.landscape.ripple(.9); }
  };
  window.Scene.update();

  /* ---------- intro ---------- */
  place(false);
  if (html.classList.contains('is-world-entering')) {
    window.landscape && window.landscape.intro();
    setTimeout(() => {
      const plan = [
        ['[data-enter=head]', -36, 0], ['[data-enter=bio1]', 38, 40], ['[data-enter=bio2]', 42, 95],
        ['[data-enter=cta]', 46, 150], ['[data-enter=icons]', 50, 205], ['[data-enter=panel]', 48, 100], ['.dock', 44, 240]
      ];
      plan.forEach(([s, y, delay]) => springIn($(s), { y, delay, k: 205, c: 16, stretch: .00045 }));
      html.classList.remove('is-world-entering');
    }, 420);
  }
})();
