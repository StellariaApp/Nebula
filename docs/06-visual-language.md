# 06 — Lenguaje visual de Nebula

> Especificación vinculante para Web y Native desde W2.V. Complementa el contrato de temas de
> `02-theming.md`, los guardrails de `03-a11y-motion-performance.md` y la identidad de ADR-020.

## 1. Dirección

Nebula es **premium enterprise vibrante**. La calidad no proviene de acumular glow, blur o gradientes,
sino de una jerarquía fuerte, espacio intencional, superficies distinguibles y efectos escasos que
señalan qué merece atención.

Orden de lectura de toda composición:

1. contenido y acción principal;
2. agrupación y jerarquía tipográfica;
3. superficie y borde;
4. motion y efectos.

Si un efecto compite con el contenido, el efecto pierde.

## 2. Tipografía

### 2.1 Baseline de tokens

| Token     | Valor | Uso dominante                                |
| --------- | ----: | -------------------------------------------- |
| `h1`      | 48 px | título de página o hero; uno por vista       |
| `h2`      | 40 px | sección primaria o heading de overlay grande |
| `h3`      | 32 px | subsección principal                         |
| `h4`      | 28 px | título de panel/card prominente              |
| `h5`      | 24 px | título de grupo                              |
| `h6`      | 20 px | título compacto, nunca metadata              |
| `body1`   | 16 px | cuerpo por defecto, formularios y lectura    |
| `body2`   | 14 px | cuerpo secundario y UI compacta              |
| `body3`   | 13 px | apoyo denso; no para párrafos largos         |
| `button`  | 14 px | label de controles                           |
| `caption` | 12 px | metadata, ayuda y estados secundarios        |

Reglas:

- Ningún texto informativo o interactivo baja de 12 px.
- `Text` sin props usa `body1` + `lineHeight.normal`; no hereda el default del navegador.
- `Title` usa `tight`; `h1–h2` son `bold`, `h3–h6` son `semibold`.
- `letterSpacing.tight` se reserva a `h1–h3`; headings compactos y cuerpo usan `normal`.
- Labels de controles usan `button` o el tamaño denso correspondiente, `semibold` y
  `lineHeight.normal`; no se corrige su presencia agregando padding local.
- Blockquote usa `body1/normal` para la cita y `caption/normal` para la atribución.
- Una línea de lectura mide idealmente 60–70 caracteres y nunca supera 75; headings largos se limitan
  a 20–32 caracteres antes de envolver.
- La semántica HTML no se elige por apariencia. `order` define jerarquía; si se necesita otra escala
  visual, debe conservarse el heading correcto con composición/polimorfismo explícito.

## 3. Ritmo espacial

La escala existente forma una cuadrícula base de 4 px:

| Token  | Nebula default | Significado                                      |
| ------ | -------------: | ------------------------------------------------ |
| `xxs`  |           2 px | corrección óptica; no separa elementos distintos |
| `xs`   |           4 px | icono+label muy compacto, label+required         |
| `sm`   |           8 px | relación interna directa                         |
| `md`   |          16 px | padding/gap base de componente                   |
| `lg`   |          24 px | separación de grupos relacionados                |
| `xl`   |          32 px | separación de secciones                          |
| `xxl`  |          48 px | regiones de página                               |
| `xxxl` |          64 px | separación editorial/hero                        |

Reglas de composición:

- Dentro < entre: el espacio interno siempre es menor que el espacio que separa grupos.
- Un componente no fija margen exterior; el padre gobierna el ritmo.
- Gutter recomendado: `md` en phone, `lg` en tablet y `xl` en desktop.
- Formulario: label→ayuda `xxs/xs`, ayuda→control `sm`, control→error `xs`, field→field `md/lg`,
  grupo→grupo `xl`.
- FormField separa internamente encabezado (label+ayuda) y cuerpo (control+error); un único `gap`
  uniforme para las cuatro piezas no representa sus relaciones.
- Cards: padding `md` compacto, `lg` default y `xl` prominente. No mezclar los tres dentro de una
  misma colección.

## 4. Densidad y controles

`sizes.control` expresa densidad, no importancia:

- `xs` (30) solo para toolbars densas y acciones auxiliares;
- `sm` (36) para data-dense;
- `md` (42) es el default de producto;
- `lg` (50) para formularios prominentes y touch frecuente;
- `xl` (60) para hero/onboarding, no para tablas.

La acción principal se distingue primero por variante y jerarquía, no inflando su tamaño. Los targets
mantienen WCAG 2.2: 24 px CSS mínimo en web y 44 pt en native.

En un control solo-icono, el glifo ocupa aproximadamente la mitad del lado útil del control y deriva
de `sizes.control`; no reutiliza tamaños de texto como escala de iconos. Un `ActionIcon md` de 42 px
produce así un icono cercano a 21 px antes de correcciones ópticas propias del SVG.

## 5. Superficies y elevación

