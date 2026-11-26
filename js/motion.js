/* Spring, spring-in and jelly: the three motion helpers used everywhere. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const live = new Set();
  let raf = 0, last = 0;
  function loop(now) {
    const dt = Math.min(.032, Math.max(.001, (now - last) / 1000));
    last = now;
    live.forEach(fn => { if (fn(dt) === false) live.delete(fn); });
    raf = live.size ? requestAnimationFrame(loop) : 0;
  }
  function run(fn) {
    live.add(fn);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    return fn;
  }

  /* damped spring, mass 1 */
  function Spring(value, k, c, onUpdate) {
    let x = value, v = 0, target = value, task = null;
    const api = {
      get value() { return x; }, get velocity() { return v; },
      set(t) {
        target = t;
        if (reduced) { x = t; v = 0; onUpdate(x, 0); return; }
        if (task && live.has(task)) return;
        task = run(dt => {
          v += (-k * (x - target) - c * v) * dt;
          x += v * dt;
          const rest = Math.abs(x - target) < .002 && Math.abs(v) < .02;
          if (rest) { x = target; v = 0; }
          onUpdate(x, v);
          return !rest;
        });
      },
      snap(t) { x = target = t; v = 0; if (task) live.delete(task); onUpdate(x, 0); }
    };
    return api;
  }

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const entering = new WeakMap();

  /* element springs from an offset to rest, squashing with velocity */
  function springIn(el, o) {
    const prev = entering.get(el);
    if (prev) live.delete(prev);
    const { x = 0, y = 0, k = 205, c = 16, delay = 0, fade = .21, stretch = .00018 } = o;
    const done = () => { el.style.transform = el.style.opacity = el.style.willChange = ''; entering.delete(el); };
    if (reduced) { done(); return; }
    let px = x, py = y, vx = 0, vy = 0, t = -delay / 1000;
    el.style.willChange = 'transform, opacity';
    el.style.opacity = '0';
    el.style.transform = `translate(${px}px,${py}px)`;
    const task = dt => {
      t += dt;
      if (t < 0) return true;
      vx += (-k * px - c * vx) * dt; px += vx * dt;
      vy += (-k * py - c * vy) * dt; py += vy * dt;
      const sy = y ? clamp(1 + Math.abs(vy) * stretch, .91, 1.11) : 1;
      const sx = x ? clamp(1 + Math.abs(vx) * stretch, .94, 1.07) : 1;
      const a = Math.min(1, t / fade);
      el.style.opacity = String(1 - Math.pow(1 - a, 2));
      el.style.transform = `translate(${px}px,${py}px) scale(${sx},${sy})`;
      if (t > fade && Math.abs(px) + Math.abs(py) < .15 && Math.abs(vx) + Math.abs(vy) < 3) { done(); return false; }
      return true;
    };
    entering.set(el, task);
    run(task);
  }

  /* impulse spring on translate + scale (independent CSS properties, so it stacks with transforms) */
  const jellies = new WeakMap();
  function jelly(el, o = {}) {
    if (reduced) return;
    const { vx = 0, vy = -8, intensity = .35 } = o;
    let s = jellies.get(el);
    if (!s) { s = { x: 0, y: 0, vx: 0, vy: 0, q: 0, qv: 0 }; jellies.set(el, s); }
    s.vx = clamp(s.vx + vx * 6 * intensity, -240, 240);
    s.vy = clamp(s.vy + vy * 6 * intensity, -240, 240);
    s.qv += intensity * 1.4;
    if (s.task && live.has(s.task)) return;
    el.style.willChange = 'translate, scale';
    s.task = run(dt => {
      s.vx += (-320 * s.x - 14 * s.vx) * dt; s.x += s.vx * dt;
      s.vy += (-320 * s.y - 14 * s.vy) * dt; s.y += s.vy * dt;
      s.qv += (-320 * s.q - 14 * s.qv) * dt; s.q += s.qv * dt;
      const speed = clamp(s.vy, -240, 240) * .00035;
      el.style.translate = `${s.x}px ${s.y}px`;
      el.style.scale = `${1 + s.q * .5 - speed * .5} ${1 - s.q * .5 + speed}`;
      const rest = Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.q * 40) < .08 && Math.abs(s.vx) + Math.abs(s.vy) < 2;
      if (rest) el.style.translate = el.style.scale = el.style.willChange = '';
      return !rest;
    });
  }

  window.Motion = { Spring, springIn, jelly, reduced, clamp };
})();
