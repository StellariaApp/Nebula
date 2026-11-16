# Revisión integral de Nebula — 2026-11-15

> Encargo del propietario: revisar la librería para hacerla «sencilla, customizable, rápida, con
> buena accesibilidad y visualmente superior». Cuatro auditorías en paralelo sobre la 1.3.0
> —rendimiento, accesibilidad, API y motor de estilos— más una lectura del baseline visual.
>
> **Qué es cada cosa**: «medido» es un número sacado del `dist`, del build de `apps/web` o de
> producción; «leído» sale del código sin ejecutarlo; «probable» pide navegador. Nada de este
> documento reabre un doc cerrado: lo que choca con uno va en §6 como decisión tuya.

## 1. Veredicto

Nebula está por delante de su competencia en lo que más cuesta copiar: el tema de dos ejes que
retiñe el catálogo entero, las ranuras tipadas con su gate, los presupuestos de bytes por módulo y
React Aria en todo lo difícil. Está por detrás en cuatro cosas, por este orden:

1. **Pesa demasiado donde no debería.** El primitivo `Box` son 16,9 kB brotli de JS y arrastra
   236 kB de CSS del que una página usa el 1,8 %.
2. **Un consumidor no puede ajustar casi nada sin envolver.** Unos 80 componentes descartan `id`,
   `data-*`, `aria-*`, `ref` y `style`; no hay defaults por componente ni selectores estables.
3. **La puerta de entrada está rota.** La guía de instalación importaba dos símbolos que no existen.
4. **Dos gates dan verde sin vigilar**: el de capas (485 reglas sueltas) y el visual (ningún overlay
   abierto, ningún estado de hover o foco).

## 2. Hecho en esta sesión

Todo interno, sin cambio de API ni de dependencias. `build typecheck lint test check:slots size` en
43/43, más `check:layers` y `check:glass`.

| Cambio                                                                                              | Dónde                                              |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| El anillo de foco de `Rating` colgaba de un atributo que nadie escribía                             | `Rating.css.ts`                                    |
| El segmento activo de `DatePicker`, `DateRangePicker` y `TimeInput` no se distinguía, por lo mismo  | `fields/date-segments.css.ts`                      |
| `Segment` sin valor dejaba todos los ítems en `tabIndex=-1`: inalcanzable con teclado               | `Segment/components/Control.tsx`                   |
| El label visible no nombraba al grupo en `Rating` ni en `PinInput`                                  | `Rating.tsx`, `PinInput.tsx`                       |
| «No results» de `Select`, `Combobox` y `MultiSelect` no se anunciaba                                | `collections/option-list.tsx`                      |
| `Rating` anunciaba «N de M» en español (ADR-120 fija inglés)                                        | `Rating.tsx`                                       |
| `Toast` no expiraba nunca si el plazo vencía con el puntero encima, y no pausaba con el foco dentro | `Toast/ToastProvider.tsx`                          |
| `@internationalized/date` y `jotai` se publicaban empaquetados dentro de `dist/node_modules`        | `packages/web/vite.config.ts`                      |
| La guía de instalación importaba `ColorSchemeScript` y `vars` del barrel, y omitía `styles.css`     | `apps/web/content/en/getting-started/*.mdx`        |
| La guía RSC decía 30 de servidor y son 59; `Box` figuraba como servidor y no lo es                  | ídem                                               |
| `check:layers` mide ahora el CSS emitido, con la deuda anotada por archivo                          | `tools/check-layers.mjs`, `check-layers.debt.json` |
| El encargo del compilador de estilos en Rust                                                        | `prompts/8-compilador-estilos/`                    |

Siete tests nuevos fijan los arreglos de comportamiento. **Sin commitear**: el árbol está en `main`.

Un cambio lo notará quien tenga la app en español: el nombre accesible por defecto de las estrellas
de `Rating` pasa de «3 de 5» a «3 of 5». Se sobreescribe con `itemLabel`; el proveedor de textos de
§6-D3 es la solución de fondo.

## 3. Rendimiento

