# Geometría: Figma `Polaris` contra el catálogo web de Nebula

> Comparación de estructura —padding, gap, altura, radius y tamaño de texto— entre el archivo de
> diseño y la implementación actual. Nace de la observación del propietario: «se ven mucho mejor los
> del Figma».
>
> **Alcance**: Card, Nav Tab Bar, Modal, pills, Pagination, Breadcrumbs, Sidebar, Notifications Panel,
> FieldPills, FieldSelect.
>
> **Estado**: análisis y plan. No se ha tocado código.

---

## 0. Límite de la medición, dicho antes que nada

La API de Figma cortó por límite de plan (429, reintento a ~4,5 días) a mitad de la extracción. Lo que
sigue se apoya en:

- **Medido nodo a nodo**: Modal, Pagination Item, Breadcrumbs, Pills/Pill, FieldSelect.
- **Resuelto del volcado completo del canvas** (`#6:2252`, profundidad 3, con `ELEMENTS` y
  `GLOBAL_VARS` expandidos): Nav Tab Item, Nav Tab Bar, Metric Card, Plan Card, Address Card,
  Notifications Panel, Sidebar, Sidebar Nav Item, Menu Item, FieldPills.
- **No medido**: el interior de FieldPills, de Notifications Panel y de Sidebar —tengo su contenedor,
  no sus filas—. Las conclusiones sobre esos tres son de contenedor.

Ningún número de este informe es estimado: todos salen del archivo o del código.

---

## 1. El hallazgo que explica los demás

No es que los componentes del Figma estén mejor dibujados. Es que **Nebula no puede expresar sus
medidas**.

### La escala de spacing tiene un agujero justo donde vive la UI densa

| Escala           | Valores en px                                 |
| ---------------- | --------------------------------------------- |
| Nebula (`space`) | 0 · 2 · 4 · **8** · **16** · 24 · 32 · 48 · 64 |
| Figma (usados)   | 4 · **6** · 8 · **10** · **12** · **14** · 16 · **20** · 24 · 32 |

Entre `sm` (8) y `md` (16) Nebula **no tiene nada**. Y ahí es exactamente donde el Figma pone casi todo
su padding de control: 10/16 en la pestaña, 8/12 en el menú, 10/12 en el ítem de sidebar, 6/12 en la
pill, 6/10 en el paginador, 14/16 en el input, 16/20 en la card.

Cuando un componente de Nebula necesita 12, tiene que elegir entre 8 —y queda apretado— o 16 —y queda
inflado—. Eso es lo que se ve.

### La escala de radius está desfasada dos píxeles

| Escala        | Valores en px                          |
| ------------- | -------------------------------------- |
| Nebula        | 0 · 2 · **6** · **10** · **14** · 20 · 28 |
| Figma (usados)| 6 · **8** · **12** · 14 · **16** · 999 |

Las dos son progresiones de +4, pero desfasadas: Nebula va 2·6·10·14, el Figma va 4·8·12·16. Solo
coinciden en 6 y 14. El Figma redondea sistemáticamente más que Nebula en cards (12 contra 10) y en
overlays (16 contra 14).

### El texto de UI corre a otra talla

El Figma resuelve la interfaz densa en **11–12 px**. Nebula, en `md`, mete `body1` = **16 px** en los
campos. En el mismo alto de control (42–43 px) eso deja mucho menos aire alrededor del texto.

---

## 2. Componente a componente

Alturas de Nebula: `control` = 30 · 36 · 42 · 50 · 60 (`xs`…`xl`).

### 2.1 Pagination — el más desalineado

| | Figma (`Pagination Item`) | Nebula (`Pagination`) |
| --- | --- | --- |
| Alto | **~27 px** (hug: 6+6 + texto 12) | **42 px** en `md` (`control.md` forzado) |
| Padding | 6 / 10 | — (alto fijo, sin padding) |
| Radius | 6 | 6 (`sm`) ✔ |
| Texto | 12 / 500 (600 activo) | `body2`–`body1` |
| Gap | — | 2 (`xxs`) |
| Activo | fill `#2C6FD1`, texto blanco | por `variant` |
| Disabled | fill sólido + texto al 40 % | opacidad global |

**Gana el Figma.** Un paginador numérico a 42 px de alto es un botón de formulario, no un paginador.
El Figma lo resuelve por padding y deja que el contenido mande. Es literalmente el defecto que el
propietario reportó como «tamaño y espacio de los botones».

### 2.2 Pills / Segment — el más distinto

