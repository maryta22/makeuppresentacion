// Auditoría de la spec con Codex, sin interfaz (codex exec --output-schema).
//
// Codex revisa cada escenario de los cambios abiertos contra los tests y el
// código, y responde con un JSON que sigue .codex/auditoria/esquema.json.
// El mismo prompt y el mismo esquema corren en GitHub Actions
// (.github/workflows/auditoria-spec.yml) y comentan el resultado en el PR.
//
// Uso:
//   npm run auditar                         todos los cambios abiertos
//   npm run auditar -- agregar-paso-rubor   solo un cambio
//   npm run auditar -- --desde archivo.json muestra un resultado ya guardado
//   agrega --markdown para obtener la tabla en Markdown

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ESQUEMA = join(RAIZ, '.codex', 'auditoria', 'esquema.json');
const PROMPT = join(RAIZ, '.codex', 'auditoria', 'prompt.md');
const SALIDA = join(RAIZ, '.codex', 'auditoria', 'ultima.json');

export function aMarkdown({ cambios, resumen }) {
  const partes = ['## Auditoría de la spec (Codex)', ''];
  for (const c of cambios) {
    const cumplen = c.escenarios.filter((e) => e.cumple).length;
    const icono = c.veredicto === 'aprobado' ? '✅' : '❌';
    partes.push(`### ${icono} \`${c.cambio}\` · ${cumplen}/${c.escenarios.length} escenarios`, '');
    partes.push('| | Escenario | Test | Evidencia |', '|---|---|---|---|');
    for (const e of c.escenarios) {
      partes.push(`| ${e.cumple ? '✅' : '❌'} | ${e.escenario} | ${e.test ? `\`${e.test}\`` : '—'} | ${e.evidencia.replaceAll('|', '\\|')} |`);
    }
    partes.push('');
  }
  partes.push(`**Resumen:** ${resumen}`);
  return partes.join('\n');
}

export function aTexto({ cambios, resumen }) {
  const color = process.stdout.isTTY && !process.env.NO_COLOR;
  const pintar = (codigo, texto) => (color ? `\x1b[${codigo}m${texto}\x1b[0m` : texto);
  const lineas = [pintar('1', 'Auditoría de la spec (codex exec --output-schema)')];
  for (const c of cambios) {
    const cumplen = c.escenarios.filter((e) => e.cumple).length;
    const veredicto = c.veredicto === 'aprobado' ? pintar('32', '✓ aprobado') : pintar('31', '✗ cambios');
    lineas.push('', `${pintar('1', c.cambio)} · ${veredicto} · ${cumplen}/${c.escenarios.length} escenarios`);
    const ancho = Math.max(...c.escenarios.map((e) => e.escenario.length));
    for (const e of c.escenarios) {
      const marca = e.cumple ? pintar('32', '✓') : pintar('31', '✗');
      lineas.push(`  ${marca} ${e.escenario.padEnd(ancho)}  ${pintar('90', e.evidencia)}`);
    }
  }
  lineas.push('', `Resumen: ${resumen}`);
  return lineas.join('\n');
}

function auditar(cambio) {
  let prompt = readFileSync(PROMPT, 'utf8');
  if (cambio) prompt += `\nAudita solo el cambio \`${cambio}\`.\n`;
  mkdirSync(dirname(SALIDA), { recursive: true });
  const inicio = Date.now();
  const r = spawnSync('codex', ['exec', '--sandbox', 'read-only', '--output-schema', ESQUEMA, '-o', SALIDA, prompt], {
    cwd: RAIZ,
    stdio: ['ignore', 'ignore', 'inherit']
  });
  if (r.error?.code === 'ENOENT') {
    console.error('No encuentro el comando codex. Instálalo con: npm i -g @openai/codex');
    process.exit(1);
  }
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.error(`\nCodex tardó ${Math.round((Date.now() - inicio) / 1000)} s. Resultado guardado en ${SALIDA}\n`);
  return JSON.parse(readFileSync(SALIDA, 'utf8'));
}

const esCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esCli) {
  const args = process.argv.slice(2);
  const desde = args.includes('--desde') ? args[args.indexOf('--desde') + 1] : null;
  const cambio = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--desde');
  const resultado = desde ? JSON.parse(readFileSync(desde, 'utf8')) : auditar(cambio);
  console.log(args.includes('--markdown') ? aMarkdown(resultado) : aTexto(resultado));
  if (resultado.cambios.some((c) => c.veredicto !== 'aprobado')) process.exitCode = 1;
}
