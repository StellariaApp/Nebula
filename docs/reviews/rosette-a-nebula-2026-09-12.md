# Rosette → Nebula · revisión de C2 y lote de ADR (2026-09-12)

> Sesión del 2026-09-12 sobre Nebula 1.1.13. Decisión del propietario que la abre: **«el producto
> mejor visualmente es Rosette; hay que traer todo eso a Nebula y luego probarlo con Polaris, que
> se quedó muy atrás»**. Este informe (1) revisa `prompts/6-consumidores/C2-armazon-de-producto.md`
> contra los dos repos, (2) fija el lote de ADR que sube lo de Rosette al catálogo, con
> recomendación por cada decisión abierta, y (3) deja escrito qué ejercita Polaris de cada uno.
> **Checkpoint superado el mismo día**: el propietario aceptó los doce con la alternativa recomendada, C2 se redujo a lo propio y la norma h5/body3 gana. **Los doce están implementados** (§6).

---

## 1 · Qué había en el árbol y cómo se relacionan

Tres ficheros sin commitear de la misma fecha, más dos índices tocados:

| Fichero                                            | Qué es                                                                      | Estado            |
| -------------------------------------------------- | --------------------------------------------------------------------------- | ----------------- |
| `docs/07-recetas-de-producto.md`                   | La rúbrica de consumidor, sección por sección, con los huecos en §16        | nuevo, sin commit |
| `prompts/6-consumidores/C2-armazon-de-producto.md` | Alinear un producto **leyendo Rosette**; lleva la lista razonada de huecos  | nuevo, sin commit |
| `prompts/6-consumidores/C3-alineacion-visual.md`   | Alinear un producto **leyendo Nebula** (docs/07), sin mirar a otro producto | nuevo, sin commit |
| `docs/README.md` · `prompts/README.md`             | Índices con las tres entradas                                               | modificados       |

**Hallazgo de estructura.** Las Fases 2–8 de C2 repiten casi literalmente `docs/07` §2–§14 (raíz,
tema, `Main`/`Nav`/dock/`Footer`, `Band`, hero, `AppShell`, `Screen`, la cabecera que se encoge,
modales, estados, medios, i18n). C3 lo dice explícitamente: la norma vive en `docs/07` y «un
producto nunca edita docs/07 por su cuenta; propone». Con las dos copias, la primera vez que una
receta cambie en `docs/07`, C2 quedará diciendo lo viejo. Lo que C2 aporta y `docs/07` no tiene es
(a) la lista de ficheros de Rosette que hay que leer y en qué orden, (b) la sección «Lo que Rosette
tiene y Nebula no» con coste y prioridad, y (c) los dos checkpoints de decisión (modales contra
rutas; si un producto sin panel debe tenerlo). **Propuesta, no aplicada**: dejar C2 en esas tres
cosas y que sus fases digan «aplica docs/07 §N» en vez de repetir la receta. Es decisión del
propietario porque cambia el uso del prompt.

## 2 · Revisión de C2: hechos comprobados y corregidos

Comprobado fichero a fichero en `Rosette`, `Stellaria`, `Polaris`, `Iris`, `Lagrange` y Nebula.

**Correcto tal cual** (no se toca): las versiones (1.1.13 salvo Iris 1.1.12); quién tiene panel,
modales y medios; `useScrolled` mide `window.scrollY` sin `scroller`; `Section` sin `eyebrow` ni
`align`; `AppShell` sin `scrolled` por contexto; `AppShell.Link` sin `activeMode`; `Filters` existe;
`smooth` retirado en Stellaria e Iris y presente en Rosette y Polaris; `contentWidth={1152}` con
`floating sticky` en Polaris; Iris con `<video controls>` en `demo-case.tsx:90`; los seis iconos del
reproductor existen en `nebula-icons`; la norma de `00-prompt-revision-visual.md`; los cuatro
hallazgos de `refactor-a-nebula.md` §6.

**Corregido en C2** (y en `docs/07` cuando repetía el error):

