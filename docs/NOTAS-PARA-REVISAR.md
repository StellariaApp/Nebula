# Notas para revisar

Estado del trabajo en curso. **Lo de arriba es lo que necesita tu decisión; lo de abajo es el
diario.**

---

## 1. Lo que necesita tu decisión

De las cuatro que había abiertas, **tres las cerraste el 2026-08-09** (D-1 regla de lint, D-3 la
banda se queda, D-4 traducir las 120). Queda una, y es la única que sigue sin respuesta.

### D-2 · CERRADA el 2026-08-12

Los cinco componentes que retenían `radius` lo pierden: **si ya existe `r`, no debería existir
`radius`**. Ver la enmienda de [ADR-119](adr/ADR-119-el-radio-lo-manda-la-style-prop.md). Al medirlo
apareció además que en tres de los cinco `radius` ya estaba muerta —las sprinkles van sin capa y
ganan siempre a la hoja del componente—, así que no era solo incoherencia de API.

### El único gate que no corre en CI

No es una decisión que bloquee nada hoy, pero conviene que sepas que existe. `gates.yml` corre ocho
de los nueve; **el visual se queda fuera** porque su baseline es por plataforma y hoy solo hay
`win32`: en un runner Linux no habría contra qué comparar, y regenerarlo daría falsos positivos por
encima del umbral del 0,1 %.

Cerrarlo pide fijar el «entorno único» que ADR-037 §3 nombra sin elegir: un contenedor con fuentes
fijadas, que pasaría a sustituir al baseline de win32 —no a convivir con él—. Es trabajo aparte y no
lo he empezado. Está escrito en el propio workflow, en docs/03 §4.1 y en la enmienda de ADR-112.

---

## 2. Lo que está cerrado y commiteado

| commit    | qué                                                                        |
| --------- | -------------------------------------------------------------------------- |
| `7e658da` | ADR-118 — el cristal recupera su filo y el velo se vuelve opaco            |
| `7334fbf` | `Hero` leía el color del texto del objeto del tema y no del contrato       |
| `6b9acab` | `pnpm dev` levanta la cadena entera en watch                               |
| `54d96d4` | Conmutador de tema flotante y el skip link deja de estar en español        |
| `d2fbd19` | ADR-119 — el radio lo manda la style prop: 12 componentes, 201 llamadas    |
| `26146e8` | Portada: cabecera móvil, jerarquía de bandas, Stats, copy al diccionario   |
| `168a0e2` | ProductSwitch a `Segment` y sin español en el lector de pantalla           |
| `87720aa` | La escala de la portada llega a `/components`, `/docs`, `/theme` y demás   |
| `391a169` | DS2.3 — las cinco guías de /docs, con las obligaciones del consumidor      |
| `8fe16eb` | Primer lote de contratos JSDoc al inglés: 57 bloques en 8 componentes      |
| `a338f8c` | Segundo lote: 74 bloques en 6 componentes (controles, overlays, AppShell)  |
| `85a4b25` | Tercer lote: 62 bloques en los 4 subpath con más contrato                  |
| `63b96e4` | Cuarto lote: 44 bloques en formulario, feedback y navegación               |
| `2f262d9` | Quinto lote: 42 bloques, entre ellos las 6 ranuras que comparten 27 campos |
| `bb2aa8f` | Sexto lote: 45 bloques en los cinco componentes de colección               |
| `b03b4f5` | Séptimo lote: 63 bloques en 13 componentes                                 |
| `95bf23c` | **ADR-114 cerrado**: los 500 contratos JSDoc están en inglés               |
| `6cce1ab` | **ADR-120 cerrado (D-4)**: 191 cadenas de interfaz al inglés               |
| `4af60a5` | **D-1**: la lista corta de radios se cierra con lint, no con tipos         |

---

## 3. Lo que queda, en orden

> **PRIORIDAD, dicha por el propietario**: iterar sobre el **diseño de la portada** hasta que esté a
> nivel de publicación. Solo después se pasa a las demás vistas, **reutilizando lo que salga de la
> portada** —su escala, su ritmo, sus patrones— en vez de inventar de cero en cada una.
> Lo de accesibilidad no espera: un bloqueante de a11y se arregla en cuanto se toca esa zona.

