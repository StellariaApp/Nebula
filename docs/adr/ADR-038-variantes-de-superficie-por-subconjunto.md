# ADR-038 — Variantes de superficie por subconjunto declarado de `Variant`

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la auditoría WV; primer lote ejecutado en el
  tramo V2 — Alert y Badge. Card, Paper, Avatar, Toast, Progress, Segment, Tabs, NavLink y Pagination
  quedan para V4 y V5)
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §0, §1.1 y §2.A.

## Contexto

`docs/02-theming.md` §2 punto 3 afirma que «`variantMap` hace que hasta el significado visual de
`variant="filled"` sea temable». La auditoría WV midió que eso es cierto para **2 de los 68**
componentes del catálogo web: `grep -rln ResolveVariant` sobre `packages/web/src/components` devuelve
solo `Button/Button.tsx` y `ActionIcon/ActionIcon.tsx`.

Otros cuatro componentes declaran un prop **llamado** `variant` que no lee `theme.variantMap`, y sobre
tres ejes semánticos distintos: Alert (`light|filled|outline`) y Badge (`light|filled|outline|dot`) son
recetas cromáticas escritas a mano, `Divider` (`solid|dashed|dotted`) es `borderStyle` y `Loader`
(`spinner|dots|bars`) es forma de animación.

La duplicación ya produjo deriva verificable. La receta `light` existe hoy en tres definiciones
incompatibles:

| Origen                                 | background             | foreground     | border             |
| -------------------------------------- | ---------------------- | -------------- | ------------------ |
| `themes/nebula-dark.ts:116` (contrato) | `scale.500.12`         | `scale.800`    | `none`             |
| `components/Alert/Alert.tsx:41-46`     | `scale.500` @ 12 %     | `text.primary` | `scale.500` @ 28 % |
| `components/Badge/Badge.tsx:30-34`     | `scale.500` @ **14 %** | `scale.700`    | `transparent`      |

Ningún gate lo detecta. Y la consecuencia es funcional, no estética: un tema que remapee `filled` a
`gradient.brand` (`packages/themes/src/__tests__/official-themes.test.ts:49`); ese remapeo llega a
Button y ActionIcon y **no** llega a Alert ni a Badge.

W3 entrega Chip, Banner, StatusBadge, Stepper y CardComplex, cinco componentes que necesitan receta
cromática. Sin patrón fijado, W3 los escribe a mano y la deriva pasa de dos componentes a siete.

## Decisión

1. **Un componente de superficie declara `variant` sobre un subconjunto explícito de `Variant`**, no
   sobre la unión entera y no sobre una unión propia. El subconjunto se expresa en el tipo con
   `Extract<Variant, …>`, de modo que sigue siendo el mismo vocabulario y el compilador impide que un
   componente invente un miembro:

   ```ts
   export type BadgeVariant = Extract<
     Variant,
     "filled" | "outline" | "light" | "ghost" | "gradient"
   >;
   ```

2. **La receta la resuelve `ResolveVariant` contra `theme.variantMap`.** Se retiran las funciones
   `Palette()` locales de `Alert.tsx` y `Badge.tsx`. El componente consume el resultado por vars
   locales, según `docs/patterns/web-component-template.md` §2 capa 2.

3. **El subconjunto lo decide el effects budget de `docs/06` §6, no la comodidad.** Reglas aplicadas:

   - `glow` «no se aplica a listas completas»: se admite donde el componente es una excepción única
     (Card) y se excluye de todo lo que aparezca en colección (Badge, Chip, NavLink, Pagination,
     Segment).
   - `gradient` «no es fondo dominante en tablas, formularios ni lectura larga» y «nunca pinta texto
     principal»: se excluye de Alert, que sostiene párrafo, y de todo overlay.
   - `glass` «nunca se anida»: solo donde el componente es raíz de su región (Card, Paper, Toast,
     Banner).
   - `unstyled` no se propaga: el caso está resuelto estructuralmente por `UnstyledButton`.

   | Componente     | Subconjunto                                          |
   | -------------- | ---------------------------------------------------- |
   | Card · Paper   | `filled · outline · light · glass · glow · gradient` |
   | Alert · Banner | `filled · outline · light · glass`                   |
   | Badge · Chip   | `filled · outline · light · ghost · gradient`        |
   | Toast          | `filled · light · glass`                             |
   | Segment · Tabs | `filled · light · ghost`                             |
   | NavLink        | `filled · light · ghost`                             |
   | Pagination     | `filled · outline · light · ghost`                   |
   | Avatar         | `filled · outline · light`                           |
   | Progress       | `filled · light`                                     |

