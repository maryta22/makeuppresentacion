# Tocador

Tutorial de maquillaje en vivo: eliges el tono de tu rostro y tu tipo de piel, y un avatar en un espejo con luces te guía paso a paso, con consejos adaptados a tu piel y animaciones de cada paso.

Es el proyecto de demostración de la charla **Spec-Driven Development con Codex**: cada paso de la rutina se construye con OpenSpec y un equipo de agentes de Codex.

## Arrancar

Requiere Node.js 20.19 o superior. No tiene dependencias.

```bash
npm test               # tests de la lógica
npm start              # http://localhost:3000
npm run trazabilidad   # qué escenarios de la spec tienen su prueba
```

## Qué hay hoy

- **Inicio:** elegir el tono del rostro y el tipo de piel; el avatar cambia de tono al instante.
- **Limpieza:** cómo limpiar el rostro, el limpiador según el tipo de piel, y espuma, flechas de movimiento circular y enjuague en el avatar.
- **Hidratación:** el producto según el tipo de piel y un brillo de piel hidratada en el avatar.
- **Rubor:** el color según el tono de piel y la fórmula según el tipo de piel, aplicado con la brocha.
- **Labial:** el color según el tono de piel, aplicado con la brocha.
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

La spec viva está en `openspec/specs/`: el tutorial y una capacidad por paso (`paso-limpieza`, `paso-hidratacion`, `paso-rubor`, `paso-labial`).

## Codex: el equipo, el spec gate y la auditoría

| Qué | Dónde | Para qué |
|---|---|---|
| Subagentes | `.codex/agents/implementador.toml`, `.codex/agents/revisor-spec.toml` | Un implementador por cambio de OpenSpec y un revisor que no edita |
| Skill `$equipo` | `.agents/skills/equipo/SKILL.md` | Con una línea, reparte los cambios abiertos al equipo, en paralelo |
| Spec gate | `.codex/hooks.json`, `.codex/hooks/spec-gate.js` | Hooks `SubagentStop` y `Stop`: nadie termina si un escenario no tiene prueba o hay tests en rojo |
| Trazabilidad | `scripts/trazabilidad.js` (`npm run trazabilidad`) | Cada escenario de la spec ↔ un test con el mismo nombre |
| Auditoría | `.codex/auditoria/`, `scripts/auditar.js` (`npm run auditar`) | `codex exec --output-schema`: un JSON con cada escenario, si se cumple y la evidencia |
| Auditoría en cada PR | `.github/workflows/auditoria-spec.yml` | La misma auditoría con `openai/codex-action`, comentada en el PR |
| Medición | `scripts/medir-tiempos.js` (`npm run medir`) | Uno por uno, los tres a la vez o el equipo: tiempo, tokens y calidad |

Codex carga `.codex/` solo si confías en el proyecto, y los hooks solo después de revisarlos con `/hooks`.

## La demo

Hay dos cambios pequeños ya propuestos en `openspec/changes/`, listos para que el equipo de Codex los implemente en vivo con `$equipo`:

- `agregar-rubor-ciruela`: el tono de piel profundo pasa de rubor frambuesa a ciruela. Modifica la spec del rubor (`MODIFIED`).
- `agregar-protector-solar`: la hidratación termina recordando el protector solar. Agrega un requisito a la spec de la hidratación (`ADDED`).

Cada uno toca un archivo distinto, así que se implementan a la vez sin chocar. El guion está en [`docs/GUION-DEMO.md`](docs/GUION-DEMO.md).

Rama de respaldo: `respaldo` tiene los dos cambios ya implementados, con sus tareas marcadas y sin archivar.
