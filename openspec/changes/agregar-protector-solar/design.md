# Design

## Context

Los consejos de la hidratación salen de `consejos(perfil)` en `src/pasos/hidratacion.js`. El contrato de los pasos ya le pasa el perfil, aunque hoy no lo usa. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Un consejo más al final de la lista, sin cambiar los consejos existentes.

**Non-Goals:**
- Mostrar el protector en el avatar.

## Decisions

- **Último consejo:** "De día, termina con protector solar FPS 30 o más." Va al final porque el protector se aplica después de la crema.
- **Piel grasa:** el mismo consejo agrega "en gel o fluido, de acabado mate".
