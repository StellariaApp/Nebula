# nebula-tools-docs-gen

Genera lo que el sitio de documentación **no debe escribir a mano**: cuatro JSON en
`apps/docs/generated/`.

```bash
pnpm gen:docs     # los escribe
pnpm check:docs   # falla si lo generado no coincide con el codigo
```

Los cuatro son **deterministas**: dos ejecuciones sin cambios producen archivos idénticos byte a
byte. En CI corre `check:docs`, y si el JSON comprometido difiere del código, el gate falla.

## De dónde sale el compilador

El generador de API necesita la **API JS del compilador**, y TS 7 es un binario nativo que no la
expone (ADR-012). Se resuelve por ruta el `typescript@5.9.3` que la **raíz ya tiene** para el
typed-linting, en vez de declararlo como dependencia: cero dependencias nuevas. `Compiler()` en
`shared.ts` hace esa resolución.

`@stellaria/nebula-web` **sí** es dependencia declarada, porque el generador de API lee su `dist`.
Sin declararla, el `^build` de turbo no ordenaría nada y el gate leería un `dist` viejo.

## `catalog.json` — el registro del catálogo

Una entrada por **directorio** de `packages/web/src/components`. Son 158: 156 tienen `.types.ts`
propio y dos —`DateRangePicker` y `DateTimePicker`— reusan el contrato de `DatePicker`.

| Campo      | De dónde sale                                             |
| ---------- | --------------------------------------------------------- |
| `family`   | los encabezados `### 1.x` de `docs/00-inventory.md`       |
| `subpath`  | qué barrel lo reexporta (`.` o uno de los siete subpaths) |
| `compound` | si su `index.ts` compone con `Object.assign` (ADR-097)    |
| `parts`    | las claves de ese `Object.assign`                         |
| `boundary` | si algún `.tsx` del directorio abre con `"use client"`    |
| `budget`   | el `limit` de su entrada en `packages/web/.size-limit.js` |
| `notes`    | si existe `<Nombre>.md`                                   |
| `contract` | si existe `<Nombre>.types.ts`                             |

**El gate es de cobertura**: si un componente existe en el código y no en el registro comprometido,
falla. Es el criterio del censo de WR1 — ninguna fila sin rastro.

## `api.json` — la referencia de API, desde el `.d.ts` **publicado**

La fuente es `packages/web/dist/**/*.d.ts`, no el fuente, porque **es exactamente lo que el consumidor
recibe**: si el build cambia la superficie pública, la doc cambia con ella.

Por componente: props propias con su tipo renderizado, si es requerida, su valor por defecto y su
JSDoc. Las **ranuras** (`*Props`) van en su propia sección porque son el mecanismo de personalización
sin fork.

**Las 128 style props no se listan por componente.** Salen como un grupo heredado con su cuenta y un
enlace a su página. Una tabla de 150 filas donde 128 se repiten en los 158 componentes no es
documentación. Los otros grupos heredados son `html` (las props del elemento), `press` y
`permissions`.

### La trampa del valor por defecto

Hoy **no hay ninguna anotación `@default`**: el valor por defecto vive en la desestructuración del
`.tsx` (`size = "md"`). El generador lo lee de ahí y **solo cuando es un literal inequívoco** —cadena,
booleano o número—. Si la desestructuración asigna una expresión (una llamada, un objeto, una
constante importada), el valor **no se inventa**: el componente entra en `gaps.defaultUnknown`.

## `style-props.json` — las 128 props de ADR-103

Qué propiedades CSS toca cada una, qué escala de token acepta, si admite valor abierto y **por qué
carril resuelve su responsive**: `atomic` si sprinkles le da clase por breakpoint, `open` si lo
consigue por variable en línea con encadenado de fallback.

Incluye `corners`, que son `rtl · rtr · rbl · rbr`. El propio ADR-103 pide decir en voz alta que
**son esquinas del radio, no dirección de texto**.

## `metadata.json` — las tres columnas que salen gratis

- **`budget`**: los kB brotli reales de `size-limit` para ese módulo.
- **`boundary`**: server-safe o cliente, derivado del `"use client"` real.
- **`themeKeys`**: qué claves del `NebulaTheme` pintan el componente. De ahí sale «cambia esto en tu
  tema y cambia en todo el catálogo», que es el argumento central del proyecto.

## Huecos declarados, nunca inventados

Lo que el generador no puede determinar sale en `gaps` de cada JSON y se imprime al correr. Nunca se
rellena a ojo.

## Por qué hay una tabla de alias

El inventario nombra filas, no directorios. La mayoría se resuelve partiendo la celda por `/`, `+`,
`,` y `y` (`Anchor / Link`, `Calendar / MonthPicker / YearPicker`). Siete no, y se declaran a mano
en `FAMILY_OVERRIDES` porque adivinarlos sería inventar:

| Componente       | Familia                   | Por qué no sale del inventario                              |
| ---------------- | ------------------------- | ----------------------------------------------------------- |
| `ButtonGroup`    | Buttons & Actions         | la fila es `Button (+Group)`; el paréntesis no es un nombre |
| `Charts`         | Charts                    | el directorio **es** la familia §1.12, no una de sus filas  |
| `DragDrop`       | Drag & Drop               | la fila lista sus partes, no el directorio                  |
| `Kanban`         | Drag & Drop               | ídem                                                        |
| `MeshGradientBg` | Effects / Glass / Shaders | el inventario lo llama `MeshGradient`                       |
| `Footer`         | Foundation / Layout       | entró por **ADR-070**, posterior al cierre del inventario   |
| `FieldError`     | Inputs & Forms            | no tiene fila: es parte del contrato de campo               |

Cuando `docs/00-inventory.md` se actualice con esas filas, la tabla se vacía sola.
