# ADR-045 — Peldaños intermedios en la escala de spacing

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la comparación de geometría; decisión del
  propietario)
- **Análisis de origen**: `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §1 y §4 nivel 1.

## Contexto

La escala de spacing resuelve a estos píxeles (`unit` = 4, `scale` son multiplicadores):

| Nombre | none | xxs | xs | sm | md | lg | xl | xxl | xxxl |
| ------ | ---: | --: | -: | -: | -: | -: | -: | --: | ---: |
| px     |    0 |   2 |  4 |  8 | 16 | 24 | 32 |  48 |   64 |

**Entre `sm` (8) y `md` (16) no hay nada.** Y ahí es donde el archivo de diseño pone casi todo su
padding de control, medido nodo a nodo:

| Componente del Figma | Padding / gap |
| -------------------- | ------------- |
| Pagination Item      | 6 / 10        |
| Pill                 | 6 / 12        |
| Menu Item            | 8 / 12        |
| Sidebar Nav Item     | 10 / 12, gap 10 |
| Nav Tab Item         | 10 / 16, gap 6 |
| FieldSelect (input)  | 14 / 16, gap 12 |
| Metric Card          | 16 / 20       |
| Modal (header)       | 20 / 24       |
| Breadcrumbs          | 14 / 32       |

Un componente que necesita 12 px solo puede elegir 8 —queda apretado— o 16 —queda inflado—. Es la
causa raíz de que la implementación se perciba menos armónica que el diseño, y no un defecto de
ninguno de los componentes en particular.

La alternativa de derivar la densidad de `sizes.control` dentro de cada `.css.ts` devuelve al
componente la decisión que **ADR-033** le quitó, así que no es viable.

## Decisión

1. **`SpacingName` gana cinco miembros**, elegidos por los valores que el diseño exige: 6, 10, 12, 14
   y 20 px.

2. **Los miembros nuevos se nombran por su múltiplo de `unit`**, no por talla de camiseta:

   | Nombre  | Multiplicador | px |
   | ------- | ------------: | -: |
   | `u1_5`  |           1,5 |  6 |
   | `u2_5`  |           2,5 | 10 |
   | `u3`    |             3 | 12 |
   | `u3_5`  |           3,5 | 14 |
   | `u5`    |             5 | 20 |

   La escala de tallas no admite intercalados sin renombrar —no hay nombre natural entre `sm` y `md`
   que no sea `sm2`—, y renombrar rompería los 9 miembros actuales y todos los `.css.ts`. Nombrar por
   múltiplo es autoexplicativo: `space.u3` son 3 unidades, 12 px.

3. **Ningún miembro existente cambia de nombre ni de valor.** La ampliación es estrictamente aditiva:
   ningún `.css.ts` actual se rompe y ningún tema de terceros deja de validar.

4. **Los miembros de talla siguen siendo los preferentes para layout** —márgenes, huecos entre
   bloques, `Stack`, `Group`— y los `u*` son para **densidad interna de control**: padding de un
   elemento interactivo y hueco entre sus partes. La regla se escribe en `docs/06`.

5. **Los `u*` no se exponen como style props.** Sprinkles genera una clase atómica por valor × 17
   propiedades de espaciado × 6 breakpoints; añadir cinco valores generaba **~510 clases** y sacaba de
   presupuesto a 35 entradas de `size-limit`, la hoja atómica compartida incluida. `Box.css.ts` define
   `LAYOUT_SPACE` —los nueve miembros de talla— y las 17 propiedades responsive lo consumen en lugar de
   `vars.space`.

   No es una concesión al presupuesto: es el punto 4 aplicado. Los style props son la API de **layout**,
   y los `u*` son densidad interna, que vive en el `.css.ts` del componente. `vars.space.u3` sigue
   disponible ahí y no cuesta runtime porque VE lo resuelve en build.

## Alternativas

- **Re-escalar el tramo bajo de 2 en 2** (0·2·4·6·8·10·12·16·20·24·32·48) con nombres de talla
  recolocados: el resultado es la escala más limpia de las tres y la más parecida a la convención
  dominante, pero renombra la escala entera, obliga a tocar todos los `.css.ts` del catálogo e
  invalida cualquier tema externo. Rechazada por coste, no por criterio.
- **No tocar `space` y derivar la densidad de `sizes.control`**: coste de contrato cero, pero cada
  `.css.ts` vuelve a decidir su padding, que es exactamente lo que ADR-033 prohibió. Rechazada.
- **Nombrar los nuevos con tallas intercaladas** (`xs2`, `sm2`, `sm3`, `md2`, `md3`): mantiene un solo
  sistema de nombres a cambio de que ninguno diga nada. Rechazada.

## Consecuencias

- **Ampliación aditiva del contrato público**: `NebulaTheme.spacing.scale` pasa de 9 a 14 claves
  obligatorias. Los temas oficiales las reciben del token base; un tema de terceros que las omita deja
  de validar. Los paquetes siguen `private: true`.
- **Coste de nomenclatura, asumido**: la escala convive con dos sistemas de nombres —tallas para
  layout, múltiplos para densidad—. Es el precio de que la ampliación sea aditiva. La migración a una
  escala numérica única queda anotada como trabajo futuro, no como deuda urgente.
- **El schema de Zod deriva del enum** (`spacingNames`), así que la validación se propaga sin editar
  `schema.ts`, igual que en ADR-044.
- **Paridad native sin coste hoy**: `packages/native/src` aún no consume `spacing.scale`.
- **Coste de bundle cero**, gracias al punto 5. Medido: con los cinco valores en Sprinkles, 35 entradas
  de `size-limit` se salían de budget —`Sprinkles: runtime` pasaba de 16 a 18,36 kB y arrastraba a todo
  componente que importa la hoja—. Con `LAYOUT_SPACE` el gate vuelve a 9/9 sin tocar un solo
  presupuesto.
- **La API de style props no crece**: `p`, `m`, `gap` y sus 14 atajos siguen aceptando los mismos nueve
  valores que antes. Ampliar el contrato **no** amplía la superficie pública de `Box`.
- **Habilita el nivel 3** del plan de geometría: Segment, Pagination, NavLink, `field` y Tabs no pueden
  recalibrarse sin estos peldaños.
- **`docs/02` §2 y `docs/06`** se actualizan en el mismo PR con la escala ampliada y con la regla de
  cuándo usar talla y cuándo múltiplo.
