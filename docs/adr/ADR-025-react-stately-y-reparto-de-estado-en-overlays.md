# ADR-025 — `react-stately` como capa de estado de los hooks de React Aria, y su reparto con Jotai

- **Estado**: aceptada · 2026-07-24 (checkpoint W2.4 con el propietario)
- **Contexto**: W2.4 aterriza la zona de mayor riesgo a11y del proyecto (docs/05 riesgo 3): overlays (Popover, Tooltip, Modal, Drawer, Menu/ContextMenu) y colecciones (Combobox, Select, MultiSelect). ADR-003 fijó los hooks de React Aria como motor de comportamiento, pero solo declaró `react-aria`. React Aria está partido en tres capas y la del medio —el estado— vive en un paquete aparte, `react-stately`, que los hooks exigen **como argumento obligatorio**:

```ts
useSelect(props, state: SelectState<T, M>, ref)
useListBox(props, state: ListState<T>, ref)
useComboBox(props, state: ComboBoxState<T, M>)
useMenu(props, state: TreeState<T>, ref)
usePopover / useOverlayTrigger / useModalOverlay(props, state: OverlayTriggerState, …)
```

## El peso del estado no es uniforme

**Overlays** — el contrato completo es trivial y sí sería sustituible por atoms:

```ts
interface OverlayTriggerState {
  readonly isOpen: boolean;
  setOpen(isOpen: boolean): void;
  open(): void;
  close(): void;
  toggle(): void;
}
```

**Colecciones** — no es estado, es lógica:

```ts
interface ListState<T> {
  collection: Collection<Node<T>>;
  disabledKeys: Set<Key>;
  selectionManager: SelectionManager;
}
```

`SelectionManager` es una clase con ~30 miembros (`extendSelection`, `toggleSelection`, `getKeyRange`, `selectionBehavior`, `childFocusStrategy`, `disabledBehavior`, `firstSelectedKey`…) cuyos métodos **invocan los propios hooks de aria** al procesar el teclado. Un atom puede guardar valores; no puede ser un `SelectionManager`. Sustituirlo obliga a reescribir el constructor de colección (secciones + `textValue` para type-ahead), la gestión de selección (ancla para rangos con Shift, semántica toggle-vs-replace, salto de deshabilitados) y el keyboard delegate (wrap, PageUp/Down, Home/End, buffer de type-ahead) — exactamente la superficie APG que ADR-003 existe para no reescribir.

## Decisión

1. `react-stately` (3.48, mismo release train y licencia —Apache-2.0— que `react-aria` 3.50, tree-shakeable por hook) se declara como dependencia de runtime de `@stellaria/nebula-web`. Ya estaba en el árbol de forma transitiva: declararlo no añade peso, lo hace resoluble bajo el aislamiento estricto de pnpm.
2. **Reparto de responsabilidades**:
   - `react-stately` gobierna el estado **interno de un widget**: colección, selección, foco, abierto/cerrado de esa instancia.
   - React Aria gobierna el **apilado**: `useOverlay` mantiene su propia lista `visibleOverlays` y entrega `Esc` y el click-outside únicamente al overlay del tope; `usePreventScroll` resuelve el scroll-lock (incluidas las particularidades de iOS). No se reimplementa ninguna de las dos cosas.
   - Jotai (ADR-010) gobierna solo lo que ninguna de las dos cubre: el **registro por id**, que permite abrir o cerrar un overlay desde cualquier punto del árbol sin prop-drilling (`nebulaOverlays.open(id)` / `useOverlayState(id)`).
3. Se usa `useOverlayTriggerState` también en los overlays, pese a ser trivial: al estar el paquete ya declarado por las colecciones, evita dos fuentes de verdad para "abierto/cerrado" y elimina el adaptador en cada hook de aria. El registro por id de Jotai envuelve ese estado, no lo sustituye.
4. **`Button`, `UnstyledButton` y `ActionIcon` amplían su API** para reenviar a `useButton` el ciclo completo de press de React Aria (`onPressStart`, `onPressEnd`, `onPressUp`, `onPressChange`, `preventFocusOnPress`), no solo `onPress`. Se centraliza en `utils/press-props.ts`.

   Es un cambio aditivo y obligado: `useMenuTrigger` abre desde `onPressStart`, de modo que sin este reenvío **ningún trigger de overlay funciona**. Afecta igual a Select y Combobox en la Parte 2. Completa el espíritu de la plantilla canónica ("los handlers del consumidor se entregan A React Aria"), que hasta ahora solo contemplaba `onPress`.

## Alternativas