| | Figma (`Pills`) | Nebula (`Segment`) |
| --- | --- | --- |
| Radius contenedor | **999** | 10 (`md`) |
| Radius ítem | **999** | 6 (`sm`) |
| Padding contenedor | 4 | **`"3px"` literal** |
| Padding ítem | 6 / 12 | `paddingInline` 8, sin bloque |
| Alto ítem | ~25 px (hug) | **42 px** (`control.md`) |
| Texto | 11 / 500 | `button` (14) |
| Activo | fill azul + `0 1px 2px rgba(0,0,0,.06)` | por `variant`, sin sombra |

**Gana el Figma, y por mucho.** Nebula tiene un rectángulo redondeado de 42 px; el Figma, una píldora
de 25. Es la causa más probable del «Segment se ve raro en dark» (defecto 4 de §5.5): a esa altura y
con radius 10, el contenedor lee como caja y no como conmutador.

Nota: el `padding: "3px"` del contenedor es un literal crudo en el `.css.ts` — incumple ADR-033 por la
misma vía que Checkbox y Radio, y **no lo detectó el censo**.

### 2.3 FieldSelect — el más parecido, y el que enseña el patrón

| | Figma (`FieldSelect`) | Nebula (`field` compartido) |
| --- | --- | --- |
| Alto input | 43 | **42** (`control.md`) ✔ |
| Padding inline | 16 | **16** (`md`) ✔ |
| Radius | 12 | 10 (`md`) |
| Gap input↔chevron | **12** | **4** (`xs`) |
| Gap label↔input | 7 | 8 (`sm`) ✔ |
| Texto valor | 12 | **16** (`body1`) |
| Label | 12 / 600 + sub 10 / 400 | `body2`, sin sub-label |
| Helper | 11 / 500 | `caption` (12) |

**Empate técnico en la caja, gana el Figma en el interior.** El alto y el padding coinciden —buena
señal: la escala `control` de Nebula está bien elegida—. Lo que falla es el aire interno: 4 px entre
valor y chevron contra 12 del Figma, y un texto de 16 px donde el Figma pone 12.

### 2.4 Cards

| | Figma | Nebula (`Card`) |
| --- | --- | --- |
| Metric Card | padding **16 / 20**, gap 8, radius 12, borde 1 | padding uniforme 16 · 24 · 32 |
| Plan Card | padding 24, gap 16, radius **16**, borde 1 (**2** si actual) | radius por variante |
| Address Card | sin padding raíz, radius 12 | — |

**Gana el Figma en dos cosas concretas**: padding **asimétrico** (16 vertical / 20 horizontal), que
Nebula no puede expresar porque su prop `padding` es uniforme; y el **borde de 2 px como marca de
selección**, que es un recurso que Nebula no usa.

### 2.5 Nav Tab Bar / Nav Tab Item

| | Figma | Nebula (`Tabs`) |
| --- | --- | --- |
| Padding ítem | 10 / 16 | **`Tabs` no tiene `.css.ts` propio** |
| Gap | 6 | — |
| Activo | borde inferior **2 px** azul | — |
| Barra | fila, borde inferior 1 px | — |

**Gana el Figma por incomparecencia.** `Tabs` se compone de otros componentes y no declara su propia
lámina, así que no hay geometría que comparar.

### 2.6 Sidebar Nav Item contra NavLink

| | Figma (`Sidebar Nav Item`) | Nebula (`NavLink`) |
| --- | --- | --- |
| Padding (full) | **10 / 12** | **4 / 8** |
| Gap | **10** | 8 (`sm`) |
| Alto | hug (~36) | `minHeight` 36 (`control.sm`) ✔ |
| Compact | **44 × 44**, padding 12 | por `control` |
| Radius | 8 | 6 (`sm`) |

**Gana el Figma.** Mismo alto final, pero Nebula lo consigue con `minHeight` y padding mínimo, así que
el texto queda pegado a los bordes; el Figma lo consigue con padding real. Es coherente con que el
propietario señale NavLink como el peor.

### 2.7 Modal

| | Figma | Nebula |
| --- | --- | --- |
| Radius | **16** | 14 (`lg`) |
| Header | 20 / 24 | **16 / 24** (`md`/`lg`) |
| Body | 24 | 24 (`lg`) ✔ |
| Footer | 16 / 24 | **no existe** |

**Casi empate.** La diferencia real es que Nebula **no tiene footer** en el Modal, y el Figma lo trata
como región con su propio padding y borde superior.

### 2.8 Breadcrumbs

**No existe en Nebula.** El Figma lo tiene: padding 14 / 32, gap 8, borde inferior 1 px, chevron 12 px,
icono de inicio 14 px, todos los ítems en azul de enlace.

### 2.9 Notifications Panel y Sidebar (contenedor)

| | Figma |
| --- | --- |
| Notifications Panel | ancho **360**, radius **12**, sin padding raíz (las filas lo ponen) |
| Sidebar abierto | **300 × 640**, borde 1 px |
| Sidebar cerrado | **60** de ancho |
| Sidebar móvil | padding 10 / 12, `space-between` |

