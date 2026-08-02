# ADR-063 — `disabled`: dos recetas y un rol `surface.disabled`

- **Estado**: **aceptada** · 2026-08-01 (checkpoint de CONTRATO de WR3)
- **Resuelve**: la causa **C9** de `docs/reviews/visual-audit-2026-08-01.md`, abierta desde
  `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §final y confirmada con medida en
  `docs/reviews/visual-audit/acciones-y-navegacion.md` A-2.
- **Enmienda**: `docs/02-theming.md` §2 (contrato `NebulaTheme`) y `docs/06-visual-language.md`, que
  hoy no dicen nada sobre el estado deshabilitado.
- **Alcance**: 14 componentes, los cinco temas oficiales, el schema de Zod, el Theme Creator y la
  paridad con `packages/native`.

## Contexto

El censo de julio encontró **cinco recetas distintas** de `disabled` conviviendo en el catálogo:

| Receta                                 | Componentes                                        |
| -------------------------------------- | -------------------------------------------------- |
| `background` + `opacity`               | `ActionIcon` · `Button`                            |
| `opacity` sola                         | `Checkbox` · `Radio` · `Switch` · `UnstyledButton` |
| `color` solo                           | `Accordion` · `Menu` · `Pagination` · `Segment`    |
| `background` + `color`                 | `NavLink`                                          |
| `background` + `borderColor` + `color` | el recipe `field`                                  |

WR2.3 lo midió en los cuatro temas y cuantificó el contraste entre dos de ellas conviviendo en la
misma familia:

| Componente | `opacity` off | `background` off                                   | `color` off          |
| ---------- | ------------: | -------------------------------------------------- | -------------------- |
| `Button`   |      **0.55** | sin cambio (`rgb(140,155,255)` a plena saturación) | sin cambio           |
| `Segment`  |             1 | transparente en ambos estados                      | → `rgb(130,138,146)` |

Un `Button` deshabilitado se atenúa entero conservando su fondo primario; un `Segment` deshabilitado
mantiene su caja intacta y solo apaga el texto. Puestos en la misma barra de herramientas **no se
leen como el mismo estado**.

El archivo de diseño usa **una sola receta**, verificada en julio sobre `Pagination Item`, `Pill` y
`Nav Tab Item`: **fill sólido** (`#E6ECF3` en light, `#1B2540` en dark) con el **texto al 40 %**. No
es transparencia: es una superficie. El diseño **no atenúa el elemento entero** — le cambia la
superficie y apaga solo la llamada a la acción.

Ese fill **no corresponde a ningún rol del contrato actual**: en light cae entre `surface.sunken` y
`surface.raised`, y en dark coincide casi con `border.subtle`.

**Por qué ningún gate lo detectó**: `check:contrast` **exime `disabled` explícitamente** —WCAG 1.4.3
no exige contraste mínimo para controles deshabilitados— y axe tampoco lo mira.

## Decisión

1. **Dos recetas, no una ni cinco.** El diseño usa una porque solo la verificó sobre controles con
   superficie propia. Nebula necesita dos, porque **atenuar un checkbox por superficie no significa
   nada**:

   | Clase                     | Qué hace                                                    | Componentes                                                                                  |
   | ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
   | **Con superficie propia** | Sustituye el fondo por `surface.disabled` y atenúa el texto | `Button`, `ActionIcon`, `Pagination`, `Segment`, `NavLink`, `Tag`, `Chip`, el recipe `field` |
   | **Sin superficie propia** | Atenúa el control completo, sin tocar superficie            | `Checkbox`, `Radio`, `Switch`, `UnstyledButton`                                              |

2. **`NebulaTheme` gana el rol `colors.surface.disabled`.** Es el fill que el diseño usa y que hoy no
   se puede expresar. Los cinco temas oficiales lo definen; el Theme Creator lo expone.

3. **La opacidad del texto deshabilitado se tokeniza.** El 40 % del diseño no existe en el contrato.
   Entra como token de opacidad, **no** se expresa con `text.disabled`: son cosas distintas —un rol de
   color no puede representar «el mismo color al 40 %» sobre superficies que cambian—.

4. **`opacity` deja de usarse como receta de deshabilitado en la primera clase.** Atenuar la caja
   entera arrastra el borde, la sombra y cualquier icono, y es lo que hace que un `Button` deshabilitado
   conserve su fondo primario a plena saturación bajo una capa de 55 %.

5. **El gate de contraste se amplía para cubrirlo.** Hoy exime `disabled` porque WCAG no lo exige, y
   por eso cinco recetas convivieron sin que nadie lo notara. El gate no tiene que exigir 4.5:1 —eso
   sería incorrecto—, pero **sí tiene que verificar que las dos recetas se aplican donde tocan** y que
   el fill sale de `surface.disabled`.

## Alternativas

- **Una sola receta, como el diseño.** Máxima coherencia con Polaris y una sola cosa que mantener.
  Descartada en el checkpoint: aplicar una superficie de deshabilitado a un `Checkbox` o a un `Switch`
  —que no tienen superficie propia— produce una caja gris alrededor de un control que no la tenía.
- **Dejar `opacity` como receta única.** Es la más simple de implementar y la que más componentes ya
  usan. Pero es la que el diseño descarta explícitamente, y produce el defecto medido: fondo primario
  a plena saturación bajo una capa translúcida.
- **Expresar el fill con `surface.sunken`.** Evitaría ampliar el contrato. Medido en julio: el fill
  del diseño **no coincide** con `sunken` en ninguno de los dos esquemas, así que sería aproximar un
  valor que el diseño sí tiene definido.
- **Aplazar a W5.** Evaluada en el checkpoint. Coste: son 14 componentes cuyo estado `disabled`
  cambiará de aspecto después, así que el baseline de ADR-037 se captura contaminado y hay que
  regenerarlo.

## Consecuencias

- **Amplía el contrato**, con todo lo que eso arrastra: los cinco temas oficiales, el schema de Zod de
  `packages/themes`, el Theme Creator y la paridad con `packages/native`, **que todavía no existe** —
  así que native nace ya con este rol en vez de heredarlo a medias.
- **14 componentes cambian de aspecto en su estado `disabled`.** Va al tramo T5 del plan de alineación
  y **manda sobre la fecha de captura del baseline de ADR-037**: capturar antes obliga a regenerar.
- **Cierra una deuda de julio** que la auditoría de WR2 volvió a encontrar por su cuenta, esta vez con
  medida en los cuatro temas. Que dos auditorías independientes lleguen al mismo sitio es la señal de
  que era causa y no síntoma.
- **Lo que este ADR no decide**: qué valor exacto toma `surface.disabled` en cada tema. El diseño da
  dos hex de referencia (`#E6ECF3` / `#1B2540`), pero la calibración final depende del escalón de
  superficie que fije el tramo T2, que a día de hoy sigue sin número (causa C4).
