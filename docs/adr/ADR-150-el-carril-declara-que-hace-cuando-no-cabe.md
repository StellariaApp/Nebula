# ADR-150 — El carril declara qué hace cuando no cabe

- **Estado**: aceptada · 2026-08-15 (decisión del propietario) · **W5** · implementada
- **Cambia API pública**: sí, y **solo añade**: `railCollapse` en `AppShell`, con default `"mini"` —
  que es exactamente lo que hace hoy—. Ninguna prop actual cambia de tipo ni de significado, y el DOM
  y el CSS de un `AppShell` que no la pase son idénticos a los de antes.
- Toca la geometría que fijó [ADR-126](ADR-126-el-carril-y-el-contenido-comparten-eje.md) sin
  moverla: el eje compartido sigue siendo el mismo, solo se decide si el carril ocupa o no.

## Contexto

El modo carril de `AppShell` —el que se activa al pasar `sidebar`— tiene una respuesta cerrada a la
falta de sitio, escrita en dos media queries de `AppShell.css.ts`:

- por debajo de `laptop` (≤1023) el grid pasa a `railMiniWidth 1fr`: el carril se estrecha a iconos;
- por debajo de `tablet` (≤767) el grid se hace de una columna y el carril se tiende como **barra
  inferior fija**, para lo cual la raíz reserva `RAIL_BAR_SPACE` con `margin-block-end` y se descuenta
  ese hueco del `block-size`.

Esa respuesta es buena cuando el carril es la única navegación de la app. No lo es cuando la app ya
tiene otra: el sitio de documentación pliega su barra en un cajón de hamburger, y ahí el carril
sobra por debajo de `laptop` porque **sus enlaces caben en el cajón**, que es una sola superficie de
navegación en vez de dos.

El intento evidente —que el consumidor esconda su `AppShell.Sidebar` con `display: none`— no funciona
y falla en silencio: **el hueco no lo reserva el carril, lo reserva la raíz**. Escondido el carril
quedan igual la columna mini vacía entre 768 y 1023 y los 114 px de `margin-block-end` por debajo de
768, reservados para una barra inferior que ya no existe.

## Decisión

### `railCollapse` decide si el carril se estrecha o se retira

```ts
type AppShellRailCollapse = "mini" | "hidden";
```

- **`"mini"`** (por defecto) — lo de hoy, sin tocar: carril de iconos bajo `laptop`, barra inferior
  bajo `tablet`, y la raíz reservando el sitio de las dos.
- **`"hidden"`** — bajo `laptop` el carril se retira y **la raíz no reserva nada**: una sola columna,
  `block-size: 100dvh` y `margin-block-end: 0`. Por encima de `laptop` los dos modos son idénticos.

La prop se lee **solo en modo carril**. Sin `sidebar` no hay carril que colapsar y `AppShell` la
ignora, igual que ignora `sidebarWidth`.

### Retirar el carril es cosa de los dos, y por eso viaja por contexto

Quitar la reserva sin quitar el carril deja el carril encima del contenido, y quitar el carril sin
quitar la reserva deja el hueco vacío. Son media queries en dos elementos distintos —la raíz y el
`<aside>`— que tienen que dispararse a la vez o no valen.

El valor viaja por `AppShellContext`, que ya existe y ya lleva el estado que las partes necesitan
(`collapsed` y los rótulos). `AppShellSidebar` lo lee y se aplica su propia regla. La alternativa
—que el consumidor esconda el `<aside>` por su cuenta— es justo el fallo silencioso que motiva este
ADR: deja las dos mitades sueltas y quien las desincronice no se entera.

### Retirar no es esconder contenido

`"hidden"` **no** es una forma de tener menos navegación en móvil: es una forma de tenerla en otro
sitio. Un `AppShell` con `railCollapse="hidden"` cuyos enlaces no aparezcan en ninguna otra
superficie por debajo de `laptop` deja la app sin navegar, y eso no lo detecta ningún gate — el
contrato de a11y de `docs/03` mide lo que hay en el DOM, no lo que falta.

## Consecuencias

- **No rompe a nadie**: el default es el comportamiento actual, y el CSS de `"mini"` es literalmente
  el que ya estaba. Los consumidores que no pasen la prop no cambian ni un byte de markup.
- **Coste de tamaño acotado**: dos reglas de estilo nuevas, ambas solo dentro de media queries.
  `AppShell` no se mueve de su presupuesto de `docs/03` §4.
- **El sitio pasa a `"hidden"`**: `apps/web` retira el carril bajo `laptop` y monta sus enlaces en el
  cajón del hamburger, que a partir de ahora se pliega en `laptop` y no en `tablet`.
- **Regla derivada**: quien pase `"hidden"` se compromete a ofrecer esos enlaces en otra superficie
  por debajo del corte. Queda escrito en el `@default` de la prop y en `AppShell.md`.

## Alternativas descartadas

**Un breakpoint libre en vez de dos modos** (`railCollapse={{ hidden: "laptop" }}`). Multiplica los
estados a probar y no hay caso: los dos cortes del carril ya están fijados por su propio CSS, y lo
que faltaba no era elegir dónde, sino elegir qué.

**Que el consumidor esconda el `<aside>` y le reste el hueco a la raíz con style props.** Es lo que
se intentó primero. Exige que el consumidor reproduzca `RAIL_BAR_SPACE` y los dos breakpoints en su
propio código, duplicando constantes privadas de la librería que además pueden cambiar sin avisarle.

**Retirar la barra inferior de `"mini"` y quedarnos con un solo comportamiento.** Rompería a todo
consumidor del modo carril que hoy dependa de ella, y la barra inferior es la respuesta correcta
para una app cuyo carril es su única navegación —que es el caso de fonicredito y tfv—.
