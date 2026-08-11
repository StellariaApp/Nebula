# ADR-107 — El sitio de documentación es una app Next 16 que no compila Vanilla Extract

- **Estado**: **aceptada** · 2026-08-07 (salida del spike DS1.1; aceptada por el propietario el mismo día)
- **Contexto**: el checkpoint de DS (2026-08-07) eligió Next 16.2 + MDX y bilingüe desde el día 1.
  `apps/web` es el **primer Next del monorepo**. El riesgo declarado en `prompts/1.5-docs-site/README.md`
  era Vanilla Extract sobre Next, separado en dos preguntas: que el CSS **del paquete** se sirva
  (irrenunciable, es la promesa que W5.2 verifica) y que el sitio escriba hojas **propias** (opcional).
  Este ADR fija lo que el spike midió.

## Decisión

1. **`apps/web` es una app Next 16.2.12, App Router, React 19.2, sobre Turbopack**, que es el
   empaquetador por defecto de Next 16. Se registra en `pnpm-workspace` y en `turbo` con
   `build`/`typecheck`/`lint`.

2. **El sitio NO instala el plugin de Vanilla Extract y no escribe hojas `.css.ts` propias.**
   Se pinta exclusivamente con los componentes del catálogo y las style props de ADR-103. No es una
   renuncia por comodidad: el plugin **no funciona** en ninguno de los dos caminos disponibles
   (ver Consecuencias), y pintar el sitio solo con el catálogo es mejor dogfooding.

3. **El CSS del paquete no necesita plugin en el consumidor.** `packages/web/dist` emite 136 hojas
   `*.css.ts.vanilla.css` ya compiladas y ningún módulo del `dist` importa `@vanilla-extract/css`.
   Lo único que viaja son los runtimes declarados como `dependencies` (`dynamic`, `recipes`,
   `sprinkles`), que son JS plano. **El README de W5.1 debe dejar de pedir el plugin como requisito
   universal.**

4. **Pipeline MDX: `next-mdx-remote/rsc` + `gray-matter`**, no `@next/mdx`. Razón en Alternativas.

5. **TypeScript**: `apps/web` declara su `typescript@7.0.2` como el resto de paquetes y activa
   `experimental.useTypeScriptCli`. Sin ese flag, el typecheck de Next falla con
   «TypeScript 7.0.2 does not provide the compiler API required by Next.js». **La contingencia de
   ADR-012 no se amplía**: `tsc` sigue en 7.0.2 y el pin 5.9.3 de la raíz sigue siendo solo para el
   typed-linting.

6. **Excepción a la regla de imports con extensión.** En `apps/web` los imports relativos van **sin**
   extensión. Turbopack no resuelve `./x.js` a `./x.tsx`. La regla de `CLAUDE.md` existe porque el
   `dist` de los paquetes se ejecuta directo en Node; una app empaquetada no está en ese caso.

## Dependencias nuevas

| Paquete                                  | Dónde         | Para qué                                |
| ---------------------------------------- | ------------- | --------------------------------------- |
| `next` 16.2.12                           | dependency    | el chasis                               |
| `react` / `react-dom` 19.2               | dependency    | peer del catálogo                       |
| `next-mdx-remote` 6 · `gray-matter` 4    | dependency    | MDX de `content/**` con frontmatter     |
| `@next/mdx` · `@mdx-js/*` · `@types/mdx` | devDependency | pipeline alternativo medido en el spike |
| `sharp`                                  | transitiva    | añadida a `allowBuilds` de pnpm         |

DS1.2 retira uno de los dos pipelines MDX; el spike conserva ambos porque son la evidencia de la
comparación.

## Alternativas

- **`@next/mdx`** (el que montó el spike primero, funciona): routing por archivo con `page.mdx` y
  componentes vía `mdx-components.tsx`. **Rechazado** porque obliga a que el contenido viva dentro
  de `app/`, lo que choca de frente con el modelo `content/<lang>/**` de DS1.2 y con el principio 4
  de la fase (el contenido no depende del framework). No trae frontmatter: exige `remark-frontmatter`
  más `remark-mdx-frontmatter`, y aun así sin tipar.
- **`fumadocs-mdx`**: da frontmatter tipado con zod, i18n y buscador de fábrica. **Rechazado** por
  ser un compromiso de framework de contenido completo, justo lo que el principio 4 prohíbe: ata la
  capa de contenido a un tercero y encarece el plan B.
