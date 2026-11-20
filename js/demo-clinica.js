'use strict';
const { eur, img, esc, store, save } = Demo;
const SERVICES = [
  { id: 's1', n: 'Fisioterapia', g: 'Fisioterapia', d: 'Rehabilitación, terapia manual y punción seca para volver a moverte sin dolor.', min: 45, pr: 40 },
  { id: 's2', n: 'Limpieza dental', g: 'Dental', d: 'Higiene bucodental profesional y revisión completa de encías y dientes.', min: 30, pr: 45 },
  { id: 's3', n: 'Tratamiento facial', g: 'Estética', d: 'Limpieza profunda, hidratación y antiedad adaptados a tu piel.', min: 60, pr: 55 },
  { id: 's4', n: 'Masaje relajante', g: 'Fisioterapia', d: 'Descontractura, alivio del estrés y mejora del descanso.', min: 50, pr: 38 },
  { id: 's5', n: 'Blanqueamiento dental', g: 'Dental', d: 'Una sonrisa más luminosa en una sola sesión, con control de sensibilidad.', min: 60, pr: 180 },
  { id: 's6', n: 'Depilación láser', g: 'Estética', d: 'Tecnología diodo con resultados duraderos y sesiones cómodas.', min: 40, pr: 35 },
  { id: 's7', n: 'Ortodoncia invisible', g: 'Dental', d: 'Alineadores transparentes con estudio inicial sin coste.', min: 40, pr: 60 },
  { id: 's8', n: 'Readaptación deportiva', g: 'Fisioterapia', d: 'Recuperación de lesiones y vuelta progresiva a tu deporte.', min: 60, pr: 50 },
  { id: 's9', n: 'Mesoterapia facial', g: 'Estética', d: 'Revitalización con activos personalizados para una piel más firme.', min: 45, pr: 90 }
];
const GIMG = { Fisioterapia: '1544161515-4ab6ce6db874', Dental: '1629909613654-28e377c37b09', Estética: '1570172619644-dfd03ed5d881' };
const TEAM = [
  { id: 'p1', n: 'Dra. Laura Martínez', r: 'Odontóloga', s: ['s2', 's5', 's7'], i: '1594824476967-48c8b964273f', b: 'Colegiada nº 3.412. Especialista en ortodoncia y estética dental.' },
  { id: 'p2', n: 'Carlos Vidal', r: 'Fisioterapeuta', s: ['s1', 's4', 's8'], i: '1612349317150-e413f6a5b16d', b: 'Máster en fisioterapia deportiva. Trabaja con equipos amateur de la provincia.' },
  { id: 'p3', n: 'Marta Soler', r: 'Esteticista', s: ['s3', 's4', 's6', 's9'], i: '1580489944761-15a19d654956', b: 'Experta en medicina estética no invasiva y cosmética avanzada.' }
];
const POSTS = [
  { t: 'Cinco ejercicios para aliviar la espalda en la oficina', c: 'Fisioterapia', m: '3 min', x: 'Pasar horas sentado carga la zona lumbar. Haz una pausa cada 50 minutos: 1) estiramiento de cadera, 2) rotación torácica, 3) gato-camello, 4) elevación de talones, 5) caminata de 2 minutos. Si el dolor dura más de una semana, consulta con un fisioterapeuta.' },
  { t: 'Cada cuánto debo hacerme una limpieza dental', c: 'Dental', m: '2 min', x: 'En general, una limpieza profesional cada 6-12 meses ayuda a prevenir caries y encías inflamadas. Si llevas ortodoncia o implantes, o tienes tendencia al sarro, tu dentista puede recomendarte revisiones más frecuentes.' },
  { t: 'Cuidar la piel en verano: lo que sí funciona', c: 'Estética', m: '3 min', x: 'Protector solar SPF 30-50 cada 2 horas, limpieza suave por la noche, hidratación ligera y evitar tratamientos agresivos antes de tomar el sol. Pregunta siempre antes de láser o peelings en temporada alta.' }
];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'];
let R = [['María J., San Vicente', 5, 'Llegué con una lumbalgia horrible y en tres sesiones estaba otra persona. Muy atentos y profesionales.'], ['Antonio R., Alicante', 5, 'Instalaciones impecables y cero dolor en mi limpieza dental. Me explicaron todo con claridad.'], ['Laura P., Playa de San Juan', 5, 'El tratamiento facial superó mis expectativas. Pedir cita online es facilísimo.']];

Demo.counters(); Demo.reveal();
(() => { const d = new Date(), h = d.getHours() + d.getMinutes() / 60, w = d.getDay(); const open = (w >= 1 && w <= 5 && ((h >= 9 && h < 14) || (h >= 16 && h < 20))) || (w === 6 && h >= 9 && h < 13); $('status').innerHTML = open ? '<i></i>Abierto ahora' : '<i class="c"></i>Cerrado ahora · pide cita online 24 h'; })();

