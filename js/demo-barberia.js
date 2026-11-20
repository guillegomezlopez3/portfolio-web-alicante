'use strict';
const { eur, img: I, esc, store, save } = Demo;
const S = [{ id: 1, n: 'Corte de pelo', p: 15, m: 30, c: 'Pelo' }, { id: 2, n: 'Corte y degradado (fade)', p: 17, m: 40, c: 'Pelo' }, { id: 3, n: 'Arreglo de barba', p: 10, m: 20, c: 'Barba' }, { id: 4, n: 'Afeitado clásico con toalla', p: 14, m: 30, c: 'Barba' }, { id: 5, n: 'Corte y barba', p: 22, m: 45, c: 'Combos' }, { id: 6, n: 'Corte niño (hasta 12 años)', p: 11, m: 25, c: 'Pelo' }, { id: 7, n: 'Tinte o mechas', p: 25, m: 50, c: 'Color' }, { id: 8, n: 'Pack novio', p: 49, m: 90, c: 'Combos' }];
const B = [
  { n: 'Dani', r: 'Maestro barbero', e: 'Fades y estilos modernos', i: '1503951914875-452162b0f3f1', s: [1, 2, 3, 5, 6, 8], num: '0147' },
  { n: 'Javi', r: 'Barbero clásico', e: 'Afeitado con navaja y barba', i: '1517832606299-7ae9b720a186', s: [1, 3, 4, 5, 8], num: '0212' },
  { n: 'Sergio', r: 'Colorista', e: 'Tintes, mechas y cortes de tendencia', i: '1605497788044-5a32c7078486', s: [1, 2, 6, 7, 5], num: '0308' }
];
const H = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
const DAYS = (() => { const o = [], d = new Date(); while (o.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) o.push(new Date(d)); } return o; })();
const dk = d => d.toISOString().slice(0, 10), dl = d => d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });

/* Tarifas como tickets */
let tab = 'Todos';
$('svc-tabs').innerHTML = ['Todos', 'Pelo', 'Barba', 'Combos', 'Color'].map(c => `<button role="tab" class="${c === tab ? 'on' : ''}" data-t="${c}">${c}</button>`).join('');
function rSvc() { $('svc').innerHTML = S.filter(s => tab === 'Todos' || s.c === tab).map(s => `<div class="tk"><span class="no">N°${String(s.id).padStart(3, '0')}</span><div class="t"><h3>${s.n}</h3><p>${s.m} min · ${s.c}</p></div><span class="p">${s.p}<small> €</small></span></div>`).join(''); }
$('svc-tabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = b.dataset.t; $('svc-tabs').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); rSvc(); }; rSvc();

/* Licencias */
$('team').innerHTML = B.map(b => `<article class="lic rv"><span class="hole"></span><header>LICENCIA DE BARBERO</header><div class="body"><img src="${I(b.i, 300, 400)}" alt="${b.n}" width="300" height="400" loading="lazy"><div><h3>${b.n}</h3><dl><dt>Categoría</dt><dd>${b.r}</dd><dt>Especialidad</dt><dd>${b.e}</dd><dt>Nº de carnet</dt><dd>${b.num}</dd></dl></div></div></article>`).join('');
Demo.reveal();

/* Carrete de fotos */
const G = [['1599351431202-1e0f0137899a', 'Fade'], ['1503951914875-452162b0f3f1', 'Barba'], ['1605497788044-5a32c7078486', 'Clásico'], ['1622286342621-4bd786c2447c', 'Fade'], ['1517832606299-7ae9b720a186', 'Barba'], ['1585747860715-2ba37e788b70', 'Clásico']];
let gf = 'Todos';
$('gal-f').innerHTML = ['Todos', 'Fade', 'Clásico', 'Barba'].map(c => `<button role="tab" class="${c === gf ? 'on' : ''}" data-f="${c}">${c}</button>`).join('');
function rGal() { $('gal').innerHTML = G.map((g, i) => [g, i]).filter(([g]) => gf === 'Todos' || g[1] === gf).map(([g, i]) => `<button data-g="${g[0]}" aria-label="Ampliar fotograma ${i + 1}"><img src="${I(g[0], 420, 525)}" alt="Trabajo de ${g[1].toLowerCase()}" width="420" height="525" loading="lazy"><span>FOTOGRAMA ${String(i + 1).padStart(2, '0')} — ${g[1].toUpperCase()}</span></button>`).join(''); }
$('gal-f').onclick = e => { const b = e.target.closest('button'); if (!b) return; gf = b.dataset.f; $('gal-f').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); rGal(); }; rGal();
$('gal').onclick = e => { const b = e.target.closest('button'); if (b) { $('photo-img').src = I(b.dataset.g, 1200); $('photo').showModal(); } };
$('photo-x').onclick = () => $('photo').close(); $('photo').onclick = e => { if (e.target === $('photo')) $('photo').close(); };