- **Capa de estado propia para las colecciones**: cero dependencia nueva, pero reescribe la lógica APG comprada en ADR-003 y reintroduce el riesgo 3 en cinco componentes. Rechazada.
- **Jotai en overlays y `react-stately` solo en colecciones**: reduce la superficie de la dependencia, a cambio de dos fuentes de verdad para el mismo booleano y de un adaptador por hook. Rechazada por coste/beneficio.

## Consecuencias

- Fila nueva en `docs/01-architecture.md` §8 (`react-stately`), en el mismo PR.
- Ratifica y acota la nota de ADR-010: "los overlays por id se re-implementan sobre atom-family interna con API pública imperativa". Esa atom-family es el registro por id de este ADR — y **solo** eso: al verificar la implementación de `useOverlay` se confirmó que el apilado y el enrutado de `Esc` ya existen en React Aria, de modo que llevarlos a Jotai habría creado una segunda fuente de verdad sin ganancia.
- `jotai` pasa a ser dependencia declarada de `@stellaria/nebula-web` (ya aprobada por ADR-010 y presente en la tabla de §8; no requiere ADR propio).
- **Budgets medidos de la clase overlay** (brotli por módulo), calibrados al aterrizar la primera tanda como manda el precedente de ADR-018/ADR-022:

  | Componente | Medido | Límite | Composición |
  | --- | --- | --- | --- |
  | Registro de overlays | 3,4 | 6 | jotai |
  | Tooltip | 22,5 | 28 | aria tooltip + posicionamiento |
  | Popover | 26,2 | 32 | aria overlays + FocusScope |
  | ContextMenu | 35,8 | 42 | aria menu + colección stately |
  | Menu | 41,6 | 48 | + trigger y posicionamiento |
  | Modal · Drawer | 50,1 | 56 | `<dialog>` + useDialog + ButtonClose (arrastra motion) |

  Modal y Drawer superan la banda de compuestos (≤48 kB de docs/03 §3) por el `ButtonClose` de su cabecera, que trae `motion` vía ActionIcon. Se acepta a cambio de que el botón de cierre sea el mismo del sistema; la alternativa sería un botón ad-hoc sin motion, que rompería la coherencia visual por ~4 kB.

- **Budgets medidos de la clase colección** (parte 2 de W2.4):

  | Componente | Medido | Límite |
  | --- | --- | --- |
  | Select | 75,1 | 84 |
  | Combobox | 81,5 | 90 |
  | MultiSelect | 81,9 | 90 |

  Son los módulos más pesados del catálogo y exceden incluso la banda de patterns (≤70 kB). El desglose lo explica: parten del **baseline de un input de formulario** (≈48 kB: FormField → FieldError → Transition → `motion`, más React Aria) y le suman la maquinaria de colección de react-stately (construcción de colección, `SelectionManager` y keyboard delegate, ≈27–33 kB). Ninguna de las dos mitades es opcional sin renunciar a una decisión ya cerrada: el error como burbuja animada (W2.3/W2.4) o la conformidad APG (ADR-003). Se registra la banda **colección ≤90 kB** y se revisará si aparece una vía de carga diferida para los patrones de §1.5.

- Las entradas de barrel suben por la misma razón —el índice ahora alcanza el registro de overlays, y con él jotai—: `useTheme` de 11 a 13 kB y `NebulaProvider` de 18 a 20 kB.

- **El gate a11y se corrige en este mismo PR**: `checkA11y` estaba acotado a `#storybook-root`, pero todos los overlays se renderizan en un portal fuera de ese nodo, así que axe nunca auditaba el contenido abierto. Pasa a auditar `body`. Al hacerlo aflora una violación real que el gate anterior no veía (contraste 1.02:1 del atajo de teclado sobre una fila de menú enfocada), corregida en `Menu.css.ts`. Verificado revirtiendo el fix: con el scope nuevo el gate falla; con el antiguo pasaba en verde.
- La plantilla canónica (`docs/patterns/web-component-template.md` §2, capa 1) se actualiza en el mismo PR para que el contrato de las acciones incluya el ciclo de press completo.
- `useMenuTrigger` no abre con `Enter`/`Space` sobre un `useButton` plano (su rama de teclado se salta el evento cuando ya trae `preventDefault`, y sus handlers de press excluyen `pointerType: "keyboard"`). React Aria lo reconoce en su código y lo resuelve con `PressResponder`, que aquí no aplica porque su `Pressable` solo acepta elementos DOM. `Menu` compone su propio `onPress` para cubrirlo; queda documentado en `Menu.md`.
