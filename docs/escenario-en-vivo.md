# Escenario para agregar en vivo

Momento 3 del guion: con el rubor ya implementado (todas sus tareas marcadas), agrega este escenario a la spec del cambio y deja que el spec gate ponga a Codex a trabajar.

Archivo: `openspec/changes/agregar-paso-rubor/specs/paso-rubor/spec.md`

Pégalo al final, debajo del escenario "Rubor en el color sugerido" del requisito "Aplicar el rubor en el avatar":

```markdown
#### Scenario: Rubor más pigmentado en piel oscura
- **WHEN** el tono de piel es oscuro o profundo
- **THEN** el avatar aplica el rubor con una intensidad de 0.7 en lugar de 0.55, para que se note sobre la piel
```

Después escribe en Codex algo que no pida nada, por ejemplo `Gracias, eso es todo.`

Qué pasa:

1. Codex responde y va a terminar el turno.
2. El hook `Stop` corre el spec gate: el cambio dice estar listo, pero el escenario nuevo no tiene un test con su nombre.
3. El spec gate responde `decision: block` con el motivo, y Codex sigue trabajando solo: escribe `test('Rubor más pigmentado en piel oscura', …)` y ajusta `src/pasos/rubor.js`.
4. En el panel del registro aparece primero `✗ turno: lo devuelvo a trabajar` y luego `✓ turno: todo cumple la spec`.

Para verlo en el avatar: http://localhost:3000/vista-previa.html, tono profundo, rubor.
