# Auditoría visual — familia Acciones · 2026-08-17

> **Fase 2 de VA1, primera familia.** `Button`, `ActionIcon` y su composición.
> Se abre sobre la base **sin tocar**: las cuatro propuestas de la fase 1 se revirtieron
> ([auditoría del sistema](auditoria-sistema-2026-08-16.md) §Desenlace), así que todo lo de abajo se
> juzga contra el catálogo tal y como está hoy.
>
> **No se ha tocado código ni `apps/playground-web/__snapshots__/`.**

## Método, y por qué este y no láminas

Se sirvió el Storybook estático y se instrumentó con Playwright para hacer dos cosas que una captura
no puede:

1. **Medir la geometría real del DOM** —alto, radio, padding, gap, tamaño de letra— y **nombrar cada
   valor contra la escala del tema**. Así la conclusión es «esto no sale de la escala» y no «esto me
   parece raro».
2. **Recorrer los estados en vivo** —reposo, hover, foco por teclado, press— **con motion ACTIVO**.
   Es el hueco doble que la fase anterior dejó escrito: `wr-closure.md` declara que «`hover`,
   `active`, `focus-visible` y `loading` no se verificaron en ningún control», y el gate 8 corre bajo
   `prefers-reduced-motion`, así que tampoco ve el press.

## Veredicto de la familia

**Geometría impecable, feedback con dos agujeros.**

No hay un solo píxel huérfano: los cinco tamaños de `Button` y los cinco de `ActionIcon` toman **todos**
sus valores de la escala del tema. Pero **dos de las siete variantes no responden al puntero**, y son
las dos que el gate de contraste se salta por construcción.

---

## 1. Geometría — pasa

Medido sobre el DOM, con cada valor nombrado contra el token que le corresponde:

| `Button` | alto            | radio       | padding-inline | fz  | gap           |
| -------- | --------------- | ----------- | -------------- | --- | ------------- |
| `xs`     | 28 `control.xs` | 12 `rad.md` | 12 `space.sm`  | 13  | 2 `space.xxs` |
| `sm`     | 36 `control.sm` | 12 `rad.md` | 16 `space.md`  | 13  | 4 `space.xs`  |
| `md`     | 44 `control.md` | 12 `rad.md` | 22 `space.lg`  | 14  | 4 `space.xs`  |
| `lg`     | 52 `control.lg` | 12 `rad.md` | 28 `space.xl`  | 16  | 12 `space.sm` |
| `xl`     | 60 `control.xl` | 12 `rad.md` | 38 `space.xxl` | 16  | 12 `space.sm` |

`ActionIcon` comparte los cinco altos y el mismo radio, con el icono en 14/18/22/26/30 — una rampa
de +4 exacta. **Los dos hermanos concuerdan en todo lo que comparten**, que es lo que la comparación
entre hermanos existe para comprobar.

Ningún valor cae fuera de la escala. Eje 1 del encargo: **limpio**.

---

## 2. Fallos

### 2.1 · ALTO — `glass` y `gradient` no responden al puntero

**Qué se ve** — recorridos los ocho valores de `variant` en vivo, midiendo el estilo computado antes
y después del hover:

| variante       | hover cambia  | foco visible | press responde      |
| -------------- | ------------- | ------------ | ------------------- |
| `filled`       | sí            | sí · 2px     | sí · `scale(0.981)` |
| `outline`      | sí            | sí · 2px     | sí                  |
| `light`        | sí            | sí · 2px     | sí                  |
| **`glass`**    | **NO**        | sí · 2px     | sí                  |
| `ghost`        | sí            | sí · 2px     | sí                  |
| `glow`         | sí            | sí · 2px     | sí                  |
| **`gradient`** | **NO**        | sí · 2px     | sí                  |
| `unstyled`     | no (correcto) | sí · 2px     | no (correcto)       |

Ni el fondo, ni el borde, ni la sombra cambian. El press sí responde, así que el botón **no está
muerto** — pero hasta que lo pulsas no da ninguna señal de ser accionable.

