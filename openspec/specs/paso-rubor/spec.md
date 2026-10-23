# paso-rubor Specification

## Purpose
Séptimo paso de la rutina: aplicar el rubor en el tono y la fórmula adecuados para el tono y el tipo de piel.

## Requirements

### Requirement: Guiar el rubor
El sistema SHALL indicar cómo aplicar el rubor (sonreír y aplicarlo en la parte más alta de las mejillas, difuminar hacia las sienes y empezar con poco producto) y SHALL sugerir un tono de rubor según el tono de piel.

#### Scenario: Tonos de piel claros
- **WHEN** el tono de piel es claro o claro medio
- **THEN** sugiere un rubor rosa suave

#### Scenario: Tonos de piel medios
- **WHEN** el tono de piel es medio o medio oscuro
- **THEN** sugiere un rubor durazno

#### Scenario: Tonos de piel oscuros
- **WHEN** el tono de piel es oscuro o profundo
- **THEN** sugiere un rubor frambuesa

### Requirement: Fórmula según el tipo de piel
El sistema SHALL recomendar la fórmula del rubor según el tipo de piel.

#### Scenario: Piel seca
- **WHEN** el tipo de piel es seca
- **THEN** recomienda un rubor en crema, que se funde con la piel sin marcar la resequedad

#### Scenario: Piel grasa
- **WHEN** el tipo de piel es grasa
- **THEN** recomienda un rubor en polvo, que dura más y no suma brillo

#### Scenario: Piel mixta
- **WHEN** el tipo de piel es mixta
- **THEN** recomienda un rubor en polvo o en crema ligera

#### Scenario: Piel normal
- **WHEN** el tipo de piel es normal
- **THEN** indica que puede usar polvo o crema, según prefiera

### Requirement: Aplicar el rubor en el avatar
El sistema SHALL mostrar la señalización del rubor y aplicarlo en el avatar con la animación de difuminado, en el color sugerido para su tono de piel.

#### Scenario: Rubor en el color sugerido
- **WHEN** se muestra el paso de rubor
- **THEN** el avatar se aplica el rubor con la brocha, en el color sugerido para su tono de piel
