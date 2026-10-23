import { test } from 'node:test';
import assert from 'node:assert/strict';
import { etapaDifuminado } from '../src/avatar.js';

test('al empezar no hay producto en la piel ni manchas', () => {
  const etapa = etapaDifuminado(0);
  assert.equal(etapa.capa, 0);
  assert.equal(etapa.manchas, 0);
});

test('primero aparece el producto concentrado en los puntos de aplicación', () => {
  const etapa = etapaDifuminado(0.15);
  assert.equal(etapa.manchas, 1);
  assert.equal(etapa.capa, 0);
  assert.equal(etapa.brocha, 0);
});

test('al terminar, el producto queda difuminado por completo y la brocha se va', () => {
  const etapa = etapaDifuminado(1);
  assert.equal(etapa.capa, 1);
  assert.equal(etapa.tamano, 1);
  assert.equal(etapa.desenfoque, 1);
  assert.equal(etapa.manchas, 0);
  assert.equal(etapa.brochaVisible, 0);
});

test('el difuminado avanza sin retroceder', () => {
  let anterior = etapaDifuminado(0);
  for (let t = 0.05; t <= 1; t += 0.05) {
    const etapa = etapaDifuminado(t);
    for (const clave of ['capa', 'tamano', 'desenfoque', 'brocha']) {
      assert.ok(etapa[clave] >= anterior[clave], `${clave} retrocede en t=${t.toFixed(2)}`);
    }
    anterior = etapa;
  }
});

test('los instantes fuera de rango se limitan al inicio y al final', () => {
  assert.deepEqual(etapaDifuminado(-1), etapaDifuminado(0));
  assert.deepEqual(etapaDifuminado(2), etapaDifuminado(1));
});
