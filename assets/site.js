// Menu mobile
const b = document.querySelector('.burger'), n = document.getElementById('nav');
b.addEventListener('click', () => { const o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
n.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { n.classList.remove('open'); b.setAttribute('aria-expanded', false); }));

// Filtres de la galerie
const btns = document.querySelectorAll('.filters button'), figs = document.querySelectorAll('.gallery figure');
btns.forEach(bt => bt.addEventListener('click', () => {
  btns.forEach(x => { x.classList.toggle('on', x === bt); x.setAttribute('aria-pressed', x === bt); });
  const f = bt.dataset.f;
  figs.forEach(fg => fg.hidden = !(f === 'all' || fg.dataset.c.split(' ').includes(f)));
}));

// ===== Effets de mouvement au défilement =====
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = document.querySelector('.top');
  const bands = [...document.querySelectorAll('.band-in')];
  const par = [ ['.f-a', .07], ['.f-b', -.06], ['.sq-hero', .14, true], ['.s-right', -.07], ['.thick', .05], ['.ev-pic', .04] ]
    .flatMap(([s, v, rot]) => [...document.querySelectorAll(s)].map(el => ({ el, v, rot })));
  par.forEach(({ el }) => el.classList.add('px'));

  // Barre du haut qui se réduit + bandeaux + parallaxe
  let tick = false;
  function frame() {
    tick = false;
    const y = scrollY, vh = innerHeight, k = innerWidth < 760 ? .5 : 1;
    top.classList.toggle('small', y > 40);
    if (reduce) return;
    bands.forEach((b, i) => {
      const r = b.parentElement.getBoundingClientRect();
      const p = (vh - r.top) * .35;
      b.style.transform = `translateX(${i % 2 ? p - 600 : -p}px)`;
    });
    par.forEach(({ el, v, rot }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = (r.top + r.height / 2 - vh / 2) * v * k;
      el.style.translate = `0 ${-d}px`;
      if (rot) el.style.rotate = `${d * .05}deg`;
    });
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  frame();
  if (reduce) return;

  // Apparitions au défilement
  document.documentElement.classList.add('js');
  const set = (sel, type, d = 0, step = 0) => document.querySelectorAll(sel).forEach((el, i) => {
    if (type === 'split') {
      el.classList.add('split');
      el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((t, j) => `<span class="ln"><span style="--i:${j}">${t}</span></span>`).join('');
      el.dataset.r = 'split';
    } else el.dataset.r = type;
    el.style.setProperty('--d', (d + i * step) + 's');
  });
  set('.hero .script', 'up'); set('.hero h1', 'split', .1); set('.hero-lead', 'up', .35); set('.hero .btns', 'up', .5);
  set('.f-a', 'clip', .15); set('.f-b', 'clip', .45); set('.sq-hero', 'fade', .8);
  set('.h-right', 'split'); set('.s-left', 'left'); set('.s-p1', 'up', .1); set('.s-right', 'clip', .2); set('.s-p2', 'up', .1);
  set('.card', 'zoom'); set('.card .h-sm', 'split', .2); set('.savoir li', 'up', .25, .08); set('.card .script', 'up', .5); set('.thick', 'clip', .3);
  set('.sec-head h2', 'split'); set('.sec-head p', 'up', .2); set('.filters', 'up', .1);
  document.querySelectorAll('.gallery figure').forEach((f, i) => { f.dataset.r = 'up'; f.style.setProperty('--d', (i % 3) * .12 + 's'); });
  set('.events .kicker', 'up'); set('.h-xl', 'split'); set('.lead', 'up', .2);
  document.querySelectorAll('.ev').forEach(ev => {
    const t = ev.querySelector('.ev-txt'); t.dataset.r = ev.classList.contains('ev-rev') ? 'right' : 'left';
    const p = ev.querySelector('.ev-pic'); p.dataset.r = 'clip'; p.style.setProperty('--d', '.15s');
  });
  set('.cta-line', 'up'); set('.contact h2', 'split'); set('.infos', 'up', .2); set('.contact .btns', 'up', .35); set('.map', 'zoom', .2);
  set('.foot-in > *', 'up', 0, .1);

  // Un élément « clip » est masqué : on surveille son parent à sa place
  const map = new Map();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    (map.get(e.target) || []).forEach(el => el.classList.add('in'));
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -6% 0px', threshold: .05 });
  document.querySelectorAll('[data-r]').forEach(el => {
    if (el.closest('.hero')) return;
    const t = el.dataset.r === 'clip' ? el.parentElement : el;
    map.set(t, [...(map.get(t) || []), el]); io.observe(t);
  });
  // L'accueil s'anime dès l'ouverture de la page
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.hero [data-r]').forEach(el => el.classList.add('in'))));

  // Filtres : les créations réapparaissent en douceur
  document.querySelectorAll('.filters button').forEach(bt => bt.addEventListener('click', () => {
    document.querySelectorAll('.gallery figure:not([hidden])').forEach((f, i) => {
      f.classList.remove('in'); f.style.setProperty('--d', (i % 3) * .08 + 's');
      requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add('in')));
    });
  }));
})();
