# Proposal

## Why

Las señalizaciones muestran dónde aplicar y hacia dónde difuminar, pero el producto aparecía de golpe. Ver cómo se coloca y cómo se extiende con la brocha es lo que más ayuda a aprender la técnica.

## What Changes

- Al aplicar un producto, aparecen manchas de producto en los puntos de aplicación de la señalización del paso.
- Una brocha recorre las flechas de difuminado con un pequeño vaivén mientras el producto se extiende, se suaviza y se funde con la piel hasta quedar con su acabado final.
- Un botón "Ver de nuevo cómo se aplica" repite la animación en los pasos que aplican producto.
- Si la persona pulsa "Ya terminé" a mitad de la animación, el producto queda difuminado de inmediato.
- Con la preferencia de reducir el movimiento, el producto aparece ya difuminado, sin brocha.
- Nueva página de apoyo `vista-previa.html` para probar el difuminado de cada producto en cualquier tono de piel.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tutorial`: se agrega la animación de aplicación y difuminado.

## Impact

- Código: `src/avatar.js` (nuevo `avatar.difuminar`), `src/app.js`, `src/espejo.js`, `index.html`, `estilos.css`, `vista-previa.html`, `src/vista-previa.js` y tests.
- Los pasos de maquillaje solo llaman a `avatar.difuminar(capa, { color, opacidad })` dentro de `aplicar`; la animación ya está hecha.
- Fuera de alcance: implementar los pasos de maquillaje.
