# ADR-184 — La barra inferior es una fila, y no algo que flota sobre un hueco reservado

- **Estado**: **aceptada** · 2026-08-27 — decidida por el propietario
- **Cambia API pública**: **no**. Ninguna prop cambia. Es la geometría del modo carril por debajo de
  `tablet`: la barra deja de ser `position: fixed` y pasa a ocupar una fila del grid de la raíz.
- **Toca**: `packages/web/src/components/AppShell/AppShell.css.ts`.
- Corrige la forma que [ADR-153](ADR-153-el-carril-declara-que-hace-cuando-no-cabe.md) le dio a la
  barra inferior, sin tocar la decisión: el carril sigue tendiéndose bajo `tablet`.

## Contexto

Bajo `tablet` la raíz medía `calc(100dvh - 94px)` y dejaba esos 94 de `margin-block-end` para que la
barra se posara encima en `position: fixed; inset-block-end: 12px`.

**En un iPhone la barra no se veía.** Ni un poco: el sitio donde le tocaba salir estaba vacío, y sólo
asomaba durante el gesto de arrastre. Medido en el dispositivo con una sonda dentro de la propia app:

| lo que decía el navegador | lo que se pintaba |
| ------------------------- | ----------------- |
| `innerHeight` 717 | hasta ~620 |
| `clientHeight` 717 | los últimos **~100 px** no se pintan |
| `visualViewport.height` 717 + offset 0 | — |
| barra en `635..705`, «dentro» por 12 px | caía entera en esos 100 px |

La prueba que lo cerró fue una regla de marcas contadas desde el borde: **las de 200, 160 y 120 se
ven; las de 40 y 0 no.** Cada marca es un `div` liso con borde sólido, sin cristal y sin `z-index`
raro, así que no era la barra ni su superficie.

Antes de llegar ahí se descartaron, con medidas y no con teorías:

- **posicionamiento** — `getBoundingClientRect` daba la barra dentro de la ventana;
- **algo tapándola** — `elementFromPoint` en su centro devolvía la propia barra;
- **el cristal y el `z-index`** — un `div` liso en las mismas coordenadas tampoco se pintaba;
- **las dos ventanas de iOS** — en una página suelta `svh`, `dvh` y `visualViewport` coincidían y
  una barra `fixed` idéntica **sí** se veía. Esa página desplaza el documento; la app no, porque su
  scroll vive en un contenedor interno.

Ningún API reporta esa franja, así que no se puede compensar midiendo. Hay que dejar de usarla.

`the film vault`, que monta el mismo armazón, no la usa: su barra es una fila del grid
—`grid-template-rows: auto 1fr auto`— sin `dvh`, sin `fixed` y sin hueco reservado. Y en el mismo
teléfono se ve.

## Decisión

Por debajo de `tablet`, la raíz da a la barra **una fila propia**:

```ts
gridTemplateAreas: `"chrome" "main" "rail"`,
gridTemplateRows: "auto 1fr auto",
blockSize: "100dvh",
```

y el `<aside>` vuelve a su área con `position: relative`, mientras el contenedor de la barra cambia
`position: fixed` e `inset` por `position: relative` y un `margin` que conserva los 12 px de aire.

Así la barra está dentro de lo que la raíz pinta **por construcción**, y no hay borde de ventana con
el que discutir.

## Consecuencias

- Desaparece `RAIL_BAR_SPACE`. El hueco ya no lo reserva nadie: lo ocupa la fila.
- **`railCollapse: "hidden"` sale ganando.** Antes había que quitar la reserva a mano —el fallo
  silencioso que motivó ADR-153—; ahora la fila `auto` se cierra sola cuando el carril se retira.
- La barra deja de flotar sobre el contenido: lo empuja. Es un cambio visible y es el que se quiere,
  porque flotar sobre una franja que no se pinta era el fallo.
- El carril vertical no cambia. Comprobado a 1440×420: el contenedor va a `scrollTop 431` y el
  enlace activo entra en vista, igual que antes. Y en la barra horizontal la revelación de
  [ADR-182](ADR-182-quien-scrollea-la-barra-cambia-con-el-ancho.md) sigue: `settings` la deja en
  `scrollLeft 450` con el activo dentro.
- **Esto no se puede verificar en un emulador**: el escritorio pinta esos 100 px sin problema. La
  comprobación es en un teléfono de verdad.