Nebula los resolvería con `Paper` + `Drawer`. **El Figma aporta las medidas canónicas**, que hoy no
están escritas en ningún sitio.

---

## 3. Lo que gana Nebula, y no se toca

El Figma no es mejor en todo. Tres cosas que Nebula tiene y el diseño no:

1. **Una escala de tamaños de control.** `control` = 30/36/42/50/60 se aplica a todo el catálogo. El
   Figma **no tiene escala**: cada componente inventa su altura —36 el menú, 43 el input, 44 el ítem
   compacto—. Que el input de Nebula caiga en 42 contra 43 del Figma demuestra que la escala está bien
   elegida; lo que falla es aplicarla donde no toca (Pagination, Segment).
2. **El recipe `field` compartido** (`packages/web/src/styles/field.css.ts`). El Figma repite la
   geometría del campo en FieldSelect, FieldPills, FieldSearch y Field, y ya divergen entre sí.
3. **Todo es temable.** El Figma son hex crudos, y **tiene incoherencias que un contrato habría
   impedido**: Breadcrumbs usa 12 px en light y **10 px en dark**; Pills tiene `gap: 4` en light y
   **sin gap** en dark. Eso no se copia — se corrige al portarlo.

---

## 4. El plan

Tres niveles, de más estructural a más local. **Los niveles 1 y 2 son precondición del 3**: no tiene
sentido recalibrar componentes contra una escala que no puede expresar los valores.

### Nivel 1 — Cerrar el agujero de la escala de spacing · **requiere ADR**

El problema es que `SpacingName` es una unión cerrada de 9 miembros y el salto 8 → 16 no tiene
peldaños. Tres salidas:

| Opción | Qué implica | Coste |
| --- | --- | --- |
| **A. Añadir peldaños intermedios** (`xs2`=6, `sm2`=12, `md2`=20 o similar) | La unión crece a 12 miembros; los nombres se vuelven feos | Bajo en código, alto en nomenclatura |
| **B. Re-escalar a una progresión de 2 en el tramo bajo** (0·2·4·6·8·10·12·16·20·24·32·48) | Coherente con el Figma y con la mayoría de sistemas; renombra todo | Alto: toca cada `.css.ts` |
| **C. Dejar `space` como está y que la densidad viva en `sizes`** | Cero cambio de contrato; los componentes que necesiten 12 lo derivan de `control` | Medio: cada componente resuelve por su cuenta, que es lo que ADR-033 vino a impedir |

**DECIDIDO: opción A** (`ADR-045`). Cinco miembros nuevos nombrados por múltiplo de `unit`: `u1_5`=6,
`u2_5`=10, `u3`=12, `u3_5`=14, `u5`=20. Estrictamente aditivo: ningún nombre ni valor existente cambia.
El coste asumido es que la escala convive con dos sistemas de nombres —tallas para layout, múltiplos
para densidad de control—, y la regla de cuándo usar cada uno se escribe en `docs/06`.

### Nivel 2 — Decidir el desfase del radius · **requiere ADR**

Nebula 2·6·10·14·20 contra Figma 4·8·12·16. Dos salidas:

- **Re-fasar** la escala a 4·8·12·16·20. Es un cambio visual en **todo** el catálogo y rompe cualquier
  captura previa, pero alinea con el diseño y con la convención dominante.
- **No tocarla** y aceptar que las cards de Nebula son 2 px menos redondas. Coste cero.

**DECIDIDO: re-fasar** (`ADR-046`), **contra la recomendación de este análisis**. `xs` 2→4, `sm` 6→8,
`md` 10→12, `lg` 14→16; `xl` y `xxl` no se tocan. Los 72 usos del catálogo consumen el token por
nombre, así que se mueven sin editar un solo `.css.ts`.

Queda por escrito lo que se advirtió al decidirlo: es un cambio visual **simultáneo en todo el
catálogo** y no admite migración progresiva. La razón de hacerlo **ahora** es que ADR-037 todavía no ha
capturado su baseline; después obligaría a regenerarlo entero.

### Nivel 3 — Recalibrar los componentes

En orden de impacto medido:

