'use strict';
const { eur, esc } = Demo;
const SV = [{ n: 'Cambio de aceite y filtros', p: 69 }, { n: 'Pastillas de freno (eje)', p: 95 }, { n: 'Discos de freno (eje)', p: 160 }, { n: 'Revisión pre-ITV', p: 45 }, { n: 'Neumáticos (montaje y equilibrado ×4)', p: 60 }, { n: 'Aire acondicionado (recarga)', p: 79 }, { n: 'Batería (suministro y montaje)', p: 120 }, { n: 'Alineación de dirección', p: 49 }, { n: 'Diagnosis electrónica', p: 35 }, { n: 'Kit de distribución', p: 340 }];
const PACKS = [
  { n: 'Básico', p: 89, f: ['Aceite y filtro de aceite', 'Revisión de 25 puntos', 'Nivel de líquidos'] },
  { n: 'Completo', p: 189, pop: 1, f: ['Aceite y filtro de aceite', 'Revisión de 25 puntos', 'Nivel de líquidos', 'Revisión de frenos', 'Alineación de dirección', 'Diagnosis electrónica', 'Lavado exterior'] },
  { n: 'Pre-ITV', p: 59, f: ['Revisión de luces y frenos', 'Emisiones y neumáticos', 'Informe de defectos'] }
];
const REV = [['Pablo R.', 5, 'Me dieron presupuesto cerrado y no se pasaron ni un euro. Trato de diez.'], ['Isabel M.', 5, 'Me avisaron por WhatsApp en cada paso de la reparación. Muy transparentes.'], ['Marcos T.', 4, 'Rápidos con la ITV previa. Volveré para el cambio de correa.'], ['Elena V.', 5, 'Me explicaron lo que era urgente y lo que podía esperar. Eso se agradece.'], ['Jorge C.', 5, 'Coche de cortesía y entrega el mismo día. Imbatibles.']];
const STATE = { '1234ABC': { car: 'Seat Ibiza', step: 2, eta: 'Hoy a las 18:00', note: 'Sustitución de pastillas y discos delanteros en curso.' }, '5678DEF': { car: 'Toyota Corolla', step: 3, eta: 'Listo para recoger', note: 'Revisión completada. Total: 189,00 €.' } };
const STEPS = ['Recibido', 'Diagnóstico', 'Reparación', 'Listo'];

Demo.counters(); Demo.reveal();

