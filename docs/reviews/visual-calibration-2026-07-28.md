# Calibración visual — RV

> Ejecución de `prompts/5-review/RV-revision-visual-contra-figma.md` sobre los seis defectos que el
> propietario reportó tras cerrar T1–T6 (`docs/reviews/code-design-audit-2026-07-28.md` §5.5).
>
> **Estado: parcial.** La causa (c) está cerrada. Las causas (a) y (b) están **diagnosticadas con
> medición** y esperan dos cosas: el MCP de Figma —que no estaba disponible en la sesión— y el
> checkpoint del propietario, porque la salida más probable amplía `NebulaTheme`.

---

## 0. Método, y por qué no hizo falta mirar

RV.1 pide recorrer el playground en los cuatro temas. Las tres causas de §5.5 resultaron ser
**medibles**, así que el diagnóstico se hizo calculando relaciones de luminancia entre roles del tema
en vez de juzgándolas a ojo. Eso convierte «se ve raro» en un número que se puede discutir, y hace que
el diagnóstico no dependa de Figma.

Lo que **sí** depende de Figma y del ojo del propietario es la **decisión**: qué relación debe tener
un hover sobre canvas, y cuánto debe separarse la cabecera del cuerpo de un overlay. Eso queda abierto
en §2 y §3.

---

## 1. Causa (c) — alturas en literales · **CERRADA**

### El defecto

`Checkbox` y `Radio` declaraban `SIZE_PX = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 }` y `Switch`
declaraba `SIZE = { md: { w: 38, h: 22 }, … }`, ambos **dentro del `.tsx`**. A igual `size`, un
checkbox medía 18 px y un switch 22. Ningún tema podía recalibrarlos.

El censo de ADR-033 solo miró los `.css.ts`, así que los tres se le escaparon. Corregirlo es aplicar
su punto 6 —«ningún componente vuelve a declarar alturas en literales»—, no decidir nada nuevo.

### La regla no se eligió, se dedujo

`docs/06` §4 ya fija que el glifo de un control «ocupa aproximadamente la mitad del lado útil del
control y **deriva de `sizes.control`**», y ActionIcon ya lo implementa como
`calc(${vars.size.control.md} / 2)`. Aplicado a los tres:

| `size` | `control` | `control / 2` | Switch `h` antes | Checkbox/Radio antes |
| ------ | --------: | ------------: | ---------------: | -------------------: |
| xs     |        30 |            15 |        16 (**+1**) |          14 (**−1**) |
| sm     |        36 |            18 |        18 (**0**)  |          16 (**−2**) |
| md     |        42 |            21 |        22 (**+1**) |          18 (**−3**) |
| lg     |        50 |            25 |        26 (**+1**) |          20 (**−5**) |
| xl     |        60 |            30 |        30 (**0**)  |          24 (**−6**) |

**Switch ya cumplía la regla sin declararla**: cae dentro de 1 px en los cinco peldaños y coincide
exacto en `sm` y `xl`. Los que se habían desviado —hasta 6 px— eran Checkbox y Radio. No hacía falta
inventar una escala ni un peldaño: la regla estaba en el sistema y dos componentes se le habían
escapado.

### Antes / después

| Componente     | Antes (fuente)                     | Después (fuente)                                          |
| -------------- | ---------------------------------- | --------------------------------------------------------- |
| Checkbox       | `SIZE_PX` en `.tsx`, 14→24         | `styleVariants` → `calc(control.<size> / 2)`, 15→30        |
| Radio          | `SIZE_PX` en `.tsx`, 14→24         | `styleVariants` → `calc(control.<size> / 2)`, 15→30        |
| Switch (alto)  | `SIZE.h` en `.tsx`, 16→30          | `theme.sizes.control[size] / 2`, 15→30                     |
| Switch (ancho) | `SIZE.w` en `.tsx`, 28→52          | `track_h * TRACK_RATIO` (1,75), 26,25→52,5                 |
| Switch (gesto) | `travel = SIZE.w - SIZE.h`         | `travel = track_w - track_h`, derivado del mismo contrato  |

