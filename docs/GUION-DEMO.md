# Guion de la demo (unos 14 minutos)

**Ejercicio:** sumar tres pasos a la rutina (hidratación, rubor y labial) con OpenSpec y un equipo de agentes de Codex.

Lo que se muestra de Codex, y que poca gente conoce:

1. **Un prompt, un equipo.** Subagentes propios versionados en el repo (`.codex/agents/`). Una skill del proyecto (`$equipo`) reparte un cambio de OpenSpec a cada implementador en paralelo y después a un revisor que no edita.
2. **Spec gate.** Hooks de Codex (`.codex/hooks.json`). Ningún agente puede dar por terminado un cambio si un escenario de la spec no tiene su prueba o si hay tests en rojo: el hook lo devuelve a trabajar con el motivo.
3. **Auditoría.** `codex exec --output-schema` audita sin interfaz cada escenario y responde un JSON. Lo mismo corre en cada PR con `openai/codex-action`.

En los bloques de Codex:
- Lo que empieza con `$openspec-` es una skill de OpenSpec.
- `$equipo` es la skill de este repo.
- Lo que empieza con `/` es un comando de Codex.

## Antes de la charla

- [ ] `npm test` en verde y `npm start` funcionando en http://localhost:3000.
- [ ] `openspec --version` responde y Codex tiene la sesión iniciada (`codex login`).
- [ ] Abre Codex en el repo y confía en el proyecto: así carga `.codex/` (subagentes, hooks y configuración). Los worktrees del repo heredan esa confianza.
- [ ] En Codex, `/hooks`: revisa y confía en los dos hooks del spec gate. Codex confía por hash, así que si cambias `.codex/hooks.json` hay que volver a confiar.
- [ ] Pregunta en Codex "¿qué subagentes tienes disponibles?" y comprueba que aparezcan `implementador` y `revisor_spec`.
- [ ] **Mide los tiempos** desde la rama con los tres cambios propuestos:
  - Corre `git checkout respaldo-propuestas && npm run medir`.
  - Son 7 sesiones de Codex: 3 uno por uno, 3 en paralelo y 1 del equipo.
  - Pasa la tabla de `resultados.md` a la diapositiva de tiempos.
- [ ] **Guarda una auditoría:** `git checkout respaldo-equipo && npm run auditar`. Te sirve de respaldo y para la diapositiva.
- [ ] Opcional, para mostrar la auditoría en un PR:
  - Sube el repo y agrega el secreto `OPENAI_API_KEY` en GitHub.
  - Abre un PR desde `respaldo-equipo`. El workflow `.github/workflows/auditoria-spec.yml` comenta el resultado.
- [ ] Pantalla con dos paneles: Codex, grande, y una terminal con el registro del spec gate:
  `tail -f "$(git rev-parse --git-common-dir)/spec-gate.log"`
- [ ] Ensaya en una copia para no ensuciar `main`, y bórrala al terminar:
  - Crea la copia con `git worktree add --detach ../ensayo main`.
  - Bórrala con `git worktree remove --force ../ensayo`.
- [ ] Ensaya la demo completa al menos 3 veces y graba una corrida como respaldo.

## 0. Antes: la app, la spec y el equipo (1 min)

`npm start`, elige un tono, haz la limpieza y pulsa "Ya terminé". Once pasos siguen "próximamente".

```bash
openspec list --specs     # tutorial y paso-limpieza
openspec list             # agregar-paso-labial 0/4 y agregar-paso-rubor 0/4
npm run trazabilidad      # 0/12 escenarios con prueba
ls .codex/agents          # implementador.toml  revisor-spec.toml
```

Qué decir: "La spec, el equipo y sus reglas viven en el repo. Quien clona el repo, clona también el equipo."

## 1. Proponer la hidratación (2 min)

En Codex:

```
$openspec-propose agregar-paso-hidratacion: seca, sérum y luego crema nutritiva; grasa, gel o crema ligera sin aceites; mixta, crema ligera y un poco más en las mejillas; normal, crema humectante ligera. En el avatar, brillo de piel hidratada más intenso en piel seca y más sutil en piel grasa.
/diff
```

En la terminal:

```bash
openspec validate agregar-paso-hidratacion --strict
git add -A && git commit -m "Proponer el paso de hidratación"
```

Si sobra tiempo, antes de proponer explora con `$openspec-explore` para mostrar las preguntas que hace: piel mixta, qué se ve en el avatar, cuánto esperar antes del primer.