1. **W5.3 — verificar el paquete consumiendolo** en la landing de Rosette. Escrito y sin ejecutar:
   [prompts/2-web/W5.3-verificacion-en-rosette.md](../prompts/2-web/W5.3-verificacion-en-rosette.md).
   Es lo que cierra el gate de W5, y llega a tiempo de corregir contrato en `0.2.0`.
2. **P1 — documentar el contrato**, en la sesion paralela. 27 % de props documentadas.
3. **W6 — Premium web**: los cinco paquetes de dominio, el registry privado y la mecanica de
   licencias. Es la ultima fase web del roadmap.
4. **Deuda del sitio, revisada una por una el 2026-08-12**:
   - ~~`site-background.tsx` contradice ADR-129~~ — **ARREGLADO**. Iba con `density="md"` fijo y
     `translucency` 2/4; el ADR fija `sm`/`1` para el cromado y `md`/`2` para la portada, o sea que
     estaba mal en los dos ejes y el JSDoc de la prop describia lo que el codigo no hacia («menos
     estrellas» con una densidad que nunca cambiaba).
   - ~~Los enlaces del carril no llevan icono y se ven vacios en la barra inferior de movil y en el
     carril mini de tablet~~ — **OBSOLETA**. Verificado: el sitio **nunca** pasa `collapsed` a
     `AppShell.Sidebar` y no monta ninguna barra inferior, asi que esas dos superficies no existen
     desde la reestructura de ADR-127. `NavLinkProps` si tiene ranura de icono (`leftSection`) el dia
     que hagan falta.
   - **El `iframe` de las muestras no repinta al cambiar el tema** — SIGUE ABIERTA, y no se ha
     tocado porque vive en los archivos que el propietario esta refactorizando (`component-page.tsx`
     y el nuevo `preview-panel.tsx`).
     **El arreglo, para cuando se toque esa zona**: `/preview/[name]` no monta provider propio, asi
     que hereda del layout raiz por `localStorage` al cargar y ahi se queda — es otro documento con
     su propio arbol de React, y el cambio de tema del padre no lo alcanza. Se resuelve pasando el
     tema en la URL (`?scheme=…`) desde una isla cliente que lea `useTheme()`, y dandole al `iframe`
     una `key` con ese mismo valor para que remonte al cambiar. El `iframe` esta hoy en un componente
     de servidor, que no puede saber el tema: por eso hace falta la isla.
   - La cache de dev de Turbopack se corrompe y sirve codigo viejo. Se cura borrando
     `apps/web/.next/dev` **entero** — no basta con `cache/`, que fue lo que fallo la primera vez.
5. **Tus decisiones, ninguna bloqueante**:
   - **El repositorio publico.** Bloquea la procedencia de npm, y ADR-113 ya daba el nucleo por
     publico. Ver `docs/release-checklist.md`.
   - **El entorno unico del gate visual** (ADR-037 §3), que es lo que lo mete en CI.
   - **`pnpm format:check` en CI.**

---

## 4. Cosas que descubrí y conviene que sepas

- **Los tres defectos de contrato de W5.0 están CERRADOS** (2026-08-12, commit `54f1abf`).
  `GlobalSearchResult.href` se implementa como ancla real —clic central y pestaña nueva incluidos—
  con la regla de que quien reclama el resultado manda; la raíz de `Card` esparce ya los atributos
  del DOM en sus tres formas y su contrato los declara; y `GLOBAL_SEARCH_LABELS.results` deja de
  mezclar español. Ocho tests los fijan.

- **P1 queda a medias por decisión del propietario (2026-08-11), y `noJsdoc` no es la medida buena.**
  Hecha la tanda 1: once contratos de la capa de composición —Box, Text, Flex, Center, Container,
  Grid, Grid.Col, Group, SimpleGrid, Space, AspectRatio y Paper—. `noJsdoc` pasa de **68 a 43**,
  pero el número engaña: el JSDoc de `BoxOwnProps.className` lo heredan todos los que extienden
  `Box` y el gate solo exige **una** prop documentada, así que saca del contador a componentes
  cuyas props propias siguen vacías —`Code` sale con 1 de 4, `GradientText` con 1 de 6—.
  **La medida honesta es por prop: 833 de 3.136, un 27 %**, con **114 componentes** que el gate da
  por buenos con menos de un tercio documentado (`Button` 5/15, `Avatar` 1/10, `Card` 1/12,
  `ButtonCopy` 1/14). Si P1 se retoma, el criterio de salida debería ser props documentadas y no
  componentes sin JSDoc; añadir un `gaps.thinlyDocumented` a `tools/docs-gen` lo haría medible y
  quedó propuesto sin ejecutar.


