# Prompts de ejecución — Fase F0 (Scaffold y fundaciones)

> 4 prompts secuenciales para sesiones de Claude Opus. Cada uno es autocontenido (asume sesión nueva sin contexto previo): copia el bloque completo. **No pases al siguiente hasta que el anterior cierre en verde.** La fuente de verdad es `docs/` de este repo — los prompts la referencian en lugar de duplicarla.

---

## Prompt F0.1 — Spike TypeScript 7 + scaffold del monorepo

```
Actúa como ingeniero principal de plataforma. Trabajas en el monorepo Nebula en
C:\Users\Skr13\Documents\GitHub\Nebula (repo git existente; hoy solo contiene docs/ y prompts/).

ANTES DE ESCRIBIR NADA, lee estos documentos — son decisiones cerradas y vinculantes:
- docs\01-architecture.md  (estructura del monorepo §2, stack verificado §3, política de dependencias §8)
- docs\adr\ADR-001-monorepo-turborepo-pnpm.md
- docs\adr\ADR-012-typescript-7.md  (OBLIGATORIO: el spike y su plan de contingencia)
- docs\adr\ADR-014-politica-dependencias.md

MISIÓN (2 partes, en este orden):

PARTE 1 — SPIKE TS 7 (bloqueante). Antes de cualquier scaffold definitivo, valida en un
directorio spike/ (descartable) que TypeScript 7.0.x funciona con la cadena completa:
  a) Un paquete TS puro con `tsc --noEmit` y build.
  b) Vanilla Extract (@vanilla-extract/css + vite-plugin) compilando un .css.ts trivial.
  c) Un proyecto Expo SDK 57 mínimo con Metro typecheckeando bajo TS 7.
  d) Storybook 10.5 (builder vite) arrancando con una story trivial.
  e) ESLint 9 con typescript-eslint (typed linting) sin errores de compatibilidad.
Documenta el veredicto en docs\adr\ADR-012-typescript-7.md (sección nueva "Resultado del
spike (fecha)"): qué funcionó, qué no, y si aplicaste la contingencia (fijar 5.x/6.x SOLO
en los paquetes afectados). NO continúes a la Parte 2 sin veredicto escrito.

PARTE 2 — SCAFFOLD. Crea el monorepo EXACTAMENTE según docs\01-architecture.md §2:
- Turborepo 2.10.x + pnpm 11.x (pnpm-workspace.yaml, turbo.json con pipelines
  build/typecheck/lint/test/size).
- packages/: tokens, hooks, themes, icons, web, native (esqueletos: package.json con el
  nombre @stellaria/nebula-<x>, tsconfig, src/index.ts vacío exportable, README de 3 líneas).
  NO crees todavía native-camera ni domains/ (se crean al implementar su primer módulo).
- apps/: playground-web, playground-native, theme-creator SOLO como carpetas con README
  placeholder (se montan en F1).
- tools/: carpeta con README (los scripts llegan en F0.3).
- Raíz: ESLint 9 flat config + Prettier + .gitignore + engines (node >=20, pnpm 11).
- tsconfig base estricto (strict total; noUncheckedIndexedAccess incluido).

RESTRICCIONES:
- PROHIBIDO escribir componentes UI o tokens en esta sesión.
- Cada dependencia que añadas debe estar en la tabla de docs\01-architecture.md §8 o
  justificarse como tooling de build; si dudas, PREGUNTA antes de instalar.
- Los núcleos tokens/hooks NO llevan dependencias de runtime (ADR-014).
- Política de preguntas: si algo contradice los docs o hay más de una interpretación,
  pregunta con opciones + recomendación. No asumas en silencio.

CRITERIO DE ACEPTACIÓN (verifícalo tú y repórtalo):
1. `pnpm install` limpio.
2. `pnpm turbo build typecheck lint` verde en todos los workspaces.
3. Veredicto del spike escrito en ADR-012.
4. Commit(s) con mensajes convencionales (feat/chore) describiendo el scaffold.

REPORTE FINAL: tabla de lo creado, veredicto TS 7, desviaciones respecto a los docs (si
las hubo, con el porqué), y qué queda listo para F0.2.
```

---

## Prompt F0.2 — `@stellaria/nebula-tokens`: contrato y types compartidos

