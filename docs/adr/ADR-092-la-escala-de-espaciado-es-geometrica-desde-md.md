# ADR-092 — La escala de espaciado es geométrica desde `md`

- **Estado**: **aceptada** · 2026-08-04 — a petición del propietario, al revisar el panel
- **Enmienda**: `spacing.scale` de `@stellaria/nebula-tokens`.

## Contexto

Al revisar el panel el propietario señaló que `md` estaba bien pero `sm` quedaba demasiado pequeño en
relación con él. Medida, la escala vieja no tenía relación: los saltos iban **2.00 · 1.50 · 1.33 ·
1.50 · 1.33 · 1.33**, sin criterio. Un `sm` a 8 px contra un `md` a 16 es el doble exacto, que es el
salto más brusco de toda la escalera y cae justo donde más se usa —la separación dentro de un grupo
frente a la separación entre grupos—.

La instrucción fue explícita: razón **1.33 anclada en `md`**, multiplicando hacia arriba y hacia
abajo.

## Decisión

| paso   | antes | ahora  | salto |
| ------ | ----- | ------ | ----- |
| `xxs`  | 2     | 2      | —     |
| `xs`   | 4     | 4      | 2.00  |
| `sm`   | 8     | **12** | 3.00  |
| `md`   | 16    | 16     | 1.33  |
| `lg`   | 24    | **22** | 1.38  |
| `xl`   | 32    | **28** | 1.27  |
| `xxl`  | 48    | **38** | 1.36  |
| `xxxl` | 64    | **50** | 1.32  |

De `sm` hacia arriba los saltos quedan entre **1.27 y 1.38**, frente al 2.00–1.33 desigual de antes.

### Dos decisiones que la aritmética obligó

**Rejilla de 2, no de 4.** Redondear a múltiplos de 4 colapsaba `xxs` y `xs` en 8 px —salto 1.00, dos
tokens con el mismo valor—. El sistema ya admite medios pasos desde
[ADR-045](ADR-045-peldanos-intermedios-de-spacing.md), así que la escala usa los que hay.

**Por debajo de `sm` no se aplica la razón.** Un 1.33 desde 12 da 9 y 6.8 px: pasos demasiado juntos
para distinguirse. Peor, `xxs` pasaría de 2 a 7 px y aflojaría todos los grupos apretados —icono con
texto, contenido de badge— que dependen de que ahí no haya casi nada.

`xxs` y `xs` quedan por tanto como **pasos finos**, no como parte del ritmo. El salto `xs → sm` sube
a 3× y ese hueco lo cubren los medios pasos.

## Consecuencias

- **365 sitios afectados**: 146 usos de `space.sm` en la librería y 219 en stories. No hace falta
  tocar ninguno; cambia el valor, no el nombre.
- El cambio más visible es `sm`, que pasa de 8 a 12 px: los grupos apretados respiran. El segundo es
  `xxl`/`xxxl`, que bajan un 20 %: las bandas de sección dejan de abrirse tanto.
- Gates en verde: build, typecheck, lint y 1187 tests.
- Es cambio de contrato: un consumidor que dependiera del valor absoluto de `space.xl` verá 28 px
  donde antes veía 32.
