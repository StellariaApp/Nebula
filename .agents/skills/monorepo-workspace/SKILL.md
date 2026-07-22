---
name: monorepo-workspace
description: Cómo crear o mover paquetes/apps/tools en el workspace de Nebula sin romper pipelines de turbo ni la resolución ESM.
---

# Workspace de Nebula (Turborepo 2.10 + pnpm 11)

## Convenciones

- Paquetes publicables: `packages/<x>` = `@stellaria/nebula-<x>` (tokens, hooks, themes, icons, web, native, native-camera; premium bajo `packages/domains/<x>`).
- Apps: `apps/{playground-web, playground-native, theme-creator}`.
- Tooling no publicable: `tools/<x>` (palette-gen, contrast-check…) — workspace packages `private` sin script `build`.
- `pnpm-workspace.yaml` ya cubre `packages/*`, `apps/*`, `tools/*`.

## Checklist al crear un paquete

- [ ] `package.json`: `name` `@stellaria/nebula-<x>`, `private: true` (hasta definir publicación con changesets), `type: "module"`, `exports` → `dist`, `sideEffects: false`, scripts `build` (`tsc`) / `typecheck` (`tsc --noEmit`) / `lint` (`eslint .`).
- [ ] `typescript@7.0.2` como devDependency PROPIA del paquete (el de la raíz es 5.9.3 solo-lint, ADR-012).
- [ ] `tsconfig.json` extendiendo `../../tsconfig.base.json` con `module/moduleResolution: NodeNext` y `rootDir: "src"` + `outDir: "dist"` (TS 7 exige `rootDir` explícito con `outDir`).
- [ ] Imports relativos con **especificador ESM explícito** (`./x.js`, `./dir/index.js`) — el dist debe ser ejecutable por Node sin bundler.
- [ ] Deps internas con `workspace:*` respetando el grafo de docs/01 §2.
- [ ] `src/index.ts` como único entrypoint público + README.
- [ ] Convenciones de ADR-019: componentes planos (sin carpeta de categoría), sin comentarios en el código (usar `<Nombre>.md` junto al módulo) y naming hooks/funciones/constantes según la skill `typescript-strict`.

## Anti-patterns

- Deep imports entre paquetes (`@stellaria/nebula-tokens/src/...`) — usar los exports públicos.
- Dependencias de runtime en `tokens` (cero, ADR-014) o pesadas fuera de subpath exports.
- Añadir un paquete al grafo con dirección invertida (p.ej. tokens dependiendo de hooks).
