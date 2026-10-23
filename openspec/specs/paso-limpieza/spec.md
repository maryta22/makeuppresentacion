# paso-limpieza Specification

## Purpose
Primer paso de la rutina: limpiar el rostro con un limpiador adecuado para el tipo de piel.

## Requirements

### Requirement: Guiar la limpieza
El sistema SHALL indicar cómo limpiar el rostro (masajear en círculos suaves durante 30 a 60 segundos, recorrer frente, nariz, mejillas y mentón, y enjuagar con agua tibia) y SHALL recomendar un tipo de limpiador según el tipo de piel.

#### Scenario: Piel seca
- **WHEN** el tipo de piel es seca
- **THEN** recomienda un limpiador cremoso o en leche, sin sulfatos

#### Scenario: Piel grasa
- **WHEN** el tipo de piel es grasa
- **THEN** recomienda un limpiador en gel o espuma que ayude a controlar el brillo

#### Scenario: Piel mixta
- **WHEN** el tipo de piel es mixta
- **THEN** recomienda un gel suave que limpie la zona T sin resecar las mejillas

#### Scenario: Piel normal
- **WHEN** el tipo de piel es normal
- **THEN** recomienda un limpiador suave de uso diario

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
