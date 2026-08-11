# ADR-119 — El radio lo manda la style prop, no una prop por componente

- **Estado**: aceptada · 2026-08-09 (decisión del propietario: «que todos tomen solamente el de Box,
  es el primitivo que manda») · **WN**
- **Cambia API pública**: sí. **Rompe**: la prop `radius` desaparece de **12** componentes. Los de
  lista corta se quedan como están, por decisión del propietario: son casos especiales.
- Lo destapó el propietario mirando `GlassSurface` y preguntando por qué tiene su propio sistema de
  radio en vez del de `Box`.

## Contexto

`GlassSurface` no tiene «su propio sistema». Tiene **dos**, y compiten.

`GlassSurfaceOwnProps` extiende `BoxOwnProps`, así que hereda la style prop `r`. Y además declara
`radius` propio. Los dos escriben `border-radius` sobre el mismo elemento:

| vía      | dónde se emite                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `radius` | variante del `recipe`, **sin capa** — a diferencia de `base` y `withBorder`, que sí van en `base_layer` |
| `r`      | sprinkle de `Box`, **sin capa** — `createSprinkles` sin `layer()`                                       |

Dos reglas de una clase, ninguna en capa: **gana la que caiga después en el CSS emitido**. No es una
precedencia declarada, es el orden de los archivos. `<GlassSurface radius="xl" r="md">` no tiene
respuesta definida.

**No es un caso aislado: son 19 componentes**, y `StyleProps` trae `r` igual que `BoxOwnProps`, así
que basta con extender cualquiera de los dos para heredar el conflicto. (Este censo se quedó corto:
son 28. Ver la enmienda del censo, más abajo.)

## Los tres casos, porque no son el mismo

**1. Duplicación pura — 6 componentes.** `AnimatedGradient`, `GlassSurface`, `GradientBackground`,
`GradientBorder`, `MeshGradientBg`, `Paper` declaran `radius?: RadiusName | number`. La style prop es
`radius("borderRadius")` con `open: true, length: true`, o sea que acepta **tokens, números y valores
libres**. `r` es un superconjunto estricto. No hay nada que `radius` pueda expresar y `r` no.

**2. Duplicación con un valor de más — 9 componentes.** `BlurOverlay`, `Card`, `Image`,
`ImageGallery`, `LoadingOverlay`, `NoiseOverlay`, `Overlay`, `QuickAction`, `Skeleton`. Cuatro de
ellos admiten `"none"`, que no es CSS válido para `border-radius` y se traduce internamente a `0`.
Con `r` se escribe `r={0}`.

**3. Una restricción, y se queda — 4 componentes.** `Avatar` y `Badge` aceptan
`"sm" | "md" | "full"`; `Modal`, `"none" | "sm" | "md" | "lg"`; `Popover`, `"sm" | "md" | "lg"`. Ahí
`radius` **no es duplicación**: es una lista corta deliberada, y quitarla ampliaría el API en vez de
reducirlo. Un `Badge` no debería poder ser `xxl`.

**Los cuatro quedan fuera de este ADR**, por decisión del propietario.

**Enmienda del 2026-08-09 — el censo se quedó corto, y por los dos extremos.** Al regenerar
`apps/web/generated/api.json` se vio que `radius` había desaparecido de **12** props y no de las 15
que dice la decisión. Tirando de ahí, el reparto de los tres casos falla en dos sitios:

- **Del caso 2 solo se migraron 6 de 9.** `Image`, `ImageGallery` y `Skeleton` se retuvieron al
  inspeccionar a qué elemento apunta su `radius`: no a la raíz, sino a `styles.background`, a cada
  baldosa y a cada línea. Migrarlos no es un renombre —`r` redondearía la raíz y dejaría el interior
  cuadrado—, así que **son un cuarto caso**, no una excepción sin nombre. Pendiente de confirmar
  (D-2 en `docs/NOTAS-PARA-REVISAR.md`).
- **El caso 3 son 11 componentes, no 4.** El censo se hizo buscando la variante `radius` en los
  `recipe`, y siete se escapan por dos vías que esa búsqueda no cubre: `Chip`, `ColorSwatch`,
  `ScrollProgress`, `Tag` y `ThemeIcon` aplican su lista con un mapa de `styleVariants` sobre la
  misma raíz, y `Drawer` y `StatusBadge` la reenvían a `Modal` y a `Badge`. Mismo choque, misma lista
  corta (`"sm" | "md" | "full"`, con variaciones), mismo agujero. Entran en el guardarraíl de lint;
  no había ninguna llamada `r=` sobre ellos, así que no rompe nada.

Con el cuarto caso reconocido, el reparto real de los **28** componentes que declaraban `radius`
queda así, y suma:

| caso                                       | cuántos | qué se hizo                         |
| ------------------------------------------ | ------: | ----------------------------------- |
| 1 y 2 — duplicación pura sobre la raíz     |      12 | `radius` desaparece                 |
| 3 — lista corta sobre la raíz              |      11 | se queda, cerrado con lint          |
| 4 — el radio apunta a un elemento interior |       5 | se queda; `r` redondearía otra cosa |

El cuarto caso son `EditorImage`, `Image`, `ImageGallery`, `Progress` y `Skeleton`. Los cinco
extienden `StyleProps`, pero su `radius` va a `styles.trigger`, a `styles.background`, a cada
baldosa, a la var del track y a cada línea — nunca a la raíz. Por eso no hay choque que cerrar: `r`
y `radius` gobiernan elementos distintos.

**Enmienda del 2026-08-09**: el guardarraíl era poroso —todos extienden `StyleProps`, así que
`<Badge r="xxl">` se escribía y ganaba— y se cierra **con lint, no con tipos**: un
`no-restricted-syntax` sobre `JSXOpeningElement` cuyo nombre esté en la lista, con la prop `r`. La
lista es `SHORT_LIST_RADIUS` en `eslint.config.js` y son los **once** de la enmienda del censo.

Se eligió sobre capar `r` con `Omit<StyleProps, "r">` porque eso habría convertido a estos once en
la excepción **contraria** a la que decide este ADR para los doce que sí migran. El lint cierra el agujero
donde hay un motivo de diseño sin tocar el principio de que el primitivo manda, y deja una salida
explícita —un `eslint-disable`— para quien tenga una razón.

## Decisión

**`radius` desaparece de los 12 de duplicación. El radio se pide con `r`, la style prop de `Box`.**

Un solo camino, y el que ya funciona en los 142 componentes del catálogo que nunca declararon `radius`.

### El defecto del componente se conserva

Es lo único que una style prop no puede hacer por sí sola, y es la razón por la que `radius` existía.
Se resuelve desestructurando con defecto y devolviendo el valor a la extracción:

```tsx
const { r = "lg", ...style_rest } = props;
const { className: sprinkle_class, style, rest } = ExtractStyleProps({ r, ...style_rest });
```

`GlassSurface` sigue naciendo en `lg`, `Card` en `md`, `Overlay` sin radio. Nadie nota el cambio
salvo quien escribiera `radius=`.

### La variante `radius` sale de los recipes

Once hojas la declaran. Deja de existir: el radio ya no genera una clase por peldaño, lo pone la
sprinkle. De paso desaparece el `named_radius`/`inline_radius` que cada componente repetía para
soportar números.

Ahí había un defecto real: en `Paper`, un `radius` numérico caía a la clase `"md"` —no a su defecto
`"lg"`— y luego la pisaba el estilo inline. Emitía una clase que no se usaba.

### Lo que NO se hace

**No se meten las sprinkles en una capa.** Arreglaría la precedencia de las 128 style props de golpe,
no solo la del radio, y es exactamente por eso que no entra aquí: es tocar la cascada entera del
catálogo a un mes de W5. Queda anotado como deuda, y este ADR lo deja mejor preparado —una fuente
menos con la que competir.

## Alternativas descartadas

**`Omit<BoxOwnProps, "r">` en los 12, conservando `radius`.** Era la recomendación inicial: también
deja un solo camino y no rompe a quien use `radius`. El propietario eligió lo contrario, y con razón
—el primitivo es el que manda, y una prop por componente que hace lo mismo que una style prop es
superficie de API que hay que documentar, testear y mantener en dos sitios—. Además `Omit` habría
dejado a 12 componentes siendo la excepción de una convención que rige para 142.

**Dejar las dos y documentar cuál gana.** La peor: seguiría dependiendo del orden de emisión, que no
es algo que un consumidor pueda razonar ni un test fijar de forma estable.

## Consecuencias

- **Rompe**: `radius` en 12 componentes. La migración es mecánica —`radius=` → `r=`, y
  `radius="none"` → `r={0}`—, y fueron **201 llamadas** convertidas en 101 archivos de stories, demos
  y el sitio.
- **Once componentes conservan su `radius` de lista corta** (ver la enmienda del censo), y con él la
  deuda de que `r` la saltaba. La cierra la regla de lint, no los tipos.
- **Once hojas adelgazan** —las de lista corta conservan su variante— y el CSS emitido pierde sus
  clases de radio.
- Los `.md` de módulo que documenten `radius` se corrigen en el mismo PR.
- El baseline visual **no debería moverse**: los defectos se conservan uno a uno. Si alguna captura
  cambia, es que un defecto no se trasladó bien, y hay que mirarlo en vez de rebasarlo.
