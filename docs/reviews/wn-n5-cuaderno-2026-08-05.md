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

### H8 · Cinco de los siete componentes de la primera tanda de N3 no tienen `.md`

**Dónde**: `Stat`, `EmptyState`, `Feature`, `EmptyModule`, `Blockquote`.
**Causa**: ADR-019 §2 manda que lo que necesite explicación viva en un `<Nombre>.md` junto al módulo,
porque el código no lleva comentarios. Estos cinco no tienen ninguno, así que la regla de cuándo
aplica cada prop de ranura —y la trampa del `id` en los que generan uno— no está escrita en ningún
sitio salvo el ADR.
**Medido en el catálogo entero**: **73 de 158 componentes no tienen `.md`**. No es un descuido de esta
tanda, es una deuda de casi la mitad del catálogo.
**Recomendación**: decidir si el `.md` es obligatorio —y entonces es un gate, contable como el de
tamaño— o si solo se escribe cuando hay algo no deducible que contar, que es lo que ADR-019 dice
literalmente. Hoy la regla se lee como lo segundo pero se comprueba como nada.

### H7 · `SimpleGrid` declara diez vars para lo que son dos props

**Dónde**: `packages/web/src/components/SimpleGrid/SimpleGrid.vars.css.ts`
**Causa**: `cols`, `colsBase`, `colsPhone`, `colsTablet`, `colsLaptop`, `colsDesktop`, `colsWide`,
`spacingX`, `spacingY`, `justify`. Cinco de ellas —las de brecha— nadie las asigna y se leen con
`fallbackVar`, así que son puntos de extensión válidos; pero el conjunto reproduce a mano el patrón
responsive que otros componentes resuelven con una prop de objeto.
**Recomendación**: mirarlo al llegar a N3, cuando se decida la forma de las props responsive. No es
un defecto hoy; es la señal de "contrato implícito" que el prompt de N1 mandaba anotar.

### H5 · `hover` y `active` valen lo mismo en los dos temas nebula

**Dónde**: `packages/themes/src/themes/nebula-dark.ts` y `nebula-light.ts`
**Medido** durante N4:

| tema           | `hover`     | `active`        | `hoverActive` |
| -------------- | ----------- | --------------- | ------------- |
| `nebula-dark`  | `dark.700`  | **`dark.700`**  | `dark.800`    |
| `nebula-light` | `light.300` | **`light.300`** | `light.400`   |
| `sober-light`  | `light.500` | `light.600`     | `light.700`   |
| `playful`      | `light.300` | `light.500`     | `light.600`   |

**Qué provoca**: en los dos temas por defecto, una fila con el ratón encima y una fila seleccionada
se pintan idénticas. El usuario no puede distinguir "esto responde al puntero" de "esto está
elegido". Los dos temas de terceros sí las separan, así que el patrón correcto ya existe.
**Por qué importa ahora**: ADR-095 acaba de repartir `hoverActive` como _el peldaño siguiente_ a
`active`. Ese peldaño se apoya en una escalera con dos escalones al mismo nivel, así que la mejora se
nota a medias en los temas que más se usan.
**Recomendación**: separar `active` un peldaño de `hover` en los dos temas nebula, como ya hacen
`sober-light` y `playful`. Es tocar tokens → ADR + `pnpm check:contrast` en el mismo PR.

### H6 · La tabla de ADR-088 no coincide con los temas

**Dónde**: `docs/adr/ADR-088-el-activo-tambien-recibe-hover.md:46-51`
**Causa**: la tabla dice `dark.500 → dark.600` y `light.300 → light.400`; los temas de hoy tienen
`dark.700 → dark.800` y `light.300 → light.400`. La fila oscura quedó desfasada tras el ajuste de
superficies de `nebula-dark`. La **dirección** que documenta sigue siendo correcta y está verificada:
en oscuro `hoverActive` es más claro que `active` (luma 40 contra 34), en los tres claros más oscuro.
**Recomendación**: corregir la tabla con una nota fechada al tocar H5, que es cuando esos valores
vuelven a moverse.

---

## Cerrados

- **N4 · reparto de `surface.hoverActive`** — ADR-095. Ocho componentes; el barrido midió 10 hojas
  con selección + puntero, de las que 2 no eran caso.
- **H4 · dos idiomas para importar las vars** — ADR-096, en N1. Ganó el espacio de nombres, que era
  lo que el prompt fijaba: 154 imports migrados, 660 referencias. La medición dio la razón al prompt
  por un motivo que no estaba escrito — el import nombrado obligaba a 57 alias para esquivar
  colisiones entre la var y la prop homónima.
