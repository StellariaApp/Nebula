# C2 — El armazón de producto: landing + panel al estilo Rosette

> Para una sesión limpia por producto. Modelo recomendado: **Opus 5** (o Fable 5.1 si va a mirar
> capturas). Sirve para **dos casos** y el prompt los separa: un producto **desde cero** y un
> producto **ya existente** de Stellaria (Stellaria, Polaris, Iris, Lagrange).
>
> **Esto NO es C1 ni C3.** C3 alinea contra `docs/07` sin leer ningún producto; C2 es C3 **con
> Rosette al lado**: la receta está en `docs/07` y aquí va sólo lo que se aprende leyendo el
> código de Rosette, más la lista de lo que Rosette tiene y Nebula no.
>
> **Esto NO es C1.** C1 lleva la landing de un producto a Nebula. Esto va un paso más allá: fija
> **cómo se compone** un producto de Stellaria entero —landing, nav, dock, panel con carril,
> cabeceras que se encogen al desplazar, modales, estados, reproductores— tomando Rosette como el
> producto de referencia. Si el producto no ha pasado por C1, C1 va primero.
>
> **Si el producto no tiene a Rosette al lado**, usa `C3-alineacion-visual.md`: las mismas
> recetas, extraídas de aquí, viven en `docs/07-recetas-de-producto.md` y no dependen de ningún
> producto. C2 es para cuando se quiere leer el código de referencia; C3 para cuando basta la
> norma.
>
> **De dónde sale.** Del código de Rosette el 2026-09-12 (`GitHub/Rosette`, Nebula 1.1.13), leído
> fichero a fichero, y de la comparación con Stellaria, Polaris, Iris y Lagrange. Lo que sigue son
> hechos del repo, no previsiones. Si una instrucción contradice al código de Rosette, gana el
> código y se anota.

---

## Lo que ya se sabe (no lo vuelvas a averiguar)

| Hecho                                                        | Valor                                                                                                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Productos en la familia Nebula                               | **Rosette, Stellaria, Polaris, Iris** — Next 16.3 + React 19 + `@stellaria/nebula-*` + vanilla-extract + jotai + semilla de tema               |
| Fuera de la familia                                          | **Lagrange** (`src/web`: Next 15 + HeroUI 3 RC + Tailwind 4 + zustand + framer-motion + next-themes) · **Cosmos** (Fastify, sin front)         |
| Versión de Nebula                                            | 1.1.13 en Rosette, Stellaria y Polaris · **1.1.12 en Iris**                                                                                    |
| Semilla de tema                                              | Los cuatro: `src/theme/_seed.ts` (`BuildProduct`) + `src/theme/index.ts` (`CompileThemes`) + `icons.tsx` · `THEME_SCHEME = "dark"`             |
| Quién tiene panel (`AppShell`)                               | **Rosette** (carril colapsable + tira inferior) y **Polaris** (`shell/product-shell.tsx`, sin tira ni `StarField` con `scroller`)              |
| Quién tiene modales                                          | **Sólo Rosette** (29 ficheros). Polaris resolvió todo con rutas dedicadas. Stellaria e Iris no tienen                                          |
| Quién tiene medios                                           | **Sólo Rosette**: `video-player`, `voice-player`, `viewer`, `media-card`, `cutout`. Iris tiene un `<video controls>` en `demo-case.tsx`        |
| Componentes de Rosette que Nebula **no** tiene               | reproductor de vídeo **en línea**, reproductor de audio, visor sin panel, tarjeta de medio, recorte (`Cutout`), lámina de estado ilustrada     |
| Componentes que Rosette **reimplementa** teniendo Nebula uno | `Scroll` + `ScrolledAtom` (existe `useScrolled`), `FilterBar` (existe `Filters`), `MediaViewer` (existe `Lightbox`), `Band` (existe `Section`) |
| Docs de Rosette que **NO** hay que leer                      | `docs/design-style.md` y `docs/page-template.md` describen HeroUI + Tailwind + Framer Motion: **ninguno está en el `package.json`**            |
| La norma visual del panel, ya escrita                        | `Rosette/docs/reviews/00-prompt-revision-visual.md` § «LA NORMA» (sale de `page.tsx`, `system-state.tsx` y `parts.tsx`)                        |

