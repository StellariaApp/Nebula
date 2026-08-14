# ADR-071 — Opacidad en las referencias de color

- **Estado**: **aceptada** · 2026-08-02 — aprobada por el propietario en el arranque de WB ·
  **§4 enmendado por [ADR-140](ADR-140-la-opacidad-alcanza-a-los-peldanos-de-escala.md)** (2026-08-13):
  la opacidad sí alcanza a los peldaños de escala en `c`/`bg`. El resto sigue vigente.
- **Resuelve**: el tramo **B5** de
  [`brand-alignment-plan-2026-08-02.md`](../reviews/brand-alignment-plan-2026-08-02.md). Un consumidor
  no puede pedir un rol de color a una fracción de opacidad; el sistema sí lo hace internamente.
- **Amplía**: `ColorExtended` y `ColorRoleToken` en `@stellaria/nebula-tokens`, y las tres props de
  color de los style props (`c`/`color`, `bg`/`background`, `bdc`/`borderColor`).
- **Depende de**: [ADR-032](ADR-032-style-props-en-todo-el-catalogo.md) (style props en todo el
  catálogo) y [ADR-064](ADR-064-suposiciones-del-resolver-de-variantes.md) (`ResolveVariant`).

## Contexto

La gramática de opacidad **ya existe y ya se usa**, pero solo en media rama del resolver.

`ColorExtended` declara `` `${ColorScaleName}.${ColorShade}.${number}` `` (`types/colors.ts:20`) y
`ResolveAccent` la aplica con `color-mix` (`utils/scale.ts:51-53`). `resolve-variant.ts:47-48` la
consume hoy: `scale.500.10` para el hover transparente y `scale.500.16` para el active.

Lo que no existe es lo mismo sobre un **rol**. Y el hueco no es un tipo que falte: es una pérdida
silenciosa. `ResolveAccent` retorna en `utils/scale.ts:39` cuando el grupo es `surface`, `text` o
`border`, y **descarta el tercer segmento sin avisar** — `border.subtle.40` devuelve `border.subtle`
a opacidad completa.

En los style props el camino es otro y el resultado es peor. `color`, `background` y `borderColor`
son sprinkles con mapa **cerrado** (`Box.css.ts:162-164`): un valor que no está en el mapa no
degrada, **rompe el typecheck**. Es exactamente lo que pasó en
`apps/playground-web/src/stories/Landing.stories.tsx:303-309`, que ya escribía
`borderColor="border.subtle.40"` contra una gramática que nadie había implementado y dejó `main` sin
compilar.

## Decisión

1. **La gramática de opacidad se extiende a los roles.** `ColorRoleToken` gana su variante con
   sufijo y `ColorExtended` la incluye. Un rol y un peldaño de escala se piden igual:

   ```
   border.subtle.40     surface.raised.60     text.primary.70     accent.500.12
   ```

   El sufijo es el **porcentaje de opacidad**, entero, y se compone contra `transparent` con
   `color-mix(in srgb, …)` — el mismo mecanismo que ya emite `ResolveAccent`, no uno nuevo.

2. **`ResolveAccent` aplica el alpha también en la rama de roles.** Deja de descartar el tercer
   segmento. Ningún componente del catálogo depende hoy del comportamiento anterior: no hay un solo
   rol con tres segmentos en `packages/`.

3. **En los style props, un valor con alpha no pasa por sprinkles.** Se resuelve a `color-mix` y se
   emite como **declaración inline**. Los valores sin alpha siguen exactamente por donde iban: misma
   clase atómica, mismo CSS, coste cero.

   La bifurcación va en `ExtractStyleProps`, que es donde ya se decide qué prop es sprinkle y qué prop
   es estilo (`utils/style-props.ts:63-91`).

4. **Alcance en style props: los roles, no los peldaños de escala.** _(Enmendado por ADR-140: el
   coste que motiva este recorte quedó pagado por ADR-103, y `c`/`bg` admiten hoy opacidad sobre las
   escalas. `bdc` sí conserva el alcance de rol.)_ Las tres props —`c`/`color`,
   `bg`/`background`, `bdc`/`borderColor`— admiten opacidad sobre `surface.*`, `text.*` y `border.*`.
   Un peldaño de escala (`accent.500.12`) sigue resolviéndose **solo** por `ResolveAccent`, que es
   donde se usa hoy (`resolve-variant.ts:47-48`); como style prop no lo usa nadie en el repo.

   El recorte no es de gusto, es de tamaño: el mapa que la resolución necesita en runtime pasa a
   estar vivo en todo módulo que use style props. Con los 19 roles cuesta ~330 B brotli por módulo;
   añadiendo los 77 peldaños de escala, entre 0.8 y 1.3 kB. Ver Consecuencias.

   No se extiende a `boxShadow` ni a los gradientes: ahí la opacidad forma parte de la receta del
   token, no de la referencia.

