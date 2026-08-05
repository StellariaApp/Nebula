# WN · N5 — Cuaderno de hallazgos

Hallazgos anotados mientras se recorre el catálogo en WN. **No se arreglan sobre la marcha**: se
agrupan por causa y se llevan al propietario por lotes. Un ADR por causa, no por hallazgo.

---

## Abiertos

### H1 · `identifiers: "debug"` mete el nombre de la variable en el bundle de producción

**Dónde**: `packages/web/vite.config.ts:17`
**Causa**: el plugin de vanilla-extract emite clases del tipo `StarField_star_field__1x2y3z`. El
nombre del símbolo viaja al CSS y al JS publicados.
**Qué provoca**:

- La tabla de `.size-limit.js` está calibrada al byte contra nombres concretos. Al pasar a
  `snake_case` (ADR-094) `StarField` se salió por 8 B. Medido tras N0: de 183 entradas, **diez a
  menos de 90 B de su tope** — `Segment` 20 B, `Card` 40 B, `Radio` y `NavLink` 50 B.
- Cualquier renombrado futuro de un asa de clase es un cambio de tamaño.

**Opciones**: `identifiers: mode === "production" ? "short" : "debug"` devolvería margen a las 183
entradas de golpe, a cambio de perder nombres legibles en el CSS publicado. Nebula personaliza por
tema y por props de ranura, no por sobrescritura de clases (ADR-020), así que la legibilidad de la
clase emitida no es parte del contrato.
**Estado**: el propietario fija como criterio **subir el presupuesto cuando haga falta**. El cambio
de `identifiers` queda para decidir aparte; no bloquea WN.

### H2 · Hay tests que afirman sobre nombres de clase generados

**Dónde**: `CardComplex.test.tsx:43` (`[class*='media_actions']`), `Scroll.test.tsx:63`
(`both.includes("both_shadows")`), `CardComplex.test.tsx:52` (`[class*='CardComplex_header']`)
**Causa**: la aserción se apoya en el nombre del símbolo del `.css.ts`, que es detalle de
implementación. Los tres se rompieron en N0 por un renombrado que no cambiaba comportamiento.
**Recomendación**: pasar a `data-*`. El componente ya emite `data-*` para casi todo su estado, así
que la aserción sería más corta y no se rompería nunca por un renombrado. Depende de H1: si
`identifiers` pasa a `"short"`, estos tres tests dejan de funcionar del todo.

### H3 · Comentarios en el código, contra ADR-019 §2

**Dónde**: `AppShell.css.ts:66` y `:158` — dos bloques `/** … */` describiendo el modo carril y qué
desaparece al encoger.
**Causa**: ADR-019 §2 dice que lo que necesite explicación va al `<Nombre>.md` de al lado. El
contenido de los dos comentarios es exactamente eso: un porqué no deducible.
**Recomendación**: moverlos a `AppShell.md`, que ya existe. Barrer el resto del catálogo buscando el
mismo patrón antes de decidir si es un caso aislado.

### H4 · Dos idiomas para importar las vars de un componente

**Dónde**: todo el catálogo.
**Medido**: 99 sitios usan import nombrado (`import { bg, fg } from "./X.vars.css.js"`) y 2 usan
espacio de nombres (`import * as variables from …`).
**Causa**: el prompt de WN fija el namespace como convención de N1, pero la realidad del catálogo es
la contraria por 99 a 2. N0 creó 20 `.vars.css.ts` nuevos siguiendo el idioma mayoritario para no
ampliar la brecha.
**A decidir en N1**: si la convención es namespace, son 119 sitios a cambiar, no 20. Si es import
nombrado, basta con migrar 2 y documentarlo.

---

## Cerrados

_(ninguno todavía)_