**Cambio visual deliberado**: Checkbox y Radio crecen entre 1 y 6 px según el peldaño; Switch se mueve
como mucho 1 px. Es la misma clase de cambio que ADR-033 asumió para Badge y Pagination, y por el
mismo motivo: el tamaño pasa a significar lo mismo en todo el catálogo. Las capturas previas de estos
tres dejan de ser referencia — relevante para el baseline de ADR-037, que va después.

### Dos mecanismos, una sola fuente

Checkbox y Radio resuelven el tamaño con `styleVariants` en el `.css.ts`: `size` es un conjunto
cerrado, así que VE lo resuelve en build y **los dos componentes siguen sin suscribirse al tema**.

Switch **no puede**: su `travel` es un número que alimenta `useMotionValue`, `Rubber()` y la
resolución del gesto por posición y velocidad, y un `calc()` de CSS no es legible desde JS. Toma el
valor de `theme.sizes.control[size]`, al que ya estaba suscrito por el spring de ADR-026.

Que las dos rutas coincidan no requiere sincronización: leen la misma entrada del contrato. Un tema que
recalibre `control` mueve los tres componentes **y** el recorrido del gesto a la vez, que antes era
imposible.

### Deuda anotada, no corregida

`Switch.thumb` calcula su lado como `calc(${switchH} - 4px)` con `top`/`inset` de `2px`. Ese `4px` es
el doble del inset: no es una altura, así que ADR-033 no lo alcanza, pero sigue siendo un literal.
Anotado en `Switch.md` para cuando se toque el componente; mezclarlo aquí habría ensanchado la causa.

### Lo que esto dice de los gates

Ningún test del catálogo afirma nada sobre el tamaño de estos tres componentes: la suite pasó igual
antes y después de cambiar sus alturas. Es la tesis de §5.5 en su forma más literal —maquinaria
verificada por un gate que miraba a otro sitio— y un argumento más para ADR-037.

### Gates

`build · typecheck · lint · test` en verde (452 tests), `check:contrast` 28 pares × 5 temas sin fallos,
`size-limit` 78/78 dentro de budget. Los tres módulos **adelgazan** al retirar las tablas del `.tsx`:

| Componente | Antes | Después | Budget |
| ---------- | ----: | ------: | -----: |
| Checkbox   | 12,03 |   11,99 |     16 |
| Radio      | 11,60 |   11,61 |     12 |
| Switch     | 25,79 |   25,66 |     30 |

---

## 2. Causa (a) — `surface.sunken` como hover sobre canvas · **DIAGNOSTICADA, ABIERTA**

Afecta a Accordion (defecto 2) y Pagination (defecto 5), que usan literalmente el mismo token de hover.

### La medición

Relación de contraste entre `surface.sunken` (el hover) y `surface.base` (el canvas sobre el que se
apoyan estos componentes), en los cuatro temas oficiales:

| Tema         | `sunken` / `base` |
| ------------ | ----------------: |
| nebula-dark  |          **1.01** |
| nebula-light |              1.06 |
| playful      |              1.06 |
| sober-light  |              1.11 |

**1.01:1 no es un hover débil: es ninguno.** Y el escalón varía más de 10× entre temas, así que no hay
ajuste local que lo arregle en los cuatro a la vez. El propietario tenía razón y el defecto es
sistémico, no de Accordion ni de Pagination.

### La pregunta abierta

