# Calibración visual — RV

> Ejecución de `prompts/5-review/RV-revision-visual-contra-figma.md` sobre los seis defectos que el
> propietario reportó tras cerrar T1–T6 (`docs/reviews/code-design-audit-2026-07-28.md` §5.5).
>
> **Estado: las tres causas cerradas.** (c) se cerró en la primera sesión. (a) y (b) se cerraron en la
> segunda, con el MCP de Figma ya disponible y con el checkpoint del propietario resuelto: la causa (a)
> amplía `NebulaTheme` con dos roles (**ADR-044**) y la (b) resulta ser un defecto de calibración de
> `border.subtle`, no de superficies.

---

## 0. Método, y por qué no hizo falta mirar

RV.1 pide recorrer el playground en los cuatro temas. Las tres causas de §5.5 resultaron ser
**medibles**, así que el diagnóstico se hizo calculando relaciones de luminancia entre roles del tema
en vez de juzgándolas a ojo. Eso convierte «se ve raro» en un número que se puede discutir, y hace que
el diagnóstico no dependa de Figma.

Lo que **sí** dependía de Figma y del ojo del propietario era la **decisión**: qué relación debe tener
un hover sobre canvas, y cuánto debe separarse la cabecera del cuerpo de un overlay. La segunda sesión
las cerró —§2 y §3— con el MCP disponible y dos checkpoints resueltos.

Un matiz que conviene no perder: el Figma se usó como **fuente de intención**, no como pixel-perfect.
De las cuatro preguntas abiertas resolvió tres, en una el propietario decidió lo contrario de lo que
el archivo muestra, y en otra el archivo directamente no tiene el estado. El detalle está en §5.

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
| xs     |        30 |            15 |      16 (**+1**) |          14 (**−1**) |
| sm     |        36 |            18 |       18 (**0**) |          16 (**−2**) |
| md     |        42 |            21 |      22 (**+1**) |          18 (**−3**) |
| lg     |        50 |            25 |      26 (**+1**) |          20 (**−5**) |
| xl     |        60 |            30 |       30 (**0**) |          24 (**−6**) |

**Switch ya cumplía la regla sin declararla**: cae dentro de 1 px en los cinco peldaños y coincide
exacto en `sm` y `xl`. Los que se habían desviado —hasta 6 px— eran Checkbox y Radio. No hacía falta
inventar una escala ni un peldaño: la regla estaba en el sistema y dos componentes se le habían
escapado.

### Antes / después

| Componente     | Antes (fuente)             | Después (fuente)                                          |
| -------------- | -------------------------- | --------------------------------------------------------- |
| Checkbox       | `SIZE_PX` en `.tsx`, 14→24 | `styleVariants` → `calc(control.<size> / 2)`, 15→30       |
| Radio          | `SIZE_PX` en `.tsx`, 14→24 | `styleVariants` → `calc(control.<size> / 2)`, 15→30       |
| Switch (alto)  | `SIZE.h` en `.tsx`, 16→30  | `theme.sizes.control[size] / 2`, 15→30                    |
| Switch (ancho) | `SIZE.w` en `.tsx`, 28→52  | `track_h * TRACK_RATIO` (1,75), 26,25→52,5                |
| Switch (gesto) | `travel = SIZE.w - SIZE.h` | `travel = track_w - track_h`, derivado del mismo contrato |

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

## 2. Causa (a) — `surface.sunken` como hover sobre canvas · **CERRADA (ADR-044)**

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

### Lo que respondió el Figma

Dos componentes independientes del archivo `Polaris` —`Menu Item` en `State=Hover` y
`Sidebar Nav Item` en `State=Active`— coinciden en el mismo valor:

| Modo  | Superficie | Hover     | Escalón | Dirección         |
| ----- | ---------- | --------- | ------: | ----------------- |
| Light | `#FFFFFF`  | `#F4F7FB` |   1.075 | baja (oscurece)   |
| Dark  | `#0A0F1C`  | `#111827` |   1.078 | **sube** (aclara) |

El escalón es **simétrico** y **el signo se invierte con el esquema**. Eso descarta la segunda salida
—reutilizar `surface.raised`—: la dirección de un rol de elevación la fija el nivel, no el esquema.

### La decisión

