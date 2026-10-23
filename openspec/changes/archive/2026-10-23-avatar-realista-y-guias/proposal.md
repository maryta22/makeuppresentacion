# Proposal

## Why

El avatar se veía plano y no mostraba con precisión dónde se aplica cada producto ni cómo se difumina, que es justo lo que más cuesta aprender de un tutorial.

## What Changes

- El avatar se dibuja con volumen: luces y sombras en el rostro, iris con profundidad, labios con degradado y cabello con mechones.
- El maquillaje se mezcla con la piel: rubor, bronceador y sombra tiñen la piel; el iluminador la aclara.
- Cada paso puede mostrar una señalización sobre el avatar: zonas punteadas donde aplicar, puntos de producto y flechas animadas hacia donde difuminar.
- Hay una señalización lista para cada uno de los 12 pasos del recorrido.
- Junto a las instrucciones aparece una leyenda cuando el paso tiene señalización.
- La limpieza muestra flechas circulares en la frente, las mejillas y el mentón.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tutorial`: el avatar que guía suma señalizaciones y leyenda.
- `paso-limpieza`: la animación suma las flechas de movimiento circular.

## Impact

- Código: `src/avatar.js`, `src/app.js`, `src/pasos/limpieza.js`, `index.html`, `estilos.css` y tests.
- Los pasos futuros solo declaran `guia: '<id>'`; no dibujan nada.
- Fuera de alcance: una imagen fotorrealista del rostro.
