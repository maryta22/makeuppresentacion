import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECORRIDO, cargarPasos, primerPaso, siguientePaso } from '../src/recorrido.js';

const con = (...ids) => new Map(ids.map((id) => [id, { id }]));

test('el recorrido completo tiene doce pasos en orden', () => {
  assert.deepEqual(
    RECORRIDO.map((paso) => paso.id),
    [
      'limpieza', 'hidratacion', 'primer', 'base', 'bronceador', 'iluminador',
      'rubor', 'cejas', 'sombra-ojos', 'pestanas', 'labial', 'sellador'
    ]
  );
});

test('solo carga los pasos cuyo archivo existe', async () => {
  const disponibles = await cargarPasos();
  assert.ok(disponibles.has('limpieza'));
  for (const id of disponibles.keys()) assert.ok(RECORRIDO.some((paso) => paso.id === id), id);
});

test('el primer paso es el primero disponible', () => {
  assert.equal(primerPaso(con('limpieza', 'base')), 'limpieza');
  assert.equal(primerPaso(con('base')), 'base');
  assert.equal(primerPaso(con()), null);
});

test('después de un paso sigue el siguiente disponible, saltando los que no existen', () => {
  assert.deepEqual(siguientePaso('limpieza', con('limpieza', 'base')), { tipo: 'paso', id: 'base' });
});

test('si no quedan pasos disponibles, indica cuál es el siguiente pendiente', () => {
  assert.deepEqual(
    siguientePaso('limpieza', con('limpieza')),
    { tipo: 'pendiente', id: 'hidratacion', titulo: 'Hidratación' }
  );
});

test('después del último paso, el recorrido termina', () => {
  assert.deepEqual(siguientePaso('sellador', con('sellador')), { tipo: 'fin' });
});
