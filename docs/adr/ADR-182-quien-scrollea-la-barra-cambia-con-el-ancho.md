# ADR-182 — Quién scrollea la barra cambia con el ancho, y la búsqueda empieza en uno mismo

- **Estado**: **aceptada** · 2026-08-27 — decidida por el propietario
- **Cambia API pública**: **no**. Es corrección: `Scroller`, una función privada de
  `AppShellSidebarBody`, empieza a mirar en el propio nodo en vez de en su padre. Ninguna prop
  cambia de tipo ni de significado, y el DOM y el CSS son los mismos.
- **Toca**: `packages/web/src/components/AppShell/components/Sidebar.tsx`.
- Cumple lo que [ADR-153](ADR-153-el-carril-declara-que-hace-cuando-no-cabe.md) tendió como barra
  inferior y lo que `AppShell.md` ya promete desde entonces.

## Contexto

`Sidebar.Body` revela el enlace activo: si el de la ruta actual queda fuera de vista, mueve **solo
su propio contenedor** hasta el borde más cercano. `AppShell.md` lo dice de las dos orientaciones:

> mueve solo su propio contenedor —el que scrollea de verdad— hasta el borde más cercano, en los dos
> ejes: sirve igual para el carril vertical que para la barra horizontal de `tablet`.

**En la barra horizontal no ocurría.** Medido en Rosette contra WebKit a 390 px, con diez destinos
en la barra inferior:

| ruta | activo | posición en pantalla | `scrollLeft` |
| ---- | ------ | -------------------- | ------------ |
| `/dashboard/explore` | Explorar | `168..206` · dentro | 0 |
| `/dashboard/settings` | Ajustes | `618..656` · **fuera** | **0** |
| `/dashboard/users` | Usuarios | `568..606` · **fuera** | **0** |

El activo se quedaba fuera de pantalla y la barra no se movía. `data-active="true"` estaba puesto y
el observador se disparaba: lo que fallaba era **a quién se le pedía el desplazamiento**.

`Scroller` arrancaba en el padre:

```ts
let parent = node.parentElement;
```

y eso presupone que el cuerpo nunca es el que scrollea. En el carril vertical es cierto —
`sidebar_body` es `overflow: hidden` y el que se desplaza es `sidebar_container`, que lleva
`overflow-y: auto`—. **Bajo `tablet` los papeles se cambian**: el cuerpo pasa a `overflow-x: auto`
y el contenedor, ya fijo y del ancho de la pantalla, se queda sin nada que desplazar. Medido en el
mismo sitio:

| elemento | `clientWidth` | `scrollWidth` | ¿desplaza? |
| -------- | ------------- | ------------- | ---------- |
| el que devolvía `Scroller` — `sidebar_container` | 364 | 364 | **no** |
| el que scrollea de verdad — `sidebar_body` | 229 | 596 | sí |

Así que el `scrollTo` salía, pero contra un elemento sin recorrido. Un no-op que no da error, no
rompe el render y no lo ve ningún gate: el contrato de a11y de `docs/03` mide lo que hay en el DOM,
y el enlace **estaba** en el DOM — sólo que a 618 px de una pantalla de 390.

## Decisión

**La búsqueda empieza en el propio nodo.**

```ts
let element: HTMLElement | null = node;
while (element !== null) {
  const style = getComputedStyle(element);
  if (SCROLLS.has(style.overflowY) || SCROLLS.has(style.overflowX)) return element;
  element = element.parentElement;
}
```

Es la única forma que no presupone la orientación. Quién scrollea no es una propiedad del árbol sino
del ancho de la ventana, y preguntárselo al nodo antes de subir da la respuesta correcta en los dos
casos sin ramas ni media queries en JavaScript.

**El carril vertical no cambia.** Ahí `sidebar_body` sigue siendo `overflow: hidden`, que no está en
`SCROLLS`, así que la búsqueda sube igual que antes y encuentra el contenedor.

## Consecuencias

- En la barra inferior, entrar en una ruta cuyo enlace queda a la derecha la deja desplazada con ese
  enlace a la vista. Comprobado tras el cambio, mismo montaje: `settings` → `scrollLeft: 367`, activo
  en `251..289`; `users` → `scrollLeft: 357`, activo en `211..249`. `explore`, que ya cabía, se queda
  en `0` — `Nearest` sigue devolviendo cero cuando no hay que mover nada.
- El carril vertical se comporta igual. Comprobado a 1440×420, que es donde tiene que desplazarse de
  verdad: el contenedor va a `scrollTop: 431` y el activo entra en vista, como antes.
- **Esto no vuelve descubrible lo que hay fuera de la barra.** Revelar el activo es la mitad del
  problema; la otra es que diez destinos en una franja de 229 px no anuncian que siguen a la
  derecha. Eso es una decisión de diseño aparte y no la toca este ADR.
- La función deja de llamarse «el contenedor» en su cabeza: puede devolver el propio nodo, y el
  comentario lo dice para que nadie la vuelva a arrancar en el padre.
