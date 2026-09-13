# ADR-188 — Las barras flotantes declaran techo y suelo, y un hook los mide

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `useFloatingBand()`, `FloatingBand(height)` y
  `CenterOn(element)` en `@stellaria/nebula-hooks`. Ningún componente cambia de props.
- **Toca**: `packages/hooks/src/`, y la documentación de `AppShell.md`, `Affix.md` y `Nav.md`.
- Es el hallazgo #7 de C2 y el «contrato» de `docs/07` §7.4.

## Contexto

Rosette marca toda barra flotante con `data-floating="header" | "footer" | "dock"`: la cabecera
pegada de cada pantalla, la cabecera colgada, el dock de preferencias de la landing. `lib/scroll.ts`
recorre esos nodos, suma los `header` para saber dónde acaba el **techo** visible y el resto para
dónde empieza el **suelo**, y `CenterOn(el)` centra un elemento **entre los dos** en el contenedor
que scrollea de verdad (`Scrollable(el)` sube por los ancestros hasta el primero con `overflow-y`
auto/scroll y recorrido).

Sin eso, «centrar en pantalla» centra en la ventana: bajo una cabecera pegada de 120 px y sobre una
barra de acción fija, lo centrado queda tapado por arriba. Ningún hook de Nebula lo sabe:
`useScrollSpy` acepta un `chrome` numérico que el consumidor tiene que calcular, y `Affix` no
declara nada.

## Decisión

**El atributo es el contrato.** `data-floating="header"` suma al techo; cualquier otro valor
(`"footer"`, `"dock"`) suma al suelo. Solo cuentan los nodos con alto distinto de cero, así que un
dock oculto bajo `phone` no descuenta nada. Lo declara quien pinta la barra; `AppShell.Header`,
`AppShell.Subbar` y `Nav floating` **lo llevan de serie** cuando están pegados, y `Affix` lo acepta
como prop pasante (ya la acepta: es un atributo DOM).

En `@stellaria/nebula-hooks`:

```ts
FloatingBand(height: number): { ceiling: number; floor: number }
CenterOn(element: HTMLElement, options?: { behavior?: ScrollBehavior }): void
useFloatingBand(): { ceiling: number; floor: number }   // se recalcula en resize y en scroll, con rAF
```

`useScrollSpy` toma `chrome` de `FloatingBand` cuando no se le pasa, así la `Nav` de anclas deja de
necesitar el número a mano.

## Alternativas

- **Que cada barra registre su alto por contexto**: obliga a que todo flotante sea un componente de
  Nebula. El dock de Rosette es un `GlassSurface` dentro de un `Affix`; el atributo lo cubre sin
  jerarquía.
- **`scroll-margin-top` en CSS**: resuelve el salto a un ancla, no centrar un elemento entre dos
  barras en un contenedor que no es la ventana.
- **Dejarlo en el producto**: son 58 líneas que Rosette ya tiene y Polaris tendría que copiar; y la
  mitad del valor está en que `AppShell` y `Nav` pongan el atributo solos.

## Consecuencias

- `Rosette/src/lib/scroll.ts` se sustituye por tres imports. `ScrollToTop` no sube: busca por
  `[class*='Scroll']` y es un rodeo del producto que `useAppShellScroll().ref` (ADR-187) hace
  innecesario.
- Los `.md` de `AppShell`, `Affix` y `Nav` documentan el atributo. Es la única forma de que un
  producto sepa que existe.
- Presupuesto de `hooks`: son funciones de DOM sin dependencias; se mide.