4. **La unión `Variant` no se amplía.** Los ocho miembros ya tienen receta en los cuatro temas
   oficiales, de modo que esta decisión tiene coste de contrato **cero**. Los dos candidatos que
   aparecen en los repos de referencia y no están en la unión no la necesitan: `subtle` de fonicredito
   (21 usos, `Badge/styles.ts:50-54`) es `variant="light" color="gray"`, y `flat` de tfv
   (`Badge/index.tsx:76-82`) es `ghost` con `p={0}`. `link` de fonicredito (11 usos) sí queda fuera,
   pero su diferencia con `ghost` es **geométrica** —colapsa la caja del control— y `VariantRecipe`
   solo expresa color; su destino es `Anchor` o la prop `href` de ADR-035.

5. **Los cinco overlays quedan fuera.** Modal, Drawer, Popover, Menu y Tooltip no reciben `variant`:
   su superficie **es** su nivel de elevación (`docs/06` §5, ADR-028) y su física deriva de esa
   superficie (ADR-034). Tooltip conserva `color: "neutral" | "inverted"`, que es el caso legítimo.

6. **Los componentes de W3 nacen con su subconjunto.** Chip, Banner, StatusBadge, Stepper y
   CardComplex no se escriben con recetas locales. Es la razón de que este ADR preceda a W3.

## Alternativas

- **Variantes zero-runtime** con `recipe()` de VE resuelto en build: cuesta 0 kB y no toca ningún
  budget, pero pierde `variantMap` —un tema no podría remapear `filled`—, que es
  exactamente el defecto que este ADR corrige. Rechazada: resuelve el bundle reintroduciendo el
  problema.
- **Dejarlo como está**, cada componente con su receta local: 0 kB y 0 ADRs, pero obliga a retirar de
  `docs/02` §2.3 la promesa de que `variant` es temable, hoy falsa para 4 de los 6 componentes que lo
  exponen. Rechazada por el propietario en el checkpoint.
- **Las 8 variantes en todos los componentes de superficie**: API uniforme y sin tabla de subconjuntos
  que mantener, a cambio de habilitar `Card variant="unstyled"`, `Pagination variant="glow"` y
  `Alert variant="gradient"`, que `docs/06` §6 prohíbe. Rechazada.
- **Solo unificar Alert y Badge** sin extender a los otros nueve: corrige la deriva medida sin ampliar
  API, pero deja a W3 sin patrón y Badge rompe budget igualmente. Rechazada por el propietario.

## Consecuencias

- **Ampliación de API pública en 11 componentes** (Alert y Badge cambian de unión local a subconjunto
  del contrato; Card, Paper, Avatar, Segment, Tabs, NavLink, Pagination, Toast y Progress ganan
  `variant`), más 5 de W3 que nacen con ella. Es aditiva y los paquetes siguen `private: true`.
- **`BadgeVariant` pierde `dot`**, que no es una receta cromática sino una forma. Se conserva como prop
  propio (`dot?: boolean`) en el mismo PR; los consumidores migran `variant="dot"` a `dot`.
- **Coste de bundle de +2,07–2,21 kB brotli por componente**, medido en Badge, Avatar y Paper
  (`docs/reviews/variantes-cobertura-2026-07-28.md` §3.2). Seis primitivos se salen de su budget; lo
  resuelve **ADR-039**, que es precondición de este.
- **Coste de paridad W/N**: 13 componentes que N1/N2 implementan con el mismo subconjunto, cubierto por
  el lint de paridad. La unión no crece, así que la semilla Stellaria
  (`src/ui/tokens/src/types/variants.ts:6`, idéntica) ya la implementa.
- **El gate de contraste no cubre esto**: `BuildPairs` no lee `variantMap` y cubre 1 de las 56
  combinaciones variante×escala. **ADR-040** lo corrige y debe ir antes de propagar el patrón.
