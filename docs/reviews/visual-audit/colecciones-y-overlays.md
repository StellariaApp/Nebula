# WR2.5 — Colecciones y overlays

> Auditoría de 15 componentes. 2026-07-31. **No se tocó código.**
>
> ⚠️ **La cobertura es la más baja de las cinco familias auditadas: 3 de 15 con medida de render.**
> Los overlays hay que abrirlos, y el arnés solo consiguió abrir `Menu` y `Modal` (por la vía de
> `CommandPalette`). Lo que sigue está medido de verdad; lo que no está, está declarado en §6 — y es
> la mayoría.
>
> **Sin paso 4 (Figma)**: §4 vacía.

## 1. Resumen

| Origen                                              |     A |     B |     C | Hallazgo |
| --------------------------------------------------- | ----: | ----: | ----: | -------- |
| Separador interno de un contenedor elevado          |     1 |     0 |     0 | A-1      |
| `Menu` — el borde no significa lo mismo por esquema |     1 |     0 |     0 | A-2      |
| Contraste del cuerpo contra el contenedor           |     0 |     1 |     0 | B-1      |
| **Total**                                           | **2** | **1** | **0** | **3**    |

---

## 2. Hallazgos

### A-1 · El separador interno cumple §5.2 en dark y desaparece en light

El foco de esta familia citaba una sospecha del review de julio: que en `Modal` y `Drawer` la relación
de superficies se percibe **invertida** entre light y dark. **Medida, la sospecha era incorrecta, y lo
que hay es peor.** No está invertida: en light **no está**.

- **Componentes**: `Modal` (medido vía `search-commandpalette--abierta`) · **Magnitud 3** ·
  **Severidad A**
- **Valores medidos** (relación de luminancia, fórmula WCAG):

  | Relación               | `nebula-dark` | `nebula-light` | Objetivo §5.2 |
  | ---------------------- | ------------: | -------------: | ------------- |
  | separador ↔ cuerpo     |     **1.253** |      **1.010** | ~1.3–1.4      |
  | separador ↔ contenedor |  **1.331** ✅ |   **1.073** ❌ | ~1.3–1.4      |

  Colores resueltos: separador `rgb(35,39,43)` sobre cuerpo `rgb(15,17,25)` en dark;
  `rgb(246,247,248)` sobre `rgb(248,248,248)` en light.

- **Valor esperado**: `docs/06` §5.2 — «El separador se calibra **por proporción, no por espejo de
  paleta**… El objetivo es **~1.3–1.4 en ambos esquemas**».
- **Consecuencia para el usuario**: en `nebula-light`, la línea que separa la cabecera del cuerpo de
  un overlay tiene una relación de **1.010** contra el fondo que toca: a efectos prácticos, no se ve.
  La cabecera y el cuerpo se leen como una sola superficie continua. En dark el mismo separador
  funciona (1.331 contra el contenedor, dentro de la banda).
- **Matiz que corrige la nota de julio**: el problema **no es de espejo ni de inversión**. Los dos
  esquemas usan el mismo criterio y dark da en la banda; es light el que se queda a un tercio del
  objetivo. La hipótesis de julio llevaba a buscar en el sitio equivocado.
- **Temas**: medido en `nebula-dark` y `nebula-light`. **No medido en `sober-light` ni `playful`**.
- **Token propuesto**: no procede fijarlo aquí — §5.2 pide calibrar por proporción, así que la
  corrección es de tema, no de componente, y afecta a todos los overlays a la vez.

### A-2 · El borde de `Menu` separa el doble en dark que en light

- **Componente**: `Menu` · **Magnitud 3** · **Severidad A**
- **Valores medidos**:

  |                 |   `nebula-dark` |     `nebula-light` |
  | --------------- | --------------: | -----------------: |
  | color del borde | `rgb(69,75,81)` | `rgb(216,219,222)` |
  | fondo del menú  |   `rgb(6,8,15)` | `rgb(255,255,255)` |
  | **relación**    |       **2.266** |          **1.390** |

- **Valor esperado**: `docs/06` §5.2 — ~1.3–1.4. `nebula-light` cae **exactamente en la banda**
  (1.390); `nebula-dark` la supera en un **63 %**.
- **Consecuencia para el usuario**: el mismo rol de borde produce dos lecturas distintas. En dark el
  contorno del menú compite con su contenido —es más contrastado que muchos textos secundarios—;
  en light se comporta como debe. Un menú abierto sobre la misma composición pesa distinto según el
  esquema, que es justo lo que §5.2 quiere evitar.
- **Temas**: los dos medidos. `sober-light` y `playful` no.
- **Token propuesto**: es el mismo problema de calibración de A-1 y se resuelve en el mismo sitio: el
  contrato de bordes por esquema, no el `.css.ts` de `Menu`.

### B-1 · El cuerpo apenas contrasta contra el contenedor

- **Componentes**: `Modal` (y por herencia `Drawer`) · **Magnitud 3** · **Severidad B**
- **Valor medido**: `Modal_surface` `rgb(6,8,15)` ↔ `Modal_body` `rgb(15,17,25)` = **1.062** en dark;
  `rgb(255,255,255)` ↔ `rgb(248,248,248)` = **1.062** en light. Simétrico, lo cual es correcto.
