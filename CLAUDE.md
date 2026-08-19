# Nebula — guía para sesiones de Claude

## Qué es

Nebula es una librería UI universal **Web + React Native** (~213 componentes canónicos en v1) con API unificada por componente: los contratos viven en `@stellaria/nebula-tokens` y cada plataforma implementa solo la capa visual. La personalización entre productos radicalmente distintos se logra **exclusivamente vía temas** (`NebulaTheme`), nunca con forks. Se construye completa antes de migrar a sus consumidores (fonicredito, tfv); el código semilla es Stellaria (`C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend`).

**Estado**: F0, W1, W2, W3, W4, **WR, WB y WN cerradas** (`docs/f0-closure.md`, `w1-closure.md`, `w2-closure.md`, `w3-closure.md`, `w4-closure.md`, `wr-closure.md`, `wb-closure.md`, `wn-closure.md`). **El catálogo web está completo**: 158 componentes (`Header` en ADR-062, `Nav` en ADR-068, `Reveal` y `Footer` en ADR-070; `Banner` renombrado a `Hero`), siete subpaths (`/command`, `/charts`, `/datagrid`, `/dnd`, `/carousel`, `/media`, `/editor`).

**W5.1 y W5.2 están cerradas y los seis paquetes YA ESTÁN PUBLICADOS** en npm en `0.1.0` desde el 2026-08-12 (`docs/release-checklist.md`). `private: true` se retiró; publica el CI con `pnpm release`, que redacta las notas desde los commits. **Del gate de W5 solo falta la verificación de consumo** en la landing de Rosette (`prompts/2-web/W5.3-verificacion-en-rosette.md`). No se consiguió la procedencia npm: la exige sobre repositorio público y éste es privado — decisión pendiente, ver el checklist.

**En marcha está P5** del plan de performance (`docs/reviews/plan-performance-web-2026-08-14.md`): el tema fuera del camino de render (ADR-150). 59 componentes de raíz de servidor de 154. `Hero` y `Section` —los dos dueños del elemento que marca el LCP— **ya salieron del cliente** con una cáscara que recibe children, así que la decisión B está resuelta. **El gate de P0 no está cumplido** y no lo estará sin el entorno único de ADR-149 — el mismo que reconciliaría los dos baselines visuales (`win32` y `linux` derivan por separado; CI puede estar rojo con local en verde).

**Lo que bloquea la 0.2.0** son los gates sin correr y el baseline, que genera el propietario. El aspecto ya quedó declarado estable en ADR-161. En paralelo sigue abierta **RP** (`prompts/2.4-rosette-product/`), la maqueta de Rosette.

## Fuente de verdad: `docs/` (decisiones CERRADAS — no reabrir sin ADR)

| Doc                                       | Contenido                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `docs/00-inventory.md`                    | Matriz de alcance: catálogos + componentes por app consumidora                           |
| `docs/01-architecture.md`                 | Monorepo, grafo de deps, stack verificado, anatomía de componente, política de deps (§8) |
| `docs/02-theming.md`                      | Contrato `NebulaTheme` (§2), los dos ejes de ADR-166, las tres vías de materializar (§4) |
| `docs/03-a11y-motion-performance.md`      | Contrato a11y por componente, reglas de motion, budgets, gates de CI (§4)                |
| `docs/04-migration-map.md`                | Mapa archivo-por-archivo Stellaria→Nebula y estrategia para las apps                     |
| `docs/05-roadmap.md`                      | Fases F0–F7 con gates verificables; riesgos; supuestos pendientes                        |
| `docs/patterns/web-component-template.md` | **Plantilla canónica del componente web** — obligatoria al escribir cualquier componente |
| `docs/adr/ADR-001…102`                    | Decisiones de arquitectura; **toda dep nueva o cambio de API pública requiere ADR**      |
| `docs/api/*.md`                           | Estado real de los repos fuente (anexos A/B/C)                                           |
| `prompts/`                                | Prompts de ejecución por fase                                                            |

## Comandos

```bash
pnpm install                       # pnpm 11 (self-managed via packageManager)
pnpm build | typecheck | lint      # turbo, todos los workspaces
pnpm check:contrast                # gate WCAG AA sobre el tema de humo (o -- --theme x.json)
pnpm check:slots                   # gate de props de ranura: orden del esparcido y ranuras muertas
pnpm check:layers                  # gate de capas CSS: declaración alineada, nada fuera de capa, consumidores cableados
pnpm gen:palette regen             # regenera las 16 paletas 50-950 (escribe en tokens)
pnpm gen:palette from "#hex" --name x
pnpm format                        # prettier
```

## Convenciones de código (ADR-019 — verificadas por lint)

