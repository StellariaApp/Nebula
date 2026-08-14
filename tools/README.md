# tools/

Scripts del monorepo (no publicables): `palette-gen` y `contrast-check` (F0.3); `bundle-budget` llega con los budgets de `docs/03 §3`.

## palette-gen — escalas cromáticas 50–950 en OKLCH (ADR-009)

```bash
pnpm gen:palette regen                          # regenera las 16 paletas + gray
pnpm gen:palette from "#0ea5e9" --name sky      # escala nueva desde un hex arbitrario
pnpm gen:palette from "#0ea5e9" --name sky --json
```

- `regen` escribe `packages/tokens/src/tokens/palettes.ts` (TS con `satisfies`) y `tools/palette-gen/generated/palettes.json`. Después: `pnpm turbo build --filter=@stellaria/nebula-tokens`.
- `from <hex>` es el modo que reutilizará el Theme Creator (02 §5.1).

Demo real de `pnpm gen:palette from "#0ea5e9" --name sky`:

```
 50: #eff8ff   100: #d8efff   200: #b5e2ff   300: #80ceff   400: #28b0f5   500: #0093d2
600: #007aaf   700: #006591   800: #005075   900: #003f5d   950: #002a40
```

**Cómo funciona**: luminancia (L) fija por perfil — `chromatic` (curva estándar compartida por todas las paletas: mismo paso ⇒ misma L), `surface-light`/`surface-dark` (rampas comprimidas que preservan el carácter de las paletas `light`/`dark` de Stellaria). El chroma sigue una campana anclada al de la semilla en su paso más cercano; el hue es el de la semilla; todo se clampa al gamut sRGB. Las semillas SOLO orientan hue/carácter — los hex legacy 100–900 no se portan (decisión cerrada).

### ¿Por qué culori (y no colorjs.io)?

1. API funcional y tree-shakeable: `converter`, `clampChroma`, `wcagContrast` sueltos, sin clases ni estado.
2. Trae de serie exactamente lo que necesitan ambos CLIs y el Theme Creator: OKLCH, clamp de gamut y contraste WCAG.
3. colorjs.io (evaluada) es más completa en CSS Color 4 pero orientada a clases y más pesada para este uso de pipeline.

## contrast-check — gate WCAG 2.2 AA (docs/03 §1 y §4.2)

```bash
pnpm check:contrast                       # valida el tema de humo de F0
pnpm check:contrast -- --theme tema.json  # valida cualquier NebulaTheme serializado
```

- Pares validados: texto normal/superficies (4.5:1), texto invertido, `onPrimary` sobre filled **y su hover**, texto semántico (paso 700), bordes fuertes y **focus ≥3:1** contra las 4 superficies, filled como componente UI (3:1). `disabled` está exento (WCAG 2.2 · 1.4.3).
- Salida: tabla de pares con ratio y, por cada FAIL, **sugerencia de corrección** (ajuste de L en OKLCH conservando hue/chroma). Exit code 1 si algo falla — apto para CI.
- Es el mismo motor que usará el Theme Creator en vivo (02 §5.3).

## check-slots — gate de props de ranura (docs/03 §4.7, ADR-106)

```bash
pnpm check:slots                            # todo packages/web/src
node tools/check-slots.mjs <raíz>           # cualquier otra raíz de fuentes
```

Dos comprobaciones que ni `tsc` ni lint ven, porque en las dos el **tipo es correcto** y lo que está
mal es dónde acaba el valor:

- **Orden del esparcido** (ADR-098): dentro de una apertura de elemento JSX, `className=` no puede ir
  antes de un `{...<algo>Props}`. Al revés, el esparcido pisa la clase compuesta y el consumidor que
  solo quería añadir una clase se queda sin componente pintado.
- **Ranura muerta**: cada miembro `<nodo>Props` de un `.types.ts` tiene que aparecer esparcido en
  algún `.tsx` del componente. Reconoce el esparcido directo, el que va por un objeto de ranuras
  (`{...slots.iconProps}`), la forma abreviada (`{...(x === undefined ? {} : { iconProps })}`) y el
  reenvío como prop a una parte interna.

Lee fuente, no `dist`: no depende de `build` y tarda ~1,5 s. Exit code 1 si encuentra algo.

## check-layers — gate de capas CSS (ADR-142)

```bash
pnpm check:layers
```

Las tres formas de romper el orden de la cascada, y ninguna da error por su cuenta — los estilos se
pintan igual y el orden lo decide el bundler:

- **La declaración se desalinea**: alguien añade una capa en `theme/layers.css.ts` y no la lista en
  `packages/web/styles.css`. La capa nueva queda sin ordenar y su posición pasa a depender de qué
  componente cargue primero.
- **Una hoja emite reglas fuera de capa**: un `.css.ts` nuevo que llama a `style()` sin envolverla.
  Lo no encapado gana a todo lo encapado, así que esa regla pisa incluso al CSS del consumidor. Se
  saltan los `.vars.css.ts`, `src/theme/` y las hojas que no emiten reglas (`focus`, `motion`).
- **Un consumidor no importa `styles.css`**: cualquier app de `apps/` que dependa de
  `@stellaria/nebula-web` y no traiga la hoja de declaración.

Va fuera de turbo porque cruza `apps/` y `packages/`, así que no es una tarea por paquete. Lee
fuente, no `dist`. Exit code 1 si encuentra algo.
