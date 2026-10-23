## MODIFIED Requirements

### Requirement: Guiar el rubor
El sistema SHALL indicar cómo aplicar el rubor (sonreír y aplicarlo en la parte más alta de las mejillas, difuminar hacia las sienes y empezar con poco producto) y SHALL sugerir un tono de rubor según el tono de piel.

#### Scenario: Tonos de piel claros
- **WHEN** el tono de piel es claro o claro medio
- **THEN** sugiere un rubor rosa suave

#### Scenario: Tonos de piel medios
- **WHEN** el tono de piel es medio o medio oscuro
- **THEN** sugiere un rubor durazno

#### Scenario: Tonos de piel oscuros
- **WHEN** el tono de piel es oscuro
- **THEN** sugiere un rubor frambuesa

#### Scenario: Tono de piel profundo
- **WHEN** el tono de piel es profundo
- **THEN** sugiere un rubor ciruela
