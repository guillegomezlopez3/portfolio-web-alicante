# DigitalSolutionsCMV – programas de gestión, webs y tiendas online (Alicante)

Web de marca personal y captación de clientes locales, con 7 demos interactivas (programa de gestión, inventario, restaurante, tienda, clínica, barbería y taller) y landings de SEO local. HTML5, CSS3 y JavaScript vanilla: sin frameworks, sin build y sin dependencias (solo Google Fonts e imágenes de Unsplash).

Cada página tiene su propia dirección de arte: la web principal es una "ficha técnica" en papel y tinta; cada demo (restaurante, tienda, clínica, barbería, taller) tiene su propia identidad visual.

## Estructura

```
index.html                    Web principal
alicante.html, elche.html,    Landings de SEO local (texto propio, FAQPage + JSON-LD por ciudad)
san-vicente-del-raspeig.html,
playa-de-san-juan.html, benidorm.html
legal.html                    Aviso legal, privacidad y cookies
demos/restaurante.html        La Terreta Gastrobar: carta con alérgenos, menú del día, pedidos, reservas, eventos
demos/tienda.html             Alicante Urban Store: catálogo, favoritos, carrito, cupones, checkout, seguimiento
demos/clinica.html            Clínica Bienestar: test de orientación, tarifas, cita en pasos, área de paciente
demos/barberia.html           Barbería Casco Antiguo: tarifas, galería, tienda, bonos, fidelidad, reservas
demos/taller.html             Taller Mediterráneo: packs, presupuesto, ITV, estado por matrícula, cita
css/styles.css                Estilos de la web principal y las landings
css/demo-base.css             Base común de las demos
css/demo-*.css                Estilos propios de cada demo
js/main.js                    Lógica de la web principal (menú, índice, ficha de proyecto → WhatsApp)
js/chatbot.js, css/chatbot.css Asistente automático con respuestas preprogramadas (sin IA ni servidor; se edita en el array KB)
js/demo.js                    Utilidades compartidas de las demos
js/demo-*.js                  Lógica de cada demo
favicon.svg, robots.txt, sitemap.xml
tools/gen-landings.js        Genera las landings de ciudad, legal.html y sitemap.xml (node tools/gen-landings.js)
```

## Probar en local
Abre `index.html` en el navegador. No hace falta servidor.

## Activar GitHub Pages
1. En el repositorio: **Settings → Pages**.
2. *Source*: **Deploy from a branch** → rama `main`, carpeta `/ (root)`.
3. Guarda. En ~1 minuto estará en `https://digitalsolutionscmv.es/`.

Si usas otra URL o dominio propio, actualiza `canonical`, Open Graph y JSON-LD en `index.html` y en las landings, además de `robots.txt` y `sitemap.xml`.

## Pendiente de completar
- NIF del titular en `legal.html`.
- Imágenes de Unsplash: conviene sustituirlas por fotos propias en el portfolio.

## Contacto
WhatsApp +34 620 477 443
