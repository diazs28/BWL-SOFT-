// Carrusel de proyectos: flechas, puntos, swipe, teclado y reproducción automática
// que se pausa con el mouse, el foco o al tocar. Sin autoplay si el sistema pide
// menos movimiento.

(function () {
  'use strict';

  const DURACION = 6500;
  const PAUSA_TRAS_TOQUE = 10000;
  const UMBRAL_SWIPE = 50;

  const ETIQUETAS = {
    privado: { icono: 'i-candado', texto: 'Software privado' },
    demo: { icono: 'i-candado', texto: 'Demo bajo solicitud' },
  };

  function crear(tag, clase, texto) {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
  }

  function icono(id, clase = 'icono') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', clase);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 24 24');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${id}`);
    svg.append(use);
    return svg;
  }

  function hostDe(url) {
    try {
      return new URL(url).host;
    } catch {
      return '';
    }
  }

  function crearSlide(p, i, total, enlaceDemo) {
    const li = crear('div', 'slide');
    li.id = `proyecto-${p.id}`;
    li.setAttribute('role', 'group');
    li.setAttribute('aria-roledescription', 'diapositiva');
    li.setAttribute('aria-label', `${i + 1} de ${total}: ${p.nombre}`);

    // Vista previa dentro del marco (navegador o teléfono, según el ancho)
    const figura = crear('figure', 'marco');
    const barra = crear('div', 'marco__barra');
    barra.setAttribute('aria-hidden', 'true');
    const puntos = crear('div', 'marco__puntos');
    puntos.append(crear('span'), crear('span'), crear('span'));
    const url = crear(
      'div',
      'marco__url',
      p.estado === 'en-vivo'
        ? hostDe(p.url)
        : p.estado === 'privado'
          ? 'red local del negocio'
          : 'demo privada',
    );
    barra.append(puntos, url);

    const picture = document.createElement('picture');
    const fuente = document.createElement('source');
    fuente.media = '(max-width: 767px)';
    fuente.srcset = p.imagenes.movil;
    fuente.width = 585;
    fuente.height = 1266;
    const img = document.createElement('img');
    img.src = p.imagenes.escritorio;
    img.srcset = `${p.imagenes.escritorio.replace('.webp', '-800.webp')} 800w, ${p.imagenes.escritorio} 1280w`;
    img.sizes = '(min-width: 1180px) 690px, (min-width: 1000px) 58vw, 100vw';
    img.alt = p.alt;
    img.width = 1280;
    img.height = 800;
    img.decoding = 'async';
    img.draggable = false;
    if (i > 0) img.loading = 'lazy';
    picture.append(fuente, img);
    figura.append(barra, picture);

    // Información
    const info = crear('div', 'slide__info');
    const nombre = crear('h3', 'slide__nombre', p.nombre);
    const tipo = crear('p', 'slide__tipo', p.tipo);
    const cliente = crear('p', 'slide__cliente', p.cliente);
    const desc = crear('p', 'slide__desc', p.descripcion);
    const chips = crear('ul', 'chips');
    chips.setAttribute('aria-label', 'Tecnologías');
    p.stack.forEach((t) => chips.append(crear('li', '', t)));

    const accion = crear('div', 'slide__accion');
    if (p.estado === 'en-vivo' && p.url) {
      const a = crear('a', 'boton boton--borde');
      a.href = p.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.append('Ver en vivo', icono('i-externo'));
      a.setAttribute('aria-label', `Ver en vivo: ${p.nombre} (abre una pestaña nueva)`);
      accion.append(a);
    } else {
      const etiqueta = ETIQUETAS[p.estado] ?? ETIQUETAS.demo;
      const span = crear('p', 'etiqueta');
      span.append(icono(etiqueta.icono), etiqueta.texto);
      if (p.estado === 'demo') {
        const pide = crear('a', '', 'pídela por WhatsApp');
        pide.href = enlaceDemo(p);
        pide.target = '_blank';
        pide.rel = 'noopener noreferrer';
        span.append(' · ', pide);
      }
      accion.append(span);
    }

    info.append(tipo, nombre, cliente, desc, chips, accion);
    li.append(figura, info);
    return li;
  }

  function iniciarCarrusel(raiz, proyectos, { enlaceDemo }) {
    if (!raiz || proyectos.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const total = proyectos.length;
    let actual = 0;
    let reproduciendo = !reduceMotion.matches;
    let retenido = false; // pausa temporal por mouse, foco o toque
    let temporizador = null;
    let reanudarTrasToque = null;

    raiz.setAttribute('role', 'region');
    raiz.setAttribute('aria-roledescription', 'carrusel');
    raiz.setAttribute('aria-label', 'Proyectos de BWL & SOFT');
    raiz.style.setProperty('--duracion', `${DURACION}ms`);

    const viewport = crear('div', 'carrusel__viewport');
    const pista = crear('div', 'carrusel__pista');
    pista.id = 'carrusel-pista';
    const slides = proyectos.map((p, i) => crearSlide(p, i, total, enlaceDemo));
    pista.append(...slides);
    viewport.append(pista);

    const controles = crear('div', 'carrusel__controles');
    const anterior = crear('button', 'control control--ant');
    anterior.type = 'button';
    anterior.setAttribute('aria-controls', pista.id);
    anterior.setAttribute('aria-label', 'Proyecto anterior');
    anterior.append(icono('i-flecha', ''));

    const siguiente = crear('button', 'control control--sig');
    siguiente.type = 'button';
    siguiente.setAttribute('aria-controls', pista.id);
    siguiente.setAttribute('aria-label', 'Proyecto siguiente');
    siguiente.append(icono('i-flecha', ''));

    const puntos = crear('div', 'puntos');
    puntos.setAttribute('role', 'group');
    puntos.setAttribute('aria-label', 'Elegir proyecto');
    const botonesPunto = proyectos.map((p, i) => {
      const b = crear('button', 'punto');
      b.type = 'button';
      b.setAttribute('aria-controls', pista.id);
      b.setAttribute('aria-label', `Ver proyecto ${i + 1}: ${p.nombre}`);
      b.append(crear('span'));
      b.addEventListener('click', () => irA(i));
      puntos.append(b);
      return b;
    });

    const pausa = crear('button', 'control control--pausa');
    pausa.type = 'button';

    controles.append(anterior, puntos, siguiente, pausa);
    raiz.replaceChildren(viewport, controles);

    function pintar() {
      pista.style.transform = `translateX(${-actual * 100}%)`;
      slides.forEach((s, i) => {
        const activo = i === actual;
        s.inert = !activo;
        s.classList.toggle('is-active', activo);
        s.setAttribute('aria-hidden', String(!activo));
      });
      botonesPunto.forEach((b, i) => {
        b.setAttribute('aria-current', String(i === actual));
      });
      // Reinicia la barra de avance del punto activo
      raiz.classList.remove('is-playing');
      void raiz.offsetWidth;
      raiz.classList.toggle('is-playing', reproduciendo);
      raiz.classList.toggle('is-held', retenido);
    }

    function pintarPausa() {
      pausa.replaceChildren(icono(reproduciendo ? 'i-pausa' : 'i-play', ''));
      pausa.setAttribute(
        'aria-label',
        reproduciendo ? 'Pausar presentación automática' : 'Reproducir presentación automática',
      );
      // Con autoplay activo, los cambios no se anuncian para no interrumpir al lector
      pista.setAttribute('aria-live', reproduciendo ? 'off' : 'polite');
    }

    function programar() {
      clearTimeout(temporizador);
      if (reproduciendo && !retenido && document.visibilityState === 'visible') {
        temporizador = setTimeout(() => irA(actual + 1), DURACION);
      }
    }

    // Cada cambio, automático o del usuario, reinicia el conteo del autoplay
    function irA(indice) {
      actual = (indice + total) % total;
      pintar();
      programar();
    }

    function retener(valor) {
      retenido = valor;
      raiz.classList.toggle('is-held', retenido);
      if (retenido) {
        clearTimeout(temporizador);
      } else {
        // Al soltar, se reinicia el conteo completo del slide actual
        pintar();
        programar();
      }
    }

    // La vitrina del inicio pide mostrar un proyecto concreto
    document.addEventListener('bwl:ver-proyecto', (e) => {
      const indice = proyectos.findIndex((p) => p.id === e.detail.id);
      if (indice >= 0) irA(indice);
    });

    anterior.addEventListener('click', () => irA(actual - 1));
    siguiente.addEventListener('click', () => irA(actual + 1));
    pausa.addEventListener('click', () => {
      reproduciendo = !reproduciendo;
      pintarPausa();
      pintar();
      programar();
    });

    // Teclado: flechas, Inicio y Fin cuando el foco está dentro del carrusel
    raiz.addEventListener('keydown', (e) => {
      const acciones = {
        ArrowLeft: () => irA(actual - 1),
        ArrowRight: () => irA(actual + 1),
        Home: () => irA(0),
        End: () => irA(total - 1),
      };
      const accion = acciones[e.key];
      if (!accion) return;
      e.preventDefault();
      accion();
      if (e.target.classList.contains('punto')) botonesPunto[actual].focus();
    });

    // Pausa con mouse encima o foco dentro
    raiz.addEventListener('mouseenter', () => retener(true));
    raiz.addEventListener('mouseleave', () => {
      if (!raiz.contains(document.activeElement)) retener(false);
    });
    raiz.addEventListener('focusin', () => retener(true));
    raiz.addEventListener('focusout', (e) => {
      if (!raiz.contains(e.relatedTarget) && !raiz.matches(':hover')) retener(false);
    });
    document.addEventListener('visibilitychange', programar);

    // Swipe (táctil) y arrastre (mouse)
    let inicioX = 0;
    let inicioY = 0;
    let dx = 0;
    let arrastrando = false;
    let eje = null;

    viewport.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('a, button')) return;
      arrastrando = true;
      eje = null;
      inicioX = e.clientX;
      inicioY = e.clientY;
      dx = 0;
      if (e.pointerType !== 'mouse') {
        clearTimeout(reanudarTrasToque);
        retener(true);
      }
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!arrastrando) return;
      const mx = e.clientX - inicioX;
      const my = e.clientY - inicioY;
      if (!eje && (Math.abs(mx) > 8 || Math.abs(my) > 8)) {
        eje = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
        if (eje === 'x') {
          viewport.setPointerCapture(e.pointerId);
          viewport.classList.add('is-dragging');
        }
      }
      if (eje !== 'x') return;
      dx = mx;
      const ancho = viewport.clientWidth || 1;
      pista.style.transform = `translateX(${-actual * 100 + (dx / ancho) * 100}%)`;
    });

    function soltar(e) {
      if (!arrastrando) return;
      arrastrando = false;
      viewport.classList.remove('is-dragging');
      if (eje === 'x' && Math.abs(dx) > UMBRAL_SWIPE) {
        irA(dx < 0 ? actual + 1 : actual - 1);
      } else {
        pintar();
      }
      if (e.pointerType !== 'mouse') {
        clearTimeout(reanudarTrasToque);
        reanudarTrasToque = setTimeout(() => retener(false), PAUSA_TRAS_TOQUE);
      }
    }
    viewport.addEventListener('pointerup', soltar);
    viewport.addEventListener('pointercancel', soltar);

    // Si el usuario activa "reducir movimiento" con la página abierta, se apaga el autoplay
    reduceMotion.addEventListener('change', (e) => {
      if (e.matches) {
        reproduciendo = false;
        pintarPausa();
        pintar();
        programar();
      }
    });

    pintarPausa();
    pintar();
    programar();
  }

  window.BWL = Object.assign(window.BWL || {}, { iniciarCarrusel });
})();
