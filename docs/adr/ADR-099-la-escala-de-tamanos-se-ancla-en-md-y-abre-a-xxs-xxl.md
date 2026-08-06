# ADR-099 — La escala de tamaños se ancla en `md` y abre a `xxs`…`xxl`

- **Estado**: **aceptada** · 2026-08-05 — a petición del propietario, al revisar el carril
- **Enmienda**: `sizes.control` y `sizes.compact` de `@stellaria/nebula-tokens`; tipo `SizeName`.

## Contexto

Al revisar la barra el propietario señaló que un `Avatar sm` y un `ActionIcon sm` no median lo mismo.
Medidos, no era un desajuste de píxeles sino **dos escalas distintas conviviendo**:

| escala                                | xs  | sm     | md  | lg  | xl  |
| ------------------------------------- | --- | ------ | --- | --- | --- |
| `sizes.control` — la que lee el resto | 32  | **40** | 48  | 56  | 64  |
| mapa cableado en `Avatar.tsx`         | 24  | **32** | 40  | 56  | 72  |

El mapa de `Avatar` no salía de tokens: era un `Record<Size, number>` en el `.tsx`. Además de
divergir, **incumplía el contrato de theming** de [docs/02](../02-theming.md) §2 — un tema que
recalibrara `sizes` no movía los avatares, porque no los leía nadie.

La instrucción fue doble: `sm` = 32 en ambos, y la escala completa **de `xxs` a `xxl` anclada en un
`md` = 40**.

## Decisión

### `sizes.control` baja un peldaño y gana dos extremos

| paso  | antes | ahora  |
| ----- | ----- | ------ |
| `xxs` | —     | **20** |
| `xs`  | 32    | **28** |
| `sm`  | 40    | **36** |
| `md`  | 48    | **44** |
| `lg`  | 56    | **52** |
| `xl`  | 64    | **60** |
| `xxl` | —     | **68** |

Paso constante de 8, como exigía ADR-072 para que un tema recalibre sin recalcular a mano. `md` = 40
queda en el centro geométrico de los siete peldaños, que es lo que pedía el ancla.

`sizes.compact` **conserva todos sus valores** y solo gana los dos extremos (`xxs` 16, `xxl` 40) para
que las dos escalas tengan la misma forma. Ningún componente que use `compact` cambia de aspecto.

### La escala deja de estar tipada por `Size`

`Size` es el tipo de la **prop** de variante (`xs`…`xl`), no la llave de una escala de tokens. Las
demás escalas ya lo tenían separado —`RadiusName`, `SpacingName`, `BlurLevel`, `ShadowLevel`, todas
con su propio tipo y ninguna reutilizando `Size`—, y `sizes` era la excepción.

Se introduce `SizeName` (`xxs`…`xxl`) para las dos escalas. `Size` no se toca.

Es lo que permite que la tabla abra a siete peldaños **sin** arrastrar 55 props `size?: Size`, 10
recipes con variante `size` y el paquete native a un refactor de 7 variantes. Ampliar la prop es una
decisión aparte, y cuando se tome los tokens ya estarán.

### `Avatar` lee la escala

`ResolveAvatarSize` devuelve `vars.size.control[…]` en vez de un número horneado. Sigue aceptando
longitud libre (`size={96}`), que es por donde salen los avatares de perfil que ya no caben en `xl`.

## Consecuencias

- **37 archivos** leen `vars.size.control`: Button, Checkbox, Calendar, Pagination, Nav, NavLink,
  PinInput, Segment, los campos… Todos encogen un peldaño. No hay que tocar ninguno; cambia el valor,
  no el nombre.
- El cambio más visible es el default: un `Button` o un `ActionIcon` `md` pasa de 48 a **44 px**, que
  es el objetivo táctil de WCAG 2.2 §2.5.5 (AAA) y de las HIG de Apple. El default de producto cumple
  ahora el nivel AAA sin que el consumidor tenga que subir de talla.
- `Avatar` pasa a ser theme-aware: recalibrar `sizes.control` en un tema ahora sí lo mueve.
- **`xs` queda en 28 px**, cuatro por encima del mínimo de WCAG 2.2 §2.5.8 que exige
  [docs/03](../03-a11y-motion-performance.md) §3. El peldaño más pequeño alcanzable desde una prop ya
  no va justo al límite.
- **`control.xxs` (16) queda por debajo del mínimo táctil** y por eso **no es alcanzable desde ninguna
  prop**: `Size` sigue siendo `xs`…`xl`. Existe para composición interna y alturas no interactivas. Si
  algún día se amplía la prop, `xxs` no debe entrar en un control con objetivo táctil.
- Es cambio de contrato: un consumidor que dependiera del valor absoluto de `size.control.md` verá 40
  px donde antes veía 48.
- Gates en verde: build (16/16), typecheck, lint (14/14), `check:contrast` (116 pares, 5 temas) y
  1187 tests. Los dos únicos tests que cayeron eran de `Avatar` y afirmaban píxeles horneados —uno de
  ellos bajo el nombre «resuelve el tamaño por var, no por estilo horneado»—; ahora comparan contra
  la var.
