'use strict';
/* Utilidades compartidas por las demos (sin dependencias). */
document.documentElement.classList.add('js');
window.$ = id => document.getElementById(id);
window.Demo = {
  eur: n => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
  store: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  save: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  esc: s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
  stars: n => '★'.repeat(n) + '☆'.repeat(5 - n),
  img: (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=70`,
  toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._t); this._t = setTimeout(() => t.classList.remove('show'), 3200);
  },
  faq(id, items) {
    document.getElementById(id).innerHTML = items.map(([q, a]) => `<details class="faq-i"><summary>${q}</summary><p>${a}</p></details>`).join('');
  },
  newsletter(id, msg) {
    const f = document.getElementById(id);
    f.addEventListener('submit', e => { e.preventDefault(); f.reset(); Demo.toast(msg || 'Suscripción simulada completada'); });
  },
  /* Cuenta animada de 0 a data-count cuando el elemento entra en pantalla */
  counters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count, dur = 1100; let t0;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const step = ts => { t0 ??= ts; const k = Math.min(1, (ts - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('es-ES'); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      io.observe(el);
    });
  },
  /* Animaciones de entrada por scroll para elementos .rv */
  reveal() {
    const els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }
};
