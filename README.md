# Tocador

Tutorial de maquillaje en vivo: eliges el tono de tu rostro y tu tipo de piel, y un avatar en un espejo con luces te guía paso a paso, con consejos adaptados a tu piel y animaciones de cada paso.

Es el proyecto de demostración de la charla **Spec-Driven Development con Codex**: la app tiene solo el primer paso (limpieza) y el resto de la rutina se construye con OpenSpec y Codex.

## Arrancar

Requiere Node.js 20.19 o superior. No tiene dependencias.

```bash
npm test     # tests de la lógica
npm start    # http://localhost:3000
```

## Qué hay hoy

- **Inicio:** elegir el tono del rostro y el tipo de piel; el avatar cambia de tono al instante.
- **Paso 1, limpieza:** el avatar explica cómo limpiar el rostro, recomienda un limpiador según el tipo de piel y muestra espuma, flechas de movimiento circular y el enjuague.
- **Recorrido:** los doce pasos de la rutina; los que todavía no existen aparecen como "próximamente".
- **Avatar listo para maquillar:** cada paso tiene su señalización (dónde aplicar y hacia dónde difuminar) y la animación de brocha que difumina el producto.

## Vista previa del maquillaje

Con `npm start`, abre http://localhost:3000/vista-previa.html para ver cómo se aplica y se difumina cada producto (base, bronceador, iluminador, rubor, cejas, sombra, pestañas y labial) en cualquier tono de piel.

## Cómo crece

Cada paso de la rutina es un archivo en `src/pasos/` y una capacidad propia en `openspec/specs/`. Por eso cada paso nuevo puede proponerse e implementarse en paralelo con los demás, sin que choquen. Los detalles para agregar un paso están en [`AGENTS.md`](AGENTS.md).

## OpenSpec para Codex

El repo ya tiene OpenSpec inicializado para Codex, en español (`openspec init --tools codex --language es`). Los skills quedan en `.agents/skills/` y se invocan con `$`:

| Paso      | En Codex                    |
|-----------|-----------------------------|
| Explorar  | `$openspec-explore`         |
| Proponer  | `$openspec-propose`         |
| Aplicar   | `$openspec-apply-change`    |
| Archivar  | `$openspec-archive-change`  |

La spec viva está en `openspec/specs/tutorial/` y `openspec/specs/paso-limpieza/`.
