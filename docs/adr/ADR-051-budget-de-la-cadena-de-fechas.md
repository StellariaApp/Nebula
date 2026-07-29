# ADR-051 — Banda de budget para los compuestos de fecha (≤90 kB) y sinceramiento de la banda de colección

- **Estado**: aceptada · 2026-07-29 (checkpoint de W3.1)
- **Renumerada**: nació como ADR-048 en la sesión de W3.1 y colisionó con ADR-048 (`surface.disabled`,
  `text.disabled` y `border.disabled`), que aterrizó antes en `main`. El número lo fija el orden de
  llegada.
- **Enmienda**: `docs/03-a11y-motion-performance.md` §3 (tabla de budgets).
- **Precedentes**: ADR-022 (primitivos temables en runtime), ADR-039 (primitivos con variantes), ADR-032 §6–§7 (sesgo de la hoja atómica).

## Contexto

W3.1 midió la cadena de fechas con `size-limit` por módulo, brotli, tras `pnpm build`:

| Módulo                          | Medido   |
| ------------------------------- | -------- |
| YearPicker                      | 19,81 kB |
| MonthPicker                     | 20,64 kB |
| RangeCalendar                   | 42,39 kB |
| Calendar                        | 42,62 kB |
| TimeInput                       | 58,28 kB |
| DatePickerInput                 | 70,19 kB |
| DateTimePicker                  | 84,17 kB |
| DatePicker                      | 84,20 kB |
| DateRangePicker                 | 84,89 kB |

La tabla de `docs/03` §3 declara **compuestos ≤48 kB** y **patterns ≤70 kB**. Tres de los nueve
módulos exceden la banda superior en ~21 %.

**La banda de 48 kB ya estaba desfasada antes de W3.** El cierre de W2 dejó Select en 67, Combobox en
74, MultiSelect en 75 y Menu en 58 kB, todos con budget propio por entrada y todos por encima de
«compuestos ≤48». La banda no se aplicaba a la clase de componente más pesada del catálogo; se
sostenía como número escrito, no como gate.

**De dónde sale el coste.** DatePicker parte del suelo de un campo (FormField + `motion` vía
FieldError, ~25 kB), suma la maquinaria de `react-stately` para picker + campo segmentado + calendario,
y suma `@internationalized/date` (~14 kB) con su aritmética de calendarios y su formateador por
locale. Ninguna de las tres partes es opcional si el motor es React Aria (ADR-003) y el contrato a11y
de `docs/03` §1 exige el patrón APG completo de grid de fechas con navegación por teclado.

## Decisión

1. **Se añade la banda `compuestos de fecha ≤90 kB`**, con las nueve entradas medidas arriba y
   headroom sobre el máximo real (DateRangePicker 84,89).

2. **Se sincera la banda de colección**: `compuestos de colección ≤80 kB` recoge Select, Combobox,
   MultiSelect y Menu, que llevaban desde W2 con budget individual y ninguna banda que los cubriera.
   No es una subida: es escribir el número que el gate ya venía aplicando por entrada.

3. **`compuestos ≤48 kB` se mantiene** para el resto —Card, Alert, Modal, Drawer, Progress…—, que sí
   caben. La banda deja de ser un techo universal y pasa a ser explícitamente **por clase de
   componente**, que es como funcionaba de facto desde ADR-022.

4. **La cadena de fechas NO se aísla en un subpath.** ADR-014 regla 3 reserva los subpaths para
   dependencias pesadas de features opcionales —charts, dnd, editor, datagrid—, que un producto puede
   no usar nunca. Un campo de fecha es un input de formulario corriente: `fonicredito` ya tiene
   `InputCalendar` en producción y `docs/00-inventory.md` §1.4 lo clasifica junto a TextInput y Select,
   no junto a charts. Meterlo tras `@stellaria/nebula-web/dates` cobraría fricción de import a todos
   los consumidores para ahorrar bytes solo a quien no use fechas, que es el caso raro.

5. **MonthPicker y YearPicker no pagan la cadena** (19,8 y 20,6 kB) porque están construidos sobre
   grid propia con roving focus, sin `useCalendar` ni `@internationalized/date`. Es la evidencia de que
   el coste es de la maquinaria de calendario, no de la clase «picker», y queda como referencia para
   futuros selectores de periodo.

## Alternativas

- **Subpath `@stellaria/nebula-web/dates`**: es la letra literal de ADR-014 regla 3 y deja el entry
  principal intacto. Rechazada por el punto 4: convierte un input de formulario en una feature
  opcional, y el ahorro solo lo cobra quien no usa fechas.
- **Lazy-load del calendario con `import()` al abrir el popover**: recorta ~42 de los 84 kB del primer
  render. Rechazada por ahora: mete una frontera de Suspense dentro del componente, introduce un salto
  perceptible en la primera apertura y complica el testing contract de ADR-015. Se puede reconsiderar
  con ADR propio si el peso llega a doler en un consumidor real; el patrón de subpath ya existente lo
  hace reversible.
- **No medir la cadena por módulo**: rechazada. Es el sesgo que ADR-032 §6 ya identificó y corrigió;
  la medición por módulo es la que representa a quien importa un componente suelto.

## Consecuencias

- **`docs/03` §3 gana dos bandas** y la nota de que los budgets son por clase de componente.
- **Ningún componente existente cambia de budget.** Select, Combobox, MultiSelect y Menu conservan sus
  números; lo que cambia es que ahora hay una banda que los explica.
- **El gate sigue siendo verde y sigue mordiendo**: las nueve entradas tienen límite propio con
  headroom medido, de modo que una regresión futura en la cadena de fechas se detecta igual.
- **Queda registrado el techo real de la librería**: ningún módulo del catálogo debería superar
  90 kB sin un ADR que lo justifique, y el candidato natural a romperlo (DataGrid, W3.4) nace ya
  aislado en subpath.
