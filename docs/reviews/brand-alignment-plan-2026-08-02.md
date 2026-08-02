# Plan de afinamiento de marca — Nebula como base de las landings de Stellaria

> **Fecha**: 2026-08-02 · **Estado**: propuesta, pendiente de checkpoint del propietario.
> **Origen**: las tres landings en producción están hechas con el mismo tono y tres gramáticas
> distintas. El objetivo de este plan es que **Nebula sea la base**, de modo que las tres se puedan
> reconstruir sobre ella sin recablear, y que un tercero pueda personalizarlas por tema sin forks.

## 0. El principio que ordena todo el plan

**Entre productos solo cambia el color.** Nebula es indigo→violet porque es el neutro del sistema,
no el color de ningún producto: Rosette es rosa, Stellaria azul y Lagrange rojo-naranja, y cada uno
llega por tema (`NebulaTheme`), nunca por fork.

La consecuencia es la vara de medir de esta fase:

> Si dos landings difieren en algo que **no es color**, la que difiere está mal — o el sistema no
> tiene ese algo.

Radio, ritmo, alto de control, mecánica del cristal, escalera de elevación y registro tipográfico
**no son decisiones de producto**. Que hoy las tres difieran en las seis cosas no es variedad de
marca: es que el sistema no las fijó, y cada landing rellenó el hueco a mano. Los seis
desalineamientos de §2 son exactamente esos huecos.

El patrón ya está probado en el repo: la lámina `AllThemes` del playground rinde la misma
composición en los cuatro temas oficiales **más el tema `rosette`**, y lo único que cambia es el
color. Eso es lo que tiene que ser cierto para una landing entera.

## 1. Lo que aporta cada landing, medido en su código

| Landing       | Repo                       | Lo que hace bien                                            | Lo que hace mal                                 |
| ------------- | -------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| **Rosette**   | `Rosettee/src/app`         | Ritmo, jerarquía, animaciones de borde, geometría de acción | El cristal de las cards **no es cristal**       |
| **Stellaria** | `Stellaria/src/app`        | **La receta de cristal correcta**                           | Sombras, scroll, espaciados y nav               |
| **Lagrange**  | `Lagrange/src/web/src/app` | La más limpia: un solo efecto dominante por región          | Exceso de texto, nav antiguo, ritmo y jerarquía |

El destino es la suma: **el ritmo de Rosette + el cristal de Stellaria + la contención de Lagrange.**

## 2. Los seis desalineamientos, con la evidencia

### D1 · El cristal de Rosette no es cristal

```css
/* Rosette — capability-card */
background: linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015));
border: 1px solid rgba(255,255,255,.09);
/* sin backdrop-filter */

/* Stellaria — card  (la correcta) */
border-white/[0.06]  bg-[#101722]/70  backdrop-blur-md  shadow-none
```

La diferencia no es de gusto: **Rosette pinta un velo blanco y Stellaria pinta la superficie a
alpha con un desenfoque real detrás.** Sin `backdrop-filter` no hay cristal, hay barniz — y el velo
blanco sube el punto negro de todo lo que cubre, que es por lo que las cards de Rosette se ven
lavadas sobre el fondo oscuro.

**Regla que sale de aquí**: cristal = **color de superficie a alpha + blur**, nunca blanco a alpha
sin blur. Nebula ya lo tiene bien en `glass.default` (`rgba(15,17,25,.66)` + `blur(16px)
saturate(140%)`); lo que falta es que `Card` lo use por defecto en su variante de cristal.

### D2 · El cristal de un control no es el de una superficie

```css
/* Rosette — botón secundario */
background: rgba(255, 255, 255, 0.035);
border-color: rgba(255, 255, 255, 0.1);
```

Sutil, con borde, sin blur. La variante `glass` de Nebula usa `glass.default` — pensada para una
card de 400 px, aplicada a un botón de 48 px de alto. **A esa escala no hay área que desenfocar**, y
el tinte al 66 % se lee como un botón relleno. Por eso «el glass de los botones es bastante fuerte».

**Regla**: el cristal es una receta **por clase de superficie**, no una sola. Control ≈ `scale.500`
al 3-6 % con borde al 10 %; superficie ≈ `glass.subtle`; chrome ≈ `glass.default`.

### D3 · La geometría de marca no cae en las escalas de Nebula

| Medida             | Marca (medida)  | Peldaño más cercano en Nebula |
| ------------------ | --------------- | ----------------------------- |
| Radio de card      | **32** (`2rem`) | `radius.xxl` = 28             |
| Radio de acción    | **9**           | `radius.sm` = 8               |
| Alto de acción     | **48**          | `control.md` 42 · `lg` 50     |
| Padding de sección | **120**         | `space.xxxl` = 64             |
| Carril             | **1180**        | ✅ ya alineado                |