El propietario eligió en el checkpoint **ampliar el contrato con los dos roles**, `hover` y `active`,
en lugar de solo `hover`: ampliar cuesta lo mismo una vez que dos y evita repetir la migración de los
cuatro temas, el schema, el Theme Creator y la paridad native. Queda en **ADR-044**.

### Antes / después

| Tema         | hover antes (`sunken`) | ratio vs canvas | hover después | ratio vs canvas |
| ------------ | ---------------------- | --------------: | ------------- | --------------: |
| nebula-dark  | `dark.50`              |        **1.01** | `dark.400`    |       **1.085** |
| nebula-light | `light.300`            |            1.06 | `light.300`   |           1.062 |
| playful      | `light.300`            |            1.06 | `light.300`   |           1.062 |
| sober-light  | `gray.100`             |            1.11 | `light.500`   |           1.072 |

En dark el hover pasa de **inexistente a perceptible** y cambia de signo: antes oscurecía 1 %, ahora
aclara 8,5 %. Los cuatro temas quedan dentro de 1.06–1.09, contra un rango previo de 1.01–1.11.

`sober-light` toma sus valores de la paleta `light` porque `gray` no tiene escalón fino —`gray.100` ya
salta a 1.114— y porque ese tema ya mezclaba ambas paletas.

### El tope que apareció al calibrar `active`

`active` no cabía en los temas light: `text.muted` estaba a **0.04 del suelo AA** (4.54 sobre
`light.300`), así que ninguna superficie podía ser más oscura que `sunken` sin romper el gate.

El propietario decidió oscurecer `text.muted` a `gray.700`. Como `secondary` ya ocupaba ese peldaño,
la escalera de texto de `nebula-light` y `playful` se desplaza entera para no colapsar dos roles:

| Rol       | Antes      | Después    | AA sobre `active` |
| --------- | ---------- | ---------- | ----------------: |
| primary   | `gray.900` | `gray.900` |              9.84 |
| secondary | `gray.700` | `gray.800` |              7.68 |
| muted     | `gray.600` | `gray.700` |              5.65 |

Los gaps pasan de 2+1 peldaños a 1+1, y `muted` gana 1,15 puntos de margen sobre el mínimo.
`nebula-dark` y `sober-light` no se tocan: ya pasaban.

## 3. Causa (b) — la escalera dentro de un overlay · **CERRADA**

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

### Lo que respondió el Figma, y por qué no se aplicó

La sospecha era correcta: el Modal del Figma (`#152:1528`) es **una sola superficie**. `header`, `body`
y `footer` no tienen fill propio —heredan el del contenedor— y la separación es un borde de 1 px:

| Modo  | Contenedor | Separador | Relación |
| ----- | ---------- | --------- | -------: |
| Light | `#FFFFFF`  | `#E6ECF3` |     1.19 |
| Dark  | `#05070D`  | `#1B2540` |     1.33 |

**El propietario decidió no adoptarlo**: cabecera y pie comparten color y el cuerpo contrasta, como
estaba. `docs/06` §5 no especificaba este caso, así que no hay conflicto con doc cerrado y la decisión
del propietario gobierna. Queda registrada en `docs/06` §5.2.

### La causa real: el separador, no las superficies

Con las dos superficies confirmadas como intencionales, la medición del borde señala al culpable:

| Tema         | salto `overlay`/`sunken` | borde `subtle` / superficie |
| ------------ | -----------------------: | --------------------------: |
| nebula-dark  |                    1.142 |                   **1.984** |
| nebula-light |                    1.062 |                       1.390 |
| playful      |                    1.062 |                       1.390 |
| sober-light  |                    1.195 |                       1.390 |

`border.subtle` en dark estaba a **1.98 contra 1.39 de los temas light y 1.33 del Figma**: un 43 % más
fuerte que su equivalente. Y `subtle` ya era el borde más suave del contrato, así que ningún componente
podía pedir algo más flojo.

El origen es que los temas eligen el borde por **espejo de paleta** —`gray.200` en light, `gray.800` en
dark— y el espejo no conserva la proporción: las superficies dark están comprimidas contra el negro, de
modo que el mismo peldaño reflejado pesa mucho más. Es la misma clase de error que ADR-028 corrigió
para las superficies.

Eso explica exactamente lo reportado. En light el salto de superficie es flojo (1.06) y el borde carga
la separación; en dark disparan **las dos señales a la vez** y el borde va desbocado. No estaba
invertido el orden: estaba desproporcionado el separador.