/* Asesor de estilo */
const SUG = { Ovalado: 'Casi todo te sienta bien: prueba un fade medio con textura arriba.', Redondo: 'Volumen arriba y laterales muy cortos (high fade) para alargar el rostro.', Cuadrado: 'Corte clásico con raya lateral o crop texturizado; una barba corta marca la mandíbula.', Alargado: 'Flequillo o laterales con algo de volumen y barba corta para equilibrar.' };
$('f-go').onclick = () => { const h = $('f-hair').value; $('f-res').textContent = `${SUG[$('f-face').value]} Con el cabello ${h.toLowerCase()}, ${h === 'Rizado' ? 'pide tijera y que no pasen la máquina muy a ras.' : h === 'Poco denso' ? 'conviene un corte corto y texturizado.' : 'funciona muy bien con un producto mate.'}`; };

/* Tienda: estantería con productos dibujados en CSS */
const PR = [{ id: 1, n: 'Cera mate fuerte', p: 12.9, t: 'tin', l: 'Cera' }, { id: 2, n: 'Aceite para barba', p: 14.5, t: 'btl', l: 'Aceite barba' }, { id: 3, n: 'Pomada brillo clásica', p: 11.9, t: 'tin', l: 'Pomada' }, { id: 4, n: 'Champú anticaspa', p: 9.9, t: 'btl', l: 'Champú' }];
$('shop').innerHTML = PR.map(p => `<article class="it"><div class="art"><div class="${p.t}"><i>${p.l}</i></div></div><h3>${p.n}</h3><p class="pr">${eur(p.p)}</p><button data-add="${p.id}">Añadir</button></article>`).join('');

/* Carrito */
let cart = store('bca-cart', []);
function rCart() {
  $('count').textContent = cart.reduce((a, x) => a + x.q, 0);
  $('items').innerHTML = cart.length ? cart.map((x, i) => `<li><span>${esc(x.n)}<br><small>${eur(x.p)} × ${x.q}</small></span><span class="qb"><button data-d="${i}" aria-label="Quitar uno">−</button><button data-i="${i}" aria-label="Añadir uno">+</button></span></li>`).join('') : '<li>Carrito vacío.</li>';
  $('total').textContent = eur(cart.reduce((a, x) => a + x.p * x.q, 0));
}
function addItem(n, p) { const it = cart.find(x => x.n === n); it ? it.q++ : cart.push({ n, p, q: 1 }); save('bca-cart', cart); rCart(); Demo.toast(n + ' añadido'); }
$('shop').onclick = e => { const b = e.target.closest('[data-add]'); if (b) { const p = PR.find(x => x.id === +b.dataset.add); addItem(p.n, p.p); } };
$('items').onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +(b.dataset.i ?? b.dataset.d); cart[i].q += b.dataset.i !== undefined ? 1 : -1; if (cart[i].q <= 0) cart.splice(i, 1); save('bca-cart', cart); rCart(); };
const tg = o => { $('drawer').classList.toggle('open', o); $('overlay').classList.toggle('on', o); };
$('open-cart').onclick = () => tg(true); $('close-cart').onclick = $('overlay').onclick = () => tg(false);
$('pay').onclick = () => { if (!cart.length) return Demo.toast('El carrito está vacío'); const t = $('total').textContent; cart = []; save('bca-cart', cart); rCart(); tg(false); Demo.toast(`Pago simulado de ${t}. ¡Gracias!`); };
document.querySelectorAll('[data-bono]').forEach(b => b.onclick = () => { const [n, p] = b.dataset.bono.split('|'); addItem('Bono ' + n, +p); });
$('gift').oninput = () => $('gift-l').textContent = $('gift').value + ' €';
$('gift-b').onclick = () => addItem('Tarjeta regalo ' + $('gift').value + ' €', +$('gift').value);
rCart();

/* Fidelidad */
let stamps = store('bca-stamps', 3);
function rSt() { $('stamps').innerHTML = Array.from({ length: 10 }, (_, i) => `<div class="stamp ${i < stamps ? 'on' : ''}" style="--r:${(i * 37) % 21 - 10}">${i === 9 ? '★' : i < stamps ? '✓' : i + 1}</div>`).join(''); $('st-t').textContent = stamps >= 10 ? '¡Tienes un corte gratis! Úsalo en tu próxima reserva.' : `Te faltan ${10 - stamps} sello${10 - stamps === 1 ? '' : 's'} para tu corte gratis.`; }
$('st-reset').onclick = () => { stamps = 0; save('bca-stamps', 0); rSt(); }; rSt();

