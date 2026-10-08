// Texto gigante letra por letra (Anton con textura de líneas): lo usan la vitrina del inicio
// y la sección de servicios. Las letras emergen desde abajo de su caja (overflow: hidden) y se
// hunden al salir, una tras otra. Estilos en css/style.css, sección "Texto gigante".

(function () {
  'use strict';

  const ESCALONADO = 40; // ms entre letras
  const DURACION = 500;
  const CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const SALIDA = 'translateY(105%)';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Crea la palabra dentro de la caja; item = { nombre, color } (color o degradado CSS). */
  function crearPalabra(caja, { nombre, color }) {
    const palabra = document.createElement('span');
    palabra.className = 'gigante__palabra';
    palabra.style.setProperty('--relleno', color);
    for (const caracter of nombre) {
      const letra = document.createElement('span');
      letra.className = 'gigante__letra';
      letra.textContent = caracter === ' ' ? ' ' : caracter;
      if (caracter === ' ') letra.classList.add('gigante__letra--espacio');
      palabra.append(letra);
    }
    caja.append(palabra);
    ajustar(caja, palabra);
    return palabra;
  }

  /** Si la palabra no cabe en la caja, reduce solo esa palabra. */
  function ajustar(caja, palabra) {
    palabra.style.fontSize = '';
    const disponible = caja.clientWidth;
    const ancho = palabra.scrollWidth;
    if (ancho > disponible && disponible > 0) {
      const tam = parseFloat(getComputedStyle(palabra).fontSize);
      palabra.style.fontSize = `${Math.floor(tam * (disponible / ancho) * 0.98)}px`;
    }
  }

  /** Hace emerger (entra) o hundirse las letras; con movimiento reducido solo funde. */
  function animarLetras(palabra, entra, alTerminar) {
    let ultima = null;
    [...palabra.children].forEach((letra, i) => {
      const fotogramas = reduceMotion.matches
        ? [{ opacity: entra ? 0 : 1 }, { opacity: entra ? 1 : 0 }]
        : [
            { transform: entra ? SALIDA : 'translateY(0)' },
            { transform: entra ? 'translateY(0)' : SALIDA },
          ];
      ultima = letra.animate(fotogramas, {
        duration: reduceMotion.matches ? 200 : DURACION,
        delay: reduceMotion.matches ? 0 : i * ESCALONADO,
        easing: CURVA,
        fill: 'both',
      });
    });
    if (ultima && alTerminar) ultima.finished.then(alTerminar, alTerminar);
  }

  /** Cambia la palabra de la caja: la anterior se hunde mientras la nueva emerge. */
  function reemplazar(caja, actual, item, { inmediato = false } = {}) {
    if (actual) {
      if (inmediato) {
        caja.querySelectorAll('.gigante__palabra').forEach((p) => p.remove());
      } else {
        actual.classList.add('is-saliendo');
        animarLetras(actual, false, () => actual.remove());
      }
    }
    const nueva = crearPalabra(caja, item);
    animarLetras(nueva, true);
    return nueva;
  }

  window.BWL = Object.assign(window.BWL || {}, {
    letras: { crearPalabra, ajustar, animarLetras, reemplazar, ESCALONADO, DURACION, CURVA },
  });
})();
