# AGENTS.md

## Proyecto
Tocador: un tutorial de maquillaje en vivo. La persona elige el tono de su rostro y su tipo de piel, y un avatar en un espejo la guía paso a paso.

HTML, CSS y JavaScript (módulos ES) sin frameworks ni dependencias.

## Comandos
- Probar: `npm test` (usa `node:test`)
- Ejecutar: `npm start` y abrir http://localhost:3000
- Revisar el maquillaje: http://localhost:3000/vista-previa.html aplica y difumina cada producto en cualquier tono

## Estructura
- `index.html`, `estilos.css`: las dos pantallas (inicio y paso) y el espejo.
- `vista-previa.html`, `src/vista-previa.js`: página de apoyo para probar el maquillaje del avatar.
- `src/app.js`: estado y navegación entre pantallas.
- `src/espejo.js`: las luces del espejo.
- `src/perfil.js`: tonos de rostro y tipos de piel.
- `src/recorrido.js`: el orden de los pasos. Un paso sin archivo aparece como "próximamente" y se salta.
- `src/avatar.js`: el avatar en SVG y su API.
- `src/pasos/<id>.js`: un archivo por paso.

## Cómo agregar un paso
1. Crea `src/pasos/<id>.js` con un `id` que ya exista en `RECORRIDO` (`src/recorrido.js`). No hace falta registrarlo en ningún otro lado.
2. Exporta por defecto un objeto con:
   - `id`, `titulo` (igual al de `RECORRIDO`)
   - `mensaje(perfil)`: lo que dice el avatar
   - `consejos(perfil)`: lista de consejos
   - `recomendacion(perfil)`: `{ titulo, texto }`, adaptada al tipo de piel o al tono
   - `guia`: el id del paso. Muestra sobre el avatar dónde aplicar y hacia dónde difuminar; las señalizaciones de los 12 pasos ya existen en `src/avatar.js`
   - `aplicar(avatar, perfil)`: en los pasos de maquillaje, aplica el producto con `avatar.difuminar`
   - Opcionales: `efecto` (efecto continuo del avatar), `alTerminar` (destello al terminar), `logro` (frase al cerrar)
3. Para maquillar al avatar usa su API, sin editar el SVG:
   - `avatar.difuminar(capa, { color, opacidad, grosor })`: aplica el producto con la animación completa (manchas en los puntos, brocha que sigue las flechas de la señalización y producto que se funde con la piel). Es lo que deben usar los pasos de maquillaje. Ejemplo: `aplicar: (avatar) => avatar.difuminar('rubor', { color: '#E36F7E', opacidad: 0.6 })`
   - `avatar.capa(nombre, { color, opacidad, grosor })`: lo mismo pero sin animación
   - Capas: `base`, `brillo`, `bronceador`, `iluminador`, `rubor`, `cejas`, `sombra`, `pestanas`, `labios`
   - Efectos continuos (`efecto`): `espuma`, `bruma`
   - Destellos que se reproducen una vez (`alTerminar`): `enjuague`, `brillo`, `bruma`
4. Agrega `test/<id>.test.js` con un test por escenario de la spec. `test/contrato-pasos.test.js` valida el contrato automáticamente.

`perfil` es `{ tono, tipo }`, con los ids de `src/perfil.js`.

## Reglas
- Toda funcionalidad nueva pasa por OpenSpec: primero la propuesta en `openspec/changes/`, después el código.
- La spec viva está en `openspec/specs/`. No la edites a mano: se actualiza al archivar un cambio.
- Cada paso nuevo es su propia capacidad (`paso-<id>`) y su propio cambio, para que varios cambios avancen en paralelo sin chocar.
- No agregues dependencias.
- Los textos de la interfaz van en español, en tono cercano y claro.
- Los consejos son generales: nada de recomendaciones médicas.
