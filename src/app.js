import { TONOS, TIPOS_PIEL, buscarTono, perfilCompleto } from './perfil.js';
import { RECORRIDO, cargarPasos, primerPaso, siguientePaso, numeroDePaso } from './recorrido.js';
import { crearAvatar } from './avatar.js';

const $ = (selector) => document.querySelector(selector);
const menosMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const estado = { perfil: { tono: null, tipo: null }, pasos: new Map(), hechos: new Set(), actual: null };
const avatar = crearAvatar($('#avatar'));

// ---------- El avatar habla ----------

let turnoDeHabla = 0;
async function decir(texto) {
  const turno = ++turnoDeHabla;
  const globo = $('#globo-texto');
  $('#globo-lector').textContent = texto;
  if (menosMovimiento()) {
    globo.textContent = texto;
    return;
  }
  avatar.hablar(true);
  globo.textContent = '';
  for (const letra of texto) {
    if (turno !== turnoDeHabla) return;
    globo.textContent += letra;
    await new Promise((resolver) => setTimeout(resolver, 22));
  }
  if (turno === turnoDeHabla) avatar.hablar(false);
}

// ---------- Luces del espejo ----------

function encenderLuces() {
  const contenedor = $('#luces');
  const lado = [88, 72, 56];
  const arco = [180, 150, 120, 90, 60, 30, 0].map((grados) => {
    const rad = (grados * Math.PI) / 180;
    return [50 + 50 * Math.cos(rad), 40 - 40 * Math.sin(rad)];
  });
  const posiciones = [
    ...lado.map((y) => [0, y]),
    ...arco,
    ...[...lado].reverse().map((y) => [100, y])
  ];
  contenedor.innerHTML = posiciones
    .map(([x, y], i) => `<span class="bombilla" style="left:${x}%;top:${y}%;animation-delay:${i * 70}ms"></span>`)
    .join('');
}

// ---------- Pantalla de inicio ----------

function pintarOpciones() {
  $('#tonos').innerHTML = TONOS.map((tono) => `
    <label class="tono">
      <input type="radio" name="tono" value="${tono.id}">
      <span class="tono__muestra" style="--muestra:${tono.color}"></span>
      <span class="solo-lector">${tono.nombre}</span>
    </label>`).join('');

  $('#tipos').innerHTML = TIPOS_PIEL.map((tipo) => `
    <label class="tipo">
      <input type="radio" name="tipo" value="${tipo.id}">
      <span class="tipo__nombre">${tipo.nombre}</span>
      <span class="tipo__descripcion">${tipo.descripcion}</span>
    </label>`).join('');
}

function actualizarInicio() {
  const tono = buscarTono(estado.perfil.tono);
  $('#tono-elegido').textContent = tono ? tono.nombre : '';
  if (tono) avatar.tono(tono.color);
  const listo = perfilCompleto(estado.perfil);
  $('#comenzar').disabled = !listo;
  $('#pista').hidden = listo;
}

function mostrarInicio() {
  estado.hechos.clear();
  estado.actual = null;
  avatar.reiniciar();
  document.body.dataset.pantalla = 'inicio';
  $('#panel-inicio').hidden = false;
  $('#panel-paso').hidden = true;
  $('#panel-cierre').hidden = true;
  $('#recorrido').hidden = true;
  $('#reiniciar').hidden = true;
  decir('¡Hola! Elige el tono de tu rostro y tu tipo de piel, y armamos tu rutina.');
}

// ---------- Recorrido y pasos ----------

function pintarRecorrido() {
  $('#recorrido-lista').innerHTML = RECORRIDO.map(({ id, titulo }, i) => {
    const existe = estado.pasos.has(id);
    const clase = id === estado.actual ? 'actual' : estado.hechos.has(id) ? 'hecho' : existe ? 'disponible' : 'pendiente';
    const estadoLector = { actual: 'paso actual', hecho: 'hecho', disponible: 'disponible', pendiente: 'próximamente' }[clase];
    return `<li class="${clase}"${clase === 'actual' ? ' aria-current="step"' : ''}>
      <span class="recorrido__numero">${clase === 'hecho' ? '✓' : i + 1}</span>${titulo}
      <span class="solo-lector">(${estadoLector})</span>
    </li>`;
  }).join('');
}

function mostrarPaso(id) {
  const paso = estado.pasos.get(id);
  estado.actual = id;
  document.body.dataset.pantalla = 'paso';
  $('#panel-inicio').hidden = true;
  $('#panel-cierre').hidden = true;
  $('#panel-paso').hidden = false;
  $('#recorrido').hidden = false;
  $('#reiniciar').hidden = false;
  pintarRecorrido();

  $('#paso-numero').textContent = `Paso ${numeroDePaso(id)} de ${RECORRIDO.length}`;
  $('#paso-titulo').textContent = paso.titulo;
  $('#paso-consejos').innerHTML = paso.consejos(estado.perfil).map((consejo) => `<li>${consejo}</li>`).join('');
  const recomendacion = paso.recomendacion(estado.perfil);
  $('#etiqueta-titulo').textContent = recomendacion.titulo;
  $('#etiqueta-texto').textContent = recomendacion.texto;
  $('#terminar').disabled = false;

  avatar.efecto(paso.efecto ?? null);
  avatar.guia(paso.guia ?? null);
  $('#leyenda').hidden = !paso.guia;
  paso.aplicar?.(avatar, estado.perfil);
  decir(paso.mensaje(estado.perfil));
  $('#paso-titulo').focus();
}

async function terminarPaso() {
  const paso = estado.pasos.get(estado.actual);
  $('#terminar').disabled = true;
  avatar.efecto(null);
  avatar.guia(null);
  if (paso.alTerminar) await avatar.destello(paso.alTerminar);
  estado.hechos.add(paso.id);

  const siguiente = siguientePaso(paso.id, estado.pasos);
  if (siguiente.tipo === 'paso') {
    mostrarPaso(siguiente.id);
  } else {
    mostrarCierre(paso, siguiente);
  }
}

function mostrarCierre(ultimo, siguiente) {
  estado.actual = null;
  pintarRecorrido();
  $('#panel-paso').hidden = true;
  $('#panel-cierre').hidden = false;
  $('#cierre-texto').textContent = siguiente.tipo === 'pendiente'
    ? `Terminaste: ${ultimo.titulo.toLowerCase()}. El siguiente paso, ${siguiente.titulo.toLowerCase()}, todavía no está disponible.`
    : 'Completaste toda la rutina.';
  avatar.destello('brillo');
  decir(ultimo.logro ?? '¡Muy bien!');
  $('#cierre-titulo').focus();
}

// ---------- Arranque ----------

async function iniciar() {
  encenderLuces();
  pintarOpciones();
  estado.pasos = await cargarPasos();

  $('#perfil').addEventListener('change', (evento) => {
    estado.perfil[evento.target.name] = evento.target.value;
    actualizarInicio();
  });
  $('#perfil').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const id = primerPaso(estado.pasos);
    if (perfilCompleto(estado.perfil) && id) mostrarPaso(id);
  });
  $('#terminar').addEventListener('click', terminarPaso);
  $('#reiniciar').addEventListener('click', mostrarInicio);
  $('#volver').addEventListener('click', mostrarInicio);

  actualizarInicio();
  mostrarInicio();
}

iniciar();