- **Los dos gates de P0 corridos por primera vez (W5.0, 2026-08-11).**
  - **`a11y` limpio a la primera**: 96 suites, 617 tests, **0 violaciones**. El prompt de la fase
    daba por hecho que axe encontraría cosas; no encontró ninguna.
  - **`visual`: 69 de 75 en verde, 6 en rojo** entre 0,176 % y 0,20 % sobre un umbral de 0,1 %, en
    tres láminas — `actions--sizes`, `spacing` (sus cuatro variantes) y `datagrid-y-charts`.
    **No son una regresión del catálogo.** Medido en los píxeles: el relleno del botón es idéntico
    (`94,99,248` en baseline y actual), la altura es la misma y ningún componente que aparezca en
    esas láminas se ha tocado desde la captura. Lo único que cambia es que **el texto mide menos
    ahora**: un botón que abraza su contenido encoge 6 px (121 → 115) y un párrafo rompe en otra
    palabra. Es la firma de un entorno de render distinto, no de un cambio de código, y es
    exactamente el argumento del «entorno único» que ADR-037 §3 pide y que sigue sin decidirse.
  - Descartado por experimento que fuera la carga de la tipografía: bloqueando las `woff2` fallan
    **73 de 75** con diffs de 0,5–1,4 %, así que el baseline sí se capturó con la Geist.
  - **El capturador no esperaba a `document.fonts.ready`** —solo un margen fijo de 700 ms—, así que
    podía disparar midiendo con la tipografía de reserva. Corregido en `test-runner.ts`. No era la
    causa de estos seis, pero era una carrera real esperando a ocurrir.
  - **Decisión pendiente**: regenerar esos seis baselines o no. No lo he hecho: el prompt de la fase
    lo prohíbe explícitamente sin justificación escrita, y ésta es la justificación para que decidas.


- **Seis temas de producto siguen fallando el texto de su degradado** (W5.0, T0). Con el suelo de
  tinta de [ADR-132](adr/ADR-132-los-temas-de-v1-y-el-suelo-de-la-tinta.md) ya en su sitio, `rosette`,
  `stellaria`, `lagrange`, `aurora`, `eclipse` y `cosmos` quedan entre **4,32 y 4,34** contra el
  mínimo de 4,5 en `variantMap.gradient · <escala> (texto)`. **No se arregla con la tinta**: medido el
  mejor ink posible de cada uno, ninguno llega a 4,5, porque su segundo stop es el escalón `400` de
  su paleta. Mover ese stop a `500` tampoco es la cura general —arregla `lagrange`, `eclipse` y
  `cosmos` a 4,50–4,53 y hunde `polaris` de 7,08 a 4,33—. `polaris` y `nova` sí están limpios, 0 FAIL
  en los 158 pares. No bloquea v1 porque estos temas no se publican, pero se ven en el sitio.
- **El degradado de marca oficial pasa AA con 4,53 sobre 4,5**, tres centésimas de margen. El escalón
  400/500 de las paletas generadas cae justo sobre la frontera AA para texto, así que
  `variant="gradient"` con letra es marginal por construcción en todo el sistema de paletas y el
  aprobado del tema oficial no es holgura de diseño. El color queda congelado por decisión del
  propietario (checkpoint T0).
- **`pnpm dev` y los gates son mutuamente excluyentes.** El watch reescribe `dist` sin parar y
  `size-limit`, `tsc` y el build de una pasada leen ese mismo `dist`. Con dev vivo salen fallos
  fantasma: `TS5033` al escribir los `.d.ts.map`, `Could not resolve .../packages/web/undefined` en
  size-limit, y presupuestos apuntando a archivos que aparentan no existir. Va anotado en el commit
  `6b9acab`; falta llevarlo a la guía de contribución.
- **`r` con un número no escribe `style.borderRadius`.** Emite la custom property `--nb-r` y una
  clase que la lee. Cualquier test que assertara `style.borderRadius` con `radius={n}` hay que
  reescribirlo, no es un renombre.
- **`Paper` tenía un defecto**: con `radius` numérico el recipe caía a la clase `"md"` —no a su
  defecto `"lg"`— y luego la pisaba el estilo inline. Emitía una clase muerta. Desaparece con
  ADR-119.
