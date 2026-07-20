# Theming web

## Reparto entre CSS y JS (ADR-016)

`contract.css.ts` declara la proyección CSS de `NebulaTheme`: solo las hojas materializables como CSS custom property. La data no-CSS —`variantMap`, `motion.spring`, `motion.tier`, `effects.glass.enabled`, los gradientes y las paletas de identidad— se consume desde el objeto `theme` de JS vía contexto, nunca como var.

Cada tema oficial materializa el contrato en build con `createTheme` (una clase por tema, en `themes.css.ts`); los temas dinámicos lo inyectan en runtime con `assignInlineVars`. `ThemeToVars` es la fuente única de esa proyección, así que ambos caminos producen exactamente las mismas variables.

Unidades: px para dimensiones, ms para duraciones, unitless para weight/lineHeight/zIndex/noiseOpacity. `space` se resuelve a px como `unit × scale`.

## ResolveVariant

Traduce las referencias serializables de una `VariantRecipe` (`scale.600`, `scale.500.12`, `surface.overlay`, `gradient.brand`) a valores CSS que los componentes asignan a sus vars locales.

Las referencias a escala se resuelven a **`var(...)` del contrato, nunca a hex**: así, cambiar de tema oficial repinta por CSS sin JS, y solo se recalcula cuando cambia la receta en sí (por ejemplo, `playful` pinta `filled` con gradiente).

Los estados derivan de la receta: el hover desplaza un paso de escala (600→700, el par que valida `check:contrast`) y los fondos transparentes se insinúan con un tinte de la escala activa. El alpha usa `color-mix`, que permite aplicar transparencia a una var sin conocer su valor.

Aplica los guardrails del tema: con `effects.glass.enabled` en false la variante glass degrada a superficie sólida, y con `motion.tier: "minimal"` se desactiva la animación.

## layers.css.ts

`baseLayer` existe para que los estilos base de los componentes cedan siempre ante las style props del consumidor, que sprinkles emite fuera de capas. Ver `components/Text/docs.md`.
