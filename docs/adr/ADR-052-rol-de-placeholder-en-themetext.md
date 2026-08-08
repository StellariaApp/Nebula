# ADR-052 — `text.placeholder` como rol propio de `ThemeText`

- **Estado**: aceptada · 2026-07-29 (decisión del propietario en el playground)
- **Enmienda**: `docs/02-theming.md` §2 (contrato `NebulaTheme`) y ADR-042 (hover de `filled`).
- **Precedente**: ADR-048 (`surface.disabled`, `text.disabled` y `border.disabled`) — mismo patrón:
  un estado que se venía pintando con un rol prestado gana rol propio para poder calibrarse.
- **Revisión de origen**: `docs/reviews/visual-calibration-2026-07-28.md` §9.

## Contexto

El propietario reportó dos veces, sobre el playground, que el placeholder no se distingue lo bastante
del valor escrito. La separación medida entre `text.muted` —con el que se pintaba— y `text.primary`:

| Tema         | separación |
| ------------ | ---------: |
| nebula-light |       1.74 |
| nebula-dark  |       3.26 |

En dark ya se corrigió lo que se podía sin tocar el contrato (`muted` de `gray.400` a `gray.500`,
2.32 → 3.26). En light el intento equivalente **falló el gate y se revirtió**: `gray.600` daba la
separación buscada pero caía a **4.20 sobre `surface.active`**, por debajo del 4.5:1 de texto.

Ahí está la causa, y no es de calibración:

> `text.muted` es un rol de propósito general. Debe cumplir 4.5:1 **sobre las seis superficies** del
> contrato, porque cualquier componente puede usarlo sobre cualquiera de ellas. Un placeholder solo
> se apoya sobre el fondo de un campo.

Mientras compartan rol, el placeholder queda calibrado por el peor caso de un rol que no es el suyo.
Y la rampa gris no tiene medio peldaño: de `gray.700` a `gray.600` el contraste sobre el campo salta de
6.11 a 4.54, sin nada intermedio.

## Decisión

1. **`TextRole` gana `placeholder`.** La unión pasa de seis a siete miembros:

   ```ts
   export type TextRole =
     "primary" | "secondary" | "muted" | "placeholder" | "inverted" | "onPrimary" | "disabled";
   ```

2. **Su alcance declarado es el fondo de un campo**, y de ahí sale su presupuesto de contraste. El gate
   lo mide contra `surface.sunken` —el relleno del campo desde la enmienda de ADR-042— y contra `base`,
   `raised` y `overlay`, que son los fondos que quedan detrás de un campo `underline` o `unstyled`.
   **No se mide contra `hover`, `active` ni `disabled`**, y eso es la decisión, no una omisión: un campo
   no muestra esas superficies bajo su placeholder (punto 4).

3. **Calibración en los cuatro temas oficiales**, con 4.5:1 estricto sobre el fondo del campo:

   | Tema         | `muted`    | `placeholder`  | sobre el campo | separación vs. valor |
   | ------------ | ---------- | -------------- | -------------: | -------------------: |
   | nebula-light | `gray.700` | **`gray.600`** |           4.54 |      1.74 → **2.34** |
   | nebula-dark  | `gray.500` | `gray.500`     |           5.38 |                 3.26 |

   **dark no se mueve porque ya está en su suelo**: el peldaño siguiente cae a 3.90 sobre su fondo de
   campo. Es además coherente con su identidad de tema de alto
   contraste, por la que ya quedó exento de la revisión del separador (§7 de la revisión de origen).

4. **Un campo deshabilitado pinta su placeholder con `text.disabled`**, vía
   `&:disabled::placeholder`. Es el rol correcto —WCAG exime los componentes inactivos— y elimina el
   par más apretado del eje, que era `muted` sobre `surface.disabled`.

5. **`filled` deja de oscurecer el relleno en hover.** La enmienda de ADR-042 le había puesto
   `bgHover: surface.active` para darle la respuesta al puntero que no tenía. Este ADR demuestra que
   oscurecer el fondo **bajo el texto** cuesta contraste: con el placeholder en `gray.600`, un `filled`
   con el puntero encima quedaba a 4.20. `filled` pasa a comunicar el hover con el borde apareciendo
   —`transparent` → `border.default`—, el mismo idioma de `outline`, sin tocar el fondo del texto.

## Alternativas

- **Suelo de 3:1 para placeholders**, declarando que un placeholder nunca porta información necesaria
  y por tanto se rige por el criterio de componentes UI y no por el de texto. Daría light `gray.500`
  (separación 3.23) y dark `gray.600` (4.50): bastante más atenuado en los dos y con el mismo signo.
  Es la postura que llevan Material y Mantine. **Rechazada por el propietario**: enmendar
  `docs/03` §1 regla 4 —doc cerrado, y el pilar de conformidad de la librería— por un rol es un precio
  alto, y AA estricto ya entrega la mejora visible en los dos temas donde había margen.
- **Atenuar con `opacity` en `&::placeholder`** sin tocar el contrato. Rechazada: el resultado es una
  mezcla con el fondo que el gate no puede medir, de modo que se pierde exactamente la garantía que
  justifica la librería. Un fallo de contraste invisible al gate es peor que uno declarado.
- **Un hex propio por tema en vez de un peldaño de la rampa** para conseguir el medio peldaño que falta.
  Rechazada: sería el primer color del contrato que no sale de una paleta generada, y rompe la
  disciplina de que un tema se describe por peldaños y no por valores sueltos.
- **No hacer nada**, documentando que la rampa no tiene el peldaño. Era defendible —dark ya estaba en
  su suelo—, pero dejaba light en 1.74, que es el número que originó el reporte dos veces.

## Consecuencias

- **Cambio de contrato en `NebulaTheme`.** `colors.text` gana una clave obligatoria: `themeSchema`
  valida `text` como record sobre `textRoles`, así que **todo tema JSON externo debe añadirla**. Los
  paquetes son `private: true` y no hay consumidores publicados, de modo que el coste real hoy es cero;
  a partir de la Etapa 2 esto sería un breaking change de contrato.
- **Paridad W/N**: el rol vive en el contrato compartido, así que `packages/native` lo recibe gratis y
  su `TextInput` deberá consumirlo cuando N2 implemente los campos.
- **El gate gana 4 pares por tema** (111→118 · 118 · 118 · 125 en los cuatro oficiales y el de humo) y
  sigue en verde. El par `text.muted / surface.active`, que era el que bloqueaba la calibración, deja de
  gobernar el placeholder sin dejar de gobernar a `muted`.
- **`text.muted` no se toca.** Sigue siendo el rol de la descripción de un campo y del texto de ayuda,
  con su presupuesto de seis superficies intacto.
- **Queda abierto** el 3:1 de SC 1.4.11 para el contorno en reposo del campo (`border.default`: 1.39 en
  light, 2.27 en dark). Es un rol distinto y se resuelve recalibrándolo en los cinco temas.
