# ADR-100 — El esquema oscuro hunde el `overlay`

- **Estado**: **aceptada** · 2026-08-05 — a petición del propietario, calibrando el panel sobre la
  lámina
- **Enmienda**: `colors.surface` de `nebula-dark`. No toca ningún otro tema.

## Contexto

La escalera del tema oscuro tenía a `overlay` como el peldaño **más claro** —`dark.800`— y a `sunken`
como el más hondo —`dark.50`—. Era el modelo de elevación clásico: lo que flota se aclara, lo que se
hunde se oscurece.

El problema apareció al montar el panel. `surface.overlay` no es solo el fondo de un modal: es
**el lienzo del shell** y el fondo de la variante `glass` en los cuatro temas. Con el overlay siendo
el peldaño más claro, el fondo de la aplicación quedaba por encima de las tarjetas que sostiene, y el
cristal se leía como un parche más claro sobre un lienzo ya claro — es decir, no se leía.

El tema claro ya había resuelto lo mismo en la dirección contraria: allí `overlay` es `light.50`, el
extremo, y la elevación se hunde desde `base`. Los dos esquemas estaban usando modelos distintos.

## Decisión

`nebula-dark` espeja al claro. Los cuatro peldaños de superficie pasan a ser consecutivos y el
`overlay` se va al fondo:

| rol       | antes                | ahora                    |
| --------- | -------------------- | ------------------------ |
| `overlay` | `dark.800` `#262831` | **`dark.400`** `#13151d` |
| `base`    | `dark.400` `#13151d` | **`dark.600`** `#1b1e27` |
| `raised`  | `dark.600` `#1b1e27` | **`dark.700`** `#20222c` |
| `sunken`  | `dark.50` `#06080f`  | **`dark.800`** `#262831` |

`hover` y `active` van con `raised`; `hoverActive` y `disabled` con `sunken`.

### El salto de `overlay` a `base` pesa el doble

Medido: `overlay`→`base` da **1.094** de contraste y `base`→`raised` **1.052**. El escalón que separa
el fondo de la aplicación de todo lo que flota encima es el doble de grande que los escalones
internos, que es justo lo que hace legible un cristal — necesita un fondo del que distinguirse.

Es la única distancia que se eligió a mano. El resto son peldaños consecutivos de la rampa.

### `disabled` sale de la rampa `dark`, no de `gray`

Durante la calibración `surface.disabled` apuntaba a `gray["500"]` —el gris **sin voltear**, mientras
que `colors.gray` del tema es `FlipScale(gray)`—. Al subir peldaños, `text.disabled` sobre él cayó a
**1.30** contra el suelo de 1.5 y el gate lo tumbó. Pasa a `dark.600`, que da **1.59**.

No es un detalle de esta calibración: **un tema oscuro no puede tomar superficies de la rampa de
texto sin voltearla**, y el gate es lo único que lo detecta.

## Consecuencias

- `base` sube dos peldaños respecto al original: el lienzo del panel deja de ser casi negro y pasa a
  gris muy oscuro. Es visible en toda la aplicación, no solo en el panel.
- Contraste en verde, 116 pares, 5 temas. Texto primario sobre `base` a 15.5:1 y `muted` a 6.2:1.
- Los dos esquemas comparten ahora **la misma forma**: `overlay` en el extremo, `base` neutro y la
  elevación hundiéndose. Lo que cambia entre ellos es la dirección, que es lo que debe cambiar.
- Es cambio de contrato para quien dependiera del valor absoluto de `surface.overlay` en oscuro.