## 2. Un prompt, un equipo (5 min)

En Codex, una sola línea:

```
$equipo
```

Qué pasa, para narrarlo:

1. Codex corre `openspec list --json` y encuentra los tres cambios con tareas pendientes.
2. Lanza tres `implementador` en paralelo, uno por cambio. Puedes abrir el hilo de cada subagente desde la actividad del hilo principal.
3. Cuando un implementador intenta terminar, corre el hook `SubagentStop`. Si le faltan tareas, pruebas por escenario o tiene tests en rojo, el registro muestra `✗ implementador (…): lo devuelvo a trabajar`.
4. Después lanza tres `revisor_spec` en paralelo. Cada uno revisa su cambio escenario por escenario, sin editar.
5. Cierra con una tabla y "Listos para archivar: …". No archiva: eso lo decides tú.

Mientras tanto, en la terminal:

```bash
npm run trazabilidad      # los escenarios pasan de ✗ a ✓
```

Qué decir:
- "No abrí tres terminales: definí un equipo."
- "Cada implementador toca solo su paso. Pueden trabajar a la vez porque cada cambio de OpenSpec es un archivo y una capacidad."
- "Nadie se califica a sí mismo: el revisor no edita y el spec gate no le cree a nadie que diga 'listo'."

## 3. La spec manda (2 min)

Abre `openspec/changes/agregar-paso-rubor/specs/paso-rubor/spec.md`. Pega el escenario de [`escenario-en-vivo.md`](escenario-en-vivo.md) al final y guarda.

En Codex escribe algo que no pida nada:

```
Gracias, eso es todo.
```

Codex responde e intenta terminar. El hook `Stop` encuentra el escenario sin prueba y lo devuelve a trabajar. Codex escribe el test y ajusta el rubor sin que se lo pidas. En el registro aparece `✗` y luego `✓`.

Muéstralo en http://localhost:3000/vista-previa.html con tono profundo y rubor.

Qué decir: "No le pedí nada a Codex. Cambié la spec, y la spec lo puso a trabajar."

## 4. Auditoría (2 min)

```bash
npm run auditar -- agregar-paso-rubor
```

Es `codex exec --output-schema` sin interfaz. Codex revisa cada escenario y responde un JSON que sigue `.codex/auditoria/esquema.json`. El script lo muestra como tabla: escenario, si se cumple y la evidencia con archivo y línea.

Si preparaste el PR, muéstralo: el mismo prompt y el mismo esquema corren con `openai/codex-action` y dejan la tabla como comentario.

Qué decir: "La misma spec que guió a los agentes ahora es el criterio de aceptación en CI."

## 5. Después: archivar y ver (2 min)

En Codex:

```
$openspec-archive-change agregar-paso-hidratacion
$openspec-archive-change agregar-paso-rubor
$openspec-archive-change agregar-paso-labial
```

Si el tiempo apremia, archiva desde la terminal con `openspec archive <cambio> -y`.

```bash
openspec list --specs          # 5 capacidades
ls openspec/changes/archive    # el historial con fecha
npm start
```

En el navegador: limpieza → hidratación → rubor → labial, con un tono claro y uno profundo para que cambien los colores. Cierra con la diapositiva de tiempos.

Qué decir: "Lo que acordamos antes de escribir código es exactamente lo que quedó documentado, probado y auditado después."

## Plan B

Si algo falla o el modelo tarda demasiado:

| Rama | Qué tiene | Sigue en |
|---|---|---|
| `respaldo-propuestas` | Los tres cambios propuestos | Momento 2 |
| `respaldo-equipo` | Los tres implementados, con tareas marcadas y sin archivar | Momentos 3 y 4 |
| `respaldo-final` | Los tres archivados | Momento 5 |

## Medir los tiempos

```bash
git checkout respaldo-propuestas
npm run medir                           # las tres formas
npm run medir -- --modos=paralelo       # solo una
```

Cada forma corre en copias limpias del repo, en `../tocador-medicion-<fecha>/`. Al final imprime la tabla y la guarda en `resultados.md` y `resultados.json`. Cada fila trae:
- El tiempo.
- Los tokens que reporta `codex exec --json`.
- Si `npm test` quedó en verde.
- Cuántos escenarios quedaron con prueba.

En el modo equipo, revisa en tu panel de uso si los tokens de los subagentes se suman a los del hilo principal.

Para borrar las copias al terminar:
- Lístalas con `git worktree list`.
- Borra cada una con `git worktree remove --force <ruta>`.
