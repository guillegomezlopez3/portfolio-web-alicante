/* Generador de las páginas de SEO local: landings por ciudad, páginas de servicio, página legal y sitemap.
   Uso, desde la raíz del proyecto:  node tools/gen-landings.js
   Para añadir una ciudad, añade un objeto a `cities`; para un servicio, a `services`.
   Cada página debe tener texto PROPIO y útil: no copies el de otra cambiando el nombre de la ciudad. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://digitalsolutionscmv.es';
const HOY = '2026-11-23';
const PHONE = '+34620477443';

/* ======================= CIUDADES ======================= */
const cities = [
 { slug: 'alicante', name: 'Alicante', title: 'Páginas web y programas a medida en Alicante',
  desc: 'Programador en Alicante: páginas web, programas de gestión a medida, citas online y tiendas. Explicado sin tecnicismos y con reunión en tu local.',
  lead: 'Alicante tiene comercio, hostelería, clínicas, talleres y despachos de todo tipo. Casi todos comparten el mismo problema: llevar el negocio con libretas, hojas de Excel y mensajes sueltos. Un programa hecho a tu medida lo junta todo en un solo sitio, y te lo explico sin palabras raras.',
  local: ['Si tienes un taller, clínica, academia o comercio en Alicante, te preparo un programa donde están tus clientes, sus citas, tus facturas y tu stock. Lo ves desde el ordenador o el móvil, tú y tu equipo.', 'Si recibes llamadas para pedir cita o reservar mesa, puedes dejar que tus clientes reserven solos desde el móvil, a cualquier hora, y que el programa les avise para que no se olviden.', 'Y si quieres que te encuentren en el centro, el Puerto o el Postiguet cuando alguien busca tu servicio, preparo también tu página web y tu ficha de Google para que coincidan en nombre, dirección y horarios.'],
  bizTitle: 'Negocios de Alicante con los que encaja',
  biz: ['Comercios y hostelería del centro y de la zona del Puerto: carta o catálogo en Internet, reservas y avisos a clientes.', 'Clínicas, despachos y academias de los barrios: agenda de citas, ficha de cada cliente o paciente y recordatorios automáticos.', 'Talleres, reformas y empresas de servicios: partes de trabajo, presupuestos y facturas desde el móvil, sin papeles.'],
  faq: [['No sé de informática, ¿puedo trabajar contigo en Alicante?', 'Sí, es lo normal. Me reúno contigo en tu local, me cuentas cómo trabajas y yo me encargo de la parte técnica, explicándotelo sin jerga.'], ['¿Qué es un programa de gestión?', 'Una sola herramienta donde llevas clientes, citas, facturas, stock y pedidos, hecha a medida de tu negocio. Sustituye a las libretas y los Excel sueltos.'], ['¿Cuánto tarda y cuánto cuesta?', 'Una web suele estar en 1-2 semanas y un programa de gestión desde 4. El precio depende de lo que necesites: te hago un presupuesto cerrado, por escrito y sin compromiso.'], ['Ya tengo una web en Alicante, ¿puedes mejorarla?', 'Sí. Puedo rehacerla o mejorarla: que se vea bien en el móvil, que cargue rápido y que explique con claridad qué haces. Primero reviso la actual y te digo qué conviene conservar.'], ['¿Puedo tener la web y un programa de gestión conectados?', 'Sí. Por ejemplo, que las citas que piden tus clientes en la web aparezcan solas en tu agenda, o que el stock de tu tienda online se actualice con cada venta.']] },
 { slug: 'elche', name: 'Elche', title: 'Páginas web y programas de gestión en Elche',
  desc: 'Páginas web, tiendas online y programas de gestión a medida para empresas y comercios de Elche: calzado, industria y servicios. Presupuesto cerrado.',
  lead: 'Elche tiene una industria del calzado muy potente, polígonos con cientos de empresas, comercio y hostelería. Muchas llevan años trabajando con Excel y papeles que ya se les quedan cortos. Un programa a medida ordena pedidos, stock y facturas sin cambiar tu forma de trabajar.',
  local: ['Si fabricas o vendes calzado, el programa controla modelos, tallas y existencias, y ves de un vistazo qué hay en el almacén y qué te piden. Puede conectarse a una tienda online para vender también por Internet.', 'Si tienes una empresa en un polígono o en el Parque Empresarial, te preparo presupuestos, albaranes y facturas en pocos clics, con ficha de cada cliente y proveedor, y pasamos tus Excel actuales al sistema nuevo.', 'Y si tienes un comercio o un bar en el centro o cerca del Palmeral, una página web sencilla y tu ficha de Google bien puesta hacen que te encuentren cuando alguien busca en Elche.'],
  bizTitle: 'Negocios de Elche con los que encaja',
  biz: ['Fabricantes, marcas y proveedores del calzado: control de modelos, tallas, pedidos y existencias, y venta directa por Internet.', 'Empresas de polígonos y de servicios a otras empresas: presupuestos, albaranes, facturas y seguimiento de clientes en un solo sitio.', 'Comercio y hostelería del centro: una web clara, ficha de Google al día y reservas o pedidos sin depender de llamadas.'],
  faq: [['¿Puedes pasar mis Excel de pedidos y stock a un programa?', 'Sí. Importo tus datos actuales y reviso contigo que está todo antes de empezar a usarlo.'], ['¿Se puede conectar con una tienda online?', 'Sí. La tienda y el programa comparten stock y pedidos, para no apuntar nada dos veces.'], ['¿Atiendes a negocios de Elche en persona?', 'Sí, me desplazo a Elche para la primera reunión y las entregas importantes.'], ['¿Trabajas con empresas de los polígonos de Elche?', 'Sí. Lo habitual es empezar por lo que más tiempo os quita (pedidos, albaranes o facturas) y ampliar después, por piezas, sin rehacer lo que ya funciona.'], ['¿Puedo vender calzado por Internet desde Elche?', 'Sí. Una tienda online con tallas y colores, pago seguro con tarjeta y el stock conectado a tu almacén. Antes revisamos qué necesitas: envíos, devoluciones y condiciones de venta.']] },
 { slug: 'san-vicente-del-raspeig', name: 'San Vicente del Raspeig', title: 'Páginas web y programas en San Vicente del Raspeig',
  desc: 'Páginas web, citas online y programas a medida para comercios, academias, clínicas y empresas de San Vicente del Raspeig. Sin tecnicismos.',
  lead: 'San Vicente del Raspeig es una ciudad joven y activa, pegada a Alicante y con el campus de la Universidad. Hay muchos negocios de barrio, academias, clínicas y pymes del polígono Canastell que siguen llevándolo todo a mano. Con un programa a medida ganas horas cada semana.',
  local: ['Si tienes una academia o un centro de formación, el programa lleva alumnos, grupos, cobros y asistencia, y los alumnos se apuntan solos desde el móvil, también fuera de tu horario.', 'Si tienes un negocio de barrio (peluquería, clínica, taller, tienda), las citas online y un programa con tus clientes y facturas te quitan el teléfono de encima y los papeles de en medio.', 'Si tu empresa está en el polígono Canastell o alrededores, preparo el control de pedidos, stock y facturación, y una web con formulario de presupuesto para que te encuentren en San Vicente.'],
  bizTitle: 'Negocios de San Vicente con los que encaja',
  biz: ['Academias, centros de idiomas e imprentas cerca del campus: inscripción online, grupos, cobros y avisos a los alumnos.', 'Negocios de barrio (peluquerías, clínicas, talleres, tiendas): cita previa por el móvil y ficha de cada cliente.', 'Pymes del polígono Canastell: pedidos, stock, presupuestos y facturas, con una web que genere contactos.'],
  faq: [['¿Merece la pena un programa a medida si mi negocio es pequeño?', 'Sí. De hecho es donde más se nota: pasas de apuntarlo todo a mano a tener clientes, citas y facturas en un solo sitio, y ahorras horas cada semana.'], ['¿Haces programas para academias?', 'Sí: alumnos, grupos, horarios, cobros e inscripción online.'], ['¿Puedo reunirme contigo en San Vicente?', 'Sí, está a pocos minutos de Alicante y me desplazo sin problema.'], ['¿Cuánto tarda una página web para un negocio de barrio?', 'Una web sencilla suele estar lista en 1-2 semanas, según cuándo tenga tus textos y fotos. Si además quieres citas online, entre 3 y 6 semanas.'], ['Mi negocio solo tiene Instagram, ¿necesito una web?', 'Una web es tuya y no depende de cambios de reglas de una red social. Sirve para que te encuentren en Google cuando alguien busca tu servicio en San Vicente, algo que Instagram no hace igual.']] },
 { slug: 'playa-de-san-juan', name: 'Playa de San Juan', title: 'Páginas web y reservas online en Playa de San Juan',
  desc: 'Páginas web multilingües, reservas online y programas de gestión para restaurantes, apartamentos y negocios de Playa de San Juan.',
  lead: 'Playa de San Juan vive del paseo marítimo, las terrazas y el turismo de temporada. En temporada alta no hay tiempo para apuntar reservas ni cuadrar cuentas a mano: un buen programa te ordena el servicio y una web multilingüe trae clientes.',
  local: ['Si tienes un restaurante o chiringuito, tus clientes pueden reservar mesa desde el móvil y tú ves las reservas del día y el aforo en una pantalla, sin atender llamadas en hora punta.', 'Si alquilas apartamentos, un programa con calendario de reservas y datos de huéspedes, y una web propia, reducen lo que pagas en comisiones a plataformas externas.', 'Si tienes una tienda o escuela de actividades de la zona, una web en español, inglés y francés, y un programa para llevar clientes y reservas, te ayudan a atender al turismo con menos trabajo.'],
  bizTitle: 'Negocios de Playa de San Juan con los que encaja',
  biz: ['Restaurantes, terrazas y chiringuitos del paseo: carta digital con alérgenos, reservas por franjas y control de aforo.', 'Apartamentos turísticos y alquileres vacacionales: web propia con calendario de disponibilidad y solicitud directa de reserva.', 'Tiendas y escuelas de actividades de la zona: web en varios idiomas, citas o reservas y avisos automáticos a los clientes.'],
  faq: [['¿Puedo tener las reservas de mi restaurante online?', 'Sí, con aviso automático al cliente y una pantalla para ti con todas las reservas del día, como en mi ejemplo del gastrobar.'], ['¿Puede estar en varios idiomas?', 'Sí. En una zona turística como Playa de San Juan es muy recomendable.'], ['¿Se adapta a la temporada alta?', 'Sí: horarios especiales, aforo y reservas limitadas por franja, todo desde tu panel.'], ['¿Cuánto cuesta aparecer en Google Maps y en las búsquedas de la zona?', 'La ficha de Google de tu negocio es gratuita. Yo te ayudo a configurarla y a que coincida con tu web; posicionarse depende de la competencia y lleva tiempo, y nadie puede prometer un puesto concreto.'], ['Solo abro en temporada, ¿me compensa una web?', 'Sí: la gente decide dónde comer o dormir antes de llegar. Una web clara con reservas te trabaja también en los meses previos, cuando se planifican las vacaciones.']] },
 { slug: 'benidorm', name: 'Benidorm', title: 'Páginas web multilingües y programas en Benidorm',
  desc: 'Páginas web en varios idiomas, reservas sin comisiones y programas de gestión para hostelería, ocio y comercio de Benidorm.',
  lead: 'Benidorm recibe visitantes de Reino Unido, Países Bajos, países nórdicos y de toda España, y atiende a muchos residentes extranjeros todo el año. Su público no busca solo en castellano, y la competencia es alta: ordenar tu negocio por dentro y hacerlo visible por fuera marca la diferencia.',
  local: ['Si tienes un bar, restaurante o local de ocio en Levante, Poniente o el casco antiguo, el programa te lleva reservas, pedidos y caja, y una web en inglés y castellano te trae clientes sin depender solo de plataformas.', 'Si das servicio a residentes extranjeros (academias de idiomas, gestorías, clínicas), un programa con citas online y avisos automáticos, y tu web en inglés, te abren un público que casi nadie atiende bien.', 'Si tienes una tienda, una tienda online con envíos y pago con tarjeta, conectada con tu stock, permite seguir vendiendo fuera de temporada.'],
  bizTitle: 'Negocios de Benidorm con los que encaja',
  biz: ['Bares, restaurantes y ocio de Levante, Poniente y el casco antiguo: reservas propias, carta en varios idiomas y control de caja.', 'Servicios para residentes extranjeros (idiomas, gestorías, clínicas): citas online, avisos automáticos y web en inglés.', 'Comercio local: tienda online con envíos y stock conectado para vender también fuera de temporada.'],
  faq: [['¿Haces páginas web y programas en inglés para Benidorm?', 'Sí. Puedo hacerlos en varios idiomas, con los textos adaptados a cada uno.'], ['¿Puedo recibir reservas directamente, sin comisiones?', 'Sí, con sistema de reservas propio y aviso por email, sin pagar comisión por cada reserva.'], ['¿Trabajas con negocios de Benidorm en persona?', 'Sí, la provincia de Alicante es mi zona de trabajo habitual.'], ['¿La web puede estar en inglés, holandés o alemán?', 'Sí. Se puede ofrecer en los idiomas que atiende tu negocio. Lo recomendable es traducir con cuidado las páginas clave (servicios, reservas y contacto) y revisarlas con alguien nativo.'], ['¿Me ayudas a que me encuentren los turistas que buscan en inglés?', 'Preparo la web para que Google entienda cada idioma por separado. El posicionamiento depende de la competencia y de otros factores, y no se puede prometer un puesto concreto.']] }
];

