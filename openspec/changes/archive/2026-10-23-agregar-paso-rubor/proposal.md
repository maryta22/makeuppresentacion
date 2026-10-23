# Proposal

## Why

El rubor es el paso que más cambia el aspecto del rostro y donde más se nota una mala elección de color o de técnica. Hoy aparece como "próximamente" en el recorrido.

## What Changes

- Nuevo paso de rubor, séptimo de la rutina.
- El tono sugerido depende del tono de piel: rosa suave para tonos claros, durazno para tonos medios y frambuesa para tonos oscuros.
- La fórmula sugerida depende del tipo de piel: crema para piel seca, polvo para piel grasa.
- El avatar muestra dónde va el rubor y lo aplica con la animación de difuminado, en el color sugerido.

## Capabilities

### New Capabilities

- `paso-rubor`: guía para aplicar el rubor según el tono y el tipo de piel.

### Modified Capabilities

Ninguna.

## Impact

- Código: `src/pasos/rubor.js` y `test/rubor.test.js`. Ningún otro archivo cambia.
- Fuera de alcance: contorno con rubor y rubor en otras zonas (nariz, frente).
