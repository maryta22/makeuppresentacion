import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { leerEscenarios, leerNombresDeTests, revisarTrazabilidad, problemas } from '../scripts/trazabilidad.js';

// Arma el código de un test sin escribir la llamada literal en este archivo,
// para que la trazabilidad del proyecto no cuente estos ejemplos como pruebas.
const llamada = (nombre) => ['te', 'st'].join('') + `('${nombre}', () => {});\n`;

const SPEC = `# Delta

## ADDED Requirements

### Requirement: Guiar el paso
El sistema SHALL guiar el paso.

#### Scenario: Piel seca
- **WHEN** el tipo de piel es seca
- **THEN** recomienda algo

#### Scenario: Piel grasa
- **WHEN** el tipo de piel es grasa
- **THEN** recomienda otra cosa

## REMOVED Requirements

### Requirement: Algo viejo
#### Scenario: Ya no aplica
`;

function proyecto({ tareas, tests }) {
  const raiz = mkdtempSync(join(tmpdir(), 'trazabilidad-'));
  const cambio = join(raiz, 'openspec', 'changes', 'agregar-paso-demo');
  mkdirSync(join(cambio, 'specs', 'paso-demo'), { recursive: true });
  mkdirSync(join(raiz, 'openspec', 'changes', 'archive', 'viejo'), { recursive: true });
  mkdirSync(join(raiz, 'test'));
  writeFileSync(join(cambio, 'specs', 'paso-demo', 'spec.md'), SPEC);
  writeFileSync(join(cambio, 'tasks.md'), tareas);
  writeFileSync(join(raiz, 'test', 'demo.test.js'), tests.map(llamada).join(''));
  return raiz;
}

test('lee los escenarios agregados o modificados, no los eliminados', () => {
  assert.deepEqual(leerEscenarios(SPEC), [
    { requisito: 'Guiar el paso', nombre: 'Piel seca' },
    { requisito: 'Guiar el paso', nombre: 'Piel grasa' }
  ]);
});

test('lee los nombres de los tests', () => {
  assert.deepEqual(leerNombresDeTests(llamada('Piel seca') + llamada('Piel grasa')), ['Piel seca', 'Piel grasa']);
});

test('relaciona cada escenario con el test del mismo nombre en el archivo del paso', () => {
  const raiz = proyecto({ tareas: '- [x] 1.1 Hecho\n- [ ] 1.2 Pendiente\n', tests: ['Piel seca'] });
  try {
    const [cambio] = revisarTrazabilidad(raiz);
    assert.equal(cambio.cambio, 'agregar-paso-demo');
    assert.equal(cambio.estado, 'en curso');
    assert.deepEqual(cambio.tareas, { hechas: 1, total: 2 });
    const [cap] = cambio.capacidades;
    assert.deepEqual(cap.archivos, [join('test', 'demo.test.js')]);
    assert.deepEqual(cap.escenarios.map((e) => [e.nombre, e.test]), [
      ['Piel seca', join('test', 'demo.test.js')],
      ['Piel grasa', null]
    ]);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

test('un cambio con todas las tareas marcadas y un escenario sin test tiene problemas', () => {
  const raiz = proyecto({ tareas: '- [x] 1.1 Hecho\n', tests: ['Piel seca'] });
  try {
    const lista = problemas(revisarTrazabilidad(raiz));
    assert.equal(lista.length, 1);
    assert.match(lista[0], /"Piel grasa"/);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

test('un cambio recién propuesto todavía no exige pruebas', () => {
  const raiz = proyecto({ tareas: '- [ ] 1.1 Pendiente\n', tests: [] });
  try {
    assert.deepEqual(problemas(revisarTrazabilidad(raiz)), []);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

test('al exigir tareas, también avisa de las tareas sin marcar', () => {
  const raiz = proyecto({ tareas: '- [x] 1.1 Hecho\n- [ ] 1.2 Pendiente\n', tests: ['Piel seca', 'Piel grasa'] });
  try {
    const lista = problemas(revisarTrazabilidad(raiz), { exigirTareas: true });
    assert.deepEqual(lista, ['agregar-paso-demo: quedan 1 tareas sin marcar en tasks.md.']);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});