| #   | Hallazgo                                                                                                                                                                         | Estado   | Arreglo                                                                            | ADR          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- | ------------ |
| R1  | **Producción sirve gzip, no brotli.** La portada son 161 kB transferidos; en brotli serían 47.                                                                                   | medido   | Activar brotli en el servidor de `nebula.stellaria.app`                            | no           |
| R2  | **El CSS de `Box` viaja dos veces en cada HTML** (como `<style>` y dentro del payload RSC) y se usan 34 de sus 1.893 clases. Son 236 kB de los 472 kB de CSS incrustado.         | medido   | Sprinkles solo para `base`; lo responsive por el carril abierto, que ya existe     | no           |
| R3  | **La tabla de clases de sprinkles es el 83 % de `Box`** (117 kB min). La cabecera de `.size-limit.js` culpa a `reveal`, que es el 2 %.                                           | medido   | El mismo de R2: la tabla bajaría a ~45 kB                                          | no           |
| R4  | **`identifiers: "debug"` en producción.** Clases de 36 caracteres de media.                                                                                                      | simulado | `"short"`: el CSS pasa de 649 a ~403 kB y `Box.css.js` de 138 a ~84 kB             | no           |
| R5  | **`NebulaProvider` carga `domAnimation` de motion en estático**: ~24 kB brotli en el camino crítico de toda página.                                                              | medido   | Carga asíncrona de las features                                                    | recomendable |
| R6  | **motion donde basta CSS**: `Transition`, `Collapse`, `Dialog`, `LoadingOverlay` y la entrada de todos los overlays. `TextInput` paga ~8 kB solo por animar su mensaje de error. | medido   | CSS con `@starting-style`; motion se queda en `Switch`, `Segment`, `Nav` y `Toast` | parcial      |
| R7  | **La matriz variante × color se repite en ocho hojas** (131 kB). Terminar P5 al ritmo actual añade ~15 kB por componente en los 26 que faltan.                                   | medido   | Una sola tabla de tono compartida, **antes** de seguir con P5                      | no           |
| R8  | **El contrato de temas (37 kB) entra en el JS de cliente** por `Button`, y `.size-limit.js` ignora los temas: ningún presupuesto lo ve.                                          | medido   | P5 en `Button` y `ActionIcon`, y un presupuesto que no los ignore                  | no           |
| R9  | El provider re-renderiza a los 49 componentes que leen `useTheme` justo tras hidratar, aunque el tema no cambie.                                                                 | leído    | No tocar el estado si el tema resuelto es el mismo                                 | no           |
| R10 | `PermissionGate`, `ButtonClose`, `FormField`, `GradientText`, `EmptyState`, `BlurOverlay`, `NoiseOverlay`, `CurrencyDisplay` y `DateDisplay` son cliente sin necesitarlo.        | leído    | Sacar `effects.glass` y `motion.tier` a variables CSS o atributos                  | no           |

Descartado con datos: la resolución de style props (0,03–0,7 µs por llamada), `react-aria`
monolítico (se sacude bien) y la calidad del CSS (2,8 % de duplicación, sin `transition: all`).
Las dependencias de subpath —tiptap, recharts, dnd-kit— no llegan al bundle desde el barrel; solo
pesan en la instalación.

**Orden**: R1 hoy → R4 → R2/R3 → R7 antes de más P5 → R5/R6.

## 4. Accesibilidad

Lo que axe no ve. Los dos bloqueantes y cuatro altos ya están arreglados (§2). Queda:

| #   | Hallazgo                                                                                                                                                                                    | Criterio      | Estado               | ADR                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------- | ------------------------------- |
| A1  | **El error de campo no queda asociado al control.** `errorDisplay` vale `"tooltip"` por defecto y en ese modo `aria-describedby` lo excluye: al volver al campo solo se oye «inválido».     | 3.3.1, 1.3.1  | leído                | interno; cambiar el defecto, sí |
| A2  | **`forced-colors`**: el estado de `Switch`, la opción enfocada de `Menu` y `Select`, el día elegido de `Calendar` y la pastilla de `Segment` solo viven en `background`, que el modo borra. | 1.4.11        | leído, falta Windows | no                              |
| A3  | **`loading` deshabilita el botón nativo** y el foco se cae a `body`.                                                                                                                        | 2.4.3         | leído                | no, con nota de changelog       |
| A4  | **`HoverCard`**: sin Escape, sin relación ARIA, y su contenido es inalcanzable con Tab.                                                                                                     | 1.4.13, 2.1.1 | leído                | si admite contenido interactivo |
| A5  | **Objetivos por debajo de 24 px**: puntos de `Carousel` (8 px), quitar chip de `MultiSelect` (16 px), asa de columna de `DataGrid` (8 px).                                                  | 2.5.8         | leído                | no                              |
| A6  | **`DirectionProvider` fija `es-ES` / `ar-AE`** y `NebulaProvider` no monta `I18nProvider`.                                                                                                  | 3.1.1         | leído                | sí (`locale`)                   |
| A7  | **`Toast` bajo un `Modal`** queda fuera del top layer: ni se ve ni se anuncia.                                                                                                              | 4.1.3         | probable             | no                              |
| A8  | **El gate de contraste mide 2 de 32 esquemas**; los 15 temas de producto quedan fuera.                                                                                                      | 1.4.3         | leído                | no                              |
| A9  | Patrones APG a medias en `Rating` (sin flechas), `TransferList`, `DataGrid` (sin `role="grid"`) y la barra de `RichTextEditor`.                                                             | 2.1.1, 4.1.2  | leído                | no                              |
| A10 | `aria-label` de `ActionIcon` es «not optional» en el JSDoc y opcional en el tipo.                                                                                                           | 4.1.2         | leído                | sí, o aviso en dev sin ADR      |

