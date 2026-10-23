// Trazabilidad spec → pruebas.
//
// Para cada cambio abierto de OpenSpec (openspec/changes/<id>/) busca, escenario
// por escenario, un test con exactamente el mismo nombre:
//   #### Scenario: Piel mixta   →   test('Piel mixta', () => { ... })
//
// Uso:
//   npm run trazabilidad                 todos los cambios abiertos
//   npm run trazabilidad -- <cambio>     solo un cambio
//   npm run trazabilidad -- --json       resultado en JSON
//
// Termina con código 1 si un cambio con todas sus tareas marcadas tiene
// escenarios sin prueba: ese cambio dice estar listo y no lo está.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SECCIONES_CON_ESCENARIOS = new Set(['ADDED', 'MODIFIED']);

const normalizar = (texto) => texto.normalize('NFC').trim().toLowerCase();

// Escenarios de una delta spec, sin los de REMOVED ni RENAMED.
export function leerEscenarios(markdown) {
  const escenarios = [];
  let seccion = null;
  let requisito = null;
  for (const linea of markdown.split('\n')) {
    const encabezado = linea.match(/^##\s+(ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements/i);
    if (encabezado) {
      seccion = encabezado[1].toUpperCase();
      continue;
    }
    const req = linea.match(/^###\s+Requirement:\s*(.+)$/);
    if (req) {
      requisito = req[1].trim();
      continue;
    }
    const esc = linea.match(/^####\s+Scenario:\s*(.+)$/);
    if (esc && SECCIONES_CON_ESCENARIOS.has(seccion)) {
      escenarios.push({ requisito, nombre: esc[1].trim() });
    }
  }
  return escenarios;
}

// Nombres de los tests de un archivo: test('…') o it('…').
export function leerNombresDeTests(codigo) {
  const nombres = [];
  const patron = /\b(?:test|it)\s*\(\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  for (const [, , nombre] of codigo.matchAll(patron)) nombres.push(nombre);
  return nombres;
}

export function leerTareas(markdown) {
  const hechas = (markdown.match(/^\s*- \[x\]/gim) ?? []).length;
  const pendientes = (markdown.match(/^\s*- \[ \]/gm) ?? []).length;
  return { hechas, total: hechas + pendientes };
}

export function estadoDelCambio({ hechas, total }) {
  if (total > 0 && hechas === total) return 'listo';
  if (hechas > 0) return 'en curso';
  return 'propuesto';
}

// paso-rubor → test/rubor.test.js. Otras capacidades: cualquier test.
function archivosDeTest(raiz, capacidad) {
  const carpeta = join(raiz, 'test');
  const paso = capacidad.match(/^paso-(.+)$/)?.[1];
  if (paso) return [join('test', `${paso}.test.js`)];
  if (!existsSync(carpeta)) return [];
  return readdirSync(carpeta).filter((f) => f.endsWith('.test.js')).map((f) => join('test', f));
}

function listarCambios(raiz) {
  const carpeta = join(raiz, 'openspec', 'changes');
  if (!existsSync(carpeta)) return [];
  return readdirSync(carpeta, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'archive')
    .map((d) => d.name)
    .sort();
}

export function revisarTrazabilidad(raiz = process.cwd(), { cambio } = {}) {
  const cambios = cambio ? [cambio] : listarCambios(raiz);
  return cambios.map((id) => {
    const dir = join(raiz, 'openspec', 'changes', id);
    if (!existsSync(dir)) return { cambio: id, existe: false, estado: 'no existe', tareas: { hechas: 0, total: 0 }, capacidades: [] };
    const rutaTareas = join(dir, 'tasks.md');
    const tareas = existsSync(rutaTareas) ? leerTareas(readFileSync(rutaTareas, 'utf8')) : { hechas: 0, total: 0 };
    const dirSpecs = join(dir, 'specs');
    const capacidades = existsSync(dirSpecs)
      ? readdirSync(dirSpecs, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
      : [];
    return {
      cambio: id,
      existe: true,
      estado: estadoDelCambio(tareas),
      tareas,
      capacidades: capacidades.map((capacidad) => {
        const rutaSpec = join(dirSpecs, capacidad, 'spec.md');
        const escenarios = existsSync(rutaSpec) ? leerEscenarios(readFileSync(rutaSpec, 'utf8')) : [];
        const archivos = archivosDeTest(raiz, capacidad);
        const tests = new Map();
        for (const archivo of archivos) {
          const ruta = join(raiz, archivo);
          if (!existsSync(ruta)) continue;
          for (const nombre of leerNombresDeTests(readFileSync(ruta, 'utf8'))) {
            if (!tests.has(normalizar(nombre))) tests.set(normalizar(nombre), archivo);
          }
        }
        return {
          capacidad,
          archivos,
          escenarios: escenarios.map((e) => ({ ...e, test: tests.get(normalizar(e.nombre)) ?? null }))
        };
      })
    };
  });
}

// Lo que impide dar por terminado un cambio. Con `exigirTareas`, también las
// tareas pendientes (se usa cuando un agente dice haber terminado un cambio).
export function problemas(resultado, { soloListos = true, exigirTareas = false } = {}) {
  const lista = [];
  for (const c of resultado) {
    if (!c.existe) {
      lista.push(`El cambio "${c.cambio}" no existe en openspec/changes/.`);
      continue;
    }
    if (exigirTareas && c.tareas.hechas < c.tareas.total) {
      lista.push(`${c.cambio}: quedan ${c.tareas.total - c.tareas.hechas} tareas sin marcar en tasks.md.`);
    }
    if (soloListos && !exigirTareas && c.estado !== 'listo') continue;
    for (const cap of c.capacidades) {
      for (const e of cap.escenarios) {
        if (!e.test) {
          lista.push(`${c.cambio}: el escenario "${e.nombre}" (${cap.capacidad}) no tiene un test con ese nombre en ${cap.archivos.join(', ') || 'test/'}.`);
        }
      }
    }
  }
  return lista;
}

function imprimir(resultado) {
  const color = process.stdout.isTTY && !process.env.NO_COLOR;
  const pintar = (codigo, texto) => (color ? `\x1b[${codigo}m${texto}\x1b[0m` : texto);
  const verde = (t) => pintar('32', t);
  const rojo = (t) => pintar('31', t);
  const gris = (t) => pintar('90', t);
  const negrita = (t) => pintar('1', t);

  if (resultado.length === 0) {
    console.log('No hay cambios abiertos en openspec/changes/.');
    return;
  }
  let cubiertos = 0;
  let total = 0;
  console.log(negrita('Trazabilidad spec → pruebas'));
  for (const c of resultado) {
    console.log('');
    if (!c.existe) {
      console.log(rojo(`${c.cambio}: no existe`));
      continue;
    }
    console.log(`${negrita(c.cambio)} ${gris(`· ${c.estado} · tareas ${c.tareas.hechas}/${c.tareas.total}`)}`);
    for (const cap of c.capacidades) {
      console.log(`  ${cap.capacidad} ${gris(`→ ${cap.archivos.join(', ')}`)}`);
      for (const e of cap.escenarios) {
        total += 1;
        if (e.test) {
          cubiertos += 1;
          console.log(`    ${verde('✓')} ${e.nombre}`);
        } else {
          console.log(`    ${rojo('✗')} ${e.nombre} ${gris('← sin test con este nombre')}`);
        }
      }
    }
  }
  console.log('');
  console.log(negrita(`${cubiertos}/${total} escenarios con prueba`));
}

const esCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esCli) {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const cambio = args.find((a) => !a.startsWith('--'));
  const resultado = revisarTrazabilidad(process.cwd(), { cambio });
  if (json) console.log(JSON.stringify(resultado, null, 2));
  else imprimir(resultado);
  const pendientes = problemas(resultado);
  if (pendientes.length > 0) {
    if (!json) {
      console.log('');
      for (const p of pendientes) console.log(`✗ ${p}`);
    }
    process.exitCode = 1;
  }
}
