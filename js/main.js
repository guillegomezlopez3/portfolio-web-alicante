'use strict';
(function () {
  const PHONE = '34620477443';

  // Menú móvil
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));
  }

  // Animaciones al hacer scroll
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }

  // Formulario de contacto -> WhatsApp
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const d = new FormData(form);
      const text = `Hola Guillermo, soy ${d.get('nombre')} (${d.get('email')}). Tipo de proyecto: ${d.get('tipo')}.\n${d.get('mensaje')}`;
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Utilidades compartidas por las demos
window.Demo = {
  toast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast card px-4 py-3 text-sm';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._t);
    this._t = setTimeout(() => t.classList.remove('show'), 3000);
  },
  faq(id, items) {
    document.getElementById(id).innerHTML = items.map(([q, a]) => `<details class="card p-4"><summary class="flex justify-between font-semibold">${q} <span class="chev">⌄</span></summary><p class="mt-2 text-sm opacity-80">${a}</p></details>`).join('');
  },
  newsletter(id, msg) {
    const f = document.getElementById(id);
    f.addEventListener('submit', e => { e.preventDefault(); f.reset(); Demo.toast(msg || '✅ ¡Suscripción simulada completada!'); });
  },
  stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); },
  eur(n) { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); }
};
