# Auditoría visual — familia Datos y feedback · 2026-08-17

> **Fase 2 de VA1**, tercera familia. `Tag`, `Badge`, `Indicator`, `Table`.
> Alcance de [la rúbrica](rubrica-auditoria-visual.md) §0: **el color queda fuera**.
> **El fallo §1.1 está aplicado y verificado** (§1.1b). Lo demás no toca código.

## Veredicto

**Un fallo alto, y es uno que `docs/06` ya tenía medido y escrito.** No es un descubrimiento: es que
sigue ahí, se ve a simple vista y nadie lo arregló.

---

## 1. Fallo

### 1.1 · ALTO — Un `Tag` con botón de cierre declara 28 px y renderiza 38

**Qué se ve** — en la lámina de `Tags`, dentro de **cada una de las cuatro filas de variante**, la
píldora «Estática» es **visiblemente más baja** que sus hermanas «Removible», «success» y «Bloqueada».
Mismo componente, misma talla, distinta altura. No hace falta medir para verlo: están una al lado de
la otra.

**Regla** — `docs/06` §4, y la cita es literal:

> **Un hijo interactivo no desborda el peldaño de su padre.** Si un control anida otro, el interior
> sale de un peldaño inferior o el exterior sube. **Medido: un `Tag sm` declara 28 px y renderiza 38**
> porque el `ActionIcon` de su botón de cierre mide 36. La altura declarada que el contenido desborda
> no es una altura, es una intención.

**Medida — sigue exacta**:

| tag         | declarado | renderiza | hijo  | desborde |
| ----------- | --------- | --------- | ----- | -------- |
| «Estática»  | 28 px     | 28 px     | —     | no       |
| «Removible» | 28 px     | **38 px** | 36 px | **+10**  |
| «success»   | 28 px     | **38 px** | 36 px | **+10**  |
| «Bloqueada» | 28 px     | **38 px** | 36 px | **+10**  |

El choque es entre las dos escalas: el `Tag` declara **`compact.md` = 28** y el `ActionIcon` de cierre
resuelve **`control.sm` = 36**. Y el `ActionIcon` **no está mal**: `docs/06` §4 dice «lo interactivo va
en `control`, aunque parezca compacto». Lo que falta es que el padre lo acomode.

**Alcance** — todo `Tag` con cierre, que son **tres de los cuatro** de la lámina por defecto y el caso
normal de un tag en un filtro o un selector múltiple.

**Salida sin tocar color** — el propio doc da las dos: **el interior baja un peldaño** o **el exterior
sube**. Es geometría pura.

### 1.1b · APLICADO — el cierre baja a `xs` en todas las tallas

`Tag/components/Body.tsx` escalaba el botón de cierre con la talla del tag —`xs` para `xs`/`sm`, `sm`
para `md`/`lg`/`xl`—. Pasa a **`xs` siempre**, que es la primera de las dos salidas que el doc nombra.

| tag       | antes     | ahora     |
| --------- | --------- | --------- |
| declarado | 28 px     | 28 px     |
| hijo      | 36 px     | **28 px** |
| renderiza | **38 px** | **30 px** |
| desborde  | **+10**   | **+2**    |

**Los hermanos ya leen a la misma altura** — verificado en la lámina: «Estática» y «Removible» son
ahora la misma píldora. El hijo se queda en 28 px, **por encima del mínimo de 24 px** de WCAG 2.5.8,
así que no hay regresión de accesibilidad. `typecheck` y `lint` en verde.

**Los 2 px que quedan son estructurales y no se pueden cerrar con las escalas de hoy.** Son el borde
del tag —1 px arriba y 1 abajo— alrededor de un hijo de 28. Para llegar a cero haría falta un hijo de
26 o un padre de 30, y **ninguno de los dos existe**: `control` va 20 → 28 y `compact` va 28 → 32. Es
literalmente el caso que `docs/06` §4 anticipa: «si una altura no cabe en ninguna de las dos escalas,
la discusión es **qué peldaño falta**, no qué `rem` escribir». Queda como decisión, no como arreglo
pendiente.

**Por qué ningún gate lo ve** — ninguno mide la altura renderizada contra la declarada. `size-limit`
pesa, axe valida roles, el gate 8 compara contra un baseline que **ya contiene el defecto**.

---

## 2. Observaciones

### 2.1 · En una tabla cebra, el hover cambia de dirección según la fila · `color · fuera de alcance`

Medido en vivo sobre `Collections/Tables`, en `dark`:

| fila   | reposo                    | hover     | dirección       |
| ------ | ------------------------- | --------- | --------------- |
| lisa   | transparente sobre `base` | `#20222c` | **se aclara**   |
| rayada | `#262831` (`sunken`)      | `#20222c` | **se oscurece** |

Sumadas las componentes: `base` 96 → hover 110 (sube), `sunken` 127 → hover 110 (baja). **El mismo
gesto aclara una fila y oscurece la siguiente**, así que el hover deja de leerse como una señal
consistente y pasa a leerse como que las filas se igualan.

La causa es la de siempre: `surface.hover` es un **valor absoluto** y aquí se aplica sobre dos
superficies distintas, así que no puede estar del mismo lado de las dos. Es el mismo argumento
geométrico que la fase 1 dejó escrito en §2.2.

**Marcado `color · fuera de alcance`**: la salida —un velo translúcido que componga sobre lo que haya
debajo— sigue siendo un valor de color. No lleva propuesta.

### 2.2 · Matiz a un hallazgo de la fase 1

La fase 1 dijo que `surface.hover` es idéntico a `surface.raised`, y de ahí que hover sobre una card
no produzca nada. **Medido aquí, la tabla sí responde** — porque se apoya en `base`, no en `raised`.
El hallazgo es correcto pero **condicional al contenedor**: falla cuando el elemento vive dentro de un
`Paper`, no siempre. Queda anotado para que no se cite más ancho de lo que es.

---

## 3. Lo que NO se pudo juzgar

- **`Badge`, `Stat`, `Timeline`, `Alert`, `Toast`, `DataGrid`, `Charts`**: la familia es grande y solo
  entraron `Tag`, `Indicator` y `Table`.
- **`Tag` en las demás tallas.** Se midió la lámina por defecto; si el desborde escala con la talla o
  se corrige en alguna, no se comprobó.
- **El tema claro y los de producto.**
- **`disabled` y `loading`** de esta familia.

---

## 4. Resumen

| Punto                                     | Grado            | Alcance                           |
| ----------------------------------------- | ---------------- | --------------------------------- |
| §1.1 `Tag` con cierre desborda su peldaño | **fallo · alto** | **aplicado**: +10 px → +2 px      |
| §1.1b los 2 px residuales                 | decisión         | falta un peldaño en las escalas   |
| §2.1 hover invierte en tabla cebra        | observación      | `color · fuera de alcance`        |
| §2.2 el hover de la fase 1 es condicional | matiz            | corrige el alcance de §2.2 fase 1 |