### Antes / después

| Tema        | `border.subtle` antes | /base | /raised | /overlay | después    | /base | /raised | /overlay |
| ----------- | --------------------- | ----: | ------: | -------: | ---------- | ----: | ------: | -------: |
| nebula-dark | `gray.800`            |  2.24 |    2.13 |     1.98 | `gray.950` |  1.31 |    1.25 |     1.17 |

Los temas light no se tocan: su 1.39 ya era el objetivo. La corrección **no es del Modal** —es de
`border.subtle` en dark— y alcanza a todo componente con borde sutil del catálogo. En la cabecera del
Modal quedan dos señales suaves, salto de superficie 1.14 más borde 1.17, en vez de una desbocada.

**Residual anotado**: el salto `overlay`/`sunken` sigue siendo 1.14 en dark contra 1.06 en light. Con
los separadores ya proporcionados la señal total queda mucho más pareja entre esquemas, y simetrizar
además las superficies obligaría a recalibrar `sunken` u `overlay` globalmente. No se hace aquí.

---

## 4. Lo que queda

| Causa / defecto                                   | Estado                                          |
| ------------------------------------------------- | ----------------------------------------------- |
| (c) alturas de Checkbox · Radio · Switch (def. 3) | **cerrada**                                     |
| (a) hover sobre canvas (def. 2 y 5)               | **cerrada** · ADR-044 + recalibración de texto  |
| (b) escalera dentro de overlay (def. 1)           | **cerrada** · `border.subtle` en dark           |
| (4) densidad de Segment en dark                   | sin abrir · **el Figma no tiene Segment**       |
| (6) estados de NavLink                            | sin abrir · **pase propio**, no ajuste de token |

**Los síntomas de Pagination, NavLink y Segment no se tocan todavía, a propósito.** ADR-038 de la
auditoría WV (`docs/reviews/variantes-cobertura-2026-07-28.md`) hace que esos tres resuelvan su
superficie desde `variantMap`. Calibrar sus hovers a mano ahora y volver a calibrarlos al adoptar
`variant` es hacer el trabajo dos veces; se resuelven dentro de su tramo, una sola vez.

El orden se deduce de ahí: **las causas (a) y (b) son sobre los roles del contrato, y las recetas de
variante los referencian.** Los roles tienen que estar bien antes de que once componentes escriban
recetas contra ellos.

## 5. Lo que el Figma resolvió, y lo que no

Archivo consultado: `Polaris` (`SYZgKuK5o70lmfxVNljxww`), vía MCP de REST API. Las cuatro preguntas
que quedaron abiertas en la primera sesión, y su estado:

| #   | Pregunta                                                   | Estado                                              |
| --- | ---------------------------------------------------------- | --------------------------------------------------- |
| 1   | Escalón mínimo perceptible de un hover de superficie       | **resuelta** · ~1.08 · a `docs/06` §5.1             |
| 2   | Relación entre superficies dentro de un contenedor elevado | **resuelta**, y el propietario decidió lo contrario |
| 3   | Si el hover sobre canvas sube o baja                       | **resuelta** · el signo depende del esquema         |
| 4   | Jerarquía de los estados simultáneos de NavLink            | **sin resolver** · el Figma no tiene el estado      |

### Lo que el Figma resuelve y `docs/06` no decía — incorporado

- **Magnitud y signo del escalón de interacción** (§5.1 de `docs/06`): ~1.08 en ambos esquemas, con el
  signo invertido —oscurece en light, aclara en dark—. Es el hallazgo que sostiene ADR-044.
- **Calibración del separador por proporción y no por espejo de paleta** (§5.2): el Figma da 1.19 en
  light y 1.33 en dark, ambos del mismo orden. El espejo `gray.200` ↔ `gray.800` daba 1.39 y 1.98.

### Lo que el Figma resuelve y **no** se adopta

- **Overlay de una sola superficie.** El Modal del Figma separa cabecera, cuerpo y pie solo con borde.
  El propietario mantiene las dos superficies. Registrado en `docs/06` §5.2 como decisión suya.
- **El overlay dark del Figma (`#05070D`) es más oscuro que su canvas (`#0A0F1C`).** `docs/06` §5
  nivel 4 y ADR-028 dicen `overlay` —más claro—. Gana `docs/06`, como fija RV.1. No implementado.

### Lo que el Figma no cubre

