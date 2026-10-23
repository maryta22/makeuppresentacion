# Design

## Context

Cada capa del avatar se controla con variables CSS y las señalizaciones ya describen puntos y flechas por paso. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Que un paso nuevo obtenga la animación completa con una sola llamada.
- Que la animación siga exactamente las flechas de la señalización.

**Non-Goals:**
- Animaciones distintas por herramienta (esponja, dedos, aplicador).

## Decisions

- **Línea de tiempo pura (`etapaDifuminado(t)`):** calcula cuánto producto hay en la piel, el tamaño, el desenfoque, las manchas y la posición de la brocha para cada instante. Se prueba sin navegador.
- **La brocha sigue las flechas reales:** recorre cada flecha de la señalización con `getPointAtLength`, convirtiendo las coordenadas del lado reflejado al espacio del avatar.
- **Un filtro de desenfoque por capa:** así el difuminado de una capa no afecta a otra.
- **Labios con mezcla de color:** el color del labial se mezcla con el natural de 0 a 100 %, porque un cambio de color no se puede animar con transiciones.
- **Cancelación:** ocultar la señalización o reiniciar el avatar termina la animación en curso y deja el estado final.
- **Vista previa como herramienta de apoyo:** `vista-previa.html` no es parte del tutorial; sirve para revisar el resultado mientras se construyen los pasos.

## Risks / Trade-offs

- [Si un paso no tiene flechas en su señalización, no hay recorrido para la brocha] → El producto igual se difumina, solo que sin brocha.
