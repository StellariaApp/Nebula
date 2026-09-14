# ADR-199 — El cajón deduce el activo como el grupo

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo 2 de C3 en Polaris (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7, y en Polaris
  `docs/reviews/alineacion-polaris-2026-09-12.md` §6 «Hallazgos de catálogo»).
- **Cambia API pública**: sí, y **solo añade**: `active`, `activeMode`, `spyOffset` y `pathname` en
  `Nav.Sidebar`; `pathname` en `Nav.Links`.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/Nav/` (`components/Sidebar.tsx`, `components/Links.tsx`,
  `use-nav-active.ts`, `Nav.types.ts`, `Nav.md`, `__tests__/Nav.test.tsx`), la story de `Nav` en el
  playground y `docs/07` §4.2.

## Contexto

`Nav.Links` resuelve el enlace activo con `useNavActive` —`auto`, `hash`, `pathname`, `manual`,
más `active` y `spyOffset`— y lo publica a sus `Nav.Links.Link` por `NavLinksContext`. El cajón
móvil (`Nav.Sidebar`) monta esos mismos `Link` **sueltos**, sin `Nav.Links` alrededor —el grupo
horizontal trae indicador deslizante, overflow y colapso, que en una columna sobran—, y no proveía
el contexto: un `Nav.Links.Link` dentro del cajón no sabía cuál era el activo.

Polaris lo resolvió a mano (`nav-client.tsx`, `ActiveHref`): una copia de `BestPathMatch` que
recorre las secciones y pasa `active={section.href === active}` a cada enlace del cajón. Es la
tercera copia de la misma regla en tres consumidores, después de las que ADR-190 retiró de Rosette y
del carril de Polaris. Y arrastra el mismo defecto que ADR-190 encontró en el carril: un layout de
Next no vuelve a renderizar al navegar, así que lo que lee `window.location` se queda viejo.

## Decisión

```tsx
<Nav.Sidebar activeMode="auto" | "hash" | "pathname" | "manual" active={href?} spyOffset pathname>
  <Nav.Links.Link href="/docs">Docs</Nav.Links.Link>
  <Nav.Links.Link href="/docs/api">API</Nav.Links.Link>
</Nav.Sidebar>

<Nav.Links pathname={usePathname()}>…</Nav.Links>
```

- El cajón recoge los `href` de sus `Nav.Links.Link` hijos con el mismo `CollectItems` que
  `Nav.Links` —y con su mismo límite: un `Link` envuelto en un componente del consumidor no se ve—,
  resuelve con `useNavActive` y provee `NavLinksContext`. `activeMode` vale `"auto"` por defecto,
  como en el grupo: el cajón de una landing de anclas espía el scroll y el de una app de rutas lee
  el pathname sin que nadie lo configure.
- `pathname` tiene el mismo sentido que en `AppShell.Sidebar` (ADR-190): el `usePathname()` del
  router del consumidor, que gana a `window.location`. Se añade **también a `Nav.Links`**, que no
  lo tenía, para que los dos lados de la misma barra se alimenten de la misma ruta. `useNavActive`
  lo acepta como opción y hace `given ?? usePathname()`.
- `SetItemRef` del contexto es un no-op en el cajón: no hay indicador que medir. El activo se ve por
  `data-active` y `aria-current`, que ya pintaba la hoja.
- El espía solo corre **con el cajón abierto** (`enabled: opened` en `useNavActive`): en modo `hash`
  un cajón cerrado no cuesta un listener de scroll ni los del pin de ancla.
- Si el consumidor monta un `Nav.Links` completo dentro del cajón, **gana su provider** porque es el
  más cercano; el cajón tampoco cuenta esos `href` como suyos.

## Alternativas

- **Exportar `BestPathMatch`** para que el consumidor lo calcule bien: seguiría siendo cálculo a
  mano en cada producto, y no arregla el `aria-current` sin que cada enlace lleve `active`.
- **Registrar los `href` por contexto al montar** (como `AppShell.Link`): vería los enlaces
  envueltos, pero cambiaría el contrato del `Link` —que hoy no registra nada— y dejaría al cajón con
  una regla de recogida distinta a la del grupo. Los enlaces del cajón van como hijos directos.
- **Que el cajón exija un `Nav.Links` dentro**: mete el indicador y el overflow en una columna donde
  no pintan nada.

## Consecuencias

- `ActiveHref` y el `active` a mano de `PublicNavSidebarLinks` desaparecen en Polaris: los enlaces
  pasan a ser hijos directos del cajón y éste recibe `activeMode="pathname"` y el `pathname` del
  router.
- `Nav.Links` no cambia de comportamiento sin `pathname`; con él, conserva el modo y la regla del
  prefijo más largo en vez de caer a `manual` como hace `active`.
- El cajón publica `data-mode` como el grupo. Test: activo por `pathname` dado dentro del cajón,
  `pathname` del router gana a `window.location`, `active` fuerza `manual`, y un `Nav.Links`
  interior conserva su resolución.
