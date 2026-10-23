## MODIFIED Requirements

### Requirement: Recorrer los pasos
El sistema SHALL mostrar el recorrido completo en orden (limpieza, hidratación, primer, base, bronceador, iluminador, rubor, cejas, sombra de ojos, pestañas, labial y sellador), marcando el paso actual, los pasos hechos y los que todavía no están disponibles; al pulsar "Ya terminé" SHALL llevar al siguiente paso disponible, saltando los que no existen.

#### Scenario: Orden de la rutina
- **WHEN** se muestra el recorrido
- **THEN** aparecen los 12 pasos en el orden indicado, del primero al último

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
