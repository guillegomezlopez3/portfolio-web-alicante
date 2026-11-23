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
  const LINK_WA = ['Hablar por WhatsApp', WA('Hola, vengo de la web de DigitalSolutionsCMV y quería hacerte una consulta.')];

  const KB = [
    { id: 'hola', label: 'Hola', k: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey'],
      a: ['¡Hola! Soy el asistente automático de DigitalSolutionsCMV. Te cuento en lenguaje normal qué podemos hacer por tu negocio: programas para llevarlo todo ordenado, citas online, tienda o web.', '¿Qué te gustaría saber?'], next: ['servicios', 'nosenada', 'precio'] },
    { id: 'servicios', label: '¿Qué hacéis?', k: ['servicio', 'servicios', 'ofreces', 'ofreceis', 'haces', 'haceis', 'que vendes', 'que puedes hacer', 'que hacen', 'a que te dedicas', 'en que consiste'],
      a: ['Cinco cosas, explicadas fácil:', '**1. Un programa para llevar tu negocio**: clientes, facturas, stock y pedidos en un solo sitio.', '**2. Citas y reservas online**: tus clientes reservan solos.', '**3. Tienda online**: vendes por Internet con pago con tarjeta.', '**4. Pasar tus Excel o papeles a un programa** y automatizar tareas.', '**5. Web y Google**: que te encuentren cuando te busquen.'],
      l: [['Ver los servicios', 'index.html#servicios']], next: ['gestion', 'plazos', 'precio'] },
    { id: 'gestion', label: 'Programa de gestión', k: ['erp', 'gestion', 'programa de gestion', 'software', 'programa a medida', 'a medida', 'facturas', 'factura', 'facturacion', 'stock', 'inventario', 'almacen', 'clientes', 'informes', 'crm', 'llevar mi negocio'],
      a: ['Un **programa de gestión** (los grandes lo llaman ERP) es una sola herramienta donde tienes tus clientes, citas, facturas, presupuestos y lo que te queda en el almacén. Lo hago **a tu medida**: solo lleva lo que tú necesitas, con tus palabras y tu forma de trabajar.', 'Se usa desde el ordenador, la tablet o el móvil, y cada empleado ve solo lo suyo.'],
      l: [['Programa de gestión a medida', 'programa-de-gestion-a-medida.html'], ['Probar el ejemplo de gestión', 'demos/gestion.html'], ['Probar el ejemplo de inventario', 'demos/inventario.html'], ['Contarle mi caso', 'index.html#contacto']], next: ['excel', 'plazos', 'precio'] },
    { id: 'excel', label: 'Tengo todo en Excel', k: ['excel', 'papel', 'libreta', 'hojas de calculo', 'pasar datos', 'importar', 'programa antiguo', 'programa viejo', 'automatizar', 'automatico', 'repetitivo', 'conectar'],
      a: ['No empiezas de cero: **paso tus Excel, listados o datos antiguos** al programa nuevo y lo reviso contigo para que esté todo.', 'También puedo **automatizar tareas repetitivas** (facturas, avisos a clientes, informes) y conectar programas que hoy no se hablan entre sí.'], next: ['gestion', 'precio', 'contacto'] },
    { id: 'nosenada', label: 'No sé de informática', k: ['no se de informatica', 'no entiendo', 'no se nada', 'soy novato', 'tecnico', 'complicado', 'dificil', 'no se usar', 'es dificil', 'mayor', 'sin conocimientos', 'informatica'],
      a: ['Tranquilo/a, es lo normal. **No necesitas saber nada**: me cuentas cómo trabajas hoy con tus palabras y yo me encargo de la parte técnica.', 'Te enseño cómo va quedando, te explico cómo usarlo sin jerga y, si te atascas, me llamas a mí.'], next: ['soporte', 'precio', 'contacto'] },
    { id: 'precio', label: 'Precio', k: ['precio', 'precios', 'cuesta', 'coste', 'presupuesto', 'tarifa', 'cobras', 'caro', 'barato', 'cuanto vale', 'cuanto cobras', 'cuanto me costaria', 'euros', 'pagar', 'cuota'],
      a: ['Depende de lo que necesites. Prefiero darte un **presupuesto cerrado, por escrito y sin compromiso** después de una primera charla gratuita, así sabes lo que pagas antes de empezar y no hay sorpresas.', 'Ojo: un programa a medida no lleva cuota mensual por usuario como los genéricos; solo pagas si quieres el plan de soporte.'],
      l: [['Montar mi ficha', 'index.html#contacto'], LINK_WA], next: ['plazos', 'soporte', 'servicios'] },
    { id: 'plazos', label: 'Plazos', k: ['plazo', 'plazos', 'tarda', 'tardais', 'cuanto tiempo', 'semanas', 'rapido', 'entrega', 'urgente', 'duracion', 'cuanto tardas', 'cuando estaria'],
      a: ['Orientativamente: **1–2 semanas** una web, **3–6** citas y reservas, **4–10** una tienda online y **desde 4 semanas** un programa de gestión, según su tamaño.', 'En programas grandes empezamos por lo más urgente y vamos ampliando, para que lo uses cuanto antes.'], next: ['precio', 'servicios', 'contacto'] },
    { id: 'seo', label: 'Salir en Google', k: ['google', 'seo', 'posicion', 'posicionar', 'posicionamiento', 'buscador', 'aparecer', 'visible', 'visibilidad', 'trafico', 'maps', 'que me encuentren'],
      a: ['Si haces una web conmigo la dejo preparada para que te encuentren cuando busquen «tu servicio + tu ciudad», y te ayudo con tu ficha de Google.', 'Nadie puede prometer el puesto número 1, pero sí dejarte con una buena base para competir.'],
      l: [['Ejemplo de página local', 'alicante.html']], next: ['soporte', 'zonas', 'precio'] },
    { id: 'soporte', label: 'Soporte y mantenimiento', k: ['mantenimiento', 'mantener', 'actualizaciones', 'soporte', 'copias', 'seguridad', 'backup', 'despues de entregar', 'plan mensual', 'si falla', 'se rompe', 'ayuda despues', 'cambios'],
      a: ['Si algo falla o necesitas un cambio, **me llamas a mí**. Tengo un **plan mensual** con soporte, copias de seguridad y mejoras, o me pides los cambios puntuales cuando los necesites.'], next: ['datos', 'precio', 'contacto'] },
    { id: 'datos', label: 'Seguridad de mis datos', k: ['seguridad de mis datos', 'datos seguros', 'seguro', 'privacidad', 'datos', 'rgpd', 'cookies', 'legal', 'proteccion de datos', 'guardas', 'confidencial', 'contrasena'],
      a: ['Cada persona entra con su **usuario y contraseña** y ve solo lo que le corresponde. Se hacen **copias de seguridad** y se cumple la normativa de protección de datos (RGPD).', 'Y este asistente funciona en tu navegador **sin enviar tus mensajes a ningún sitio**.'], l: [['Aviso legal y privacidad', 'legal.html']], next: ['soporte', 'contacto'] },
    { id: 'reservas', label: 'Citas y reservas online', k: ['reserva', 'reservas', 'reservar', 'reserven', 'reservan', 'online', 'cita', 'citas', 'agenda', 'turnos', 'calendario', 'mesa'],
      a: ['Tus clientes **reservan solos desde el móvil**, a cualquier hora. Tú ves la agenda del día y el programa les avisa para que no se olviden. Se acabó el teléfono sonando mientras trabajas.', 'Puedes probarlo en las demos del restaurante, la clínica, la barbería o el taller.'], l: [['Ver los ejemplos', 'index.html#demos']], next: ['tienda', 'precio', 'demos'] },
    { id: 'tienda', label: 'Tienda online', k: ['tienda', 'ecommerce', 'e-commerce', 'vender online', 'vender por internet', 'vendeis', 'vender', 'por internet', 'carrito', 'stripe', 'pago', 'pagos', 'tarjeta', 'cobrar', 'comprar'],
      a: ['Monto tiendas online con catálogo, carrito y **pago seguro con tarjeta**. Los pedidos y el stock se actualizan solos y los ves en tu panel.', 'Tienes un ejemplo funcionando: Alicante Urban Store.'], l: [['Crear una tienda online', 'tienda-online-alicante.html'], ['Probar la tienda de ejemplo', 'demos/tienda.html']], next: ['plazos', 'precio', 'gestion'] },
    { id: 'web', label: 'Solo quiero una web', k: ['web', 'pagina web', 'pagina', 'landing', 'sitio web', 'escaparate'],
      a: ['Claro: una **web propia**, no plantilla, que carga rápido, se ve bien en el móvil y deja claro qué haces y cómo contactarte. Dominio y publicación incluidos. Suele estar lista en 1–2 semanas.'], l: [['Páginas web en Alicante', 'paginas-web-alicante.html'], ['Ver todos los servicios', 'index.html#servicios']], next: ['seo', 'precio', 'plazos'] },
    { id: 'zonas', label: 'Zonas de trabajo', k: ['donde', 'zona', 'zonas', 'alicante', 'elche', 'benidorm', 'san vicente', 'playa de san juan', 'provincia', 'ciudad', 'presencial', 'reunion', 'remoto', 'toda espana'],
      a: ['Trabajo en **Alicante, San Vicente del Raspeig, Elche, Playa de San Juan, Benidorm** y toda la provincia, con reuniones en tu local.', 'También en remoto con toda España.'], next: ['seo', 'contacto', 'servicios'] },
    { id: 'tecnologia', label: 'Con qué lo haces', k: ['tecnologia', 'stack', 'java', 'spring', 'mysql', 'lenguaje', 'plantilla', 'framework', 'programado', 'como lo haces', 'jwt'],
      a: ['Para curiosos: lo programo a mano con **Java, Spring Boot y MySQL**, tecnologías muy fiables que usan las grandes empresas. Para ti, lo importante es que va rápido, es seguro y es **tuyo**.'], next: ['sobre', 'demos', 'servicios'] },
    { id: 'demos', label: 'Ver ejemplos', k: ['demo', 'demos', 'ejemplo', 'ejemplos', 'probar', 'muestra', 'portfolio', 'portafolio', 'referencias'],
      a: ['Tengo siete ejemplos que puedes tocar y probar. Los dos primeros son de programas de gestión; el resto, de webs con reservas y tienda:'], l: [['Programa de gestión (facturas, clientes)', 'demos/gestion.html'], ['Inventario y almacén', 'demos/inventario.html'], ['Restaurante', 'demos/restaurante.html'], ['Tienda online', 'demos/tienda.html'], ['Clínica', 'demos/clinica.html'], ['Barbería', 'demos/barberia.html'], ['Taller', 'demos/taller.html']], next: ['reservas', 'tienda', 'precio'] },
    { id: 'contacto', label: 'Hablar con una persona', k: ['contacto', 'contactar', 'hablar', 'llamar', 'telefono', 'whatsapp', 'email', 'correo', 'escribir', 'persona', 'humano', 'guillermo', 'llamarte'],
      a: ['Puedes escribirme por **WhatsApp** al +34 620 477 443, por email, o rellenar la ficha de la web y me llega ya con lo esencial. Te llamo cuando te venga bien.'], l: [LINK_WA, ['Ficha de proyecto', 'index.html#contacto'], ['Email', 'mailto:guillermogomez@digitalsolutionscmv.es']], next: ['precio', 'plazos'] },
    { id: 'sobre', label: '¿Quién hay detrás?', k: ['quien eres', 'quien es', 'quien sois', 'quienes sois', 'quienes son', 'formacion', 'experiencia', 'irlanda', 'titulo', 'estudios', 'sobre ti', 'levelup', 'curriculum', 'digitalsolutionscmv', 'empresa'],
      a: ['**DigitalSolutionsCMV** es el estudio de **Guillermo Gómez**, programador en Alicante. Técnico Superior en Desarrollo de Aplicaciones Multiplataforma, con experiencia desarrollando software en Irlanda.', 'No es una gran empresa con letra pequeña: hablas directamente con la persona que hace el trabajo.'], l: [['Quién está detrás', 'index.html#sobre-mi'], ['LinkedIn', 'https://www.linkedin.com/in/guillermo-g%C3%B3mez-l%C3%B3pez-84770b179/']], next: ['tecnologia', 'demos'] },
    { id: 'dominio', label: 'Dominio y hosting', k: ['dominio', 'hosting', 'alojamiento', 'servidor', 'publicar', 'publicacion', 'subir la web', 'nube'],
      a: ['Me encargo del dominio (la dirección de tu web), del alojamiento y de la publicación. En los programas de gestión también dejo preparado el servidor en la nube.'], next: ['soporte', 'precio'] },
    { id: 'idiomas', label: 'Varios idiomas', k: ['idioma', 'idiomas', 'ingles', 'multilingue', 'traduccion', 'traducir', 'frances', 'aleman'],
      a: ['Sí, puedo hacerlo en varios idiomas (por ejemplo español e inglés), muy útil en zonas turísticas como Benidorm o Playa de San Juan.'], l: [['Ficha de proyecto', 'index.html#contacto']], next: ['precio', 'seo'] },
    { id: 'bot', label: '¿Eres una IA?', k: ['eres un bot', 'eres una ia', 'eres ia', 'inteligencia artificial', 'chatgpt', 'claude', 'robot', 'eres humano', 'eres una persona', 'bot'],
      a: ['Soy un asistente automático con respuestas preprogramadas: **no uso inteligencia artificial ni guardo tus mensajes**.', 'Para algo más concreto, lo mejor es hablar directamente con Guillermo.'], l: [LINK_WA], next: ['servicios', 'precio'] },
    { id: 'gracias', label: 'Gracias', k: ['gracias', 'genial', 'perfecto', 'adios', 'hasta luego', 'muchas gracias'],
      a: ['¡A ti! Si te surge otra duda, aquí estaré. Y si quieres hablar de tu negocio, escríbeme por WhatsApp.'], l: [LINK_WA], next: [] }
  ];
  const SUGGEST = ['servicios', 'gestion', 'precio', 'plazos', 'soporte', 'contacto'];

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
  const panel = el('section', 'cb-panel'); panel.id = 'cb-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Asistente automático de DigitalSolutionsCMV'); panel.setAttribute('aria-hidden', 'true');
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
        addMsg('b', ['No tengo una respuesta preparada para eso. Puedo ayudarte con estos temas, o puedes preguntarle directamente a Guillermo, que te responde en persona:'], [['Enviar mi duda por WhatsApp', WA('Hola, vengo de la web de DigitalSolutionsCMV y tengo esta duda: ' + raw)]]);
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
