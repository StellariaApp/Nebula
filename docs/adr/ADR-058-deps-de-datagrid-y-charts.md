# ADR-058 — Dependencias de DataGrid y charts, y lo que cuestan de verdad

- **Estado**: **aceptada** · 2026-07-30 (W3.4.3 y W3.4.4)
- **Cumple**: ADR-014 regla 6 (toda dependencia nueva post-scaffold requiere mini-ADR) y regla 2
  (fila en la tabla de `docs/01` §8 con justificación, alternativa y coste).
- **Ejecuta**: ADR-011 (motor de charts) y la fila `DataGrid` de `docs/00-inventory.md` §1.6.

## Decisión

Tres dependencias de runtime en `@stellaria/nebula-web`, las tres **aisladas en subpath** (ADR-014
regla 3) y ninguna alcanzable desde `dist/index.js`:

| Dependencia               | Versión | Subpath     | Motivo                                                                      |
| ------------------------- | ------- | ----------- | --------------------------------------------------------------------------- |
| `@tanstack/react-table`   | 8.21.3  | `/datagrid` | motor headless de tabla: sorting, selección, paginación; la UI es de Nebula |
| `@tanstack/react-virtual` | 3.14.9  | `/datagrid` | virtualización ≥50 filas que exige el gate de W3                            |
| `recharts`                | 3.10.1  | `/charts`   | fijado por ADR-011                                                          |

## Coste medido, no estimado

Un `BarChart` mínimo de Recharts —grid, ejes, tooltip y una serie— pesa **91,28 kB brotli**. Es más
que la banda más alta que tiene hoy `docs/03` §3 (compuestos de fecha ≤90 kB) y **más que toda la
cadena de fechas junta**.

La razón está en el árbol de `recharts@3.10.1`, que no es solo d3:

```
recharts
├── @reduxjs/toolkit + react-redux + reselect + immer   ← store interno
├── victory-vendor                                      ← módulos de d3
├── es-toolkit · clsx · eventemitter3 · decimal.js-light
└── tiny-invariant · use-sync-external-store
```

Recharts 3 mantiene su estado interno con **Redux**. Un consumidor que importe un solo chart carga
Redux completo, aunque su aplicación no lo use.

**No se reabre ADR-011 en este ADR**: es una decisión cerrada y la regla de `CLAUDE.md` es que los
docs cerrados prevalecen. Lo que sí se hace es dejar el número escrito donde se pueda encontrar, y
ejecutar al pie de la letra la consecuencia que ADR-011 ya anticipó: **`SparkLine` y `TrendIndicator`
no usan Recharts**, se dibujan con SVG propio, porque son los dos que aparecen dentro de tablas y
tarjetas —en colección— y arrastrar 91 kB para pintar una línea de 40 px no tiene defensa.

`@tanstack/react-table` es lo contrario y conviene decirlo: **una sola dependencia transitiva**
(`@tanstack/table-core`), sin runtime de estado propio. Es headless de verdad.

## Alternativas

- **Charts propios sobre SVG**: control total y coste mínimo, meses de trabajo en escalas, ejes,
  ticks y tooltips. Ya evaluada y rechazada en ADR-011.
- **DataGrid sobre `<table>` propia sin TanStack**: la tabla ya existe (W3.3 bloque B); lo que no
  existe es el modelo de sorting/selección/paginación/column sizing, que es justo lo que
  `table-core` aporta sin imponer DOM. Rechazada por reescribir un motor probado.
- **Virtualización propia con `IntersectionObserver`**: sirve para una lista simple —es lo que hace
  `InfiniteList`—, pero no para filas de altura variable con scroll bidireccional. Rechazada.

## Consecuencias

- **El bundle base no se toca.** Verificado tras la ejecución: `dist/index.js` no menciona
  `DataGrid`, `BarChart` ni ninguna de las tres dependencias, y las entradas de size-limit de los
  subpaths lo miden por separado.
- **Los charts pesados quedan en una banda propia**, `charts ≤130 kB`, que se añade a `docs/03` §3.
  Ninguna banda existente los cubría y no tiene sentido meterlos en `patterns ≤70`.
- **`SparkLine` y `TrendIndicator` tienen budget de primitivo** porque no tocan Recharts: es la
  comprobación de que la separación que ADR-011 pedía se cumple de verdad, no solo sobre el papel.
- **La API pública es de Nebula** (ADR-011): `data/series/axes/tooltip/legend` + theming por tokens.
  Cambiar de motor más adelante —si el coste de Redux acaba pesando— no rompe consumidores, que es
  exactamente la propiedad por la que ADR-011 eligió envolver en vez de reexportar.
- **`react-is` es peer de recharts** y lo resuelve el árbol de React; no se declara aparte.