Cinco de seis medidas caen **entre** peldaños. Es la causa raíz de que cada landing haya inventado
su propia escala: ninguna encontraba la suya en un sistema. Hay que decidir en un sentido u otro
—mover las escalas a la marca, o snapear la marca a las escalas— pero **no se puede dejar a medias**,
porque a medias es exactamente el estado actual.

Por §0, la decisión es **una sola para los tres productos**: estos peldaños no son de Stellaria, son
del sistema. No cabe «radio 32 en Rosette y 28 en Lagrange».

### D4 · En dark la elevación no es sombra

Stellaria y Lagrange coinciden y es deliberado:

```
light →  shadow-[0_18px_60px_rgba(15,23,42,0.06)]
dark  →  shadow-none
```

En dark separan por **color de superficie y rim**, no por sombra proyectada — una sombra negra sobre
fondo negro no separa nada. Nebula es dark-first y su escalera de sombras lleva rim (`inset 0 1px 0`),
pero **sigue proyectando en dark**.

Esto ya está decidido y sin implementar: es **ADR-065** (escalón de superficie ≥1.08 + escalera de
sombras) y el **tramo T3** de `visual-alignment-plan-2026-08-01.md`, que sigue pendiente. El plan de
marca no lo duplica: **lo consume**.

### D5 · La tipografía del hero es fluida y muy apretada

```css
/* Rosette */
font-size: clamp(52px, 5.2vw, 68px);
line-height: 0.94;
letter-spacing: -0.055em;
```

Nebula tiene `h1: 48` fijo, sin fluidez y con `lineHeight.tight` y `letterSpacing.tight` bastante
más sueltos. De ahí que «el tamaño xl del Hero se queda pequeño»: **48 px fijos contra 52-68 px
fluidos**. El titular de marca es un registro tipográfico propio —display—, no el `h1` del sistema.

### D6 · El nav ya converge (y es la prueba de que el método funciona)

```
Stellaria landing-chrome:  arriba → transparente, sin blur
                           scroll → bg-[#101722]/68 + backdrop-blur-xl + border-b
```

Es exactamente lo que hace `Nav floating` en Nebula desde ADR-068. **No hay nada que hacer aquí**, y
sirve de patrón: se midió una landing, se extrajo la regla, se metió en el sistema.

## 3. Tramos

Cada tramo cierra con evidencia medida sobre el render, no sobre el código fuente.

| #      | Tramo                                        | Contenido                                                                                                                                                                  | Bloqueado por      |
| ------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **B0** | Cierre del backlog visual abierto            | ✅ **cerrado 2026-08-02**. `StarField parallax` estaba mal anclado, no era motion (§5.2 para el ritmo medido; lo que quedó abierto pasa a B1)                              | nada               |
| **B1** | Escalas contra la marca (**D3**)             | Decisión de peldaños: radio 32, radio 9, control 48, sección 120. **Requiere checkpoint** — mueve tokens del contrato                                                      | checkpoint         |
| **B2** | Cristal por clase de superficie (**D1, D2**) | Tres recetas —control, superficie, chrome— y `Card` usando la de superficie por defecto                                                                                    | B1 (radio de card) |
| **B3** | Elevación en dark (**D4**)                   | **Implementar ADR-065**: escalón ≥1.08 y escalera de sombras. Es el T3 pendiente                                                                                           | nada — T2 cerrado  |
| **B4** | Registro display del hero (**D5**)           | Escala fluida `clamp()` para el titular, separada de la escala de producto. `Hero size="xl"`                                                                               | B1                 |
| **B5** | Opacidad en las referencias de color         | ✅ **cerrado 2026-08-02** ([ADR-071](../adr/ADR-071-opacidad-en-referencias-de-color.md)). Se adelantó al resto: la landing ya escribía la gramática y `main` no compilaba | nada               |
| **B6** | Reconstruir las tres landings sobre Nebula   | La prueba real del plan: **una sola composición, tres temas**. Si hace falta una prop distinta —no un color distinto— entre ellas, el sistema aún no está                  | B0-B5              |

## 4. El backlog abierto, mapeado

| #   | Punto                                         | Tramo | Nota                                                        |
| --- | --------------------------------------------- | ----- | ----------------------------------------------------------- |
| 1   | `data-padded` por defecto                     | —     | ✅ corregido en `5edafb6`                                   |
| 2   | `StarField parallax` no funciona              | B0    | ✅ era el anclaje, no motion. Diagnóstico en `StarField.md` |
| 3   | `Hero size="xl"` se queda pequeño             | B4    | Es D5: 48 fijos contra 52-68 fluidos                        |
| 4   | `mih` de los botones — Stellaria usa 48       | B1    | Es D3: 48 cae entre `control.md` 42 y `lg` 50               |
| 5   | Variante `glass` de los botones muy fuerte    | B2    | Es D2: falta la receta de cristal de control                |
| 6   | Espaciados de Hero, Nav y Footer              | B0→B1 | ✅ medidos (§5.2). Los dos defectos que salieron son de B1  |
| 7   | Sufijo `.NN` de opacidad (`border.subtle.40`) | B5    | ✅ cerrado en ADR-071                                       |

