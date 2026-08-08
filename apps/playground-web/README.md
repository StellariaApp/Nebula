# playground-web

Storybook 10.5 (builder Vite) del design system Nebula — ADR-007 / ADR-017.

## Scripts

```bash
pnpm --filter playground-web dev     # Storybook en http://localhost:6006
pnpm --filter playground-web build   # storybook-static
pnpm --filter playground-web a11y    # gate axe sobre TODAS las stories (test-runner + Playwright)
```

- **Toolbar**: tema (light/dark) · reduced-motion · viewport. Cada story se envuelve en `NebulaProvider` (decorator global).
- **Consume** `@stellaria/nebula-web` compilado (dist con CSS precompilado, ADR-016) — sin plugin de VE en Storybook.
- **Gate a11y** (`turbo a11y`): `@storybook/test-runner` + `axe-playwright`, 0 violaciones, exit ≠ 0 al fallar.
- **Gate size** (`turbo size`, en `packages/web`): size-limit por entry (budgets docs/03 §3).
- Plantilla obligatoria de stories por componente: [`STORIES-TEMPLATE.md`](./STORIES-TEMPLATE.md).
