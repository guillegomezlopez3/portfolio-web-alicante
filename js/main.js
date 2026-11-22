'use strict';
(function () {
  const PHONE = '34620477443';
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reloj de Alicante */
  const clock = $('clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 1000);
  }

  /* Menú móvil a pantalla completa */
  const mb = $('menu-btn'), sheet = $('sheet');
  if (mb && sheet) {
    const set = open => {
      sheet.classList.toggle('open', open); mb.setAttribute('aria-expanded', open);
      sheet.setAttribute('aria-hidden', !open); mb.textContent = open ? 'Cerrar' : 'Menú';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    mb.addEventListener('click', () => set(!sheet.classList.contains('open')));
    sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* Índice de servicios: un solo elemento abierto a la vez */
  const idx = $('idx');
  if (idx) {
    idx.addEventListener('click', e => {
      const b = e.target.closest('.row-b'); if (!b) return;
      const li = b.parentElement, was = li.classList.contains('open');
      [...idx.children].forEach(x => { x.classList.remove('open'); x.querySelector('.row-b').setAttribute('aria-expanded', 'false'); });
      if (!was) { li.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  }

  /* Imagen que sigue al cursor sobre la lista de demos */
  const work = $('work'), peek = $('peek');
  if (work && peek && matchMedia('(hover: hover)').matches && !reduce) {
    const img = peek.querySelector('img');
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * .16; y += (ty - y) * .16;
      peek.style.setProperty('--x', x.toFixed(1)); peek.style.setProperty('--y', y.toFixed(1));
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > .3) ? requestAnimationFrame(loop) : 0;
    };
    const move = e => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); };
    work.addEventListener('mousemove', move);
    work.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', e => {
        img.src = `https://images.unsplash.com/photo-${a.dataset.img}?auto=format&fit=crop&w=600&h=750&q=60`;
        x = tx = e.clientX; y = ty = e.clientY; peek.classList.add('on');
      });
      a.addEventListener('mouseleave', () => peek.classList.remove('on'));
    });
  }

  /* Entrada de elementos al hacer scroll */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

  /* Ficha de proyecto en vivo -> WhatsApp */
  const form = $('brief');
  if (form) {
    const v = n => (form.querySelector(`[name="${n}"]:checked`) || {}).value || '';
    const extras = () => [...form.querySelectorAll('[name="extra"]:checked')].map(i => i.value);
    const put = (id, t) => { $(id).textContent = t; };
    const update = () => {
      put('t-tipo', v('tipo') || '—'); put('t-plazo', v('plazo') || '—');
      put('t-extras', extras().join(', ') || 'Ninguno');
      put('t-nombre', form.nombre.value.trim() || '—'); put('t-contacto', form.contacto.value.trim() || '—');
    };
    put('t-fecha', new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    form.addEventListener('input', update); form.addEventListener('change', update); update();
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.nombre.value.trim() || !form.contacto.value.trim()) {
        (form.nombre.value.trim() ? form.contacto : form.nombre).focus(); return;
      }
      const ex = extras();
      const text = `Hola, soy ${form.nombre.value.trim()} (${form.contacto.value.trim()}).\nQuiero: ${v('tipo')}.\nExtras: ${ex.length ? ex.join(', ') : 'ninguno'}.\nPlazo: ${v('plazo')}.` + (form.mensaje.value.trim() ? `\n${form.mensaje.value.trim()}` : '');
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }

  const year = $('year'); if (year) year.textContent = new Date().getFullYear();
})();