34 de 158 componentes no tienen ningún test, entre ellos `Dropzone`, `FileInput`, `HoverCard`,
`Stepper`, `DateRangePicker` y `TimeInput`. 15 interactivos tienen tests sin una sola pulsación de
teclado.

Bien hecho y sin necesidad de reauditar: el anillo de foco único, `Modal` y `Drawer` sobre
`<dialog>` nativo, `prefers-reduced-motion` (barrido completo, cero huecos) y la semántica de
`Switch`, `Checkbox` y `Radio`.

## 5. Visual y gates

Leído sobre las 79 láminas de `apps/playground-web/__snapshots__/visual/linux`.

- **Los campos no tienen frontera** sobre el lienzo. Es la excepción a AA que aceptaste por escrito
  (ADR-161) tras descartar el borde a 6:1. Sigue siendo lo más flojo del catálogo, visual y
  accesiblemente, y hay un punto intermedio que no se probó: ver §6-D5.
- **La escalera de elevación no se lee**: los niveles 0, 1 y 2 son indistinguibles y `overlay` es
  más oscuro que `raised`, cuando en un tema oscuro lo elevado suele aclararse. Deuda conocida.
- **`filled` y `glow` son iguales en reposo**, y `Accordion` no separa sus ítems.
- **El gate visual no cubre ningún overlay**: las láminas de `Modal`, `Menu`, `Popover`, `Drawer`,
  `Tooltip` y `ContextMenu` capturan el disparador cerrado.
- **Seis láminas son idénticas byte a byte** a otra (`actions--states`, `--dark` y
  `--reduced-motion` son el mismo archivo) y ninguna muestra hover, foco o pulsado.
- **485 reglas emitidas fuera de capa en 71 hojas** —el `base` entero del recipe de `Button`, las
  variantes `size` de `Segment`, `Card`, `Badge`, `Modal`—. Una regla sin capa gana a las style
  props: es justo lo que ADR-142 prohíbe. El gate las ve desde hoy y la cifra solo puede bajar.
  Encaparlas mueve la cascada dentro de cada componente, así que pide comparación visual lámina a
  lámina: es un tramo propio, no un arreglo suelto.

## 6. Decisiones tuyas

Cada una con mi recomendación primero. Las cinco primeras son las que más mueven la aguja.

