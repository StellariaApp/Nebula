# ADR-140 — La opacidad alcanza a los peldaños de escala

- **Estado**: **aceptada** · 2026-08-13 — aprobada por el propietario en WN
- **Enmienda**: [ADR-071](ADR-071-opacidad-en-referencias-de-color.md) §4, que limitaba la opacidad de
  los style props a los roles. El recorte se justificaba en un coste de bundle que
  [ADR-103](ADR-103-el-registro-de-props-es-la-fuente-del-tipo-publico.md) ya había pagado por otra
  vía, sin que nadie volviera a medirlo.
- **Afecta**: `c`/`color` y `bg`/`background` en `utils/style-props.ts`.

## Contexto

ADR-071 §4 cerró el alcance así: las tres props de color admiten opacidad sobre `surface.*`, `text.*`
y `border.*`, y **no** sobre un peldaño de escala. El motivo era de tamaño, y estaba medido: el mapa
de resolución pasa a estar vivo en runtime en todo módulo que use style props, y ahí los 19 roles
cuestan ~330 B brotli frente a 0.8–1.3 kB si se añaden los 77 peldaños.

Esa medición dejó de describir el repo. ADR-103 sacó el tipo público al registro de props y, con él,
`ExtractStyleProps` pasó a importar `TOKEN_VALUES` (`style-props.ts:8`) para resolver el carril
abierto. `TOKEN_VALUES.color` **es** `PALETTE_COLORS`, las 99 entradas con las siete escalas
incluidas (`Box.css.ts:194-206`). El mapa completo lleva desde entonces en el bundle de runtime de
todo módulo que use style props: el coste que ADR-071 §4 quería evitar ya está pagado, y el recorte
solo conservaba la limitación, no el ahorro.

Lo que quedó, entonces, es una asimetría sin contrapartida:

```
surface.raised.60   ✅        accent.500.12   ❌
text.primary.70     ✅        error.400.50    ❌
```

Y falla en silencio. `c`/`bg` son `open: true` en el registro (`style-registry.ts:138-139`), así que
un valor que no resuelve no rompe el typecheck ni avisa: sale crudo por el carril abierto como
`--nb-bg: error.400.50`, el navegador descarta la declaración y el color no se aplica. El test que
supuestamente fijaba la restricción (`style-props.test.ts:81`) comprobaba `bg="accent.500"`, **sin
sufijo**, de modo que nunca ejerció el caso que su nombre describía.

## Decisión

1. **La opacidad se resuelve contra la tabla de la propia prop, no contra `ROLE_COLORS` fijo.**
   `ResolveOpacity` deja de cerrar sobre un único mapa y recibe el que corresponde al `token` del
   spec, que es el mismo mecanismo que `TokenValue` ya usa para el valor sin alpha. Una prop admite
   con alpha exactamente los colores que admite sin él:

   | prop                                | `token` | admite                      |
   | ----------------------------------- | ------- | --------------------------- |
   | `c` · `color` · `bg` · `background` | `color` | roles + escalas + literales |
   | `bdc` · `border*Color`              | `role`  | roles + literales           |

   ```
   error.400.50     accent.500.12     primary.600.70     currentColor.20
   ```

2. **La opacidad no amplía el conjunto de colores de una prop.** `bdc` sigue sin aceptar peldaños de
   escala, con alpha o sin él, porque su mapa de sprinkles es `ROLE_COLORS` (`Box.css.ts:166`). La
   alternativa —que `bdc="accent.500.40"` funcionase mientras `bdc="accent.500"` falla— era la
   incoherencia que este ADR existe para no crear.

3. **Solo las escalas de color entran.** `AlphaTones` devuelve tabla únicamente para `color` y
   `role`; para cualquier otra escala devuelve `undefined`. Sin ese cierre, `p="md.50"` resolvería
   `LAYOUT_SPACE["md"]` y emitiría un `color-mix` como padding.

4. **El resto del contrato de ADR-071 se mantiene intacto.** Sufijo entero, composición contra
   `transparent` con `color-mix(in srgb, …)`, declaración inline en vez de clase atómica, y un sufijo
   no numérico deja el color base sin alpha. No se extiende a `boxShadow` ni a los gradientes.

## Alternativas

**Dejarlo como está y documentar la limitación.** Descartada: la limitación ya no compra nada. Su
único argumento era el tamaño, y el tamaño ya se paga desde ADR-103 se resuelva o no la opacidad.

**Extender también `bdc` a la paleta completa.** Descartada por alcance: cambia el mapa de sprinkles
de `borderColor` —CSS, no JS— y es una decisión sobre qué colores puede tomar un borde, no sobre
opacidad. Si se quiere, se decide por su cuenta.

**Avisar en desarrollo cuando un valor de color no resuelve.** No entra aquí; el propietario la
descartó para este cambio. Queda anotada: es el guardarraíl que convertiría los fallos de esta clase
en visibles, y el barrido de abajo muestra que se dan.

## Consecuencias

- **El mapa no se paga dos veces; el código de resolución sí cuesta.** `PALETTE_COLORS` ya estaba
  retenido vía `TOKEN_VALUES`, así que el cambio no añade imports —de hecho `style-props.ts` deja de
  importar `ROLE_COLORS` por separado, que ahora solo se alcanza por `TOKEN_VALUES.role`—. Lo que sí
  pesa es la rama de resolución. Una primera versión la escribió como tabla `COLOR_SCALES` y costó
  entre 80 y 155 B por módulo; derivar el mapa de `COLOR_PROPS`, que ya se leía dos líneas más abajo,
  la deja en el ruido de la medición.

  **La medición no es limpia y no conviene citarla como delta.** Se tomó con `Segment` en obra en el
  árbol de trabajo, y los tres presupuestos que rebasan son sus tres entradas —`Segment`, `GridList`,
  `CodeHighlightTabs`—. `Segment` ya rebasaba antes de este cambio (42.59 kB sobre 42.5) y después
  queda **por debajo** de donde estaba (42.54 kB), lo que un delta atribuible a esta rama no puede
  explicar. Los tres topes suben —43 / 43.75 / 56.75 kB— y la cifra se vuelve a medir cuando el
  trabajo sobre `Segment` cierre.

- **Ningún valor que antes resolvía cambia de resultado.** El orden de `NeedsOpenLane` protege los
  peldaños de dos segmentos: `IsKnown` se evalúa antes, así que `gray.50` sigue siendo el token
  `gray.50` y no se lee como `gray` al 50 %. Verificado con test.

- **El suelo de contraste sigue sin gate.** Igual que en ADR-071: `check:contrast` mide el token, no
  el color compuesto. La regla operativa no cambia —opacidad en superficie, borde y decoración, no en
  texto informativo—, y ahora aplica también a las escalas, donde es más fácil equivocarse porque un
  `primary.600.40` parece un color de marca y es un velo.

- **El barrido del catálogo encontró cuatro usos que no resolvían**, todos anteriores a este cambio y
  todos silenciosos:

  | sitio                                  | valor            | causa                                  |
  | -------------------------------------- | ---------------- | -------------------------------------- |
  | `demos/Patterns/MotionLab.tsx:190,193` | `c="light"`      | `light` es un token de font-weight     |
  | `demos/Patterns/Scenarios.tsx:124-127` | `semantic.*.500` | las semánticas se aplanan a `info.500` |

  Corregidos en el mismo PR: `text.onGradient` y `info.500`/`warning.500`/`success.500`/`error.500`.
  Los cuatro puntos de color de las etiquetas de `Scenarios` llevaban sin pintarse desde que se
  escribieron.
