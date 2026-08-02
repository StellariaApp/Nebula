# ADR-064 — Las dos suposiciones no escritas de `ResolveVariant`

- **Estado**: **aceptada** · 2026-08-01 (checkpoint de CONTRATO de WR3)
- **Resuelve**: las causas **C13** y **C17** de `docs/reviews/visual-audit-2026-08-01.md`. Se tratan
  en un solo ADR porque son la misma clase de problema, no dos.
- **Enmienda**: el contrato `VariantRecipe` de `@stellaria/nebula-tokens` y el comportamiento de
  `packages/web/src/theme/resolve-variant.ts`.
- **Origen**: `docs/reviews/visual-audit/fechas-y-media.md` A-1 y
  `docs/reviews/vibrancia-dark-vs-light-2026-07-31.md`.

## Contexto

`ResolveVariant` traduce una receta del `variantMap` a valores CSS. Hace **dos suposiciones que no
están escritas en ningún sitio**, y las dos se rompieron el mismo día, por caminos independientes.

### Suposición 1 — «lo que me den como fondo será un color»

`Calendar.tsx:77` y `RangeCalendar.tsx:86` derivan el fondo del rango así:

```
[rangeBg]: `color-mix(in srgb, ${resolved.background} 16%, transparent)`
```

En tres temas `resolved.background` es un color y funciona. En `playful` es un **gradiente**
—medido: `linear-gradient(135deg, rgb(167,44,196) 0%, rgb(206,0,10…)`—, y
`color-mix(in srgb, linear-gradient(…) 16%, transparent)` **no es válido**: la declaración se
descarta y el fondo cae a transparente.

| Tema                                           | fondo del rango medido    |
| ---------------------------------------------- | ------------------------- |
| `nebula-dark` · `nebula-light` · `sober-light` | `color(srgb … / 0.16)` ✅ |
| **`playful`**                                  | **`rgba(0, 0, 0, 0)`** ❌ |

**El `fallbackVar(rangeBg, primary.100)` del CSS no protege**, porque la variable sí está definida —
lo inválido es su contenido. Consecuencia para el usuario: seleccionar un rango de fechas **no
muestra el rango**.

No es un defecto de `playful`: es de **cualquier tema cuyo `variantMap` resuelva a un gradiente**, y
el Theme Creator permite construirlos.

### Suposición 2 — «el hover va siempre hacia el 950»

`resolve-variant.ts:320` deriva el hover con `ShiftRef(recipe.background, 1)`, y `ShiftRef` mueve
**siempre +1 en el array de `SHADES`**, o sea hacia el extremo oscuro de la escala.

- En **light**, `600 → 700` oscurece: con texto blanco, el contraste **sube**. ✅
- En **dark**, la escala está espejada (`FlipScale`), así que `600 → 700` **aclara**. Funcionaba
  porque la base también era clara y el texto era casi negro. ✅
- Al intentar que el primario de dark use el mismo color que light —petición del propietario del
  2026-07-31—, la base se mueve al lado oscuro y el hover se va hacia la luz **con texto blanco**:
  **3.70**, por debajo de AA. `check:contrast` tumbó **14 pares** de golpe, todos de hover.

**No hay arreglo acotado**: invertir el signo en temas `dark` arreglaría `filled` y `glow` pero
rompería la variante `light`, cuyo tinte al 12 % **debe aclararse** en hover — `docs/06` §5.1 es
explícito: «en light el hover **oscurece**; en dark **aclara**».

### Por qué son la misma causa

Las dos son **el resolver dando por hecho algo sobre lo que recibe**, sin que el contrato lo
garantice ni lo prohíba. `FlipScale` tiene horneado el supuesto de que en dark las superficies de
marca son claras y su texto oscuro; `color-mix` tiene horneado el supuesto de que el fondo es un
color. Ninguno de los dos está escrito, y por eso los dos sobrevivieron a todos los gates.

## Decisión

