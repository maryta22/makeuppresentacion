# Design

## Context

El recorrido vive en `RECORRIDO` (`src/recorrido.js`) y cada paso se carga de `src/pasos/<id>.js`. El avatar expone capas y efectos por medio de variables CSS (`src/avatar.js`). Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Reflejar el orden correcto de una rutina completa.
- Dejar listo el avatar para que los pasos nuevos solo llamen a su API.

**Non-Goals:**
- Implementar los pasos nuevos.
- Agregar corrector, polvo o delineador; pueden sumarse después con el mismo mecanismo.

## Decisions

- **Ids sin tildes ni espacios:** `bronceador`, `iluminador`, `sombra-ojos`, `sellador`, porque son nombres de archivo.
- **Capas nuevas recortadas al rostro:** bronceador, rubor e iluminador usan un recorte con la forma de la cara para que el difuminado no se salga al cuello.
- **Bruma como efecto continuo y como destello:** el sellador puede mostrarla mientras dura el paso (`efecto: 'bruma'`) o una vez al terminar (`alTerminar: 'bruma'`).

## Risks / Trade-offs

- [El recorrido es más largo y en celular no cabe completo] → La barra de pasos ya se desplaza horizontalmente.
