// Proyectos de la vitrina del inicio. Para agregar uno nuevo, copia un bloque, cambia los datos
// y guarda sus capturas en assets/projects/ (ver README, "Agregar un proyecto").
//
// estado:
//   'en-vivo'  → muestra el botón "Ver en vivo" (requiere url)
//   'privado'  → etiqueta "Software privado"
//   'demo'     → etiqueta "Demo bajo solicitud"
//
// vitrina: cómo aparece el proyecto en el inicio (miniatura + nombre gigante).
//   nombre → texto corto en mayúsculas; color → color o degradado del texto;
//   solido → color plano para el círculo que sigue al cursor.
//
// enObra: true → muestra en la ficha un obrero pixelado martillando ("En construcción").
window.BWL = window.BWL || {};
window.BWL.PROYECTOS = [
  {
    id: 'portalsalud',
    nombre: 'Portal Salud',
    cliente: 'Centro Naturista El Portal de la Salud',
    tipo: 'Tienda en línea con pagos',
    descripcion:
      'Catálogo de productos naturales, carrito, cuentas de cliente y pagos en línea con Wompi. Incluye panel para que el centro naturista gestione productos, ofertas y pedidos.',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Wompi'],
    estado: 'demo',
    url: '',
    imagenes: {
      escritorio: 'assets/projects/portalsalud-desktop.webp',
      movil: 'assets/projects/portalsalud-movil.webp',
    },
    alt: 'Página de inicio de la tienda Portal Salud, con el logo del centro naturista sobre un bloque verde',
    vitrina: {
      nombre: 'PORTAL SALUD',
      color: 'linear-gradient(180deg, #F7B24A 0%, #E0662A 100%)',
      solido: '#EC8A36',
    },
  },
  {
    id: 'karbon',
    nombre: 'Karbon POS',
    cliente: 'Producto propio para restaurantes y bares',
    tipo: 'Sistema POS a la medida',
    descripcion:
      'Punto de venta que funciona sin internet: plano de mesas, caja, inventario por receta y reportes en el computador; app para que los meseros pidan desde el celular y pantalla de cocina con tiempos.',
    stack: ['React', 'Electron', 'NestJS', 'PostgreSQL', 'PWA'],
    estado: 'privado',
    enObra: true,
    url: '',
    imagenes: {
      escritorio: 'assets/projects/karbon-desktop.webp',
      movil: 'assets/projects/karbon-movil.webp',
    },
    alt: 'Plano de mesas de Karbon POS con mesas libres, ocupadas y esperando cuenta',
    vitrina: {
      nombre: 'KARBON',
      color: 'linear-gradient(180deg, #F2C4A4 0%, #D08A62 45%, #B06A45 100%)',
      solido: '#D08A62',
    },
  },
  {
    id: 'technosur',
    nombre: 'NOCTURNA',
    cliente: 'TechnoSur',
    tipo: 'Landing de evento',
    descripcion:
      'Página de lanzamiento para una noche de techno en Bogotá: cuenta regresiva, cartel de artistas, venta de entradas y un fondo animado que responde al visitante.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    estado: 'en-vivo',
    url: 'https://technosurlandingpage.vercel.app',
    imagenes: {
      escritorio: 'assets/projects/technosur-desktop.webp',
      movil: 'assets/projects/technosur-movil.webp',
    },
    alt: 'Portada de NOCTURNA con el título en letras grandes rojas y blancas y una cuenta regresiva',
    vitrina: { nombre: 'NOCTURNA', color: '#E8301C', solido: '#E8301C' },
  },
  {
    id: 'acido303',
    nombre: 'ÁCIDO 303',
    cliente: 'Proyecto de portafolio',
    tipo: 'Landing de evento interactiva',
    descripcion:
      'Landing para una noche de acid techno con un secuenciador musical que se toca en el navegador. Toda la página late al ritmo de la música que arma el visitante.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Audio', 'GSAP'],
    estado: 'demo',
    url: '',
    imagenes: {
      escritorio: 'assets/projects/acido303-desktop.webp',
      movil: 'assets/projects/acido303-movil.webp',
    },
    alt: 'Portada de ÁCIDO 303 con el título en blanco y verde ácido y una carita sonriente amarilla',
    vitrina: {
      nombre: 'ÁCIDO 303',
      color: 'linear-gradient(180deg, #F5C542 0%, #F07A1A 100%)',
      solido: '#F5A12E',
    },
  },
  {
    id: 'psicologa-kds',
    nombre: 'Karla Silva, psicóloga',
    cliente: 'Consulta de psicología clínica y educativa',
    tipo: 'Sitio de profesional',
    descripcion:
      'Sitio para una psicóloga de Pasto que atiende presencial y en línea: presenta sus especialidades, explica cómo funciona la consulta y lleva a agendar por WhatsApp.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    estado: 'en-vivo',
    url: 'https://landing-page-psycologic.vercel.app',
    imagenes: {
      escritorio: 'assets/projects/psicologa-kds-desktop.webp',
      movil: 'assets/projects/psicologa-kds-movil.webp',
    },
    alt: 'Inicio del sitio de Karla Silva con el titular «Un espacio para hablar, pensar y encontrar claridad» y su foto',
    vitrina: {
      nombre: 'LANDING PSICOLOGÍA',
      color: 'linear-gradient(180deg, #F48A6A 0%, #C93A2C 100%)',
      solido: '#E0604A',
    },
  },
];
