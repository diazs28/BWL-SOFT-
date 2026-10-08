// Vitrina del inicio: miniaturas de los proyectos sobre el nombre gigante "BWL & SOFT".
//
// Cerrada: al pasar el mouse (o enfocar con teclado) por una miniatura, las letras del
// nombre se hunden y emergen las del proyecto con su color. Un círculo sigue al cursor.
// Abierta: al hacer clic (o tocar), la miniatura vuela y crece hasta ser la vista previa
// grande del proyecto (View Transitions API) y aparece su ficha: descripción, tecnologías y
// enlace. Entre proyectos se cambia con las flechas, el teclado o deslizando; una cortina del
// color del proyecto barre la vista previa. Esc o "Cerrar" vuelve al inicio.
//
// La entrada del nombre se sincroniza con el final de la pantalla de inicio (js/intro.js).
// Inspirada en el efecto "Hover members" y en las transiciones de Skiper UI; implementación
// propia sin librerías.

(function () {
  'use strict';

  const { letras, crearObrero } = window.BWL;
  const { ESCALONADO, DURACION, CURVA } = letras;
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

  function icono(id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icono');
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

  // Espera a que la imagen esté lista, sin bloquear más de lo razonable
  function cargada(img, limite = 600) {
    const decodificar = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    return Promise.race([decodificar, new Promise((r) => setTimeout(r, limite))]);
  }

  function iniciarVitrina(raiz, proyectos, { marca, enlaceDemo }) {
    if (!raiz) return;

    const $ = (sel) => raiz.querySelector(sel);
    const caja = $('[data-vitrina-nombre]');
    const fila = $('[data-vitrina-fila]');
    const anuncio = $('[data-vitrina-anuncio]');
    const ficha = $('[data-ficha]');
    const marco = $('[data-ficha-marco]');
    const foto = $('[data-ficha-img]');
    const fuenteMovil = $('[data-ficha-fuente]');
    const cortina = $('[data-ficha-cortina]');
    const piezas = [...ficha.querySelectorAll('[data-ficha-pieza]')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');

    const PORDEFECTO = { nombre: marca, color: 'var(--vitrina-hueso)' };
    let palabraActual = null;
    let claveActual = '';
    let preview = null; // miniatura con el nombre en vista previa (vitrina cerrada)
    let abierta = false;
    let actual = 0;
    let ocupado = false;
    let pendiente = null;
    let focoSilencioso = false; // foco devuelto por código: no previsualiza

    // ---------- Nombre gigante, letra por letra (js/letras.js) ----------
    const ajustar = (palabra) => letras.ajustar(caja, palabra);

    // inmediato: la palabra anterior se quita sin animar (la transición de vista ya la funde)
    function mostrar(item, { inmediato = false } = {}) {
      if (item.nombre === claveActual) {
        if (palabraActual) ajustar(palabraActual);
        return;
      }
      claveActual = item.nombre;
      palabraActual = letras.reemplazar(caja, palabraActual, item, { inmediato });
    }

    // ---------- Miniaturas ----------
    const items = proyectos
      .filter((p) => p.vitrina)
      .map((p, i) => {
        const li = crear('li', 'vitrina__item');
        const boton = crear('button', 'vitrina__mini');
        boton.type = 'button';
        boton.setAttribute('aria-controls', 'ficha');
        boton.setAttribute('aria-pressed', 'false');
        boton.setAttribute('aria-label', `${p.nombre}: ${p.tipo}`);
        boton.style.setProperty('--solido', p.vitrina.solido);
        const img = document.createElement('img');
        img.src = p.imagenes.escritorio.replace('.webp', '-800.webp');
        img.alt = '';
        img.width = 48;
        img.height = 48;
        img.decoding = 'async';
        boton.append(img);
        li.append(boton);
        fila.append(li);
        return { boton, img, p, i };
      });
    if (items.length === 0) return;

    // Copias solo visuales para llenar el anillo 3D: cada proyecto aparece dos veces.
    // Las copias no se enfocan ni se anuncian; al tocarlas actúan como su original.
    const caras = items.map((item) => ({ boton: item.boton, img: item.img, item }));
    items.forEach((item) => {
      const li = crear('li', 'vitrina__item');
      li.setAttribute('aria-hidden', 'true');
      const boton = item.boton.cloneNode(true);
      boton.tabIndex = -1;
      boton.removeAttribute('aria-controls');
      li.append(boton);
      fila.append(li);
      caras.push({ boton, img: boton.querySelector('img'), item });
    });

    // ---------- Anillo 3D de miniaturas ----------
    // Las miniaturas giran en un anillo (360°). Gira solo y despacio hasta que alguien lo usa;
    // se pausa con el mouse encima. Arrastrar (mouse o dedo) lo gira y al soltar encaja en la
    // más cercana. La del frente cambia el nombre gigante; un toque la trae al frente y doble
    // toque (o doble clic) abre su ficha. Si nadie lo toca un rato, vuelve a girar solo.
    const N = caras.length;
    const PASO = 360 / N;
    const VUELTA = 30000; // ms por vuelta del giro automático
    const REANUDAR_TRAS = 8000; // ms sin tocar para que vuelva el giro automático
    let interactuo = false; // hasta que el usuario toca el anillo, el nombre sigue en "BWL & SOFT"
    let centrado = 0; // proyecto que está al frente
    let giro = 0; // grados
    let radio = 0;
    let destino = null; // giro objetivo al encajar
    let pausado = false;
    let ultimoMov = 0;
    let frente = 0; // cara que está al frente
    let enPantalla = true;

    const norm = (g) => ((((g + 180) % 360) + 360) % 360) - 180;
    const angulo = (k) => k * PASO + giro;

    function medir() {
      const mini = items[0].boton.offsetWidth || 72;
      radio = (mini + 30) / (2 * Math.tan(Math.PI / N));
    }

    // De las dos copias de un proyecto, la más cerca del frente
    function caraMasCercana(i) {
      let mejor = 0;
      let menor = Infinity;
      caras.forEach((cara, k) => {
        const d = Math.abs(norm(angulo(k)));
        if (cara.item.i === i && d < menor) {
          menor = d;
          mejor = k;
        }
      });
      return mejor;
    }
    const imgVisible = (i) => caras[caraMasCercana(i)].img;

    // Gira el anillo hasta dejar ese proyecto al frente, por el camino más corto
    function centrarEnFila(boton, suave = true) {
      const cara = caras.find((c) => c.boton === boton);
      if (!cara) return;
      const objetivo = giro - norm(angulo(caraMasCercana(cara.item.i)));
      if (suave && !reduceMotion.matches) {
        destino = objetivo;
      } else {
        giro = objetivo;
        destino = null;
        pintar();
      }
    }

    function marcarActiva(boton, { centrar = true } = {}) {
      const activo = boton ? caras.find((c) => c.boton === boton)?.item : null;
      caras.forEach((c) => c.boton.classList.toggle('is-activa', c.item === activo));
      if (boton) {
        raiz.style.setProperty('--cursor-color', boton.style.getPropertyValue('--solido'));
        if (centrar) centrarEnFila(boton);
      }
    }

    function previsualizar(item, { centrar = true } = {}) {
      if (abierta || preview === item.boton) return;
      preview = item.boton;
      marcarActiva(item.boton, { centrar });
      mostrar(item.p.vitrina);
      anuncio.textContent = `${item.p.nombre}, ${item.p.tipo}`;
    }

    // Al salir del anillo vuelve a la del frente (o a "BWL & SOFT" si aún no se ha usado)
    function restaurar() {
      if (abierta) return;
      if (interactuo) {
        previsualizar(items[centrado], { centrar: false });
        return;
      }
      if (!preview) return;
      preview = null;
      marcarActiva(null);
      mostrar(PORDEFECTO);
      anuncio.textContent = '';
    }

    function pintar() {
      let mejor = 0;
      let menor = Infinity;
      caras.forEach(({ boton }, k) => {
        const a = angulo(k);
        const n = norm(a);
        const cos = Math.cos((n * Math.PI) / 180);
        // El anillo se corre hacia atrás: la del frente queda a su tamaño real
        boton.parentElement.style.transform = `translateZ(${-radio}px) rotateY(${a}deg) translateZ(${radio}px)`;
        boton.parentElement.style.opacity = String(0.25 + 0.75 * Math.max(0, cos));
        if (Math.abs(n) < menor) {
          menor = Math.abs(n);
          mejor = k;
        }
      });
      if (mejor !== frente) {
        frente = mejor;
        centrado = caras[frente].item.i;
        if (interactuo && !abierta) previsualizar(items[centrado], { centrar: false });
      }
    }

    function usar() {
      interactuo = true;
      ultimoMov = performance.now();
    }

    let previo = performance.now();
    function girarAnillo(t) {
      const dt = Math.min(t - previo, 50);
      previo = t;
      if (enPantalla) {
        if (destino !== null) {
          const resta = destino - giro;
          giro += resta * Math.min(1, dt / 120);
          if (Math.abs(resta) < 0.05) {
            giro = destino;
            destino = null;
          }
        } else if (!arrastre && !pausado && !abierta && !reduceMotion.matches) {
          // Si nadie lo usa durante un rato, vuelve a "BWL & SOFT" y a girar solo
          if (interactuo && t - ultimoMov > REANUDAR_TRAS) {
            interactuo = false;
            preview = null;
            marcarActiva(null);
            mostrar(PORDEFECTO);
            anuncio.textContent = '';
          }
          if (!interactuo && raiz.classList.contains('is-lista')) giro -= (360 / VUELTA) * dt;
        }
        pintar();
      }
      requestAnimationFrame(girarAnillo);
    }
    // Fuera de pantalla no se anima
    new IntersectionObserver(([e]) => {
      enPantalla = e.isIntersecting;
    }).observe(fila);

    // Pausa con el mouse encima o con el foco del teclado
    fila.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') pausado = true;
    });
    fila.addEventListener('pointerleave', () => (pausado = false));
    fila.addEventListener('focusin', () => {
      pausado = true;
      usar();
    });
    fila.addEventListener('focusout', () => (pausado = false));

    // Rueda del mouse: avanza de a un proyecto
    fila.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaX) + Math.abs(e.deltaY) < 4) return;
        e.preventDefault();
        usar();
        const sentido = (e.deltaY || e.deltaX) > 0 ? 1 : -1;
        destino = giro - norm(angulo((frente + sentido + N) % N));
      },
      { passive: false },
    );

    // Arrastrar con el mouse o el dedo gira el anillo
    let arrastre = null;
    let arrastro = false;
    fila.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      arrastre = { x: e.clientX, giro, id: e.pointerId };
      arrastro = false;
    });
    window.addEventListener('pointermove', (e) => {
      if (!arrastre || e.pointerId !== arrastre.id) return;
      const dx = e.clientX - arrastre.x;
      if (!arrastro && Math.abs(dx) > 6) {
        arrastro = true;
        destino = null;
        fila.classList.add('is-arrastrando');
      }
      if (arrastro) {
        usar();
        giro = arrastre.giro + dx * 0.35;
      }
    });
    function soltarAnillo() {
      if (!arrastre) return;
      arrastre = null;
      if (arrastro) {
        fila.classList.remove('is-arrastrando');
        destino = giro - norm(angulo(frente)); // encaja en la más cercana
        usar();
      }
    }
    window.addEventListener('pointerup', soltarAnillo);
    window.addEventListener('pointercancel', soltarAnillo);

    medir();
    window.addEventListener('resize', medir, { passive: true });
    requestAnimationFrame(girarAnillo);

    // Indicación de uso según el dispositivo
    $('[data-vitrina-guia]').textContent = punteroFino.matches
      ? 'Arrastra nuestros proyectos y haz doble clic en uno para verlo'
      : 'Desliza nuestros proyectos y toca dos veces uno para verlo';

    // ---------- Ficha del proyecto ----------
    function rellenar(p) {
      raiz.style.setProperty('--proyecto', p.vitrina.solido);
      $('[data-ficha-url]').textContent =
        p.estado === 'en-vivo'
          ? hostDe(p.url)
          : p.estado === 'privado'
            ? 'red local del negocio'
            : 'demo privada';
      fuenteMovil.srcset = p.imagenes.movil;
      foto.srcset = `${p.imagenes.escritorio.replace('.webp', '-800.webp')} 800w, ${p.imagenes.escritorio} 1280w`;
      foto.src = p.imagenes.escritorio;
      foto.alt = p.alt;

      $('[data-ficha-tipo]').textContent = p.tipo;
      $('[data-ficha-titulo]').textContent = p.nombre;
      $('[data-ficha-cliente]').textContent = p.cliente;
      $('[data-ficha-desc]').textContent = p.descripcion;
      $('[data-ficha-stack]').replaceChildren(...p.stack.map((t) => crear('li', '', t)));

      const accion = $('[data-ficha-accion]');
      accion.replaceChildren();
      if (p.estado === 'en-vivo' && p.url) {
        const a = crear('a', 'boton');
        a.href = p.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.append('Ver en vivo', icono('i-externo'));
        a.setAttribute('aria-label', `Ver en vivo: ${p.nombre} (abre una pestaña nueva)`);
        accion.append(a);
      } else {
        const etiqueta = ETIQUETAS[p.estado] ?? ETIQUETAS.demo;
        const nota = crear('p', 'etiqueta');
        nota.append(icono(etiqueta.icono), etiqueta.texto);
        accion.append(nota);
        if (p.enObra && crearObrero) accion.append(crearObrero());
        if (p.estado === 'demo') {
          const pide = crear('a', 'boton boton--borde', 'Pedir una demo');
          pide.href = enlaceDemo(p);
          pide.target = '_blank';
          pide.rel = 'noopener noreferrer';
          accion.append(pide);
        }
      }

      $('[data-ficha-contador]').textContent = `${actual + 1} / ${items.length}`;
      items.forEach(({ boton }, i) => boton.setAttribute('aria-pressed', String(i === actual)));
      history.replaceState(null, '', `#proyecto-${p.id}`);
    }

    // ---------- Celular: proyectos uno al lado del otro, se pasan deslizando ----------
    const esMovil = window.matchMedia('(max-width: 767px)');
    let pista = null;
    let telefonos = [];

    function construirPista() {
      if (pista) return;
      pista = crear('div', 'ficha__pista');
      pista.setAttribute('aria-label', 'Vistas previas de los proyectos');
      telefonos = items.map(({ p }) => {
        const figura = crear('figure', 'marco ficha__tel');
        const img = document.createElement('img');
        img.src = p.imagenes.movil;
        img.alt = p.alt;
        img.width = 585;
        img.height = 1266;
        img.decoding = 'async';
        img.draggable = false;
        figura.append(img);
        // Tocar un teléfono que asoma por el lado lo trae al centro
        figura.addEventListener('click', () => cambiar(telefonos.indexOf(figura)));
        pista.append(figura);
        figura.img = img;
        return figura;
      });
      marco.before(pista);

      // El teléfono que queda centrado define el proyecto de la ficha
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            e.target.classList.toggle('is-centro', e.isIntersecting);
            if (e.isIntersecting && abierta && !ocupado) sincronizar(telefonos.indexOf(e.target));
          });
        },
        { root: pista, threshold: 0.6 },
      );
      telefonos.forEach((t) => observador.observe(t));
    }

    function centrarTelefono(i, suave) {
      const tel = telefonos[i];
      if (!tel) return;
      pista.scrollTo({
        left: tel.offsetLeft - (pista.clientWidth - tel.offsetWidth) / 2,
        behavior: suave && !reduceMotion.matches ? 'smooth' : 'auto',
      });
    }

    // Actualiza nombre, miniatura y ficha cuando el usuario desliza (sin mover la pista)
    function sincronizar(i) {
      if (i < 0 || i === actual) return;
      actual = i;
      const item = items[actual];
      marcarActiva(item.boton);
      mostrar(item.p.vitrina);
      rellenar(item.p);
      piezas.forEach((pieza) => pieza.getAnimations().forEach((a) => a.cancel()));
      animarPiezas(true);
      anuncio.textContent = `${item.p.nombre}, proyecto ${actual + 1} de ${items.length}`;
    }

    const usaPista = () => esMovil.matches && pista !== null;
    const imagenActiva = () => (usaPista() ? telefonos[actual].img : foto);

    esMovil.addEventListener('change', () => {
      if (abierta && esMovil.matches) {
        construirPista();
        requestAnimationFrame(() => centrarTelefono(actual, false));
      }
    });

    function animarPiezas(entra, retraso = 0) {
      const quieto = reduceMotion.matches ? 'none' : null;
      let ultima = null;
      piezas.forEach((pieza, i) => {
        ultima = pieza.animate(
          entra
            ? [
                { opacity: 0, transform: quieto ?? 'translateY(18px)' },
                { opacity: 1, transform: 'none' },
              ]
            : [
                { opacity: 1, transform: 'none' },
                { opacity: 0, transform: quieto ?? 'translateY(-10px)' },
              ],
          {
            duration: entra ? 520 : 200,
            delay: entra ? retraso + i * 55 : i * 20,
            easing: CURVA,
            fill: entra ? 'backwards' : 'forwards',
          },
        );
      });
      return ultima ? ultima.finished.catch(() => {}) : Promise.resolve();
    }

    // Transición de vista si el navegador la tiene; si no, el cambio es directo
    function conTransicion(actualizar) {
      if (!document.startViewTransition || reduceMotion.matches) {
        return Promise.resolve(actualizar());
      }
      return document.startViewTransition(actualizar).finished.catch(() => {});
    }

    async function abrir(indice, { enfocar = true, animar = true } = {}) {
      if (abierta) return cambiar(indice);
      if (ocupado) return;
      ocupado = true;
      actual = (indice + items.length) % items.length;
      const item = items[actual];
      const miniatura = imgVisible(actual);

      if (esMovil.matches) construirPista();

      // La miniatura y la vista previa comparten nombre: el navegador anima de una a la otra
      miniatura.style.viewTransitionName = 'vitrina-foto';
      let destino = foto;
      const actualizar = async () => {
        miniatura.style.viewTransitionName = '';
        abierta = true;
        preview = null;
        raiz.classList.add('is-abierta');
        ficha.hidden = false;
        if (usaPista()) centrarTelefono(actual, false);
        destino = imagenActiva();
        destino.style.viewTransitionName = 'vitrina-foto';
        rellenar(item.p);
        marcarActiva(item.boton);
        mostrar(item.p.vitrina, { inmediato: true });
        if (animar) animarPiezas(true, 180);
        await cargada(destino);
      };
      await (animar ? conTransicion(actualizar) : actualizar());
      destino.style.viewTransitionName = '';
      anuncio.textContent = `${item.p.nombre}, proyecto ${actual + 1} de ${items.length}`;
      if (enfocar) $('[data-ficha-titulo]').focus({ preventScroll: true });
      if (ficha.getBoundingClientRect().top > window.innerHeight * 0.7) {
        fila.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
      terminar();
    }

    async function cambiar(indice) {
      const destino = (indice + items.length) % items.length;
      if (ocupado) {
        pendiente = destino;
        return;
      }
      if (destino === actual) return;
      if (usaPista()) {
        centrarTelefono(destino, true);
        return;
      }
      ocupado = true;
      actual = destino;
      const item = items[actual];
      marcarActiva(item.boton);
      mostrar(item.p.vitrina);
      anuncio.textContent = `${item.p.nombre}, proyecto ${actual + 1} de ${items.length}`;

      if (reduceMotion.matches) {
        rellenar(item.p);
        await animarPiezas(true);
        return terminar();
      }

      // Cortina del color del proyecto: cubre, cambia la imagen y descubre
      cortina.style.background = item.p.vitrina.solido;
      const salida = animarPiezas(false);
      await cortina
        .animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
          duration: 380,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'forwards',
        })
        .finished.catch(() => {});
      await salida;
      rellenar(item.p);
      await cargada(foto);
      piezas.forEach((pieza) => pieza.getAnimations().forEach((a) => a.cancel()));
      animarPiezas(true, 60);
      await cortina
        .animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }], {
          duration: 520,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'forwards',
        })
        .finished.catch(() => {});
      terminar();
    }

    async function cerrar() {
      if (!abierta || ocupado) return;
      ocupado = true;
      pendiente = null;
      const item = items[actual];
      const miniatura = imgVisible(actual);
      const origen = imagenActiva();
      origen.style.viewTransitionName = 'vitrina-foto';
      await conTransicion(() => {
        origen.style.viewTransitionName = '';
        miniatura.style.viewTransitionName = 'vitrina-foto';
        abierta = false;
        raiz.classList.remove('is-abierta');
        ficha.hidden = true;
        items.forEach(({ boton }) => boton.setAttribute('aria-pressed', 'false'));
        marcarActiva(null);
        mostrar(PORDEFECTO, { inmediato: true });
      });
      miniatura.style.viewTransitionName = '';
      history.replaceState(null, '', location.pathname + location.search);
      anuncio.textContent = 'Ficha del proyecto cerrada';
      focoSilencioso = true;
      item.boton.focus({ preventScroll: true });
      focoSilencioso = false;
      ocupado = false;
    }

    function terminar() {
      ocupado = false;
      if (pendiente !== null) {
        const siguiente = pendiente;
        pendiente = null;
        cambiar(siguiente);
      }
    }

    // ---------- Eventos de las miniaturas ----------
    // Tipo del último puntero que presionó una miniatura ('' = teclado)
    let tipoPuntero = '';
    let ultimoToque = { i: -1, t: 0 };
    let esperaCentrar = null;
    const DOBLE_TOQUE = 400; // ms máximos entre los dos toques
    fila.addEventListener('pointerdown', (e) => {
      tipoPuntero = e.pointerType;
    });

    caras.forEach(({ boton, item }) => {
      boton.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse' && !arrastre) previsualizar(item, { centrar: false });
      });
      // Solo el foco con teclado previsualiza; el del clic o el toque abre directamente
      boton.addEventListener('focus', () => {
        if (!tipoPuntero && !focoSilencioso) previsualizar(item);
      });
      boton.addEventListener('click', (e) => {
        tipoPuntero = '';
        ultimoMov = performance.now();
        if (arrastro) {
          arrastro = false;
          return;
        }
        if (abierta) {
          if (item.i === actual) cerrar();
          else abrir(item.i);
          return;
        }
        // Teclado (Enter o espacio): abre directo
        if (e.detail === 0) {
          abrir(item.i);
          return;
        }
        const ahora = performance.now();
        clearTimeout(esperaCentrar);
        if (ultimoToque.i === item.i && ahora - ultimoToque.t < DOBLE_TOQUE) {
          ultimoToque = { i: -1, t: 0 };
          abrir(item.i);
          return;
        }
        ultimoToque = { i: item.i, t: ahora };
        interactuo = true;
        preview = null;
        // El nombre cambia ya; el anillo gira después, para que el segundo toque de un
        // doble toque caiga sobre la miniatura y no donde quedó al girar
        previsualizar(item, { centrar: false });
        esperaCentrar = setTimeout(() => centrarEnFila(boton), DOBLE_TOQUE);
      });
    });

    fila.addEventListener('mouseleave', restaurar);
    fila.addEventListener('focusout', (e) => {
      if (!fila.contains(e.relatedTarget)) restaurar();
    });

    // Los clics rápidos se suman: cada uno avanza desde el último proyecto pedido
    const base = () => pendiente ?? actual;
    $('[data-ficha-ant]').addEventListener('click', () => cambiar(base() - 1));
    $('[data-ficha-sig]').addEventListener('click', () => cambiar(base() + 1));
    $('[data-ficha-cerrar]').addEventListener('click', cerrar);

    raiz.addEventListener('keydown', (e) => {
      if (!abierta) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        cambiar(base() + (e.key === 'ArrowRight' ? 1 : -1));
      }
    });

    // Deslizar la vista previa cambia de proyecto (táctil)
    let inicioX = null;
    marco.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') inicioX = e.clientX;
    });
    marco.addEventListener('pointerup', (e) => {
      if (inicioX === null) return;
      const dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > UMBRAL_SWIPE) cambiar(base() + (dx < 0 ? 1 : -1));
    });
    marco.addEventListener('pointercancel', () => {
      inicioX = null;
    });

    // Enlaces "Proyectos" (menú, pie, botón del inicio): suben al inicio y abren la vitrina
    document.addEventListener('click', (e) => {
      const enlace = e.target.closest('a[href="#proyectos"], [data-explorar]');
      if (!enlace) return;
      e.preventDefault();
      raiz.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      if (!abierta) abrir(interactuo ? centrado : actual);
    });

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

    function pintarCursor() {
      cursor.style.transform = `translate3d(${resorte.x}px, ${resorte.y}px, 0)`;
    }

    function paso(t) {
      const dt = Math.min((t - ultimo) / 1000, 1 / 30);
      ultimo = t;
      const fx = 400 * (resorte.objX - resorte.x) - 30 * resorte.vx;
      const fy = 400 * (resorte.objY - resorte.y) - 30 * resorte.vy;
      resorte.vx += fx * dt;
      resorte.vy += fy * dt;
      resorte.x += resorte.vx * dt;
      resorte.y += resorte.vy * dt;
      pintarCursor();
      const quieto =
        Math.abs(resorte.objX - resorte.x) < 0.1 &&
        Math.abs(resorte.objY - resorte.y) < 0.1 &&
        Math.abs(resorte.vx) + Math.abs(resorte.vy) < 0.1;
      cuadro = quieto ? null : requestAnimationFrame(paso);
    }

    fila.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !punteroFino.matches) return;
      // Aparece donde está el puntero, sin viajar desde la esquina
      resorte.x = resorte.objX = e.clientX;
      resorte.y = resorte.objY = e.clientY;
      resorte.vx = resorte.vy = 0;
      pintarCursor();
      cursor.classList.add('is-visible');
    });
    fila.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      resorte.objX = e.clientX;
      resorte.objY = e.clientY;
      if (reduceMotion.matches) {
        resorte.x = resorte.objX;
        resorte.y = resorte.objY;
        pintarCursor();
      } else if (!cuadro) {
        ultimo = performance.now();
        cuadro = requestAnimationFrame(paso);
      }
    });
    fila.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));

    // ---------- Entrada sincronizada con la pantalla de inicio ----------
    function indiceDelHash() {
      if (location.hash === '#proyectos') return 0;
      const m = location.hash.match(/^#proyecto-(.+)$/);
      return m ? items.findIndex((it) => it.p.id === m[1]) : -1;
    }

    function entrar() {
      if (raiz.classList.contains('is-lista')) return;
      raiz.classList.add('is-lista');
      caja.replaceChildren();
      claveActual = '';
      palabraActual = null;

      // Enlace directo a un proyecto (#proyecto-karbon): la vitrina arranca abierta
      const enlazado = indiceDelHash();
      if (enlazado >= 0) {
        abrir(enlazado, { enfocar: false, animar: false });
        return;
      }

      mostrar(PORDEFECTO);
      centrarEnFila(items[centrado].boton, false);
      // Las miniaturas aparecen cuando el nombre ya casi terminó de subir
      const base = reduceMotion.matches ? 0 : DURACION + marca.length * ESCALONADO - 200;
      caras.forEach(({ boton, item }) => {
        const i = item.i;
        boton.animate(
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

    window.addEventListener('hashchange', () => {
      const i = indiceDelHash();
      if (i >= 0) abrir(i, { enfocar: false });
    });

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