/* Servicios: lista + detalle */
let g = 'Todos', sel = 's1';
const GROUPS = ['Todos', 'Fisioterapia', 'Dental', 'Estética'];
function renderSvc() {
  $('svc-filter').innerHTML = GROUPS.map(x => `<button role="tab" class="${x === g ? 'on' : ''}" data-g="${x}">${x}</button>`).join('');
  const l = SERVICES.filter(s => g === 'Todos' || s.g === g); if (!l.find(s => s.id === sel)) sel = l[0].id;
  $('svc-list').innerHTML = l.map(s => `<li><button class="${s.id === sel ? 'on' : ''}" data-s="${s.id}">${s.n}<small>${s.g}</small></button></li>`).join('');
  const s = SERVICES.find(x => x.id === sel);
  $('svc-detail').innerHTML = `<div class="det-i"><img src="${img(GIMG[s.g], 800, 640)}" alt="${s.n}" width="800" height="640" loading="lazy"></div><h3>${s.n}</h3><p>${s.d}</p><dl><div><dt>Duración</dt><dd>${s.min} min</dd></div><div><dt>Desde</dt><dd>${s.pr} €</dd></div></dl><a class="arr" href="#cita" data-pick="${s.id}">Pedir cita</a>`;
}
$('svc-filter').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { g = b.dataset.g; renderSvc(); } });
$('svc-list').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sel = b.dataset.s; renderSvc(); } });
renderSvc();
$('rates').innerHTML = SERVICES.map(s => `<tr><td>${s.n}</td><td>${s.min} min</td><td>${s.pr} €</td></tr>`).join('');

/* Financiación */
let months = 6;
function fin() { const a = +$('fin-amt').value; $('fin-l').textContent = a + ' €'; $('fin-q').innerHTML = `${eur(a / months)} <small>/ mes</small>`; $('fin-m').innerHTML = [3, 6, 12, 24].map(m => `<button type="button" class="${m === months ? 'on' : ''}" data-m="${m}">${m} meses</button>`).join(''); }
$('fin-amt').oninput = fin; $('fin-m').onclick = e => { const b = e.target.closest('button'); if (b) { months = +b.dataset.m; fin(); } }; fin();

/* Equipo */
$('team').innerHTML = TEAM.map(t => `<article class="rv"><div class="tp"><img src="${img(t.i, 600, 750)}" alt="${t.n}" width="600" height="750" loading="lazy"></div><h3>${t.n}</h3><p class="r">${t.r}</p><p>${t.b}</p><a class="lnk" href="#cita" data-pro="${t.id}">Pedir cita con ${t.n.startsWith('Dra.') ? 'la doctora' : t.n.split(' ')[0]}</a></article>`).join('');
Demo.reveal();

/* Test de orientación */
const Q = [['¿Dónde sientes la molestia o qué te preocupa?', ['Espalda, cuello o articulaciones', 'Dientes o encías', 'Piel o aspecto facial']], ['¿Desde cuándo?', ['Menos de una semana', 'Entre 1 semana y 3 meses', 'Más de 3 meses']], ['¿Qué buscas principalmente?', ['Aliviar el dolor', 'Prevención y revisión', 'Mejorar mi imagen']]];
const RES = [['s1', 'Fisioterapia'], ['s2', 'Limpieza dental y revisión'], ['s3', 'Tratamiento facial']];
let qa = [];
function renderQuiz() {
  if (qa.length === 3) { const r = RES[qa[0]], urgent = qa[1] === 0 && qa[2] === 0;
    $('quiz').innerHTML = `<div class="q-p"><i style="width:100%"></i></div><div class="q-r"><p class="q-n">Te recomendamos</p><p class="big">${r[1]}</p>${urgent ? '<p>Si hay dolor intenso o reciente, llámanos y te damos cita de urgencia el mismo día.</p>' : '<p>Es una orientación, no un diagnóstico: en la primera visita lo valoramos contigo.</p>'}<div class="row"><a class="arr" href="#cita" data-pick="${r[0]}">Pedir cita</a><button class="lnk" id="q-re">Repetir el test</button></div></div>`;
    $('q-re').onclick = () => { qa = []; renderQuiz(); }; return; }
  const [t, o] = Q[qa.length];
  $('quiz').innerHTML = `<div class="q-p"><i style="width:${qa.length / 3 * 100}%"></i></div><p class="q-n">Pregunta ${qa.length + 1} de 3</p><h3 class="q-t">${t}</h3><div class="q-o">${o.map((x, i) => `<button data-a="${i}">${x}</button>`).join('')}</div>`;
}
$('quiz').addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b) { qa.push(+b.dataset.a); renderQuiz(); } });
renderQuiz();

