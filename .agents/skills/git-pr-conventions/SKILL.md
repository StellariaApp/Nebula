---
name: git-pr-conventions
description: Convenciones de commits y PRs de Nebula — conventional commits con scopes del monorepo y checklist de evidencia.
---

# Git & PR Conventions

## Commits (conventional)

- `feat(scope): …` · `fix(scope): …` · `chore(scope): …` · `docs(scope): …` · `refactor(scope): …`

Scopes de Nebula:

- Paquetes: `tokens`, `hooks`, `themes`, `icons`, `web`, `native`, `native-camera`
- Dominios premium: `commerce`, `sales`, `payments`, `people`, `maps`
- Apps: `playground-web`, `playground-native`, `theme-creator`
- Otros: `tools`, `adr`, `docs`, raíz sin scope para cambios de monorepo

## Reglas

- Un commit = un cambio coherente (el scaffold, un componente, un ADR); evitar commits ómnibus.
- Los archivos generados (p.ej. `palettes.ts`) se commitean junto al cambio de la tool que los produce.
- Nunca commitear con gates rojos; si un gate queda pendiente (p.ej. contingencia), decirlo en el cuerpo del commit.

## PR checklist

- [ ] Descripción del cambio + motivación (enlazar doc/ADR que lo respalda).
- [ ] Evidencia de `pnpm turbo build typecheck lint` (y `check:contrast` si tocó tokens/themes).
- [ ] Riesgos y plan de rollback.
- [ ] Screenshots/video de stories si el cambio es visual.
- [ ] ADR incluido si cambia API pública o dependencias (ADR-014 regla 6).
