// Panel de cotización: el botón flotante de WhatsApp se abre en un chat dentro de la página.
// Pregunta de a una cosa (nombre, tipo de proyecto, idea), como una conversación, y al final
// abre WhatsApp con el mensaje armado para que la persona solo toque "Enviar".
// Todos los botones "Cotiza tu software" y los enlaces a #contacto abren este panel.

(function () {
  'use strict';

  const PAUSA_ESCRIBIENDO = 650; // ms que el "equipo" tarda en responder
  const LLAMADO_TRAS = 6000; // ms antes de que el botón se estire para llamar la atención

  function crear(tag, clase, texto) {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
  }

  function iniciarCotizar(panel, { boton, enlaceWhatsapp }) {
    if (!panel || !boton) return;

    const $ = (sel) => panel.querySelector(sel);
    const chat = $('[data-cotizar-chat]');
    const form = $('[data-cotizar-form]');
    const pasos = [...panel.querySelectorAll('[data-paso]')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respuestas = { nombre: '', tipo: '', mensaje: '' };
    let abierto = false;
    let paso = 0;
    let animando = null;

    // ---------- Conversación ----------
    function burbuja(texto, quien = 'equipo') {
      const p = crear('p', `burbuja burbuja--${quien}`, texto);
      chat.append(p);
      p.animate(
        reduceMotion.matches
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: 'translateY(10px) scale(0.96)' },
              { opacity: 1, transform: 'none' },
            ],
        { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      alFinal();
      return p;
    }

    // Puntos de "escribiendo…" y luego la pregunta
    function responder(texto) {
      const escribiendo = crear('p', 'burbuja burbuja--equipo burbuja--escribiendo');
      escribiendo.setAttribute('aria-hidden', 'true');
      escribiendo.append(crear('span'), crear('span'), crear('span'));
      chat.append(escribiendo);
      alFinal();
      return new Promise((listo) => {
        setTimeout(
          () => {
            escribiendo.remove();
            burbuja(texto);
            listo();
          },
          reduceMotion.matches ? 0 : PAUSA_ESCRIBIENDO,
        );
      });
    }

    function mostrarPaso(i) {
      paso = i;
      pasos.forEach((p, k) => {
        p.hidden = k !== i;
      });
      $('[data-cotizar-progreso]').style.setProperty('--avance', String(i / pasos.length));
      const campo = pasos[i].querySelector('input, textarea, button');
      if (campo && abierto) campo.focus({ preventScroll: true });
      alFinal();
    }

    // El área de abajo cambia de alto entre pasos: el chat siempre muestra el último mensaje
    function alFinal() {
      requestAnimationFrame(() => {
        chat.scrollTop = chat.scrollHeight;
      });
    }

    function marcarError(pasoEl, visible) {
      const error = pasoEl.querySelector('.cotizar__error');
      const campo = pasoEl.querySelector('input, textarea');
      if (error) error.hidden = !visible;
      if (campo) campo.setAttribute('aria-invalid', String(visible));
    }

    async function avanzar() {
      const actual = pasos[paso];
      const tipo = actual.dataset.paso;

      if (tipo === 'nombre') {
        const valor = form.elements.nombre.value.trim();
        if (!valor) return marcarError(actual, true);
        marcarError(actual, false);
        respuestas.nombre = valor;
        burbuja(valor, 'cliente');
        actual.hidden = true;
        await responder(`Mucho gusto, ${valor.split(' ')[0]}. ¿Qué quieres construir?`);
        mostrarPaso(1);
      } else if (tipo === 'mensaje') {
        const valor = form.elements.mensaje.value.trim();
        if (!valor) return marcarError(actual, true);
        marcarError(actual, false);
        respuestas.mensaje = valor;
        enviar();
      }
    }

    async function elegirTipo(valor) {
      respuestas.tipo = valor;
      burbuja(valor, 'cliente');
      pasos[1].hidden = true;
      await responder(
        'Perfecto. Cuéntanos tu idea en pocas palabras: qué haces y qué te gustaría.',
      );
      mostrarPaso(2);
    }

    function enviar() {
      const texto = [
        `Hola, BWL & SOFT. Soy ${respuestas.nombre}.`,
        `Tipo de proyecto: ${respuestas.tipo}.`,
        '',
        respuestas.mensaje,
      ].join('\n');
      const enlace = enlaceWhatsapp(texto);
      // Se abre dentro del clic para que el navegador no lo bloquee
      window.open(enlace, '_blank', 'noopener,noreferrer');

      burbuja(respuestas.mensaje, 'cliente');
      pasos[2].hidden = true;
      $('[data-cotizar-progreso]').style.setProperty('--avance', '1');
      responder(
        '¡Listo! Abrimos WhatsApp con tu mensaje. Solo toca “Enviar” y te respondemos.',
      ).then(() => {
        const final = $('[data-cotizar-final]');
        $('[data-cotizar-reabrir]').href = enlace;
        final.hidden = false;
        final.querySelector('a, button').focus({ preventScroll: true });
        alFinal();
      });
    }

    function reiniciar() {
      form.reset();
      Object.keys(respuestas).forEach((k) => (respuestas[k] = ''));
      chat.replaceChildren();
      $('[data-cotizar-final]').hidden = true;
      burbuja('Hola. Te ayudamos a armar el mensaje en tres pasos. ¿Cómo te llamas?');
      mostrarPaso(0);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      avanzar();
    });
    // Enter en la idea envía; Shift + Enter hace salto de línea
    form.elements.mensaje.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        avanzar();
      }
    });
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) {
        marcarError(e.target.closest('[data-paso]'), false);
      }
    });
    panel.querySelectorAll('[data-tipo]').forEach((opcion) => {
      opcion.addEventListener('click', () => elegirTipo(opcion.dataset.tipo));
    });
    $('[data-cotizar-reiniciar]').addEventListener('click', reiniciar);

    // ---------- Abrir y cerrar: el panel crece en círculo desde el botón ----------
    const forma = (r) => `circle(${r} at calc(100% - 29px) calc(100% + 41px))`;

    function abrir() {
      if (abierto) return;
      abierto = true;
      boton.classList.remove('is-llamando');
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar cotización');
      panel.hidden = false;
      if (animando) animando.cancel();
      animando = panel.animate(
        reduceMotion.matches
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ clipPath: forma('0px') }, { clipPath: forma('150%') }],
        { duration: reduceMotion.matches ? 150 : 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      );
      mostrarPaso(paso);
    }

    function cerrar({ devolverFoco = true } = {}) {
      if (!abierto) return;
      abierto = false;
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Cotizar por WhatsApp');
      if (animando) animando.cancel();
      animando = panel.animate(
        reduceMotion.matches
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [{ clipPath: forma('150%') }, { clipPath: forma('0px') }],
        { duration: reduceMotion.matches ? 120 : 420, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      );
      animando.finished.then(
        () => {
          if (!abierto) panel.hidden = true;
        },
        () => {},
      );
      if (devolverFoco) boton.focus({ preventScroll: true });
    }

    boton.addEventListener('click', (e) => {
      e.preventDefault();
      if (abierto) cerrar();
      else abrir();
    });
    $('[data-cotizar-cerrar]').addEventListener('click', () => cerrar());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && abierto) cerrar();
    });
    // Clic fuera del panel lo cierra; lo escrito se conserva para cuando vuelva a abrirlo
    document.addEventListener('pointerdown', (e) => {
      if (abierto && !panel.contains(e.target) && !boton.contains(e.target)) {
        if (!e.target.closest('[data-cotizar-abrir], a[href="#contacto"]')) {
          cerrar({ devolverFoco: false });
        }
      }
    });

    // "Cotiza tu software", "Contacto" y enlaces a #contacto abren el panel
    document.addEventListener('click', (e) => {
      const disparador = e.target.closest('[data-cotizar-abrir], a[href="#contacto"]');
      if (!disparador) return;
      e.preventDefault();
      abrir();
    });
    if (location.hash === '#contacto') abrir();

    // ---------- Llamado de atención: el botón se estira una vez por visita ----------
    const llamar = () => {
      if (!abierto) boton.classList.add('is-llamando');
      setTimeout(() => boton.classList.remove('is-llamando'), 5000);
    };
    try {
      if (!sessionStorage.getItem('bwl:llamado')) {
        sessionStorage.setItem('bwl:llamado', '1');
        setTimeout(llamar, LLAMADO_TRAS);
      }
    } catch {
      setTimeout(llamar, LLAMADO_TRAS);
    }

    reiniciar();
  }

  window.BWL = Object.assign(window.BWL || {}, { iniciarCotizar });
})();
