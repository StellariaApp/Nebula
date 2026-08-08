# Revisión final del catálogo web antes de W5

Pasada de refinamiento sobre `main` posterior al cierre de WN, siguiendo
[`prompts/2.3-web-normalize/REVISION-final-antes-de-W5.md`](../../prompts/2.3-web-normalize/REVISION-final-antes-de-W5.md).
No reabre ningún criterio de WN: busca lo que el barrido dejó mal, a medias o sin mirar.

## Lo que se corrió

| Gate                                     | Antes de esta revisión | Después                             |
| ---------------------------------------- | ---------------------- | ----------------------------------- |
| `build typecheck lint test`              | verde, 1.235 tests     | verde, **1.240** (5 tests nuevos)   |
| `check:slots`                            | verde                  | verde                               |
| `check:contrast`                         | verde                  | verde                               |
| `size`                                   | verde                  | verde                               |
| **`turbo a11y` (axe sobre 614 stories)** | **nunca se había corrido** | **3 fallos → verde**            |

## 1 · Las conversiones a `Box`/`Text` no cambiaron ningún elemento

El barrido convirtió ~95 nodos crudos. En vez de leerlos uno a uno, se diferenció la **secuencia de
etiquetas JSX** de cada archivo entre `987f31b` y `HEAD`, emparejando por subsecuencia común: **75
grupos de conversión, todos preservan la etiqueta**. El único sospechoso —`Table.tsx`— es falso
positivo: dos ramas `<caption>` que se fusionaron en un `Text component="caption"`.

`Hero.Description` (`p` → `div`) era el único caso real y ya estaba corregido antes de esta pasada.

## 2 · Lo que las conversiones **sí** cambiaron: el color heredado

`Text.css.ts` fija `color: text.primary`, y una declaración sobre el elemento gana siempre a la
herencia. Un `<Text>` dentro de una superficie teñida **ignora el color de esa superficie**.

`Button` pasa `inherit` y por eso está bien. Era **el único de 21 nodos**. Dos de ellos rompían el
gate de axe con `color-contrast` (serious):

| Story                         | Nodo                                              |
| ----------------------------- | ------------------------------------------------- |
| `Overlays/Menu` (ArrowOpens)  | el rótulo del item resaltado                      |
| `Overlays/ContextMenu`        | ídem                                              |
| `Data Display/Primitives`     | el rótulo de `Tag variant="filled"`, ×3           |

Efecto colateral del mismo defecto: **`Tag size` no llegaba a su rótulo**, porque `Text_text` fijaba
`font-size: body1` por encima del tamaño del contenedor. Lo mismo en los chips de `MultiSelect` y
`TagsInput`, en el item de `Menu` y en el nombre de fichero de `CodeHighlight`.

Corregido con `inherit` en los 21. **El gate de axe pasa a 614/614.**

`check:contrast` no lo veía porque valida pares de tokens del `variantMap`, no la composición real
del nodo pintado.

## 3 · El cableado frente a la ranura

El gate comprueba el orden de `className` y que ninguna ranura quede sin llegar a su nodo. **No
comprueba que la ranura no pueda pisar el cableado del componente.** Barrido mecánico: **39 nodos**
donde una `<nodo>Props` podía sobrescribir `id`, `role`, `aria-labelledby`, `aria-describedby`,
`aria-controls` o `htmlFor`.

Decisión del propietario: **gana el componente**. El cableado se escribe DESPUÉS del esparcido, igual
que `className` y que el estilo calculado. Los casos con consecuencia comprobada:

- `Modal.titleProps` → el `<dialog>` se quedaba sin nombre accesible.
- `FormField.labelProps` → `id` y `htmlFor` desatan el rótulo del control, en **los 27 campos** que
  comparten `FormField`.
- `Accordion.triggerProps` → `aria-controls` y el manejador del patrón APG entre cabeceras.
- `GlobalSearch.optionProps` → el `id` al que apunta el `aria-activedescendant` del combobox.
- `Menu` → los `id` de `aria-describedby` de la descripción y el atajo, que no tienen respaldo por
  contenido.
- `Segment` → `id`, `role` y `aria-controls` de pestaña y panel.

## 4 · El `style` calculado se sustituía en vez de componerse

Diez nodos escribían su `style` después del esparcido —correcto— pero **sin fusionar el de la
ranura**, así que el consumidor perdía su `style` entero. En seis de ellos el JSDoc prometía lo
contrario («la ranura se compone, no lo pisa»).

`Select` · `MultiSelect` · `ColorPicker/ColorInput` (×2) · `DatePicker/DatePickerPopover` ·
`DataGrid` (`th` y `td`) · `Dropzone` · `GlobalSearch` · `Toast/ToastProvider`.

