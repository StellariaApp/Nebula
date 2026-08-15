# ADR-147 — Las style props de color cumplen `ColorExtended`

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario en WN
- **Cierra**: la brecha entre lo que `@stellaria/nebula-tokens` declara para `c` y `bg` y lo que
  `@stellaria/nebula-web` resolvía de verdad.
- **Completa**: [ADR-071](ADR-071-opacidad-en-referencias-de-color.md) y
  [ADR-140](ADR-140-la-opacidad-alcanza-a-los-peldanos-de-escala.md), que ampliaron la opacidad por
  etapas sin llegar a las paletas semilla.
- **Afecta**: `utils/style-props.ts` y el tipo público `StyleProps`.

## Contexto

El paquete de tokens declara, en `types/colors.ts:31`, cuál es el tipo de las props de color:

```ts
export type ColorsProps = { c?: ColorExtended; bg?: ColorExtended; opacity?: number };
```

Y `ColorExtended` cubre `ColorScaleName = SemanticScaleName | PaletteName`: las siete escalas del
contrato **más las diecinueve paletas semilla**, con peldaño, con sufijo de alpha, más los roles, los
literales y `#hex`. `ResolveAccent` (`utils/scale.ts`) lo implementa entero desde siempre: resuelve
las semillas al hex de tokens y aplica el alpha con `color-mix`.

Los style props nunca se cablearon a ese tipo. Resolvían contra `PALETTE_COLORS` (`Box.css.ts`), que
solo contiene lo que el contrato `NebulaTheme` expone. El resultado es que **el mismo string vale en
una prop y no en la otra**:

```tsx
<Badge color="teal.400.30">  ✅ resuelve desde siempre, vía ResolveAccent
<Text  c="teal.400.30">      ❌ cae al carril abierto y el navegador la descarta
```

Y falla en silencio, porque `c`/`bg` son `open: true`: no hay error de tipo ni aviso en consola, solo
una declaración inválida que no pinta.

## Decisión

1. **Las props de color resuelven `ColorExtended` completo.** `ColorTone` busca primero en el mapa
   del tema —roles, escalas, literales— y, si falla, en `palettes` de tokens. Alcanza a `c`/`bg`,
   a `bdc` y a los cuatro `border*Color` lógicos, y a los alias largos `color`/`background`/
   `borderColor`.

2. **Una familia sin peldaño cae al 600**, el mismo `shade` por defecto que `ResolveAccent` usa desde
   ADR-021. `c="teal"` y `c="primary"` resuelven, no se descartan.

3. **El tema gana siempre a la semilla.** El mapa del tema se consulta primero, así que un
   `bg="gray.50"` sigue siendo la var del contrato y no un hex. No hay colisión de nombres hoy
   —ninguna de las siete escalas del contrato se llama como una semilla—, y este orden la resolvería
   si la hubiera.

4. **Un peldaño no se confunde con una opacidad.** `pink.300` es el peldaño 300 de pink, no pink al
   300 %. La regla es explícita: si el valor **entero** resuelve como color, no se intenta leerlo como
   alpha. Sin ella, meter las semillas convertía todo `familia.peldaño` en un `color-mix` absurdo,
   porque un peldaño es un número y pasa el `Number.isFinite` del sufijo.

5. **Las semillas no entran en sprinkles, solo en la resolución.** El mapa atómico se queda como
   está: el CSS no crece ni una clase. Una semilla sale por el carril abierto —`--nb-c: #hex`— y con
   alpha por declaración inline, igual que ADR-071 decidió para el resto.

6. **El tipo público gana `ColorExtended`.** `ScaleKey<S>` lo une a las claves del mapa cuando la
   escala es `color` o `role`, así que el autocompletado ofrece lo que el runtime acepta. No estrecha
   nada: `open: true` ya admitía cualquier string.

7. **Los alias largos siguen fuera del registro.** `color`, `background` y `borderColor` **no** se
   añaden a `STYLE_PROPS`: son nombres ya tomados por el catálogo —`Main.background` es un
   `ReactNode`, y `color` es la prop de variante en decenas de componentes—, y añadirlos rompe el
   typecheck de `Main`, `DatePickerPopover` y `FormDelete`. Los checks `CheckColorAliasIsGone` y
   `CheckBackgroundAliasIsGone` de ADR-103 ya lo fijaban. Lo que sí ganan es resolución: un valor que
   el mapa atómico no reconoce **deja de llegar a sprinkles** y sale por declaración inline, en vez de
   reventar con `SprinklesError`.

## Alternativas

**Corregir el tipo en tokens en vez de la implementación en web.** Estrechar `ColorsProps` para que
deje de prometer las semillas y que `c="pink.300"` fallara en typecheck. Coste cero y honesto, pero
deja a `color` y a `c` aceptando cosas distintas para siempre, que es la incoherencia de origen.

**Meter las semillas en el mapa de sprinkles.** Daría clase atómica en vez de inline, a cambio de
209 × 2 clases de color nuevas sobre un CSS que `size-limit` ya vigila. Descartada por lo mismo que
ADR-071 descartó enumerar los pasos de alpha.

**Un subpath aparte para las semillas.** Quien no lo importe no paga los bytes. Descartada por el
propietario: más trabajo y una costura nueva en el API para ahorrar ~1 kB.

## Consecuencias

- **Un color semilla no sigue al tema, y esa es su naturaleza.** Se resuelve al **hex** de tokens, no
  a una `var()`: un `c="pink.300"` se queda rosa en los nueve temas y en los dos esquemas. ADR-021 ya
  lo asumió para `ColorExtended` y lo llamó escape hatch; ahora la contrapartida alcanza también a los
  style props. Para color que **sí** siga al conmutador, el vocabulario sigue siendo el del contrato:
  roles y las siete escalas.

- **`check:contrast` tampoco cubre esto.** Mide el token del tema, no un hex escrito a mano ni el
  color compuesto por `color-mix`. Un `c="pink.300"` sobre `surface.base` puede ser ilegible en el
  tema claro y pasar el gate. La regla operativa de ADR-071 se mantiene y se subraya: opacidad y
  semillas en superficie, borde y decoración, no en texto informativo.

- **Quince presupuestos suben, entre 23 B y 964 B.** `style-props.ts` pasa a retener `palettes`
  (209 entradas, 3.5 kB de JSON) en todo módulo que use style props. Brotli lo comprime mucho mejor de
  lo estimado —el cálculo previo apuntaba a 1.2–1.5 kB por módulo y el exceso medido es de cientos de
  bytes—, y solo rebasan los primitivos, que son los que menos holgura tenían: `Text`, `Center`,
  `Container`, `Scroll`, `AspectRatio`, `VisuallyHidden`, `Anchor`, `Code`, `List`, `Skeleton`, `Kbd`,
  `AppShell`, `Panel`, `Main` y `ChartPanel`. Los 177 restantes no se mueven.

- **Tres tests de ADR-140 se reescriben.** Fijaban justo lo que esta decisión levanta: que `red.400.50`
  cayera crudo y que `bdc` no alcanzara una escala. Suite completa en verde: 1319 tests.
