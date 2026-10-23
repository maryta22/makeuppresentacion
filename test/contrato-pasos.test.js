// Todo paso que exista en src/pasos/ debe cumplir el mismo contrato.
// Este test cubre automáticamente cada paso nuevo que se agregue.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECORRIDO, cargarPasos } from '../src/recorrido.js';
import { TIPOS_PIEL, TONOS } from '../src/perfil.js';

const pasos = await cargarPasos();
const perfiles = TONOS.flatMap((tono) => TIPOS_PIEL.map((tipo) => ({ tono: tono.id, tipo: tipo.id })));

for (const [id, paso] of pasos) {
  test(`el paso "${id}" cumple el contrato`, () => {
    const enRecorrido = RECORRIDO.find((item) => item.id === id);
    assert.equal(paso.id, id);
    assert.equal(paso.titulo, enRecorrido.titulo);
    for (const perfil of perfiles) {
      assert.ok(paso.mensaje(perfil).length > 0, 'mensaje vacío');
      const consejos = paso.consejos(perfil);
      assert.ok(Array.isArray(consejos) && consejos.length > 0, 'sin consejos');
      const { titulo, texto } = paso.recomendacion(perfil);
      assert.ok(titulo && texto, `recomendación incompleta para ${perfil.tipo}`);
    }
    if ('aplicar' in paso) assert.equal(typeof paso.aplicar, 'function');
  });
}
