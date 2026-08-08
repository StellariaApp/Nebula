# ADR-082 — La banda es el peldaño más bajo del cristal

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario durante WB
- **Amplía**: `GlassLevel` ([ADR-078](ADR-078-el-cristal-es-una-receta-por-clase-de-superficie.md)) con
  un quinto nivel, y la anatomía de `Section`.
- **No toca**: la calibración de los cuatro niveles existentes ([ADR-079](ADR-079-la-calibracion-del-cristal-baja-un-peldano.md)).

## Contexto

El propietario pide que `Section` admita cristal para poder **intercalar bandas** a lo largo de una
landing, con una intensidad **por debajo de la del botón y la del chrome**. La referencia es la
landing de Stellaria: `border-y border-zinc-200/80 bg-zinc-50/80 dark:border-white/[0.06]
dark:bg-white/[0.02]`.

Ese 0.02 cae por debajo de `control`, que en dark está en 0.03 y es el peldaño más bajo que había. No
hay forma de expresar la petición con los cuatro niveles vigentes.

## Decisión

### 1. Un quinto nivel, `band`

`GlassLevel` pasa a `"band" | "control" | "subtle" | "default" | "strong"`.

| Esquema | fondo                       | borde                       | blur       |
| ------- | --------------------------- | --------------------------- | ---------- |
| dark    | `rgba(255, 255, 255, 0.02)` | `rgba(255, 255, 255, 0.06)` | `blur.xxs` |
| light   | `rgba(255, 255, 255, 0.55)` | `rgba(15, 17, 25, 0.08)`    | `blur.xxs` |

En dark es la traducción literal de la referencia. En light **no** lo es, y a propósito: el lienzo
claro de Nebula es `light.600` (medido `234,234,234`), más oscuro que el `zinc-50` de la referencia,
así que un tinte oscuro daría una banda que se hunde en vez de una que se levanta. La banda clara es
un velo blanco por encima del lienzo, que es el gesto que la referencia consigue con su `zinc-50/80`
sobre blanco.

`band` es un nombre de **rol**, como `control`, no de intensidad. Los dos peldaños de abajo se llaman
por lo que visten; los tres de arriba, por cuánto tapan.

**El blur es un susurro (1 px) y el tinte hace el trabajo.** Es coherente con ADR-079: por debajo de
cierto velo lo que separa una superficie del fondo es la transparencia, no el desenfoque. Aquí además
lo pedía la instrucción —por debajo de los 2 px de `control`—, y lo que hace legible una banda a
1400 px de ancho es su filo, no su desenfoque.

### 2. `Section` pasa a ser banda con carril interior

Hasta ahora `Section` **era** el carril: llevaba `max-width` y `margin-inline: auto`. Un tinte sobre
ese elemento habría pintado un rectángulo centrado de 1180 px, que se lee como una tarjeta gigante, no
como una banda.

La estructura pasa a ser la de `Hero` —con quien alterna en una landing—: la raíz ocupa el ancho
completo y el contenido cuelga de un carril interior.

- La raíz se queda el `padding-block`, el `min-height` y, si hay, el cristal.
- El carril se queda el `max-width`, el `margin-inline`, el `padding-inline`, la columna con `gap` y
  el divisor de `divided`.

Dejar el `padding-inline` en el carril y no en la raíz es lo que **conserva la geometría exacta** del
contenido: sigue siendo `contentWidth` menos los dos padrones. Y dejar el divisor en el carril evita
que `divided` pase a cruzar la banda entera, que habría sido un cambio visual que nadie pidió.

## Consecuencias

- **Cambia el DOM de `Section`**: aparece un `div` de carril entre la sección y su contenido. Medido
  sobre la landing, la banda mide 1400 y el carril 1180 en las cuatro secciones.
- **Cambia dónde pinta el fondo de una `Section`.** Quien le pasara `bg` por style props lo verá ahora
  a ancho completo en vez de a ancho de carril. Es el significado correcto —una sección es una banda
  de la página— pero es un cambio observable. En el catálogo no lo usaba nadie.
- El contrato de CSS (`vars.glass`) gana una entrada, así que **todos los temas** ganan la receta: los
  tres claros la heredan de tokens y `dark` la sobreescribe, como el resto de sus niveles. Eso son
  cuatro vars más por tema, y por eso sube el presupuesto de `NebulaProvider` de 72.5 a 73 kB (medido
  72.66). Es el coste fijo de ampliar el contrato, no del componente.
- Con `glass.enabled: false` la banda se pinta igual porque `Section` lee la
  receta del contrato y no pasa por `ResolveVariant`. Es lo mismo que ya hacía `Footer`.
