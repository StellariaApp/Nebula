# ADR-204 — El espía de scroll acepta una caja interior

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo nuevo de la segunda pasada de C3 en Polaris
  (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7, y en Polaris
  `docs/reviews/alineacion-polaris-2026-09-12.md` §7 punto 6).
- **Cambia API pública**: sí, y **solo añade**: `scroller` en `UseScrollSpyOptions`.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/hooks/src/use-scroll-spy.ts`, `__tests__/use-scroll-spy.test.ts`,
  `packages/hooks/README.md`, `docs/07` §7.3.

## Contexto

`useScrollSpy` mide `window.scrollY`, `innerHeight` y `documentElement.scrollHeight`: sirve a
`Nav.Links` en una landing, donde el que scrollea es el documento. En el panel no: desde ADR-187 la
pantalla scrollea dentro de `AppShell.Scroll`, el documento no se mueve y el espía no ve nada. La
cabecera de ficha de Polaris —pestañas que siguen a la sección visible— tuvo que llevar un espía
propio sobre el `ref` de `useAppShellScroll()`: la segunda copia de una regla que ya lleva encima
tres casos de borde medidos (el recorte de la sección corta, la astilla de subpíxel, el fondo del
documento).

`useScrolled` ya pasó por esto en ADR-187: ganó `scroller` y `AppShell` lo alimenta.

## Decisión

```tsx
useScrollSpy(ids, { scroller: useAppShellScroll().ref, chrome: SHEET_HEADER_HEIGHT_SCROLLED });
```

- `scroller` tiene **la misma forma y semántica** que en `useScrolled`: una ref, el elemento o
  `null`. La ref se lee dentro del efecto; vacía, el hook devuelve `initial` y no suscribe nada
  hasta que la propia ref cambie.
- Con `scroller` se escucha el `scroll` **de ese elemento**; `scrollY = scrollTop`, alto visible
  = `clientHeight`, fondo = `scrollHeight - clientHeight`, y cada sección se sitúa respecto al borde
  superior de la caja: `rect.top - box.getBoundingClientRect().top + box.scrollTop`. `resize` sigue
  siendo el de la ventana.
- `chrome` significa lo mismo —píxeles tapados por una barra pegada— pero **dentro de la caja**.
  Sin él, en una caja interior el techo es 0: `FloatingBand` mide las barras del documento y no
  aplica a un contenedor que scrollea por su cuenta.
- Sin `scroller` nada cambia: la rama de ventana es la de siempre, con `FloatingBand` de techo.

## Alternativas

- **Un hook aparte (`useBoxScrollSpy`)**: la regla del marcador, el recorte y la holgura son las
  mismas; sólo cambia de dónde salen cuatro números.
- **Que `AppShell.Scroll` provea su propio espía**: ataría el hook al armazón; `useScrolled` ya
  demostró que la opción en el hook basta y el armazón sólo tiene que dar la ref.
- **Aceptar sólo la ref** (lo que pedía el hallazgo): se acepta también el elemento y `null` por
  simetría exacta con `useScrolled`, que es lo que hace el contrato aprendible.

## Consecuencias

- El espía propio de la ficha de Polaris desaparece; la receta de la cabecera colgada (`docs/07`
  §7.3) dice cómo se conecta.
- `Nav.Links` no cambia: no pasa `scroller`.
- Test con una caja simulada (`clientHeight`, `scrollHeight`, `scrollTop` y `getBoundingClientRect`
  definidos a mano): mide el `scrollTop` de la caja y no el de la ventana, sitúa las secciones
  respecto al borde de la caja y no al de la ventana, `chrome` desplaza el marcador, al fondo gana
  la última y la ref vacía devuelve `initial` sin suscribir.