- **Todo componente que adopte `variant` pasa a ser componente cliente.** `ResolveVariant` lee el
  `variantMap` del objeto `theme` en runtime, así que exige `useTheme()` y con él `"use client"`. El
  ADR no pesó este coste cuando se aceptó: midió contrato, bundle, paridad W/N y a11y, no RSC.

  El catálogo tenía **tres** presentacionales server-safe —Badge, Paper y Progress—. Badge lo perdió al
  ejecutarse V2 y el defecto pasó inadvertido porque la regla de lint que `docs/03` §3 promete —«los
  presentacionales no llevan `use client`»— **no está implementada**. Se corrigió en el tramo V4.

  **Decisión del propietario (2026-07-28, checkpoint de V4)**: se acepta el cambio. Paper y Progress
  también pasan a cliente al adoptar `variant`. Las dos alternativas evaluadas y descartadas fueron
  excluirlos del subconjunto —que habría conservado RSC a cambio de enmendar este ADR— y darles una
  variante zero-runtime, que habría reintroducido el defecto que V2 acababa de corregir.

  **Consecuencia para `docs/03` §3**: el catálogo web queda sin primitivos de superficie renderizables
  en servidor. La fila de RSC de la tabla de budgets se acota en consecuencia: la regla sigue valiendo
  para presentacionales sin theming en runtime —los de composición pura, que son la mayoría de la capa
  de layout— y deja de valer para los temables con variantes.

- `docs/02-theming.md` §2 punto 3 deja de ser una promesa incumplida.
  `docs/patterns/web-component-template.md` §2 gana la forma canónica del subconjunto, y
  `docs/00-inventory.md` refleja la nueva API de los componentes afectados, todo en el mismo PR.

## Ejecución — enmiendas a la tabla de la regla 3

La tabla de la regla 3 se escribió antes de implementar. Tres filas cambiaron al hacerlo, y la razón
es la misma en las tres: **el subconjunto depende de qué superficie pinta el `background` de la
receta**, no solo del effects budget.

| Componente | Tabla original                                | Entregado                  | Tramo |
| ---------- | --------------------------------------------- | -------------------------- | ----- |
| Progress   | `filled · light`                              | `light · outline · ghost`  | V5    |
| Slider     | —                                             | `light · outline · ghost`  | W3.1  |
| Chip       | `filled · outline · light · ghost · gradient` | `filled · outline · light` | W3.1  |

**Progress y Slider pierden `filled` y ganan `outline · ghost`.** En los dos, el `background` de la
receta es el **track**, y el indicador —relleno de la barra, relleno del slider— conserva el acento
`scale.600`. `filled` resuelve el track a ese mismo `scale.600`: el indicador desaparecería dentro de
su propio carril. `outline` y `ghost` sí tienen sentido porque dejan el track transparente y lo
distinguen por el borde. El razonamiento completo y la medición de contraste están en
`Progress.md`; `Slider.md` registra que aplica el mismo precedente.

**Slider no estaba en la tabla** porque no estaba en el alcance de W2: es Tier 2 de `docs/00-inventory`
§1.4 y se absorbió en W3.1.

**Chip pierde `ghost` y `gradient`.** `ghost` resuelve a fondo y borde transparentes, que es
exactamente el reposo de un chip **sin marcar**: un chip marcado en `ghost` sería indistinguible de uno
sin marcar, y el estado de selección es la única información que un chip transporta. `gradient` cae
en la exclusión de `docs/06` §6 —«no es fondo dominante en tablas, formularios ni lectura larga»—
porque un chip vive en colección dentro de un formulario o una barra de filtros; Badge conserva
`gradient` porque etiqueta un elemento suelto. Queda en `Chip.md`.

La regla 6 —«los componentes de W3 nacen con su subconjunto»— se cumple: Chip nació con `variant` en
W3.1, aunque su primera implementación usó una `Palette()` local que se retiró en el mismo tramo.
Los otros cuatro componentes que la regla nombra —Banner, StatusBadge, Stepper y CardComplex— siguen
pendientes en W3.3 y W3.5.

### Decisiones anticipadas para W3.2 (checkpoint del propietario, 2026-07-30)