| #   | Decía                                                                | Es                                                                                                          | Dónde                       |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `lift.base` «−14 / +6 / +12 / …, Rosette y Stellaria hunden»         | −14 Rosette · **−6 Stellaria** · +12 Polaris · **+6 Iris**                                                  | C2 Fase 2                   |
| 2   | `EmptyState`/`EmptyModule` «son icono + título + acción»             | `EmptyModule` **ya tiene** `illustration` (apilada) y `surface`; lo que falta es lateral + cristal + `fill` | C2 Tier A #4 · docs/07 §16  |
| 3   | `Viewer` «ya usa `Carousel` de Nebula» como ventaja                  | Es una **restricción**: Embla no puede entrar al core (ADR-014 r.3); la tira pasa a `scroll-snap`           | C2 Tier A #2                |
| 4   | `Icon` → «registro de nebula-icons»                                  | Los componentes de `web` usan **glifos internos** (`src/glyphs/`); hacen falta seis                         | C2 Tier A #1                |
| 5   | `AppShell.Links activeMode`                                          | En **`Sidebar`**: el href más largo se elige entre todos los grupos                                         | C2 Tier B #10 · docs/07 §16 |
| 6   | «Stellaria y Lagrange» tienen los dos docs viejos                    | Stellaria los dos; Lagrange sólo `design-style.md`                                                          | C2 «Lee antes»              |
| 7   | «Verifica si 1.1.13 arregló» el nombre accesible del carril encogido | Verificado: **no** (`AppShell.css.ts:228` `display: none`; `NavLink` descarta `aria-label`)                 | C2 Fase 4 · docs/07 §6.3    |
| 8   | Tablas de huecos sin destino cerrado                                 | Columna «ADR propuesto» con el número de cada uno                                                           | C2 Tier A/B · docs/07 §16   |

**Contradicción abierta que no se ha tocado** (decisión del propietario):
`AppShell.Header` pinta por defecto `Title fz="h6"` + `Text fz="body2" c="text.secondary"`
(`AppShell/components/Header.tsx`), y `Screen` de Rosette no lo sobreescribe. La norma de
`00-prompt-revision-visual.md` —y `docs/07` §7.1 y §13— dice «h5 semibold · body3 apagado», que es lo
que hace `PageHeader` de `parts.tsx`. Rosette tiene hoy **dos jerarquías de h1**: la de `Screen` y
la de `PageHeader`. O `Screen` pasa `titleProps={{ fz: "h5" }}` y `subtitleProps={{ fz: "body3", c:
"text.muted" }}`, o la norma cambia a h6/body2 y `PageHeader` se retira. Recomendación: la primera,
porque la norma se escribió mirando pantallas y `AppShell.Header` nunca se calibró contra un
producto.

## 3 · El lote de ADR (todos en `propuesta`)

Doce documentos, `ADR-187` a `ADR-198`. Orden de ejecución por dependencia y por lo que Polaris puede
probar primero; el coste es una estimación de sesión de implementación con tests y story.

| Orden | ADR         | Qué sube                                                                                                           | Decisión abierta                                    | Coste | Polaris lo ejercita                                                            |
| ----- | ----------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ----- | ------------------------------------------------------------------------------ |
| 1     | **ADR-191** | Corrección: el carril encogido conserva el nombre accesible                                                        | ninguna                                             | S     | sí, hoy incumple                                                               |
| 2     | **ADR-190** | `AppShell.Sidebar activeMode="pathname"` (`BestPathMatch` compartido)                                              | ninguna                                             | S     | sí: su rail enciende `/dashboard` en todas                                     |
| 3     | **ADR-189** | `Section eyebrow` + `align="center"`                                                                               | ninguna                                             | S     | sí: retira su `band.tsx`                                                       |
| 4     | **ADR-192** | `EmptyModule layout="side" surface="glass" fill`                                                                   | `StateSheet` nuevo vs extender (rec.: extender)     | S     | sí: `EmptyView`/`ErrorView` → una lámina; su fallo deja de parecer vacío       |
| 5     | **ADR-194** | `ActionIcon pressed`                                                                                               | ninguna                                             | XS    | poco (no tiene conmutadores)                                                   |
| 6     | **ADR-193** | `Dock` compound                                                                                                    | componente vs story de `Affix` (rec.: componente)   | M     | sí: retira la caja de su `dock.tsx`                                            |
| 7     | **ADR-187** | `useScrolled({ scroller })` · `AppShell.Scroll` + `useAppShellScroll()` · `AppShell.Section hanging/hangingHeight` | `Header collapsible` vs `hanging` (rec.: `hanging`) | L     | sí, si Polaris gana una ficha con cabecera que se encoge; hoy no tiene ninguna |
| 8     | **ADR-188** | `useFloatingBand` · `CenterOn` · `data-floating` de serie en `AppShell.Header`/`Subbar`/`Nav floating`             | ninguna                                             | S     | indirecto (centrar bajo cabecera pegada)                                       |
| 9     | **ADR-197** | `Cutout`                                                                                                           | ninguna                                             | S     | sí, si su hero adopta el visual de Rosette                                     |
| 10    | **ADR-195** | `VideoPlayer` + `AudioPlayer` en `/media` (+6 glifos)                                                              | ninguna                                             | L     | no (Polaris no tiene medios); lo prueba Rosette e Iris                         |
| 11    | **ADR-196** | `Viewer` sin panel                                                                                                 | `Viewer` nuevo vs `Lightbox bare` (rec.: nuevo)     | L     | no                                                                             |
| 12    | **ADR-198** | `MediaCard`                                                                                                        | exportar `VideoPlayer` también desde el barrel      | L     | no                                                                             |

