## ADDED Requirements

### Requirement: Animación de aplicación y difuminado
Cuando un paso aplica un producto, el sistema SHALL mostrar primero el producto concentrado en los puntos de aplicación de la señalización del paso y luego una brocha que recorre las flechas de difuminado mientras el producto se extiende y se suaviza hasta quedar con su acabado final.

#### Scenario: Producto en los puntos de aplicación
- **WHEN** se muestra un paso que aplica un producto
- **THEN** aparecen manchas del producto en los puntos de aplicación de su señalización

#### Scenario: La brocha difumina
- **WHEN** el producto ya está en los puntos de aplicación
- **THEN** una brocha recorre las flechas de difuminado y el producto se extiende y se suaviza hasta fundirse con la piel, y la brocha desaparece al terminar

#### Scenario: Ver de nuevo
- **WHEN** la persona pulsa "Ver de nuevo cómo se aplica"
- **THEN** la animación se repite desde el principio

#### Scenario: Terminar a mitad de la animación
- **WHEN** la persona pulsa "Ya terminé" mientras la animación está en curso
- **THEN** el producto queda difuminado de inmediato y se pasa al siguiente paso

#### Scenario: Menos movimiento
- **WHEN** la persona tiene activada la preferencia de reducir el movimiento
- **THEN** el producto aparece ya difuminado, sin manchas ni brocha
