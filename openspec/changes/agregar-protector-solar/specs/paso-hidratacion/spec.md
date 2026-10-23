## ADDED Requirements

### Requirement: Recordar el protector solar
El sistema SHALL recordar en los consejos de la hidratación que, durante el día, se aplique protector solar FPS 30 o más después de la crema.

#### Scenario: Protector solar de día
- **WHEN** se muestra el paso de hidratación
- **THEN** el último consejo recuerda aplicar protector solar FPS 30 o más durante el día

#### Scenario: Protector para piel grasa
- **WHEN** el tipo de piel es grasa
- **THEN** el consejo del protector sugiere uno en gel o fluido, de acabado mate