| #   | Decisión                                                                                                                                                                             | Recomiendo                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| D1  | **Props DOM y `ref` en la raíz de los ~80 que hoy los descartan** (`Badge`, `Tag`, `Alert`, `Tabs`, `Table`, `Modal`, `Select`…).                                                    | **Sí**, como enmienda de la plantilla de componente. Es aditivo y es lo que más frena a un consumidor. |
| D2  | **Defaults por componente y selectores estables** (`data-nebula`, `data-slot`). Hoy «todos los `TextInput` con error en línea» obliga a envolver cada uno.                           | **Sí**, en un ADR conjunto. Sin esto «customizable» se queda en el color.                              |
| D3  | **Proveedor de textos y `locale`.** Once productos en español repiten `closeLabel` y `emptyLabel` instancia a instancia.                                                             | **Sí**, con paquete `es`. Cierra también A6.                                                           |
| D4  | **Política de versiones.** Hay «BREAKING» en 1.1.3, 1.1.5 y 1.2.0 con once consumidores en `^1`.                                                                                     | **Nada rompe fuera de major**; lo que rompa se acumula en un canal `next` hasta la 2.0.                |
| D5  | **Reabrir la frontera del campo.** Se descartó el borde a 6:1; no se probó una superficie `filled` con un escalón propio de la rampa neutra a 3:1 contra el lienzo, sin borde.       | **Probarlo en una lámina** antes de decidir. Si no convence, la excepción se queda como está.          |
| D6  | **`errorDisplay="inline"` por defecto** (A1).                                                                                                                                        | Sí, en la 2.0. Mientras, asociar la burbuja por `aria-describedby`, que es interno.                    |
| D7  | **`Form` esparce atributos de `<form>`** (`action`, `method`, `ref`): hoy no sirve con server actions.                                                                               | Sí.                                                                                                    |
| D8  | **`LazyMotion` asíncrono y motion a CSS** (R5, R6).                                                                                                                                  | Sí. Las animaciones de entrada anteriores a la carga se saltan; es el único efecto observable.         |
| D9  | **Convergencia de vocabulario** para la 2.0: `loading` / `isLoading` / `isPending`, `opened` / `in` / `expanded`, `data` / `items` / `options`, y siete formas de escribir posición. | Alias con aviso de deprecación ahora, retirada en la 2.0.                                              |
| D10 | **`form-atoms`** es peer opcional y nada lo importa.                                                                                                                                 | Publicar un adaptador de verdad o quitar el peer.                                                      |

## 7. Orden que propongo

1. **Ya**: brotli en producción (R1) y publicar lo de §2 como 1.3.1.
2. **Un tramo de peso** (sin ADR): identificadores cortos, responsive por el carril abierto, tabla de
   tono compartida. Es donde `Box` deja de costar lo que cuesta.
3. **Un tramo de capas**: encapar las 485 reglas con comparación visual, y de paso que el gate
   visual abra los overlays y capture hover y foco.
4. **Un lote de ADR de personalización**: D1, D2, D3 y D7.
5. **Accesibilidad restante**: A1–A5 en un PR, A2 con captura en Windows.
6. **Docs**: guías de formularios, tema propio y `AppShell`; JSDoc al 100 % en los 25 más usados
   (hoy el 28 % de las props tiene JSDoc y 62 componentes no tienen ninguna).

## 8. Lo que no se pudo juzgar

- Nada se probó en navegador ni con lector de pantalla: A2 y A7 son lectura de código.
- El efecto de R4 está simulado por sustitución sobre el `dist`, no con un build real; puede haber
  tests o gates que casen nombres de clase.
- No comprobé si cada navegación de cliente descarga entero el `index.rsc` de 603 kB.
- El juicio visual es sobre láminas del tema `nebula` oscuro; el claro y los quince de producto
  apenas aparecen en el baseline.
- Los READMEs de `themes` y `tokens` siguen describiendo solo `light` y `dark`; no los toqué.

---

# Segunda ronda — 2026-11-16 · rendimiento, código y arquitectura

`build typecheck lint test size check:slots check:contrast check:docs` en 45/45, más
`check:layers` y `check:glass`. Sin commitear.

## 9. Hecho en esta ronda

| Cambio                                                                                                                                                                                     | Dónde                                     | Cómo se comprobó                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------- |
| **Bucle infinito de render** en `ChipGroup`, `TagsInput`, `Dropzone` y `FileInput` controlados: pasan `[...value]` a `useUncontrolled`, cuyo efecto espejo hacía `setState` en cada render | `packages/hooks/src/use-uncontrolled.ts`  | Test controlado de `ChipGroup` que antes se colgaba |
| Un hijo heredaba el valor responsive del padre por el carril abierto de style props                                                                                                        | `Box.open.css.ts`, `utils/style-props.ts` | Chromium, con el CSS del `dist`                     |
| Un responsive sin `base` ponía la propiedad a `0` y pisaba al componente                                                                                                                   | ídem                                      | ídem                                                |
| `p={20} px="md"` ignoraba el `px`; lo mismo con `bd` y `bdc`                                                                                                                               | `utils/style-props.ts` (`FAMILIES`)       | ídem                                                |
| La hoja del carril abierto baja de 98,4 a 75,6 kB: el encadenado por breakpoint se resuelve en JS                                                                                          | ídem · enmienda en ADR-103                | 200 presupuestos en verde sin tocarlos              |
| `check:docs` podía dar verde cacheado: sus inputs apuntaban a `apps/docs/generated`, que no existe                                                                                         | `turbo.json`                              | —                                                   |
| El provider cambiaba el contexto al restaurar el mismo tema que ya pintaba                                                                                                                 | `provider/nebula-provider.tsx`            | Leído; bajo `act` no se puede aislar en un test     |
| `cx` en su módulo: 56 archivos dejan de importar el resolutor de style props solo para concatenar clases                                                                                   | `utils/cx.ts`                             | Efecto en bytes: ruido (±200 B)                     |
| `ButtonCopy` lanzaba en HTTP (sin `navigator.clipboard`) y dejaba un rechazo sin manejar; `HoverCard` no limpiaba su timer al desmontar                                                    | `ButtonCopy.tsx`, `HoverCard.tsx`         | Leído                                               |

