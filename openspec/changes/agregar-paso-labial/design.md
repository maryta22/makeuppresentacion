# Design

## Context

El paso se agrega como `src/pasos/labial.js`; el recorrido ya lo incluye y la señalización `labial` ya existe en el avatar. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Un único archivo de paso, sin tocar el resto de la app.

**Non-Goals:**
- Elegir entre varios colores ni acabados (mate, satinado, brillante).

## Decisions

- **Colores por grupo de tono:** claros `#C9566B` (rosa natural), medios `#B4513C` (terracota), oscuros `#7E2038` (vino). La agrupación de tonos se define dentro del paso para no tocar `src/perfil.js`.
- **Animación existente:** `aplicar` llama a `avatar.difuminar('labios', { color })`; no se dibuja nada nuevo.
- **Recomendación por tono:** el labial no depende del tipo de piel, así que el título es "Para tu tono de piel" para todos los perfiles.