/* Reserva multiservicio con tarjeta de cita en vivo */
const st = { s: [], b: null, d: null, h: null };
const busy = (b, d, i) => (b.charCodeAt(0) + d.charCodeAt(9) * 3 + i * 5) % 4 === 0;
const ob = (cls, g, v, l, sel, dis) => `<button type="button" class="${sel ? 'on' : ''}" data-g="${g}" data-v="${v}" ${dis ? 'disabled' : ''}>${l}</button>`;
const sel = () => S.filter(x => st.s.includes(x.id));
function render() {
  $('o-s').innerHTML = S.map(s => ob('', 's', s.id, `${s.n} · ${s.p} €`, st.s.includes(s.id), st.b && !B.find(b => b.n === st.b).s.includes(s.id))).join('');
  $('o-b').innerHTML = B.map(b => ob('', 'b', b.n, b.n, st.b === b.n, st.s.some(id => !b.s.includes(id)))).join('');
  $('o-d').innerHTML = DAYS.map(d => ob('', 'd', dk(d), dl(d), st.d === dk(d))).join('');
  $('o-h').innerHTML = H.map((h, i) => ob('', 'h', h, h, st.h === h, st.b && st.d && busy(st.b, st.d, i))).join('');
  const l = sel();
  $('c-s').textContent = l.map(x => x.n).join(', '); $('c-b').textContent = st.b || ''; $('c-d').textContent = st.d ? dl(new Date(st.d + 'T00:00')) : ''; $('c-h').textContent = st.h || '';
  $('c-t').textContent = l.reduce((a, x) => a + x.p, 0) + ' €';
}
$('o-s').parentElement.parentElement.onclick = e => {
  const b = e.target.closest('[data-g]'); if (!b || b.disabled) return; const g = b.dataset.g, v = b.dataset.v;
  if (g === 's') { const id = +v; st.s = st.s.includes(id) ? st.s.filter(x => x !== id) : [...st.s, id]; } else st[g] = v;
  if (st.b && st.d && st.h && busy(st.b, st.d, H.indexOf(st.h))) st.h = null;
  render();
};
let MINE = store('bca-mine', []);
function rMine() { $('mine').hidden = !MINE.length; $('mine-l').innerHTML = MINE.map((m, i) => `<li><span>${esc(m)}</span><button data-c="${i}">Cancelar</button></li>`).join(''); }
$('mine-l').onclick = e => { const b = e.target.closest('[data-c]'); if (b) { MINE.splice(+b.dataset.c, 1); save('bca-mine', MINE); rMine(); } };
$('f').onsubmit = e => {
  e.preventDefault();
  if (!(st.s.length && st.b && st.d && st.h)) return Demo.toast('Elige servicio(s), barbero, día y hora');
  const l = sel(), txt = `${l.map(x => x.n).join(' + ')} con ${st.b} · ${dl(new Date(st.d + 'T00:00'))} ${st.h}`;
  MINE.push(txt); save('bca-mine', MINE); rMine(); stamps = Math.min(10, stamps + 1); save('bca-stamps', stamps); rSt();
  $('ok-t').textContent = `${$('nm').value}, te esperamos: ${txt}. Total: ${l.reduce((a, x) => a + x.p, 0)} €.`;
  $('f').hidden = true; $('ok').hidden = false;
};
$('re').onclick = () => { Object.assign(st, { s: [], b: null, d: null, h: null }); $('f').reset(); render(); $('ok').hidden = true; $('f').hidden = false; };
rMine(); render();

$('reviews').innerHTML = [['Rubén M.', 5, 'El mejor fade que me han hecho en Alicante. Ambiente de los de antes.'], ['Carlos S.', 5, 'Afeitado con toalla caliente: una experiencia. Reservar online es facilísimo.'], ['Adrián L.', 4, 'Buen servicio y puntuales. Los bonos compensan.']].map(([n, s, t]) => `<blockquote><p class="s">${Demo.stars(s)}</p><p>"${t}"</p><footer>— ${n}</footer></blockquote>`).join('');
Demo.faq('faq', [['¿Hace falta reservar?', 'Recomendado. También atendemos sin cita según disponibilidad.'], ['¿Cuánto dura un corte con barba?', 'Unos 45 minutos.'], ['¿Cobráis con tarjeta?', 'Sí, tarjeta, Bizum y efectivo.'], ['¿Puedo cancelar?', 'Sí, hasta 2 horas antes sin coste.']]);
