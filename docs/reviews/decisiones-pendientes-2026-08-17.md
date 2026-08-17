# Decisiones pendientes del propietario — 2026-08-17

> Todo lo que la auditoría visual VA1 dejó en tus manos. Cada punto trae **opciones y una
> recomendación**, con la medida y la regla que la sostienen.
>
> **Estado 2026-08-17, cierre**: el propietario decidió **las trece**, todas por la recomendación.
> Once están **aplicadas y verificadas** (§0). Quedan dos: **§10**, que la medición no cierra y decide
> la vista, y el resto de **§13**, que pide criterio y no un `sed`.

## Resumen — la recomendación de cada punto

| #       | Decisión                                | Recomendación                                     | Coste |
| ------- | --------------------------------------- | ------------------------------------------------- | ----- |
| **§1**  | Veredicto de ADR-037                    | **Firmar ya** y recapturar los dos baselines      | bajo  |
| **§2**  | Un peldaño de **24 px** en `control`    | **Hacerlo** — cierra tres hallazgos de golpe      | medio |
| **§3**  | `glass` y `gradient` sin hover          | **`liftHover`**, el token muerto que ya existe    | bajo  |
| **§4**  | Campo sin frontera (AA)                 | **Aceptar por escrito** — no hay salida           | bajo  |
| **§5**  | Escalera bajo el 1.08 de ADR-065        | **Mantener la regla**, anotar la deuda            | bajo  |
| **§6**  | `Shell` scrollea a 360                  | ✅ **hecho** · suelo 360 + rejilla que colapsa    | medio |
| **§7**  | `height` fija en seis componentes       | ✅ **hecho** · cuatro migrados, dos son cuadrados | bajo  |
| **§8**  | Reponer los pares del gate de contraste | ✅ **hecho** · 53 en `deuda`, gate verde          | bajo  |
| **§9**  | Las dos curvas sin token                | ✅ **decidido** · se quedan                       | cero  |
| **§10** | `leading.h1 = 1.0`                      | ⏳ **tuyo** · envuelve de verdad, pero no choca   | bajo  |
| **§11** | `button` duplica a `body2`              | ✅ **hecho** · el porqué escrito en docs/06 §2.1  | cero  |
| **§12** | Inset distinto campo/botón              | ✅ **hecho** · la regla escrita en docs/06 §4     | cero  |
| **§13** | Once divergencias `docs/` ↔ código      | ◐ **5 de 11** corregidas y verificadas            | bajo  |

Si solo haces tres: **§1, §2 y §3**.

---

## 0. Lo que ya está hecho

| Cambio                                         | Dónde                                                  | Verificado                          |
| ---------------------------------------------- | ------------------------------------------------------ | ----------------------------------- |
| `AURORA_BLUR` 50 px → `vars.blur.xxl`          | `StarField`                                            | landing idéntica                    |
| 9 duraciones a mano → tokens                   | `StarField` `Loader` `Progress` `Skeleton` `Indicator` | desvío ≤5 %                         |
| `Code` inline gana su `max(…, 12px)`           | `Code`                                                 | 10.5 px → 12 px                     |
| **§1** declaración de ADR-037 + deuda aceptada | ADR-161, `docs/03` §1, `docs/06` §5                    | WR queda cerrable                   |
| **§2** `control.xxs` 20 → 24                   | ADR-162, `tokens/layout.ts`                            | sin cambio de contrato              |
| **§2** `Tag` y `DataGrid` al peldaño nuevo     | `Tag.css.ts`, vía token                                | desborde **+10 → 0**, los 4 a 28 px |
| **§2** `ThemeIcon` encajado en las escalas     | `ThemeIcon.css.ts`                                     | 26 y 17/21/27 fuera → todos dentro  |
| **§3** hover de `glass` y `gradient`           | `Button` `ActionIcon` `QuickAction`                    | se levantan −2 px; las otras 6 no   |

Los cuatro son **geometría o motion, cero color**, con `build typecheck lint test` en **34/34**.

---

## §1 · El veredicto de ADR-037

`docs/05-roadmap.md` §WR pide «declaración explícita de que el aspecto está estable». `wr-closure.md`
deja escrito que **es tuya y no de una verificación**. El baseline **ya se capturó** el 2026-08-08 sin
esa condición.

| Opción                                                              | Qué implica                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **A · Firmar ahora**                                                | WR cierra. Recapturar `win32` y generar por fin `linux`            |
| B · Esperar a cubrir el tema claro y las cuatro familias que faltan | Más cobertura, pero **no cambia el gusto**, que es lo que se firma |
| C · Dejarlo                                                         | El gate 8 sigue comparando contra un baseline sin condición        |

