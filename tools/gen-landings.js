/* Generador de las landings de SEO local (una por ciudad), la página legal y el sitemap.
   Uso, desde la raíz del proyecto:  node tools/gen-landings.js
   Para añadir una ciudad, añade un objeto al array `cities` (texto propio: no dupliques contenido). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://guillegomezlopez3.github.io/portfolio-web-alicante';
const cities = [
 { slug: 'alicante', name: 'Alicante', title: 'Programas de gestión y webs para negocios en Alicante',
  desc: 'Programas a medida para llevar tu negocio en Alicante (clientes, citas, facturas, stock), citas online, tiendas y webs. Explicado sin tecnicismos, con reunión en tu local.',
  lead: 'Alicante tiene comercio, hostelería, clínicas, talleres y despachos de todo tipo. Casi todos comparten el mismo problema: llevar el negocio con libretas, hojas de Excel y mensajes sueltos. Un programa hecho a tu medida lo junta todo en un solo sitio, y te lo explico sin palabras raras.',
  local: ['Si tienes un taller, clínica, academia o comercio en Alicante, te preparo un programa donde están tus clientes, sus citas, tus facturas y tu stock. Lo ves desde el ordenador o el móvil, tú y tu equipo.', 'Si recibes llamadas para pedir cita o reservar mesa, puedes dejar que tus clientes reserven solos desde el móvil, a cualquier hora, y que el programa les avise para que no se olviden.', 'Y si quieres que te encuentren en el centro, el Puerto o el Postiguet cuando alguien busca tu servicio, preparo también tu web y tu ficha de Google para que coincidan en nombre, dirección y horarios.'],
  faq: [['No sé de informática, ¿puedo trabajar contigo en Alicante?', 'Sí, es lo normal. Me reúno contigo en tu local, me cuentas cómo trabajas y yo me encargo de la parte técnica, explicándotelo sin jerga.'], ['¿Qué es un programa de gestión?', 'Una sola herramienta donde llevas clientes, citas, facturas, stock y pedidos, hecha a medida de tu negocio. Sustituye a las libretas y los Excel sueltos.'], ['¿Cuánto tarda y cuánto cuesta?', 'Una web suele estar en 1-2 semanas y un programa de gestión desde 4. El precio depende de lo que necesites: te hago un presupuesto cerrado, por escrito y sin compromiso.']] },
 { slug: 'elche', name: 'Elche', title: 'Programas de gestión y webs para empresas y comercios de Elche',
  desc: 'Programas a medida para empresas de Elche: pedidos, stock, facturas y clientes en un solo sitio. También tiendas online y webs. Calzado, industria y comercio.',
  lead: 'Elche tiene una industria del calzado muy potente, polígonos con cientos de empresas, comercio y hostelería. Muchas llevan años trabajando con Excel y papeles que ya se les quedan cortos. Un programa a medida ordena pedidos, stock y facturas sin cambiar tu forma de trabajar.',
  local: ['Si fabricas o vendes calzado, el programa controla modelos, tallas y existencias, y ves de un vistazo qué hay en el almacén y qué te piden. Puede conectarse a una tienda online para vender también por Internet.', 'Si tienes una empresa en un polígono o en el Parque Empresarial, te preparo presupuestos, albaranes y facturas en pocos clics, con ficha de cada cliente y proveedor, y pasamos tus Excel actuales al sistema nuevo.', 'Y si tienes un comercio o un bar en el centro o cerca del Palmeral, una web sencilla y tu ficha de Google bien puesta hacen que te encuentren cuando alguien busca en Elche.'],
  faq: [['¿Puedes pasar mis Excel de pedidos y stock a un programa?', 'Sí. Importo tus datos actuales y reviso contigo que está todo antes de empezar a usarlo.'], ['¿Se puede conectar con una tienda online?', 'Sí. La tienda y el programa comparten stock y pedidos, para no apuntar nada dos veces.'], ['¿Atiendes a negocios de Elche en persona?', 'Sí, me desplazo a Elche para la primera reunión y las entregas importantes.']] },
 { slug: 'san-vicente-del-raspeig', name: 'San Vicente del Raspeig', title: 'Programas de gestión y webs para negocios en San Vicente del Raspeig',
  desc: 'Programas a medida, citas online y webs para comercios, academias, clínicas y empresas de San Vicente del Raspeig. Explicado sin tecnicismos.',
  lead: 'San Vicente del Raspeig es una ciudad joven y activa, pegada a Alicante y con el campus de la Universidad. Hay muchos negocios de barrio, academias, clínicas y pymes del polígono Canastell que siguen llevándolo todo a mano. Con un programa a medida ganas horas cada semana.',
  local: ['Si tienes una academia o un centro de formación, el programa lleva alumnos, grupos, cobros y asistencia, y los alumnos se apuntan solos desde el móvil, también fuera de tu horario.', 'Si tienes un negocio de barrio (peluquería, clínica, taller, tienda), las citas online y un programa con tus clientes y facturas te quitan el teléfono de encima y los papeles de en medio.', 'Si tu empresa está en el polígono Canastell o alrededores, preparo el control de pedidos, stock y facturación, y una web con formulario de presupuesto para que te encuentren en San Vicente.'],
  faq: [['¿Merece la pena un programa a medida si mi negocio es pequeño?', 'Sí. De hecho es donde más se nota: pasas de apuntarlo todo a mano a tener clientes, citas y facturas en un solo sitio, y ahorras horas cada semana.'], ['¿Haces programas para academias?', 'Sí: alumnos, grupos, horarios, cobros e inscripción online.'], ['¿Puedo reunirme contigo en San Vicente?', 'Sí, está a pocos minutos de Alicante y me desplazo sin problema.']] },
 { slug: 'playa-de-san-juan', name: 'Playa de San Juan', title: 'Programas de reservas, gestión y webs para negocios en Playa de San Juan',
  desc: 'Reservas online, programa de gestión y webs para restaurantes, apartamentos turísticos y negocios de Playa de San Juan, también en varios idiomas.',
  lead: 'Playa de San Juan vive del paseo marítimo, las terrazas y el turismo de temporada. En temporada alta no hay tiempo para apuntar reservas ni cuadrar cuentas a mano: un buen programa te ordena el servicio y una web multilingüe trae clientes.',
  local: ['Si tienes un restaurante o chiringuito, tus clientes pueden reservar mesa desde el móvil y tú ves las reservas del día y el aforo en una pantalla, sin atender llamadas en hora punta.', 'Si alquilas apartamentos, un programa con calendario de reservas y datos de huéspedes, y una web propia, reducen lo que pagas en comisiones a plataformas externas.', 'Si tienes una tienda o escuela de actividades de la zona, una web en español, inglés y francés, y un programa para llevar clientes y reservas, te ayudan a atender al turismo con menos trabajo.'],
  faq: [['¿Puedo tener las reservas de mi restaurante online?', 'Sí, con aviso automático al cliente y una pantalla para ti con todas las reservas del día, como en mi ejemplo del gastrobar.'], ['¿Puede estar en varios idiomas?', 'Sí. En una zona turística como Playa de San Juan es muy recomendable.'], ['¿Se adapta a la temporada alta?', 'Sí: horarios especiales, aforo y reservas limitadas por franja, todo desde tu panel.']] },
 { slug: 'benidorm', name: 'Benidorm', title: 'Programas de gestión, reservas y webs multilingües en Benidorm',
  desc: 'Programas de gestión, reservas online y webs en varios idiomas para negocios de Benidorm: hostelería, ocio y comercio.',
  lead: 'Benidorm recibe visitantes de Reino Unido, Países Bajos, países nórdicos y de toda España, y atiende a muchos residentes extranjeros todo el año. Su público no busca solo en castellano, y la competencia es alta: ordenar tu negocio por dentro y hacerlo visible por fuera marca la diferencia.',
  local: ['Si tienes un bar, restaurante o local de ocio en Levante, Poniente o el casco antiguo, el programa te lleva reservas, pedidos y caja, y una web en inglés y castellano te trae clientes sin depender solo de plataformas.', 'Si das servicio a residentes extranjeros (academias de idiomas, gestorías, clínicas), un programa con citas online y avisos automáticos, y tu web en inglés, te abren un público que casi nadie atiende bien.', 'Si tienes una tienda, una tienda online con envíos y pago con tarjeta, conectada con tu stock, permite seguir vendiendo fuera de temporada.'],
  faq: [['¿Haces webs y programas en inglés para Benidorm?', 'Sí. Puedo hacerlos en varios idiomas, con los textos adaptados a cada uno.'], ['¿Puedo recibir reservas directamente, sin comisiones?', 'Sí, con sistema de reservas propio y aviso por email, sin pagar comisión por cada reserva.'], ['¿Trabajas con negocios de Benidorm en persona?', 'Sí, la provincia de Alicante es mi zona de trabajo habitual.']] }
];

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const WA = t => 'https://wa.me/34620477443?text=' + encodeURIComponent(t);
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap';

const header = () => `<header class="top">
  <a href="index.html#inicio" class="brand">DigitalSolutionsCMV <small>Programas · Alicante</small></a>
  <nav class="nav mono" aria-label="Principal">
    <a href="index.html#servicios"><sup>01</sup>Servicios</a><a href="index.html#demos"><sup>02</sup>Demos</a><a href="index.html#sobre-mi"><sup>03</sup>Sobre mí</a><a href="index.html#faq"><sup>04</sup>FAQ</a><a href="index.html#contacto"><sup>05</sup>Contacto</a>
  </nav>
  <div class="top-r"><span class="mono" id="clock" aria-label="Hora en Alicante">--:--:--</span><a class="pill mono" href="index.html#contacto">Escríbeme ↗</a><button class="pill mono menu-btn" id="menu-btn" aria-expanded="false" aria-controls="sheet">Menú</button></div>
</header>
<div class="sheet" id="sheet" aria-hidden="true"><nav aria-label="Menú móvil">
  <a href="index.html#servicios"><sup>01</sup>Servicios</a><a href="index.html#demos"><sup>02</sup>Demos</a><a href="index.html#sobre-mi"><sup>03</sup>Sobre mí</a><a href="index.html#faq"><sup>04</sup>FAQ</a><a href="index.html#contacto"><sup>05</sup>Contacto</a></nav>
  <p class="mono">+34 620 477 443 · Alicante</p></div>`;

const footer = (current) => `<footer class="foot">
  <div class="foot-g">
    <div><h4 class="mono">Contacto</h4><ul><li><a href="tel:+34620477443">+34 620 477 443</a></li><li><a href="index.html#contacto">Formulario de proyecto</a></li><li>Alicante, España</li></ul></div>
    <div><h4 class="mono">Trabajo en</h4><ul>${cities.filter(c => c.slug !== current).map(c => `<li><a href="${c.slug}.html">${c.name}</a></li>`).join('')}<li><a href="index.html">Inicio</a></li></ul></div>
    <div><h4 class="mono">Demos</h4><ul><li><a href="demos/restaurante.html">Restaurante</a></li><li><a href="demos/tienda.html">Tienda online</a></li><li><a href="demos/clinica.html">Clínica</a></li><li><a href="demos/barberia.html">Barbería</a></li><li><a href="demos/taller.html">Taller</a></li></ul></div>
  </div>
  <div class="foot-end mono"><span>© DigitalSolutionsCMV · Guillermo Gómez López</span><a href="legal.html">Aviso legal, privacidad y cookies</a></div>
</footer>`;

const shell = ({ title, desc, canonical, ld, body, robots }) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="${robots || 'index, follow'}">
  <meta name="theme-color" content="#eeebe2">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="es_ES">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/chatbot.css">
  ${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body>
${header()}
${body}
<script src="js/main.js"></script>
<script src="js/chatbot.js" defer></script>
</body>
</html>
`;

for (const c of cities) {
  const url = `${BASE}/${c.slug}.html`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `DigitalSolutionsCMV – Programas de gestión y webs en ${c.name}`, url, telephone: '+34620477443', areaServed: { '@type': 'City', name: c.name }, address: { '@type': 'PostalAddress', addressRegion: 'Alicante', addressCountry: 'ES' }, parentOrganization: { '@type': 'ProfessionalService', url: BASE + '/' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }];
  const long = c.name.length > 12;
  const body = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Programas y webs / ${c.name}</p>
  <h1 class="h1" style="margin-top:1.4rem${long ? ';font-size:clamp(2.4rem,6.6vw,7.4rem)' : ''}"><span class="ln"><span>Programas y webs</span></span><span class="ln"><span>en <em>${c.name}</em>.</span></span></h1>
  <p class="lead">${c.lead}</p>
</section>
<section class="sec" style="padding-top:2rem">
  <div class="sec-h rv"><span class="no mono">(01)</span><h2>Qué puedo hacer por tu negocio en ${c.name}</h2></div>
  <div class="need">${c.local.map((p, i) => `<div class="rv"><b>0${i + 1}</b><p>${p}</p></div>`).join('')}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(02)</span><h2>Servicios en ${c.name}</h2><p>Pruébalo tú mismo en los <a href="index.html#demos">ejemplos</a>: restaurante, tienda, clínica, barbería y taller.</p></div>
  <ul class="svc-l">${[`Programa de gestión a medida (clientes, facturas, stock)`, `Citas y reservas online`, `Tienda online`, `Pasar Excel y papeles a un programa`, `Web y posicionamiento en Google`].map((s, i) => `<li class="rv"><span>0${i + 1}</span>${s} en ${c.name}</li>`).join('')}</ul>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(03)</span><h2>Preguntas frecuentes en ${c.name}</h2></div>
  <div class="faq-l">${c.faq.map(([q, a], i) => `<details class="rv"${i === 0 ? ' open' : ''}><summary><span>0${i + 1}</span>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <a class="cta-big" href="${WA('Hola, tengo un negocio en ' + c.name + ' y quiero hablar con DigitalSolutionsCMV')}" target="_blank" rel="noopener"><span class="mono">Presupuesto sin compromiso</span><span>Cuéntame tu negocio en ${c.name} ↗</span></a>
</section>
</main>
${footer(c.slug)}`;
  fs.writeFileSync(path.join(ROOT, `${c.slug}.html`), shell({ title: `${c.title} | DigitalSolutionsCMV`, desc: c.desc, canonical: url, ld, body }));
}

/* Página legal */
const legal = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Legal</p>
  <h1 class="h1" style="margin-top:1.4rem;font-size:clamp(2.4rem,7vw,7.4rem)"><span class="ln"><span>Aviso legal,</span></span><span class="ln"><span><em>privacidad</em> y cookies.</span></span></h1>
