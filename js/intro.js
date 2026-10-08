// Pantalla de inicio: decide antes de pintar la página si se muestra (una vez por pestaña y
// nunca con movimiento reducido). Se carga en el <head> sin defer para evitar un parpadeo.
// La animación es CSS (css/style.css, sección "Pantalla de inicio"); aquí solo se activa y se limpia.
// La ola de cobre está adaptada del Preloader.tsx del equipo.
(function () {
  'use strict';

  const CLAVE = 'bwl:intro';
  const raiz = document.documentElement;
  // Con JavaScript, la vitrina del inicio esconde el nombre hasta animar su entrada
  raiz.classList.add('js');

  function yaVista() {
    try {
      return sessionStorage.getItem(CLAVE) === '1';
    } catch {
      return false;
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || yaVista()) return;

  try {
    sessionStorage.setItem(CLAVE, '1');
  } catch {
    // Sin almacenamiento (modo privado estricto): se volverá a mostrar, no pasa nada
  }

  // "intro" se queda (retrasa el destello del logo); "intro-bloqueo" solo dura la animación
  raiz.classList.add('intro', 'intro-bloqueo');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  let terminado = false;
  function terminar() {
    if (terminado) return;
    terminado = true;
    raiz.classList.remove('intro-bloqueo');
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    const capa = document.querySelector('[data-intro]');
    if (capa) capa.remove();
    document.dispatchEvent(new Event('bwl:intro-fin'));
  }

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'intro-fuera') terminar();
  });
  // Respaldo por si el evento no llega (pestaña en segundo plano, etc.)
  setTimeout(terminar, 4200);
})();
