# Alert

## El color sale del `variantMap`, no de una tabla local

`AlertVariant` es `Extract<Variant, "filled" | "outline" | "light" | "glass">` y las tres piezas
cromáticas del contrato —fondo, primer plano y borde— las resuelve `ResolveVariant` contra
`theme.variantMap`. Es ADR-038.

Hasta entonces `Alert.tsx` tenía una función `Palette()` propia que reimplementaba las recetas a mano.
No coincidía ni con el contrato ni con la de Badge: para `light`, el contrato dice `scale.500.12` +
`scale.800`, Alert decía 12 % + `text.primary` y Badge decía 14 % + `scale.700`. Tres definiciones del
mismo nombre, y ningún gate las comparaba. La consecuencia real: un tema que remapee `filled` a
`gradient.brand` y ese remapeo llegaba a Button pero no aquí.

**Cambio visual deliberado**: en `light` y `outline` el texto pasa de `text.primary` a la escala del
color (`scale.800` / `scale.700`), así que el cuerpo del aviso queda tintado en vez de neutro. Es lo
que hace temable la variante, y los cuatro pares resultantes pasan AA con holgura —8,36 en
light y 12,63 en dark para `light/primary`—.

## `accent` es local, y por qué no está en el contrato

`VariantRecipe` modela tres colores. Alert necesita un cuarto: el del icono y el título, que debe
mantener el color semántico aunque el cuerpo lo tenga o no. Se resuelve en el componente
—`text.onPrimary` en `filled`, `scale.600` en el resto— y **no** se propuso ampliar `VariantRecipe`
para alojarlo: es una necesidad de un componente, no del contrato, y ampliar la receta es la decisión
más cara del sistema (auditoría WV §3.1).

## `glass` entra en el subconjunto; `gradient` y `glow` no

`docs/06` §6 fija que los gradientes «nunca sostienen texto largo» y que el glow se reserva a acción
primaria o selección. Un Alert sostiene párrafo, así que ninguno de los dos le corresponde. `glass` sí,
porque el aviso es raíz de su región y el efecto no se anida.

## Props de ranura

`titleProps`, `iconProps`, `bodyProps`, `messageProps` y `actionsProps` alcanzan los nodos que Alert
envuelve (ADR-098). `titleProps` puede sustituir el `id` que Alert genera para `aria-labelledby`: si
lo haces, el `aria-labelledby` del contenedor deja de apuntar al título y hay que ajustarlo también.
