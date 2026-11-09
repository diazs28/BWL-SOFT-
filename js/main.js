// Arranque de la página: enlaces de WhatsApp, menú, vitrina de proyectos, servicios y cotización.
// Usa lo que publican config.js, proyectos.js, letras.js, vitrina.js, servicios.js y cotizar.js
// en window.BWL.
(function () {
  'use strict';

  const {
    MARCA,
    enlaceWhatsapp,
    PROYECTOS,
    iniciarVitrina,
    iniciarServicios,
    iniciarCotizar,
    iniciarEquipo,
    idioma,
    t,
  } = window.BWL;

  // ---------- Datos de marca ----------
  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = enlaceWhatsapp();
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-marca]').forEach((el) => {
    const valor = MARCA[el.dataset.marca];
    if (valor) el.textContent = valor;
  });

  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Redes del pie: solo las que tengan URL en config.js
  const listaRedes = document.querySelector('[data-redes]');
  if (listaRedes) {
    const nombres = { github: 'GitHub', instagram: 'Instagram', linkedin: 'LinkedIn' };
    Object.entries(MARCA.redes).forEach(([red, url]) => {
      if (!url) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = nombres[red] ?? red;
      li.append(a);
      listaRedes.append(li);
    });
    if (MARCA.correo) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `mailto:${MARCA.correo}`;
      a.textContent = MARCA.correo;
      li.append(a);
      listaRedes.append(li);
    }
  }

  // ---------- Navegación ----------
  const nav = document.querySelector('[data-nav]');
  const botonMenu = document.querySelector('[data-menu-boton]');
  const menu = document.querySelector('[data-menu]');

  function cerrarMenu() {
    menu.classList.remove('is-open');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.querySelector('.sr').textContent = t('Abrir menú', 'Open menu');
  }

  botonMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('is-open');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.querySelector('.sr').textContent = abierto
      ? t('Cerrar menú', 'Close menu')
      : t('Abrir menú', 'Open menu');
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) cerrarMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      cerrarMenu();
      botonMenu.focus();
    }
  });

  const marcarScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', marcarScroll, { passive: true });
  requestAnimationFrame(marcarScroll);

  // ---------- Vitrina de proyectos del inicio ----------
  // En inglés, cada proyecto toma los textos de su bloque "en" (ver js/proyectos.js). La página
  // vive en en/, así que las capturas suben una carpeta para encontrar assets/.
  const proyectos =
    idioma === 'en'
      ? PROYECTOS.map(({ en = {}, ...p }) => ({
          ...p,
          ...en,
          vitrina: { ...p.vitrina, ...en.vitrina },
          imagenes: {
            escritorio: `../${p.imagenes.escritorio}`,
            movil: `../${p.imagenes.movil}`,
          },
        }))
      : PROYECTOS;

  iniciarVitrina(document.querySelector('[data-vitrina]'), proyectos, {
    marca: MARCA.nombre,
    enlaceDemo: (p) =>
      enlaceWhatsapp(
        t(
          `Hola, BWL & SOFT. Me gustaría ver una demo de ${p.nombre}.`,
          `Hi, BWL & SOFT. I would like to see a demo of ${p.nombre}.`,
        ),
      ),
  });

  // ---------- Servicios ----------
  iniciarServicios(document.querySelector('[data-servicios]'));

  // ---------- Cotización por WhatsApp (botón flotante) ----------
  iniciarCotizar(document.querySelector('[data-cotizar]'), {
    boton: document.querySelector('[data-cotizar-boton]'),
    enlaceWhatsapp,
  });

  // ---------- Hojas de vida del equipo (botón CV) ----------
  iniciarEquipo(document.querySelector('[data-equipo]'), {
    boton: document.querySelector('[data-equipo-boton]'),
  });
})();