- **Accordion y Segment no existen en el archivo.** El defecto 4 —densidad de Segment en dark— se queda
  sin referencia de diseño y habrá que resolverlo contra `docs/06` o pedir la lámina.
- **NavLink no tiene estado de hover.** `Sidebar Nav Item` declara `Default`, `Active` y `Disabled`
  —por `Layout=Full|Compact` y modo—, y `Nav Tab Item` declara `Active|Inactive|More|Disable`. Ninguno
  tiene `Hover`. Peor: `Sidebar Nav Item` usa para `Active` **el mismo fill** que `Menu Item` usa para
  `Hover` (`#F4F7FB` / `#111827`). Esa colisión hay que resolverla en el pase propio de NavLink, y el
  Figma no la resuelve.

---

## 6. Gates de la segunda sesión

| Gate                              | Resultado                                        |
| --------------------------------- | ------------------------------------------------ |
| `build · typecheck · lint · test` | 29/29 tasks · **452 tests**                      |
| `check:contrast`                  | **38 pares × 5 temas · 0 FAIL** (28 pares antes) |
| `size-limit`                      | 9/9 tasks · ninguna entrada fuera de budget      |
| `a11y` (axe sobre Storybook)      | **55 suites · 338 tests**                        |

Los roles nuevos suman **10 pares** al gate de contraste —3 roles de texto y 2 de borde sobre cada una
de las dos superficies—, de modo que `hover` y `active` nacen cubiertos y no repiten el hueco que dejó
que `sunken` se usara como hover sin que nada lo midiera.

## 7. Archivos tocados

| Capa          | Archivos                                                                      |
| ------------- | ----------------------------------------------------------------------------- |
| Contrato      | `tokens/src/theme/primitives.ts` · `tokens/src/__checks__/contract.test-d.ts` |
| Enum y schema | `themes/src/enums.ts` (Zod deriva de aquí, no se edita)                       |
| Temas         | `nebula-dark` · `nebula-light` · `playful` · `sober-light`                    |
| Contrato web  | `web/src/theme/contract.css.ts`                                               |
| Componentes   | `Accordion.css.ts` · `Pagination.css.ts`                                      |
| Gate          | `tools/contrast-check/src/pairs.ts` · `smoke-theme.ts`                        |
| Docs          | ADR-044 · `docs/02` §2 · `docs/06` §5.1 y §5.2 · este informe                 |

`Modal.css.ts` **no se toca**: la causa (b) resultó estar en `border.subtle` del tema, no en el
componente.

---

## 6. Simetría de superficies en dark · **CERRADA** — el residual de §3, resuelto

§3 dejó anotado que el salto `overlay`/`sunken` seguía siendo 1.14 en dark contra 1.06 en light, y que
simetrizarlo «obligaría a recalibrar `sunken` u `overlay` globalmente. No se hace aquí». El propietario
volvió sobre ello tras ver el resultado: «no puedes cambiar la escala de colores directamente en el
theme dark, así solucionas todos los problemas al mismo tiempo».

Tenía razón, y la medición lo confirma: **el defecto no era de dirección sino de magnitud**, y estaba
en un solo valor.

### La medición

`sunken` en `nebula-dark` era `dark.50` (`#06080f`), **por debajo del canvas** (`dark.100`, `#080a12`).
Eso producía dos fallos opuestos a la vez:

| Relación                      | light (referencia) | dark antes | Efecto en dark                   |
| ----------------------------- | -----------------: | ---------: | -------------------------------- |
| `overlay`/`sunken` — modal    |              1.062 |  **1.142** | el cuerpo se lee como un agujero |
| `sunken`/`base` — pista, code |              1.062 |  **1.012** | la superficie no existe          |

Un salto 2,3× **de más** contra la cabecera y 5× **de menos** contra el canvas, con el mismo token.

### La decisión

`sunken` pasa de `dark.50` a `dark.300` (`#0f1119`). Es el único valor de la rampa que deja las dos
relaciones dentro de la banda de los temas light:

| Candidato       | `overlay`/`sunken` | `sunken`/`base` |
| --------------- | -----------------: | --------------: |
| `dark.50` antes |              1.142 |           1.012 |
| `dark.200`      |              1.106 |           1.020 |
| **`dark.300`**  |          **1.075** |       **1.049** |
| `dark.400`      |              1.040 |           1.085 |
| light           |              1.062 |           1.062 |

