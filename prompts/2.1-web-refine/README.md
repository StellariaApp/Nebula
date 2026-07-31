# Etapa 2.1 — Web Refine (WR)

> Fase intercalada entre **W4** (catálogo completo) y **W5** (publicación). Nace de la deuda 7 de
> [`docs/w4-closure.md`](../../docs/w4-closure.md): el catálogo web está completo y todos los gates
> están en verde, y **ningún gate mide si se ve bien**.
>
> **Requiere**: W4 cerrado.
> **Bloquea**: W5 y el baseline de screenshots de ADR-037.

---

## Por qué va antes de W5 y no después

Tres razones, en orden de peso:

1. **Lo primero que ve un consumidor externo es el aspecto.** Publicar un catálogo cuya calibración
   visual no se ha auditado convierte cada defecto en una incidencia de terceros.
2. **Los arreglos de calibración cambian el aspecto de muchos componentes a la vez.** Después de
   publicar, cada uno de esos cambios es un breaking visual con versión; antes, es trabajo interno.
3. **El baseline de ADR-037 no puede capturarse sobre defectos conocidos.** El gate de screenshot
   diff impide regresiones futuras; esta fase limpia el presente para que ese baseline valga algo.

## Por qué es una fase y no un prompt

Se intentó dos veces en formato corto y las dos se quedaron a medias:

- [`RV-revision-visual-contra-figma.md`](../5-review/RV-revision-visual-contra-figma.md) cubrió
  **6 defectos** puntuales que había reportado el propietario.
- [`docs/reviews/geometria-figma-vs-nebula-2026-07-28.md`](../../docs/reviews/geometria-figma-vs-nebula-2026-07-28.md)
  cubrió **10 componentes** y se cortó con un **429 de la API de Figma** (reintento a ~4,5 días).

Son 144 componentes con superficie visual. No caben en una sesión con la profundidad que esto exige,
y la extracción de Figma no aguanta que ocho agentes llamen a la API por su cuenta.

---

## Las cuatro fases

| Fase | Archivo | Contenido | Prompts | Paralelizable |
| ---- | ------- | --------- | ------- | ------------- |
| **WR1** | [WR1-prompts.md](WR1-prompts.md) | Preparación: censo de cobertura + baseline de Figma a disco | 2 | No |
| **WR2** | [WR2-prompts.md](WR2-prompts.md) | Auditoría visual por familia | 8 | **Sí — 8 agentes** |
| **WR3** | [WR3-prompts.md](WR3-prompts.md) | Consolidación por causa + plan de alineación | 1 | No |
| **WR4** | [WR4-prompts.md](WR4-prompts.md) | Ejecución de los tramos del plan + cierre | 1 + N | Parcial |

**Orden estricto.** WR2 no arranca sin el censo de WR1.1 en verde: no tiene sentido auditar el aspecto
de un catálogo cuya extensión no está verificada — es exactamente el fallo que destapó cuatro
componentes ausentes al cerrar W4.

## Gate de la fase

`docs/wr-closure.md` con:

- Los ocho informes de familia completos, o las familias no auditadas declaradas con su motivo.
- El consolidado por causa y el plan ejecutado (o los tramos pendientes, con su razón).
- Los cuatro gates de siempre en verde tras cada tramo: `pnpm turbo build typecheck lint test` +
  `check:contrast` + `size` + `a11y`.
- Los ADRs que hayan salido de las causas de contrato.
- Confirmación de que el aspecto está estable para capturar el baseline de ADR-037.

---

## Acceso al diseño

| Dato | Valor |
| ---- | ----- |
| Archivo | `Polaris` |
| URL | `https://www.figma.com/design/SYZgKuK5o70lmfxVNljxww/Polaris?node-id=6-2252` |
| `fileKey` | `SYZgKuK5o70lmfxVNljxww` |
| Nodo raíz del canvas | `6:2252` |
| MCP | `figma-developer-mcp` (configurado en `.mcp.json`, key en `.env`) |

