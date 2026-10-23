// Mide cuánto tarda Codex en implementar los cambios abiertos de OpenSpec,
// de tres formas, cada una en copias limpias del repo (git worktree):
//
//   secuencial  uno por uno: un `codex exec` por cambio, uno después de otro
//   paralelo    los tres a la vez: un `codex exec` por cambio, al mismo tiempo
//   equipo      un solo `codex exec "$equipo"`: Codex reparte el trabajo a sus subagentes
//
// De cada forma guarda el tiempo, los tokens que reporta Codex, si las pruebas
// quedan en verde y cuántos escenarios de la spec quedan con prueba.
//
// Uso:
//   npm run medir
//   npm run medir -- --modos=secuencial,paralelo --base=respaldo-propuestas
//
// Opciones:
//   --base=<ref>       de qué commit parten las copias (por omisión, HEAD)
//   --modos=<lista>    secuencial, paralelo, equipo (por omisión, los tres)
//   --carpeta=<ruta>   dónde crear las copias (por omisión, ../tocador-medicion-<fecha>)
//
// Antes de medir: abre Codex una vez en este repo, confía en el proyecto y
// revisa los hooks con /hooks. Las copias (worktrees) heredan esa confianza.

import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { revisarTrazabilidad } from './trazabilidad.js';

const MODOS = {
  secuencial: 'Uno por uno',
  paralelo: 'Los tres a la vez',
  equipo: 'El equipo ($equipo)'
};