Dos cambios de comportamiento que conviene saber:

- `useUncontrolled` ya no recuerda el último valor controlado si un campo pasa de controlado a no
  controlado. Es un patrón que React tampoco soporta, pero antes funcionaba.
- Un valor responsive por el carril abierto escribe seis variables en `style` en vez de las que
  declara.

## 10. Rendimiento — lo que queda, ya medido

| #   | Qué                                                                                                                                                                | Medida                                                                                           | Decide                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------- |
| R4  | **Identificadores cortos.** Probado con build real y revertido: ADR-094 lo dejó «para decidir aparte».                                                             | CSS 680 → 549 kB · `Box.css.js` 138 → 86 kB · `Box` 21,5 → 20,1 kB br · `Button` 33 → 31,4 kB br | tú                              |
|     | Rompe exactamente cinco tests que casan nombres de clase: `Modal`, `CodeHighlight` (2), `overlay-motion` y `Charts`.                                               |                                                                                                  |                                 |
| R2  | **Sprinkles solo para `base`**, lo responsive por el carril abierto. Ya es viable: los tres defectos que lo impedían están arreglados.                             | ~91 kB de CSS y ~70 kB de tabla JS                                                               | ADR (toca ADR-032)              |
| R7  | **Tabla de tono compartida** para `Badge`, `Tag`, `Alert`, `Progress`, `ThemeIcon`, `Stepper`, `Timeline` y `Banderole`.                                           | 131 kB repetidos hoy                                                                             | interno, con comparación visual |
| R9b | **`systemScheme` re-renderiza a todo consumidor de `useTheme` tras hidratar**, y nadie en la librería lo lee.                                                      | 49 componentes, un render cada uno por carga                                                     | ADR (API de hooks)              |
| R5  | `LazyMotion` asíncrono. **Riesgo nuevo**: `Modal` cierra su `<dialog>` en `onExitComplete`; si las features no han cargado, puede quedarse con `showModal()` vivo. | ~24 kB br fuera del camino crítico                                                               | ADR, y probar eso antes         |

Descartado: sacar del cliente a `ButtonClose`, `FormField` y compañía. Los importan componentes de
cliente, así que el bundle no cambia.

## 11. Código y arquitectura — lo que queda

