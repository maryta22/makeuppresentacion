import { test } from 'node:test';
import assert from 'node:assert/strict';
import limpieza from '../src/pasos/limpieza.js';

test('pide masajear en círculos suaves', () => {
  assert.ok(limpieza.consejos().some((consejo) => consejo.includes('círculos suaves')));
});

test('recomienda el limpiador según el tipo de piel', () => {
  const casos = {
    seca: ['Para tu piel seca', 'cremoso'],
    grasa: ['Para tu piel grasa', 'gel o espuma'],
    mixta: ['Para tu piel mixta', 'gel suave'],
    normal: ['Para tu piel normal', 'suave de uso diario']
  };
  for (const [tipo, [titulo, clave]] of Object.entries(casos)) {
    const recomendacion = limpieza.recomendacion({ tono: 'medio', tipo });
    assert.equal(recomendacion.titulo, titulo);
    assert.ok(recomendacion.texto.includes(clave), `${tipo}: ${recomendacion.texto}`);
  }
});

test('muestra espuma mientras dura y enjuague al terminar', () => {
  assert.equal(limpieza.efecto, 'espuma');
  assert.equal(limpieza.alTerminar, 'enjuague');
});
