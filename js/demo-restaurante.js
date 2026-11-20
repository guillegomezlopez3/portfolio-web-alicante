'use strict';
const { eur, img, esc } = Demo;
/* a = alérgenos (G gluten, L lácteos, M marisco, P pescado, H huevo, F frutos secos) · t = veg (vegetariano), sg (sin gluten) */
const DISHES = [
  { id: 1, c: 'Entrantes', n: 'Croquetas de gamba roja', d: 'Cremosas, con alioli de limón', p: 9.5, i: '1546069901-ba9599a7e63c', a: 'GLM', t: [] },
  { id: 2, c: 'Entrantes', n: 'Ensalada de tomate de huerta', d: 'Ventresca, cebolla tierna y AOVE', p: 11, i: '1476224203421-9ac39bcb3327', a: 'P', t: ['sg'] },
  { id: 3, c: 'Entrantes', n: 'Pulpo a la brasa', d: 'Parmentier de patata y pimentón', p: 16.5, i: '1414235077428-338989a2e8c0', a: 'ML', t: ['sg'] },
  { id: 4, c: 'Entrantes', n: 'Hummus de garbanzos y crudités', d: 'Con pan de pita tostado', p: 7.5, i: '1504674900247-0877df9cc836', a: 'G', t: ['veg'] },
  { id: 5, c: 'Arroces', n: 'Arroz del senyoret', d: 'Pescado y marisco pelado (mín. 2 personas)', p: 19, i: '1534080564583-6be75777b70a', a: 'MP', t: ['sg'] },
  { id: 6, c: 'Arroces', n: 'Arroz con conejo y caracoles', d: 'Receta tradicional, cocinado a leña', p: 17.5, i: '1515443961218-a51367888e4b', a: '', t: ['sg'] },
  { id: 7, c: 'Arroces', n: 'Arroz de verduras de temporada', d: 'Alcachofa, judía verde y garrofón', p: 15.5, i: '1504674900247-0877df9cc836', a: '', t: ['veg', 'sg'] },
  { id: 8, c: 'Carnes', n: 'Entrecot de ternera madurada', d: 'Con patatas panadera y pimientos', p: 24, i: '1544025162-d76694265947', a: '', t: ['sg'] },
  { id: 9, c: 'Carnes', n: 'Secreto ibérico a la brasa', d: 'Cebolla caramelizada y mojo', p: 18.5, i: '1558030006-450675393462', a: '', t: ['sg'] },
  { id: 10, c: 'Postres', n: 'Tarta de queso cremosa', d: 'Con coulis de frutos rojos', p: 6.5, i: '1551024601-bec78aea704b', a: 'GLH', t: ['veg'] },
  { id: 11, c: 'Postres', n: 'Turrón helado de Jijona', d: 'Con crujiente de almendra', p: 6, i: '1488477181946-6428a0291777', a: 'LHF', t: ['veg', 'sg'] },
  { id: 12, c: 'Postres', n: 'Coulant de chocolate', d: 'Con helado de vainilla', p: 7, i: '1563729784474-d77dbb933a9e', a: 'GLH', t: ['veg'] }
];
const CATS = ['Todos', 'Entrantes', 'Arroces', 'Carnes', 'Postres'];
let cat = 'Todos', q = ''; const diet = new Set();

/* Horarios y "abierto ahora" */
const H = [['Lunes', null], ['Martes', [[13, 16], [20, 23.5]]], ['Miércoles', [[13, 16], [20, 23.5]]], ['Jueves', [[13, 16], [20, 23.5]]], ['Viernes', [[13, 16.5], [20, 24.5]]], ['Sábado', [[13, 16.5], [20, 24.5]]], ['Domingo', [[13, 17]]]];
const today = (new Date().getDay() + 6) % 7;
const hm = x => { x %= 24; const h = Math.floor(x), m = Math.round((x - h) * 60); return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); };
$('hrs').innerHTML = H.map(([d, s], i) => `<li class="${i === today ? 'today' : ''}"><span>${d}</span><span>${s ? s.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(' · ') : 'Cerrado'}</span></li>`).join('');
(() => {
  const n = new Date(), hr = n.getHours() + n.getMinutes() / 60, s = H[today][1], open = s && s.some(([a, b]) => hr >= a && hr < b);
  const el = $('open-sign'); el.textContent = open ? 'Abierto ahora' : 'Cerrado ahora'; el.className = 'open-sign ' + (open ? 'y' : 'n');
})();

