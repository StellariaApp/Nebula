# ADR-130 — `NavLink` acepta adaptador de router

- **Estado**: aceptada · 2026-08-11 · **WN** · implementada
- **Cambia API pública**: sí, **aditivo**: `NavLink` gana `component?: ElementType`, el mismo
  adaptador que ya tenían `Nav.Links.Link`, `Footer.Group.Link`, `Breadcrumbs` y `Anchor`.
- **Depende de**: [ADR-101](ADR-101-la-barra-del-carril-compone.md) (la barra del carril compone).

## Contexto

`NavLink` es el enlace del carril, y era **el único de los cinco componentes de enlace del catálogo
sin adaptador de router**: clavaba `<a href>`. `Breadcrumbs` ya documentaba la regla en su propio
JSDoc —«el componente no depende de Next ni de ningún otro router»—; `NavLink` simplemente se quedó
fuera.

En una SPA eso no es un detalle. Medido en el sitio de docs: cada clic en el carril hacía **recarga
completa de documento**, así que el carril se remontaba y perdía su scroll —el usuario lo veía como
«el sidebar se reinicia al hacer click»—, y con él se iba el estado de toda la página.

## Decisión

`NavLinkProps` gana `component?: ElementType` y la rama con `href` renderiza `component ?? "a"`. Sin
adaptador se comporta exactamente como antes.

El JSDoc dice por qué existe, que es la parte que se olvida: sin él el enlace recarga el documento, y
en una SPA eso tira el scroll del propio carril.

## Consecuencias

- **`apps/web` pasa `next/link`** en el carril, la barra, el pie, la tabla del catálogo, las fichas
  de sección y el par anterior/siguiente. Verificado: tres saltos —dos del carril y uno de la barra—
  con **una sola carga de documento**, la inicial, y un testigo en `window` que sobrevive a todos.
- **El carril conserva su posición**: con el activo a la vista no se mueve —1200 antes y después del
  clic—, y solo se desplaza cuando el activo queda fuera.
- Ningún consumidor existente cambia: el defecto sigue siendo `<a>`.

## Alternativas descartadas

**Envolver `NavLink` en un `Link` desde la app.** El ancla quedaría anidada dentro de otra ancla, que
es HTML inválido y rompe el foco.

**Que el catálogo importe el `Link` de Next.** Ata `@stellaria/nebula-web` a un framework, que es lo
que el adaptador existe para evitar.
