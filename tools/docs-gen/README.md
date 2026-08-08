# nebula-tools-docs-gen

Genera lo que el sitio de documentación **no debe escribir a mano**. Hoy produce un artefacto; DS1.3
añade los otros tres (referencia de API desde el `.d.ts`, página de style props y metadatos por
componente).

```bash
pnpm gen:docs     # escribe apps/docs/generated/*.json
pnpm check:docs   # falla si lo generado no coincide con el comprometido
```

## `catalog.json` — el registro del catálogo

Una entrada por **directorio** de `packages/web/src/components`. Son 158, que es el número del
catálogo cerrado: 156 tienen `.types.ts` propio y dos —`DateRangePicker` y `DateTimePicker`— reusan
el contrato de `DatePicker`.

| Campo      | De dónde sale                                             |
| ---------- | --------------------------------------------------------- |
| `family`   | los encabezados `### 1.x` de `docs/00-inventory.md`       |
| `subpath`  | qué barrel lo reexporta (`.` o uno de los siete subpaths) |
| `compound` | si su `index.ts` compone con `Object.assign` (ADR-097)    |
| `parts`    | las claves de ese `Object.assign`                         |
| `boundary` | si algún `.tsx` del directorio abre con `"use client"`    |
| `budget`   | el `limit` de su entrada en `packages/web/.size-limit.js` |
| `notes`    | si existe `<Nombre>.md`                                   |
| `contract` | si existe `<Nombre>.types.ts`                             |

**El gate es de cobertura**: si un componente existe en el código y no en el registro comprometido,
`check:docs` falla. Es el criterio del censo de WR1 — ninguna fila sin rastro.

## Huecos declarados, nunca inventados

Lo que el generador no puede determinar sale en `gaps` del propio JSON y se imprime al correr. Hoy:
**`DataGrid` no tiene entrada en `.size-limit.js`**, así que su presupuesto es `null`.

## Por qué hay una tabla de alias

El inventario nombra filas, no directorios, y las dos cosas no siempre coinciden. La mayoría se
resuelve partiendo la celda por `/`, `+`, `,` y `y` (`Anchor / Link`, `Calendar / MonthPicker /
YearPicker`). Siete no, y se declaran a mano en `FAMILY_OVERRIDES` porque adivinarlos sería inventar:

| Componente       | Familia                   | Por qué no sale del inventario                              |
| ---------------- | ------------------------- | ----------------------------------------------------------- |
| `ButtonGroup`    | Buttons & Actions         | la fila es `Button (+Group)`; el paréntesis no es un nombre |
| `Charts`         | Charts                    | el directorio **es** la familia §1.12, no una de sus filas  |
| `DragDrop`       | Drag & Drop               | la fila lista sus partes, no el directorio                  |
| `Kanban`         | Drag & Drop               | ídem                                                        |
| `MeshGradientBg` | Effects / Glass / Shaders | el inventario lo llama `MeshGradient`                       |
| `Footer`         | Foundation / Layout       | entró por **ADR-070**, posterior al cierre del inventario   |
| `FieldError`     | Inputs & Forms            | no tiene fila: es parte del contrato de campo               |

Cuando `docs/00-inventory.md` se actualice con esas filas, la tabla se vacía sola.
