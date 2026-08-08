# ADR-088 — El activo también recibe hover

- **Estado**: **aceptada** · 2026-08-04 — a petición del propietario durante la calibración del
  esquema claro
- **Amplía**: `SurfaceRole` del contrato `NebulaTheme` con `hoverActive`. No cambia ningún rol
  existente.

## Contexto

Al revisar la escalera de superficies del tema claro el propietario señaló un estado que el
contrato no nombra: **algo que ya está activo y además recibe el ratón**.

Con siete roles —`base`, `raised`, `overlay`, `sunken`, `hover`, `active`, `disabled`— un
componente con selección persistente tiene que resolver ese cruce por su cuenta, y solo caben dos
salidas, las dos malas:

1. **El hover no se aplica cuando el elemento está activo.** El ratón deja de dar respuesta justo
   encima de lo que el usuario está a punto de pulsar.
2. **El hover pisa al activo.** El elemento seleccionado se disfraza de no seleccionado mientras lo
   señalas, que es peor: destruye la única señal de estado que había.

No es un hueco teórico. Lo tienen los enlaces de navegación, las filas de tabla seleccionables, las
opciones de menú, las pestañas y los chips — todo lo que combina selección con puntero.

## Decisión

`SurfaceRole` gana `hoverActive`. Se aplica en el selector combinado y **nunca sustituye a
`active`**:

```ts
selectors: {
  "&[data-selected]": { background: vars.color.surface.active },
  "&[data-selected]:hover": { background: vars.color.surface.hoverActive },
}
```

El rol nombra **seleccionado**, no **pulsado**. El `:active` de CSS —el instante en que el botón
está hundido— no es esto; un componente que use `surface.active` para el pulsado está mal y se
corrige en WN.

### La dirección depende del esquema

`hoverActive` es un peldaño más allá de `active`, en la dirección en que ese tema mueve la
elevación:

| tema    | `active`    | `hoverActive` | dirección  |
| ------- | ----------- | ------------- | ---------- |
| `dark`  | `dark.500`  | `dark.600`    | más claro  |
| `light` | `light.300` | `light.400`   | más oscuro |

Un componente que dé por sentada una de las dos direcciones se rompe al cambiar de tema. Por eso
viaja como var y no como cálculo.

### La escalera del tema claro, de paso

El propietario reordenó `nebula-light` en la misma revisión: `overlay` por encima de todo
(`light.50`), `base` neutro (`light.200`) y la elevación hundiéndose —`raised` `light.400`,
`sunken` `light.600`—. Es lo contrario de lo que hace `dark`, donde `raised` y `overlay` suben, y es
deliberado: sobre un lienzo casi blanco no queda recorrido hacia arriba, así que la profundidad se
lee hacia abajo.

Los bordes bajaron con ella —`subtle` `light.400`, `default` `light.800`, `disabled` `light.700`—
porque un filo más oscuro que su fondo pesa más que uno más claro al mismo contraste, y igualar los
números del tema oscuro dejaba el claro cargado.

`border.strong` **no** bajó: el gate exige ≥3:1 contra toda superficie por WCAG 1.4.11 y el
candidato `gray.400` caía a 2.32 sobre `sunken`. Es un suelo de accesibilidad, no una preferencia.

## Consecuencias

- Siete sitios tocados: `SurfaceRole`, `surfaceRoles`, el contrato CSS de web, el check de tipos de
  tokens, los cuatro temas oficiales y el tema de humo del validador.
- El gate de contraste pasa de 111 a **116 pares**, los cinco temas en verde. `ThemeToVars` no
  necesitó cambio: esparce `colors.surface` entero.
- Una var más por tema. El presupuesto de `NebulaProvider` habrá que revisarlo al cerrar WN, junto
  con el resto del reparto.
- **Ningún componente lo usa todavía.** El reparto es el tramo N4 de
  [`prompts/2.3-web-normalize`](../../prompts/2.3-web-normalize/README.md), con la lista de
  candidatos por familia.
