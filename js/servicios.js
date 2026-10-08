// Sección de servicios: mientras se recorren los servicios, la palabra gigante fija cambia al
// del servicio que se está leyendo (sus letras se hunden y emergen) y ese servicio se ilumina.
// Más abajo, los pasos de "Cómo trabajamos" se encienden en orden la primera vez que aparecen.
// Es solo visual: no requiere clics. Usa js/letras.js.

(function () {
  'use strict';

  function iniciarServicios(raiz) {
    if (!raiz) return;

    const { letras } = window.BWL;
    const caja = raiz.querySelector('[data-servicios-nombre]');
    const items = [...raiz.querySelectorAll('[data-servicio]')];
    const pasos = raiz.querySelector('[data-pasos]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!caja || items.length === 0) return;

    const datos = (item) => ({ nombre: item.dataset.nombre, color: item.dataset.color });
    let actual = 0;

    // Estado inicial: el primer servicio, sin animar (todavía no se ve)
    caja.replaceChildren();
    let palabra = letras.crearPalabra(caja, datos(items[0]));
    items[0].classList.add('is-activo');
    raiz.classList.add('is-lista');

    function activar(indice) {
      if (indice === actual) return;
      actual = indice;
      items.forEach((item, i) => item.classList.toggle('is-activo', i === indice));
      palabra = letras.reemplazar(caja, palabra, datos(items[indice]));
    }

    // El orden de cada paso define cuándo se enciende (ver --i en css/style.css)
    if (pasos) [...pasos.children].forEach((paso, i) => paso.style.setProperty('--i', i));

    if (!('IntersectionObserver' in window)) {
      if (pasos) pasos.classList.add('is-encendida');
      return;
    }

    // El servicio activo es el que cruza la franja central de la pantalla
    const observadorServicios = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) activar(items.indexOf(e.target));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.forEach((item) => observadorServicios.observe(item));

    if (pasos) {
      if (reduceMotion.matches) {
        pasos.classList.add('is-encendida');
      } else {
        const observadorPasos = new IntersectionObserver(
          (entradas) => {
            if (entradas.some((e) => e.isIntersecting)) {
              pasos.classList.add('is-encendida');
              observadorPasos.disconnect();
            }
          },
          { threshold: 0.35 },
        );
        observadorPasos.observe(pasos);
      }
    }

    window.addEventListener('resize', () => letras.ajustar(caja, palabra), { passive: true });
  }

  window.BWL = Object.assign(window.BWL || {}, { iniciarServicios });
})();