**Recomiendo A.** Tres motivos: la declaración es de gusto y **ya la diste de hecho** al rechazar las
cuatro propuestas de color tras verlas renderizadas; lo que falta de auditoría no cambiaría esa
respuesta; y **los cuatro arreglos aplicados ya mueven píxeles**, así que hay que recapturar de todos
modos — este es el momento barato, no el caro.

Va acompañado de aceptar por escrito §4 y §5, que es lo que queda abierto a sabiendas.

---

## §2 · El peldaño que falta: 24 px en `control`

**Tres hallazgos distintos son el mismo hueco.**

| Hallazgo                 | Qué pasa                                      | Con un peldaño de 24         |
| ------------------------ | --------------------------------------------- | ---------------------------- |
| `Tag` (§0, ya arreglado) | le quedan **+2 px**: hijo 28 en padre 28      | hijo 24 → **cabe exacto**    |
| `DataGrid`               | declara **24**, su hijo mide **28**           | hijo 24 → **cabe exacto**    |
| `ThemeIcon`              | declara **26**, que no está en ninguna escala | 24 es el peldaño que buscaba |

Hoy `control` va **20 → 28** y `compact` **28 → 32**. Entre 20 y 28 no hay nada, y 24 es justo el
mínimo táctil de WCAG 2.2 SC 2.5.8 — así que un peldaño ahí es **el más pequeño que puede ser
interactivo**.

| Opción                              | Qué implica                                                             |
| ----------------------------------- | ----------------------------------------------------------------------- |
| **A · Añadir `control` de 24**      | ADR + amplía `SizeName`. Cierra los tres. Aditivo                       |
| B · Aceptar los tres desbordes      | Coste cero, y `docs/06` §4 queda como regla que el catálogo incumple ×3 |
| C · Arreglar cada uno por su cuenta | Tres parches distintos para una sola causa                              |

**Recomiendo A.** Es exactamente lo que `docs/06` §4 prescribe —«si una altura no cabe en ninguna de
las dos escalas, la discusión es **qué peldaño falta**, no qué `rem` escribir»— y resuelve tres
hallazgos con una decisión.

**El coste real**: `NebulaTheme.sizes.control` gana una clave obligatoria, así que un tema de terceros
dejaría de validar. **Hoy no existe ninguno fuera del repo**, y los seis paquetes llevan publicados
desde el 2026-08-12 en `0.1.0` — es el momento más barato que va a haber.

---

## §3 · `glass` y `gradient` no responden al puntero

Verificado dos veces: en la matriz de 49 celdas las dos filas son idénticas en las siete escalas, y en
vivo **ninguna cambia** fondo, borde ni sombra al pasar el ratón. Causa única: su fondo no sale de
`scale.*`, y el hover está implementado desplazando un peldaño de escala.

Nielsen, _visibilidad del estado del sistema_. **Esta parte no es de color** —es ausencia de estado— y
entra de lleno en alcance.

| Opción                     | Qué implica                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| **A · `liftHover`**        | `transform: translateY(-2px)`. El token **ya existe y no lo usa nadie**         |
| B · Opacidad en hover      | También sin color, también cumple la regla de hot paths                         |
| C · Declararlo por escrito | «Son variantes de marca que ignoran `color` y no responden» — hoy nadie lo dice |

**Recomiendo A.** `animation.transforms.liftHover: "translateY(-2px)"` está en el contrato, buscado en
todo el monorepo tiene **cero consumidores**, y hace exactamente esto. Cumple `docs/03` §2 regla 1
—solo `transform` y `opacity` en hot paths— y **no toca un solo color**.

Es el punto con mejor relación entre lo que arregla y lo que cuesta.

> Si eliges C, hay que enmendar `docs/02` §2 punto 3, que hoy promete lo contrario.

---

## §4 · El campo sin frontera visible · **corrección a lo que escribí antes**

**Medido** — un campo dentro de una `Card`: borde a **1.00** en `dark` (mismo hex que la superficie) y
**1.083** en `light`. WCAG 2.2 SC 1.4.11 pide 3:1 y `docs/03` declara AA estricto.

**Me corrijo**: en la primera versión de este documento sugerí «una salida no cromática — más grosor
de borde». **Es falsa.** SC 1.4.11 mide **contraste**, y el contraste es color: engrosar un borde de
1 px a 2 no cambia su ratio. No existe una tercera vía.

