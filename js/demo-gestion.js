'use strict';
/* Demo de programa de gestión: clientes, presupuestos, facturas, agenda e informes.
   Todo funciona en el navegador y se guarda en localStorage. No se envía nada a ningún sitio. */
(() => {
  const KEY = 'gest-v1';
  const E = Demo.esc, M = Demo.eur;
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = n => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d); };
  const TODAY = addDays(0);
  const dt = s => new Date(s + 'T12:00:00');
  const fdate = s => { const d = dt(s); return d.getDate() + ' ' + MES[d.getMonth()] + (d.getFullYear() !== dt(TODAY).getFullYear() ? ' ' + d.getFullYear() : ''); };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fdateLong = s => dt(s).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const since = s => Math.round((dt(TODAY) - dt(s)) / 864e5);
  const r2 = n => Math.round(n * 100) / 100;
  const L = (d, q, p) => ({ d, q, p });

  const CONCEPTOS = [['Mano de obra (hora)', 1, 32], ['Pintura (m²)', 1, 9.5], ['Alicatado (m²)', 1, 42], ['Suelo laminado (m²)', 1, 31], ['Salida de fontanería', 1, 85], ['Punto de luz', 1, 48], ['Desplazamiento', 1, 25]];

  function seed() {
    const clientes = [
      { id: 1, nom: 'Comunidad Edificio Marina', tip: 'Comunidad', ciu: 'Alicante', tel: '600 000 101', ema: 'administrador@ejemplo.test', nota: 'Paga a 30 días. Habla con la administradora, no con el presidente.' },
      { id: 2, nom: 'Marta Quiles Soler', tip: 'Particular', ciu: 'San Vicente del Raspeig', tel: '600 000 102', ema: '', nota: 'Prefiere WhatsApp. Perro en casa.' },
      { id: 3, nom: 'Bar La Plaza (Hnos. Ortuño)', tip: 'Empresa', ciu: 'Elche', tel: '600 000 103', ema: '', nota: 'Trabajos siempre en lunes, que cierran.' },
      { id: 4, nom: 'Josep Ferrer Llorca', tip: 'Particular', ciu: 'Playa de San Juan', tel: '600 000 104', ema: '', nota: '' },
      { id: 5, nom: 'Clínica Dental Sonrisa S.L.', tip: 'Empresa', ciu: 'Alicante', tel: '600 000 105', ema: 'gerencia@ejemplo.test', nota: 'Obras fuera de horario de consulta.' },
      { id: 6, nom: 'Lucía Pastor Mora', tip: 'Particular', ciu: 'Alicante', tel: '600 000 106', ema: '', nota: '' },
      { id: 7, nom: 'Antonio Beltrán Ruiz', tip: 'Particular', ciu: 'Benidorm', tel: '600 000 107', ema: '', nota: 'Segunda vivienda: la llave la tiene el vecino.' },
      { id: 8, nom: 'Inmobiliaria Postiguet S.L.', tip: 'Empresa', ciu: 'Alicante', tel: '600 000 108', ema: 'oficina@ejemplo.test', nota: 'Encargan arreglos rápidos en pisos de alquiler.' }
    ];
    const raw = [
      [-150, 1, 'F', 'cobrada', 21, [L('Impermeabilización de azotea (80 m²)', 80, 38), L('Material y andamio', 1, 640)]],
      [-128, 5, 'F', 'cobrada', 10, [L('Reforma completa de baño', 1, 3150), L('Cambio de plato de ducha', 1, 380)]],
      [-101, 3, 'F', 'cobrada', 21, [L('Alicatado de cocina de bar (m²)', 45, 42), L('Fontanería y desagües', 1, 520)]],
      [-75, 2, 'F', 'cobrada', 10, [L('Pintura de piso (3 habitaciones)', 1, 980), L('Reparación de humedad en pared', 1, 260)]],
      [-66, 7, 'F', 'cobrada', 10, [L('Suelo laminado (m²)', 60, 31), L('Rodapié (metros)', 48, 6.5)]],
      [-49, 6, 'F', 'cobrada', 21, [L('Mano de obra (hora)', 14, 32), L('Material eléctrico', 1, 210)]],
      [-33, 8, 'F', 'cobrada', 21, [L('Pintura de local comercial', 1, 1850)]],
      [-20, 4, 'F', 'cobrada', 21, [L('Reparación de bajante comunitaria', 1, 1240), L('Mano de obra (hora)', 8, 32)]],
      [-9, 1, 'F', 'cobrada', 21, [L('Pintura de portal y escalera', 1, 2400)]],
      [-14, 5, 'F', 'pendiente', 10, [L('Sustitución de grifería y sanitarios', 1, 890), L('Mano de obra (hora)', 6, 32)]],
      [-41, 3, 'F', 'pendiente', 21, [L('Instalación de campana y extractor', 1, 740)]],
      [-4, 8, 'F', 'pendiente', 21, [L('Reparación de cerradura y persiana', 1, 320)]],
      [-18, 7, 'P', 'aceptado', 10, [L('Reforma de cocina (muebles, encimera, alicatado)', 1, 5800)]],
      [-6, 2, 'P', 'enviado', 10, [L('Cambio de ventanas PVC (unidades)', 3, 640)]],
      [-2, 6, 'P', 'enviado', 21, [L('Pintura de piso (4 habitaciones)', 1, 1250)]]
    ].sort((a, b) => a[0] - b[0]);
    const n = { F: 0, P: 0 };
    const docs = raw.map(([o, cli, tipo, estado, iva, lineas], i) => {
      const fecha = addDays(o); n[tipo]++;
      const d = { id: i + 1, tipo, num: `${tipo}-${fecha.slice(0, 4)}-${pad(n[tipo]).padStart(4, '0')}`, cli, fecha, iva, lineas, estado };
      if (estado === 'cobrada') d.cobro = addDays(Math.min(o + 12, 0));
      return d;
    });
    const trabajos = [[0, '09:00', 7, 'Cocina: demolición de alicatado', 'Paco'], [0, '16:00', 8, 'Revisión de persiana', 'Iván'], [1, '09:00', 5, 'Visita de medición (baño de la planta 2)', 'Nuria'], [2, '08:30', 1, 'Pintura de portal: segunda mano', 'Paco'], [3, '10:00', 2, 'Visita para presupuesto de ventanas', 'Nuria'], [4, '09:00', 7, 'Cocina: instalación de muebles', 'Paco'], [6, '11:00', 3, 'Revisión de campana (garantía)', 'Iván']]
      .map(([o, h, cli, d, q], i) => ({ id: i + 1, fecha: addDays(o), hora: h, cli, desc: d, quien: q, hecho: false }));
    return { clientes, docs, trabajos, n, nc: 9, nd: docs.length + 1, nt: trabajos.length + 1 };
  }

  let S = (() => { const s = Demo.store(KEY, null); return s && s.docs && s.clientes && s.trabajos ? s : seed(); })();
  const save = () => Demo.save(KEY, S);
  const cli = id => S.clientes.find(c => c.id === +id);
  const calc = d => { const base = r2(d.lineas.reduce((a, l) => a + l.q * l.p, 0)); const iva = r2(base * d.iva / 100); return { base, iva, total: r2(base + iva) }; };
  const estado = d => d.tipo === 'F' ? (d.estado === 'cobrada' ? 'cobrada' : since(d.fecha) > 30 ? 'vencida' : 'pendiente') : d.estado;
  const ETQ = { cobrada: 'Cobrada', pendiente: 'Pendiente', vencida: 'Vencida', enviado: 'Enviado', aceptado: 'Aceptado', rechazado: 'Rechazado', facturado: 'Facturado' };
  const chip = d => { const e = estado(d); return `<span class="chip ${e}">${ETQ[e]}</span>`; };
  const k = n => (n / 1000).toFixed(1).replace('.', ',') + 'k';
  const facts = () => S.docs.filter(d => d.tipo === 'F');
  const open = d => { if (d.open) return; d.showModal(); const t = d.querySelector('input,select,textarea') || d.querySelector('.acts .btn.solid'); t && t.focus({ preventScroll: true }); };

  /* ---------- Pestañas ---------- */
  const tabs = [...document.querySelectorAll('#tabs [role=tab]')];
  function goTab(t, focus) {
    tabs.forEach(b => { const on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $(b.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => goTab(b));
    b.addEventListener('keydown', e => {
      const j = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (j) { e.preventDefault(); goTab(tabs[(i + j + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- Resumen ---------- */
  function renderResumen() {
    const mes = TODAY.slice(0, 7);
    const fMes = facts().filter(d => d.fecha.startsWith(mes)).reduce((a, d) => a + calc(d).total, 0);
    const pend = facts().filter(d => d.estado !== 'cobrada');
    const pendT = pend.reduce((a, d) => a + calc(d).total, 0);
    const venc = pend.filter(d => estado(d) === 'vencida').reduce((a, d) => a + calc(d).total, 0);
    const abiertos = S.docs.filter(d => d.tipo === 'P' && (d.estado === 'enviado' || d.estado === 'aceptado'));
    const abT = abiertos.reduce((a, d) => a + calc(d).total, 0);
    const sem = S.trabajos.filter(t => !t.hecho && t.fecha >= TODAY && t.fecha <= addDays(6)).length;
    $('kpis').innerHTML = [
      ['Facturado este mes', M(fMes), facts().filter(d => d.fecha.startsWith(mes)).length + ' facturas emitidas'],
      ['Pendiente de cobro', M(pendT), venc ? `${M(venc)} ya vencido` : 'Nada vencido', venc ? 'warn' : ''],
      ['Presupuestos abiertos', abiertos.length, M(abT) + ' en juego'],
      ['Trabajos esta semana', sem, 'sin terminar']
    ].map(([t, v, s, c]) => `<div class="kpi ${c || ''}"><span>${t}</span><b>${v}</b><small>${s}</small></div>`).join('');

    // gráfico: 6 meses
    const now = dt(TODAY), meses = [];
    for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); meses.push({ key: d.getFullYear() + '-' + pad(d.getMonth() + 1), name: MES[d.getMonth()], cob: 0, pen: 0 }); }
    facts().forEach(d => { const m = meses.find(x => d.fecha.startsWith(x.key)); if (m) m[d.estado === 'cobrada' ? 'cob' : 'pen'] += calc(d).total; });
    const mx = Math.max(1, ...meses.map(m => m.cob + m.pen));
    $('chart').innerHTML = meses.map(m => `<div class="col" title="${m.name}: ${M(m.cob)} cobrado, ${M(m.pen)} pendiente"><span class="v">${m.cob + m.pen ? k(m.cob + m.pen) : '—'}</span><div class="st"><i class="p" style="height:${m.pen / mx * 100}%"></i><i class="c" style="height:${m.cob / mx * 100}%"></i></div><span class="m">${m.name}</span></div>`).join('');

    $('pres').innerHTML = abiertos.length ? abiertos.map(d => `<li class="row"><div><b>${E(cli(d.cli).nom)}</b><small>${d.num} · ${fdate(d.fecha)}</small></div>${chip(d)}<span class="amt">${M(calc(d).total)}</span><button class="btn sm" type="button" data-act="doc-open" data-id="${d.id}">Ver</button></li>`).join('') : '<li class="row"><div><small>No hay presupuestos abiertos.</small></div></li>';
    $('pend').innerHTML = pend.length ? pend.sort((a, b) => a.fecha.localeCompare(b.fecha)).map(d => {
      const e = estado(d), dias = since(d.fecha) - 30;
      return `<li class="row ${e}"><div><b>${E(cli(d.cli).nom)}</b><small>${d.num} · ${e === 'vencida' ? `vencida hace ${dias} d` : `vence en ${-dias} d`}</small></div><span class="amt">${M(calc(d).total)}</span><button class="btn sm" type="button" data-act="cobrar" data-id="${d.id}">Cobrar</button></li>`;
    }).join('') : '<li class="row"><div><b>Todo cobrado</b><small>No hay facturas pendientes. Buen trabajo.</small></div></li>';

    const prox = S.trabajos.filter(t => !t.hecho && t.fecha >= TODAY).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)).slice(0, 4);
    $('prox').innerHTML = prox.length ? prox.map(t => `<li class="row"><div><b>${E(t.desc)}</b><small>${t.fecha === TODAY ? 'Hoy' : fdate(t.fecha)} · ${t.hora} · ${E(cli(t.cli).nom)}</small></div><span class="who">${E(t.quien)}</span></li>`).join('') : '<li class="row"><div><b>Agenda libre</b><small>No hay trabajos apuntados.</small></div></li>';
  }

  /* ---------- Clientes ---------- */
  const totales = id => { const f = facts().filter(d => d.cli === id); return { fac: f.reduce((a, d) => a + calc(d).total, 0), pen: f.filter(d => d.estado !== 'cobrada').reduce((a, d) => a + calc(d).total, 0) }; };
  function renderClientes() {
    const q = $('cl-q').value.trim().toLowerCase(), t = $('cl-t').value;
    const list = S.clientes.filter(c => (!t || c.tip === t) && (!q || (c.nom + ' ' + c.ciu + ' ' + c.tel).toLowerCase().includes(q))).sort((a, b) => a.nom.localeCompare(b.nom, 'es'));
    $('cl-body').innerHTML = list.map(c => { const x = totales(c.id); return `<tr class="click" tabindex="0" data-act="cli-open" data-id="${c.id}"><td><b>${E(c.nom)}</b></td><td class="hide-s">${c.tip}</td><td class="hide-s">${E(c.ciu)}</td><td class="r num">${M(x.fac)}</td><td class="r num ${x.pen ? 'red' : ''}">${x.pen ? M(x.pen) : '—'}</td></tr>`; }).join('');
    $('cl-empty').hidden = !!list.length; $('cl-tbl').hidden = !list.length;
  }
  function openCliente(id) {
    const c = cli(id), x = totales(c.id), ds = S.docs.filter(d => d.cli === c.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
    $('cli-in').innerHTML = `<h2 id="dl-cli-t">${E(c.nom)}</h2>
      <p class="meta">${c.tip} · ${E(c.ciu)}${c.tel ? ' · ' + E(c.tel) : ''}${c.ema ? ' · ' + E(c.ema) : ''}</p>
      <dl class="cuentas"><div><dt>Facturado en total</dt><dd>${M(x.fac)}</dd></div><div><dt>Pendiente de cobro</dt><dd class="${x.pen ? 'red' : ''}">${M(x.pen)}</dd></div><div><dt>Documentos</dt><dd>${ds.length}</dd></div></dl>
      <div class="f"><label for="c-nota">Notas del cliente</label><textarea id="c-nota" rows="2" maxlength="200" data-id="${c.id}" placeholder="Cosas que conviene recordar…">${E(c.nota || '')}</textarea></div>
      <h3>Historial</h3>
      <ul class="ledger">${ds.length ? ds.map(d => `<li class="row"><div><b>${d.num}</b><small>${fdate(d.fecha)}</small></div>${chip(d)}<span class="amt">${M(calc(d).total)}</span><button class="btn sm" type="button" data-act="doc-open" data-id="${d.id}">Ver</button></li>`).join('') : '<li class="row"><div><small>Todavía no hay documentos.</small></div></li>'}</ul>
      <div class="acts"><button class="btn" type="button" data-act="doc-new" data-tipo="P" data-cli="${c.id}">+ Presupuesto</button>${ds.length ? '' : `<button class="btn" type="button" data-act="cli-del" data-id="${c.id}">Eliminar cliente</button>`}<button class="btn solid" type="button" data-close>Cerrar</button></div>`;
    open($('dl-cli'));
  }
  $('cli-in').addEventListener('input', e => { if (e.target.id === 'c-nota') { const c = cli(e.target.dataset.id); c.nota = e.target.value; save(); } });

  function fillCliSelects() {
    const opts = S.clientes.slice().sort((a, b) => a.nom.localeCompare(b.nom, 'es')).map(c => `<option value="${c.id}">${E(c.nom)}</option>`).join('');
    $('e-cli').innerHTML = '<option value="">Elige un cliente…</option>' + opts;
    $('ag-c').innerHTML = '<option value="">Elige un cliente…</option>' + opts;
  }
  $('f-new').addEventListener('submit', e => {
    e.preventDefault();
    const nom = $('n-nom').value.trim(), err = $('n-err');
    if (!nom) { err.textContent = 'Escribe el nombre del cliente.'; err.hidden = false; $('n-nom').focus(); return; }
    if (S.clientes.some(c => c.nom.toLowerCase() === nom.toLowerCase())) { err.textContent = 'Ya existe un cliente con ese nombre.'; err.hidden = false; return; }
    S.clientes.push({ id: S.nc++, nom, tip: $('n-tip').value, ciu: $('n-ciu').value.trim(), tel: $('n-tel').value.trim(), ema: $('n-ema').value.trim(), nota: '' });
    save(); err.hidden = true; e.target.reset(); $('dl-new').close(); fillCliSelects(); renderAll(); Demo.toast('Cliente guardado');
  });

  /* ---------- Facturas y presupuestos ---------- */
  function renderDocs() {
    const q = $('d-q').value.trim().toLowerCase(), f = $('d-f').value;
    const list = S.docs.filter(d => (!f || (f === 'cobrar' ? d.tipo === 'F' && d.estado !== 'cobrada' : d.tipo === f)) && (!q || (d.num + ' ' + cli(d.cli).nom).toLowerCase().includes(q))).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
    $('d-body').innerHTML = list.map(d => `<tr class="click" tabindex="0" data-act="doc-open" data-id="${d.id}"><td><b>${d.num}</b></td><td class="hide-s">${fdate(d.fecha)}</td><td>${E(cli(d.cli).nom)}</td><td>${chip(d)}</td><td class="r num">${M(calc(d).total)}</td></tr>`).join('');
    $('d-empty').hidden = !!list.length; $('d-tbl').hidden = !list.length;
  }

  let ED = null;
  function editorLines() {
    $('e-lines').innerHTML = ED.lineas.map((l, i) => `<tr><td><input aria-label="Concepto" data-i="${i}" data-f="d" value="${E(l.d)}" maxlength="80" placeholder="Concepto"></td><td class="r"><input aria-label="Cantidad" data-i="${i}" data-f="q" type="number" min="0" step="any" value="${l.q}"></td><td class="r"><input aria-label="Precio" data-i="${i}" data-f="p" type="number" min="0" step="any" value="${l.p}"></td><td class="r num" id="imp-${i}">${M(r2(l.q * l.p))}</td><td><button class="rm" type="button" data-act="line-rm" data-i="${i}" aria-label="Quitar línea">×</button></td></tr>`).join('');
    editorSum();
  }
  function editorSum() {
    const c = calc({ lineas: ED.lineas, iva: ED.iva });
    $('e-sum').innerHTML = `<div><dt>Base</dt><dd>${M(c.base)}</dd></div><div><dt>IVA ${ED.iva} %</dt><dd>${M(c.iva)}</dd></div><div class="tot"><dt>Total</dt><dd>${M(c.total)}</dd></div>`;
  }
  function newDoc(tipo, cliId) {
    ED = { id: null, tipo, cli: cliId || '', fecha: TODAY, iva: 10, lineas: [{ d: '', q: 1, p: 0 }] };
    openEditor();
  }
  function openEditor() {
    $('ed-t').textContent = ED.tipo === 'F' ? (ED.id ? 'Editar factura' : 'Nueva factura') : (ED.id ? 'Editar presupuesto' : 'Nuevo presupuesto');
    $('e-cli').value = ED.cli; $('e-fec').value = ED.fecha; $('e-iva').value = String(ED.iva); $('e-err').hidden = true;
    $('chips').innerHTML = CONCEPTOS.map((c, i) => `<button type="button" class="chip-b" data-act="chip" data-i="${i}">${c[0]} <b>${M(c[2])}</b></button>`).join('');
    editorLines(); $('dl-vw').open && $('dl-vw').close(); $('dl-cli').open && $('dl-cli').close(); open($('dl-ed'));
  }
  $('e-lines').addEventListener('input', e => {
    const i = +e.target.dataset.i, f = e.target.dataset.f; if (f == null) return;
    ED.lineas[i][f] = f === 'd' ? e.target.value : Math.max(0, parseFloat(e.target.value) || 0);
    const imp = $('imp-' + i); if (imp) imp.textContent = M(r2(ED.lineas[i].q * ED.lineas[i].p));
    editorSum();
  });
  $('e-iva').addEventListener('change', e => { ED.iva = +e.target.value; editorSum(); });
  $('e-add').addEventListener('click', () => { ED.lineas.push({ d: '', q: 1, p: 0 }); editorLines(); const ins = $('e-lines').querySelectorAll('input[data-f=d]'); ins[ins.length - 1].focus(); });
  $('f-ed').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('e-err'); ED.cli = $('e-cli').value; ED.fecha = $('e-fec').value;
    const ls = ED.lineas.filter(l => l.d.trim() || l.p > 0);
    if (!ED.cli) { err.textContent = 'Elige para qué cliente es.'; err.hidden = false; $('e-cli').focus(); return; }
    if (!ED.fecha) { err.textContent = 'Pon una fecha.'; err.hidden = false; return; }
    if (!ls.length || ls.some(l => !l.d.trim() || !(l.q > 0) || !(l.p > 0))) { err.textContent = 'Cada línea necesita concepto, cantidad y precio mayores que cero.'; err.hidden = false; return; }
    if (ED.id) {
      const d = S.docs.find(x => x.id === ED.id); Object.assign(d, { cli: +ED.cli, fecha: ED.fecha, iva: ED.iva, lineas: ls });
    } else {
      S.n[ED.tipo]++;
      S.docs.push({ id: S.nd++, tipo: ED.tipo, num: `${ED.tipo}-${ED.fecha.slice(0, 4)}-${String(S.n[ED.tipo]).padStart(4, '0')}`, cli: +ED.cli, fecha: ED.fecha, iva: ED.iva, lineas: ls, estado: ED.tipo === 'F' ? 'pendiente' : 'enviado' });
    }
    save(); $('dl-ed').close(); renderAll(); Demo.toast(ED.id ? 'Documento actualizado' : (ED.tipo === 'F' ? 'Factura creada: ya cuenta como pendiente de cobro' : 'Presupuesto creado y marcado como enviado'));
  });

  function openDoc(id, animate) {
    const d = S.docs.find(x => x.id === +id), c = cli(d.cli), t = calc(d), e = estado(d), F = d.tipo === 'F';
    const venc = fdate(addDaysTo(d.fecha, 30));
    const acts = [];
    if (F && d.estado !== 'cobrada') acts.push(`<button class="btn solid" type="button" data-act="cobrar" data-id="${d.id}">Marcar como cobrada</button>`);
    if (!F && d.estado === 'enviado') acts.push(`<button class="btn solid" type="button" data-act="aceptar" data-id="${d.id}">Cliente acepta</button><button class="btn" type="button" data-act="rechazar" data-id="${d.id}">Rechaza</button>`);
    if (!F && d.estado === 'aceptado') acts.push(`<button class="btn solid" type="button" data-act="facturar" data-id="${d.id}">Convertir en factura</button>`);
    if ((F && d.estado !== 'cobrada') || (!F && d.estado !== 'facturado')) acts.push(`<button class="btn" type="button" data-act="doc-edit" data-id="${d.id}">Editar</button>`);
    acts.push(`<button class="btn" type="button" data-act="mail" data-id="${d.id}">Enviar por email</button><button class="btn" type="button" data-act="print">Imprimir / PDF</button>`);
    if (!F && d.estado !== 'facturado') acts.push(`<button class="btn" type="button" data-act="doc-del" data-id="${d.id}">Borrar</button>`);
    $('vw-in').innerHTML = `<article class="hoja ${e}">
      <header><div class="emi"><b>Reformas Levante S.L.</b><span>CIF B-00000000 (ficticio)<br>Calle Ejemplo 12 · 03000 Alicante</span></div>
      <div class="dm"><span class="tipo">${F ? 'Factura' : 'Presupuesto'}</span><b>${d.num}</b><span>${fdate(d.fecha)}${F ? ' · vence ' + venc : ' · válido hasta ' + venc}</span></div></header>
      <div class="para"><small>Cliente</small><b>${E(c.nom)}</b><span>${E(c.ciu)}${c.tel ? ' · ' + E(c.tel) : ''}</span></div>
      <table class="tbl lines"><thead><tr><th>Concepto</th><th class="r">Cant.</th><th class="r">Precio</th><th class="r">Importe</th></tr></thead><tbody>${d.lineas.map(l => `<tr><td>${E(l.d)}</td><td class="r num">${l.q}</td><td class="r num">${M(l.p)}</td><td class="r num">${M(r2(l.q * l.p))}</td></tr>`).join('')}</tbody></table>
      <dl class="sum"><div><dt>Base</dt><dd>${M(t.base)}</dd></div><div><dt>IVA ${d.iva} %</dt><dd>${M(t.iva)}</dd></div><div class="tot"><dt>Total</dt><dd>${M(t.total)}</dd></div></dl>
      ${d.origen ? `<p class="pie">Procede del presupuesto ${d.origen}.</p>` : ''}
      <p class="pie">${F ? 'Pago por transferencia a los 30 días. (Datos bancarios de ejemplo.)' : 'Presupuesto sin compromiso. Los materiales se facturan a precio de coste.'}</p>
      ${e === 'cobrada' ? `<div class="sello${animate ? ' go' : ''}" aria-label="Pagada">Pagada<small>${fdate(d.cobro || TODAY)}</small></div>` : ''}
      ${e === 'vencida' ? `<p class="hand venc">¡Vencida hace ${since(d.fecha) - 30} días! Reclamar</p>` : ''}
      ${e === 'facturado' ? '<div class="sello azul">Facturado</div>' : ''}
    </article><div class="acts noprint">${acts.join('')}<button class="btn" type="button" data-close>Cerrar</button></div>`;
    open($('dl-vw')); $('dl-cli').open && $('dl-cli').close();
  }
  function addDaysTo(s, n) { const d = dt(s); d.setDate(d.getDate() + n); return iso(d); }
  const docBy = id => S.docs.find(x => x.id === +id);

  /* ---------- Agenda ---------- */
  function renderAgenda() {
    const hoy = TODAY, lim = addDays(13);
    const items = S.trabajos.filter(t => t.fecha >= hoy && t.fecha <= lim).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    const byDay = {}; items.forEach(t => (byDay[t.fecha] ||= []).push(t));
    const days = []; for (let i = 0; i < 14; i++) { const f = addDays(i); if (byDay[f] || i < 7) days.push(f); }
    $('agenda').innerHTML = days.map(f => `<div class="day ${f === hoy ? 'hoy' : ''}"><h3>${f === hoy ? 'Hoy' : f === addDays(1) ? 'Mañana' : cap(fdateLong(f))}<small>${fdate(f)}</small></h3><ul class="ledger">${(byDay[f] || []).map(t => `<li class="row ${t.hecho ? 'done' : ''}"><label class="ck"><input type="checkbox" data-act="job-done" data-id="${t.id}" ${t.hecho ? 'checked' : ''}><span class="sr">Terminado</span></label><div><b>${E(t.desc)}</b><small>${t.hora} · ${E(cli(t.cli).nom)}</small></div><span class="who">${E(t.quien)}</span><button class="rm" type="button" data-act="job-del" data-id="${t.id}" aria-label="Borrar trabajo">×</button></li>`).join('') || '<li class="row libre"><small>Día libre</small></li>'}</ul></div>`).join('');
  }
  $('ag-form').addEventListener('submit', e => {
    e.preventDefault();
    const m = $('ag-msg'), f = $('ag-f').value, h = $('ag-h').value, c = $('ag-c').value, d = $('ag-d').value.trim(), q = $('ag-o').value;
    const bad = t => { m.textContent = t; m.hidden = false; };
    if (!f || !h || !c || !d) return bad('Rellena el día, la hora, el cliente y el trabajo.');
    if (f < TODAY) return bad('Esa fecha ya ha pasado.');
    const choque = S.trabajos.find(t => !t.hecho && t.fecha === f && t.hora === h && t.quien === q);
    if (choque) return bad(`${q} ya tiene a esa hora: «${choque.desc}». Cambia la hora o elige a otra persona.`);
    S.trabajos.push({ id: S.nt++, fecha: f, hora: h, cli: +c, desc: d, quien: q, hecho: false });
    save(); m.hidden = true; $('ag-d').value = ''; renderAll(); Demo.toast('Trabajo apuntado y sin choques de horario');
  });

  /* ---------- Informes ---------- */
  function periodo() {
    const p = $('inf-p').value, n = dt(TODAY), y = n.getFullYear(), m = n.getMonth();
    if (p === 'mes') return [iso(new Date(y, m, 1)), iso(new Date(y, m + 1, 0)), 'este mes'];
    if (p === 'anio') return [y + '-01-01', y + '-12-31', 'este año'];
    const q = Math.floor(m / 3); return [iso(new Date(y, q * 3, 1)), iso(new Date(y, q * 3 + 3, 0)), 'este trimestre'];
  }
  function renderInformes() {
    const [a, b, nom] = periodo(), fs = facts().filter(d => d.fecha >= a && d.fecha <= b);
    const sum = f => fs.filter(f).reduce((s, d) => s + calc(d).total, 0);
    const base = fs.reduce((s, d) => s + calc(d).base, 0), iva = fs.reduce((s, d) => s + calc(d).iva, 0);
    $('cuentas').innerHTML = [['Facturas emitidas', fs.length], ['Base imponible', M(base)], ['IVA repercutido', M(iva)], ['Total facturado', M(base + iva), 'tot'], ['Ya cobrado', M(sum(d => d.estado === 'cobrada'))], ['Pendiente de cobro', M(sum(d => d.estado !== 'cobrada')), 'red']].map(([t, v, c]) => `<div class="${c || ''}"><dt>${t}</dt><dd>${v}</dd></div>`).join('');
    const per = {}; fs.forEach(d => per[d.cli] = (per[d.cli] || 0) + calc(d).base);
    const top = Object.entries(per).sort((x, y) => y[1] - x[1]).slice(0, 5), mx = top[0] ? top[0][1] : 1;
    $('top').innerHTML = top.length ? top.map(([id, v]) => `<li><span>${E(cli(id).nom)}</span><b>${M(v)}</b><i style="width:${v / mx * 100}%"></i></li>`).join('') : `<li class="empty-li">No hay facturas ${nom}.</li>`;
  }
  $('csv').addEventListener('click', () => {
    const [a, b] = periodo(), fs = facts().filter(d => d.fecha >= a && d.fecha <= b).sort((x, y) => x.fecha.localeCompare(y.fecha));
    const n = v => String(v).replace('.', ',');
    const rows = [['Numero', 'Fecha', 'Cliente', 'Base', 'IVA', 'Total', 'Estado']].concat(fs.map(d => { const t = calc(d); return [d.num, d.fecha, '"' + cli(d.cli).nom.replace(/"/g, '""') + '"', n(t.base), n(t.iva), n(t.total), ETQ[estado(d)]]; }));
    const blob = new Blob(['﻿' + rows.map(r => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = 'libro-de-facturas.csv'; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000);
    Demo.toast('Descargado: se abre directamente en Excel');
  });

  /* ---------- Acciones ---------- */
  function renderAll() { renderResumen(); renderClientes(); renderDocs(); renderAgenda(); renderInformes(); }
  document.addEventListener('click', e => {
    if (e.target.matches('dialog')) { e.target.close(); return; }
    if (e.target.closest('[data-close]')) { e.target.closest('dialog').close(); return; }
    const b = e.target.closest('[data-act]'); if (!b || b.type === 'checkbox') return;
    const id = b.dataset.id, act = b.dataset.act;
    if (act === 'cli-open') openCliente(+id);
    else if (act === 'cli-new') { $('n-err').hidden = true; open($('dl-new')); $('n-nom').focus(); }
    else if (act === 'cli-del') { const i = S.clientes.findIndex(c => c.id === +id); S.clientes.splice(i, 1); save(); $('dl-cli').close(); fillCliSelects(); renderAll(); Demo.toast('Cliente eliminado'); }
    else if (act === 'doc-open') openDoc(+id);
    else if (act === 'doc-new') newDoc(b.dataset.tipo, b.dataset.cli);
    else if (act === 'doc-edit') { const d = docBy(id); ED = { id: d.id, tipo: d.tipo, cli: String(d.cli), fecha: d.fecha, iva: d.iva, lineas: d.lineas.map(l => ({ ...l })) }; openEditor(); }
    else if (act === 'doc-del') { S.docs.splice(S.docs.findIndex(d => d.id === +id), 1); save(); $('dl-vw').close(); renderAll(); Demo.toast('Presupuesto borrado. Una factura emitida no se borra: se anula con otra rectificativa.'); }
    else if (act === 'cobrar') { const d = docBy(id); d.estado = 'cobrada'; d.cobro = TODAY; save(); renderAll(); openDoc(d.id, true); Demo.toast('Cobrada. El pendiente baja y los informes se actualizan solos.'); }
    else if (act === 'aceptar' || act === 'rechazar') { docBy(id).estado = act === 'aceptar' ? 'aceptado' : 'rechazado'; save(); renderAll(); openDoc(+id); Demo.toast(act === 'aceptar' ? 'Presupuesto aceptado: ya puedes convertirlo en factura' : 'Presupuesto marcado como rechazado'); }
    else if (act === 'facturar') {
      const p = docBy(id); S.n.F++; const f = { id: S.nd++, tipo: 'F', num: `F-${TODAY.slice(0, 4)}-${String(S.n.F).padStart(4, '0')}`, cli: p.cli, fecha: TODAY, iva: p.iva, lineas: p.lineas.map(l => ({ ...l })), estado: 'pendiente', origen: p.num };
      p.estado = 'facturado'; S.docs.push(f); save(); renderAll(); openDoc(f.id); Demo.toast('Factura creada con las mismas líneas: sin copiar nada a mano');
    }
    else if (act === 'mail') Demo.toast('En tu programa real saldría por email al cliente con el PDF adjunto');
    else if (act === 'print') window.print();
    else if (act === 'line-rm') { ED.lineas.splice(+b.dataset.i, 1); if (!ED.lineas.length) ED.lineas.push({ d: '', q: 1, p: 0 }); editorLines(); }
    else if (act === 'chip') { const c = CONCEPTOS[+b.dataset.i]; const vacia = ED.lineas.length === 1 && !ED.lineas[0].d && !ED.lineas[0].p; const l = { d: c[0], q: c[1], p: c[2] }; if (vacia) ED.lineas[0] = l; else ED.lineas.push(l); editorLines(); }
    else if (act === 'job-del') { S.trabajos.splice(S.trabajos.findIndex(t => t.id === +id), 1); save(); renderAll(); }
  });
  document.addEventListener('change', e => {
    const c = e.target.closest('[data-act=job-done]'); if (!c) return;
    S.trabajos.find(t => t.id === +c.dataset.id).hecho = c.checked; save(); renderAll();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('tr.click')) e.target.click(); });
  ['cl-q', 'cl-t'].forEach(i => $(i).addEventListener('input', renderClientes));
  ['d-q', 'd-f'].forEach(i => $(i).addEventListener('input', renderDocs));
  $('inf-p').addEventListener('change', renderInformes);
  $('reset').addEventListener('click', () => { S = seed(); save(); fillCliSelects(); renderAll(); Demo.toast('Datos de ejemplo restablecidos'); });

  $('yr').textContent = dt(TODAY).getFullYear();
  $('ag-f').min = TODAY; $('ag-f').value = addDays(1);
  fillCliSelects(); renderAll();
})();
