# Proposal

## Why

La rutina estaba incompleta: faltaban el bronceador, el iluminador, la sombra de ojos y el sellador. Además, el orden debe seguir el de las guías de maquillaje: bronceador, iluminador y rubor después de la base; cejas antes de los ojos; sellador al final.

## What Changes

- El recorrido pasa de 8 a 12 pasos, en este orden: limpieza, hidratación, primer, base, bronceador, iluminador, rubor, cejas, sombra de ojos, pestañas, labial y sellador.
- Los pasos nuevos aparecen como "próximamente" hasta que se implementen.
- El avatar suma capas para bronceador, iluminador y sombra de ojos, y un efecto de bruma para el sellador, para que esos pasos puedan implementarse sin tocar el dibujo.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tutorial`: el recorrido completo ahora tiene 12 pasos en el orden indicado.

## Impact

- Código: `src/recorrido.js`, `src/avatar.js`, `estilos.css` y `test/recorrido.test.js`.
- Ningún paso existente cambia de comportamiento.
- Fuera de alcance: implementar los pasos nuevos; cada uno será su propio cambio.
