# ADR-084 — El paso 500 se ancla al contraste

- **Estado**: **aceptada** · 2026-08-03 — a petición del propietario durante WB
- **Enmienda**: la curva `CHROMATIC_L` del generador y las semillas de `blue` y `cyan`
  ([ADR-020](ADR-020-identidad-visual-nebula.md) mantiene el eje indigo→violet, que no se toca).
- **Motiva**: [ADR-083](ADR-083-la-tinta-del-relleno-la-decide-la-luminancia.md).

## Contexto

El propietario quiere que el relleno de marca **sea el color del producto**: `variantMap.filled` en
`scale.500`, el mismo tono que ya usan el tinte de los iconos y el degradado del titular. Con la
rampa anterior eso no llegaba a AA en ninguna familia —blanco sobre el `500` daba entre 3.28 y
3.93:1— y ponía en rojo 187 tests de a11y.

Subir el relleno a `600` lo arreglaba, pero es exactamente la queja de partida: el botón sale más
hondo que la marca. La instrucción fue clara: **que todo quede en 500 como base y se ajusten los
colores del tema**.

Al medirlo aparece el dato que decide la forma: **no existe una sola curva de lightness que ponga
todos los matices en AA**, porque OKLCH y la luminancia WCAG no coinciden por tono. El verde pide
`L=0.550` y el rojo `L=0.590`. Una curva uniforme al peor caso deja los cálidos en 5.3–5.5:1, un 20 %
más hondos de lo necesario: `rose` pasaría de `#ec3674` a `#cb1b5e`, que ya no es el mismo rosa.

## Decisión

### 1. El generador resuelve la `L` del `500` contra un objetivo de contraste

Para el perfil `chromatic`, el paso `500` deja de leer su lightness de la curva y la **baja hasta que
blanco sobre él alcanza 4.5:1**, con un suelo de `L(600) + 0.04` para no aplastar el peldaño contra su
vecino. Los quince tonos cromáticos aterrizan entre **4.50 y 4.55:1**.

La dispersión resultante es de **0.045 de L** —`0.550` el verde, `0.595` el rosa—, un 4 %: detectable
poniendo dos muestras juntas, invisible en una interfaz. Es el precio de la garantía.

**Lo que se gana no es el botón, es la propiedad**: cualquier paleta nueva aterriza en AA por
construcción. Un producto que semille su color hereda la garantía sin que nadie la revise, que es la
tesis de WB —entre productos solo cambia el color— convertida en algo verificable.

### 2. La mitad baja de la rampa se re-espacia

El `500` del verde cae en `0.550`, que es donde vivía el `600`. La curva pasa a:

| paso  | antes | ahora   |
| ----- | ----- | ------- |
| `400` | 0.72  | 0.70    |
| `500` | 0.63  | ⟨4.5:1⟩ |
| `600` | 0.55  | 0.49    |
| `700` | 0.48  | 0.43    |
| `800` | 0.41  | 0.37    |
| `900` | 0.35  | 0.31    |
| `950` | 0.27  | 0.24    |

### 3. `blue` y `cyan` recuperan su tono

Medido en OKLCH, `blue` estaba en **hue 215** —eso es cian— y `cyan` en 211, a cuatro grados. Los dos
leían igual de verdosos, y el anclaje los hundió hasta petróleo (`#008298`). Las semillas pasan a
`#2b7fff` (hue 259) y `#0ea5e9` (hue 237), que es azul de verdad y un azul de cielo.

No es una consecuencia del anclaje: el tono ya estaba mal. El anclaje solo lo hizo visible.

## Consecuencias

- **El `500` es el peldaño que lleva tinta; el `600` es el peldaño que ES tinta.** Esa es la regla que
  queda, y obligó a mover seis pares de librería —`Menu`, `option-list`, `Calendar`, `GridPicker`,
  `date-segments`, `FieldError`— de `600` a `500`, y `Hero.hiper` en sentido contrario, de `accent.500`
  a `accent.600`, porque es texto sobre el lienzo y no un relleno.
- `border.strong` de `dark` sube de `gray.600` a `gray.500`: con la rampa nueva, el 600 dejaba de
  separar del lienzo (2.34–2.91:1 contra un mínimo de 3).
- **Todos los gates verdes**: contraste 5 temas, 1187 tests, a11y 85 suites y 586 tests, size sin
  excesos.
- `packages/tokens/src/tokens/palettes.ts` es generado: el cambio real vive en `tools/palette-gen`.
