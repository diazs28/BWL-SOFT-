# BWL & SOFT · Landing-portafolio

## Descripción

Landing de **BWL & SOFT** (BWL SOFT · Binomio Web Lab), equipo de desarrollo de software a la
medida y páginas web en Popayán, Colombia. Su trabajo es que un cliente potencial vea en segundos
que hacemos software profesional, revise proyectos reales desde el inicio y nos escriba por WhatsApp
para cotizar.

Secciones: inicio (vitrina de proyectos con ficha expandible), servicios (incluye cómo
trabajamos) y pie de página. El contacto es un chat que se abre desde el botón flotante de
WhatsApp, presente en toda la página.

### Dirección visual

- **Tono**: taller de ingeniería con acabado de cobre. Fondo grafito dominante, acentos cobre
  metalizado del kit de marca. Todo el sitio va sobre grafito.
- **Tipografía**: Poppins (400, 500 y 600), la del logo, para todo el texto. Anton solo para el
  texto gigante (nombre de la vitrina y palabra de servicios).
- **Cotización**: el botón flotante de WhatsApp se estira una vez por visita ("¿Cotizamos tu
  proyecto?") y al tocarlo crece en círculo hasta un chat. Pregunta de a una cosa (nombre, tipo de
  proyecto con opciones para tocar, idea) con burbujas y "escribiendo…", y al final abre WhatsApp
  con el mensaje listo. "Cotiza tu software", "Contacto" y `#contacto` abren el mismo chat. En el
  celular (menos de 768 px) es una hoja inferior a todo el ancho: oscurece el fondo, bloquea el
  desplazamiento de la página y se cierra con la X, tocando fuera o deslizando hacia abajo.
- **Servicios**: una palabra gigante fija (WEB, TIENDAS, SISTEMAS, APPS) cambia con las letras
  que se hunden y emergen según el servicio que se está leyendo, y ese servicio se ilumina. Los
  pasos de "Cómo trabajamos" se encienden uno por uno con una línea de cobre al aparecer.
- **Vitrina del inicio** (`js/vitrina.js`): miniaturas de los proyectos sobre «BWL & SOFT» en
  letras gigantes con textura de líneas. Al pasar el mouse, enfocar con teclado o tocar una
  miniatura, las letras se hunden y emerge el nombre del proyecto con su color; un círculo con
  flecha sigue al cursor. La entrada de las letras arranca justo cuando se desvanece la pantalla
  de inicio.
- **Anillo de miniaturas**: en PC y celular las miniaturas giran en un anillo 3D (360°), despacio
  y solas hasta que alguien lo usa; se pausa con el mouse encima. Arrastrar (mouse o dedo) o la
  rueda lo giran y encaja en el proyecto más cercano. La del frente cambia el nombre gigante; un
  toque la trae al frente y doble toque o doble clic abre su ficha (con teclado, Enter). Tras 8 s
  sin uso vuelve a girar solo y a "BWL & SOFT". Cada proyecto aparece dos veces para llenar el
  anillo (las copias no se enfocan ni se anuncian).
- **Ficha del proyecto**: al hacer clic o tocar una miniatura, la imagen vuela y crece hasta la
  vista previa grande (View Transitions API) y al lado aparece su ficha: tipo, nombre, cliente,
  descripción, tecnologías y el enlace para verlo en vivo o pedir una demo. Entre proyectos se pasa con las flechas, el teclado
  (← →) o deslizando en el celular; una cortina del color del proyecto barre la imagen. Esc o
  "Cerrar" vuelve al inicio. En el celular los proyectos quedan uno al lado del otro en
  teléfonos que se deslizan de lado con tope en cada uno; el que queda en el centro actualiza el
  nombre gigante, la ficha y la miniatura activa. Cada proyecto tiene enlace directo (`/#proyecto-karbon`). Reemplaza
  al antiguo carrusel: los enlaces a `#proyectos` abren la vitrina.
- **Paleta**: `--bwl-grafito` #1C1C1F, `--bwl-grafito-2` #2A2A2E, `--bwl-cobre` #D08A62,
  `--bwl-cobre-claro` #F2C4A4, `--bwl-cobre-oscuro` #7A4128 (texto cobre sobre fondo claro),
  `--bwl-humo` #F4EFEC.
- **Pantalla de inicio** (adaptada del `Preloader.tsx` del equipo, sin React): «BWL & SOFT» se
  enfoca en cobre, se difumina, sube una ola de cobre con borde suave desde la esquina inferior
  derecha y el velo sale con desenfoque mientras emergen las letras del nombre gigante. Dura unos
  3,4 s, se muestra una vez por pestaña y nunca con movimiento reducido. Para volver a verla, abre la página en una pestaña nueva. Se controla en
  `js/intro.js` y en la sección «Pantalla de inicio» de `css/style.css`.
- **Detalle memorable**: el logo del hero sobre un disco de cobre torneado (anillos concéntricos)
  con un destello de luz que recorre el metal una sola vez al cargar.
