# ADR-180 — La semilla declara los cuatro ejes, y las esquinas son cinco

- **Estado**: **aceptada** · 2026-08-23 — decidida por el propietario
- **Cambia API pública**: sí. `ThemeSeed` gana `corner` y `density`, y **`glass` pasa de `boolean` a
  `Glass`** (`"off" | "sheer" | "frosted" | "milky"`). `@stellaria/nebula-themes` exporta el
  vocabulario de los cuatro ejes, que hasta ahora vivía en `@stellaria/nebula-demos`.
- **Enmienda**: [ADR-178](ADR-178-el-velo-vuelve-a-ser-cristal-y-la-intensidad-es-un-eje.md) §3 y
  [ADR-179](ADR-179-una-rampa-reparte-el-cristal-y-la-pila-de-superficies.md) — el eje `glass` deja
  de ser solo de la capa de demo.
- **Toca**: `packages/themes`, `packages/demos`, `apps/web`.

## Contexto

`motion`, `glass`, `corner` y `density` son presets sobre lo que el contrato **ya** tiene:
`motion.tier`, `effects.glass`, `radius` y `spacing.unit`. Dos de ellos —`motion` y `glass`— ya se
podían declarar en la semilla; los otros dos no, y su vocabulario vivía en la capa de demo, que la
semilla no puede ver.

Con eso, un producto no podía traer sus valores puestos: llegaba con el radio y el espaciado de la
base y el visitante tenía que elegirlos a mano, aunque el producto tuviera opinión.

Y el eje `corner` tenía tres peldaños —`sharp · soft · round`— con un salto grande entre ellos: entre
recto y el radio del tema no había nada, y entre el del tema y redondo tampoco.

## Decisión

**Los cuatro ejes se declaran en la semilla y `BuildProduct` los materializa en el tema.**

```ts
apolo: {
  ...
  ramp: [10, 20, 60],
  glass: "sheer",
  motion: "standard",
  corner: "soft",
  density: "cosy",
}
```

El panel no necesita saber nada de esto: ya deriva la elección del tema (`ChoiceFromTheme`), así que
en cuanto el tema trae los valores puestos los enseña solos. «Sin seleccionar» pasa a significar «lo
que diga el tema», que es lo que se buscaba.

Para que la semilla pueda nombrarlos, **el vocabulario se muda de `demos` a `themes`**: los tipos, las
listas, la tabla de unidades de densidad, el desplazamiento de cada opción de cristal y las tablas de
radio. La capa de demo pasa a consumirlos y a reexportarlos, así que nadie de fuera cambia de import.

**`glass` deja de ser un booleano** y pasa a ser el eje entero. `false` era «apagado» y ahora es
`"off"`; `true` era «el de la base» y ahora es `"frosted"`. Un booleano no podía decir *cuánto*
cristal, que es lo que ADR-178 convirtió en eje.

**`corner` pasa a cinco peldaños: `sharp · crisp · soft · plush · round`.** Los tres extremos son
tablas —cero, el del tema y el redondo— y **los dos nuevos se calculan**: `crisp` a medio camino entre
recto y el del tema, `plush` entre el del tema y redondo. Escribirlos a mano sería inventar dos tablas
que se desincronizan en cuanto una de las tres cambie. `full` no se interpola: es la píldora, y media
píldora no significa nada.

## Alternativas

**Dejar el vocabulario en `demos` y que la semilla declare valores crudos** —un radio, un `unit`—. Es
lo que se evita: la semilla diría `radius: {...}` en vez de `corner: "soft"`, y entonces el panel no
puede derivar en qué peldaño está sin adivinar.

**Tablas escritas para los cinco peldaños.** Dos tablas más que mantener a mano, y ninguna razón: los
intermedios son exactamente el punto medio de los que ya hay.

**Mantener `glass: boolean` y añadir otra prop para la intensidad.** Dos props para un eje de cuatro
posiciones, y la vieja sin sentido en cuanto la nueva diga algo.

## Consecuencias

- **`glass: false` deja de compilar** en una semilla; se escribe `"off"`. Es la única ruptura, y solo
  alcanza a quien escriba semillas.
- **`corner` de un producto redefine su propio «soft»**: el eje sigue siendo relativo al tema, así que
  los cinco peldaños de un producto que declara `crisp` parten de ahí. Es lo coherente con lo que
  `soft` significa —«el del tema»— y conviene saberlo antes de declararlo.
- El panel del sitio pierde tres listas escritas a mano y consume las del paquete, así que un peldaño
  nuevo aparece en la UI sin tocar la UI.
- `CornerFromTheme` deja de comparar contra umbrales (`radius.md >= 24`) y compara contra lo que
  `RadiusOf` produciría. Con cinco peldaños —y dos calculados— un umbral se queda desfasado en cuanto
  cambie cualquiera de las tres tablas.
