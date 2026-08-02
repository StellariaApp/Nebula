# Stellaria UI — sistema visual compartido

## Propósito

Esta carpeta define el lenguaje visual reusable de Stellaria para productos, servicios, landings y aplicaciones. No es una descripción exclusiva de Rosette: Rosette se usa como implementación de referencia para convertir decisiones visuales reales en reglas reutilizables.

El objetivo es que cada producto tenga personalidad propia sin parecer de otra compañía. La fórmula recomendada es:

- **80% Stellaria:** estructura, tipografía, superficies, movimiento, accesibilidad, densidad y comportamiento.
- **20% producto:** color de acento, gradiente, tono editorial, motivo visual, iconografía contextual e imágenes.

## Qué permanece constante

- Claridad y jerarquía editorial.
- Fondos con profundidad controlada, grid y estrellas como firma de la casa.
- Superficies oscuras, bordes finos, contraste progresivo y blur moderado.
- Titulares compactos, copy directo y microcopy técnico en tipografía mono.
- Movimiento suave que explica estado o profundidad.
- Componentes accesibles, responsive y consistentes.
- Endoso visible: `A Stellaria product` o `By Stellaria.app` según el contexto.

## Qué cambia por producto

- Color primario y color luminoso.
- Gradiente principal.
- Intensidad del glow.
- Un motivo secundario propio.
- Tono de voz y vocabulario del dominio.
- Activos de marca, preview e imágenes.

## Orden de lectura

1. [01-brand-foundations.md](./01-brand-foundations.md)
2. [02-design-tokens.md](./02-design-tokens.md)
3. [03-typography-layout.md](./03-typography-layout.md)
4. [04-components.md](./04-components.md)
5. [05-composition-patterns.md](./05-composition-patterns.md)
6. [06-motion-background.md](./06-motion-background.md)
7. [07-content-i18n-accessibility.md](./07-content-i18n-accessibility.md)
8. [08-product-theming.md](./08-product-theming.md)
9. [09-engineering-contract.md](./09-engineering-contract.md)
10. [10-quality-checklist.md](./10-quality-checklist.md)
11. [PRODUCT-THEME-TEMPLATE.md](./PRODUCT-THEME-TEMPLATE.md)
12. [PROMPT-refine-ui-library.md](./PROMPT-refine-ui-library.md)

## Fuente de verdad

Cuando existan contradicciones, aplicar este orden:

1. Accesibilidad, seguridad y comportamiento esperado.
2. Tokens semánticos.
3. Contrato del componente.
4. Patrón de composición.
5. Ajuste específico del producto.

Los archivos históricos `docs/design-style.md` y `docs/page-template.md` siguen aportando contexto, pero esta carpeta es la especificación normativa para la futura librería UI.

## Regla de adopción

Un producto no debe copiar colores hexadecimales o sombras directamente desde Rosette. Debe consumir tokens semánticos y declarar un tema de producto. Si una necesidad no cabe en los tokens existentes, primero se documenta el nuevo rol semántico y después se implementa.
