# ADR-040 — `BuildPairs` derivado de `variantMap` en `tools/contrast-check`

- **Estado**: **propuesta** · 2026-07-28 (checkpoint de la auditoría WV)
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §3.4.

## Contexto

`docs/03` §4.2 describe el gate de contraste como el que «valida cada par texto/superficie y estado de
cada tema oficial contra AA». El gate corre verde:

```
28 pares · 28 PASS · 0 FAIL
✔ Gate de contraste en verde para 5 temas.
```

Pero `tools/contrast-check/src/pairs.ts` **no lee `theme.variantMap` en ningún punto**. Los 28 pares
son una lista escrita a mano: roles de texto sobre las cuatro superficies, `text.inverted` sobre
`gray.900`, los cuatro semánticos `.700` sobre `surface.base`, `border.strong`/`border.focus` sobre las
cuatro superficies, y dos pares etiquetados `(filled)` y `(filled:hover)`.

Esos dos últimos son el problema. `pairs.ts:36-47` fija `bg: (t) => t.colors.primary["600"]` como
literal, no como la resolución de `theme.variantMap.filled.background`. En `playful`, cuya receta
`filled` es `gradient.brand` (`packages/themes/src/__tests__/official-themes.test.ts:49`), **el gate
comprueba un color que el componente no pinta**.

La cobertura real, medida: de las **56 combinaciones** alcanzables hoy (8 variantes × 7 escalas
semánticas), el gate cubre **una y su hover**, y por coincidencia de haber escrito a mano un par que
casualmente coincide con la receta de `nebula-light`/`nebula-dark`. `outline` (`fg: scale.700` sobre
transparente), `light` (`fg: scale.800` sobre `scale.500.12`) y `ghost` (`fg: scale.700`) no están
cubiertas en ninguna escala.

Esto significa que el coste marginal de accesibilidad de ADR-038 es literalmente cero — no porque sea
seguro, sino porque no hay nada que lo mida. Extender `variant` a once componentes más multiplicaría
una superficie **no cubierta**.

## Decisión

1. **`BuildPairs()` deriva los pares de variante del contrato en vez de listarlos.** Para cada
   `[variant, recipe]` de `theme.variantMap` y cada escala de `SemanticScaleName`, se emite un par
   `recipe.foreground` sobre `recipe.background`, resuelto contra las escalas del tema.

2. **La aritmética de resolución es la misma que la de `packages/web/src/theme/resolve-variant.ts`**:
   `scale.<shade>` contra la escala pedida, `scale.<shade>.<alpha>` compuesto sobre la superficie de
   fondo, y `surface.*`/`text.*`/`border.*` contra sus roles. Un `color-mix` con alpha se evalúa
   **sobre `surface.base`**, que es el peor caso realista de una variante translúcida. Si las dos
   implementaciones divergen, el gate deja de significar lo que dice; el ADR fija que la aritmética
   vive en un solo módulo compartido y que `tools/` la importa, no la reescribe.

3. **Los mínimos siguen la clase del par, no la variante**: 4.5:1 cuando el par es texto sobre
   superficie; 3:1 cuando el elemento evaluado es el borde de la variante contra la superficie
   circundante (criterio de componente UI, `docs/03` §1 regla 4).

4. **Las variantes sin par evaluable se declaran exentas y se documentan, no se omiten en silencio.**
   `unstyled` no pinta nada; `gradient` resuelve a un `linear-gradient` cuyo contraste depende de la
   posición, de modo que se evalúa contra **cada stop** del token de gradiente y se exige que el peor
   cumpla; `glass` depende de lo que haya detrás y se evalúa contra `surface.base` y `surface.raised`
   con `effects.glass.enabled` en ambos estados.

5. **Se espera que el gate se ponga rojo al aplicarlo, y eso es el resultado, no un fallo del tramo.**
   Los fallos que destape se triagean en el mismo tramo: cada uno es o una receta que hay que corregir
   en los cuatro temas, o un par cuya exención hay que justificar por escrito. **Ninguno se resuelve
   bajando el mínimo.**

6. **Este ADR precede a la propagación de ADR-038.** Descubrir que las recetas actuales fallan AA
   *después* de propagarlas a once componentes multiplica por once el trabajo de corrección.

## Alternativas

- **Dejar `BuildPairs` como está y cubrir las variantes con axe sobre stories**: axe ya corre sobre
  todas las stories (`docs/03` §4.1) y detectaría contraste insuficiente en lo que las stories rendericen.
  Rechazada: axe cubre lo que alguien se acordó de renderizar, no las 56 combinaciones × 5 temas, y el
  Theme Creator necesita el mismo motor en vivo (`docs/02` §5.3) sobre un tema que aún no tiene stories.
- **Añadir a mano los pares que faltan** (56 literales en `pairs.ts`): funciona hoy y vuelve a estar
  desincronizado el día que un tema remapee una receta, que es el defecto exacto que se está
  corrigiendo. Rechazada.
- **Evaluar solo las variantes de los componentes que existen**: menos pares y menos falsos positivos,
  a cambio de que el gate deje de ser una propiedad del **tema** y pase a depender del catálogo. Un
  tema de tenant debe validar antes de que exista el componente que lo use. Rechazada.

## Consecuencias

- El gate pasa de 28 pares a ~28 + 56 por tema (~420 comprobaciones sobre los 5 temas, frente a 140).
  El coste de ejecución es despreciable: el CLI actual resuelve 140 en menos de un segundo.
- **`tools/contrast-check` gana una dependencia de la aritmética de resolución.** Hoy `resolve-variant.ts`
  vive en `packages/web` y `tools/` no puede importarlo sin invertir el grafo de deps de `docs/01` §8.
  La resolución correcta es extraer la aritmética pura —sin `vars` de VE— a `@stellaria/nebula-tokens`,
  que tiene cero dependencias de runtime, y que web y tools la consuman. Es la parte de diseño de este
  ADR que hay que resolver al implementarlo.
- **Es previsible una tanda de correcciones de receta en los cuatro temas oficiales**, con su
  `check:contrast` en verde como criterio de cierre.
- `docs/03` §4.2 se actualiza para decir lo que el gate hace de verdad.
- Beneficio colateral: el Theme Creator (`docs/02` §5.3) valida en vivo las recetas de variante que hoy
  no puede validar, que es donde un tenant tiene más probabilidad de romper AA.