/* Relojes (SVG): 270º de barrido, de 135º a 405º */
const P = (a, r) => [100 + r * Math.cos(a * Math.PI / 180), 100 + r * Math.sin(a * Math.PI / 180)];
const arc = (a1, a2, r) => { const [x1, y1] = P(a1, r), [x2, y2] = P(a2, r); return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`; };
function gauge(el, { max, step, label, zones }) {
  const ang = v => 135 + 270 * v / max;
  let ticks = '';
  for (let v = 0; v <= max; v += step / 2) { const major = v % step === 0, [x1, y1] = P(ang(v), major ? 70 : 74), [x2, y2] = P(ang(v), 80); ticks += `<line class="tk ${major ? 'm' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; if (major) { const [tx, ty] = P(ang(v), 60); ticks += `<text class="num" x="${tx}" y="${ty}">${label(v)}</text>`; } }
  const zs = (zones || []).map(([a, b, c]) => `<path class="arc" d="${arc(ang(a), ang(b), 86)}" stroke="${c}"/>`).join('');
  el.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="Reloj indicador">${zs}${ticks}<g class="needle" style="transform:rotate(135deg)"><line x1="100" y1="100" x2="168" y2="100"/></g><circle class="hub" cx="100" cy="100" r="7"/></svg>`;
  const needle = el.querySelector('.needle');
  return v => { needle.style.transform = `rotate(${ang(Math.min(max, Math.max(0, v)))}deg)`; };
}
const speed = gauge($('g-hero'), { max: 240, step: 40, label: v => v, zones: [[0, 160, '#38d27a55'], [160, 200, '#ffd20066'], [200, 240, '#ff403388']] });
setTimeout(() => speed(150), 250); setInterval(() => speed(138 + Math.random() * 30), 3200);
/* Cuentakilómetros */
(() => {
  const el = $('odo'), end = 152310; let t0;
  const show = n => { el.innerHTML = String(n).padStart(6, '0').split('').map(d => `<span>${d}</span>`).join('') + '<small>KM</small>'; };
  const step = ts => { t0 ??= ts; const k = Math.min(1, (ts - t0) / 1800); show(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
  show(0); requestAnimationFrame(step);
})();

/* Packs: matriz comparativa */
const feats = [...new Set(PACKS.flatMap(p => p.f))];
$('mx').innerHTML = `<thead><tr><th scope="col"><span class="sr">Incluye</span></th>${PACKS.map(p => `<th scope="col" class="${p.pop ? 'hot' : ''}">${p.pop ? '<span class="pop">Más elegido</span><br>' : ''}<span class="pn">${p.n}</span><br><span class="pp">${p.p}<small> €</small></span></th>`).join('')}</tr></thead>
  <tbody>${feats.map(f => `<tr><td>${f}</td>${PACKS.map(p => `<td class="${p.pop ? 'hot' : ''}">${p.f.includes(f) ? '<span class="y" aria-label="Incluido">●</span>' : '<span class="n" aria-label="No incluido">—</span>'}</td>`).join('')}</tr>`).join('')}</tbody>
  <tfoot><tr><td></td>${PACKS.map(p => `<td class="${p.pop ? 'hot' : ''}"><a class="btn ${p.pop ? '' : 'o'}" href="#cita" data-pack="${p.n}">Reservar</a></td>`).join('')}</tr></tfoot>`;
document.addEventListener('click', e => { const a = e.target.closest('[data-pack]'); if (a) $('ds').value = 'Pack ' + a.dataset.pack; });

/* Presupuesto como ticket */
$('sv').innerHTML = SV.map((s, i) => `<label><input type="checkbox" data-i="${i}"><span>${s.n}</span><span class="p">${eur(s.p)}</span></label>`).join('');
$('r-no').textContent = String(Math.floor(1000 + Math.random() * 9000));
function calc() {
  const sel = [...document.querySelectorAll('#sv input:checked')].map(c => SV[+c.dataset.i]), k = parseFloat($('vt').value);
  const base = sel.reduce((a, s) => a + s.p, 0) * k, disc = sel.length >= 3 ? .08 : 0, total = base * (1 - disc), iva = total - total / 1.21;
  $('r-l').innerHTML = sel.length ? sel.map(s => `<div class="ln"><span>${esc(s.n)}</span><span>${eur(s.p * k)}</span></div>`).join('') : '<p class="e">Selecciona los servicios que necesitas</p>';
  $('r-t').innerHTML = `<div class="ln"><span>Subtotal</span><span>${eur(base)}</span></div>${disc ? `<div class="ln"><span>Dto. 3+ servicios (8 %)</span><span>−${eur(base * disc)}</span></div>` : sel.length ? `<div class="ln"><span style="opacity:.6">Añade ${3 - sel.length} más: −8 %</span><span></span></div>` : ''}<div class="ln"><span>IVA incl. (21 %)</span><span>${eur(iva)}</span></div><div class="ln t"><span>TOTAL</span><span>${eur(total)}</span></div>`;
}
$('sv').addEventListener('change', calc); $('vt').addEventListener('change', calc); calc();
$('quote-save').onclick = () => { const sel = [...document.querySelectorAll('#sv input:checked')]; if (!sel.length) return Demo.toast('Selecciona al menos un servicio'); $('ds').value = 'Presupuesto: ' + sel.map(c => SV[+c.dataset.i].n).join(', '); location.hash = '#cita'; Demo.toast('Servicios copiados a la cita previa'); };

/* ITV */
$('reg').max = new Date().toISOString().slice(0, 10);
$('reg').addEventListener('input', () => {
  if (!$('reg').value) return; const r = new Date($('reg').value), now = new Date(); let prev = new Date(r), next = new Date(r); next.setFullYear(r.getFullYear() + 4);
  for (let y = 4; next <= now; y += (y >= 10 ? 1 : 2)) { prev = new Date(next); next = new Date(r); next.setFullYear(r.getFullYear() + y + (y >= 10 ? 1 : 2)); }
  const days = Math.round((next - now) / 86400000), pct = Math.min(100, Math.max(0, ((now - prev) / (next - prev)) * 100));
  $('itv-r').innerHTML = `<div class="d">${days}<small> días</small></div><div class="tl"><i style="width:0" data-w="${pct}"></i></div><div class="row"><span>${prev.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span><span>${next.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div><p>Periodicidad orientativa: 4 años la primera, luego cada 2 y anual desde los 10 años. Consulta tu ficha técnica.</p>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { const i = $('itv-r').querySelector('i'); if (i) i.style.width = i.dataset.w + '%'; }));
});

