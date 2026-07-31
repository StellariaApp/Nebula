# ADR-059 — Alcance de `effects.glass.enabled` y degradación de los gradientes

- **Estado**: aceptada · 2026-07-31 (checkpoint de apertura de W4.1)
- **Contexto**

  El prompt de W4.1 pedía que los ocho componentes de efectos degradasen «con
  `effects.glass.enabled=false` del tema (sober)». Al aterrizar la familia aparecieron dos lecturas
  incompatibles de esa frase, y una de ellas contradice una decisión ya escrita:

  - `docs/02` §2 punto 2 presenta `motion.tier` y `effects.glass.enabled` como los dos interruptores
    del tema, y la skill `effects-guardrails` la formula como «todo componente **glass** degrada a
    superficie sólida semántica cuando está off».
  - `GradientText.md` (W3.1, ADR-043) dejó por escrito lo contrario para los gradientes:
    «`effects.glass.enabled` es específica de glass y los cuatro temas oficiales —sober incluido—
    pueblan `effects.gradients`. Añadir esa palanca es un cambio del contrato compartido y necesita
    su propio ADR; queda anotado como deuda».

  Sin resolverlo, W4.1 habría entregado cinco componentes de gradiente que se apagan en sober y un
  `GradientText` que no, con la misma familia partida en dos comportamientos.

- **Decisión**

  1. **`effects.glass.enabled` gobierna exclusivamente los materiales de compositor**: glass, blur y
     ruido. En web, sus consumidores son `GlassSurface`, `BlurOverlay`, `NoiseOverlay` y las props
     `noise`/`grain` de cualquier componente que compongan la capa de `styles/noise.css.ts`.
  2. **Los gradientes no consultan esa palanca.** Un gradiente se neutraliza por sus **propios
     tokens**: es responsabilidad de cada tema definir `effects.gradients` con la intensidad que le
     corresponde. `sober-light` ya lo hace —`brand` es `blue.700 → blue.500` y `accent` es
     `teal.700 → teal.500`, ambos monocromos— y ese es el contrato que un tema sobrio debe cumplir.
  3. **La animación de un efecto la gobierna `motion.tier`**, no `glass.enabled`. `AnimatedGradient`
     y `StarField` se detienen con `tier: "minimal"` y con `prefers-reduced-motion`, cada uno con su
     sustituto estático (ADR-034).
  4. **No se añade ningún campo a `NebulaTheme`.** La deuda que `GradientText.md` anotó queda cerrada
     por decisión, no por implementación: no habrá `effects.decorative` ni `effects.tier`.

- **Alternativas**

  - **Reutilizar `effects.glass.enabled` como interruptor global de efectos.** Es la lectura literal
    del prompt y no toca el contrato. Se descarta porque mezcla dos conceptos con costes distintos
    —un gradiente es una textura que se rasteriza una vez; el glass es un repintado por frame— y
    porque obligaba a reabrir `GradientText` para no dejar la familia incoherente.
  - **Añadir una palanca propia al contrato (`effects.decorative` o `effects.tier`).** Es la opción
    semánticamente más limpia y la que `GradientText.md` anticipaba. Se descarta por coste contra
    beneficio: cambio del contrato compartido, los cuatro temas, el schema Zod, `theme-vars`,
    `contract.test-d`, y eco obligado en native y en el Theme Creator, para expresar algo que un tema
    ya puede decir eligiendo sus stops. Queda como camino conocido si un tenant llega a necesitar
    «cero gradientes» sin poder redefinirlos.

- **Consecuencias**

  - Regla verificable por test en todo componente de efectos nuevo: si consume `blur`,
    `backdrop-filter` o la capa de ruido, tiene un test que lo apaga en `sober-light`; si consume
    `effects.gradients`, tiene un test que comprueba que **sigue pintando** en `sober-light`.
  - «Sober neutraliza los efectos» significa, de forma verificable: glass off, blur cerrado a scrim
    opaco, `noiseOpacity: 0` y `tier: "minimal"`. **No** significa fondo plano.
  - Un tema que quiera gradientes neutros los define neutros. La responsabilidad es del tema, y el
    gate de contraste (ADR-040) sigue evaluando cada stop.
  - `GradientText` no cambia. Lo que era una excepción sin explicar pasa a ser la regla de la familia.
