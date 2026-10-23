// Spec gate: hook de Codex (ver .codex/hooks.json).
//
// - SubagentStop (implementador): antes de que un implementador termine, revisa
//   SU cambio: tareas marcadas, un test por escenario y sus tests en verde.
// - Stop (cada turno): un cambio que dice estar listo debe tener un test por
//   escenario, npm test debe pasar y OpenSpec debe validar.
//
// Si algo falla responde {"decision":"block","reason":"…"}: Codex no termina,
// sigue trabajando con ese motivo como instrucción. Después de 3 intentos
// seguidos lo deja terminar para no quedar en un ciclo.
//
// Cada decisión queda en .git/spec-gate.log (fuera del repo versionado):
//   tail -f "$(git rev-parse --git-common-dir)/spec-gate.log"

import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { revisarTrazabilidad, problemas } from '../../scripts/trazabilidad.js';

const MAX_INTENTOS = 3;

function leerEntrada() {
  try {
    const texto = readFileSync(0, 'utf8');
    return texto.trim() ? JSON.parse(texto) : {};
  } catch {
    return {};
  }
}

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

// Nombres de los tests que fallaron, a partir de la salida TAP de node --test.
function correrTests(raiz, archivos = [], filtro) {
  const args = ['--test', '--test-reporter=tap'];
  if (filtro) args.push(`--test-name-pattern=${filtro}`);
  const r = spawnSync(process.execPath, [...args, ...archivos], { cwd: raiz, encoding: 'utf8' });
  if (r.status === 0) return [];
  const fallos = [...new Set([...(r.stdout ?? '').matchAll(/^\s*not ok \d+ - (.+)$/gm)].map((m) => m[1].trim()))]
    .filter((nombre) => !nombre.endsWith('.test.js'));
  return fallos.length > 0 ? fallos : ['las pruebas no terminaron bien (corre npm test para ver el detalle)'];
}

function validarOpenSpec(raiz) {
  const r = spawnSync('openspec', ['validate', '--all', '--strict', '--json', '--no-interactive'], { cwd: raiz, encoding: 'utf8' });
  if (r.error) return []; // OpenSpec no está instalado: no se valida.
  try {
    const { items } = JSON.parse(r.stdout);
    return items.filter((i) => !i.valid).map((i) => `OpenSpec: "${i.id}" no pasa la validación estricta (${i.issues.map((x) => x.message).join('; ')}).`);
  } catch {
    return r.status === 0 ? [] : ['OpenSpec: openspec validate --all --strict falla.'];
  }
}

function pasosDelCambio(resultado) {
  return resultado.flatMap((c) => c.capacidades).map((cap) => cap.capacidad.match(/^paso-(.+)$/)?.[1]).filter(Boolean);
}

export function revisarTurno(raiz) {
  const lista = problemas(revisarTrazabilidad(raiz));
  for (const nombre of correrTests(raiz)) lista.push(`npm test: falla "${nombre}".`);
  lista.push(...validarOpenSpec(raiz));
  return lista;
}

export function revisarImplementador(raiz, mensaje = '') {
  const cambio = [...mensaje.matchAll(/^\s*Cambio:\s*([a-z0-9][a-z0-9-]*)\s*$/gim)].pop()?.[1];
  if (!cambio) return { cambio: null, lista: ['Termina tu respuesta con la línea "Cambio: <id-del-cambio>" para que el spec gate revise tu cambio.'] };
  const resultado = revisarTrazabilidad(raiz, { cambio });
  const lista = problemas(resultado, { exigirTareas: true });
  for (const paso of pasosDelCambio(resultado)) {
    const archivo = join('test', `${paso}.test.js`);
    if (!existsSync(join(raiz, archivo))) continue; // ya lo reporta la trazabilidad
    for (const nombre of correrTests(raiz, [archivo])) lista.push(`${archivo}: falla "${nombre}".`);
    for (const nombre of correrTests(raiz, [join('test', 'contrato-pasos.test.js')], `"${paso}"`)) lista.push(`Contrato del paso: falla "${nombre}".`);
  }
  return { cambio, lista };
}

function contarIntento(clave, fallo) {
  const ruta = join(tmpdir(), `tocador-spec-gate-${clave.replace(/[^a-zA-Z0-9-]/g, '_')}.json`);
  if (!fallo) {
    rmSync(ruta, { force: true });
    return 0;
  }
  let intentos = 0;
  try { intentos = JSON.parse(readFileSync(ruta, 'utf8')).intentos ?? 0; } catch {}
  intentos += 1;
  writeFileSync(ruta, JSON.stringify({ intentos }));
  return intentos;
}

function registrar(raiz, linea) {
  const dirGit = git(['rev-parse', '--git-common-dir'], raiz);
  if (!dirGit) return;
  const hora = new Date().toLocaleTimeString('es', { hour12: false });
  try { appendFileSync(resolve(raiz, dirGit, 'spec-gate.log'), `${hora}  ${linea}\n`); } catch {}
}

const detalle = (lista) => lista.map((p) => `\n            · ${p}`).join('');

function main() {
  const entrada = leerEntrada();
  const evento = entrada.hook_event_name ?? 'Stop';
  const cwd = entrada.cwd ?? process.cwd();
  const raiz = git(['rev-parse', '--show-toplevel'], cwd) ?? cwd;

  let quien;
  let lista;
  if (evento === 'SubagentStop') {
    const revision = revisarImplementador(raiz, entrada.last_assistant_message ?? '');
    quien = `implementador${revision.cambio ? ` (${revision.cambio})` : ''}`;
    lista = revision.lista;
  } else {
    quien = 'turno';
    lista = revisarTurno(raiz);
  }

  const clave = `${entrada.session_id ?? 'sesion'}-${entrada.agent_id ?? 'principal'}`;
  const intentos = contarIntento(clave, lista.length > 0);

  if (lista.length === 0) {
    registrar(raiz, `✓ ${quien}: todo cumple la spec`);
    process.stdout.write('{}\n');
    return;
  }
  if (intentos > MAX_INTENTOS) {
    registrar(raiz, `! ${quien}: lo dejo terminar después de ${MAX_INTENTOS} intentos; queda pendiente:${detalle(lista)}`);
    contarIntento(clave, false);
    process.stdout.write('{}\n');
    return;
  }
  registrar(raiz, `✗ ${quien}: lo devuelvo a trabajar (intento ${intentos} de ${MAX_INTENTOS})${detalle(lista)}`);
  const reason = [
    'Spec gate: todavía no puedes terminar.',
    ...lista.map((p) => `- ${p}`),
    'Corrígelo (código y un test con el nombre exacto de cada escenario) y vuelve a verificar.'
  ].join('\n');
  process.stdout.write(`${JSON.stringify({ decision: 'block', reason })}\n`);
}

main();
