# Nebula — Documentación de Etapa 1 (análisis y plan)

> Generada el 2026-07-14 a partir del análisis verificado de Stellaria-Frontend, fonicredito-app y tfv-frontend. Checkpoints 1–3 cerrados con el propietario.

| Doc                                                            | Contenido                                                                                                                                                                                                |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [00-inventory.md](00-inventory.md)                             | Matriz de cobertura: ~213 componentes canónicos × 5 fuentes; disposición 100% de fonicredito (52) y tfv (117); decisiones de frontera C1                                                                 |
| [01-architecture.md](01-architecture.md)                       | Monorepo, paquetes (core + dominios premium), grafo, anatomía de componente, contratos compartidos, forms, permisos, política de dependencias                                                            |
| [02-theming.md](02-theming.md)                                 | Contrato `NebulaTheme` (TS-first + temas JSON), runtime dual CSS vars/Unistyles, temas oficiales, spec del Theme Creator                                                                                 |
| [03-a11y-motion-performance.md](03-a11y-motion-performance.md) | Contrato a11y por clase de componente, motion tokens/tiers, budgets y validación en CI                                                                                                                   |
| [04-migration-map.md](04-migration-map.md)                     | Stellaria→Nebula archivo por archivo; estrategia futura de adopción en apps (codemod directo, post-librería)                                                                                             |
| [05-roadmap.md](05-roadmap.md)                                 | Roadmap por etapas: F0 fundaciones · W1–W6 web (dev→publicación→premium) · TC theme-creator · N1–N5 native (dev→publicación→premium) · R review/migración                                                |
| [06-visual-language.md](06-visual-language.md)                 | **Especificación visual vinculante** (ADR-024): jerarquía, ritmo, densidad, elevación, effects budget y las láminas `Foundations/Visual QA`                                                              |
| [adr/](adr/)                                                   | 37 ADRs (ADR-001…ADR-037)                                                                                                                                                                                |
| [api/](api/)                                                   | Anexos de inventario: [fonicredito](api/fonicredito-components.md) (52, props completas), [tfv](api/tfv-components.md) (117, props completas), [stellaria](api/stellaria-native.md) (39, estado/calidad) |
| [patterns/](patterns/)                                         | [Plantilla canónica del componente web](patterns/web-component-template.md) — vinculante en W2–W4                                                                                                        |
| [reviews/](reviews/)                                           | Auditorías puntuales con fecha. **No declaran decisiones cerradas**: lo que se acepta de una review se recoge en un ADR y en el doc correspondiente                                                      |
| [stellaria-ui/](stellaria-ui/)                                 | Guía visual reusable de Stellaria. Es **especificación de dirección**, no norma de Nebula: cede ante ADRs y docs cerrados (ver precedencia abajo)                                                        |

## Cierres de fase

[f0-closure.md](f0-closure.md) · [w1-closure.md](w1-closure.md) · [w2-closure.md](w2-closure.md).
Una fase no se abre sin la anterior en verde (05 §gates).

## Precedencia cuando dos fuentes no coinciden

1. Petición del propietario. 2. `AGENTS.md`/`CLAUDE.md` y las skills locales. 3. ADRs aceptados y docs
   cerrados. 4. Contratos de arquitectura, a11y, motion y componente. 5. `stellaria-ui/` como dirección
   visual. 6. La implementación actual.

`stellaria-ui/` no puede sobrescribir en silencio `NebulaTheme`, la API pública, el grafo de
dependencias ni un budget. Donde contradice una decisión vigente, la contradicción se registra en una
review y se resuelve con ADR: así se hizo en
[stellaria-ui-convergence-2026-07-27.md](reviews/stellaria-ui-convergence-2026-07-27.md), que originó
ADR-027, ADR-028 y ADR-029, y donde el mínimo tipográfico de 12 px de ADR-024 prevaleció sobre los
9–11 px de la guía. El mismo patrón produjo
[code-design-audit-2026-07-28.md](reviews/code-design-audit-2026-07-28.md), del que salieron ADR-032 a
ADR-037.

**Decisiones cerradas en esta etapa**: scope npm **`@stellaria/nebula-*`** (org existente `stellaria`; ADR-013) · React Aria hooks (web) · Storybook 10 unificado · TS-first + temas JSON · lucide + registry · escala 50–950 · motion v12 · form-atoms duck-typed · victory-native XL · TypeScript 7 · dominios premium (@stellaria/nebula-commerce|sales|payments) · @stellaria/nebula-native-camera · TabBar con adapter · Card dual (compound + CardComplex) · Conditional unario+fallback · EditorImage peer-Pintura · librería completa antes de migrar apps.