- **El caché de turbo no veía `eslint.config.js`.** No había `globalDependencies`, así que una regla
  de lint nueva salía **FULL TURBO sin lintear nada**. Lo vi al ampliar la regla de D-1: 17 tareas
  «en verde», cero ejecutadas. Arreglado añadiendo `eslint.config.js` y `tsconfig.base.json` a
  `globalDependencies`, y verificado que ahora invalida. Es el mismo fallo de clase que el de los
  `inputs` de `check:docs`: **un gate que no puede fallar no es un gate**, y los dos se veían igual
  desde fuera —verde.
- **El censo de ADR-119 se hizo buscando variantes de `recipe`**, y siete componentes aplican su lista
  corta de radios con `styleVariants` o reenviándola a otro componente. La regla de lint cubría 4 de 11. Ampliada y verificada con una sonda: las once disparan.
- **Los recuentos de español están todos mal, y ya van tres.** El JSDoc era 7 veces lo estimado (500
  bloques, no ~70); D-4 era un 26 % más (120, no 95); y al ejecutarla aparecieron **73 cadenas más**
  que ninguna heurística vio, porque son de una palabra («Guardar», «Negrita») o no llevan ninguna
  palabra funcional («Saturación y brillo»). Total real: **191**.

  La regla que sale de las tres: **buscar español por tildes o por palabras funcionales encuentra
  frases largas y acentuadas, y se deja fuera justo las etiquetas de interfaz**, que son cortas y
  planas. Lo único que dio el número bueno fue leer las 530 candidatas a mano. Si vuelve a hacer
  falta, no te fíes del primer recuento.

---

## 5. Tuyo y sin tocar

Estos archivos llevan cambios tuyos en curso y los he dejado fuera de mis commits:

- `packages/web/src/components/Footer/Footer.tsx` — `glass = true` por defecto. **Es un cambio de
  defecto de API pública: si se queda, quiere ADR.**
- `packages/web/src/components/Hero/Hero.css.ts` — `gap: sm → md` en el header.
- `packages/web/src/components/Button/Button.css.ts` — los tres `fontSize` de tamaño.

`Nav.tsx` y `apps/web/src/app/[lang]/page.tsx` sí entraron en mis commits porque tenía que tocarlos;
llevan dentro tu `glass.strong`, el `momentum`, el `GlassSurface` y el `r="inherit"`.

## Reestructura de `/guides` — decisiones tomadas (2026-08-10)

> **Implementada** y recogida en
> [ADR-127](adr/ADR-127-las-guias-se-parten-en-seis-secciones.md). Las seis secciones quedaron en
> `getting-started`, `components`, `theming-styles`, `hooks`, `form` y `native` — `Native` sale de la
> raíz y entra en Guides.

El sitio pasa de una sección con dos grupos a **seis secciones hermanas**, cada una con su URL y su
propio carril:

```
/guides/getting-started            /guides/components            /guides/hooks
/guides/getting-started/installation   /guides/components/button     /guides/hooks/some-hook
```

`Components` **vive dentro de Guides**, no como raíz aparte. El nav superior queda con Home · Guides ·
Theme Creator, que son las tres páginas realmente distintas.

**Decidido por el propietario:**

1. **Las pestañas navegan con `router.push`**, no con anclas. Se asume el coste: sin clic central, sin
   `Cmd+clic` y sin enlace visible para el crawler. La alternativa —`href` en
   `Segment.Control.Item`— queda descartada por ahora; si se retoma, es API del catálogo y va con ADR.
2. **Las secciones sin contenido aparecen igual**, marcadas como próximas con la pantalla de
   `Reserved` que ya existe. Theming & Styles, Hooks y Form entran así.

**Lo que hace que no se remonte**: las pestañas y el carril viven en `guides/layout.tsx`. Un layout de
App Router no se desmonta mientras navegas dentro de su segmento, así que la sección activa se lee con
`useSelectedLayoutSegment()` y solo cambia el `children`. Si las pestañas viven en las páginas, se
remontan en cada salto.

**Es un solo commit y no se puede partir**: mover `content/<lang>/*.mdx` a
`content/<lang>/<section>/` rompe `/docs/*` hasta que existan el layout, las dos rutas nuevas
(`[section]/page.tsx` y `[section]/[...slug]/page.tsx`) y los redirects `/docs/:slug*` →
`/guides/getting-started/:slug*` y `/components` → `/guides/components`. La sección sale de la
carpeta, no del front matter: una sola fuente.
