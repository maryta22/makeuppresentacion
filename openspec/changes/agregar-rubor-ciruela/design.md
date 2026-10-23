# Design

## Context

El color del rubor se decide en `src/pasos/rubor.js` con dos tablas: `GRUPO_DE_TONO` (tono → grupo) y `COLORES` (grupo → nombre y color). Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Un grupo de tono nuevo, tocando solo el archivo del paso y su test.

**Non-Goals:**
- Cambiar los colores de los demás grupos.

## Decisions

- **Grupo nuevo `profundos`:** el tono `profundo` pasa de `oscuros` a `profundos`; el tono `oscuro` se queda en `oscuros`.
- **Color:** ciruela `#A2426F`, con la misma intensidad (0.55) que los demás grupos. Sobre el tono profundo se distingue del frambuesa (se probó en la vista previa).
- **Escenarios:** "Tonos de piel oscuros" se mantiene con su nombre, pero ahora cubre solo el tono oscuro. "Tono de piel profundo" es nuevo.
