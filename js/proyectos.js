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
//   solido → color plano para el borde de la miniatura activa y la cortina de la ficha.
//
// enObra: true → muestra en la ficha un obrero pixelado martillando ("En construcción").
//
// repo: enlace al repositorio público en GitHub → muestra el botón "Ver en GitHub".
//   Déjalo vacío si el repositorio es privado o aún no existe.
//
// en: textos para la versión en inglés (en/index.html). Reemplazan a los de arriba cuando la página
//   está en inglés; lo que falte se muestra en español. Puede traer vitrina.nombre propio.
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
    estado: 'en-vivo',
    url: 'https://portalsalud.com.co',
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
    en: {
      cliente: 'El Portal de la Salud natural health store',
      tipo: 'Online store with payments',
      descripcion:
        'Natural products catalog, cart, customer accounts and online payments with Wompi. Includes an admin panel for the store to manage products, offers and orders.',
      alt: 'Home page of the Portal Salud store, with the natural health store logo over a green block',
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
    en: {
      cliente: 'Our own product for restaurants and bars',
      tipo: 'Custom POS system',
      descripcion:
        'Point of sale that works offline: table map, cash register, recipe-based inventory and reports on the computer; an app for waiters to place orders from their phone and a kitchen display with timers.',
      alt: 'Karbon POS table map showing free, occupied and waiting-for-check tables',
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
    repo: 'https://github.com/dante312w/TechnoSurLandingPage',
    imagenes: {
      escritorio: 'assets/projects/technosur-desktop.webp',
      movil: 'assets/projects/technosur-movil.webp',
    },
    alt: 'Portada de NOCTURNA con el título en letras grandes rojas y blancas y una cuenta regresiva',
    vitrina: { nombre: 'NOCTURNA', color: '#E8301C', solido: '#E8301C' },
    en: {
      cliente: 'TechnoSur',
      tipo: 'Event landing page',
      descripcion:
        'Launch page for a techno night in Bogotá: countdown, artist lineup, ticket sales and an animated background that reacts to the visitor.',
      alt: 'NOCTURNA cover with the title in large red and white letters and a countdown',
    },
  },
  {
    id: 'acido303',
    nombre: 'ÁCIDO 303',
    cliente: 'Proyecto de portafolio',
    tipo: 'Landing de evento interactiva',
    descripcion:
      'Landing para una noche de acid techno con un secuenciador musical que se toca en el navegador. Toda la página late al ritmo de la música que arma el visitante.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Audio', 'GSAP'],
    estado: 'en-vivo',
    url: 'https://acid303.vercel.app',
    repo: 'https://github.com/dante312w/ACID303',
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
    en: {
      cliente: 'Portfolio project',
      tipo: 'Interactive event landing page',
      descripcion:
        'Landing page for an acid techno night with a music sequencer you can play in the browser. The whole page pulses to the beat the visitor creates.',
      alt: 'ÁCIDO 303 cover with the title in white and acid green and a yellow smiley face',
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
    repo: 'https://github.com/dante312w/LandingPagePsycologic',
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
    en: {
      nombre: 'Karla Silva, psychologist',
      cliente: 'Clinical and educational psychology practice',
      tipo: 'Professional website',
      descripcion:
        'Website for a psychologist in Pasto who sees clients in person and online: it presents her specialties, explains how sessions work and leads visitors to book on WhatsApp.',
      alt: 'Karla Silva’s website home with the headline «A space to talk, think and find clarity» and her photo',
      vitrina: { nombre: 'PSYCHOLOGY' },
    },
  },
  {
    id: 'diaz-massages',
    nombre: 'Valeria Castaño, fisioterapeuta',
    cliente: 'Consulta de fisioterapia en Popayán',
    tipo: 'Sitio de profesional',
    descripcion:
      'Sitio para una fisioterapeuta: presenta sus enfoques de tratamiento, su trayectoria y su formación, deja descargar la hoja de vida y lleva a agendar una valoración.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    estado: 'en-vivo',
    url: 'https://diaz-massages.vercel.app',
    repo: 'https://github.com/diazs28/Diaz-Massages',
    imagenes: {
      escritorio: 'assets/projects/diaz-massages-desktop.webp',
      movil: 'assets/projects/diaz-massages-movil.webp',
    },
    alt: 'Inicio del sitio de Valeria Castaño con el titular «Movimiento que sana, cuerpo que recuerda» y una ilustración de una mujer en movimiento',
    vitrina: {
      nombre: 'FISIOTERAPIA',
      color: 'linear-gradient(180deg, #7FF0C8 0%, #3FB8A0 100%)',
      solido: '#4FD1B0',
    },
    en: {
      nombre: 'Valeria Castaño, physiotherapist',
      cliente: 'Physiotherapy practice in Popayán',
      tipo: 'Professional website',
      descripcion:
        'Website for a physiotherapist: it presents her treatment approaches, experience and training, lets visitors download her résumé and leads them to book an assessment.',
      alt: 'Valeria Castaño’s website home with the headline «Movement that heals, a body that remembers» and an illustration of a woman in motion',
      vitrina: { nombre: 'PHYSIOTHERAPY' },
    },
  },
  {
    id: 'hotel-recuerdo',
    nombre: 'Hotel El Recuerdo',
    cliente: 'Hotel, restaurante y pizzería familiar en Popayán',
    tipo: 'Sitio web y sistema de reservas',
    descripcion:
      'Sitio de un hotel familiar que cuenta su historia desde 1979, muestra las habitaciones en 3D y recibe solicitudes de disponibilidad. Incluye un panel para que el personal gestione habitaciones, camas y solicitudes.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Three.js', 'GSAP'],
    estado: 'en-vivo',
    url: 'https://hotelrecuerdo.vercel.app',
    repo: 'https://github.com/diazs28/HotelRecuerdo',
    imagenes: {
      escritorio: 'assets/projects/hotel-recuerdo-desktop.webp',
      movil: 'assets/projects/hotel-recuerdo-movil.webp',
    },
    alt: 'Portada de Hotel El Recuerdo con el nombre en letras grandes sobre el dibujo en líneas de la fachada del hotel',
    vitrina: {
      nombre: 'EL RECUERDO',
      color: 'linear-gradient(180deg, #FFD08A 0%, #E8963A 100%)',
      solido: '#F0A64A',
    },
    en: {
      cliente: 'Family-run hotel, restaurant and pizzeria in Popayán',
      tipo: 'Website and booking system',
      descripcion:
        'Website for a family hotel that tells its story since 1979, shows the rooms in 3D and receives availability requests. Includes a panel for staff to manage rooms, beds and requests.',
      alt: 'Hotel El Recuerdo cover with the name in large letters over a line drawing of the hotel facade',
    },
  },
  {
    id: 'barber-diaz',
    nombre: 'Magia Barber',
    cliente: 'Barbería en el centro de Popayán',
    tipo: 'Landing con agenda de citas',
    descripcion:
      'Página de una barbería con el plano del local: el cliente ve qué barbero está libre, revisa sus horas de la semana y aparta su turno sin hacer fila, o escribe por WhatsApp.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Zod'],
    estado: 'en-vivo',
    url: 'https://barber-diaz.vercel.app',
    repo: 'https://github.com/diazs28/Barber-Diaz',
    imagenes: {
      escritorio: 'assets/projects/barber-diaz-desktop.webp',
      movil: 'assets/projects/barber-diaz-movil.webp',
    },
    alt: 'Portada de Magia Barber con el nombre en letras grandes y la ilustración de un barbero cortando el cabello a un cliente',
    vitrina: {
      nombre: 'MAGIA BARBER',
      color: 'linear-gradient(180deg, #F4E9D2 0%, #C9B48C 100%)',
      solido: '#D9C7A0',
    },
    en: {
      cliente: 'Barbershop in downtown Popayán',
      tipo: 'Landing page with online booking',
      descripcion:
        'Barbershop page with a floor plan of the shop: clients see which barber is free, check their hours for the week and book a slot without waiting in line, or message on WhatsApp.',
      alt: 'Magia Barber cover with the name in large letters and an illustration of a barber cutting a client’s hair',
    },
  },
];
