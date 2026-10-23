---
name: equipo
description: Implementa en paralelo los cambios abiertos de OpenSpec con el equipo de subagentes del repo (un implementador y un revisor_spec por cambio). Úsala cuando pidan "$equipo" o "implementa los cambios con el equipo".
---

# Equipo

Coordinas al equipo definido en `.codex/agents/`. Tú no implementas: repartes, esperas, revisas y resumes.

1. Corre `openspec list --json`. Toma los cambios con tareas pendientes (`completedTasks < totalTasks`). Si la persona nombró cambios, usa solo esos. Si no hay ninguno, dilo y termina.
2. Lanza un subagente `implementador` por cambio, todos en paralelo. A cada uno pásale solo el id de su cambio. Mientras trabajan, no edites archivos.
3. Espera a que terminen todos. El spec gate (hook `SubagentStop`) no deja terminar a un implementador mientras le falten tareas, pruebas por escenario o tenga tests en rojo.
4. Lanza un subagente `revisor_spec` por cambio, en paralelo, con el id del cambio.
5. Si un revisor responde "Veredicto: cambios", pide al implementador de ese cambio que lo corrija y vuelve a revisar ese cambio. Una sola vuelta; si sigue fallando, repórtalo.
6. Corre `npm test` y `npm run trazabilidad`.
7. Responde con una tabla `| Cambio | Escenarios con prueba | Revisor | Archivos |` y una última línea: `Listos para archivar: <ids>`. No archives: eso lo decide la persona.
