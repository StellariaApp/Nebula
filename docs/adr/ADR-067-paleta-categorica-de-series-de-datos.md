# ADR-067 — Paleta categórica para series de datos

- **Estado**: **aceptada** · 2026-08-01 (checkpoint de ESPECIFICACIÓN de WR4/T2)
- **Resuelve**: la causa **C14-charts** de `docs/reviews/visual-audit-2026-08-01.md`.
- **Enmienda**: `docs/06-visual-language.md`, que **no da ningún criterio** de separación entre series
  —ni ratio de luminancia, ni Δ perceptual, ni regla de orden—. Añade la sección §9.
- **Alcance**: `Charts` (seis tipos de serie), el contrato `NebulaTheme` y los cinco temas oficiales.
- **Propone ampliar el contrato**. Por [ADR-019](ADR-019-convenciones-de-codigo.md) y por la regla
  «cero valores crudos» del harness de WR4, aquí la salida correcta es **parar y proponer el rol**,
  no escribir hexes en `chart-theme.ts`.

## Contexto

`SeriesColor` (`packages/web/src/components/Charts/chart-theme.ts`) colorea las series sin color
explícito con esta secuencia, en el peldaño `500`:

```
primary · accent · success · warning · info · error
```

Es decir: **reutiliza los roles semánticos como paleta categórica.** Medido sobre los cuatro temas
oficiales (ΔE2000 y simulación dicromática Viénot–Brettel–Mollon):

| Tema           | Peor ratio adyacente | Peor par               | Peor ΔE dicromático |
| -------------- | -------------------: | ---------------------- | ------------------: |
| `nebula-dark`  |                1.040 | `accent`/`error` 1.004 |             **3.5** |
| `nebula-light` |                1.040 | `accent`/`error` 1.004 |             **3.5** |

Tres hallazgos, y el segundo es peor que lo que la auditoría reportó:

1. **Un tema puede dar el mismo hex a `primary` e `info`** (ΔE2000 = **0.0**), y
   `accent`/`success` están a ΔE 2.0 (`#00a177` vs `#00a270`). Un gráfico de seis series se dibuja
   allí con **tres colores y medio**. La auditoría reportó el par `primary`/`accent` de `nebula`
   (ratio 1.04) y no llegó a este, que es una colisión exacta.
2. **Las series se confunden en escala de grises**: el peor par adyacente separa 1.006, o sea nada.
   Impreso en blanco y negro, o en una captura sin color, el gráfico es ilegible.
3. **Se confunden con deficiencia protán/deután**: ΔE de 0.0 a 3.7. Por debajo de ~2 el ojo no
   distingue dos colores ni en condiciones ideales.

**La causa raíz no es la calibración, es la reutilización.** Un rol semántico existe para significar
algo —`error` es error—, y una serie categórica no significa nada: es la tercera. Colorear «Ingresos
de marzo» con el rojo de error es incorrecto aunque los ratios salieran bien. Y como los roles
semánticos de un tema **no tienen ninguna obligación de ser distinguibles entre sí** —no es lo que
se les pide—, un tema puede darle el mismo cian a `primary` y a `info` sin estar mal: el
defecto está en usarlos como paleta.

## Decisión

### 1. Tres criterios, verificables sobre los valores del tema

| Criterio                                                                     | Umbral | Se aplica a         |
| ---------------------------------------------------------------------------- | -----: | ------------------- |
| Relación de luminancia entre series **adyacentes** en el orden de la leyenda |  ≥1.10 | pares consecutivos  |
| ΔE2000 en visión normal                                                      |    ≥15 | **todos** los pares |
| ΔE2000 bajo simulación protán **y** deután                                   |    ≥10 | **todos** los pares |

### 2. Los umbrales están calibrados contra una referencia, no elegidos a ojo

Se validaron contra **Okabe-Ito**, la paleta CVD-safe canónica, tomando sus seis primeras entradas:

| Medida                        | Okabe-Ito | Umbral | Nebula hoy (peor) |
| ----------------------------- | --------: | -----: | ----------------: |
| Ratio de luminancia adyacente |     1.118 |  ≥1.10 |         **1.006** |
| ΔE2000 visión normal          |      22.2 |    ≥15 |           **0.0** |
| ΔE2000 protán/deután          |      11.6 |    ≥10 |           **0.0** |

