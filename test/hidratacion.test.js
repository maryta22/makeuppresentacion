// Un test por escenario de la spec paso-hidratacion, con el mismo nombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import hidratacion from '../src/pasos/hidratacion.js';

const perfil = (tipo) => ({ tono: 'medio', tipo });

function recomienda(tipo, claves) {
  const { titulo, texto } = hidratacion.recomendacion(perfil(tipo));
  assert.equal(titulo, `Para tu piel ${tipo}`);
  for (const clave of claves) assert.ok(texto.includes(clave), `${tipo}: falta "${clave}" en "${texto}"`);
}

test('Piel seca', () => {
  recomienda('seca', ['sérum', 'aún húmeda', 'crema nutritiva']);
  assert.ok(hidratacion.mensaje(perfil('seca')).includes('sérum'));
});

test('Piel grasa', () => {
  recomienda('grasa', ['gel', 'crema ligera', 'sin aceites']);
  assert.ok(!hidratacion.mensaje(perfil('grasa')).includes('sérum'));
});

test('Piel mixta', () => {
  recomienda('mixta', ['crema ligera', 'mejillas']);
});

test('Piel normal', () => {
  recomienda('normal', ['crema humectante ligera']);
});

test('Brillo según el tipo de piel', () => {
  const pedidos = {};
  for (const tipo of ['seca', 'normal', 'mixta', 'grasa']) {
    hidratacion.aplicar({ difuminar: (capa, opciones) => { pedidos[tipo] = { capa, ...opciones }; } }, perfil(tipo));
  }
  assert.equal(hidratacion.guia, 'hidratacion');
  for (const pedido of Object.values(pedidos)) {
    assert.equal(pedido.capa, 'brillo');
    assert.equal(pedido.guia, 'hidratacion');
  }
  assert.ok(pedidos.seca.opacidad > pedidos.normal.opacidad);
  assert.ok(pedidos.normal.opacidad > pedidos.grasa.opacidad);
  assert.ok(pedidos.mixta.opacidad > pedidos.grasa.opacidad);
});

test('explica la técnica: en puntos, hacia afuera y esperar a que se absorba', () => {
  const consejos = hidratacion.consejos().join(' ');
  for (const clave of ['frente, mejillas y mentón', 'hacia afuera y hacia arriba', 'se absorba']) {
    assert.ok(consejos.includes(clave), `falta "${clave}"`);
  }
});