```
Actúa como arquitecto del design system Nebula. Trabajas en
C:\Users\Skr13\Documents\GitHub\Nebula (el monorepo ya existe tras F0.1).

ANTES DE ESCRIBIR NADA, lee (vinculante):
- docs\02-theming.md            (contrato NebulaTheme completo — es TU spec)
- docs\01-architecture.md §4    (anatomía de contratos compartidos, lista de módulos types/)
- docs\api\stellaria-native.md  (estado real del código fuente a migrar)
- docs\04-migration-map.md §1   (tabla archivo-por-archivo tokens: qué se migra, regenera o refactoriza)
- docs\adr\ADR-005-forms-form-atoms.md  (NebulaField)
- docs\adr\ADR-006-theme-format.md      (TS-first; el Zod schema NO va aquí, va en nebula-themes)
- docs\adr\ADR-009-escala-cromatica-50-950.md

CÓDIGO FUENTE a migrar (léelo, no lo reinventes):
C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\tokens\  (src/tokens/*, src/types/*, src/theme/*)

MISIÓN — implementar packages/tokens (@stellaria/nebula-tokens):
1. Migrar los 10 módulos de src/types/ de Stellaria (patrón <Cat>Props + Keys<Cat> + BaseProps/KeysBase)
   adaptándolos al contrato de docs\01-architecture.md §4. Fixes obligatorios de la tabla 04 §1:
   - Bug conocido: KeysBase no incluye las keys de effects — corrígelo.
   - variants.ts: set real filled|outline|light|glass|ghost|glow|gradient|unstyled + tipo VariantRecipe/variantMap.
   - Crear types/fields.ts con NebulaField<T> (ADR-005: value/setValue/status/error/touched, duck-typed).
2. Definir el tipo NebulaTheme COMPLETO según docs\02-theming.md §2 (meta, palettes Scale11,
   colors con roles semánticos, font, radius, spacing con unit de densidad, sizes.control,
   motion con tier/duration/easing/spring, effects con gradients NUEVOS, variantMap, zIndex,
   breakpoints). Exporta también los tipos utilitarios (Scale11, PaletteName, roles).
3. Migrar los tokens base NO cromáticos de Stellaria (typography Geist, animation, effects
   blur/glass/shadows, layout) según la tabla 04 §1. Los colores NO se migran aún (F0.3 los
   regenera a 50–950); deja las 16 paletas declaradas como PaletteName con TODO explícito.

RESTRICCIONES:
- @stellaria/nebula-tokens tiene CERO dependencias de runtime (ADR-014). Nada de zod aquí.
- TS estricto; el presupuesto de `any` es 0 en este paquete.
- No inventes tokens no especificados; si el contrato de 02-theming te parece incompleto o
  contradictorio en algún punto, PREGUNTA con opciones + recomendación antes de decidir.

CRITERIO DE ACEPTACIÓN:
1. `pnpm turbo build typecheck lint --filter=@stellaria/nebula-tokens` verde.
2. Un archivo src/__checks__/contract.test-d.ts (o equivalente de tipos) que demuestre:
   BaseProps compone todos los *Props; KeysBase contiene todas las keys (incl. effects);
   un objeto de ejemplo `satisfies NebulaTheme` compila.
3. Tabla en el reporte: módulo de Stellaria → archivo nuevo → migrado/refactorizado/nuevo.

REPORTE FINAL: cobertura de la tabla 04 §1, decisiones tomadas dentro del margen permitido,
y cualquier duda que quedara abierta para F0.3.
```

---

## Prompt F0.3 — Herramientas: `palette-gen` + `contrast-check` + paletas 50–950