**Stepper: `filled · light · outline`.** La regla 6 lo nombra pero la tabla de la regla 3 no le daba
fila; esta la cierra. El eje describe **cómo se pinta el paso completado** —círculo sólido, círculo
tintado o solo aro—, que es la misma lógica marcado/sin-marcar de Chip: los pasos pendientes se quedan
en `border.default` + `text.muted` con independencia de la variante, porque son la caja vacía sobre la
que se lee el avance. Se evaluó y descartó el subconjunto corto `filled · light` de Segment: en un
bullet de 24 px `outline` es la única de las tres que distingue «completado» de «activo» sin recurrir
al icono. La demanda registrada es cero —el wrapper de tfv es `StepperPropsMantine & { fullScreen }`,
sin `variant`, mientras que su Tabs sí lo añade (`docs/api/tfv-components.md:676-678`)—, pero se
prefirió cumplir la regla 6 antes que enmendarla por tercera vez.

**Dropzone no recibe `variant`.** Es la sexta exclusión del ADR, y por un motivo que no es ninguno de
los de la regla 3: **su superficie ya está gobernada por el estado de arrastre**, no por el consumidor.
Reposo, arrastre aceptado y arrastre rechazado son tres recetas que pinta el propio componente; añadir
un eje de tres miembros encima da nueve combinaciones que habría que diseñar y que `BuildPairs`
(ADR-040) tendría que medir. La referencia coincide: tfv resuelve la personalización con un `colorBG`
suelto y sin variantes (`docs/api/tfv-components.md:464-479`). Lleva `color`, que gobierna el acento de
aceptación, y borde discontinuo fijo.

Con esto, «contrato `field`» en la fila de Dropzone de `docs/00-inventory.md` §1.4 queda leído como el
contrato de **valor** —`NebulaField` + `useFieldProps`—, no como el recipe visual `styles/field.css.ts`.
El eje `surface` de ADR-042 no le aplica: `underline` no significa nada en un área de soltar y el
recipe no produce borde discontinuo.

### Decisiones para W3.3 bloque C (checkpoint del propietario, 2026-07-30)

**StatusBadge hereda las cinco de Badge: `filled · outline · light · ghost · gradient`.** La regla 6 lo
nombra y la tabla de la regla 3 no le daba fila; esta la cierra. Se evaluó recortar `gradient`
aplicando el precedente de Chip —`docs/06` §6 lo excluye como fondo dominante en tablas, y una columna
de estados es una tabla— y también el subconjunto corto `filled · outline · light`, idéntico a Chip.

El propietario eligió la herencia completa: el hábitat que se prioriza es el **estado suelto**
—cabecera de un detalle, esquina de una tarjeta—, que es exactamente el caso por el que Badge conserva
`gradient` («etiqueta un elemento suelto»). Un StatusBadge no es un chip: no tiene estado
marcado/sin-marcar con el que `ghost` pueda colisionar, de modo que el argumento que recortó a Chip no
se traslada. La contención en tablas densas queda como decisión de composición.

**QuickAction declara la unión `Variant` entera**, igual que `Button` y `ActionIcon`. No estaba en
ninguna tabla de este ADR; `docs/00-inventory.md` §1.18 lo define como «Card+ActionIcon preset», y de
ahí salían las dos alternativas: `CardVariant` —las seis de Card, lectura literal del preset— o un
subconjunto propio `filled · outline · light · ghost`, argumentado sobre `docs/06` §6 porque un
QuickAction vive en rejilla de 4-8 y ni `glow` ni `gradient` deberían repetirse en la misma región.

El propietario eligió la lectura de **acción**: QuickAction es un control pulsable con ciclo de press
completo, así que expone el mismo eje que el resto de controles. Incluye `unstyled`, que la regla 3
declara no propagable; la regla habla de los componentes de **superficie** que ganaron `variant` en
V2–V5, y aquí llega por la puerta de `Button`, que también lo tiene. `ResolveVariant` devuelve la
receta `UNSTYLED` y la geometría del tile se conserva.

Con estas dos filas, los cinco componentes que la regla 6 nombra quedan en tres entregados —Chip
(W3.1), Stepper (W3.2) y StatusBadge (W3.3)— y dos pendientes: Banner y CardComplex, ambos en W3.5.