- **Sin comentarios en el código.** Lo que necesite explicación va en un `<Nombre>.md` junto al módulo (`packages/web/src/components/Button/Button.md`).
- **Naming**: hooks `camelCase` · funciones `PascalCase` incluido el API público (`LoadTheme`, `ResolveVariant`) · constantes globales `UPPERCASE` · constantes locales que declaras tú `snake_case` · palabras cortas y abreviaturas de dominio (`bg`, `fg`, `svg`, `md`, `top`) `lowercase`. Props del API y retornos de librerías conservan su nombre.
- **En las hojas manda el archivo** (ADR-094): `<Nombre>.css.ts` → `snake_case` (`sidebar_container`, son asas de clase) · `<Nombre>.vars.css.ts` → `camelCase` (`borderColor`, nombran la propiedad CSS). Tablas de constantes en `UPPER_CASE` en ambos.
- **Las vars locales se importan como espacio de nombres** (ADR-096): `import * as variables from "./X.vars.css.js"` para las propias, `<origen>_vars` para las ajenas. Por eso la var se llama `bg` y no `xBg` — el archivo ya da el contexto.
- **Componentes planos**: `packages/web/src/components/<Nombre>/`, sin carpeta de categoría.
- **Las partes de un compound viven en `<Padre>/components/`** (ADR-097), con nombre pelado (`Col.tsx`) y símbolo con prefijo (`GridCol`). Un compound se compone con `Object.assign` en su `index.ts`, nunca atando propiedades al componente.
- Simple y reutilizable; el código debe ser autoexplicativo.

## Identidad visual (ADR-020)

Eje `#3F37C9 → #9D4EDD` (semillas de `indigo` y `violet`), dark-first: `dark` es el tema por defecto del provider y del playground. Cambiar las semillas cambia la identidad de los 4 temas.

## Particularidades técnicas (te ahorran sorpresas)

- **TypeScript 7.0.2** por paquete (binario nativo Go); **contingencia ADR-012 activa**: la raíz pinea `typescript@5.9.3` SOLO para typed-linting (typescript-eslint no soporta TS 7). No usar features TS7-only en código de librería. `rootDir` explícito obligatorio con `outDir`.
- **ESM estricto**: imports relativos con extensión (`./x.js`, `./dir/index.js`) — el dist se ejecuta directo en Node (los CLIs de tools/ lo consumen).
- `packages/tokens/src/tokens/palettes.ts` es **generado** por `pnpm gen:palette regen` — no editarlo a mano.
- `packages/tokens` tiene **cero dependencias de runtime** y presupuesto de `any` = 0; checks de contrato en `src/__checks__/contract.test-d.ts` (excluidos del build vía `tsconfig.build.json`).
- **Los seis paquetes publicables ya no son `private`** y están en npm; `demos` y `native` sí siguen privados.
- **`@stellaria/nebula-themes` declara el contrato CSS** desde ADR-168, así que construye con Vite + el plugin de Vanilla Extract (no `tsc` plano) y su `tsconfig.build.json` **necesita `emitDeclarationOnly`**: sin él, `tsc` pisa el JS que Vite compiló y el `createTheme` llega sin compilar al consumidor. Lleva 16 temas (`nebula` + 15 de producto) en `themes/<tema>/<esquema>.ts`, todos desde `_seed` sobre una `_base` independiente, y se llaman por su color desde ADR-172. Su script `dev` es el watch de **Vite**, no `tsc`: con `emitDeclarationOnly` un `tsc --watch` regenera los tipos y nunca el JS, así que el `dist` que lee la web se queda congelado. Los subpaths se parten por plataforma: lo que lleva `/web` toca CSS y `native` no lo importa nunca.
- **El gate de bytes no ve peticiones bloqueantes.** `apps/web` usa `inlineCss: true`, así que el CSS viaja dentro del HTML y `hojas CSS` debe quedarse en 0: en cuanto Next no puede incrustarlo salen `<link>` que **bloquean el primer pintado**. Costó 29 puntos de PageSpeed (100 → 71) con el presupuesto en verde. Si ese número sube, mira ahí antes que nada.
- Grafo de deps de una sola dirección: tokens → hooks/themes/icons → web/native → dominios premium → apps. `web` y `native` jamás se importan entre sí. **`web` importa `vars`, `ResolveVariant` y `CompileTheme` de `@stellaria/nebula-themes/web`** — va a favor del grafo, no lo invierte.

## Política de trabajo con el propietario

- **Nunca asumir en silencio**: si algo contradice `docs/` o admite más de una interpretación, preguntar ANTES con opciones + recomendación. Agrupar preguntas en checkpoints por lotes, no gotear.
- Los docs cerrados prevalecen sobre cualquier preferencia; cambiarlos exige ADR + actualización del doc en el mismo PR.
- Todo cambio de API pública o de dependencias requiere ADR previo (skill `architecture-decisions`).
- Gates antes de commitear: `pnpm turbo build typecheck lint` (+ `check:contrast` si tocaste tokens/themes). Si canalizas la salida, `set -o pipefail`: `| tail` devuelve el código de salida de `tail` y te oculta el fallo. Commits convencionales con scopes de Nebula (skill `git-pr-conventions`).
- Una fase del roadmap no se abre sin la anterior en verde (docs/05).

## Skills

Gobernanza operativa en `.claude/skills/` (12 skills — ver su README): empezar por `project-guardrails`, aplicar la skill de capa correspondiente y validar con `quality-gates`.
