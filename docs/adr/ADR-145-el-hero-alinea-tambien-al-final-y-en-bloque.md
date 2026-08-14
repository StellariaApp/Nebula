# ADR-145 — El hero alinea también al final y en bloque

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario
- **Amplía**: `HeroOwnProps.align` en `@stellaria/nebula-web`, que admitía `start` y `center`.
- **Cambia API pública**: sí, y **solo añade**. `align` mantiene su defecto `start` y ningún valor
  existente cambia de comportamiento.

## Contexto

`Hero.align` gobierna dos nodos —el cuerpo y su cabecera— por el atributo `data-align` de la raíz, y
declaraba dos valores: `start` y `center`. Es la prop que decide si un hero se lee a la izquierda o
centrado, y con dos valores no cubre dos composiciones que el catálogo ya sabe pintar:

- **`end`** — el hero cuyo texto cuelga a la derecha, que es la contraparte de `start` y aparece en
  cuanto el hero lleva media a la izquierda.
- **`stretch`** — el hero cuyo contenido ocupa el ancho del cuerpo en vez de encogerse a su texto.
  No es una alineación de texto sino de caja: el texto sigue leyéndose desde la izquierda.

**El CSS de los dos ya está en el repo y no lo alcanza nadie.** `Hero.css.ts` declara
`[data-align=end]` y `[data-align=stretch]` sobre el cuerpo y sobre la cabecera, pero
`HeroOwnProps.align` no los admite, así que el typecheck rechaza el único camino que los enciende.
Entraron en el árbol como trabajo en curso y viajaron a `main` dentro del commit de capas de
ADR-142, que tocaba los 135 `.css.ts` a la vez y no se podía partir.

Este ADR no decide pintarlos: decide **que se puedan alcanzar**, que es lo que falta.

## Decisión

**1. `align` admite cuatro valores.**

```ts
align?: "start" | "center" | "end" | "stretch" | undefined;
```

| valor     | `alignItems` | `textAlign` |
| --------- | ------------ | ----------- |
| `start`   | `flex-start` | `left`      |
| `center`  | `center`     | `center`    |
| `end`     | `flex-end`   | `right`     |
| `stretch` | `stretch`    | `left`      |

**2. `stretch` no toca la alineación del texto.** Estira la caja y deja el texto donde `start` lo
pone. Es la diferencia entre alinear un bloque y alinear un renglón, y confundirlas es el error que
esta tabla existe para no cometer: un `stretch` que además centrara el texto sería un `center` con
otro nombre.

**3. Es aditivo y no hay migración.** El defecto sigue siendo `start`, los dos valores anteriores
pintan exactamente lo mismo que antes, y `data-align` ya viajaba a la raíz para los cuatro.

## Alternativas

**Retirar el CSS de `end` y `stretch` en vez de abrir el tipo.** Es la otra forma de deshacer el
estado partido, y se descartó porque los dos valores cubren composiciones reales —un hero con media a
la izquierda no se puede alinear hoy— y el CSS que las pinta ya está escrito y medido.

**Dejar el tipo abierto a `string`.** Descartada sin discusión: `data-align` alimenta selectores de
atributo, así que un valor no previsto no falla, simplemente no pinta. El mapa cerrado es lo que
convierte eso en un error de tipos.

## Consecuencias

- **El estado partido se cierra.** Hasta este ADR el repo tenía reglas CSS que ninguna API podía
  encender, que es la clase de deuda que no da error y no se ve en una revisión.

- **Nadie usa todavía los dos valores nuevos.** No hay consumidor en `apps/`, `packages/demos` ni las
  stories, así que el ADR abre una puerta antes de que alguien la cruce. Es deliberado: `align` es
  API pública y v1 la congela, de modo que el momento de decidir sus valores es antes de publicar,
  no cuando haga falta.

- **La ficha de API cambia.** `apps/web/generated/api.json` publica el tipo de `align`, así que
  `pnpm gen:docs` lo regenera y la página del componente pasa a listar los cuatro.