| Nivel | Rol                          | Tratamiento esperado                                      |
| ----: | ---------------------------- | --------------------------------------------------------- |
|     0 | canvas/sunken                | sin sombra; diferencia por superficie                     |
|     1 | card/panel                   | `surface.raised` + border sutil; sombra `xxs/xs` opcional |
|     2 | elemento elevado/sticky      | border sutil + `sm`                                       |
|     3 | dropdown/popover             | `surface.overlay` + border + `md`                         |
|     4 | modal/drawer                 | overlay + `lg`; el backdrop aporta separación             |
|     5 | hero o selección excepcional | glow o gradient; no es elevación estructural              |

Reglas:

- No apilar sombras para compensar superficies indistinguibles.
- En dark, cada nivel debe distinguirse en la lámina de referencia mediante oclusión + rim/borde.
- Una colección de cards usa el mismo nivel; hover no “salta” más de un nivel.
- `withBorder` es parte del lenguaje de elevación, no una decoración arbitraria.

## 6. Effects budget

- Máximo un efecto dominante por región: glow, glass o gradient.
- Las tres superficies de glass usan `blur.md` (subtle), `blur.xl` (default) y `blur.xxl` (strong) con
  saturación de 130–140 % (ADR-028). El glass nunca se anida. La calibración anterior (`sm/md`) dejaba
  el efecto por debajo del umbral perceptible; la escala `blur` en sí no cambió y sigue disponible para
  otros usos.
- `effects.glass.enabled=false` degrada a superficie sólida sin perder jerarquía.
- Glow identifica una acción primaria, selección o feedback excepcional; no se aplica a listas
  completas.
- Gradients son acento de marca en CTA, badge, header o hero. No son fondo dominante en tablas,
  formularios ni lectura larga y nunca pintan texto principal.
- Sombras no animan. Glow ambiental anima solo `opacity/transform` y deriva su duración de motion
  tokens (`expressive × 6` para breathing, `expressive × 12` para recorridos largos).
- Reduced motion elimina loops ambientales y conserva el estado final legible.

## 7. Calidad visual de un componente

Además del testing contract, cada componente visual debe demostrar:

1. **Specimen**: tamaños, variantes y estados alineados sobre una cuadrícula común.
2. **Composition**: uso real con contenido creíble; no lorem de una palabra ni cajas aisladas.
3. **Themes**: `nebula-dark`, `nebula-light`, `sober-light` y `playful` con la misma estructura.
4. **Responsive**: phone y desktop cuando el componente o su composición dependen del ancho.
5. **Density**: default y data-dense cuando aplique.
6. **Motion**: estado normal y reduced motion.

En galerías de iconos, el nombre es la identificación principal y usa al menos `body3`; `caption` se
reserva para metadata secundaria. El tamaño default `1em` de Icon se conserva para uso inline y el
contenedor interactivo gobierna el tamaño cuando el icono representa una acción.

Una review visual responde, en este orden:

- ¿Se entiende qué leer/hacer primero?
- ¿Los grupos se perciben sin depender de bordes adicionales?
- ¿El cuerpo se lee sin esfuerzo y la metadata sigue siendo legible?
- ¿Las superficies se distinguen en light y dark?
- ¿El efecto refuerza un estado o solo agrega ruido?
- ¿Sober y playful siguen siendo el mismo componente, no dos forks visuales?

## 8. Láminas de referencia y gate

El playground mantiene una sección `Foundations/Visual QA` con cinco láminas:

- `Typography`: jerarquía, cuerpo, metadata y medidas de línea;
- `Spacing`: ritmos inline/componente/grupo/sección/página;
- `Surfaces`: niveles 0–4 en los cuatro temas;
- `Actions`: tamaños, variantes, focus, disabled y loading;
- `Forms`: label, ayuda, control, error y grupos en densidad default/compacta.

Estas láminas son el baseline de W2.V. Axe y contrast-check siguen siendo gates automáticos; la
lámina añade el gate humano que hoy falta. Automatizar diffs de captura queda como requisito antes
del cierre de W2, sin introducir una dependencia hasta decidir la herramienta por ADR.

## 9. Deuda detectada al abrir W2.V

| Deuda                                                        | Estado                                                                                                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `caption=8`, `body3=10` y `body2=12` por debajo del baseline | resuelta en W2.V (ADR-024)                                                                                                                               |
| `Text` no fija tamaño ni line-height por defecto             | resuelta en W2.V                                                                                                                                         |
| `Title` usa el mismo peso y tracking en los seis niveles     | resuelta en W2.V; el tracking se volvió efectivo en ADR-027                                                                                              |
| Los temas dark reutilizan sombras negras de light            | **resuelta 2026-07-27 (ADR-028)**: `darkShadows` con oclusión + rim, superficies ensanchadas y semilla `dark` fría                                       |
| Button con duraciones/easings libres                         | resuelta en W2.V                                                                                                                                         |
| Las stories prueban matrices, casi ninguna composición real  | **parcial**: existen las cinco láminas `Foundations/Visual QA` y `Composition`/`AllThemes` en la base y en W2.4–W2.5; falta cubrir el resto del catálogo |
| `FormField.stories.tsx` con radius y padding libres          | resuelta en W2.V                                                                                                                                         |

El checkpoint W2.V corrigió el grueso de esta lista; la calibración de elevación se completó en el
checkpoint de convergencia visual del 2026-07-27
(`docs/reviews/stellaria-ui-convergence-2026-07-27.md`).