`overlay` **no se toca**: sigue a 1.128 del canvas, que es la elevación por superficie que ADR-028
exige en dark, donde la sombra no tiene recorrido sobre negro.

En dark, «hundido» pasa a expresarse como una elevación leve en vez de como una excavación. No es una
licencia: por debajo del canvas no hay suelo, y el propio ADR-044 ya había establecido que 1.01 contra
el fondo «no es un hover débil, es ninguno». El mismo umbral se aplicaba aquí.

### Alcance — por qué arregla varias cosas a la vez

Todo lo que usa `surface.sunken` estaba invisible contra el canvas en dark y deja de estarlo: cuerpo
del Modal y del Drawer, pista de `Segment`, `Code`, pista de `Progress`, placeholder de `Image`,
`Skeleton` y el fondo de campo deshabilitado. **Un valor, ocho superficies.**

Con esto, `Segment` en dark queda con escalera completa —canvas → pista 1.049 → píldora 1.075— en vez
de con la píldora flotando sobre una ranura inexistente.

### Colapsos aceptados, y por qué

En `nebula-dark`, `sunken` queda ahora en el mismo valor que `raised`, igual que `active` ya coincidía
con `overlay`. Entre `base` y `overlay` la rampa solo ofrece tres peldaños, así que algún colapso es
inevitable, y estos son los menos dañinos: «área hundida» y «tarjeta elevada» son ambas superficies
por encima del canvas y por debajo de un overlay, y rara vez necesitan distinguirse entre sí. Lo que sí
debía seguir separado —`hover` de la superficie sobre la que se aplica— lo está.

El contrato ya tolera este tipo de colapso: en los temas light, `base` y `overlay` valen ambos
`#ffffff`.

**Deuda anotada**: un `Code` dentro de una `Card` queda sin distinción en dark. Si aparece en una
composición real, la salida es ensanchar la rampa `dark` —no reasignar roles—, y eso es ADR-028.

---

## 7. El separador, revisado en pantalla · **CERRADA**

§3 corrigió `border.subtle` en dark tomando como objetivo el 1.39 de los temas light: «los temas light
no se tocan: su 1.39 ya era el objetivo». Al revisarlo el propietario en el playground, la conclusión
fue la contraria —el separador se percibe **demasiado marcado en los dos esquemas**—, y la referencia
apoya esa lectura: el archivo de Figma mide **1.19 en light**, no 1.39. El anclaje se había hecho sobre
el valor existente de Nebula, no sobre el diseño.

| Tema         | antes | ahora | fuente              |
| ------------ | ----: | ----: | ------------------- |
| nebula-light | 1.390 | 1.073 | `gray.50`           |
| playful      | 1.390 | 1.073 | `gray.50`           |
| nebula-dark  | 1.331 | 1.202 | `palettes.dark.600` |
| sober-light  | 1.296 | 1.296 | sin cambio          |

Los dos esquemas bajan y **conservan su proporción relativa**: dark queda por encima de light —1.20
contra 1.07— igual que en el Figma, donde la separación en dark también es la más fuerte de las dos.
`sober-light` no se toca: es el tema de alto contraste por definición y su 1.296 es deliberado.

### En dark el separador sale de la paleta `dark`, no de `gray`

`gray.950` era el peldaño más suave que ofrecía la rampa gris (1.331). Bajar más obligaba a cambiar de
fuente, y la elección natural es `palettes.dark`, que es de donde salen las superficies desde ADR-028.
Tiene una ventaja sobre seguir en gris: al compartir familia de tono con la superficie, el separador se
lee como **un peldaño tonal de la propia superficie** en vez de como un gris ajeno superpuesto.

### Lo que queda abierto: `border.default`

Es un rol distinto y no se toca aquí. Mide **1.74 contra el canvas en los temas light**, por debajo del
3:1 que `docs/03` §1 regla 4 exige a los componentes UI, y el caso importa: el fondo del campo es
`surface.raised`, a 1.02 del canvas, así que **el borde es lo único que identifica un input**.

Suavizarlo agranda ese hueco; endurecerlo va contra la dirección que el propietario pide para la escala.
La salida que resuelve las dos cosas es separar el fondo del campo del canvas, de modo que el borde
deje de ser el único identificador y pueda ser tan suave como se quiera. Es cambio de componente y de
rol de superficie, no de la escala de bordes, y no se hace aquí.
