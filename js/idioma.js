// Idioma de la página. Lo toma de <html lang>: "es-CO" en index.html y "en" en en/index.html.
// Los demás scripts usan BWL.t('texto en español', 'English text') para sus mensajes.
// Se carga antes que config.js.
(function () {
  'use strict';

  const idioma = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';

  /** Devuelve el texto en el idioma de la página. */
  const t = (es, en) => (idioma === 'en' ? en : es);

  window.BWL = Object.assign(window.BWL || {}, { idioma, t });
})();
