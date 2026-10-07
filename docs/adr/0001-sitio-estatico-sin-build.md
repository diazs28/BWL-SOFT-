# 0001. Sitio estático sin build, con datos del carrusel en un módulo JS

- Estado: aceptada
- Fecha: 2026-10-07

## Contexto

La landing-portafolio de BWL & SOFT necesita cargar rápido (objetivo Lighthouse 90+), publicarse en
Vercel sin pasos extra y permitir agregar proyectos al carrusel sin tocar el HTML.

## Decisión

- HTML + CSS + JavaScript vanilla con módulos ES, sin bundler ni framework (arquetipo A).
- Sin GSAP: el único movimiento automático es CSS (entrada del hero, destello del logo y
  transición del carrusel), así la CSP queda en `script-src 'self'` sin CDNs.
- Los proyectos viven en `js/proyectos.js` y los datos de contacto en `js/config.js`; el carrusel
  se genera con nodos del DOM (`textContent`), nunca con `innerHTML`.
- Las cabeceras de seguridad y la caché se definen en `vercel.json`.

## Consecuencias

- Cero dependencias en producción y despliegue trivial.
- El contenido del carrusel lo genera JavaScript: sin JS se muestra un aviso. Lo esencial para SEO
  (título, descripción, servicios, proceso, JSON-LD) está en el HTML estático.
- El teléfono queda repetido en el JSON-LD estático; está documentado en el README.
