# ADR-161 — El aspecto queda declarado estable, y con él la deuda que se acepta

- **Estado**: **aceptada** · 2026-08-17 — decisión del propietario tras la
  [auditoría visual](../reviews/auditoria-visual-2026-08-17.md).
- **Cierra**: el gate de [`docs/05-roadmap.md`](../05-roadmap.md) §WR, que pedía «declaración
  explícita de que el aspecto está estable para capturar el baseline de ADR-037», y que
  [`wr-closure.md`](../wr-closure.md) dejó anotado como **lo único que aquel documento no podía dar**.
- **Toca**: `docs/03` §1 (una excepción declarada) y `docs/06` §5 (una deuda anotada).

## Contexto

`wr-closure.md` lo dejó escrito con precisión: «Esa declaración es del propietario, no de una
verificación: **nadie puede afirmar desde el código que un catálogo se ve bien**». Y añadió el estado
incómodo en el que quedaba todo: **el baseline se capturó igual**, el 2026-08-08, de modo que «hoy hay
un baseline que guarda un aspecto que nadie declaró estable».

Nueve días después, la auditoría visual VA1 ha hecho lo que faltaba para poder tomarla con criterio:
el paso 1 del método —**MIRAR**— que las ocho familias de WR no ejecutaron.

## Lo que la auditoría midió, y que sostiene esta declaración

- **136 historias barridas a dos anchos.** A 1280 aparecen 13 hallazgos de los que **doce son falsos
  positivos de los propios chequeos** y uno es real. El aspecto de escritorio es coherente.
- **La geometría sale de la escala sin un solo píxel huérfano** en las familias medidas, y los
  hermanos concuerdan: `TextInput`, `Select` y `DatePicker` dan valores **idénticos** peldaño a
  peldaño.
- **El contrato de reduced-motion se cumple en los siete** componentes que animan.
- **Cuatro defectos reales se encontraron y se arreglaron** —el desenfoque de `StarField` fuera de
  escala, nueve duraciones escritas a mano, el desborde del `Tag` y el suelo de 12 px de `Code`—,
  todos de geometría o motion y **ninguno de color**.

## Decisión

### 1. El aspecto del catálogo queda declarado estable

Con ello **se cumple la condición de ADR-037** y el baseline pasa a tener la suya. Se recaptura el de
`win32`, que los cuatro arreglos ya invalidaron, y **se genera por primera vez el de `linux`**, que
[ADR-149](ADR-149-el-entorno-unico-es-la-imagen-de-playwright.md) dejó armado y vacío — hasta hoy el
gate 8 no verificaba nada en CI.

### 2. Lo que se acepta a sabiendas — y no es poco

Una declaración de estabilidad sin la lista de lo que deja fuera no vale nada. Se aceptan **dos huecos
de color**, los dos medidos, los dos con su arreglo construido y **descartado tras verlo renderizado**:

#### 2.1 · El borde en reposo del campo `outline` no llega al 3:1 de SC 1.4.11

Medido: **1.00** en `dark` —el mismo hex que la superficie sobre la que se apoya— y **1.083** en
`light`. `docs/03` promete «WCAG 2.2 AA estricto» y esto no lo cumple.

**No hay salida no cromática.** SC 1.4.11 mide contraste, y el contraste es color: engrosar el borde
no cambia su ratio. La única salida es de color, y es
[ADR-159](ADR-159-el-borde-sale-de-la-rampa-neutra-y-no-de-la-del-lienzo.md): el mínimo que cumple
sobre la rampa actual da un borde a **6:1** que, visto, arruinaba el diseño.

**La excepción es estrecha y se escribe en `docs/03` §1**: alcanza al borde en reposo del campo
`outline`, y a nada más. `border.focus` (6.04) y `border.strong` en hover (3.48) sí cumplen, así que el
campo **sí** se identifica en cuanto se interactúa con él.

#### 2.2 · La escalera de elevación queda en 1.03 contra el 1.08 de ADR-065

Medido: `light` falla **los tres** escalones (1.026 · 1.035 · 1.045) y `dark` dos de tres. Lo
implementó `051aa65` y **lo revirtió ADR-088 sin decirlo**.

**La regla de ADR-065 §1 se mantiene tal cual**, y esto es deliberado. Bajarla a lo que el código
cumple sería la salida cómoda y la peor: una regla ajustada al código roto **ya no puede detectar que
se rompa más**. El razonamiento de ADR-065 —«un escalón de elevación nunca separa menos que un escalón
de hover»— sigue siendo correcto aunque hoy no se satisfaga.

Se anota en `docs/06` §5 como **deuda declarada**, con su medida y su fecha.

### 3. Lo que esta declaración NO cubre

Se declara el aspecto que se ha mirado. Queda expresamente fuera, y sin juzgar:

- **El tema claro y los nueve de producto.** Todo lo medido es `dark`. Es el hueco más grande.
- **Cuatro familias sin medición propia**: overlays, layout y superficie, fechas y media, rich
  content. Entraron en el barrido responsive, no en la geometría ni en los estados.
- **`loading`, `disabled` e `invalid`** en cualquier familia — que `wr-closure.md` ya declaraba sin
  verificar y siguen así.
- **A 360 px el layout se rompe** en `Shell` y `Navigation`: la declaración es de aspecto, no de
  responsive, y ese trabajo queda abierto.

## Alternativas

- **Esperar a cubrir el tema claro y las cuatro familias.** Más cobertura, y **no cambia lo que se
  firma**: la declaración es de gusto, y el gusto ya se pronunció al rechazar las cuatro propuestas de
  color tras verlas renderizadas. Descartada por no aportar a la decisión.
- **No declarar nada.** Es el estado de los últimos nueve días: un baseline sin condición y una fase
  sin cerrar. Descartada.
- **Declarar sin la lista de §2.** Sería una declaración que oculta dos incumplimientos medidos, uno
  de ellos de accesibilidad. Descartada: la lista es lo que hace honesta la firma.

## Consecuencias

- **WR cierra.** `wr-closure.md` puede retirar su sección «lo que este documento NO puede dar».
- **El baseline de `win32` se recaptura** y el de `linux` se genera. A partir de ahí el gate 8
  verifica algo en CI por primera vez desde ADR-149.
- **`docs/03` deja de prometer AA sin excepciones.** Es una pérdida real y por eso se escribe donde se
  ve, no en una nota al pie.
- **La deuda de §2 no caduca sola.** Se reabre el día que el color vuelva a estar en alcance; hasta
  entonces `pnpm check:contrast` **no mide** `border.default`, `border.subtle` ni la distancia entre
  superficies adyacentes, porque esos pares se revirtieron con la serie.