/* Menú del día */
const DAYMENU = {
  Lunes: [['Gazpacho de temporada', 'Ensalada tibia de pulpo', 'Crema de calabaza'], ['Arroz a banda', 'Pollo al ajillo', 'Merluza a la plancha'], ['Flan casero', 'Fruta de temporada', 'Helado']],
  Martes: [['Ensaladilla rusa', 'Alcachofas con jamón', 'Sopa de pescado'], ['Paella valenciana', 'Albóndigas en salsa', 'Bacalao al pil-pil'], ['Tarta de queso', 'Natillas', 'Fruta']],
  Miércoles: [['Croquetas caseras', 'Ensalada mediterránea', 'Crema de verduras'], ['Arroz con costra', 'Carrillera estofada', 'Dorada a la sal'], ['Brownie', 'Yogur con miel', 'Fruta']],
  Jueves: [['Hummus y crudités', 'Calamares a la andaluza', 'Salmorejo'], ['Fideuà', 'Lomo en salsa', 'Atún encebollado'], ['Tiramisú', 'Flan', 'Fruta']],
  Viernes: [['Pulpo a feira', 'Tosta de anchoa', 'Gazpacho'], ['Arroz del senyoret', 'Presa ibérica', 'Lubina al horno'], ['Coulant', 'Turrón helado', 'Fruta']]
};
const days = Object.keys(DAYMENU); let dd = Math.min((new Date().getDay() + 6) % 7, 4);
function renderDay() {
  $('day-tabs').innerHTML = days.map((d, i) => `<button role="tab" aria-selected="${i === dd}" class="${i === dd ? 'on' : ''}" data-d="${i}">${d}</button>`).join('');
  $('day-menu').innerHTML = DAYMENU[days[dd]].map((g, i) => `<div><h3>${['Primeros', 'Segundos', 'Postres'][i]}</h3><ul>${g.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('');
}
$('day-tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { dd = +b.dataset.d; renderDay(); } });
renderDay();

/* Carta */
const ALG = { G: 'Gluten', L: 'Lácteos', M: 'Marisco', P: 'Pescado', H: 'Huevo', F: 'Frutos secos' };
const ok = x => (cat === 'Todos' || x.c === cat) && (!q || (x.n + ' ' + x.d).toLowerCase().includes(q))
  && (!diet.has('veg') || x.t.includes('veg')) && (!diet.has('sg') || x.t.includes('sg'))
  && (!diet.has('nolac') || !x.a.includes('L')) && (!diet.has('nomar') || !/[MP]/.test(x.a));
function renderCats() { $('cats').innerHTML = CATS.map(c => `<button role="tab" class="${c === cat ? 'on' : ''}" data-c="${c}">${c}<sup>${c === 'Todos' ? DISHES.length : DISHES.filter(d => d.c === c).length}</sup></button>`).join(''); }
function setPrev(x) { $('prev-img').src = img(x.i, 600, 800); $('prev-n').textContent = x.n; $('prev-p').textContent = eur(x.p); }
function renderMenu() {
  const l = DISHES.filter(ok); $('none').hidden = l.length > 0;
  $('dishes').innerHTML = l.map(x => `<li class="dish" data-id="${x.id}"><div class="d-top"><h3>${x.n}</h3><span class="dots"></span><span class="p">${eur(x.p)}</span></div><p class="d-desc">${x.d}</p>
    <div class="d-meta">${x.t.includes('veg') ? '<span class="mk v" title="Vegetariano">V</span>' : ''}${x.t.includes('sg') ? '<span class="mk s" title="Sin gluten">SG</span>' : ''}${[...x.a].map(a => `<span class="mk" title="${ALG[a]}">${a}</span>`).join('')}<button class="add" data-add="${x.id}">+ Añadir al pedido</button></div></li>`).join('');
  if (l[0]) setPrev(l[0]);
}
$('cats').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; renderCats(); renderMenu(); });
document.querySelectorAll('.chk input').forEach(i => i.addEventListener('change', () => { i.checked ? diet.add(i.dataset.k) : diet.delete(i.dataset.k); renderMenu(); }));
$('search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderMenu(); });
$('dishes').addEventListener('mouseover', e => { const li = e.target.closest('.dish'); if (li) setPrev(DISHES.find(d => d.id === +li.dataset.id)); });
renderCats(); renderMenu();

/* Pedido para llevar */
let cart = [], disc = 0;
const sub = () => cart.reduce((a, x) => a + x.q * DISHES.find(d => d.id === x.id).p, 0);
function renderCart() {
  $('count').textContent = cart.reduce((a, x) => a + x.q, 0);
  $('items').innerHTML = cart.length ? cart.map(x => { const d = DISHES.find(y => y.id === x.id); return `<li><b>${d.n}</b><span>${eur(d.p * x.q)}</span><span class="q"><button data-dec="${d.id}" aria-label="Quitar uno">−</button>${x.q}<button data-inc="${d.id}" aria-label="Añadir uno">+</button></span></li>`; }).join('') : '<li class="d-empty">Aún no has añadido platos.</li>';
  const s = sub(), d = s * disc; $('o-disc').textContent = disc ? '−' + eur(d) : '—'; $('total').textContent = eur(s - d);
}
$('dishes').addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (!b) return; const id = +b.dataset.add, it = cart.find(x => x.id === id); it ? it.q++ : cart.push({ id, q: 1 }); renderCart(); Demo.toast('Añadido al pedido'); });
$('items').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const id = +(b.dataset.inc || b.dataset.dec), it = cart.find(x => x.id === id); it.q += b.dataset.inc ? 1 : -1; if (it.q <= 0) cart = cart.filter(x => x !== it); renderCart(); });
const tog = o => { $('drawer').classList.toggle('open', o); $('shade').classList.toggle('on', o); };
$('open-cart').onclick = () => tog(true); $('close-cart').onclick = $('shade').onclick = () => tog(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') tog(false); });
$('o-time').innerHTML = ['13:30', '14:00', '14:30', '20:30', '21:00', '21:30'].map(t => `<option>${t}</option>`).join('');
$('o-promo').addEventListener('change', e => { disc = e.target.value.trim().toUpperCase() === 'TERRETA10' ? .1 : 0; Demo.toast(disc ? '10 % aplicado' : 'Código no válido'); renderCart(); });
$('order').addEventListener('submit', e => { e.preventDefault(); if (!cart.length) return Demo.toast('Añade algún plato primero'); const t = $('total').textContent; cart = []; renderCart(); tog(false); Demo.toast(`Pedido de ${t} confirmado · recogida a las ${$('o-time').value}`); });
renderCart();

/* Galería */
const G = ['1517248135467-4c7edcad34c4', '1414235077428-338989a2e8c0', '1534080564583-6be75777b70a', '1544025162-d76694265947', '1551024601-bec78aea704b', '1546069901-ba9599a7e63c'];
$('gal').innerHTML = G.map((g, i) => `<button data-g="${g}" aria-label="Ampliar foto ${i + 1}"><img src="${img(g, 640, 640)}" alt="Foto ${i + 1} de La Terreta" loading="lazy"></button>`).join('');
$('gal').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { $('photo-img').src = img(b.dataset.g, 1400); $('photo').showModal(); } });
$('photo-x').onclick = () => $('photo').close(); $('photo').addEventListener('click', e => { if (e.target === $('photo')) $('photo').close(); });

/* Reserva */
const guests = $('rguests'); guests.innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? 'personas' : 'persona'}</option>`).join('') + '<option value="11">Más de 10</option>';
const date = $('rdate'), iso = new Date().toISOString().slice(0, 10); date.min = date.value = iso;
const TIMES = ['13:30', '14:00', '14:30', '15:00', '20:30', '21:00', '21:30', '22:00']; let slot = '';
function renderSlots() {
  const seed = [...date.value].reduce((a, c) => a + c.charCodeAt(0), 0);
  $('slots').innerHTML = TIMES.map((t, i) => `<button type="button" class="${t === slot ? 'on' : ''}" ${(seed + i * 7) % 5 === 0 ? 'disabled' : ''} data-t="${t}">${t}</button>`).join('');
  if (slot && !$('slots').querySelector(`[data-t="${slot}"]:not([disabled])`)) slot = '';
}
date.addEventListener('change', renderSlots);
$('slots').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; slot = b.dataset.t; $('slots').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });
renderSlots();
let RES = Demo.store('terreta-res', []);
function renderRes() { $('mine').hidden = !RES.length; $('res-list').innerHTML = RES.map((r, i) => `<li><span>${r.f} · ${r.h} · ${r.g} pers. · ${r.z}</span><button data-cancel="${i}">Cancelar</button></li>`).join(''); }
$('res-list').addEventListener('click', e => { const b = e.target.closest('[data-cancel]'); if (!b) return; RES.splice(+b.dataset.cancel, 1); Demo.save('terreta-res', RES); renderRes(); Demo.toast('Reserva cancelada'); });
renderRes();
$('booking').addEventListener('submit', e => {
  e.preventDefault(); if (!slot) return Demo.toast('Elige una hora para tu reserva');
  const f = new Date(date.value + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  $('confirm-text').textContent = `${$('rname').value}, te esperamos el ${f} a las ${slot} para ${guests.value} ${guests.value === '1' ? 'persona' : 'personas'} (${$('rzone').value}).`;
  $('confirm-code').textContent = 'TERRETA-' + Math.floor(1000 + Math.random() * 9000);
  RES.push({ f, h: slot, g: guests.value, z: $('rzone').value }); Demo.save('terreta-res', RES); renderRes();
  $('booking').hidden = true; $('confirm').hidden = false;
});
$('new-booking').addEventListener('click', () => { $('booking').reset(); date.value = iso; slot = ''; renderSlots(); $('confirm').hidden = true; $('booking').hidden = false; });

/* Eventos */
let people = 12;
function est() { $('e-n').textContent = people; $('e-est').textContent = eur(+document.querySelector('[name=ev]:checked').value * people); }
$('e-minus').onclick = () => { people = Math.max(8, people - 1); est(); }; $('e-plus').onclick = () => { people = Math.min(200, people + 1); est(); };
$('ev-o').addEventListener('change', est); est();
$('event-form').addEventListener('submit', e => { e.preventDefault(); Demo.toast('Solicitud enviada (simulado). Te llamaremos en 24 h'); });

/* Opiniones */
let REV = [['María G.', 5, 'El arroz del senyoret es de los mejores que he probado en Alicante. Servicio impecable.'], ['Javier P.', 5, 'Reservamos online en un minuto y la terraza es una maravilla. Volveremos.'], ['Laura y Tomás', 4, 'Muy buen producto y precio justo. Con más sitio en la barra sería perfecto.']];
let qi = 0, rate = 5;
function renderQ() { const [n, s, t] = REV[qi]; $('q-t').textContent = t; $('q-a').innerHTML = `<span>${Demo.stars(s)}</span>${esc(n)}`; $('q-c').textContent = `${qi + 1} / ${REV.length}`; }
$('q-prev').onclick = () => { qi = (qi - 1 + REV.length) % REV.length; renderQ(); }; $('q-next').onclick = () => { qi = (qi + 1) % REV.length; renderQ(); };
function renderRate() { $('rate').innerHTML = [1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="${i === rate}" aria-label="${i} estrellas" class="${i <= rate ? 'on' : ''}" data-r="${i}">★</button>`).join(''); }
$('rate').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { rate = +b.dataset.r; renderRate(); } });
$('review-form').addEventListener('submit', e => { e.preventDefault(); REV.unshift([$('rv-n').value, rate, $('rv-t').value]); qi = 0; e.target.reset(); rate = 5; renderRate(); renderQ(); Demo.toast('Gracias por tu opinión'); });
renderQ(); renderRate();

Demo.faq('faq', [['¿Admitís perros en la terraza?', 'Sí, en la terraza los perros son bienvenidos.'], ['¿Tenéis opciones sin gluten?', 'Sí. Usa los filtros de la carta y avisa al reservar para que preparemos tu mesa.'], ['¿Cuánto tarda un arroz?', 'Unos 25 minutos. Puedes pedirlo con antelación al reservar.'], ['¿Hay menú infantil?', 'Sí, con platos pequeños a 9 € que incluyen bebida y helado.']]);
Demo.newsletter('news', 'Bienvenido al club (simulado)');
Demo.reveal();
