# ADR-060 — Dependencias de DnD, Carousel y media, y el subpath `/media`

- **Estado**: aceptada · 2026-07-31 (checkpoint de apertura de W4.2)
- **Contexto**

  W4.2 aterriza tres familias que ADR-014 regla 3 ya anticipaba como aisladas. Dos de sus
  dependencias estaban pre-aprobadas en la tabla de `docs/01` §8 desde el scaffold (dnd-kit y embla) y
  una no: `react-player`. Además, ADR-014 nombra los subpaths `/dnd` y `/carousel` pero no dice dónde
  caen `ImageGallery`/`Lightbox` (Tier 2) ni `Player` (Tier 3).

  Sobre dnd-kit hay una decisión que la tabla de §8 no podía prever: el proyecto tiene hoy **dos
  líneas vivas**, la estable `@dnd-kit/core` 6.x y una reescritura `@dnd-kit/react` en 0.5.0.

- **Decisión**

  1. **dnd-kit, línea estable**: `@dnd-kit/core` ^6.3.1 + `@dnd-kit/sortable` ^10.0.0 +
     `@dnd-kit/utilities` ^3.2.2 + `@dnd-kit/modifiers` ^9.0.0, aisladas en `@stellaria/nebula-web/dnd`.
  2. **embla**: `embla-carousel-react` ^8.6.0, aislada en `@stellaria/nebula-web/carousel`.
  3. **react-player** ^3.4.0 entra como **dependencia directa de un subpath nuevo `/media`**, no como
     peer opcional. Se añade su fila a `docs/01` §8.
  4. **Se crea el subpath `/media`** con `Player` como único componente. `ImageGallery` y `Lightbox`
     son Tier 2, no necesitan dependencia —el zoom/pan es `transform` y aritmética propia— y por tanto
     **se quedan en el entry principal** con el resto del catálogo Tier 2.

- **Alternativas**

  - **`@dnd-kit/react` 0.5.0** (la reescritura). Es un solo paquete, más pequeño y más rápido. Se
    descarta por el calendario: W5 publica el core, y una dep **0.x** con API sin congelar significa
    que un `0.6` puede romper un subpath ya publicado. La línea 6.x, además, es la que tiene
    documentado el patrón de teclado completo —`KeyboardSensor` con `sortableKeyboardCoordinates`,
    `DragOverlay` y `announcements`/`screenReaderInstructions` en live region—, que es requisito del
    contrato a11y de `docs/03` §1 y no algo que podamos aplazar. Queda anotada para reevaluar cuando
    la reescritura llegue a 1.0.
  - **pragmatic-drag-and-drop** (Atlassian), la alternativa que §8 dejaba para Etapa 2. Núcleo de
    ~4,7 kB y agnóstico de framework, pero obliga a construir a mano el sortable, el overlay y toda
    la a11y de teclado que dnd-kit ya trae. El ahorro de bundle no compensa en un subpath que el
    consumidor solo descarga si usa DnD.
  - **`react-player` como peer opcional** (patrón Pintura, C1-Q6). Deja el árbol de deps más limpio
    para la venta enterprise y cuesta cero si no se usa. Se descarta porque **el aislamiento ya lo da
    el subpath**: quien no importe `/media` no paga nada igualmente, y el peer solo añade un modo de
    fallo —`Player` que no funciona recién instalado— sin ganancia real. El patrón peer se reserva
    para lo que ADR-014 regla 4 describe: integraciones con librerías del consumidor (form-atoms,
    Pintura, react-navigation), donde la instancia tiene que ser la suya.
  - **Wrapper propio de vídeo** (`<video>` + iframe de YouTube/Vimeo). Cubre el 95 % del uso real y es
    literalmente lo que hace el `Player` de tfv (`{ video, open, onClose }`). Se descarta porque
    mantener embeds de proveedores a mano es deuda recurrente por una dep que está aislada.
  - **Meter media dentro de `/carousel`**, sin subpath nuevo. Se descarta porque importar `Carousel`
    arrastraría `react-player` sin tocar vídeo, que es exactamente el sesgo que ADR-014 regla 3
    existe para evitar.

- **Coste medido** (brotli, por módulo, `pnpm --filter @stellaria/nebula-web size`)

  | Entrada             | Medido    | Banda                          |
  | ------------------- | --------- | ------------------------------ |
  | `DragDropContext`   | 14,23 kB  | compuestos ≤48                 |
  | `SortableList`      | 26,68 kB  | compuestos ≤48                 |
  | `KanbanBoard`       | 29,07 kB  | compuestos ≤48                 |
  | `Carousel`          | 38,02 kB  | compuestos ≤48                 |
  | `Lightbox`          | 38,05 kB  | compuestos ≤48                 |
  | `ImageGallery`      | 38,77 kB  | compuestos ≤48                 |
  | `Player`            | 37,90 kB  | **media ≤70** (banda nueva)    |

  **`react-player` necesita `deferred`, y el número sin él es el hallazgo de este ADR.** Medido con
  todo inlineado, `Player` da **509,68 kB** brotli: react-player declara diez dependencias de
  proveedor (Mux, HLS, DASH, YouTube, Vimeo, Wistia, Twitch, TikTok, Spotify, Cloudflare) y
  `size-limit` bundlea con esbuild **sin code-splitting**, así que las suma todas.

  No es lo que descarga un consumidor: `players.js` carga **cada proveedor con `React.lazy` +
  `import()` dinámico** y solo resuelve el que corresponde a la URL. El reproductor HTML —`<video>`
  para mp4/webm, el caso mayoritario— es el fallback y sí es estático. Con los diez chunks declarados
  en el campo `deferred` de `.size-limit.js`, `Player` mide **37,90 kB**: eso es lo que cuesta
  reproducir un archivo de vídeo, y los ~472 kB restantes se reparten en diez chunks de los que se
  baja como mucho uno.

  Es exactamente la corrección de sesgo que ADR-032 §6 aplicó a la hoja de sprinkles y W3.4.1 a las
  ramas de fecha de `Filter`; sin ella el presupuesto habría medido algo que nadie descarga.

- **Consecuencias**

  - `@stellaria/nebula-web` pasa de tres a **seis subpaths**: `/command`, `/charts`, `/datagrid`,
    `/dnd`, `/carousel`, `/media`. El aislamiento sigue sin darlo el build: lo da que `src/index.ts`
    no reexporte nada de ellos, y se verifica sobre `dist/index.js` en cada cierre de tramo.
  - Las seis dependencias se declaran `external` en `vite.config.ts`: se importan, no se bundlean,
    para que el consumidor las deduplique con las suyas.
  - `ImageGallery`/`Lightbox` en el entry principal significa que su peso entra en la entrada del
    barrel, que ya arrastra el CSS de todo el catálogo (`docs/w3-closure.md` §Deuda 1). Es el
    comportamiento correcto para un componente Tier 2 sin dependencias.
  - `docs/01` §8 gana la fila de `react-player` y matiza la de dnd-kit con la línea elegida.