Tres piezas de la lista de C2 **no** tienen ADR a propósito:

- **#11 `FilterBar`**: `Filters` existe; es un hallazgo para `Filters` (variante compacta: chips de
  activos + popover) y Polaris debe empezar por `Filters`, no por la copia.
- **`parts.tsx`** (`PageHeader`, `DataRow`, `Notice`, `Tag`, `Portrait`, `Rosets`): tres líneas sobre
  `Title`/`Text`/`Badge`/`Card`. Se copian. Con la contradicción del §2 resuelta, `PageHeader`
  probablemente desaparece.
- **`crumbs.tsx`, `links.tsx`, `video-watch.tsx`, `studio-selector.tsx`, `sign-in.tsx`,
  `consent.tsx`, `plan-cta.tsx`**: adaptadores de router o dominio de Rosette.

**Lo que desaparece de Rosette cuando el lote esté publicado** (sin cambiar de forma, sólo de
import): `video-player.tsx`, `voice-player.tsx`, `player.css.ts`, `viewer.tsx`, `viewer.css.ts`,
`cutout.tsx`, `media-card.tsx`, `media-card.css.ts`, `band.tsx`, `band.css.ts`, `piece-action.tsx`,
la caja de `dock.tsx`, `system-state.tsx` (queda un mapa `kind → asset`), `lib/scroll.ts`, y de
`app-client.tsx` `Scroll`, `ActiveRail` y los átomos `ScrolledAtom`/`RefScrollAtom`. Son
**~2.900 líneas** de las 7.023 de `(shared)`.

## 4 · Cómo se prueba con Polaris

Polaris es el banco de pruebas porque tiene panel (`shell/product-shell.tsx`), landing con `Band` y
dock, y una lámina de estados reescrita: cubre 8 de los 12 ADR sin inventarse nada. El circuito por
ADR:

1. Implementar en Nebula con story, test y `size-limit`; `pnpm turbo build typecheck lint` en
   verde.
2. `pnpm release` no: **`pnpm link`** (o `file:` en Polaris) contra el `dist` local, para no
   publicar doce versiones de prueba.
3. En Polaris, aplicar C3 sobre la pieza que el ADR cubre (una fila de la tabla de la Fase 1), con
   captura a 390/768/1440 en los dos esquemas.
4. Lo que Polaris descubra vuelve al ADR como sección «Veredicto» (patrón ADR-012), y después de
   `aceptada` se publica.

Lo que Polaris **no** puede probar (ADR-195, 196, 198) lo prueba Rosette al sustituir sus copias, y
ADR-195 además Iris al retirar su `<video controls>`.

## 5 · Decisiones que se piden en el checkpoint

1. **Estructura de C2** (§1): dejarlo en «lo que Rosette tiene y Nebula no» + orden de lectura +
   checkpoints, apuntando a `docs/07`, o mantener la copia entera.
2. **La cabecera de pantalla** (§2): `Screen` pasa a h5/body3 (recomendado) o la norma pasa a
   h6/body2.
3. **ADR-192**: extender `EmptyModule` (recomendado) o `StateSheet` nuevo.
4. **ADR-193**: `Dock` como componente (recomendado) o story de `Affix`.
5. **ADR-196**: `Viewer` nuevo con `Lightbox` al lado (recomendado) o reescribir `Lightbox`.
6. **ADR-198**: `VideoPlayer` exportado también desde el barrel para que `MediaCard` viva en el
   core (recomendado), o `MediaCard` en `/media`.
7. **Orden y alcance**: el de la tabla del §3 (1→12), o sólo los ocho que Polaris ejercita en la
   primera pasada.
