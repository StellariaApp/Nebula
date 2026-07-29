# ADR-047 — El valor público de los componentes de fecha es un string ISO; `@internationalized/date` queda dentro

- **Estado**: aceptada · 2026-07-29 (checkpoint de apertura de W3.1)
- **Enmienda**: `docs/00-inventory.md` §1.4 y `docs/01-architecture.md` §8 (tabla de dependencias).
- **Requiere**: ADR-014 regla 6 (toda dependencia nueva post-scaffold necesita mini-ADR).

## Contexto

W3.1 entrega ocho componentes de fecha (`Calendar`, `DatePicker`, `DatePickerInput`,
`DateRangePicker`, `DateTimePicker`, `TimeInput`, `MonthPicker`, `YearPicker`). Los tres primeros son
`WN` en el inventario: su API pública es contrato compartido con `packages/native`.

El motor obligatorio es React Aria (ADR-003): `useCalendar`, `useDatePicker`, `useDateRangePicker`,
`useDateField`, `useTimeField`, con sus estados de `react-stately`. Todos hablan `DateValue`
—`CalendarDate`, `CalendarDateTime`, `ZonedDateTime`— de `@internationalized/date`.

**La dependencia ya está instalada**: `@internationalized/date@3.12.2` entra como transitiva de
`react-aria` y `react-stately`, que ya son dependencias directas de `packages/web`. La decisión no es
si se paga, sino si además se expone.

## Decisión

1. **`@internationalized/date` pasa a dependencia directa de `packages/web`** (`^3.12.2`, la versión
   que ya resuelve el lockfile). Se declara porque el código la importa; seguir consumiéndola de
   rebote a través de `react-aria` es depender de un detalle de resolución de pnpm.

2. **La API pública no la menciona.** `value`, `defaultValue` y `onChange` de todos los componentes de
   fecha son **strings ISO 8601**:

   | Componente                        | Formato               | Ejemplo                |
   | --------------------------------- | --------------------- | ---------------------- |
   | `DatePicker`, `Calendar`, `DatePickerInput` | `YYYY-MM-DD`  | `"2026-07-29"`         |
   | `TimeInput`                       | `HH:mm` / `HH:mm:ss`  | `"14:30"`              |
   | `DateTimePicker`                  | `YYYY-MM-DDTHH:mm`    | `"2026-07-29T14:30"`   |
   | `MonthPicker`                     | `YYYY-MM`             | `"2026-07"`            |
   | `YearPicker`                      | `YYYY`                | `"2026"`               |
   | `DateRangePicker`                 | `DateRange` de tokens | `{ start, end }` de `YYYY-MM-DD` |

   El valor vacío es `""` (y `{ start: "", end: "" }` en el rango), coherente con `Select`, que ya usa
   `""` como «sin selección». `DateRange` vive en `@stellaria/nebula-tokens`
   (`src/types/fields.ts`) porque es forma compartida W/N; los strings no necesitan tipo propio.

3. **La conversión vive en `packages/web/src/utils/date.ts`**, un único módulo con `ParseDate`,
   `ParseDateTime`, `ParseTime`, `FormatDate`, `FormatTime`, `FormatDateTime`, `TodayDate`,
   `EmptyRange` e `IsEmptyRange`. Ningún componente llama a `parseDate` directamente.

4. **Parsear nunca lanza.** `parseDate("29/07/2026")` tira una excepción, y un valor malformado llega
   desde datos de servidor o desde un `field` de form-atoms con la misma facilidad que desde el
   teclado. Los `Parse*` validan con una regexp antes y devuelven `null` ante cualquier entrada que no
   sea del formato exacto, de modo que un valor sucio degrada a «campo vacío» en vez de romper el
   render del árbol entero.

5. **Sin zonas horarias en el contrato.** `ZonedDateTime` no aparece: una fecha de alta o de
   vencimiento es civil, no un instante. Un producto que necesite instantes compone el string con su
   propia zona en la capa de aplicación; ADR futuro si aparece demanda real.

## Alternativas

- **Exponer `DateValue`**: es lo que hace React Aria y da fidelidad total (calendarios no gregorianos,
  aritmética sin bugs de DST). Rechazada por tres costes concretos. (a) El consumidor tiene que
  instalar e importar `@internationalized/date` para construir un valor, lo que convierte una
  transitiva en API pública y ata la versión de Nebula a la suya. (b) `packages/native` heredaría la
  misma obligación para cumplir el contrato `WN`, decidida hoy y sin haber escrito todavía un solo
  campo native. (c) Un `CalendarDate` no es serializable: no sobrevive a `JSON.stringify`, a un
  `localStorage`, ni a un `z.string().date()` de Zod, que es exactamente el camino que recorre un
  valor de formulario en las apps consumidoras.
- **`Date` nativo de JS**: rechazada. Un `Date` es siempre un instante con zona, de modo que una fecha
  sin hora obliga a un convenio (¿medianoche UTC o local?) que produce off-by-one según el huso del
  usuario — `new Date("2026-07-29")` se muestra como 28/07 en UTC-6. Es el bug clásico de esta clase
  de componente y no hay forma de que el design system lo evite por el consumidor.
- **Tipos branded** (`IsoDate = string & { __iso: true }`): rechazada. El valor entra desde red,
  formulario y URL; el brand se perdería en el primer `as` del borde y solo añade fricción sin
  comprobación real.

## Consecuencias

- **Coste de bundle acotado y medido**: el árbol de fechas ya se descargaba con React Aria; la cadena
  completa se reporta en el cierre de W3.1 con `size-limit`.
- **El contrato `WN` se cumple sin tipos web-only**: `packages/native` implementa los mismos strings
  con el motor que prefiera (nativo o `@internationalized/date`), sin que la elección esté forzada por
  la web.
- **`NebulaField<string>` sirve tal cual** para todos los campos de fecha, y `NebulaField<DateRange>`
  para el rango: el sistema de forms de ADR-005 no necesita ningún caso especial.
- **Se pierde el soporte de calendarios no gregorianos en la API**. La UI sí los respeta —
  `useCalendar` sigue formateando según el locale del `NebulaProvider` y la semana arranca donde toca —
  pero el valor que cruza la frontera siempre es gregoriano ISO. Es la única concesión real de esta
  decisión y se documenta aquí para no redescubrirla.
- **`docs/01-architecture.md` §8 gana su fila** con justificación, alternativa evaluada y coste, según
  ADR-014 regla 2.