Dos de ellos escribían además `style={undefined}` cuando la condición no se cumplía, lo que **borra**
el style del consumidor en vez de dejarlo pasar.

## 5 · JSDoc que mentía

169 props de ranura documentadas a mano en 34 tandas. Se comprobaron contra el código las **129
afirmaciones verificables** («solo se pinta si…», «se esparce sobre TODAS», «va después de…»), cada
una con una segunda pasada escéptica. **13 resultaron falsas; 12 corregidas.**

La peor: `Indicator.dotProps` decía «solo se pinta con `visible`, y sin `content` es un punto pelado»
— **ni `visible` ni `content` existen en el contrato**; eran constantes locales del `.tsx`.

Las otras: `Rating.partialProps`, `Stepper.stepProps`, `TagsInput.removeProps`,
`MonthPicker.cellProps`, `GlobalSearch.triggerProps`, `Footer.listProps`, `Dialog.headProps`,
`DataGrid` (×3) y `AppShell.contentProps`.

### La que no es un JSDoc, es un defecto contra un ADR cerrado

`Card.glass` documenta «por defecto `subtle` (ADR-078)». **`Card` no declara ninguna clase**, así que
cae en la del `variantMap`, que es `control` — la receta pensada para un botón de 48 px, que es
exactamente lo que ADR-078 §Decisión existe para evitar en superficies. `Paper` sí la declara.
**Pendiente de decisión**: el arreglo es una línea, pero cambia el material de `<Card variant="glass">`.

### Y una que es un defecto de comportamiento

`DataGrid.selectionOnly` exporta solo lo seleccionado **de la página en curso**, porque filtra sobre
el modelo paginado; la selección de otras páginas se pierde en silencio. El JSDoc queda corregido
para decir la verdad; **el comportamiento sigue pendiente de decisión** (`DataGrid.tsx:261`).

## 6 · Tipos de ranura deshonestos

`BoxSlotProps` sobre un nodo que no pasa por `Box` es exactamente el defecto que ADR-104 existió para
matar: el consumidor escribe `fw="bold"` y no pasa nada. **14 casos**, todos corregidos, por dos vías:

**El nodo pasa a ir por `Box`/`Text`** (el tipo se vuelve verdad y la ranura gana style props):
`Main.contentProps` · `GlobalSearch.optionProps` · `Lightbox.stageProps` · `DataGrid.scrollerProps` ·
`Toast.regionProps` · `CardComplex.descriptionProps` (además pasa de `BoxSlotProps` a `TextSlotProps`,
que es lo que le tocaba).

**El tipo se corrige** cuando el nodo no puede ir por `Box`:

- Las cuatro superficies flotantes —`Select`, `MultiSelect`, `ColorPicker`, `DatePicker`— son un
  `OverlayMotion` (un `m.div`). Estrenan `OverlayMotionSlotProps`, que es su propio contrato menos lo
  que el componente gobierna.
- `Breadcrumbs.linkProps` y `Footer` (marca) son elementos polimórficos crudos → `ComponentPropsWithoutRef<"a">`.
  El de `Footer` estaba tipado con **`MarkProps`**, las props del componente `Mark` que pinta `<mark>`:
  colisión de nombre con la variable local `Mark`.
- `Form.titleProps` → `TitleSlotProps` y `Feature.linkProps` → `AnchorSlotProps`. Es el caso que
  ADR-104 documenta en «Por qué `TextSlotProps` y no `TextProps`»: el tipo polimórfico fija
  `component` y la ranura no podía cambiar el elemento.

## 7 · Los compounds nuevos (ADR-111)

Cuatro defectos, los cuatro con test de reproducción y arreglados:

1. **`Section.Aside` se tragaba sus hijos.** Estaba en `REGIONS`, así que se extraía a `parts.aside`
   — y `parts.aside` no se renderizaba en ninguna rama. `<Section.Aside>x</Section.Aside>` no llegaba
   al DOM.
2. **`Section.Aside` no tenía clase**: un `Box` con `cx(sprinkle_class, className)` y nada más.
3. **`aria-labelledby` colgando** en los dos. Bastaba un `<Hero.Header>` sin `<Hero.Title>` dentro
   para que la región apuntase a un `id` inexistente. En `Section`, además, ignoraba el `aria-label`.
   Resuelto detectando la parte `Title` en el subárbol (`utils/children.ts`).
4. **El camino de props y el de partes no daban el mismo DOM** para `aside`. Ahora la rama de props
   delega en la parte, como ya hacía `Hero`, y hay **test de paridad DOM en los dos compounds**.

Verificado además en el `dist`, no en el fuente: importar solo `SectionTitle` da **133 kB** frente a
los 200 kB del compound entero, sin `SplitChildren` ni `useReveal`. El `/* @__PURE__ */` funciona.

