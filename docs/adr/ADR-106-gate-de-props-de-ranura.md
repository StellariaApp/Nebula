# ADR-106 — Gate de props de ranura

- **Estado**: aceptada · 2026-08-07 (decisión del propietario al revisar el barrido) · **WN**
- **Cambia API pública**: no. Añade un gate de CI y un script (`pnpm check:slots`).
- Verifica lo que [ADR-098](ADR-098-props-de-ranura.md) §«El orden del esparcido decide quién gana» y
  [ADR-104](ADR-104-la-ranura-se-tipa-con-el-componente-que-la-pinta.md) dejaron escrito.

## Contexto

Una prop de ranura tiene dos formas de estar mal que **ninguna herramienta del repo veía**:

1. **`className` antes del esparcido.** ADR-098 fija el orden `{...slotProps}` primero y
   `className={cx(...)}` después. Al revés, el esparcido pisa la clase compuesta y un consumidor
   que solo quería **añadir** una clase se queda sin el componente pintado. Compila, pasa lint y
   pasa los tests: el fallo solo se ve mirando el DOM con esa prop puesta.
2. **La ranura declarada y nunca esparcida.** El `<nodo>Props` existe en el `.types.ts`, sale en el
   autocompletado del consumidor, y el `.tsx` no lo lleva a ningún nodo —o lo lleva a medias, solo
   el `className`—. El tipo promete algo que el runtime no cumple.

Los dos son invisibles a `tsc` porque el tipo es correcto en ambos casos; lo que está mal es **dónde
acaba el valor**. El barrido de N3 los encontró **tres veces en componentes ya marcados como
hechos**: `Accordion` y `Breadcrumbs` (orden) y `CardComplex.mediaActionsProps` (declarada y solo
usada su `className`). Con 154 componentes y ~90 filas por barrer, la tasa dice que habrá más.

## Decisión

**`tools/check-slots.mjs` es un gate**, con task de turbo `check:slots` y `pnpm check:slots` en la
raíz, al lado de `check:contrast`. Sale con código 1 si encuentra algo.

Comprueba dos cosas sobre `packages/web/src`:

- por cada apertura de elemento JSX, que no haya `className=` antes de un `{...<algo>Props}`;
- por cada miembro `<nodo>Props` de un `.types.ts`, que aparezca esparcido en algún `.tsx` del
  componente —directo, a través de un objeto de ranuras (`{...slots.iconProps}`, como `Menu`), en
  forma abreviada (`{...(x === undefined ? {} : { iconProps })}`, como `EmptyModule`) o reenviado
  como prop a una parte interna.

Lee **fuente, no `dist`**, así que no depende de `build` y corre en ~1,5 s.

### Por qué no una regla de ESLint

Sería el sitio natural, pero costaría un plugin propio en el workspace y la contingencia de ADR-012
—`typescript-eslint` pineado a TS 5.9 mientras los paquetes compilan con TS 7— hace caro añadir
reglas con tipos. El chequeo no necesita el type-checker: las dos comprobaciones son sintácticas.
Si la contingencia se levanta, esto se reevalúa.

### Por qué no falla por el `style`

Se consideró exigir también que un nodo con `style` calculado no lleve ranura. Es una decisión de
juicio —el barrido la toma caso por caso y la anota en el cuaderno—, y una regla automática la
convertiría en dogma justo donde hace falta criterio.

## Consecuencias

- Sustituye a `tools/check-slot-order.mjs`, que tenía la raíz del repo escrita a mano en una
  constante y siempre salía con código 0, así que no podía ser gate.
- Validado contra el árbol de `987f31b`: encuentra los tres bugs y sale 1. Sobre `main` sale 0.
- Cubre solo `packages/web`. `packages/native` no tiene props de ranura todavía; cuando las tenga,
  el mismo script sirve pasándole otra raíz.