```
Actúa como ingeniero de design tokens. Trabajas en C:\Users\Skr13\Documents\GitHub\Nebula
(F0.1 y F0.2 completados: monorepo verde y @stellaria/nebula-tokens con el contrato NebulaTheme).

ANTES DE ESCRIBIR NADA, lee (vinculante):
- docs\02-theming.md §2 y §5.3   (contrato de color y validación AA del Theme Creator — mismo motor)
- docs\03-a11y-motion-performance.md §1 y §4  (reglas de contraste AA y gates de CI)
- docs\adr\ADR-009-escala-cromatica-50-950.md
- packages\tokens\  (el contrato real ya implementado — tu target de integración)
- Paletas semilla: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\tokens\src\tokens\colors.ts
  (16 paletas 100–900 existentes: indigo, violet, green, yellow, red, blue, orange, teal,
   pink, cyan, lime, grape, rose, gold, light, dark + gray light/dark)

MISIÓN:
1. tools/palette-gen: CLI TypeScript que, dado un color semilla (o las paletas semilla de
   Stellaria), genera escalas 50–950 (11 pasos) en espacio OKLCH con curvas de luminancia
   consistentes entre paletas. Debe poder: (a) regenerar las 16 paletas base aproximando el
   carácter de las semillas de Stellaria, (b) generar una paleta nueva desde un hex arbitrario
   (este modo lo reutilizará el Theme Creator). Output: TS listo para packages/tokens y JSON.
2. Regenerar las 16 paletas e integrarlas en @stellaria/nebula-tokens (cerrando el TODO de F0.2).
3. tools/contrast-check: CLI que valida pares texto/superficie y estados según
   docs\03 §1 (4.5:1 texto, 3:1 large/UI, focus ≥3:1) sobre cualquier objeto NebulaTheme
   (JSON o TS). Output: tabla de pares con pass/fail y sugerencia de corrección (ajuste de L).
   En F0 se ejecuta contra un tema de humo construido con las paletas nuevas + roles default.
4. Integrar ambos como tasks de turbo (`pnpm check:contrast`, `pnpm gen:palette`) y documentar
   uso en tools\README.md.

RESTRICCIONES:
- Librerías de color permitidas: culori o colorjs.io (elige una y justifica en 3 líneas en el
  README; cualquier otra dependencia → pregunta antes).
- Los scripts viven en tools/ (no son paquetes publicables).
- No portes los HEX legacy 1:1 (decisión cerrada): las semillas orientan el hue/carácter, la
  curva de luminancia la define el generador.

CRITERIO DE ACEPTACIÓN (gate de F0 según docs\05-roadmap.md):
1. Las 16 paletas 50–950 integradas en tokens; build/typecheck verdes.
2. `pnpm check:contrast` en verde sobre el tema de humo (o reporte de los pares que fallan
   con la corrección aplicada).
3. Generar una paleta desde un hex arbitrario funciona y queda demostrado en el README.

REPORTE FINAL: muestra de 2-3 paletas generadas (valores), resultado del contrast-check,
y desviaciones/preguntas abiertas.
```

---

## Prompt F0.4 — Gobernanza: skills + CLAUDE.md + cierre de F0

```
Actúa como responsable de gobernanza del monorepo Nebula en
C:\Users\Skr13\Documents\GitHub\Nebula (F0.1–F0.3 completados).

ANTES DE ESCRIBIR NADA, lee:
- docs\01-architecture.md §9 (plan de skills) y docs\api\stellaria-native.md §4 (tabla origen)
- Las skills fuente: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\.claude\skills\
- docs\03-a11y-motion-performance.md §4 (gates que la skill de quality-gates debe reflejar)
- docs\05-roadmap.md (gate de F0 — lo cerrarás al final)

MISIÓN:
1. Crear .claude\skills\ en Nebula migrando/adaptando según la tabla (7 migrar, 5 adaptar,
   4 no aplican, 1 revisar). Reglas de adaptación: rutas y nombres de paquetes de Nebula
   (@stellaria/nebula-*), la skill web se reescribe para React Aria + Vanilla Extract, la de
   quality-gates incorpora los gates de docs\03 §4 (axe, contrast-check, size-limit, TS7
   estricto), y la de permisos se convierte en spec de PermissionGate (docs\01 §6).
2. Crear CLAUDE.md en la raíz del repo: qué es Nebula, mapa de docs/ como fuente de verdad,
   comandos del monorepo, política de preguntas del propietario (nunca asumir en silencio;
   checkpoints por lotes con opciones + recomendación), y regla de que todo cambio de API
   pública/dependencias requiere ADR.
3. Cierre de F0: verifica el gate completo de docs\05-roadmap.md F0 (turbo build/typecheck/
   lint verdes bajo TS7 o contingencia documentada; paletas pasan contrast-check) y escribe
   docs\f0-closure.md con el checklist marcado, estado real y pendientes para F1.

CRITERIO DE ACEPTACIÓN: skills presentes y coherentes con los docs; CLAUDE.md útil para una
sesión nueva sin contexto; f0-closure.md con el gate verificado comando por comando.

REPORTE FINAL: resumen del cierre de F0 y recomendación de arranque para F1 (theming dual +
playgrounds — docs\05-roadmap.md).
```

---

## Notas de uso

- **Orden estricto**: F0.1 → F0.2 → F0.3 → F0.4. El spike de F0.1 puede alterar los demás (contingencia TS).
- Si una sesión se corta a medias, el prompt puede re-ejecutarse: cada uno empieza leyendo el estado real del repo.
- Los prompts asumen que los docs de `docs/` no cambian entre sesiones; si cambias una decisión, actualiza el doc/ADR ANTES de lanzar el siguiente prompt.
- F1 (theming dual + playgrounds) tendrá su propio set de prompts cuando F0 cierre.