8. **La semilla común** (`wash`/`lift`/`glass`/`ramp`) que C2 y `docs/07` §3 dejan pendiente: no
   entra en este lote salvo que se decida aquí. Los valores de Rosette siguen siendo el defecto.

## 6 · Implementación (2026-09-12)

Los doce, en el orden del §3, con test, `.md`, story y presupuesto. Lo que cambió respecto al texto
del ADR al implementarlo:

| ADR | Qué quedó                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 191 | `styles/hidden.ts` es la receta compartida con `VisuallyHidden`; `NavLink` reenvía `aria-label`; el runner de a11y honra `parameters.viewport.defaultViewport` y el carril tiene stories a `tablet` y `phone`            |
| 190 | `BestPathMatch`/`NormalizePath`/`usePathname` viven en `utils/path-match.ts` y `Nav` los importa de ahí; `usePathname` se suscribe además a `currententrychange` (Navigation API)                                        |
| 189 | `align` en `Section` es el del encabezado y tapa la style prop `align` (ADR-032)                                                                                                                                         |
| 192 | `surface="glass"` monta `GlassSurface component="section" level="strong" r="lg"`; el reset de borde de la raíz pasó a las variantes para no pisar el filo del cristal                                                    |
| 194 | `pressedVariant` por defecto `filled`; `data-toggled` distingue del `data-pressed` de React Aria                                                                                                                         |
| 193 | `Dock` mide 55,69 kB (Popover + Aria): tope 58, dentro del patrón ≤70. `surfaceProps`/`compactProps` van sin `shadow`/`component` porque son `GlassSurface`                                                              |
| 187 | `AppShell.Scroll` adopta el papel por contexto (`Adopt`) y el `main` lo recupera al desmontar; `hanging` reserva con un **espaciador** hermano y no con `padding` (la `p` del cuerpo, en la capa util, lo habría pisado) |
| 188 | `useScrollSpy` toma `chrome` de `FloatingBand` cuando no se le pasa; `Nav` publica `data-floating="header"` (antes `"true"`)                                                                                             |
| 197 | `background` es ranura; la figura se coloca con diez vars y `fallbackVar`                                                                                                                                                |
| 195 | Seis glifos internos nuevos; `PlayerVolume` y los rótulos viven en `AudioPlayer/` y `VideoPlayer` los importa; `VideoPlayer` se exporta también desde el barrel                                                          |
| 196 | Tira con `scroll-snap`, sin Embla; `FocusTrap autoFocus restoreFocus` + `Portal`; la descarga es un `<a download>`                                                                                                       |
| 198 | `frames` ya resueltos (sin `?q=`), `count.icon` es un nodo, `href` + `component` o `onOpen`; `poster` opcional cae en la primera lámina                                                                                  |

Gates: `pnpm turbo build typecheck lint test` de `web` y sus dependencias, `typecheck lint` del
playground, `check:slots`, `check:layers`, `check:glass` y `size`. Queda **Polaris** (§4): la
pasada de C3 sobre cada pieza es la siguiente sesión.

## 7 · Veredicto de Polaris (2026-09-12/13)

C3 corrió sobre Polaris contra el `dist` local (`docs/reviews/alineacion-polaris-2026-09-12.md` en
Polaris, §6). Ocho de los doce ADR se ejercitaron; lo que volvió a Nebula:

| ADR                          | Qué se vio en Polaris                                                                                                                       | Cambio en Nebula                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 190                          | El activo del carril se quedaba viejo: un layout de Next no vuelve a renderizar al navegar y `pushState` no dispara `popstate`              | `Sidebar pathname` para el `usePathname()` del router (enmienda en el ADR) |
| 187                          | `Section hanging` + `hangingHeight` en la ficha de producto; el espaciador reserva bien y `useAppShellScroll().ref` alimenta el `StarField` | ninguno; la cabecera encogida no se pudo ver con los datos del stub        |
| 189, 192, 193, 194, 191, 188 | funcionan tal cual                                                                                                                          | ninguno                                                                    |
| 195, 196, 197, 198           | Polaris no tiene medios ni figuras: no se ejercitan                                                                                         | pendiente de Rosette                                                       |

Hallazgos nuevos para decidir: `Nav.Sidebar` sin `activeMode` (el cajón móvil calcula el activo a
mano), `Stat` con versalitas que la norma descarta, `SimpleGrid` sin celda que abarque dos columnas,
el degradado de un tema de producto con `to` claro que falla AA con `text.onGradient`, y el foco
inicial del `Modal` que cae en `ButtonClose`.