**Regla** — Nielsen, _visibilidad del estado del sistema_, el primero de los diez. Y `docs/06` §5.1,
que fija el escalón de interacción en ~1.08 «contra la superficie sobre la que se apoya el elemento»:
aquí es **1.00**.

**La causa, y es de una línea** — el hover se implementa **desplazando un peldaño de la escala de
color**. `variantMap.glass` resuelve `background: "surface.overlay"` y `variantMap.gradient` resuelve
`background: "gradient.brand"`: ninguno de los dos es una referencia `scale.*`, así que no hay peldaño
que desplazar y el mecanismo no tiene nada que hacer.

**Por qué ningún gate lo ve** — `tools/contrast-check/src/pairs.ts:105` se salta el par de hover con
la condición `!t.variantMap[variant].background.startsWith("scale.")`. **Las dos variantes sin hover
son exactamente las dos que el gate excluye**, y por el mismo motivo que no lo tienen. La exclusión
era correcta para lo que el gate mide —no puede medir el contraste de un hover que no existe— pero
deja el hueco sin nadie mirándolo.

**Alcance** — catálogo. Alcanza a todo accionable que acepte `variant`, no solo a `Button`.

**Refutación intentada** — ¿será que el cristal cambia por `backdrop-filter` y no por fondo? No: se
midieron `backgroundColor`, `borderColor` y `boxShadow`, y los tres son idénticos antes y después.
¿Y que el efecto sea demasiado sutil para el umbral? Tampoco: la comparación es de cadena exacta, no
de tolerancia. Los valores son **los mismos**.

**Convergencia con la fase 1** — son **las dos mismas variantes** que §2.5 de la auditoría del sistema
señaló por ignorar la prop `color`. La causa raíz es la misma: su fondo no sale de la escala, así que
ni el color ni el hover les llegan. Un solo defecto con dos síntomas.

---

## 3. Observaciones

No son fallos. Ninguna tiene una regla que las respalde.

- **El radio es constante en las cinco tallas** (`radius.md` = 12) mientras el alto va de 28 a 60. En
  `xs` eso es el 43 % del alto y en `xl` el 20 %, así que la redondez _percibida_ no es la misma a lo
  largo de la escala. **`ActionIcon` hace exactamente lo mismo**, de modo que los hermanos son
  coherentes entre sí y ninguna regla de `docs/` pide que el radio escale con el control. Se anota
  porque es una decisión que nadie ha escrito, no porque esté mal.

- **Cinco tallas, tres tamaños de letra**: 13 · 13 · 14 · 16 · 16. `xs` y `sm` comparten 13, `lg` y
  `xl` comparten 16. Y solo `md` usa el token `button` (14): `xs`/`sm` usan `body3` y **`lg`/`xl` usan
  `body1`, que `docs/06` §2.1 define como «cuerpo por defecto, formularios y **lectura**»**, no como
  label de control. Es la única elección de la familia que contradice un doc.

- **El gap salta ×3 entre `md` y `lg`** — de 4 px a 12. No es un número suelto: los dos están en la
  escala, y el salto existe **porque en la escala no hay peldaño de 8 px** (auditoría §3). Es la
  primera vez que ese hueco del sistema se ve dentro de un componente.

---

## 4. Lo que NO se pudo juzgar

- **`loading`**, que `wr-closure.md` también declara sin verificar. La historia `States` no lo aisla y
  no se forzó.
- **Responsive.** Se midió a 1280. Faltan 360 y 768, que es donde el encargo pone el foco.
- **El tema claro y los 9 de producto.** Todo lo de arriba es `dark`.
- **Las otras siete familias.** Esta es una de ocho.
- **`ContextMenu`, `Menu` y `Segment`**, que el inventario reparte en Overlays y Navigation aunque
  sean accionables.

---

## 5. Cómo seguir

El instrumento está construido y es reutilizable tal cual: sirve el Storybook estático, mide la
geometría contra la escala y recorre los estados en vivo. Aplicarlo a las siete familias restantes es
mecánico.

Lo que **no** conviene automatizar es el paso que produjo los dos hallazgos de §2.1: **mirar**. La
tabla de geometría salió limpia y no habría encontrado nada; el defecto apareció al recorrer los
estados uno por uno y comparar hermanos.