- **Valor esperado**: `docs/06` §5.2 — «cabecera y pie comparten la del contenedor, **el cuerpo
  contrasta**». La única referencia numérica que da la especificación para un escalón de superficie es
  el de interacción de §5.1: **~1.08**.
- **Consecuencia**: el cuerpo del overlay contrasta **menos que un botón en hover**. La estructura de
  tres regiones que §5.2 describe existe en el código pero casi no se percibe.
- **Lo que sí está bien**: la relación es **idéntica en los dos esquemas** (1.062 y 1.062). Eso
  descarta el «espejo de paleta» para este par y es lo contrario del defecto de A-1.
- **Temas**: los dos medidos.
- **Token propuesto**: no procede; entra en la misma decisión de calibración.

---

## 3. Coherencia de familia

**Lo que se puede afirmar con 3 de 15 medidos es poco, y conviene no estirarlo.** Lo que sí se ve:

Los tres hallazgos son **la misma causa vista desde tres sitios**: las superficies y los bordes de
Nebula están calibrados con relaciones de **1.01 a 1.06** entre niveles adyacentes, mientras las dos
únicas referencias numéricas de `docs/06` son **1.08** (escalón de interacción, §5.1) y **1.3–1.4**
(separador, §5.2). Los escalones de superficie del sistema son más pequeños que su propio escalón de
hover.

**Y esto conecta con WR2.1.** Allí, `AppShell` header/navbar/aside contra el lienzo dio **1.012 /
1.017 / 1.073 / 1.017** (A-4 de aquel informe). Aquí, `Modal_surface ↔ Modal_body` da **1.062**. Son
familias distintas, componentes distintos y el mismo orden de magnitud: **no es un defecto de un
componente, es la calibración de la escala de superficies**. Es material de WR3, no de un arreglo
local, y ninguna de las dos auditorías por separado lo habría dicho con esta confianza.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó.

---

## 5. Pendiente de arbitraje del diseño

1. **¿Cuál es el escalón de superficie correcto?** `docs/06` da 1.08 para hover y 1.3–1.4 para el
   separador, pero **no dice cuánto debe separar un nivel de elevación del siguiente**. Los valores
   medidos (1.01–1.06) no incumplen ninguna regla escrita porque esa regla no existe. Es el hueco de
   especificación más grande que han encontrado estas cinco auditorías.
2. **¿El borde y el separador son el mismo problema o dos?** A-1 (separador interno) y A-2 (borde del
   contenedor) fallan en esquemas opuestos: el separador se queda corto en light, el borde se pasa en
   dark. Si la calibración es única, arreglar uno empeora el otro.

---

## 6. No medido

**Cobertura: 3 de 15 componentes con medida de render.** Es la limitación principal de este informe.

| Qué                                                                                                  | Por qué                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Modal` y `Drawer` por su propia lámina**                                                          | El arnés no consiguió disparar `overlays-modal--default` ni `overlays-drawer--default`: el clic sobre los botones de la story no abrió el `[role='dialog']`. Los valores de `Modal` que sí aparecen aquí vienen de `search-commandpalette--abierta`, que lo monta ya abierto. **`Drawer` no está medido en absoluto**; lo que se dice de él es herencia declarada, no medida |
| **El segundo punto del foco: las cuatro listas de opciones**                                         | `Combobox`, `Select` y `MultiSelect` no se pudieron abrir, así que **no se verificó si se ven idénticas** entre sí ni contra el listbox propio de `GlobalSearch`. Era la mitad del encargo y queda sin hacer                                                                                                                                                                 |
| **`Popover`, `Tooltip`, `Dialog`, `HoverCard`, `GlobalSearch`, `TransferList`, `Search`, `Filters`** | Sin medida. De `Popover`, `Dialog` y `HoverCard` solo se sabe, por WR2.1 A-2, que comparten `shadow.lg`                                                                                                                                                                                                                                                                      |
| **`sober-light` y `playful`**                                                                        | Los tres hallazgos están medidos en `nebula-dark` y `nebula-light` únicamente. La rúbrica pide los cuatro; **estos hallazgos están a medio verificar** y podrían comportarse distinto en un tema sin cristal                                                                                                                                                                 |
| **El estado `hover` de las opciones**                                                                | El escalón de §5.1 (~1.08, y `active` al doble del delta) no se midió en ninguna lista                                                                                                                                                                                                                                                                                       |
| **El paso 1: MIRAR**                                                                                 | Ningún overlay se ha visto abierto. A-1 es de los que se detectan a ojo en dos segundos: en light, la cabecera y el cuerpo no se separan                                                                                                                                                                                                                                     |
| **El paso 4: Figma**                                                                                 | No ejecutado                                                                                                                                                                                                                                                                                                                                                                 |

**Lo que este informe sostiene**: tres hallazgos con relación de luminancia calculada sobre colores
resueltos, la regla de §5.2 citada, y una conexión con WR2.1 que ninguna de las dos auditorías veía
sola. **Lo que no sostiene**: nada sobre 12 de los 15 componentes de la familia, ni sobre dos de los
cuatro temas.