**La cuota es el recurso escaso.** La extracción de julio murió con un 429 y el sondeo del
**2026-07-31 sigue devolviendo 429**, con `Retry-After` de 157 316 s (~43,7 h): disponible a partir
del **~2026-08-02**. El plan es «starter» con asiento Viewer/Collaborator, el de límite más bajo.

WR1.2 es el **único** prompt que llama a la API; WR2 lee el volcado de disco. Y **WR2 no depende de
WR1.2 para arrancar**: su método pone Figma en el paso 4 de 4 y cada informe declara lo no medido,
así que si la cuota no ha vuelto se audita igual y lo que se resiente son los hallazgos C.

---

## Rúbrica común — vinculante para las ocho auditorías

> Ocho agentes sin una vara común producen ocho opiniones incompatibles. Esto es literal, no
> orientativo.

### Las cinco magnitudes, en este orden

Se revisan **en orden** porque un error de la primera invalida el juicio sobre las siguientes.

| # | Magnitud | Qué se mide | Vara |
| - | -------- | ----------- | ---- |
| 1 | **Estructura** | Qué elementos hay, en qué orden, qué anida a qué | `docs/06` §1–2; la anatomía del componente hermano |
| 2 | **Jerarquía** | Qué se lee primero; contraste de peso, tamaño y color entre título, cuerpo y metadato | `docs/06` §2, §4 |
| 3 | **Peso visual** | Superficie, borde, sombra y saturación: cuánto pesa el componente en su región | `docs/06` §5 (elevación), §6 (effects budget) |
| 4 | **Espaciado** | Padding interno, gap entre hijos, margen entre bloques; ritmo | `docs/06` §3; `spacing.scale` y los `u*` de ADR-045 |
| 5 | **Tipografía** | Tamaño, peso, line-height y tracking por rol de texto | `docs/06` §2; `font.size`/`weight`/`lineHeight` |

### Qué cuenta como hallazgo

Necesita **las tres cosas**, o no se escribe:

1. **Valor medido** — leído del `.css.ts`, del DOM renderizado o del volcado de Figma. Nunca
   estimado, nunca «se ve raro».
2. **Valor esperado** — el que dicta `docs/06`, el token, o el hermano con el que discrepa.
3. **Consecuencia** — qué le pasa al usuario. «Usa `space.sm` en vez de `space.xs`» no es un
   hallazgo; «el gap interno es mayor que el gap entre tarjetas, así que la tarjeta no se lee como
   una unidad» sí lo es.

Prohibido: adjetivos sin número, comparaciones con «otros design systems» sin citar el nodo concreto,
y recomendaciones que no digan qué token usar.

### Severidad

- **A — rompe el sistema**: contradice `docs/06` o discrepa de su familia. Se arregla.
- **B — inconsistencia local**: correcto en aislado, incoherente junto a sus hermanos. Se arregla si
  no abre contrato.
- **C — mejora**: el diseño resuelve algo que Nebula no especifica. Va a la propuesta, no al arreglo.

### Los cuatro temas, siempre

Todo hallazgo se verifica en `nebula-dark`, `nebula-light`, `sober-light` y `playful`. Un defecto que
solo existe en uno se marca como tal: suele significar que el token está mal elegido, no el valor.

### Figma no es la autoridad

Es **Polaris**, no Nebula. Donde discrepe con `docs/06`, gana `docs/06` y se reporta. Donde resuelva
algo que `docs/06` no especifica, se propone como **C**. Copiar decisiones de otro design system sin
pasarlas por la especificación es lo que hay que evitar, no lo que hay que hacer.

---

## Alcance

**144 componentes con superficie visual** de los 154 del catálogo. Se excluyen los 10 que no pintan
nada: `Conditional`, `Valid`, `Omit`, `Portal`, `FocusTrap`, `VisuallyHidden`, `PermissionGate`,
`DirectionProvider`, `Transition` y `Collapse` (los dos últimos son maquinaria de animación sin
aspecto propio).

## Lo que esta fase no es

No es un rediseño. `docs/06-visual-language.md` es la especificación cerrada y la vara: se busca
**dónde la implementación no la cumple** y **dónde la especificación no dice nada**. Las dos salidas
son legítimas; inventar una tercera dirección visual porque Polaris hace otra cosa, no.
