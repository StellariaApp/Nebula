# ADR-090 — Tres familias apagadas

- **Estado**: **aceptada** · 2026-08-04 — a petición del propietario, al montar productos de prueba
  que no encontraban color
- **Amplía**: `PaletteName` con `sand`, `slate` y `brown`. No toca ninguna familia existente.

## Contexto

Al añadir productos al banco de pruebas apareció un caso sin salida: un tema sobrio que quisiera un
gris con carácter como color de marca. El intento fue usar `gray`, y falla por dos motivos.

**`gray` no está en `palettes` y no es un descuido.** Es estructura, no elección: vive como campo
propio del contrato (`colors.gray`) porque todos los temas lo tienen y de él salen `text.*` y
`border.*`. `palettes` es el catálogo del que un tema elige `primary` y `accent`.

**Y aunque se importe suelto, no sirve como marca.** Su croma es **0.016** — prácticamente
acromático. Un `primary` así no se distingue del texto ni del borde, y la variante `filled` sale como
un botón gris muerto.

Al medir la rueda para buscar hueco, la sorpresa fue que **no lo hay**: 14 familias cromáticas con
saltos de 15° a 40° y una media de 26°. El mayor —teal→cyan, 40°— no da para una familia más.

El hueco está en el otro eje. **Las 14 están entre croma 0.124 y 0.218**: todas vivas. No había ni
una apagada, así que cualquier identidad sobria o terrosa era imposible de expresar.

## Decisión

Tres familias en el tramo de croma que faltaba:

| familia | semilla   | `500`     | tono | croma | para qué                                        |
| ------- | --------- | --------- | ---- | ----- | ----------------------------------------------- |
| `sand`  | `#9e9080` | `#827465` | 69°  | 0.028 | el neutro **cálido**, gemelo de `gray`          |
| `slate` | `#6a839d` | `#617993` | 251° | 0.049 | gris azulado con carácter, usable como marca    |
| `brown` | `#976346` | `#9d6b50` | 49°  | 0.075 | naranja apagado, identidades terrosas           |

`sand` existe porque `gray` tira a azul —tono 248°— y un producto de identidad cálida no tenía un
neutro que le pegara. `slate` triplica el croma de `gray` manteniendo su tono: es lo que buscaba el
tema sobrio. `brown` abre un registro que hoy no se podía ni aproximar.

Las tres usan el perfil `chromatic` y por tanto anclan su `500` a 4.5:1 contra blanco según
[ADR-084](ADR-084-el-paso-500-se-ancla-al-contraste.md) —4.53, 4.50 y 4.51 medidos—, así que entran
en el sistema sin excepción y sin `ink` declarada.

## Consecuencias

- La regeneración fue **puramente aditiva**: 48 líneas insertadas, ninguna borrada. Ninguna familia
  existente cambia un solo hex.
- **Coste nulo en CSS.** Los `palettes` no viajan al contrato: ahí solo van `primary`, `accent`,
  `gray` y las cuatro semánticas. Una familia son 11 hex en el bundle JS, unos 150 B, y cero vars.
- Gate de contraste en verde, 116 pares, 5 temas.
- `palettes.ts` es generado: cualquier cambio pasa por `pnpm gen:palette regen`, nunca a mano.
- **Nota de 2026-08-05**: la lista de arriba no incluía los dos sitios que **cuentan** paletas a mano,
  y los dos se quedaron en 16 hasta que WN los encontró en rojo — `smokePalettes` en
  `packages/tokens/src/__checks__/contract.test-d.ts`, que dejaba el `typecheck` del monorepo caído,
  y la aserción de `packages/themes/src/__tests__/official-themes.test.ts`, que fallaba en los cuatro
  temas oficiales. Ampliar `PaletteName` obliga a tocar los dos.