| Opción                               | Qué implica                                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A · Aceptar el hueco por escrito** | Queda firmado y no implícito. `docs/03` gana la excepción declarada                                                                                    |
| B · Reabrir el color                 | Es [ADR-159](../adr/ADR-159-el-borde-sale-de-la-rampa-neutra-y-no-de-la-del-lienzo.md), que ya rechazaste al verlo: el borde a 6:1 arruinaba el diseño |

**Recomiendo A.** B ya se probó, se midió y se descartó **mirándolo**, que es el criterio correcto. Lo
que no puede quedarse es implícito: hoy `docs/03` promete «WCAG 2.2 AA estricto» sin excepciones, y
hay una.

La excepción a escribir es estrecha: **el borde en reposo del campo `outline`**. Nada más.

---

## §5 · La escalera de elevación bajo el 1.08 de ADR-065

**Medido** — `light` falla **los tres** escalones (1.026 · 1.035 · 1.045), `dark` dos de tres. Lo
implementó `051aa65` y **lo revirtió ADR-088 sin decirlo**.

| Opción                                     | Qué implica                                                      |
| ------------------------------------------ | ---------------------------------------------------------------- |
| **A · Mantener la regla, anotar la deuda** | El doc sigue diciendo la verdad sobre lo que se quiere           |
| B · Bajar la regla a lo que cumple (~1.03) | El doc deja de mentir, pero **la regla deja de significar nada** |
| C · Restituir la rampa                     | Color, hoy vetado. Es ADR-158, rechazada                         |

**Recomiendo A.** B es la tentación fácil y la peor: una regla ajustada al código roto ya no puede
detectar que se rompa más. ADR-065 razonó bien —«un escalón de elevación nunca separa menos que un
escalón de hover»— y ese razonamiento sigue siendo correcto aunque hoy no se cumpla.

Basta con una nota en `docs/06` §5: la regla es 1.08, el código da 1.03, **y se acepta a sabiendas
mientras el color esté fuera de alcance**.

---

## §6 · A 360 px el layout se rompe

Barridas **136 historias × 2 anchos**: 13 hallazgos a 1280 —de los que **doce son falsos positivos de
mis propios chequeos** y uno es real (`DataGrid`, §2)— y 15 a 360. Cuatro con **scroll horizontal de
página**:

| historia                            | documento a 360 | ¿es del componente?   |
| ----------------------------------- | --------------- | --------------------- |
| `Layout/Shell` · Default            | **604 px**      | **sí**                |
| `Navigation/Overview` · Composition | **686 px**      | **sí**                |
| `Motion/Reveal` · Variants          | desborda        | no — lámina de matriz |
| `Foundations/QA/Actions` · Sizes    | desborda        | no — lámina de matriz |

En `Shell`, el carril de navegación y el contenido quedan **lado a lado** en vez de superponerse: el
contenido arranca en 610 px con un viewport de 360.

| Opción                                  | Qué implica                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| **A · Arreglar `Shell` y `Navigation`** | Un shell que scrollea de lado en móvil es un defecto claro       |
| B · Declarar que el suelo real es 768   | Legítimo si el producto no va a móvil — pero **hay que decirlo** |

**Recomiendo A, y B de todos modos.** El arreglo del `Shell` vale la pena aunque el suelo sea 768,
porque 604 px de scroll lateral no es un layout apretado sino roto. Y el suelo **no está escrito en
ningún sitio**: el encargo de VA1 dice 360, `breakpoints.phone` dice 576. Decidir cuál manda cuesta
una línea y evita esta ambigüedad para siempre.

---

## §7 · `height` fija contra `docs/06` §4

**Seis** componentes declaran `height` sobre `sizes.control` —`ActionIcon`, `Button`, `Calendar`,
`GlobalSearch`, `GridPicker`, `Pagination`— y **seis** declaran `minHeight`. La regla dice «nunca
`height`».

**Matiz**: la consecuencia que el doc predice —«recorta el contenido»— **no ocurre**. Con
`white-space: nowrap` la etiqueta larga **se sale de la caja** en vez de recortarse. Y medido a 360 y
768, **hoy no le pasa a nadie**: las etiquetas del catálogo son cortas.

| Opción                  | Qué implica                                            |
| ----------------------- | ------------------------------------------------------ |
| **A · Migrar los seis** | Mecánico, sin riesgo: la mitad del catálogo ya lo hace |
| B · Enmendar la regla   | Habría que explicar por qué seis sí y seis no          |
| C · Dejarlo             | Deuda latente: le pasará a la primera traducción larga |