| # | Componente | Cambio | Depende de |
| - | ---------- | ------ | ---------- |
| 1 | **Segment** | Radius `full` en contenedor e ítem; alto por padding (6/12) en vez de `control`; retirar el literal `"3px"`; sombra sutil en el ítem activo | Nivel 1 (necesita 6 y 12) |
| 2 | **Pagination** | Alto por padding (6/10) en vez de `control`; conservar radius `sm` | Nivel 1 |
| 3 | **NavLink** | Padding 10/12 y gap 10 en vez de 4/8; variante compacta 44×44 | Nivel 1 · y su pase propio de §5.5 |
| 4 | **`field`** | Gap valor↔adorno de 4 → 12; revisar `body1` (16) como texto de campo en `md` | Nivel 1 |
| 5 | **Card** | Admitir padding asimétrico; borde de 2 px como marca de selección | — |
| 6 | **Modal** | Añadir región `footer` con su padding y borde superior | — |
| 7 | **Tabs** | Darle lámina propia: ítem 10/16, gap 6, activo con borde inferior 2 px | Nivel 1 |
| 8 | **Breadcrumbs** | **Componente nuevo**: 14/32, gap 8, chevron 12, borde inferior | Nivel 1 · entra por inventario |
| 9 | **Paper / Drawer** | Documentar las medidas canónicas de panel (360 ancho, radius 12) y de sidebar (300/60 × 640) | — |

### Lo que no entra en el plan

- **Las incoherencias del Figma no se portan**: Breadcrumbs a 10 px en dark y Pills sin gap en dark son
  errores del archivo, no decisiones. Se implementa el valor de light en ambos esquemas.
- **El azul `#2C6FD1`** que el Figma usa para activo/enlace no es el eje de Nebula (ADR-020,
  `#3F37C9 → #9D4EDD`). La geometría se porta; **el color no**.
- **Los tamaños de texto del Figma (10–11 px)** quedan por debajo de lo que `docs/03` admite para texto
  de UI. Se porta la *relación* —label más pequeño que valor, helper más pequeño que label—, no el px.

---

## 5. Decisiones tomadas

| # | Decisión | Resultado |
| - | -------- | --------- |
| 1 | Escala de spacing | **Peldaños intermedios aditivos** — ADR-045 |
| 2 | Escala de radius | **Re-fasar a múltiplos de 4** — ADR-046, contra la recomendación |
| 3 | Ejecución del nivel 3 | **Tramo propio de geometría** (§6) |

Queda **una pregunta abierta**: si `Breadcrumbs` entra en el catálogo. Hoy no está en
`docs/00-inventory.md`, así que añadirlo es alcance nuevo, no calibración. Se decide al abrir el tramo.

## 6. El tramo de geometría (**G1**)

El propietario eligió tramo dedicado en vez de repartir por componente: la densidad se decide una sola
vez y de forma coherente, y el baseline de ADR-037 se captura una sola vez al final.

### Orden, y por qué es este

| Paso | Contenido | Gate de salida |
| ---- | --------- | -------------- |
| G1.0 | ADR-045 y ADR-046 en código: `spacing.scale` +5 miembros, `radius` re-fasado, `docs/02` y `docs/06` | `build typecheck lint test` · `check:contrast` · `size` |
| G1.1 | **Segment** — radius `full`, alto por padding `u1_5`/`u3`, retirar el literal `"3px"`, sombra en el ítem activo | + revisión visual en los 4 temas |
| G1.2 | **Pagination** — alto por padding `u1_5`/`u2_5`, conservar radius `sm` | idem |
| G1.3 | **NavLink** — padding `u2_5`/`u3`, gap `u2_5`, variante compacta cuadrada | idem · **absorbe el pase propio del defecto 6** |
| G1.4 | **`field`** — gap valor↔adorno `xs`→`u3`; revisar `body1` como texto de campo en `md` | idem |
| G1.5 | **Card** — padding asimétrico; borde de 2 px como marca de selección | idem |
| G1.6 | **Modal** — región `footer` con padding y borde superior | idem |
| G1.7 | **Tabs** — lámina propia: ítem `u2_5`/`md`, gap `u1_5`, activo con borde inferior 2 px | idem |
| G1.8 | **Paper / Drawer** — documentar medidas canónicas de panel y sidebar en sus `.md` | — |
| G1.9 | **Breadcrumbs**, si entra | + inventario y a11y APG |

**G1.0 va primero y solo.** Es el único paso que mueve el catálogo entero, y conviene que su cambio
visual se vea aislado antes de empezar a recalibrar componentes encima.

**G1.3 absorbe el pase de NavLink** que `visual-calibration-2026-07-28.md` §4 dejó pendiente como
defecto 6: su problema es de densidad —padding 4/8 contra 10/12— y de jerarquía de estados, y las dos
cosas se resuelven en el mismo sitio.

### Lo que este tramo **no** hace

- No toca color: ADR-044 ya cerró los roles de interacción y `border.subtle` quedó recalibrado.
- No porta el azul `#2C6FD1` del Figma. El eje de Nebula es ADR-020.
- No porta los 10–11 px de texto del Figma. Se porta la **relación** entre label, valor y helper.
- No corrige las incoherencias del Figma: se implementa el valor de light en ambos esquemas.
- No captura el baseline de ADR-037. Eso va **después** de G1.9, no antes.
