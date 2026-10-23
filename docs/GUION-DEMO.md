# Guion de la demo (unos 10 minutos)

**Ejercicio:** dos cambios pequeños a pasos que ya existen. Están propuestos antes de la charla, y en vivo Codex los implementa con el equipo.

| Cambio | Qué hace | Delta |
|---|---|---|
| `agregar-rubor-ciruela` | El tono de piel profundo pasa de rubor frambuesa a ciruela | `MODIFIED` en `paso-rubor` |
| `agregar-protector-solar` | La hidratación termina recordando el protector solar FPS 30 o más | `ADDED` en `paso-hidratacion` |

Cada cambio toca un archivo distinto (`src/pasos/rubor.js` y `src/pasos/hidratacion.js`), así que el equipo los implementa a la vez sin chocar.

Cómo leer los bloques:
- `›` al inicio: se escribe dentro de Codex.
- `$ ` al inicio: se escribe en la terminal.

## Antes de la charla

- [ ] `npm test` en verde y `npm start` funcionando en http://localhost:3000.
- [ ] `openspec --version` responde y Codex tiene la sesión iniciada (`codex login`).
- [ ] Abre Codex en el repo y confía en el proyecto: así carga `.codex/` (subagentes, hooks y configuración).
- [ ] En Codex, `/hooks`: revisa y aprueba los dos hooks del spec gate.
- [ ] Pregunta en Codex "¿qué subagentes tienes disponibles?" y comprueba que aparezcan `implementador` y `revisor_spec`.
- [ ] Opcional: **mide los tiempos** en `main` con `npm run medir`.
  - Son 5 sesiones de Codex: 2 cambios uno por uno, 2 en paralelo y 1 del equipo.
  - Pasa la tabla de `resultados.md` a la diapositiva de tiempos.
- [ ] Opcional: **guarda una auditoría** con `git checkout respaldo && npm run auditar`, para tener la tabla aunque no la corras en vivo.
- [ ] Pantalla con dos paneles: Codex, grande, y una terminal con el registro del spec gate:
  `tail -f "$(git rev-parse --git-common-dir)/spec-gate.log"`
- [ ] Ensaya en una copia para no ensuciar `main`:
  - Créala con `git worktree add --detach ../ensayo main`.
  - Bórrala con `git worktree remove --force ../ensayo`.
- [ ] Ensaya la demo completa al menos 2 veces y graba una corrida como respaldo.

## 1. Antes (2 min)

`npm start`. Elige el tono **profundo** y piel **grasa** y avanza hasta la hidratación y el rubor:
- En la hidratación, los consejos no mencionan el protector solar.
- En el rubor, la sugerencia es frambuesa.

En la terminal:

```bash
$ openspec list --specs      # 5 capacidades vivas
$ openspec list              # agregar-protector-solar 0/3 · agregar-rubor-ciruela 0/3
$ npm run trazabilidad       # 3/6 escenarios con prueba
```

Muestra el delta del rubor: `openspec/changes/agregar-rubor-ciruela/specs/paso-rubor/spec.md`.

Qué decir:
- "Dos cambios chicos, escritos y revisados antes de la charla."
- "Uno modifica un requisito que ya existe, el otro agrega uno nuevo."
- "La trazabilidad marca justo lo que falta: los escenarios nuevos todavía no tienen prueba."

## 2. El equipo (5 min)

En Codex, una sola línea:

```
› $equipo
```

Qué pasa, para narrarlo:

1. Codex corre `openspec list --json` y encuentra los dos cambios.
2. Lanza dos `implementador` en paralelo, uno por cambio. Puedes abrir el hilo de cada uno desde la actividad del hilo principal.
3. Cuando cada implementador quiere terminar, el spec gate (hook `SubagentStop`) revisa su cambio. Si le falta algo, lo devuelve a trabajar, y en el panel del registro aparece `✗`. Cuando cumple, aparece `✓`.
4. Lanza dos `revisor_spec` en paralelo, que revisan escenario por escenario sin editar.
5. Cierra con una tabla y "Listos para archivar: …".

Mientras trabajan, en la terminal:

```bash
$ npm run trazabilidad       # los escenarios pasan de ✗ a ✓
```

Qué decir:
- "Escribí una línea; el equipo y sus reglas viven en el repo."
- "Cada implementador toca solo su archivo, por eso trabajan a la vez."
- "Nadie se califica a sí mismo: el revisor no edita y el spec gate no deja terminar a nadie con un escenario sin prueba."

## 3. Después (2 min)

```bash
$ npm run trazabilidad       # 6/6
$ npm test                   # todo en verde
```

`npm start` con el mismo perfil (profundo y grasa):
- La hidratación termina con "De día, termina con protector solar FPS 30 o más…", en gel o fluido de acabado mate.
- El rubor sugiere ciruela, y la brocha lo aplica en ese color.

Opcional, si hay tiempo: `npm run auditar`. Es `codex exec --output-schema`: Codex audita cada escenario sin interfaz y responde una tabla de cumple o no cumple, con evidencia.

## 4. Archivar (1 min)

```
› $openspec-archive-change agregar-rubor-ciruela
› $openspec-archive-change agregar-protector-solar
```

```bash
$ grep -A2 "profundo" openspec/specs/paso-rubor/spec.md   # la spec viva ya dice ciruela
$ ls openspec/changes/archive                             # los dos cambios, con fecha
```

Qué decir: "La spec viva ya cuenta cómo funciona la app hoy, y el porqué de cada cambio queda archivado."

## Plan B

Si algo falla o el modelo tarda demasiado:
- `git checkout respaldo` trae los dos cambios ya implementados, con las tareas marcadas y sin archivar.
- Desde ahí sigue en el momento 3.

## Medir los tiempos

```bash
$ npm run medir                        # las tres formas
$ npm run medir -- --modos=paralelo    # solo una
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
