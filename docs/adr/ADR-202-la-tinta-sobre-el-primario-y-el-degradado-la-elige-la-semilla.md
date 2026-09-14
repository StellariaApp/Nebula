# ADR-202 — La tinta sobre el primario y sobre el degradado la elige la semilla

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo 5 de C3 en Polaris (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7).
- **Enmienda**: [ADR-085](ADR-085-cada-escala-lleva-su-propia-tinta.md) §1 —la tinta de `primary`
  puede declararla el producto— y [ADR-089](ADR-089-la-tinta-de-un-degradado-la-decide-su-peor-extremo.md)
  §3, cuyo `GradientToken.ink` ahora se alcanza desde la semilla.
- **Cambia API pública**: sí, y **solo añade**: `ThemeSeed.ink?: { primary?; gradient? }` en
  `@stellaria/nebula-themes` (con los tipos `SeedInk` e `InkChoice`), y `ink.primary?` en el
  contrato `NebulaTheme` de `@stellaria/nebula-tokens`, opcional.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/themes/src/themes/_seed/index.ts`, `utils/build-product.ts`, `schema.ts`,
  `load-theme.ts`, `web/theme-vars.ts`, `web/resolve-variant.ts`, `index.ts`, sus pruebas;
  `packages/tokens/src/theme/theme.ts`; `tools/contrast-check/src/{pairs,resolve}.ts`;
  `docs/02-theming.md` §2 y `docs/07-recetas-de-producto.md` §3.

## Contexto

El primario de Polaris es `cyan.500` (`#00a9cd`). Sobre él la tinta clara da **2,78:1**, y
`filled · primary` y `glow · primary` fallan AA en los dos esquemas sin que el producto pueda hacer
nada: `BuildProduct` copia `colors.text.onPrimary` y `onGradient` de la base —tinta clara— y la
semilla no tiene dónde decir otra cosa. Lo mismo le pasó al degradado con `to: blue.300`: ocho
pares en rojo hasta que el propietario lo hundió a `blue.500`, que es justo lo que ADR-085 quiso
evitar: **un color claro con letra oscura contrasta mejor que hundido con letra blanca**.

El sistema ya sabe pintar tinta oscura, pero por dos caminos que la semilla no alcanza:

- `ink.floor` es un umbral **global**: subirlo a 3 para `primary` mueve también `accent` y las
  semánticas, y es una regla de suelo, no una elección de identidad.
- `GradientToken.ink` (ADR-089 §3) es exactamente la declaración que hace falta para el degradado,
  pero `GenerateGradients` no lo escribe y el producto no toca el token.

Y hay un detalle que decide la implementación: **`colors.text.onPrimary` del objeto no es lo que
la web pinta**. Desde ADR-085 el provider deriva `vars.color.ink.primary` y `text.onPrimary` de
`OnColor(primary[500], floor)`, y `check:contrast` replica ese cálculo. Escribir otro hex en
`colors.text.onPrimary` no cambiaría ni un botón ni un par del gate. La declaración tiene que
llegar al contrato para que el provider y el gate la lean, como ya llega la del degradado.

## Decisión

```ts
export const SEED = {
  name: "polaris",
  primary: palettes.cyan, accent: palettes.blue,
  from: palettes.cyan["600"], to: palettes.blue["500"],
  ink: { primary: "dark" },
  …
} satisfies ThemeSeed;
```

- `ThemeSeed` gana `ink?: { primary?: "light" | "dark"; gradient?: "light" | "dark" }`. Sin
  declararlo **nada cambia**: los dieciséis temas salen idénticos, el gate da los mismos 186 pares y
  `nebula-desde-semilla` sigue en verde.
- `BuildProduct` la materializa por los caminos que el provider ya lee:
  - `gradient` → `effects.gradients.brand.ink` (el de ADR-089), que gana al peor extremo.
  - `primary` → `ink.primary` del tema, campo **nuevo y opcional** de `ThemeInk`, que gana al suelo
    **sólo sobre `primary`**. `accent` y las semánticas siguen por `floor`.
  - Además escribe `colors.text.onPrimary` y `onGradient` en el objeto con el mismo hex en los dos
    esquemas —el primario no cambia con `FlipScale`—: `"light"` es la tinta clara de la base clara
    y `"dark"` es `text.primary` de la base clara (`gray.950`), para quien lea el tema sin pasar
    por el provider.
- `ThemeToVars` y `ResolveVariant` honran `ink.primary`: la tinta y **la dirección del hover**
  (ADR-085 §5: el hover se aleja de la tinta). `LoadTheme` y el schema lo aceptan y
  `check:contrast` lo replica.
- `BuildProduct` **no avisa** de nada: sigue siendo salida pura sin dependencias. Quien mide es
  `check:contrast -- --theme`, y la semilla declara lo que la lámina pide, como `orange` en ADR-085.

Medido con una semilla como la de Polaris (`cyan.500`, `cyan.600 → blue.500`):

| par                              | sin `ink`               | `ink: { primary: "dark" }` |
| -------------------------------- | ----------------------- | -------------------------- |
| `filled · primary` (texto)       | `#ffffff` **2,78 FAIL** | `#0b0b0b` 7,08 PASS        |
| `filled · primary` (texto:hover) | `#00718a` 5,63          | `#2fbde2` 8,90             |
| `glow · primary` (texto)         | **2,78 FAIL**           | 7,08 PASS                  |
| total (dark / light)             | 3 FAIL / 2 FAIL         | 1 FAIL / 0 FAIL            |

El FAIL que queda en dark es el filo de cristal a 1,15, que ya estaba en la lista de Polaris.

## Alternativas

- **Sólo `colors.text.onPrimary`/`onGradient` en `BuildProduct`**, como decía el hallazgo: no pinta
  nada en la web ni mueve el gate (arriba). Se hace también, pero no basta.
- **Subir `inkFloor`**: global; y en Polaris a 3 hubiera bastado, pero cualquier producto con un
  `accent` entre 2,8 y 3 lo vería cambiar sin pedirlo.
- **Aclarar el `500` del producto** hasta que la blanca aguante: es hundir la marca; ADR-085 lo
  descartó para las seis familias claras del catálogo.
- **Declarar la tinta por escala** (`ink.fills`): más contrato del que pide la decisión. Si un
  producto lo necesita sobre `accent`, se extiende igual.
- **Avisar en `BuildProduct`**: metería el cálculo de contraste en un paquete que no lo tiene y
  avisaría en cada `BuildProduct` de cada arranque; el gate ya lo dice una vez y con el hex.

## Consecuencias

- Polaris declara `ink: { primary: "dark" }` y cierra los dos pares de `filled`/`glow · primary`
  que quedaban en deuda; su degradado puede volver a `blue.300` con `gradient: "dark"` si diseño lo
  prefiere claro.
- `ThemeInk` gana un campo opcional. Es el mismo movimiento que ADR-089 hizo en `GradientToken`:
  una declaración de identidad que gana al cálculo, revisada mirando la lámina.
- El objeto del tema lleva `gray.950` y el provider pinta `INK_DARK` (`#0b0b0b`), igual que hoy
  con el degradado: dos negros que contrastan lo mismo. Native lee el objeto; la web, la var.
- `pnpm check:contrast` en verde (186 pares, 3 temas); 200 pruebas de `themes`.