/* Mantenimiento por kilómetros */
const kmG = gauge($('g-km'), { max: 30000, step: 5000, label: v => v / 1000 + 'k', zones: [[0, 10000, '#38d27a88'], [10000, 20000, '#ffd20099'], [20000, 30000, '#ff4033aa']] });
function km() { const v = +$('km').value; kmG(v); $('km-l').textContent = v.toLocaleString('es-ES') + ' km'; const t = []; if (v >= 10000) t.push('Cambio de aceite y filtros'); if (v >= 15000) t.push('Rotación y revisión de neumáticos'); if (v >= 20000) t.push('Revisión de frenos'); if (v >= 30000) t.push('Filtro de aire y de habitáculo'); $('km-r').innerHTML = t.length ? t.map(x => `<li>${x}</li>`).join('') : '<li class="g">Todo al día por ahora</li>'; }
$('km').oninput = km; setTimeout(km, 100);

/* Estado de la reparación */
const CAR = '<svg class="car" viewBox="0 0 60 28" aria-hidden="true"><path fill="currentColor" d="M6 18l3-8c.6-1.6 2-2.5 3.7-2.5H40c1.2 0 2.3.5 3 1.4L48 15c3 .3 6 1.7 6 4.5V21H6z"/><circle cx="16" cy="21" r="5" fill="#101215" stroke="currentColor" stroke-width="3"/><circle cx="43" cy="21" r="5" fill="#101215" stroke="currentColor" stroke-width="3"/></svg>';
$('trk').addEventListener('submit', e => {
  e.preventDefault(); const m = $('trk-m').value.replace(/\s/g, '').toUpperCase(), s = STATE[m];
  if (!s) { $('trk-r').innerHTML = '<p class="note-b">No hay ningún vehículo en el taller con esa matrícula.</p>'; return; }
  const pct = s.step / 3 * 100;
  $('trk-r').innerHTML = `<p class="lb">${s.car} · ${m}</p><div class="road"><i style="width:0" data-w="${pct}"></i><div class="car" style="left:0" data-l="${pct}">${CAR}</div></div><div class="stops">${STEPS.map((x, i) => `<span class="${i <= s.step ? 'd' : ''}">${x}</span>`).join('')}</div><p class="note-b"><b style="color:var(--hv)">${s.eta}</b> — ${s.note}</p>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { const r = $('trk-r'); r.querySelector('i').style.width = pct + '%'; r.querySelector('.car').style.left = pct + '%'; }));
});

/* Cita */
$('d').min = new Date().toISOString().slice(0, 10);
$('f').addEventListener('submit', e => {
  e.preventDefault(); const day = new Date($('d').value + 'T00:00');
  if (day.getDay() === 0 || day.getDay() === 6) return Demo.toast('Abrimos de lunes a viernes');
  $('ok-t').textContent = `${$('nm').value}, hemos anotado tu ${$('mod').value} (${$('mat').value.toUpperCase()}) el ${day.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}, ${$('h').value}.${$('rec').checked ? ' Tendrás coche de cortesía.' : ''}`;
  $('f').hidden = true; $('ok').hidden = false;
});
$('ok-re').onclick = () => { $('f').reset(); $('f').hidden = false; $('ok').hidden = true; };

/* Opiniones en cinta y FAQ */
const card = ([n, s, t]) => `<blockquote><p class="s">${Demo.stars(s)}</p><p>${esc(t)}</p><footer>${esc(n)}</footer></blockquote>`;
$('reviews').innerHTML = [...REV, ...REV].map(card).join('');
Demo.faq('faqs', [['¿Dais presupuesto antes de reparar?', 'Siempre. No empezamos ningún trabajo sin tu aprobación.'], ['¿Qué garantía tienen las reparaciones?', '2 años en mano de obra y recambios de calidad equivalente al original.'], ['¿Trabajáis con eléctricos e híbridos?', 'Sí, mantenimiento y diagnosis. Las reparaciones de alta tensión las hace personal certificado.'], ['¿Puedo traer mis propias piezas?', 'Sí, aplicamos solo mano de obra, sin garantía sobre la pieza.']]);