</section>
<section class="sec prose" style="padding-top:1rem">
  <h2 id="aviso">Aviso legal</h2>
  <p>En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que el titular de este sitio web, que opera bajo el nombre comercial DigitalSolutionsCMV, es Guillermo Gómez López, con domicilio en Alicante (España). NIF: <strong>[pendiente de completar por el titular]</strong>. Teléfono: +34 620 477 443.</p>
  <p>Los contenidos de este sitio tienen carácter informativo. Las demos (restaurante, tienda, clínica, barbería y taller) son ejemplos ficticios: los negocios, direcciones, precios y reseñas que aparecen no son reales y las reservas, citas y compras son simulaciones que no envían ningún dato.</p>
  <h2 id="privacidad">Política de privacidad</h2>
  <p><strong>Responsable:</strong> Guillermo Gómez López. <strong>Finalidad:</strong> atender las consultas y solicitudes de presupuesto. <strong>Base jurídica:</strong> consentimiento del interesado (art. 6.1.a RGPD).</p>
  <p>El formulario de proyecto no almacena datos en ningún servidor: al enviarlo se abre WhatsApp con el mensaje preparado, y los datos pasan a regirse por la política de WhatsApp. Si me escribes por email o WhatsApp, conservaré tus datos mientras dure la relación o la consulta.</p>
  <p>No cedo datos a terceros salvo obligación legal. Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo por WhatsApp al +34 620 477 443, y reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
  <h2 id="cookies">Política de cookies</h2>
  <p>Este sitio no utiliza cookies propias, ni de analítica ni de publicidad. Las demos guardan datos de uso (por ejemplo el carrito o una reserva simulada) en el almacenamiento local de tu navegador (<code>localStorage</code>) y el asistente automático recuerda la conversación mientras dura la sesión (<code>sessionStorage</code>), únicamente para su funcionamiento: nada de esto se envía a ningún servidor.</p>
  <p>Para cargar recursos, el sitio se sirve desde GitHub Pages y utiliza Google Fonts e imágenes de Unsplash, cuyos proveedores pueden registrar datos técnicos como tu dirección IP al servir estos archivos. Puedes configurar tu navegador para bloquear o eliminar cookies y almacenamiento local en cualquier momento.</p>
</section>
</main>
${footer('')}`;
fs.writeFileSync(path.join(ROOT, 'legal.html'), shell({ title: 'Aviso legal, privacidad y cookies | DigitalSolutionsCMV', desc: 'Aviso legal, política de privacidad y política de cookies de la web de DigitalSolutionsCMV.', canonical: BASE + '/legal.html', body: legal }));

const urls = ['', ...cities.map(c => c.slug + '.html'), 'demos/restaurante.html', 'demos/tienda.html', 'demos/clinica.html', 'demos/barberia.html', 'demos/taller.html', 'legal.html'];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${BASE}/${u}</loc><lastmod>2026-11-20</lastmod><priority>${u === '' ? '1.0' : u === 'legal.html' ? '0.3' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