/* ======================= PÁGINAS DE SERVICIO ======================= */
const services = [
 { slug: 'paginas-web-alicante', crumb: 'Páginas web', serviceType: 'Creación de páginas web',
  title: 'Creación de páginas web en Alicante',
  desc: 'Creación de páginas web para negocios de Alicante: rápidas, adaptadas al móvil y preparadas para aparecer en Google. Sin plantillas y con presupuesto cerrado.',
  h1: ['Páginas web', 'en <em>Alicante</em>.'],
  lead: 'Una página web que explica en segundos qué haces, dónde estás y cómo contactarte, que se ve bien en el móvil y que Google puede entender. Hecha a mano para tu negocio, sin plantillas y explicada sin palabras raras.',
  forWho: ['Tu negocio todavía no tiene web y cada semana alguien te pregunta tu teléfono, tu horario o dónde estás.', 'Tienes una web antigua que no se ve bien en el móvil, tarda en cargar o no la encuentra nadie.', 'Dependes de redes sociales o de plataformas ajenas, y quieres un sitio que sea tuyo y que nadie te cambie las reglas.'],
  includes: ['Diseño propio, pensado para tu negocio (no una plantilla)', 'Adaptada al móvil, que es donde está la mayoría de tus clientes', 'Pensada para cargar rápido', 'Preparada para Google: títulos, descripciones, mapa del sitio y datos para que te encuentren cuando busquen tu servicio en tu ciudad', 'Botón de WhatsApp, teléfono y formulario de contacto', 'Dominio, alojamiento y publicación: me encargo yo', 'Aviso legal y política de privacidad: te ayudo a tenerlos en regla'],
  prose: [['Cómo trabajamos', ['Primero hablamos: me cuentas a qué te dedicas, qué te hace perder tiempo y qué quieres que haga tu web. Te enseño un boceto de las pantallas antes de construirla, para que lo corrijas cuando es barato cambiar las cosas. No se publica nada que no hayas visto y aprobado.', 'Una web sencilla suele estar lista en 1-2 semanas, según cuándo tengamos tus textos y fotos. Si no los tienes, te oriento sobre qué escribir y qué fotos hacen falta.']], ['¿Por qué a medida y no con una plantilla?', ['Las plantillas pueden ser una buena opción si tu presupuesto es muy ajustado y tu web va a ser muy sencilla. A medida, la web solo lleva lo que necesitas, suele cargar más rápido, se adapta a tu negocio y se puede ampliar después (citas, tienda, un programa de gestión) sin empezar de cero.', 'Además, no dependes de la cuota mensual de una plataforma ni de que cambien sus condiciones.']], ['Y después de publicarla', ['Una web no se entrega y se olvida: hay que mantenerla actualizada, hacer copias de seguridad y vigilar que no se cae. Puedes contratar un plan mensual de mantenimiento, con aviso inmediato si algo falla, o encargarte tú con mi formación.']]],
  faq: [['¿Cuánto tarda en estar lista mi página web?', 'Una web sencilla suele estar lista en 1-2 semanas, según cuándo tenga tus textos y fotos. Con citas online o una tienda, el plazo es mayor.'], ['¿Cuánto cuesta una página web?', 'Depende de lo que necesites: número de secciones, idiomas, citas o tienda. Te preparo un presupuesto cerrado y por escrito, sin compromiso, después de una primera charla gratuita.'], ['¿Saldré el primero en Google?', 'Nadie puede prometerlo. Yo dejo la web bien preparada (velocidad, títulos, datos estructurados, ficha de Google), pero el puesto depende de la competencia, de lo que busque la gente y del tiempo: es un trabajo de meses.'], ['¿Podré cambiar yo los textos y las fotos?', 'Sí, si lo necesitas puedo prepararla para que edites tú los contenidos sin tocar código, o encargarme yo de los cambios dentro de un plan de mantenimiento.'], ['¿Qué necesito para empezar?', 'Tu logo si lo tienes, algunas fotos y una idea de qué quieres contar. Si no tienes algo de eso, te ayudo a conseguirlo.']] },
 { slug: 'programador-a-medida-alicante', crumb: 'Programador a medida', serviceType: 'Desarrollo de software a medida',
  title: 'Programador a medida en Alicante',
  desc: 'Programador en Alicante: creo aplicaciones y programas a medida para tu negocio (gestión, citas, pedidos). Hablas con quien lo programa, sin intermediarios.',
  h1: ['Programador', 'a medida en <em>Alicante</em>.'],
  lead: 'Si tu negocio tiene un problema que ningún programa de los que se venden resuelve bien, lo programo yo a tu medida. Hablas directamente con la persona que escribe el código, no con un comercial.',
  forWho: ['Usas varios programas, hojas de Excel y papeles que no se hablan entre sí, y pierdes tiempo pasando datos de uno a otro.', 'Los programas «de caja» te sobran por todas partes y les falta justo lo que tu negocio necesita.', 'Quieres una herramienta propia (un panel, una agenda, un control de pedidos…) que haga solo lo que tú necesitas.'],
  includes: ['Un análisis previo de cómo trabajas, con tus palabras', 'Programa o aplicación web que se usa desde el ordenador, la tablet y el móvil', 'Usuarios y permisos: cada persona ve solo lo que le toca', 'Base de datos propia, con copias de seguridad', 'Conexión con lo que ya usas (tu web, Excel, el correo…)', 'Formación a tu equipo y soporte después de la entrega'],
  prose: [['Cómo empezamos', ['Con una charla gratuita para entender tu negocio. Después te explico por escrito qué haría, en qué fases, cuánto cuesta y cuánto tarda, con precio cerrado. Lo construyo por partes y las pruebas tú mismo en una versión de prueba antes de empezar a usarlo de verdad.']], ['Qué tecnología uso (para quien le interese)', ['Programo con Java y Spring Boot en el servidor, base de datos MySQL o MariaDB, y JavaScript, HTML y CSS en la parte que ves. Son tecnologías muy extendidas y estables, con mucho soporte: si algún día necesitas que otra persona lo mantenga, podrá hacerlo.']], ['Quién soy', ['Soy Guillermo Gómez, técnico superior en Desarrollo de Aplicaciones Multiplataforma, con experiencia desarrollando software en Irlanda. Trabajo desde Alicante con negocios de la provincia y también en remoto con toda España.']]],
  faq: [['¿Qué es un programa a medida y en qué se diferencia de uno ya hecho?', 'Un programa a medida se construye para tu forma de trabajar: solo lleva lo que necesitas y con tus palabras. Uno ya hecho suele traer muchas opciones que no usas y le falta lo tuyo, y a menudo se paga una cuota por usuario.'], ['¿Cuánto tarda?', 'Depende del tamaño. Un programa de gestión pequeño puede estar en producción desde 4 semanas; si es más grande, se entrega por fases para que lo uses cuanto antes.'], ['¿Puedo ampliarlo después?', 'Sí. Se diseña por piezas independientes, así que puedes añadir funciones más adelante sin rehacer lo que ya tienes.'], ['¿Quién es el dueño de los datos y del código?', 'Tus datos son siempre tuyos y te los entrego en un formato que puedas abrir. Las condiciones sobre el código se pactan por escrito en la propuesta.'], ['¿Y si algo falla o necesito un cambio?', 'Me llamas a mí. Hay planes de mantenimiento con soporte, copias de seguridad y vigilancia automática del programa, o puedes pedirme los cambios puntuales cuando los necesites.']] },
 { slug: 'programa-de-gestion-a-medida', crumb: 'Programa de gestión a medida', serviceType: 'Software de gestión (ERP) a medida',
  title: 'Programa de gestión a medida para pymes',
  desc: 'Programa de gestión (ERP) a medida para pymes: clientes, citas, facturas, stock y pedidos en un solo sitio, sin Excel ni papeles. Explicado sin tecnicismos.',
  h1: ['Programa de', 'gestión <em>a medida</em>.'],
  lead: 'Un solo programa donde tienes tus clientes, tus citas, tus facturas y lo que te queda en el almacén. En las grandes empresas se llama ERP; el tuyo lleva solo lo que necesitas, con tus palabras y tu forma de trabajar.',
  forWho: ['Apuntas citas o pedidos en una libreta, en el móvil o en un Excel, y algo siempre se pierde.', 'Para saber cuánto has vendido o qué te queda en el almacén, tienes que sumar a mano.', 'Pierdes horas haciendo facturas y presupuestos, o avisando a los clientes uno por uno.'],
  includes: ['Clientes: ficha de cada uno con su historial', 'Citas y agenda, con recordatorios automáticos', 'Presupuestos y facturas', 'Stock e inventario, con aviso cuando algo baja del mínimo', 'Pedidos y proveedores', 'Informes: qué se vende más y cuánto te deben'],
  prose: [['Se construye por piezas', ['Empiezas por lo que más te duele (por ejemplo, las citas y los clientes) y añades piezas cuando las necesites: facturas, stock, tienda online, informes. Cada pieza funciona por separado y se añade sin rehacer lo anterior, así que no pagas dos veces la base.']], ['Pruébalo antes de decidir', ['En esta web tienes dos ejemplos que puedes tocar y probar: un programa de gestión con clientes, facturas y agenda, y un control de inventario con pedidos y plano de almacén. Son negocios ficticios, pero funcionan como funcionaría el tuyo.']], ['Tus datos de Excel', ['No empiezas de cero: paso tus hojas de cálculo, listados o programas antiguos al sistema nuevo y compruebo contigo que está todo antes de empezar a usarlo.']]],
  faq: [['¿Qué es un ERP o programa de gestión?', 'Es un programa donde tienes juntas las cosas de tu negocio: clientes, citas, facturas, stock y pedidos. En vez de usar cinco herramientas distintas, usas una sola.'], ['¿Es mejor que comprar uno ya hecho?', 'Depende. Uno ya hecho es más barato al principio, pero suele traer opciones que no usas, no se adapta a tu forma de trabajar y cobra por usuario. A medida, lleva lo que tú necesitas. Te ayudo a valorarlo con honestidad.'], ['¿Puedo empezar con poco y ampliar?', 'Sí, es lo recomendable. Empiezas por una o dos piezas y vas añadiendo las demás según las necesites.'], ['¿Cumple la normativa de facturación?', 'Los requisitos para emitir facturas desde un programa los fija la normativa vigente y pueden cambiar. Lo estudiamos al principio, contigo y con tu gestor, para saber qué necesita exactamente tu caso. No lo doy por supuesto.'], ['¿Y si algo falla?', 'Hay planes de mantenimiento con copias de seguridad diarias y vigilancia automática: si el programa se cae, me llega un aviso al móvil al momento y empiezo a actuar.']] },
 { slug: 'tienda-online-alicante', crumb: 'Tienda online', serviceType: 'Creación de tiendas online',
  title: 'Crear una tienda online en Alicante',
  desc: 'Creo tiendas online para comercios de Alicante: catálogo, carrito, pago seguro con tarjeta y stock que se actualiza solo. Vende también fuera de tu calle.',
  h1: ['Tienda online', 'en <em>Alicante</em>.'],
  lead: 'Tu catálogo en Internet para que te compren cualquier día, a cualquier hora, con pago seguro con tarjeta. Los pedidos y el stock se actualizan solos y los ves en tu panel.',
  forWho: ['Tienes un comercio con clientela de barrio y quieres vender también a quien no pasa por tu calle.', 'Ya vendes por WhatsApp o Instagram y pierdes tiempo apuntando pedidos y cobrando uno a uno.', 'Quieres controlar tu stock y tus pedidos sin hojas de cálculo.'],
  includes: ['Catálogo con fotos, precios, tallas y variantes', 'Carrito y compra en pocos pasos, desde el móvil', 'Pago seguro con tarjeta mediante una pasarela de pago reconocida', 'Panel para tus pedidos y tu stock', 'Cupones de descuento', 'Conexión con tu programa de gestión, si lo necesitas'],
  prose: [['Lo que conviene saber antes de vender online', ['Una tienda online tiene obligaciones legales: condiciones de venta, política de devoluciones y derecho de desistimiento, protección de datos y claridad en precios y envíos. Te ayudo a tenerlas en cuenta desde el principio; para tu caso concreto conviene confirmarlo con tu gestor.']], ['Plazos', ['Una tienda online suele llevar entre 4 y 10 semanas, según el tamaño del catálogo y lo que necesites (envíos, variantes, conexión con el stock). Te lo concreto en la propuesta.']], ['Y cuando ya vendas', ['Una tienda necesita copias de seguridad, actualizaciones y vigilancia: si se cae un viernes por la tarde, se nota en las ventas. Con el mantenimiento mensual, me llega un aviso al móvil en cuanto algo deja de responder.']]],
  faq: [['¿Cuánto tarda en estar lista mi tienda online?', 'Entre 4 y 10 semanas, según el número de productos y las opciones que necesites.'], ['¿Cuánto cuesta una tienda online?', 'Depende del catálogo y de las funciones. Te preparo un presupuesto cerrado y por escrito, sin compromiso, tras una primera charla gratuita.'], ['¿Cómo cobro las ventas?', 'Con pago seguro con tarjeta a través de una pasarela de pago reconocida. El dinero va a tu cuenta; los datos de la tarjeta no pasan por mi servidor.'], ['¿Podré gestionar yo los productos y los precios?', 'Sí, desde un panel privado: altas de productos, precios, fotos, stock y pedidos, sin tocar código.'], ['¿Y los envíos?', 'Se configuran los que ofrezcas (recogida en tienda, mensajería, zonas y precios). Lo vemos al definir la tienda.']] }
];

