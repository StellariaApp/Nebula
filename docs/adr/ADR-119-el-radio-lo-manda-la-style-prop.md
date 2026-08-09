# ADR-119 — El radio lo manda la style prop, no una prop por componente

- **Estado**: aceptada · 2026-08-09 (decisión del propietario: «que todos tomen solamente el de Box,
  es el primitivo que manda») · **WN**
- **Cambia API pública**: sí. **Rompe**: la prop `radius` desaparece de **15** componentes. Los
  cuatro de lista corta se quedan como están, por decisión del propietario: son casos especiales.
- Lo destapó el propietario mirando `GlassSurface` y preguntando por qué tiene su propio sistema de
  radio en vez del de `Box`.

## Contexto

`GlassSurface` no tiene «su propio sistema». Tiene **dos**, y compiten.

`GlassSurfaceOwnProps` extiende `BoxOwnProps`, así que hereda la style prop `r`. Y además declara
`radius` propio. Los dos escriben `border-radius` sobre el mismo elemento:

| vía      | dónde se emite                                                                      |
| -------- | ----------------------------------------------------------------------------------- |
| `radius` | variante del `recipe`, **sin capa** — a diferencia de `base` y `withBorder`, que sí van en `base_layer` |
| `r`      | sprinkle de `Box`, **sin capa** — `createSprinkles` sin `layer()`                    |

Dos reglas de una clase, ninguna en capa: **gana la que caiga después en el CSS emitido**. No es una
precedencia declarada, es el orden de los archivos. `<GlassSurface radius="xl" r="md">` no tiene
respuesta definida.

**No es un caso aislado: son 19 componentes**, y `StyleProps` trae `r` igual que `BoxOwnProps`, así
que basta con extender cualquiera de los dos para heredar el conflicto.

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

**Enmienda del 2026-08-09**: el guardarraíl era poroso —los cuatro extienden `StyleProps`, así que
`<Badge r="xxl">` se escribía y ganaba— y se cierra **con lint, no con tipos**: un
`no-restricted-syntax` sobre `JSXOpeningElement[name.name=/^(Avatar|Badge|Modal|Popover)$/] >
JSXAttribute[name.name="r"]`.

Se eligió sobre capar `r` con `Omit<StyleProps, "r">` porque eso habría convertido a estos cuatro en
la excepción **contraria** a la que decide este ADR para los otros once. El lint cierra el agujero
donde hay un motivo de diseño sin tocar el principio de que el primitivo manda, y deja una salida
explícita —un `eslint-disable`— para quien tenga una razón.

## Decisión

**`radius` desaparece de los 15 de duplicación. El radio se pide con `r`, la style prop de `Box`.**

Un solo camino, y el que ya funciona en los otros 139 componentes del catálogo.

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

Doce hojas la declaran. Deja de existir: el radio ya no genera una clase por peldaño, lo pone la
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

**`Omit<BoxOwnProps, "r">` en los 15, conservando `radius`.** Era la recomendación inicial: también
deja un solo camino y no rompe a quien use `radius`. El propietario eligió lo contrario, y con razón
—el primitivo es el que manda, y una prop por componente que hace lo mismo que una style prop es
superficie de API que hay que documentar, testear y mantener en dos sitios—. Además `Omit` habría
dejado a 15 componentes siendo la excepción de una convención que rige para 139.

**Dejar las dos y documentar cuál gana.** La peor: seguiría dependiendo del orden de emisión, que no
es algo que un consumidor pueda razonar ni un test fijar de forma estable.

## Consecuencias

- **Rompe**: `radius` en 15 componentes. La migración es mecánica —`radius=` → `r=`, y
  `radius="none"` → `r={0}`—, y son **~225 llamadas** en stories, demos y el sitio.
- **`Avatar`, `Badge`, `Modal` y `Popover` conservan su `radius`**, y con él la deuda: su lista
  corta la salta cualquiera escribiendo `r`. Cerrarla es otra decisión.
- **Ocho recipes adelgazan** —los cuatro de lista corta conservan su variante— y el CSS emitido
  pierde nueve clases por cada uno.
- Los `.md` de módulo que documenten `radius` se corrigen en el mismo PR.
- El baseline visual **no debería moverse**: los defectos se conservan uno a uno. Si alguna captura
  cambia, es que un defecto no se trasladó bien, y hay que mirarlo en vez de rebasarlo.