Esto importa por una razón concreta: **la primera versión de este criterio pedía ΔE ≥12 para
dicromatismo, y Okabe-Ito no lo cumple** (11.6). Habría sido un umbral que ni la referencia del campo
alcanza — el mismo error que dejó a C4 sin número durante toda una fase. Se bajó a 10, que la
referencia supera con margen y que el catálogo actual incumple por dos órdenes de magnitud.

**El ratio de luminancia se exige solo entre series adyacentes, y es deliberado**: exigirlo a todos
los pares es imposible incluso para Okabe-Ito, cuyo peor par global cae a 1.025. Seis colores
distinguibles no caben en seis niveles de gris distintos. Lo que se confunde en la práctica es lo que
se toca —líneas vecinas, segmentos contiguos de una barra apilada—, y ahí el orden sí es el criterio.

### 3. `NebulaTheme` gana `colors.chartCategorical`

Una **secuencia ordenada** de colores categóricos por tema, independiente de los roles semánticos.

- Mínimo **6** entradas (lo que consume `Charts` hoy); se recomienda **8**, que es donde la mayoría de
  los cuadros de mando dejan de añadir series y empiezan a agrupar en «otros».
- Los roles semánticos **siguen usándose cuando la serie significa eso** — una serie «errores» en
  `error` es correcta. Lo que deja de existir es su uso como relleno posicional.
- `SeriesColor` pasa a leer de la secuencia y a ciclar sobre ella.

### 4. El color no es el único canal

WCAG 1.4.1. Cuando el tipo de gráfico lo permita, la serie se distingue además por un segundo canal
—patrón de trazo en líneas, marcador en dispersión, textura o etiqueta directa en áreas—. Los tres
umbrales del punto 1 son el suelo, no el sustituto.

## Alternativas

- **Recalibrar los peldaños semánticos hasta que cumplan.** No amplía el contrato. Descartada por dos
  motivos: obliga a los roles semánticos a satisfacer una restricción que no es la suya —`error` debe
  leerse como error, no ser distinguible de `info`— y en un tema así exigiría separar dos roles que
  el tema quiere próximos a propósito. Arregla el gráfico rompiendo el tema.
- **Fijar Okabe-Ito como paleta de charts.** Cumple todo y es dominio público. Descartada como
  decisión: es una excelente **referencia de validación** —y se usa como tal— pero congelaría la
  identidad de dataviz en una paleta ajena, idéntica en los cinco temas, cuando la premisa de Nebula
  es que la personalización va por tema (ADR-020). Queda como fallback recomendado para un tema que
  no defina el suyo.
- **Derivar la secuencia rotando el tono desde `primary`.** Cero mantenimiento y siempre coherente
  con la marca. Descartada: la rotación uniforme de tono es exactamente lo que produce pares
  indistinguibles bajo deuteranopía, porque el eje rojo-verde colapsa; habría que verificar el
  resultado igual, y entonces la generación no ahorra nada.
- **Dejarlo a los consumidores** (`color` explícito por serie). Es lo que hoy permite la API.
  Descartada: el defecto está en el **defecto**, y un consumidor que no pasa colores es precisamente
  quien confía en que el sistema los elija bien.

## Consecuencias

- **Amplía el contrato `NebulaTheme`**, con lo que eso arrastra: los cinco temas oficiales, el schema
  de Zod de `packages/themes`, el Theme Creator y la paridad con `packages/native` —que aún no
  existe, así que native nace con el rol en lugar de heredar el defecto.
- **Los cuatro temas oficiales incumplen los tres criterios hoy**, así que los cuatro estrenan
  secuencia. No es una corrección puntual.
- **`pnpm check:contrast` no cubre esto.** El gate mide texto sobre fondo; la separación entre dos
  rellenos de serie no es un par de contraste. Cerrarlo pide un check nuevo —los tres criterios son
  calculables sobre los valores del tema, sin render— y queda **propuesto, no decidido**: entra en la
  deuda de la fase junto con el check de escalón de superficie de
  [ADR-065](ADR-065-escalon-de-superficie-y-escalera-de-sombras.md).
- **No afecta al baseline de ADR-037 todavía**: mientras la secuencia no se implemente, los gráficos
  siguen pintando lo de hoy. Cuando se implemente, cambia el aspecto de las seis series en los cinco
  temas — conviene que ocurra **antes** de capturar el baseline, o el baseline nace sabiendo que va a
  cambiar.
- **Lo que este ADR no decide**: los valores concretos de cada secuencia. Da los tres umbrales, la
  referencia contra la que se validan y la forma del rol; generarlos y verificarlos es trabajo de
  implementación, probablemente apoyado en `tools/palette-gen`.