/* ======================= PIEZAS COMUNES ======================= */
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const strip = s => s.replace(/<[^>]+>/g, '');
const WA = t => 'https://wa.me/34620477443?text=' + encodeURIComponent(t);
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap';
const AREAS = [{ '@type': 'City', name: 'Alicante' }, { '@type': 'City', name: 'San Vicente del Raspeig' }, { '@type': 'City', name: 'Elche' }, { '@type': 'City', name: 'Playa de San Juan' }, { '@type': 'City', name: 'Benidorm' }];
const PROVIDER = { '@type': 'ProfessionalService', name: 'DigitalSolutionsCMV', url: BASE + '/', telephone: PHONE };
const crumbLD = (name, url) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE + '/' }, { '@type': 'ListItem', position: 2, name, item: url }] });
const faqLD = faq => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

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
    <div><h4 class="mono">Trabajo en</h4><ul>${cities.filter(c => c.slug !== current).map(c => `<li><a href="${c.slug}.html">${c.name}</a></li>`).join('')}<li><a href="index.html">Inicio</a></li></ul>
      <h4 class="mono" style="margin-top:1.4rem">Servicios</h4><ul>${services.filter(s => s.slug !== current).map(s => `<li><a href="${s.slug}.html">${s.crumb}</a></li>`).join('')}</ul></div>
    <div><h4 class="mono">Demos</h4><ul><li><a href="demos/gestion.html">Programa de gestión</a></li><li><a href="demos/inventario.html">Inventario</a></li><li><a href="demos/restaurante.html">Restaurante</a></li><li><a href="demos/tienda.html">Tienda online</a></li><li><a href="demos/clinica.html">Clínica</a></li><li><a href="demos/barberia.html">Barbería</a></li><li><a href="demos/taller.html">Taller</a></li></ul></div>
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
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="es_ES">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/chatbot.css">
  ${(ld || []).map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n  ')}
</head>
<body>
${header()}
${body}
<script src="js/main.js"></script>
<script src="js/chatbot.js" defer></script>
</body>
</html>
`;

const numbered = (arr, cls) => arr.map((t, i) => `<div class="rv"><b>0${i + 1}</b><p>${t}</p></div>`).join('');
const related = (excl) => [...services.filter(s => s.slug !== excl).map(s => [s.slug + '.html', s.crumb]), ['demos/gestion.html', 'Probar la demo de gestión'], ['demos/inventario.html', 'Probar la demo de inventario']];

/* ======================= LANDINGS POR CIUDAD ======================= */
for (const c of cities) {
  const url = `${BASE}/${c.slug}.html`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `DigitalSolutionsCMV en ${c.name}`, url, telephone: PHONE, areaServed: { '@type': 'City', name: c.name }, address: { '@type': 'PostalAddress', addressRegion: 'Alicante', addressCountry: 'ES' }, parentOrganization: PROVIDER }, crumbLD(c.name, url), faqLD(c.faq)];
  const long = c.name.length > 12;
  const body = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Programas y webs / ${c.name}</p>
  <h1 class="h1" style="margin-top:1.4rem${long ? ';font-size:clamp(2.4rem,6.6vw,7.4rem)' : ''}"><span class="ln"><span>Programas y webs</span></span><span class="ln"><span>en <em>${c.name}</em>.</span></span></h1>
  <p class="lead">${c.lead}</p>
</section>
<section class="sec" style="padding-top:2rem">
  <div class="sec-h rv"><span class="no mono">(01)</span><h2>Qué puedo hacer por tu negocio en ${c.name}</h2></div>
  <div class="need">${numbered(c.local)}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(02)</span><h2>Servicios en ${c.name}</h2><p>Pruébalo tú mismo en los <a href="index.html#demos">ejemplos</a>: gestión de facturas, inventario, restaurante, tienda, clínica, barbería y taller.</p></div>
  <ul class="svc-l">${services.map((s, i) => `<li class="rv"><span>0${i + 1}</span><a href="${s.slug}.html">${s.crumb}</a></li>`).join('')}</ul>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(03)</span><h2>${c.bizTitle}</h2></div>
  <div class="need">${numbered(c.biz)}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(04)</span><h2>Preguntas frecuentes en ${c.name}</h2></div>
  <div class="faq-l">${c.faq.map(([q, a], i) => `<details class="rv"${i === 0 ? ' open' : ''}><summary><span>0${i + 1}</span>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <a class="cta-big" href="${WA('Hola, tengo un negocio en ' + c.name + ' y quiero hablar con DigitalSolutionsCMV')}" target="_blank" rel="noopener"><span class="mono">Presupuesto sin compromiso</span><span>Cuéntame tu negocio en ${c.name} ↗</span></a>
</section>
</main>
${footer(c.slug)}`;
  fs.writeFileSync(path.join(ROOT, `${c.slug}.html`), shell({ title: `${c.title} | DigitalSolutionsCMV`, desc: c.desc, canonical: url, ld, body }));
}

/* ======================= PÁGINAS DE SERVICIO ======================= */
for (const s of services) {
  const url = `${BASE}/${s.slug}.html`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'Service', name: s.title, serviceType: s.serviceType, description: s.desc, url, provider: PROVIDER, areaServed: AREAS }, crumbLD(s.crumb, url), faqLD(s.faq)];
  const body = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Servicios / ${s.crumb}</p>
  <h1 class="h1" style="margin-top:1.4rem;font-size:clamp(2.4rem,6.6vw,7.4rem)"><span class="ln"><span>${s.h1[0]}</span></span><span class="ln"><span>${s.h1[1]}</span></span></h1>
  <p class="lead">${s.lead}</p>
</section>
<section class="sec" style="padding-top:2rem">
  <div class="sec-h rv"><span class="no mono">(01)</span><h2>¿Te pasa algo de esto?</h2></div>
  <div class="need">${numbered(s.forWho)}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(02)</span><h2>Qué incluye</h2></div>
  <ul class="svc-l">${s.includes.map((t, i) => `<li class="rv"><span>0${i + 1}</span>${t}</li>`).join('')}</ul>
</section>
<section class="sec prose" style="padding-top:0">
  ${s.prose.map(([h, ps]) => `<h2>${h}</h2>\n  ${ps.map(p => `<p>${p}</p>`).join('\n  ')}`).join('\n  ')}
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(03)</span><h2>Preguntas frecuentes</h2></div>
  <div class="faq-l">${s.faq.map(([q, a], i) => `<details class="rv"${i === 0 ? ' open' : ''}><summary><span>0${i + 1}</span>${q}</summary><p>${a}</p></details>`).join('')}</div>
</section>
<section class="sec" style="padding-top:0">
  <div class="sec-h rv"><span class="no mono">(04)</span><h2>Sigue explorando</h2></div>
  <ul class="svc-l">${[...related(s.slug), ...cities.slice(0, 2).map(c => [c.slug + '.html', 'Programas y webs en ' + c.name])].map(([h, t], i) => `<li class="rv"><span>0${i + 1}</span><a href="${h}">${t}</a></li>`).join('')}</ul>
  <a class="cta-big" href="${WA('Hola, quiero información sobre: ' + strip(s.title))}" target="_blank" rel="noopener"><span class="mono">Presupuesto sin compromiso</span><span>Cuéntame tu proyecto ↗</span></a>
</section>
</main>
${footer(s.slug)}`;
  fs.writeFileSync(path.join(ROOT, `${s.slug}.html`), shell({ title: `${s.title} | DigitalSolutionsCMV`, desc: s.desc, canonical: url, ld, body }));
}

