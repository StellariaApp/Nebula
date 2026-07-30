# InputPhone / InputDial

## Dos campos, no uno

`InputPhone` gobierna **dos valores independientes**, como el `InputPhone` de fonicredito
(`field` + `fieldDial`):

| Prop | Valor | Ejemplo |
| ---- | ----- | ------- |
| `field` · `value` · `onChange` | número nacional, solo dígitos, espacios y guiones | `"5512345678"` |
| `fieldDial` · `dialValue` · `onDialChange` | **código ISO del país**, no el prefijo | `"MX"` |

El prefijo no puede ser la clave de la selección: `+1` son Estados Unidos, Canadá y una docena de
países más. `DialByCode("MX")?.dial` lo traduce cuando hay que componer el E.164 (ADR-053 punto 6).

Componer el número completo es del consumidor, y a propósito: `+52` + `5512345678` es concatenación,
pero hay países con prefijo troncal que se descarta y otros donde no. La librería no simula una
librería de telefonía.

## `DialSelect` es interno y lo comparten los dos

`fields/dial-select.tsx` es el combobox de países; `InputDial` lo monta a ancho completo dentro de su
propio `FormField` y `InputPhone` lo monta en modo `compact` —ancho fijo de 5 caracteres y separador a
la derecha— dentro de la misma caja que el campo de texto. Solo el campo de teléfono recibe el `id` del
`FormField`, así que el `<label>` apunta al número; el selector de país lleva su propio `aria-label`
(`dialLabel`).

## El desplegable corta en 50 opciones

Son 227 países y cada fila es un componente de motion con retardo escalonado: pintarlos todos en cada
pulsación cuesta lo suficiente como para que se note al teclear —lo detectó el gate de tests, que
expiró a los 5 s escribiendo seis letras—. `MAX_OPTIONS` recorta la lista **después de filtrar**, así
que ninguna opción es inalcanzable: se llega a cualquier país escribiendo. Es el mismo `limit` que
recomiendan los comboboxes grandes.

## La bandera es emoji

Por defecto se pinta `FlagEmoji(code)`, que no hace ninguna petición. `FlagImageUrl` está exportada
para quien prefiera las SVG del CDN, y se conecta con `renderFlag`. El razonamiento está en ADR-053
punto 3 y en `collections/dial-codes.md`.
