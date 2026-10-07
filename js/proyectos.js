// Proyectos del carrusel. Para agregar uno nuevo, copia un bloque, cambia los datos
// y guarda sus capturas en assets/projects/ (ver README, "Agregar un proyecto").
//
// estado:
//   'en-vivo'  → muestra el botón "Ver en vivo" (requiere url)
//   'privado'  → etiqueta "Software privado"
//   'demo'     → etiqueta "Demo bajo solicitud"
export const PROYECTOS = [
  {
    id: 'portalsalud',
    nombre: 'Portal de la Salud',
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
    url: '',
    imagenes: {
      escritorio: 'assets/projects/karbon-desktop.webp',
      movil: 'assets/projects/karbon-movil.webp',
    },
    alt: 'Plano de mesas de Karbon POS con mesas libres, ocupadas y esperando cuenta',
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
  },
];
