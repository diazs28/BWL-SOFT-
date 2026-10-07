import { MARCA, enlaceWhatsapp } from './config.js';
import { PROYECTOS } from './proyectos.js';
import { iniciarCarrusel } from './carrusel.js';

// ---------- Datos de marca ----------
document.querySelectorAll('[data-whatsapp]').forEach((a) => {
  a.href = enlaceWhatsapp();
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});

document.querySelectorAll('[data-marca]').forEach((el) => {
  const valor = MARCA[el.dataset.marca];
  if (valor) el.textContent = valor;
});

document.querySelectorAll('[data-anio]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Redes del pie: solo las que tengan URL en config.js
const listaRedes = document.querySelector('[data-redes]');
if (listaRedes) {
  const nombres = { github: 'GitHub', instagram: 'Instagram', linkedin: 'LinkedIn' };
  Object.entries(MARCA.redes).forEach(([red, url]) => {
    if (!url) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = nombres[red] ?? red;
    li.append(a);
    listaRedes.append(li);
  });
  if (MARCA.correo) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `mailto:${MARCA.correo}`;
    a.textContent = MARCA.correo;
    li.append(a);
    listaRedes.append(li);
  }
}

// ---------- Navegación ----------
const nav = document.querySelector('[data-nav]');
const botonMenu = document.querySelector('[data-menu-boton]');
const menu = document.querySelector('[data-menu]');

function cerrarMenu() {
  menu.classList.remove('is-open');
  botonMenu.setAttribute('aria-expanded', 'false');
  botonMenu.querySelector('.sr').textContent = 'Abrir menú';
}

botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('is-open');
  botonMenu.setAttribute('aria-expanded', String(abierto));
  botonMenu.querySelector('.sr').textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) cerrarMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) {
    cerrarMenu();
    botonMenu.focus();
  }
});

const marcarScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', marcarScroll, { passive: true });
requestAnimationFrame(marcarScroll);

// ---------- Carrusel de proyectos ----------
iniciarCarrusel(document.querySelector('[data-carrusel]'), PROYECTOS, {
  enlaceDemo: (p) => enlaceWhatsapp(`Hola, BWL & SOFT. Me gustaría ver una demo de ${p.nombre}.`),
});

// ---------- Formulario de contacto → WhatsApp ----------
const formulario = document.querySelector('[data-formulario]');

function marcarCampo(campo, valido) {
  const error = document.getElementById(`${campo.id}-error`);
  campo.setAttribute('aria-invalid', String(!valido));
  if (error) error.hidden = valido;
}

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = ['nombre', 'tipo', 'mensaje'].map((n) => formulario.elements[n]);
  let primerInvalido = null;

  campos.forEach((campo) => {
    const valido = campo.value.trim().length > 0;
    marcarCampo(campo, valido);
    if (!valido && !primerInvalido) primerInvalido = campo;
  });

  if (primerInvalido) {
    primerInvalido.focus();
    return;
  }

  const [nombre, tipo, mensaje] = campos.map((c) => c.value.trim());
  const texto = [
    `Hola, BWL & SOFT. Soy ${nombre}.`,
    `Tipo de proyecto: ${tipo}.`,
    '',
    mensaje,
  ].join('\n');

  window.open(enlaceWhatsapp(texto), '_blank', 'noopener,noreferrer');
});

formulario.addEventListener('input', (e) => {
  if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) {
    marcarCampo(e.target, true);
  }
});