| #   | Sev.  | Hallazgo                                                                                                                                                                                                 | Arreglo                                                                  | ADR                    |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------- |
| C1  | Alta  | **No hay `eslint-plugin-react-hooks`**, y `eslint.config.js` apaga `no-explicit-any` y los `no-unsafe-*`. `exhaustive-deps` habría señalado el bucle de §9. El «presupuesto de `any` = 0» no tiene gate. | Añadir el plugin y reactivar `no-explicit-any`                           | sí (dep de desarrollo) |
| C2  | Alta  | **Un push a `main` solo corre typecheck y lint**; los tests, solo en PR o tag. `scripts/release.mjs` no corre ningún gate antes de etiquetar y empujar.                                                  | `test` en `guardia` y un `turbo build typecheck lint test` en el release | toca ADR-139/176       |
| C3  | Alta  | **El cableado de campo está copiado en 27 archivos**: ranuras, `field_slots`, `form_error` y el bloque `<FormField>` — unas 1.000 líneas.                                                                | `useFieldShell` o `<FieldShell>` interno                                 | no                     |
| C4  | Media | **`cloneElement(trigger, …)` pisa el `ref` y los handlers del consumidor** en `Popover`, `Tooltip`, `Menu` y `HoverCard`: un `onPress` propio en el disparador se pierde en silencio.                    | `mergeProps` y fusionar refs                                             | no                     |
| C5  | Media | **`Viewer` es un segundo visor y el único modal hecho a mano** (382 líneas, fuera del top layer); `Lightbox` hace lo mismo sobre `Modal`.                                                                | Montarlo sobre `Modal` y `useZoomPan`                                    | no; fusionarlos, sí    |
| C6  | Media | **El desplegable está copiado en `Select`, `Combobox`, `MultiSelect` y `dial-select`**, con tres `as unknown as` y un `offsetWidth` leído en render que no sigue al redimensionar.                       | `<FieldDropdown>` en `collections/`                                      | no                     |
| C7  | Media | **`GlobalSearch` llama a `onQueryChange` desde un efecto**: se dispara al montar y con cada callback inline del padre.                                                                                   | Llamarlo desde el handler del debounce                                   | no                     |
| C8  | Media | **Hidratación**: `Countdown` arranca con `Date.now()` y `DateDisplay` relativo usa `new Date()` en render.                                                                                               | Pintar tras montar                                                       | no                     |
| C9  | Media | **`@stellaria/nebula-icons` es dependencia de runtime de web** y solo lo importa un test de tipos; arrastra el peer `lucide-react`.                                                                      | A `devDependencies`                                                      | sí                     |
| C10 | Media | **`jotai` para dos almacenes de quince líneas.**                                                                                                                                                         | `useSyncExternalStore`                                                   | sí                     |
| C11 | Media | **`nebula-hooks` se dice «cross-platform sin UI»** y 5 de sus 13 hooks son solo DOM, entre ellos `use-momentum-scroll` (592 líneas, el archivo más largo del repo). `native` depende de él.              | Subpath `/dom`                                                           | sí                     |
| C12 | Media | **CI reconstruye todo hasta cuatro veces por tag**, sin caché de turbo ni de Chromium. `format:check` existe y nadie lo corre.                                                                           | Cachear `.turbo` y Playwright                                            | no                     |
| C13 | Baja  | **`check:glass` y `check:slots` miran texto por carpeta** y pueden dar verde falso, igual que hacía `check:layers`.                                                                                      | Medir sobre lo emitido / por componente                                  | no                     |
| C14 | Baja  | **Cero avisos de desarrollo** en toda la librería.                                                                                                                                                       | Un `Warn()` eliminable en producción                                     | no                     |
| C15 | Baja  | «Sin comentarios en el código» no tiene gate: 231 líneas de comentario en 49 archivos (varias mías de esta sesión, siguiendo el estilo del archivo).                                                     | Regla de lint o moverlos al `.md`                                        | no                     |

La batería no puede ver: top layer y foco reales (jsdom suple `showModal`), la cascada de capas,
`StrictMode`, la hidratación, ni el SSR de los 59 componentes de servidor.

Bien resuelto y sin tocar: el grafo interno no tiene ciclos ni huérfanos; listeners, observers y
timers están emparejados en todo el catálogo; y `Drawer` es un envoltorio de quince líneas sobre
`Modal`.

## 12. Orden actualizado

1. Publicar lo hecho como **1.3.1**: lleva un bucle infinito y tres bugs de cascada arreglados.
2. **C1 y C2**: son los que habrían cazado lo de §9 antes de publicarlo.
3. **R4** si das el visto bueno: es una línea de configuración y cinco tests.
4. **C4** y **C3**, que abaratan todo lo que venga después en los campos.
5. El resto de §7.

## 13. Cierre — 2026-11-16

El propietario aprobó publicar el lote y activar los identificadores cortos. Se aplican **solo en
`packages/web`**: en `packages/themes` rompían 24 tests que leen el nombre de la variable del tema, y
ese nombre es además lo que se ve al depurar (enmienda en ADR-094). Resultado medido: CSS de `web`
649 → 490 kB desde el inicio de la revisión; `Box` 22,4 → 17,1 kB y `Button` ~42 → 28,3 kB.

Los 200 presupuestos de `.size-limit.js` quedan ahora holgados —`Button` tiene tope en 43 kB y mide
28,3—. Ajustarlos a la baja es lo que impide que el margen se gaste sin que nadie lo vea; queda
pendiente.