- **Webpack (`next build --webpack`) con `@vanilla-extract/next-plugin`**: **rechazado y además roto**,
  ver Consecuencias.
- **Plan B, Vite + React Router 7**: no procede. P1 pasó y Next resultó viable; el plan B queda
  archivado con el contenido y los generadores intactos, como estaba previsto.

## Consecuencias

- **El sitio no puede escribir CSS propio, por dos motivos independientes.** Turbopack ignora
  `@vanilla-extract/next-plugin` (es un plugin de webpack), así que el `.css.ts` se evalúa como
  módulo normal y VE lanza «Styles were unable to be assigned to a file». Y por el camino de webpack
  el plugin es **peor que inútil**: su loader intercepta también los `*.css.js` **ya compilados** del
  `dist` del paquete e intenta reprocesarlos, con «Invalid exports» sobre `Box.css.js`. Es decir,
  activar el plugin rompe la promesa del punto 3. Los dos mecanismos son incompatibles en la misma app.
- **Todo lo que el sitio necesite y las style props no cubran se resuelve con `style` en línea o con
  un componente nuevo del catálogo**, que es la salida deseable: si al sitio le falta algo, al
  catálogo también.
- **Medido en el spike** (Windows, Node 26.2, 4 rutas): dev en frío listo en **1,16 s** y primera
  compilación de `/` en **6,2 s**; `next build` completo en **11,1 s** (compilación 4,6 s, typecheck
  1,3 s, prerender 0,9 s); las 4 rutas prerenderizan estáticas. Primera carga de `/`: **235 kB brotli**
  de JS y **18,5 kB brotli** de CSS.
- **`apps/web` entra en `turbo.json`**: `build` gana `.next/**` como salida, con `!.next/cache/**`.
- Este ADR **no** cierra el hosting ni el dominio (pregunta abierta 2 de la fase) ni el idioma del
  JSDoc (pregunta 1). Solo el chasis.

## Hallazgos de la librería que el spike destapó

Ninguno es del sitio; los tres son defectos de `packages/web` o `packages/hooks` y **no se corrigen en
este ADR**. Van a WN con su reproducción.

1. ~~**El carril abierto de ADR-103 revienta cuando convive con una prop de sprinkles.**~~
   **CORREGIDO el 2026-08-07**, antes de abrir DS1.2, porque el chasis del sitio se pinta solo con
   style props y habría saltado en la primera pantalla. `ExtractStyleProps` decidía bien —mandaba el
   valor abierto al carril de variables—, pero `CollectSprinkles` volvía a recorrer las props crudas
   guiándose solo por `PROP_KIND` y le entregaba el valor a `sprinkles()`, que lanzaba. Ahora el
   conjunto de sprinkles se recoge **en la misma pasada** que toma la decisión de carril, y
   `CollectSprinkles` desaparece. Reproducido fuera de Next con `mx="auto"`, `p="12px"`,
   `bg="#ff0000"` y `fz="13px"`; los cuatro son ahora test de regresión en
   `utils/__tests__/style-props.test.ts`.
2. **`@stellaria/nebula-hooks` no lleva `"use client"` en ningún módulo** salvo
   `permission-provider.js`: 12 módulos importan React sin la directiva. Como
   `packages/web/src/index.ts:202` reexporta `useTheme` desde el barrel de hooks, cualquier Server
   Component que importe el barrel de `web` arrastra `use-media-query.js` al grafo de servidor.
   Turbopack lo tolera; **webpack falla el build**. Es un riesgo directo de W5: el consumidor elige
   su empaquetador.
3. **El conmutador de tema parpadea.** `NebulaProvider` resuelve `defaultTheme` en `useState` y solo
   lee `localStorage` en un `useEffect`, así que el servidor siempre manda `dark` y el tema guardado
   entra tras hidratar. `ColorSchemeScript` **no** lo tapa: fija `data-nebula-theme` y `color-scheme`
   en `<html>`, pero no la clase de Vanilla Extract, que es la que pinta. Medido con Playwright: con
   `localStorage=playful` la primera pintura es `dark` y cambia a `playful` tras hidratar. Sin tema
   guardado y sin JS no hay parpadeo.

`Paper` obligando a `"use client"` **no** es hallazgo nuevo: ADR-038 §Consecuencias ya lo declara.
De los cuatro componentes que el prompt daba por server-safe, tres lo son (`Text`, `Title`, `Divider`)
y `Paper` no, tal como ese ADR dejó escrito.