---

```text
Actúa como ingeniero de UI en el repositorio de <PRODUCTO> y, para leer, en
/Users/skr13/Documents/Github/Rosette y /Users/skr13/Documents/Github/Nebula.

El objetivo es que <PRODUCTO> se componga igual que Rosette: mismos armazones, mismas piezas,
mismos gestos —lo único que cambia entre los dos es el color, que llega por tema—. LA RECETA DE
CADA PIEZA ESTÁ EN Nebula/docs/07-recetas-de-producto.md Y NO SE REPITE AQUÍ: este prompt añade
lo que sólo se aprende leyendo el código de Rosette, y las decisiones que son del propietario.
Si al terminar hay que explicar por qué una pantalla de <PRODUCTO> se organiza distinto que su
equivalente en Rosette, o la explicación es «porque el dominio lo exige» o está mal.

ELIGE EL CAMINO ANTES DE EMPEZAR
  A · DESDE CERO. El repo está vacío. Corre primero prompts/7-arranque/N1-next-desde-cero.md
      (raíz + tema + primera pantalla) y vuelve aquí para la Fase 2 en adelante.
  B · YA EXISTE, en la familia Nebula (Stellaria, Polaris, Iris). Fase 1 es una auditoría de
      huecos contra docs/07; después se cierran por tramos.
  C · YA EXISTE, fuera de la familia (Lagrange). No es un alineamiento: es una migración. Primero
      prompts/6-consumidores/C1-landings-a-nebula.md sobre su landing; sólo cuando esa landing
      salga limpia se abre aquí la Fase 2. No intentes «alinear» HeroUI: se sustituye.

LEE ANTES, EN ESTE ORDEN
  1. Nebula/CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. Nebula/docs/07-recetas-de-producto.md — ENTERO. Es la rúbrica; cada § es una fila de la
     auditoría. Sus §15 (lo que no se hace) y §16 (huecos y de dónde se copian) son vinculantes.
  3. Nebula/prompts/6-consumidores/C1-landings-a-nebula.md — de dónde se importa cada cosa
     (ADR-168), las tres vías de materializar el tema, las cinco correcciones aprendidas y el
     aviso del CSS sin @layer. No lo repitas: aplícalo.
  4. Nebula/packages/web/src/components/AppShell/AppShell.md y los ADR-182 a ADR-185: el
     carril y la barra inferior son el mismo componente, y lo que hace bajo `tablet` es CSS.
  5. Rosette, los ficheros que son el armazón, enteros y con sus comentarios — son la mejor
     explicación de por qué cada cosa está donde está:
       src/app/layout.tsx · src/app/[lang]/(landing)/layout.tsx · src/app/dashboard/layout.tsx
       src/theme/_seed.ts · src/theme/index.ts · src/theme/icons.tsx
       src/components/(shared)/app.tsx · app-client.tsx · app.css.ts · page.tsx
       src/components/(shared)/nav.tsx · nav-client.tsx · dock.tsx · footer.tsx · band.tsx
       src/components/(shared)/system-state.tsx · failed.tsx · parts.tsx · filter-bar.tsx
       src/components/(dashboard)/avatars/sheet-header.tsx · metrics.ts
       src/components/(discover)/avatar/band.tsx · src/components/(dashboard)/create/header.tsx
       src/lib/scroll.ts · src/stores/sidebar.ts
  6. Rosette/docs/reviews/00-prompt-revision-visual.md — sólo la sección «LA NORMA».
  7. Rosette/docs/refactor-a-nebula.md §6 — cuatro fallos de catálogo que siguen mordiendo.

  NO leas Rosette/docs/design-style.md ni docs/page-template.md: describen un stack que ya no
  existe (HeroUI, Tailwind, Framer). Si <PRODUCTO> tiene copias de esos ficheros —Stellaria tiene
  los dos, Lagrange sólo `design-style.md`—, anótalas para retirarlas en el veredicto.

REGLA QUE NO SE ROMPE
  No modificas Nebula para que <PRODUCTO> encaje, y no copias CSS de Rosette a mano. Si algo no
  sale con el catálogo y el tema, se anota como HALLAZGO con el nombre del componente o del
  token que falta, y se sigue. Los huecos conocidos están en docs/07 §16 con su ADR: mientras
  ese ADR no esté publicado, copia el fichero desde Rosette/src/components/(shared)/ SIN
  cambiarle la forma (mismo nombre, mismas props), para que el día que suba el cambio sea un
  import. Si el ADR ya está publicado, se usa el componente y no la copia.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 1 — LA AUDITORÍA (sólo caminos B y C)
═══════════════════════════════════════════════════════════════════════════════════════════

Recorre <PRODUCTO> con docs/07 como rúbrica y escribe
docs/reviews/alineacion-<producto>-<fecha>.md con UNA tabla:

  | § de docs/07 | pieza | Rosette (fichero) | <PRODUCTO> hoy (fichero:línea) | delta | tramo |

Una fila por receta, sin saltarse ninguna, y «igual» cuenta como delta. La columna de Rosette
es lo que este prompt añade a C3: el fichero concreto de Rosette que resuelve esa fila. El
tramo es en cuál de las fases de abajo se cierra. No toques código en esta fase.

CHECKPOINT 1 — enseña la tabla. Hay deltas que son decisiones del propietario y no tuyas:
  · Polaris resuelve con rutas dedicadas lo que Rosette resuelve con modales. Cambiarlo es
    la obra de más superficie del repo: pregunta antes.
  · Stellaria e Iris no tienen panel. Si el producto no lo necesita, las Fases 4–5 no aplican
    y se dice; no se inventa un panel para parecerse.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 2 — LA RAÍZ Y EL TEMA (docs/07 §2 y §3)
═══════════════════════════════════════════════════════════════════════════════════════════

Aplica §2 tal cual: es idéntica en los cuatro productos. Aplica §3 con la semilla en dos
ficheros y los iconos como registro.

DE LA SEMILLA SÓLO ES DEL PRODUCTO EL COLOR: primary, accent, from, to, tint. Los cuatro
productos discrepan hoy en lo demás y no deberían:

    wash   0.009 (Rosette) · 0.08 (Stellaria) · 0.09 (Polaris) · 0.05 (Iris)
    lift   base -14 (Rosette) · -6 (Stellaria) · +12 (Polaris) · +6 (Iris)
    glass  "sheer" en tres, defecto en Stellaria · ramp en tres, ausente en Rosette

Por el principio de WB («entre productos sólo cambia el color») esto es UNA decisión para la
familia. No la tomes: propón un juego de valores con su razón y PREGUNTA en el Checkpoint 2.
Mientras tanto usa los de Rosette.

CHECKPOINT 2 — tema validado (pnpm check:contrast -- --theme) y la propuesta de semilla común.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 3 — EL ARMAZÓN PÚBLICO (docs/07 §4 y §5)
═══════════════════════════════════════════════════════════════════════════════════════════

Main, Nav, dock, Footer, secciones, hero y tarjetas como dicen §4 y §5. Lo que Rosette añade:

  · `smooth`: Stellaria e Iris lo quitaron porque con `momentum` «se pelean»; Rosette y Polaris
    llevan los tres. Es el mismo Main: mide en <PRODUCTO> si tirita y deja escrito cuál de los
    dos tiene razón. Es hallazgo de catálogo si los dos son ciertos.
  · DECISIÓN ABIERTA: Stellaria, Polaris e Iris llevan `floating sticky contentWidth={1152}` en
    Nav y `contentWidth={1152}` en Footer; Rosette sólo `floating`. ADR-070 da 1180 por defecto
    a Nav/Section/Hero/Footer, así que 1152 a mano puede ser una reliquia. Mide a 1280 y 1600 y
    pregunta en el Checkpoint 3 cuál se queda.
  · Lagrange tiene un listener de scroll para la nav (`scrollY > 24` en landing-chrome). Se tira:
    `floating` lo hace.
  · Los enlaces desde servidor: `ButtonLink`, `TextLink`, `ActionLink` de
    Rosette/src/components/(shared)/links.tsx. Está medido: `component={Link}` compila y
    revienta en producción.

CHECKPOINT 3 — la landing entera, en los dos esquemas, a 390 / 768 / 1440. Abre la página y
mírala: tsc verde y HTTP 200 no dicen que se vea bien.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 4 — EL PANEL Y SUS PANTALLAS (docs/07 §6, §7, §8, §9, §10, §12, §13)
═══════════════════════════════════════════════════════════════════════════════════════════

AppShell en carril, Screen, la cabecera que se encoge, modales, estados, filtros y la norma
tipográfica como dicen esas secciones. Lo que Rosette añade:

  · `App` (app.tsx) NO ES ASYNC y lleva dos Suspense en la barra (MenuSkeleton, FooterSkeleton)
    con la geometría exacta: sello 30, textos 12/10, avatar 38, nueve filas de 20.
  · La estructura de enlaces ES UNA FUNCIÓN DEL DICCIONARIO (`dashboard/layout.ts`); cuenta las
    entradas del carril contra la regla medida de §6.3 (con seis, a 360 px caían dos fuera).
  · `Screen` pasa `titleProps={{ fz: "h5" }}` y `subtitleProps={{ fz: "body3", c: "text.muted" }}`
    UNA vez (decisión del propietario del 2026-09-12): AppShell.Header pinta h6/body2 por defecto
    y la norma es h5/body3. Ninguna otra pantalla vuelve a tocarlos ni monta un PageHeader.
  · Las tres cabeceras que se encogen de Rosette (create/header.tsx es el original;
    avatars/sheet-header.tsx y (discover)/avatar/band.tsx lo copian) son el patrón de §7.3 con
    su `metrics.ts` y la suma escrita. Mientras ADR-187 no esté publicado, replica el `Scroll`
    de app-client.tsx y el átomo; cuando lo esté, es `AppShell.Scroll` + `useAppShellScroll()`
    + `AppShell.Section hanging`.
  · El modal es el de §8.1, con la puerta que no se cierra para edad y consentimiento
    (chats/sheet.tsx y plans/confirm.tsx cuentan por qué el panel lo trae la tarjeta).
  · Las cinco ilustraciones de la lámina de estado son activos del producto: <PRODUCTO> trae las
    suyas con el mismo encuadre (retrato vertical, ratio 1:2). Mientras ADR-192 no esté
    publicado, copia system-state.tsx; después es `EmptyModule layout="side" surface="glass" fill`.
  · Los átomos del panel (parts.tsx: DataRow, Notice, Tag, Portrait, Rosets) se copian, no se
    reinventan. PageHeader no: ver la decisión de arriba.
  · `FilterBar` (filter-bar.tsx) NO se copia sin antes evaluar `Filters` de Nebula y escribir
    por qué no sirve, si no sirve.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 5 — MEDIOS (docs/07 §11; sólo si el producto los tiene)
═══════════════════════════════════════════════════════════════════════════════════════════

Mientras ADR-195/196/197/198 no estén publicados, copia video-player.tsx, voice-player.tsx,
player.css.ts, viewer.tsx, viewer.css.ts, media-card.tsx, media-card.css.ts, cutout.tsx y
piece-action.tsx desde Rosette/src/components/(shared)/ con su nombre y su forma. Sus dos
únicos acoplamientos son `useDictionary("shared").player|viewer` e `Icon` de @/theme/icons:
<PRODUCTO> tiene los dos. `<video controls>` y `<audio controls>` a pelo están prohibidos
(Iris demo-case.tsx lo hace; es un delta).

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 6 — i18n Y EL VEREDICTO (docs/07 §14 y §17)
═══════════════════════════════════════════════════════════════════════════════════════════

i18n como §14. Entrega docs/reviews/alineacion-<producto>-<fecha>.md (la tabla de la Fase 1,
ya cerrada) con:
  · Qué piezas quedaron iguales a Rosette, cuáles distintas «porque el dominio lo exige»
    (con la exigencia escrita), y cuáles distintas sin razón (deuda).
  · Los ficheros copiados desde Rosette/(shared) SIN cambios y los copiados CON cambios (cada
    cambio es un hallazgo), y cuáles se pueden borrar ya porque su ADR está publicado.
  · Los hallazgos de catálogo, cada uno con el componente o token que habría hecho falta.
  · Lo que se retiró: design-style.md / page-template.md viejos, listeners de scroll a mano,
    `<video controls>`, hex sueltos, media queries que las props cubrían.
  · Capturas a 390 / 768 / 1440 en los dos esquemas de: landing, una pantalla con cabecera que
    se encoge (arriba y encogida), un modal, una lámina de error y la tira del móvil.

GATES: pnpm typecheck && pnpm build en verde, y las capturas miradas. Un hallazgo no se
convierte en ADR por tu cuenta: se agrupan y los decide el propietario.
```

