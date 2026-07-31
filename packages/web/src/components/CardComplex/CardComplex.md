# CardComplex

Ejecuta el checkpoint del supuesto #8 del roadmap: las ~90 props del `Card` de tfv
(`docs/api/tfv-components.md` §4) reorganizadas en grupos tipados sobre los compounds de W2.5.

## Los grupos

`media` · `badges` · `actions` · `meta`, más las básicas planas (`title`, `description`, `href`,
`selected`, `loading`…). Tres de los cuatro son mecánicos; el que tenía decisión era `actions`.

## `actions` es una lista con ranura, no cuatro props con nombre

El boceto de `docs/01` §4 las escribía como `{ add?, action?, download?, preview? }`, que es la forma
de tfv. **Decisión del propietario (checkpoint de W3.5)**: lista tipada `CardAction[]` donde cada
acción declara `slot?: "header" | "media" | "footer"`.

Lo que se gana:

- **El vocabulario sale del core.** «download» y «preview» son de un producto concreto; una card de
  usuarios quiere «archivar» o «duplicar». Con nombres fijos, el catálogo común arrastra el dominio de
  tfv y la quinta acción obliga a enmendar el tipo.
- **`permission` sale gratis.** `CardAction` extiende el contrato de ADR-056 y el filtrado es el mismo
  `ApplyPermissions` que ya usan `Menu`, `Tabs` y `CommandPalette`. Es la tercera vez que el catálogo
  usa «lista de descriptores con `permission`», así que el consumidor ya la reconoce.
- **La posición no se pierde.** Era lo único que las cuatro props con nombre daban de verdad, y `slot`
  lo expresa sin acoplar el nombre: `header` a la derecha del título, `media` flotando sobre la
  imagen, `footer` en la fila inferior. Sin `slot` la acción cae en `header`.

La migración de tfv es un `map` de cuatro entradas, no una reescritura.

## Lo que no cruza de tfv

Dos props de la referencia son **dominio disfrazado** y se quedan fuera por la regla de frontera de
`docs/00-inventory.md` §1.18:

- `responsible?: Partial<User>` — `User` es un tipo de la app. Aquí es `CardPerson`
  (`{ name, avatar? }`), duck-typed y suficiente para pintar un avatar con su nombre.
- `imagesUploads?: Upload[]` — `Upload` es dominio. No cruza; `media.component` cubre el caso de
  pintar cualquier cosa en el hueco de la imagen.

Tampoco cruzan las ~20 props de `flat*`/`hide*`/`autoHide*` de tfv: `hidden` en `media` cubre el caso
real y el resto es configuración de layout que en Nebula se resuelve componiendo o con style props.

## `loading` sustituye, no superpone

Con `loading` la tarjeta pinta esqueleto **en lugar** del contenido, no encima. Superponer obliga a
mantener dos árboles sincronizados y deja texto real bajo un velo que un lector de pantalla sí lee.
