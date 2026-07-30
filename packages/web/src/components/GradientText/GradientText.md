# GradientText

Ejecuta [ADR-043](../../../../../docs/adr/ADR-043-tipografia-sin-variant-y-gradienttext-a-w3.md), que
adelanta este componente de W4 a W3 y decide que `Text` y `Title` **no** reciben `variant`.

## Por qué es un componente y no un prop de Text

`docs/06` §6 fija que los gradientes «nunca pintan texto principal» y son «acento de marca en CTA,
badge, header o hero». Un `<Text variant="gradient">` no puede imponer esa restricción ni garantizar
el fallback; un componente dedicado sí, porque su nombre ya declara la intención y su contrato puede
cargar con las tres degradaciones de abajo. Añadir el prop además no cabía: `Text` mide 9,13 kB contra
un budget de 9,5 y `ResolveVariant` cuesta +2,2 kB (ADR-039).

## Las tres degradaciones

`background-clip: text` con `color: transparent` es un fallo de accesibilidad **silencioso**: si el
recorte no se aplica, el texto se pinta transparente sobre su fondo y desaparece sin error. Por eso
hay tres salidas, todas en CSS y ninguna dependiente de JS:

1. **Sin soporte de recorte** — `@supports not ((background-clip: text) or (-webkit-background-clip:
   text))` devuelve `background-image: none` y pinta `fallbackColor`.
2. **Forced colors** (alto contraste de Windows) — es el caso que más se olvida: el modo fuerza
   `color` pero **no** resetea `-webkit-text-fill-color`, así que un `transparent` heredado deja el
   titular invisible con el sistema en alto contraste. Se repone `-webkit-text-fill-color:
   currentColor` y se pinta `CanvasText`.
3. **Subrayado** — `text-decoration-color` se fija a `fallbackColor` porque la línea también se
   recortaría y quedaría invisible.

## Lo que no lleva

**No hay prop `animated`.** ADR-043 punto 2 deja `AnimatedGradient` en W4 como componente propio; y
animar un gradiente de texto exige mover `background-position`, que no es `transform` ni `opacity` y
por tanto incumple `docs/03` §2 y `docs/06` §6. Cuando llegue, será con su propia decisión de motion.

**No hay degradación por effects budget del tema.** ADR-043 la menciona («o el tema baja el effects
budget»), pero `NebulaTheme` no tiene hoy ninguna palanca de gradientes: `effects.glass.enabled` es
específica de glass y los cuatro temas oficiales —sober incluido— pueblan `effects.gradients`.
Añadir esa palanca es un cambio del contrato compartido y necesita su propio ADR; queda anotado como
deuda en el cierre de W3.1 en vez de inventar aquí una semántica que el tema no declara.

## Medida de lectura

El recorte se aplica por fragmento de línea, así que un párrafo largo con `GradientText` produce un
gradiente distinto en cada línea. Es coherente con el uso previsto —hero y titulares cortos— y es otra
razón para no exponerlo como prop de `Text`.

## Contraste

Entra en el alcance de ADR-040: el gate evalúa **cada stop** del token de gradiente contra la
superficie, no solo el color medio. `pnpm check:contrast` ya cubre los pares de `variantMap.gradient`.
