# ADR-103 — El registro de props es la fuente del tipo público

- **Estado**: aceptada · 2026-08-06 (decisiones 1, 4 y 5 del checkpoint de WN) · **WN**
- **Cambia API pública**: sí, y es _breaking_. Entra antes de v1 o no entra.
- Sustituye la derivación de `StyleProps` desde `Sprinkles` y amplía ADR-071 y ADR-093.

## Contexto

`StyleProps` se derivaba de `Sprinkles` con `Omit<Sprinkles, ColorProp>`. Como `Sprinkles` incluye
**las propiedades y sus atajos**, el tipo público exponía las dos formas de todo: `paddingInlineStart`
junto a `ps`, `background` junto a `bg`, `color` junto a `c`. Eran **40 alias largos** que nadie
debería escribir.

Lo que costaba, medido antes del cambio:

- **104 de 158 componentes** escribían `Omit<StyleProps, "color">`. La línea más repetida del
  catálogo, y existía solo porque el alias largo `color` chocaba con la prop de variante `color`
  (`ActionIcon color="gray"`).
- `background` chocaba dos veces con una ranura real de `ReactNode`: `MainProps.background` y
  `AppShellRailProps`.
- Y el catálogo tenía huecos que el tipo no podía expresar: **`bdc` a solas no dibuja nada** —sin
  grosor ni estilo el navegador no pinta— y `display: "grid"` llevaba expuesto desde el primer día
  sin una sola prop para gobernarlo.

## Decisión

**`utils/style-registry.ts` es la fuente única.** Declara 128 props, cada una con qué propiedades CSS
toca, qué escala de token acepta, si admite valor abierto y si es de longitud. El tipo público se
deriva de él con un tipo mapeado:

```ts
export type StyleProps = {
  [K in StylePropName]?: Responsive<Primitive<(typeof STYLE_PROPS)[K]>> | undefined;
};
```

Tres consecuencias, y las tres son el objetivo:

1. **La poda de los 40 alias largos sale por construcción.** No hay que borrarlos: dejan de
   derivarse. El único nombre por prop es el que el registro declara.
2. **Las 63 props nuevas se anuncian solas** al añadirlas al registro.
3. **Toda prop es responsive y admite valor abierto** cuando la propiedad CSS lo permite, porque el
   tipo lo envuelve en `Responsive<>` y añade `string & Record<never, never>` a las abiertas.

El registro conserva los tipos literales —`STYLE_PROPS["display"]["keywords"][number]` da la unión
exacta de nueve valores, no `string`—. Sin eso el enfoque no se sostiene, así que hay control
negativo en los checks.

### Qué nombre lleva cada prop

**Se conserva el nombre CSS completo cuando la abreviatura sería críptica o ambigua**: `display`,
`position`, `overflow`, `overflowX`, `overflowY`, `gap`, `flex`, `opacity`, `order`, `cursor`,
`visibility`, `aspectRatio`, `inset`, `objectFit`, `pointerEvents`, `userSelect`, `alignContent`,
`justifyItems`, `justifySelf`. `wrap`, `align`, `justify`, `self` y `direction` no son excepciones:
son abreviaturas asentadas que se leen bien.

**El borde físico se queda con los atajos cortos y el lógico usa el nombre CSS completo.** No es una
excepción a la regla anterior, es esa misma regla aplicada donde además chocaba: `bds` no puede ser
a la vez `border-style` y `border-inline-start`, ni `bdbs` ser `border-bottom-style` y
`border-block-start-style`. El lógico se usa mucho menos, así que paga él la verbosidad.

**Las cuatro esquinas sueltas son `rtl` `rtr` `rbl` `rbr`.** `rt`/`rb`/`rl`/`rr` van por pares, así
que sin ellas no se podía redondear una sola esquina. `rtl` se lee raro —parece _right-to-left_— y
por eso se dice aquí y en el `.md`.

### Los dos carriles

Los tres requisitos —token, valor abierto y responsive— no caben en un mecanismo, porque **una media
query no se puede escribir en `style`**:

- **Valor de token** → clase atómica de sprinkles, como hasta ahora. Coste cero añadido.
- **Valor abierto, o responsive donde sprinkles no llega** → variable CSS en línea más una clase
  estática por prop que la lee en cada breakpoint, con el fallback **encadenado hacia abajo**.

El encadenado no es un detalle: con fallback directo a `base`, un `{base, laptop}` se rompería en
desktop, porque la regla de desktop también casa y pisaría la de laptop con el valor base.

Los nombres de las variables se derivan (`--nb-<prop>[-<breakpoint>]`) en vez de tabularse. Con
`createVar()` eran 768 nombres hasheados enumerados en el bundle: **1,5 kB brotli en cada módulo**
que ahora no se pagan.

## Alternativas descartadas

**Mantener los alias largos y documentar cuál usar.** Es lo que había, y produjo 104 líneas de
`Omit`. Una convención que el tipo no verifica no es una convención.

**Meter también los colores en sprinkles con responsive.** Habría emitido más de 3.000 clases solo
para el color, porque son ~100 valores por seis condiciones. El carril de variable resuelve el color
con una clase por prop.

**Nombres globales sin hash en el contrato de tema**, que harían derivable `"accent.500"` →
`var(--nebula-color-accent-500)` y quitarían la tabla de color del runtime. Es mejor que lo que hay,
pero cambia los nombres emitidos del contrato y toca `packages/themes`. Queda anotado para su propio
ADR; no bloquea este.

## Consecuencias

- **Es _breaking_ y por eso entra ahora.** El radio medido fue de **un solo caso** en todo el
  monorepo: `whiteSpace="nowrap"` en una story, que pasa a `ws="nowrap"`. Los demás usos de nombre
  largo que aparecían en el barrido eran props propias de componentes o atributos SVG.
- **102 `Omit` reescritos en 80 archivos.** Quedan 20, todos con colisión real: `opacity`, `shadow`,
  `align`, `direction`, `position`.
- El runtime sigue aceptando los nombres largos —`PROP_KIND` los conoce— así que un consumidor que
  los escriba desde JavaScript no se rompe; simplemente el tipo ya no los ofrece.
- `Sprinkles` deja de salir de `Box.css.ts` hacia el tipo público. Solo se usa dentro de la hoja.
- El coste del carril abierto son **5,6 kB brotli** —4,7 de CSS y 0,8 de tabla de clases— que se
  descargan **una vez** y comparten todos los componentes. `size-limit` los cuenta por módulo, así
  que 143 de 194 presupuestos se re-basaron; el consumidor no paga 143 veces, paga una.
