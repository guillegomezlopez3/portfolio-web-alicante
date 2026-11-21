'use strict';
/* Asistente automático con respuestas preprogramadas.
   Funciona 100 % en el navegador: sin IA, sin servidor, sin créditos y sin enviar nada a ningún sitio.

   CÓMO AÑADIR UNA PREGUNTA
   Añade un objeto a KB:
     id     identificador único
     label  texto del botón rápido (si lo pones en SUGGEST, aparece como sugerencia)
     k      palabras clave SIN tildes y en minúsculas. Una palabra sola (5+ letras) también casa con sus
            derivadas ("precio" casa con "precios"). Una frase con espacios casa solo si aparece entera y pesa más.
     a      párrafos de la respuesta (**negrita** permitida)
     l      enlaces opcionales: [texto, url]
     next   ids de las sugerencias que aparecen después */
(function () {
  const PHONE = '34620477443';
  const WA = t => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;
  const LINK_WA = ['Hablar por WhatsApp', WA('Hola Guillermo, vengo de tu web y quería hacerte una consulta.')];

  const KB = [
    { id: 'hola', label: 'Hola', k: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey'],
      a: ['¡Hola! Soy el asistente automático de Guillermo. Puedo orientarte sobre servicios, plazos, mantenimiento y zonas de trabajo.', '¿Qué te gustaría saber?'], next: ['servicios', 'plazos', 'precio'] },
    { id: 'servicios', label: 'Servicios', k: ['servicio', 'ofreces', 'haces', 'tipos de web', 'nivel', 'que vendes', 'que puedes hacer', 'que hacen', 'que haceis'],
      a: ['Trabajo en tres niveles:', '**1. Web profesional / landing**: tu escaparate en Google, rápida y pensada para el móvil.', '**2. Web con base de datos y panel**: reservas o citas online y gestión de clientes.', '**3. Tienda online**: catálogo, carrito y pago con tarjeta con Stripe.'],
      l: [['Ver los servicios', 'index.html#servicios']], next: ['plazos', 'precio', 'demos'] },
    { id: 'precio', label: 'Precio', k: ['precio', 'cuesta', 'coste', 'presupuesto', 'tarifa', 'cobras', 'caro', 'barato', 'cuanto vale', 'cuanto cobras', 'cuanto me costaria', 'euros'],
      a: ['El precio depende del alcance: secciones, idiomas, reservas, pagos… Prefiero darte un **presupuesto cerrado y sin compromiso** después de que me cuentes tu proyecto, así no hay sorpresas.'],
      l: [['Montar mi ficha de proyecto', 'index.html#contacto'], LINK_WA], next: ['plazos', 'mantenimiento', 'servicios'] },
    { id: 'plazos', label: 'Plazos', k: ['plazo', 'tarda', 'tiempo', 'semanas', 'rapido', 'entrega', 'urgente', 'duracion', 'cuanto tardas', 'cuando estaria'],
      a: ['Orientativamente: **1–2 semanas** una web profesional o landing, **4–8 semanas** con base de datos y panel, y **4–10 semanas** una tienda online.', 'Depende de lo que necesites y de cuándo tengamos los textos y las fotos.'], next: ['precio', 'servicios', 'contacto'] },
    { id: 'seo', label: 'Salir en Google', k: ['google', 'seo', 'posicion', 'posicionar', 'posicionamiento', 'buscador', 'aparecer', 'visible', 'visibilidad', 'trafico', 'maps'],
      a: ['Cada web lleva SEO técnico y local: títulos, datos estructurados, velocidad, sitemap y textos pensados para búsquedas como «tu servicio + tu ciudad».', 'Nadie puede prometer el puesto número 1, pero sí dejarte con una base sólida para competir.'],
      l: [['Ejemplo de página local', 'alicante.html']], next: ['mantenimiento', 'zonas', 'precio'] },
    { id: 'mantenimiento', label: 'Mantenimiento', k: ['mantenimiento', 'mantener', 'actualizaciones', 'soporte', 'copias', 'seguridad', 'backup', 'despues de entregar', 'plan mensual'],
      a: ['Sí, ofrezco un **plan mensual** con actualizaciones, copias de seguridad, cambios de contenido y soporte.', 'Si prefieres encargarte tú, también te enseño a gestionarlo.'], next: ['editar', 'precio', 'contacto'] },
    { id: 'editar', label: 'Editarla yo mismo', k: ['editar', 'modificar', 'cambiar textos', 'yo mismo', 'por mi cuenta', 'gestionar yo', 'cambiar precios', 'cambiar fotos', 'sin programar'],
      a: ['En las webs con panel de gestión puedes cambiar cartas, productos, horarios o reservas tú mismo, **sin tocar código**.'], next: ['reservas', 'mantenimiento', 'demos'] },
    { id: 'reservas', label: 'Reservas online', k: ['reserva', 'reservas', 'reservar', 'cita', 'citas', 'agenda', 'turnos', 'calendario', 'mesa'],
      a: ['Sí: monto sistemas de **reservas o citas online** con aviso por email y un panel privado para gestionarlas.', 'Puedes probarlo en las demos del restaurante, la clínica, la barbería o el taller.'], l: [['Ver las demos', 'index.html#demos']], next: ['editar', 'precio', 'demos'] },
    { id: 'tienda', label: 'Tienda online', k: ['tienda', 'ecommerce', 'e-commerce', 'vender online', 'carrito', 'stripe', 'pago', 'pagos', 'tarjeta', 'cobrar', 'comprar'],
      a: ['Monto tiendas online con catálogo, carrito y **pago seguro con Stripe**, además de un panel para pedidos y stock.', 'Tienes una demo funcionando: Alicante Urban Store.'], l: [['Probar la demo de tienda', 'demos/tienda.html']], next: ['plazos', 'precio', 'mantenimiento'] },
    { id: 'zonas', label: 'Zonas de trabajo', k: ['donde', 'zona', 'zonas', 'alicante', 'elche', 'benidorm', 'san vicente', 'playa de san juan', 'provincia', 'ciudad', 'presencial', 'reunion', 'remoto', 'toda espana'],
      a: ['Mi zona es **Alicante, San Vicente del Raspeig, Elche, Playa de San Juan, Benidorm** y toda la provincia, con reuniones presenciales.', 'También trabajo en remoto con toda España.'], next: ['seo', 'contacto', 'servicios'] },
    { id: 'tecnologia', label: 'Tecnología', k: ['tecnologia', 'stack', 'java', 'spring', 'mysql', 'lenguaje', 'plantilla', 'framework', 'programado', 'como lo haces', 'jwt'],
      a: ['Programo a mano, con diseño propio y sin plantillas: **Java 21 y Spring Boot** para el servidor, **MySQL** para los datos, **JavaScript, HTML5 y CSS3** para la web, **JWT** para el acceso seguro y **Stripe** para los pagos.'], l: [['Ver el stack', 'index.html#sobre-mi']], next: ['sobre', 'demos', 'servicios'] },
    { id: 'demos', label: 'Ver demos', k: ['demo', 'demos', 'ejemplo', 'ejemplos', 'probar', 'muestra', 'portfolio', 'portafolio', 'referencias'],
      a: ['Tengo cinco demos funcionando, con reservas, carrito y más:'], l: [['Restaurante', 'demos/restaurante.html'], ['Tienda online', 'demos/tienda.html'], ['Clínica', 'demos/clinica.html'], ['Barbería', 'demos/barberia.html'], ['Taller', 'demos/taller.html']], next: ['reservas', 'tienda', 'precio'] },
    { id: 'contacto', label: 'Hablar con Guillermo', k: ['contacto', 'contactar', 'hablar', 'llamar', 'telefono', 'whatsapp', 'email', 'correo', 'escribir', 'persona', 'humano', 'guillermo', 'llamarte'],
      a: ['Puedes escribirme por **WhatsApp** al +34 620 477 443, por email o rellenar la ficha de proyecto y me llega ya con lo esencial.'], l: [LINK_WA, ['Ficha de proyecto', 'index.html#contacto'], ['Email', 'mailto:gomezlopezguille@gmail.com']], next: ['precio', 'plazos'] },
    { id: 'sobre', label: 'Quién eres', k: ['quien eres', 'quien es', 'formacion', 'experiencia', 'irlanda', 'titulo', 'estudios', 'sobre ti', 'levelup', 'curriculum'],
      a: ['Soy **Guillermo Gómez**, desarrollador Full-Stack en Alicante. Técnico Superior en Desarrollo de Aplicaciones Multiplataforma, con experiencia desarrollando software en Irlanda.'], l: [['Sobre mí', 'index.html#sobre-mi'], ['LinkedIn', 'https://www.linkedin.com/in/guillermo-g%C3%B3mez-l%C3%B3pez-84770b179/']], next: ['tecnologia', 'demos'] },
    { id: 'dominio', label: 'Dominio y hosting', k: ['dominio', 'hosting', 'alojamiento', 'servidor', 'publicar', 'publicacion', 'subir la web', 'nube'],
      a: ['Me encargo de configurar el dominio y la publicación de tu web. En las webs con base de datos también preparo el servidor en la nube.'], next: ['mantenimiento', 'precio'] },
    { id: 'idiomas', label: 'Varios idiomas', k: ['idioma', 'idiomas', 'ingles', 'multilingue', 'traduccion', 'traducir', 'frances', 'aleman'],
      a: ['Sí, puedo hacer la web en varios idiomas (por ejemplo español e inglés), algo muy útil en zonas turísticas como Benidorm o Playa de San Juan. Lo marcas como extra en la ficha de proyecto.'], l: [['Ficha de proyecto', 'index.html#contacto']], next: ['precio', 'seo'] },
    { id: 'privacidad', label: 'Privacidad', k: ['privacidad', 'datos', 'rgpd', 'cookies', 'legal', 'proteccion de datos', 'guardas'],
      a: ['Este sitio no usa cookies propias ni analítica, y este asistente funciona en tu navegador **sin enviar tus mensajes a ningún servidor**.', 'Más detalle en el aviso legal.'], l: [['Aviso legal y privacidad', 'legal.html']], next: ['contacto'] },
    { id: 'bot', label: '¿Eres una IA?', k: ['eres un bot', 'eres una ia', 'eres ia', 'inteligencia artificial', 'chatgpt', 'claude', 'robot', 'eres humano', 'eres una persona', 'bot'],
      a: ['Soy un asistente automático con respuestas preprogramadas: **no uso inteligencia artificial ni guardo tus mensajes**.', 'Para algo más concreto, lo mejor es hablar directamente con Guillermo.'], l: [LINK_WA], next: ['servicios', 'precio'] },
    { id: 'gracias', label: 'Gracias', k: ['gracias', 'genial', 'perfecto', 'adios', 'hasta luego', 'muchas gracias'],
      a: ['¡A ti! Si te surge otra duda, aquí estaré. Y si quieres seguir hablando de tu proyecto, escríbeme por WhatsApp.'], l: [LINK_WA], next: [] }
  ];
  const SUGGEST = ['servicios', 'plazos', 'precio', 'mantenimiento', 'zonas', 'contacto'];

  /* ---------- Motor de coincidencias ---------- */
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  function match(raw) {
    const text = ' ' + norm(raw) + ' ', toks = text.trim().split(' ');
    let best = null, top = 0;
    for (const e of KB) {
      let s = 0;
      for (const kw of e.k) {
        if (kw.includes(' ')) { if (text.includes(' ' + kw + ' ') || text.includes(' ' + kw)) s += 3; }
        else if (toks.some(t => t === kw || (kw.length >= 5 && t.startsWith(kw)))) s += 2;
      }
      if (s > top) { top = s; best = e; }
    }
    return top >= 2 ? best : null;
  }

  /* ---------- Interfaz ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const store = { get() { try { return JSON.parse(sessionStorage.getItem('gg-chat')) || { h: [], open: false }; } catch (e) { return { h: [], open: false }; } }, set(v) { try { sessionStorage.setItem('gg-chat', JSON.stringify(v)); } catch (e) {} } };
  const state = store.get();

  const launch = el('button', 'cb-launch'); launch.type = 'button'; launch.setAttribute('aria-expanded', 'false'); launch.setAttribute('aria-controls', 'cb-panel');
  launch.innerHTML = '<i></i><span>¿Dudas? Pregúntame</span>';
  const panel = el('section', 'cb-panel'); panel.id = 'cb-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Asistente automático de Guillermo'); panel.setAttribute('aria-hidden', 'true');
  const head = el('header', 'cb-head'); head.innerHTML = '<span><i></i>Asistente automático</span>';
  const close = el('button', 'cb-x', '×'); close.type = 'button'; close.setAttribute('aria-label', 'Cerrar asistente'); head.appendChild(close);
  const log = el('div', 'cb-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
  const form = el('form', 'cb-form'); form.autocomplete = 'off';
  const input = el('input'); input.type = 'text'; input.placeholder = 'Escribe tu duda…'; input.maxLength = 200; input.setAttribute('aria-label', 'Escribe tu duda');
  const send = el('button', null, '→'); send.type = 'submit'; send.setAttribute('aria-label', 'Enviar');
  form.append(input, send);
  const note = el('p', 'cb-note', 'Respuestas automáticas · no se guarda ni se envía nada');
  panel.append(head, log, form, note);
  document.body.append(launch, panel);

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function paragraphs(text) {
    const frag = document.createDocumentFragment();
    String(text).split('**').forEach((part, i) => { if (!part) return; const n = i % 2 ? el('strong', null, part) : document.createTextNode(part); frag.appendChild(n); });
    return frag;
  }
  function addMsg(who, paras, links, remember = true) {
    const m = el('div', 'cb-m ' + (who === 'u' ? 'u' : 'b'));
    paras.forEach(p => { const pe = el('p'); pe.appendChild(paragraphs(p)); m.appendChild(pe); });
    if (links && links.length) {
      const box = el('div', 'cb-links');
      links.forEach(([t, href]) => { const a = el('a', 'cb-link', t); a.href = href; if (/^https?:|^mailto:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } else a.addEventListener('click', () => setOpen(false)); box.appendChild(a); });
      m.appendChild(box);
    }
    log.appendChild(m); scroll();
    if (remember) { state.h.push({ w: who, p: paras, l: links || [] }); state.h = state.h.slice(-30); store.set(state); }
  }
  function chips(ids) {
    log.querySelectorAll('.cb-chips').forEach(n => n.remove());
    const list = ids.map(id => KB.find(e => e.id === id)).filter(Boolean);
    if (!list.length) return;
    const box = el('div', 'cb-chips');
    list.forEach(e => { const b = el('button', null, e.label); b.type = 'button'; b.addEventListener('click', () => ask(e.label, e)); box.appendChild(b); });
    log.appendChild(box); scroll();
  }
  let busy = false;
  function reply(entry, raw) {
    const t = el('div', 'cb-m b cb-typing'); t.innerHTML = '<i></i><i></i><i></i>'; t.setAttribute('aria-label', 'Escribiendo'); log.appendChild(t); scroll();
    const done = () => {
      t.remove();
      if (entry) { addMsg('b', entry.a, entry.l); chips(entry.next && entry.next.length ? entry.next : SUGGEST); }
      else {
        addMsg('b', ['No tengo una respuesta preparada para eso. Puedo ayudarte con estos temas, o puedes preguntarle directamente a Guillermo:'], [['Enviar mi duda por WhatsApp', WA('Hola Guillermo, vengo de tu web y tengo esta duda: ' + raw)]]);
        chips(SUGGEST);
      }
      busy = false; input.focus({ preventScroll: true });
    };
    reduce ? done() : setTimeout(done, 450 + Math.random() * 350);
  }
  function ask(text, entry) {
    if (busy || !text.trim()) return; busy = true;
    log.querySelectorAll('.cb-chips').forEach(n => n.remove());
    addMsg('u', [text.trim()]);
    reply(entry || match(text), text.trim());
  }
  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; ask(v); });

  function setOpen(open) {
    panel.classList.toggle('open', open); panel.setAttribute('aria-hidden', String(!open)); launch.setAttribute('aria-expanded', String(open)); launch.classList.toggle('on', open);
    state.open = open; store.set(state);
    if (open) { if (!log.childElementCount) start(); setTimeout(() => { input.focus({ preventScroll: true }); scroll(); }, 60); }
  }
  function start() {
    if (state.h.length) { state.h.forEach(m => addMsg(m.w, m.p, m.l, false)); chips(SUGGEST); }
    else { const hi = KB[0]; addMsg('b', hi.a); chips(hi.next.concat(['contacto'])); }
  }
  launch.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  close.addEventListener('click', () => { setOpen(false); launch.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); launch.focus(); } });
  if (state.open) setOpen(true);
})();
