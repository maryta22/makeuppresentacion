import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TONOS, TIPOS_PIEL, perfilCompleto } from '../src/perfil.js';

test('ofrece seis tonos de rostro con color válido', () => {
  assert.equal(TONOS.length, 6);
  for (const tono of TONOS) assert.match(tono.color, /^#[0-9A-F]{6}$/i, tono.id);
});

test('ofrece cuatro tipos de piel con descripción', () => {
  assert.deepEqual(TIPOS_PIEL.map((tipo) => tipo.id), ['seca', 'grasa', 'mixta', 'normal']);
  for (const tipo of TIPOS_PIEL) assert.ok(tipo.descripcion.length > 0, tipo.id);
});

test('el perfil está completo solo con tono y tipo de piel', () => {
  assert.equal(perfilCompleto({ tono: null, tipo: null }), false);
  assert.equal(perfilCompleto({ tono: 'medio', tipo: null }), false);
  assert.equal(perfilCompleto({ tono: null, tipo: 'seca' }), false);
  assert.equal(perfilCompleto({ tono: 'medio', tipo: 'seca' }), true);
});