const opcion = (nombre, porOmision) => {
  const arg = process.argv.slice(2).find((a) => a.startsWith(`--${nombre}=`));
  return arg ? arg.slice(nombre.length + 3) : porOmision;
};

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr.trim()}`);
  return r.stdout.trim();
}

const raiz = git(['rev-parse', '--show-toplevel'], process.cwd());
const base = git(['rev-parse', opcion('base', 'HEAD')], raiz);
const modos = opcion('modos', 'secuencial,paralelo,equipo').split(',').filter((m) => m in MODOS);
const fecha = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
const carpeta = resolve(opcion('carpeta', join(dirname(raiz), `${basename(raiz)}-medicion-${fecha}`)));

// Cambios abiertos en la base, con tareas pendientes.
function cambiosAbiertos() {
  const lista = git(['ls-tree', '-d', '--name-only', `${base}:openspec/changes`], raiz).split('\n').filter((c) => c && c !== 'archive');
  return lista.filter((c) => {
    const r = spawnSync('git', ['show', `${base}:openspec/changes/${c}/tasks.md`], { cwd: raiz, encoding: 'utf8' });
    return r.status === 0 && /^\s*- \[ \]/m.test(r.stdout);
  });
}

const promptCambio = (cambio) =>
  `Implementa el cambio de OpenSpec ${cambio} con la skill $openspec-apply-change. ` +
  'Marca cada tarea en tasks.md, escribe un test por escenario con exactamente el nombre del escenario ' +
  'y deja npm test en verde. No archives el cambio ni hagas commits.';

const PROMPT_EQUIPO = '$equipo Implementa los cambios abiertos de OpenSpec con el equipo.';

function copia(nombre) {
  const ruta = join(carpeta, nombre);
  git(['worktree', 'add', '--detach', ruta, base], raiz);
  return ruta;
}

// Corre `codex exec --json` y suma los tokens de cada turno.
function codex(cwd, prompt, registro) {
  return new Promise((resolver) => {
    const inicio = Date.now();
    const log = createWriteStream(registro);
    const proceso = spawn('codex', ['exec', '--json', '--sandbox', 'workspace-write', prompt], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    const tokens = { entrada: 0, cache: 0, salida: 0 };
    let resto = '';
    proceso.stdout.on('data', (trozo) => {
      log.write(trozo);
      const lineas = (resto + trozo).split('\n');
      resto = lineas.pop();
      for (const linea of lineas) {
        try {
          const evento = JSON.parse(linea);
          if (evento.type === 'turn.completed' && evento.usage) {
            tokens.entrada += evento.usage.input_tokens ?? 0;
            tokens.cache += evento.usage.cached_input_tokens ?? 0;
            tokens.salida += evento.usage.output_tokens ?? 0;
          }
        } catch {}
      }
    });
    proceso.stderr.on('data', (trozo) => log.write(trozo));
    proceso.on('error', (error) => {
      log.end();
      resolver({ segundos: 0, tokens, ok: false, error: error.code === 'ENOENT' ? 'no encuentro el comando codex' : error.message });
    });
    proceso.on('close', (codigo) => {
      log.end();
      resolver({ segundos: (Date.now() - inicio) / 1000, tokens, ok: codigo === 0 });
    });
  });
}

function calidad(cwd, cambios) {
  const pruebas = spawnSync(process.execPath, ['--test'], { cwd, encoding: 'utf8' });
  const escenarios = revisarTrazabilidad(cwd)
    .filter((c) => cambios.includes(c.cambio))
    .flatMap((c) => c.capacidades.flatMap((cap) => cap.escenarios));
  return {
    pruebasEnVerde: pruebas.status === 0,
    escenariosConPrueba: escenarios.filter((e) => e.test).length,
    escenarios: escenarios.length
  };
}

const reloj = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const miles = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));
const sumarTokens = (lista) => lista.reduce((t, r) => ({
  entrada: t.entrada + r.tokens.entrada, cache: t.cache + r.tokens.cache, salida: t.salida + r.tokens.salida
}), { entrada: 0, cache: 0, salida: 0 });

async function medir(modo, cambios) {
  const logs = join(carpeta, 'registros');
  mkdirSync(logs, { recursive: true });
  const inicio = Date.now();
  let corridas = [];
  let calidades = [];

  if (modo === 'secuencial') {
    const ruta = copia('secuencial');
    for (const cambio of cambios) {
      process.stdout.write(`  · ${cambio}… `);
      const r = await codex(ruta, promptCambio(cambio), join(logs, `secuencial-${cambio}.jsonl`));
      console.log(r.ok ? reloj(r.segundos) : `falló (${r.error ?? 'ver registro'})`);
      corridas.push({ cambio, ...r });
    }
    calidades = [calidad(ruta, cambios)];
  }

  if (modo === 'paralelo') {
    const rutas = Object.fromEntries(cambios.map((c) => [c, copia(`paralelo-${c}`)]));
    console.log(`  · ${cambios.length} codex exec al mismo tiempo…`);
    corridas = await Promise.all(cambios.map(async (cambio) => {
      const r = await codex(rutas[cambio], promptCambio(cambio), join(logs, `paralelo-${cambio}.jsonl`));
      console.log(`  · ${cambio}: ${r.ok ? reloj(r.segundos) : `falló (${r.error ?? 'ver registro'})`}`);
      return { cambio, ...r };
    }));
    calidades = cambios.map((c) => calidad(rutas[c], [c]));
  }

  if (modo === 'equipo') {
    const ruta = copia('equipo');
    process.stdout.write('  · $equipo… ');
    const r = await codex(ruta, PROMPT_EQUIPO, join(logs, 'equipo.jsonl'));
    console.log(r.ok ? reloj(r.segundos) : `falló (${r.error ?? 'ver registro'})`);
    corridas = [{ cambio: 'todos', ...r }];
    calidades = [calidad(ruta, cambios)];
  }

  return {
    modo,
    nombre: MODOS[modo],
    segundos: (Date.now() - inicio) / 1000,
    corridas,
    tokens: sumarTokens(corridas),
    pruebasEnVerde: calidades.every((c) => c.pruebasEnVerde),
    escenariosConPrueba: calidades.reduce((n, c) => n + c.escenariosConPrueba, 0),
    escenarios: calidades.reduce((n, c) => n + c.escenarios, 0)
  };
}

function tabla(resultados) {
  const filas = [
    '| Forma | Tiempo | Pruebas | Escenarios con prueba | Tokens (entrada / salida) |',
    '|---|---|---|---|---|'
  ];
  for (const r of resultados) {
    filas.push(`| ${r.nombre} | ${reloj(r.segundos)} | ${r.pruebasEnVerde ? 'en verde' : 'en rojo'} | ${r.escenariosConPrueba}/${r.escenarios} | ${miles(r.tokens.entrada)} / ${miles(r.tokens.salida)} |`);
    if (r.modo !== 'equipo') {
      for (const c of r.corridas) filas.push(`| · ${c.cambio} | ${reloj(c.segundos)} | | | ${miles(c.tokens.entrada)} / ${miles(c.tokens.salida)} |`);
    }
  }
  return filas.join('\n');
}

async function main() {
  if (spawnSync('codex', ['--version']).error) {
    console.error('No encuentro el comando codex. Instálalo con: npm i -g @openai/codex');
    process.exit(1);
  }
  const cambios = cambiosAbiertos();
  if (cambios.length === 0) {
    console.error(`No hay cambios abiertos con tareas pendientes en ${opcion('base', 'HEAD')}.`);
    process.exit(1);
  }
  mkdirSync(carpeta, { recursive: true });
  console.log(`Base: ${opcion('base', 'HEAD')} (${base.slice(0, 7)})`);
  console.log(`Cambios: ${cambios.join(', ')}`);
  console.log(`Copias en: ${carpeta}\n`);

  const resultados = [];
  for (const modo of modos) {
    console.log(`▶ ${MODOS[modo]}`);
    resultados.push(await medir(modo, cambios));
    console.log(`  total: ${reloj(resultados.at(-1).segundos)}\n`);
  }

  const md = [
    `# Tiempos de Codex: ${cambios.length} cambios de OpenSpec`,
    '',
    `Base \`${base.slice(0, 7)}\` · ${new Date().toLocaleString('es')}`,
    '',
    tabla(resultados),
    '',
    'Tokens: los que reporta `codex exec --json` en sus eventos `turn.completed`.'
  ].join('\n');
  writeFileSync(join(carpeta, 'resultados.json'), JSON.stringify({ base, cambios, resultados }, null, 2));
  writeFileSync(join(carpeta, 'resultados.md'), `${md}\n`);

  console.log(tabla(resultados));
  console.log(`\nGuardado en ${join(carpeta, 'resultados.md')} y resultados.json`);
  console.log('Para ver una copia: cd <copia> && npm start');
  console.log(`Para borrar las copias: git worktree list, y git worktree remove --force <copia> por cada una dentro de ${carpeta}`);
}

main();
