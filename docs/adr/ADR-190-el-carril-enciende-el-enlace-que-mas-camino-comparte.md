# ADR-190 — El carril enciende el enlace que más camino comparte con la ruta

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `activeMode` y `active` en `AppShell.Sidebar`.
  `AppShell.Link active` sigue mandando cuando se pasa.
- **Toca**: `packages/web/src/components/AppShell/`, y `BestPathMatch` sale de
  `Nav/use-nav-active.ts` a `utils/path-match.ts` para que lo compartan.
- Es el hallazgo #10 de C2 y el «hallazgo abierto» de `docs/07` §6.2.

## Contexto

`Nav.Links` tiene `activeMode="auto" | "hash" | "pathname" | "manual"` y, en `pathname`, enciende
el enlace cuyo `href` **más largo** prefija la ruta **por tramos**: `/avatars` no enciende
`/avatarsx`, y `/` no enciende todo (`BestPathMatch`, `use-nav-active.ts:52`). `AppShell.Link` es
un `NavLink` con clase y no sabe nada de la ruta: `active` lo pasa el consumidor.

Rosette (`app-client.tsx` `ActiveRail`) y Polaris (`product-rail.tsx:31`) han reescrito la misma
función, y las dos con la misma regla que `Nav` ya tiene. Polaris la reescribió **sin** el «gana el
más largo», así que `/dashboard` se enciende en todas las pantallas del panel.

## Decisión

```tsx
<AppShell.Sidebar activeMode="pathname" | "manual" active={href?}>
```

- El cálculo vive en **`Sidebar`** y no en `Links`, porque el ganador se elige **entre todos los
  grupos**: si cada `Links` eligiera el suyo, dos grupos con `/dashboard` y `/dashboard/avatars`
  encenderían los dos. Cada `AppShell.Link` registra su `href` por contexto al montar; `Sidebar`
  lee el `pathname` con el mismo `useSyncExternalStore` que `Nav` y resuelve con `BestPathMatch`.
- `activeMode="pathname"` es **opt-in**; el defecto sigue siendo `"manual"` para no cambiar ningún
  montaje existente. `active` explícito en un `Link` gana siempre, y `active` en `Sidebar` fuerza
  uno como en `Nav.Links`.
- `BestPathMatch` y `NormalizePath` se mudan a `utils/path-match.ts`; `Nav` los importa de ahí.
  Una sola regla de «activo por ruta» en el catálogo.

## Alternativas

- **`activeMode` en `AppShell.Links`**: descartado por el ganador entre grupos.
- **Que `AppShell.Link` acepte `matchPath`** y decida solo: el «más largo» necesita ver a los
  vecinos.
- **Adaptador de router**: `Nav` ya demostró que `window.location.pathname` + `popstate` basta y no
  ata a Next.

## Consecuencias

- `ActiveRail` de Rosette y el filtro de Polaris desaparecen. `Body` de Rosette deja de necesitar
  `usePathname`.
- `Nav` no cambia de comportamiento: solo de dónde importa.
- Test: el mismo caso de `Nav.test.tsx` («activeMode explícito gana a la deducción») para
  `Sidebar`, más el de dos grupos con prefijos anidados.
- **Veredicto de Polaris (2026-09-12)**: un layout de Next no vuelve a renderizar al navegar y
  `popstate` no se dispara con `pushState`, así que el activo se quedaba viejo. `Sidebar` acepta
  `pathname` para recibir el del router; `activeMode="pathname"` sigue decidiendo la regla.