1. **`ResolvedVariant` expone siempre un color plano**, además del fondo real. Las derivaciones
   —`color-mix`, `WithAlpha`, tintes, halos— consumen **ese** campo, nunca `background`. Cuando el
   fondo es un gradiente, el color plano es su primera parada.

2. **Ninguna derivación de color recibe un gradiente.** Es la regla que faltaba, y se enuncia en el
   contrato para que valga también en native. Un gradiente es una decisión de pintura, no un valor
   del que se pueda derivar.

3. **La dirección del hover deja de estar horneada en `ShiftRef`.** `VariantRecipe` gana la
   información necesaria para saber hacia dónde se separa cada variante, en vez de asumir que todas
   se separan hacia el mismo lado. `active` sigue siendo el doble del delta de `hover`, como fija
   `docs/06` §5.1 — lo que cambia es el signo, no la magnitud.

4. **El criterio es la separación, no el esquema.** §5.1 describe el síntoma («en light oscurece, en
   dark aclara») pero la regla de fondo es que **el hover se aleja de la superficie sobre la que se
   apoya el elemento**. Enunciarlo así hace que `filled` (fondo oscuro, texto blanco) y `light`
   (tinte claro sobre lienzo oscuro) salgan bien con la misma regla, que es lo que hoy no ocurre.

5. **`check:contrast` ya cubre esto y hay que conservarlo.** Los 14 FAIL de hover los detectó el gate,
   no la auditoría. Cualquier implementación de este ADR se valida con él antes de darse por buena.

## Alternativas

- **Dos ADRs separados.** Era la lectura inicial. Descartada en el checkpoint al ver que las dos son
  la misma clase de suposición: separarlas habría producido dos arreglos locales sin enunciar la
  regla común.
- **Invertir el signo de `ShiftRef` según `theme.meta.scheme`.** Tres líneas y arregla `filled` y
  `glow`. **Medido que rompe `light`**: su tinte al 12 % se oscurecería en hover sobre un lienzo
  oscuro, o sea se haría menos visible — exactamente lo contrario de §5.1.
- **Prohibir gradientes en `variantMap.primary`.** Resolvería C13 sin tocar el resolver, a cambio de
  quitarle al Theme Creator una capacidad que hoy tiene y que `playful` usa.
- **Resolver el gradiente a color solo en `Calendar`.** El arreglo mínimo. Descartado: `color-mix` y
  `WithAlpha` se usan en más sitios, y el siguiente que derive de un fondo de variante volverá a
  romperse en silencio.
- **No hacer nada.** Evaluada: ninguna de las dos bloquea la publicación —el rango solo falla en temas
  con `primary` de gradiente y la vibrancia dark/light es una preferencia—. Descartada porque C13 es
  un defecto funcional con síntoma visible y C17 bloquea una petición explícita del propietario.

## Consecuencias

- **Toca el contrato compartido**, así que `packages/native` nace con la regla en vez de heredarla a
  medias — igual que ADR-063.
- **Desbloquea igualar el color de marca de dark al de light**, que es lo que motivó la
  investigación. Con la dirección de hover desacoplada, `filled` puede usar el peldaño oscuro en dark
  sin que el hover lo empuje hacia la luz.
- **Los 14 pares de hover que hoy fallarían pasan a ser verificables por `check:contrast`** en vez de
  aparecer al intentar un cambio.
- **Lo que este ADR no decide**: si el primario de dark termina usando el mismo hex que light. Eso
  sigue siendo una decisión de identidad (ADR-020) y de calibración, no de contrato. Este ADR solo
  retira el impedimento técnico que la hacía imposible.
- **Deuda declarada**: `ShiftRef` es el sitio donde afloró, pero `active` (`ShiftRef(…, 2)`) comparte
  el problema y `TRANSPARENT_HOVER`/`TRANSPARENT_ACTIVE` son constantes fijas —`scale.500.10` y
  `scale.500.16`— que tampoco dependen del esquema. La implementación tiene que mirar los tres.
