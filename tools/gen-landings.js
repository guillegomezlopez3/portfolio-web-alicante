/* Generador de las landings de SEO local (una por ciudad), la página legal y el sitemap.
   Uso, desde la raíz del proyecto:  node tools/gen-landings.js
   Para añadir una ciudad, añade un objeto al array `cities` (texto propio: no dupliques contenido). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://guillegomezlopez3.github.io/portfolio-web-alicante';
const cities = [
 { slug: 'alicante', name: 'Alicante', title: 'Diseño web en Alicante: páginas web y tiendas online para negocios',
  desc: 'Desarrollador web en Alicante capital. Páginas web rápidas, sistemas de reservas y tiendas online para comercios, restaurantes y clínicas del centro, el Puerto y el Postiguet.',
  lead: 'Alicante concentra comercio, hostelería, servicios profesionales y turismo durante todo el año. Quien busca "restaurante cerca del puerto" o "fisioterapeuta en el centro" decide en segundos con el móvil, y tu web tiene que estar en ese momento y cargar al instante.',
  local: ['Para negocios del centro, el Barrio y la zona de la Explanada, trabajo la ficha de Google Business Profile y la web para que coincidan en nombre, dirección y horarios, algo clave en SEO local.', 'Si tu clientela mezcla vecinos y visitantes, preparo la web en castellano e inglés, con reservas online y botón directo de WhatsApp.', 'Para despachos, clínicas y academias de Alicante capital, la prioridad es la cita previa online y una página clara de cada servicio que pueda posicionar por sí sola.'],
  faq: [['¿Trabajas presencialmente en Alicante capital?', 'Sí. Vivo y trabajo en la provincia, así que puedo reunirme en tu local para entender el negocio antes de diseñar nada.'], ['¿Cuánto tarda una web para un negocio de Alicante?', 'Una web profesional suele estar lista en 1-2 semanas; con reservas o panel de gestión, entre 4 y 8 semanas.'], ['¿Cómo mejoro mi posición en Google en Alicante?', 'Con una web veloz, títulos y textos que mencionen tu servicio y la ciudad, datos estructurados, una ficha de Google Business Profile cuidada y reseñas reales.']] },
 { slug: 'elche', name: 'Elche', title: 'Diseño web en Elche: páginas web, e-commerce y paneles de gestión',
  desc: 'Programador web para empresas y comercios de Elche: webs corporativas, tiendas online y sistemas de gestión a medida. Calzado, industria y servicios.',
  lead: 'Elche tiene un tejido empresarial muy marcado: la industria del calzado y sus proveedores, polígonos industriales, comercio y un sector turístico que gira en torno al Palmeral, Patrimonio de la Humanidad. Cada uno necesita un tipo de web distinto.',
  local: ['Para fabricantes y marcas de calzado, la tienda online con pasarela de pago Stripe y gestión de stock por tallas y modelos permite vender sin depender de intermediarios.', 'Para empresas de los polígonos y del Parque Empresarial, una web corporativa clara, con catálogo, formulario de presupuesto y posicionamiento para búsquedas B2B, suele traer más contactos que un folleto.', 'Para comercios y hostelería del centro y de la zona del Palmeral, una web rápida con ficha de Google bien trabajada hace que te encuentren cuando alguien busca en Elche.'],
  faq: [['¿Haces tiendas online para empresas de calzado de Elche?', 'Sí. Catálogo con variantes de talla y color, carrito, cobro con Stripe y panel de pedidos y stock.'], ['¿Puedo tener un panel para gestionar pedidos y clientes?', 'Sí. Desarrollo el backend en Java con Spring Boot y MySQL, con acceso privado para ti y tu equipo.'], ['¿Atiendes a negocios de Elche en persona?', 'Sí, me desplazo a Elche para la reunión inicial y las entregas importantes.']] },
 { slug: 'san-vicente-del-raspeig', name: 'San Vicente del Raspeig', title: 'Diseño web en San Vicente del Raspeig: webs para comercios y pymes',
  desc: 'Desarrollador web en San Vicente del Raspeig. Webs para comercios, academias, clínicas y pymes cerca del campus de la Universidad de Alicante.',
  lead: 'San Vicente del Raspeig es una ciudad joven y dinámica, pegada a Alicante y sede del campus de la Universidad de Alicante. Eso significa muchos estudiantes y familias que buscan servicios cercanos desde el móvil.',
  local: ['Si tienes una academia, centro de idiomas, imprenta o tienda cerca del campus, una web con horarios, tarifas e inscripción online te ahorra llamadas y capta alumnos fuera de horario.', 'Para negocios de barrio, el SEO local por municipio es una gran oportunidad: se compite con menos webs que en Alicante capital y las búsquedas "en San Vicente" tienen intención clara de compra.', 'Para empresas del polígono Canastell y alrededores, preparo webs corporativas y catálogos con formulario de presupuesto.'],
  faq: [['¿Merece la pena una web si mi negocio es de barrio?', 'Sí: muchas búsquedas incluyen el nombre del municipio, y con una web bien optimizada compites con pocos resultados locales.'], ['¿Haces webs para academias y centros de formación?', 'Sí, con horarios, cursos, tarifas e inscripción online.'], ['¿Puedo reunirme contigo en San Vicente?', 'Sí, está a pocos minutos de Alicante y me desplazo sin problema.']] },
 { slug: 'playa-de-san-juan', name: 'Playa de San Juan', title: 'Diseño web en Playa de San Juan: webs para hostelería y turismo',
  desc: 'Páginas web para restaurantes, apartamentos turísticos y negocios de Playa de San Juan, con reservas online, versión en varios idiomas y SEO local.',
  lead: 'Playa de San Juan es la zona costera de Alicante con paseo marítimo, terrazas y mucho turismo vacacional. Vivir de temporada exige estar visible justo cuando el visitante decide dónde comer, dormir o qué hacer.',
  local: ['Para restaurantes y chiringuitos del paseo, una carta digital con fotos, alérgenos y reservas online evita llamadas en hora punta y mejora la experiencia del cliente.', 'Para alquileres vacacionales, una web propia con calendario de disponibilidad reduce la dependencia de comisiones de plataformas externas.', 'Para tiendas, escuelas de deportes náuticos y servicios de la zona, una web multilingüe en español, inglés y francés ayuda a captar visitantes internacionales.'],
  faq: [['¿Puedo tener la carta de mi restaurante online?', 'Sí, con filtros por categoría, alérgenos, fotos y reservas, como en mi demo de gastrobar.'], ['¿La web puede estar en varios idiomas?', 'Sí. Es recomendable en una zona turística como Playa de San Juan.'], ['¿Se puede gestionar la temporada alta?', 'Sí: horarios especiales, aforo y reservas limitadas por franja desde un panel.']] },
 { slug: 'benidorm', name: 'Benidorm', title: 'Diseño web en Benidorm: webs multilingües para hoteles, ocio y comercio',
  desc: 'Desarrollador web para negocios de Benidorm: webs multilingües, reservas online y tiendas online para hostelería, ocio y comercio, con SEO local.',
  lead: 'Benidorm es uno de los destinos turísticos más internacionales de España, con visitantes de Reino Unido, Países Bajos, países nórdicos y de toda España. Su público no busca solo en castellano, y la competencia por aparecer en Google es alta.',
  local: ['Para bares, restaurantes y locales de ocio de Levante, Poniente y el casco antiguo, una web en inglés y castellano con reservas y carta clara reduce el coste de depender solo de plataformas.', 'Para academias de idiomas, servicios para residentes extranjeros y negocios que atienden a vecinos durante todo el año, el SEO en inglés para búsquedas locales es una oportunidad poco explotada.', 'Para tiendas de la zona, una tienda online con envíos y cobro con Stripe permite vender también fuera de temporada.'],
  faq: [['¿Haces webs en inglés para Benidorm?', 'Sí. Puedo desarrollarlas multilingües, con textos y SEO adaptados a cada idioma.'], ['¿Puedo recibir reservas directamente?', 'Sí, con sistema de reservas propio y aviso por email, sin comisiones por reserva.'], ['¿Trabajas con negocios de Benidorm presencialmente?', 'Sí, la provincia de Alicante es mi zona de trabajo habitual.']] }
];

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const WA = t => 'https://wa.me/34620477443?text=' + encodeURIComponent(t);
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap';

const header = () => `<header class="top">
  <a href="index.html#inicio" class="brand">Guillermo Gómez <small>Dev · Alicante</small></a>
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
    <div><h4 class="mono">Diseño web en</h4><ul>${cities.filter(c => c.slug !== current).map(c => `<li><a href="${c.slug}.html">${c.name}</a></li>`).join('')}<li><a href="index.html">Inicio</a></li></ul></div>
    <div><h4 class="mono">Demos</h4><ul><li><a href="demos/restaurante.html">Restaurante</a></li><li><a href="demos/tienda.html">Tienda online</a></li><li><a href="demos/clinica.html">Clínica</a></li><li><a href="demos/barberia.html">Barbería</a></li><li><a href="demos/taller.html">Taller</a></li></ul></div>
  </div>
  <div class="foot-end mono"><span>© Guillermo Gómez López</span><a href="legal.html">Aviso legal, privacidad y cookies</a></div>
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
  const ld = [{ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `Guillermo Gómez López – Desarrollo web en ${c.name}`, url, telephone: '+34620477443', areaServed: { '@type': 'City', name: c.name }, address: { '@type': 'PostalAddress', addressRegion: 'Alicante', addressCountry: 'ES' }, parentOrganization: { '@type': 'ProfessionalService', url: BASE + '/' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }];
  const long = c.name.length > 12;
  const body = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Diseño web / ${c.name}</p>
  <h1 class="h1" style="margin-top:1.4rem${long ? ';font-size:clamp(2.4rem,6.6vw,7.4rem)' : ''}"><span class="ln"><span>Diseño web</span></span><span class="ln"><span>en <em>${c.name}</em>.</span></span></h1>
  <p class="lead">${c.lead}</p>
</section>
<section class="sec" style="padding-top:2rem">
  <div class="sec-h rv"><span class="no mono">(01)</span><h2>Qué necesita un negocio de ${c.name}</h2></div>
  <div class="need">${c.local.map((p, i) => `<div class="rv"><b>0${i + 1}</b><p>${p}</p></div>`).join('')}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(02)</span><h2>Servicios en ${c.name}</h2><p>Compruébalo en las <a href="index.html#demos">demos interactivas</a>: restaurante, tienda, clínica, barbería y taller.</p></div>
  <ul class="svc-l">${[`Web profesional o landing page`, `Web con base de datos, reservas y panel de gestión`, `Tienda online con pasarela de pago`].map((s, i) => `<li class="rv"><span>0${i + 1}</span>${s} en ${c.name}</li>`).join('')}</ul>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(03)</span><h2>Preguntas sobre diseño web en ${c.name}</h2></div>
  <div class="faq-l">${c.faq.map(([q, a], i) => `<details class="rv"${i === 0 ? ' open' : ''}><summary><span>0${i + 1}</span>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <a class="cta-big" href="${WA('Hola Guillermo, tengo un negocio en ' + c.name + ' y quiero una web')}" target="_blank" rel="noopener"><span class="mono">Presupuesto sin compromiso</span><span>Cuéntame tu negocio en ${c.name} ↗</span></a>
</section>
</main>
${footer(c.slug)}`;
  fs.writeFileSync(path.join(ROOT, `${c.slug}.html`), shell({ title: `${c.title} | Guillermo Gómez`, desc: c.desc, canonical: url, ld, body }));
}

/* Página legal */
const legal = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Legal</p>
  <h1 class="h1" style="margin-top:1.4rem;font-size:clamp(2.4rem,7vw,7.4rem)"><span class="ln"><span>Aviso legal,</span></span><span class="ln"><span><em>privacidad</em> y cookies.</span></span></h1>
</section>
<section class="sec prose" style="padding-top:1rem">
  <h2 id="aviso">Aviso legal</h2>
  <p>En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que el titular de este sitio web es Guillermo Gómez López, con domicilio en Alicante (España). NIF: <strong>[pendiente de completar por el titular]</strong>. Teléfono: +34 620 477 443.</p>
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
fs.writeFileSync(path.join(ROOT, 'legal.html'), shell({ title: 'Aviso legal, privacidad y cookies | Guillermo Gómez', desc: 'Aviso legal, política de privacidad y política de cookies de la web de Guillermo Gómez López.', canonical: BASE + '/legal.html', body: legal }));

const urls = ['', ...cities.map(c => c.slug + '.html'), 'demos/restaurante.html', 'demos/tienda.html', 'demos/clinica.html', 'demos/barberia.html', 'demos/taller.html', 'legal.html'];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${BASE}/${u}</loc><lastmod>2026-11-20</lastmod><priority>${u === '' ? '1.0' : u === 'legal.html' ? '0.3' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
