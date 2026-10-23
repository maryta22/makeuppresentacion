# AGENTS.md

## Proyecto
Tocador: un tutorial de maquillaje en vivo. La persona elige el tono de su rostro y su tipo de piel, y un avatar en un espejo la guía paso a paso.

HTML, CSS y JavaScript (módulos ES) sin frameworks ni dependencias.

## Comandos
- Probar: `npm test` (usa `node:test`)
- Ejecutar: `npm start` y abrir http://localhost:3000

## Estructura
- `index.html`, `estilos.css`: las dos pantallas (inicio y paso) y el espejo.
- `src/app.js`: estado y navegación entre pantallas.
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
   - Opcionales: `efecto` (efecto continuo del avatar), `alTerminar` (destello al terminar), `aplicar(avatar, perfil)` (maquillaje que queda puesto), `logro` (frase al cerrar)
3. Para maquillar al avatar usa su API, sin editar el SVG:
   - `avatar.capa(nombre, { color, opacidad, grosor })` con las capas `base`, `brillo`, `rubor`, `cejas`, `pestanas`, `labios`
   - Efectos existentes: `espuma` (continuo), `enjuague` y `brillo` (destellos)
4. Agrega `test/<id>.test.js` con un test por escenario de la spec. `test/contrato-pasos.test.js` valida el contrato automáticamente.

`perfil` es `{ tono, tipo }`, con los ids de `src/perfil.js`.

## Reglas
- Toda funcionalidad nueva pasa por OpenSpec: primero la propuesta en `openspec/changes/`, después el código.
- La spec viva está en `openspec/specs/`. No la edites a mano: se actualiza al archivar un cambio.
- Cada paso nuevo es su propia capacidad (`paso-<id>`) y su propio cambio, para que varios cambios avancen en paralelo sin chocar.
- No agregues dependencias.
- Los textos de la interfaz van en español, en tono cercano y claro.
- Los consejos son generales: nada de recomendaciones médicas.