## 5. Lo que este plan NO decide

- **Las semillas del tema por defecto no se tocan.** Nebula sigue siendo indigo→violet (ADR-020)
  porque es el **neutro del sistema**, no el color de ningún producto — ver §0. Rosette, Stellaria y
  Lagrange entran como temas de producto.
- **Si las tres landings migran o solo sirven de referencia.** B6 las reconstruye en el playground
  como prueba del sistema; migrar los repos reales es otra fase.
- **Nada de native.** Todo lo de aquí es la capa visual web.

## 5.1 Lo que B5 dejó a la vista sobre los gates (2026-08-02)

B5 se adelantó a B0 porque `main` no compilaba: la landing ya escribía `borderColor="border.subtle.40"`
contra una gramática que no existía. Al ejecutarlo aparecieron **tres gates que llevaban tiempo sin
poder dar un veredicto**, y ninguno lo anunciaba:

| Gate             | Estado real en `main`                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `typecheck`      | **Rojo** — 4 errores en `Landing.stories.tsx`                                                                                                                      |
| `size-limit`     | **No arrancaba** — el presupuesto de `Hero` apuntaba a `dist/components/Hero/Banner.js`, que dejó de existir con el renombrado. La corrida abortaba antes de medir |
| `a11y`           | **Rojo** — 4 tests fallando, 2 suites                                                                                                                              |
| `check:contrast` | Verde, 111 pares · 0 FAIL                                                                                                                                          |

Los tres primeros quedan corregidos o acotados: `typecheck` y `size-limit` en verde —este último con
0 excedidos sobre 192 entradas, incluidos los tres que ya estaban rebasados sin que nadie lo viera—
y `a11y` baja de 4 fallos a **1**, preexistente, en `Layout/Shell › AllThemes` (`color-contrast`,
un nodo). **Ese fallo no es de B5 y sigue abierto.**

La lección es la misma que la de §6 pero al revés: no basta con que un gate no detecte un peldaño mal
elegido; hay que comprobar que el gate **está midiendo algo**. Un gate que aborta y uno que pasa se
parecen demasiado en un log.

## 5.2 El ritmo vertical, medido (B0, 2026-08-02)

Medido sobre `patterns-landing--demo` con `tools/render-measure`, a 1600 y a 1280 px. Los dos anchos
dan lo mismo salvo el ancho de viewport, así que la tabla es única:

| Elemento                       | Padding vertical | Gap             |
| ------------------------------ | ---------------- | --------------- |
| `Nav`                          | 12 (`u3`)        | —               |
| `Hero`                         | **90 literal**   | 16 (`md`)       |
| `Section`                      | **90 literal**   | 16 (`md`)       |
| `Main.content` entre secciones | 0                | **64 (`xxxl`)** |
| `Footer`                       | 32 (`xl`)        | 32 (`xl`)       |

**El carril está bien**: `Section` y el interior del `Footer` miden 1180 en los dos anchos, como fija
la enmienda 2 de ADR-070.

Dos hallazgos que B1 tiene que resolver, y que explican por qué el ritmo «no cuadra» a ojo:

1. **Entre dos secciones adyacentes hay 244 px** — 90 del padding inferior de una, 64 del gap de
   `Main`, 90 del padding superior de la siguiente. Nadie decidió 244: es la suma de dos mecanismos
   que no se hablan, el padding del componente y el gap del contenedor de página. Mientras los dos
   sigan vivos, mover el peldaño de sección a los 120 de la marca da 304, no 120.

2. **`90` es el único valor del ritmo que no cae en la rejilla de 4 px** de §3.1 (90/4 = 22.5), y
   está escrito como literal en `Hero.css.ts` **y** en `Section.css.ts`, duplicado en los dos. Eso
   incumple §4.1 —«ningún componente declara alturas en literales»— junto con los `minHeight`
   240/160/120/80 de ambos.

Los dos son de **B1**: elegir el peldaño y decidir quién gobierna el ritmo entre secciones mueve el
contrato y necesita checkpoint. B0 los deja medidos, no corregidos.

## 6. Riesgo principal

**Mover las escalas del contrato (B1) toca todo el catálogo.** `radius`, `sizes.control` y `spacing`
los consumen los 158 componentes, y el gate de `size-limit` y las 85 suites de a11y no detectan un
cambio de peldaño: lo detecta el ojo. Por eso B1 va con checkpoint y por eso B6 existe — sin
reconstruir una landing entera, no hay forma de saber si el sistema quedó alineado o solo distinto.