## 8 · El cuaderno del barrido

Auditado con script contra el código. Ver la sección «Revisión previa a W5» en
[`wn-n3-barrido-ranuras.md`](wn-n3-barrido-ranuras.md): dos razones de descarte eran falsas
(`Tooltip` y `Popover`), faltan cuatro filas de componentes que sí tienen ranuras, y veinte filas
dicen «hecho» a secas siendo parciales.

De ahí salió un defecto real: **las partes de `Card` eran las únicas del catálogo sin style props ni
reenvío de atributos** —solo aceptaban `className`—, lo que hacía falsa la razón del descarte.
`CardSlotProps` extiende ahora `StyleProps` y las tres partes reenvían el resto. Es aditivo.

## Lo que NO se hizo, y por qué

### Los nombres incoherentes entre hermanos (13)

Decisión del propietario: **el vocabulario se congela**. Renombrar una ranura es breaking y esta era
la última ventana; queda anotado para que la decisión sea consciente y no un olvido.

| Dónde                             | Qué                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `GlobalSearch`                    | `optionBody/optionTitle/optionDescription` donde `Menu` y `CommandPalette` usan el contrato común `body/label/description` |
| `MultiSelect`                     | `chipProps`/`chipLabelProps` donde `Tag` y `TagsInput` usan `tag*`              |
| `GlobalSearch`                    | `statusProps` donde otros ocho usan `emptyProps`                                |
| `GlobalSearch` vs `CommandPalette`| `searchRowProps` vs `inputRowProps`, mismo nodo                                  |
| `GlobalSearch`                    | `iconProps` cae a la vez sobre la lupa y sobre el icono de cada resultado; `CommandPalette` los separa |
| `Kanban`                          | `headerProps` (columna) y `headProps` (tarjeta) en el mismo archivo             |
| `Dialog` vs `Modal`               | `headProps` vs `headerProps`                                                     |
| `CardComplex`                     | `headerProps` y `footProps` en el mismo tipo                                     |
| `Nav.Sidebar`                     | `headProps` y `footerProps` en el mismo tipo                                     |
| `TransferList` vs `MultiSelect`   | `searchProps` cae sobre un `Box` en uno y sobre el `<input>` en el otro          |
| `AppShellHeader` / `Form.Header`  | `contentProps` y `headerTextProps` para el nodo que `Header`/`Modal`/`CardComplex` llaman `headingProps` |
| `Calendar`                        | `headingProps` es el `h2` aquí y el envoltorio en los otros tres                |

## Lo que queda pendiente

1. **El generador de fichas de API asume un componente por directorio**, así que **18 componentes
   públicos saldrían sin ficha**: los 10 de `Charts`, los 4 de `DragDrop`, los 3 de `Kanban` y
   `ToastProvider`. Los 6 `noContract` que declara no son contratos que falten: cinco son directorios
   de familia y el sexto es `Toast`, cuyo componente se llama `ToastProvider`. `DateRangePickerProps`
   vive en `DatePicker.types.ts` y `DateTimePickerProps` en el propio `.tsx`.
2. **`@default`**: **40 props en 27 archivos** tienen un valor por defecto que el generador no puede
   leer porque no es un literal en la desestructuración. Medidos y listados. Además, **7 componentes
   entran en `defaultUnknown` solo porque su desestructuración está en una línea** —`ButtonClose`,
   `Conditional`, `DateTimePicker`, `Drawer`, `FocusTrap`, `Omit`, `Valid`—, que es un fallo del
   lector, no del código.
3. **37 ranuras sin una línea de JSDoc**: son las de los **siete componentes del primer lote de
   ADR-104** —`Header`, `Alert`, `EmptyState`, `EmptyModule`, `Stat`, `Feature`, `Blockquote`—,
   convertidos antes de que ADR-105 fijara que cada ranura se documenta al añadirla. `Header` es el
   caso más caro: `rowProps`, `leadProps`, `trailProps` y `bodyProps` son vocabulario que no se
   entiende desde fuera.
4. Las veinte filas parciales del cuaderno, con su razón por nodo.
5. `Card.glass` contra ADR-078 y `DataGrid.selectionOnly` a través de páginas.

## Deuda anotada, no urgente

- **Cuatro compounds guardan sus partes en el archivo del padre** en vez de en `<Padre>/components/`,
  que es lo que fija ADR-097 §2: `Card`, `Footer`, `Form` y `Table`. Es un movimiento de archivos sin
  cambio de comportamiento.
- **El patrón `{...slotProps} className={cx(base, slotProps?.className)}` aparece 371 veces.** No se
  extrajo: cualquier envoltorio esconde el orden del esparcido, que es justo lo que el gate de
  ADR-106 lee sintácticamente.