/* ======================= PÁGINA LEGAL ======================= */
const legal = `<main>
<section class="page-h">
  <p class="crumb mono"><a href="index.html">Inicio</a> / Legal</p>
  <h1 class="h1" style="margin-top:1.4rem;font-size:clamp(2.4rem,7vw,7.4rem)"><span class="ln"><span>Aviso legal,</span></span><span class="ln"><span><em>privacidad</em> y cookies.</span></span></h1>
</section>
<section class="sec prose" style="padding-top:1rem">
  <h2 id="aviso">Aviso legal</h2>
  <p>En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que el titular de este sitio web, que opera bajo el nombre comercial DigitalSolutionsCMV, es Guillermo Gómez López, con domicilio en Alicante (España). NIF: <strong>50381282N</strong>. Teléfono: +34 620 477 443. Email: guillermogomez@digitalsolutionscmv.es.</p>
  <p>Los contenidos de este sitio tienen carácter informativo. Las demos (programa de gestión, inventario, restaurante, tienda, clínica, barbería y taller) son ejemplos ficticios: los negocios, direcciones, datos, precios y reseñas que aparecen no son reales y las facturas, movimientos, reservas, citas y compras son simulaciones que no envían ningún dato.</p>
  <h2 id="privacidad">Política de privacidad</h2>
  <p><strong>Responsable:</strong> Guillermo Gómez López. <strong>Finalidad:</strong> atender las consultas y solicitudes de presupuesto. <strong>Base jurídica:</strong> consentimiento del interesado (art. 6.1.a RGPD).</p>
  <p>El formulario de proyecto no almacena datos en ningún servidor: al enviarlo se abre WhatsApp con el mensaje preparado, y los datos pasan a regirse por la política de WhatsApp. Si me escribes por email o WhatsApp, conservaré tus datos mientras dure la relación o la consulta.</p>
  <p>No cedo datos a terceros salvo obligación legal. Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo por WhatsApp al +34 620 477 443, y reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
  <h2 id="cookies">Política de cookies</h2>
  <p>Este sitio no utiliza cookies propias, ni de analítica ni de publicidad. Las demos guardan datos de uso (por ejemplo el carrito o una reserva simulada) en el almacenamiento local de tu navegador (<code>localStorage</code>) y el asistente automático recuerda la conversación mientras dura la sesión (<code>sessionStorage</code>), únicamente para su funcionamiento: nada de esto se envía a ningún servidor.</p>
  <p>Para cargar recursos, el sitio se sirve desde un servidor propio (alojado en Alemania) y utiliza Google Fonts e imágenes de Unsplash, cuyos proveedores pueden registrar datos técnicos como tu dirección IP al servir estos archivos. Puedes configurar tu navegador para bloquear o eliminar cookies y almacenamiento local en cualquier momento.</p>
</section>
</main>
${footer('')}`;
fs.writeFileSync(path.join(ROOT, 'legal.html'), shell({ title: 'Aviso legal, privacidad y cookies | DigitalSolutionsCMV', desc: 'Aviso legal, política de privacidad y política de cookies de la web de DigitalSolutionsCMV.', canonical: BASE + '/legal.html', body: legal }));

/* ======================= SITEMAP =======================
   Las demos NO van en el sitemap: llevan noindex (son negocios ficticios). */
const urls = [['', '1.0'], ...services.map(s => [s.slug + '.html', '0.9']), ...cities.map(c => [c.slug + '.html', '0.8']), ['legal.html', '0.3']];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p]) => `  <url><loc>${BASE}/${u}</loc><lastmod>${HOY}</lastmod><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generadas: ${cities.length} ciudades, ${services.length} servicios, legal y sitemap (${urls.length} URLs).`);
