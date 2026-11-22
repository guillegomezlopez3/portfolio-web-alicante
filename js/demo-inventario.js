'use strict';
/* Demo de control de inventario: existencias, movimientos, reposición con pedidos a proveedor, etiquetas con código de barras y plano.
   Todo funciona en el navegador y se guarda en localStorage. No se envía nada a ningún sitio. */
(() => {
  const KEY = 'inv-v1';
  const E = Demo.esc, M = Demo.eur;
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const pad = n => String(n).padStart(2, '0');
  const CAT = { BEB: 'Bebidas', CAF: 'Café y desayuno', DES: 'Despensa', LIM: 'Limpieza', DSC: 'Desechables' };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const num = n => n.toLocaleString('es-ES');
  const when = t => { const d = new Date(t); return d.getDate() + ' ' + MES[d.getMonth()] + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const ago = h => new Date(Date.now() - h * 36e5).toISOString();

  /* [código, producto, formato, coste, pvp, stock, mínimo, proveedor] */
  const BASE = [
    ['BEB-001', 'Agua mineral 50 cl', 'caja de 24', 5.40, 8.90, 120, 40, 'Aguas del Sur'],
    ['BEB-002', 'Refresco de cola 33 cl', 'caja de 24', 11.20, 16.50, 64, 30, 'Bebidas Levante'],
    ['BEB-003', 'Cerveza lager 33 cl', 'caja de 24', 14.80, 21.90, 18, 40, 'Cervezas del Mediterráneo'],
    ['BEB-004', 'Vino tinto crianza', 'caja de 6', 29.50, 46.00, 26, 12, 'Bodegas Vega Baja'],
    ['BEB-005', 'Vino blanco verdejo', 'caja de 6', 22.00, 36.00, 9, 12, 'Bodegas Vega Baja'],
    ['BEB-006', 'Zumo de naranja 1 l', 'caja de 12', 13.50, 19.80, 0, 10, 'Bebidas Levante'],
    ['BEB-007', 'Tónica 20 cl', 'caja de 24', 12.90, 18.50, 41, 20, 'Bebidas Levante'],
    ['CAF-001', 'Café en grano natural 1 kg', 'paquete', 9.80, 14.90, 35, 15, 'Tostadores del Sur'],
    ['CAF-002', 'Café molido descafeinado 1 kg', 'paquete', 10.40, 15.90, 7, 10, 'Tostadores del Sur'],
    ['CAF-003', 'Cápsulas compatibles', 'caja de 100', 17.00, 25.00, 22, 8, 'Tostadores del Sur'],
    ['CAF-004', 'Azúcar en sobres', 'caja de 1000', 8.20, 12.50, 14, 6, 'Distribuciones Maestrat'],
    ['CAF-005', 'Leche entera 1 l', 'pack de 12', 9.90, 14.20, 52, 24, 'Lácteos de la Huerta'],
    ['DES-001', 'Aceite de oliva virgen extra 5 l', 'garrafa', 31.00, 44.00, 19, 10, 'Almazara Sierra Sur'],
    ['DES-002', 'Arroz bomba 1 kg', 'paquete', 2.90, 4.50, 80, 40, 'Arroces del Delta'],
    ['DES-003', 'Sal fina 1 kg', 'caja de 12', 4.10, 6.90, 25, 8, 'Distribuciones Maestrat'],
    ['DES-004', 'Tomate triturado 2,5 kg', 'caja de 6', 11.80, 17.60, 12, 12, 'Conservas del Segura'],
    ['LIM-001', 'Lavavajillas profesional 5 l', 'garrafa', 12.50, 19.00, 15, 6, 'Higiene Profesional'],
    ['LIM-002', 'Desengrasante 5 l', 'garrafa', 10.90, 16.50, 4, 6, 'Higiene Profesional'],
    ['LIM-003', 'Papel de cocina industrial', 'pack de 2', 11.30, 17.40, 30, 10, 'Higiene Profesional'],
    ['LIM-004', 'Bolsas de basura 100 l', 'rollo de 25', 3.60, 6.20, 60, 20, 'Envases y Más'],
    ['DSC-001', 'Servilletas de papel 30×30', 'caja de 3000', 22.00, 33.00, 11, 5, 'Envases y Más'],
    ['DSC-002', 'Vasos de cartón 8 oz', 'caja de 1000', 28.00, 42.00, 6, 6, 'Envases y Más'],
    ['DSC-003', 'Envases de aluminio 1,5 l', 'caja de 500', 24.00, 36.00, 17, 8, 'Envases y Más'],
    ['DSC-004', 'Film transparente 45 cm', 'rollo', 6.20, 9.80, 0, 8, 'Envases y Más']
  ];
  function seed() {
    const prods = BASE.map(([sku, nom, uni, coste, pvp, stock, min, prov], i) => ({ sku, nom, uni, cat: CAT[sku.slice(0, 3)], coste, pvp, stock, min, prov, loc: 'ABCD'[Math.floor(i / 6)] + '-' + pad(i % 6 + 1) }));
    const m = [[170, 'BEB-001', 'entrada', 48, 'Recepción albarán 2211'], [140, 'CAF-001', 'salida', 6, 'Pedido de Bar Levante'], [120, 'BEB-003', 'salida', 22, 'Pedido de Hotel Marina'], [96, 'DES-002', 'entrada', 40, 'Recepción albarán 2214'], [72, 'LIM-002', 'salida', 3, 'Pedido de Restaurante Plaza'], [50, 'BEB-006', 'salida', 10, 'Pedido de Hotel Marina'], [30, 'DSC-004', 'ajuste', -2, 'Recuento: faltaban 2'], [20, 'BEB-002', 'entrada', 24, 'Recepción albarán 2219'], [8, 'CAF-002', 'salida', 4, 'Pedido de Cafetería Sol']];
    return { prods, movs: m.map(([h, sku, tipo, d, nota], i) => ({ id: i + 1, t: ago(h), sku, tipo, d: tipo === 'salida' ? -d : d, nota })), pedidos: [], nm: m.length + 1, np: 1 };
  }
  let S = (() => { const s = Demo.store(KEY, null); return s && s.prods && s.movs && s.pedidos ? s : seed(); })();
  const save = () => Demo.save(KEY, S);
  const prod = sku => S.prods.find(p => p.sku === sku);
  const st = p => p.stock <= 0 ? 'agotado' : p.stock <= p.min ? 'bajo' : 'ok';
  const ETQ = { ok: 'Correcto', bajo: 'Bajo mínimo', agotado: 'Agotado', camino: 'Pedido en camino' };
  const chip = k => `<span class="chip ${k}">${ETQ[k]}</span>`;
  const enCamino = sku => S.pedidos.some(o => o.estado === 'pendiente' && o.lineas.some(l => l.sku === sku));
  const pct = p => Math.min(100, Math.round(p.stock / (p.min * 3) * 100));
  const open = d => { if (d.open) return; d.showModal(); const t = d.querySelector('.acts .btn.solid'); t && t.focus({ preventScroll: true }); };

  /* ---------- Código de barras (Code 39) ---------- */
  const C39 = { 0: 'nnnwwnwnn', 1: 'wnnwnnnnw', 2: 'nnwwnnnnw', 3: 'wnwwnnnnn', 4: 'nnnwwnnnw', 5: 'wnnwwnnnn', 6: 'nnwwwnnnn', 7: 'nnnwnnwnw', 8: 'wnnwnnwnn', 9: 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn', G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn', K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww', O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn', S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw', W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn', '-': 'nwnnnnwnw', '*': 'nwnnwnwnn' };
  function barcode(text) {
    let x = 0, r = ''; const n = 2, w = 5;
    for (const ch of '*' + text + '*') { const p = C39[ch]; if (!p) continue; for (let i = 0; i < 9; i++) { const wd = p[i] === 'w' ? w : n; if (i % 2 === 0) r += `<rect x="${x}" y="0" width="${wd}" height="60"/>`; x += wd; } x += n; }
    return `<svg viewBox="0 0 ${x} 60" preserveAspectRatio="none" role="img" aria-label="Código de barras de ${E(text)}">${r}</svg>`;
  }

  /* ---------- Pestañas ---------- */
  const tabs = [...document.querySelectorAll('#tabs [role=tab]')];
  function goTab(t, focus) {
    tabs.forEach(b => { const on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $(b.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => goTab(b));
    b.addEventListener('keydown', e => { const j = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (j) { e.preventDefault(); goTab(tabs[(i + j + tabs.length) % tabs.length], true); } });
  });

  /* ---------- Panel ---------- */
  const valor = p => p.stock * p.coste;
  function renderPanel() {
    const tot = S.prods.reduce((a, p) => a + valor(p), 0), bajo = S.prods.filter(p => st(p) === 'bajo').length, ag = S.prods.filter(p => st(p) === 'agotado').length;
    $('kpis').innerHTML = [['Valor del almacén', M(tot), 'al precio de coste', ''], ['Referencias', S.prods.length, num(S.prods.reduce((a, p) => a + p.stock, 0)) + ' unidades en total', ''], ['Bajo mínimo', bajo, 'hay que pedir pronto', bajo ? 'warn' : ''], ['Agotados', ag, 'ventas que se pierden', ag ? 'bad' : '']]
      .map(([t, v, s, c]) => `<div class="kpi ${c}"><span>${t}</span><b>${v}</b><small>${s}</small></div>`).join('');
    const falta = S.prods.filter(p => st(p) !== 'ok').sort((a, b) => (st(a) === 'agotado' ? 0 : 1) - (st(b) === 'agotado' ? 0 : 1) || a.stock / a.min - b.stock / b.min);
    $('p-rep').innerHTML = falta.length ? falta.slice(0, 6).map(p => `<li><button class="li-b" data-act="open" data-sku="${p.sku}"><span class="c">${p.sku}</span><span class="n"><b>${E(p.nom)}</b><small>quedan ${p.stock} · mínimo ${p.min}</small></span>${chip(enCamino(p.sku) ? 'camino' : st(p))}</button></li>`).join('') + `<li class="more"><button class="lnk" data-act="goto" data-tab="t-rep">Ir a reposición →</button></li>` : '<li class="more"><small>Todo por encima del mínimo.</small></li>';
    $('p-mov').innerHTML = S.movs.slice(-7).reverse().map(movLi).join('');
    const fam = {}; S.prods.forEach(p => fam[p.cat] = (fam[p.cat] || 0) + valor(p));
    const mx = Math.max(...Object.values(fam));
    $('p-fam').innerHTML = Object.entries(fam).sort((a, b) => b[1] - a[1]).map(([c, v]) => `<li><span>${c}</span><b>${M(v)}</b><i style="width:${v / mx * 100}%"></i></li>`).join('');
  }
  const movLi = m => { const p = prod(m.sku); return `<li class="mvli"><span class="d ${m.tipo}">${m.d > 0 ? '+' : ''}${m.d}</span><span class="n"><b>${E(p ? p.nom : m.sku)}</b><small>${when(m.t)}${m.nota ? ' · ' + E(m.nota) : ''}</small></span></li>`; };

  /* ---------- Existencias ---------- */
  let SORT = { k: 'sku', dir: 1 };
  function renderStock() {
    const q = norm($('s-q').value.trim()), c = $('s-c').value, e = $('s-e').value;
    const val = { sku: p => p.sku, nom: p => norm(p.nom), stock: p => p.stock, valor: p => valor(p) };
    const list = S.prods.filter(p => (!c || p.cat === c) && (!e || st(p) === e) && (!q || norm(p.sku + ' ' + p.nom).includes(q))).sort((a, b) => { const x = val[SORT.k](a), y = val[SORT.k](b); return (x > y ? 1 : x < y ? -1 : 0) * SORT.dir; });
    $('s-body').innerHTML = list.map(p => `<tr class="click" tabindex="0" data-act="open" data-sku="${p.sku}"><td class="code">${p.sku}</td><td><b>${E(p.nom)}</b><small>${p.uni} · ${p.cat}</small></td><td class="hide-s code">${p.loc}</td><td class="r"><span class="stk">${p.stock}</span><i class="mini ${st(p)}" style="--p:${pct(p)}%"></i></td><td class="r hide-s num">${p.min}</td><td>${chip(st(p))}</td><td class="r hide-s num">${M(valor(p))}</td></tr>`).join('');
    $('s-empty').hidden = !!list.length; $('s-tbl').parentNode.hidden = !list.length;
    document.querySelectorAll('.th').forEach(b => b.setAttribute('aria-sort', b.dataset.sort === SORT.k ? (SORT.dir > 0 ? 'ascending' : 'descending') : 'none'));
  }
  $('s-c').innerHTML += Object.values(CAT).map(c => `<option>${c}</option>`).join('');
  ['s-q', 's-c', 's-e'].forEach(i => $(i).addEventListener('input', renderStock));

  /* ---------- Etiqueta / ficha ---------- */
  function openEtiqueta(sku) {
    const p = prod(sku), ms = S.movs.filter(m => m.sku === sku).slice(-3).reverse(), k = st(p);
    $('et-in').innerHTML = `<article class="etq ${k}">
      <div class="etq-h"><span>Almacén Costa Blanca</span><span>Etiqueta de ubicación · demo</span></div>
      <div class="etq-b"><div class="loc"><small>Sitio</small><b>${p.loc}</b></div><div class="nom"><h2>${E(p.nom)}</h2><p>${p.uni} · ${p.cat}<br>Proveedor: ${E(p.prov)}</p></div></div>
      <div class="bc">${barcode(p.sku)}<span>${p.sku}</span></div>
      <dl class="etq-d"><div><dt>Stock</dt><dd>${p.stock}</dd></div><div><dt>Mínimo</dt><dd>${p.min}</dd></div><div><dt>Coste</dt><dd>${M(p.coste)}</dd></div><div><dt>Margen</dt><dd>${Math.round((p.pvp - p.coste) / p.pvp * 100)} %</dd></div></dl>
      <p class="etq-s">${chip(enCamino(p.sku) ? 'camino' : k)}</p>
    </article>
    ${ms.length ? `<ul class="list etq-m">${ms.map(movLi).join('')}</ul>` : ''}
    <div class="acts noprint"><button class="btn" type="button" data-act="mov-for" data-sku="${p.sku}">Registrar movimiento</button><button class="btn" type="button" data-act="locate" data-sku="${p.sku}">Ver en el plano</button><button class="btn" type="button" data-act="print">Imprimir etiqueta</button><button class="btn solid" type="button" data-close>Cerrar</button></div>`;
    open($('dl-et'));
  }

  /* ---------- Pistola lectora ---------- */
  function scan(raw) {
    const e = $('gun-e'), q = raw.trim(); e.hidden = true;
    if (!q) { e.textContent = 'Escribe un código o parte del nombre.'; e.hidden = false; return; }
    const up = q.toUpperCase(), exact = prod(up), nq = norm(q);
    const res = exact ? [exact] : S.prods.filter(p => p.sku.includes(up) || norm(p.nom).includes(nq));
    if (!res.length) { e.textContent = `No existe «${q}». Prueba con BEB-003 o con «aceite».`; e.hidden = false; return; }
    if (res.length > 1) { e.innerHTML = `${res.length} productos coinciden: ` + res.slice(0, 6).map(p => `<button type="button" data-scan="${p.sku}">${p.sku}</button>`).join(' '); e.hidden = false; return; }
    $('gun-in').value = ''; openEtiqueta(res[0].sku);
  }
  $('gun').addEventListener('submit', e => { e.preventDefault(); scan($('gun-in').value); });

  /* ---------- Movimientos ---------- */
  function fillProd() {
    const by = {}; S.prods.forEach(p => (by[p.cat] ||= []).push(p));
    const cur = $('mv-p').value;
    $('mv-p').innerHTML = '<option value="">Elige un producto…</option>' + Object.entries(by).map(([c, ps]) => `<optgroup label="${c}">${ps.map(p => `<option value="${p.sku}">${p.sku} · ${E(p.nom)}</option>`).join('')}</optgroup>`).join('');
    $('mv-p').value = cur;
  }
  const tipo = () => document.querySelector('#mv [name=tipo]:checked').value;
  function mvHint() {
    const p = prod($('mv-p').value), t = tipo();
    $('mv-ql').textContent = t === 'ajuste' ? 'Stock contado' : 'Unidades';
    $('mv-h').textContent = p ? `Ahora hay ${p.stock} (${p.uni}). Mínimo: ${p.min}. Sitio: ${p.loc}.` : 'Elige un producto para ver cuánto hay ahora.';
  }
  function renderMov() {
    $('mv-body').innerHTML = S.movs.slice(-30).reverse().map(m => { const p = prod(m.sku); return `<tr><td class="num">${when(m.t)}</td><td><b>${E(p ? p.nom : m.sku)}</b><small>${m.sku}</small></td><td><span class="chip ${m.tipo}">${m.tipo === 'entrada' ? 'Entrada' : m.tipo === 'salida' ? 'Salida' : 'Recuento'}</span></td><td class="r num ${m.d < 0 ? 'neg' : 'pos'}">${m.d > 0 ? '+' : ''}${m.d}</td><td class="hide-s">${E(m.nota || '')}</td></tr>`; }).join('');
  }
  $('mv').addEventListener('input', mvHint);
  $('mv').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('mv-e'), p = prod($('mv-p').value), t = tipo(), q = parseInt($('mv-q').value, 10), bad = m => { err.textContent = m; err.hidden = false; };
    if (!p) return bad('Elige un producto.');
    if (isNaN(q) || q < 0 || (t !== 'ajuste' && q === 0)) return bad('Escribe una cantidad válida.');
    let d = q;
    if (t === 'salida') { if (q > p.stock) return bad(`Solo quedan ${p.stock} de «${p.nom}». No se puede sacar más de lo que hay.`); d = -q; }
    if (t === 'ajuste') { if (q === p.stock) return bad(`El stock ya es ${p.stock}: no hay nada que ajustar.`); d = q - p.stock; }
    const antes = st(p); p.stock += d;
    S.movs.push({ id: S.nm++, t: new Date().toISOString(), sku: p.sku, tipo: t, d, nota: $('mv-n').value.trim() });
    save(); err.hidden = true; $('mv-q').value = ''; $('mv-n').value = '';
    const ahora = st(p); renderAll(); mvHint();
    Demo.toast(ahora !== 'ok' && antes === 'ok' ? `Registrado. ¡Aviso! «${p.nom}» ha caído bajo el mínimo y pasa a reposición.` : `Registrado. Ahora hay ${p.stock} de «${p.nom}».`);
  });
  $('undo').addEventListener('click', () => {
    const m = S.movs[S.movs.length - 1]; if (!m) return Demo.toast('No hay nada que deshacer');
    const p = prod(m.sku); if (p.stock - m.d < 0) return Demo.toast('No se puede deshacer: dejaría el stock en negativo');
    p.stock -= m.d; S.movs.pop(); save(); renderAll(); mvHint(); Demo.toast('Movimiento deshecho y stock recuperado');
  });
  function movFor(sku) { $('dl-et').open && $('dl-et').close(); goTab($('t-mov')); $('mv-p').value = sku; mvHint(); $('mv-q').focus(); }

  /* ---------- Reposición ---------- */
  const QTY = {}, INC = {};
  let GRUPOS = [];
  const sug = p => QTY[p.sku] ?? (QTY[p.sku] = Math.max(1, Math.ceil(p.min * 2.5 - p.stock)));
  const incl = sku => INC[sku] !== false;
  function renderRep() {
    const need = S.prods.filter(p => st(p) !== 'ok' && !enCamino(p.sku)), by = {};
    need.forEach(p => (by[p.prov] ||= []).push(p));
    GRUPOS = Object.entries(by);
    $('rep-g').innerHTML = GRUPOS.length ? GRUPOS.map(([prov, ps], gi) => `<section class="grp"><header><h3>${E(prov)}</h3><span class="tot" id="gt-${gi}"></span></header>
      <table class="tbl"><tbody>${ps.map(p => `<tr><td class="ck"><input type="checkbox" data-inc="${p.sku}" ${incl(p.sku) ? 'checked' : ''} aria-label="Incluir ${E(p.nom)}"></td><td><b>${E(p.nom)}</b><small>${p.sku} · quedan ${p.stock}, mínimo ${p.min} ${chip(st(p))}</small></td><td class="r"><input class="qty" type="number" min="1" step="1" data-q="${p.sku}" value="${sug(p)}" aria-label="Unidades a pedir de ${E(p.nom)}"></td><td class="r num" id="ln-${p.sku}">${M(sug(p) * p.coste)}</td></tr>`).join('')}</tbody></table>
      <div class="acts"><button class="btn solid" type="button" data-act="mkped" data-g="${gi}">Crear pedido a ${E(prov)}</button></div></section>`).join('') : '<p class="empty ok-e">Nada que pedir ahora mismo: todo está por encima del mínimo o ya tiene pedido en camino.</p>';
    GRUPOS.forEach((_, gi) => grpTot(gi));
    const n = need.length; $('rep-n').hidden = !n; $('rep-n').textContent = n;
    const ps = S.pedidos.slice(-6).reverse();
    $('ped').innerHTML = ps.length ? ps.map(o => `<li class="pedli"><span class="c">${o.num}</span><span class="n"><b>${E(o.prov)}</b><small>${o.lineas.length} ${o.lineas.length === 1 ? 'producto' : 'productos'} · ${M(totPed(o))} · ${o.estado === 'pendiente' ? 'pedido ' + when(o.t) : 'recibido ' + when(o.rec)}</small></span><span class="chip ${o.estado === 'pendiente' ? 'camino' : 'ok'}">${o.estado === 'pendiente' ? 'En camino' : 'Recibido'}</span><button class="btn sm" type="button" data-act="ped-open" data-id="${o.id}">Ver</button></li>`).join('') : '<li class="more"><small>Todavía no has hecho ningún pedido. Crea el primero arriba.</small></li>';
  }
  const totPed = o => o.lineas.reduce((a, l) => a + l.qty * l.coste, 0);
  function grpTot(gi) { const t = GRUPOS[gi][1].filter(p => incl(p.sku)).reduce((a, p) => a + sug(p) * p.coste, 0); const el = $('gt-' + gi); if (el) el.textContent = 'Total estimado ' + M(t); }
  $('rep-g').addEventListener('input', e => {
    const q = e.target.dataset.q; if (!q) return;
    QTY[q] = Math.max(1, parseInt(e.target.value, 10) || 1); const p = prod(q); $('ln-' + q).textContent = M(QTY[q] * p.coste);
    GRUPOS.forEach((g, gi) => g[1].some(x => x.sku === q) && grpTot(gi));
  });
  $('rep-g').addEventListener('change', e => {
    const s = e.target.dataset.inc; if (!s) return; INC[s] = e.target.checked;
    GRUPOS.forEach((g, gi) => g[1].some(x => x.sku === s) && grpTot(gi));
  });
  function mkPed(gi) {
    const [prov, ps] = GRUPOS[gi], sel = ps.filter(p => incl(p.sku));
    if (!sel.length) return Demo.toast('Marca al menos un producto para el pedido');
    const o = { id: S.np, num: `PED-${new Date().getFullYear()}-${String(S.np).padStart(4, '0')}`, prov, t: new Date().toISOString(), estado: 'pendiente', lineas: sel.map(p => ({ sku: p.sku, qty: sug(p), coste: p.coste })) };
    S.np++; S.pedidos.push(o); save(); renderAll(); openPed(o.id); Demo.toast('Pedido creado. Esos productos pasan a «en camino» y no se vuelven a pedir.');
  }
  function openPed(id) {
    const o = S.pedidos.find(x => x.id === +id);
    $('ped-in').innerHTML = `<article class="pedido"><header><b>Pedido de compra</b><span class="num">${o.num}</span></header>
      <p class="pv"><small>Proveedor</small><b>${E(o.prov)}</b><span>${when(o.t)} · Almacén Costa Blanca (ficticio)</span></p>
      <table class="tbl"><thead><tr><th>Producto</th><th class="r">Unid.</th><th class="r">Coste</th><th class="r">Importe</th></tr></thead><tbody>${o.lineas.map(l => { const p = prod(l.sku); return `<tr><td><b>${E(p.nom)}</b><small>${l.sku} · ${p.uni}</small></td><td class="r num">${l.qty}</td><td class="r num">${M(l.coste)}</td><td class="r num">${M(l.qty * l.coste)}</td></tr>`; }).join('')}</tbody></table>
      <p class="pt"><span>Total (sin IVA)</span><b>${M(totPed(o))}</b></p>
      ${o.estado === 'recibido' ? `<p class="recv">Recibido ${when(o.rec)}</p>` : ''}</article>
      <div class="acts noprint">${o.estado === 'pendiente' ? `<button class="btn solid" type="button" data-act="recibir" data-id="${o.id}">Ha llegado: marcar recibido</button>` : ''}<button class="btn" type="button" data-act="copiar" data-id="${o.id}">Copiar pedido</button><button class="btn" type="button" data-act="print">Imprimir</button><button class="btn" type="button" data-close>Cerrar</button></div>`;
    open($('dl-ped'));
  }
  function recibir(id) {
    const o = S.pedidos.find(x => x.id === +id); if (o.estado !== 'pendiente') return;
    o.lineas.forEach(l => { const p = prod(l.sku); p.stock += l.qty; S.movs.push({ id: S.nm++, t: new Date().toISOString(), sku: l.sku, tipo: 'entrada', d: l.qty, nota: 'Recepción ' + o.num }); });
    o.estado = 'recibido'; o.rec = new Date().toISOString(); save(); renderAll(); openPed(o.id); Demo.toast('Mercancía recibida: el stock se ha actualizado solo');
  }
  function copiar(id) {
    const o = S.pedidos.find(x => x.id === +id), txt = `Pedido ${o.num} a ${o.prov}\n` + o.lineas.map(l => `- ${l.qty} × ${prod(l.sku).nom} (${l.sku})`).join('\n');
    try { navigator.clipboard.writeText(txt).then(() => Demo.toast('Pedido copiado: pégalo en un email o WhatsApp'), () => Demo.toast('No se pudo copiar desde aquí')); } catch (e) { Demo.toast('No se pudo copiar desde aquí'); }
  }

  /* ---------- Plano ---------- */
  let HL = null, SEL = null;
  function renderPlano() {
    let h = '<div class="dock" aria-hidden="true">Muelle de carga</div>';
    ['A', 'B', 'C', 'D'].forEach((a, r) => {
      h += `<div class="aisle" aria-hidden="true"><b>${a}</b><small>pasillo</small></div>`;
      S.prods.slice(r * 6, r * 6 + 6).forEach(p => { h += `<button type="button" class="bay ${st(p)}${HL === p.sku ? ' hl' : ''}${SEL === p.sku ? ' sel' : ''}" data-act="bay" data-sku="${p.sku}" style="--p:${pct(p)}%" aria-label="${p.loc}: ${E(p.nom)}, ${p.stock} unidades"><small>${p.loc}</small><b>${p.sku.slice(4)}<em>${p.sku.slice(0, 3)}</em></b><span>${p.stock}</span><i></i></button>`; });
    });
    $('plano').innerHTML = h;
    const p = SEL && prod(SEL);
    $('side').innerHTML = p ? `<small class="mono">${p.loc}</small><h3>${E(p.nom)}</h3><p>${p.sku} · ${p.uni}</p><p class="big">${p.stock}<small> / mín. ${p.min}</small></p>${chip(enCamino(p.sku) ? 'camino' : st(p))}<div class="acts"><button class="btn" type="button" data-act="mov-for" data-sku="${p.sku}">Movimiento</button><button class="btn" type="button" data-act="open" data-sku="${p.sku}">Etiqueta</button></div>` : '<p class="empty">Elige un hueco del plano.</p>';
  }

  /* ---------- Acciones ---------- */
  function renderAll() { renderPanel(); renderStock(); renderMov(); renderRep(); renderPlano(); fillProd(); }
  document.addEventListener('click', e => {
    if (e.target.matches('dialog')) { e.target.close(); return; }
    if (e.target.closest('[data-close]')) { e.target.closest('dialog').close(); return; }
    const sc = e.target.closest('[data-scan]'); if (sc) { scan(sc.dataset.scan); return; }
    const th = e.target.closest('[data-sort]'); if (th) { SORT = { k: th.dataset.sort, dir: SORT.k === th.dataset.sort ? -SORT.dir : 1 }; renderStock(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, sku = b.dataset.sku;
    if (a === 'open') openEtiqueta(sku);
    else if (a === 'goto') goTab($(b.dataset.tab));
    else if (a === 'mov-for') movFor(sku);
    else if (a === 'locate') { $('dl-et').close(); HL = sku; SEL = sku; renderPlano(); goTab($('t-mapa')); const el = document.querySelector('.bay.hl'); el && el.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => { HL = null; renderPlano(); }, 4200); }
    else if (a === 'bay') { SEL = sku; renderPlano(); document.querySelector('.bay.sel')?.focus(); }
    else if (a === 'print') window.print();
    else if (a === 'mkped') mkPed(+b.dataset.g);
    else if (a === 'ped-open') openPed(b.dataset.id);
    else if (a === 'recibir') recibir(b.dataset.id);
    else if (a === 'copiar') copiar(b.dataset.id);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('tr.click')) e.target.click(); });
  $('reset').addEventListener('click', () => { S = seed(); save(); Object.keys(QTY).forEach(k => delete QTY[k]); Object.keys(INC).forEach(k => delete INC[k]); HL = SEL = null; renderAll(); mvHint(); Demo.toast('Datos de ejemplo restablecidos'); });

  renderAll(); mvHint();
})();