- **Carrusel**: cada proyecto se ve dentro de un marco de navegador en escritorio y de teléfono en
  móvil, con su propia captura para cada tamaño.

## Supuestos (por validar)

- El nombre comercial es **BWL & SOFT**; en el pie y en los datos estructurados aparece también
  «BWL SOFT · Binomio Web Lab», como en el kit de logo.
- El dominio provisional es `https://bwl-soft.vercel.app`. Si el proyecto queda con otro dominio,
  cámbialo en `index.html` (canonical, Open Graph y JSON-LD), `robots.txt` y `sitemap.xml`.
- No hay correo ni redes además de GitHub: quedan vacíos en `js/config.js` y no se muestran.
- Las URL de TechnoSur y de la psicóloga Karla Silva se tomaron del campo «homepage» de sus
  repositorios en GitHub (respondían 200 el 7 de octubre de 2026).
- Karbon POS se presenta como producto propio para restaurantes y bares; ÁCIDO 303 como proyecto de
  portafolio (la marca y el evento son ficticios).

## Pendiente

- **PortalSalud**: no está desplegado. Sale como «Demo bajo solicitud». La captura se tomó del
  build local sin backend (por eso no aparecen productos en la parte baja).
- **ÁCIDO 303**: no está desplegado. Sale como «Demo bajo solicitud».
- Cuando cualquiera de los dos tenga URL, cambia en `js/proyectos.js` su `estado` a `'en-vivo'` y
  llena `url`.
- Confirmar el dominio definitivo (ver Supuestos).

## Stack

HTML + CSS + JavaScript vanilla (scripts clásicos con `defer`), sin build ni dependencias en producción. Fuente
Poppins y Anton desde Google Fonts. Sin GSAP: las animaciones son CSS y Web Animations API, y respetan
`prefers-reduced-motion`. Publicación estática en Vercel.

## Requisitos

- Python 3 (para el servidor local) o cualquier servidor estático.
- Node 22 o superior y npm, solo para lint y formato.

## Instalación

```bash
npm install          # solo herramientas de desarrollo (ESLint y Prettier)
npm run dev          # python -m http.server 5173
```

Abre http://localhost:5173. También puedes abrir `index.html` con doble clic: los scripts son
clásicos (`defer`), no módulos, así que funcionan sin servidor.

## Variables de entorno

No usa. Todo el contenido es público y estático.

## Scripts

| Script                 | Qué hace                               |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Servidor local en el puerto 5173       |
| `npm run lint`         | ESLint sobre `js/`                     |
| `npm run format`       | Formatea con Prettier                  |
| `npm run format:check` | Verifica el formato                    |
| `npm run check`        | Lint + formato (correr antes de un PR) |

## Estructura

```
index.html              Página principal (SEO, Open Graph y JSON-LD en el <head>)
404.html                Página de error con la misma marca
css/reset.css           Reset base
css/style.css           Sistema de diseño (tokens sobre los --bwl-* del kit) y estilos
js/config.js            MARCA: nombre, WhatsApp, ciudad, redes. Único lugar para datos de contacto
js/proyectos.js         Datos de los proyectos. Único lugar para agregar o editar proyectos
js/intro.js             Activa la pantalla de inicio (una vez por pestaña)
js/letras.js            Texto gigante letra por letra (lo usan la vitrina y los servicios)
js/obrero.js            Obrero pixelado que martilla: proyectos con `enObra: true`
js/vitrina.js           Vitrina del inicio: miniaturas, nombre gigante y ficha de cada proyecto
js/servicios.js         Palabra gigante que sigue la lectura de servicios y pasos que se encienden
js/cotizar.js           Chat de cotización del botón flotante: arma el mensaje y abre WhatsApp
js/main.js              Enlaces de WhatsApp, menú y arranque de vitrina, servicios y cotización
assets/brand/           Archivos del kit que usa la página + og-image.png (1200x630)
assets/projects/        Capturas WebP de cada proyecto (escritorio 1280x800, móvil 585x1266)
BWL-Soft-Kit-Logo/      Kit de marca original. No se modifica y no se publica (.vercelignore)
vercel.json             cleanUrls, cabeceras de seguridad y caché
robots.txt, sitemap.xml SEO
docs/adr/               Decisiones de arquitectura
```

## Personalización

- **WhatsApp, ciudad, nombre, redes**: `js/config.js`. Todos los botones de WhatsApp toman el número
  de ahí. Excepción: el teléfono en el JSON-LD de `index.html` es estático (los buscadores lo leen
  sin ejecutar JS); si cambia el número, actualízalo también ahí.
- **Textos de servicios y proceso**: directamente en `index.html`. La palabra gigante y su color
  salen de `data-nombre` y `data-color` de cada servicio.
