'use strict';
const { eur, img: I, esc, store, save } = Demo;
const P = [
  { id: 1, n: 'Zapatillas Urban Runner', c: 'Calzado', p: 89.9, old: 109.9, r: 4.7, nr: 128, i: '1542291026-7eec264c27ff', d: 'Amortiguación ligera y suela de alto agarre para el día a día.', sz: ['38', '39', '40', '41', '42', '43'] },
  { id: 2, n: 'Sneakers Mediterráneo', c: 'Calzado', p: 74.5, r: 4.5, nr: 96, i: '1491553895911-0055eca6402d', d: 'Estilo casual en piel vegana, cómodas desde el primer uso.', sz: ['38', '39', '40', '41', '42'] },
  { id: 3, n: 'Camiseta Básica Algodón', c: 'Ropa', p: 19.9, r: 4.4, nr: 210, i: '1521572163474-6864f9cf17ab', d: '100 % algodón orgánico, corte regular.', sz: ['S', 'M', 'L', 'XL'] },
  { id: 4, n: 'Chaqueta Casual Costa', c: 'Ropa', p: 69, old: 89, r: 4.6, nr: 64, i: '1523381210434-271e8be1f52b', d: 'Ligera y transpirable, ideal para las noches de verano.', sz: ['S', 'M', 'L', 'XL'] },
  { id: 5, n: 'Mochila Urban 20L', c: 'Accesorios', p: 49.9, r: 4.8, nr: 143, i: '1553062407-98eeb64c6a62', d: 'Compartimento para portátil de 15" y tejido resistente al agua.', sz: [] },
  { id: 6, n: 'Bolso Tote Lino', c: 'Accesorios', p: 34, r: 4.3, nr: 51, i: '1548036328-c9fa89d128fa', d: 'Lino natural con interior forrado y bolsillo.', sz: [] },
  { id: 7, n: 'Gafas de sol Playa', c: 'Accesorios', p: 39.9, old: 54.9, r: 4.5, nr: 88, i: '1572635196237-14b3f281503f', d: 'Protección UV400 y montura ligera.', sz: [] },
  { id: 8, n: 'Auriculares Sound Pro', c: 'Tecnología', p: 99, r: 4.6, nr: 175, i: '1505740420928-5e560c06d30e', d: 'Cancelación de ruido y 30 h de batería.', sz: [] },
  { id: 9, n: 'Reloj Minimal Steel', c: 'Tecnología', p: 129, r: 4.9, nr: 37, i: '1523275335684-37898b6baf30', d: 'Acero inoxidable, resistente al agua 5 ATM.', sz: [] }
];
const REVS = [['Ana', 5, 'Justo lo que buscaba, llegó en 24 h.'], ['Pedro', 4, 'Buena calidad por el precio.'], ['Lucía', 5, 'Repetiré seguro. Muy cómodo.']];
const pid = id => P.find(p => p.id === id);
const pic = (p, w) => I(p.i, w, w);
const num = n => String(n).padStart(2, '0');
let cat = 'Todos', q = '', coupon = 0, mode = 'cart';
let cart = store('aus-cart', []), fav = store('aus-fav', []), recent = store('aus-recent', []), orders = store('aus-orders', {});
orders['AUS-1001'] ??= { t: Date.now() - 86400000 * 1.5, total: 94.9 };

/* Oferta flash */
const endT = Date.now() + 3 * 3600 * 1000;
setInterval(() => { const s = Math.max(0, Math.floor((endT - Date.now()) / 1000)), t = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(x => String(x).padStart(2, '0')).join(':'); $('flash').textContent = $('flash2').textContent = t; }, 1000);

