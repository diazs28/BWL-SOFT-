// Vitrina del inicio: miniaturas de los proyectos sobre el nombre gigante "BWL & SOFT".
// Al pasar el mouse (o enfocar, o tocar en el celular) por una miniatura, las letras del
// nombre se hunden y emergen las del proyecto con su color. Un círculo sigue al cursor
// sobre la fila. Al hacer clic se baja al proyecto en el carrusel.
// La entrada del nombre se sincroniza con el final de la pantalla de inicio (js/intro.js).
// Inspirada en el efecto "Hover members"; implementación propia sin librerías.

(function () {
  'use strict';

  const ESCALONADO = 40; // ms entre letras
  const DURACION = 500;
  const CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const SALIDA = 'translateY(105%)';

  function crear(tag, clase, texto) {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
  }

  function iniciarVitrina(raiz, proyectos, { marca }) {
    if (!raiz) return;

    const caja = raiz.querySelector('[data-vitrina-nombre]');
    const fila = raiz.querySelector('[data-vitrina-fila]');
    const anuncio = raiz.querySelector('[data-vitrina-anuncio]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');

    const PORDEFECTO = { nombre: marca, color: 'var(--vitrina-hueso)', solido: '' };
    let palabraActual = null;
    let claveActual = '';
    let activa = null; // miniatura activa

    // ---------- Nombre gigante, letra por letra ----------
    function crearPalabra({ nombre, color }) {
      const palabra = crear('span', 'vitrina__palabra');
      palabra.style.setProperty('--relleno', color);
      for (const caracter of nombre) {
        const letra = crear('span', 'vitrina__letra', caracter === ' ' ? ' ' : caracter);
        if (caracter === ' ') letra.classList.add('vitrina__letra--espacio');
        palabra.append(letra);
      }
      caja.append(palabra);
      ajustar(palabra);
      return palabra;
    }

    // Si un nombre largo no cabe en pantallas angostas, se reduce solo ese nombre
    function ajustar(palabra) {
      palabra.style.fontSize = '';
      const disponible = caja.clientWidth;
      const ancho = palabra.scrollWidth;
      if (ancho > disponible && disponible > 0) {
        const actual = parseFloat(getComputedStyle(palabra).fontSize);
        palabra.style.fontSize = `${Math.floor(actual * (disponible / ancho) * 0.98)}px`;
      }
    }

    function animarLetras(palabra, entra, alTerminar) {
      const letras = [...palabra.children];
      let ultima = null;
      letras.forEach((letra, i) => {
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

    function mostrar(item) {
      const clave = item.nombre;
      if (clave === claveActual) return;
      claveActual = clave;

      // La anterior se hunde mientras la nueva emerge en el mismo lugar
      if (palabraActual) {
        const saliente = palabraActual;
        saliente.classList.add('is-saliendo');
        animarLetras(saliente, false, () => saliente.remove());
      }
      palabraActual = crearPalabra(item);
      animarLetras(palabraActual, true);
    }

    // ---------- Miniaturas ----------
    const items = proyectos
      .filter((p) => p.vitrina)
      .map((p) => {
        const li = crear('li', 'vitrina__item');
        const a = crear('a', 'vitrina__mini');
        a.href = `#proyecto-${p.id}`;
        a.setAttribute('aria-label', `${p.nombre}: ${p.tipo}. Ver proyecto`);
        a.style.setProperty('--solido', p.vitrina.solido);
        const img = document.createElement('img');
        img.src = p.imagenes.escritorio.replace('.webp', '-800.webp');
        img.alt = '';
        img.width = 48;
        img.height = 48;
        img.decoding = 'async';
        a.append(img);
        li.append(a);
        fila.append(li);
        return { a, p };
      });

    function activar(item) {
      if (activa === item.a) return;
      if (activa) activa.classList.remove('is-activa');
      activa = item.a;
      activa.classList.add('is-activa');
      // En el celular la fila se desplaza para que la miniatura activa se vea completa
      if (fila.scrollWidth > fila.clientWidth) {
        const centro = activa.offsetLeft + activa.offsetWidth / 2 - fila.clientWidth / 2;
        fila.scrollTo({ left: centro, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
      raiz.style.setProperty('--cursor-color', item.p.vitrina.solido);
      mostrar(item.p.vitrina);
      anuncio.textContent = `${item.p.nombre}, ${item.p.tipo}`;
    }

    function restaurar() {
      if (activa) activa.classList.remove('is-activa');
      activa = null;
      mostrar(PORDEFECTO);
      anuncio.textContent = '';
    }

    // Tipo del último puntero que presionó una miniatura ('' = teclado)
    let tipoPuntero = '';
    fila.addEventListener('pointerdown', (e) => {
      tipoPuntero = e.pointerType;
    });

    items.forEach((item) => {
      item.a.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') activar(item);
      });
      // Solo el foco con teclado cuenta como hover; el del toque se maneja en el clic
      item.a.addEventListener('focus', () => {
        if (!tipoPuntero) activar(item);
      });
      item.a.addEventListener('click', (e) => {
        e.preventDefault();
        const tactil = tipoPuntero === 'touch' || tipoPuntero === 'pen';
        tipoPuntero = '';
        // En pantallas táctiles el primer toque muestra el nombre y el segundo abre el proyecto
        if (tactil && activa !== item.a) {
          activar(item);
          return;
        }
        irAlProyecto(item.p.id);
      });
    });

    fila.addEventListener('mouseleave', restaurar);
    fila.addEventListener('focusout', (e) => {
      if (!fila.contains(e.relatedTarget)) restaurar();
    });
    document.addEventListener('pointerdown', (e) => {
      if (activa && e.pointerType !== 'mouse' && !fila.contains(e.target)) restaurar();
    });

    function irAlProyecto(id) {
      document.dispatchEvent(new CustomEvent('bwl:ver-proyecto', { detail: { id } }));
      const destino = document.getElementById('proyectos');
      if (!destino) return;
      destino.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      const slide = document.getElementById(`proyecto-${id}`);
      if (slide) {
        slide.tabIndex = -1;
        slide.focus({ preventScroll: true });
      }
    }

    // ---------- Círculo que sigue al cursor (solo mouse) ----------
    const cursor = crear('div', 'vitrina__cursor');
    cursor.setAttribute('aria-hidden', 'true');
    const flecha = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    flecha.setAttribute('viewBox', '0 0 24 24');
    const trazo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trazo.setAttribute('d', 'M7 17 17 7M8 7h9v9');
    flecha.append(trazo);
    cursor.append(flecha);
    raiz.append(cursor);

    // Resorte simple: rigidez 400, amortiguación 30, masa 1
    const resorte = { x: 0, y: 0, vx: 0, vy: 0, objX: 0, objY: 0 };
    let cuadro = null;
    let ultimo = 0;

    function paso(t) {
      const dt = Math.min((t - ultimo) / 1000, 1 / 30);
      ultimo = t;
      for (const eje of ['x', 'y']) {
        const v = eje === 'x' ? 'vx' : 'vy';
        const obj = eje === 'x' ? resorte.objX : resorte.objY;
        const fuerza = 400 * (obj - resorte[eje]) - 30 * resorte[v];
        resorte[v] += fuerza * dt;
        resorte[eje] += resorte[v] * dt;
      }
      cursor.style.transform = `translate3d(${resorte.x}px, ${resorte.y}px, 0)`;
      const quieto =
        Math.abs(resorte.objX - resorte.x) < 0.1 &&
        Math.abs(resorte.objY - resorte.y) < 0.1 &&
        Math.abs(resorte.vx) + Math.abs(resorte.vy) < 0.1;
      cuadro = quieto ? null : requestAnimationFrame(paso);
    }

    function seguir(e) {
      resorte.objX = e.clientX;
      resorte.objY = e.clientY;
      if (reduceMotion.matches) {
        resorte.x = resorte.objX;
        resorte.y = resorte.objY;
        cursor.style.transform = `translate3d(${resorte.x}px, ${resorte.y}px, 0)`;
        return;
      }
      if (!cuadro) {
        ultimo = performance.now();
        cuadro = requestAnimationFrame(paso);
      }
    }

    fila.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !punteroFino.matches) return;
      // Aparece donde está el puntero, sin viajar desde la esquina
      resorte.x = resorte.objX = e.clientX;
      resorte.y = resorte.objY = e.clientY;
      resorte.vx = resorte.vy = 0;
      cursor.style.transform = `translate3d(${resorte.x}px, ${resorte.y}px, 0)`;
      cursor.classList.add('is-visible');
    });
    fila.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') seguir(e);
    });
    fila.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));

    // ---------- Entrada sincronizada con la pantalla de inicio ----------
    function entrar() {
      if (raiz.classList.contains('is-lista')) return;
      raiz.classList.add('is-lista');
      caja.replaceChildren();
      claveActual = '';
      palabraActual = null;
      mostrar(PORDEFECTO);
      // Las miniaturas aparecen cuando el nombre ya casi terminó de subir
      const base = reduceMotion.matches ? 0 : DURACION + marca.length * ESCALONADO - 200;
      items.forEach(({ a }, i) => {
        a.parentElement.animate(
          reduceMotion.matches
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, transform: 'translateY(12px) scale(0.6)' },
                { opacity: 1, transform: 'none' },
              ],
          { duration: 420, delay: base + i * 70, easing: CURVA, fill: 'backwards' },
        );
      });
    }

    if (document.documentElement.classList.contains('intro-bloqueo')) {
      // Las letras suben justo cuando la capa de cobre se desvanece; si la animación no
      // corre (pestaña en segundo plano), entran cuando js/intro.js retira la capa
      document.addEventListener('animationstart', (e) => {
        if (e.animationName === 'intro-fuera') entrar();
      });
      document.addEventListener('bwl:intro-fin', entrar);
    } else {
      entrar();
    }

    // Recalcula el tamaño de los nombres largos al girar o cambiar el ancho
    window.addEventListener(
      'resize',
      () => {
        if (palabraActual) ajustar(palabraActual);
      },
      { passive: true },
    );
  }

  window.BWL = Object.assign(window.BWL || {}, { iniciarVitrina });
})();
