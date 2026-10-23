# Tocador

Tutorial de maquillaje en vivo: eliges el tono de tu rostro y tu tipo de piel, y un avatar en un espejo con luces te guía paso a paso, con consejos adaptados a tu piel y animaciones de cada paso.

Es el proyecto de demostración de la charla **Spec-Driven Development con Codex**: la app tiene solo el primer paso (limpieza) y el resto de la rutina se construye con OpenSpec y Codex.

## Arrancar

Requiere Node.js 20.19 o superior. No tiene dependencias.

```bash
npm test               # tests de la lógica
npm start              # http://localhost:3000
npm run trazabilidad   # qué escenarios de la spec tienen su prueba
```

## Qué hay hoy

- **Inicio:** elegir el tono del rostro y el tipo de piel; el avatar cambia de tono al instante.
- **Paso 1, limpieza:** el avatar explica cómo limpiar el rostro, recomienda un limpiador según el tipo de piel y muestra espuma, flechas de movimiento circular y el enjuague.
- **Recorrido:** los doce pasos de la rutina; los que todavía no existen aparecen como "próximamente".
- **Avatar listo para maquillar:** cada paso tiene su señalización (dónde aplicar y hacia dónde difuminar) y la animación de brocha que difumina el producto.

## Vista previa del maquillaje

Con `npm start`, abre http://localhost:3000/vista-previa.html para ver cómo se aplica y se difumina cada producto (base, bronceador, iluminador, rubor, cejas, sombra, pestañas y labial) en cualquier tono de piel.

## Cómo crece

Cada paso de la rutina es un archivo en `src/pasos/` y una capacidad propia en `openspec/specs/`. Por eso cada paso nuevo puede proponerse e implementarse en paralelo con los demás, sin que choquen. Los detalles para agregar un paso están en [`AGENTS.md`](AGENTS.md).

## OpenSpec para Codex

El repo ya tiene OpenSpec inicializado para Codex, en español (`openspec init --tools codex --language es`). Los skills quedan en `.agents/skills/` y se invocan con `$`:

| Paso      | En Codex                    |
|-----------|-----------------------------|
| Explorar  | `$openspec-explore`         |
| Proponer  | `$openspec-propose`         |
| Aplicar   | `$openspec-apply-change`    |
| Archivar  | `$openspec-archive-change`  |

La spec viva está en `openspec/specs/tutorial/` y `openspec/specs/paso-limpieza/`.

## Codex: el equipo, el guardián y el juez

| Qué | Dónde | Para qué |
|---|---|---|
| Subagentes | `.codex/agents/implementador.toml`, `.codex/agents/revisor-spec.toml` | Un implementador por cambio de OpenSpec y un revisor que no edita |
| Skill `$equipo` | `.agents/skills/equipo/SKILL.md` | Con una línea, reparte los cambios abiertos al equipo, en paralelo |
| Guardián de la spec | `.codex/hooks.json`, `.codex/hooks/guardian.js` | Hooks `SubagentStop` y `Stop`: nadie termina si un escenario no tiene prueba o hay tests en rojo |
| Trazabilidad | `scripts/trazabilidad.js` (`npm run trazabilidad`) | Cada escenario de la spec ↔ un test con el mismo nombre |
| Auditoría | `.codex/auditoria/`, `scripts/auditar.js` (`npm run auditar`) | `codex exec --output-schema`: un JSON con cada escenario, si se cumple y la evidencia |
| Auditoría en cada PR | `.github/workflows/auditoria-spec.yml` | La misma auditoría con `openai/codex-action`, comentada en el PR |
| Medición | `scripts/medir-tiempos.js` (`npm run medir`) | Uno por uno, los tres a la vez o el equipo: tiempo, tokens y calidad |

Codex carga `.codex/` solo si confías en el proyecto, y los hooks solo después de revisarlos con `/hooks`.

## La demo

Los pasos de rubor y labial ya están propuestos en `openspec/changes/`. El guion completo está en [`docs/GUION-DEMO.md`](docs/GUION-DEMO.md): la hidratación se propone en vivo, el equipo implementa los tres cambios, la spec cambia en vivo y Codex la audita.

Ramas de respaldo:

- `respaldo-propuestas`: los tres cambios propuestos (hidratación, rubor y labial).
- `respaldo-equipo`: los tres implementados, con todas sus tareas marcadas, sin archivar.
- `respaldo-final`: los tres archivados en la spec viva.