/* Catálogo */
const CATS = ['Todos', ...new Set(P.map(p => p.c))];
$('chips').innerHTML = CATS.map(c => `<button role="tab" class="${c === cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
function renderGrid() {
  const max = +$('pmax').value; $('pmax-l').textContent = max + ' €';
  let l = P.filter(p => (cat === 'Todos' || p.c === cat) && p.p <= max && (!$('only-offer').checked || p.old) && (!q || (p.n + ' ' + p.c).toLowerCase().includes(q)));
  const s = $('sort').value; if (s) l = [...l].sort((a, b) => s === 'asc' ? a.p - b.p : s === 'desc' ? b.p - a.p : b.r - a.r);
  $('res').textContent = `${l.length} producto${l.length === 1 ? '' : 's'}`; $('empty').hidden = l.length > 0;
  $('grid').innerHTML = l.map(p => `<article class="cell">
    <button class="ph" data-quick="${p.id}" aria-label="Vista rápida de ${p.n}"><img src="${pic(p, 640)}" alt="${p.n}" width="640" height="640" loading="lazy">
      <span class="idx">N°${num(p.id)}</span>${p.old ? `<span class="off">−${Math.round((1 - p.p / p.old) * 100)}%</span>` : ''}</button>
    <button class="fav ${fav.includes(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-pressed="${fav.includes(p.id)}" aria-label="Guardar ${p.n}">♥</button>
    <div class="info"><span class="mono k">${p.c}</span><h3>${p.n}</h3><span class="rate">★ ${p.r} (${p.nr})</span>
      <span class="pr">${eur(p.p)}${p.old ? `<s>${eur(p.old)}</s>` : ''}</span></div>
    <div class="acts"><button data-add="${p.id}">Añadir +</button><button data-quick="${p.id}">Ver</button></div></article>`).join('');
}
$('chips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $('chips').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); renderGrid(); });
['sort', 'pmax', 'only-offer'].forEach(i => $(i).addEventListener('input', renderGrid));
$('search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderGrid(); });

/* Favoritos */
function toggleFav(id) { fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id]; save('aus-fav', fav); $('fav-count').textContent = fav.length; renderGrid(); if (mode === 'fav') renderFav(); }

/* Carrito */
function add(id, size) { const it = cart.find(x => x.id === id && x.s === size); it ? it.q++ : cart.push({ id, q: 1, s: size }); save('aus-cart', cart); renderCart(); Demo.toast(pid(id).n + ' → carrito'); }
function totals() { const sub = cart.reduce((a, x) => a + x.q * pid(x.id).p, 0), d = sub * coupon, base = sub - d, ship = !sub ? 0 : base >= 50 ? 0 : 4.95; return { sub, d, ship, total: base + ship, base }; }
function renderCart() {
  $('count').textContent = cart.reduce((a, x) => a + x.q, 0);
  if (mode === 'cart') $('items').innerHTML = cart.length ? cart.map((x, i) => { const p = pid(x.id); return `<div class="li"><img src="${pic(p, 160)}" alt=""><div><b>${p.n}</b><span class="mono">${x.s ? 'Talla ' + x.s + ' · ' : ''}${eur(p.p)}</span><div class="qty"><button data-dec="${i}" aria-label="Quitar uno">−</button><span>${x.q}</span><button data-inc="${i}" aria-label="Añadir uno">+</button></div></div><button class="x" data-rm="${i}" aria-label="Eliminar ${p.n}">×</button></div>`; }).join('') : '<p class="d-empty">El carrito está vacío.</p>';
  const t = totals();
  $('sub').textContent = eur(t.sub); $('discl').textContent = t.d ? '−' + eur(t.d) : '—'; $('ship').textContent = !t.sub ? '—' : t.ship ? eur(t.ship) : 'Gratis'; $('total').textContent = eur(t.total);
  const k = Math.min(10, Math.floor((t.base / 50) * 10));
  $('bar').innerHTML = t.sub ? `<span class="mono">${t.base < 50 ? `Te faltan ${eur(50 - t.base)} para el envío gratis` : 'Envío gratis conseguido'}</span><div class="seg">${Array.from({ length: 10 }, (_, i) => `<i class="${i < k ? 'f' : ''}"></i>`).join('')}</div>` : '';
  $('to-checkout').disabled = !cart.length;
}
$('items').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (mode === 'fav') { if (b.dataset.fadd) add(+b.dataset.fadd, pid(+b.dataset.fadd).sz[0]); if (b.dataset.frm) toggleFav(+b.dataset.frm); return; }
  const i = +(b.dataset.inc ?? b.dataset.dec ?? b.dataset.rm); if (Number.isNaN(i)) return;
  if (b.dataset.inc) cart[i].q++; if (b.dataset.dec) cart[i].q--; if (b.dataset.rm !== undefined || cart[i].q <= 0) cart.splice(i, 1);
  save('aus-cart', cart); renderCart();
});
function renderFav() {
  $('items').innerHTML = fav.length ? fav.map(id => { const p = pid(id); return `<div class="li"><img src="${pic(p, 160)}" alt=""><div><b>${p.n}</b><span class="mono">${eur(p.p)}</span><div class="qty"><button data-fadd="${id}" style="width:auto;padding:0 .6rem;font:400 .7rem var(--f-m)">Añadir +</button></div></div><button class="x" data-frm="${id}" aria-label="Quitar">×</button></div>`; }).join('') : '<p class="d-empty">Aún no has guardado nada.</p>';
}
function openDrawer(m) { mode = m; $('drawer-title').textContent = m === 'cart' ? 'Carrito' : 'Guardados'; $('cart-foot').hidden = m !== 'cart'; m === 'cart' ? renderCart() : renderFav(); $('drawer').classList.add('open'); $('overlay').classList.add('on'); }
const closeDrawer = () => { $('drawer').classList.remove('open'); $('overlay').classList.remove('on'); };
$('open-cart').onclick = () => openDrawer('cart'); $('open-fav').onclick = () => openDrawer('fav'); $('close-cart').onclick = $('overlay').onclick = closeDrawer;
$('clear').onclick = () => { cart = []; save('aus-cart', cart); renderCart(); };
$('apply').onclick = () => { coupon = $('coupon').value.trim().toUpperCase() === 'URBAN10' ? .1 : 0; Demo.toast(coupon ? 'Cupón aplicado: −10 %' : 'Cupón no válido'); renderCart(); };
$('grid').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.add) add(+b.dataset.add, pid(+b.dataset.add).sz[0]); if (b.dataset.fav) toggleFav(+b.dataset.fav); if (b.dataset.quick) openQuick(+b.dataset.quick); });

/* Vista rápida */
function openQuick(id) {
  const p = pid(id); let size = p.sz[0];
  recent = [id, ...recent.filter(x => x !== id)].slice(0, 6); save('aus-recent', recent); renderRecent();
  const rel = P.filter(x => x.c === p.c && x.id !== id).slice(0, 3);
  $('quick').innerHTML = `<div class="qv"><img src="${pic(p, 800)}" alt="${p.n}"><div class="qv-i"><button class="cl" id="qclose" aria-label="Cerrar">×</button>
    <span class="mono">${p.c} · N°${num(p.id)}</span><h2>${p.n}</h2><span class="rate">${Demo.stars(Math.round(p.r))} ${p.r} (${p.nr} opiniones)</span>
    <p class="pr">${eur(p.p)} ${p.old ? `<s>${eur(p.old)}</s>` : ''}</p><p>${p.d}</p>
    ${p.sz.length ? `<h4>Talla</h4><div class="sz" id="szs">${p.sz.map(s => `<button class="${s === size ? 'on' : ''}" data-s="${s}">${s}</button>`).join('')}</div>` : ''}
    <p class="mono">En stock · Envío en 24–48 h</p><button class="go" id="qadd">Añadir al carrito +</button>
    <h4>Opiniones</h4><div class="rv-l">${REVS.map(r => `<p><b>${r[0]}</b> ${Demo.stars(r[1])} — ${r[2]}</p>`).join('')}</div>
    ${rel.length ? `<h4>También te puede gustar</h4><div class="rel">${rel.map(r => `<button data-rel="${r.id}" aria-label="${r.n}"><img src="${pic(r, 240)}" alt="${r.n}"></button>`).join('')}</div>` : ''}</div></div>`;
  if (!$('quick').open) $('quick').showModal();
  $('qclose').onclick = () => $('quick').close();
  $('qadd').onclick = () => { add(p.id, size); $('quick').close(); };
  if ($('szs')) $('szs').onclick = e => { const b = e.target.closest('button'); if (!b) return; size = b.dataset.s; $('szs').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
  $('quick').querySelectorAll('[data-rel]').forEach(b => b.onclick = () => openQuick(+b.dataset.rel));
}
$('quick').addEventListener('click', e => { if (e.target === $('quick')) $('quick').close(); });
function renderRecent() { $('recent-wrap').hidden = !recent.length; $('recent').innerHTML = recent.map(id => `<button data-quick="${id}" aria-label="${pid(id).n}"><img src="${pic(pid(id), 220)}" alt=""></button>`).join(''); }
$('recent').addEventListener('click', e => { const b = e.target.closest('[data-quick]'); if (b) openQuick(+b.dataset.quick); });

/* Checkout en 3 pasos */
let step = 1, data = {};
$('to-checkout').onclick = () => { closeDrawer(); step = 1; data = {}; renderCheckout(); $('checkout').showModal(); };
function renderCheckout() {
  const t = totals(), sc = { std: t.ship, exp: 7.9, pick: 0 }, v = k => esc(data[k] ?? '');
  const head = `<div class="ck"><div class="ck-s"><h2>${step === 4 ? 'Hecho' : 'Checkout'}</h2><button id="cx" aria-label="Cerrar">×</button></div>` + (step < 4 ? `<ol class="steps">${['Datos', 'Envío', 'Pago'].map((s, i) => `<li class="${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}">${num(i + 1)} ${s}</li>`).join('')}</ol>` : '');
  let body = '';
  if (step === 1) body = `<form id="cf" class="fm"><div><label for="c-n">Nombre</label><input id="c-n" required value="${v('n')}"></div><div><label for="c-e">Email</label><input id="c-e" type="email" required value="${v('e')}"></div><div class="full"><label for="c-a">Dirección</label><input id="c-a" required value="${v('a')}"></div><div><label for="c-c">Ciudad</label><input id="c-c" required value="${data.c ? v('c') : 'Alicante'}"></div><div><label for="c-p">Código postal</label><input id="c-p" required pattern="[0-9]{5}" value="${v('p')}"></div><button class="go full">Continuar →</button></form>`;
  if (step === 2) body = `<form id="cf">${[['std', 'Estándar · 24–48 h'], ['exp', 'Exprés · 24 h'], ['pick', 'Recogida en tienda']].map(([k, l]) => `<label class="sh"><input type="radio" name="sh" value="${k}" ${(data.sh || 'std') === k ? 'checked' : ''}><span>${l}</span><b>${sc[k] ? eur(sc[k]) : 'Gratis'}</b></label>`).join('')}<div class="btns"><button type="button" class="back" id="back">Atrás</button><button class="go">Continuar →</button></div></form>`;
  if (step === 3) { data.total = t.total - t.ship + sc[data.sh || 'std'];
    body = `<form id="cf" class="fm"><p class="full mono">Pago simulado: no se procesa ninguna tarjeta real.</p><div class="full"><label for="k-n">Número de tarjeta</label><input id="k-n" placeholder="4242 4242 4242 4242" required pattern="[0-9 ]{16,19}"></div><div><label for="k-d">Caducidad</label><input id="k-d" placeholder="MM/AA" required pattern="[0-9]{2}/[0-9]{2}"></div><div><label for="k-c">CVC</label><input id="k-c" placeholder="123" required pattern="[0-9]{3}"></div>
    <div class="sum full"><div class="row"><span>Subtotal</span><span>${eur(t.sub)}</span></div>${t.d ? `<div class="row"><span>Descuento</span><span>−${eur(t.d)}</span></div>` : ''}<div class="row"><span>Envío</span><span>${sc[data.sh || 'std'] ? eur(sc[data.sh || 'std']) : 'Gratis'}</span></div><div class="row big"><span>Total</span><span>${eur(data.total)}</span></div></div>
    <div class="btns full"><button type="button" class="back" id="back">Atrás</button><button class="go">Pagar ${eur(data.total)}</button></div></form>`; }
  if (step === 4) body = `<div class="done"><h3>Gracias,<br>${esc(data.n.split(' ')[0])}.</h3><p>Tu pedido está confirmado. Resumen enviado a ${esc(data.e)} (simulado).</p><div class="barcode" aria-hidden="true"></div><p class="mono">${data.order}</p><button class="go" id="cx2" style="margin-top:1.6rem">Seguir comprando</button></div>`;
  $('checkout').innerHTML = head + body + '</div>';
  $('cx').onclick = () => $('checkout').close(); if ($('cx2')) $('cx2').onclick = () => $('checkout').close();
  if ($('back')) $('back').onclick = () => { step--; renderCheckout(); };
  if ($('cf')) $('cf').onsubmit = e => {
    e.preventDefault();
    if (step === 1) data = { ...data, n: $('c-n').value, e: $('c-e').value, a: $('c-a').value, c: $('c-c').value, p: $('c-p').value };
    if (step === 2) data.sh = new FormData(e.target).get('sh');
    if (step === 3) { data.order = 'AUS-' + Math.floor(1002 + Math.random() * 8000); orders[data.order] = { t: Date.now(), total: data.total, sh: data.sh }; save('aus-orders', orders); cart = []; save('aus-cart', cart); renderCart(); }
    step++; renderCheckout();
  };
}

/* Seguimiento */
$('track-form').addEventListener('submit', e => {
  e.preventDefault(); const o = orders[$('track-n').value.trim().toUpperCase()];
  if (!o) { $('track-res').innerHTML = '<p class="tl-m">No encontramos ese pedido.</p>'; return; }
  const h = (Date.now() - o.t) / 3600000, k = h < 1 ? 0 : h < 12 ? 1 : h < 36 ? 2 : 3;
  $('track-res').innerHTML = `<ol class="tl">${['Pedido recibido', 'Preparando', 'En reparto', 'Entregado'].map((s, i) => `<li class="${i <= k ? 'd' : ''}">${s}</li>`).join('')}</ol><p class="tl-m">Total: ${eur(o.total)}</p>`;
});
$('ship-form').addEventListener('submit', e => {
  e.preventDefault(); const cp = $('cp').value;
  $('ship-res').textContent = !/^\d{5}$/.test(cp) ? 'Introduce un código postal válido de 5 cifras.' : cp.startsWith('03') ? 'Provincia de Alicante: entrega en 24 h. Gratis desde 50 €, si no 4,95 €.' : 'Península: entrega en 48–72 h. Gratis desde 50 €, si no 6,95 €.';
});

Demo.faq('faqs', [['¿Cuánto tarda mi pedido?', 'En la provincia de Alicante 24 h; en el resto de la península, 48–72 h.'], ['¿Puedo devolver un producto?', 'Sí, tienes 30 días. La devolución es gratuita en tienda.'], ['¿Qué métodos de pago aceptáis?', 'Tarjeta, Bizum y PayPal a través de una pasarela segura (Stripe).'], ['¿Puedo recoger en tienda?', 'Sí, sin coste. Te avisamos por email cuando esté listo.']]);
Demo.newsletter('news', 'Suscrito. Tu código URBAN10 ya está activo (simulado).');
$('fav-count').textContent = fav.length; $('total-n').textContent = `(${P.length})`;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
renderGrid(); renderCart(); renderRecent();
