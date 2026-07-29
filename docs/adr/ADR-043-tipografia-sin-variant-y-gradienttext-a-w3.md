# ADR-043 — La tipografía no recibe `variant`; `GradientText` se adelanta de W4 a W3

- **Estado**: **propuesta** · 2026-07-28 (checkpoint de la auditoría WV)
- **Enmienda**: `docs/05-roadmap.md` §W3/§W4 y `docs/00-inventory.md` §1.13.
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §2.C.

## Contexto

La pregunta del propietario incluía «¿convendría crear variantes como Button para Text, Title […]?».
`Text` y `Title` no tienen superficie: `filled` u `outline` no significan nada sobre ellos como receta
cromática. La auditoría comprobó tres cosas antes de responder.

**Lo que la API ya cubre.** `TextOwnProps` y `TitleOwnProps` extienden `BoxOwnProps`
(`Text.types.ts:5`, `Title.types.ts:8`), así que desde ADR-032 aceptan todas las style props
tipográficas: `c`, `fz`, `fw`, `ff`, `lh`, `ls`, `tt`, `td`, `ta`, `bg` (`Box.css.ts:119-165`), más
`truncate`, `lines`, `inherit` y `order`. Ese conjunto cubre el **100 %** de lo que expone el `Text` de
fonicredito, el componente tipográfico más usado de los repos de referencia —`ff · fw · c · fz · flex ·
ta · self · lh · decoration · bg · r`—, con `decoration` mapeando a `td`. En tfv, `Paragraph` es un
alias de `TextProps` de Mantine y su `variant` (`"text" | "gradient"`) tiene **cero usos**.

**Lo que la semilla hace, y por qué no se porta.** `Stellaria-Frontend` sí tiene `variant` en `Text`, y
hereda la unión de 8 miembros vía `BaseProps` (`src/ui/tokens/src/types/variants.ts:6`, idéntica a la
de Nebula). Su implementación (`.../Typography/Text/Text.tsx:29-45`) atiende **tres**: `gradient` y
`glass` delegan en subcomponentes Skia, y `outline` **renderiza el texto varias veces con offsets para
fingir un trazo**. Los otros cinco caen al render plano sin efecto. Es decir: `outline` significa
contorno de glifo en Text y borde de superficie en Button, dentro del mismo contrato compartido.

**Lo que la demanda dice.** Los 29 usos de `<Text variant>` de Stellaria están en dos archivos, ambos
bajo `src/playgrounds/mobile/src/playground/demos/` —26 en `TypographyDemos.tsx`, 3 en
`InputsDemos.tsx`—: es la matriz de demostración del propio design system. **Cero usos en código de
producto** en los tres repos de referencia.

**Dónde está el hueco real.** `docs/00-inventory.md:255` sitúa `GradientText / GradientBorder /
GradientBackground / AnimatedGradient` en Tier 3 con la nota «⚠️ requiere crear tokens `gradient.*`», y
`docs/05` §W4 entrega «Glass/Effects (con tokens `gradients`)». Los tokens ya existen:
`effects.gradients: { brand; accent; surface }` está en el contrato (`docs/02` §2.5) y los cuatro temas
lo pueblan.

## Decisión

1. **Ni `Text` ni `Title` reciben `variant`.** Su eje es el conjunto de style props tipográficas ya
   disponible; el de `Title` es además `order`, que es jerarquía semántica (ADR-024 punto 3), y
   `docs/06` §2 ya prohíbe elegir la semántica por apariencia.

2. **`GradientText` se adelanta de W4 a W3.** El caso de uso legítimo detrás de la pregunta —texto con
   gradiente— se entrega como componente dedicado, no como prop. `GradientBorder`,
   `GradientBackground`, `AnimatedGradient`, `MeshGradient` y `GrainyGradient` **se quedan en W4**: la
   dependencia que los agrupaba eran los tokens `gradient.*`, que ya existen, y `GradientText` es el
   único de los seis con demanda registrada.

3. **El componente impone el uso acotado que un prop no puede.** `docs/06` §6 fija que los gradientes
   «nunca pintan texto principal» y son «acento de marca en CTA, badge, header o hero». `GradientText`
   nace con esa restricción en su contrato: pensado para hero y titulares cortos, con un fallback de
   color sólido legible cuando `background-clip: text` no aplica o el tema baja el effects budget, y
   con `AnimatedGradient` sujeto a reduced-motion. Un `Text variant="gradient"` libre no podría
   restringir nada de eso.

4. **`TextGlass` de la semilla no se porta a web.** Depende de Skia y su equivalente web —texto sobre
   superficie translúcida— es composición: un `Text` dentro de un contenedor con `variant="glass"`.
   Queda cubierto por ADR-038 y no necesita componente propio.

## Alternativas

- **Añadir `variant` a `Text` con un subconjunto** (`gradient`, `glass`): rechazada por tres motivos
  independientes. `Text` mide 9,13 kB contra un budget de 9,5 (`size-limit`, 2026-07-28): los +2,2 kB
  de `ResolveVariant` (ADR-039) no caben. La demanda es cero fuera de las demos. Y duplicaría un
  componente ya planificado, con peor control del uso.
- **Dejar `GradientText` en W4**: es la planificación vigente y no rompe nada, pero deja sin respuesta
  operativa la pregunta que originó la auditoría hasta dos fases más tarde. Rechazada por el propietario
  en el checkpoint.
- **Adelantar el bloque `Glass/Effects` entero de W4 a W3**: rechazada. `docs/05` fija que «una fase no
  se abre sin la anterior en verde» y W3 ya es la fase más cargada del roadmap; mover seis componentes
  de efectos para resolver uno es scope creep del riesgo #2.
- **Resolverlo con style props** (`bg` con un gradiente + `backgroundClip`): rechazada. `background-clip:
text` con `color: transparent` sin fallback es un fallo de accesibilidad silencioso en cuanto el
  gradiente no carga, y una style prop no puede garantizar el fallback.

## Consecuencias

- **`docs/05-roadmap.md` §W3 gana `GradientText`** y §W4 lo pierde de su lista de Rich Content/Effects;
  `docs/00-inventory.md:255` se desglosa para que `GradientText` quede en Tier 2 y los otros cinco
  sigan en Tier 3. Ambos en el mismo PR que acepte este ADR.
- **`Text` y `Title` no cambian**: ni API, ni budget (9,13 y 9,14 kB contra 9,5), ni tests.
- **Paridad W/N**: `GradientText` es `WN` en el inventario. La implementación native de N2 ya tiene
  referencia en `TextGradient` de la semilla (Skia); la web usa `background-clip: text` sobre el token
  de gradiente del tema. El contrato de props es el que declara el lint de paridad.
- **La migración de la semilla queda acotada**: N1 no porta `variant` de `Text`, porta `TextGradient` a
  `GradientText` y descarta `TextGlass` y el `outline` de trazo, que no tienen demanda ni equivalente
  web. `docs/04-migration-map.md` recoge el cambio.
- **Contraste**: `GradientText` entra en el alcance de ADR-040 por la regla de evaluar cada stop del
  token de gradiente contra la superficie.
