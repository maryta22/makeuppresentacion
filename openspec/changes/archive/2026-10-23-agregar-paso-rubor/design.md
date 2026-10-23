# Design

## Context

El paso se agrega como `src/pasos/rubor.js`; el recorrido ya lo incluye y la señalización `rubor` ya existe en el avatar. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Un único archivo de paso, sin tocar el resto de la app.

**Non-Goals:**
- Elegir entre varios tonos de rubor.

## Decisions

- **Colores por grupo de tono:** claros `#EE8FA0` (rosa suave), medios `#E9846A` (durazno), oscuros `#C23E62` (frambuesa). La agrupación de tonos se define dentro del paso para no tocar `src/perfil.js`.
- **Animación existente:** `aplicar` llama a `avatar.difuminar('rubor', { color, opacidad: 0.55 })`; no se dibuja nada nuevo.
- **Recomendación:** el título sigue el formato de la limpieza ("Para tu piel …") y el texto incluye la fórmula y el tono sugerido.
