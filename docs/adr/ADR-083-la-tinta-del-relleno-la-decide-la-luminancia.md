# ADR-083 — La tinta del relleno la decide la luminancia

- **Estado**: **aceptada** · 2026-08-03 — a petición del propietario durante WB
- **Enmienda**: `colors.text.onPrimary` deja de ser un valor autorado y pasa a derivarse.
- **Depende de**: [ADR-084](ADR-084-el-paso-500-se-ancla-al-contraste.md), que es lo que hace que el
  relleno de marca pueda llevar tinta clara.

## Contexto

`text.onPrimary` era un valor que cada tema escribía a mano: blanco en los claros, casi negro en
`dark`. Ese casi negro no era una decisión de tinta sino una consecuencia: el relleno de marca de
`dark` usaba `scale.600`, que con `FlipScale` cae en el paso **400** de la paleta —un tono claro— y
sobre un tono claro la única tinta legible es oscura.

El resultado se veía en la landing: el mismo botón salía con letra blanca en light y con letra casi
negra en dark, y el relleno era un peldaño más alto en un esquema y más bajo en el otro. El
propietario lo describió exactamente así, y pidió que la tinta saliera blanca en todos los temas.

## Decisión

**La tinta de un relleno de marca la decide la luminancia del propio relleno**, con el umbral de
`tfv-frontend/packages/utils/colors/luminance.ts`:

```
LUMINANCE_DARK_THRESHOLD = 0.7
luminancia < 0.7 → tinta clara · si no → tinta oscura
```

El 0.7 es alto a propósito: clasifica como oscuro casi todo color con saturación, que es lo que hace
que un relleno de marca lleve blanco encima.

El cálculo vive en `packages/web/src/theme/ink.ts` y se usa en dos sitios:

1. **`ResolveColorExtended`**, que ya elegía tinta para el modo plano (`color="pink.400"`) con un
   umbral de 0.45. Sube a 0.7 para que los dos caminos decidan igual.
2. **`ThemeToVars`**, que deriva `text.onPrimary` del relleno que el tema declara en
   `variantMap.filled`.

**Se deriva al construir las vars del tema, no al resolver la variante.** Es la parte que costó
encontrar: `ResolveVariant` devuelve **referencias a vars CSS**, no colores, porque el tema tiene que
poder cambiar por clase CSS sin volver a renderizar. Calcular la tinta ahí obligaba a emitir un hex
literal en el `style` en línea, que es justo lo que prohíbe el test
`Button › resuelve el color de la variante en vars locales (no hex hardcoded)`. Derivándolo por tema,
la tinta sigue viajando como `var(--color-text-onPrimary)` y el valor lo pone cada tema.

### El hover ahonda en dark en vez de aclarar

`ShiftRef(background, +1)` sube un peldaño del token, que en un tema oscuro es **más claro**. Con
tinta oscura eso daba igual; con tinta clara el hover destruía el contraste —medido, blanco sobre
`#8c9bff` da 2.55:1—. El desplazamiento pasa a depender del esquema: `-1` en dark, `+1` en light. El
resultado es simétrico, el relleno se hunde al pasar por encima en los dos.

## Consecuencias

- **`text.onPrimary` es ahora blanco en los cuatro temas oficiales**, y quien lo usaba como color de
  texto sobre un fondo cualquiera se rompe. Se corrigió el par en seis sitios de librería y en once
  stories, todos pasando de `600` a `500` — ver ADR-084, que es lo que convierte al `500` en el
  peldaño que lleva tinta.
- El gate de contraste replica el cálculo en `tools/contrast-check/src/resolve.ts`. Sin eso mediría la
  tinta autorada y no la que se envía.
- **El gate a11y espera ahora a que no quede ninguna animación finita en curso** en vez de a un
  selector concreto. Las decorativas infinitas se ignoran por su `iterations: Infinity`, que era la
  razón original de no esperar a `getAnimations()`. Sin esa espera axe medía traslúcidos el globo de
  `FieldError`, la sexta tarjeta de `Reveal › Stagger` y el botón de un estado vacío.
- El gradiente de marca de `dark` pasa de los stops `400` a los `500`: con tinta clara, los `400`
  daban 2.37:1. Como `light` ya usaba stops equivalentes, **los dos temas de Nebula comparten ahora el
  eje de marca**, que es lo correcto para una identidad —no debería cambiar con el esquema— y lo que
  recogen los cuatro tests de gradiente.
