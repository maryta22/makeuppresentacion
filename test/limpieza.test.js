// Un test por escenario de openspec/specs/paso-limpieza/spec.md, con el mismo nombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import limpieza from '../src/pasos/limpieza.js';

function recomendacion(tipo) {
  return limpieza.recomendacion({ tono: 'medio', tipo });
}

test('Piel seca', () => {
  const { titulo, texto } = recomendacion('seca');
  assert.equal(titulo, 'Para tu piel seca');
  assert.ok(texto.includes('cremoso'), texto);
});

test('Piel grasa', () => {
  const { titulo, texto } = recomendacion('grasa');
  assert.equal(titulo, 'Para tu piel grasa');
  assert.ok(texto.includes('gel o espuma'), texto);
});

test('Piel mixta', () => {
  const { titulo, texto } = recomendacion('mixta');
  assert.equal(titulo, 'Para tu piel mixta');
  assert.ok(texto.includes('gel suave'), texto);
});

test('Piel normal', () => {
  const { titulo, texto } = recomendacion('normal');
  assert.equal(titulo, 'Para tu piel normal');
  assert.ok(texto.includes('suave de uso diario'), texto);
});

test('Durante la limpieza', () => {
  assert.equal(limpieza.efecto, 'espuma');
  assert.ok(limpieza.consejos().some((consejo) => consejo.includes('círculos suaves')));
});

test('Movimiento circular señalizado', () => {
  assert.equal(limpieza.guia, 'limpieza');
});

test('Enjuague al terminar', () => {
  assert.equal(limpieza.alTerminar, 'enjuague');
});
