# Section

Una banda de la página con su contenido en un carril centrado. Es la pieza con la que alterna `Hero`
en una landing, y comparte su anatomía a propósito.

## Banda fuera, carril dentro

La raíz ocupa el ancho completo; el contenido cuelga de un `div` interior que lleva el `max-width`.
El reparto no es arbitrario:

|                 | se queda                                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| la banda (raíz) | `padding-block`, `min-height`, el cristal, el `id` y el rol de región            |
| el carril       | `max-width`, `margin-inline`, `padding-inline`, la columna con `gap`, el divisor |

El `padding-inline` va en el carril y no en la banda, y eso es lo que conserva la geometría: el
contenido sigue midiendo `contentWidth` menos los dos padrones. Si el padrón viviera en la banda, el
carril se aplicaría por fuera y el contenido saldría más ancho.

El divisor de `divided` también vive en el carril, para que una sección dividida no cruce una línea
de lado a lado de la pantalla.

**Consecuencia a tener presente**: un `bg` por style props pinta la banda entera, no el carril. Es lo
que significa una sección —una franja de la página—, pero conviene saberlo antes de usarlo. Si lo que
quieres pintar es el cuerpo, la vía es `Section.Body`.

El carril es una pieza interna y no se expone como parte
([ADR-124](../../../../../docs/adr/ADR-124-el-cuerpo-de-la-seccion-se-sustituye-y-el-carril-no.md)):
el carril público del catálogo es `Container`, y `Hero` tampoco expone el suyo.

## `Section.Body` sustituye el envoltorio, no el estado

Las partes de [ADR-111](../../../../../docs/adr/ADR-111-hero-y-section-a-compound.md) reordenan la
cabecera. `Section.Body` hace otra cosa: sin él, la raíz envuelve los hijos sueltos en su propio
cuerpo; con él, el envoltorio es el tuyo y ahí caben tus style props.

```tsx
<Section title="Movimientos">
  <Section.Body p="lg">
    <Table />
  </Section.Body>
</Section>
```

Lo que **no** cambia al traer el tuyo: `error` y `empty` siguen sustituyendo su contenido, y el velo
de `loading` sigue tendiéndose por dentro —lo necesita, porque se ancla al `position: relative` del
cuerpo—. Por eso la raíz clona tu elemento en vez de renderizarlo tal cual.

Para los bordes, dos reglas: lo que quede suelto entra en tu cuerpo detrás de lo que pusiste dentro,
y si escribes dos `Section.Body` manda el primero y el segundo pasa a ser contenido suyo.

## `glass` — la banda intercalada

Enciende la receta `band`, el peldaño más bajo del cristal (ADR-082): velo al 78 %, filo arriba y
abajo, y 1 px de desenfoque. Está por debajo del botón y del chrome a propósito.

Lo que hace legible una franja de 1400 px es **el velo**, no el desenfoque ni el filo. Desde
[ADR-118](../../../../../docs/adr/ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md)
los cinco niveles tienen velos casi iguales —0.78 a 0.90— y el mismo filo plano, así que lo único
que separa a `band` de `strong` es cuánto difumina: 1 px contra 16. Elegir `band` es pedir que lo de
debajo **se siga leyendo**, no que se transparente.

Ojo con eso al alternarlas sobre un fondo decorativo: una `Section glass` ya no deja ver el
`StarField`, lo difumina. La franja se distingue por color, no por transparencia.

Se usa **alternando**, no en todas las secciones:

```tsx
<Numbers />              {/* lisa   */}
<Capabilities glass />   {/* banda  */}
<Pricing />              {/* lisa   */}
<Security glass />       {/* banda  */}
```

Encenderlas todas devuelve un fondo uniforme con líneas cada tanto, que es justo lo contrario del
efecto: lo que separa las regiones es el contraste entre una banda y la siguiente.

## `reveal` arma cambiando el tipo de elemento

`Section reveal` aplica `useReveal` sobre su propio `<section>`, sin nodo intermedio. El detalle que
importa está en `Reveal.md`: sin armar se rinde el tag liso y al armar el de motion, porque es la
única forma de que el estado oculto llegue a pintarse.

## `order` y el nombre de la región

`title` nombra la región por `aria-labelledby`; sin título, `aria-label`. `order` elige el nivel del
encabezado (`h2` por defecto) sin tocar su tamaño: el nivel es estructura y el tamaño es `fz`.

Esa independencia entre nivel y tamaño es lo que hace que `Section.Title` **componga `Title`** en vez
de pintar un `<h#>` crudo. `Title` aporta el reset, la familia y el color; `Section.css.ts` solo
declara lo que cambia —tamaño fijo `h5`, peso `semibold`, interlineado `tight`— y gana porque
`Section` vive en `composite` y `Title` en `primitive` (ADR-142). Antes de las capas no había forma de
sobrescribir a `Title` desde fuera, así que este componente reimplementaba su tipografía entera a
mano.
