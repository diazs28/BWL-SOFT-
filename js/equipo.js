// Panel de hojas de vida: el botón flotante "CV" (sobre el de WhatsApp) abre las hojas de vida
// de los ingenieros de BWL & SOFT para verlas o descargarlas en PDF.
// Se abre como el chat de cotización: en escritorio crece en círculo desde el botón; en el
// celular es una hoja inferior con fondo oscurecido que se cierra deslizando hacia abajo.
// Solo un panel flotante abierto a la vez (evento "bwl:panel").

(function () {
  'use strict';

  function iniciarEquipo(panel, { boton }) {
    if (!panel || !boton) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const esMovil = window.matchMedia('(max-width: 767px)');
    const tarjetas = [...panel.querySelectorAll('.persona')];
    let abierto = false;
    let animando = null;

    const fondo = document.createElement('div');
    fondo.className = 'equipo__fondo';
    fondo.hidden = true;
    panel.before(fondo);

    // El círculo nace en el centro del botón CV (12 px debajo del panel)
    const forma = (r) => `circle(${r} at calc(100% - 29px) calc(100% + 41px))`;

    function fotogramas(entra) {
      let cuadros;
      if (reduceMotion.matches) cuadros = [{ opacity: 0 }, { opacity: 1 }];
      else if (esMovil.matches)
        cuadros = [{ transform: 'translateY(100%)' }, { transform: 'none' }];
      else cuadros = [{ clipPath: forma('0px') }, { clipPath: forma('150%') }];
      return entra ? cuadros : [...cuadros].reverse();
    }

    function animarFondo(entra) {
      fondo.hidden = false;
      fondo
        .animate([{ opacity: entra ? 0 : 1 }, { opacity: entra ? 1 : 0 }], {
          duration: entra ? 300 : 260,
          fill: 'forwards',
        })
        .finished.then(
          () => {
            if (!entra && !abierto) fondo.hidden = true;
          },
          () => {},
        );
    }

    function abrir() {
      if (abierto) return;
      abierto = true;
      document.dispatchEvent(new CustomEvent('bwl:panel', { detail: 'equipo' }));
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar hojas de vida');
      document.documentElement.classList.add('equipo-abierto');
      panel.hidden = false;
      panel.style.transform = '';
      animarFondo(true);
      if (animando) animando.cancel();
      animando = panel.animate(fotogramas(true), {
        duration: reduceMotion.matches ? 150 : esMovil.matches ? 460 : 520,
        easing: esMovil.matches
          ? 'cubic-bezier(0.22, 1, 0.36, 1)'
          : 'cubic-bezier(0.65, 0, 0.35, 1)',
      });
      // Las tarjetas entran una tras otra
      tarjetas.forEach((t, i) =>
        t.animate(
          [
            { opacity: 0, transform: reduceMotion.matches ? 'none' : 'translateY(14px)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 480,
            delay: reduceMotion.matches ? 0 : 200 + i * 90,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards',
          },
        ),
      );
      panel.querySelector('.equipo__cerrar').focus({ preventScroll: true });
    }

    function cerrar({ devolverFoco = true } = {}) {
      if (!abierto) return;
      abierto = false;
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Hojas de vida del equipo');
      document.documentElement.classList.remove('equipo-abierto');
      animarFondo(false);
      if (animando) animando.cancel();
      const desde = panel.style.transform; // si se estaba arrastrando, sale desde ahí
      const cuadros = fotogramas(false);
      if (desde && esMovil.matches && !reduceMotion.matches) cuadros[0] = { transform: desde };
      animando = panel.animate(cuadros, {
        duration: reduceMotion.matches ? 120 : esMovil.matches ? 320 : 400,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
      });
      animando.finished.then(
        () => {
          if (!abierto) {
            panel.hidden = true;
            panel.style.transform = '';
          }
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
    panel.querySelector('.equipo__cerrar').addEventListener('click', () => cerrar());
    fondo.addEventListener('click', () => cerrar({ devolverFoco: false }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && abierto) cerrar();
    });
    // Clic fuera del panel lo cierra
    document.addEventListener('pointerdown', (e) => {
      if (abierto && !panel.contains(e.target) && !boton.contains(e.target)) {
        cerrar({ devolverFoco: false });
      }
    });
    // Si se abre otro panel flotante (el chat de cotización), este se cierra
    document.addEventListener('bwl:panel', (e) => {
      if (e.detail !== 'equipo') cerrar({ devolverFoco: false });
    });

    // Celular: arrastrar la cabecera hacia abajo cierra la hoja
    const cabeza = panel.querySelector('.equipo__cabeza');
    let arrastre = null;
    cabeza.addEventListener('pointerdown', (e) => {
      if (!esMovil.matches || e.pointerType === 'mouse' || e.target.closest('button')) return;
      arrastre = { y: e.clientY, dy: 0 };
      try {
        cabeza.setPointerCapture(e.pointerId);
      } catch {
        // Sin captura el arrastre igual funciona mientras el dedo siga sobre la cabecera
      }
    });
    cabeza.addEventListener('pointermove', (e) => {
      if (!arrastre) return;
      arrastre.dy = Math.max(0, e.clientY - arrastre.y);
      panel.style.transform = `translateY(${arrastre.dy}px)`;
    });
    const soltar = () => {
      if (!arrastre) return;
      const { dy } = arrastre;
      arrastre = null;
      if (dy > 90) {
        cerrar();
      } else {
        panel.animate([{ transform: panel.style.transform }, { transform: 'none' }], {
          duration: 220,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
        panel.style.transform = '';
      }
    };
    cabeza.addEventListener('pointerup', soltar);
    cabeza.addEventListener('pointercancel', soltar);

    if (location.hash === '#equipo') abrir();
  }

  window.BWL = Object.assign(window.BWL || {}, { iniciarEquipo });
})();
