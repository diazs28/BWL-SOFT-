// Datos de marca de BWL & SOFT. Cambia aquí cualquier dato de contacto:
// el resto de la página los toma de este archivo.
(function () {
  'use strict';

  const MARCA = {
    nombre: 'BWL & SOFT',
    nombreLargo: 'BWL SOFT · Binomio Web Lab',
    ciudad: 'Popayán, Cauca',
    pais: 'Colombia',
    // Solo dígitos, con indicativo de país (57) y sin "+".
    whatsapp: '573158220440',
    whatsappVisible: '+57 315 822 0440',
    mensajeWhatsapp: 'Hola, BWL & SOFT. Quiero cotizar un software para mi negocio.',
    // Deja vacío lo que todavía no exista: no se muestra en la página.
    correo: '',
    redes: {
      github: 'https://github.com/dante312w',
      instagram: '',
      linkedin: '',
    },
  };

  /** Arma el enlace de WhatsApp con el mensaje codificado. */
  function enlaceWhatsapp(mensaje = MARCA.mensajeWhatsapp) {
    return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  window.BWL = Object.assign(window.BWL || {}, { MARCA, enlaceWhatsapp });
})();
