# Design

## Context

El avatar es un SVG generado por `src/avatar.js` y controlado con una API (capas, efectos y destellos). Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Dar volumen al rostro sin perder la API existente.
- Que cada paso señalice con una sola propiedad (`guia`).

**Non-Goals:**
- Fotorrealismo: requeriría una imagen base y ajustar las capas a sus coordenadas.

## Decisions

- **Degradados que siguen el tono:** los colores de luz y sombra se calculan desde `--piel` con `color-mix`, así cada tono conserva su volumen.
- **Ids únicos por avatar:** cada instancia prefija los ids de degradados, filtros y recortes; si hubiera dos avatares en la misma página no se mezclarían sus colores.
- **Mezcla con la piel:** rubor, bronceador y sombra usan modo multiplicar; iluminador y brillo, modo trama. Se ve como producto sobre la piel y no como pintura encima.
- **Señalizaciones declarativas:** las marcas de cada paso se describen con pocas primitivas (zona, punto, flecha, lazo) y se reflejan al lado derecho; los pasos solo eligen su `guia`.
- **Contorno oscuro en las marcas:** las líneas blancas llevan un halo oscuro para leerse sobre cualquier tono de piel.

## Risks / Trade-offs

- [El modo multiplicar oscurece más en tonos profundos] → Cada paso puede ajustar color y opacidad de su capa.
