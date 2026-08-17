# ADR-160 — El filo del cristal también sale de la rampa neutra

- **Estado**: **rechazada** · 2026-08-17 — se construyó, se midió, **se aplicó y se miró
  renderizada**, y el propietario la descartó: el resultado visual no convenció. El código está
  revertido y el gate volvió a sus 165 pares. Se conserva por lo que mide: **el defecto que
  describe sigue ahí**, y quien lo redescubra encontrará aquí los números y por qué esta salida
  no se tomó.
- **Aplica al cristal la regla de** [ADR-159](ADR-159-el-borde-sale-de-la-rampa-neutra-y-no-de-la-del-lienzo.md):
  un filo no se toma de la rampa que pinta las superficies.
- **Enmienda**: [ADR-118](ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md) en el
  valor del filo, no en su existencia ni en su forma.
- **Toca**: `effects.glass.surface.*.borderColor` de `nebula-dark` y `nebula-light`. **No cambia el
  contrato**: `GlassSurfaceRecipe` conserva sus tres campos.

## Contexto

ADR-158 movió las cuatro superficies y ADR-159 los tres bordes. Después de los dos, el gate quedaba en
**4 rojos en `dark` y 8 en `light`, todos del filo del cristal** — y ninguno era una regresión
introducida por aquellos cambios, sino un defecto que solo se pudo ver cuando lo demás dejó de
taparlo.

La causa es la misma de ADR-159, en otro sitio: **el filo era un hex fijo escrito a mano**
—`#23252c` en oscuro, `#e9e9ea` en claro— calibrado contra las superficies de entonces. Un valor
absoluto atado a un lienzo que se mueve deja de servir en cuanto el lienzo se mueve. Que estuviera
tomado del tramo de las superficies es lo que lo hacía frágil.

Es además la razón, ya anotada en la [auditoría](../reviews/auditoria-sistema-2026-08-16.md), de que
los nueve temas de producto compartan un filo neutro: `BuildProduct` tiñe `colors.surface` y no toca
`effects.glass`.

## Decisión

### 1. El filo pasa a `gray`

```
  dark     gray.700   (#4a5158)
  light    gray.400   (#999fa6)
```

De los valores que llevan el gate a cero —siete en `dark`, seis en `light`— se elige en cada tema
**el más discreto**: el más oscuro que pasa en oscuro, el más claro que pasa en claro. Un filo tiene
que percibirse; si se lee como un borde, ha dejado de ser un filo.

### 2. Los seis niveles comparten filo

ADR-118 daba a `veil` un filo propio y un solo valor a los otros cinco. Se unifican los seis.

El motivo no es de comodidad: la auditoría §2.4 midió que **cinco de los seis niveles son el mismo
material** —transmiten entre el 10 % y el 22 % del fondo—, y que lo que los separa es el velo y no el
desenfoque, al revés de lo que `docs/02` §2 afirma. Mantener dos filos para seis niveles que casi no
se distinguen era precisión sin diferencia. **Si algún día los niveles se separan de verdad, el filo
se vuelve a abrir con ellos.**

### 3. La regla de ADR-159 se extiende

> Un borde **ni un filo** se toma de la rampa que pinta las superficies, ni se escribe como hex
> calibrado a mano contra ellas.

## Alternativas

- **Recalibrar el hex a las superficies nuevas.** Es lo mínimo, funciona hoy y vuelve a romperse la
  próxima vez que alguien mueva un peldaño — que es exactamente lo que acaba de pasar. Descartada: es
  reponer la trampa.

- **Derivar el filo de `border.subtle`.** Conceptualmente es lo correcto —«separa sin identificar»,
  que es la definición del rol— y era la opción preferida. **Medida, no pasa en ninguno de los dos
  temas**: el panel de cristal compone tan cerca de las superficies que un borde deliberadamente
  discreto no despega 1.15 de ellas. Se descarta por medición, no por criterio.

- **Devolver el filo al contrato como rol** en vez de dejarlo en `effects`. Es lo que ADR-102 sacó y
  ADR-118 devolvió con alfa; reabrirlo por tercera vez pide más motivo que éste.

## Consecuencias

- **El gate de contraste queda en verde**: `dark` 186/186 y `light` 186/186, desde los 19 y 21 rojos
  del 2026-08-16. Con ADR-158 y ADR-159, la serie cierra **40 → 0** en los temas oficiales.

- **El tema de humo se pone al día en el mismo PR.** `tools/contrast-check/src/smoke-theme.ts` es la
  fixture que representa «paletas generadas + roles por defecto», y no cumplía ninguna de las reglas
  nuevas: sus escalones estaban comprimidos y **`surface.overlay` era idéntico a `surface.base`**, que
  `docs/06` §5 prohíbe expresamente. Se le aplican las tres decisiones. Una fixture que falla el gate
  lo deja rojo para siempre y acaba enseñando a ignorarlo.

- **El filo deja de ser tematizable por lienzo y pasa a ser tematizable por rampa neutra.** Para los
  temas de producto no cambia nada —ya era neutro—, pero ahora se ve que lo es. Un producto que quiera
  el filo teñido tiene que ampliar `BuildProduct`, igual que con los bordes de ADR-159.

- **Cambio visual en todo lo que use `glass`**: la variante `glass` del `variantMap`, `GlassSurface`,
  y las superficies de panel. Comparte PR y recaptura de baseline con ADR-158 y ADR-159.

- **`docs/02` §2 sigue diciendo que a los niveles los separa el desenfoque, y sigue sin ser verdad.**
  Este ADR no lo arregla: unifica el filo y deja el velo como está. Corregir el reparto velo/desenfoque
  es la deuda que la auditoría §2.4 deja abierta, y necesita su propio ADR.
