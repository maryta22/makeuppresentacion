# tutorial Specification

## Purpose
Guiar a la persona por una rutina de maquillaje paso a paso, con un avatar en un espejo que habla y muestra cada paso, adaptando los consejos a su tono de rostro y tipo de piel.

## Requirements
### Requirement: Elegir el perfil
El sistema SHALL pedir el tono del rostro (6 opciones) y el tipo de piel (seca, grasa, mixta o normal) antes de comenzar, y SHALL mostrar en el avatar el tono elegido en cuanto se selecciona.

#### Scenario: Comenzar deshabilitado
- **WHEN** falta elegir el tono o el tipo de piel
- **THEN** el botón "Comenzar la rutina" está deshabilitado y se indica qué falta

#### Scenario: El avatar toma el tono elegido
- **WHEN** la persona elige un tono de rostro
- **THEN** la piel del avatar cambia a ese tono de inmediato

#### Scenario: Comenzar la rutina
- **WHEN** la persona eligió tono y tipo de piel y pulsa "Comenzar la rutina"
- **THEN** se muestra el primer paso disponible del recorrido

### Requirement: Recorrer los pasos
El sistema SHALL mostrar el recorrido completo en orden (limpieza, hidratación, primer, base, rubor, cejas, pestañas, labial), marcando el paso actual, los pasos hechos y los que todavía no están disponibles; al pulsar "Ya terminé" SHALL llevar al siguiente paso disponible, saltando los que no existen.

#### Scenario: Pasos todavía no disponibles
- **WHEN** un paso del recorrido aún no existe en la aplicación
- **THEN** aparece en el recorrido marcado como próximamente y no se puede abrir

#### Scenario: Saltar pasos no disponibles
- **WHEN** la persona pulsa "Ya terminé" y el paso siguiente del recorrido no existe pero uno posterior sí
- **THEN** se muestra el siguiente paso que sí existe

#### Scenario: No quedan pasos disponibles
- **WHEN** la persona pulsa "Ya terminé" y no queda ningún paso disponible después
- **THEN** se muestra un cierre que indica cuál es el siguiente paso pendiente y permite empezar de nuevo

#### Scenario: Empezar de nuevo
- **WHEN** la persona pulsa "Empezar de nuevo"
- **THEN** vuelve a la pantalla de inicio y el avatar pierde el maquillaje aplicado

### Requirement: Avatar que guía
El sistema SHALL mostrar la instrucción de cada paso en un globo de diálogo junto al espejo, con el avatar moviendo la boca mientras aparece el texto, y SHALL mostrar en el avatar el efecto propio del paso mientras dura.

#### Scenario: El avatar habla
- **WHEN** se muestra un paso
- **THEN** el globo presenta su instrucción letra por letra mientras el avatar mueve la boca

#### Scenario: Menos movimiento
- **WHEN** la persona tiene activada la preferencia de reducir el movimiento
- **THEN** el texto aparece completo de inmediato y no hay animaciones
