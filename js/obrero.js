// Obrero en pixel art que martilla un yunque: indica que un proyecto está en construcción.
// Se muestra en la ficha de los proyectos con `enObra: true` (js/proyectos.js).
// Dos cuadros (martillo arriba y golpe con chispas) que alterna el CSS, como un sprite.

(function () {
  'use strict';

  // Pixel art de 20 x 16. Cada letra es un color; el punto es vacío.
  const COLORES = {
    H: '#D08A62', // casco cobre
    h: '#F2C4A4', // brillo del casco
    S: '#E8B796', // piel
    s: '#C98F6E', // sombra de la piel
    E: '#1C1C1F', // ojo
    B: '#5E5E68', // camisa
    O: '#7A4128', // overol
    L: '#4A4A54', // pantalón
    K: '#6B4430', // botas
    W: '#8B5A3C', // mango de madera
    M: '#BDB5B0', // cabeza del martillo
    m: '#6E6A66', // sombra del martillo
    A: '#6A6A72', // yunque
    a: '#9A9AA2', // brillo del yunque
    '*': '#FFE3A8', // chispa clara
    '+': '#F2C4A4', // chispa cobre
  };
  const VACIO = '....................';
  const relleno = (filas, desde) => {
    const mapa = Array(16).fill(VACIO);
    filas.forEach((fila, i) => (mapa[desde + i] = fila));
    return mapa;
  };

  const CUERPO = relleno(
    [
      '...HHH..............',
      '..HhHHH.............',
      '..HHHHHH............',
      '..SSSSES............',
      '..sSSSSS............',
      '...SSSS.............',
      '..BBOBBB............',
      '..BBOOBB............',
      '..BOOOOB............',
      '...OOOO.............',
      '...LLLL.............',
      '...L..L.............',
      '..KK..KK............',
    ],
    2,
  );
  const YUNQUE = relleno(
    [
      '.............aaaaa..',
      '............AAAAAAA.',
      '..............AAA...',
      '..............AAA...',
      '.............AAAAA..',
    ],
    10,
  );
  // Martillo arriba: brazo levantado
  const ARRIBA = relleno(
    [
      '........MMM.........',
      '........MmM.........',
      '.........W..........',
      '.........W..........',
      '.........W..........',
      '........SS..........',
      '........S...........',
      '.......BB...........',
      '......BB............',
    ],
    0,
  );
  // Golpe: brazo estirado, martillo sobre el yunque
  const GOLPE = relleno(
    ['...............M....', '........BBSWWWWMm...', '...............Mm...'],
    7,
  );
  const CHISPAS = relleno(
    [
      '.............*...+..',
      '..................*.',
      '............+.......',
      '...................+',
    ],
    5,
  );

  const NS = 'http://www.w3.org/2000/svg';

  function capa(mapa, clase) {
    const g = document.createElementNS(NS, 'g');
    if (clase) g.setAttribute('class', clase);
    mapa.forEach((fila, y) => {
      [...fila].forEach((c, x) => {
        if (c === '.') return;
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x);
        r.setAttribute('y', y);
        r.setAttribute('width', 1);
        r.setAttribute('height', 1);
        r.setAttribute('fill', COLORES[c]);
        g.append(r);
      });
    });
    return g;
  }

  /** Devuelve el obrero con su texto "En construcción", listo para insertar. */
  function crearObrero() {
    const obra = document.createElement('span');
    obra.className = 'obra';
    obra.setAttribute('role', 'img');
    obra.setAttribute('aria-label', 'Proyecto en construcción');

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'obra__obrero');
    svg.setAttribute('viewBox', '0 0 20 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.append(
      capa(YUNQUE, 'obra__yunque'),
      capa(CUERPO),
      capa(ARRIBA, 'obra__arriba'),
      capa(GOLPE, 'obra__golpe'),
      capa(CHISPAS, 'obra__chispas'),
    );

    const texto = document.createElement('span');
    texto.className = 'obra__texto';
    texto.setAttribute('aria-hidden', 'true');
    texto.textContent = 'En construcción';

    obra.append(svg, texto);
    return obra;
  }

  window.BWL = Object.assign(window.BWL || {}, { crearObrero });
})();