/* Consejos */
$('posts').innerHTML = POSTS.map((p, i) => `<button data-post="${i}"><small>${p.c}</small><b>${p.t}</b><span>${p.m} de lectura</span></button>`).join('');
$('posts').addEventListener('click', e => { const b = e.target.closest('[data-post]'); if (!b) return; const p = POSTS[+b.dataset.post]; $('post-d').innerHTML = `<button class="x" id="pc" aria-label="Cerrar">×</button><p class="eyebrow">${p.c} · ${p.m}</p><h2>${p.t}</h2><p>${p.x}</p><a class="arr l" href="#cita" id="pcta">Reservar cita</a>`; $('post-d').showModal(); $('pc').onclick = $('pcta').onclick = () => $('post-d').close(); });
[$('post-d'), $('pat-d')].forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

/* Opiniones, FAQ, boletín */
function renderRev() { $('reviews').innerHTML = R.slice(0, 3).map(([n, s, t]) => `<blockquote><p>${esc(t)}</p><footer><span class="s">${Demo.stars(s)}</span><br>${esc(n)}</footer></blockquote>`).join(''); }
renderRev();
$('rev-form').addEventListener('submit', e => { e.preventDefault(); R.unshift([$('rv-n').value, +$('rv-s').value, $('rv-t').value]); e.target.reset(); renderRev(); Demo.toast('Gracias por tu opinión'); });
Demo.faq('faqs', [['¿La primera visita tiene coste?', 'La primera valoración es gratuita en fisioterapia y ortodoncia.'], ['¿Trabajáis con mutuas y aseguradoras?', 'Sí, consulta el listado de convenios en la sección de tarifas.'], ['¿Puedo cancelar una cita?', 'Sí, hasta 24 h antes sin coste desde tu Área de paciente o por teléfono.'], ['¿Ofrecéis teleconsulta?', 'Sí, para seguimiento y dudas. Selecciónala en el paso 2 de la cita.']]);
Demo.newsletter('news', 'Suscrito al boletín (simulado)');

