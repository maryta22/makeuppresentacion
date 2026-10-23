## ADDED Requirements

### Requirement: Guiar el labial
El sistema SHALL indicar cómo aplicar el labial (hidratar los labios con bálsamo, aplicar desde el centro hacia las comisuras, retirar el exceso con un pañuelo y aplicar una segunda capa) y SHALL sugerir un color según el tono de piel.

#### Scenario: Tonos de piel claros
- **WHEN** el tono de piel es claro o claro medio
- **THEN** sugiere un labial rosa natural

#### Scenario: Tonos de piel medios
- **WHEN** el tono de piel es medio o medio oscuro
- **THEN** sugiere un labial terracota

#### Scenario: Tonos de piel oscuros
- **WHEN** el tono de piel es oscuro o profundo
- **THEN** sugiere un labial vino

### Requirement: Aplicar el labial en el avatar
El sistema SHALL mostrar la señalización del labial y aplicarlo en el avatar con la animación de difuminado, en el color sugerido para su tono de piel.

#### Scenario: Labial en el color sugerido
- **WHEN** se muestra el paso de labial
- **THEN** el avatar se aplica el labial con la brocha, en el color sugerido para su tono de piel
