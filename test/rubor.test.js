// Un test por escenario de la spec paso-rubor, con el mismo nombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rubor, { COLORES } from '../src/pasos/rubor.js';

function sugiere(tonos, color) {
  for (const tono of tonos) {
    const { texto } = rubor.recomendacion({ tono, tipo: 'normal' });
    assert.ok(texto.includes(`Tono sugerido: ${color}`), `${tono}: ${texto}`);
  }
}

function formula(tipo, clave) {
  const { titulo, texto } = rubor.recomendacion({ tono: 'medio', tipo });
  assert.equal(titulo, `Para tu piel ${tipo}`);
  assert.ok(texto.includes(clave), `${tipo}: ${texto}`);
}

test('Tonos de piel claros', () => sugiere(['claro', 'claro-medio'], 'rosa suave'));
test('Tonos de piel medios', () => sugiere(['medio', 'medio-oscuro'], 'durazno'));
test('Tonos de piel oscuros', () => sugiere(['oscuro', 'profundo'], 'frambuesa'));

test('Piel seca', () => formula('seca', 'en crema'));
test('Piel grasa', () => formula('grasa', 'en polvo'));
test('Piel mixta', () => formula('mixta', 'polvo o en crema ligera'));
test('Piel normal', () => formula('normal', 'el que prefieras'));

test('Rubor en el color sugerido', () => {
  const casos = { claro: COLORES.claros, medio: COLORES.medios, profundo: COLORES.oscuros };
  assert.equal(rubor.guia, 'rubor');
  for (const [tono, esperado] of Object.entries(casos)) {
    let pedido;
    rubor.aplicar({ difuminar: (capa, opciones) => { pedido = { capa, ...opciones }; } }, { tono, tipo: 'seca' });
    assert.equal(pedido.capa, 'rubor');
    assert.equal(pedido.color, esperado.color, tono);
  }
});

test('explica la técnica: parte alta de las mejillas, hacia las sienes, poco producto', () => {
  const consejos = rubor.consejos().join(' ');
  for (const clave of ['parte más alta de las mejillas', 'sienes', 'poco producto']) {
    assert.ok(consejos.includes(clave), `falta "${clave}"`);
  }
});
