# Continuar el barrido de ranuras (WN · N3)

> Prompt de arranque para una sesión limpia. El trabajo va por la tanda 18 de unas 40.
> Estado al 2026-08-07, rama `main`, último commit `128ee0c`.

---

## Pega esto en la sesión nueva

```text
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Continúas el barrido de props de ranura de WN·N3, ya en marcha desde la tanda 1.
NO empieces de cero y NO redefinas el criterio: está decidido y escrito.

LEE EN ESTE ORDEN, ANTES DE TOCAR NADA
  1. CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. docs/reviews/wn-n3-barrido-ranuras.md — EL CUADERNO. Trae el criterio y la
     tabla con el estado de los 154 componentes. El estado vive ahí, no en tu
     memoria ni en este prompt.
  3. docs/adr/ADR-104 — cómo se tipa una ranura.
  4. docs/adr/ADR-098 — el patrón original que ADR-104 enmienda.
  5. docs/adr/ADR-105 — el JSDoc de API pública sí se escribe.
  6. docs/adr/ADR-103 — de dónde salen las style props (contexto).

CÓMO VA UNA TANDA
  - 2 a 5 componentes, elegidos del cuaderno entre los `pendiente`.
  - Por cada nodo con identidad propia: pasa el nodo a Box/Text si hace falta,
    añade su `<nodo>Props`, y escribe su JSDoc con lo que el tipo NO dice.
  - Gates entre tanda y tanda, SIN excepción:
      set -o pipefail
      pnpm turbo build typecheck lint test --filter=@stellaria/nebula-web --filter=playground-web
      cd packages/web && pnpm run size
  - Si `size` rebasa, sube el tope al valor medido + margen. Es el criterio del
    propietario y no es un checkpoint.
  - Marca las filas en el cuaderno y commitea. UN COMMIT POR TANDA.

REGLAS QUE YA COSTARON UN ERROR — no las reaprendas
  - `git add` SIEMPRE con rutas explícitas. Nunca `git add -A <carpeta>`: el
    propietario trabaja en paralelo y ya se le colaron cambios en un commit mío.
  - El orden es `{...slotProps}` PRIMERO y `className={cx(...)}` DESPUÉS. Al
    revés el esparcido pisa la clase del componente. Hay un chequeo en
    scratchpad/check-slot-order.mjs; si lo pierdes, reescríbelo (30 líneas).
  - Antes de tocar un componente con React Aria, MIRA si el hook ya devuelve un
    nombre que quieres usar. `useDialog`, `useSelect` y `useMenuItem` devuelven
    titleProps / valueProps / labelProps / descriptionProps / keyboardShortcutProps.
    Renombra el de aria a `aria_*` y deja el nombre público para la ranura, y
    espárcelo aria PRIMERO. En Modal, invertirlo dejó al diálogo sin nombre
    accesible y solo lo cazó el test de a11y.
  - `BoxSlotProps` trae manejadores tipados para HTMLDivElement: no compila
    sobre un `<ol>`, `<td>` o `<button>` crudos. O el nodo pasa por Box, o la
    ranura se tipa con `ComponentPropsWithoutRef<"elemento">`. Usa Box cuando la
    ranura sirve a DOS elementos distintos; el tipo del elemento cuando es fijo.
  - El tipo se elige mirando el ELEMENTO, no el rol ARIA. Un
    `<div role="option">` es un div.
  - Toda prop opcional pública lleva `| undefined` (exactOptionalPropertyTypes).

QUÉ SIGUE (los mayores primero; el cuaderno manda)
  Table 8 · Charts/ChartFrame 7 · CommandPalette 7 · Progress 7 · Carousel 6 ·
  CodeHighlight 6 · DataGrid/Toolbar 6 · Nav/components/Links 6

  AppShell y sus partes van juntos y el propietario quiere verlos cuando toque:
  la familia es incoherente entre sí —Content acepta style props, Nav y Aside
  reenvían el resto, y Footer, Subbar y Header se tragan lo que no destructuran—.
  Eso se arregla en la misma tanda, no solo las ranuras.

  Hero y Section esperan a N2: se convierten en compound primero, porque el
  montaje decide dónde caen las ranuras.

EMPIEZA preguntando por cuál tanda seguir solo si el cuaderno no lo deja claro;
si lo deja, arranca.
```

---

## Estado para quien lea esto sin abrir nada

**Barrido**: 46 hechos · 2 descartados · 104 pendientes · 2 esperando a N2, de 154 filas.
Quedan ~234 nodos, techo del detector.

**Antes del barrido se cerró**, y no hay que reabrirlo:

| | |
| --- | --- |
| Gates rojos | El esquema de Zod rechazaba los 4 temas; `.size-limit.js` no podía correr desde N2 |
| ADR-103 | `StyleProps` sale del registro: poda de 40 alias largos, 63 props nuevas, valor abierto y responsive |
| ADR-104 | La ranura se tipa con el componente que la pinta |
| ADR-105 | El JSDoc de API pública no es un comentario |
| Glifos | 42 `<svg>` en 32 archivos → 25 glifos compartidos; la paloma existía en 3 geometrías |
| `ExtractStyleProps` | Reescrito: 3x–11,8x según la forma del nodo |

## Lo que sigue abierto y no es del barrido

- **Montar como gate el chequeo del orden de `className`.** Propuesto, sin
  respuesta. Hoy vive en el scratchpad y se pierde al cerrar la sesión.
- **Cerrar N1**: mover las cuatro `createVar()` privadas de `Scroll` a su
  `.vars.css.ts`. El propietario dijo «se mueven».
- **Cerrar N2**: `Hero` y `Section` a compound. El propietario dijo «confirma».
- **Medición final** y recalibrado de los 194 presupuestos antes de W5.
- Los 86 sombreados de `size`/`order` **no** son un fallo: la prop semántica del
  componente debe ganar sobre la style prop. Comprobado y compila.
