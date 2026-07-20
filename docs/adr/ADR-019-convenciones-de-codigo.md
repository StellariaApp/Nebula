# ADR-019 — Convenciones de código de Nebula

- **Estado**: aceptada · 2026-07-20 (decisión del propietario) · **Supersede** las convenciones implícitas de `.claude/skills/*` y de `docs/patterns/web-component-template.md` escritas en W1.4
- **Contexto**: al cerrar W1 existen 3 componentes y ~86 archivos fuente; quedan ~210 componentes por escribir. Las convenciones heredadas eran las habituales del ecosistema JS (camelCase para funciones, carpetas por categoría, JSDoc abundante). El propietario define un estilo propio, más uniforme y con el código como única fuente de lectura. Cambiarlo más adelante obligaría a refactorizar toda la librería.

## Decisión

### 1. Naming

| Elemento                                   | Convención            | Ejemplo                             |
| ------------------------------------------ | --------------------- | ----------------------------------- |
| Hooks                                      | `camelCase`           | `useTheme`, `useDisclosure`         |
| Funciones (incluido el API público)        | **`PascalCase`**      | `LoadTheme`, `ResolveVariant`, `Cx` |
| Componentes                                | `PascalCase`          | `Button`                            |
| Constantes globales                        | `UPPERCASE`           | `SHADES`, `CHROMATIC_L`             |
| Constantes locales declaradas en el módulo | `snake_case`          | `is_disabled`, `css_vars`           |
| Props del API y retornos de librerías      | se conservan tal cual | `leftSection`, `buttonProps`        |

Los hooks son la única excepción a PascalCase porque React los identifica por el prefijo `use` en tiempo de lint y de runtime.

Las **props no cambian**: son el contrato público compartido con native y `NebulaTheme` es un JSON serializable (`variantMap`, `noiseOpacity`…). Renombrarlas rompería los temas exportados y la paridad W/N.

Tampoco se renombra lo que llega ya nombrado desde fuera (props destructuradas, retornos de React Aria o motion): aliasarlo añadiría una línea por cada uso sin ganar claridad.

**Enforcement**: `@typescript-eslint/naming-convention` en `eslint.config.js`. La convención se verifica en el gate `lint`, no en revisión manual — es la única forma de sostenerla a lo largo de 210 componentes.

### 2. Sin comentarios en el código

El código no lleva comentarios: los nombres y la estructura deben bastar. Cuando una decisión necesite explicación (un porqué no deducible, una trampa ya pisada), se escribe un **`<Nombre>.md` junto al módulo** — `packages/web/src/components/Button/Button.md`, `packages/web/src/theme/theme.md`…

Esto conserva el conocimiento que costó descubrir (p. ej. por qué `loading` usa `opacity` y no `visibility: hidden`) sin ensuciar el archivo, y lo deja donde alguien que abre esa carpeta lo encuentra.

### 3. Componentes planos

`packages/web/src/components/<Nombre>/`, sin carpeta de categoría intermedia. Las categorías siguen existiendo como taxonomía en `docs/00-inventory.md` y en los títulos de Storybook si se quisiera, pero no como estructura de directorios: con ~210 componentes de nombre único, la categoría solo alarga las rutas de import y obliga a decidir dos veces dónde vive cada cosa.

### 4. Estilo general

Simple y directo: preferir la solución corta, reutilizar lo existente antes de crear, y que el código sea autoexplicativo.

## Alternativas

- **Mantener camelCase para funciones** (lo idiomático en JS): descartado por el propietario a favor de uniformidad interna.
- **camelCase en el API público y PascalCase solo dentro**: descartado — convivirían dos convenciones según la visibilidad del símbolo, que es justo la ambigüedad que se quiere evitar.
- **Conservar JSDoc en el API público**: descartado; la explicación se traslada a `<Nombre>.md`.

## Consecuencias

- Refactor de los 8 paquetes + `tools/` en un solo PR (86 archivos): 15 funciones exportadas renombradas, ~1.040 comentarios eliminados, 3 componentes aplanados.
- `docs/patterns/web-component-template.md`, `CLAUDE.md` y las skills (`typescript-strict`, `ui-web-patterns`, `ui-native-patterns`, `monorepo-workspace`, `tokens-governance`) se reescriben en el mismo PR.
- El emisor de `tools/palette-gen` deja de escribir cabecera de comentarios en `palettes.ts`; el aviso de "archivo generado" pasa a `packages/tokens/src/tokens/tokens.md` y ya consta en `CLAUDE.md`.
- La regla de lint hará fallar el gate ante cualquier desviación, incluidas las de los ~210 componentes futuros.
