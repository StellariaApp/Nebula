# ADR-066 — La escala de prosa y el dimensionado del código

- **Estado**: **aceptada** · 2026-08-01 (checkpoint de ESPECIFICACIÓN de WR4/T2)
- **Resuelve**: las causas **C10** y **C12** de `docs/reviews/visual-audit-2026-08-01.md`. Van juntas
  porque comparten superficie: las dos son la tipografía de la lectura larga, y el código es el sitio
  donde la escala de prosa se sale del suelo del sistema.
- **Enmienda**: `docs/06-visual-language.md` §2, que fija **un baseline único** y por tanto hoy
  declara defectuoso a `TypographyStylesProvider` sin decirlo.
- **Alcance**: `TypographyStylesProvider`, `Code`, `CodeHighlight` y cualquier consumidor que anide
  código dentro de texto denso.

## Contexto

### C10 — dos jerarquías tipográficas conviven sin estar declaradas

`docs/06` §2 fija una sola escala. Medido en el código:

| Aspecto            | `Text` / `Title` (§2)                 | `TypographyStylesProvider`      |
| ------------------ | ------------------------------------- | ------------------------------- |
| Cuerpo             | `body1` (16 px) + `lineHeight.normal` | `body2` (**14 px**) + `relaxed` |
| Peso de `h1`–`h2`  | `bold`                                | `semibold`                      |
| Peso de `h3`–`h6`  | `semibold`                            | `semibold`                      |
| Tracking `h1`–`h3` | `tight`                               | **ninguno**                     |

El mismo `h2` se ve distinto según lo envuelva o no el proveedor de prosa. Y hay una ironía medible:
§2 asigna `body1` a «cuerpo por defecto, formularios y **lectura**», y **el único componente del
catálogo dedicado a la lectura larga es el que no usa el tamaño de lectura**.

### C12 — tres criterios para dimensionar lo mismo

| Sitio                        | Criterio            | Resultado                 |
| ---------------------------- | ------------------- | ------------------------- |
| `Code` inline                | `0.875em`           | 14 px dentro de `body1`   |
| `Code` bloque                | `body3` absoluto    | 13 px                     |
| Prosa (`${typography} code`) | `0.9em`             | 12.6 px dentro de `body2` |
| `CodeHighlight`              | `caption` / `body3` | 12 / 13 px                |

El mismo fragmento se ve a 12.6, 13 o 14 px según dónde caiga.

**Y el borde que el plan pedía comprobar es peor de lo que se suponía.** No hace falta un anidamiento
raro: la prosa por defecto ya baja del suelo. `${typography} pre` fija `body3` (13 px) y
`${typography} pre code` (L111) solo resetea `padding` y `background` — **no el tamaño**, así que el
`code` de dentro conserva su `0.9em`:

> **13 px × 0.9 = 11.7 px.** Todo bloque de código en prosa renderiza **por debajo del suelo de 12 px
> de §2**, hoy, sin ayuda de nadie.

El caso compuesto que el plan anticipaba también existe: `figcaption` es `caption` (12 px), y un
`code` dentro rinde a **10.8 px**.

## Decisión

### 1. La prosa larga tiene escala propia, y está declarada

Deja de ser defecto y pasa a ser contrato. `TypographyStylesProvider` es **el único** sitio del
catálogo con escala propia, y lo que puede y no puede cambiar se escribe en §2:

| Puede cambiar                                | No puede cambiar                                              |
| -------------------------------------------- | ------------------------------------------------------------- |
| `lineHeight` → `relaxed`                     | El suelo de 12 px                                             |
| La medida de línea (60–70 car.)              | Los pesos de heading de §2.1 (`h1`–`h2` bold, resto semibold) |
| El ritmo vertical entre bloques              | El tracking de §2.1 (`tight` en `h1`–`h3`)                    |
| El dimensionado del código, según el punto 3 | El tamaño del cuerpo de lectura                               |

### 2. El cuerpo de la prosa sube a `body1` (14 → 16 px)

Porque §2 ya asigna `body1` a la lectura. Un proveedor de prosa que rinde a 14 px está optimizando
para densidad de UI justo en el componente donde la densidad no es el objetivo.

Los headings de la prosa toman los pesos y el tracking de `Title`. La prosa conserva `relaxed`, que
es lo que de verdad la distingue de la UI.

### 3. Un solo criterio para el código, con suelo explícito

- **Código inline**: `max(0.875em, 12px)`.

  Un solo factor para todo el catálogo — el de `Code`, que es el componente canónico —, y el `max()`
  convierte el suelo de §2 en algo que **el CSS garantiza** en vez de algo que hay que recordar. A
  `0.875em` puro, un `code` dentro de `body3` da 11.4 px y dentro de `caption` 10.5 px; con el `max()`
  ninguno de los dos puede bajar de 12.

- **Código en bloque**: `body3` absoluto (13 px). No hereda factor.
- **`code` dentro de `pre`**: hereda (`1em`). Un bloque ya fijó su tamaño; volver a aplicarle el
  factor inline es contarlo dos veces, y es la causa exacta de los 11.7 px de hoy.

`0.9em` desaparece del sistema.

## Alternativas

- **La prosa se queda a 14 px y §2 declara la excepción completa.** Cero cambios de código.
  Descartada en el checkpoint: deja dos jerarquías tipográficas en el mismo producto y un `h2` que
  cambia de peso según su envoltorio, que es el defecto que §2 existe para impedir.
- **No hay escala de prosa: `TypographyStylesProvider` se alinea en todo (hallazgo A).** La más
  simple de especificar. Descartada: la lectura larga sí necesita un interlineado distinto del de la
  UI, y negarlo obligaría a reintroducirlo caso por caso.
- **Un tamaño absoluto para el código inline (`body3`).** Elimina el `em` y con él toda la aritmética.
  Descartada: el código inline debe escalar con el texto que lo rodea; fijarlo lo hace saltar dentro
  de un heading.
- **Dejar `0.875em` sin `max()` y prohibir código en contextos densos.** Descartada: es una regla que
  ningún gate puede verificar y que el primer consumidor rompería sin enterarse.

## Consecuencias

- **La prosa cambia de aspecto**: cuerpo 14 → 16 px, headings con los pesos y el tracking de `Title`.
  Es visible y va al tramo **T5**.
- **Se cierra una violación activa del suelo de §2** que llevaba en el catálogo desde que existe el
  proveedor de prosa, y que ninguna auditoría había reportado porque nadie midió `pre > code`.
- **`max(0.875em, 12px)` es verificable**: el suelo deja de depender de que el autor del componente lo
  recuerde. Un check de tamaño mínimo sobre el render puede comprobarlo, y queda propuesto para el
  gate de la fase.
- **Afecta al baseline de ADR-037**: `TypographyStylesProvider`, `Code` y `CodeHighlight` cambian de
  métrica, así que el baseline se captura después de T5 — coincide con lo que ya mandaba ADR-065.
- **Lo que este ADR no decide**: si la medida de línea de 60–70 caracteres se aplica con `max-inline-size`
  en el proveedor o se deja al consumidor. §2 ya la recomienda; hacerla vinculante en un componente
  es una decisión de API y no se toma aquí.
