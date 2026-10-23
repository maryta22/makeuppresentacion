// Un test por escenario de la spec paso-labial, con el mismo nombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import labial, { COLORES } from '../src/pasos/labial.js';

function sugiere(tonos, color) {
  for (const tono of tonos) {
    const { titulo, texto } = labial.recomendacion({ tono, tipo: 'normal' });
    assert.equal(titulo, 'Para tu tono de piel');
    assert.ok(texto.includes(`labial ${color}`), `${tono}: ${texto}`);
  }
}

test('Tonos de piel claros', () => sugiere(['claro', 'claro-medio'], 'rosa natural'));
test('Tonos de piel medios', () => sugiere(['medio', 'medio-oscuro'], 'terracota'));
test('Tonos de piel oscuros', () => sugiere(['oscuro', 'profundo'], 'vino'));

test('Labial en el color sugerido', () => {
  const casos = { claro: COLORES.claros, medio: COLORES.medios, profundo: COLORES.oscuros };
  assert.equal(labial.guia, 'labial');
  for (const [tono, esperado] of Object.entries(casos)) {
    let pedido;
    labial.aplicar({ difuminar: (capa, opciones) => { pedido = { capa, ...opciones }; } }, { tono, tipo: 'grasa' });
    assert.equal(pedido.capa, 'labios');
    assert.equal(pedido.color, esperado.color, tono);
  }
});

test('explica la técnica: bálsamo, del centro a las comisuras y segunda capa', () => {
  const consejos = labial.consejos().join(' ');
  for (const clave of ['bálsamo', 'desde el centro hacia las comisuras', 'segunda capa']) {
    assert.ok(consejos.includes(clave), `falta "${clave}"`);
  }
});
