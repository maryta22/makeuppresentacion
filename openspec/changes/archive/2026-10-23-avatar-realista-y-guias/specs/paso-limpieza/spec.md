## MODIFIED Requirements

### Requirement: Animación de limpieza
El sistema SHALL mostrar al avatar con diadema, ojos cerrados y espuma mientras dura el paso, con flechas circulares que señalan el masaje en círculos en la frente, las mejillas y el mentón; al pulsar "Ya terminé" SHALL mostrar un enjuague con gotas de agua antes de continuar.

#### Scenario: Durante la limpieza
- **WHEN** se muestra el paso de limpieza
- **THEN** el avatar aparece con diadema, ojos cerrados y espuma en la frente, las mejillas y el mentón

#### Scenario: Movimiento circular señalizado
- **WHEN** se muestra el paso de limpieza
- **THEN** aparecen flechas circulares animadas en la frente, las dos mejillas y el mentón

#### Scenario: Enjuague al terminar
- **WHEN** la persona pulsa "Ya terminé" en la limpieza
- **THEN** la espuma y las flechas desaparecen, caen gotas de agua y el rostro queda limpio
