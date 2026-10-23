# Guion de la demo (unos 14 minutos)

**Ejercicio:** construir tres pasos de la rutina (hidratación, rubor y labial) con OpenSpec y tres agentes de Codex trabajando en paralelo.

- Rubor y labial ya están propuestos en `main` (los "preparaste antes de la charla").
- La hidratación se explora y se propone en vivo.
- Los tres se implementan a la vez, cada uno en su propio worktree, y se archivan uno por uno.

## Antes de la charla

- [ ] `npm test` en verde y `npm start` funcionando en http://localhost:3000.
- [ ] `openspec --version` responde y Codex CLI tiene la sesión iniciada.
- [ ] Revisa en tu versión de Codex si tienes `/agents` o worktrees gestionados; si no, usa los worktrees de git de este guion.
- [ ] Terminal con fuente grande y cuatro pestañas: una principal y tres para los agentes.
- [ ] Ensaya la demo completa al menos 3 veces y graba una corrida como respaldo.
- [ ] Deja el repo limpio en `main` (ver "Limpiar después de ensayar").

## 0. Antes: la app y sus specs (1 min)

1. `npm start` → elige un tono y un tipo de piel → limpieza → "Ya terminé". El cierre dice que la hidratación todavía no está disponible y el recorrido muestra once pasos "próximamente".
2. En la terminal:

```bash
openspec list --specs   # tutorial (4 requisitos) y paso-limpieza (2)
openspec list           # agregar-paso-labial 0/4 y agregar-paso-rubor 0/4
ls src/pasos            # solo limpieza.js
```

Qué decir: "Dos capacidades vivas, dos cambios propuestos y un solo paso en el código. Vamos a sumar tres pasos con tres agentes."

## 1. Explorar la hidratación (2 min)

En Codex, en el repo principal:

```
$openspec-explore Quiero el paso de hidratación: si la piel está muy seca, sérum; si no, crema humectante. ¿Qué decisiones faltan?
```

Qué remarcar: aparecen preguntas que un prompt suelto no hace. ¿Qué pasa con la piel grasa? ¿Y la mixta? ¿Cómo se ve en el avatar? ¿Cuánto esperar antes del primer?

Decide en voz alta:
- Seca: sérum sobre la piel aún húmeda y luego crema nutritiva.
- Grasa: gel o crema ligera sin aceites.
- Mixta: crema ligera, un poco más en las mejillas.
- Normal: crema humectante ligera.
- Avatar: un brillo de piel hidratada, más intenso en piel seca y más sutil en piel grasa.

## 2. Proponer (2 min)

```
$openspec-propose agregar-paso-hidratacion: seca, sérum y luego crema nutritiva; grasa, gel o crema ligera sin aceites; mixta, crema ligera y un poco más en las mejillas; normal, crema humectante ligera. En el avatar, brillo de piel hidratada más intenso en piel seca y más sutil en piel grasa.
```

Muestra la carpeta `openspec/changes/agregar-paso-hidratacion/` y valida:

```bash
openspec validate agregar-paso-hidratacion
git add -A && git commit -m "Proponer el paso de hidratación"
```

## 3. Durante: tres agentes en paralelo (5 min)

Crea un worktree por cambio (cada agente trabaja en su propia copia del repo):

```bash
git worktree add ../demo-hidratacion -b paso-hidratacion
git worktree add ../demo-rubor -b paso-rubor
git worktree add ../demo-labial -b paso-labial
```

En cada pestaña, abre Codex en su worktree y aplica su cambio:

| Pestaña | Comandos |
|---------|----------|
| 1 | `cd ../demo-hidratacion && codex` → `$openspec-apply-change agregar-paso-hidratacion` |
| 2 | `cd ../demo-rubor && codex` → `$openspec-apply-change agregar-paso-rubor` |
| 3 | `cd ../demo-labial && codex` → `$openspec-apply-change agregar-paso-labial` |

Mientras trabajan, desde la pestaña principal muestra el "durante":

```bash
openspec list   # el avance de tasks.md de cada cambio, en el repo principal sigue en 0
cat ../demo-rubor/openspec/changes/agregar-paso-rubor/tasks.md   # las casillas se van marcando
```

Qué decir: "Ninguno toca los archivos de los otros: cada paso es un archivo y una capacidad propia. Por eso pueden trabajar a la vez."

Cuando cada agente termine, en su pestaña:

```bash
npm test && git add -A && git commit -m "Implementar el paso"
```

## 4. Después: integrar, ver y archivar (3 min)

En la pestaña principal:

```bash
git merge paso-hidratacion paso-rubor paso-labial
npm start
```

En el navegador: limpieza → hidratación → rubor (la brocha difumina en el color del tono elegido) → labial. Prueba con un tono claro y uno profundo para mostrar que cambian los colores.

Archiva uno por uno y muestra cómo crece la spec viva:

```bash
openspec list --specs                          # 2 capacidades
openspec archive agregar-paso-hidratacion -y
openspec archive agregar-paso-rubor -y
openspec archive agregar-paso-labial -y
openspec list --specs                          # 5 capacidades
ls openspec/changes/archive                    # el historial con fecha
```

Qué decir: "Lo que acordamos antes de escribir código es exactamente lo que quedó documentado después."

## Plan B

Si algo falla o el modelo tarda demasiado:

- `git checkout respaldo-propuestas`: los tres cambios ya propuestos; continúa en el paso 3.
- `git checkout respaldo-final`: los tres pasos implementados y archivados; muestra el paso 4 desde `npm start`.

## Limpiar después de ensayar

```bash
git checkout main
git worktree remove ../demo-hidratacion --force
git worktree remove ../demo-rubor --force
git worktree remove ../demo-labial --force
git branch -D paso-hidratacion paso-rubor paso-labial
git reset --hard origin/main   # solo si subiste main a GitHub
```