`surface.sunken` significa «superficie hundida respecto al canvas». Un hover **no es** una superficie
hundida: es una superficie que responde. Que se haya usado como hover es una apropiación por falta de
un rol adecuado, y en dark la apropiación se rompe porque `sunken` (#06080f) está a 1 % de `base`
(#080a12).

Las dos salidas posibles, ambas de contrato:

- **Un rol nuevo** en `colors.surface` —`hover`, o un par `hover`/`active`— con un escalón garantizado
  contra el canvas en los dos esquemas.
- **Ningún rol nuevo**: los componentes que se apoyan en canvas usan `surface.raised` como hover
  —1.05 en dark, 1.02 en light— y se recalibran las superficies para que el salto sea perceptible en
  ambos esquemas.

Ambas tocan `NebulaTheme`, los cuatro temas, el schema de Zod, el Theme Creator y la paridad native.
**Checkpoint obligatorio antes de tocarlo**, tal como pide RV.1.

## 3. Causa (b) — la escalera dentro de un overlay · **DIAGNOSTICADA, ABIERTA**

Afecta a Modal y Drawer (defecto 1).

### La medición

Relación entre `surface.overlay` (cabecera) y `surface.sunken` (cuerpo):

| Tema         | `overlay` / `sunken` |
| ------------ | -------------------: |
| nebula-dark  |             **1.14** |
| nebula-light |                 1.06 |
| playful      |                 1.06 |
| sober-light  |                 1.20 |

El mismo par de roles produce **2,3× más salto en nebula-dark que en nebula-light**. Eso es exactamente
el «la relación se percibe invertida» del reporte: no está invertido el orden —`sunken` es más oscuro
que `base` en los dos esquemas— sino la **magnitud**, y en dark el cuerpo deja de leerse como
superficie hundida y pasa a leerse como hueco.

### La pregunta abierta

`docs/06` §5 y ADR-028 definen la escalera de elevación **respecto al canvas**. Ninguno de los dos dice
qué relación deben guardar dos superficies **dentro de un mismo contenedor elevado**, que es el caso de
la cabecera y el cuerpo de un overlay. Es un hueco de la especificación, no un fallo de implementación.

Sospecha a validar con Figma: probablemente el cuerpo de un overlay no deba ser `sunken` en absoluto,
sino la misma superficie que la cabecera con el separador expresado por borde. Eso lo resolvería sin
tocar el contrato, y es la razón de no proponer un rol nuevo aquí hasta verlo.

---

## 4. Lo que queda

| Causa / defecto                                  | Estado                                        |
| ------------------------------------------------ | --------------------------------------------- |
| (c) alturas de Checkbox · Radio · Switch (def. 3) | **cerrada**                                   |
| (a) hover sobre canvas (def. 2 y 5)              | diagnosticada · checkpoint de contrato        |
| (b) escalera dentro de overlay (def. 1)          | diagnosticada · pendiente de Figma            |
| (4) densidad de Segment en dark                  | sin abrir                                     |
| (6) estados de NavLink                           | sin abrir · **pase propio**, no ajuste de token |

**Los síntomas de Pagination, NavLink y Segment no se tocan todavía, a propósito.** ADR-038 de la
auditoría WV (`docs/reviews/variantes-cobertura-2026-07-28.md`) hace que esos tres resuelvan su
superficie desde `variantMap`. Calibrar sus hovers a mano ahora y volver a calibrarlos al adoptar
`variant` es hacer el trabajo dos veces; se resuelven dentro de su tramo, una sola vez.

El orden se deduce de ahí: **las causas (a) y (b) son sobre los roles del contrato, y las recetas de
variante los referencian.** Los roles tienen que estar bien antes de que once componentes escriban
recetas contra ellos.

## 5. Lo que Figma tendría que resolver

Lista de decisiones que `docs/06` no especifica y que quedaron abiertas por no tener la referencia de
diseño. Se incorporan a `docs/06` cuando se cierren:

1. **Escalón mínimo perceptible de un hover de superficie**, expresado como relación y no como color,
   válido en light y dark.
2. **Relación entre superficies dentro de un contenedor elevado** (cabecera/cuerpo de overlay): si hay
   dos superficies o una sola con separador.
3. **Si el hover de un elemento sobre canvas sube o baja** respecto a él. Hoy baja (`sunken`), que es
   contraintuitivo para un estado de respuesta y es lo que rompe en dark.
4. **Jerarquía de los estados simultáneos de NavLink** —activo, hover, disabled, con hijos, con
   descripción, con secciones—, que es el defecto 6 y el que el propietario señala como peor.
