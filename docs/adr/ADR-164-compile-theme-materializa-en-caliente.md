# ADR-164 — `CompileTheme` materializa en caliente lo que no se pudo materializar en build

- **Estado**: **aceptada** · 2026-08-17 — aprobada por el propietario para desarrollarse
- **Cambia API pública**: sí. Añade un subpath `@stellaria/nebula-web/theme-runtime` con una función.
- **Depende de**: [ADR-163](ADR-163-el-provider-acepta-un-tema-ya-materializado-como-clase.md), cuya
  tercera forma es lo que esta función produce. Sin ella, `CompileTheme` no tendría a quién dárselo.
- **Toca**: `docs/02` §4 y §5 (el Theme Creator es el primer consumidor interno).

## Contexto

ADR-163 cubre el tema que se conoce cuando el producto compila. Queda el otro caso, que es real y no
es marginal:

- **Un constructor de sitios** que carga los estilos desde un backend. El tema no existe hasta que
  el usuario abre el documento, así que no hay build donde precompilarlo.
- **Multi-tenant**, donde el tema depende de quién entra.
- **El Theme Creator** (`docs/02` §5), cuyo preview en vivo *es* un tema que cambia mientras se
  edita.

Para todos ellos la vía de hoy es `assignInlineVars`: 627 propiedades personalizadas en el atributo
`style` de un elemento. Funciona, y [ADR-121](ADR-121-set-theme-acepta-un-tema-entero.md) la eligió
bien **para su caso** — el tema que cambia. Lo que no se vio entonces es que el mecanismo del caso
dinámico acabó siendo también el del caso fijo, que es lo que ADR-163 corrige.

Aquí el caso sí es dinámico, y aun así la vía inline tiene tres costes que una hoja no tiene:

1. **Cambiar de tema son 627 escrituras al DOM.** En un editor con preview en vivo eso ocurre a cada
   toque de un control, no una vez por sesión.
2. **No hay forma de que el servidor lo mande bien.** El tema llega del backend, así que el HTML
   podría traerlo resuelto; con vars inline el provider las escribe en un efecto, después de
   hidratar. El usuario ve el tema por defecto y luego el suyo — el mismo parpadeo de ADR-155, pero
   aquí ningún script de arranque puede evitarlo, porque el tema no está en `localStorage`.
3. **Dos temas a la vez no componen bien.** Un constructor quiere su propio cromo en un tema y el
   lienzo en el del documento. Con clases eso es anidar; con vars inline es anidar providers, que
   arrastra contexto y remonta.

**El peso no es el argumento.** Los 40 kB del atributo comprimen a 4,5 kB brotli. Quien decida por
ahí decidirá mal.

## Decisión propuesta

### 1. Una función que devuelve la clase y su CSS

```ts
export function CompileTheme(theme: NebulaTheme): { className: string; css: string };
```

- `className` se deriva de un **hash del contenido** del tema, no de un contador ni de un aleatorio.
  Tiene que ser determinista o el servidor y el cliente no coincidirán y la hidratación romperá.
- `css` es la regla completa: `.<className>{--nebula-…:…;…}`.

No necesita Vanilla Extract ni ninguna dependencia nueva. Los nombres de las custom properties ya
son públicos y estables —los publica `vars`—, así que esto es construir una cadena sobre el mismo
mapa que `ThemeToVars` ya produce. Es la mitad de lo que `assignInlineVars` hace hoy, con otra
forma de salida.

### 2. El consumidor decide dónde va la hoja

La función no inyecta nada. Devuelve el CSS y quien lo llama lo pone donde le sirva:

- **En el servidor**, en un `<style>` dentro del HTML. Esto es lo que arregla el punto 2 del
  contexto: un tema que viene de un backend **llega pintado desde el servidor**, sin parpadeo y sin
  script de arranque.
- **En el cliente**, en un `<style>` que se reemplaza al cambiar de tema.

Que la función no inyecte es deliberado. Inyectar exige decidir dónde, con qué `nonce` y en qué
orden respecto a las capas de `@layer`, y eso es del consumidor. La librería no tiene un sitio
correcto donde ponerlo que valga para todos.

### 3. Vive en un subpath, no en el índice

`@stellaria/nebula-web/theme-runtime`. Lo pide el gate de bytes: es código que la mayoría de
consumidores no ejecuta nunca, y el índice ya arrastra bastante. Mismo criterio que los siete
subpaths que ya existen.

### 4. La vía inline se queda

No se retira ni se deprecia. Para un tema que no cambia y un árbol pequeño —una isla, una tarjeta de
demo, una story— inyectar vars es más simple y no paga la gestión de una hoja. `CompileTheme` es la
respuesta cuando el tema cambia a menudo, cuando tiene que llegar del servidor, o cuando conviven
varios.

## Alternativas

**Dejar sólo la vía inline.** Es lo que hay. Se descarta por los tres costes del contexto, ninguno
de los cuales se arregla con más bytes o menos.

**`adoptedStyleSheets` / CSSOM.** Más limpio en el cliente y **no existe en el servidor**, así que
no resuelve el punto que más duele —que el tema llegue pintado— y obligaría a mantener dos caminos.
Se descarta por eso, no por soporte.

**Que el provider inyecte la hoja él mismo.** Ahorra una línea al consumidor y le quita el control
del `nonce`, del orden de capas y del punto de montaje. Con CSP estricta eso es un bloqueo, y la
librería no puede adivinar la política del consumidor. `ColorSchemeScript` ya expone `nonce` por
esta misma razón.

**Generar la hoja en el backend del consumidor.** Válido y no necesita a Nebula para nada —salvo
que el backend tendría que conocer los 627 nombres del contrato y mantenerlos sincronizados con la
versión de la librería. Esta función es justamente lo que evita esa duplicación.

## Consecuencias

- Un subpath más y una entrada más en el gate de `size-limit`.
- `docs/02` §4 gana la tabla de las tres vías —clase de build, clase en caliente, vars inline— con
  cuándo usar cada una. §5 puede dejar de asumir que el preview del Theme Creator va por vars.
- El hash del `className` entra en el contrato implícito: cambiarlo invalida cualquier hoja
  cacheada por el consumidor. Se documenta como detalle estable, no como interno.
- **No cierra el agujero de los `breakpoints`**, que no llegan al CSS por ser media queries y no
  admitir `var()`. Eso es otra decisión y sigue abierta.
