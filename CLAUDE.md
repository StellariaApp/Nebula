# Nebula — guía para sesiones de Claude

## Qué es

Nebula es una librería UI universal **Web + React Native** (~213 componentes canónicos en v1) con API unificada por componente: los contratos viven en `@stellaria/nebula-tokens` y cada plataforma implementa solo la capa visual. La personalización entre productos radicalmente distintos se logra **exclusivamente vía temas** (`NebulaTheme`), nunca con forks. Se construye completa antes de migrar a sus consumidores (fonicredito, tfv); el código semilla es Stellaria (`C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend`).

**Estado**: F0 cerrado (`docs/f0-closure.md`) y W1 cerrado (`docs/w1-closure.md`): theming web, playground Storybook con gates a11y/size, y los pilotos Box/Text/Button. Siguiente: W2 (Tier 1 web).

## Fuente de verdad: `docs/` (decisiones CERRADAS — no reabrir sin ADR)

| Doc                                       | Contenido                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `docs/00-inventory.md`                    | Matriz de alcance: catálogos + componentes por app consumidora                           |
| `docs/01-architecture.md`                 | Monorepo, grafo de deps, stack verificado, anatomía de componente, política de deps (§8) |
| `docs/02-theming.md`                      | Contrato `NebulaTheme` (§2), temas oficiales, runtime dual, spec del Theme Creator       |
| `docs/03-a11y-motion-performance.md`      | Contrato a11y por componente, reglas de motion, budgets, gates de CI (§4)                |
| `docs/04-migration-map.md`                | Mapa archivo-por-archivo Stellaria→Nebula y estrategia para las apps                     |
| `docs/05-roadmap.md`                      | Fases F0–F7 con gates verificables; riesgos; supuestos pendientes                        |
| `docs/patterns/web-component-template.md` | **Plantilla canónica del componente web** — obligatoria al escribir cualquier componente |
| `docs/adr/ADR-001…037`                    | Decisiones de arquitectura; **toda dep nueva o cambio de API pública requiere ADR**      |
| `docs/api/*.md`                           | Estado real de los repos fuente (anexos A/B/C)                                           |
| `prompts/`                                | Prompts de ejecución por fase                                                            |

## Comandos

```bash
pnpm install                       # pnpm 11 (self-managed via packageManager)
pnpm build | typecheck | lint      # turbo, todos los workspaces
pnpm check:contrast                # gate WCAG AA sobre el tema de humo (o -- --theme x.json)
pnpm gen:palette regen             # regenera las 16 paletas 50-950 (escribe en tokens)
pnpm gen:palette from "#hex" --name x
pnpm format                        # prettier
```

## Convenciones de código (ADR-019 — verificadas por lint)

- **Sin comentarios en el código.** Lo que necesite explicación va en un `<Nombre>.md` junto al módulo (`packages/web/src/components/Button/Button.md`).
- **Naming**: hooks `camelCase` · funciones `PascalCase` incluido el API público (`LoadTheme`, `ResolveVariant`) · constantes globales `UPPERCASE` · constantes locales que declaras tú `snake_case` · palabras cortas y abreviaturas de dominio (`bg`, `fg`, `svg`, `md`, `top`) `lowercase`. Props del API y retornos de librerías conservan su nombre.
- **Componentes planos**: `packages/web/src/components/<Nombre>/`, sin carpeta de categoría.
- Simple y reutilizable; el código debe ser autoexplicativo.

## Identidad visual (ADR-020)

Eje `#3F37C9 → #9D4EDD` (semillas de `indigo` y `violet`), dark-first: `nebula-dark` es el tema por defecto del provider y del playground. Cambiar las semillas cambia la identidad de los 4 temas.

## Particularidades técnicas (te ahorran sorpresas)

- **TypeScript 7.0.2** por paquete (binario nativo Go); **contingencia ADR-012 activa**: la raíz pinea `typescript@5.9.3` SOLO para typed-linting (typescript-eslint no soporta TS 7). No usar features TS7-only en código de librería. `rootDir` explícito obligatorio con `outDir`.
- **ESM estricto**: imports relativos con extensión (`./x.js`, `./dir/index.js`) — el dist se ejecuta directo en Node (los CLIs de tools/ lo consumen).
- `packages/tokens/src/tokens/palettes.ts` es **generado** por `pnpm gen:palette regen` — no editarlo a mano.
- `packages/tokens` tiene **cero dependencias de runtime** y presupuesto de `any` = 0; checks de contrato en `src/__checks__/contract.test-d.ts` (excluidos del build vía `tsconfig.build.json`).
- Los paquetes están `private: true` hasta definir publicación (changesets, Etapa 2).
- Grafo de deps de una sola dirección: tokens → hooks/themes/icons → web/native → dominios premium → apps. `web` y `native` jamás se importan entre sí.

## Política de trabajo con el propietario

- **Nunca asumir en silencio**: si algo contradice `docs/` o admite más de una interpretación, preguntar ANTES con opciones + recomendación. Agrupar preguntas en checkpoints por lotes, no gotear.
- Los docs cerrados prevalecen sobre cualquier preferencia; cambiarlos exige ADR + actualización del doc en el mismo PR.
- Todo cambio de API pública o de dependencias requiere ADR previo (skill `architecture-decisions`).
- Gates antes de commitear: `pnpm turbo build typecheck lint` (+ `check:contrast` si tocaste tokens/themes). Commits convencionales con scopes de Nebula (skill `git-pr-conventions`).
- Una fase del roadmap no se abre sin la anterior en verde (docs/05).

## Skills

Gobernanza operativa en `.claude/skills/` (12 skills — ver su README): empezar por `project-guardrails`, aplicar la skill de capa correspondiente y validar con `quality-gates`.
