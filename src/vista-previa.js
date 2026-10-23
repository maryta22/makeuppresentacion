// Página de apoyo: aplica y difumina cada producto sobre el avatar, en cualquier tono de piel.
import { TONOS } from './perfil.js';
import { crearAvatar } from './avatar.js';
import { encenderLuces } from './espejo.js';

const $ = (selector) => document.querySelector(selector);

// Mezcla dos colores hex: peso 0 = a, peso 1 = b.
function mezclar(a, b, peso) {
  const canales = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ca, cb] = [canales(a), canales(b)];
  return `#${ca.map((v, i) => Math.round(v + (cb[i] - v) * peso).toString(16).padStart(2, '0')).join('')}`;
}

const PRODUCTOS = [
  { nombre: 'Base', capa: 'base', guia: 'base', opacidad: 0.45, color: (tono) => mezclar(tono, '#C68A62', 0.35) },
  { nombre: 'Bronceador', capa: 'bronceador', guia: 'bronceador', opacidad: 0.6 },
  { nombre: 'Iluminador', capa: 'iluminador', guia: 'iluminador', opacidad: 0.7 },
  { nombre: 'Rubor', capa: 'rubor', guia: 'rubor', opacidad: 0.6, color: () => '#E36F7E' },
  { nombre: 'Cejas', capa: 'cejas', guia: 'cejas', opacidad: 1, grosor: 2 },
  { nombre: 'Sombra de ojos', capa: 'sombra', guia: 'sombra-ojos', opacidad: 0.85, color: () => '#9B6B8E' },
  { nombre: 'Pestañas', capa: 'pestanas', guia: 'pestanas', opacidad: 1 },
  { nombre: 'Labial', capa: 'labios', guia: 'labial', opacidad: 1, color: () => '#B3314A' }
];

let tono = TONOS.find((t) => t.id === 'medio');
const avatar = crearAvatar($('#avatar'));
avatar.tono(tono.color);
encenderLuces($('#luces'));

$('#tonos').innerHTML = TONOS.map((t) => `
  <label class="tono">
    <input type="radio" name="tono" value="${t.id}"${t.id === tono.id ? ' checked' : ''}>
    <span class="tono__muestra" style="--muestra:${t.color}"></span>
    <span class="solo-lector">${t.nombre}</span>
  </label>`).join('');

$('#productos').innerHTML = PRODUCTOS
  .map((p, i) => `<button class="producto" type="button" data-indice="${i}">${p.nombre}</button>`)
  .join('');

$('#tonos').addEventListener('change', (evento) => {
  tono = TONOS.find((t) => t.id === evento.target.value);
  avatar.tono(tono.color);
});

$('#productos').addEventListener('click', async (evento) => {
  const producto = PRODUCTOS[evento.target.dataset.indice];
  if (!producto) return;
  avatar.guia(producto.guia);
  await avatar.difuminar(producto.capa, {
    color: producto.color?.(tono.color),
    opacidad: producto.opacidad,
    grosor: producto.grosor
  });
});

$('#quitar').addEventListener('click', () => {
  avatar.reiniciar();
  avatar.tono(tono.color);
});