- **Versión de CSS y JS**: `index.html` y `404.html` cargan los archivos con `?v=AAAA-MM-DD`. Si
  cambias algo en `css/` o `js/`, actualiza esa fecha para que los navegadores no muestren la
  versión vieja guardada en caché.
- **Colores**: los de marca vienen de `assets/brand/brand-tokens.css` (copia del kit; no editar).
  Los tokens de la página (`--color-*`, `--fs-*`, `--space-*`) están al inicio de `css/style.css`.

### Agregar un proyecto a la vitrina

1. Toma dos capturas del proyecto:
   - Escritorio: viewport 1280x800.
   - Móvil: viewport 390x844 (se guarda a 585x1266).
2. Conviértelas a WebP (máximo 200 KB) y guárdalas como
   `assets/projects/<id>-desktop.webp` (1280x800), `assets/projects/<id>-desktop-800.webp`
   (800x500, versión liviana para pantallas medianas) y `assets/projects/<id>-movil.webp`
   (585x1266).
3. Agrega un bloque en `js/proyectos.js`:

   ```js
   {
     id: 'mi-proyecto',
     nombre: 'Nombre visible',
     cliente: 'Para quién se hizo',
     tipo: 'Tienda en línea con pagos',
     descripcion: 'Qué hace, en una o dos frases sin jerga.',
     stack: ['React', 'Node.js'],
     estado: 'en-vivo', // 'en-vivo' | 'privado' | 'demo'
     url: 'https://...', // solo si estado es 'en-vivo'
     imagenes: {
       escritorio: 'assets/projects/mi-proyecto-desktop.webp',
       movil: 'assets/projects/mi-proyecto-movil.webp',
     },
     alt: 'Descripción de lo que se ve en la captura',
     // Miniatura y nombre gigante en el inicio (sin este campo el proyecto no se muestra)
     vitrina: { nombre: 'MI PROYECTO', color: '#E8301C', solido: '#E8301C' },
   },
   ```

   En `vitrina`, `color` puede ser un color o un degradado (`linear-gradient(...)`) para las
   letras, y `solido` es el color plano del círculo que sigue al cursor. Usa nombres cortos
   (hasta unos 12 caracteres); si no caben en el celular, se reducen solos.

4. Listo: la miniatura, la ficha, la navegación y las etiquetas se generan solas. No hay que tocar
   el HTML.

> Las imágenes de `/assets` se sirven con caché de un año (`immutable`). Si reemplazas una captura,
> cámbiale el nombre (por ejemplo `-v2.webp`) para que los navegadores descarguen la nueva.

## Despliegue

En Vercel, como sitio estático sin build:

1. Sube el repositorio a GitHub: `gh repo create dante312w/BWL-Landig --private --source . --push`.
2. En vercel.com → **Add New → Project** → importa el repositorio.
3. **Framework Preset**: `Other`. Deja vacíos Build Command y Output Directory.
4. **Deploy**. Vercel publica la raíz tal cual, aplica `vercel.json` y excluye lo de
   `.vercelignore` (kit de marca, herramientas de desarrollo).
5. Si el dominio final no es `bwl-soft.vercel.app`, actualízalo (ver Supuestos) y vuelve a publicar.

Con la CLI: `npx vercel` (vista previa) y `npx vercel --prod`.

## Ramas

Git Flow: `main` (producción) ← `develop` ← `feature/<tema>` o `fix/<tema>`.

- **Nunca** se hace push ni PR directo a `main`. Todo cambio va en su propia rama y entra por PR a
  `develop`; solo un PR de `develop` pasa a `main`.
- El workflow `.github/workflows/solo-develop-a-main.yml` falla cualquier PR hacia `main` que no
  venga de `develop`.
- Para que GitHub bloquee la fusión, el dueño del repo activa una regla (ruleset) en `main`:
  exigir PR, exigir el check `solo-develop-a-main`, sin push forzado ni borrado. Conviene además
  dejar `develop` como rama por defecto para que los PR apunten ahí solos.

## Seguridad

- Sitio estático sin backend ni secretos; no hay `.env`.
- El chat de cotización no envía datos a ningún servidor: arma el texto y abre WhatsApp en el
  dispositivo del visitante, que es quien toca "Enviar".
- CSP estricta en `vercel.json`: solo scripts propios (`'self'`), estilos propios y de Google Fonts,
  fuentes de `fonts.gstatic.com`, sin `unsafe-inline` ni `eval`. Además HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` y
  `frame-ancestors 'none'`.
- Los datos de proyectos se pintan con `textContent` y nodos del DOM, nunca con `innerHTML`
  (ESLint lo bloquea).
- Enlaces externos con `rel="noopener noreferrer"`.
- Repositorio público: sin secretos en el historial, `.gitignore` cubre `.env`, llaves, `.venv/` y
  la configuración local de editores y de Claude. Dependabot revisa las dependencias cada semana
  y los reportes de vulnerabilidades se hacen en privado (ver [SECURITY.md](SECURITY.md)).
