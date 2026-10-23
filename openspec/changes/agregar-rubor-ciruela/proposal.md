# Proposal

## Why

Hoy los tonos oscuro y profundo comparten el rubor frambuesa. En la piel más profunda, un rubor ciruela, más violáceo, se ve más natural y se nota mejor.

## What Changes

- El tono de piel profundo tiene su propio color de rubor: ciruela.
- El tono oscuro sigue con frambuesa; los tonos claros y medios no cambian.
- El avatar aplica el rubor ciruela cuando el tono elegido es profundo.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `paso-rubor`: el requisito "Guiar el rubor" separa el tono profundo del oscuro.

## Impact

- Código: `src/pasos/rubor.js` y `test/rubor.test.js`. Ningún otro archivo cambia.
- Fuera de alcance: la fórmula según el tipo de piel y la intensidad del rubor.