5. **El mapa de roles se resuelve en build-time, no en runtime.** `Box.css.ts` exporta `ROLE_COLORS`
   y `ExtractStyleProps` lo consume. Lo que **no** puede hacer es importar `vars` directamente: al
   ser `style-props.ts` un módulo de runtime y no un `.css.ts`, ese import arrastra
   `contract.css.js` entero (10 kB) a cada componente. Medido: 20 presupuestos rebasados por esa vía
   contra 4 por esta.

## Alternativas

**Enumerar los pasos de alpha dentro del mapa de sprinkles.** Descartada por dos motivos, y el
segundo es el que decide.

_Coste, medido sobre el mapa actual_: `PALETTE_COLORS` tiene 99 entradas (22 roles + literales, más
7 escalas × 11 peldaños) y `ROLE_COLORS` 22. Como las tres props viven en `UNRESPONSIVE`
(`Box.css.ts:144-167`), hoy son **220 clases** de color. Con nueve pasos de opacidad pasarían a
**1.980** — un 9× sobre un CSS que `size-limit` ya vigila.

_Y no es enumerable_: el repo ya usa `.10`, `.16` y `.40`. Cualquier lista que se elija se queda
corta la primera vez que un tema necesite un valor intermedio, y la alternativa —permitir cualquier
entero— es justo lo que un mapa estático no puede hacer.

**Un rol nuevo por cada opacidad necesaria** (`border.subtleFaint`). Descartada: multiplica el
contrato `NebulaTheme` por cada variación de una dimensión que es continua, y obliga a cada tema a
calibrar valores que se derivan del que ya declaró.

## Consecuencias

- **Un valor con alpha emite `style` inline en vez de clase atómica.** No se pierde ninguna
  capacidad: las tres props de color son `UNRESPONSIVE` y **hoy ya no admiten forma condicional**, así
  que no había nada responsive que perder.

- **El CSS no crece; el JS sí, ~330 B brotli por módulo.** La hoja atómica se queda en 7.51 kB sobre
  un presupuesto de 8 kB —ese era el objetivo del diseño y se cumple—, pero exportar `ROLE_COLORS`
  impide que el bundler lo elimine tras evaluar los sprinkles. Medido sobre las 192 entradas de
  `size-limit`: **174 crecen, con media ~330 B**. La holgura de los presupuestos absorbe casi todo:
  solo cuatro se rebasaban, y por 4-61 B.

  Doce presupuestos suben en este cambio. Nueve por el coste de aquí —`Text`, `Scroll`, `Divider`,
  `Hero`, `Footer`, `Tabs`, `Card`, `NavLink`, `PermissionGate`, todos 0.5 kB— y tres que **ya
  estaban rebasados en `main`** sin que nadie lo viera: `NebulaProvider` (+188 B) y `useTheme`
  (+124 B), más `Footer`. El gate llevaba roto desde que `Banner` se renombró a `Hero` y su ruta
  quedó apuntando a un fichero inexistente, lo que abortaba la corrida entera antes de medir nada.

- **El inline gana sobre las reglas sin capa, y eso es parte del valor.** Un recipe que declara sus
  variantes fuera de `baseLayer` pisa hoy en silencio a los style props —`Divider.css.ts:46-54` es el
  caso vivo—. Con la declaración inline, `borderColor` con alpha obedece incluso ahí. **No sustituye
  al arreglo**: el patrón de variantes fuera de capa sigue siendo un defecto y se corrige por su
  cuenta; lo que esta decisión hace es no depender de él.

- **`color-mix` no es una capacidad nueva del bundle.** `utils/scale.ts:26` ya lo emite, así que la
  matriz de soporte no se mueve.

- **El suelo de contraste no lo cubre ningún gate.** `check:contrast` mide el token, no el color
  compuesto: `text.primary.40` puede pasar el gate y ser ilegible. La regla operativa es que la
  opacidad se usa en **superficie, borde y decoración**, no en texto informativo; un texto a opacidad
  parcial se mide sobre el render antes de darlo por bueno.

- Un sufijo no numérico deja el color base sin alpha, que es el comportamiento que `ResolveAccent` ya
  tenía para las escalas (`Number.isFinite`, `utils/scale.ts:52-53`).
