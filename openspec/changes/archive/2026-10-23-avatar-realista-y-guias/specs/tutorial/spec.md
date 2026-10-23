## MODIFIED Requirements

### Requirement: Avatar que guía
El sistema SHALL mostrar la instrucción de cada paso en un globo de diálogo junto al espejo, con el avatar moviendo la boca mientras aparece el texto, y SHALL mostrar en el avatar el efecto propio del paso mientras dura. Cuando el paso tenga señalización, el sistema SHALL marcar sobre el avatar las zonas donde aplicar, los puntos de producto y flechas animadas que indican hacia dónde difuminar, con una leyenda junto a las instrucciones.

#### Scenario: El avatar habla
- **WHEN** se muestra un paso
- **THEN** el globo presenta su instrucción letra por letra mientras el avatar mueve la boca

#### Scenario: Señalización del paso
- **WHEN** se muestra un paso que tiene señalización
- **THEN** el avatar muestra las zonas punteadas, los puntos de producto y las flechas de difuminado de ese paso, y aparece la leyenda junto a las instrucciones

#### Scenario: Paso sin señalización
- **WHEN** se muestra un paso que no tiene señalización
- **THEN** no aparecen marcas sobre el avatar ni la leyenda

#### Scenario: Al terminar el paso
- **WHEN** la persona pulsa "Ya terminé"
- **THEN** la señalización desaparece antes de pasar al siguiente paso

#### Scenario: Menos movimiento
- **WHEN** la persona tiene activada la preferencia de reducir el movimiento
- **THEN** el texto aparece completo de inmediato y no hay animaciones; las flechas se muestran quietas
