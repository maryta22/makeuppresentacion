# paso-hidratacion Specification

## Purpose
Segundo paso de la rutina: hidratar el rostro con el producto adecuado para el tipo de piel antes del maquillaje.

## Requirements

### Requirement: Guiar la hidratación
El sistema SHALL indicar cómo hidratar el rostro (colocar el producto en la frente, las mejillas y el mentón, extenderlo hacia afuera y hacia arriba con toques suaves y esperar a que se absorba antes del primer) y SHALL recomendar el producto según el tipo de piel.

#### Scenario: Piel seca
- **WHEN** el tipo de piel es seca
- **THEN** recomienda un sérum hidratante sobre la piel aún húmeda y luego una crema nutritiva

#### Scenario: Piel grasa
- **WHEN** el tipo de piel es grasa
- **THEN** recomienda un gel o una crema ligera sin aceites

#### Scenario: Piel mixta
- **WHEN** el tipo de piel es mixta
- **THEN** recomienda una crema ligera, con un poco más en las mejillas si se sienten tirantes

#### Scenario: Piel normal
- **WHEN** el tipo de piel es normal
- **THEN** recomienda una crema humectante ligera

### Requirement: Piel hidratada en el avatar
El sistema SHALL mostrar la señalización de la hidratación y aplicar en el avatar un brillo de piel hidratada con la animación de difuminado, más intenso cuanto más seca sea la piel.

#### Scenario: Brillo según el tipo de piel
- **WHEN** se muestra el paso de hidratación
- **THEN** el avatar queda con un brillo de piel hidratada, más intenso en piel seca y más sutil en piel grasa