**Recomiendo A.** Es el punto más barato de la lista: cambio mecánico, riesgo casi nulo, y cierra una
divergencia que hoy parte el catálogo por la mitad.

---

## §8 · Reponer los pares que el gate de contraste dejó de medir

Al revertir la serie de color se revirtió también la ampliación del gate. **`border.default`,
`border.subtle` y la distancia entre superficies adyacentes vuelven a no medirse** — y son exactamente
los tres huecos de §4 y §5.

| Opción                                                        | Qué implica                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **A · Reponer los 21 pares**                                  | Quedaría en **rojo**, bloqueando PRs y releases hasta decidir §4/§5 |
| B · Reponerlos con los fallos conocidos declarados como deuda | Mide y no bloquea. Pide un mecanismo que hoy no existe              |
| C · Dejarlo                                                   | Los tres huecos no los mira nadie, otra vez                         |

**Recomiendo A si firmas §4 y §5 a la vez**, porque entonces el rojo tiene dueño y fecha. Si no vas a
firmarlos ahora, **C es más honesto que A**: un gate permanentemente rojo enseña a ignorar los gates,
que es justo lo que ADR-160 advertía de la fixture.

---

## §9 · Las dos curvas sin token

`StarField` usa `"ease-in-out"` en la deriva de aurora e `Indicator` usa `"ease-out"` en su pulso.

| Opción                     | Qué implica                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| **A · Dejarlas**           | Dos literales, y el beneficio de moverlas es de pureza                   |
| B · Mapear a `decelerate`  | **Se vería**: `(0,0,0,1)` contra `(0,0,0.58,1)` es bastante más agresivo |
| C · Añadir tokens de curva | Breaking del contrato por dos valores                                    |

**Recomiendo A.** El riesgo visual de B no lo compensa la ganancia, y C es desproporcionado.

> Los cinco `"linear"` de bucle no entran aquí: se comprobó que **no son un defecto**. `linear` es la
> ausencia de curva, y un spinner que acelera se lee como roto.

---

## §10 · `leading.h1 = 1.0`

La caja de línea de `h1` mide exactamente su tamaño de fuente, así que **al envolver, las líneas se
pisan**.

**Recomiendo medir antes de tocar.** No verifiqué que ningún `h1` real del catálogo llegue a envolver:
el titular de la landing usa `font.display`, no `h1`. Si ninguno envuelve, el hallazgo es teórico y no
merece un cambio que alcanza a toda la tipografía. **Es media hora de comprobación** y decide sola.

---

## §11 · `button` duplica exactamente a `body2`

`body2` 14 · `body3` 13 · `button` 14 · `caption` 12. `button` se usa **3 veces** en todo el catálogo,
contra 70 de `body3` y 54 de `caption`.

**Recomiendo dejarlo anotado.** Retirar una clave de `font.size` es breaking del contrato, y el
beneficio es de limpieza. Lo que sí conviene es **decidir qué significa `button`**: hoy solo lo usa el
`Button md`, mientras `lg` y `xl` usan `body1`, que `docs/06` §2.1 define como tamaño de **lectura**.

---

## §12 · Campo y botón no comparten inset

`md` da **16 px** de padding en el campo y **22** en el botón. En la fila más común del catálogo —un
campo y su botón de envío— su texto no arranca a la misma distancia del borde.

**Recomiendo escribir la regla, no igualarlos.** Igualarlos mueve todos los botones o todos los
campos; escribir por qué difieren —el contenido de un campo es editable y el de un botón es una
etiqueta— cuesta un párrafo en `docs/06` §4 y cierra la ambigüedad.

---

## §13 · Once divergencias `docs/` ↔ código

Listadas en [la auditoría del sistema](auditoria-sistema-2026-08-16.md) §4. **No requieren decisión**:
la mayoría las sanciona un ADR posterior que nadie propagó. Un PR de saneamiento y fuera.

---

## Fuera de esta lista, pero pendiente

- **El baseline de `linux` sigue vacío** (ADR-149). El gate 8 está armado y **no verifica nada** hasta
  que se generen, se miren y se comprometan las 78 láminas. Va con §1.
- **El gate de tamaño está en rojo por `GradientBorder`** (26.75 kB de 26.5). **No es de esta
  auditoría** — está entre tus cambios en curso junto a `Card`.
- **Lo que la auditoría no cubrió**: el tema claro y los nueve de producto, cuatro familias sin
  medición propia, y `loading`/`disabled`/`invalid` en ninguna.