/* Cita: pasos que se desbloquean */
const st = { svc: null, mode: 'Presencial', pro: null, day: null, hour: null };
const TELE = ['s1', 's4', 's8', 's7'];
const DAYS = (() => { const o = [], d = new Date(); while (o.length < 7) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) o.push(new Date(d)); } return o; })();
const dkey = d => d.toISOString().slice(0, 10), dlabel = d => d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
const busy = (pro, day, h) => (pro.charCodeAt(1) + day.charCodeAt(9) * 3 + h * 5) % 4 === 0;
let APPTS = store('cb-appts', []);
const ob = (gp, v, l, sel, dis, extra) => `<button type="button" class="${sel ? 'on' : ''}" data-g="${gp}" data-v="${v}" ${dis ? 'disabled' : ''}>${l}${extra ? `<small>${extra}</small>` : ''}</button>`;
function render() {
  const S = SERVICES.find(x => x.id === st.svc), P = TEAM.find(x => x.id === st.pro);
  const ok = [!!st.svc, !!st.svc, !!st.pro, !!st.day, !!st.hour];
  const lock = i => ok.slice(0, i).some(x => !x);
  const step = (i, title, hint, body) => `<section class="st ${lock(i) ? 'lock' : ''} ${ok[i] ? 'ok' : ''}"><span class="n">${i + 1}</span><div><h3>${title}${hint ? `<small>${hint}</small>` : ''}</h3>${body}</div></section>`;
  $('steps').innerHTML =
    step(0, 'Servicio', S ? S.n : '', `<div class="ol">${SERVICES.map(s => ob('svc', s.id, s.n, st.svc === s.id, false, `${s.min} min · desde ${s.pr} €`)).join('')}</div>`) +
    step(1, 'Modalidad', '', `<div class="pl">${['Presencial', 'Teleconsulta'].map(m => ob('mode', m, m, st.mode === m, m === 'Teleconsulta' && st.svc && !TELE.includes(st.svc))).join('')}</div>`) +
    step(2, 'Profesional', P ? P.n : '', `<div class="ol">${TEAM.map(t => ob('pro', t.id, t.n, st.pro === t.id, st.svc && !t.s.includes(st.svc), t.r)).join('')}</div>`) +
    step(3, 'Día', '', `<div class="pl">${DAYS.map(d => ob('day', dkey(d), dlabel(d), st.day === dkey(d))).join('')}</div>`) +
    step(4, 'Hora', '', `<div class="pl">${HOURS.map((h, i) => ob('hour', h, h, st.hour === h, st.pro && st.day && busy(st.pro, st.day, i))).join('')}</div>`);
  $('appt').classList.toggle('lock', ok.some(x => !x)); $('appt').classList.toggle('ok', ok.every(Boolean));
  const row = (k, v) => `<div><dt>${k}</dt><dd>${v || '—'}</dd></div>`;
  $('sum').innerHTML = row('Servicio', S && S.n) + row('Modalidad', S && st.mode) + row('Profesional', P && P.n) + row('Día y hora', st.day && st.hour && `${dlabel(new Date(st.day + 'T00:00'))} · ${st.hour}`) + (S ? `<div class="tot"><dt>Desde</dt><dd>${S.pr} €</dd></div>` : '');
}
$('steps').addEventListener('click', e => {
  const b = e.target.closest('button[data-g]'); if (!b || b.disabled) return; st[b.dataset.g] = b.dataset.v;
  if (st.svc && st.pro && !TEAM.find(t => t.id === st.pro).s.includes(st.svc)) st.pro = null;
  if (st.mode === 'Teleconsulta' && st.svc && !TELE.includes(st.svc)) st.mode = 'Presencial';
  if (st.pro && st.day && st.hour && busy(st.pro, st.day, HOURS.indexOf(st.hour))) st.hour = null;
  render();
});
document.addEventListener('click', e => { const a = e.target.closest('[data-pick]'); if (a) { st.svc = a.dataset.pick; render(); } const p = e.target.closest('[data-pro]'); if (p) { st.pro = p.dataset.pro; render(); } });
$('appt').addEventListener('submit', e => {
  e.preventDefault();
  const S = SERVICES.find(x => x.id === st.svc), P = TEAM.find(x => x.id === st.pro);
  const txt = `${S.n} (${st.mode}) con ${P.n} el ${dlabel(new Date(st.day + 'T00:00'))} a las ${st.hour}.`;
  APPTS.push({ txt }); save('cb-appts', APPTS);
  $('done-text').textContent = `${$('pname').value}, tu cita queda así: ${txt} Te enviaremos un recordatorio.`;
  $('steps').hidden = $('appt').hidden = $('sum').hidden = true; $('done').hidden = false;
});
$('again').addEventListener('click', () => { Object.assign(st, { svc: null, mode: 'Presencial', pro: null, day: null, hour: null }); $('appt').reset(); render(); $('steps').hidden = $('appt').hidden = $('sum').hidden = false; $('done').hidden = true; });
render();

/* Área de paciente */
function renderPat(logged) {
  $('pat-d').innerHTML = `<button class="x" id="px" aria-label="Cerrar">×</button><p class="eyebrow">Área de paciente</p><h2>${logged ? 'Hola de nuevo' : 'Entra a tu área'}</h2>` + (logged ? `
    <p style="opacity:.7">Sesión iniciada (demo).</p><h3 class="eyebrow" style="margin-top:1.6rem">Mis citas</h3>
    <div>${APPTS.length ? APPTS.map((a, i) => `<div class="ap"><span>${esc(a.txt)}</span><button data-cx="${i}">Cancelar</button></div>`).join('') : '<p style="opacity:.7;padding:.8rem 0">No tienes citas. Reserva la primera desde el formulario.</p>'}</div>
    <h3 class="eyebrow" style="margin-top:1.6rem">Documentos</h3><div class="ap"><span>Consentimiento informado.pdf</span><span style="opacity:.5">ejemplo</span></div><div class="ap"><span>Recomendaciones post-tratamiento.pdf</span><span style="opacity:.5">ejemplo</span></div>
    <button class="lnk" id="logout" style="margin-top:1.6rem">Cerrar sesión</button>` : `
    <form id="login" class="fm" style="grid-template-columns:1fr"><div><label for="l-e">Email</label><input id="l-e" type="email" required></div><div><label for="l-p">Contraseña</label><input id="l-p" type="password" required></div><p style="font-size:.82rem;opacity:.6">Demo: cualquier dato sirve. En producción, autenticación con JWT.</p><button class="btn w">Entrar</button></form>`);
  $('px').onclick = () => $('pat-d').close();
  if ($('login')) $('login').onsubmit = e => { e.preventDefault(); renderPat(true); };
  if ($('logout')) $('logout').onclick = () => renderPat(false);
  $('pat-d').querySelectorAll('[data-cx]').forEach(b => b.onclick = () => { APPTS.splice(+b.dataset.cx, 1); save('cb-appts', APPTS); renderPat(true); Demo.toast('Cita cancelada'); });
}
$('open-pat').onclick = () => { renderPat(false); $('pat-d').showModal(); };
