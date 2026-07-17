# ADR-017 — Dependencias de `apps/playground-web` y motor del gate a11y (W1.3)

- **Estado**: aceptada · 2026-07-17 (checkpoint W1.3 con el propietario)
- **Contexto**: ADR-007 ratificó Storybook 10.5 (builder Vite) + `addon-a11y` como playground web; docs/03 §4 fija el gate axe "vía test-runner sobre TODAS las stories"; docs/03 §3 y ADR-015 fijan el gate de bundle con `size-limit`. Montar `apps/playground-web` (hoy solo un README placeholder) materializa esas decisiones e introduce una superficie de dependencias concreta —incluido un navegador headless—, que por ADR-014 (regla 6) se registra ANTES de instalar.
- **Decisión**:
  - **Motor del gate a11y**: `@storybook/test-runner` + `axe-playwright` (Chromium headless de Playwright), NO el `@storybook/addon-vitest`. Razón: coincide literal con docs/03 §4 y mantiene el gate a11y aislado del runner de unit tests (Vitest de ADR-015). Implica `playwright install chromium` (~130 MB) en dev/CI.
  - **Footprint de `apps/playground-web`** (devDependencies salvo indicado): `storybook` 10.5, `@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/test-runner`, `axe-playwright`, `playwright`, `vite`, `react` + `react-dom` (19), `typescript` 7.0.2. Harness del gate a11y para servir el build estático y esperar el puerto: `concurrently`, `http-server`, `wait-on`. Consume `@stellaria/nebula-web` (+ hooks/themes/tokens transitivos) como `devDependency` `workspace:*` (es una app, no publica).
  - **Gate de bundle**: `size-limit` + `@size-limit/preset-small-lib` viven en `packages/web` (miden sus propios entries), con la task turbo `size` (ya existente) y una nueva task turbo `a11y`. Budgets provisionales de docs/03 §3: primitivos ≤5 kB · compuestos ≤15 kB · patterns ≤35 kB gzip (se afinan cuando lleguen componentes en W1.4).
  - Config de Storybook **manual** (`.storybook/main.ts` + `preview.tsx`), sin `storybook init`, para no ensuciar el workspace con scaffolding ni sample stories.
- **Alternativas**:
  - `@storybook/addon-vitest` (story tests en Vitest browser mode): rechazado — se aleja del wording de docs/03 §4 y acoplaría el gate a11y al runner de unit tests; el runner separado lo aísla.
  - Ladle: ya descartado en ADR-007 (sin ecosistema a11y/docs/interaction).
  - axe estático / sin navegador: no cubre las stories renderizadas reales.
- **Consecuencias**:
  - Chromium de Playwright (~130 MB) en el entorno de dev/CI; el gate `a11y` compila `storybook-static` y corre `test-storybook`.
  - Nueva task turbo `a11y` (dependsOn `^build`); `size` ya existía. `apps/playground-web` no expone API pública ni cambia el contrato.
  - Lint parsea con TS 5.9.3 (ADR-012, sin cambios); build/typecheck de las stories con TS 7.
