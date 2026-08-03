# ADR-079 — La calibración del cristal baja un peldaño

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario tras revisar B2 sobre el render
- **Enmienda**: la decisión 5 de [ADR-028](ADR-028-elevacion-y-materiales-dark.md), que
  subió el glass a `blur.md`/`xl`/`xxl`, y `docs/06` §6.
- **No toca**: la receta de `control` (ADR-078), que ya está en el mínimo útil.

## Contexto

ADR-028 subió el glass desde `blur.sm/md` porque a 4–8 px «el efecto está por debajo del umbral en
que se percibe». Con esa calibración vigente, el propietario revisó el render de B2 y el veredicto fue
que las recetas de superficie se leen **demasiado fuertes**.

Las dos observaciones son compatibles y esa es la clave: ADR-028 midió **si el desenfoque se nota**;
lo que ahora se juzga es **cuánto tapa el conjunto**. Un velo al 66 % con desenfoque alto no falla por
imperceptible — falla por opaco, y a esa opacidad da igual cuánto desenfoques porque apenas se ve el
fondo.

## Decisión

Opacidad **−10 puntos** y blur **un peldaño** en las tres recetas de superficie:

| Receta    | Antes (dark)      | Ahora (dark)     |
| --------- | ----------------- | ---------------- |
| `subtle`  | 0.56 · `blur.md`  | 0.46 · `blur.sm` |
| `default` | 0.66 · `blur.xl`  | 0.56 · `blur.lg` |
| `strong`  | 0.76 · `blur.xxl` | 0.66 · `blur.xl` |

Los temas light bajan igual sobre su base blanca: 0.48/0.58/0.68 → 0.38/0.48/0.58.

**`subtle` vuelve a `blur.sm`, que es el valor que ADR-028 llamó imperceptible.** Se asume a
sabiendas: con el velo al 46 % en vez del 56 %, lo que separa esa superficie del fondo ya no es el
desenfoque sino la transparencia. `subtle` deja de ser «cristal poco desenfocado» para ser «superficie
translúcida», y para el caso en que sí haga falta desenfoque marcado están `default` y `strong`.

## Consecuencias

- **Verificado sobre el render** con el método de §5.5 del plan de marca: el chrome pasa de
  `rgba(15,17,25,0.66)` + `blur(16px)` a `rgba(15,17,25,0.56)` + `blur(12px)`.

- **El control baja también, y el motivo por el que no iba a hacerlo resultó ser un bug.** Este ADR
  cerró diciendo que `glass.control` se quedaba en `rgba(255,255,255,0.05)` + `blur(4px)` porque
  bajarlo «lo dejaría en 2 px, donde el efecto desaparece del todo y **el borde se queda solo**».

  Esa frase se escribió con el borde del cristal roto: los controles pintaban `border.subtle` —gris
  oscuro sobre fondo oscuro— en vez del `rgba(255,255,255,0.10)` de su receta, porque nadie consumía
  `glassBorder`. Con el borde arreglado, «el borde se queda solo» dejó de ser una pérdida y pasó a ser
  **la definición del control**: es lo que D2 describe del botón de Rosette, «sutil, con borde, sin
  blur».

  Validado sobre el render por el propietario, `control` queda en `rgba(255,255,255,0.03)` +
  `blur(2px)` en dark y `rgba(15,17,25,0.02)` en light. El botón se define por su filo y no por su
  relleno.

- **`docs/06` §6 pierde la frase sobre el umbral.** La calibración `md/xl/xxl` deja de ser la vigente,
  y la explicación de por qué se subió pasa a ser historia de ADR-028, no regla en vigor.

- **Sigue sin cubrirlo ningún gate.** `check:contrast` mide el token y no el color compuesto sobre lo
  que haya detrás. Si un texto sobre cristal se vuelve ilegible sobre una imagen, lo detecta el ojo.