---

## Lo que Rosette tiene y Nebula no · candidatos a subir al catálogo

Medido el 2026-09-12 contra `packages/web/src/components/` (158) y `docs/00-inventory.md`.
Ordenados por lo que más copias evita. **Ninguno se sube desde este prompt**: cada uno pide su
ADR y pasa por la plantilla de `docs/patterns/web-component-template.md`. **Los ADR están
escritos como propuesta** (ADR-187 a ADR-198, más ADR-191 que es corrección) y el lote se razona en
`docs/reviews/rosette-a-nebula-2026-09-12.md`.

### Tier A — hueco real del catálogo y ya se copia entre productos

| #   | Pieza de Rosette                                          | Dónde iría en Nebula                                                                | Por qué                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Coste real                                                                                                                                                                                                                                                                                                                                                                                                                                                     | ADR propuesto |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | `video-player.tsx` + `voice-player.tsx` + `player.css.ts` | `@stellaria/nebula-web/media` como **`VideoPlayer`** (en línea) y **`AudioPlayer`** | `Player` es un overlay con `opened/onClose` para **un** medio; el inventario no tiene ni una fila de audio. refactor-a-nebula.md §6.4 ya lo decidió («el reproductor en línea entra al catálogo»). Son `<video>`/`<audio>` + `<input type=range>`: **sin dependencia nueva**, cabe de sobra en el budget media (≤70 kB, hoy 37,9)                                                                                                                                                                                                                                           | Rótulos → prop `labels` · `Icon` → **glifos internos** de `web` (`src/glyphs/`, como todo el catálogo): seis nuevos (play, pause, volume, volume-off, maximize, minimize); `nebula-icons` ya tiene los seis nombres para el consumidor · `defer`, `duration`, `onPlaying`, `fill` tal cual · la hoja compartida es la gracia: los dos se reconocen como el mismo mando                                                                                         | ADR-195       |
| 2   | `viewer.tsx` + `viewer.css.ts` (`MediaViewer`)            | Nuevo **`Viewer`** o `Lightbox variant="bare"`                                      | `Lightbox` monta un `Modal` con panel: «una foto dentro de una tarjeta es la foto más pequeña y el marco más grande». El visor de Rosette es fondo + pieza, arrastre continuo (el índice cambia al pasar de la mitad, no al soltar), pellizco, rueda, doble toque, flechas sólo con puntero fino, tira de miniaturas con el `Carousel` del catálogo. Cinco pantallas de Rosette lo abren; antes había **tres** visores distintos en el mismo producto                                                                                                                       | Ya usa `Portal`, `ActionIcon` y `Text` de Nebula; **`Carousel` es una restricción, no una ventaja**: es Embla y meterlo en el core viola ADR-014 regla 3, así que la tira de miniaturas pasa a una fila con `scroll-snap` (como el `filmstrip` de `Lightbox`) · rótulos por `labels` · `withDownload` y `actions` como ranuras · es sólo de imágenes por decisión (un vídeo dentro tendría que adivinar si el dedo va a la barra de tiempo o a pasar de pieza) | ADR-196       |
| 3   | `cutout.tsx`                                              | Core, familia Media/Efectos: **`Cutout`**                                           | No existe en ninguna forma. Es el recurso visual de **toda** la landing de Rosette (hero, cierre, «yours») y de las láminas: fondo + figura recortada con `figurePosition {top,bottom,left,right,translate,rotate}`                                                                                                                                                                                                                                                                                                                                                         | 81 líneas. Único acoplamiento: `next/image` para el fondo → ranura `image` polimórfica o `component`. La figura ya es `<img>`                                                                                                                                                                                                                                                                                                                                  | ADR-197       |
| 4   | `system-state.tsx` (+ `failed.tsx`, `retry.tsx`)          | Extender **`EmptyModule`** con `layout="side"`, `surface="glass"` y `fill`          | `EmptyModule` **ya tiene** `illustration` (apilada encima, `aria-hidden`) y `surface` (`none/paper/outline/dashed`); lo que no tiene es la ilustración **al lado**, la superficie de cristal ni el `flex` que rellena. La lámina de Rosette lleva **ilustración lateral** (cinco significados: vacío, error, no encontrado, sin sesión, bloqueado), `flex={1}` + `alignSelf: stretch` (decisión 05/09: «todos los empty states toman flex») y `compact`. Polaris reescribió lo suyo (`states/system-states.tsx`) con `EmptyState` + `Alert`: **dos productos, dos láminas** | Las cinco ilustraciones son del producto → `illustration` es ranura, no activo de Nebula. `Failed`/`RetryButton` son composición de la app (necesitan `router.refresh`) y se quedan                                                                                                                                                                                                                                                                            | ADR-192       |
| 5   | `media-card.tsx` + `media-card.css.ts`                    | Patrón **`CardMedia`** o extensión de `CardComplex`                                 | `CardComplex` agrupa media/badges/actions/meta, pero no tiene: galería que pasa sola al pasar por encima (`FIRST_MS 300`, `FRAME_MS 900`, respeta reduced-motion), clip de adelanto mudo, `playable` (la tarjeta **es** un reproductor y esconde insignias y pie mientras corre, vía `onPlaying`), esquinas rótulo/botón que no se pisan, celda de una lámina de seis vistas, y «no ser enlace» (abre el visor). Cuatro rejillas de Rosette la pintan                                                                                                                       | Depende del `VideoPlayer` (#1): sube después. `MediaCardView` es agnóstico de API (strings y `ReactNode`), sólo hay que quitarle el `?q=medium` de Cosmos y hacerlo `srcSet`/ranura                                                                                                                                                                                                                                                                            | ADR-198       |

### Tier B — no es un componente, es una ranura o un contrato que falta

| #   | Pieza de Rosette                                                                                                        | Qué le falta a Nebula                                                                                                                                                                                    | Cómo se cierra                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | ADR propuesto                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 6   | El patrón de **cabecera que se encoge** (`ScrolledAtom` + `Scroll` + `absolute top:100%` + `metrics.ts` + `Transition`) | `AppShell` no expone si su contenido está desplazado, y `AppShell.Header` no tiene estado compacto. Tres cabeceras de Rosette lo hacen a mano con un átomo de jotai que otro producto tendría que copiar | ADR: `AppShell` publica `scrolled` por contexto (`useShellScrolled()`), y `AppShell.Section` acepta una ranura `collapsing` que cuelga en `absolute` de la sección pegada con `expandedHeight`. El cuerpo reserva solo. La transición ya está en `vars.motion`. **Confirmado**: `useScrolled` de nebula-hooks mide `window.scrollY` y no acepta un `scroller`, así que hoy no sirve para el carril; el hook nuevo (o una opción `scroller` en `useScrolled`) es parte de este ADR | ADR-187                                                                    |
| 7   | `data-floating="header                                                                                                  | footer                                                                                                                                                                                                   | dock"`+`lib/scroll.ts` (`Band`, `CenterOn`, `ScrollToTop`)                                                                                                                                                                                                                                                                                                                                                                                                                        | Ningún hook de Nebula sabe cuánto techo y suelo tapan las barras flotantes | Hook `useFloatingBand()` en nebula-hooks + convención `data-floating` documentada en `AppShell.md` y `Affix.md`. Es lo que hace que «centrar en pantalla» centre entre las barras y no en la ventana | ADR-188 |
| 8   | `band.tsx` (Rosette, **Stellaria e Iris tienen su copia**)                                                              | `Section` no tiene ranura de eyebrow ni centra el encabezado (band.css.ts se lo hace con `globalStyle`)                                                                                                  | `Section eyebrow` (Badge light) + `Section align="center"` que alcance al encabezado. Tres copias desaparecen                                                                                                                                                                                                                                                                                                                                                                     | ADR-189                                                                    |
| 9   | `dock.tsx` `DockSettings` (**Stellaria, Polaris e Iris tienen la suya**)                                                | No hay `Dock`. Es `Affix` + `GlassSurface` + tres controles, con el pliegue a `Popover` bajo `phone`                                                                                                     | Patrón `Dock` compound en core (`Dock`, `Dock.Compact`) o, más barato, una story «Composition» en `Affix.md` que fije la receta. Cuatro copias idénticas es el argumento                                                                                                                                                                                                                                                                                                          | ADR-193                                                                    |
| 10  | `Rail`/`ActiveRail` (activo = href más largo por tramos)                                                                | `Nav.Links` tiene `activeMode="pathname"`; `AppShell.Link` no                                                                                                                                            | `AppShell.Sidebar activeMode="pathname"` —en `Sidebar` y no en `Links`, porque el href más largo se elige **entre todos los grupos**— con la misma regla que Nav (`BestPathMatch`, compartido). Polaris ya reescribió la misma función, y sin el «gana el más largo»                                                                                                                                                                                                              | ADR-190                                                                    |
| 11  | `filter-bar.tsx`                                                                                                        | No es hueco: **existe `Filters`**. Rosette lo reimplementó (buscador + chips + Popover de selects) porque `Filters` arrastra el modelo declarativo entero                                                | No subir. Hallazgo para `Filters`: variante `compact` (chips de activos + popover) o documentar por qué Rosette no lo usó. El producto nuevo empieza por `Filters`                                                                                                                                                                                                                                                                                                                | — (no sube: hallazgo para `Filters`)                                       |
| 12  | `piece-action.tsx`                                                                                                      | `ActionIcon` no tiene noción de conmutador                                                                                                                                                               | `ActionIcon toggle` / `pressed`: relleno `filled` cuando está activo, `glass` cuando no. Trivial, pero fija una regla de diseño («el estado va en el relleno, no en el trazo»)                                                                                                                                                                                                                                                                                                    | ADR-194                                                                    |

### Lo que NO se sube, y por qué

- **`video-watch.tsx`**, **`studio-selector.tsx`**, **`sign-in.tsx`**, **`consent.tsx`**,
  **`plan-cta.tsx`**: dominio de Rosette (Orion, rosets, sesión). Lo que tienen de patrón —el
  modal con `Card` de cristal, la puerta que no se cierra— cabe en una story «Composition» de
  `Modal`, no en un componente.
- **`crumbs.tsx`**, **`links.tsx`**: adaptadores de router. La frontera servidor/cliente es de
  la app; Nebula ya acepta `component`.
- **`parts.tsx`** (`PageHeader`, `DataRow`, `Notice`, `Tag`, `Portrait`): composiciones de tres
  líneas sobre `Title`/`Text`/`Badge`/`Card`. Se copian; subirlas es más API que valor.
- **`Scroll` propio y `ScrolledAtom`**: no es componente, es el contrato del #6. Cuando #6
  exista, `Scroll` de app-client.tsx desaparece.

### Deuda de alineación **de Rosette** que este inventario deja a la vista

Rosette es la referencia y aun así reimplementa cuatro cosas que Nebula ya tiene: `useScrolled`
(por `Scroll` + átomo), `Filters` (por `FilterBar`), `Lightbox` (por `MediaViewer`) y `Section`
con eyebrow (por `Band`). Las cuatro tienen su razón escrita en el comentario del fichero. Antes
de alinear a nadie con Rosette conviene decidir, una por una, si la razón sigue en pie con 1.1.13
o si es Rosette la que tiene que volver al catálogo. Y dos docs de Rosette —`docs/design-style.md`
y `docs/page-template.md`— describen HeroUI y Tailwind y hay que retirarlos: un agente que los lea
primero construye el producto equivocado.
