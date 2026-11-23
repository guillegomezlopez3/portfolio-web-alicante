'use strict';
/* Conecta la web pública con el panel. Se carga con la dirección del panel en data-api:
     <script src="js/panel-conexion.js" data-api="https://admin.digitalsolutionscmv.es" defer></script>
   Si data-api está vacío o el panel no responde, la web funciona igual que siempre (el botón de WhatsApp no depende del panel).
   Hace tres cosas:
     1) Lee el contenido editable (preguntas frecuentes, disponibilidad, aviso) y lo pinta.
     2) Al enviar la ficha por WhatsApp, guarda además la solicitud en el panel (canal "whatsapp").
     3) Ofrece window.cmvEnviarSolicitud('email') al botón «Enviar por email» del formulario (js/main.js muestra la confirmación,
      limpia el formulario y, si esto falla, ofrece abrir el correo con la ficha escrita). */
(() => {
  const s = document.currentScript, API = ((s && s.dataset.api) || '').replace(/\/+$/, '');
  if (!API) return;

  /* ---- 1) Contenido ---- */
  fetch(API + '/api/contenido', { mode: 'cors' }).then(r => r.ok ? r.json() : Promise.reject()).then(c => {
    const faq = document.querySelector('.faq-l');
    if (faq && Array.isArray(c.faq) && c.faq.length) {
      faq.replaceChildren(...c.faq.map((x, i) => {
        const d = document.createElement('details'); d.className = 'rv in'; if (i === 0) d.open = true;
        const sm = document.createElement('summary'), n = document.createElement('span'), p = document.createElement('p');
        n.textContent = String(i + 1).padStart(2, '0'); sm.append(n, document.createTextNode(x.q)); p.textContent = x.a; d.append(sm, p);
        return d;
      }));
    }
    const disp = document.querySelector('.hero-meta .dot');
    if (disp && c.disponibilidad) {
      const span = disp.parentElement;
      if (!c.disponibilidad.activa) span.hidden = true;
      else if (c.disponibilidad.texto) { span.replaceChildren(disp, document.createTextNode(c.disponibilidad.texto)); span.hidden = false; }
    }
    if (c.aviso && c.aviso.activo && c.aviso.texto) {
      const a = document.createElement('div'); a.setAttribute('role', 'status'); a.textContent = c.aviso.texto;
      Object.assign(a.style, { position: 'fixed', top: '3.6rem', left: '0', right: '0', zIndex: '60', background: '#ff4a1c', color: '#fff', textAlign: 'center', padding: '.5rem 1rem', font: '500 .78rem/1.3 "DM Mono", monospace', letterSpacing: '.06em', textTransform: 'uppercase' });
      document.body.append(a);
    }
  }).catch(() => {});

  /* ---- 2 y 3) Solicitudes ---- */
  const f = document.getElementById('brief');
  if (!f) return;
  const señuelo = document.createElement('input');   // los robots lo rellenan; las personas no lo ven
  Object.assign(señuelo, { name: 'web', type: 'text', tabIndex: -1, autocomplete: 'off' }); señuelo.setAttribute('aria-hidden', 'true');
  Object.assign(señuelo.style, { position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0' });
  f.append(señuelo);

  const datos = canal => {
    const v = n => { const e = f.querySelector(`[name="${n}"]:checked`); return e ? e.value : ''; };
    return { nombre: f.nombre.value.trim(), contacto: f.contacto.value.trim(), tipo: v('tipo'), plazo: v('plazo'), extras: [...f.querySelectorAll('[name="extra"]:checked')].map(i => i.value), mensaje: f.mensaje.value.trim(), web: señuelo.value, canal };
  };
  const enviar = canal => fetch(API + '/api/solicitud', { method: 'POST', mode: 'cors', headers: { 'content-type': 'application/json' }, body: JSON.stringify(datos(canal)), keepalive: true });

  // WhatsApp: la web ya abre WhatsApp; además se guarda la solicitud (si falla, no pasa nada)
  f.addEventListener('submit', () => { if (f.nombre.value.trim() && f.contacto.value.trim()) { try { enviar('whatsapp').catch(() => {}); } catch {} } });

  // Email: lo dispara el botón de abajo del formulario (js/main.js); aquí solo se guarda y se avisa de si salió bien
  window.cmvEnviarSolicitud = async canal => { const r = await enviar(canal); return r.ok; };
})();
